/**
 * AwakeningPromptEngine.ts - 명심코칭 자각(Awakening) 질문 생성 엔진
 * 
 * 목적: 
 * - 단순한 정보 전달이 아닌, 사용자의 '관점 자각'과 '자유의지 발현'을 유도하는 질문 생성.
 * - Saju 구조적 특성(Gap, Identity, Perspective)에 기반한 초개인화 프롬프트 제공.
 */

export const generateAwakeningPrompt = (intent: string, userProfile: any): string | null => {
    if (!userProfile || !userProfile.saju) return null;

    const { saju } = userProfile;
    const dayMaster = saju.dayMaster || '일간'; // e.g., '신금'
    const dayMasterTrait = saju.dayMasterTrait || '타고난 기질'; // e.g., '예민한 보석'

    // Helper to safely get nested pillar data
    const getPillar = (type: 'year' | 'month' | 'day' | 'time') => {
        if (saju.fourPillars && saju.fourPillars[type]) return saju.fourPillars[type];
        return { gan: '?', ji: '?', ganColor: '', jiColor: '' }; // Fallback
    };

    const monthPillar = getPillar('month');
    // Simplified TenGod extraction for Month Pillar (Social Role) if not available directly
    // Ideally, this should come from detailed Saju analysis, but we use placeholders or simple logic if missing.
    // For prompt purpose, '월주' is often sufficient if TenGod is complex to calc here.
    const socialRole = monthPillar.ji ? `${monthPillar.ji}(월지)` : '사회적 역할';

    // Core Strength (could be Day Master or specific key strong element)
    const coreStrength = dayMasterTrait;

    switch (intent) {
        case 'saju_core_summary':
            return `
[SYSTEM: Act as a Mechanical Engineer of Fate]
Analyze the user's Saju Core Summary with a focus on "The Gap".
User's Core Engine: ${coreStrength} (${dayMaster})

Start with this Awakening Question:
"당신은 본래 **'${coreStrength}'**이라는 강력한 엔진을 탑재하고 태어났습니다.
하지만 현재 당신의 삶을 솔직히 들여다보십시오. 이 엔진을 마음껏 뽐내며 질주하고 계십니까(Neural Code), 아니면 '나와는 맞지 않는 길'이라며 시동을 꺼두고 답답해하고 계십니까(Dark Code)?

**[자가 진단]** 당신의 엔진 상태는 지금 어디입니까?
1. 🛑 **방치 (Level 1):** '나는 원래 안 돼'라며 시동조차 걸지 않음.
2. ⚠️ **억압 (Level 2):** '먹고 살려면 참아야지'라며 엔진을 숨기고 달림.
3. 🚀 **질주 (Level 3):** '이건 나만의 무기야!'라고 엔진을 풀가동함.

지금 당신이 느끼는 이상과 현실의 **'차이(Gap)'**는 어디서 오고 있다고 생각하십니까?"
`;

        case 'day_master_deep':
            return `
[SYSTEM: Act as a Deep Psychologist/Therapist]
Conduct a Deep Analysis of the Day Master (${dayMaster}) focusing on "De-identification".
User's Day Master: ${dayMaster} (${dayMasterTrait})

Start with this Awakening Question:
"**'${dayMaster}'**인 당신에게 느껴지는 **'특유의 기질(예민함/고집/현실성 등)'**은 결코 결함이 아니라, 당신만의 정교한 레이더입니다.
혹시 지금껏 이 기질이 튀어나올 때마다 '나는 왜 이럴까'라며 스스로를 감옥에 가두진 않으셨나요?

**[관점 선택]** 이제 선택하십시오. 당신은 누구입니까?
1. 🌊 **피해자 (Level 1):** 감정의 파도에 휩쓸려 허우적대는 사람.
2. ⚔️ **투사 (Level 2):** 감정과 싸우며 억지로 버티는 사람.
3. 🔭 **항해사 (Level 3):** 파도를 읽고 레이더로 활용하는 사람.

이 기질을 당신의 **'약점'**으로 두시겠습니까, 아니면 **'무기'**로 전환하시겠습니까?"
`;

        case 'month_pillar_role':
            return `
[SYSTEM: Act as a Stage Director of Life]
Analyze the Month Pillar (${socialRole}) as a "Social Stage" not a "Burden".
User's Social Context: ${monthPillar.gan}${monthPillar.ji} (Month Pillar)

Start with this Awakening Question:
"세상은 당신에게 **'${socialRole}'**이라는 배역을 맡겼습니다.
어떤 이에게 이 배역은 무거운 '짐(Burden)'이지만, 관점을 바꾸면 당신만이 소화할 수 있는 화려한 **'무대(Stage)'**가 됩니다.

**[배역 설정]** 당신의 자유의지로 대답해 주세요. 당신은 이 무대 위에서...
1. ⛓️ **단역 (Level 1):** 대본(사회적 기대)대로만 읊조리는 수동적 존재입니까?
2. 🛡️ **전사 (Level 2):** 살아남기 위해 가면을 쓰고 싸우는 존재입니까?
3. 🌟 **주연 배우 (Level 3):** 이 배역을 당신만의 색깔로 재해석해내는 창조적 존재입니까?

당신은 이 무대를 **'감옥'**으로 만드시겠습니까, **'놀이터'**로 만드시겠습니까?"
`;

        default:
            return null;
    }
};
