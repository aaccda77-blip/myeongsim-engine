/**
 * ======================================================
 * ⚔️ Sovereign 4D-Mind Re-Engineering Matrix Engine
 * (소버린 4차원 마음 재설계 매트릭스)
 * ======================================================
 * 
 * 세계 최초: 동양 사주명리 원형(Archetype) × 서양 심리학 제3의 물결(3rd Wave of CBT) 융합
 * - 1단계 CBT: 왜곡된 코드의 해체 (인지적 오류 식별)
 * - 2단계 MBCT: 운명의 굴레 관조 (탈중심화 / 알아차림)
 * - 3단계 DBT: 음양의 완벽한 통합 (변증법적 수용)
 * - 4단계 ACT: 용신을 향한 위대한 항해 (가치 기반 전진)
 * 
 * 기존 시스템에 절대 영향 없는 독립 플러그인 모듈.
 * ======================================================
 */

export interface MatrixPhase {
  id: number;
  code: string;                // 단계 코드 (예: 'CBT')
  fullName: string;            // 정식 명칭
  koreanName: string;          // 한글 명칭
  emoji: string;               // 대표 이모지
  color: string;               // 테마 컬러 키
  gradientFrom: string;
  gradientTo: string;
  subtitle: string;            // 부제목 (사주 × 심리학)
  fusionPrinciple: string;     // 융합 원리
  mechanism: string;           // 작동 방식
  coachingVoice: string;       // 명심 마스터 화법 예시
  sajuMapping: string;         // 사주명리 대응 요소
  psychScience: string;        // 현대 심리학 근거
  userExperience: string;      // 사용자 체험 시나리오
}

export interface SampleCase {
  id: string;
  title: string;
  sajuProfile: string;        // 사주 프로필 간략 요약
  darkCode: string;            // 다크코드 (방어기제)
  phase1_cbt: string;          // CBT 적용
  phase2_mbct: string;         // MBCT 적용
  phase3_dbt: string;          // DBT 적용
  phase4_act: string;          // ACT 적용
  finalDeclaration: string;    // 최종 주권 선언문
}

/**
 * 4D 매트릭스 단계 데이터
 */
export const MATRIX_PHASES: MatrixPhase[] = [
  {
    id: 1,
    code: 'CBT',
    fullName: 'Cognitive Behavioral Therapy',
    koreanName: '인지행동치료',
    emoji: '⚔️',
    color: 'red',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-600',
    subtitle: '왜곡된 코드의 해체',
    fusionPrinciple: '사주에서 말하는 "기신(忌神: 나를 괴롭히는 흉한 기운)"이나 "편관/편인"의 과도한 작용은, CBT에서 말하는 인지적 오류(Cognitive Distortions)와 정확히 일치합니다. 60갑자의 각 기질이 가진 고유한 "낡은 각본(Old Script)"을 과학적으로 식별하고 해체합니다.',
    mechanism: '"나는 완벽하지 않으면 버림받을 것이다(흑백논리)", "저 사람은 나를 무시한 게 틀림없다(독심술)"와 같은 인지적 왜곡을 사주의 기신 구조에서 역추적하여, 팩트(Fact) 기반으로 논박합니다.',
    coachingVoice: '당신의 뇌를 지배하는 "편관(壓迫感)"의 코드는 진실이 아닙니다. 그것은 당신의 에고가 만들어낸 논리적 오류일 뿐입니다. 팩트(Fact)의 검으로 낡은 운명의 서사를 해체하십시오.',
    sajuMapping: '기신(忌神), 편관(偏官), 편인(偏印), 상관(傷官)의 과도한 기운 → 인지적 왜곡 패턴 매핑',
    psychScience: 'Aaron Beck의 인지 삼제(Cognitive Triad): 자기·세계·미래에 대한 부정적 자동사고(NATs)를 구조화된 기법으로 교정',
    userExperience: '사용자가 "나는 왜 항상 이 모양일까"라고 입력하면, 시스템이 사주 기신을 분석하여 "당신의 이 생각은 편관의 압박이 만든 흑백논리입니다. 실제 증거를 봅시다"라고 구조화된 반박을 제시합니다.'
  },
  {
    id: 2,
    code: 'MBCT',
    fullName: 'Mindfulness-Based Cognitive Therapy',
    koreanName: '마음챙김 인지치료',
    emoji: '👁️',
    color: 'violet',
    gradientFrom: 'from-violet-500',
    gradientTo: 'to-purple-700',
    subtitle: '운명의 굴레(業報) 관조하기',
    fusionPrinciple: 'MBCT의 핵심인 "탈중심화(Decentering)"는 동양명리의 철학적 근간인 "알아차림(觀法)"의 과학적 구현입니다. 사주의 다크코드가 발동하여 뇌가 폭주할 때, 그 감정의 파동을 "나"와 동일시하지 않고 객관적으로 지켜봅니다.',
    mechanism: '분노나 우울(水/火 기운의 불균형)이 밀려올 때, "아, 내 안의 흑룡(壬辰)이 흙탕물을 일으키고 있구나"라고 하늘에서 내려다보듯 날씨처럼 관찰합니다. 감정을 소유하지 않고 흘려보냅니다.',
    coachingVoice: '당신은 끓어오르는 용광로가 아닙니다. 용광로가 끓고 있음을 고요하게 비추고 있는 광활한 우주입니다. 당신의 기질이 일으키는 폭풍우를 "판단 없이" 지켜보십시오. 관찰하는 자는 결코 다치지 않습니다.',
    sajuMapping: '일주(日柱)의 음양 불균형, 충(沖)·형(刑)·파(破) 등 사주 내 갈등 구조 → 감정 폭주 패턴 매핑',
    psychScience: 'Jon Kabat-Zinn의 MBSR + Zindel Segal의 MBCT: 마음챙김 명상을 통한 우울증 재발 방지율 44% 감소 (임상 근거)',
    userExperience: '사용자의 감정이 격앙되었을 때, 시스템이 "지금 당신의 내면에서 화(火)의 기운이 폭주하고 있습니다. 3초간 숨을 쉬고, 그 뜨거운 에너지를 하늘에서 내려다보듯 관찰해 보십시오"라고 안내합니다.'
  },
  {
    id: 3,
    code: 'DBT',
    fullName: 'Dialectical Behavior Therapy',
    koreanName: '변증법적 행동치료',
    emoji: '☯️',
    color: 'sky',
    gradientFrom: 'from-sky-500',
    gradientTo: 'to-cyan-600',
    subtitle: '음양(陰陽)의 완벽한 통합',
    fusionPrinciple: 'DBT의 핵심인 "변증법(Dialectics)"은 정반대의 두 개념을 동시에 수용하는 것입니다. 이는 사주명리의 근본 원리인 "음양오행의 조화(中和)"와 완벽히 일치합니다. 극강의 수용과 극강의 변화를 동시에 추구합니다.',
    mechanism: '괴강살의 "극단적인 파괴력(陽)"과 정인의 "따뜻한 수용력(陰)" 사이의 모순을 견뎌내고 통합합니다. "나는 지금 내 모습 그대로 완벽하며(수용), 동시에 더 나은 나로 변화해야 한다(변화)"는 모순된 진리를 체화합니다.',
    coachingVoice: '강함과 부드러움은 적이 아닙니다. 찌르는 칼날(庚金)과 품어주는 대지(己土)를 동시에 쥐십시오. 당신 안의 모순(음양의 충돌)을 억누르지 말고, 역동적인 춤으로 승화시킬 때 진짜 카리스마가 폭발합니다.',
    sajuMapping: '음양 불균형, 합(合)·충(沖) 관계, 용신과 기신의 공존 → 내면적 모순 구조 매핑',
    psychScience: 'Marsha Linehan의 DBT: 경계선 인격장애 치료 성공률 77%, 자해 행동 50% 감소 (RCT 임상 근거). 핵심 4모듈: 마음챙김, 대인관계 효과성, 감정조절, 고통감내',
    userExperience: '사용자가 내면의 모순("리더가 되고 싶은데 사람들이 무서워")으로 괴로워할 때, 시스템이 "당신의 사주에는 庚金(결단)과 癸水(두려움)가 공존합니다. 두 가지를 억누르지 말고 동시에 안으세요"라고 변증법적 통합을 안내합니다.'
  },
  {
    id: 4,
    code: 'ACT',
    fullName: 'Acceptance and Commitment Therapy',
    koreanName: '수용전념치료',
    emoji: '🧭',
    color: 'amber',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-yellow-600',
    subtitle: '용신(用神)을 향한 위대한 항해',
    fusionPrinciple: 'ACT는 고통을 없애려 싸우는 대신, 그것을 가방에 넣고 자신이 가치 있게 여기는 방향으로 걸어가는 치료법입니다. 이는 사주에서 나의 가장 큰 무기이자 지향점인 "용신(用神)"을 찾아 실천하는 과정과 완벽히 오버랩됩니다.',
    mechanism: '나의 예민함이나 고독(다크코드)을 고치려 들지 않고 수용(Acceptance)한 채로, 내가 세상을 향해 기여할 수 있는 압도적인 가치(전념 행동, Committed Action)에만 에너지를 집중합니다.',
    coachingVoice: '당신의 상처와 다크코드를 없애려 뇌와 싸우지 마십시오. 당신의 그 예민한 촉과 끓어오르는 분노를 버스 뒷좌석에 태운 채, 당신의 운명을 구원할 "용신(핵심 가치)"의 방향으로 핸들을 꺾어 전진하십시오.',
    sajuMapping: '용신(用神)·희신(喜神) → ACT의 가치(Values) 매핑. 기신(忌神)·한신(閑神) → 수용 대상으로 재정의',
    psychScience: 'Steven Hayes의 ACT: 심리적 유연성(Psychological Flexibility) 6축 모델. 300+ RCT 논문으로 검증된 초현대 치료법. 핵심: 수용, 탈융합, 현재 접촉, 맥락적 자기, 가치, 전념 행동',
    userExperience: '사용자가 자신의 트라우마를 극복하려 몸부림칠 때, 시스템이 "그 아픔을 지우려 하지 마십시오. 대신 당신의 용신 [목(木)=성장]을 향해 오늘 단 하나의 행동을 실천하십시오"라고 가치 기반 전진을 코칭합니다.'
  }
];

/**
 * 데모용 통합 사례 시뮬레이션
 */
export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'case-01',
    title: '업무 스트레스에 무너진 리더',
    sajuProfile: '甲子(갑자) · 편관격 · 용신: 火',
    darkCode: '"아무도 내 노력을 알아주지 않아. 나 혼자 다 끌고 가야 해. 포기하고 싶어."',
    phase1_cbt: '[CBT 해체] "아무도 알아주지 않는다"는 과잉일반화(Overgeneralization)입니다. 지난 한 달간 당신의 노력을 인정해준 사례가 정말 단 하나도 없었습니까? 편관의 압박이 만든 인지 왜곡을 팩트로 해체합니다.',
    phase2_mbct: '[MBCT 관조] 지금 가슴을 짓누르는 그 무거운 덩어리를 3초간 지켜보십시오. "아, 내 안의 甲木이 과도한 책임감으로 뻣뻣하게 굳어있구나." 당신은 그 무게 자체가 아닙니다. 무게를 관찰하고 있는 넓은 하늘입니다.',
    phase3_dbt: '[DBT 통합] 당신은 지금 모습 그대로 충분히 훌륭한 리더이며(수용), 동시에 더 유연한 소통 방식을 배울 수 있습니다(변화). 이 두 가지 진실을 동시에 안으십시오.',
    phase4_act: '[ACT 전진] 인정받지 못하는 고통을 버스 뒷좌석에 태우세요. 그 버스의 핸들을 당신의 용신 火(영감/열정)가 가리키는 방향으로 꺾으세요. 오늘 팀원 한 명에게 진심으로 "고맙다"고 말해보세요.',
    finalDeclaration: '나는 더 이상 인정에 목마른 고목(枯木)이 아니다. 스스로 타오르며 세상을 밝히는 선구자의 거목이다.'
  },
  {
    id: 'case-02',
    title: '관계 불안에 시달리는 전문직 여성',
    sajuProfile: '壬子(임자) · 양인격 · 용신: 土',
    darkCode: '"사람을 믿을 수가 없어. 다 떠날 거야. 차라리 내가 먼저 벽을 치고 혼자 있는 게 안전해."',
    phase1_cbt: '[CBT 해체] "모든 사람이 떠난다"는 재앙화(Catastrophizing)와 정서적 추론(Emotional Reasoning)입니다. 지금 당신 곁에 여전히 있는 사람은 누구입니까? 壬水의 깊은 직관력이 불신의 렌즈로 왜곡된 것을 교정합니다.',
    phase2_mbct: '[MBCT 관조] 누군가와 가까워질 때 밀려오는 그 차가운 불안감을 호흡과 함께 지켜보세요. "아, 내 안의 壬子 양인이 스스로를 보호하려고 얼음벽을 세우고 있구나." 그 벽을 허물지 않아도 됩니다. 그저 알아차리기만 하세요.',
    phase3_dbt: '[DBT 통합] 당신은 깊은 상처를 가진 존재이며(수용), 동시에 누군가에게 깊은 유대를 줄 수 있는 대양(大洋)입니다(변화). 상처와 능력은 같은 뿌리에서 왔습니다.',
    phase4_act: '[ACT 전진] 불안을 없애려 싸우지 마세요. 대신 용신 土(신뢰/안정)의 방향으로 오늘 단 한 가지: 신뢰하는 친구에게 "요즘 좀 외롭다"고 솔직하게 말해보세요. 투명함이 당신의 가장 강력한 무기입니다.',
    finalDeclaration: '나는 더 이상 음모와 의심 뒤에 숨은 탁한 웅덩이가 아니다. 모든 것을 투명하게 품어안는 진실의 대양이다.'
  }
];

/**
 * 특정 단계(Phase) 정보를 조회합니다.
 */
export function getMatrixPhase(code: string): MatrixPhase | undefined {
  return MATRIX_PHASES.find(p => p.code === code);
}

/**
 * 전체 매트릭스 단계를 반환합니다.
 */
export function getAllPhases(): MatrixPhase[] {
  return MATRIX_PHASES;
}

/**
 * 전체 샘플 케이스를 반환합니다.
 */
export function getAllSampleCases(): SampleCase[] {
  return SAMPLE_CASES;
}
