import { FaceAnalysisResult } from '../types';

export function analyzeFaceFeatures(imagePreviewUrl?: string): FaceAnalysisResult {
  // Deterministic seed based on image URL or time for reliable rich reading
  const hash = imagePreviewUrl ? imagePreviewUrl.length : 12345;
  const upperScore = 82 + (hash % 14);
  const middleScore = 85 + ((hash * 3) % 13);
  const lowerScore = 84 + ((hash * 7) % 14);

  return {
    imagePreviewUrl,
    threeSections: {
      upper: {
        name: '상정(초년운)',
        score: upperScore,
        description: '이마가 단정하고 헤어라인이 균일하여 초년기 학업운과 부모덕이 두텁고 지혜로운 사고력을 갖추고 있습니다.',
      },
      middle: {
        name: '중정(중년운)',
        score: middleScore,
        description: '미간(명궁)과 콧대(질액궁~준두)의 기운이 굳건하여 30~50대 사회적 성취와 재물 축적의 기세가 매우 강합니다.',
      },
      lower: {
        name: '하정(말년운)',
        score: lowerScore,
        description: '턱의 좌우 균형(노복궁)과 입술의 윤곽이 단정하여 대인관계의 신뢰와 말년의 자산 안정 및 가정이 화평합니다.',
      },
    },
    palaces: [
      {
        name: '명궁(命宮)',
        hanja: '命宮',
        location: '눈썹 사이(인당)',
        status: '길(吉)',
        reading: '손가락 두 개 너비의 청명한 기운이 깃들어 있어 포용력이 넓고 평생 큰 위기 없이 매사 순조로운 흐름을 탑니다.',
      },
      {
        name: '재백궁(財帛宮)',
        hanja: '財帛宮',
        location: '코와 콧망울(준두/난대/정위)',
        status: '길(吉)',
        reading: '콧망울이 살집 있고 콧구멍이 정면에서 잘 드러나지 않아 재물이 새지 않고 알뜰히 모이는 부자 관상의 전형입니다.',
      },
      {
        name: '관록궁(官祿宮)',
        hanja: '官祿宮',
        location: '이마 정중앙',
        status: '길(吉)',
        reading: '뼈대가 반듯하고 광택이 좋아 조직 내 승진, 시험 합격, 사회적 직위 획득에 매우 유리합니다.',
      },
      {
        name: '전택궁(田宅宮)',
        hanja: '田宅宮',
        location: '눈두덩이(눈과 눈썹 사이)',
        status: '길(吉)',
        reading: '도톰하고 맑은 피부톤으로 부동산 운과 주거 안정성이 뛰어나며 자산 증식의 터전이 안정적입니다.',
      },
      {
        name: '처첩/부부궁(妻妾宮)',
        hanja: '妻妾宮',
        location: '눈꼬리 옆(어미/간문)',
        status: '길(吉)',
        reading: '주름이나 흉터 없이 매끄러워 배우자와의 애정이 깊고 서로의 발전을 지지해주는 좋은 인연운입니다.',
      },
      {
        name: '복덕궁(福德宮)',
        hanja: '福德宮',
        location: '이마 양옆 위쪽',
        status: '평(平)',
        reading: '타고난 복록이 준수하며 주변 사람들에게 베풀수록 자신의 복이 더욱 커지는 선순환의 상입니다.',
      },
    ],
    features: {
      forehead: '이마의 형세가 마치 거치른 돌이 없는 평원처럼 시원하여 명석함과 판단력이 돋보입니다.',
      eyes: '흑백이 분명하고 눈빛(신기)이 안으로 은은히 감추어져 있어 통찰력이 깊고 신중합니다.',
      nose: '콧날이 곧게 뻗어 소신이 굳건하며, 준두에 살이 실려 있어 꾸준한 현금흐름을 유치합니다.',
      lips: '입술의 윤곽이 또렷하고 입꼬리가 위로 살짝 올라가 긍정적인 기운과 언변의 신뢰감을 줍니다.',
      chin: '턱끝이 견고하여 뒷심과 지구력이 우수하며 후배나 동료들의 조력을 받는 상입니다.',
      ears: '귓바퀴가 단정하고 귓볼(수주)이 도톰하여 건강 장수와 심리적 여유를 나타냅니다.',
    },
    overallImpression: '전체적으로 맑은 수목(水木)의 생기가 감도는 기품 있는 상으로, 덕망과 성실함으로 신뢰를 얻어 성공하는 대기만성형 관상입니다.',
    wealthIndex: 88,
    careerIndex: 91,
    relationshipIndex: 85,
    longevityIndex: 90,
    luckyFaceTips: [
      '미간(명궁)에 잔털이나 찌푸림이 없도록 항상 밝고 환한 표정을 유지하세요.',
      '이마를 시원하게 드러내면 관록궁과 윗사람의 복을 더욱 크게 부릅니다.',
      '입꼬리를 살짝 올리는 미소 습관은 하정의 재물 그릇을 더욱 단단하게 채워줍니다.',
    ],
  };
}
