import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  Search 
} from 'lucide-react';
import { ApiLog } from '../types';
import { loadApiLogs, clearApiLogs, API_PROVIDERS_META } from '../utils/storage';

interface ApiLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const ApiLogsModal: React.FC<ApiLogsModalProps> = ({ isOpen, onClose, theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'testing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshLogs = () => {
    setLogs(loadApiLogs());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = 
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleClear = () => {
    if (confirm('모든 로그 기록을 삭제하시겠습니까?')) {
      clearApiLogs();
      setLogs([]);
    }
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cheonmyeongwon-api-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-stone-200 text-stone-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-stone-200 bg-stone-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-blue-950/80 border-blue-600/40 text-blue-400' : 'bg-blue-50 border-blue-300 text-blue-700'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                API 상태 모니터링 및 활동 로그
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                실시간 API 호출 상태, 응답 지연 시간 및 통신 로그 내역
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

        {/* Quick Providers Status Overview */}
        <div className={`px-6 py-3 border-b grid grid-cols-2 sm:grid-cols-3 gap-2 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-stone-50/50 border-stone-200'
        }`}>
          {API_PROVIDERS_META.slice(0, 6).map(p => {
            const hasRecentSuccess = logs.some(l => l.service.toLowerCase().includes(p.name.toLowerCase()) && l.status === 'success');
            return (
              <div key={p.id} className={`p-2 rounded-lg border flex items-center justify-between text-xs ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200'
              }`}>
                <span className={`font-medium truncate ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>{p.name.split(' ')[0]}</span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                  hasRecentSuccess 
                    ? isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' : 'text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold'
                    : isDark ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-stone-500 bg-stone-100 border-stone-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasRecentSuccess ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                  {hasRecentSuccess ? '정상' : '대기'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Controls Toolbar */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'border-slate-800 bg-slate-950/20' : 'border-stone-200 bg-stone-50/30'
        }`}>
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-500' : 'text-stone-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="서비스, 동작, 메시지 검색..."
                className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600' 
                    : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Filter buttons */}
            <div className={`flex items-center rounded-lg p-0.5 border text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-stone-100 border-stone-300'
            }`}>
              {(['all', 'success', 'failed', 'testing'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-1 rounded text-[11px] capitalize transition-colors ${
                    filterStatus === st 
                      ? 'bg-blue-600 text-white font-medium shadow-xs' 
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st === 'all' ? '전체' : st === 'success' ? '성공' : st === 'failed' ? '실패' : '테스트'}
                </button>
              ))}
            </div>

            <button
              onClick={refreshLogs}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
              }`}
              title="새로고침"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownload}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
              }`}
              title="로그 파일 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClear}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 border-slate-700' : 'bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 border-stone-300'
              }`}
              title="로그 지우기"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
              기록된 활동 로그가 없습니다. API 키 테스트나 분석을 실행하면 로그가 누적됩니다.
            </div>
          ) : (
            filteredLogs.map(log => {
              const statusBadges = {
                success: { 
                  text: '성공', 
                  color: isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' : 'text-emerald-700 bg-emerald-50 border-emerald-300 font-semibold' 
                },
                failed: { 
                  text: '실패', 
                  color: isDark ? 'text-red-400 bg-red-950/60 border-red-800' : 'text-red-700 bg-red-50 border-red-300 font-semibold' 
                },
                testing: { 
                  text: '검증', 
                  color: isDark ? 'text-amber-400 bg-amber-950/60 border-amber-800' : 'text-amber-800 bg-amber-50 border-amber-300 font-semibold' 
                },
                info: { 
                  text: '정보', 
                  color: isDark ? 'text-blue-400 bg-blue-950/60 border-blue-800' : 'text-blue-700 bg-blue-50 border-blue-300 font-semibold' 
                },
              };
              const badge = statusBadges[log.status] || statusBadges.info;

              return (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
                    isDark ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${badge.color}`}>
                      {badge.text}
                    </span>
                    <span className={`font-semibold truncate ${isDark ? 'text-slate-300' : 'text-stone-800'}`}>
                      [{log.service}] {log.action}
                    </span>
                    <span className={`truncate hidden md:inline ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      - {log.message}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 text-[11px] shrink-0 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                    {log.latencyMs !== undefined && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {log.latencyMs}ms
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString('ko-KR')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
