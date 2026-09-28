import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  X, 
  Check, 
  Sparkles, 
  HelpCircle, 
  RotateCcw,
  Sun,
  Moon,
  ChevronRight,
  Info
} from 'lucide-react';

export interface ShijinItem {
  key: string;
  ji: string;
  hanja: string;
  name: string;
  animal: string;
  emoji: string;
  rangeStr: string;
  startMinutes: number; // minutes from midnight
  endMinutes: number;
  defaultTime: string;
  element: '목' | '화' | '토' | '금' | '수';
  yinYang: '양' | '음';
  elementColor: string;
  description: string;
}

export const SHIJIN_LIST: ShijinItem[] = [
  {
    key: 'ja',
    ji: '자',
    hanja: '子',
    name: '자시(子時)',
    animal: '쥐',
    emoji: '🐭',
    rangeStr: '23:30 ~ 01:29',
    startMinutes: 1410, // 23*60 + 30
    endMinutes: 90,    // 01*60 + 30
    defaultTime: '00:00',
    element: '수',
    yinYang: '양',
    elementColor: 'text-blue-400 bg-blue-950/60 border-blue-600/50',
    description: '한밤의 정기, 만물이 고요히 안식하고 새 기운이 움트는 시각'
  },
  {
    key: 'chuk',
    ji: '축',
    hanja: '丑',
    name: '축시(丑時)',
    animal: '소',
    emoji: '🐮',
    rangeStr: '01:30 ~ 03:29',
    startMinutes: 90,
    endMinutes: 210,
    defaultTime: '02:30',
    element: '토',
    yinYang: '음',
    elementColor: 'text-amber-400 bg-amber-950/60 border-amber-600/50',
    description: '깊은 새벽, 우직하게 여명을 준비하고 밭을 갈 기틀을 닦는 시각'
  },
  {
    key: 'in',
    ji: '인',
    hanja: '寅',
    name: '인시(寅時)',
    animal: '호랑이',
    emoji: '🐯',
    rangeStr: '03:30 ~ 05:29',
    startMinutes: 210,
    endMinutes: 330,
    defaultTime: '04:30',
    element: '목',
    yinYang: '양',
    elementColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/50',
    description: '동틀 녘 새벽, 웅장한 호랑이의 기상으로 양기가 깨어나는 시각'
  },
  {
    key: 'myo',
    ji: '묘',
    hanja: '卯',
    name: '묘시(卯時)',
    animal: '토끼',
    emoji: '🐰',
    rangeStr: '05:30 ~ 07:29',
    startMinutes: 330,
    endMinutes: 450,
    defaultTime: '06:30',
    element: '목',
    yinYang: '음',
    elementColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/50',
    description: '일출의 아침, 붉은 해가 솟구치며 생명력이 샘솟는 시각'
  },
  {
    key: 'jin',
    ji: '진',
    hanja: '辰',
    name: '진시(辰時)',
    animal: '용',
    emoji: '🐲',
    rangeStr: '07:30 ~ 09:29',
    startMinutes: 450,
    endMinutes: 570,
    defaultTime: '08:30',
    element: '토',
    yinYang: '양',
    elementColor: 'text-amber-400 bg-amber-950/60 border-amber-600/50',
    description: '활기찬 아침, 용이 구름을 타듯 힘차게 세상으로 나서는 시각'
  },
  {
    key: 'sa',
    ji: '사',
    hanja: '巳',
    name: '사시(巳時)',
    animal: '뱀',
    emoji: '🐍',
    rangeStr: '09:30 ~ 11:29',
    startMinutes: 570,
    endMinutes: 690,
    defaultTime: '10:30',
    element: '화',
    yinYang: '음',
    elementColor: 'text-red-400 bg-red-950/60 border-red-600/50',
    description: '따사로운 오전, 온화한 햇살과 지혜로운 통찰이 빛나는 시각'
  },
  {
    key: 'o',
    ji: '오',
    hanja: '午',
    name: '오시(午時)',
    animal: '말',
    emoji: '🐴',
    rangeStr: '11:30 ~ 13:29',
    startMinutes: 690,
    endMinutes: 810,
    defaultTime: '12:30',
    element: '화',
    yinYang: '양',
    elementColor: 'text-red-400 bg-red-950/60 border-red-600/50',
    description: '정오의 절정, 태양이 하늘 가장 높이 떠 양기가 극대화되는 시각'
  },
  {
    key: 'mi',
    ji: '미',
    hanja: '未',
    name: '미시(未時)',
    animal: '양',
    emoji: '🐑',
    rangeStr: '13:30 ~ 15:29',
    startMinutes: 810,
    endMinutes: 930,
    defaultTime: '14:30',
    element: '토',
    yinYang: '음',
    elementColor: 'text-amber-400 bg-amber-950/60 border-amber-600/50',
    description: '포근한 오후, 따뜻한 온기로 곡식이 익어가며 안정을 취하는 시각'
  },
  {
    key: 'shin',
    ji: '신',
    hanja: '申',
    name: '신시(申時)',
    animal: '원숭이',
    emoji: '🐵',
    rangeStr: '15:30 ~ 17:29',
    startMinutes: 930,
    endMinutes: 1050,
    defaultTime: '16:30',
    element: '금',
    yinYang: '양',
    elementColor: 'text-slate-300 bg-slate-800/80 border-slate-500/50',
    description: '늦은 오후, 선선한 금기운이 결실을 단단하게 맺는 시각'
  },
  {
    key: 'yu',
    ji: '유',
    hanja: '酉',
    name: '유시(酉時)',
    animal: '닭',
    emoji: '🐔',
    rangeStr: '17:30 ~ 19:29',
    startMinutes: 1050,
    endMinutes: 1170,
    defaultTime: '18:30',
    element: '금',
    yinYang: '음',
    elementColor: 'text-slate-300 bg-slate-800/80 border-slate-500/50',
    description: '해질녘 황혼, 가을의 결실을 곳간에 들이고 보금자리로 드는 시각'
  },
  {
    key: 'sul',
    ji: '술',
    hanja: '戌',
    name: '술시(戌時)',
    animal: '개',
    emoji: '🐶',
    rangeStr: '19:30 ~ 21:29',
    startMinutes: 1170,
    endMinutes: 1290,
    defaultTime: '20:30',
    element: '토',
    yinYang: '양',
    elementColor: 'text-amber-400 bg-amber-950/60 border-amber-600/50',
    description: '땅거미 진 초저녁, 충직하게 집안을 지키며 밤을 맞이하는 시각'
  },
  {
    key: 'hae',
    ji: '해',
    hanja: '亥',
    name: '해시(亥時)',
    animal: '돼지',
    emoji: '🐷',
    rangeStr: '21:30 ~ 23:29',
    startMinutes: 1290,
    endMinutes: 1410,
    defaultTime: '22:30',
    element: '수',
    yinYang: '음',
    elementColor: 'text-blue-400 bg-blue-950/60 border-blue-600/50',
    description: '깊은 밤, 만물이 저장과 휴식으로 내일을 준비하는 평온의 시각'
  },
];

/**
 * Convert HH:mm to matching ShijinItem
 */
export function getShijinFromTime(timeStr: string): ShijinItem | null {
  if (!timeStr || timeStr === 'unknown') return null;
  const parts = timeStr.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;

  const [hh, mm] = parts;
  const mins = hh * 60 + mm;

  if (mins >= 1410 || mins < 90) return SHIJIN_LIST[0]; // 자시
  if (mins >= 90 && mins < 210) return SHIJIN_LIST[1]; // 축시
  if (mins >= 210 && mins < 330) return SHIJIN_LIST[2]; // 인시
  if (mins >= 330 && mins < 450) return SHIJIN_LIST[3]; // 묘시
  if (mins >= 450 && mins < 570) return SHIJIN_LIST[4]; // 진시
  if (mins >= 570 && mins < 690) return SHIJIN_LIST[5]; // 사시
  if (mins >= 690 && mins < 810) return SHIJIN_LIST[6]; // 오시
  if (mins >= 810 && mins < 930) return SHIJIN_LIST[7]; // 미시
  if (mins >= 930 && mins < 1050) return SHIJIN_LIST[8]; // 신시
  if (mins >= 1050 && mins < 1170) return SHIJIN_LIST[9]; // 유시
  if (mins >= 1170 && mins < 1290) return SHIJIN_LIST[10]; // 술시
  if (mins >= 1290 && mins < 1410) return SHIJIN_LIST[11]; // 해시

  return SHIJIN_LIST[0];
}

interface InteractiveTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: string; // "HH:mm" or "unknown"
  onSelectTime: (time: string) => void;
  title?: string;
  theme?: 'light' | 'dark';
}

export const InteractiveTimeModal: React.FC<InteractiveTimeModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
  onSelectTime,
  title = '사주 출생시간(시진) 직접 선택 달력',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  const [tempTime, setTempTime] = useState<string>(selectedTime || '08:30');
  const [viewMode, setViewMode] = useState<'shijin' | 'matrix'>('shijin');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Parse hours and minutes
  const [selectedHour, setSelectedHour] = useState<number>(() => {
    if (selectedTime && selectedTime.includes(':')) {
      const h = parseInt(selectedTime.split(':')[0], 10);
      return isNaN(h) ? 8 : h;
    }
    return 8;
  });

  const [selectedMinute, setSelectedMinute] = useState<number>(() => {
    if (selectedTime && selectedTime.includes(':')) {
      const m = parseInt(selectedTime.split(':')[1], 10);
      return isNaN(m) ? 30 : m;
    }
    return 30;
  });

  useEffect(() => {
    if (isOpen) {
      setTempTime(selectedTime || '08:30');
      if (selectedTime && selectedTime.includes(':')) {
        const [h, m] = selectedTime.split(':').map(Number);
        if (!isNaN(h)) setSelectedHour(h);
        if (!isNaN(m)) setSelectedMinute(m);
      }
    }
  }, [isOpen, selectedTime]);

  if (!isOpen) return null;

  const currentShijin = getShijinFromTime(tempTime);

  const handleSelectShijinCard = (shijin: ShijinItem) => {
    setTempTime(shijin.defaultTime);
    const [h, m] = shijin.defaultTime.split(':').map(Number);
    setSelectedHour(h);
    setSelectedMinute(m);
  };

  const handleUpdateHour = (hour: number) => {
    setSelectedHour(hour);
    const newTime = `${String(hour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    setTempTime(newTime);
  };

  const handleUpdateMinute = (minute: number) => {
    setSelectedMinute(minute);
    const newTime = `${String(selectedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setTempTime(newTime);
  };

  const handleSelectUnknown = () => {
    setTempTime('unknown');
    onSelectTime('unknown');
    onClose();
  };

  const handleSelectNow = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setSelectedHour(h);
    setSelectedMinute(m);
    setTempTime(timeStr);
  };

  const handleConfirm = () => {
    onSelectTime(tempTime);
    onClose();
  };

  // Quick minute presets
  const minutePresets = [0, 10, 15, 20, 30, 40, 45, 50];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[90vh] transition-all ${
          isDark 
            ? 'bg-slate-900 border-amber-900/40 text-stone-100' 
            : 'bg-white border-stone-200 text-stone-800'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-5 py-3.5 flex items-center justify-between border-b shrink-0 ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-950 text-amber-400 border border-amber-800/50' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif-kr flex items-center gap-1.5">
                <span>{title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-sans font-semibold">
                  시진(時辰) 달력
                </span>
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                12간지 시진 표 또는 24시간 블록 달력에서 시간을 직접 선택하세요
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

        {/* Selected Time Banner */}
        <div className={`p-3.5 border-b shrink-0 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-amber-50/40 border-stone-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-xl border text-center font-mono font-bold text-lg sm:text-xl tracking-wider ${
                tempTime === 'unknown'
                  ? 'bg-stone-500/20 border-stone-400/40 text-stone-400'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-500'
              }`}>
                {tempTime === 'unknown' ? '시간 미상' : tempTime}
              </div>

              <div>
                {tempTime === 'unknown' ? (
                  <div className="text-xs">
                    <span className="font-bold text-stone-400">시간을 모름 (미상)</span>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      정오(午時, 12:00) 기준 또는 삼주(연·월·일) 중심으로 분석됩니다.
                    </p>
                  </div>
                ) : currentShijin ? (
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{currentShijin.emoji}</span>
                      <span className={`font-bold font-serif-kr text-sm ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                        {currentShijin.name} ({currentShijin.hanja}時)
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${currentShijin.elementColor}`}>
                        {currentShijin.element}({currentShijin.yinYang})
                      </span>
                      <span className={`text-[11px] font-mono ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                        [{currentShijin.rangeStr}]
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 truncate max-w-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      {currentShijin.description}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-slate-800/80 p-0.5 rounded-xl border border-stone-300/40 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('shijin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'shijin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                12시진 달력
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                24시간 정밀표
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {viewMode === 'shijin' ? (
            /* 12 Shijin Calendar Grid (Like Calendar Days) */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                  📅 십이지시(十二時辰) 만세력 달력 그리드
                </span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  클릭 시 대표 시각 자동 반영
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SHIJIN_LIST.map((shijin) => {
                  const isSelected = currentShijin?.key === shijin.key && tempTime !== 'unknown';
                  return (
                    <button
                      key={shijin.key}
                      type="button"
                      onClick={() => handleSelectShijinCard(shijin)}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? isDark 
                            ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-500' 
                            : 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500'
                          : isDark
                            ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100/80'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-0.5 rounded-full bg-amber-500 text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{shijin.emoji}</span>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className={`font-serif-kr font-bold text-sm ${isSelected ? 'text-amber-500' : isDark ? 'text-white' : 'text-stone-900'}`}>
                                {shijin.hanja}時
                              </span>
                              <span className={`text-xs font-semibold ${isSelected ? 'text-amber-600 dark:text-amber-400' : isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                                {shijin.ji}시
                              </span>
                            </div>
                            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                              ({shijin.animal}의 시간)
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${shijin.elementColor}`}>
                          {shijin.element}
                        </span>
                      </div>

                      <div className="mt-1 pt-1.5 border-t border-dashed border-stone-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                        <span className={isDark ? 'text-amber-400/80' : 'text-amber-700/90'}>
                          {shijin.rangeStr}
                        </span>
                        <span className={`text-[10px] font-sans ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                          기준 {shijin.defaultTime}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 24-Hour Precision Matrix (Calendar Table) */
            <div className="space-y-4">
              {/* Hour Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                    ⏰ 시간(00시 ~ 23시) 직접 선택
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    선택: {selectedHour}시
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                  {Array.from({ length: 24 }, (_, i) => i).map(h => {
                    const isHourSelected = selectedHour === h && tempTime !== 'unknown';
                    // preview which shijin this hour roughly touches
                    const approxTimeStr = `${String(h).padStart(2, '0')}:30`;
                    const sItem = getShijinFromTime(approxTimeStr);

                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleUpdateHour(h)}
                        className={`py-2 px-1 rounded-xl text-center border transition-all ${
                          isHourSelected
                            ? 'bg-amber-600 border-amber-500 text-white font-bold shadow-xs'
                            : isDark
                              ? 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                              : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <div className="font-mono text-xs font-semibold">{String(h).padStart(2, '0')}시</div>
                        <div className={`text-[9px] mt-0.5 ${
                          isHourSelected ? 'text-amber-100' : isDark ? 'text-amber-500/80' : 'text-amber-700'
                        }`}>
                          {sItem?.hanja}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minute Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                    ⏱️ 분(Minute) 선택
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    {selectedMinute}분
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {minutePresets.map(m => {
                    const isMinSelected = selectedMinute === m && tempTime !== 'unknown';
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleUpdateMinute(m)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono text-center border transition-all ${
                          isMinSelected
                            ? 'bg-amber-600 border-amber-500 text-white font-bold'
                            : isDark
                              ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {String(m).padStart(2, '0')}분
                      </button>
                    );
                  })}
                </div>

                {/* Fine-tuning Minute Slider */}
                <div className="pt-2 flex items-center gap-3">
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>미세 조절:</span>
                  <input
                    type="range"
                    min="0"
                    max="59"
                    value={selectedMinute}
                    onChange={e => handleUpdateMinute(parseInt(e.target.value, 10))}
                    className="flex-1 accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold w-10 text-right">{selectedMinute}분</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Helper / Astrology Wisdom */}
          <div className={`p-3 rounded-xl border transition-all ${
            isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center justify-between text-left text-xs text-amber-600 dark:text-amber-400 font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>왜 자시가 23시 30분부터 시작하나요? (사주 시진 상식)</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
            </button>

            {showExplanation && (
              <p className={`mt-2 text-[11px] leading-relaxed border-t pt-2 ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-stone-200 text-stone-600'
              }`}>
                한국은 동경 135도 자오선을 표준시(KST)로 사용하지만, 서울 및 한반도 실제 경도는 약 127도 부근입니다. 
                따라서 실제 태양 자오선 통과 시각과 약 30분의 시차가 발생하므로, 정통 한국 만세력에서는 
                <b> 자시를 23시 30분 ~ 01시 29분</b>으로 30분 보정하여 정확한 시주(時柱)를 산출합니다.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-3.5 border-t shrink-0 flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSelectNow}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
              }`}
              title="현재 시각으로 설정"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>지금 시각</span>
            </button>

            <button
              type="button"
              onClick={handleSelectUnknown}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                tempTime === 'unknown'
                  ? 'border-stone-500 bg-stone-600 text-white'
                  : isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
              }`}
              title="태어난 시간을 모를 때 선택"
            >
              <HelpCircle className="w-3 h-3 text-stone-400" />
              <span>시간 모름</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>선택 완료</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
