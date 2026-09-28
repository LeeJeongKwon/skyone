import { TalismanConfig, TalismanType } from '../types';

export interface TalismanPreset {
  type: TalismanType;
  title: string;
  hanjaTitle: string;
  category: '가정/인연' | '학업/시험' | '액막이/소멸' | '재물/사업' | '건강/심신';
  incantation: string;
  shortWish: string;
  description: string;
  efficacy: string;
}

export const TALISMAN_PRESETS: TalismanPreset[] = [
  // 1. 가출방지부 (User's image authentic 1st talisman)
  {
    type: 'home_departure',
    title: '가출방지부 (家出防止符)',
    hanjaTitle: '家出防止 歸家安心',
    category: '가정/인연',
    incantation: '천지신명 옥황상제 칙령, 방황하는 영혼을 거두사 가족과 연인의 곁으로 무탈히 귀환케 하고, 밖으로 겉도는 마음을 쇠사슬처럼 단단히 결속하여 영구히 안주케 하라. 급급여률령(急急如律令)!',
    shortWish: '귀가안심 가족화합 가출영절',
    description: '가족, 배우자, 자녀가 집을 나가거나 밖으로 방황하지 않고 가정의 따뜻한 품으로 조속히 돌아와 화합하도록 묶어두는 정통 비전 부적',
    efficacy: '가출 방지, 방황 종식, 귀소 본능 자극, 가정 화합 및 심신 안정',
  },
  // 2. 공부부 (User's image authentic 2nd talisman)
  {
    type: 'exam',
    title: '공부부 (工夫符 · 考試合格符)',
    hanjaTitle: '文昌點頭 必勝及第',
    category: '학업/시험',
    incantation: '문창제군 괴성점두의 총명한 서광이 임하시어, 흐린 정신은 맑아지고 두뇌는 거울처럼 밝아져 배운 바를 온전히 기억하며 시험장마다 필승 합격의 영예를 안으리라. 급급여률령(急急如律令)!',
    shortWish: '문창대길 필승합격 등과급제',
    description: '수험생, 고시생, 자격증 및 취업 준비생의 잡념을 없애고 두뇌 회전과 집중력을 극대화하여 원하는 시험에 당당히 합격시키는 영부',
    efficacy: '집중력 극대화, 암기력 향상, 시험 불안 해소, 국가고시 및 수능 필승 합격',
  },
  // 3. 관재소멸부 (User's image authentic 3rd talisman)
  {
    type: 'litigation_ward',
    title: '관재소멸부 (官災消滅符)',
    hanjaTitle: '官災消滅 獄事永消',
    category: '액막이/소멸',
    incantation: '옥추보경 사십팔신장 벽력검을 휘두르사, 관청의 송사, 소송, 시비, 경찰·법원의 모든 관재액운은 눈 녹듯 소멸하고 의로운 승소와 무탈 평안만 머물라. 급급여률령(急急如律令)!',
    shortWish: '관재소멸 송사무탈 시비영절',
    description: '뜻하지 않은 소송, 법적 분쟁, 벌금, 경찰 조사, 형사·민사상 관재구설의 악운을 일시에 끊어내고 승소와 평화를 가져오는 액막이 부적',
    efficacy: '소송 승소, 법적 분쟁 조기 해결, 벌금·처벌 경감, 경찰·관청 액운 소멸',
  },
  // 4. 구설방지부 (User's image authentic 4th talisman)
  {
    type: 'gossip_ward',
    title: '구설방지부 (口舌防止符)',
    hanjaTitle: '口舌永閉 百邪不侵',
    category: '액막이/소멸',
    incantation: '남방화덕진군 칙령, 간사한 자들의 험담과 시기질투하는 입술을 삼중 철책으로 봉인하사, 음해와 모함은 제 발등을 찍고 나의 명예는 해처럼 드높으리라. 급급여률령(急急如律令)!',
    shortWish: '시비구설 영구소멸 명예보호',
    description: '직장이나 사회에서 억울한 구설수, 모함, 험담, 악성 루머를 단호히 차단하고 대인관계의 평온과 명예를 지켜주는 비전 방패 부적',
    efficacy: '악성 루머 차단, 직장 내 시비 방지, 음해 세력 무력화, 인덕(人德) 회복',
  },
  // 5. 귀인협조부 (User's image authentic 5th talisman)
  {
    type: 'noble_helper',
    title: '귀인협조부 (貴人協助符)',
    hanjaTitle: '貴人相助 萬事有成',
    category: '가정/인연',
    incantation: '동서남북 사방 천하의 천을귀인과 문곡귀인이 감응하사, 어려운 고비마다 뜻밖의 조력자가 나타나 길을 열어주고 위기를 기회로 바꾸게 하소서. 급급여률령(急急如律令)!',
    shortWish: '천을귀인 사방상조 만사대길',
    description: '막막한 상황에 처했을 때 유력한 귀인, 스승, 투자자, 조력자의 도움을 받아 어려움을 일시에 돌파하고 성공으로 인도하는 비전 영부',
    efficacy: '천을귀인 유치, 유력 조력자 등장, 취업·투자 성사, 인생 역전의 활로 개척',
  },
  // 6. 금주부 (User's image authentic 6th talisman)
  {
    type: 'sobriety',
    title: '금주부 (禁酒符 · 斷酒符)',
    hanjaTitle: '斷酒淸心 宿疾永滅',
    category: '건강/심신',
    incantation: '태상노군 칙령, 술독과 주사를 부르는 음습한 마귀를 벽력칼로 베어버리고, 술잔을 멀리하여 심신을 맑고 깨끗하게 보전케 하라. 급급여률령(急急如律令)!',
    shortWish: '금주성공 심신청정 주독소멸',
    description: '과도한 음주, 알코올 의존, 술주정으로 인한 가정 파탄과 건강 악화를 막고 술을 단호히 끊어 심신을 맑게 다스리게 돕는 부적',
    efficacy: '음주 욕구 감퇴, 술자리 절제력 강화, 주독(酒毒) 해소, 건강과 가정 평화 회복',
  },
  // 7. 대재용출부 (재물)
  {
    type: 'wealth',
    title: '대재용출부 (大財湧出符)',
    hanjaTitle: '萬金大吉 財源廣進',
    category: '재물/사업',
    incantation: '천지신명 옥황상제 칙령, 사방 천하의 황금과 보화는 샘물처럼 솟아나 소원자의 금고를 가득 채우고 막힌 재운을 일시에 뚫으라. 급급여률령(急急如律令)!',
    shortWish: '대재용출 만사대길 재물풍요',
    description: '마르지 않는 샘물처럼 사방에서 큰 재물과 횡재수를 끌어당겨 가문과 사업의 금고를 풍요롭게 채우는 천명원 최고 영험 재물부',
    efficacy: '금전운 대통, 횡재수 유입, 투자 성공, 빚 탕감 및 부의 축적',
  },
  // 8. 만사형통부 (소원성취)
  {
    type: 'wishes_come_true',
    title: '만사형통부 (萬事亨通符)',
    hanjaTitle: '萬事亨通 如意吉祥',
    category: '가정/인연',
    incantation: '천원지방 일월성신 비추사, 막힌 기운은 일시에 관통되고 뜻하는 모든 소망은 봄바람 탄 돛단배처럼 만리형통하라. 급급여률령(急急如律令)!',
    shortWish: '만사형통 여의길상 소망성취',
    description: '꼬이고 엉킨 운세를 시원하게 풀어주어 하고자 하는 모든 일과 프로젝트가 순풍을 만나 일사천리로 성취되도록 돕는 만능 영부',
    efficacy: '운세 정체 해소, 소원 성취, 만사대길, 얽힌 난제 순조로운 해결',
  },
  // 9. 무병장수부 (건강)
  {
    type: 'health',
    title: '무병장수부 (無病長壽符)',
    hanjaTitle: '身健氣旺 壽如南山',
    category: '건강/심신',
    incantation: '오방 신령이 수호하사 온갖 병마와 살기는 물러가고, 오장육부 기혈이 활기차게 순환하여 남산처럼 우뚝 선 장수를 누리리라. 급급여률령(急急如律令)!',
    shortWish: '신건기왕 무병장수 심신평안',
    description: '오랜 지병, 만성 피로, 질병의 고통을 물리치고 환자의 쾌유와 온 가족의 강건한 생명력을 지켜주는 불로장수 보신 부적',
    efficacy: '기력 회복, 병마 퇴치, 수술 후 조기 회복, 심신 평온 및 장수',
  },
  // 10. 양연성취부 (애정/화합)
  {
    type: 'love',
    title: '양연성취부 (良緣成就符)',
    hanjaTitle: '佳緣滿合 夫婦同心',
    category: '가정/인연',
    incantation: '월하노인 붉은 실로 맺으신 천생가연, 두 사람의 마음은 쇠보다 단단하고 연리지처럼 하나되어 영원토록 화목하라. 급급여률령(急急如律令)!',
    shortWish: '천생가연 화합성취 백년해로',
    description: '소중한 연인과의 인연을 굳건히 맺어주고 부부간의 갈등과 권태기를 녹여 화목하고 따뜻한 사랑을 백년해로로 이어주는 비전 사랑부',
    efficacy: '이상형과의 인연 성사, 부부 갈등 해소, 애정 회복, 결혼 성취',
  },
  // 11. 벽사삼재부 (액막이)
  {
    type: 'evil_ward',
    title: '벽사삼재부 (辟邪三災符)',
    hanjaTitle: '百邪永滅 三災消散',
    category: '액막이/소멸',
    incantation: '사십팔신장 벼락검과 삼두일족응이 삼재팔난과 불길한 살기, 잡귀잡신을 단호히 멸하고 천복만 깃들게 하라. 급급여률령(急急如律令)!',
    shortWish: '삼재소멸 백사영멸 액난퇴치',
    description: '들삼재, 묵삼재, 날삼재의 3년 액운과 사주상의 흉살, 액난을 강력한 신장의 힘으로 쳐내어 집안을 안락하게 지키는 최고봉 벽사부',
    efficacy: '삼재팔난 완전 소멸, 흉살 방어, 사고 예방, 악몽 및 가위눌림 퇴치',
  },
  // 12. 영업흥왕부 (사업)
  {
    type: 'business_prosper',
    title: '영업흥왕부 (營業興旺符)',
    hanjaTitle: '門前成市 萬客雲集',
    category: '재물/사업',
    incantation: '사해용왕 칙령, 동서남북 고객과 계약의 발길이 구름처럼 몰려와 문전문시를 이루고 날마다 매출이 억만금으로 폭증하라. 급급여률령(急急如律令)!',
    shortWish: '영업대길 만객운집 사업번창',
    description: '가게, 회사, 상점, 온라인 사업에 고객의 발길이 끊이지 않고 대형 계약과 매출이 폭발적으로 상승하도록 기운을 모아주는 영업 비부',
    efficacy: '단골손님 급증, 계약 성사율 제고, 매장 번창, 불황 극복',
  },
];

/**
 * Helper to draw calligraphic brush strokes with natural width variation
 */
function drawBrushLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w1: number,
  w2: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return;

  const angle = Math.atan2(dy, dx);
  const perp = angle + Math.PI / 2;

  const p1x = x1 + Math.cos(perp) * (w1 / 2);
  const p1y = y1 + Math.sin(perp) * (w1 / 2);
  const p2x = x1 - Math.cos(perp) * (w1 / 2);
  const p2y = y1 - Math.sin(perp) * (w1 / 2);
  const p3x = x2 - Math.cos(perp) * (w2 / 2);
  const p3y = y2 - Math.sin(perp) * (w2 / 2);
  const p4x = x2 + Math.cos(perp) * (w2 / 2);
  const p4y = y2 + Math.sin(perp) * (w2 / 2);

  ctx.beginPath();
  ctx.moveTo(p1x, p1y);
  ctx.lineTo(p2x, p2y);
  ctx.lineTo(p3x, p3y);
  ctx.lineTo(p4x, p4y);
  ctx.closePath();
  ctx.fill();

  // Round caps
  ctx.beginPath();
  ctx.arc(x1, y1, w1 / 2, 0, Math.PI * 2);
  ctx.arc(x2, y2, w2 / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Draws the authentic Korean traditional vertical "勅令" (Cheongnyeong) calligraphy
 * exactly like master talisman scrolls with connected energetic brushwork.
 */
function drawCheongryeongHeader(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  topY: number,
  primaryColor: string,
  deepColor: string,
  glowColor: string
) {
  ctx.save();

  // 1. 三台星 (Sam-tae-seong: Three Sacred Heavenly Stars: 虛精, 六淳, 曲生)
  const stars = [
    { x: centerX - 42, y: topY - 26, r: 6.5 },
    { x: centerX, y: topY - 34, r: 7.5 },
    { x: centerX + 42, y: topY - 26, r: 6.5 },
  ];

  stars.forEach((s) => {
    // Aura
    ctx.beginPath();
    ctx.fillStyle = glowColor;
    ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.fillStyle = deepColor;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // Upward ray
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - s.r);
    ctx.lineTo(s.x, s.y - s.r - 8);
    ctx.stroke();
  });

  // Connecting heavenly arch (天罡蓋)
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 68, topY - 14);
  ctx.quadraticCurveTo(centerX, topY - 38, centerX + 68, topY - 14);
  ctx.stroke();

  // Left & Right Celestial clouds
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX - 72, topY - 10, 8, Math.PI * 0.3, Math.PI * 1.8);
  ctx.arc(centerX + 72, topY - 10, 8, Math.PI * 1.2, Math.PI * 2.7);
  ctx.stroke();

  // 2. The Vertical Decree "勅 令"
  // Written in powerful, stylized calligraphic talisman script
  ctx.fillStyle = deepColor;
  ctx.strokeStyle = deepColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // --- Character 1: 勅 (Cheok) ---
  const chkY = topY + 8;
  // Left 束 part:
  // Horizontal sweep
  drawBrushLine(ctx, centerX - 54, chkY, centerX - 8, chkY, 5, 4, deepColor);
  // Center vertical stem
  drawBrushLine(ctx, centerX - 32, chkY - 16, centerX - 32, chkY + 36, 6, 4.5, deepColor);
  // Middle box (口)
  ctx.lineWidth = 3.5;
  ctx.strokeRect(centerX - 46, chkY + 4, 28, 16);
  // Left down splay (撇)
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.moveTo(centerX - 36, chkY + 22);
  ctx.quadraticCurveTo(centerX - 48, chkY + 34, centerX - 56, chkY + 44);
  ctx.stroke();
  // Right down dot/sweep (捺)
  ctx.beginPath();
  ctx.lineWidth = 4.5;
  ctx.moveTo(centerX - 28, chkY + 22);
  ctx.quadraticCurveTo(centerX - 16, chkY + 32, centerX - 10, chkY + 42);
  ctx.stroke();

  // Right 力 part:
  // Horizontal to hook
  ctx.beginPath();
  ctx.lineWidth = 5.5;
  ctx.moveTo(centerX + 2, chkY - 4);
  ctx.lineTo(centerX + 38, chkY - 4);
  ctx.quadraticCurveTo(centerX + 44, chkY + 12, centerX + 40, chkY + 38);
  ctx.quadraticCurveTo(centerX + 36, chkY + 44, centerX + 26, chkY + 38); // Hook
  ctx.stroke();
  // Diagonal slash through 力
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.moveTo(centerX + 22, chkY - 16);
  ctx.quadraticCurveTo(centerX + 16, chkY + 18, centerX + 4, chkY + 44);
  ctx.stroke();

  // --- Character 2: 令 (Ryeong) ---
  const rygY = chkY + 54;
  // Top roof (亼)
  // Left sweep (人 left)
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.moveTo(centerX, rygY);
  ctx.quadraticCurveTo(centerX - 32, rygY + 14, centerX - 56, rygY + 32);
  ctx.stroke();
  // Right sweep (人 right)
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.moveTo(centerX, rygY);
  ctx.quadraticCurveTo(centerX + 32, rygY + 14, centerX + 56, rygY + 32);
  ctx.stroke();

  // Top dot
  ctx.beginPath();
  ctx.arc(centerX, rygY - 4, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Inner tuck line
  drawBrushLine(ctx, centerX - 24, rygY + 24, centerX + 24, rygY + 24, 4.5, 4, deepColor);

  // Bottom hook (マ / 卩) that channels downward
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.moveTo(centerX - 16, rygY + 32);
  ctx.lineTo(centerX + 16, rygY + 32);
  ctx.lineTo(centerX - 12, rygY + 52);
  ctx.lineTo(centerX + 12, rygY + 52);
  ctx.quadraticCurveTo(centerX + 18, rygY + 58, centerX + 2, rygY + 70); // Flow into main spine!
  ctx.stroke();

  // 3. Thunder Canopy Arch (벽력 운뢰 雲雷) beneath 勅令
  const canopyY = rygY + 76;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX - 82, canopyY);
  ctx.bezierCurveTo(centerX - 46, canopyY - 14, centerX - 26, canopyY + 10, centerX, canopyY + 2);
  ctx.bezierCurveTo(centerX + 26, canopyY + 10, centerX + 46, canopyY - 14, centerX + 82, canopyY);
  ctx.stroke();

  // Small thunder curls
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX - 82, canopyY + 6, 6, Math.PI * 1.5, Math.PI * 3.5);
  ctx.arc(centerX + 82, canopyY + 6, 6, Math.PI * 1.5, Math.PI * 3.5);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws the specific authentic talisman body glyphs (符身)
 */
function drawTalismanBody(
  ctx: CanvasRenderingContext2D,
  type: TalismanType,
  cx: number,
  bodyY: number,
  deepColor: string,
  primaryColor: string
) {
  ctx.save();
  ctx.strokeStyle = deepColor;
  ctx.fillStyle = deepColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Central mystical spine: Descending lightning cord
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx, bodyY);
  ctx.lineTo(cx, bodyY + 28);
  // Loop 1 (Heaven sphere)
  ctx.bezierCurveTo(cx - 36, bodyY + 38, cx - 44, bodyY + 70, cx, bodyY + 78);
  ctx.bezierCurveTo(cx + 44, bodyY + 86, cx + 36, bodyY + 118, cx, bodyY + 126);
  ctx.lineTo(cx, bodyY + 146);
  ctx.stroke();

  // Horizontal protective thunder bars (雷電 橫柵)
  const barPositions = [
    { y: bodyY + 42, span: 64 },
    { y: bodyY + 74, span: 78 },
    { y: bodyY + 106, span: 72 },
    { y: bodyY + 138, span: 58 },
  ];

  barPositions.forEach((b, idx) => {
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - b.span, b.y);
    ctx.lineTo(cx + b.span, b.y);
    ctx.stroke();

    // Downward lightning teeth / spears
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - b.span, b.y);
    ctx.lineTo(cx - b.span + 8, b.y + 12);
    ctx.moveTo(cx + b.span, b.y);
    ctx.lineTo(cx + b.span - 8, b.y + 12);
    ctx.stroke();

    // Sacred dot seals on alternating bars
    if (idx % 2 === 1) {
      ctx.beginPath();
      ctx.arc(cx - b.span - 6, b.y, 3, 0, Math.PI * 2);
      ctx.arc(cx + b.span + 6, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 2. Specific Talisman Sacred Core Seal Runes (비전 신장 부문)
  const coreY = bodyY + 160;

  switch (type) {
    case 'home_departure': {
      // 가출방지부 (家出防止符) - Dual 朋 朋 connected with binding cage and return seal
      ctx.font = '900 28px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('朋   朋', cx, coreY + 36);

      // Enclosing binding cage (결속 울타리)
      ctx.lineWidth = 3.5;
      ctx.strokeRect(cx - 68, coreY + 6, 136, 44);

      // Cross lock spears
      ctx.beginPath();
      ctx.moveTo(cx - 68, coreY + 6);
      ctx.lineTo(cx + 68, coreY + 50);
      ctx.moveTo(cx + 68, coreY + 6);
      ctx.lineTo(cx - 68, coreY + 50);
      ctx.stroke();

      // Return home seal (歸家 룬문자)
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('歸家同住', cx, coreY + 84);

      // Binding chain rings (귀소 결속 3중 고리)
      [-36, 0, 36].forEach((ox) => {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(cx + ox, coreY + 116, 14, 0, Math.PI * 2);
        ctx.stroke();
      });
      break;
    }

    case 'exam': {
      // 공부부 (工夫符) - 문창성 붓끝 창날과 총명 뇌전문
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('文 昌', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('必勝及第', cx, coreY + 64);

      // Scholar brush & dragon spears
      ctx.beginPath();
      ctx.lineWidth = 3.5;
      ctx.moveTo(cx - 52, coreY + 8);
      ctx.lineTo(cx - 52, coreY + 84);
      ctx.lineTo(cx - 58, coreY + 98);
      ctx.moveTo(cx + 52, coreY + 8);
      ctx.lineTo(cx + 52, coreY + 84);
      ctx.lineTo(cx + 58, coreY + 98);
      ctx.stroke();

      // 7-step Wisdom Thunder Staircase (총명 7단 뇌전문)
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const sy = coreY + 82 + i * 8;
        const sw = 38 - i * 4;
        ctx.moveTo(cx - sw, sy);
        ctx.lineTo(cx + sw, sy);
      }
      ctx.stroke();
      break;
    }

    case 'litigation_ward': {
      // 관재소멸부 (官災消滅符) - 官자를 쪼개는 벼락검과 4중 방패
      ctx.font = '900 28px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('官 災', cx, coreY + 30);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('永滅消散', cx, coreY + 68);

      // Thunder execution sword piercing through center
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.moveTo(cx, coreY - 6);
      ctx.lineTo(cx, coreY + 128);
      ctx.moveTo(cx - 32, coreY + 14);
      ctx.lineTo(cx + 32, coreY + 14); // Crossguard
      ctx.stroke();

      // Prison bars & lawsuit nullification shield
      ctx.lineWidth = 2.8;
      ctx.strokeRect(cx - 58, coreY + 82, 116, 42);
      for (let x = cx - 40; x <= cx + 40; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, coreY + 82);
        ctx.lineTo(x, coreY + 124);
        ctx.stroke();
      }
      break;
    }

    case 'gossip_ward': {
      // 구설방지부 (口舌防止符) - 口를 잠그는 3중 封과 뱀의 혀 차단 가위
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('口 舌', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('永遠封鎖', cx, coreY + 66);

      // Sealed mouth triple box (3중 봉인 口)
      ctx.lineWidth = 3.5;
      ctx.strokeRect(cx - 28, coreY + 80, 56, 36);
      ctx.strokeRect(cx - 22, coreY + 86, 44, 24);

      // Scissors cutting slanderous tongue
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(cx - 54, coreY + 76);
      ctx.lineTo(cx + 54, coreY + 126);
      ctx.moveTo(cx + 54, coreY + 76);
      ctx.lineTo(cx - 54, coreY + 126);
      ctx.stroke();
      break;
    }

    case 'noble_helper': {
      // 귀인협조부 (貴人協助符) - 貴人과 사방 인도 비익조 날개
      ctx.font = '900 28px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('貴 人', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('相助大吉', cx, coreY + 64);

      // Four-directional celestial helper arches
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Left helper wing
      ctx.arc(cx - 42, coreY + 98, 22, Math.PI * 0.8, Math.PI * 2.2);
      // Right helper wing
      ctx.arc(cx + 42, coreY + 98, 22, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();

      // Central lotus beacon
      ctx.beginPath();
      ctx.arc(cx, coreY + 98, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'sobriety': {
      // 금주부 (禁酒符) - 술단지(酉)를 가르는 번개 칼날
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('禁 酒', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('斷酒淸心', cx, coreY + 64);

      // Wine jug broken rune
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, coreY + 96, 26, 0, Math.PI * 2);
      ctx.stroke();

      // Thunder slash cutting the jar
      ctx.beginPath();
      ctx.lineWidth = 4.5;
      ctx.moveTo(cx - 38, coreY + 70);
      ctx.lineTo(cx + 38, coreY + 122);
      ctx.stroke();
      break;
    }

    case 'wealth': {
      // 대재용출부 (大財湧出符) - 萬金과 聚寶盆(보물단지)
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('萬 金', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('大財湧出', cx, coreY + 64);

      // Golden cauldron & 4 wealth spirals
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, coreY + 96, 24, Math.PI * 0.1, Math.PI * 0.9); // Pot rim
      ctx.stroke();
      // Spirals sucking in gold from all four corners
      ctx.beginPath();
      ctx.arc(cx - 44, coreY + 84, 16, 0, Math.PI * 1.6);
      ctx.arc(cx + 44, coreY + 84, 16, Math.PI * 0.4, Math.PI * 2.0);
      ctx.stroke();

      // Ancient cash coin circle (엽전)
      ctx.strokeRect(cx - 7, coreY + 104, 14, 14);
      break;
    }

    case 'wishes_come_true': {
      // 만사형통부 (萬事亨通符) - 萬事 亨通과 여의주 소용돌이
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('萬 事', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('如意亨通', cx, coreY + 64);

      // Dynamic Yin-Yang & wish-granting jewel
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, coreY + 96, 26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, coreY + 70);
      ctx.bezierCurveTo(cx - 18, coreY + 82, cx - 18, coreY + 96, cx, coreY + 96);
      ctx.bezierCurveTo(cx + 18, coreY + 96, cx + 18, coreY + 110, cx, coreY + 122);
      ctx.stroke();
      break;
    }

    case 'health': {
      // 무병장수부 (無病長壽符) - 無病과 壽 백수도 전서 룬
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('無 病', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('身健長壽', cx, coreY + 64);

      // Longevity turtle shell hex shield
      ctx.lineWidth = 3;
      ctx.beginPath();
      const r = 24;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = cx + Math.cos(a) * r;
        const py = coreY + 96 + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Center eternal vitality flame
      ctx.beginPath();
      ctx.arc(cx, coreY + 96, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'love': {
      // 양연성취부 (良緣成就符) - 佳緣 同心과 연리지 붉은 실 매듭
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('佳 緣', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('夫婦同心', cx, coreY + 64);

      // Double interlocking twin rings (연리목 매듭)
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx - 18, coreY + 96, 20, 0, Math.PI * 2);
      ctx.arc(cx + 18, coreY + 96, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Binding knot center
      ctx.beginPath();
      ctx.arc(cx, coreY + 96, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'evil_ward': {
      // 벽사삼재부 (辟邪三災符) - 三災 鎭 룬과 사십팔신장 벼락검
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('三 災', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('百邪永滅', cx, coreY + 64);

      // Seven Star Demon Slayer Blade (칠성 벽사도)
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 48, coreY + 76);
      ctx.lineTo(cx + 48, coreY + 120);
      ctx.moveTo(cx + 48, coreY + 76);
      ctx.lineTo(cx - 48, coreY + 120);
      ctx.stroke();

      // Three sealing dots (삼두 매 발톱)
      [-28, 0, 28].forEach((ox) => {
        ctx.beginPath();
        ctx.arc(cx + ox, coreY + 128, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'business_prosper':
    default: {
      // 영업흥왕부 (營業興旺符) - 興旺 門前成市와 8방 고객 흡인문
      ctx.font = '900 30px "Noto Serif KR", serif';
      ctx.textAlign = 'center';
      ctx.fillText('興 旺', cx, coreY + 28);
      ctx.font = '900 22px "Noto Serif KR", serif';
      ctx.fillText('萬客雲集', cx, coreY + 64);

      // 8-directional wealth magnet vortex
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, coreY + 96, 26, 0, Math.PI * 1.5);
      ctx.arc(cx, coreY + 96, 16, Math.PI * 0.5, Math.PI * 2);
      ctx.stroke();

      // Prosperity doors (雙門)
      ctx.strokeRect(cx - 42, coreY + 84, 18, 26);
      ctx.strokeRect(cx + 24, coreY + 84, 18, 26);
      break;
    }
  }

  ctx.restore();
}

/**
 * Draws the authentic talisman base / foot (符脚 - Bu-gak)
 * with the commanding "急 急 如 律 令" and sacred triple trident anchor.
 */
function drawTalismanBase(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  deepColor: string,
  primaryColor: string
) {
  ctx.save();
  ctx.strokeStyle = deepColor;
  ctx.fillStyle = deepColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Connecting spine leading down
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.lineTo(cx, baseY + 36);
  ctx.stroke();

  // Sacred Triple Trident Spear (三叉戟 / 鎭)
  ctx.lineWidth = 4.5;
  // Center spear tip
  ctx.beginPath();
  ctx.moveTo(cx, baseY + 36);
  ctx.lineTo(cx, baseY + 90);
  ctx.stroke();

  // Left wing barb
  ctx.beginPath();
  ctx.moveTo(cx, baseY + 48);
  ctx.quadraticCurveTo(cx - 40, baseY + 56, cx - 48, baseY + 86);
  ctx.stroke();

  // Right wing barb
  ctx.beginPath();
  ctx.moveTo(cx, baseY + 48);
  ctx.quadraticCurveTo(cx + 40, baseY + 56, cx + 48, baseY + 86);
  ctx.stroke();

  // Three sealing hook dots
  [-48, 0, 48].forEach((ox) => {
    ctx.beginPath();
    ctx.arc(cx + ox, baseY + 88, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // "急 急 如 律 令"
  // (Execute immediately according to heavenly law)
  ctx.textAlign = 'center';
  ctx.font = '900 20px "Noto Serif KR", serif';
  ctx.fillStyle = deepColor;
  ctx.fillText('急  急  如  律  令', cx, baseY + 120);

  ctx.restore();
}

/**
 * Renders the Official Cinnabar Stamp of Cheonmyeongwon (천명원 옥새 靈印)
 */
function drawOfficialSeal(
  ctx: CanvasRenderingContext2D,
  stampX: number,
  stampY: number,
  size: number
) {
  ctx.save();
  const half = size / 2;

  // Outer bold vermilion border
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 3;
  ctx.strokeRect(stampX - half, stampY - half, size, size);

  // Inner fine border
  ctx.lineWidth = 1.2;
  ctx.strokeRect(stampX - half + 3.5, stampY - half + 3.5, size - 7, size - 7);

  // Subtle ink distressing / paper grain
  ctx.fillStyle = 'rgba(220, 38, 38, 0.08)';
  ctx.fillRect(stampX - half + 4, stampY - half + 4, size - 8, size - 8);

  // Archaic Seal Script Characters:
  // 天 命
  // 靈 印
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 13px "Noto Serif KR", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('天命', stampX, stampY - 9);
  ctx.fillText('靈印', stampX, stampY + 9);

  ctx.restore();
}

/**
 * Main rendering function: Draws authentic, museum-grade Korean Taoist Talisman
 * on high-resolution canvas with Goehwangji paper, Cinnabar ink, and authentic 勅令 headers.
 */
export function renderTalismanToCanvas(
  canvas: HTMLCanvasElement,
  config: TalismanConfig
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const w = canvas.width;
  const h = canvas.height;

  // Clear Canvas
  ctx.clearRect(0, 0, w, h);

  // 1. AUTHENTIC PAPER TEXTURE
  if (config.paperTexture === 'dark_obsidian') {
    // Midnight Obsidian Slate with shimmering gold mineral flecks
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#06080e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Gold mineral flakes
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    for (let i = 0; i < 110; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
      const ry = (Math.cos(i * 33) * 0.5 + 0.5) * h;
      const size = (i % 3) + 1;
      ctx.fillRect(rx, ry, size, size);
    }
  } else if (config.paperTexture === 'crimson_silk') {
    // Imperial Court Crimson Brocade Silk
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.85);
    bgGrad.addColorStop(0, '#881337');
    bgGrad.addColorStop(0.6, '#5b0f1a');
    bgGrad.addColorStop(1, '#33080e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Silk weave lines
    ctx.strokeStyle = 'rgba(254, 202, 202, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 12, h);
      ctx.stroke();
    }
  } else {
    // TRADITIONAL PAGODA-TREE YELLOW HANJI (괴황지 槐黃紙)
    // Exactly like the warm golden yellow talisman paper in the user's reference!
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w * 0.85);
    bgGrad.addColorStop(0, '#fff492'); // Luminous golden center
    bgGrad.addColorStop(0.4, '#fde047');
    bgGrad.addColorStop(0.8, '#eab308'); // Rich ochre
    bgGrad.addColorStop(1, '#b45309'); // Antique weathered burnt edge
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Antique vintage vignette along edges
    const vignette = ctx.createLinearGradient(0, 0, 0, h);
    vignette.addColorStop(0, 'rgba(120, 53, 15, 0.28)');
    vignette.addColorStop(0.12, 'rgba(120, 53, 15, 0.0)');
    vignette.addColorStop(0.88, 'rgba(120, 53, 15, 0.0)');
    vignette.addColorStop(1, 'rgba(120, 53, 15, 0.38)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Mulberry fibers (한지 닥종이 질감)
    ctx.strokeStyle = 'rgba(161, 98, 7, 0.16)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 127) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 83) * 0.5 + 0.5) * h;
      const len = 14 + (i % 24);
      const angle = (i % 8) * (Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
      ctx.stroke();
    }
  }

  // 2. INK PALETTE SETUP
  let primaryInk = '#b91c1c'; // Vivid Cinnabar Vermilion
  let deepInk = '#7f1d1d'; // Concentrated Mineral Cinnabar
  let glowColor = 'rgba(239, 68, 68, 0.38)';

  if (config.inkColor === 'gold_cinnabar') {
    primaryInk = '#d97706';
    deepInk = '#92400e';
    glowColor = 'rgba(245, 158, 11, 0.45)';
  } else if (config.inkColor === 'black_ink') {
    primaryInk = '#1e293b';
    deepInk = '#090d16';
    glowColor = 'rgba(15, 23, 42, 0.25)';
  }

  // 3. CELESTIAL PROTECTIVE BORDERS & BAGUA TRIGRAMS
  ctx.save();
  ctx.strokeStyle = primaryInk;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  ctx.lineWidth = 1.2;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  // Four cardinal corners: Sacred guardian spurs
  const cornerSize = 28;
  const drawCornerSpur = (cx: number, cy: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.moveTo(cx, cy + dy * cornerSize);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * cornerSize, cy);
    ctx.stroke();

    // Sacred dot
    ctx.beginPath();
    ctx.arc(cx + dx * 8, cy + dy * 8, 3, 0, Math.PI * 2);
    ctx.fillStyle = primaryInk;
    ctx.fill();
  };

  drawCornerSpur(24, 24, 1, 1);
  drawCornerSpur(w - 24, 24, -1, 1);
  drawCornerSpur(24, h - 24, 1, -1);
  drawCornerSpur(w - 24, h - 24, -1, -1);

  // Four protective Bagua Trigrams (건 ☰, 곤 ☷, 감 ☵, 리 ☲)
  ctx.font = 'bold 14px serif';
  ctx.fillStyle = primaryInk;
  ctx.textAlign = 'center';
  ctx.fillText('☰', w / 2, 21); // Heaven (Top)
  ctx.fillText('☷', w / 2, h - 9); // Earth (Bottom)
  ctx.fillText('☵', 12, h / 2); // Water (Left)
  ctx.fillText('☲', w - 12, h / 2); // Fire (Right)
  ctx.restore();

  // 4. BU-DU (符頭 - Head): SAM-TAE-SEONG & AUTHENTIC VERTICAL 勅令
  drawCheongryeongHeader(ctx, w / 2, 80, primaryInk, deepInk, glowColor);

  // 5. BU-SHIN (符身 - Torso): AUTHENTIC TALISMAN GLYPHS ACCORDING TO PRESET
  const bodyStartY = 248;
  drawTalismanBody(ctx, config.type, w / 2, bodyStartY, deepInk, primaryInk);

  // 6. CONSECRATED OWNER & SACRED WISH INSCRIPTION (소원자 축원 비문)
  const preset = TALISMAN_PRESETS.find((p) => p.type === config.type) || TALISMAN_PRESETS[0];
  const clientName = config.targetName || '의뢰인';
  const customWish = config.wishSentence || preset.shortWish;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '700 13px "Noto Serif KR", serif';
  ctx.fillStyle = config.inkColor === 'gold_cinnabar' ? '#78350f' : '#450a0a';
  ctx.fillText(`願生 ${clientName} · ${customWish}`, w / 2, 535);
  ctx.restore();

  // 7. BU-GAK (符脚 - Base): TRIPLE TRIDENT & "急急如律令"
  drawTalismanBase(ctx, w / 2, 545, deepInk, primaryInk);

  // 8. OFFICIAL SEAL STAMP (천명원 영험옥새 印)
  if (config.withStamp) {
    const stampX = w / 2 + 64;
    const stampY = h - 72;
    drawOfficialSeal(ctx, stampX, stampY, 52);
  }

  // 9. BOTTOM CONSECRATION NOTICE & CELESTIAL STAMP
  ctx.save();
  ctx.font = '600 10.5px "Noto Serif KR", serif';
  ctx.fillStyle = config.inkColor === 'gold_cinnabar' ? '#92400e' : '#7f1d1d';
  ctx.textAlign = 'center';
  ctx.fillText(`天命院 秘傳靈驗符 · 甲辰年 開光點眼`, w / 2, h - 24);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
