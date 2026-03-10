
import { getWunsungLevel } from '../utils/sajuLogic';

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
        core_concept: "당신의 사주에 설계된 **'사랑의 중력 법칙'**을 해독합니다. 왜 나쁜 남자/여자가 끌리는지, 왜 착한 사람은 지루한지, 그 비밀은 **[일지(Spouse Palace)]**와 **[관성/재성]**에 있습니다.",
        saju_analysis_guide: "Analyze the User's Day Branch (Spouse Palace) and Ten Gods (Wealth/Officer). If Day Branch conflicts with Month, explain the 'Bad Boy/Girl' attraction pattern. Use 12 Wunsung to describe the 'Intensity' of love (e.g., Bath/Mokyok = passionate but unstable)."
    },
    'ms_rel_mirror': {
        title: "🪞 관계의 거울 (Karmic Mirror)",
        subtitle: "그 사람은 나의 무엇을 비추는가?",
        core_concept: "모든 인연은 당신의 무의식을 비추는 거울입니다. 반복되는 이별이나 갈등은 상대방의 문제가 아니라, 당신 내면의 **'해결되지 않은 숙제'**가 투영된 것입니다.",
        saju_analysis_guide: "Check for 'Gongmang' or 'Clash' (Chung) in the chart. Explain that partners trigger these specific weak points to force growth. Reframe conflict as 'Soul Calibration'."
    },
    'ms_rel_timing': {
        title: "⏳ 사랑의 타이밍 (Red String)",
        subtitle: "언제 운명의 상대를 만나는가?",
        core_concept: "사랑에도 **'계절'**이 있습니다. 꽃이 피어야 나비가 오듯, 당신의 매력이 만개하는 시기는 정해져 있습니다. 억지로 찾지 말고, 그때를 준비하십시오.",
        saju_analysis_guide: "Analyze the 'Daewoon' (10-year cycle) and 'Seun' (Yearly luck). Look for 'Hap' (Combination) or 'Hongyeom/Dohwa' (Peach Blossom) stars. Predict the next peak romantic window."
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
