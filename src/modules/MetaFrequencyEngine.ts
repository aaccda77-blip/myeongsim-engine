/**
 * MetaFrequencyEngine.ts
 * 의식 주파수 측정 엔진 (Dark / Neural / Meta Code)
 * 
 * 핵심 철학:
 * - 기질 데이터는 '나'가 아니다 (탈동일시)
 * - 버리는 것이 아니라 수용하여 도구로 활용 (뉴럴)
 * - 잘 쓰는 것조차 집착하지 않는 자유 (메타)
 * 
 * ⚠️ 독립 모듈 — 기존 시스템에 영향 없음
 */

import { ThreeLayerCodeSystem, ThreeLayerCode } from './ThreeLayerCodeSystem';
import { analyzeFrequency, FrequencyAnalysis } from './FrequencyDetector';
import { GongmangInfo, calculateGongmang } from './GongmangEngine';

/**
 * 오늘의 실제 일진(日辰)을 lunar-javascript로 자동 계산
 */
export function getTodayDayPillar(): string {
  try {
    const { Solar } = require('lunar-javascript');
    const now = new Date();
    const solar = Solar.fromYmdHms(
      now.getFullYear(), now.getMonth() + 1, now.getDate(),
      now.getHours(), now.getMinutes(), 0
    );
    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar();
    return bazi.getDay(); // 오늘의 일주 간지 (예: "己丑")
  } catch {
    return '己丑';
  }
}

// ═══════════════════════════════════════════════════
// 타입 정의
// ═══════════════════════════════════════════════════

export type ConsciousnessLevel = 'dark' | 'neural' | 'meta';

export interface ConsciousnessState {
  level: ConsciousnessLevel;
  label: string;
  emoji: string;
  color: string;
  metaphor: string;
}

export interface FrequencyQuestion {
  id: string;
  question: string;
  choices: {
    id: 'A' | 'B' | 'C';
    text: string;
    level: ConsciousnessLevel;
    score: number;
  }[];
}

export interface DailyFrequencyState {
  // 오늘의 일진 기반 3상태
  todayPillar: string;
  codeName: string;
  darkCode: { tag: string; desc: string };
  neuralCode: { tag: string; desc: string };
  metaCode: { tag: string; desc: string };
  // 사용자 현재 주파수 위치
  currentLevel: ConsciousnessLevel;
  frequencyAnalysis: FrequencyAnalysis | null;
  // 재귀적 자기질문
  selfInquiry: string;
  // 선택지 질문
  frequencyQuestion: FrequencyQuestion;
  // 공망 데이터 융합
  gongmang?: GongmangInfo;
  // 바이오 데이터 연동
  bioSync: {
    stress: number;
    hrv: number;
    heartRate: number;
    bodyRhythm: string;
    emotionRhythm: string;
    intellectRhythm: string;
  };
}

// ═══════════════════════════════════════════════════
// 의식 상태 정의
// ═══════════════════════════════════════════════════

export const CONSCIOUSNESS_STATES: Record<ConsciousnessLevel, ConsciousnessState> = {
  dark: {
    level: 'dark',
    label: '다크 코드',
    emoji: '🔻',
    color: '#ef4444',
    metaphor: '구름에 가려진 태양 — 패턴에 동일시된 상태',
  },
  neural: {
    level: 'neural',
    label: '뉴럴 코드',
    emoji: '🔹',
    color: '#06b6d4',
    metaphor: '구름이 걷힌 태양 — 패턴을 도구로 활용하는 상태',
  },
  meta: {
    level: 'meta',
    label: '메타 코드',
    emoji: '🚀',
    color: '#f59e0b',
    metaphor: '태양 자체를 즐기되 집착 없는 자유 — 하되 안 할 수도 있는 상태',
  },
};

// ═══════════════════════════════════════════════════
// 재귀적 자기질문 풀 (주파수 위치별)
// ═══════════════════════════════════════════════════

const SELF_INQUIRY_POOL: Record<ConsciousnessLevel, string[]> = {
  dark: [
    '지금 이 감정이 "나"라고 느끼고 있나요? 이 감정은 정말 "당신"인가요, 아니면 반복되는 프로그램인가요?',
    '이 패턴이 지금 자동으로 작동하고 있다는 것을 알아차리셨나요? 알아차렸다면, 그 알아차림은 누구의 것인가요?',
    '지금 느끼는 이 충동은 오랜 시간 강화된 신경 회로의 자동 반응입니다. 이 반응을 지켜보고 있는 "당신"은 어디에 있나요?',
    '"이게 나야"라는 생각 자체도 하나의 생각일 뿐이라는 것을 느껴볼 수 있나요?',
    '구름이 태양을 가리고 있습니다. 하지만 구름 뒤에 태양이 없어진 적이 있던가요?',
  ],
  neural: [
    '패턴을 도구로 잘 쓰고 있군요. 그런데 혹시 "잘 써야 한다"는 것에 집착하고 있지는 않나요?',
    '탈동일시에 성공했습니다. 그런데 "탈동일시 상태를 유지해야 해"라는 새로운 동일시가 생기지는 않았나요?',
    '도구를 잘 쓰는 것은 훌륭합니다. 하지만 도구를 내려놓아도 괜찮다는 것을 알고 계시나요?',
    '지금 이 명확함 속에서, 혹시 "나는 깨달은 사람"이라는 미묘한 자부심이 느껴지지는 않나요?',
    '뉴럴 코드를 활용하고 있는 이 순간, 활용하지 않아도 당신은 여전히 온전합니다.',
  ],
  meta: [
    '지금 이 자유로운 상태를 즐기고 계시나요? 이 자유로움조차 놓을 수 있나요?',
    '하되 안 할 수도 있는 이 상태, 정말 아름답습니다. 이 아름다움에도 집착하지 않을 수 있나요?',
    '열심히 하되 열심히 하지 않을 수도 있는 경지. 이 경지에서 사회에 무엇을 나누고 싶으신가요?',
    '패턴도 좋고, 패턴 없음도 좋고, 그 어느 쪽도 괜찮은 이 공간에서 지금 무엇이 일어나고 있나요?',
    '당신은 이미 충분합니다. 이 충분함에서 자연스럽게 흘러나오는 것은 무엇인가요?',
  ],
};

// ═══════════════════════════════════════════════════
// 핵심 엔진 함수
// ═══════════════════════════════════════════════════

/**
 * 간지(干支)에서 천간 인덱스 추출 (甲=0, 乙=1, ... 癸=9)
 */
function getStemIndex(ganji: string): number {
  const stems = '甲乙丙丁戊己庚辛壬癸';
  const hanStems = '갑을병정무기경신임계';
  const firstChar = ganji.charAt(0);
  let idx = stems.indexOf(firstChar);
  if (idx === -1) idx = hanStems.indexOf(firstChar);
  return Math.max(0, idx);
}

/**
 * 간지에서 지지 인덱스 추출 (子=0, ... 亥=11)
 */
function getBranchIndex(ganji: string): number {
  const branches = '子丑寅卯辰巳午未申酉戌亥';
  const hanBranches = '자축인묘진사오미신유술해';
  const secondChar = ganji.charAt(1);
  let idx = branches.indexOf(secondChar);
  if (idx === -1) idx = hanBranches.indexOf(secondChar);
  return Math.max(0, idx);
}

/**
 * 일주 간지 → ThreeLayerCode ID 매핑
 * 60갑자 순서: 갑자=1, 을축=2, ... 계해=60
 */
function ganjiToCodeId(ganji: string): number {
  const stemIdx = getStemIndex(ganji);
  const branchIdx = getBranchIndex(ganji);
  // 60갑자 공식: ((천간 * 6 + 지지) % 60) + 1 (근사치)
  // 정확한 매핑을 위해 천간 기반 그룹핑 사용
  return (stemIdx * 6) + Math.floor(branchIdx / 2) + 1;
}

/**
 * 오늘의 3계층 코드 조회
 */
export function getTodayThreeLayerCode(dayPillar: string): ThreeLayerCode | null {
  const id = ganjiToCodeId(dayPillar);
  return ThreeLayerCodeSystem.getById(id) || ThreeLayerCodeSystem.getById(1) || null;
}

/**
 * 주파수 측정 질문 생성 (오늘의 다크/뉴럴/메타 맥락 기반)
 */
export function generateFrequencyQuestion(code: ThreeLayerCode): FrequencyQuestion {
  return {
    id: `fq-${code.id}-${Date.now()}`,
    question: `지금 이 순간, 당신의 내면 상태에 가장 가까운 것은?`,
    choices: [
      {
        id: 'A',
        text: `${code.darkCode.desc} — 이 패턴이 "나"처럼 느껴진다`,
        level: 'dark',
        score: 20,
      },
      {
        id: 'B',
        text: `${code.neuralCode.desc} — 이 패턴을 알아차리고 활용하고 있다`,
        level: 'neural',
        score: 60,
      },
      {
        id: 'C',
        text: `${code.metaCode.desc} — 패턴이든 아니든 괜찮다. 자유롭다`,
        level: 'meta',
        score: 90,
      },
    ],
  };
}

/**
 * 재귀적 자기질문 반환 (현재 주파수 위치 기반)
 */
export function getSelfInquiry(level: ConsciousnessLevel): string {
  const pool = SELF_INQUIRY_POOL[level];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 바이오 데이터 + 주파수 교차 분석
 */
export function analyzeBioFrequencySync(
  level: ConsciousnessLevel,
  bio: { stress: number; hrv: number; heartRate: number }
): string {
  if (level === 'dark' && bio.stress >= 70) {
    return '🚨 다크 코드 동일시 + 교감신경 과항진이 동시 감지됩니다. 편도체가 패턴을 "나"로 착각하고 있습니다.';
  }
  if (level === 'dark' && bio.stress < 70) {
    return '⚠️ 다크 코드 동일시가 감지되나 신체는 비교적 안정적입니다. 마음의 구름을 알아차릴 좋은 타이밍입니다.';
  }
  if (level === 'neural' && bio.stress >= 50) {
    return '🔹 뉴럴 코드 활성 상태이나 신체 스트레스가 높습니다. 도구를 내려놓고 쉬어도 괜찮습니다.';
  }
  if (level === 'neural') {
    return '✅ 뉴럴 코드와 자율신경계가 조화를 이루고 있습니다. 패턴을 도구로 잘 활용하고 있는 상태입니다.';
  }
  if (level === 'meta') {
    return '🚀 메타 코드 상태 — 자율신경계도 깊은 이완 상태입니다. 하되 안 할 수도 있는 자유로운 상태입니다.';
  }
  return '🔹 현재 주파수를 측정 중입니다.';
}

/**
 * 메인 엔진: 사용자의 일간(나)과 오늘 일진(운) 간의 십성을 분석하여
 * 초개인화된 다크/뉴럴/메타 코드를 산출
 */
export function calculateDailyFrequency(
  userDayPillar: string, // 사용자의 일주 (예: "辛巳")
  todayPillar: string,   // 오늘 일진 (예: "己丑")
  userMessage: string,
  bio: { stress: number; hrv: number; heartRate: number },
  biorhythm?: { physicalLabel?: string; emotionalLabel?: string; intellectualLabel?: string }
): DailyFrequencyState {
  
  const userDayStem = userDayPillar.charAt(0);
  const todayStem = todayPillar.charAt(0);

  // 1. 십성 계산
  const tenGod = getTenGod(userDayStem, todayStem);

  // 2. 공망 계산
  const gongmang = calculateGongmang(userDayPillar, todayPillar);

  // 3. 십성 기반 3계층 코드 (초개인화)
  const activeCode = TEN_GODS_META_CODES[tenGod] || TEN_GODS_META_CODES['비견'];

  // 4. 사용자 메시지에서 현재 주파수 감지
  const freqAnalysis = userMessage ? analyzeFrequency(userMessage) : null;
  const currentLevel: ConsciousnessLevel = freqAnalysis?.level || 'neural';

  // 5. 재귀적 자기질문 생성
  const selfInquiry = getSelfInquiry(currentLevel);

  // 6. 선택지 질문 생성
  const frequencyQuestion = generateFrequencyQuestion(activeCode);

  return {
    todayPillar: todayPillar,
    codeName: `[오늘의 에너지: ${tenGod}]${gongmang.isTodayGongmang ? ' (공망)' : ''}`,
    darkCode: activeCode.darkCode,
    neuralCode: activeCode.neuralCode,
    metaCode: activeCode.metaCode,
    currentLevel,
    frequencyAnalysis: freqAnalysis,
    selfInquiry,
    frequencyQuestion,
    gongmang,
    bioSync: {
      stress: bio.stress,
      hrv: bio.hrv,
      heartRate: bio.heartRate,
      bodyRhythm: biorhythm?.physicalLabel || '보통',
      emotionRhythm: biorhythm?.emotionalLabel || '보통',
      intellectRhythm: biorhythm?.intellectualLabel || '보통',
    },
  };
}

// ═══════════════════════════════════════════════════
// 십성(Ten Gods) 계산 엔진
// ═══════════════════════════════════════════════════

const STEMS = [
  { name: '갑', element: '목', yinYang: '+' }, { name: '을', element: '목', yinYang: '-' },
  { name: '병', element: '화', yinYang: '+' }, { name: '정', element: '화', yinYang: '-' },
  { name: '무', element: '토', yinYang: '+' }, { name: '기', element: '토', yinYang: '-' },
  { name: '경', element: '금', yinYang: '+' }, { name: '신', element: '금', yinYang: '-' },
  { name: '임', element: '수', yinYang: '+' }, { name: '계', element: '수', yinYang: '-' },
];

function getStemInfo(char: string) {
  const koreanMap: Record<string, string> = {
    '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', 
    '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
  };
  const normalized = koreanMap[char] || char;
  return STEMS.find(s => s.name === normalized) || STEMS[0];
}

function getTenGod(meChar: string, targetChar: string): string {
  const me = getStemInfo(meChar);
  const target = getStemInfo(targetChar);

  const isSameYinYang = me.yinYang === target.yinYang;

  // 내가 극한다 (극재)
  const controls: Record<string, string> = { '목': '토', '화': '금', '토': '수', '금': '목', '수': '화' };
  // 나를 극한다 (관살)
  const controlledBy: Record<string, string> = { '목': '금', '화': '수', '토': '목', '금': '화', '수': '토' };
  // 내가 생한다 (식상)
  const generates: Record<string, string> = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
  // 나를 생한다 (인성)
  const generatedBy: Record<string, string> = { '목': '수', '화': '목', '토': '화', '금': '토', '수': '금' };

  if (me.element === target.element) return isSameYinYang ? '비견' : '겁재';
  if (controls[me.element] === target.element) return isSameYinYang ? '편재' : '정재';
  if (controlledBy[me.element] === target.element) return isSameYinYang ? '편관' : '정관';
  if (generates[me.element] === target.element) return isSameYinYang ? '식신' : '상관';
  if (generatedBy[me.element] === target.element) return isSameYinYang ? '편인' : '정인';

  return '비견';
}

// ═══════════════════════════════════════════════════
// 십성 기반 초개인화 다크/뉴럴/메타 코드 정의
// ═══════════════════════════════════════════════════

const TEN_GODS_META_CODES: Record<string, ThreeLayerCode> = {
  '비견': {
    id: 1, codeName: '비견',
    darkCode: { tag: '고집/마찰', desc: '내 주장을 꺾지 않아 타인과 불필요한 마찰을 빚는 상태 (자아 방어기제)' },
    neuralCode: { tag: '주체성/독립', desc: '외부에 휘둘리지 않고 나만의 중심을 확고히 세우는 도구로 활용' },
    metaCode: { tag: '조율자', desc: '주장하되 고집하지 않고, 언제든 유연하게 중심을 이동할 수 있는 자유' },
  },
  '겁재': {
    id: 2, codeName: '겁재',
    darkCode: { tag: '비교/질투', desc: '타인의 성취를 나의 패배로 인식하며 무한 경쟁과 시기심에 빠진 상태' },
    neuralCode: { tag: '건강한 승부욕', desc: '비교를 통한 자극을 성장을 위한 부스터(연료)로 전환하여 쓰는 상태' },
    metaCode: { tag: '상생/연대', desc: '승패의 제로섬 게임에서 벗어나, 타인의 성장을 온전히 기뻐하는 초월적 상태' },
  },
  '식신': {
    id: 3, codeName: '식신',
    darkCode: { tag: '회피/나태', desc: '현실의 책임감을 피해 단순한 쾌락이나 좋아하는 일에만 과몰입하는 상태' },
    neuralCode: { tag: '창조/몰입', desc: '순수한 호기심과 즐거움을 생산적인 결과물로 승화시키는 상태' },
    metaCode: { tag: '무위의 유희', desc: '목적 없이도 즐겁고, 결과에 집착하지 않으며 그저 행위 자체를 놀이처럼 즐김' },
  },
  '상관': {
    id: 4, codeName: '상관',
    darkCode: { tag: '비난/반항', desc: '불합리함에 대해 정제되지 않은 분노를 표출하여 상황을 악화시키는 상태' },
    neuralCode: { tag: '혁신/비판적 사고', desc: '기존 시스템의 오류를 정확히 짚어내어 창조적 파괴의 도구로 쓰는 상태' },
    metaCode: { tag: '자비로운 개선', desc: '칼날 같은 비판조차 상대를 살리는 따뜻한 처방이 되는 고차원적 소통' },
  },
  '편재': {
    id: 5, codeName: '편재',
    darkCode: { tag: '초조/통제', desc: '빠른 결과를 원하며 모든 공간과 상황을 내 뜻대로 장악하려는 강박' },
    neuralCode: { tag: '공간 장악력', desc: '넓은 시야로 전체 판을 읽고 자원을 효율적으로 배치하는 전략적 모드' },
    metaCode: { tag: '흐름에 맡김', desc: '과정을 완벽히 기획하되, 최종 결과는 우주의 흐름에 내어맡기는 여유' },
  },
  '정재': {
    id: 6, codeName: '정재',
    darkCode: { tag: '손실 회피/인색', desc: '가진 것을 잃을까 두려워 꽉 움켜쥐고 변화를 거부하는 상태' },
    neuralCode: { tag: '정밀한 관리', desc: '불확실성을 줄이고 자산을 안정적이고 꼼꼼하게 관리하는 도구' },
    metaCode: { tag: '무소유의 풍요', desc: '가진 것에 감사하되, 언제든 놓을 수 있어 역설적으로 가장 풍요로운 상태' },
  },
  '편관': {
    id: 7, codeName: '편관',
    darkCode: { tag: '자기 학대/강박', desc: '비현실적인 엄격한 잣대로 스스로를 채찍질하며 극도의 압박을 받는 상태' },
    neuralCode: { tag: '강인한 책임감', desc: '난관을 돌파하는 강력한 카리스마와 문제 해결의 동력으로 활용' },
    metaCode: { tag: '평온한 전사', desc: '태풍의 눈 속에서도 가장 고요하며, 외부의 압력에 전혀 상처받지 않는 경지' },
  },
  '정관': {
    id: 8, codeName: '정관',
    darkCode: { tag: '눈치/억압', desc: '타인의 시선이나 사회적 규범에 얽매여 진짜 내 목소리를 내지 못하는 상태' },
    neuralCode: { tag: '합리적 조율', desc: '조직 내에서 원칙을 지키면서도 합리적으로 시스템을 운영하는 리더십' },
    metaCode: { tag: '자유로운 규범', desc: '스스로가 법이 되어 자연스럽게 도리를 행하되, 어떤 규제에도 구속되지 않음' },
  },
  '편인': {
    id: 9, codeName: '편인',
    darkCode: { tag: '의심/망상', desc: '과보호나 과거의 상처로 인해 세상을 불신하고 부정적 시나리오를 돌리는 상태' },
    neuralCode: { tag: '직관적 통찰', desc: '남들이 보지 못하는 이면의 진실을 날카롭게 꿰뚫어보는 영감의 도구' },
    metaCode: { tag: '초월적 지혜', desc: '직관조차 집착하지 않고, 그저 텅 빈 거울처럼 세상을 있는 그대로 비춤' },
  },
  '정인': {
    id: 10, codeName: '정인',
    darkCode: { tag: '의존/지연', desc: '끊임없이 외부의 인정을 갈구하거나 준비만 하며 실행을 미루는 상태' },
    neuralCode: { tag: '지식 수용성', desc: '방대한 정보를 스펀지처럼 흡수하여 나의 지적 자산으로 만드는 능력' },
    metaCode: { tag: '무조건적 수용', desc: '배움과 가르침의 경계가 무너지고, 존재 자체로 세상과 사랑을 주고받는 상태' },
  },
};
