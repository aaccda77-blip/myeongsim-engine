/**
 * [독립 모듈] 일진(日辰) 에너지 하모니 엔진
 * - 기존 챗봇 시스템에 0% 영향
 * - 사용자의 일간(日干)과 오늘의 일진(日辰)의 관계를 분석
 * - 맞춤형 "오늘의 고통 농도" 및 "돌파 키워드" 생성
 */

export type EnergyRelation = 'SYNC' | 'RESOURCE' | 'FLOW' | 'PRESSURE' | 'ACHIEVEMENT';

export interface DailyHarmonyResult {
  todayGan: string;           // 오늘 천간 (한글)
  todayZhi: string;           // 오늘 지지 (한글)
  todayGanElement: string;    // 오늘 천간 오행
  userDayMaster: string;      // 사용자 일간 (한자)
  relation: EnergyRelation;   // 일간-일진 관계
  painLevel: number;          // 오늘의 고통 농도 (0-100)
  painReason: string;         // 고통 원인 설명
  breakthroughKeyword: string; // 돌파 키워드
  scanMessage: string;        // 3S - Scan 메시지
  syncMessage: string;        // 3S - Sync 메시지
  shiftMission: string;       // 3S - Shift 미션
  energyColor: string;        // UI 색상
  energyEmoji: string;        // UI 이모지
  neuroExplanation: string;   // 돌파 키워드용 신경과학/심리학 해설
  microCoaching?: string;     // 간지 이중 레이어 코멘트
}

// 오행 생극제화(10성) 매핑
const ELEMENT_RELATIONS: Record<string, Record<string, EnergyRelation>> = {
  '목': { '목': 'SYNC', '화': 'FLOW', '토': 'ACHIEVEMENT', '금': 'PRESSURE', '수': 'RESOURCE' },
  '화': { '목': 'RESOURCE', '화': 'SYNC', '토': 'FLOW', '금': 'ACHIEVEMENT', '수': 'PRESSURE' },
  '토': { '목': 'PRESSURE', '화': 'RESOURCE', '토': 'SYNC', '금': 'FLOW', '수': 'ACHIEVEMENT' },
  '금': { '목': 'ACHIEVEMENT', '화': 'PRESSURE', '토': 'RESOURCE', '금': 'SYNC', '수': 'FLOW' },
  '수': { '목': 'FLOW', '화': 'ACHIEVEMENT', '토': 'PRESSURE', '금': 'RESOURCE', '수': 'SYNC' },
};

// 일간별 오행 매핑
const DAYMASTER_ELEMENT: Record<string, string> = {
  '甲': '목', '乙': '목',
  '丙': '화', '丁': '화',
  '戊': '토', '己': '토',
  '庚': '금', '辛': '금',
  '壬': '수', '癸': '수',
};

// 일간별 특성
const DAYMASTER_TRAIT: Record<string, string> = {
  '甲': '곧게 뻗는 큰 나무', '乙': '유연한 덩굴 식물',
  '丙': '세상을 비추는 태양', '丁': '어둠을 밝히는 촛불',
  '戊': '믿음직한 큰 산', '己': '만물을 기르는 밭',
  '庚': '강인한 원석', '辛': '섬세한 보석',
  '壬': '깊고 넓은 바다', '癸': '스며드는 봄비',
};

// 십성 기반 코칭 데이터
const RELATION_COACHING: Record<EnergyRelation, {
  painMin: number; painMax: number;
  painReason: string;
  neuroExplanation: string;
  breakthroughs: string[];
  scans: string[];
  syncs: string[];
  shifts: string[];
  color: string;
  emoji: string;
}> = {
  SYNC: {
    painMin: 20, painMax: 45,
    painReason: '오늘은 당신과 동일한 주파수의 에너지가 증폭되는 날입니다. 자아가 강해지고 마찰이 생길 수 있습니다.',
    neuroExplanation: '🧠 [뉴로-심리 분석]\n디폴트 모드 네트워크(DMN)가 과활성화되어 자기방어적 고집과 인지 편향이 발생하기 쉽습니다. 오늘은 내면의 자아(Ego)가 팽창하는 시기이므로, 무리하게 의견을 관철하기보다는 객관적 시선으로 인지적 유연성(Cognitive Flexibility)을 확보해야 합니다. 타인을 거울로 삼아 나를 관찰하세요.',
    breakthroughs: ['자기 객관화', '거울 효과', '주관 유지', '협력'],
    scans: [
      '오늘은 같은 성질의 에너지가 만나 서로를 뚜렷하게 비추는 거울의 방과 같습니다.',
      '오늘 느끼는 묘한 고집이나 경쟁심은 당신의 내부 에너지가 외부 환경에 의해 증폭된 결과입니다.',
    ],
    syncs: [
      '"나를 고집하지 않고 타인을 거울로 삼는다"라고 관점을 전환해 보세요.',
      '에너지가 증폭되는 날입니다. 오늘은 혼자만의 독단보다는 타인과의 속도 조절이 필요합니다.',
    ],
    shifts: [
      '오늘 나를 자극하는 사람에게서 배울 점 딱 한 가지를 찾아 기록하세요.',
      '오늘 하루, 논쟁이 생기면 내 의견을 즉각 관철시키지 말고 1시간만 결정을 뒤로 미루세요.',
    ],
    color: '#6b7280',
    emoji: '🌀',
  },
  RESOURCE: {
    painMin: 10, painMax: 30,
    painReason: '우주의 에너지가 당신을 생(生)하며 양분을 쏟아붓고 있습니다. 무리한 행동보다 수용이 필요한 날입니다.',
    neuroExplanation: '🧠 [뉴로-심리 분석]\n부교감 신경계가 우위를 점하여 뇌가 수용과 충전(Rest and Digest) 모드로 진입했습니다. 자극적인 행동이나 무리한 아웃풋을 강요하기보다, 옥시토신 분비를 돕는 안전 기지(Secure Base) 환경에서 메타인지를 채워넣는 인풋(Input)에 집중하는 것이 뇌 과학적으로 가장 유리합니다.',
    breakthroughs: ['학습', '통찰', '휴식', '에너지 충전'],
    scans: [
      '오늘은 외부 에너지가 당신을 가득 채우는 날입니다. 지혜를 흡수하기 가장 좋은 타이밍입니다.',
      '조금 쳐지거나 생각이 많아지나요? 그것은 충전을 위해 몸이 자체적으로 속도를 줄인 것입니다.',
    ],
    syncs: [
      '"오늘 배운 것이 내일의 강력한 무기가 된다"는 것을 잊지 마세요.',
      '에너지를 받는 날입니다. 남에게 주기보다 내 안을 단단하게 채우는 것에 집중하세요.',
    ],
    shifts: [
      '오늘 평소 미뤄왔던 강의를 보거나 심도 있는 책을 30분 이상 읽으세요.',
      '오늘 당신보다 앞서간 멘토나 전문가의 글을 찾아 읽고 인사이트 하나를 흡수하세요.',
    ],
    color: '#8b5cf6',
    emoji: '✨',
  },
  FLOW: {
    painMin: 30, painMax: 55,
    painReason: '내 안의 에너지가 밖으로 발산(發散)되는 날입니다. 표현력이 극대화되나 방전되기 쉽습니다.',
    neuroExplanation: '🧠 [뉴로-심리 분석]\n오늘은 전두엽의 아이디어 발산 회로가 폭발적으로 열린 플로우(Flow State) 상태입니다. 무리하게 감정이나 행동을 통제하려 하지 말고 도파민의 자연스러운 흐름에 몸을 맡기는 \'유연성\'이 필요합니다. 단, 지나친 표현이나 활동으로 인한 인지적 과부하(Burnout) 방전에는 주의하세요.',
    breakthroughs: ['창조적 표현', '아이디어 실행', '감정 해방', '방전 주의'],
    scans: [
      '지금 무언가 하고 싶거나 말하고 싶은 충동은 정상입니다. 오늘은 당신의 에너지가 밖으로 흘러넘치는 날입니다.',
      '에너지가 밖으로 방출되고 있습니다. 아이디어가 샘솟지만, 체력이 평소보다 빨리 소모될 수 있습니다.',
    ],
    syncs: [
      '"내 생각을 거침없이 발산하되, 브레이크를 잊지 말자"고 다짐하세요.',
      '창조의 에너지가 가득합니다. 머릿속에만 있던 기획이나 감정을 세상에 노출하기에 최적입니다.',
    ],
    shifts: [
      '오전 11시 전에 평소 주저했던 기획안이나 메시지를 과감하게 먼저 던져보세요.',
      '오전에 집중적으로 에너지를 쏟아붓고, 오후에는 반드시 온전한 휴식 시간을 30분 이상 확보하세요.',
    ],
    color: '#06b6d4',
    emoji: '🌊',
  },
  PRESSURE: {
    painMin: 60, painMax: 90,
    painReason: '외부의 강력한 룰과 책임감이 당신을 극(剋)하며 압박하는 날입니다. 당신을 명검으로 제련하는 과정입니다.',
    neuroExplanation: '🧠 [뉴로-심리 분석]\n높은 외부 스트레서(Stressor)로 인해 편도체의 투쟁-도피(Fight-or-Flight) 반응이 유발되기 쉬운 환경입니다. 감정적인 뇌의 폭주를 억제하고, 전전두엽의 실행 기능(Executive Function)을 강력하게 가동시켜 인내와 자기 통제력으로 이 압박 구간을 정면 돌파해야 합니다.',
    breakthroughs: ['임무 완수', '강한 인내력', '책임 수용', '정면 돌파'],
    scans: [
      '오늘 느껴지는 강한 압박감과 저항은 당신이 약해서가 아닙니다. 뜨거운 용광로가 당신을 단련하는 중입니다.',
      '당신을 통제하려는 흐름이 감지됩니다. 이 시련을 넘어서면 당신의 사회적 입지가 한 단계 도약합니다.',
    ],
    syncs: [
      '"이 압박이 나를 더 단단한 기물로 다듬고 있다"라고 시각을 바꾸세요.',
      '비난이나 무거운 책임감이 주어지더라도 피하지 마세요. 오늘은 방어력 테스트를 통과해야 하는 날입니다.',
    ],
    shifts: [
      '가장 피하고 싶고 무겁게 느껴지는 업무 하나에만 오늘 90분을 온전히 쏟으세요.',
      '타인의 비판이나 불만이 들어왔을 때, 즉각 반박하지 말고 "수용하겠습니다"라며 그릇의 크기를 보여주세요.',
    ],
    color: '#ef4444',
    emoji: '🔥',
  },
  ACHIEVEMENT: {
    painMin: 40, painMax: 65,
    painReason: '당신이 대상을 극(剋)하여 쟁취해야 하는 날입니다. 명확한 타겟팅이 없으면 에너지만 분산됩니다.',
    neuroExplanation: '🧠 [뉴로-심리 분석]\n외적 동기를 담당하는 뇌의 보상 회로(Reward Circuit)가 매우 예민하게 반응하는 시점입니다. 도파민성 사냥 본능이 강해지므로, 수많은 시냅스를 여기저기 낭비하지 말고 오직 단 하나의 명확한 타겟에 선택적 주의력(Selective Attention)을 쏟아부어야 실제 결실을 맺을 수 있습니다.',
    breakthroughs: ['목표 달성', '선택과 집중', '과감한 타겟팅', '유연한 전술'],
    scans: [
      '오늘은 사냥감을 포착하고 정복해야 하는 날입니다. 눈앞에 성취해야 할 목표가 분명하게 보입니다.',
      '이것저것 다 하고 싶은 욕망이 끓어올 수 있습니다. 그러나 에너지를 분산시키면 아무것도 얻지 못합니다.',
    ],
    syncs: [
      '"오늘 나의 과녁은 오직 하나뿐이다"라고 스스로에게 명령하세요.',
      '결과를 만들어내기에 가장 좋은 유리한 조건이 형성되어 있습니다. 통제권을 쥐세요.',
    ],
    shifts: [
      '오늘 시작할 여러 가지 일 중 수익이나 핵심 성과에 가장 직결되는 단 하나의 목표만 남기고 모두 쳐내세요.',
      '업무 진행 중 지지부진한 사안이 있다면, 오늘 강력하게 리더십을 발휘하여 결론을 지어버리세요.',
    ],
    color: '#f59e0b',
    emoji: '🎯',
  },
};

/**
 * 지지(Zhi)를 활용한 십성 분석 헬퍼
 */
function getZhiRelationDetails(userElement: string, zhiElement: string): string {
  const rel = ELEMENT_RELATIONS[userElement]?.[zhiElement] || 'SYNC';
  const labelMap: Record<EnergyRelation, string> = {
    SYNC: '비견(독립성) 기운이 하부에 깔려있어 뚝심과 자기 확신을 탄탄히 받쳐주는 역할을 합니다.',
    RESOURCE: '인성(수용력) 기운이 하부에 깔려있어 무리하지 않게 에너지를 보충해주는 안전판 역할을 합니다.',
    FLOW: '식상(표현력) 기운이 하부에 깔려있어 유연함과 창의성이 은은하게 감도는 부스터 역할을 합니다.',
    PRESSURE: '관성(책임감) 기운이 하부에 깔려있어 체력적·정신적 긴장을 유지시키는 제어 장치 역할을 합니다.',
    ACHIEVEMENT: '재성(목표의식) 기운이 하부에 깔려있어 결과 지향적인 움직임이 기저에서 작동합니다.'
  };
  return labelMap[rel];
}

/**
 * 사용자 일간과 오늘 일진의 하모니 분석
 */
export function analyzeDailyHarmony(
  userDayMasterHanja: string,
  todayGan: string,
  todayZhi: string,
  todayGanElement: string,
  todayZhiElement: string,
): DailyHarmonyResult {
  const userElement = DAYMASTER_ELEMENT[userDayMasterHanja] || '목';
  
  // 메인 에너지 (천간 기준)
  const relation: EnergyRelation = ELEMENT_RELATIONS[userElement]?.[todayGanElement] || 'SYNC';
  const coaching = RELATION_COACHING[relation];
  
  // 오늘의 고통 농도 계산
  const today = new Date();
  const seed = today.getDate() * 3 + today.getMonth() * 7;
  const painLevel = coaching.painMin + (seed % (coaching.painMax - coaching.painMin));
  
  const idx = today.getDate() % 2;
  const trait = DAYMASTER_TRAIT[userDayMasterHanja] || '본질';

  // [상용화 고도화] 간지 이중 레이어 코멘트 생성
  const zhiElement = todayZhiElement || '토'; // fallback
  const microCoaching = `단, 지지의 ${todayZhi}(${zhiElement})가 ${getZhiRelationDetails(userElement, zhiElement)}`;

  return {
    todayGan,
    todayZhi,
    todayGanElement,
    userDayMaster: userDayMasterHanja,
    relation,
    painLevel,
    painReason: coaching.painReason,
    breakthroughKeyword: coaching.breakthroughs[seed % coaching.breakthroughs.length],
    scanMessage: coaching.scans[idx].replace('[일간특성]', trait),
    syncMessage: coaching.syncs[idx],
    shiftMission: coaching.shifts[idx],
    energyColor: coaching.color,
    energyEmoji: coaching.emoji,
    neuroExplanation: coaching.neuroExplanation,
    microCoaching
  };
}

/**
 * 바이오리듬 계산 (신체: 23일, 감정: 28일, 지성: 33일 주기)
 */
export function calculateBiorhythm(birthDateStr: string): {
  physical: number;   // -100 ~ 100
  emotional: number;
  intellectual: number;
  overallScore: number; // 0 ~ 100
  physicalLabel: string;
  emotionalLabel: string;
  intellectualLabel: string;
} {
  try {
    const birth = new Date(birthDateStr);
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    const physical = Math.round(Math.sin(2 * Math.PI * daysSince / 23) * 100);
    const emotional = Math.round(Math.sin(2 * Math.PI * daysSince / 28) * 100);
    const intellectual = Math.round(Math.sin(2 * Math.PI * daysSince / 33) * 100);
    const overallScore = Math.round((physical + emotional + intellectual + 300) / 6);

    const getLabel = (val: number) => {
      if (val > 60) return '최고조';
      if (val > 20) return '상승';
      if (val > -20) return '중립';
      if (val > -60) return '하강';
      return '저점';
    };

    return {
      physical,
      emotional,
      intellectual,
      overallScore,
      physicalLabel: getLabel(physical),
      emotionalLabel: getLabel(emotional),
      intellectualLabel: getLabel(intellectual),
    };
  } catch {
    return { physical: 0, emotional: 0, intellectual: 0, overallScore: 50, physicalLabel: '중립', emotionalLabel: '중립', intellectualLabel: '중립' };
  }
}

/**
 * 오행 특성을 고려한 바이오-사주 통합 권고
 */
export function getBioSajuAdvice(
  dominantElement: string,
  biorhythm: ReturnType<typeof calculateBiorhythm>,
): string {
  const { physical, intellectual } = biorhythm;
  
  const elementAdvice: Record<string, Record<string, string>> = {
    '목': {
      '저점_저점': '🌱 성장 에너지가 잠시 멈춘 날입니다. 스트레칭과 산책으로 몸을 깨우세요.',
      '최고조_최고조': '🌳 오늘 당신의 창의적 확장 에너지가 최고조입니다. 미뤄둔 아이디어를 지금 실행하세요!',
      default: '🌿 흐름을 유지하며 꾸준히 나아가세요.',
    },
    '화': {
      '저점_저점': '🕯️ 불꽃 에너지가 낮은 날입니다. 억지로 빛나려 하지 말고 잠시 충전하세요.',
      '최고조_최고조': '☀️ 오늘 발표, 강의, 소통의 날입니다. 당신의 빛을 세상에 발산하세요!',
      default: '🔆 에너지를 균형있게 나누며 즐겁게 일하세요.',
    },
    '토': {
      '저점_저점': '⛰️ 중심 에너지가 흔들릴 수 있는 날입니다. 루틴을 지키는 것이 최선입니다.',
      '최고조_최고조': '🏔️ 오늘 중요한 결정과 조율의 날입니다. 당신의 판단을 믿으세요!',
      default: '🌏 안정적으로 중심을 잡고 주변을 돌보세요.',
    },
    '금': {
      '저점_저점': '⚔️ 예리함이 잠시 무뎌진 날입니다. 쉬어가며 날을 다시 세우세요.',
      '최고조_최고조': '💎 오늘 분석, 판단, 결단력이 최고조입니다. 어려운 문제를 지금 해결하세요!',
      default: '🔩 정밀함을 유지하며 꼼꼼하게 진행하세요.',
    },
    '수': {
      '저점_저점': '🌊 지혜의 샘이 잠시 마른 날입니다. 조용히 내면의 소리에 귀 기울이세요.',
      '최고조_최고조': '🌊 오늘 통찰과 지혜가 흘러넘칩니다. 깊은 사고와 전략적 결정의 날입니다!',
      default: '💧 유연하게 흐르며 상황에 맞게 적응하세요.',
    },
  };

  const physicalState = physical < -40 ? '저점' : physical > 40 ? '최고조' : '중립';
  const intellectualState = intellectual < -40 ? '저점' : intellectual > 40 ? '최고조' : '중립';
  const key = `${physicalState}_${intellectualState}`;
  
  const elementMap = elementAdvice[dominantElement] || elementAdvice['목'];
  return elementMap[key] || elementMap['default'];
}
