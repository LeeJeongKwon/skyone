/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  UserCheck, 
  Calendar, 
  FileSignature, 
  ScrollText, 
  Coins, 
  Sun, 
  Key, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  History, 
  ChevronRight, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AppSettings } from './types';
import { 
  loadSettings, 
  saveSettings, 
  resetAllExceptApiKeys, 
  resetFactory, 
  exportAllSettingsToFile, 
  importAllSettingsFromFile,
  exportApiKeysToFile,
  importApiKeysFromFile
} from './utils/storage';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { ApiLogsModal } from './components/ApiLogsModal';
import { SajuTab } from './components/SajuTab';
import { FaceTab } from './components/FaceTab';
import { FengShuiTab } from './components/FengShuiTab';
import { DateTab } from './components/DateTab';
import { NamingTab } from './components/NamingTab';
import { TalismanTab } from './components/TalismanTab';
import { DivinationTab } from './components/DivinationTab';
import { DailyTab } from './components/DailyTab';

type TabType = 'home' | 'saju' | 'face' | 'fengshui' | 'date' | 'naming' | 'talisman' | 'divination' | 'daily';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [globalBanner, setGlobalBanner] = useState<string | null>(null);

  const fileInputSettingsRef = React.useRef<HTMLInputElement>(null);
  const fileInputKeysRef = React.useRef<HTMLInputElement>(null);

  const isDark = settings.theme === 'dark';

  // Synchronize document dark class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const showNotificationBanner = (msg: string) => {
    setGlobalBanner(msg);
    setTimeout(() => setGlobalBanner(null), 4000);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Toggle theme (White mode default vs Dark mode)
  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated: AppSettings = { ...settings, theme: nextTheme };
    handleUpdateSettings(updated);
    showNotificationBanner(
      nextTheme === 'dark' 
        ? '🌙 다크 모드로 전환되었습니다.' 
        : '☀️ 화이트 모드로 전환되었습니다. (기본 모드)'
    );
  };

  // Toggle engine mode between offline and hybrid
  const handleToggleEngineMode = () => {
    const nextMode = settings.engineMode === 'offline' ? 'hybrid' : 'offline';
    const updated: AppSettings = { ...settings, engineMode: nextMode };
    handleUpdateSettings(updated);
    showNotificationBanner(
      nextMode === 'offline' 
        ? '🛡️ 자체 역학 엔진 모드로 전환되었습니다. (외부 API 사용 안 함)' 
        : '✨ AI 확장 모드로 전환되었습니다. (AI 심층 해설 연동)'
    );
  };

  // "초기화면 버튼을 누르면 초기로 가게 해줘"
  const handleResetToHome = () => {
    setCurrentTab('home');
    showNotificationBanner('초기 메인 화면으로 이동했습니다.');
  };

  // "api key 빼고, 모든것을 초기화 해주는 버튼을 만들어 줘"
  const handleResetExceptApiKeys = () => {
    const fresh = resetAllExceptApiKeys();
    setSettings(fresh);
    setCurrentTab('home');
    showNotificationBanner('🔑 API 키는 안전하게 보존되었으며, 모든 설정과 히스토리가 초기화되었습니다.');
  };

  const handleFactoryReset = () => {
    const defaultSet = resetFactory();
    setSettings(defaultSet);
    setCurrentTab('home');
    showNotificationBanner('⚠️ 공장 초기화가 완료되었습니다.');
  };

  // Export & Import Handlers for Quick Action Bar
  const handleExportAll = () => {
    exportAllSettingsToFile(settings);
    showNotificationBanner('전체 설정 백업 파일이 다운로드되었습니다.');
  };

  const handleImportAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importAllSettingsFromFile(file);
      handleUpdateSettings(imported);
      showNotificationBanner('전체 설정을 성공적으로 불러왔습니다.');
    } catch (err: any) {
      alert(err.message || '설정 파일 불러오기 실패');
    }
    if (fileInputSettingsRef.current) fileInputSettingsRef.current.value = '';
  };

  const handleExportKeys = () => {
    exportApiKeysToFile(settings.apiKeys);
    showNotificationBanner('API 키 전용 백업 파일이 다운로드되었습니다.');
  };

  const handleImportKeys = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedKeys = await importApiKeysFromFile(file);
      const updated: AppSettings = {
        ...settings,
        apiKeys: { ...settings.apiKeys, ...importedKeys },
      };
      handleUpdateSettings(updated);
      showNotificationBanner('API 키를 파일에서 성공적으로 불러왔습니다.');
    } catch (err: any) {
      alert(err.message || 'API 키 파일 불러오기 실패');
    }
    if (fileInputKeysRef.current) fileInputKeysRef.current.value = '';
  };

  const navItems = [
    { id: 'home' as const, label: '메인 홈', icon: Compass },
    { id: 'saju' as const, label: '사주명리', icon: Sparkles },
    { id: 'face' as const, label: '관상분석', icon: UserCheck },
    { id: 'fengshui' as const, label: '풍수지리', icon: Compass },
    { id: 'date' as const, label: '길일택일', icon: Calendar },
    { id: 'naming' as const, label: '작명·성명', icon: FileSignature },
    { id: 'talisman' as const, label: '소원부적', icon: ScrollText },
    { id: 'divination' as const, label: '주역·타로·꿈', icon: Coins },
    { id: 'daily' as const, label: '오늘의운세', icon: Sun },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors selection:bg-amber-500 selection:text-white ${
      isDark 
        ? 'bg-[#070a10] text-slate-100' 
        : 'bg-stone-100 text-stone-800'
    }`}>
      {/* Top Header */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onResetToHome={handleResetToHome}
        onToggleEngineMode={handleToggleEngineMode}
        onToggleTheme={handleToggleTheme}
        onOpenNotificationSetup={() => setCurrentTab('daily')}
      />

      {/* Global Toast Notification */}
      {globalBanner && (
        <div className={`border-b text-xs py-2 px-4 text-center font-medium shadow-md transition-all ${
          isDark 
            ? 'bg-amber-950/90 border-amber-600/50 text-amber-200' 
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          {globalBanner}
        </div>
      )}

      {/* Navigation Sub-header / Tabs */}
      <div className={`sticky top-[61px] z-30 backdrop-blur-md border-b px-4 transition-colors ${
        isDark 
          ? 'bg-slate-950/85 border-slate-800' 
          : 'bg-white/90 border-stone-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-1 py-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* TAB 1: HOME (Dashboard) */}
        {currentTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className={`relative rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden border transition-all ${
              isDark 
                ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/60 border-amber-900/40 text-white' 
                : 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/30 border-amber-200 text-stone-900 shadow-amber-100/50'
            }`}>
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isDark 
                    ? 'bg-amber-950/80 border-amber-600/50 text-amber-300' 
                    : 'bg-amber-100/80 border-amber-300 text-amber-900'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>자체 오프라인 역학 엔진 완비 · 설정에서 무료/유료 AI 확장 지원</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black font-serif-kr tracking-tight leading-tight">
                  하늘의 이치와 땅의 기운을 밝혀<br />
                  <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-500 bg-clip-text text-transparent">
                    당신의 운명을 활짝 꽃피우는 비책
                  </span>
                </h2>

                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  천명원(天命院)은 정통 사주명리학 만세력, 인상학 관상 분석, 24좌향 풍수지리 나경, 손 없는 날 택일, 성명학 81수리 작명, 맞춤 소원 부적과 주역 64괘를 한곳에 집약한 대한민국 최고의 종합 운명학 솔루션입니다.
                </p>

                {/* Quick Action Trigger Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentTab('saju')}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>사주명리 만세력 감정</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('face')}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                      isDark 
                        ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-indigo-500" />
                    <span>관상·인상학 분석</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('date')}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                      isDark 
                        ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <span>길일·손없는날 택일 달력</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('talisman')}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                      isDark 
                        ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs'
                    }`}
                  >
                    <ScrollText className="w-4 h-4 text-amber-500" />
                    <span>소원성취 부적 각인</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Screen Features Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-base sm:text-lg font-bold font-serif-kr flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-stone-900'
                }`}>
                  <span>천명원 핵심 운명학 분석실</span>
                </h3>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>원하시는 분야를 클릭하여 즉시 감정하세요</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    tab: 'saju' as const,
                    title: '사주명리학 (四柱命理)',
                    desc: '생년월일시 4기둥 만세력, 오행 상생상극, 십신 및 용신·희신 분석',
                    icon: '🔮',
                    badge: '정통 만세력',
                    color: 'border-emerald-600/30 hover:border-emerald-500',
                  },
                  {
                    tab: 'face' as const,
                    title: '관상학 (觀相學)',
                    desc: '삼정(초년·중년·말년), 십이궁, 이마·코·눈·입술 부위별 길흉 감정',
                    icon: '👤',
                    badge: '카메라·사진 비전',
                    color: 'border-indigo-600/30 hover:border-indigo-500',
                  },
                  {
                    tab: 'fengshui' as const,
                    title: '풍수지리 (風水地理)',
                    desc: '24좌향 가상 나경 컴퍼스, 침대·책상·현관 가구 배치 및 생기 처방',
                    icon: '🧭',
                    badge: '패철 컴퍼스',
                    color: 'border-amber-600/30 hover:border-amber-500',
                  },
                  {
                    tab: 'date' as const,
                    title: '길일 택일 (擇日)',
                    desc: '이사(손 없는 날), 혼례, 개업, 계약 목적별 최적의 황도길일과 길시 달력',
                    icon: '📅',
                    badge: '손 없는 날 달력',
                    color: 'border-cyan-600/30 hover:border-cyan-500',
                  },
                  {
                    tab: 'naming' as const,
                    title: '작명·성명학 (姓名學)',
                    desc: '81수리 원형이정 4격 수리 감정 및 사주 부족 오행을 채우는 대길 작명',
                    icon: '✍️',
                    badge: '81수리 원형이정',
                    color: 'border-rose-600/30 hover:border-rose-500',
                  },
                  {
                    tab: 'talisman' as const,
                    title: '소원성취 부적 (靈符)',
                    desc: '재물유입부, 만사형통부, 합격기원부 디지털 각인 및 AI 이미지 생성',
                    icon: '📜',
                    badge: '고화질 다운로드',
                    color: 'border-yellow-600/30 hover:border-yellow-500',
                  },
                  {
                    tab: 'divination' as const,
                    title: '주역·타로·꿈해몽',
                    desc: '주역 64괘 산통/동전점, 3-카드 타로 스프레드, 300+ 꿈해몽 사전',
                    icon: '☯️',
                    badge: '동전점 & 타로',
                    color: 'border-purple-600/30 hover:border-purple-500',
                  },
                  {
                    tab: 'daily' as const,
                    title: '매일 운세 & 알림',
                    desc: '오늘의 일진, 행운의 색상·숫자·방위 및 브라우저 매일 알림 설정',
                    icon: '☀️',
                    badge: '일일 알림 연동',
                    color: 'border-amber-600/30 hover:border-amber-500',
                  },
                ].map(card => (
                  <div
                    key={card.tab}
                    onClick={() => setCurrentTab(card.tab)}
                    className={`p-5 rounded-2xl border ${card.color} cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group space-y-3 ${
                      isDark ? 'bg-slate-900/80 text-white' : 'bg-white text-stone-900 border-stone-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{card.icon}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-600 font-medium'
                      }`}>
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold font-serif-kr group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {card.title}
                      </h4>
                      <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                        {card.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-1">
                      <span>분석 시작하기</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Settings & Reset Control Bar on Main Screen (User requirement) */}
            <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200 shadow-md'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
                isDark ? 'border-slate-800' : 'border-stone-200'
              }`}>
                <div>
                  <h4 className={`text-sm font-bold font-serif-kr flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-stone-900'
                  }`}>
                    <Key className="w-4 h-4 text-amber-500" />
                    <span>메인 환경설정 백업 및 초기화 제어대</span>
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    모든 설정과 API 키를 파일로 내보내거나 불러올 수 있으며, API 키를 안전하게 보존한 채 초기화할 수 있습니다.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-xs"
                  >
                    설정창 열기
                  </button>
                </div>
              </div>

              {/* Fast Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. All Settings Export */}
                <button
                  onClick={handleExportAll}
                  className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Download className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>전체 설정 내보내기</div>
                    <div className="text-[10px] text-stone-400">통합 JSON 백업 파일 저장</div>
                  </div>
                </button>

                {/* 2. All Settings Import */}
                <label className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}>
                  <Upload className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>전체 설정 불러오기</div>
                    <div className="text-[10px] text-stone-400">백업 파일에서 일괄 복원</div>
                  </div>
                  <input
                    ref={fileInputSettingsRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportAll}
                    className="hidden"
                  />
                </label>

                {/* 3. API Key Only Export */}
                <button
                  onClick={handleExportKeys}
                  className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Key className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>API 키 파일 내보내기</div>
                    <div className="text-[10px] text-stone-400">키 정보만 안전하게 백업</div>
                  </div>
                </button>

                {/* 4. Reset All Except API keys (Crucial User Requirement) */}
                <button
                  onClick={handleResetExceptApiKeys}
                  className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                    isDark 
                      ? 'bg-amber-950/40 border-amber-700/60 hover:bg-amber-900/50' 
                      : 'bg-amber-50 border-amber-300 hover:bg-amber-100'
                  }`}
                  title="API 키는 절대 지우지 않고 히스토리와 설정만 초기화"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-200">API키 빼고 초기화</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-300/70">키는 보존, 설정·기록 리셋</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAJU */}
        {currentTab === 'saju' && <SajuTab settings={settings} onOpenSettings={() => setIsSettingsOpen(true)} />}

        {/* TAB 3: FACE */}
        {currentTab === 'face' && <FaceTab settings={settings} />}

        {/* TAB 4: FENG SHUI */}
        {currentTab === 'fengshui' && <FengShuiTab settings={settings} />}

        {/* TAB 5: AUSPICIOUS DATE */}
        {currentTab === 'date' && <DateTab settings={settings} />}

        {/* TAB 6: NAMING */}
        {currentTab === 'naming' && <NamingTab settings={settings} />}

        {/* TAB 7: TALISMAN */}
        {currentTab === 'talisman' && <TalismanTab settings={settings} />}

        {/* TAB 8: DIVINATION (I-Ching / Tarot / Dream) */}
        {currentTab === 'divination' && <DivinationTab settings={settings} />}

        {/* TAB 9: DAILY FORTUNE & NOTIFICATIONS */}
        {currentTab === 'daily' && <DailyTab settings={settings} onUpdateSettings={handleUpdateSettings} />}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 px-4 mt-12 text-center text-xs transition-colors ${
        isDark 
          ? 'border-slate-900 bg-slate-950/80 text-slate-500' 
          : 'border-stone-200 bg-white text-stone-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className={`font-serif-kr font-bold ${isDark ? 'text-slate-400' : 'text-stone-700'}`}>천명원 (天命院)</span> · 대한민국 종합 운명학 비책 시스템
          </div>
          <div className={`flex items-center gap-4 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
            <button onClick={handleResetToHome} className="hover:text-amber-600 dark:hover:text-amber-400">초기화면</button>
            <button onClick={() => setIsLogsOpen(true)} className="hover:text-blue-600 dark:hover:text-blue-400">API 로그</button>
            <button onClick={() => setIsHistoryOpen(true)} className="hover:text-amber-600 dark:hover:text-amber-400">히스토리</button>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-amber-600 dark:hover:text-amber-400">환경설정</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
        onResetExceptApiKeys={handleResetExceptApiKeys}
        onFactoryReset={handleFactoryReset}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        theme={settings.theme}
      />

      <ApiLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        theme={settings.theme}
      />
    </div>
  );
}
