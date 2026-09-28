import React from 'react';
import { 
  Compass, 
  Settings, 
  History, 
  Activity, 
  Bell, 
  RotateCcw, 
  Sparkles, 
  Cpu, 
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenLogs: () => void;
  onResetToHome: () => void;
  onToggleEngineMode: () => void;
  onToggleTheme: () => void;
  onOpenNotificationSetup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenHistory,
  onOpenLogs,
  onResetToHome,
  onToggleEngineMode,
  onToggleTheme,
  onOpenNotificationSetup,
}) => {
  const isOffline = settings.engineMode === 'offline';
  const hasGeminiKey = Boolean(settings.apiKeys.geminiApiKey);
  const isDark = settings.theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      isDark 
        ? 'bg-slate-950/95 border-amber-900/30' 
        : 'bg-white/95 border-stone-200 shadow-xs'
    } px-4 py-3 sm:px-6`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Reset Home */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group"
          title="클릭 시 초기 메인 화면으로 이동합니다"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 p-0.5 shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
              isDark ? 'bg-slate-950 text-amber-400' : 'bg-white text-amber-700'
            }`}>
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-serif-kr tracking-tight bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-500 bg-clip-text text-transparent">
                천명원 (天命院)
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                isDark 
                  ? 'bg-amber-950/80 border-amber-600/40 text-amber-300' 
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}>
                종합 운명학 비책
              </span>
            </div>
            <p className={`text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              사주 · 관상 · 풍수 · 택일 · 작명 · 부적 · 주역 종합 솔루션
            </p>
          </div>
        </div>

        {/* Engine Mode & Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Theme Toggle Button (White Mode vs Dark Mode) */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-slate-800'
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs'
            }`}
            title={isDark ? '화이트 모드로 전환하기' : '다크 모드로 전환하기'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>화이트 모드</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>다크 모드</span>
              </>
            )}
          </button>

          {/* Engine Mode Toggle (Offline vs AI) */}
          <button
            onClick={onToggleEngineMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isOffline
                ? isDark
                  ? 'bg-slate-900/90 border-emerald-500/50 text-emerald-400 hover:bg-slate-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                : isDark
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200 shadow-xs'
            }`}
            title="엔진 모드 전환: 오프라인 자체 역학 알고리즘 또는 AI 확장 모드"
          >
            {isOffline ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">자체 역학엔진 (API 미사용)</span>
                <span className="sm:hidden">자체엔진</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">AI 확장 모드 ({hasGeminiKey ? '연동됨' : '키 필요'})</span>
                <span className="sm:hidden">AI모드</span>
              </>
            )}
          </button>

          {/* Reset To Home Button */}
          <button
            onClick={onResetToHome}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white' 
                : 'bg-white border-stone-300 hover:bg-stone-100 text-stone-700 shadow-xs'
            }`}
            title="초기 메인 화면으로 돌아가기"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>초기화면</span>
          </button>

          {/* History Modal Trigger */}
          <button
            onClick={onOpenHistory}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700 hover:border-amber-600/50 text-slate-300 hover:text-amber-200' 
                : 'bg-white border-stone-300 hover:bg-stone-100 text-stone-700 shadow-xs'
            }`}
            title="과거 분석 히스토리 보기"
          >
            <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">히스토리</span>
          </button>

          {/* API Logs & Status Trigger */}
          <button
            onClick={onOpenLogs}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-300' 
                : 'bg-white border-stone-300 hover:bg-stone-100 text-stone-700 shadow-xs'
            }`}
            title="API 상태 확인 및 실시간 로그 모니터링"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">API 상태·로그</span>
          </button>

          {/* Daily Notification Setup */}
          <button
            onClick={onOpenNotificationSetup}
            className={`p-1.5 rounded-lg text-xs font-medium border transition-colors relative ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700 hover:border-amber-500/50 text-slate-300' 
                : 'bg-white border-stone-300 hover:bg-stone-100 text-stone-700 shadow-xs'
            }`}
            title="매일 운세 알림 설정"
          >
            <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            {settings.dailyNotification.enabled && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white shadow-sm transition-all"
            title="API 키 입력, 프롬프트 추가, 설정 백업/초기화"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
