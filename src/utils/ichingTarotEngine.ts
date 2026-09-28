import { IChingResult, TarotSpreadResult, TarotCard } from '../types';

import { 
  ICHING_64_DATABASE, 
  EIGHT_TRIGRAMS, 
  getHexagramFromLines, 
  HexagramData 
} from './iching64Database';

export { EIGHT_TRIGRAMS, ICHING_64_DATABASE, getHexagramFromLines };
export const ICHING_64 = ICHING_64_DATABASE;


// Rider-Waite-Smith Authentic 22 Major Arcana Deck
export interface MajorTarotCardData extends TarotCard {
  romanNumber: string;
  element: string;
  reversedMeaning: string;
  reversedKeywords: string[];
  description: string;
}

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/metabismuth/tarot-json@master/cards';

export const TAROT_DECK: MajorTarotCardData[] = [
  {
    id: 0,
    nameKr: '0. 바보 (The Fool)',
    nameEn: 'The Fool',
    romanNumber: '0',
    element: '공기(Air)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m00.jpg`,
    meaning: '새로운 모험의 위대한 출발, 순수한 영혼과 무한한 잠재력, 자유로운 도약과 새로운 가능성.',
    keywords: ['새로운 시작', '순수함', '자유', '무한한 잠재력', '용기 있는 도약'],
    reversedMeaning: '경솔한 판단, 준비 없는 맹목적인 무모함, 책임 회피와 우발적인 리스크 주의.',
    reversedKeywords: ['경솔함', '무모한 모험', '망설임', '준비 부족'],
    description: '절벽 끝에서 장미꽃을 들고 발걸음을 떼려는 청년과 동반견. 두려움 없이 미지의 세계로 나아가는 순수한 영혼의 여정을 상징합니다.',
    cardImageSymbol: '🃏',
  },
  {
    id: 1,
    nameKr: 'I. 마법사 (The Magician)',
    nameEn: 'The Magician',
    romanNumber: 'I',
    element: '수성(Mercury)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m01.jpg`,
    meaning: '탁월한 재능과 창의력, 하늘의 영감을 땅의 현실로 구현해내는 강력한 실행력과 카리스마.',
    keywords: ['창조력', '실행력', '탁월한 재능', '기회 포착', '의지력'],
    reversedMeaning: '재능의 오남용, 허세와 기만, 미숙한 실행이나 겉만 번지르르한 상태.',
    reversedKeywords: ['기만', '계획 차질', '재능 낭비', '속임수'],
    description: '한 손은 하늘을, 한 손은 대지를 가리키며 제단 위의 4대 원소(완드·컵·검·펜타클)를 다루는 마법사. 아이디어를 현실로 구현할 준비가 완벽함을 뜻합니다.',
    cardImageSymbol: '🪄',
  },
  {
    id: 2,
    nameKr: 'II. 여사제 (The High Priestess)',
    nameEn: 'The High Priestess',
    romanNumber: 'II',
    element: '달(Moon)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m02.jpg`,
    meaning: '깊은 직관력과 내면의 지혜, 신비로운 통찰, 비밀의 열쇠와 냉철하고 정숙한 판단.',
    keywords: ['직관', '영적 지혜', '통찰력', '비밀', '내면의 목소리'],
    reversedMeaning: '표면적 집착, 직관의 무시, 신경과민, 비밀의 폭로 또는 정서적 불안정.',
    reversedKeywords: ['비밀 누설', '감정 기복', '직관 불신', '단절'],
    description: '흑백 두 기둥 사이에 앉아 율법의 두루마리(TORA)를 쥐고 있는 여사제. 보이지 않는 세계의 깊은 진리와 무의식의 지혜를 관장합니다.',
    cardImageSymbol: '🌙',
  },
  {
    id: 3,
    nameKr: 'III. 여황제 (The Empress)',
    nameEn: 'The Empress',
    romanNumber: 'III',
    element: '금성(Venus)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m03.jpg`,
    meaning: '모성애와 무한한 풍요, 번영과 다산, 예술적 감수성과 따뜻한 사랑의 결실.',
    keywords: ['풍요', '다산', '모성적 사랑', '창작의 결실', '물질적 번영'],
    reversedMeaning: '과도한 낭비, 애정의 집착, 창작의 정체 또는 게으름과 사치.',
    reversedKeywords: ['사치', '과보호', '창작 정체', '불화'],
    description: '황금빛 밀밭과 숲속 푹신한 방석에 앉아 석류무늬 옷을 입은 여황제. 자연과 생명의 무한한 풍요와 사랑을 상징합니다.',
    cardImageSymbol: '👑',
  },
  {
    id: 4,
    nameKr: 'IV. 황제 (The Emperor)',
    nameEn: 'The Emperor',
    romanNumber: 'IV',
    element: '양자리(Aries)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m04.jpg`,
    meaning: '견고한 기반, 통솔력과 권위, 규율과 질서, 흔들리지 않는 체계와 성공적인 리더십.',
    keywords: ['권위', '안정된 기반', '리더십', '책임감', '조직적 성취'],
    reversedMeaning: '독선적 독재, 완고함과 고집, 유연성 부족, 권위의 실추 또는 과도한 통제.',
    reversedKeywords: ['독재', '완고함', '통제 실패', '무능'],
    description: '돌로 된 보좌에 굳건히 앉아 앙크 십자가를 쥔 수염 난 황제. 사회적 성취와 법, 질서, 확고한 기반을 뜻합니다.',
    cardImageSymbol: '🏛️',
  },
  {
    id: 5,
    nameKr: 'V. 교황 (The Hierophant)',
    nameEn: 'The Hierophant',
    romanNumber: 'V',
    element: '황소자리(Taurus)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m05.jpg`,
    meaning: '정통성과 도덕적 가르침, 귀인의 조언, 신뢰할 수 있는 멘토, 집단의 화합과 계약.',
    keywords: ['조언자', '정통 규범', '영적 가르침', '신뢰', '화합'],
    reversedMeaning: '낡은 도그마, 위선, 편협한 관습, 불신, 부적절한 조언에 대한 맹신 경계.',
    reversedKeywords: ['고루함', '편견', '반항', '잘못된 가르침'],
    description: '삼중관을 쓰고 교회의 두 사제에게 축복을 내리는 교황. 전통, 지혜의 계승, 바른 길로 이끄는 멘토의 힘을 나타냅니다.',
    cardImageSymbol: '📜',
  },
  {
    id: 6,
    nameKr: 'VI. 연인 (The Lovers)',
    nameEn: 'The Lovers',
    romanNumber: 'VI',
    element: '쌍둥이자리(Gemini)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m06.jpg`,
    meaning: '진정한 사랑과 교감, 운명적인 만남, 중요한 가치관의 선택, 아름다운 조화.',
    keywords: ['운명적 사랑', '깊은 유대', '조화로운 결합', '선택의 기로', '열정'],
    reversedMeaning: '소통 부재, 잘못된 선택, 갈등과 불화, 유혹에 흔들리거나 신뢰가 깨짐.',
    reversedKeywords: ['관계 불화', '유혹', '선택의 후회', '결별 위기'],
    description: '대천사 라파엘의 축복 아래 서 있는 아담과 이브. 육체와 영혼의 완전한 결합 및 인생의 중대한 갈림길에서의 올바른 선택을 상징합니다.',
    cardImageSymbol: '❤️',
  },
  {
    id: 7,
    nameKr: 'VII. 전차 (The Chariot)',
    nameEn: 'The Chariot',
    romanNumber: 'VII',
    element: '게자리(Cancer)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m07.jpg`,
    meaning: '강력한 돌파력, 목표를 향한 거침없는 진격, 내면 갈등의 극복과 승리의 쟁취.',
    keywords: ['추진력', '승리', '의지력', '목표 달성', '경쟁 우위'],
    reversedMeaning: '통제력 상실, 폭주, 성급한 추진으로 인한 좌초, 방향 감각의 혼란.',
    reversedKeywords: ['통제 불능', '좌절', '성급함', '패배감'],
    description: '흑백 스핑크스를 통제하며 별이 수놓인 천막의 전차를 몰고 성벽을 나서는 젊은 영웅. 강한 의지로 상반된 힘을 조화롭게 이끌어 승리합니다.',
    cardImageSymbol: '⚔️',
  },
  {
    id: 8,
    nameKr: 'VIII. 힘 (Strength)',
    nameEn: 'Strength',
    romanNumber: 'VIII',
    element: '사자자리(Leo)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m08.jpg`,
    meaning: '부드러운 카리스마, 인내와 자비, 맹수를 길들이는 따뜻한 용기와 내면의 진정한 강인함.',
    keywords: ['내면의 힘', '인내', '자비로운 용기', '조화로운 제어', '극복'],
    reversedMeaning: '자신감 상실, 본능에 굴복, 나약함, 두려움 또는 완력에 의한 억압.',
    reversedKeywords: ['자신감 저하', '나약함', '감정 폭발', '불안'],
    description: '머리 위에 무한대(∞) 기호를 두른 순백의 여인이 온화한 손길로 사자의 턱을 쓰다듬습니다. 완력이 아닌 부드러움과 신념의 위대함을 보여줍니다.',
    cardImageSymbol: '🦁',
  },
  {
    id: 9,
    nameKr: 'IX. 은둔자 (The Hermit)',
    nameEn: 'The Hermit',
    romanNumber: 'IX',
    element: '처녀자리(Virgo)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m09.jpg`,
    meaning: '깊은 자아성찰, 진리 탐구, 고요한 성찰 속에서 발견하는 내면의 지혜의 등불.',
    keywords: ['자기 성찰', '지혜 탐구', '신중함', '고독 속 성장', '멘토의 등불'],
    reversedMeaning: '고립과 폐쇄, 지나친 고집, 사회적 단절, 외로움에 갇힘.',
    reversedKeywords: ['고립', '은둔', '소통 거부', '편협함'],
    description: '눈 덮인 산꼭대기에서 육각별이 빛나는 등불과 지팡이를 들고 세상을 비추는 현자. 내면의 소리에 귀 기울일 때임을 일깨웁니다.',
    cardImageSymbol: '🏔️',
  },
  {
    id: 10,
    nameKr: 'X. 운명의 수레바퀴 (Wheel of Fortune)',
    nameEn: 'Wheel of Fortune',
    romanNumber: 'X',
    element: '목성(Jupiter)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m10.jpg`,
    meaning: '행운의 반전, 새로운 기회의 도래, 긍정적인 운의 전환점, 필연적인 인생의 도약.',
    keywords: ['운명의 전환', '행운의 도래', '긍정적 변화', '새로운 기회', '상승세'],
    reversedMeaning: '예기치 못한 정체, 불운의 주기, 변화에 대한 저항, 때를 기다려야 하는 시기.',
    reversedKeywords: ['일시적 불운', '변화 지연', '예측 빗나감', '인내 필요'],
    description: '사방의 4대 복음서 신수들이 지켜보는 가운데 끊임없이 회전하는 운명의 수레바퀴. 하강이 끝나고 마침내 상승의 기운이 열리고 있음을 알립니다.',
    cardImageSymbol: '🎡',
  },
  {
    id: 11,
    nameKr: 'XI. 정의 (Justice)',
    nameEn: 'Justice',
    romanNumber: 'XI',
    element: '천칭자리(Libra)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m11.jpg`,
    meaning: '공명정대한 판결, 인과응보의 원리, 균형과 진실, 현명하고 객관적인 결정.',
    keywords: ['공정함', '균형', '진실 규명', '올바른 판단', '계약 성립'],
    reversedMeaning: '편파적인 판결, 불공정, 책임 전가, 법적 분쟁의 불리함, 편견.',
    reversedKeywords: ['불공정', '편견', '판단 착오', '법적 문제'],
    description: '한 손에 진실의 칼을, 다른 손에 균형의 저울을 든 정의의 여신. 뿌린 대로 거두는 엄정한 인과의 법칙을 상징합니다.',
    cardImageSymbol: '⚖️',
  },
  {
    id: 12,
    nameKr: 'XII. 매달린 사람 (The Hanged Man)',
    nameEn: 'The Hanged Man',
    romanNumber: 'XII',
    element: '물(Water)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m12.jpg`,
    meaning: '자발적 헌신, 관점의 대전환, 더 높은 깨달음을 위한 일시적 멈춤과 기다림.',
    keywords: ['희생과 헌신', '새로운 시각', '인내의 가치', '깨달음', '유연한 수용'],
    reversedMeaning: '무의미한 고통, 헛된 희생, 고집스러운 저항, 진전 없는 지체.',
    reversedKeywords: ['헛수고', '정체', '자기기만', '저항'],
    description: '생명나무에 거꾸로 매달려 있으나 머리에는 후광이 빛나는 인물. 세상을 다른 눈으로 바라봄으로써 영적 도약을 이룹니다.',
    cardImageSymbol: '🔄',
  },
  {
    id: 13,
    nameKr: 'XIII. 죽음 (Death)',
    nameEn: 'Death',
    romanNumber: 'XIII',
    element: '전갈자리(Scorpio)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m13.jpg`,
    meaning: '과거의 완전한 종결, 불필요한 것의 청산, 환골탈태와 찬란한 새 출발.',
    keywords: ['근본적 변혁', '과거와의 결별', '새로운 장의 개막', '정리', '재생'],
    reversedMeaning: '변화에 대한 두려움, 미련과 집착, 질질 끄는 정체, 거부할 수 없는 변화의 지연.',
    reversedKeywords: ['미련', '변화 거부', '정체 지속', '두려움'],
    description: '백마를 탄 죽음의 기사와 신비한 장미 깃발, 저 멀리 떠오르는 새로운 여명의 태양. 끝은 곧 찬란한 새로운 탄생임을 선언합니다.',
    cardImageSymbol: '🌅',
  },
  {
    id: 14,
    nameKr: 'XIV. 절제 (Temperance)',
    nameEn: 'Temperance',
    romanNumber: 'XIV',
    element: '사수자리(Sagittarius)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m14.jpg`,
    meaning: '완벽한 균형과 조화, 치유와 연금술적 결합, 온화한 중용의 미덕과 회복.',
    keywords: ['조화', '치유', '균형 감각', '중용', '창의적 융합'],
    reversedMeaning: '불균형, 과도한 극단, 조급함, 갈등과 타협의 결렬.',
    reversedKeywords: ['불균형', '과욕', '감정 충돌', '조급함'],
    description: '한 발은 물에, 한 발은 땅에 딛고 두 잔 사이로 물을 끊임없이 순환시키는 천사. 대립되는 요소들이 조화를 이루어 치유를 낳습니다.',
    cardImageSymbol: '🕊️',
  },
  {
    id: 15,
    nameKr: 'XV. 악마 (The Devil)',
    nameEn: 'The Devil',
    romanNumber: 'XV',
    element: '염소자리(Capricorn)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m15.jpg`,
    meaning: '강렬한 물질적 욕망, 카리스마적 매혹, 속박된 사슬을 자각하고 벗어나야 할 경고.',
    keywords: ['물질적 집착', '치명적 유혹', '중독', '속박의 자각', '열정의 그림자'],
    reversedMeaning: '사슬에서의 해방, 집착의 극복, 유혹을 물리침, 영적 자유의 쟁취.',
    reversedKeywords: ['사슬 해방', '집착 극복', '자유 회복', '새로운 눈'],
    description: '제단에 묶인 남녀의 목에 걸린 헐거운 쇠사슬. 스스로 벗어날 수 있음에도 욕망에 갇혀 있음을 깨닫고 일어서야 함을 가르칩니다.',
    cardImageSymbol: '⛓️',
  },
  {
    id: 16,
    nameKr: 'XVI. 탑 (The Tower)',
    nameEn: 'The Tower',
    romanNumber: 'XVI',
    element: '화성(Mars)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m16.jpg`,
    meaning: '거짓된 신념의 붕괴, 급작스러운 충격적 깨달음, 진실의 번개와 근본적인 재건의 기회.',
    keywords: ['갑작스러운 변화', '환상의 붕괴', '충격적 깨달음', '자유를 위한 파괴', '해방'],
    reversedMeaning: '위기의 모면, 예견된 파국의 수습, 점진적인 재건, 두려움을 통한 정화.',
    reversedKeywords: ['위기 모면', '경미한 손실', '피항', '재건 시작'],
    description: '번개를 맞아 불타는 왕관의 탑에서 추락하는 인물들. 허상과 오만을 무너뜨리고 굳건한 진실 위에 다시 집을 지어야 함을 뜻합니다.',
    cardImageSymbol: '⚡',
  },
  {
    id: 17,
    nameKr: 'XVII. 별 (The Star)',
    nameEn: 'The Star',
    romanNumber: 'XVII',
    element: '물병자리(Aquarius)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m17.jpg`,
    meaning: '빛나는 희망과 치유, 영감의 축복, 미래에 대한 확신과 평화로운 마음의 안식처.',
    keywords: ['희망', '영감', '심신 치유', '미래의 서광', '평화'],
    reversedMeaning: '비관적 태도, 신뢰 상실, 낙담, 꿈의 실현 지연, 자신감 위축.',
    reversedKeywords: ['실망', '비관', '기회 상실', '의기소침'],
    description: '여덟 갈래의 대형 별 아래 대지와 호수에 생명수를 붓는 순수한 여인. 폭풍이 지나간 후 찾아온 영원한 희망의 빛입니다.',
    cardImageSymbol: '⭐',
  },
  {
    id: 18,
    nameKr: 'XVIII. 달 (The Moon)',
    nameEn: 'The Moon',
    romanNumber: 'XVIII',
    element: '물고기자리(Pisces)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m18.jpg`,
    meaning: '무의식의 안개, 감정의 흔들림, 직관의 시험, 비밀과 불확실성 속에서 참된 길 찾기.',
    keywords: ['무의식 탐험', '직관적 경고', '감정의 파도', '안개 속 항해', '내면 정화'],
    reversedMeaning: '안개의 걷힘, 오해의 해소, 두려움의 극복, 명확한 진실의 드러남.',
    reversedKeywords: ['오해 해소', '안개 걷힘', '안정 회복', '진실 발견'],
    description: '물속에서 기어 나오는 가재와 달을 향해 짖는 개와 늑대. 불안과 환상을 딛고 내면의 직관을 등불 삼아 나아가야 합니다.',
    cardImageSymbol: '🌕',
  },
  {
    id: 19,
    nameKr: 'XIX. 태양 (The Sun)',
    nameEn: 'The Sun',
    romanNumber: 'XIX',
    element: '태양(Sun)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m19.jpg`,
    meaning: '찬란한 성공, 활력과 생명력, 의기양양한 성취와 최고의 기쁨, 모든 어둠의 종식.',
    keywords: ['압도적 성공', '행복과 활력', '빛나는 성취', '생명력', '승리'],
    reversedMeaning: '일시적 구름, 과신에 대한 경계, 지연된 인정, 사소한 오점.',
    reversedKeywords: ['일시적 지연', '과도한 자만', '기력 소진', '작은 시련'],
    description: '해바라기 담장 앞 백마 위에 깃발을 들고 해맑게 웃는 아이와 찬란한 황금 태양. 최고의 길상과 환희를 상징합니다.',
    cardImageSymbol: '☀️',
  },
  {
    id: 20,
    nameKr: 'XX. 심판 (Judgement)',
    nameEn: 'Judgement',
    romanNumber: 'XX',
    element: '불(Fire)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m20.jpg`,
    meaning: '운명적 부름, 과거의 결산과 부활, 결정적인 승인, 제2의 인생으로의 도약.',
    keywords: ['부활', '운명적 소명', '결정적 결산', '각성', '새로운 삶'],
    reversedMeaning: '결단의 회피, 자책감, 과거에 얽매임, 부름을 외면하여 기회를 놓침.',
    reversedKeywords: ['우유부단', '자책', '기회 상실', '과거 집착'],
    description: '대천사 가브리엘이 나팔을 불자 무덤에서 환희로 일어서는 사람들. 그동안의 노력에 대한 정당한 보상과 도약을 뜻합니다.',
    cardImageSymbol: '🎺',
  },
  {
    id: 21,
    nameKr: 'XXI. 세계 (The World)',
    nameEn: 'The World',
    romanNumber: 'XXI',
    element: '토성(Saturn)',
    isUpright: true,
    imageUrl: `${CDN_BASE}/m21.jpg`,
    meaning: '완벽한 대단원의 완성, 궁극의 성취, 글로벌한 성공과 통합, 완전무결한 행복.',
    keywords: ['완전한 완성', '궁극적 성취', '세계적 확장', '행복한 대단원', '통합'],
    reversedMeaning: '미완성, 마지막 2%의 부족, 지연된 마무리, 완성을 위한 최종 점검 필요.',
    reversedKeywords: ['마무리 부족', '미완성', '지연', '보완 필요'],
    description: '승리의 월계관 속에서 두 개의 완드를 쥐고 춤추는 무희와 사방의 4대 신수. 한 사이클의 완전무결한 완성 및 더 높은 차원으로의 진입을 알립니다.',
    cardImageSymbol: '🌍',
  },
];

export interface CoinTossStep {
  step: number; // 1 to 6 (1: 초효, 6: 상효)
  coinValues: [boolean, boolean, boolean]; // 3 coins: true = heads (3, 양), false = tails (2, 음)
  sum: number; // 6 (노음), 7 (소양), 8 (소음), 9 (노양)
  lineType: 'yin' | 'yang';
  isMoving: boolean; // 6 or 9
  name: string;
}

export function tossSingleLineCoins(stepNumber: number): CoinTossStep {
  const c1 = Math.random() > 0.5;
  const c2 = Math.random() > 0.5;
  const c3 = Math.random() > 0.5;

  const v1 = c1 ? 3 : 2;
  const v2 = c2 ? 3 : 2;
  const v3 = c3 ? 3 : 2;
  const sum = v1 + v2 + v3; // 6, 7, 8, or 9

  const lineType: 'yin' | 'yang' = (sum === 7 || sum === 9) ? 'yang' : 'yin';
  const isMoving = (sum === 6 || sum === 9);

  const stepNames = ['초효(初爻)', '이효(二爻)', '삼효(三爻)', '사효(四爻)', '오효(五爻)', '상효(上爻)'];

  return {
    step: stepNumber,
    coinValues: [c1, c2, c3],
    sum,
    lineType,
    isMoving,
    name: stepNames[stepNumber - 1] || `${stepNumber}효`,
  };
}

import { getYaoDetail, getExtendedFortunes } from './ichingYaoData';

export function tossIChing(
  question?: string, 
  customSteps?: CoinTossStep[]
): IChingResult {
  // If not provided, simulate 6 steps of Three-Coin tossing
  const steps: CoinTossStep[] = customSteps && customSteps.length === 6
    ? customSteps
    : Array.from({ length: 6 }, (_, i) => tossSingleLineCoins(i + 1));

  const lines = steps.map(s => s.lineType);
  const hex = getHexagramFromLines(lines);

  const upperTri = EIGHT_TRIGRAMS[hex.upperKey] || EIGHT_TRIGRAMS['건'];
  const lowerTri = EIGHT_TRIGRAMS[hex.lowerKey] || EIGHT_TRIGRAMS['건'];

  // Check moving lines (변효)
  const movingSteps = steps.filter(s => s.isMoving);
  let movingLineSummary = '';
  let transformedHexagram: IChingResult['transformedHexagram'] = undefined;

  if (movingSteps.length > 0) {
    const transformedLines = lines.map((l, idx) => {
      const step = steps[idx];
      if (step.isMoving) {
        return l === 'yang' ? 'yin' : 'yang';
      }
      return l;
    });
    const transHex = getHexagramFromLines(transformedLines);
    const transUpper = EIGHT_TRIGRAMS[transHex.upperKey]?.nature || '하늘(天)';
    const transLower = EIGHT_TRIGRAMS[transHex.lowerKey]?.nature || '하늘(天)';

    movingLineSummary = `${movingSteps.map(s => s.name).join(', ')}에 동효(動爻)가 있어 기운이 변화하여 [제${transHex.num}괘 ${transHex.nameKr}]로 전환됩니다.`;
    transformedHexagram = {
      num: transHex.num,
      nameKr: transHex.nameKr,
      nameHanja: transHex.nameHanja,
      summary: transHex.judgment,
      upperTrigram: transUpper,
      lowerTrigram: transLower,
    };
  } else {
    movingLineSummary = '동효(動爻)가 없는 정괘(靜卦)로, 현재 본괘(本卦)의 괘사와 상전이 가리키는 교훈이 변함없이 견고함을 뜻합니다.';
  }

  const lineDetails = steps.map(s => {
    const yao = getYaoDetail(hex, s.step, s.lineType, s.isMoving);
    const stateName = s.sum === 6 
      ? '노음(老陰 · 動)' 
      : s.sum === 7 
        ? '소양(少陽 · 靜)' 
        : s.sum === 8 
          ? '소음(少陰 · 靜)' 
          : '노양(老陽 · 動)';

    return {
      position: s.step,
      name: s.name,
      type: s.lineType,
      isMoving: s.isMoving,
      value: s.sum,
      stateName,
      coinValues: s.coinValues,
      yaoText: `${yao.lineName} : ${yao.classicalHanja} - ${yao.koreanText} (${yao.modernMeaning})`,
      yaoAdvice: yao.actionGuidance,
    };
  });

  const extendedFortunes = getExtendedFortunes(hex);

  return {
    question: question || '현재 가장 중요한 고민에 대한 하늘의 괘',
    hexagramNumber: hex.num,
    nameKr: hex.nameKr,
    nameHanja: hex.nameHanja,
    symbolMeaning: hex.symbolMeaning,
    upperTrigram: upperTri.nature,
    upperHanja: upperTri.hanja,
    upperSymbol: upperTri.symbol,
    lowerTrigram: lowerTri.nature,
    lowerHanja: lowerTri.hanja,
    lowerSymbol: lowerTri.symbol,
    lines,
    lineDetails,
    judgment: hex.judgment,
    imageAdvice: hex.imageAdvice,
    overallScore: hex.score,
    grade: hex.grade,
    actionGuidance: hex.actionGuidance,
    fortuneAspects: hex.fortuneAspects,
    extendedFortunes,
    movingLineSummary,
    transformedHexagram,
  };
}


export function drawTarotSpread(question: string): TarotSpreadResult {
  const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
  // 15% probability of reversed cards for rich divination realism
  const past = { ...shuffled[0], isUpright: Math.random() > 0.15 };
  const present = { ...shuffled[1], isUpright: Math.random() > 0.15 };
  const future = { ...shuffled[2], isUpright: true };

  const pastMeaning = past.isUpright ? past.meaning : (past.reversedMeaning || past.meaning);
  const presentMeaning = present.isUpright ? present.meaning : (present.reversedMeaning || present.meaning);
  const futureMeaning = future.isUpright ? future.meaning : (future.reversedMeaning || future.meaning);

  return {
    question: question || '현재 가장 중요한 고민에 대한 카드의 조언',
    past,
    present,
    future,
    synthesis: `[과거: ${past.nameKr} (${past.isUpright ? '정방향' : '역방향'})]에서 다져진 경험이 [현재: ${present.nameKr} (${present.isUpright ? '정방향' : '역방향'})]의 중요한 분기점과 맞닿아 있으며, [미래: ${future.nameKr}]의 눈부신 결실로 수렴됩니다. 과거의 ${pastMeaning.slice(0, 30)}... 흐름을 인지하고 현재의 도전을 지혜롭게 수용하세요.`,
    advice: `현재 카드 [${present.nameKr}]의 핵심 조언: "${presentMeaning}" 기운을 적극 활용하여 주저하지 말고 행동하십시오.`,
  };
}

// 꿈해몽 사전 (대폭 확장된 정통 해몽 백과 연동)
import { COMPREHENSIVE_DREAM_DICTIONARY } from './dreamDictionary';
export const DREAM_DICTIONARY = COMPREHENSIVE_DREAM_DICTIONARY;

