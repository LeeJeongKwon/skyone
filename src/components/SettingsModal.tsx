import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Key, 
  FileText, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Loader2, 
  Save,
  Sun,
  Moon
} from 'lucide-react';
import { AppSettings, ApiProvider } from '../types';
import { 
  API_PROVIDERS_META, 
  DEFAULT_MASTER_PROMPT, 
  DEFAULT_CUSTOM_PROMPT, 
  exportApiKeysToFile, 
  importApiKeysFromFile, 
  exportAllSettingsToFile, 
  importAllSettingsFromFile 
} from '../utils/storage';
import { testApiKey, TestKeyResult } from '../services/aiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onResetExceptApiKeys: () => void;
  onFactoryReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetExceptApiKeys,
  onFactoryReset,
}) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'prompts' | 'engine' | 'backup'>('keys');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestKeyResult & { loading?: boolean }>>({});
  const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const apiKeyFileInputRef = useRef<HTMLInputElement>(null);
  const allSettingsFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const isDark = localSettings.theme === 'dark';

  const showBanner = (type: 'success' | 'error' | 'info', text: string) => {
    setBannerMessage({ type, text });
    setTimeout(() => setBannerMessage(null), 4500);
  };

  const handleKeyChange = (provider: ApiProvider, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [provider]: value,
      },
    }));
  };

  const toggleShowKey = (provider: string) => {
    setShowKeyMap(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTestKey = async (provider: ApiProvider) => {
    const key = localSettings.apiKeys[provider];
    setTestResults(prev => ({ ...prev, [provider]: { loading: true, success: false, message: '검증 중...' } }));
    const result = await testApiKey(provider, key);
    setTestResults(prev => ({ ...prev, [provider]: { ...result, loading: false } }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    showBanner('success', '설정이 성공적으로 저장되었습니다.');
  };

  // Export & Import API keys
  const handleExportKeys = () => {
    exportApiKeysToFile(localSettings.apiKeys);
    showBanner('success', 'API 키 파일이 다운로드되었습니다.');
  };

  const handleImportKeys = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importApiKeysFromFile(file);
      const updatedKeys = { ...localSettings.apiKeys, ...imported };
      const updatedSettings = { ...localSettings, apiKeys: updatedKeys };
      setLocalSettings(updatedSettings);
      onSaveSettings(updatedSettings);
      showBanner('success', 'API 키를 파일에서 성공적으로 불러왔습니다.');
    } catch (err: any) {
      showBanner('error', err.message || 'API 키 파일 불러오기 실패');
    }
    if (apiKeyFileInputRef.current) apiKeyFileInputRef.current.value = '';
  };

  // Export & Import All settings
  const handleExportAll = () => {
    exportAllSettingsToFile(localSettings);
    showBanner('success', '전체 설정 백업 파일이 다운로드되었습니다.');
  };

  const handleImportAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedSettings = await importAllSettingsFromFile(file);
      setLocalSettings(importedSettings);
      onSaveSettings(importedSettings);
      showBanner('success', '전체 설정을 성공적으로 불러왔습니다.');
    } catch (err: any) {
      showBanner('error', err.message || '설정 파일 불러오기 실패');
    }
    if (allSettingsFileInputRef.current) allSettingsFileInputRef.current.value = '';
  };

  // Reset actions
  const handleResetExceptKeys = () => {
    if (confirm('API 키를 안전하게 보존하고, 마스터/커스텀 프롬프트, 분석 히스토리, 로그 등 모든 설정을 초기화하시겠습니까?')) {
      onResetExceptApiKeys();
      setLocalSettings(prev => ({
        ...prev,
        masterPrompt: DEFAULT_MASTER_PROMPT,
        customPrompt: DEFAULT_CUSTOM_PROMPT,
      }));
      showBanner('success', 'API 키는 보존되고 모든 설정과 히스토리가 초기화되었습니다.');
    }
  };

  const handleFactoryResetConfirm = () => {
    if (confirm('경고: API 키를 포함한 모든 설정과 데이터가 완전히 삭제됩니다. 공장 초기화를 진행하시겠습니까?')) {
      onFactoryReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all ${
        isDark ? 'bg-slate-900 border-amber-900/40 text-slate-100' : 'bg-white border-stone-200 text-stone-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-stone-200 bg-stone-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-amber-950/80 border-amber-600/40 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold font-serif-kr ${isDark ? 'text-white' : 'text-stone-900'}`}>
                환경 설정 및 API 키 관리
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                화이트/다크 테마, 무료/유료 API 키, 테스트, 맞춤 프롬프트 및 백업
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

        {/* Banner Alert */}
        {bannerMessage && (
          <div className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 ${
            bannerMessage.type === 'success' 
              ? isDark ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800' : 'bg-emerald-50 text-emerald-900 border-b border-emerald-200' 
              : bannerMessage.type === 'error'
              ? isDark ? 'bg-red-950/90 text-red-300 border-b border-red-800' : 'bg-red-50 text-red-900 border-b border-red-200'
              : isDark ? 'bg-blue-950/90 text-blue-300 border-b border-blue-800' : 'bg-blue-50 text-blue-900 border-b border-blue-200'
          }`}>
            {bannerMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{bannerMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className={`flex border-b px-6 gap-2 overflow-x-auto ${
          isDark ? 'border-slate-800 bg-slate-950/30' : 'border-stone-200 bg-stone-100/60'
        }`}>
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'keys'
                ? isDark ? 'border-amber-500 text-amber-300' : 'border-amber-600 text-amber-900 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API 키 관리 (무료/유료)</span>
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'prompts'
                ? isDark ? 'border-amber-500 text-amber-300' : 'border-amber-600 text-amber-900 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>마스터 & 추가 프롬프트</span>
          </button>
          <button
            onClick={() => setActiveTab('engine')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'engine'
                ? isDark ? 'border-amber-500 text-amber-300' : 'border-amber-600 text-amber-900 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>테마 · 엔진 · 알림</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? isDark ? 'border-amber-500 text-amber-300' : 'border-amber-600 text-amber-900 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>백업 · 복원 및 초기화</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: API KEYS */}
          {activeTab === 'keys' && (
            <div className="space-y-6">
              {/* Quick File Import/Export for API keys */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-amber-300">
                    API 키 전용 백업 & 불러오기
                  </h4>
                  <p className="text-xs text-slate-400">
                    입력된 모든 API 키를 별도 JSON 파일로 안전하게 내보내거나 불러올 수 있습니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportKeys}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>키 파일 내보내기</span>
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>키 파일 불러오기</span>
                    <input
                      ref={apiKeyFileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportKeys}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Provider List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {API_PROVIDERS_META.map(meta => {
                  const currentValue = localSettings.apiKeys[meta.id] || '';
                  const isVisible = showKeyMap[meta.id] || false;
                  const testStatus = testResults[meta.id];

                  const categoryBadges = {
                    free_tier: { label: '무료 티어 제공', bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' },
                    paid: { label: '유료 / 크레딧', bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300' },
                    public_gov: { label: '공공 API (무료)', bg: 'bg-sky-950/80 border-sky-500/40 text-sky-300' },
                  };

                  return (
                    <div 
                      key={meta.id}
                      className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-200">
                              {meta.name}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryBadges[meta.category].bg}`}>
                              {categoryBadges[meta.category].label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {meta.description}
                          </p>
                        </div>
                        <a
                          href={meta.docsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                          title="API 키 발급처 바로가기"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Input Box */}
                      <div className="relative">
                        <input
                          type={isVisible ? 'text' : 'password'}
                          value={currentValue}
                          onChange={(e) => handleKeyChange(meta.id, e.target.value)}
                          placeholder={`${meta.keyPrefix} 입력`}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 pr-16"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowKey(meta.id)}
                          className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 p-0.5"
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Test Action & Status */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleTestKey(meta.id)}
                          disabled={testStatus?.loading}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors disabled:opacity-50"
                        >
                          {testStatus?.loading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                              <span>테스트 중...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-amber-400" />
                              <span>API 키 테스트</span>
                            </>
                          )}
                        </button>

                        {/* Test Status feedback */}
                        {testStatus && !testStatus.loading && (
                          <div className={`text-xs flex items-center gap-1 ${testStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                            {testStatus.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            <span className="truncate max-w-[170px]" title={testStatus.message}>
                              {testStatus.message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROMPTS */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              {/* Master Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>마스터 프롬프트 (Master Metaphysics Prompt)</span>
                  </label>
                  <button
                    onClick={() => setLocalSettings(prev => ({ ...prev, masterPrompt: DEFAULT_MASTER_PROMPT }))}
                    className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    기본값 복원
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  사주, 관상, 풍수 등 모든 분석의 기본 세계관과 도사(道士) 페르소나를 정의합니다.
                </p>
                <textarea
                  rows={5}
                  value={localSettings.masterPrompt}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, masterPrompt: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                />
              </div>

              {/* Custom User Prompt Layer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>사용자 맞춤 추가 프롬프트 (User Custom Prompt)</span>
                  </label>
                  <button
                    onClick={() => setLocalSettings(prev => ({ ...prev, customPrompt: DEFAULT_CUSTOM_PROMPT }))}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    기본값 복원
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  마스터 프롬프트 외에 사용자가 원하는 특별한 관점(현대적 직업관, 주식/부동산 조언 등)을 자유롭게 덧붙입니다.
                </p>
                <textarea
                  rows={4}
                  value={localSettings.customPrompt}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                  placeholder="예: 현대 IT 스타트업 창업 관점에서 사주를 해석해주고, 구체적인 투자 실행 방안을 제안해줘."
                />
              </div>

              {/* Image Generation Prompt Prefix */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>디지털 부적 및 비주얼 이미지 생성 프롬프트 접두사</span>
                </label>
                <input
                  type="text"
                  value={localSettings.imagePromptPrefix}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, imagePromptPrefix: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ENGINE & NOTIFICATIONS */}
          {activeTab === 'engine' && (
            <div className="space-y-6">
              {/* Theme Selection Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-semibold ${isDark ? 'text-amber-300' : 'text-stone-900 font-bold'}`}>
                    화면 디자인 테마 선택
                  </h4>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${
                    !isDark 
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    기본값: 화이트 모드
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setLocalSettings(prev => ({ ...prev, theme: 'light' }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      localSettings.theme === 'light'
                        ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500 shadow-sm'
                        : isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <span>☀️ 화이트 모드 (기본값)</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      단아하고 정갈한 한국 전통 백자와 한지 미학의 밝고 깨끗한 화면 테마입니다.
                    </p>
                  </div>

                  <div
                    onClick={() => setLocalSettings(prev => ({ ...prev, theme: 'dark' }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      localSettings.theme === 'dark'
                        ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500 shadow-sm'
                        : isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-indigo-400">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>🌙 다크 모드</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      묵직하고 신비로운 흑요석과 먹빛 감성의 어두운 화면 테마입니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Engine Mode Selection */}
              <div className="space-y-3">
                <h4 className={`text-sm font-semibold ${isDark ? 'text-amber-300' : 'text-stone-900 font-bold'}`}>
                  프로그램 구동 엔진 모드
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setLocalSettings(prev => ({ ...prev, engineMode: 'offline' }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      localSettings.engineMode === 'offline'
                        ? isDark ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500' : 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                        : isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>자체 역학엔진 (API 미사용)</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      모든 사주 만세력, 오행 차트, 관상 삼정십이궁, 풍수 나경, 택일 계산을 외부 API 호출 없이 내장 정밀 알고리즘으로 즉각 실행합니다. (권장 기본값)
                    </p>
                  </div>

                  <div
                    onClick={() => setLocalSettings(prev => ({ ...prev, engineMode: 'hybrid' }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      localSettings.engineMode === 'hybrid'
                        ? isDark ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500' : 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                        : isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>AI 확장 심층 모드</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      자체 역학 엔진의 분석 결과에 추가로 설정된 AI 키(Gemini 등)를 연동하여 심층 해설과 맞춤 이미지를 생성합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily Notifications */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      매일 일일 운세 알림 기능
                    </h4>
                    <p className="text-xs text-slate-400">
                      지정한 시간에 오늘의 행운 숫자, 행운 색상, 조언을 브라우저 알림으로 발송합니다.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.dailyNotification.enabled}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      dailyNotification: { ...prev.dailyNotification, enabled: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                {localSettings.dailyNotification.enabled && (
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">발송 시각:</span>
                      <input
                        type="time"
                        value={localSettings.dailyNotification.notifyTime}
                        onChange={(e) => setLocalSettings(prev => ({
                          ...prev,
                          dailyNotification: { ...prev.dailyNotification, notifyTime: e.target.value }
                        }))}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESETS */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* All Settings Export/Import */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-semibold text-amber-300">
                  전체 설정 통합 백업 및 복원
                </h4>
                <p className="text-xs text-slate-400">
                  API 키, 마스터/커스텀 프롬프트, 알림 설정이 모두 포함된 통합 설정 백업 파일(.json)입니다.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleExportAll}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>전체 설정 내보내기 (.json)</span>
                  </button>
                  <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>전체 설정 파일 불러오기</span>
                    <input
                      ref={allSettingsFileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportAll}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset Section (Highlighting User's specific request) */}
              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>초기화 옵션</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    원하시는 범위에 따라 안전하게 초기화를 진행할 수 있습니다.
                  </p>
                </div>

                {/* Reset 1: API keys preserved (user's explicit requirement) */}
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-amber-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      🔑 API 키 유지 + 모든 설정 및 히스토리 초기화
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      입력하신 귀중한 API 키는 단 하나도 지우지 않고 그대로 보존하며, 프롬프트와 분석 기록만 초기화합니다.
                    </div>
                  </div>
                  <button
                    onClick={handleResetExceptKeys}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>API키 빼고 전체 초기화</span>
                  </button>
                </div>

                {/* Reset 2: Full factory reset */}
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-red-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-red-400">
                      ⚠️ 완전 공장 초기화 (API 키 포함)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      API 키를 포함하여 모든 데이터를 초기 상태로 복구합니다.
                    </div>
                  </div>
                  <button
                    onClick={handleFactoryResetConfirm}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 transition-colors flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>공장 초기화</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            모든 설정은 브라우저 안전 저장소에 즉시 보관됩니다.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>설정 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
