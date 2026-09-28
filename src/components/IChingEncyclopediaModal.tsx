import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ICHING_64_DATABASE, HexagramData, EIGHT_TRIGRAMS } from '../utils/iching64Database';
import { getYaoDetail, getExtendedFortunes } from '../utils/ichingYaoData';

interface IChingEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onSelectHexagram?: (hex: HexagramData) => void;
}

export const IChingEncyclopediaModal: React.FC<IChingEncyclopediaModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onSelectHexagram,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrigram, setSelectedTrigram] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedHex, setSelectedHex] = useState<HexagramData | null>(null);

  const filteredHexagrams = useMemo(() => {
    return ICHING_64_DATABASE.filter(hex => {
      const matchesSearch = 
        !searchQuery.trim() ||
        hex.nameKr.includes(searchQuery.trim()) ||
        hex.nameHanja.includes(searchQuery.trim()) ||
        hex.num.toString() === searchQuery.trim() ||
        hex.judgment.includes(searchQuery.trim()) ||
        hex.symbolMeaning.includes(searchQuery.trim());

      const matchesTrigram = 
        selectedTrigram === 'all' || 
        hex.upperKey === selectedTrigram || 
        hex.lowerKey === selectedTrigram;

      const matchesGrade = 
        selectedGrade === 'all' || 
        hex.grade === selectedGrade;

      return matchesSearch && matchesTrigram && matchesGrade;
    });
  }, [searchQuery, selectedTrigram, selectedGrade]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDark 
            ? 'bg-slate-900 border-amber-900/40 text-slate-100' 
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-stone-200 bg-amber-50/50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-500 border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-kr flex items-center gap-2">
                <span>천명원 주역 64괘 전람 보감(周易 寶鑑)</span>
                <span className="text-xs font-normal text-amber-600 dark:text-amber-400">
                  총 64괘 수록
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                문왕 64괘 순서에 따른 정통 괘사와 상전, 효사 및 8대 운세 백과
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors ${
              isDark 
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300' 
                : 'border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-stone-100 bg-stone-50/80'}`}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="괘 번호, 괘명(예: 지천태, 건위천), 한자(泰), 상징 또는 괘사 검색..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Trigram Filters */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              <span className="text-stone-400 shrink-0 mr-1 text-[11px]">8괘 필터:</span>
              <button
                onClick={() => setSelectedTrigram('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                  selectedTrigram === 'all' 
                    ? 'bg-amber-600 text-white' 
                    : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                전체
              </button>
              {Object.entries(EIGHT_TRIGRAMS).map(([key, trigram]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTrigram(key)}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
                    selectedTrigram === key 
                      ? 'bg-amber-600 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  <span>{trigram.symbol}</span>
                  <span>{trigram.name}({trigram.nature.split('(')[0]})</span>
                </button>
              ))}
            </div>

            {/* Grade Filters */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-stone-400 mr-1 text-[11px]">길흉:</span>
              {['all', '대길(大吉)', '길(吉)', '평(平)', '주의(注意)', '험(險)'].map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors text-[11px] ${
                    selectedGrade === grade 
                      ? 'bg-amber-600 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                >
                  {grade === 'all' ? '전체' : grade.split('(')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {selectedHex ? (
            /* Detailed Dossier for Selected Hexagram */
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <button
                  onClick={() => setSelectedHex(null)}
                  className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>64괘 목록으로 돌아가기</span>
                </button>

                {onSelectHexagram && (
                  <button
                    onClick={() => {
                      onSelectHexagram(selectedHex);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>이 괘를 점괘로 불러오기</span>
                  </button>
                )}
              </div>

              {/* Hexagram Hero Banner */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'bg-slate-950/80 border-amber-900/30' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-3xl font-serif-kr font-bold text-amber-500">
                    {selectedHex.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h3 className="text-xl sm:text-2xl font-bold font-serif-kr">
                        {selectedHex.nameKr}
                      </h3>
                      <span className="text-base font-serif-kr text-amber-600 dark:text-amber-400">
                        ({selectedHex.nameHanja})
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>상괘: {EIGHT_TRIGRAMS[selectedHex.upperKey]?.nature} ({EIGHT_TRIGRAMS[selectedHex.upperKey]?.symbol})</span>
                      <span>·</span>
                      <span>하괘: {EIGHT_TRIGRAMS[selectedHex.lowerKey]?.nature} ({EIGHT_TRIGRAMS[selectedHex.lowerKey]?.symbol})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[11px] text-stone-400">길흉 등급</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {selectedHex.grade} ({selectedHex.score}점)
                    </span>
                  </div>
                </div>
              </div>

              {/* Judgment & Image Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                  <strong className="block text-amber-600 dark:text-amber-400 mb-1 font-serif-kr">
                    괘사(卦辭) - 문왕의 판정:
                  </strong>
                  <p className="leading-relaxed font-serif-kr">{selectedHex.judgment}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                  <strong className="block text-amber-600 dark:text-amber-400 mb-1 font-serif-kr">
                    상전(象傳) - 대자연의 비유:
                  </strong>
                  <p className="leading-relaxed font-serif-kr">{selectedHex.imageAdvice}</p>
                </div>
              </div>

              {/* 8 Extended Domain Fortunes */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                  8대 핵심 운세 영역별 정밀 풀이
                </h4>
                {(() => {
                  const ext = getExtendedFortunes(selectedHex);
                  const domains = [
                    { label: '사업 및 직무운', icon: '💼', text: selectedHex.fortuneAspects.career },
                    { label: '재물 및 투자운', icon: '💰', text: selectedHex.fortuneAspects.wealth },
                    { label: '애정 및 인연운', icon: '❤️', text: selectedHex.fortuneAspects.love },
                    { label: '건강 및 체력', icon: '🩺', text: selectedHex.fortuneAspects.health },
                    { label: '시험·승진·관운', icon: '🎓', text: ext.exam },
                    { label: '소송·시비·구설', icon: '⚖️', text: ext.litigation },
                    { label: '이동·이사·매매', icon: '🏡', text: ext.movement },
                    { label: '소원성취 최적기', icon: '⏳', text: ext.wishTiming },
                  ];

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {domains.map((dom, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-xl border flex gap-2.5 items-start ${
                            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                          }`}
                        >
                          <span className="text-base shrink-0">{dom.icon}</span>
                          <div>
                            <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                              {dom.label}
                            </span>
                            <p className="leading-relaxed opacity-90">{dom.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* 6-Line Yao-ci Inspector */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                  주공 6효 효사(周公 爻辭) 백과
                </h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map(pos => {
                    const upperTrigram = EIGHT_TRIGRAMS[selectedHex.upperKey];
                    const lowerTrigram = EIGHT_TRIGRAMS[selectedHex.lowerKey];
                    const allLines = [...lowerTrigram.lines, ...upperTrigram.lines];
                    const lineType = allLines[pos - 1];
                    const yao = getYaoDetail(selectedHex, pos, lineType, false);

                    return (
                      <div 
                        key={pos} 
                        className={`p-3 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-stone-50/70 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold font-serif-kr text-amber-600 dark:text-amber-400">
                            {yao.lineName} · {yao.classicalHanja}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            lineType === 'yang'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                          }`}>
                            {lineType === 'yang' ? '陽' : '陰'}
                          </span>
                        </div>
                        <p className="font-serif-kr opacity-90">{yao.koreanText}</p>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-1">
                          💡 <strong>처세 조언:</strong> {yao.actionGuidance}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Hexagram Grid View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                <span>검색 결과: <strong>{filteredHexagrams.length}</strong>개 괘</span>
                <span>카드를 클릭하면 정밀 해설을 열람할 수 있습니다.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredHexagrams.map(hex => (
                  <button
                    key={hex.num}
                    onClick={() => setSelectedHex(hex)}
                    className={`p-3.5 rounded-xl border text-left transition-all hover:scale-[1.01] hover:border-amber-500/50 flex flex-col justify-between gap-2 ${
                      isDark 
                        ? 'bg-slate-950/80 border-slate-800 text-slate-200' 
                        : 'bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                          제{hex.num}괘
                        </span>
                        <span className="text-[11px] opacity-75">
                          {hex.grade} · {hex.score}점
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-serif-kr flex items-center gap-1.5">
                        <span>{hex.nameKr}</span>
                        <span className="text-xs font-normal opacity-70">({hex.nameHanja})</span>
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {hex.symbolMeaning}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-slate-800 text-[11px] text-stone-400">
                      <span>{EIGHT_TRIGRAMS[hex.upperKey]?.symbol} {EIGHT_TRIGRAMS[hex.upperKey]?.nature.split('(')[0]} · {EIGHT_TRIGRAMS[hex.lowerKey]?.symbol} {EIGHT_TRIGRAMS[hex.lowerKey]?.nature.split('(')[0]}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
