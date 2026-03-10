
import { getEnergyLevel } from '../utils/sajuLogic';

export interface RelationshipMode {
    title: string;
    subtitle: string;
    core_concept: string;
    saju_analysis_guide: string;
}

export const RELATIONSHIP_MODES: Record<string, RelationshipMode> = {
    'ms_rel_attraction': {
        title: "💘 매력의 법칙 (Attraction Code)",
        subtitle: "나는 어떤 사람에게 끌리는가?",
        core_concept: "당신의 설계도에 저장된 **'사랑의 중력 법칙'**을 해독합니다. 왜 특정 유형의 사람에게 강하게 끌리는지, 그 비밀은 **[관계 인터페이스(Relationship Interface)]**와 **[모달 프로필]**에 있습니다.",
        saju_analysis_guide: "Analyze the User's Day Branch (Relationship Interface) and Modal Profiles. If Relationship Interface has interference with Social Interface, explain the attraction pattern. Use Energy Lifecycle to describe the 'Intensity' of love (e.g., Active = passionate but unstable)."
    },
    'ms_rel_mirror': {
        title: "🪞 관계의 거울 (Karmic Mirror)",
        subtitle: "그 사람은 나의 무엇을 비추는가?",
        core_concept: "모든 인연은 당신의 무의식을 비추는 거울입니다. 반복되는 이별이나 갈등은 상대방의 문제가 아니라, 당신 내면의 **'해결되지 않은 숙제'**인 그림자 코드가 투영된 것입니다.",
        saju_analysis_guide: "Check for 'Expansion Void' or 'Interference' in the architecture. Explain that partners trigger these specific weak points to force growth. Reframe conflict as 'Neural Alignment'."
    },
    'ms_rel_timing': {
        title: "⏳ 사랑의 타이밍 (Red String)",
        subtitle: "언ze 운명의 상대를 만나는가?",
        core_concept: "사랑에도 **'계절'**이 있습니다. 에너지가 활성화되어야 인연이 닿듯, 당신의 매력이 만개하는 시기는 정해져 있습니다. 억지로 찾지 말고, 그때를 준비하십시오.",
        saju_analysis_guide: "Analyze the 'Great Cycle' (10-year period) and 'Yearly Insight'. Look for 'Resonance' or 'Attraction Codes'. Predict the next peak romantic window."
    }
};

export const getRelationshipContext = (intent: string, sajuData: any): string => {
    const mode = RELATIONSHIP_MODES[intent];
    if (!mode) return "";

    // Basic Saju Extraction for Context
    const dayMaster = sajuData?.dayMaster || 'Unknown';
    const dayBranch = sajuData?.fourPillars?.day?.ji?.char || '';

    // Dynamic Analysis Injection
    let specificInsight = "";
    if (intent === 'ms_rel_attraction') {
        specificInsight = `DayMaster: ${dayMaster}, DayBranch: ${dayBranch}. Focus on what ${dayBranch} represents in relationship style.`;
    }

    return `[RELATIONSHIP MODE: ${mode.title}]
Target: ${mode.subtitle}
Core Concept: ${mode.core_concept}
Saju Data: ${specificInsight}
Analysis Guide: ${mode.saju_analysis_guide}`;
};
