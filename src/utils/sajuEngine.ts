import { SajuInput, SajuPillar, SajuResult } from '../types';

export const HEAVENLY_STEMS = [
  { name: '갑', hanja: '甲', element: '목' as const, yinYang: '양' as const, color: '#10b981' },
  { name: '을', hanja: '乙', element: '목' as const, yinYang: '음' as const, color: '#34d399' },
  { name: '병', hanja: '丙', element: '화' as const, yinYang: '양' as const, color: '#ef4444' },
  { name: '정', hanja: '丁', element: '화' as const, yinYang: '음' as const, color: '#f87171' },
  { name: '무', hanja: '戊', element: '토' as const, yinYang: '양' as const, color: '#f59e0b' },
  { name: '기', hanja: '己', element: '토' as const, yinYang: '음' as const, color: '#fbbf24' },
  { name: '경', hanja: '庚', element: '금' as const, yinYang: '양' as const, color: '#94a3b8' },
  { name: '신', hanja: '辛', element: '금' as const, yinYang: '음' as const, color: '#cbd5e1' },
  { name: '임', hanja: '壬', element: '수' as const, yinYang: '양' as const, color: '#3b82f6' },
  { name: '계', hanja: '癸', element: '수' as const, yinYang: '음' as const, color: '#60a5fa' },
];

export const EARTHLY_BRANCHES = [
  { name: '자', hanja: '子', animal: '쥐', element: '수' as const, yinYang: '양' as const },
  { name: '축', hanja: '丑', animal: '소', element: '토' as const, yinYang: '음' as const },
  { name: '인', hanja: '寅', animal: '호랑이', element: '목' as const, yinYang: '양' as const },
  { name: '묘', hanja: '卯', animal: '토끼', element: '목' as const, yinYang: '음' as const },
  { name: '진', hanja: '辰', animal: '용', element: '토' as const, yinYang: '양' as const },
  { name: '사', hanja: '巳', animal: '뱀', element: '화' as const, yinYang: '음' as const },
  { name: '오', hanja: '午', animal: '말', element: '화' as const, yinYang: '양' as const },
  { name: '미', hanja: '未', animal: '양', element: '토' as const, yinYang: '음' as const },
  { name: '신', hanja: '申', animal: '원숭이', element: '금' as const, yinYang: '양' as const },
  { name: '유', hanja: '酉', animal: '닭', element: '금' as const, yinYang: '음' as const },
  { name: '술', hanja: '戌', animal: '개', element: '토' as const, yinYang: '양' as const },
  { name: '해', hanja: '亥', animal: '돼지', element: '수' as const, yinYang: '음' as const },
];

const ELEMENT_CYCLE = ['목', '화', '토', '금', '수'] as const;

// 십신 판별
function getShipshin(dayMasterGan: typeof HEAVENLY_STEMS[0], targetGan: typeof HEAVENLY_STEMS[0]): string {
  const dmIdx = ELEMENT_CYCLE.indexOf(dayMasterGan.element);
  const targetIdx = ELEMENT_CYCLE.indexOf(targetGan.element);
  const diff = (targetIdx - dmIdx + 5) % 5;
  const sameYinYang = dayMasterGan.yinYang === targetGan.yinYang;

  if (diff === 0) return sameYinYang ? '비견(比肩)' : '겁재(劫財)';
  if (diff === 1) return sameYinYang ? '식신(食神)' : '상관(傷官)';
  if (diff === 2) return sameYinYang ? '편재(偏財)' : '정재(正財)';
  if (diff === 3) return sameYinYang ? '편관(偏官)' : '정관(正官)';
  if (diff === 4) return sameYinYang ? '편인(偏印)' : '정인(正印)';
  return '비견(比肩)';
}

// 십이운성 산출
function getTwelveStage(dayMasterGan: string, branch: string): string {
  const stages = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
  // 간략 십이운성 매핑 테이블
  const baseMap: Record<string, number> = {
    갑: 11, 을: 6, 병: 2, 정: 9, 무: 2, 기: 9, 경: 8, 신: 3, 임: 5, 계: 0
  };
  const bIdx = EARTHLY_BRANCHES.findIndex(b => b.name === branch);
  const base = baseMap[dayMasterGan] ?? 0;
  const stageIdx = (bIdx + base) % 12;
  return stages[stageIdx] || '건록';
}

export function calculateSaju(input: SajuInput): SajuResult {
  const birth = new Date(input.birthDate);
  const year = birth.getFullYear();
  const month = birth.getMonth() + 1;
  const day = birth.getDate();

  // 1. 연주 계산 (입춘 기준 간략화 계산)
  // 갑자년 기준 offset (1984년이 갑자년 = 0)
  const yearOffset = (year - 1984) % 60;
  const normalizedYearOffset = (yearOffset + 60) % 60;
  const yearGanIdx = normalizedYearOffset % 10;
  const yearJiIdx = normalizedYearOffset % 12;
  const yearStem = HEAVENLY_STEMS[yearGanIdx];
  const yearBranch = EARTHLY_BRANCHES[yearJiIdx];

  // 2. 월주 계산 (월간은 연간에 의해 결정됨: 갑기지년 병인두)
  const monthJiIdx = (month + 1) % 12; // 인월=1월, 묘월=2월...
  const monthStartStemIdx = ((yearGanIdx % 5) * 2 + 2) % 10;
  const monthGanIdx = (monthStartStemIdx + (month - 1)) % 10;
  const monthStem = HEAVENLY_STEMS[monthGanIdx];
  const monthBranch = EARTHLY_BRANCHES[monthJiIdx];

  // 3. 일주 계산 (Julian Day 기반 정밀 일진)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  // 1984-02-02 JDN = 2445733 (갑자일)
  const dayOffset = (jdn - 2445733) % 60;
  const normalizedDayOffset = (dayOffset + 60) % 60;
  const dayGanIdx = normalizedDayOffset % 10;
  const dayJiIdx = normalizedDayOffset % 12;
  const dayStem = HEAVENLY_STEMS[dayGanIdx];
  const dayBranch = EARTHLY_BRANCHES[dayJiIdx];

  // 4. 시주 계산 (시간에 따른 지지 & 일간에 따른 시간: 갑기일 갑자시)
  let timeJiIdx = 0;
  if (input.birthTime && input.birthTime !== 'unknown') {
    const [hh] = input.birthTime.split(':').map(Number);
    // 자시: 23:30 ~ 01:29
    if (hh >= 23 || hh < 1) timeJiIdx = 0;
    else if (hh >= 1 && hh < 3) timeJiIdx = 1;
    else if (hh >= 3 && hh < 5) timeJiIdx = 2;
    else if (hh >= 5 && hh < 7) timeJiIdx = 3;
    else if (hh >= 7 && hh < 9) timeJiIdx = 4;
    else if (hh >= 9 && hh < 11) timeJiIdx = 5;
    else if (hh >= 11 && hh < 13) timeJiIdx = 6;
    else if (hh >= 13 && hh < 15) timeJiIdx = 7;
    else if (hh >= 15 && hh < 17) timeJiIdx = 8;
    else if (hh >= 17 && hh < 19) timeJiIdx = 9;
    else if (hh >= 19 && hh < 21) timeJiIdx = 10;
    else timeJiIdx = 11;
  } else {
    timeJiIdx = 6; // 오시 기본값
  }
  const timeStartStemIdx = ((dayGanIdx % 5) * 2) % 10;
  const timeGanIdx = (timeStartStemIdx + timeJiIdx) % 10;
  const timeStem = HEAVENLY_STEMS[timeGanIdx];
  const timeBranch = EARTHLY_BRANCHES[timeJiIdx];

  // 4기둥 객체 생성
  const yearPillar: SajuPillar = {
    gan: yearStem.name,
    ji: yearBranch.name,
    ganHanja: yearStem.hanja,
    jiHanja: yearBranch.hanja,
    ganElement: yearStem.element,
    jiElement: yearBranch.element,
    ganYinYang: yearStem.yinYang,
    jiYinYang: yearBranch.yinYang,
    shipshin: getShipshin(dayStem, yearStem),
    twelveStage: getTwelveStage(dayStem.name, yearBranch.name),
  };

  const monthPillar: SajuPillar = {
    gan: monthStem.name,
    ji: monthBranch.name,
    ganHanja: monthStem.hanja,
    jiHanja: monthBranch.hanja,
    ganElement: monthStem.element,
    jiElement: monthBranch.element,
    ganYinYang: monthStem.yinYang,
    jiYinYang: monthBranch.yinYang,
    shipshin: getShipshin(dayStem, monthStem),
    twelveStage: getTwelveStage(dayStem.name, monthBranch.name),
  };

  const dayPillar: SajuPillar = {
    gan: dayStem.name,
    ji: dayBranch.name,
    ganHanja: dayStem.hanja,
    jiHanja: dayBranch.hanja,
    ganElement: dayStem.element,
    jiElement: dayBranch.element,
    ganYinYang: dayStem.yinYang,
    jiYinYang: dayBranch.yinYang,
    shipshin: '일간(日干/본원)',
    twelveStage: getTwelveStage(dayStem.name, dayBranch.name),
  };

  const timePillar: SajuPillar = {
    gan: timeStem.name,
    ji: timeBranch.name,
    ganHanja: timeStem.hanja,
    jiHanja: timeBranch.hanja,
    ganElement: timeStem.element,
    jiElement: timeBranch.element,
    ganYinYang: timeStem.yinYang,
    jiYinYang: timeBranch.yinYang,
    shipshin: getShipshin(dayStem, timeStem),
    twelveStage: getTwelveStage(dayStem.name, timeBranch.name),
  };

  // 오행 분포 점수 계산 (지지는 계절적 가중치 반영)
  const dist = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const allStems = [yearStem, monthStem, dayStem, timeStem];
  const allBranches = [yearBranch, monthBranch, dayBranch, timeBranch];

  allStems.forEach(s => { dist[s.element] += 10; });
  // 월지는 득령(得令)으로 가중치 30, 나머지 지지는 15
  allBranches.forEach((b, idx) => {
    dist[b.element] += (idx === 1 ? 30 : 15);
  });

  const totalPoints = dist.목 + dist.화 + dist.토 + dist.금 + dist.수;
  const percentages = {
    목: Math.round((dist.목 / totalPoints) * 100),
    화: Math.round((dist.화 / totalPoints) * 100),
    토: Math.round((dist.토 / totalPoints) * 100),
    금: Math.round((dist.금 / totalPoints) * 100),
    수: Math.round((dist.수 / totalPoints) * 100),
  };

  // 과다/결핍 오행
  const sortedElements = (Object.keys(percentages) as (keyof typeof percentages)[])
    .sort((a, b) => percentages[b] - percentages[a]);
  const dominantElement = sortedElements[0];
  const lackingElement = sortedElements[sortedElements.length - 1];

  // 용신 판정
  let primaryYongshin = '수';
  let secondaryYongshin = '금';
  if (dominantElement === '화' || dominantElement === '토') {
    primaryYongshin = '수';
    secondaryYongshin = '금';
  } else if (dominantElement === '수' || dominantElement === '목') {
    primaryYongshin = '화';
    secondaryYongshin = '토';
  } else {
    primaryYongshin = '목';
    secondaryYongshin = '수';
  }

  // 신살 분석 (천을귀인, 도화살, 역마살 등)
  const spirits: string[] = [];
  const allBranchNames = allBranches.map(b => b.name);
  if (allBranchNames.includes('자') || allBranchNames.includes('오') || allBranchNames.includes('묘') || allBranchNames.includes('유')) {
    spirits.push('도화살(桃花殺 - 매력과 대중적 인기, 예술적 감각)');
  }
  if (allBranchNames.includes('인') || allBranchNames.includes('신') || allBranchNames.includes('사') || allBranchNames.includes('해')) {
    spirits.push('역마살(驛馬殺 - 활동력, 해외/출장, 변화와 도전)');
  }
  if (allBranchNames.includes('진') || allBranchNames.includes('술') || allBranchNames.includes('축') || allBranchNames.includes('미')) {
    spirits.push('화개살(華蓋殺 - 학문, 철학, 영성, 깊은 내면의 지혜)');
  }
  // 천을귀인
  if (['갑', '무', '경'].includes(dayStem.name) && (allBranchNames.includes('축') || allBranchNames.includes('미'))) {
    spirits.push('천을귀인(天乙貴人 - 최고의 길신, 위기 극복의 조력자)');
  } else if (['을', '기'].includes(dayStem.name) && (allBranchNames.includes('자') || allBranchNames.includes('신'))) {
    spirits.push('천을귀인(天乙貴人 - 조력자의 은혜와 귀인의 원조)');
  } else if (['병', '정'].includes(dayStem.name) && (allBranchNames.includes('해') || allBranchNames.includes('유'))) {
    spirits.push('천을귀인(天乙貴人 - 지혜와 명예를 북돋는 대길신)');
  } else {
    spirits.push('문창귀인(文昌貴人 - 명석한 두뇌와 문서/학습의 길조)');
  }

  // 일간별 본성 & 운세 풀이 생성
  const personalityMap: Record<string, string> = {
    갑: '큰 나무(大木)의 기상으로 곧고 당당하며 리더십과 추진력이 강합니다. 굽히기 싫어하는 자존심이 있으나 포용력이 넓습니다.',
    을: '유연한 초목(花草)처럼 적응력이 뛰어나며 외유내강형의 끈기와 친화력으로 환경을 내 편으로 만드는 지혜가 있습니다.',
    병: '찬란한 태양(太陽)의 기운으로 밝고 열정적이며 솔직담백합니다. 불의를 참지 못하며 주변 사람들을 비추는 에너지가 넘칩니다.',
    정: '따뜻한 등불(燈燭)처럼 섬세하고 다정다감하며 배려심이 깊습니다. 내면에 타오르는 집중력과 장인 정신이 뛰어납니다.',
    무: '광활한 대지(大地)와 태산처럼 묵직하고 신용을 중시합니다. 웬만한 풍파에도 흔들리지 않는 든든한 안정감이 돋보입니다.',
    기: '비옥한 텃밭(田園)처럼 실속 있고 포용력이 있으며 사람들을 편안하게 해줍니다. 다방면의 재능을 흡수하는 능력이 뛰어납니다.',
    경: '단단한 무쇠와 바위(剛金)의 기개로 결단력이 칼같고 신의가 두텁습니다. 혁신과 개혁의 기질이 충만합니다.',
    신: '섬세하게 세공된 보석(珠玉)처럼 총명하고 감수성이 예리합니다. 완벽주의적 성향과 남다른 미적 감각을 지녔습니다.',
    임: '도도히 흐르는 큰 강물(江海)처럼 지혜가 깊고 통이 큽니다. 유연하게 장애물을 넘어가며 큰 흐름을 읽는 안목이 탁월합니다.',
    계: '대지를 적시는 단비(雨露)처럼 총명하고 지혜로우며 감수성이 풍부합니다. 사려 깊고 세밀한 직관력을 발휘합니다.',
  };

  // 대운 주기 생성
  const daeunList = [
    { age: 5, ganji: '갑인(甲寅)', periodFortune: '초년 성장기와 학업의 발판이 견고해지는 시기' },
    { age: 15, ganji: '을묘(乙卯)', periodFortune: '재능과 호기심이 만개하며 학업과 교우관계가 확장되는 운' },
    { age: 25, ganji: '병진(丙辰)', periodFortune: '사회적 진출과 독립, 직무 전문성을 쌓아가는 약진기' },
    { age: 35, ganji: '정사(丁巳)', periodFortune: '사회적 위상과 자산 형성의 중추기, 리더십 발휘 운' },
    { age: 45, ganji: '무오(戊午)', periodFortune: '명예와 사업적 영향력이 절정에 달하는 황금 결실기' },
    { age: 55, ganji: '기미(己未)', periodFortune: '자산의 안정화와 후진 양성, 안정적 토대 구축' },
    { age: 65, ganji: '경신(庚申)', periodFortune: '여유와 명예, 정신적 원숙함을 누리는 평온한 운세' },
  ];

  return {
    input,
    fourPillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      time: timePillar,
    },
    fiveElementsDistribution: percentages,
    dominantElement,
    lackingElement,
    yongshin: {
      primary: primaryYongshin,
      secondary: secondaryYongshin,
      explanation: `사주 원국에서 ${dominantElement}(은)는 왕성하고 ${lackingElement}(은)는 부족하므로, 기운의 균형을 맞추기 위해 ${primaryYongshin} 기운을 용신(用神)으로 삼고 ${secondaryYongshin} 기운을 희신(喜神)으로 삼아 개운합니다.`,
    },
    spirits,
    personality: personalityMap[dayStem.name] || '균형 잡힌 성품과 온화한 인덕을 갖추고 있습니다.',
    wealthFortune: `재물운의 핵심은 '${monthPillar.shipshin}'의 역량에 달려 있습니다. 꾸준한 현금 흐름을 축적하며, ${primaryYongshin}과 관련된 분야(지식, 유통, 전문기술)에서 자산 증식의 강력한 기회를 잡게 됩니다.`,
    careerFortune: `일간 '${dayStem.name}(${dayStem.element})'의 특성에 맞춰 자율성과 전문성이 보장되는 환경에서 탁월한 성과를 발휘합니다. 특히 기획, 연구, 전략 수립, 대인 조율 능력에서 남다른 두각을 나타냅니다.`,
    loveFortune: `배우자궁인 일지 '${dayBranch.name}'의 기운이 온화하여, 서로의 부족한 점을 보완해주는 지혜로운 인연과 깊은 신뢰를 쌓게 됩니다. 솔직한 대화와 감정 표현이 애정운을 배가시킵니다.`,
    healthAdvice: `오행 중 '${lackingElement}' 기운이 다소 부족하므로 평소 관련 장기(${lackingElement === '목' ? '간·담' : lackingElement === '화' ? '심혈관' : lackingElement === '토' ? '위장·소화기' : lackingElement === '금' ? '폐·호흡기' : '신장·비뇨기'})의 건강 관리와 수분 섭취, 규칙적인 운동이 권장됩니다.`,
    daeunList,
    currentYearFortune: `올해는 변화와 기회의 바람이 부는 길한 해입니다. 사주 내 ${primaryYongshin} 기운을 북돋는 환경과 귀인의 도움이 따르니, 망설이던 프로젝트나 새로운 목표에 도전하기에 최적기입니다.`,
  };
}
