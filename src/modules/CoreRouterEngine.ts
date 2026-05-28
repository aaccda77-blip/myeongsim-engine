/**
 * CoreRouterEngine.ts - 4-Core 자동 라우팅 인프라
 * 
 * 목적: 사용자의 입력 텍스트와 스트레스 지수를 분석하여 
 * CBT, ACT, DBT, MBCT 4가지 핵심 심리 솔루션 중 최적의 모듈을 초 단위로 스위칭합니다.
 */

export type CoachingCore = 'CBT' | 'ACT' | 'DBT' | 'MBCT' | 'NONE';

export interface CoreAnalysisResult {
    targetCore: CoachingCore;
    promptInjection: string;
    description: string;
}

// ─── 휴리스틱 키워드 사전 ───
const CORE_KEYWORDS = {
    // 🔧 CBT (인지행동 코칭): 인지 왜곡, 과잉 일반화, 자기 비난
    CBT: ['항상', '절대', '망했', '내 탓', '어차피', '모든 게', '아무도', '바보', '쓸모없', '실패'],
    // 🚀 ACT (수용전념 코칭): 가치 상실, 회피, 무기력, 저항
    ACT: ['의미없', '모르겠', '귀찮', '피하고싶', '하기싫', '무기력', '포기', '그만두', '어쩌라고'],
    // 🧊 DBT (변증법적 행동 코칭): 감정 폭주, 분노, 자해 충동, 한계치
    DBT: ['미치겠', '화나', '죽고싶', '짜증', '터질것', '끝내', '견딜 수', '폭발', '부숴', '미워'],
    // 🪷 MBCT (마음챙김 인지 코칭): 반추, 집착, 후회, 과거 지향
    MBCT: ['계속', '자꾸', '또', '왜', '후회', '생각나', '예전', '그때', '미련', '불안']
};

/**
 * 키워드 매칭 점수 계산
 */
function calculateCoreScore(text: string, keywords: string[]): number {
    let score = 0;
    const normalizedText = text.toLowerCase();
    for (const keyword of keywords) {
        if (normalizedText.includes(keyword)) {
            score += 1;
        }
    }
    return score;
}

/**
 * 4-Core 오토 라우팅 엔진
 */
export function determineCoachingCore(message: string, stressLevel: number = 50): CoreAnalysisResult {
    const cbtScore = calculateCoreScore(message, CORE_KEYWORDS.CBT);
    const actScore = calculateCoreScore(message, CORE_KEYWORDS.ACT);
    const dbtScore = calculateCoreScore(message, CORE_KEYWORDS.DBT);
    const mbctScore = calculateCoreScore(message, CORE_KEYWORDS.MBCT);

    let maxScore = Math.max(cbtScore, actScore, dbtScore, mbctScore);
    let targetCore: CoachingCore = 'NONE';
    const isInfoQuery = message.includes('?') || message.includes('뭐야') || message.includes('어때') || message.includes('알려줘') || message.includes('어떻게');

    if (isInfoQuery) {
        targetCore = 'NONE';
    }
    // 1. 키워드 점수 기반 할당 (가장 높은 점수)
    else if (maxScore > 0) {
        // 동점일 경우 긴급도가 높은 순으로 우선순위 부여: DBT > CBT > MBCT > ACT
        if (dbtScore === maxScore) targetCore = 'DBT';
        else if (cbtScore === maxScore) targetCore = 'CBT';
        else if (mbctScore === maxScore) targetCore = 'MBCT';
        else if (actScore === maxScore) targetCore = 'ACT';
    } 
    // 2. 매칭되는 키워드가 없을 때 생체 데이터(스트레스) 기반 라우팅
    else {
        if (stressLevel >= 85) {
            targetCore = 'DBT'; // 극단적 스트레스 시 강제 제어
        } else if (stressLevel >= 65) {
            targetCore = 'ACT'; // 약간 높은 스트레스 시 수용/행동 유도
        }
    }

    // ─── 프롬프트 인젝션 블록 생성 ───
    let promptInjection = '';
    let description = '';

    switch (targetCore) {
        case 'DBT':
            description = '🧊 감정 냉각 코어 가동';
            promptInjection = `
[SHIFT - 🧊 DBT(변증법적 행동) 모듈 가동 중]
사용자가 감정 폭주 또는 한계치에 도달한 상태입니다.
- **최우선 목표**: 행동 제어 및 긴급 냉각.
- **코칭 방향**: 절대 논리적으로 설득하려 하지 마세요. 당장의 호흡, 시원한 물 마시기, 주먹 쥐었다 펴기 등 TIPP(온도 변화, 강렬한 운동, 호흡 조절, 근육 이완) 스킬을 부드럽게 지시하세요.
`;
            break;
        case 'CBT':
            description = '🔧 인지 오류 디버깅 코어 가동';
            promptInjection = `
[SHIFT - 🔧 CBT(인지행동) 모듈 가동 중]
사용자의 메시지에서 '과잉 일반화' 또는 '흑백 논리'와 같은 인지 오류(버그)가 발견되었습니다.
- **최우선 목표**: 우울/불안의 자동 반응 차단.
- **코칭 방향**: 공감하되, 사용자의 극단적인 표현("항상 망한다", "절대 안 된다")이 100% 팩트인지 객관적으로 점검할 수 있는 디버깅 질문을 던지세요.
`;
            break;
        case 'MBCT':
            description = '🪷 마음챙김 인지 코어 가동';
            promptInjection = `
[SHIFT - 🪷 MBCT(마음챙김 인지) 모듈 가동 중]
사용자가 과거의 후회나 불안한 생각의 루프(반추)에 빠져있습니다.
- **최우선 목표**: 만성적 반추 고리 차단 및 현존(Presence) 회복.
- **코칭 방향**: 생각은 그저 뇌를 스쳐가는 날씨일 뿐임을 상기시키세요. 판단하지 말고 현재의 감각(발바닥이 땅에 닿는 느낌 등)으로 주의를 돌리도록 안내하세요.
`;
            break;
        case 'ACT':
            description = '🚀 수용전념 코어 가동';
            promptInjection = `
[SHIFT - 🚀 ACT(수용전념) 모듈 가동 중]
사용자가 무기력하거나 삶의 저항 상태에 있습니다.
- **최우선 목표**: 저항 완화 및 본질적 가치(용신)를 향한 행동 유도.
- **코칭 방향**: 고통스러운 감정을 없애려 애쓰지 말고 그대로 안고 가도록 수용(Acceptance)을 안내하며, 사용자가 진정으로 중요하게 생각하는 가치(가족, 성장 등)를 위해 오늘 할 수 있는 아주 작은 행동 하나를 찾아주세요.
`;
            break;
        case 'NONE':
            description = '일반 코칭 모드';
            promptInjection = `
[SHIFT - 일반 코칭 모드]
현재 심각한 인지 왜곡이나 감정 폭주가 감지되지 않았습니다. 자연스러운 대화를 유지하세요.
`;
            break;
    }

    return { targetCore, promptInjection, description };
}
