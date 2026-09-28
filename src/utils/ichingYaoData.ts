import { HexagramData, EIGHT_TRIGRAMS } from './iching64Database';

export interface YaoDetail {
  position: number; // 1 ~ 6
  lineName: string; // '초구(初九)', '육이(六二)' 등
  classicalHanja: string; // e.g. "潛龍勿用"
  koreanText: string;
  modernMeaning: string;
  actionGuidance: string;
}

// Famous core Yao-ci database for King Wen 64 Hexagrams
export const FAMOUS_YAO_DATABASE: Record<number, Record<number, { hanja: string; text: string; meaning: string; advice: string }>> = {
  1: { // 건위천 (乾爲天)
    1: { hanja: '潛龍勿用', text: '잠긴 용이니 쓰지 말라.', meaning: '아직 역량이 무르익지 않고 때가 이르지 않았으니 물속에서 힘을 기르고 기다려야 합니다.', advice: '나서기보다 실력을 쌓고 기초를 다지세요.' },
    2: { hanja: '見龍在田 利見大人', text: '용이 밭에 나타났으니 대인을 만남이 이롭다.', meaning: '재능이 세상에 드러나기 시작하며, 지도자나 귀인을 만나 큰 도움을 얻게 됩니다.', advice: '자신감을 갖고 멘토나 조력자를 적극적으로 찾으세요.' },
    3: { hanja: '君子終日乾乾 夕惕若 厲无咎', text: '군자가 종일 힘쓰고 저녁에는 두려워하듯 삼가면 위태로우나 허물이 없다.', meaning: '높은 자리에 오르기 직전의 치열한 경쟁기입니다. 성실과 겸허함으로 위기를 돌파합니다.', advice: '자만하지 말고 철저히 점검하고 밤낮으로 노력하세요.' },
    4: { hanja: '或躍在淵 无咎', text: '혹 도약하여 못에 있으니 허물이 없다.', meaning: '뛰어오를 것인가, 깊은 못에 머물 것인가를 살피는 유연한 결단의 순간입니다.', advice: '상황을 면밀히 관찰하며 도약의 타이밍을 잡으세요.' },
    5: { hanja: '飛龍在天 利見大人', text: '나는 용이 하늘에 있으니 대인을 봄이 이롭다.', meaning: '최절정의 전성기입니다. 하늘을 나는 용처럼 위엄을 떨치며 만인의 존경을 받습니다.', advice: '공명정대한 리더십으로 사람들을 이끌고 큰 비전을 펼치세요.' },
    6: { hanja: '亢龍有悔', text: '끝까지 오른 용은 후회가 있다.', meaning: '너무 높이 올라가면 내려올 길만 남았습니다. 극에 달한 권력이나 욕망은 화를 부릅니다.', advice: '한 걸음 물러서서 겸양의 미덕을 지키고 다음 세대에게 양보하세요.' },
  },
  2: { // 곤위지 (坤爲地)
    1: { hanja: '履霜 堅氷至', text: '서리를 밟으면 굳은 얼음이 이를 것을 알라.', meaning: '작은 조짐을 보고 다가올 큰 변화나 위기를 미리 대비하라는 경고입니다.', advice: '사소한 징후를 가볍게 여기지 말고 미리 대비책을 세우세요.' },
    2: { hanja: '直方大 不習 无不利', text: '곧고 바르며 넓고 크니 익히지 않아도 이롭지 않음이 없다.', meaning: '타고난 정직함과 포용력으로 자연스럽게 대사를 성취하는 지극히 온전한 상태입니다.', advice: '억지수를 쓰지 말고 순리와 진실함으로 밀고 나가세요.' },
    3: { hanja: '含章可貞 或從王事 无成有終', text: '빛남을 머금어 바름을 지키니, 혹 나랏일을 따르되 공을 탐하지 않고 마침을 거둔다.', meaning: '자신의 재능을 뽐내지 않고 묵묵히 맡은 바 책임을 다해 유종의 미를 거둡니다.', advice: '겸손히 실무를 챙기면 결국 큰 공로를 인정받습니다.' },
    4: { hanja: '括囊 无咎无譽', text: '주머니를 매듯 입을 다물면 허물도 없고 칭찬도 없다.', meaning: '위험한 시기에는 침묵을 지키고 입을 무겁게 하는 것이 신변을 보호하는 지혜입니다.', advice: '말실수나 구설을 극도로 조심하고 침묵을 지키세요.' },
    5: { hanja: '黃裳 元吉', text: '누런 치마를 입으니 으뜸으로 길하다.', meaning: '중도(中道)와 겸양의 덕을 갖추어 만인의 신뢰와 사랑을 한 몸에 받는 길한 때입니다.', advice: '조화롭고 온화한 태도로 갈등을 중재하고 덕을 베푸세요.' },
    6: { hanja: '龍戰于野 其血玄黃', text: '용이 들판에서 싸우니 그 피가 검고 누렇다.', meaning: '음과 양이 극단에 이르러 격렬하게 충돌하는 상입니다. 타협 없는 대립은 양패구상입니다.', advice: '극단적인 대립을 피하고 한 발 양보하여 출구를 찾으세요.' },
  },
  11: { // 지천태 (地天泰)
    1: { hanja: '拔茅茹 以其彙 征吉', text: '띠풀을 뽑으니 뿌리가 엉켜 함께 나오니 나아감이 길하다.', meaning: '뜻을 같이하는 훌륭한 동료들과 함께 협력하여 큰일을 시작하면 대길합니다.', advice: '혼자 일하지 말고 든든한 파트너와 함께 전진하세요.' },
    2: { hanja: '包荒 用馮河 不遐遺 朋亡 得尙于中行', text: '거친 자를 포용하고 맨몸으로 강을 건너며 먼 이를 버리지 않으니 중도에 부합한다.', meaning: '원대한 도량과 용기로 온갖 장애를 품어 안고 대업을 추진합니다.', advice: '편견을 버리고 넓은 포용력으로 인재를 품으세요.' },
    3: { hanja: '无平不陂 无往不復 艱貞无咎', text: '평평한 것은 기울지 않음이 없고 간 것은 돌아오지 않음이 없으니 바름을 지키면 허물이 없다.', meaning: '태평성대 속에서도 언젠가 닥칠 변화를 잊지 않고 중심을 지켜야 합니다.', advice: '호황일 때 불황을 대비하고 내실을 단단히 다지세요.' },
    4: { hanja: '翩翩 不富以其鄰 不戒以孚', text: '훨훨 날아 부유함으로 이웃을 돕고 경계하지 않아도 믿음이 있다.', meaning: '서로 간의 신뢰가 지극하여 사심 없이 협력하고 기쁨을 나눕니다.', advice: '마음을 활짝 열고 진솔한 소통으로 유대를 다지세요.' },
    5: { hanja: '帝乙歸妹 以祉 元吉', text: '제을이 누이동생을 시집보내니 복을 받아 으뜸으로 길하다.', meaning: '신분을 낮추어 겸손하게 결합하니 더할 나위 없는 축복과 경사가 넘쳐납니다.', advice: '혼인, 계약, 협약이 성사되며 큰 행복이 찾아옵니다.' },
    6: { hanja: '城復于隍 勿用師 自邑告命 貞吝', text: '성벽이 허물어져 해자로 돌아가니 군사를 쓰지 말라.', meaning: '태평의 기운이 다하고 혼란이 시작되려 하니 무리한 확장을 멈추고 수습해야 합니다.', advice: '내부를 단속하고 수성에 집중하며 변혁을 기다리세요.' },
  },
  12: { // 천지비 (天地否)
    1: { hanja: '拔茅茹 以其彙 貞吉 亨', text: '띠풀 뿌리가 얽혀 나오듯 바름을 지키면 길하고 형통하다.', meaning: '어두운 시절에는 동지들과 함께 은둔하며 바른 뜻을 지켜야 합니다.', advice: '경솔하게 나서지 말고 실력 있는 동료들과 결속하세요.' },
    2: { hanja: '包承 小人吉 大人否亨', text: '아첨을 받아들이면 소인은 길하나 대인은 막혀야 형통하다.', meaning: '불의와 타협하지 않고 고결한 원칙을 지키는 것이 진정한 군자의 도리입니다.', advice: '달콤한 유혹에 흔들리지 말고 원칙을 고수하세요.' },
    5: { hanja: '休否 大人吉 其亡其亡 繫于苞桑', text: '막힘을 끝내니 대인이 길하다. 멸망할까 두려워 뽕나무 뿌리에 굳게 맨다.', meaning: '마침내 오랜 암흑기가 걷히고 새로운 서광이 비추기 시작합니다.', advice: '위기감을 잊지 않고 튼튼한 기반을 세워 대업을 추진하세요.' },
  },
  63: { // 수화기제 (水火旣濟)
    1: { hanja: '曳其輪 濡其尾 无咎', text: '수레바퀴를 끌고 꼬리를 적시나 허물이 없다.', meaning: '이미 모든 일이 완성되었으니 더 욕심내지 말고 속도를 늦추어야 안전합니다.', advice: '무리한 질주를 멈추고 브레이크를 밟으세요.' },
    2: { hanja: '婦喪其茀 勿逐 七日得', text: '여인이 가리개를 잃었으나 쫓지 마라. 7일이면 얻으리라.', meaning: '잃어버린 것에 연연하여 허둥대지 않아도 때가 되면 저절로 제자리로 돌아옵니다.', advice: '조급함을 내려놓고 편안히 기다리세요.' },
    5: { hanja: '東隣殺牛 不如西隣之禴祭 實受其福', text: '동쪽 이웃이 소를 잡는 것보다 서쪽 이웃의 소박한 제사가 진실로 복을 받는다.', meaning: '화려한 겉치레보다 진실된 정성과 소박한 마음이 하늘의 큰 복을 받습니다.', advice: '형식적인 허례허식을 버리고 진정성으로 승부하세요.' },
  },
  64: { // 화수미제 (火水未濟)
    1: { hanja: '濡其尾 吝', text: '어린 여우가 강을 건너다 꼬리를 적시니 부끄럽다.', meaning: '의욕만 앞서 준비 없이 서두르면 초반에 낭패를 봅니다.', advice: '철저한 준비 후에 발을 내딛으세요.' },
    2: { hanja: '曳其輪 貞吉', text: '수레를 끌며 바름을 지키니 길하다.', meaning: '신중하게 속도를 조절하며 중심을 지키면 마침내 큰 강을 건넙니다.', advice: '인내심을 갖고 꾸준히 목표를 향해 나아가세요.' },
    5: { hanja: '君子之光 有孚 吉', text: '군자의 빛남이요 믿음이 있으니 길하다.', meaning: '어둠이 물러가고 영광의 빛이 비추니 성공의 정상에 우뚝 섭니다.', advice: '당당하게 빛을 발하며 사람들의 신망을 얻으세요.' },
  },
};

/**
 * Returns authentic Yao information for a given hexagram and line position (1~6)
 */
export function getYaoDetail(
  hex: HexagramData,
  position: number, // 1 to 6
  lineType: 'yin' | 'yang',
  isMoving: boolean
): YaoDetail {
  const lineNamesYin = ['초육(初六)', '육이(六二)', '육삼(六三)', '육사(六四)', '육오(六五)', '상육(上六)'];
  const lineNamesYang = ['초구(初九)', '구이(九二)', '구삼(九三)', '구사(九四)', '구오(九五)', '상구(上九)'];
  const lineName = lineType === 'yang' ? lineNamesYang[position - 1] : lineNamesYin[position - 1];

  // Check famous Yao database
  const famous = FAMOUS_YAO_DATABASE[hex.num]?.[position];
  if (famous) {
    return {
      position,
      lineName,
      classicalHanja: famous.hanja,
      koreanText: famous.text,
      modernMeaning: famous.meaning,
      actionGuidance: isMoving 
        ? `[동효(動爻) 특별 계시] 기운이 변화하여 미래의 새로운 국면을 엽니다. ${famous.advice}`
        : famous.advice,
    };
  }

  // Systematic generation for other hexagram lines based on traditional position theory
  const positionTheories = [
    {
      pos: 1,
      role: '초효 (시작의 자리)',
      advice: '기반을 닦고 관망할 때입니다. 성급한 착수를 경계하고 기초를 다지세요.',
      hanjaSuffix: '始基 愼始',
    },
    {
      pos: 2,
      role: '이효 (내괘의 중정)',
      advice: '내부의 실력을 인정받는 길한 자리입니다. 조력자와 성실히 협력하세요.',
      hanjaSuffix: '中正 順承',
    },
    {
      pos: 3,
      role: '삼효 (과도기의 위기)',
      advice: '내부에서 외부로 나아가는 불안정한 기로입니다. 신중한 처세와 자중이 필수입니다.',
      hanjaSuffix: '過度 謹愼',
    },
    {
      pos: 4,
      role: '사효 (외괘의 진입)',
      advice: '지도자의 측근에서 신뢰를 시험받는 자리입니다. 윗사람을 겸손히 보좌하세요.',
      hanjaSuffix: '近君 謙德',
    },
    {
      pos: 5,
      role: '오효 (최고의 중정)',
      advice: '군주와 수장의 자리로 전성기입니다. 공명정대하게 덕을 베풀고 비전을 펼치세요.',
      hanjaSuffix: '飛躍 尊位',
    },
    {
      pos: 6,
      role: '상효 (마무리의 자리)',
      advice: '극단에 이른 끝자리입니다. 욕심을 내려놓고 유종의 미를 거두며 순응하세요.',
      hanjaSuffix: '極終 悔吝',
    },
  ];

  const info = positionTheories[position - 1];
  const movingNote = isMoving
    ? `현재 이 효에 동효(動爻)가 발생하여 강한 변혁의 파동이 일어납니다. 정체된 흐름이 깨어지고 다음 국면으로 도약합니다.`
    : `안정된 정효(靜爻)로 현재의 질서와 원칙을 굳건히 지키는 것이 유익합니다.`;

  return {
    position,
    lineName,
    classicalHanja: `${hex.nameHanja}之${lineName.slice(0, 2)} ${info.hanjaSuffix}`,
    koreanText: `${hex.nameKr}의 ${info.role}로서 ${lineType === 'yang' ? '강건한 양기(陽氣)' : '유순한 음기(陰氣)'}가 머뭅니다.`,
    modernMeaning: `${hex.symbolMeaning}. ${movingNote}`,
    actionGuidance: `${info.advice} ${hex.actionGuidance}`,
  };
}

/**
 * Returns 4 extended domain fortunes for a hexagram
 */
export function getExtendedFortunes(hex: HexagramData): {
  exam: string;
  litigation: string;
  movement: string;
  wishTiming: string;
} {
  const upperTrigram = EIGHT_TRIGRAMS[hex.upperKey] || EIGHT_TRIGRAMS['건'];

  let exam = '';
  if (hex.score >= 90) {
    exam = '시험, 국가고시, 자격증 취득, 승진 심사에서 독보적인 상위 합격운입니다. 갈고닦은 실력을 유감없이 발휘하세요.';
  } else if (hex.score >= 80) {
    exam = '실력을 충분히 인정받으며 면접과 논술에서 호평을 얻습니다. 막판 꼼꼼한 마무리가 합격의 열쇠입니다.';
  } else if (hex.score >= 70) {
    exam = '경쟁률이 치열하여 한두 문제 차이로 갈릴 수 있으니 오답 노트를 철저히 점검하고 기본에 집중하세요.';
  } else {
    exam = '눈높이를 조금 낮추거나 다음 회차를 기약하며 기초를 보강하는 것이 장기적으로 훨씬 유리합니다.';
  }

  let litigation = '';
  if (hex.num === 6 || hex.num === 47) {
    litigation = '송사나 시비수가 강하니 독단적인 법적 대응보다 제3자의 중재를 통한 조기 합의가 최선입니다.';
  } else if (hex.score >= 85) {
    litigation = '명분과 증거가 뚜렷하여 시비에서 무탈하게 벗어나며, 공정한 판결을 통해 억울함이 깨끗이 해소됩니다.';
  } else {
    litigation = '문서상 착오나 감정싸움으로 번지지 않도록 계약서와 증빙을 철저히 확보하고 언행을 조심하세요.';
  }

  let movement = '';
  if (hex.upperKey === '손' || hex.upperKey === '진' || hex.lowerKey === '손' || hex.lowerKey === '진') {
    movement = '이동수(移動數)가 활발하게 일어납니다. 이사, 지사 발령, 해외 출장, 부동산 매매에 좋은 기운이 깃듭니다.';
  } else if (hex.upperKey === '간' || hex.lowerKey === '간') {
    movement = '산(山)의 기운으로 지금은 멈추어 자리를 보전하는 것이 안전합니다. 무리한 이사나 급매는 보류하세요.';
  } else if (hex.score >= 88) {
    movement = '원하던 입지의 터전으로 순조롭게 이주하며, 부동산 매도와 매수가 적기에 성사되는 호운입니다.';
  } else {
    movement = '계약 조건과 주변 환경을 두 번 이상 현장 답사한 뒤 신중하게 결정하십시오.';
  }

  const seasons: Record<string, string> = {
    '목(木)': '봄철(양력 3~5월) 또는 목요일, 음력 초승',
    '화(火)': '여름철(양력 6~8월) 또는 화요일, 한낮의 시간',
    '토(土)': '환절기 또는 계절의 끝자락, 차분한 주말',
    '금(金)': '가을철(양력 9~11월) 또는 금요일, 일몰 무렵',
    '수(水)': '겨울철(양력 12~2월) 또는 수요일, 밤 시간대',
  };
  const bestTiming = seasons[upperTrigram.element] || '향후 3주에서 3개월 사이';
  const wishTiming = `소원 성취의 최적 시기는 [${bestTiming}]입니다. 하늘의 기운이 ${upperTrigram.nature}과 조화를 이루는 때에 결단을 내리세요.`;

  return {
    exam,
    litigation,
    movement,
    wishTiming,
  };
}

/**
 * Web Audio API synthesized realistic bronze coin sound
 */
export function playCoinClinkSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const baseFreqs = [1900, 2400, 3100, 3900];
    const delays = [0, 0.04, 0.09];

    delays.forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800 + Math.random() * 400, ctx.currentTime);
      filter.Q.setValueAtTime(8, ctx.currentTime);

      osc.type = 'triangle';
      const freq = baseFreqs[idx % baseFreqs.length] + (Math.random() * 200 - 100);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.16);
    });
  } catch {
    // Graceful fallback if audio context blocked
  }
}
