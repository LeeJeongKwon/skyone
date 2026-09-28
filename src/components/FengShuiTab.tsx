import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  Bed, 
  Briefcase, 
  Store, 
  BookmarkPlus, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { FengShuiInput, FengShuiResult, AppSettings } from '../types';
import { analyzeFengShui, DIRECTIONS_COMPASS } from '../utils/fengshuiEngine';
import { saveHistoryItem } from '../utils/storage';

interface FengShuiTabProps {
  settings: AppSettings;
}

export const FengShuiTab: React.FC<FengShuiTabProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  const defaultInput: FengShuiInput = {
    spaceType: 'home_bedroom',
    doorDirection: '남동',
    specificConcerns: [],
  };

  const [input, setInput] = useState<FengShuiInput>(defaultInput);

  const [result, setResult] = useState<FengShuiResult>(() => analyzeFengShui(defaultInput));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleReset = () => {
    setInput(defaultInput);
    setResult(analyzeFengShui(defaultInput));
    setSavedSuccess(false);
  };

  const handleDirectionSelect = (dir: string) => {
    const updated = { ...input, doorDirection: dir };
    setInput(updated);
    setResult(analyzeFengShui(updated));
    setSavedSuccess(false);
  };

  const handleSpaceSelect = (space: FengShuiInput['spaceType']) => {
    const updated = { ...input, spaceType: space };
    setInput(updated);
    setResult(analyzeFengShui(updated));
    setSavedSuccess(false);
  };

  const handleSaveToHistory = () => {
    saveHistoryItem({
      type: 'fengshui',
      title: `${result.spaceTypeTitle} - ${input.doorDirection}향 풍수 진단`,
      summary: `풍수 적합도: ${result.overallScore}점 / 에너지: ${result.directionAnalysis.energyQuality} (${result.directionAnalysis.element})`,
      data: result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Space & Direction Selector */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm space-y-6 transition-colors ${
        isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧭</span>
            <div>
              <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                양택 풍수지리(陽宅風水地理) 나경(패철) 진단
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                공간 유형과 출입문/창문 좌향(坐向)에 따른 기운 순환, 가구 배치 및 비보(裨補) 풍수
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
              title="풍수 공간 및 방위 설정을 초기화합니다."
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>초기화</span>
            </button>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              isDark ? 'bg-amber-950/80 border-amber-600/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
            }`}>
              24좌향 나경 엔진
            </span>
          </div>
        </div>

        {/* Space Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'home_bedroom' as const, label: '안방 침실 (수면·건강)', icon: Bed },
            { id: 'home_living' as const, label: '거실 (가족·생기)', icon: Home },
            { id: 'office_room' as const, label: '서재·사무실 (승진·계약)', icon: Briefcase },
            { id: 'store_entrance' as const, label: '현관·상가 (재물·고객)', icon: Store },
          ].map(s => {
            const Icon = s.icon;
            const isSelected = input.spaceType === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSpaceSelect(s.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                      : 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500/40 font-bold'
                    : isDark
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-500' : isDark ? 'text-slate-500' : 'text-stone-400'}`} />
                <span className="text-xs font-semibold">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* 8-Direction Interactive Compass */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className={`text-xs font-bold font-serif-kr ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              가상 나경(패철) 8방위 선택: 현재 주요 창문/출입문 방향
            </h4>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
              현재 방위: {input.doorDirection}향
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {DIRECTIONS_COMPASS.map(d => {
              const isSelected = input.doorDirection === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() => handleDirectionSelect(d.name)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-amber-600 border-amber-400 text-white shadow-lg scale-105'
                      : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-xs font-bold">{d.name}</div>
                  <div className="text-[10px] opacity-80">{d.element}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      <div className="space-y-6">
        <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              풍수 길흉 종합 점수:
            </span>
            <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
              {result.overallScore}점 (상길 공간)
            </span>
          </div>
          <button
            onClick={handleSaveToHistory}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
            }`}
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
            <span>{savedSuccess ? '저장 완료!' : '히스토리에 저장'}</span>
          </button>
        </div>

        {/* Direction Energy Quality */}
        <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold font-serif-kr ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              방위 기운 특성: {result.directionAnalysis.direction}향 [{result.directionAnalysis.energyQuality}]
            </h4>
            <span className={`text-xs px-2.5 py-0.5 rounded border ${
              isDark ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
            }`}>
              오행: {result.directionAnalysis.element}
            </span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            {result.directionAnalysis.explanation}
          </p>
        </div>

        {/* Key Placements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.keyPlacements.map(item => (
            <div key={item.item} className={`p-4 rounded-xl border space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
            }`}>
              <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-stone-900'}`}>{item.item}</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><b>권장 위치:</b> {item.goodSpot}</span>
                </div>
                <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 font-medium">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><b>금기 위치:</b> {item.badSpot}</span>
                </div>
              </div>
              <p className={`text-[11px] pt-1 border-t ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-stone-200 text-stone-500'
              }`}>{item.tips}</p>
            </div>
          ))}
        </div>

        {/* Cures & Taboos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cures */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300' : 'bg-emerald-50/70 border-emerald-200 text-stone-700'
          }`}>
            <h4 className={`text-xs font-bold font-serif-kr flex items-center gap-1.5 ${
              isDark ? 'text-emerald-300' : 'text-emerald-900'
            }`}>
              <span>🌿 생기를 북돋는 비보(裨補) 풍수 솔루션</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {result.cures.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Taboos */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isDark ? 'bg-red-950/20 border-red-800/40 text-slate-300' : 'bg-red-50/70 border-red-200 text-stone-700'
          }`}>
            <h4 className={`text-xs font-bold font-serif-kr flex items-center gap-1.5 ${
              isDark ? 'text-red-300' : 'text-red-900'
            }`}>
              <span>⚠️ 반드시 피해야 할 양택 풍수 금기(禁忌)</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {result.warningTaboos.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
