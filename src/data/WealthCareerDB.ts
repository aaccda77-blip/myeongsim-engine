
// ============================================
// 1. Quantum Wealth Modes (부의 그릇 2.0)
// ============================================
export interface QuantumMode {
    title: string;
    subtitle: string;
    core_concept: string;
    saju_analysis_guide: string;
}

export const WEALTH_MODES: Record<string, QuantumMode> = {
    'ms_wealth_leak': {
        title: "🕳️ '밑 빠진 독' 탐지기 (Money Leak)",
        subtitle: "왜 벌어도 통장은 비어있을까?",
        core_concept: "돈을 버는 것보다 중요한 건 '새는 구멍'을 막는 것입니다. 당신의 설계도에 숨겨진 **'확장 프로필(Rival)'**이나 **'확장 보이드(Expansion Void)'**를 찾아, 땜질하는 비법을 알려드립니다.",
        saju_analysis_guide: "Check for 'Expansion Void' in Wealth Architecture. Check for strong 'Expansion Profile (Rival)' without control. Provide mitigation strategy (e.g., fixed assets, specific allocation)."
    },
    'ms_wealth_weapon': {
        title: "💎 '돈을 부르는' 무기 (Wealth Weapon)",
        subtitle: "나는 한방인가, 티끌 모아 태산인가?",
        core_concept: "부자가 되는 길은 하나가 아닙니다. **'유연 자산(Flexible Asset)'**으로 대박 날 팔자인지, **'고정 자산(Fixed Asset)'**으로 성을 쌓을 팔자인지, 당신의 **'부의 코드(Wealth Code)'**를 해독합니다.",
        saju_analysis_guide: "Compare 'Flexible Asset Profile' vs 'Fixed Asset Profile'. If Flexible > Fixed -> Investment/Risk. If Fixed > Flexible -> Stable Income/Long-term Assets."
    },
    'ms_wealth_timing': {
        title: "📈 인생의 '잭팟' 타이밍 (Quantum Jump)",
        subtitle: "언제 투자를 늘려야 하는가?",
        core_concept: "부의 크기는 **'그릇'**과 **'때(Timing)'**의 곱셈입니다. 지금이 **'준비기'**인지, **'정점기(Peak Energy)'**인지 정확히 파악하여 자산 증식의 골든타임을 잡으세요.",
        saju_analysis_guide: "Analyze Great Cycle/Yearly Insight for Wealth Element strength. Look for 'Peak Energy' stages in Energy Lifecycle. Identify 'Resonance' with Wealth."
    }
};

// ============================================
// 2. Quantum Career Modes (천직 발견 2.0)
// ============================================
export const CAREER_MODES: Record<string, QuantumMode> = {
    'ms_career_skill': {
        title: "🗡️ 나만의 '히든 스킬' (Hidden Skill)",
        subtitle: "남들은 모르는 나의 사기급 능력",
        core_concept: "이력서에 쓰는 자격증이 아닙니다. 하늘이 당신에게만 부여한 **'뉴럴 코드(Neural Codes)'**를 찾아드립니다. 이 무기를 꺼내는 순간, 경쟁은 무의미해집니다.",
        saju_analysis_guide: "Identify 'Optimization Key' and special Neural Codes (e.g., Art/Intuition, Influence, Global/Movement)."
    },
    'ms_career_path': {
        title: "⚖️ 조직 vs 독립 (Destiny Type)",
        subtitle: "조직에 남을까, 내 판을 벌릴까?",
        core_concept: "안 맞는 옷을 입고 뛰면 지칩니다. 당신이 **'전문직/조직(Regulation)'**에서 빛나는 사람인지, **'창조적 성과(Creation)'**를 내야 하는 사람인지 명쾌하게 판결해드립니다.",
        saju_analysis_guide: "Compare 'Regulation Profile' vs 'Creative Profile'. Strong Regulation -> Corporate/System. Strong Creation -> Entrepreneur/Freelancer/Artist."
    },
    'ms_career_energy': {
        title: "🔋 번아웃 없는 '무한 동력' (Energy Source)",
        subtitle: "무엇이 나를 다시 뛰게 하는가?",
        core_concept: "지치지 않는 열정은 의지력이 아니라 **'최적화 키(Optimization Key)'**에서 나옵니다. 당신의 주파수를 충전시키는 활동과 환경을 처방해드립니다.",
        saju_analysis_guide: "Identify 'Neural Temperature' and 'Optimization Key' element. If Activation needed -> Passion/Action/Daytime. If Deepening needed -> Wisdom/Rest/Night."
    },
    'career_timing_analysis': {
        title: "📊 커리어 타이밍 (Career Timing)",
        subtitle: "이직/승진 최적 시기",
        core_concept: "인생에도 계절이 있습니다. 지금이 **'준비기'**인지, **'수확기'**인지 명확히 알려드립니다. 무리하게 움직이면 다치고, 가만히 있으면 기회를 놓칩니다.",
        saju_analysis_guide: "Analyze 'Great Cycle' (10-year cycle) and 'Yearly Insight' (1-year cycle) for Career Profile strength. Check 'Energy Lifecycle' stage (e.g., Peak for best timing)."
    }
};

// ============================================
// 3. Context Generators
// ============================================
export const getWealthContext = (intent: string, sajuData: any): string => {
    const mode = WEALTH_MODES[intent];
    if (!mode) return "";
    return `[WEALTH MODE: ${mode.title}]\nTarget: ${mode.subtitle}\nConcept: ${mode.core_concept}\nGuide: ${mode.saju_analysis_guide}`;
};

export const getCareerContext = (intent: string, sajuData: any): string => {
    const mode = CAREER_MODES[intent];
    if (!mode) return "";
    return `[CAREER MODE: ${mode.title}]\nTarget: ${mode.subtitle}\nConcept: ${mode.core_concept}\nGuide: ${mode.saju_analysis_guide}`;
};
