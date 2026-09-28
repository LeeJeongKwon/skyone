import React, { useState } from 'react';
import { 
  Sparkles, 
  BookmarkPlus, 
  Check, 
  Award, 
  HelpCircle, 
  Star,
  RotateCcw
} from 'lucide-react';
import { NamingInput, NamingResult, AppSettings } from '../types';
import { analyzeAndGenerateNames } from '../utils/namingEngine';
import { saveHistoryItem } from '../utils/storage';

interface NamingTabProps {
  settings: AppSettings;
}

export const NamingTab: React.FC<NamingTabProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  const defaultInput: NamingInput = {
    lastName: '김',
    currentFirstName: '민준',
    gender: 'unisex',
  };

  const [input, setInput] = useState<NamingInput>(defaultInput);

  const [result, setResult] = useState<NamingResult>(() => analyzeAndGenerateNames(defaultInput));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleReset = () => {
    setInput(defaultInput);
    setResult(analyzeAndGenerateNames(defaultInput));
    setSavedSuccess(false);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const res = analyzeAndGenerateNames(input);
    setResult(res);
    setSavedSuccess(false);
  };

  const handleSaveToHistory = () => {
    saveHistoryItem({
      type: 'naming',
      title: `${input.lastName}${input.currentFirstName || ''} 성명학 분석 및 추천 작명`,
      summary: result.currentAnalysis 
        ? `점수: ${result.currentAnalysis.overallScore}점 (${result.currentAnalysis.recommendationRating}) / 수리 4격 대길`
        : `추천 작명 후보 ${result.recommendedNames.length}개 생성 완료`,
      data: result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${
        isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✍️</span>
            <div>
              <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                정통 성명학(姓名學) 81수리 분석 & 오행 보완 맞춤 작명
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                원형이정(초년·청년·장년·말년) 4격 수리, 발음오행 상생, 사주 부족 오행 보완 추천 작명
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
              title="성명학 입력 및 분석 결과를 초기화합니다."
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>초기화</span>
            </button>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              isDark ? 'bg-rose-950/80 border-rose-600/40 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-800 font-semibold'
            }`}>
              81수리 성명학 엔진
            </span>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5 sm:col-span-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>성씨 (姓)</label>
            <input
              type="text"
              required
              value={input.lastName}
              onChange={e => setInput(p => ({ ...p, lastName: e.target.value }))}
              placeholder="예: 김, 이, 박"
              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>현재 이름 (감정용)</label>
            <input
              type="text"
              value={input.currentFirstName}
              onChange={e => setInput(p => ({ ...p, currentFirstName: e.target.value }))}
              placeholder="예: 민준 (비우면 추천만)"
              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>성별 구분</label>
            <select
              value={input.gender}
              onChange={e => setInput(p => ({ ...p, gender: e.target.value as any }))}
              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            >
              <option value="unisex">성별 무관 (중성)</option>
              <option value="male">남성 이름 위주</option>
              <option value="female">여성 이름 위주</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-1">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md transition-all h-[38px] flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>성명 분석 & 작명</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
            성명학 분석 결과 및 대길(大吉) 추천 이름이 준비되었습니다.
          </span>
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

        {/* Current Name Analysis if provided */}
        {result.currentAnalysis && (
          <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-stone-200'
            }`}>
              <div>
                <h4 className={`text-base font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  [{result.currentAnalysis.name}] 성명 원형이정 4격 수리 감정
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  발음오행: {result.currentAnalysis.hangulElements}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>종합 평가:</span>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {result.currentAnalysis.overallScore}점 ({result.currentAnalysis.recommendationRating})
                </div>
              </div>
            </div>

            {/* 4 Gyeok Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                result.currentAnalysis.strokeCalculations.won,
                result.currentAnalysis.strokeCalculations.hyung,
                result.currentAnalysis.strokeCalculations.yi,
                result.currentAnalysis.strokeCalculations.jung,
              ].map(g => (
                <div key={g.name} className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>{g.name}</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{g.grade}</div>
                  <p className={`text-[11px] leading-snug ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{g.explanation}</p>
                </div>
              ))}
            </div>

            <p className={`text-xs p-3 rounded-xl border ${
              isDark ? 'bg-slate-950/50 border-slate-800/80 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              💡 <b>음령오행 총평:</b> {result.currentAnalysis.soundHarmony}
            </p>
          </div>
        )}

        {/* Recommended Names List */}
        <div className="space-y-3">
          <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${
            isDark ? 'text-amber-300' : 'text-amber-800'
          }`}>
            <Star className="w-4 h-4 fill-current text-amber-500" />
            <span>천명원 엄선 대길(大吉) 추천 작명 리스트</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.recommendedNames.map(item => (
              <div key={item.hangul} className={`p-4 rounded-xl border space-y-2.5 transition-colors ${
                isDark ? 'bg-slate-900/90 border-amber-900/40' : 'bg-white border-stone-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    {item.hangul}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-bold font-mono ${
                    isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {item.score}점
                  </span>
                </div>

                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
                  {item.hanja}
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  {item.meaning}
                </p>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                  isDark ? 'border-slate-800' : 'border-stone-200'
                }`}>
                  <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>{item.elementCompensation}</span>
                  <span className="text-amber-600 font-semibold">{item.grade.split('-')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
