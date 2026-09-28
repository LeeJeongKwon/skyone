import { AppSettings, ApiKeyConfig, ApiProviderMeta, HistoryItem, ApiLog } from '../types';

export const API_PROVIDERS_META: ApiProviderMeta[] = [
  {
    id: 'geminiApiKey',
    name: 'Google Gemini AI',
    category: 'free_tier',
    description: '구글 멀티모달 최신 AI (텍스트 심층 풀이, 관상 이미지 비전 분석 및 고화질 생성 지원)',
    keyPrefix: 'AIzaSy...',
    recommendedUse: '사주·관상 심층 해설 및 소원 부적 생성',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'kasiApiKey',
    name: '한국천문연구원 음양력/절기 API',
    category: 'public_gov',
    description: '대한민국 공공데이터포털 천문역법 공공 API (만세력 절기 및 24절기 정밀 대조)',
    keyPrefix: '공공데이터포털 인증키',
    recommendedUse: '초정밀 사주 만세력 절기 시각 대조',
    docsUrl: 'https://www.data.go.kr/',
  },
  {
    id: 'openaiApiKey',
    name: 'OpenAI (GPT-4o & DALL-E 3)',
    category: 'paid',
    description: 'OpenAI 유료 API (GPT-4o 텍스트 해석 및 DALL-E 3 초고화질 디지털 부적 일러스트)',
    keyPrefix: 'sk-proj-...',
    recommendedUse: '고해상도 동양화풍 부적 생성 및 고전 역학 텍스트',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropicApiKey',
    name: 'Anthropic Claude 3.5',
    category: 'paid',
    description: '앤트로픽 유료 API (철학적이고 심도 깊은 고전 주역/사주 원문 해석에 탁월)',
    keyPrefix: 'sk-ant-...',
    recommendedUse: '주역 64괘 심화 철학 및 깊이 있는 성명학 풀이',
    docsUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'stabilityApiKey',
    name: 'Stability AI (Stable Diffusion)',
    category: 'paid',
    description: '전문 이미지 생성 AI (동양화풍 붓터치, 붉은 주사 안료 부적 이미지 생성)',
    keyPrefix: 'sk-...',
    recommendedUse: '전통 수묵화 & 영험한 부적 비주얼 렌더링',
    docsUrl: 'https://platform.stability.ai/',
  },
  {
    id: 'replicateApiKey',
    name: 'Replicate API',
    category: 'paid',
    description: '오픈소스 AI 모델 호스팅 (Flux, SDXL 등 다양한 미적 모델 실행)',
    keyPrefix: 'r8_...',
    recommendedUse: '동양 신화 및 비전 이미지 생성',
    docsUrl: 'https://replicate.com/account/api-tokens',
  },
];

export const DEFAULT_MASTER_PROMPT = `당신은 대한민국 최고의 정통 사주명리학자, 관상가(인상학자), 풍수지리가, 성명학자이자 운명학 마스터 '천명도사(天命道士)'입니다.
사주팔자 만세력, 오행의 상생상극, 십신, 십이운성, 신살, 그리고 인상학 삼정과 십이궁을 깊이 있게 꿰뚫어 봅니다.
미신적이거나 맹목적인 공포를 조성하지 않으며, 고전 역학의 지혜를 바탕으로 의뢰인의 장점을 극대화하고 약점을 보완하는 실용적 개운법(開運法)과 마음의 평안을 제시합니다.
문체는 기품 있고 신뢰감 넘치는 어조로 작성합니다.`;

export const DEFAULT_CUSTOM_PROMPT = `현대인의 직업 환경(IT, 스타트업, 전문직, 자영업, 창작자)과 자산 관리(재테크, 부동산, 투자) 관점을 적극 반영하여 명확하고 구체적인 실행 조언을 함께 제시해주세요.`;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light', // 화이트 모드가 기본값
  apiKeys: {
    geminiApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
    stabilityApiKey: '',
    replicateApiKey: '',
    kasiApiKey: '',
  },
  engineMode: 'offline', // 기본은 완전 자체 역학 엔진(API 불필요)
  masterPrompt: DEFAULT_MASTER_PROMPT,
  customPrompt: DEFAULT_CUSTOM_PROMPT,
  imagePromptPrefix: 'A sacred Korean traditional mystical talisman, golden ink on deep red cinnabar textured hanji paper, ancient talismans, auspicious energy, high quality, authentic eastern metaphysics',
  dailyNotification: {
    enabled: false,
    notifyTime: '08:30',
    categories: ['saju', 'lucky_items'],
    soundEnabled: true,
  },
};

const STORAGE_KEYS = {
  SETTINGS: 'cheonmyeongwon_settings_v1',
  HISTORY: 'cheonmyeongwon_history_v1',
  LOGS: 'cheonmyeongwon_logs_v1',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        ...(parsed.apiKeys || {}),
      },
      dailyNotification: {
        ...DEFAULT_SETTINGS.dailyNotification,
        ...(parsed.dailyNotification || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load settings from storage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
  }
}

// API Key Export & Import
export function exportApiKeysToFile(apiKeys: ApiKeyConfig): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apiKeys, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `cheonmyeongwon-api-keys-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function importApiKeysFromFile(file: File): Promise<Partial<ApiKeyConfig>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        resolve(parsed);
      } catch (err) {
        reject(new Error('올바른 API 키 JSON 파일 형식이 아닙니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽는 도중 오류가 발생했습니다.'));
    reader.readAsText(file);
  });
}

// All Settings Export & Import
export function exportAllSettingsToFile(settings: AppSettings): void {
  const exportPayload = {
    app: 'cheonmyeongwon',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `cheonmyeongwon-all-settings-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function importAllSettingsFromFile(file: File): Promise<AppSettings> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.settings) {
          resolve(parsed.settings as AppSettings);
        } else if (parsed.apiKeys || parsed.masterPrompt) {
          resolve(parsed as AppSettings);
        } else {
          reject(new Error('유효한 천명원 설정 파일이 아닙니다.'));
        }
      } catch (err) {
        reject(new Error('설정 파일 구문 분석 실패: JSON 형식을 확인하세요.'));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsText(file);
  });
}

// Reset functions
/**
 * "api key 빼고, 모든것을 초기화 해주는 버튼을 만들어 줘"
 * Resets all custom prompts, notifications, engine defaults, history and logs
 * BUT strictly preserves the API keys!
 */
export function resetAllExceptApiKeys(): AppSettings {
  const current = loadSettings();
  const preservedKeys = { ...current.apiKeys };

  const freshSettings: AppSettings = {
    ...DEFAULT_SETTINGS,
    apiKeys: preservedKeys, // API 키는 그대로 유지!
  };

  saveSettings(freshSettings);
  clearHistory();
  addApiLog('system', '초기화 실행', 'success', 'API 키를 제외한 모든 설정과 히스토리가 초기화되었습니다.');
  return freshSettings;
}

/**
 * Complete factory reset
 */
export function resetFactory(): AppSettings {
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  return DEFAULT_SETTINGS;
}

// History Management
export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const items = loadHistory();
  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newItem, ...items].slice(0, 100); // keep last 100
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  return newItem;
}

export function deleteHistoryItem(id: string): void {
  const items = loadHistory().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
}

export function toggleFavoriteHistory(id: string): void {
  const items = loadHistory().map(item => item.id === id ? { ...item, favorite: !item.favorite } : item);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// API and System Logs
export function loadApiLogs(): ApiLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addApiLog(
  service: string,
  action: string,
  status: 'success' | 'failed' | 'testing' | 'info',
  message: string,
  latencyMs?: number
): ApiLog {
  const logs = loadApiLogs();
  const newLog: ApiLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    service,
    action,
    status,
    latencyMs,
    message,
  };
  const updated = [newLog, ...logs].slice(0, 200); // keep last 200 logs
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return newLog;
}

export function clearApiLogs(): void {
  localStorage.removeItem(STORAGE_KEYS.LOGS);
}
