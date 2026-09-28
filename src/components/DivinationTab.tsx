import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Search, 
  BookmarkPlus, 
  Check, 
  Coins, 
  Maximize2, 
  X, 
  RotateCw,
  Eye,
  Info,
  Moon,
  Wand2,
  Loader2,
  BookOpen,
  Filter,
  ArrowRight
} from 'lucide-react';
import { IChingResult, TarotSpreadResult, AppSettings, TarotCard } from '../types';
import { tossIChing, drawTarotSpread, MajorTarotCardData } from '../utils/ichingTarotEngine';
import { 
  searchDreamDictionary, 
  COMPREHENSIVE_DREAM_DICTIONARY, 
  DreamEntry, 
  DreamCategory, 
  DreamGrade 
} from '../utils/dreamDictionary';
import { saveHistoryItem } from '../utils/storage';
import { requestAiAnalysis } from '../services/aiService';

import { IChingDivinationSection } from './IChingDivinationSection';

interface DivinationTabProps {
  settings: AppSettings;
}

const POPULAR_DREAM_KEYWORDS = [
  '황금돼지', '용 승천', '구렁이 뱀', '똥 밟음', '대화재 불길', '맑은 물',
  '조상님', '이빨 빠짐', '호랑이', '돈다발', '피 흘림', '임신 출산',
  '하늘 날기', '황금 열쇠', '대통령'
];

export const DivinationTab: React.FC<DivinationTabProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  const [subTab, setSubTab] = useState<'iching' | 'tarot' | 'dream'>('iching');
  const [ichingKey, setIChingKey] = useState(0);

  // Tarot State
  const [tarotQuestion, setTarotQuestion] = useState('');
  const [tarotResult, setTarotResult] = useState<TarotSpreadResult | null>(() => drawTarotSpread(''));
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCardForModal, setSelectedCardForModal] = useState<MajorTarotCardData | TarotCard | null>(null);

  // Dream State
  const [dreamQuery, setDreamQuery] = useState('');
  const [selectedDreamCategory, setSelectedDreamCategory] = useState<string>('all');
  const [selectedDreamGrade, setSelectedDreamGrade] = useState<string>('all');
  const [selectedDreamForModal, setSelectedDreamForModal] = useState<DreamEntry | null>(null);
  const [isAiDreamLoading, setIsAiDreamLoading] = useState(false);
  const [aiDreamAnalysis, setAiDreamAnalysis] = useState<string | null>(null);
  const [dreamSavedSuccess, setDreamSavedSuccess] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Reset handler for the active subtab
  const handleResetCurrentSubTab = () => {
    if (subTab === 'iching') {
      setIChingKey(prev => prev + 1);
    } else if (subTab === 'tarot') {
      setTarotQuestion('');
      setTarotResult(null);
      setSelectedCardForModal(null);
    } else if (subTab === 'dream') {
      setDreamQuery('');
      setSelectedDreamCategory('all');
      setSelectedDreamGrade('all');
      setAiDreamAnalysis(null);
      setSelectedDreamForModal(null);
    }
  };

  const handleDrawTarot = (e: React.FormEvent) => {
    e.preventDefault();
    setIsShuffling(true);
    setTimeout(() => {
      setTarotResult(drawTarotSpread(tarotQuestion));
      setIsShuffling(false);
      setSavedSuccess(false);
    }, 450);
  };

  // Smart Dream Search with normalization and category filtering
  const filteredDreams = useMemo(() => {
    return searchDreamDictionary(dreamQuery, selectedDreamCategory, selectedDreamGrade);
  }, [dreamQuery, selectedDreamCategory, selectedDreamGrade]);

  // AI-Powered Deep Dream Reading
  const handleAiDreamAnalysis = async (customQuery?: string) => {
    const queryToUse = (customQuery || dreamQuery).trim();
    if (!queryToUse) {
      alert('해몽하실 꿈 내용을 입력해 주세요.');
      return;
    }

    setIsAiDreamLoading(true);
    try {
      const prompt = `[천명원 동양 전통 비전 길흉 꿈해몽(夢解夢) 정밀 분석]
의뢰인이 꾼 꿈: "${queryToUse}"

위 꿈에 대해 동양 전통 해몽학(주공해몽서 周公解夢, 동의보감 심신해몽, 음양오행)에 근거하여 심층 풀이를 제공해 주세요.
반드시 아래 형식에 맞추어 전문적이고 신뢰감 넘치는 한국어로 답변해 주세요:
1. 꿈의 길흉 판정: [최상길몽 / 대길몽 / 길몽 / 태몽 / 주의몽 / 흉몽 / 심리몽 중 1개 선택]
2. 핵심 상징과 무의식 암시: 꿈속에 등장한 주요 사물이나 행동이 상징하는 오행(목화토금수)과 영적 의미
3. 분야별 운세 영향:
   - 재물·사업운:
   - 시험·승진·관운:
   - 애정·인연·가정운:
   - 건강·신변 안전:
4. 천명원 비전 개운 행동 처방: (복권 구매 추천 여부, 길한 방향, 피해야 할 행동 및 대인관계 조언)`;

      const result = await requestAiAnalysis(
        '천명원 정통 길흉 꿈해몽 심층 분석',
        prompt,
        settings
      );
      setAiDreamAnalysis(result);
    } catch (e) {
      console.error(e);
      setAiDreamAnalysis('꿈해몽 분석 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsAiDreamLoading(false);
    }
  };


  const handleSaveTarot = () => {
    if (!tarotResult) return;
    saveHistoryItem({
      type: 'tarot',
      title: `신비 타로 3-카드 리딩: ${tarotResult.question}`,
      summary: `과거 [${tarotResult.past.nameKr}] -> 현재 [${tarotResult.present.nameKr}] -> 미래 [${tarotResult.future.nameKr}]`,
      data: tarotResult,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveDream = (item: DreamEntry) => {
    saveHistoryItem({
      type: 'dream',
      title: `꿈해몽: ${item.keyword} [${item.type}]`,
      summary: `${item.summary} - ${item.actionTip}`,
      data: item,
    });
    setDreamSavedSuccess(true);
    setTimeout(() => setDreamSavedSuccess(false), 3000);
  };

  const handleSaveAiDream = () => {
    if (!aiDreamAnalysis) return;
    saveHistoryItem({
      type: 'dream',
      title: `AI 심층 꿈해몽: ${dreamQuery.slice(0, 25)}...`,
      summary: aiDreamAnalysis.slice(0, 100) + '...',
      data: { query: dreamQuery, analysis: aiDreamAnalysis },
    });
    setDreamSavedSuccess(true);
    setTimeout(() => setDreamSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs & Reset Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 transition-colors ${
        isDark ? 'border-slate-800' : 'border-stone-200'
      }`}>
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('iching')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'iching'
                ? 'bg-amber-600 text-white shadow-md'
                : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            ☯️ 주역 64괘 (산통/동전)
          </button>
          <button
            onClick={() => setSubTab('tarot')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'tarot'
                ? 'bg-amber-600 text-white shadow-md'
                : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            🃏 신비의 타로 (3-카드시점)
          </button>
          <button
            onClick={() => setSubTab('dream')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'dream'
                ? 'bg-amber-600 text-white shadow-md'
                : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            🌙 길흉 꿈해몽(夢解夢) 사전
          </button>
        </div>

        {/* Global SubTab Reset Button */}
        <button
          onClick={handleResetCurrentSubTab}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isDark 
              ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
              : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
          }`}
          title="현재 탭의 내용과 결과를 초기화합니다."
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>초기화</span>
        </button>
      </div>

      {/* 1. I-CHING TAB */}
      {subTab === 'iching' && (
        <IChingDivinationSection key={ichingKey} settings={settings} />
      )}

      {/* 2. TAROT TAB */}
      {subTab === 'tarot' && (
        <div className="space-y-6">
          <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
          }`}>
            <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
              신비의 타로 3-카드 시점(Past - Present - Future)
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              마음속 깊은 고민이나 질문을 집중하여 떠올린 뒤 카드를 셔플하세요.
            </p>

            <form onSubmit={handleDrawTarot} className="flex gap-2">
              <input
                type="text"
                value={tarotQuestion}
                onChange={e => setTarotQuestion(e.target.value)}
                placeholder="질문을 입력하세요 (예: 이번 사업 계약의 향방은? 올해 이직 운세는?)"
                className={`flex-1 border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                }`}
              />
              <button
                type="submit"
                disabled={isShuffling}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>카드 셔플 및 리딩</span>
              </button>
            </form>
          </div>

          {tarotResult && (
            <div className={`p-6 rounded-2xl border shadow-xl space-y-6 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-3">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  질문: <strong>"{tarotResult.question || '당신의 운명적 흐름'}"</strong>
                </span>
                <button
                  onClick={handleSaveTarot}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-stone-100 border-stone-300 text-stone-700'
                  }`}
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{savedSuccess ? '저장됨' : '보관'}</span>
                </button>
              </div>

              {/* 3 Cards Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: '과거 (Past)', card: tarotResult.past },
                  { label: '현재 (Present)', card: tarotResult.present },
                  { label: '미래 (Future)', card: tarotResult.future },
                ].map(({ label, card }, idx) => (
                  <div
                    key={idx}
                    className={`relative p-3.5 rounded-xl border flex flex-col items-center text-center space-y-2.5 transition-all hover:scale-[1.01] ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {label}
                    </span>

                    <div className="relative group w-32 aspect-[350/600] rounded-lg overflow-hidden border border-amber-500/40 shadow-md bg-stone-900 flex items-center justify-center">
                      <img
                        src={card.imageUrl}
                        alt={card.nameEn}
                        className={`w-full h-full object-cover transition-transform ${
                          !card.isUpright ? 'rotate-180' : ''
                        }`}
                      />
                      <button
                        onClick={() => setSelectedCardForModal(card)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        title="고화질 원화 크게 보기"
                      >
                        <Eye className="w-5 h-5 text-amber-300" />
                      </button>
                    </div>

                    <div>
                      <h5 className={`text-xs font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                        {card.nameKr}
                      </h5>
                      <span className={`text-[10px] font-semibold ${
                        card.isUpright ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {card.isUpright ? '정방향 (Upright)' : '역방향 (Reversed)'}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-relaxed line-clamp-3 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      {card.meaning}
                    </p>
                  </div>
                ))}
              </div>

              {/* Synthesis & Advice */}
              <div className="space-y-3 pt-2">
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}>
                  <strong className="block mb-1 text-amber-600 dark:text-amber-400 font-bold">종합 리딩:</strong>
                  {tarotResult.synthesis}
                </div>

                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
                }`}>
                  <strong className="block mb-1 text-amber-600 dark:text-amber-500 font-bold">핵심 조언:</strong>
                  {tarotResult.advice}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. DREAM INTERPRETATION TAB (UPGRADED COMPREHENSIVE DICTIONARY & AI) */}
      {subTab === 'dream' && (
        <div className="space-y-6">
          {/* Search & Filter Header Card */}
          <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    천명원 길흉 꿈해몽(夢解夢) 사전 백과
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                    전통 비전 50+ 색인 & AI 연동
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  동양 전통 주공해몽서(周公解夢)와 음양오행에 입각한 정통 길흉 판정 · 스마트 자연어 검색 지원
                </p>
              </div>

              <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                수록 표제어: <strong className="text-amber-500">{COMPREHENSIVE_DREAM_DICTIONARY.length}건</strong>
              </div>
            </div>

            {/* Smart Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={dreamQuery}
                onChange={e => setDreamQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && dreamQuery.trim()) {
                    handleAiDreamAnalysis();
                  }
                }}
                placeholder="꿈 내용을 자유롭게 검색하세요 (예: 호랑이꿈, 돼지에게 물림, 똥 밟았을 때, 치아 빠짐, 불나는 꿈, 조상님...)"
                className={`w-full pl-10 pr-24 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                }`}
              />
              {dreamQuery && (
                <button
                  onClick={() => setDreamQuery('')}
                  className="absolute right-10 top-2.5 p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  title="검색어 지우기"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleAiDreamAnalysis()}
                disabled={isAiDreamLoading || !dreamQuery.trim()}
                className="absolute right-2 top-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-xs flex items-center gap-1 disabled:opacity-40 transition-all"
                title="AI를 통해 꿈을 심층 분석합니다"
              >
                <Wand2 className="w-3 h-3 text-amber-300" />
                <span>AI 풀이</span>
              </button>
            </div>

            {/* Popular Search Keywords Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className={`text-[11px] font-bold shrink-0 mr-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                자주 찾는 꿈:
              </span>
              {POPULAR_DREAM_KEYWORDS.map(kw => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setDreamQuery(kw)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                    dreamQuery === kw
                      ? 'bg-amber-600 text-white border-amber-500 font-bold'
                      : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  #{kw}
                </button>
              ))}
            </div>

            {/* Category & Grade Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/40 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`font-semibold mr-1 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                  <Filter className="w-3 h-3 text-amber-500" />
                  <span>주제 분류:</span>
                </span>
                {[
                  { id: 'all', label: '전체' },
                  { id: '동물/수중생물', label: '동물/수중생물' },
                  { id: '인체/신체변화', label: '인체/신체' },
                  { id: '자연/천문/기후', label: '자연/천문' },
                  { id: '인물/조상/귀인', label: '인물/조상' },
                  { id: '사물/재물/음식', label: '사물/재물' },
                  { id: '행동/사건/장소', label: '행동/사건' },
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedDreamCategory(c.id)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                      selectedDreamCategory === c.id
                        ? 'bg-amber-600 text-white font-bold'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`font-semibold mr-1 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                  길흉 등급:
                </span>
                {[
                  { id: 'all', label: '전체' },
                  { id: '최상길몽', label: '최상길몽' },
                  { id: '대길몽', label: '대길몽' },
                  { id: '길몽', label: '길몽' },
                  { id: '태몽', label: '태몽' },
                  { id: '주의몽', label: '주의/흉몽' },
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedDreamGrade(g.id)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                      selectedDreamGrade === g.id
                        ? 'bg-amber-600 text-white font-bold'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Consecration Dream Analysis Banner & Result */}
          {isAiDreamLoading && (
            <div className={`p-6 rounded-2xl border text-center space-y-3 animate-pulse ${
              isDark ? 'bg-purple-950/40 border-purple-900/60 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                <span className="font-bold text-sm">동양 전통 해몽학 및 오행 비전으로 꿈을 심층 해독하는 중...</span>
              </div>
              <p className="text-xs opacity-80">
                주공해몽서와 동의보감 심신해몽에 근거하여 길흉과 처방을 도출하고 있습니다.
              </p>
            </div>
          )}

          {aiDreamAnalysis && !isAiDreamLoading && (
            <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl space-y-3 transition-colors ${
              isDark ? 'bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-900 border-purple-900/50' : 'bg-gradient-to-br from-purple-50 via-white to-amber-50/40 border-purple-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-500" />
                  <h4 className={`text-sm sm:text-base font-bold font-serif-kr ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                    🔮 천명원 AI 심층 꿈해몽 정밀 해독서
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAiDream}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-stone-300 text-stone-700'
                    }`}
                  >
                    {dreamSavedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{dreamSavedSuccess ? '보관됨!' : '해몽서 보관'}</span>
                  </button>
                  <button
                    onClick={() => setAiDreamAnalysis(null)}
                    className="p-1 rounded-full hover:bg-stone-500/20 text-stone-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-xs leading-relaxed font-serif-kr whitespace-pre-line ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-white/90 border-stone-200 text-stone-800'
              }`}>
                {aiDreamAnalysis}
              </div>
            </div>
          )}

          {/* Dream Dictionary Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                해몽 검색 결과: <strong className="text-amber-500">{filteredDreams.length}건</strong>
              </span>
              {dreamQuery && (
                <span className="text-[11px] text-stone-400">
                  검색어: <strong className="text-amber-600 dark:text-amber-400">"{dreamQuery}"</strong>
                </span>
              )}
            </div>

            {filteredDreams.length === 0 ? (
              /* Empty Search Fallback with One-Click AI Solution */
              <div className={`p-8 rounded-2xl border text-center space-y-4 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="text-3xl">🌙</div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>
                    사전 표제어 중 '{dreamQuery}' 관련 항목을 찾지 못했습니다.
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    복합적이거나 구체적인 꿈 이야기는 천명원 AI가 전통 해몽 비전에 근거하여 즉시 풀이해 드립니다.
                  </p>
                </div>

                <button
                  onClick={() => handleAiDreamAnalysis()}
                  disabled={isAiDreamLoading || !dreamQuery.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white shadow-md inline-flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4 text-yellow-300" />
                  <span>'{dreamQuery}' AI 맞춤 꿈해몽 즉시 풀이</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDreams.map(item => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all hover:border-amber-500/50 hover:shadow-lg ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {item.category}
                          </span>
                          <h4 className={`text-sm font-bold font-serif-kr mt-1 ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                            {item.keyword}
                          </h4>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          item.type === '최상길몽'
                            ? 'bg-red-500/10 text-red-500 border-red-500/30'
                            : item.type === '대길몽'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              : item.type === '태몽'
                                ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                                : item.type === '주의몽' || item.type === '흉몽'
                                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        }`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        {item.summary}
                      </div>

                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                        {item.desc}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/40">
                      <div className={`p-2 rounded-lg text-[11px] leading-relaxed ${
                        isDark ? 'bg-slate-950/70 text-emerald-400' : 'bg-emerald-50/70 text-emerald-900'
                      }`}>
                        <strong>💡 천명원 개운 팁: </strong>{item.actionTip}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-stone-400">
                          분야: <strong className="text-amber-600 dark:text-amber-400">{item.fortuneField}</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSaveDream(item)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-stone-900'
                            }`}
                            title="히스토리에 저장"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />
                          </button>

                          <button
                            onClick={() => handleAiDreamAnalysis(item.keyword)}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-600/30 transition-all flex items-center gap-1"
                          >
                            <span>AI 심층풀이</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAROT CARD HIGH-RESOLUTION INSPECT MODAL */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 overflow-hidden flex flex-col items-center ${
            isDark ? 'bg-slate-900 border-amber-500/40 text-white' : 'bg-white border-stone-300 text-stone-900'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedCardForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-500/20 transition-colors"
            >
              <X className="w-5 h-5 text-stone-400" />
            </button>

            <div className="text-center mb-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                1909 라이더-웨이트 메이저 아르카나 원화
              </span>
              <h3 className="text-xl font-bold font-serif-kr mt-1">
                {selectedCardForModal.nameKr}
              </h3>
              <div className="text-xs text-stone-500 dark:text-slate-400">
                {selectedCardForModal.nameEn} · {selectedCardForModal.isUpright ? '정방향 (Upright)' : '역방향 (Reversed)'}
              </div>
            </div>

            {/* High-Res Image Display */}
            <div className="w-56 sm:w-64 aspect-[350/600] rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/70 p-1 bg-gradient-to-b from-amber-400 to-amber-600">
              <img
                src={selectedCardForModal.imageUrl}
                alt={selectedCardForModal.nameEn}
                className={`w-full h-full object-cover rounded-xl ${
                  !selectedCardForModal.isUpright ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Card Deep Meaning Details */}
            <div className="mt-4 space-y-2 text-center max-w-md">
              <p className="text-xs leading-relaxed text-stone-600 dark:text-slate-300">
                {selectedCardForModal.meaning}
              </p>
              
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {selectedCardForModal.keywords.map(k => (
                  <span key={k} className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-600/20 font-medium">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
