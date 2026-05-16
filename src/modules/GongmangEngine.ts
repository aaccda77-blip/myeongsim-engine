/**
 * GongmangEngine.ts
 * 공망(空망) 계산 및 분석 엔진
 * 
 * 공망: 간지 결합 시 남는 지지(Empty Branches). 
 * 에너지가 '비어 있음'을 의미하며, 길흉의 작용력을 변화시킴.
 */

export interface GongmangInfo {
  branches: string[];      // 공망 지지 (예: ["戌", "亥"])
  isTodayGongmang: boolean; // 오늘 일진이 공망인지 여부
  description: string;      // 공망의 의미 해석
}

const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
const HAN_BRANCHES = '자축인묘진사오미신유술해';
const STEMS = '甲乙丙丁戊己庚辛壬癸';
const HAN_STEMS = '갑을병정무기경신임계';

/**
 * 특정 간지의 인덱스 추출
 */
function getIndex(char: string, source: string, hanSource: string): number {
  let idx = source.indexOf(char);
  if (idx === -1) idx = hanSource.indexOf(char);
  return idx;
}

/**
 * 일주(Day Pillar)를 기반으로 공망 지지 2개를 계산
 */
export function calculateGongmang(dayPillar: string, todayPillar?: string): GongmangInfo {
  const stemIdx = getIndex(dayPillar[0], STEMS, HAN_STEMS);
  const branchIdx = getIndex(dayPillar[1], BRANCHES, HAN_BRANCHES);

  if (stemIdx === -1 || branchIdx === -1) {
    return { branches: [], isTodayGongmang: false, description: '' };
  }

  // 공망 계산 공식: (지지인덱스 - 천간인덱스) % 12
  // 결과가 음수면 +12
  let startIdx = (branchIdx - stemIdx);
  while (startIdx < 0) startIdx += 12;
  
  // 공망은 해당 순(10일)의 마지막 두 자리
  // 순의 시작 지지에서 역으로 2자리가 공망임 (또는 시작에서 +10, +11)
  const g1Idx = (startIdx + 10) % 12;
  const g2Idx = (startIdx + 11) % 12;

  const g1 = BRANCHES[g1Idx];
  const g2 = BRANCHES[g2Idx];
  const g1Han = HAN_BRANCHES[g1Idx];
  const g2Han = HAN_BRANCHES[g2Idx];

  const gongmangBranches = [g1, g2];
  const gongmangHan = [g1Han, g2Han];

  let isTodayGongmang = false;
  if (todayPillar) {
    const todayBranch = todayPillar[1];
    isTodayGongmang = gongmangBranches.includes(todayBranch) || gongmangHan.includes(todayBranch);
  }

  return {
    branches: gongmangHan,
    isTodayGongmang,
    description: isTodayGongmang 
      ? `오늘은 당신의 공망(${gongmangHan.join(', ')})일입니다. 에너지가 비어있어 노력 대비 결과가 허무할 수 있으니, 무언가를 얻으려 하기보다 '비움'과 '명상'으로 활용하기 최적의 날입니다.`
      : `당신의 공망은 ${gongmangHan.join(', ')}입니다. 해당 에너지가 들어오는 날에는 욕심을 내려놓는 메타 코드가 필요합니다.`
  };
}

/**
 * 공망 융합 분석 의견
 */
export function getGongmangInsight(info: GongmangInfo): string {
  if (info.isTodayGongmang) {
    return "🚀 [Gongmang Fusion] 오늘 일진이 공망에 해당합니다. '재성'이나 '관성'의 작용력이 무력해지는 시기이므로, 세속적 성취에 집착하는 다크 코드를 즉각 종료하고, 현상 너머를 바라보는 메타 인지적 관점이 절대적으로 유리합니다.";
  }
  return "";
}
