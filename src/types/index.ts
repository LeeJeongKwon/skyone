export type EngineMode = 'offline' | 'hybrid' | 'ai';

export interface ApiKeyConfig {
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  stabilityApiKey: string;
  replicateApiKey: string;
  kasiApiKey: string;
}

export type ApiProvider = keyof ApiKeyConfig;

export interface ApiProviderMeta {
  id: ApiProvider;
  name: string;
  category: 'free_tier' | 'paid' | 'public_gov';
  description: string;
  keyPrefix: string;
  recommendedUse: string;
  docsUrl: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  apiKeys: ApiKeyConfig;
  engineMode: EngineMode;
  masterPrompt: string;
  customPrompt: string;
  imagePromptPrefix: string;
  dailyNotification: {
    enabled: boolean;
    notifyTime: string; // e.g. "08:30"
    categories: ('saju' | 'tarot' | 'lucky_items' | 'fengshui')[];
    soundEnabled: boolean;
  };
}

export interface ApiLog {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  status: 'success' | 'failed' | 'testing' | 'info';
  latencyMs?: number;
  message: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: 'saju' | 'face' | 'fengshui' | 'date' | 'naming' | 'talisman' | 'iching' | 'tarot' | 'dream';
  title: string;
  summary: string;
  data: any;
  favorite?: boolean;
}

// Saju Types
export interface SajuPillar {
  gan: string; // 천간
  ji: string;  // 지지
  ganHanja: string;
  jiHanja: string;
  ganElement: '목' | '화' | '토' | '금' | '수';
  jiElement: '목' | '화' | '토' | '금' | '수';
  ganYinYang: '양' | '음';
  jiYinYang: '양' | '음';
  shipshin: string; // 십신
  twelveStage: string; // 십이운성
}

export interface SajuInput {
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or 'unknown'
  calendarType: 'solar' | 'lunar';
  isLeapMonth: boolean;
}

export interface SajuResult {
  input: SajuInput;
  fourPillars: {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    time: SajuPillar;
  };
  fiveElementsDistribution: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  dominantElement: string;
  lackingElement: string;
  yongshin: {
    primary: string; // 용신
    secondary: string; // 희신
    explanation: string;
  };
  spirits: string[]; // 신살 (천을귀인, 도화살 등)
  personality: string;
  wealthFortune: string;
  careerFortune: string;
  loveFortune: string;
  healthAdvice: string;
  daeunList: { age: number; ganji: string; periodFortune: string }[];
  currentYearFortune: string;
  aiEnhancedInterpretation?: string;
}

// Face Reading Types
export interface FaceAnalysisResult {
  imagePreviewUrl?: string;
  threeSections: {
    upper: { name: '상정(초년운)', score: number, description: string };
    middle: { name: '중정(중년운)', score: number, description: string };
    lower: { name: '하정(말년운)', score: number, description: string };
  };
  palaces: {
    name: string;
    hanja: string;
    location: string;
    status: '길(吉)' | '평(平)' | '주의(注意)';
    reading: string;
  }[];
  features: {
    forehead: string;
    eyes: string;
    nose: string;
    lips: string;
    chin: string;
    ears: string;
  };
  overallImpression: string;
  wealthIndex: number; // 0-100
  careerIndex: number; // 0-100
  relationshipIndex: number; // 0-100
  longevityIndex: number; // 0-100
  luckyFaceTips: string[];
  aiEnhancedNotes?: string;
}

// Feng Shui Types
export interface FengShuiInput {
  spaceType: 'home_living' | 'home_bedroom' | 'office_room' | 'store_entrance';
  doorDirection: string; // '동', '남', '서', '북' 등
  birthYear?: number;
  specificConcerns: string[];
}

export interface FengShuiResult {
  overallScore: number;
  spaceTypeTitle: string;
  directionAnalysis: {
    direction: string;
    element: string;
    energyQuality: '생기(生氣)' | '연년(延年)' | '천의(天醫)' | '절명(絶命)' | '화해(禍害)';
    explanation: string;
  };
  keyPlacements: {
    item: string;
    goodSpot: string;
    badSpot: string;
    tips: string;
  }[];
  cures: string[]; // 비보 풍수 처방 (식물, 거울, 조명, 색상)
  warningTaboos: string[];
}

// Auspicious Date Types
export interface DateSelectionInput {
  purpose: 'moving' | 'wedding' | 'opening' | 'contract' | 'exam' | 'travel';
  targetYearMonth: string; // YYYY-MM
  userBirthDate?: string;
}

export interface AuspiciousDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  ganji: string;
  score: number; // 1-100
  isBest: boolean;
  isNoGhostDay: boolean; // 손 없는 날
  auspiciousHours: string[]; // 길시
  features: string[];
  avoidActions: string[];
}

export interface DateSelectionResult {
  purposeLabel: string;
  targetMonth: string;
  bestDays: AuspiciousDay[];
  allDays: AuspiciousDay[];
  generalAdvice: string;
  tabooDirections: string[]; // 삼살방, 대장군방
}

// Naming Types
export interface NamingInput {
  lastName: string;
  currentFirstName?: string;
  gender: 'male' | 'female' | 'unisex';
  birthDate?: string;
  desiredMeanings?: string[];
  needElement?: '목' | '화' | '토' | '금' | '수' | 'auto';
}

export interface NameAnalysis {
  name: string;
  hanjaCandidates?: string;
  hangulElements: string; // 발음오행
  strokeCalculations: {
    won: { score: number; name: '원격(초년운)'; grade: string; explanation: string };
    hyung: { score: number; name: '형격(청년/주운)'; grade: string; explanation: string };
    yi: { score: number; name: '이격(장년운)'; grade: string; explanation: string };
    jung: { score: number; name: '정격(총운)'; grade: string; explanation: string };
  };
  soundHarmony: string;
  overallScore: number;
  strengths: string[];
  recommendationRating: '대길(大吉)' | '길(吉)' | '보통' | '부적합';
}

export interface NamingResult {
  currentAnalysis?: NameAnalysis;
  recommendedNames: {
    hangul: string;
    hanja: string;
    meaning: string;
    elementCompensation: string;
    score: number;
    grade: string;
  }[];
}

export type TalismanType =
  | 'wealth'          // 대재용출부 (재물/금전)
  | 'wishes_come_true'// 만사형통부 (소원성취)
  | 'exam'            // 공부부 / 합격등과부 (학업/시험)
  | 'home_departure'  // 가출방지부 (가정/귀소)
  | 'litigation_ward' // 관재소멸부 (송사/관재)
  | 'gossip_ward'     // 구설방지부 (시비/구설)
  | 'noble_helper'    // 귀인협조부 (인연/귀인)
  | 'sobriety'        // 금주부 (단주/절제)
  | 'health'          // 무병장수부 (건강/장수)
  | 'love'            // 양연성취부 (애정/화합)
  | 'evil_ward'       // 벽사삼재부 (액막이/삼재)
  | 'business_prosper';// 영업흥왕부 (사업/매출)

// Talisman Types
export interface TalismanConfig {
  type: TalismanType;
  targetName: string;
  wishSentence: string;
  inkColor: 'red_cinnabar' | 'gold_cinnabar' | 'black_ink';
  paperTexture: 'vintage_hanji' | 'crimson_silk' | 'dark_obsidian';
  withStamp: boolean;
}

export interface IChingLineDetail {
  position: number; // 1 to 6 (1: 초효, 6: 상효)
  name: string; // '초효(初爻)', '이효(二爻)', ...
  type: 'yin' | 'yang';
  isMoving: boolean; // 동효(변효) 여부
  value: number; // 6, 7, 8, 9
  stateName?: string; // '노음(老陰)', '소양(少陽)', '소음(少陰)', '노양(老陽)'
  coinValues?: [boolean, boolean, boolean];
  yaoText?: string;
  yaoAdvice?: string;
}

export interface IChingResult {
  question?: string;
  hexagramNumber: number;
  nameKr: string;
  nameHanja: string;
  symbolMeaning: string;
  upperTrigram: string;
  upperHanja: string;
  upperSymbol: string;
  lowerTrigram: string;
  lowerHanja: string;
  lowerSymbol: string;
  lines: ('yin' | 'yang')[];
  lineDetails?: IChingLineDetail[];
  judgment: string;
  imageAdvice: string;
  overallScore: number;
  grade: '대길(大吉)' | '길(吉)' | '평(平)' | '주의(注意)' | '험(險)';
  actionGuidance: string;
  fortuneAspects?: {
    wealth: string;
    career: string;
    love: string;
    health: string;
  };
  extendedFortunes?: {
    exam: string;
    litigation: string;
    movement: string;
    wishTiming: string;
  };
  movingLineSummary?: string;
  transformedHexagram?: {
    num: number;
    nameKr: string;
    nameHanja: string;
    summary: string;
    upperTrigram?: string;
    lowerTrigram?: string;
  };
}

export interface TarotCard {
  id: number;
  nameKr: string;
  nameEn: string;
  isUpright: boolean;
  meaning: string;
  keywords: string[];
  cardImageSymbol: string;
  imageUrl?: string;
}

export interface TarotSpreadResult {
  question: string;
  past: TarotCard;
  present: TarotCard;
  future: TarotCard;
  synthesis: string;
  advice: string;
}

export interface ZodiacDailyFortune {
  zodiac: string; // '쥐띠', '소띠', etc.
  hanja: string; // '子', '丑', etc.
  birthYears: string; // '48, 60, 72, 84, 96, 08년생'
  score: number;
  grade: '대길(大吉)' | '길(吉)' | '보통(平)' | '주의(注意)';
  summary: string;
  wealthTip: string;
  loveTip: string;
}

// Daily Fortune
export interface DailyFortune {
  date: string;
  solarDate: string; // YYYY-MM-DD
  todayGanji: string; // e.g. "갑자(甲子)일"
  stemHanja: string; // "甲"
  branchHanja: string; // "子"
  stemElement: string; // "목(木)"
  branchAnimal: string; // "쥐"
  overallScore: number;
  summary: string;
  caution: string;
  luckyNumber: number;
  luckyColor: string;
  luckyDirection: string;
  luckyFood: string;
  auspiciousHours: string;
  inauspiciousHours: string;
  elementHarmonies: { element: string; status: '상생' | '상극' | '조화'; desc: string }[];
  zodiacFortunes: ZodiacDailyFortune[];
}

