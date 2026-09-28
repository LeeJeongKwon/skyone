import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookmarkPlus, 
  Check, 
  Clock, 
  AlertTriangle, 
  Star,
  RotateCcw
} from 'lucide-react';
import { DateSelectionInput, DateSelectionResult, AppSettings } from '../types';
import { calculateAuspiciousDates } from '../utils/dateEngine';
import { saveHistoryItem } from '../utils/storage';
import { InteractiveCalendarModal } from './InteractiveCalendarModal';

interface DateTabProps {
  settings: AppSettings;
}

export const DateTab: React.FC<DateTabProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [input, setInput] = useState<DateSelectionInput>({
    purpose: 'moving',
    targetYearMonth: currentMonthStr,
  });

  const [result, setResult] = useState<DateSelectionResult>(() => calculateAuspiciousDates({
    purpose: 'moving',
    targetYearMonth: currentMonthStr,
  }));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = calculateAuspiciousDates(input);
    setResult(res);
    setSavedSuccess(false);
  };

  const handleSelectDateFromCalendar = (picked: string) => {
    // picked is YYYY-MM or YYYY-MM-DD
    const ym = picked.slice(0, 7);
    setInput(p => ({ ...p, targetYearMonth: ym }));
    const res = calculateAuspiciousDates({ ...input, targetYearMonth: ym });
    setResult(res);
  };

  const handleReset = () => {
    const defaultInput: DateSelectionInput = {
      purpose: 'moving',
      targetYearMonth: currentMonthStr,
    };
    setInput(defaultInput);
    setResult(calculateAuspiciousDates(defaultInput));
    setSavedSuccess(false);
  };

  const handleSaveToHistory = () => {
    saveHistoryItem({
      type: 'date',
      title: `${result.purposeLabel} - ${result.targetMonth} 택일`,
      summary: `추천 대길일: ${result.bestDays.map(d => `${d.date}(${d.dayOfWeek})`).join(', ')}`,
      data: result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Calendar Modal */}
      <InteractiveCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={`${input.targetYearMonth}-01`}
        onSelectDate={handleSelectDateFromCalendar}
        title="택일 희망 연월 직접 선택 달력"
        theme={settings.theme}
        minYear={2020}
        maxYear={2035}
        mode="month"
      />

      {/* Selector Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${
        isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📅</span>
            <div>
              <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                정통 길일 택일(吉日擇日) & 손 없는 날 감정
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                이사·혼례·개업·계약 목적별 최적의 황도길일(黃道吉日) 및 시간대(길시) 추천
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
              title="택일 설정 및 감정 결과를 초기화합니다."
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>초기화</span>
            </button>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              isDark 
                ? 'bg-cyan-950/80 border-cyan-600/40 text-cyan-300' 
                : 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold'
            }`}>
              천문역법 택일 엔진
            </span>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>택일 목적</label>
            <select
              value={input.purpose}
              onChange={e => setInput(p => ({ ...p, purpose: e.target.value as any }))}
              className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-white' 
                  : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            >
              <option value="moving">이사·입주 (손 없는 날 중심)</option>
              <option value="wedding">결혼·혼례 (화합·백년가약)</option>
              <option value="opening">개업·오픈 (재물·번영)</option>
              <option value="contract">계약·투자 (문서 성취)</option>
              <option value="exam">시험·면접 (합격운기)</option>
              <option value="travel">여행·출장 (무사안전)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                희망 대상 연월 (달력에서 직접 선택)
              </label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <CalendarIcon className="w-3 h-3" />
                <span>달력 열기</span>
              </button>
            </div>
            <div 
              onClick={() => setIsCalendarOpen(true)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs border cursor-pointer transition-all ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-amber-300 hover:border-amber-500' 
                  : 'bg-stone-50 border-stone-300 text-amber-900 hover:border-amber-500 hover:bg-stone-100'
              }`}
              title="클릭하여 직접 달력에서 대상 연월을 선택하세요"
            >
              <span className="font-bold tracking-wide">{input.targetYearMonth}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-600 text-white font-medium">
                달력 선택
              </span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md transition-all h-[38px] flex items-center justify-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>길일 캘린더 추출</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.targetMonth} [{result.purposeLabel}] 최상의 길일이 선별되었습니다.
              </span>
            </div>

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
          </div>

          {/* Top 5 Best Days */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              <Star className="w-4 h-4 fill-current text-amber-500" />
              <span>추천 대길일 TOP 5 (가장 기운이 왕성한 날)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.bestDays.map(day => (
                <div key={day.date} className={`p-4 rounded-xl border space-y-2.5 transition-colors ${
                  isDark ? 'bg-slate-900/90 border-amber-900/40' : 'bg-white border-stone-200 shadow-md'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>{day.date}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold ml-1.5">({day.dayOfWeek}요일)</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono border ${
                      isDark ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {day.score}점
                    </span>
                  </div>

                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    일진: <b className={isDark ? 'text-slate-200' : 'text-stone-800'}>{day.ganji}</b>
                    {day.isNoGhostDay && (
                      <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                        isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        손 없는 날
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>추천 길시: 09:30~13:30 (사시/오시)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {day.features.map(f => (
                      <span key={f} className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Advice & Taboos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 font-serif-kr">
                💡 택일 총평 및 유의사항
              </h5>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.generalAdvice}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h5 className="text-xs font-bold text-red-600 dark:text-red-400 font-serif-kr">
                ⚠️ 올해의 방위 금기 (삼살방 / 대장군방)
              </h5>
              <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                {result.tabooDirections.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
