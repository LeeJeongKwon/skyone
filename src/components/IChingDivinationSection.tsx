import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Sparkles, 
  RotateCcw, 
  BookmarkPlus, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Wand2, 
  Loader2, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  Share2,
  Info
} from 'lucide-react';
import { IChingResult, AppSettings } from '../types';
import { 
  tossIChing, 
  tossSingleLineCoins, 
  CoinTossStep 
} from '../utils/ichingTarotEngine';
import { 
  ICHING_64_DATABASE, 
  EIGHT_TRIGRAMS, 
  HexagramData 
} from '../utils/iching64Database';
import { 
  playCoinClinkSound, 
  getYaoDetail, 
  getExtendedFortunes 
} from '../utils/ichingYaoData';
import { SangpyeongCoin } from './SangpyeongCoin';
import { IChingEncyclopediaModal } from './IChingEncyclopediaModal';
import { saveHistoryItem } from '../utils/storage';
import { requestAiAnalysis } from '../services/aiService';

interface IChingDivinationSectionProps {
  settings: AppSettings;
  onSaveToHistory?: (result: IChingResult) => void;
}

const QUESTION_SUGGESTIONS = [
  '💼 올해 이직 및 신규 사업 추진의 길흉',
  '💰 부동산 매매 및 주식 투자 운세',
  '❤️ 짝사랑·연인과의 인연 및 혼인 향방',
  '🎓 이번 국가고시·자격증 시험 합격운',
  '⚖️ 거래처와의 계약 분쟁 및 소송 결과',
  '🏡 가족의 건강 및 주거지 이사 시기',
];

export const IChingDivinationSection: React.FC<IChingDivinationSectionProps> = ({
  settings,
}) => {
  const isDark = settings.theme === 'dark';

  // Question & Configuration
  const [question, setQuestion] = useState('');
  const [tossMode, setTossMode] = useState<'step' | 'quick'>('step');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Divination State
  const [tossSteps, setTossSteps] = useState<CoinTossStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 to 6
  const [isTossingLine, setIsTossingLine] = useState(false);
  const [recentCoins, setRecentCoins] = useState<[boolean, boolean, boolean]>([true, true, false]);
  const [iChingResult, setIChingResult] = useState<IChingResult | null>(() => tossIChing());

  // Modals & Inspectors
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [selectedInspectLine, setSelectedInspectLine] = useState<number | null>(null);
  const [isAllYaoExpanded, setIsAllYaoExpanded] = useState(false);

  // AI Consultation State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Save State
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Play sound helper
  const triggerSound = () => {
    if (soundEnabled) {
      playCoinClinkSound();
    }
  };

  // Reset toss session
  const handleResetSession = () => {
    setTossSteps([]);
    setCurrentStepIndex(0);
    setIsTossingLine(false);
    setSelectedInspectLine(null);
    setAiAnalysis(null);
    setSavedSuccess(false);
  };

  // 1. Step-by-step Tossing
  const handleTossSingleLine = () => {
    if (isTossingLine || currentStepIndex >= 6) return;

    setIsTossingLine(true);
    triggerSound();

    setTimeout(() => {
      const nextStepNum = currentStepIndex + 1;
      const stepResult = tossSingleLineCoins(nextStepNum);
      const updatedSteps = [...tossSteps, stepResult];

      setRecentCoins(stepResult.coinValues);
      setTossSteps(updatedSteps);
      setCurrentStepIndex(nextStepNum);
      setIsTossingLine(false);

      // If finished all 6 lines, resolve full hexagram
      if (nextStepNum === 6) {
        const fullResult = tossIChing(question, updatedSteps);
        setIChingResult(fullResult);
        triggerSound();
      }
    }, 600);
  };

  // 2. Quick One-Click Tossing
  const handleQuickToss = () => {
    setIsTossingLine(true);
    triggerSound();

    setTimeout(() => {
      const allSteps = Array.from({ length: 6 }, (_, i) => tossSingleLineCoins(i + 1));
      setTossSteps(allSteps);
      setCurrentStepIndex(6);
      setRecentCoins(allSteps[5].coinValues);
      const fullResult = tossIChing(question, allSteps);
      setIChingResult(fullResult);
      setIsTossingLine(false);
      triggerSound();
    }, 650);
  };

  // Load hexagram from encyclopedia
  const handleLoadFromEncyclopedia = (hex: HexagramData) => {
    const upperTrigram = EIGHT_TRIGRAMS[hex.upperKey];
    const lowerTrigram = EIGHT_TRIGRAMS[hex.lowerKey];
    const lines = [...lowerTrigram.lines, ...upperTrigram.lines];

    const manualSteps: CoinTossStep[] = lines.map((lineType, idx) => ({
      step: idx + 1,
      coinValues: lineType === 'yang' ? [true, true, false] : [false, false, true],
      sum: lineType === 'yang' ? 7 : 8,
      lineType,
      isMoving: false,
      name: ['초효', '이효', '삼효', '사효', '오효', '상효'][idx],
    }));

    setTossSteps(manualSteps);
    setCurrentStepIndex(6);
    const loadedResult = tossIChing(question || '주역 64괘 보감 열람 점괘', manualSteps);
    setIChingResult(loadedResult);
    setSelectedInspectLine(null);
    setAiAnalysis(null);
  };

  // Save to history storage
  const handleSaveResult = () => {
    if (!iChingResult) return;
    saveHistoryItem({
      type: 'iching',
      title: `주역 64괘 [${iChingResult.nameKr}] 척점`,
      summary: `${iChingResult.judgment} (길흉: ${iChingResult.grade})`,
      data: iChingResult,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // AI Consultation
  const handleRequestAiConsultation = async () => {
    if (!iChingResult) return;

    setIsAiLoading(true);
    try {
      const prompt = `[천명원 주역(周易) 64괘 척점(擲占) 심층 역학 문답]
의뢰인의 고민 / 질문: "${question.trim() || '현재 내 삶과 사업의 중대한 운명적 흐름'}"

도출된 괘상 정보:
- 본괘(本卦): 제${iChingResult.hexagramNumber}괘 ${iChingResult.nameKr} (${iChingResult.nameHanja})
- 상괘(외괘): ${iChingResult.upperTrigram} · 하괘(내괘): ${iChingResult.lowerTrigram}
- 괘사(卦辭): ${iChingResult.judgment}
- 상전(象傳): ${iChingResult.imageAdvice}
- 동효(動爻) 상황: ${iChingResult.movingLineSummary || '정괘'}
${iChingResult.transformedHexagram ? `- 지괘(之卦): 제${iChingResult.transformedHexagram.num}괘 ${iChingResult.transformedHexagram.nameKr} (${iChingResult.transformedHexagram.summary})` : ''}

위 점괘에 대하여 동양 정통 주역(문왕 괘사, 주공 효사, 십익 계사전)의 원리에 따라 의뢰인의 구체적 질문에 명쾌하고 깊이 있는 조언을 작성해 주세요:
1. 하늘이 이 괘를 내린 핵심 이유 (현재 상황의 본질 통찰)
2. 동효(변효)가 지목하는 가장 위험하거나 결정적인 행동 포인트
3. 미래의 귀결 (지괘로의 변화와 결과 예측)
4. 천명원 실천 처세 훈령: (지금 즉시 해야 할 행동 3가지와 피해야 할 금기)`;

      const result = await requestAiAnalysis(
        '천명원 주역 64괘 심층 역학 문답',
        prompt,
        settings
      );
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
      setAiAnalysis('주역 AI 상담 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Moving lines list
  const movingLines = iChingResult?.lineDetails?.filter(l => l.isMoving) || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Mind Concentration Bar */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/95 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">☯️</span>
              <h3 className={`text-base sm:text-xl font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                천명원 주역(周易) 64괘 척점(擲占) 제단
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              조선 상평통보 3닢을 6회 던져 천지의 음양 동정(動靜)과 미래 변화를 읽는 3,000년 정통 점괘
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
                soundEnabled
                  ? isDark ? 'bg-amber-950/60 border-amber-800 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
                  : isDark ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-stone-100 border-stone-300 text-stone-400'
              }`}
              title={soundEnabled ? '동전 소리 끄기' : '동전 소리 켜기'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? '소리 ON' : '무음'}</span>
            </button>

            <button
              onClick={() => setIsEncyclopediaOpen(true)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isDark 
                  ? 'border-amber-800/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/40' 
                  : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>주역 64괘 보감(寶鑑)</span>
            </button>
          </div>
        </div>

        {/* Question Formulation Input */}
        <div className="space-y-2">
          <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
            하늘과 대자연에 묻고자 하는 일 (심중 문답):
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="예: 이번 상반기 이직 제안을 수락해야 할까요? 올해 신규 매장 창업운은 어떠한가요?"
              className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400'
              }`}
            />
            {question && (
              <button
                onClick={() => setQuestion('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Question Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-stone-400 shrink-0">추천 문답:</span>
            {QUESTION_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(item.slice(2).trim())}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                  isDark 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Coin Tossing Arena (3닢 척점 제단) */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              척점 방식 선택
            </span>
            <div className={`flex rounded-lg p-0.5 border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-100 border-stone-300'}`}>
              <button
                onClick={() => setTossMode('step')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  tossMode === 'step'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                단계별 직접 척점 (6회 던지기)
              </button>
              <button
                onClick={() => setTossMode('quick')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  tossMode === 'quick'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                일괄 쾌속 척점 (단번에 6효 완성)
              </button>
            </div>
          </div>

          <button
            onClick={handleResetSession}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark 
                ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>척점 초기화</span>
          </button>
        </div>

        {/* The Table Surface & 3 Coins Display */}
        <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col items-center justify-center space-y-6 relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-b from-stone-950 via-slate-950 to-stone-900 border-amber-950/60 shadow-inner' 
            : 'bg-gradient-to-b from-stone-100 via-amber-50/40 to-stone-200 border-stone-300 shadow-inner'
        }`}>
          {/* Subtle oriental altar watermarking */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl font-serif-kr">
            易
          </div>

          {/* 3 Coins Tumbling */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
            <SangpyeongCoin 
              isHead={recentCoins[0]} 
              isFlipping={isTossingLine} 
              size="md" 
              delayMs={0} 
            />
            <SangpyeongCoin 
              isHead={recentCoins[1]} 
              isFlipping={isTossingLine} 
              size="md" 
              delayMs={50} 
            />
            <SangpyeongCoin 
              isHead={recentCoins[2]} 
              isFlipping={isTossingLine} 
              size="md" 
              delayMs={100} 
            />
          </div>

          {/* Throwing Feedback & Step Details */}
          <div className="text-center space-y-1">
            {currentStepIndex > 0 ? (
              <div className="animate-in fade-in duration-200">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {currentStepIndex}회차 결과:
                </span>
                <p className="text-sm font-bold font-serif-kr mt-0.5">
                  앞면 {recentCoins.filter(c => c).length}닢(양 3) + 뒷면 {recentCoins.filter(c => !c).length}닢(음 2) = {
                    (recentCoins[0] ? 3 : 2) + (recentCoins[1] ? 3 : 2) + (recentCoins[2] ? 3 : 2)
                  }점
                  <span className="ml-2 px-2 py-0.5 text-xs rounded border bg-amber-500/10 border-amber-500/30 text-amber-500 font-mono">
                    {(() => {
                      const sum = (recentCoins[0] ? 3 : 2) + (recentCoins[1] ? 3 : 2) + (recentCoins[2] ? 3 : 2);
                      if (sum === 6) return '노음(老陰 · 動爻 ❌)';
                      if (sum === 7) return '소양(少陽 · 靜爻 —)';
                      if (sum === 8) return '소음(少陰 · 靜爻 - -)';
                      return '노양(老陽 · 動爻 ⭕)';
                    })()}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-500 dark:text-slate-400">
                마음을 고요히 정돈하고 고민을 떠올린 후 동전을 던지십시오.
              </p>
            )}

            {/* Step Indicators (1 to 6) */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {[
                { step: 1, name: '초효' },
                { step: 2, name: '이효' },
                { step: 3, name: '삼효' },
                { step: 4, name: '사효' },
                { step: 5, name: '오효' },
                { step: 6, name: '상효' },
              ].map(({ step, name }) => {
                const stepData = tossSteps[step - 1];
                const isCurrent = currentStepIndex === step - 1;
                const isDone = currentStepIndex >= step;

                return (
                  <div
                    key={step}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all border ${
                      isDone
                        ? stepData?.isMoving
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs'
                          : 'bg-stone-800 text-stone-200 border-stone-600'
                        : isCurrent
                          ? 'border-amber-500 text-amber-500 animate-pulse'
                          : 'opacity-40 border-transparent text-stone-500'
                    }`}
                  >
                    <span>{name}</span>
                    {stepData && (
                      <span className="ml-1 text-[10px] font-mono">
                        {stepData.sum === 6 ? '6❌' : stepData.sum === 7 ? '7—' : stepData.sum === 8 ? '8⚋' : '9⭕'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {tossMode === 'step' ? (
              <button
                onClick={handleTossSingleLine}
                disabled={isTossingLine || currentStepIndex >= 6}
                className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Coins className={`w-4 h-4 ${isTossingLine ? 'animate-spin' : ''}`} />
                <span>
                  {currentStepIndex >= 6 
                    ? '6효 완성됨 (아래 점괘 확인)' 
                    : `동전 3닢 던지기 (제${currentStepIndex + 1}효)`}
                </span>
              </button>
            ) : (
              <button
                onClick={handleQuickToss}
                disabled={isTossingLine}
                className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isTossingLine ? 'animate-spin' : ''}`} />
                <span>산통 흔들기 (일괄 쾌속 척점)</span>
              </button>
            )}

            {currentStepIndex === 6 && (
              <button
                onClick={handleResetSession}
                className="py-3 px-4 rounded-xl text-xs font-bold border border-stone-300 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
              >
                다시 던지기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Hexagram Dossier & Altar Results */}
      {iChingResult && (
        <div className={`p-6 sm:p-7 rounded-2xl border shadow-xl space-y-6 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200'
        }`}>
          {/* Hexagram Top Info & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
            <div className="space-y-1">
              {iChingResult.question && (
                <span className="text-xs text-stone-400 block">
                  질문: <strong>"{iChingResult.question}"</strong>
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-serif-kr font-bold text-amber-600 dark:text-amber-400">
                  제{iChingResult.hexagramNumber}괘
                </span>
                <div>
                  <h4 className={`text-xl sm:text-2xl font-bold font-serif-kr flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-stone-900'
                  }`}>
                    <span>{iChingResult.nameKr}</span>
                    <span className="text-base text-amber-600 dark:text-amber-400">({iChingResult.nameHanja})</span>
                  </h4>
                  <div className="text-xs text-stone-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>상괘: {iChingResult.upperTrigram} ({iChingResult.upperSymbol})</span>
                    <span>·</span>
                    <span>하괘: {iChingResult.lowerTrigram} ({iChingResult.lowerSymbol})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSaveResult}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-stone-100 border-stone-300 text-stone-700'
                }`}
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
                <span>{savedSuccess ? '저장 완료' : '점괘 보관'}</span>
              </button>

              <div className="text-right pl-2">
                <span className="block text-[11px] text-stone-400">종합 길흉</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {iChingResult.grade} · {iChingResult.overallScore}점
                </span>
              </div>
            </div>
          </div>

          {/* Hexagram Sacred Altar (본괘 & 지괘 대조) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Left: Original Hexagram (본괘) */}
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-between text-center relative ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="w-full flex items-center justify-between text-xs mb-3">
                <span className="font-bold font-serif-kr text-amber-600 dark:text-amber-400">
                  【본괘(本卦)】 현재의 형세
                </span>
                <span className="text-[11px] text-stone-400">
                  (클릭하여 각 효사 상세 열람)
                </span>
              </div>

              {/* 6 Lines Display */}
              <div className="space-y-2.5 w-60 py-2">
                {iChingResult.lines.slice().reverse().map((line, reverseIdx) => {
                  const originalPos = 6 - reverseIdx; // 6 down to 1
                  const detail = iChingResult.lineDetails?.find(d => d.position === originalPos);
                  const isMoving = detail?.isMoving;
                  const isSelected = selectedInspectLine === originalPos;

                  return (
                    <button
                      key={originalPos}
                      onClick={() => setSelectedInspectLine(isSelected ? null : originalPos)}
                      className={`w-full group flex items-center justify-between gap-2 p-1 rounded-lg transition-all border ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : isMoving
                            ? 'border-amber-500/60 bg-amber-950/20'
                            : 'border-transparent hover:bg-stone-200/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-stone-400 w-10 text-left">
                        {originalPos}효 {isMoving ? '⭕' : ''}
                      </span>

                      {/* Trigram Bar */}
                      <div className="flex-1 flex items-center justify-between h-4">
                        {line === 'yang' ? (
                          <div className={`w-full h-3.5 rounded-sm shadow-xs transition-colors ${
                            isMoving 
                              ? 'bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse' 
                              : 'bg-gradient-to-r from-amber-600 to-amber-700'
                          }`} />
                        ) : (
                          <div className="w-full flex items-center justify-between h-3.5">
                            <div className={`w-[45%] h-full rounded-sm ${
                              isMoving ? 'bg-amber-600/80 animate-pulse' : 'bg-slate-700 dark:bg-slate-600'
                            }`} />
                            <div className="w-[10%] h-full" />
                            <div className={`w-[45%] h-full rounded-sm ${
                              isMoving ? 'bg-amber-600/80 animate-pulse' : 'bg-slate-700 dark:bg-slate-600'
                            }`} />
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-stone-400 w-10 text-right">
                        {detail ? `${detail.value}점` : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-stone-400 mt-2">
                초효(바닥)부터 상효(꼭대기)까지 축조된 주역 대제단
              </span>
            </div>

            {/* Right: Transformed Hexagram (지괘 / 변괘) or Static Status */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-3 border-b pb-2">
                  <span className="font-bold font-serif-kr text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span>【지괘(之卦)】 미래의 귀결</span>
                    {iChingResult.transformedHexagram && (
                      <span className="text-[11px] font-normal text-stone-400">(변효로 인한 변환)</span>
                    )}
                  </span>
                </div>

                {iChingResult.transformedHexagram ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-xs text-stone-400">
                          제{iChingResult.transformedHexagram.num}괘
                        </span>
                        <h5 className="text-lg font-bold font-serif-kr text-stone-900 dark:text-white">
                          {iChingResult.transformedHexagram.nameKr} ({iChingResult.transformedHexagram.nameHanja})
                        </h5>
                        <p className="text-xs text-stone-500 dark:text-slate-400">
                          상괘: {iChingResult.transformedHexagram.upperTrigram} · 하괘: {iChingResult.transformedHexagram.lowerTrigram}
                        </p>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-stone-200 text-stone-800'
                    }`}>
                      <strong className="block text-amber-600 dark:text-amber-400 mb-1 font-serif-kr">
                        변화의 계시와 판정:
                      </strong>
                      <p>{iChingResult.transformedHexagram.summary}</p>
                    </div>

                    <div className="text-xs text-stone-500 dark:text-slate-400 p-2.5 rounded-lg border border-dashed border-amber-500/30">
                      💡 {iChingResult.movingLineSummary}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-4 text-center">
                    <div className="text-2xl">🌱</div>
                    <h5 className="text-sm font-bold font-serif-kr">
                      동효가 없는 순정 정괘(靜卦)입니다
                    </h5>
                    <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      모든 효가 안정되어 있어 외부의 급변보다 현재 본괘가 가리키는 교훈과 원칙을 흔들림 없이 수호하는 것이 가장 길합니다.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Active Moving Lines Indicator */}
              {movingLines.length > 0 && (
                <div className="pt-3 border-t border-stone-200 dark:border-slate-800 text-xs">
                  <span className="text-stone-400">핵심 동효(動爻): </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {movingLines.map(m => m.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Line Inspector Box (When a line is clicked) */}
          {selectedInspectLine && (() => {
            const detail = iChingResult.lineDetails?.find(d => d.position === selectedInspectLine);
            if (!detail) return null;

            return (
              <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                detail.isMoving 
                  ? 'bg-amber-950/20 border-amber-500/50' 
                  : isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold font-serif-kr text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <span>제{selectedInspectLine}효 ({detail.name}) 정밀 효사</span>
                    {detail.isMoving && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold">
                        변효(動爻)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => setSelectedInspectLine(null)}
                    className="text-stone-400 hover:text-stone-200 text-xs"
                  >
                    닫기 ✕
                  </button>
                </div>
                <p className="text-xs font-serif-kr leading-relaxed text-stone-800 dark:text-stone-200">
                  {detail.yaoText}
                </p>
                {detail.yaoAdvice && (
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-2">
                    💡 <strong>실천 지침:</strong> {detail.yaoAdvice}
                  </p>
                )}
              </div>
            );
          })()}

          {/* Core Judgment & Image Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className={`p-4 sm:p-5 rounded-2xl border font-serif-kr leading-relaxed ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-amber-100/90' : 'bg-amber-50/60 border-amber-200 text-amber-950'
            }`}>
              <strong className="text-amber-600 dark:text-amber-400 block mb-1 text-sm sm:text-base font-bold">
                괘사(卦辭) - 문왕의 원문 판정:
              </strong>
              {iChingResult.judgment}
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border leading-relaxed ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              <strong className="text-amber-600 dark:text-amber-400 block mb-1 text-sm sm:text-base font-bold font-serif-kr">
                상전(象傳) - 대자연의 비유:
              </strong>
              {iChingResult.imageAdvice}
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                처세 훈령: {iChingResult.actionGuidance}
              </div>
            </div>
          </div>

          {/* 4. 8 Extended Domain Fortunes */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">
              8대 핵심 운세 영역별 정밀 풀이
            </h4>
            {(() => {
              const ext = iChingResult.extendedFortunes;
              const aspects = iChingResult.fortuneAspects;
              const cards = [
                { label: '사업 및 직무운', icon: '💼', text: aspects?.career || '순조로운 진행이 예상됩니다.' },
                { label: '재물 및 투자운', icon: '💰', text: aspects?.wealth || '자금 회전이 양호합니다.' },
                { label: '애정 및 인연운', icon: '❤️', text: aspects?.love || '화합과 교감이 깊어집니다.' },
                { label: '건강 및 체력', icon: '🩺', text: aspects?.health || '심신의 안정을 유지하세요.' },
                { label: '시험·승진·관운', icon: '🎓', text: ext?.exam || '목표에 대한 집중력이 필요한 때입니다.' },
                { label: '소송·시비·구설', icon: '⚖️', text: ext?.litigation || '예의와 원칙을 지키면 무탈합니다.' },
                { label: '이동·이사·매매', icon: '🏡', text: ext?.movement || '신중하게 현장을 답사하세요.' },
                { label: '소원성취 최적기', icon: '⏳', text: ext?.wishTiming || '순리에 맡기면 때가 옵니다.' },
              ];

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {cards.map((c, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-1.5 transition-all hover:scale-[1.01] ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.icon}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {c.label}
                        </span>
                      </div>
                      <p className="leading-relaxed opacity-90 line-clamp-3">
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* 5. 6-Line Yao-ci Inspector Accordion */}
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-stone-200 bg-stone-50/50'
          }`}>
            <button
              onClick={() => setIsAllYaoExpanded(!isAllYaoExpanded)}
              className="w-full p-4 flex items-center justify-between text-xs font-bold font-serif-kr text-left hover:bg-stone-200/40 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                <span>주공 6효 효사(周公 爻辭) 전체 백과 열람</span>
                <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">
                  (초효 ~ 상효 6효 총망라)
                </span>
              </span>
              {isAllYaoExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isAllYaoExpanded && (
              <div className="p-4 pt-0 space-y-2.5 text-xs border-t border-stone-200 dark:border-slate-800 mt-1">
                {iChingResult.lineDetails?.map(detail => (
                  <div
                    key={detail.position}
                    className={`p-3 rounded-xl border ${
                      detail.isMoving
                        ? 'bg-amber-950/30 border-amber-500/50'
                        : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-serif-kr text-amber-600 dark:text-amber-400">
                        {detail.name} {detail.isMoving ? '· 동효(動爻 ⭕)' : ''}
                      </span>
                      <span className="text-[10px] font-mono opacity-60">
                        {detail.stateName || `${detail.value}점`}
                      </span>
                    </div>
                    <p className="font-serif-kr leading-relaxed opacity-90">{detail.yaoText}</p>
                    {detail.yaoAdvice && (
                      <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-1">
                        💡 {detail.yaoAdvice}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. AI Master Consultation (Gemini 1:1 주역 심층문답) */}
          <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
            isDark 
              ? 'bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-900 border-amber-800/40' 
              : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border-amber-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold font-serif-kr flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-500" />
                  <span>천명원 AI 정통 주역 심층문답 (1:1 맞춤 감정)</span>
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  본괘, 동효, 지괘와 의뢰인의 구체적 질문을 결합하여 명쾌한 처세 비책을 내립니다.
                </p>
              </div>

              <button
                onClick={handleRequestAiConsultation}
                disabled={isAiLoading}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>주역 괘상 해석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI 심층문답 요청</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysis && (
              <div className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm leading-relaxed font-serif-kr whitespace-pre-wrap animate-in fade-in duration-200 ${
                isDark ? 'bg-slate-950/90 border-slate-800 text-stone-200' : 'bg-white border-stone-200 text-stone-800'
              }`}>
                {aiAnalysis}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 64 Hexagram Encyclopedia Modal */}
      <IChingEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
        isDark={isDark}
        onSelectHexagram={handleLoadFromEncyclopedia}
      />
    </div>
  );
};
