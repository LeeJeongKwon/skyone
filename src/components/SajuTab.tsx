import React, { useState } from 'react';
import { 
  Sparkles, 
  BookmarkPlus, 
  Check, 
  HelpCircle, 
  Calendar, 
  Clock,
  Flame, 
  Trees, 
  Mountain, 
  Coins, 
  Waves,
  BrainCircuit,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { SajuInput, SajuResult, AppSettings } from '../types';
import { calculateSaju } from '../utils/sajuEngine';
import { saveHistoryItem } from '../utils/storage';
import { requestAiAnalysis } from '../services/aiService';
import { InteractiveCalendarModal } from './InteractiveCalendarModal';
import { InteractiveTimeModal, getShijinFromTime } from './InteractiveTimeModal';

interface SajuTabProps {
  settings: AppSettings;
  onOpenSettings: () => void;
}

export const SajuTab: React.FC<SajuTabProps> = ({ settings, onOpenSettings }) => {
  const isDark = settings.theme === 'dark';
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [input, setInput] = useState<SajuInput>({
    name: '홍길동',
    gender: 'male',
    birthDate: '1992-05-18',
    birthTime: '08:30',
    calendarType: 'solar',
    isLeapMonth: false,
  });

  const [result, setResult] = useState<SajuResult | null>(() => calculateSaju({
    name: '홍길동',
    gender: 'male',
    birthDate: '1992-05-18',
    birthTime: '08:30',
    calendarType: 'solar',
    isLeapMonth: false,
  }));

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const calculated = calculateSaju(input);
    setResult(calculated);
    setSavedSuccess(false);
  };

  const handleReset = () => {
    setInput({
      name: '',
      gender: 'male',
      birthDate: '1995-01-01',
      birthTime: '12:00',
      calendarType: 'solar',
      isLeapMonth: false,
    });
    setResult(null);
  };

  const handleRequestAi = async () => {
    if (!result) return;
    if (settings.engineMode === 'offline') {
      alert('현재 "자체 역학엔진(API 미사용)" 모드입니다. AI 심층 해석을 이용하시려면 상단 또는 설정에서 "AI 확장 모드"로 전환하고 API 키를 확인하세요.');
      return;
    }
    setIsAiLoading(true);
    const prompt = `성명: ${input.name} (${input.gender === 'male' ? '남성' : '여성'})
생년월일: ${input.birthDate} ${input.birthTime} (${input.calendarType})
사주팔자:
- 시주: ${result.fourPillars.time.ganHanja}${result.fourPillars.time.jiHanja} (${result.fourPillars.time.ganElement}/${result.fourPillars.time.jiElement})
- 일주: ${result.fourPillars.day.ganHanja}${result.fourPillars.day.jiHanja} (일간 본원: ${result.fourPillars.day.ganElement})
- 월주: ${result.fourPillars.month.ganHanja}${result.fourPillars.month.jiHanja} (${result.fourPillars.month.ganElement}/${result.fourPillars.month.jiElement})
- 년주: ${result.fourPillars.year.ganHanja}${result.fourPillars.year.jiHanja} (${result.fourPillars.year.ganElement}/${result.fourPillars.year.jiElement})
오행 비율: 목 ${result.fiveElementsDistribution.목}%, 화 ${result.fiveElementsDistribution.화}%, 토 ${result.fiveElementsDistribution.토}%, 금 ${result.fiveElementsDistribution.금}%, 수 ${result.fiveElementsDistribution.수}%
용신: ${result.yongshin.primary}, 희신: ${result.yongshin.secondary}
신살: ${result.spirits.join(', ')}`;

    const aiText = await requestAiAnalysis('사주명리 심층 개운 비책', prompt, settings);
    setIsAiLoading(false);
    if (aiText) {
      setResult(prev => prev ? { ...prev, aiEnhancedInterpretation: aiText } : null);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    saveHistoryItem({
      type: 'saju',
      title: `${input.name}님의 사주명리 만세력 분석`,
      summary: `일간: ${result.fourPillars.day.ganHanja}(${result.fourPillars.day.ganElement}) / 오행: ${result.dominantElement}왕 ${result.lackingElement}결 / 용신: ${result.yongshin.primary}기운 / ${result.spirits.slice(0, 2).join(', ')}`,
      data: result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const elementIcons = {
    목: <Trees className="w-3.5 h-3.5 text-emerald-400" />,
    화: <Flame className="w-3.5 h-3.5 text-red-400" />,
    토: <Mountain className="w-3.5 h-3.5 text-amber-400" />,
    금: <Coins className="w-3.5 h-3.5 text-slate-300" />,
    수: <Waves className="w-3.5 h-3.5 text-blue-400" />,
  };

  const elementColors = {
    목: 'text-emerald-400 bg-emerald-950/40 border-emerald-700/60',
    화: 'text-red-400 bg-red-950/40 border-red-700/60',
    토: 'text-amber-400 bg-amber-950/40 border-amber-700/60',
    금: 'text-slate-200 bg-slate-800/60 border-slate-600',
    수: 'text-blue-400 bg-blue-950/40 border-blue-700/60',
  };

  return (
    <div className="space-y-6">
      {/* Interactive Calendar Modal */}
      <InteractiveCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={input.birthDate}
        onSelectDate={(newDate) => setInput(p => ({ ...p, birthDate: newDate }))}
        title="사주 생년월일 직접 선택 달력"
        theme={settings.theme}
        minYear={1920}
        maxYear={2040}
        mode="date"
      />

      {/* Interactive Time Modal (시진 달력) */}
      <InteractiveTimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        selectedTime={input.birthTime}
        onSelectTime={(newTime) => setInput(p => ({ ...p, birthTime: newTime }))}
        title="사주 출생시간(시진) 직접 선택 달력"
        theme={settings.theme}
      />

      {/* Input Form Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-amber-900/30' 
          : 'bg-white border-stone-200'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔮</span>
            <div>
              <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                사주명리학(四柱命理學) 정밀 만세력 감정
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                생년월일시 만세력 4기둥 8글자, 십신, 오행 득령, 용신 및 신살 완벽 분석
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                  : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
              }`}
              title="사주 입력 필드와 감정 결과를 초기화합니다."
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>초기화</span>
            </button>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              isDark 
                ? 'bg-emerald-950/80 border-emerald-600/40 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
            }`}>
              정밀 역학 엔진 구동
            </span>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="space-y-1.5 lg:col-span-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>성명</label>
            <input
              type="text"
              required
              value={input.name}
              onChange={e => setInput(p => ({ ...p, name: e.target.value }))}
              className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 border ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-white' 
                  : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1.5 lg:col-span-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>성별</label>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setInput(p => ({ ...p, gender: 'male' }))}
                className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                  input.gender === 'male' 
                    ? 'bg-amber-600 border-amber-500 text-white' 
                    : isDark 
                      ? 'bg-slate-950 border-slate-700 text-slate-400' 
                      : 'bg-stone-50 border-stone-300 text-stone-600'
                }`}
              >
                남성 (乾命)
              </button>
              <button
                type="button"
                onClick={() => setInput(p => ({ ...p, gender: 'female' }))}
                className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                  input.gender === 'female' 
                    ? 'bg-amber-600 border-amber-500 text-white' 
                    : isDark 
                      ? 'bg-slate-950 border-slate-700 text-slate-400' 
                      : 'bg-stone-50 border-stone-300 text-stone-600'
                }`}
              >
                여성 (坤命)
              </button>
            </div>
          </div>

          {/* 생년월일 직접 달력 선택 필드 */}
          <div className="space-y-1.5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                생년월일 (달력에서 직접 선택)
              </label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                <span>달력 열기</span>
              </button>
            </div>
            <div className="flex gap-2">
              <div 
                onClick={() => setIsCalendarOpen(true)}
                className={`flex-1 flex items-center justify-between rounded-lg px-3 py-2 text-xs border cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-amber-300 hover:border-amber-500' 
                    : 'bg-stone-50 border-stone-300 text-amber-900 hover:border-amber-500 hover:bg-stone-100'
                }`}
                title="클릭하여 직접 달력에서 생년월일을 선택하세요"
              >
                <span className="font-bold tracking-wide">{input.birthDate}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-600 text-white font-medium">
                  달력 선택
                </span>
              </div>
              <select
                value={input.calendarType}
                onChange={e => setInput(p => ({ ...p, calendarType: e.target.value as any }))}
                className={`rounded-lg px-2.5 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-300' 
                    : 'bg-stone-50 border-stone-300 text-stone-800'
                }`}
              >
                <option value="solar">양력</option>
                <option value="lunar">음력</option>
              </select>
            </div>
          </div>

          {/* 출생 시간 직접 시진 달력 선택 필드 */}
          <div className="space-y-1.5 lg:col-span-1">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                출생 시간 (달력 선택)
              </label>
              <button
                type="button"
                onClick={() => setIsTimeModalOpen(true)}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                <span>시간 열기</span>
              </button>
            </div>
            <div 
              onClick={() => setIsTimeModalOpen(true)}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs border cursor-pointer transition-all ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-amber-300 hover:border-amber-500' 
                  : 'bg-stone-50 border-stone-300 text-amber-900 hover:border-amber-500 hover:bg-stone-100'
              }`}
              title="클릭하여 시진/시간 달력에서 직접 선택하세요"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-bold tracking-tight truncate">
                  {input.birthTime === 'unknown' ? (
                    '시간 미상'
                  ) : (
                    <>
                      {input.birthTime}
                      {getShijinFromTime(input.birthTime) && (
                        <span className="ml-1 text-[11px] font-medium opacity-80">
                          ({getShijinFromTime(input.birthTime)?.hanja}時)
                        </span>
                      )}
                    </>
                  )}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-600 text-white font-medium shrink-0 ml-1">
                달력 선택
              </span>
            </div>
          </div>

          <div className="flex items-end lg:col-span-1">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md transition-all h-[38px] flex items-center justify-center gap-1.5"
            >
              <span>만세력 감정</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Action Row: Save to History & AI Deep Analysis */}
          <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {input.name}님의 사주명식 분석 결과가 준비되었습니다.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToHistory}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300 shadow-xs'
                }`}
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
                <span>{savedSuccess ? '저장 완료!' : '히스토리에 저장'}</span>
              </button>

              <button
                onClick={handleRequestAi}
                disabled={isAiLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow transition-all disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 심층 해설 생성 중...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-200" />
                    <span>AI 심층 개운 비책 해설</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4 Pillars Table */}
          <div className={`p-5 rounded-2xl border shadow-xl space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
          }`}>
            <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              <span>四柱八字 命式表 (사주팔자 명식표)</span>
            </h4>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {[
                { title: '시주 (時柱)', pillar: result.fourPillars.time, role: '자녀/말년/결실' },
                { title: '일주 (日柱)', pillar: result.fourPillars.day, role: '본원(나)/배우자' },
                { title: '월주 (月柱)', pillar: result.fourPillars.month, role: '부모/청년/사회성' },
                { title: '년주 (年柱)', pillar: result.fourPillars.year, role: '조상/초년/가문' },
              ].map(({ title, pillar, role }) => (
                <div key={title} className={`p-3 sm:p-4 rounded-xl border space-y-2 transition-colors ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-stone-50 border-stone-200 shadow-xs'
                }`}>
                  <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{title}</div>

                  {/* 천간 */}
                  <div className={`p-2 sm:p-3 rounded-lg border space-y-1 ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
                  }`}>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{pillar.shipshin}</div>
                    <div className={`text-xl sm:text-2xl font-black font-serif-kr ${pillar.ganElement === '목' ? 'text-emerald-500' : pillar.ganElement === '화' ? 'text-red-500' : pillar.ganElement === '토' ? 'text-amber-500' : pillar.ganElement === '금' ? 'text-slate-600 dark:text-slate-200' : 'text-blue-500'}`}>
                      {pillar.ganHanja}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      {pillar.gan}({pillar.ganElement})
                    </div>
                  </div>

                  {/* 지지 */}
                  <div className={`p-2 sm:p-3 rounded-lg border space-y-1 ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
                  }`}>
                    <div className={`text-xl sm:text-2xl font-black font-serif-kr ${pillar.jiElement === '목' ? 'text-emerald-500' : pillar.jiElement === '화' ? 'text-red-500' : pillar.jiElement === '토' ? 'text-amber-500' : pillar.jiElement === '금' ? 'text-slate-600 dark:text-slate-200' : 'text-blue-500'}`}>
                      {pillar.jiHanja}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      {pillar.ji}({pillar.jiElement})
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{pillar.twelveStage}</div>
                  </div>

                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Five Elements & Yongshin Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Five Elements Balance */}
            <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
            }`}>
              <h4 className={`text-sm font-bold font-serif-kr flex items-center justify-between ${
                isDark ? 'text-slate-200' : 'text-stone-900'
              }`}>
                <span>오행(五行) 분포 및 균형</span>
                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  우세: <b className="text-amber-500">{result.dominantElement}</b> / 결핍: <b className="text-blue-500">{result.lackingElement}</b>
                </span>
              </h4>

              <div className="space-y-3">
                {(['목', '화', '토', '금', '수'] as const).map(elem => {
                  const val = result.fiveElementsDistribution[elem];
                  return (
                    <div key={elem} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          {elementIcons[elem]}
                          <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>{elem}(오행)</span>
                        </div>
                        <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{val}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-stone-200'}`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            elem === '목' ? 'bg-emerald-500' : elem === '화' ? 'bg-red-500' : elem === '토' ? 'bg-amber-500' : elem === '금' ? 'bg-slate-400' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.max(val, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Yongshin & Spirits */}
            <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
            }`}>
              <h4 className={`text-sm font-bold font-serif-kr ${isDark ? 'text-slate-200' : 'text-stone-900'}`}>
                개운의 열쇠: 용신(用神) & 신살(神殺)
              </h4>

              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-950/80 border-amber-900/40' : 'bg-stone-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                    isDark ? 'bg-amber-600/30 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    용신(用神): {result.yongshin.primary}기운
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-stone-700 border-stone-300'
                  }`}>
                    희신(喜神): {result.yongshin.secondary}기운
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                  {result.yongshin.explanation}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>발현된 주요 신살(神殺)</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.spirits.map(sp => (
                    <span key={sp} className={`text-xs px-2.5 py-1 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-300 text-stone-800'
                    }`}>
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* In-depth Fortunes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 font-serif-kr flex items-center gap-1.5">
                <span>🌟 타고난 천성과 기질 (본원 성향)</span>
              </h5>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.personality}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-serif-kr flex items-center gap-1.5">
                <span>💰 평생 재물운 및 자산 증식 비책</span>
              </h5>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.wealthFortune}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 font-serif-kr flex items-center gap-1.5">
                <span>💼 직업 적성 및 사회적 성취운</span>
              </h5>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.careerFortune}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h5 className="text-xs font-bold text-rose-600 dark:text-rose-400 font-serif-kr flex items-center gap-1.5">
                <span>❤️ 애정운 및 배우자 인연 조언</span>
              </h5>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.loveFortune}
              </p>
            </div>
          </div>

          {/* AI Enhanced Section */}
          {result.aiEnhancedInterpretation && (
            <div className={`p-5 rounded-2xl border shadow-xl space-y-3 transition-colors ${
              isDark 
                ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border-purple-800/40' 
                : 'bg-purple-50/50 border-purple-200'
            }`}>
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm font-serif-kr">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>AI 천명도사 심층 개운 비책</span>
              </div>
              <div className={`text-xs leading-relaxed whitespace-pre-wrap p-4 rounded-xl border ${
                isDark ? 'text-slate-200 bg-slate-950/60 border-purple-900/30' : 'text-stone-800 bg-white border-purple-200 shadow-xs'
              }`}>
                {result.aiEnhancedInterpretation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
