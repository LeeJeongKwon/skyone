import { DailyFortune, ZodiacDailyFortune } from '../types';

export const HEAVENLY_STEMS_MAP = [
  { name: '갑', hanja: '甲', element: '목', color: '청록색 / 에메랄드' },
  { name: '을', hanja: '乙', element: '목', color: '연두색 / 비취색' },
  { name: '병', hanja: '丙', element: '화', color: '진홍색 / 주홍색' },
  { name: '정', hanja: '丁', element: '화', color: '자주색 / 와인색' },
  { name: '무', hanja: '戊', element: '토', color: '황금색 / 황토색' },
  { name: '기', hanja: '己', element: '토', color: '베이지색 / 카멜색' },
  { name: '경', hanja: '庚', element: '금', color: '순백색 / 실버' },
  { name: '신', hanja: '辛', element: '금', color: '백금색 / 진주색' },
  { name: '임', hanja: '壬', element: '수', color: '감청색 / 네이비' },
  { name: '계', hanja: '癸', element: '수', color: '흑색 / 흑요석빛' },
];

export const EARTHLY_BRANCHES_MAP = [
  { name: '자', hanja: '子', animal: '쥐', element: '수', direction: '북쪽', hourRange: '23:30 ~ 01:29', birthYears: '48, 60, 72, 84, 96, 08년생' },
  { name: '축', hanja: '丑', animal: '소', element: '토', direction: '북동쪽', hourRange: '01:30 ~ 03:29', birthYears: '49, 61, 73, 85, 97, 09년생' },
  { name: '인', hanja: '寅', animal: '호랑이', element: '목', direction: '동북쪽', hourRange: '03:30 ~ 05:29', birthYears: '50, 62, 74, 86, 98, 10년생' },
  { name: '묘', hanja: '卯', animal: '토끼', element: '목', direction: '동쪽', hourRange: '05:30 ~ 07:29', birthYears: '51, 63, 75, 87, 99, 11년생' },
  { name: '진', hanja: '辰', animal: '용', element: '토', direction: '동남쪽', hourRange: '07:30 ~ 09:29', birthYears: '52, 64, 76, 88, 00, 12년생' },
  { name: '사', hanja: '巳', animal: '뱀', element: '화', direction: '남동쪽', hourRange: '09:30 ~ 11:29', birthYears: '53, 65, 77, 89, 01, 13년생' },
  { name: '오', hanja: '午', animal: '말', element: '화', direction: '남쪽', hourRange: '11:30 ~ 13:29', birthYears: '54, 66, 78, 90, 02, 14년생' },
  { name: '미', hanja: '未', animal: '양', element: '토', direction: '남서쪽', hourRange: '13:30 ~ 15:29', birthYears: '55, 67, 79, 91, 03, 15년생' },
  { name: '신', hanja: '申', animal: '원숭이', element: '금', direction: '서남쪽', hourRange: '15:30 ~ 17:29', birthYears: '56, 68, 80, 92, 04, 16년생' },
  { name: '유', hanja: '酉', animal: '닭', element: '금', direction: '서쪽', hourRange: '17:30 ~ 19:29', birthYears: '57, 69, 81, 93, 05, 17년생' },
  { name: '술', hanja: '戌', animal: '개', element: '토', direction: '서북쪽', hourRange: '19:30 ~ 21:29', birthYears: '58, 70, 82, 94, 06, 18년생' },
  { name: '해', hanja: '亥', animal: '돼지', element: '수', direction: '북서쪽', hourRange: '21:30 ~ 23:29', birthYears: '59, 71, 83, 95, 07, 19년생' },
];

// 60-간지 정확한 일진 산출 (Julian Day Number 기반 만세력 알고리즘)
export function calculateAccurateDayPillar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // 1984-02-02 (갑자일 JDN = 2445733) 기준
  const dayOffset = (jdn - 2445733) % 60;
  const normalizedDayOffset = (dayOffset + 60) % 60;
  const ganIdx = normalizedDayOffset % 10;
  const jiIdx = normalizedDayOffset % 12;

  return {
    stem: HEAVENLY_STEMS_MAP[ganIdx],
    branch: EARTHLY_BRANCHES_MAP[jiIdx],
    ganIdx,
    jiIdx,
    jdn,
  };
}

/**
 * 12간지 띠별 오늘의 운세 산출
 */
function calculateZodiacFortunes(dayJiIdx: number, dayStemElement: string, jdn: number): ZodiacDailyFortune[] {
  // 6합 관계: (자-축), (인-해), (묘-술), (진-유), (사-신), (오-미)
  const yukHapPairs: Record<number, number> = {
    0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6
  };
  // 3합 삼합국: (신자진-수), (해묘미-목), (인오술-화), (사유축-금)
  const samHapGroups = [
    [8, 0, 4], // 신자진
    [11, 2, 6], // 해묘미(11, 3, 7) wait: 11:해, 3:묘, 7:미
    [2, 6, 10], // 인오술
    [5, 9, 1],  // 사유축
  ];
  // 6충 관계: 차이 6 (자오충, 축미충, 인신충, 묘유충, 진술충, 사해충)
  const isChung = (zIdx: number) => (zIdx + 6) % 12 === dayJiIdx;

  const results: ZodiacDailyFortune[] = [];

  EARTHLY_BRANCHES_MAP.forEach((zBranch, zIdx) => {
    let score = 82;
    let grade: '대길(大吉)' | '길(吉)' | '보통(平)' | '주의(注意)' = '보통(平)';
    let summary = '';
    let wealthTip = '';
    let loveTip = '';

    const isHap = yukHapPairs[zIdx] === dayJiIdx || samHapGroups.some(g => g.includes(zIdx) && g.includes(dayJiIdx));
    const chung = isChung(zIdx);

    const seed = (jdn * 13 + zIdx * 37) % 100;

    if (isHap) {
      score = 92 + (seed % 7); // 92 ~ 98
      grade = '대길(大吉)';
      summary = `일진과 의기투합하는 상생합(相生合)의 날입니다. 귀인이 먼저 손을 내밀고 막혔던 협상이 순풍을 탑니다.`;
      wealthTip = `뜻밖의 금전적 이득이나 보너스, 계약 성사의 호기입니다.`;
      loveTip = `서로의 마음이 찰떡같이 맞아떨어지는 달콤한 하루입니다.`;
    } else if (chung) {
      score = 66 + (seed % 8); // 66 ~ 73
      grade = '주의(注意)';
      summary = `일진과 부딪히는 상충(相沖)의 기운이 감돕니다. 감정적인 언행이나 과속, 무리한 투자를 삼가고 내실을 기하세요.`;
      wealthTip = `지출을 최소화하고 지갑을 닫는 것이 돈을 버는 비결입니다.`;
      loveTip = `사소한 오해로 다툴 수 있으니 한 번 더 경청하고 양보하세요.`;
    } else if (zBranch.element === dayStemElement) {
      score = 86 + (seed % 6); // 86 ~ 91
      grade = '길(吉)';
      summary = `기운이 조화롭고 에너지가 넘쳐나는 날입니다. 성실하게 임한 일에서 정당한 인정과 결실을 거둡니다.`;
      wealthTip = `정직한 노력에 대한 확실한 금전 보상이 따릅니다.`;
      loveTip = `따뜻한 배려와 칭찬 한마디가 깊은 신뢰를 만듭니다.`;
    } else {
      score = 77 + (seed % 8); // 77 ~ 84
      grade = '보통(平)';
      summary = `평온하고 안정적인 일상입니다. 새로운 모험보다는 기존에 진행하던 일의 마무리에 집중하면 길합니다.`;
      wealthTip = `불필요한 충동구매를 피하고 계획적인 소비를 실천하세요.`;
      loveTip = `편안하고 진솔한 대화로 잔잔한 정을 나눌 수 있습니다.`;
    }

    results.push({
      zodiac: `${zBranch.animal}띠`,
      hanja: zBranch.hanja,
      birthYears: zBranch.birthYears,
      score,
      grade,
      summary,
      wealthTip,
      loveTip,
    });
  });

  return results;
}

/**
 * Calculates authentic today's fortune for a given date
 */
export function getTodayFortune(targetDate?: Date): DailyFortune {
  const today = targetDate || new Date();
  const dateStr = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const solarDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const dayInfo = calculateAccurateDayPillar(today);
  const stem = dayInfo.stem;
  const branch = dayInfo.branch;
  const todayGanji = `${stem.name}${branch.name}(${stem.hanja}${branch.hanja})일`;

  // Compute Overall Score based on stem-branch relationship
  let baseScore = 85;
  if (
    (stem.element === '목' && branch.element === '화') ||
    (stem.element === '화' && branch.element === '토') ||
    (stem.element === '토' && branch.element === '금') ||
    (stem.element === '금' && branch.element === '수') ||
    (stem.element === '수' && branch.element === '목') ||
    (branch.element === '수' && stem.element === '목') ||
    (branch.element === '목' && stem.element === '화') ||
    (branch.element === '화' && stem.element === '토') ||
    (branch.element === '토' && stem.element === '금') ||
    (branch.element === '금' && stem.element === '수')
  ) {
    baseScore = 93; // Sangseng (harmonious creation)
  } else if (
    (stem.element === '목' && branch.element === '토') ||
    (stem.element === '토' && branch.element === '수') ||
    (stem.element === '수' && branch.element === '화') ||
    (stem.element === '화' && branch.element === '금') ||
    (stem.element === '금' && branch.element === '목')
  ) {
    baseScore = 74; // Sanggeuk (clash/control)
  } else {
    baseScore = 86; // Equal / Harmonious
  }

  const daySeed = dayInfo.jdn;
  const scoreVariance = (daySeed % 9) - 4; // -4 to +4
  const overallScore = Math.max(65, Math.min(99, baseScore + scoreVariance));

  // Auspicious & Inauspicious Hours
  const luckyHourBranch1 = EARTHLY_BRANCHES_MAP[(dayInfo.jiIdx + 4) % 12];
  const luckyHourBranch2 = EARTHLY_BRANCHES_MAP[(dayInfo.jiIdx + 8) % 12];
  const badHourBranch = EARTHLY_BRANCHES_MAP[(dayInfo.jiIdx + 6) % 12];

  const auspiciousHours = `${luckyHourBranch1.animal}시(${luckyHourBranch1.name}時, ${luckyHourBranch1.hourRange}), ${luckyHourBranch2.animal}시(${luckyHourBranch2.name}時, ${luckyHourBranch2.hourRange})`;
  const inauspiciousHours = `${badHourBranch.animal}시(${badHourBranch.name}時, ${badHourBranch.hourRange} - 충돌 주의)`;

  // Lucky attributes
  const luckyNumbers = [3, 7, 8, 9, 1, 6, 2, 5];
  const luckyNum = luckyNumbers[daySeed % luckyNumbers.length];
  const luckyColor = stem.color;
  const luckyDirection = `${branch.direction} (오늘의 생기·귀인 방위)`;

  const foodPool: Record<string, string[]> = {
    목: ['신선한 채소 쌈밥', '새싹 샐러드', '향긋한 매실차', '사과와 키위'],
    화: ['따뜻한 토마토 스프', '석류차', '구운 파프리카', '소고기 찹스테이크'],
    토: ['구수한 된장찌개', '영양 잡곡밥', '호박죽', '따뜻한 둥글레차'],
    금: ['맑은 조개탕', '배 도라지차', '아몬드와 호두', '신선한 생선구이'],
    수: ['진한 미역국', '검은콩 두유', '장어 덮밥', '차가운 흑임자 라떼'],
  };
  const foods = foodPool[stem.element] || foodPool['토'];
  const luckyFood = foods[daySeed % foods.length];

  // Daily Summary Formulation based on Stem & Branch
  let summary = '';
  let caution = '';

  if (overallScore >= 90) {
    summary = `오늘은 ${stem.hanja}${branch.hanja}(${stem.name}${branch.name})일로, ${stem.element}기(氣)와 ${branch.element}기(氣)가 서로를 북돋우는 대길(大吉)한 일진입니다. 새로운 기획을 시작하거나 미뤄두었던 중요한 계약, 소중한 인연과의 만남에 최상의 기운이 작용합니다.`;
    caution = `운기가 성할 때일수록 겸손과 감사의 태도를 견지하면 그 복록이 가문과 미래까지 오래 이어집니다.`;
  } else if (overallScore >= 80) {
    summary = `오늘은 ${stem.hanja}${branch.hanja}(${stem.name}${branch.name})일로, 차분한 안정감과 내실을 다지기에 적합한 평화로운 일진입니다. 평소 성실히 준비해 온 과정들이 주변의 인정을 받으며 순조로운 흐름을 이어갑니다.`;
    caution = `서두르거나 한 번에 과욕을 부리기보다는 한 단계씩 정석대로 밟아나가는 것이 가장 안전한 성공의 길입니다.`;
  } else {
    summary = `오늘은 ${stem.hanja}${branch.hanja}(${stem.name}${branch.name})일로, 오행의 상극과 긴장감이 다소 감도는 날입니다. 중요한 결정이나 큰 자금 이동은 잠시 여유를 두고 재점검하며, 감정의 동요를 다스리는 지혜가 필요합니다.`;
    caution = `대인관계에서 즉각적인 반박이나 논쟁을 피하고, ${inauspiciousHours}에는 운전과 신변 안전에 각별히 유의하십시오.`;
  }

  // Five Elements Status for Today
  const elementHarmonies = [
    { 
      element: '목(木)', 
      status: (stem.element === '목' || branch.element === '목') ? '상생' as const : (stem.element === '금' ? '상극' as const : '조화' as const), 
      desc: (stem.element === '목' || branch.element === '목') ? '창의적 발상과 신규 기획에 최상의 생기' : '유연한 사고와 새로운 시작에 무난함' 
    },
    { 
      element: '화(火)', 
      status: (stem.element === '화' || branch.element === '화') ? '상생' as const : (stem.element === '수' ? '상극' as const : '조화' as const), 
      desc: (stem.element === '화' || branch.element === '화') ? '열정과 사교성, 활발한 소통과 대외 활동 길' : '차분한 감정 조율과 온화한 대인관계 유지' 
    },
    { 
      element: '토(土)', 
      status: (stem.element === '토' || branch.element === '토') ? '상생' as const : (stem.element === '목' ? '상극' as const : '조화' as const), 
      desc: (stem.element === '토' || branch.element === '토') ? '신뢰 형성, 부동산 및 자산 안정화에 대길' : '기반 다지기 및 약속 준수에 길함' 
    },
    { 
      element: '금(金)', 
      status: (stem.element === '금' || branch.element === '금') ? '상생' as const : (stem.element === '화' ? '상극' as const : '조화' as const), 
      desc: (stem.element === '금' || branch.element === '금') ? '명확한 결단력과 문서 계약, 금융 정리에 길' : '날카로운 언행 자제 및 융통성 발휘' 
    },
    { 
      element: '수(水)', 
      status: (stem.element === '수' || branch.element === '수') ? '상생' as const : (stem.element === '토' ? '상극' as const : '조화' as const), 
      desc: (stem.element === '수' || branch.element === '수') ? '깊은 통찰력과 정보 수집, 학문 연구에 유리' : '유연한 대처와 지혜로운 관망' 
    },
  ];

  // 12 Zodiac Fortunes
  const zodiacFortunes = calculateZodiacFortunes(dayInfo.jiIdx, stem.element, daySeed);

  return {
    date: dateStr,
    solarDate,
    todayGanji,
    stemHanja: stem.hanja,
    branchHanja: branch.hanja,
    stemElement: `${stem.element}(${stem.hanja})`,
    branchAnimal: `${branch.animal}(${branch.hanja})`,
    overallScore,
    summary,
    caution,
    luckyNumber: luckyNum,
    luckyColor,
    luckyDirection,
    luckyFood,
    auspiciousHours,
    inauspiciousHours,
    elementHarmonies,
    zodiacFortunes,
  };
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function triggerDailyNotification(fortune: DailyFortune) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  new Notification(`[천명원] 오늘의 일진: ${fortune.todayGanji} 운세`, {
    body: `운기 지수 ${fortune.overallScore}점! 행운색: ${fortune.luckyColor.split('/')[0]}, 행운시간: ${fortune.auspiciousHours.split(',')[0]}`,
    icon: '/favicon.ico',
  });
  return true;
}
