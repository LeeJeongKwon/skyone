import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Star, 
  Trash2, 
  Calendar, 
  Search, 
  Eye, 
  Sparkles, 
  Download 
} from 'lucide-react';
import { HistoryItem } from '../types';
import { loadHistory, deleteHistoryItem, toggleFavoriteHistory, clearHistory } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistoryItem?: (item: HistoryItem) => void;
  theme?: 'light' | 'dark';
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectHistoryItem,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDetail, setSelectedDetail] = useState<HistoryItem | null>(null);

  const refreshHistory = () => {
    setItems(loadHistory());
  };

  useEffect(() => {
    if (isOpen) {
      refreshHistory();
      setSelectedDetail(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    refreshHistory();
    if (selectedDetail?.id === id) setSelectedDetail(null);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteHistory(id);
    refreshHistory();
  };

  const handleClearAll = () => {
    if (confirm('저장된 모든 분석 히스토리를 삭제하시겠습니까?')) {
      clearHistory();
      refreshHistory();
      setSelectedDetail(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeLabels: Record<string, { label: string; color: string }> = {
    saju: { label: '사주명리', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700' },
    face: { label: '관상분석', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-700' },
    fengshui: { label: '풍수지리', color: 'bg-amber-950/80 text-amber-300 border-amber-700' },
    date: { label: '길일택일', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-700' },
    naming: { label: '작명성명', color: 'bg-rose-950/80 text-rose-300 border-rose-700' },
    talisman: { label: '소원부적', color: 'bg-yellow-950/80 text-yellow-300 border-yellow-700' },
    iching: { label: '주역64괘', color: 'bg-purple-950/80 text-purple-300 border-purple-700' },
    tarot: { label: '신비타로', color: 'bg-violet-950/80 text-violet-300 border-violet-700' },
    dream: { label: '꿈해몽', color: 'bg-sky-950/80 text-sky-300 border-sky-700' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-stone-200 text-stone-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-stone-200 bg-stone-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-amber-950/80 border-amber-600/40 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-700'
            }`}>
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                운명학 분석 히스토리
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                과거에 수행한 사주, 관상, 풍수, 작명, 부적 기록 보관소 ({items.length}건)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/30' : 'border-stone-200 bg-stone-50/50'
        }`}>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-500' : 'text-stone-400'}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="제목, 요약 내용 검색..."
              className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600' 
                  : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-300' 
                  : 'bg-white border-stone-300 text-stone-700'
              }`}
            >
              <option value="all">전체 분석 분야</option>
              <option value="saju">사주명리</option>
              <option value="face">관상분석</option>
              <option value="fengshui">풍수지리</option>
              <option value="date">택일</option>
              <option value="naming">작명·성명학</option>
              <option value="talisman">소원부적</option>
              <option value="iching">주역 64괘</option>
              <option value="tarot">타로</option>
            </select>

            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border-slate-700' 
                    : 'bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border-stone-300'
                }`}
              >
                전체 삭제
              </button>
            )}
          </div>
        </div>

        {/* Body (List & Detail view) */}
        <div className={`flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
          isDark ? 'divide-slate-800' : 'divide-stone-200'
        }`}>
          {/* Items List */}
          <div className="p-4 space-y-2 overflow-y-auto max-h-[500px]">
            {filteredItems.length === 0 ? (
              <div className={`text-center py-16 text-xs ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                저장된 분석 히스토리가 없습니다. 사주나 관상, 부적 생성 후 '히스토리 저장' 버튼을 누르시면 여기에 기록됩니다.
              </div>
            ) : (
              filteredItems.map(item => {
                const badge = typeLabels[item.type] || { label: item.type, color: 'bg-slate-800 text-slate-300 border-slate-700' };
                const isSelected = selectedDetail?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDetail(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40'
                          : 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500/40'
                        : isDark
                          ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-stone-900'}`}>
                            {item.title}
                          </span>
                        </div>
                        <p className={`text-[11px] line-clamp-2 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                          {item.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleToggleFavorite(item.id, e)}
                          className={`p-1 rounded transition-colors ${
                            item.favorite 
                              ? 'text-amber-500' 
                              : isDark ? 'text-slate-600 hover:text-slate-400' : 'text-stone-400 hover:text-stone-600'
                          }`}
                          title={item.favorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className={`p-1 rounded transition-colors ${
                            isDark ? 'text-slate-600 hover:text-red-400 hover:bg-slate-800' : 'text-stone-400 hover:text-red-600 hover:bg-stone-100'
                          }`}
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 text-[10px] mt-2 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Item Detailed Preview */}
          <div className={`p-5 overflow-y-auto max-h-[500px] ${isDark ? 'bg-slate-950/20' : 'bg-stone-50/50'}`}>
            {selectedDetail ? (
              <div className="space-y-4">
                <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-stone-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {typeLabels[selectedDetail.type]?.label || selectedDetail.type}
                    </span>
                    <span className={isDark ? 'text-slate-500' : 'text-stone-400'}>·</span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      {new Date(selectedDetail.timestamp).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <h3 className={`text-base font-bold font-serif-kr mt-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {selectedDetail.title}
                  </h3>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-stone-200 text-stone-800'
                }`}>
                  {selectedDetail.summary}
                </div>

                {selectedDetail.data && (
                  <div className="space-y-2">
                    <h4 className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      분석 원문 데이터
                    </h4>
                    <pre className={`p-3 rounded-xl border text-[11px] overflow-x-auto max-h-48 font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-white border-stone-200 text-stone-600'
                    }`}>
                      {JSON.stringify(selectedDetail.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center text-center p-8 ${
                isDark ? 'text-slate-500' : 'text-stone-400'
              }`}>
                <Eye className="w-8 h-8 mb-2 opacity-40 text-amber-500" />
                <p className="text-xs">왼쪽 목록에서 기록을 선택하면 상세 분석 내용을 확인하실 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
