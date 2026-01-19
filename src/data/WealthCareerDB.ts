
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
        core_concept: "돈을 버는 것보다 중요한 건 '새는 구멍'을 막는 것입니다. 당신의 사주에 숨겨진 **'도둑놈(겁재)'**이나 **'구멍(공망)'**을 찾아, 땜질하는 비법을 알려드립니다.",
        saju_analysis_guide: "Check for 'Gongmang' (Void) in Wealth Pillar. Check for strong 'Geopjae' (Robber) without control. Provide mitigation strategy (e.g., donating, fixed assets)."
    },
    'ms_wealth_weapon': {
        title: "💎 '돈을 부르는' 무기 (Wealth Weapon)",
        subtitle: "나는 한방인가, 티끌 모아 태산인가?",
        core_concept: "부자가 되는 길은 하나가 아닙니다. **'투자(편재)'**로 대박 날 팔자인지, **'시스템/저축(정재)'**으로 성을 쌓을 팔자인지, 당신의 **'부의 DNA'**를 해독합니다.",
        saju_analysis_guide: "Compare 'Pyeon-jae' (Indirect Wealth) vs 'Jeong-jae' (Direct Wealth). If Pyeon-jae > Jeong-jae -> Investment/Risk. If Jeong-jae > Pyeon-jae -> Savings/Stable Income."
    },
    'ms_wealth_timing': {
        title: "📈 인생의 '잭팟' 타이밍 (Quantum Jump)",
        subtitle: "언제 투자를 늘려야 하는가?",
        core_concept: "부의 크기는 **'그릇'**과 **'때(Timing)'**의 곱셈입니다. 지금이 **'파종기'**인지, **'수확기(제왕)'**인지 정확히 파악하여 자산 증식의 골든타임을 잡으세요.",
        saju_analysis_guide: "Analyze Daewoon/Seun for Wealth Element strength. Look for 'Rok' or 'Je-wang' stages in 12 Wunsung. Identify 'Hap' (Combination) with Wealth."
    }
};

// ============================================
// 2. Quantum Career Modes (천직 발견 2.0)
// ============================================
export const CAREER_MODES: Record<string, QuantumMode> = {
    'ms_career_skill': {
        title: "🗡️ 나만의 '히든 스킬' (Hidden Skill)",
        subtitle: "남들은 모르는 나의 사기급 능력",
        core_concept: "이력서에 쓰는 자격증이 아닙니다. 하늘이 당신에게만 부여한 **'특수 능력(신살)'**을 찾아드립니다. 이 무기를 꺼내는 순간, 경쟁은 무의미해집니다.",
        saju_analysis_guide: "Identify 'Yongsin' and special Stars (e.g., Hwagae = Art/Religion, Dohwa = Popularity/Influence, Yeokma = Global/Sales)."
    },
    'ms_career_path': {
        title: "⚖️ 월급 vs 야생마 (Destiny Type)",
        subtitle: "조직에 남을까, 내 판을 벌릴까?",
        core_concept: "안 맞는 옷을 입고 뛰면 지칩니다. 당신이 **'제복(관성)'**을 입고 빛나는 사람인지, **'무대(식상)'**에서 춤춰야 하는 사람인지 명쾌하게 판결해드립니다.",
        saju_analysis_guide: "Compare 'Gwan-Seong' (Officer) vs 'Sik-Sang' (Output). Strong Officer -> Corporate/Public Service. Strong Output -> Entrepreneur/Freelancer/Artist."
    },
    'ms_career_energy': {
        title: "🔋 번아웃 없는 '무한 동력' (Energy Source)",
        subtitle: "무엇이 나를 다시 뛰게 하는가?",
        core_concept: "지치지 않는 열정은 의지력이 아니라 **'에너지 충전소(용신)'**에서 나옵니다. 당신의 영혼을 충전시키는 활동과 환경을 처방해드립니다.",
        saju_analysis_guide: "Identify 'Jo-hu' (Temperature) and 'Yongsin' element. If Fire needed -> Passion/Action/Daytime. If Water needed -> Wisdom/Rest/Night."
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
