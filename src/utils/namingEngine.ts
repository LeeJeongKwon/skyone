import { NamingInput, NamingResult, NameAnalysis } from '../types';

// 81수리 해설 데이터베이스
export const NUMEROLOGY_81: Record<number, { grade: string; meaning: string; luck: '대길' | '길' | '반길반흉' | '흉' }> = {
  11: { grade: '신성격(新成格)', meaning: '가문이 번창하고 매사 순조로운 대길수', luck: '대길' },
  13: { grade: '총명격(聰明格)', meaning: '지혜가 출중하고 문예와 학문으로 입신양명', luck: '대길' },
  15: { grade: '통솔격(統率格)', meaning: '덕망과 복록을 겸비하여 뭇사람을 이끄는 수리', luck: '대길' },
  16: { grade: '덕망격(德望格)', meaning: '귀인의 도움이 따르고 부귀영화와 명예를 얻음', luck: '대길' },
  21: { grade: '두령격(頭領格)', meaning: '대업을 완수하고 사회적 지도자로서 우뚝 섬', luck: '대길' },
  23: { grade: '공명격(功名格)', meaning: '아침 해가 솟구치듯 위대한 이름을 떨치는 길수', luck: '대길' },
  24: { grade: '입신격(立身格)', meaning: '무에서 유를 창조하며 막대한 재물을 축적', luck: '대길' },
  25: { grade: '안강격(安康格)', meaning: '성품이 곧고 지혜로우며 가정이 화평하고 평안', luck: '길' },
  29: { grade: '성공격(成功格)', meaning: '재능이 비상하여 목적한 바를 성취하는 대길수', luck: '대길' },
  31: { grade: '융창격(隆昌格)', meaning: '의지가 굳건하여 일취월장 번영을 구가함', luck: '대길' },
  32: { grade: '순풍격(順風格)', meaning: '순풍에 돛을 단 듯 협력자를 만나 형통함', luck: '대길' },
  33: { grade: '승천격(昇天格)', meaning: '용이 하늘로 오르듯 최고의 권위와 명성을 누림', luck: '대길' },
  35: { grade: '태평격(泰平格)', meaning: '온화하고 품위가 있어 평화롭고 안락한 삶', luck: '길' },
  37: { grade: '인덕격(仁德格)', meaning: '신의가 두텁고 충직하여 사방에서 귀인이 원조', luck: '대길' },
  38: { grade: '문예격(文藝格)', meaning: '학예와 예술적 재능으로 남다른 성취를 이룸', luck: '길' },
  39: { grade: '안락격(安樂格)', meaning: '고난을 이겨내고 복록이 깃드는 대기만성형 길수', luck: '대길' },
  41: { grade: '고명격(高名格)', meaning: '명예가 드높고 지도적 위치에서 존경받음', luck: '대길' },
};

function getStrokeScore(num: number): { score: number; grade: string; explanation: string } {
  const norm = ((num - 1) % 81) + 1;
  const item = NUMEROLOGY_81[norm] || { grade: '안정격(安定格)', meaning: '원만하고 순탄하게 자수성가하는 길운', luck: '길' };
  const score = item.luck === '대길' ? 95 : item.luck === '길' ? 88 : 75;
  return {
    score,
    grade: `${item.grade} - [${item.luck}]`,
    explanation: item.meaning,
  };
}

export function analyzeAndGenerateNames(input: NamingInput): NamingResult {
  let currentAnalysis: NameAnalysis | undefined;

  if (input.currentFirstName) {
    const fullName = `${input.lastName}${input.currentFirstName}`;
    const won = getStrokeScore(15);
    const hyung = getStrokeScore(23);
    const yi = getStrokeScore(16);
    const jung = getStrokeScore(31);

    const overallScore = Math.round((won.score + hyung.score + yi.score + jung.score) / 4);

    currentAnalysis = {
      name: fullName,
      hangulElements: '상생(相生)의 조화 - 목화토의 원활한 기운 흐름',
      strokeCalculations: {
        won: { ...won, name: '원격(초년운)' },
        hyung: { ...hyung, name: '형격(청년/주운)' },
        yi: { ...yi, name: '이격(장년운)' },
        jung: { ...jung, name: '정격(총운)' },
      },
      soundHarmony: '초성과 종성의 울림이 부드럽고 품격 있어 부르는 사람과 듣는 사람 모두에게 안정감을 줍니다.',
      overallScore,
      strengths: [
        '주운(형격)의 수리가 뛰어나 20~40대 사회 진출과 입신양명에 강한 힘을 부여합니다.',
        '총운(정격)이 융창격으로 말년까지 재물과 명예가 마르지 않는 구조입니다.',
      ],
      recommendationRating: overallScore >= 90 ? '대길(大吉)' : '길(吉)',
    };
  }

  // 추천 작명 리스트
  const recommendedCandidates = [
    {
      hangul: `${input.lastName}도윤`,
      hanja: '度(법도 도) 潤(윤택할 윤)',
      meaning: '도량이 넓고 삶이 윤택하여 만인의 귀감이 되는 이름',
      elementCompensation: '부족한 수(水)와 목(木) 기운을 완벽 보완',
      score: 97,
      grade: '대길(大吉) - 수리 32획 순풍격',
    },
    {
      hangul: `${input.lastName}서준`,
      hanja: '敍(베풀 서) 晙(밝을 준)',
      meaning: '따뜻한 마음으로 덕을 베풀고 밝은 지혜로 세상을 이끄는 인재',
      elementCompensation: '화(火)와 토(土) 기운의 유기적 상생 촉진',
      score: 96,
      grade: '대길(大吉) - 수리 31획 융창격',
    },
    {
      hangul: `${input.lastName}하은`,
      hanja: '賀(하례할 하) 恩(은혜 은)',
      meaning: '축복과 은혜가 넘치며 사람들에게 기쁨을 주는 맑고 단아한 성품',
      elementCompensation: '금(金)과 수(水)의 맑은 지혜를 극대화',
      score: 95,
      grade: '대길(大吉) - 수리 24획 입신격',
    },
    {
      hangul: `${input.lastName}민재`,
      hanja: '敏(민첩할 민) 宰(재상 재)',
      meaning: '총명하고 재빠른 판단력으로 큰 조직이나 학문을 이끄는 지도자',
      elementCompensation: '목(木)과 화(火)의 추진력과 실행력 증폭',
      score: 94,
      grade: '대길(大吉) - 수리 23획 공명격',
    },
    {
      hangul: `${input.lastName}유진`,
      hanja: '裕(너그러울 유) 縝(삼갈 진)',
      meaning: '마음이 여유롭고 언행이 신중하여 신뢰와 재물을 굳건히 지키는 이름',
      elementCompensation: '오행 전체의 고른 순환과 심리적 평온 안착',
      score: 95,
      grade: '대길(大吉) - 수리 25획 안강격',
    },
  ];

  return {
    currentAnalysis,
    recommendedNames: recommendedCandidates,
  };
}
