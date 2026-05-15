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
 * 메인 엔진: 오늘의 전체 주파수 상태 산출
 */
export function calculateDailyFrequency(
  dayPillar: string,
  userMessage: string,
  bio: { stress: number; hrv: number; heartRate: number },
  biorhythm?: { physicalLabel?: string; emotionalLabel?: string; intellectualLabel?: string }
): DailyFrequencyState {
  // 1. 오늘의 3계층 코드 조회
  const code = getTodayThreeLayerCode(dayPillar);
  const fallbackCode: ThreeLayerCode = {
    id: 0,
    codeName: '탐색자',
    neuralCode: { tag: 'Explorer', desc: '새로운 가능성을 탐색하는 상태' },
    darkCode: { tag: 'Wanderer', desc: '방향을 찾고 있는 상태' },
    metaCode: { tag: 'Free Spirit', desc: '자유로운 영혼의 상태' },
  };
  const activeCode = code || fallbackCode;

  // 2. 사용자 메시지에서 현재 주파수 감지
  const freqAnalysis = userMessage ? analyzeFrequency(userMessage) : null;
  const currentLevel: ConsciousnessLevel = freqAnalysis?.level || 'neural';

  // 3. 재귀적 자기질문 생성
  const selfInquiry = getSelfInquiry(currentLevel);

  // 4. 선택지 질문 생성
  const frequencyQuestion = generateFrequencyQuestion(activeCode);

  return {
    todayPillar: dayPillar,
    codeName: activeCode.codeName,
    darkCode: activeCode.darkCode,
    neuralCode: activeCode.neuralCode,
    metaCode: activeCode.metaCode,
    currentLevel,
    frequencyAnalysis: freqAnalysis,
    selfInquiry,
    frequencyQuestion,
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
