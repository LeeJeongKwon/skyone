import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  BookmarkPlus, 
  Check, 
  RotateCcw, 
  Eye, 
  UserCheck, 
  Loader2, 
  Award, 
  Heart, 
  Briefcase, 
  Activity 
} from 'lucide-react';
import { FaceAnalysisResult, AppSettings } from '../types';
import { analyzeFaceFeatures } from '../utils/faceEngine';
import { saveHistoryItem } from '../utils/storage';
import { requestAiAnalysis } from '../services/aiService';

interface FaceTabProps {
  settings: AppSettings;
}

export const FaceTab: React.FC<FaceTabProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [result, setResult] = useState<FaceAnalysisResult | null>(() => analyzeFaceFeatures());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream when unmounted
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('카메라 접근 권한이 없거나 지원되지 않는 브라우저입니다. 사진 업로드를 이용해 주세요.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImagePreview(dataUrl);
      stopCamera();
      runAnalysis(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImagePreview(url);
        runAnalysis(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = (imageUrl: string) => {
    const res = analyzeFaceFeatures(imageUrl);
    setResult(res);
    setSavedSuccess(false);
  };

  const handleReset = () => {
    stopCamera();
    setImagePreview(null);
    setResult(analyzeFaceFeatures());
    setIsAiLoading(false);
    setSavedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAiDeepAnalysis = async () => {
    if (!result) return;
    if (settings.engineMode === 'offline') {
      alert('현재 "자체 역학엔진(API 미사용)" 모드입니다. AI 비전 심층 분석을 원하시면 "AI 확장 모드"로 전환하고 키를 확인하세요.');
      return;
    }
    setIsAiLoading(true);
    const prompt = `의뢰인의 얼굴 관상 인상학 분석:
- 상정(초년운/이마): ${result.threeSections.upper.score}점
- 중정(중년운/코,눈): ${result.threeSections.middle.score}점
- 하정(말년운/턱,입): ${result.threeSections.lower.score}점
- 주요 십이궁: ${result.palaces.map(p => `${p.name}: ${p.status}`).join(', ')}
- 재물 지수: ${result.wealthIndex}점, 관록 지수: ${result.careerIndex}점
인상학 고전 마의상법(麻衣相法)과 현대 비즈니스 인상학의 관점에서 의뢰인의 운세를 극대화할 수 있는 인상 관리법과 개운 비책을 전수해 주세요.`;

    const aiNotes = await requestAiAnalysis(
      '관상학 인상 심층 비전 분석',
      prompt,
      settings,
      imagePreview || undefined
    );
    setIsAiLoading(false);
    if (aiNotes) {
      setResult(prev => prev ? { ...prev, aiEnhancedNotes: aiNotes } : null);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    saveHistoryItem({
      type: 'face',
      title: '관상 및 인상학 십이궁 정밀 분석',
      summary: `상정 ${result.threeSections.upper.score}점 / 중정 ${result.threeSections.middle.score}점 / 하정 ${result.threeSections.lower.score}점 (재물지수 ${result.wealthIndex}점)`,
      data: result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Upload & Camera Section */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${
        isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👤</span>
            <div>
              <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                관상학(觀相學) 인상·십이궁(十二宮) 정밀 분석
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                삼정(초년·중년·말년), 인당·준두·전택궁 등 12궁 및 재물·명예·귀인 복록 감정
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
              title="관상 사진 및 감정 결과를 초기화합니다."
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>초기화</span>
            </button>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              isDark ? 'bg-indigo-950/80 border-indigo-600/40 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-800 font-semibold'
            }`}>
              인상학 비전 엔진
            </span>
          </div>
        </div>

        {/* Camera or Upload Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            <div className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden ${
              isDark ? 'bg-slate-950 border-slate-700' : 'bg-stone-50 border-stone-300'
            }`}>
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs shadow-lg hover:bg-red-500 transition-colors"
                  >
                    촬영하기
                  </button>
                </div>
              ) : imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Face Preview" className="w-full h-full object-cover" />
                  {/* Subtle face overlay landmark points */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between py-6 px-10">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/40">상정(이마)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-emerald-300 border border-emerald-500/40">중정(인당·코)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-blue-300 border border-blue-500/40">하정(입·턱)</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <UserCheck className={`w-12 h-12 mx-auto ${isDark ? 'text-slate-600' : 'text-stone-400'}`} />
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    정면 얼굴 사진을 업로드하거나 실시간 카메라로 촬영하세요
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <label className={`flex-1 py-2 rounded-lg text-xs font-semibold border text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}>
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>사진 업로드</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-blue-500" />
                  <span>카메라 촬영</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 transition-colors"
                >
                  카메라 종료
                </button>
              )}
            </div>
          </div>

          {/* Quick Indices Summary */}
          {result && (
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${
                  isDark ? 'bg-slate-950/70 border-amber-900/40' : 'bg-amber-50/70 border-amber-200'
                }`}>
                  <Award className="w-4 h-4 text-amber-500 mx-auto" />
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>재물복 지수</div>
                  <div className={`text-xl font-bold font-mono ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{result.wealthIndex}점</div>
                </div>
                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${
                  isDark ? 'bg-slate-950/70 border-blue-900/40' : 'bg-blue-50/70 border-blue-200'
                }`}>
                  <Briefcase className="w-4 h-4 text-blue-500 mx-auto" />
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>관록/성공 지수</div>
                  <div className={`text-xl font-bold font-mono ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>{result.careerIndex}점</div>
                </div>
                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${
                  isDark ? 'bg-slate-950/70 border-rose-900/40' : 'bg-rose-50/70 border-rose-200'
                }`}>
                  <Heart className="w-4 h-4 text-rose-500 mx-auto" />
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>인연/애정 지수</div>
                  <div className={`text-xl font-bold font-mono ${isDark ? 'text-rose-300' : 'text-rose-800'}`}>{result.relationshipIndex}점</div>
                </div>
                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${
                  isDark ? 'bg-slate-950/70 border-emerald-900/40' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <Activity className="w-4 h-4 text-emerald-500 mx-auto" />
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>건강/장수 지수</div>
                  <div className={`text-xl font-bold font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>{result.longevityIndex}점</div>
                </div>
              </div>

              {/* Three Sections Progress */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <h4 className={`text-xs font-bold font-serif-kr ${isDark ? 'text-slate-300' : 'text-stone-800'}`}>
                  삼정(三停) 비율 및 시기별 운세
                </h4>
                <div className="space-y-2.5">
                  {[result.threeSections.upper, result.threeSections.middle, result.threeSections.lower].map(sec => (
                    <div key={sec.name} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>{sec.name}</span>
                        <span className="font-mono text-amber-600 font-bold">{sec.score}점</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-stone-200'}`}>
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${sec.score}%` }} />
                      </div>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{sec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 12 Palaces & Features Details */}
      {result && (
        <div className="space-y-6">
          {/* Action Row */}
          <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              관상 분석 감정서가 작성되었습니다.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToHistory}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
                <span>{savedSuccess ? '저장 완료!' : '히스토리 저장'}</span>
              </button>

              <button
                onClick={handleAiDeepAnalysis}
                disabled={isAiLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow transition-all disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 비전 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                    <span>AI 비전 심층 인상학 조언</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 12 Palaces Grid */}
          <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
          }`}>
            <h4 className={`text-sm font-bold font-serif-kr ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              십이궁(十二宮) 주요 감정 위치
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.palaces.map(p => (
                <div key={p.name} className={`p-3.5 rounded-xl border space-y-1.5 transition-colors ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-stone-900'}`}>{p.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold">위치: {p.location}</div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>{p.reading}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lucky Face Tips */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
          }`}>
            <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-stone-900'}`}>
              <span>💡 복을 부르는 인상 관리 개운법 (開運法)</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {result.luckyFaceTips.map((tip, idx) => (
                <li key={idx} className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}>
                  <span className="text-amber-600 font-bold shrink-0">{idx + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Vision Notes */}
          {result.aiEnhancedNotes && (
            <div className={`p-5 rounded-2xl border shadow-xl space-y-3 transition-colors ${
              isDark 
                ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border-purple-800/40' 
                : 'bg-purple-50/60 border-purple-200 text-purple-950'
            }`}>
              <div className={`flex items-center gap-2 font-bold text-sm font-serif-kr ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>AI 도사의 마의상법 비전 심층 해설</span>
              </div>
              <div className={`text-xs leading-relaxed whitespace-pre-wrap p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-purple-900/30 text-slate-200' : 'bg-white border-purple-200 text-stone-800'
              }`}>
                {result.aiEnhancedNotes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
