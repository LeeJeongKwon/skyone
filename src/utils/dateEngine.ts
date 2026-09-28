import { DateSelectionInput, DateSelectionResult, AuspiciousDay } from '../types';

export function calculateAuspiciousDates(input: DateSelectionInput): DateSelectionResult {
  const [yearStr, monthStr] = input.targetYearMonth.split('-');
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const month = parseInt(monthStr, 10) || (new Date().getMonth() + 1);

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const allDays: AuspiciousDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month - 1, d);
    const dayOfWeek = dayNames[curDate.getDay()];
    const dateFormatted = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // 손 없는 날 (음력 9, 10, 19, 20, 29, 30일 근사치 계산)
    const isNoGhostDay = (d % 10 === 9 || d % 10 === 0 || d % 10 === 1);

    // 날짜별 일진 간지 생성
    const ganIdx = (d + month * 2) % 10;
    const jiIdx = (d + month) % 12;
    const gans = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const jis = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    const ganji = `${gans[ganIdx]}${jis[jiIdx]}일`;

    let score = 70 + ((d * 7 + month * 3) % 28);
    if (isNoGhostDay) score += 6;
    if (curDate.getDay() === 0 || curDate.getDay() === 6) score += 2; // 주말 편의성
    if (score > 98) score = 98;

    const isBest = score >= 90;

    allDays.push({
      date: dateFormatted,
      dayOfWeek,
      ganji,
      score,
      isBest,
      isNoGhostDay,
      auspiciousHours: ['사시(巳時: 09:30~11:30)', '오시(午時: 11:30~13:30)', '신시(申時: 15:30~17:30)'],
      features: isNoGhostDay
        ? ['손 없는 날(동서남북 방위 귀신 없음)', '천덕귀인(天德貴人) 조력']
        : ['황도길일(黃道吉日)', '생기충만'],
      avoidActions: ['다툼이나 언쟁', '급작스러운 충동 계약'],
    });
  }

  const bestDays = allDays.filter(d => d.isBest).slice(0, 5);

  const purposeLabels = {
    moving: '이사·입주 (손 없는 날 & 가옥 안정)',
    wedding: '결혼·혼례 (화합과 백년가약)',
    opening: '개업·오픈 (번영과 재물 유입)',
    contract: '계약·투자 (문서 성취와 이익 확보)',
    exam: '시험·면접 (집중력과 합격 운기)',
    travel: '여행·출장 (무사안전과 귀인 만남)',
  };

  return {
    purposeLabel: purposeLabels[input.purpose] || '길일 택일',
    targetMonth: `${year}년 ${month}월`,
    bestDays,
    allDays,
    generalAdvice: `${purposeLabels[input.purpose]}을(를) 위한 최적의 길일은 기운이 맑고 상충(相沖)이 없는 날을 택하는 것입니다. 추천 길일의 길시(오전 9시 30분 ~ 오후 1시 30분)를 적극 활용하시면 천우신조의 기운을 받습니다.`,
    tabooDirections: [
      '삼살방(三煞方): 올해는 북쪽 방위를 피하여 큰 공사나 이동을 신중히 하세요.',
      '대장군방(大將軍方): 서북쪽 방위의 흙을 파헤치는 행위를 삼가세요.',
    ],
  };
}
