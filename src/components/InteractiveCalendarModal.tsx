import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  Clock 
} from 'lucide-react';

interface InteractiveCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  title?: string;
  theme?: 'light' | 'dark';
  minYear?: number;
  maxYear?: number;
  mode?: 'date' | 'month'; // 'date' for YYYY-MM-DD, 'month' for YYYY-MM
}

export const InteractiveCalendarModal: React.FC<InteractiveCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  title = '날짜 직접 선택 달력',
  theme = 'light',
  minYear = 1920,
  maxYear = 2040,
  mode = 'date',
}) => {
  const isDark = theme === 'dark';

  // Parse initial selected date
  const [currentYear, setCurrentYear] = useState<number>(() => {
    if (selectedDate && selectedDate.includes('-')) {
      const y = parseInt(selectedDate.split('-')[0], 10);
      if (!isNaN(y)) return y;
    }
    return new Date().getFullYear();
  });

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    if (selectedDate && selectedDate.includes('-')) {
      const m = parseInt(selectedDate.split('-')[1], 10);
      if (!isNaN(m)) return m; // 1-12
    }
    return new Date().getMonth() + 1;
  });

  const [tempSelectedDate, setTempSelectedDate] = useState<string>(selectedDate || '');

  useEffect(() => {
    if (isOpen) {
      if (selectedDate && selectedDate.includes('-')) {
        const parts = selectedDate.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(y)) setCurrentYear(y);
        if (!isNaN(m)) setCurrentMonth(m);
        setTempSelectedDate(selectedDate);
      } else {
        const today = new Date();
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth() + 1);
        const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setTempSelectedDate(mode === 'month' ? formatted.slice(0, 7) : formatted);
      }
    }
  }, [isOpen, selectedDate, mode]);

  if (!isOpen) return null;

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      if (currentYear > minYear) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      if (currentYear < maxYear) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(1);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    setCurrentYear(y);
    setCurrentMonth(m);
    const dateStr = mode === 'month' 
      ? `${y}-${String(m).padStart(2, '0')}`
      : `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setTempSelectedDate(dateStr);
    onSelectDate(dateStr);
    onClose();
  };

  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is Sunday

  // Approximate Son-eom-neun nal (손 없는 날) - dates ending in 9 or 0
  const isSonEomNeunNal = (day: number) => {
    const end = day % 10;
    return end === 9 || end === 0;
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setTempSelectedDate(formatted);
    onSelectDate(formatted);
    onClose();
  };

  const handleSelectMonthOnly = (monthNum: number) => {
    const formatted = `${currentYear}-${String(monthNum).padStart(2, '0')}`;
    setTempSelectedDate(formatted);
    onSelectDate(formatted);
    onClose();
  };

  // Years array for direct select
  const yearsList = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearsList.push(y);
  }

  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  })();

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isDark 
            ? 'bg-slate-900 border-amber-900/40 text-stone-100' 
            : 'bg-white border-stone-200 text-stone-800'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between border-b ${
          isDark 
            ? 'bg-slate-950/80 border-slate-800' 
            : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-950 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif-kr">
                {title}
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                {mode === 'month' ? '원하시는 연도와 월을 직접 클릭하세요' : '달력에서 원하시는 날짜를 직접 클릭하세요'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-stone-400 hover:text-stone-800 hover:bg-stone-100'
            }`}
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year and Month Direct Selectors */}
        <div className={`p-4 border-b ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-stone-50/50 border-stone-200'}`}>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevMonth}
              className={`p-2 rounded-xl border transition-all ${
                isDark 
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300' 
                  : 'border-stone-300 hover:bg-stone-100 text-stone-700'
              }`}
              title="이전 달"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {/* Year Dropdown */}
              <select
                value={currentYear}
                onChange={e => setCurrentYear(parseInt(e.target.value, 10))}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-amber-300' 
                    : 'bg-white border-stone-300 text-amber-800 shadow-sm'
                }`}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>

              {/* Month Dropdown */}
              <select
                value={currentMonth}
                onChange={e => setCurrentMonth(parseInt(e.target.value, 10))}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-amber-300' 
                    : 'bg-white border-stone-300 text-amber-800 shadow-sm'
                }`}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-xl border transition-all ${
                isDark 
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300' 
                  : 'border-stone-300 hover:bg-stone-100 text-stone-700'
              }`}
              title="다음 달"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          {mode === 'month' ? (
            /* Month selection grid */
            <div className="grid grid-cols-3 gap-2.5 py-3">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                const isSelected = tempSelectedDate === `${currentYear}-${String(m).padStart(2, '0')}`;
                return (
                  <button
                    key={m}
                    onClick={() => handleSelectMonthOnly(m)}
                    className={`py-4 rounded-xl text-sm font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-600 border-amber-600 text-white shadow-md'
                        : isDark
                          ? 'bg-slate-800/80 border-slate-700 hover:bg-amber-950/60 hover:border-amber-600/50 text-slate-200'
                          : 'bg-stone-50 border-stone-200 hover:bg-amber-50 hover:border-amber-300 text-stone-700'
                    }`}
                  >
                    {m}월
                  </button>
                );
              })}
            </div>
          ) : (
            /* Days selection grid */
            <div>
              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map((w, idx) => (
                  <div
                    key={w}
                    className={`text-xs font-semibold py-1 ${
                      idx === 0 
                        ? 'text-red-500' 
                        : idx === 6 
                          ? 'text-blue-500' 
                          : isDark ? 'text-slate-400' : 'text-stone-500'
                    }`}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty slots before first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-10 sm:h-12" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
                  const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = tempSelectedDate === dateStr;
                  const isToday = todayStr === dateStr;
                  const hasSonNone = isSonEomNeunNal(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`relative h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center border transition-all text-xs font-medium ${
                        isSelected
                          ? 'bg-amber-600 border-amber-500 text-white font-bold shadow-md scale-105 z-10'
                          : isToday
                            ? isDark
                              ? 'bg-amber-950/60 border-amber-500/80 text-amber-300 font-bold'
                              : 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                            : isDark
                              ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/70 text-slate-200'
                              : 'bg-white border-stone-200 hover:bg-stone-100/80 text-stone-700 shadow-xs'
                      }`}
                    >
                      <span className={
                        isSelected 
                          ? 'text-white' 
                          : dayOfWeek === 0 
                            ? 'text-red-500 font-semibold' 
                            : dayOfWeek === 6 
                              ? 'text-blue-500 font-semibold' 
                              : ''
                      }>
                        {day}
                      </span>

                      {/* Son Eom Neun Nal Badge */}
                      {hasSonNone && !isSelected && (
                        <span className={`text-[9px] scale-90 px-1 rounded ${
                          isDark ? 'bg-amber-900/60 text-amber-300' : 'bg-amber-100 text-amber-800'
                        }`}>
                          길일
                        </span>
                      )}

                      {/* Today dot indicator */}
                      {isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Actions */}
        <div className={`px-4 py-3 border-t flex items-center justify-between gap-2 ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              '길일' = 손 없는 날
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              선택: <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>{tempSelectedDate || '미선택'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'border-stone-300 bg-white hover:bg-stone-100 text-stone-700 shadow-sm'
              }`}
            >
              오늘
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow transition-all"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
