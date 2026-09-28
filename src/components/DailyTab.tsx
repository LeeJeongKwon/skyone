import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Sparkles, 
  Compass, 
  Utensils, 
  Hash, 
  Palette, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  RotateCcw,
  Clock,
  ShieldAlert,
  BookmarkPlus,
  Check,
  Wand2,
  Loader2,
  ChevronRight,
  User,
  Heart,
  Briefcase,
  Coins
} from 'lucide-react';
import { AppSettings, DailyFortune, ZodiacDailyFortune } from '../types';
import { getTodayFortune, requestNotificationPermission, triggerDailyNotification, EARTHLY_BRANCHES_MAP } from '../utils/dailyEngine';
import { InteractiveCalendarModal } from './InteractiveCalendarModal';
import { saveHistoryItem } from '../utils/storage';
import { requestAiAnalysis } from '../services/aiService';

interface DailyTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const DailyTab: React.FC<DailyTabProps> = ({ settings, onUpdateSettings }) => {
  const isDark = settings.theme === 'dark';
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [fortune, setFortune] = useState<DailyFortune>(() => getTodayFortune());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState<string | null>(null);

  // Zodiac Filter State
  const [selectedZodiacIndex, setSelectedZodiacIndex] = useState<number>(0); // Default to 쥐띠 (0)

  // Personalized Birth Date State
  const [userBirthDate, setUserBirthDate] = useState<string>('1990-05-15');
  const [isPersonalCalendarOpen, setIsPersonalCalendarOpen] = useState(false);

  // AI Daily Analysis State
  const [dailyPlanInput, setDailyPlanInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    setFortune(getTodayFortune(targetDate));
    setAiAnalysisResult(null);
  };

  const handleShiftDate = (days: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const target = new Date(y, m - 1, d + days);
    const nextDateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
    handleSelectDate(nextDateStr);
  };

  const handleReset = () => {
    handleSelectDate(todayStr);
  };

  // Compute Personalized Fortune Metrics
  const personalMetrics = useMemo(() => {
    if (!userBirthDate) {
      return { score: fortune.overallScore, wealth: 85, love: 85, work: 85, health: 85 };
    }
    const [by, bm, bd] = userBirthDate.split('-').map(Number);
    const [ty, tm, td] = selectedDate.split('-').map(Number);
    const seed = (by * 31 + bm * 12 + bd * 7 + ty * 365 + tm * 30 + td * 13) % 100;

    const base = fortune.overallScore;
    const score = Math.max(65, Math.min(99, base + ((seed % 15) - 7)));
    const wealth = Math.max(60, Math.min(99, 75 + ((seed * 3) % 25)));
    const love = Math.max(60, Math.min(99, 70 + ((seed * 7) % 30)));
    const work = Math.max(60, Math.min(99, 72 + ((seed * 5) % 28)));
    const health = Math.max(60, Math.min(99, 76 + ((seed * 2) % 24)));

    // Determine birth zodiac
    const birthYearOffset = ((by - 4) % 12 + 12) % 12;
    const birthAnimal = EARTHLY_BRANCHES_MAP[birthYearOffset].animal;

    return { score, wealth, love, work, health, birthAnimal, birthYearOffset };
  }, [userBirthDate, selectedDate, fortune]);

  // Request Notification Permission & Trigger Test
  const handleRequestPermissionAndTest = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      triggerDailyNotification(fortune);
      setNotifyStatus('알림 권한이 승인되었으며, 오늘의 운세 알림을 발송했습니다!');
      onUpdateSettings({
        ...settings,
        dailyNotification: { ...settings.dailyNotification, enabled: true },
      });
    } else {
      setNotifyStatus('브라우저에서 알림 권한이 차단되었거나 지원되지 않습니다.');
    }
    setTimeout(() => setNotifyStatus(null), 5000);
  };

  // AI-Powered Deep Daily Reading
  const handleGenerateAiDaily = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `[천명원 당일 정밀 일진(日辰) 맞춤 운세 브리핑]
조회 일자: ${fortune.date} (${fortune.solarDate})
당일 일진: ${fortune.todayGanji} (천간: ${fortune.stemElement}, 지지: ${fortune.branchAnimal})
의뢰인 생년월일: ${userBirthDate} (${personalMetrics.birthAnimal}띠)
의뢰인의 오늘 일정 및 고민: "${dailyPlanInput || '오늘 하루를 성공적으로 보내기 위한 핵심 가이드'}"

위 의뢰인을 위해 동양 전통 명리학(만세력 일진과 개인 사주의 오행 조화)에 근거하여 오늘 하루의 실천 전략을 브리핑해 주세요.
반드시 아래 형식에 맞추어 전문적이고 명쾌한 한국어로 답변해 주세요:
1. 오늘 나의 하루 총평 (1~2줄 핵심 요약)
2. 분야별 실천 가이드:
   - 금전·재물운:
   - 사업·직장·회의:
   - 대인관계·애정:
   - 건강 및 주의할 시간대:
3. 천명원 당일 개운 비책 (오늘 실천하면 운이 트이는 행동 1가지)`;

      const aiText = await requestAiAnalysis(
        '천명원 당일 맞춤 일진 심층 브리핑',
        prompt,
        settings
      );
      setAiAnalysisResult(aiText);
    } catch (e) {
      console.error(e);
      setAiAnalysisResult('운세 브리핑 생성 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    saveHistoryItem({
      type: 'saju',
      title: `오늘의 운세 [${fortune.todayGanji}] (${fortune.date})`,
      summary: `일진 점수: ${fortune.overallScore}점 / 행운색: ${fortune.luckyColor.split('/')[0]} / ${fortune.summary.slice(0, 50)}...`,
      data: { fortune, personalMetrics, aiAnalysis: aiAnalysisResult },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentZodiac = fortune.zodiacFortunes[selectedZodiacIndex] || fortune.zodiacFortunes[0];

  return (
    <div className="space-y-6">
      {/* Target Date Interactive Calendar Modal */}
      <InteractiveCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        title="운세 날짜 직접 선택 달력"
        theme={settings.theme}
        mode="date"
      />

      {/* User Birth Date Interactive Calendar Modal */}
      <InteractiveCalendarModal
        isOpen={isPersonalCalendarOpen}
        onClose={() => setIsPersonalCalendarOpen(false)}
        selectedDate={userBirthDate}
        onSelectDate={(d) => {
          setUserBirthDate(d);
          // Auto select user's zodiac
          const [by] = d.split('-').map(Number);
          const offset = ((by - 4) % 12 + 12) % 12;
          setSelectedZodiacIndex(offset);
        }}
        title="내 생년월일 선택 (맞춤 운세)"
        theme={settings.theme}
        mode="date"
      />

      {/* Date Quick Navigation Bar */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-amber-500" />
          <div>
            <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              조회 대상 일진(日辰):
            </span>
            <span className={`text-sm sm:text-base font-bold font-serif-kr ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
              {fortune.date} · <span className="underline decoration-amber-500 underline-offset-4">{fortune.todayGanji}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleReset}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isDark 
                ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
            }`}
            title="오늘 날짜로 되돌립니다."
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>오늘</span>
          </button>

          <button
            onClick={() => handleShiftDate(-1)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            어제
          </button>

          <button
            onClick={() => handleShiftDate(1)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            내일
          </button>

          <button
            onClick={() => handleShiftDate(2)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            모레
          </button>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-all"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>달력 선택</span>
          </button>

          <button
            onClick={handleSaveToHistory}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-stone-100 border-stone-300 text-stone-700'
            }`}
            title="오늘의 운세를 보관함에 저장합니다."
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
            <span>{savedSuccess ? '보관됨' : '보관'}</span>
          </button>
        </div>
      </div>

      {/* Main Today Fortune Display Card */}
      <div className={`p-6 rounded-2xl border shadow-xl space-y-5 transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-amber-900/30' 
          : 'bg-white border-stone-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                isDark ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40' : 'bg-amber-100 text-amber-800'
              }`}>
                정통 만세력 일진
              </span>
              <span className="text-xs text-stone-400">{fortune.solarDate}</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-black font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
              오늘의 일진: <strong className="text-amber-600 dark:text-amber-400">{fortune.todayGanji}</strong>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              하늘의 기운: <strong>{fortune.stemElement}</strong> · 땅의 동물: <strong>{fortune.branchAnimal}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>당일 운기 지수:</span>
              <div className={`text-3xl font-black font-mono ${
                fortune.overallScore >= 90 ? 'text-emerald-500' : fortune.overallScore >= 80 ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {fortune.overallScore}점
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                fortune.overallScore >= 90 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                  : fortune.overallScore >= 80
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
              }`}>
                {fortune.overallScore >= 90 ? '대길(大吉)' : fortune.overallScore >= 80 ? '길(吉)' : '주의(注意)'}
              </span>
            </div>
          </div>
        </div>

        {/* Fortune Summary and Caution */}
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border leading-relaxed text-xs sm:text-sm font-serif-kr ${
            isDark ? 'text-slate-200 bg-slate-950/70 border-slate-800' : 'text-stone-800 bg-stone-50 border-stone-200'
          }`}>
            <strong className="text-amber-600 dark:text-amber-400 block mb-1">총평:</strong>
            {fortune.summary}
          </div>

          <div className={`p-3.5 rounded-xl border leading-relaxed text-xs flex items-start gap-2 ${
            isDark ? 'bg-amber-950/20 text-amber-200 border-amber-800/40' : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}>
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <strong className="font-bold">처세 주의사항: </strong>
              {fortune.caution}
            </div>
          </div>
        </div>

        {/* Lucky Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <Hash className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>행운의 숫자</div>
              <div className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-stone-900'}`}>{fortune.luckyNumber}</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <Palette className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>행운의 색상</div>
              <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>{fortune.luckyColor.split('/')[0]}</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <Compass className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>행운의 방위</div>
              <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>{fortune.luckyDirection.split('(')[0]}</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <Utensils className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>행운의 음식</div>
              <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>{fortune.luckyFood.split(' ')[0]}</div>
            </div>
          </div>
        </div>

        {/* Auspicious & Inauspicious Hours Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}>
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">🌟 오늘의 길시(吉時): </span>
              {fortune.auspiciousHours}
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}>
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="font-bold text-rose-600 dark:text-rose-400">⚠️ 주의할 흉시(凶時): </span>
              {fortune.inauspiciousHours}
            </div>
          </div>
        </div>
      </div>

      {/* 12 Zodiac Fortunes (12간지 띠별 오늘의 운세) */}
      <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <div>
            <h4 className={`text-base font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
              12간지 띠별 오늘의 운세
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              오늘의 일진 지지와 각 띠의 삼합·육합·충형(沖刑)에 입각한 정밀 운세
            </p>
          </div>

          <span className="text-xs text-amber-500 font-semibold">
            {fortune.todayGanji} 기준
          </span>
        </div>

        {/* Zodiac Sign Selector Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {fortune.zodiacFortunes.map((z, idx) => (
            <button
              key={z.zodiac}
              type="button"
              onClick={() => setSelectedZodiacIndex(idx)}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                selectedZodiacIndex === idx
                  ? 'bg-amber-600 border-amber-500 text-white font-bold shadow-md ring-2 ring-amber-500/40'
                  : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span className="text-xs font-bold">{z.zodiac.replace('띠', '')}</span>
              <span className="text-[10px] opacity-75 font-serif-kr">{z.hanja}</span>
              <span className={`text-[9px] font-bold mt-1 px-1 rounded ${
                z.score >= 90 ? 'bg-emerald-500/20 text-emerald-300' : z.score >= 80 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {z.score}점
              </span>
            </button>
          ))}
        </div>

        {/* Selected Zodiac Card Detail */}
        <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/50 border-amber-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐾</span>
              <h5 className={`text-base font-bold font-serif-kr ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                {currentZodiac.zodiac} ({currentZodiac.hanja}) 운세
              </h5>
              <span className="text-xs text-stone-400">
                ({currentZodiac.birthYears})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                currentZodiac.score >= 90 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                  : currentZodiac.score >= 80
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
              }`}>
                {currentZodiac.grade} · {currentZodiac.score}점
              </span>
            </div>
          </div>

          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
            {currentZodiac.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
            <div className={`p-3 rounded-xl border flex items-start gap-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-stone-200 text-stone-800'
            }`}>
              <Coins className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-600 dark:text-amber-400">금전/재물: </strong>
                {currentZodiac.wealthTip}
              </div>
            </div>

            <div className={`p-3 rounded-xl border flex items-start gap-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-stone-200 text-stone-800'
            }`}>
              <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-600 dark:text-rose-400">애정/인연: </strong>
                {currentZodiac.loveTip}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Saju Daily Reading (내 사주 맞춤 오늘의 운세) */}
      <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className={`text-base font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                내 사주 맞춤 오늘의 운세
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                생년월일을 기준으로 당일 일진과의 오행 상생·상극을 개인화하여 산출합니다.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPersonalCalendarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-all"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>생년월일 변경 ({userBirthDate})</span>
          </button>
        </div>

        {/* 4 Major Metric Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Coins className="w-3.5 h-3.5" />
                재물운
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{personalMetrics.wealth}%</span>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${personalMetrics.wealth}%` }} />
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-blue-500 font-bold">
                <Briefcase className="w-3.5 h-3.5" />
                직장/사업운
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{personalMetrics.work}%</span>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${personalMetrics.work}%` }} />
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-rose-500 font-bold">
                <Heart className="w-3.5 h-3.5" />
                애정/인연운
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{personalMetrics.love}%</span>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${personalMetrics.love}%` }} />
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                건강/활력
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{personalMetrics.health}%</span>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${personalMetrics.health}%` }} />
            </div>
          </div>
        </div>

        {/* AI Personalized Deep Daily Briefing Section */}
        <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
          isDark 
            ? 'bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40 border-purple-900/40' 
            : 'bg-gradient-to-r from-purple-50 via-white to-amber-50 border-purple-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h5 className={`text-sm font-bold font-serif-kr ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                천명원 AI 당일 맞춤 일진 심층 브리핑 (Gemini)
              </h5>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              실시간 AI 연동
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={dailyPlanInput}
              onChange={e => setDailyPlanInput(e.target.value)}
              placeholder="오늘 특별한 일정이나 고민이 있다면 적어보세요 (예: 오늘 오후 3시 투자 계약 미팅, 면접 등)"
              className={`w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-900'
              }`}
            />

            <button
              onClick={handleGenerateAiDaily}
              disabled={isAiLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>오늘의 사주 일진 심층 브리핑 생성 중...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-yellow-300" />
                  <span>AI 맞춤 하루 브리핑 및 개운 전략 받기</span>
                </>
              )}
            </button>
          </div>

          {aiAnalysisResult && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-serif-kr whitespace-pre-line mt-3 ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-white border-stone-200 text-stone-800'
            }`}>
              {aiAnalysisResult}
            </div>
          )}
        </div>
      </div>

      {/* Daily Notification Setup Box */}
      <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-950/80 text-amber-400 border border-amber-600/40' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-base font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                매일 아침 일진 및 맞춤 개운 비책 알림
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                브라우저 푸시 알림을 통해 매일 아침 길흉화복과 행운의 지침을 배달해 드립니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestPermissionAndTest}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>알림 권한 요청 및 테스트 발송</span>
            </button>
          </div>
        </div>

        {notifyStatus && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            notifyStatus.includes('승인') 
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notifyStatus}</span>
          </div>
        )}
      </div>

      {/* Five Elements Harmony Table */}
      <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
      }`}>
        <h4 className={`text-sm font-bold font-serif-kr ${isDark ? 'text-slate-200' : 'text-stone-900'}`}>
          오늘의 오행 기운 및 처세 조언
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {fortune.elementHarmonies.map(item => (
            <div key={item.element} className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>{item.element}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  item.status === '상생' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : item.status === '조화'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
