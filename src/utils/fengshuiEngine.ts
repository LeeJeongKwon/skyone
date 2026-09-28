import { FengShuiInput, FengShuiResult } from '../types';

export const DIRECTIONS_COMPASS = [
  { name: '북', angle: 0, element: '수(水)', hanja: '北 (子)', color: '#3b82f6', energy: '휴식·사색·학문' },
  { name: '북동', angle: 45, element: '토(土)', hanja: '艮 (丑寅)', color: '#f59e0b', energy: '변화·전환·새출발' },
  { name: '동', angle: 90, element: '목(木)', hanja: '東 (卯)', color: '#10b981', energy: '생기·발전·도약' },
  { name: '남동', angle: 135, element: '목(木)', hanja: '巽 (辰巳)', color: '#059669', energy: '인연·신용·무역' },
  { name: '남', angle: 180, element: '화(火)', hanja: '南 (午)', color: '#ef4444', energy: '명예·열정·명석' },
  { name: '남서', angle: 225, element: '토(土)', hanja: '坤 (未申)', color: '#d97706', energy: '안정·화합·가정' },
  { name: '서', angle: 270, element: '금(金)', hanja: '西 (酉)', color: '#64748b', energy: '결실·재물·수확' },
  { name: '북서', angle: 315, element: '금(金)', hanja: '乾 (戌亥)', color: '#475569', energy: '리더십·귀인·권위' },
];

export function analyzeFengShui(input: FengShuiInput): FengShuiResult {
  const titles = {
    home_living: '가정 거실 (가족 화합 및 생기 소통의 중심)',
    home_bedroom: '안방 침실 (건강 회복과 부부 화합, 재물 보존)',
    office_room: '서재 / 집무실 (승진·학업 성취 및 사업 계약 운)',
    store_entrance: '상가 및 현관 (외부 생기와 고객/재물 유입의 관문)',
  };

  const dirItem = DIRECTIONS_COMPASS.find(d => d.name === input.doorDirection) || DIRECTIONS_COMPASS[2];

  let overallScore = 88;
  if (['동', '남동', '남'].includes(input.doorDirection)) overallScore = 92;
  if (['북서'].includes(input.doorDirection)) overallScore = 90;

  const keyPlacements = [
    {
      item: input.spaceType === 'home_bedroom' ? '침대 머리 방향' : '책상 / 주 좌석 위치',
      goodSpot: `${dirItem.name}향 또는 동남쪽(생기 방향)`,
      badSpot: '출입문과 일직선상(문충살) 또는 화장실 문과 마주보는 위치',
      tips: '출입문을 대각선으로 바라보는 안정된 벽면(배산)에 기대어 배치하면 심리적 안정과 기운 집중력이 극대화됩니다.',
    },
    {
      item: '조명 및 채광 관리',
      goodSpot: '중앙 거실 및 현관 입구 밝은 조명',
      badSpot: '어두침침한 구석이나 먼지가 쌓인 사각지대',
      tips: '현관이 밝아야 맑은 양기가 들어옵니다. 은은하고 따뜻한 3000K 전구색 조명을 활용하세요.',
    },
    {
      item: '거울(鏡) 배치',
      goodSpot: '출입문 측면 벽면 (외출 전 정돈용)',
      badSpot: '현관문을 열자마자 정면으로 마주보는 위치 (복을 튕겨냄)',
      tips: '거울이 침대를 직접 비추지 않도록 각도를 조절하세요.',
    },
    {
      item: '공기정화 및 생기 식물',
      goodSpot: '남동쪽 모서리 및 거실 베란다 창가',
      badSpot: '사람 키보다 너무 큰 식물이나 뾰족한 선인장은 침실에 두지 말 것',
      tips: '잎이 둥글고 넓은 고무나무, 금전수, 몬스테라는 재물과 화합의 기운을 복돋웁니다.',
    },
  ];

  return {
    overallScore,
    spaceTypeTitle: titles[input.spaceType],
    directionAnalysis: {
      direction: dirItem.name,
      element: dirItem.element,
      energyQuality: '생기(生氣)',
      explanation: `${dirItem.name}쪽은 '${dirItem.energy}'의 기운이 깃든 방위로, 양질의 기운이 순환하여 공간 내 거주자의 활력과 기회를 북돋워줍니다.`,
    },
    keyPlacements,
    cures: [
      '현관 입구에 맑은 소리가 나는 황동 도어벨(풍경)을 달아 흉기를 정화하고 생기를 부릅니다.',
      '금전운을 모으기 위해 북서쪽이나 남동쪽에 황금색 오브제나 은은한 도자기류를 배치하세요.',
      '수맥이나 살기를 완화하기 위해 모서리 공간에 둥근 잎 화분이나 소금 단지를 두면 좋습니다.',
    ],
    warningTaboos: [
      '출입문과 창문이 일직선으로 마주보고 있으면 들어온 재물이 그대로 빠져나가므로 중간에 커튼이나 파티션을 두세요.',
      '고장난 시계, 깨진 그릇, 시든 식물은 음기를 발생시키므로 즉시 치우는 것이 풍수의 기본입니다.',
    ],
  };
}
