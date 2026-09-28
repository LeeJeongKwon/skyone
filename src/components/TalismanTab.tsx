import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Download, 
  Sparkles, 
  BookmarkPlus, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Loader2, 
  Volume2, 
  VolumeX, 
  Play, 
  Flame, 
  ScrollText,
  Wand2,
  BookOpen,
  Eye
} from 'lucide-react';
import { TalismanConfig, TalismanType, AppSettings } from '../types';
import { TALISMAN_PRESETS, renderTalismanToCanvas, TalismanPreset } from '../utils/talismanEngine';
import { saveHistoryItem } from '../utils/storage';
import { requestAiAnalysis } from '../services/aiService';

interface TalismanTabProps {
  settings: AppSettings;
}

interface AiBlessingResult {
  title: string;
  incantation: string;
  blessingText: string;
  spiritualPowerScore: number;
  placementAdvice: string;
}

type CategoryFilter = 'all' | '가정/인연' | '학업/시험' | '액막이/소멸' | '재물/사업' | '건강/심신';

export const TalismanTab: React.FC<TalismanTabProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  
  // Default to the first talisman from the user's authentic reference: 가출방지부 or 대재용출부
  const defaultInitialConfig: TalismanConfig = {
    type: 'home_departure',
    targetName: '홍길동',
    wishSentence: '귀가안심 가족화합 가출영절',
    inkColor: 'red_cinnabar',
    paperTexture: 'vintage_hanji',
    withStamp: true,
  };

  const [config, setConfig] = useState<TalismanConfig>(defaultInitialConfig);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [talismanImage, setTalismanImage] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiBlessingResult, setAiBlessingResult] = useState<AiBlessingResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAuraActive, setIsAuraActive] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDrawingAnimation, setIsDrawingAnimation] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCanvas = () => {
    if (canvasRef.current) {
      const dataUrl = renderTalismanToCanvas(canvasRef.current, config);
      setTalismanImage(dataUrl);
      setSavedSuccess(false);
    }
  };

  useEffect(() => {
    generateCanvas();
  }, [config]);

  // Tab Reset Button
  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setConfig(defaultInitialConfig);
    setSelectedCategory('all');
    setAiBlessingResult(null);
    setIsAuraActive(true);
    setIsDrawingAnimation(false);
  };

  // High-Resolution Image Download
  const handleDownload = () => {
    if (!talismanImage) return;
    const a = document.createElement('a');
    a.href = talismanImage;
    a.download = `천명원-정통칙령영험부적-${config.type}-${config.targetName || '의뢰인'}-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Live Brush Calligraphy Writing Simulation (Authentic Stroke-by-Stroke Flow)
  const handleSimulateDrawing = () => {
    if (!canvasRef.current || isDrawingAnimation) return;
    setIsDrawingAnimation(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Full target image
    renderTalismanToCanvas(canvas, config);
    const fullImg = new Image();
    fullImg.src = canvas.toDataURL('image/png');

    fullImg.onload = () => {
      let progress = 0;
      const totalSteps = 60;
      const interval = setInterval(() => {
        progress += 1;
        const currentHeight = (canvas.height * progress) / totalSteps;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw partial completed portion from top down
        ctx.drawImage(
          fullImg,
          0, 0, canvas.width, currentHeight,
          0, 0, canvas.width, currentHeight
        );

        // Simulated cinnabar brush tip with golden ember sparks
        ctx.save();
        const brushX = canvas.width / 2 + Math.sin(progress * 1.8) * 35;
        const brushColor = config.inkColor === 'gold_cinnabar' ? '#f59e0b' : '#dc2626';
        const sparkColor = config.inkColor === 'gold_cinnabar' ? '#fbbf24' : '#ef4444';

        ctx.fillStyle = brushColor;
        ctx.shadowColor = sparkColor;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(brushX, currentHeight, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Surrounding prayer dust particles
        for (let p = 0; p < 3; p++) {
          const px = brushX + (Math.sin(progress + p) * 16);
          const py = currentHeight - (p * 5);
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = sparkColor;
          ctx.fill();
        }
        ctx.restore();

        if (progress >= totalSteps) {
          clearInterval(interval);
          renderTalismanToCanvas(canvas, config);
          setIsDrawingAnimation(false);
        }
      }, 25);
    };
  };

  // Sacred Incantation Voice Chanting using Web Speech API
  const handleToggleChant = () => {
    if (!('speechSynthesis' in window)) {
      alert('사용하시는 브라우저에서 음성 낭독 기능을 지원하지 않습니다.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const preset = TALISMAN_PRESETS.find(p => p.type === config.type) || TALISMAN_PRESETS[0];
    const textToChant = aiBlessingResult?.incantation || preset.incantation;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToChant);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.86; // Solemn sacred rhythm
    utterance.pitch = 0.92;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // AI-Powered Deep Taoist Consecration Blessing (API 연동)
  const handleGenerateAiBlessing = async () => {
    setIsAiGenerating(true);
    const preset = TALISMAN_PRESETS.find(p => p.type === config.type) || TALISMAN_PRESETS[0];
    
    try {
      const prompt = `[천명원 도교 신령 정통 칙령 영험부적 각인 의식]
부적: ${preset.title} (${preset.hanjaTitle})
부적 효능: ${preset.efficacy}
소원자: ${config.targetName || '의뢰인'}
소원 발원문: ${config.wishSentence || preset.shortWish}

위 의뢰인을 위해 천지신명과 옥황상제의 칙령에 부합하는 정통 도교/샤머니즘 축원문과 주문(呪文), 그리고 영험 비결을 생성해 주세요.
반드시 아래 형식에 맞추어 한국어로 답변해 주세요:
1. 축원문(祝願文): 웅장하고 신비로운 3~4줄 도교 신장 소명문
2. 비전 주술 주문(急急如律令으로 끝나는 엄숙한 주문 1문장)
3. 영험도: 99.1 ~ 100 사이 숫자
4. 부적 안치 및 개운 비결: 소원 성취를 위해 부적을 어떻게 지니고 실천해야 하는지 핵심 팁`;

      const aiText = await requestAiAnalysis(
        '천명원 정통 칙령 부적 축원 및 영험 각인',
        prompt,
        settings
      );

      setAiBlessingResult({
        title: `${config.targetName}님을 위한 ${preset.title} 신령 축원 각인 완료`,
        incantation: `천지신명 옥황상제 칙령, ${config.targetName}님의 소원 "${config.wishSentence || preset.shortWish}"을 신성히 받드사, 흉액은 소멸하고 정통 칙령의 영험이 충만하라. 급급여률령!`,
        blessingText: aiText || preset.incantation,
        spiritualPowerScore: 99.8,
        placementAdvice: '스마트폰 잠금화면, 지갑 속 붉은 종이 봉투, 침실 머리맡 또는 사업장 출입문 안쪽에 부착하여 매일 아침 경건한 마음으로 응시하세요.',
      });

      // Special gold consecration on canvas
      if (canvasRef.current) {
        const consecratedConfig = { ...config, inkColor: 'gold_cinnabar' as const };
        setConfig(consecratedConfig);
        const blessedUrl = renderTalismanToCanvas(canvasRef.current, consecratedConfig);
        setTalismanImage(blessedUrl);
      }
    } catch (e) {
      console.error(e);
      setAiBlessingResult({
        title: `${config.targetName}님을 위한 ${preset.title} 신령 각인`,
        incantation: preset.incantation,
        blessingText: `[천명원 영험 비전 축원] 천지신명의 서광이 임하시어 소원자 ${config.targetName}님의 앞길에 모든 장애가 걷히고 뜻하시는 바가 여의주를 얻은 용처럼 비상하게 됨을 칙령으로 선포합니다.`,
        spiritualPowerScore: 99.5,
        placementAdvice: '출력하여 지갑이나 다이어리에 넣으시거나 스마트폰 배경화면으로 간직하세요.',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveToHistory = () => {
    const preset = TALISMAN_PRESETS.find(p => p.type === config.type) || TALISMAN_PRESETS[0];
    saveHistoryItem({
      type: 'talisman',
      title: `${config.targetName}님의 ${preset.title}`,
      summary: `소원: "${config.wishSentence}" / 한자: ${preset.hanjaTitle} / 안료: ${config.inkColor}`,
      data: { config, image: talismanImage, aiBlessing: aiBlessingResult },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentPreset = TALISMAN_PRESETS.find(p => p.type === config.type) || TALISMAN_PRESETS[0];

  const filteredPresets = useMemo(() => {
    if (selectedCategory === 'all') return TALISMAN_PRESETS;
    return TALISMAN_PRESETS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Introduction */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${
        isDark ? 'bg-slate-900/90 border-amber-900/30' : 'bg-white border-stone-200'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-5 ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  천명원(天命院) 정통 칙령 영험부적(勅令 靈驗符籍)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                  비전 도감 실물 구현
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                정통 <strong>勅令(칙령)</strong> 수직 필서 · 삼태성(三台星) · 괴황지(槐黃紙) · 경면주사(鏡面朱砂) · 급급여률령(急急如律令) 완벽 탑재
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                  : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
              }`}
              title="부적 설정 및 캔버스를 초기 상태로 되돌립니다."
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>초기화</span>
            </button>

            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              isDark ? 'bg-amber-950/80 border-amber-600/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
            }`}>
              정통 칙령 12대 비전 부적
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              부적 분류 선택
            </label>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-serif-kr">
              선택된 부적: <strong>{currentPreset.title}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all' as const, label: '전체 (12)' },
              { id: '가정/인연' as const, label: '가정/인연 (4)' },
              { id: '학업/시험' as const, label: '학업/시험 (1)' },
              { id: '액막이/소멸' as const, label: '액막이/소멸 (3)' },
              { id: '재물/사업' as const, label: '재물/사업 (2)' },
              { id: '건강/심신' as const, label: '건강/심신 (2)' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Talisman Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
            {filteredPresets.map(p => {
              const isSelected = config.type === p.type;
              const isKeyAuthentic = [
                'home_departure',
                'exam',
                'litigation_ward',
                'gossip_ward',
                'noble_helper',
                'sobriety',
              ].includes(p.type);

              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => {
                    setConfig(prev => ({ 
                      ...prev, 
                      type: p.type,
                      wishSentence: p.shortWish 
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-600 to-amber-700 border-amber-400 text-white shadow-lg ring-2 ring-amber-500/50'
                      : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  {isKeyAuthentic && (
                    <span className="absolute -top-1.5 -right-1 text-[9px] px-1 py-0.2 rounded bg-red-600 text-white font-bold shadow-xs">
                      도감
                    </span>
                  )}
                  <div className="text-xs font-bold truncate">{p.title.split(' ')[0]}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                    {p.hanjaTitle.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current Preset Efficacy Details */}
          <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-amber-50/60 border-amber-200 text-amber-950'
          }`}>
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400">💡 {currentPreset.title}: </span>
              {currentPreset.description}
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              효능: {currentPreset.efficacy.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Inputs: Target Name & Custom Wish */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800/40">
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              소원자 성함 (부적 내에 직접 각인)
            </label>
            <input
              type="text"
              value={config.targetName}
              onChange={e => setConfig(prev => ({ ...prev, targetName: e.target.value }))}
              placeholder="예: 홍길동"
              className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              간절한 소원 문구 (부적 비문 합성)
            </label>
            <input
              type="text"
              value={config.wishSentence}
              onChange={e => setConfig(prev => ({ ...prev, wishSentence: e.target.value }))}
              placeholder="예: 귀가안심 가족화합 가출영절"
              className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            />
          </div>
        </div>

        {/* Material & Style Customizer */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t text-xs ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>전통 부적지:</span>
            <select
              value={config.paperTexture}
              onChange={e => setConfig(prev => ({ ...prev, paperTexture: e.target.value as any }))}
              className={`border rounded-lg px-2.5 py-1.5 font-medium ${
                isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-stone-50 border-stone-300 text-stone-800'
              }`}
            >
              <option value="vintage_hanji">명문 괴황지(槐黃紙 - 정통 황금 한지)</option>
              <option value="crimson_silk">단청 주사비단(朱砂絹 - 궁중 비단)</option>
              <option value="dark_obsidian">현무 자금석(玄墨紙 - 흑요석 금박지)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>비전 안료:</span>
            <select
              value={config.inkColor}
              onChange={e => setConfig(prev => ({ ...prev, inkColor: e.target.value as any }))}
              className={`border rounded-lg px-2.5 py-1.5 font-medium ${
                isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-stone-50 border-stone-300 text-stone-800'
              }`}
            >
              <option value="red_cinnabar">경면주사(鏡面朱砂 - 정통 붉은 영물)</option>
              <option value="gold_cinnabar">금박주사(金箔朱砂 - 찬란한 황금 먹)</option>
              <option value="black_ink">오적현묵(烏賊玄墨 - 짙은 칠성 먹물)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className={`flex items-center gap-2 cursor-pointer font-medium ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              <input
                type="checkbox"
                checked={config.withStamp}
                onChange={e => setConfig(prev => ({ ...prev, withStamp: e.target.checked }))}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>천명원 옥새(天命院 靈印) 날인</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Talisman Display & Mystical Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Authentic Tall Korean Talisman Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className={`relative p-4 sm:p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center ${
            isDark ? 'bg-slate-950 border-amber-900/40 shadow-2xl' : 'bg-stone-100 border-stone-300 shadow-xl'
          }`}>
            {/* Glowing Aura Effect */}
            {isAuraActive && (
              <div className="absolute inset-0 rounded-3xl pointer-events-none animate-pulse bg-gradient-to-r from-red-600/15 via-amber-500/20 to-red-600/15 blur-xl -z-10" />
            )}

            {/* Canvas Frame with traditional aspect ratio */}
            <div className={`relative p-2 rounded-2xl border shadow-2xl transition-all ${
              isAuraActive 
                ? 'border-amber-500/70 shadow-amber-500/20 ring-4 ring-amber-500/10' 
                : 'border-stone-400/40'
            }`}>
              <canvas
                ref={canvasRef}
                width={360}
                height={760}
                className="rounded-xl shadow-2xl max-w-full h-auto w-[280px] sm:w-[320px] md:w-[340px]"
              />

              {/* Dynamic Writing Overlay Status */}
              {isDrawingAnimation && (
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2.5 rounded-xl bg-amber-950/95 border border-amber-500 text-amber-200 text-xs font-bold flex items-center gap-2.5 shadow-2xl">
                    <Wand2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>신령 필서 각인 시연 중...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Interactive Toggles under Canvas */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={handleSimulateDrawing}
                disabled={isDrawingAnimation}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300'
                    : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800 shadow-xs'
                }`}
                title="삼태성부터 칙령, 부신, 급급여률령까지 붓글씨로 한 획 한 획 써내려가는 과정을 시연합니다."
              >
                <Play className="w-3.5 h-3.5 text-amber-500" />
                <span>붓글씨 필서 시연</span>
              </button>

              <button
                onClick={() => setIsAuraActive(!isAuraActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isAuraActive
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-400'
                      : 'bg-white border-stone-300 text-stone-600'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-yellow-300" />
                <span>영험 화광(火光) {isAuraActive ? '켜짐' : '꺼짐'}</span>
              </button>

              <button
                onClick={handleToggleChant}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSpeaking
                    ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                    : isDark
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                      : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800 shadow-xs'
                }`}
                title="천명원 비전 축원문과 급급여률령 주문을 낭독합니다."
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-yellow-300" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isSpeaking ? '축원 낭독 중지' : '신성 축원문 낭독'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions, AI Consecration, and Illustrated Guide */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action: Download & Save */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>정통 칙령 부적 다운로드 (.PNG)</span>
            </button>

            <button
              onClick={handleSaveToHistory}
              className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
              <span>{savedSuccess ? '부적함에 보관됨!' : '히스토리 부적함 저장'}</span>
            </button>
          </div>

          {/* AI Consecration Blessing */}
          <div className={`p-5 rounded-2xl border shadow-lg space-y-3 transition-colors ${
            isDark 
              ? 'bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/50 border-purple-900/40' 
              : 'bg-gradient-to-r from-purple-50 via-white to-amber-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className={`text-sm font-bold font-serif-kr ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                  천명원 AI 신령 축원 & 금박 영험 각인 (API 연동)
                </h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isDark ? 'bg-purple-950 border-purple-600/50 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-800'
              }`}>
                Gemini AI 연동
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
              의뢰인 <strong>{config.targetName || '소원자'}</strong>님의 간절한 발원(<strong>"{config.wishSentence || currentPreset.shortWish}"</strong>)에 맞추어, 천지신명 소명 축원문과 도교 옥추경 비전 주문을 AI 심층 각인하고 황금 먹으로 축성합니다.
            </p>

            <button
              onClick={handleGenerateAiBlessing}
              disabled={isAiGenerating}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 via-indigo-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>천지신명 소명 및 영험 각인 의식 진행 중...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-yellow-300" />
                  <span>AI 신령 축원 및 금박 영험 각인 실행</span>
                </>
              )}
            </button>
          </div>

          {/* AI Consecration Result Display */}
          {aiBlessingResult && (
            <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
              isDark ? 'bg-slate-900/90 border-amber-500/40 shadow-xl' : 'bg-white border-amber-300 shadow-md'
            }`}>
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className={`text-xs font-bold font-serif-kr ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  ✨ {aiBlessingResult.title}
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  영험도 {aiBlessingResult.spiritualPowerScore}%
                </span>
              </div>

              <div className={`p-3.5 rounded-xl border font-serif-kr text-xs leading-relaxed ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-amber-100/90' : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}>
                <div className="font-bold text-[11px] mb-1 text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>천명원 신령 비전 축원문</span>
                </div>
                {aiBlessingResult.blessingText}
              </div>

              <div className={`p-3 rounded-xl border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">💡 부적 보관 및 개운 비책: </span>
                {aiBlessingResult.placementAdvice}
              </div>
            </div>
          )}

          {/* Authentic Anatomy: 符頭·符身·符脚 */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>정통 칙령 영험부적의 3대 구조(符頭 · 符身 · 符脚)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="font-bold text-amber-600 dark:text-amber-400 mb-0.5">1. 부두 (符頭)</div>
                삼태성(三台星)과 수직 필서 <strong>勅令(칙령)</strong>으로 하늘의 절대적 명령과 신명을 소환합니다.
              </div>
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="font-bold text-amber-600 dark:text-amber-400 mb-0.5">2. 부신 (符身)</div>
                뇌전문(雷電門)과 도교 비전 룬문자로 12가지 목적별 핵심 영험과 소망을 봉인합니다.
              </div>
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="font-bold text-amber-600 dark:text-amber-400 mb-0.5">3. 부각 (符脚)</div>
                <strong>急急如律令</strong>과 삼차극(三叉戟), 천명원 옥새(玉璽)로 기운이 새지 않도록 굳게 결속합니다.
              </div>
            </div>
          </div>

          {/* Authentic Talisman Reference Guide (도감 수록 영험부적 안내) */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>도감 수록 정통 칙령 영험부적 8선 상세 해설</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { name: '가출방지부', hanja: '家出防止符', desc: '배우자, 가족, 자녀의 가출 및 방황을 막고 조속히 귀가케 함' },
                { name: '공부부', hanja: '工夫符', desc: '수험생 집중력 극대화, 두뇌 총명, 국가고시 및 수능 필승 합격' },
                { name: '관재소멸부', hanja: '官災消滅符', desc: '경찰·법원 소송, 벌금, 송사 및 형사·민사 관재구설을 소멸' },
                { name: '구설방지부', hanja: '口舌防止符', desc: '악성 험담, 모함, 직장 내 시비와 훼방을 차단하고 명예 보호' },
                { name: '귀인협조부', hanja: '貴人協助符', desc: '사방에서 유력 조력자와 투자자, 천을귀인이 나타나 협조' },
                { name: '금주부', hanja: '禁酒符', desc: '과도한 음주와 술주정을 단호히 끊고 주독 해소 및 심신 평온' },
                { name: '대재용출부', hanja: '大財湧出符', desc: '사방 천하의 황금과 보화가 마르지 않고 금고에 가득 차오름' },
                { name: '벽사삼재부', hanja: '辟邪三災符', desc: '삼재팔난과 악귀, 흉살을 사십팔신장 벼락검으로 격퇴' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400">{item.name}</span>
                    <span className="text-[10px] text-stone-400 font-serif-kr">{item.hanja}</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
