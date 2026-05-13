
// ============================================
// [Final Upgrade] Integrated Quantum Content DB
// Covers: Personality, Saju, Daily, Healing/Bio
// ============================================

export interface QuantumMode {
    title: string;
    subtitle: string;
    core_concept: string;
    saju_analysis_guide: string;
}

// 1. 🧬 성격/본질 (Personality) -> Soul Architecture
export const PERSONALITY_MODES: Record<string, QuantumMode> = {
    'ms_soul_arch': {
        title: "🏛️ 소울 아키텍처 (Soul Architecture)",
        subtitle: "내 영혼의 설계도 해킹",
        core_concept: "당신의 성격은 우연이 아닙니다. 태어난 순간 각인된 **'오행의 청사진(Blueprint)'**입니다. 겉으로 보이는 '일간'뿐만 아니라, 무의식 깊은 곳의 **'지장간'** 욕망까지 해부합니다.",
        saju_analysis_guide: "Deep dive into 'Jijanggan' (Hidden Stems) of the Month Branch. Reveal hidden desires vs overt behavior. Explain the 'Gyeok' (Structure) as the soul's primary engine."
    },
    'ms_dark_side': {
        title: "🌑 다크 사이드 & 빛 (Shadow Work)",
        subtitle: "단점이 사실은 최고의 무기였다?",
        core_concept: "약점은 **'잘못 쓰인 강점'**일 뿐입니다. 당신을 괴롭히던 **'충(Clash)'**과 **'형(Punishment)'**살이 사실은 당신을 천재로 만드는 **'기폭제'**임을 증명해드립니다.",
        saju_analysis_guide: "Reframe 'Chung' (Clash) as dynamic energy for change. Reframe 'Hyung' (Punishment) as professional competence. Transform 'Gishin' (Unfavorable) into a challenge for growth."
    }
};

// 2. 🔮 사주/운세 (Saju) -> Destiny GPS
export const SAJU_MODES: Record<string, QuantumMode> = {
    'ms_destiny_weather': {
        title: "🌦️ 인생의 날씨 예보 (Destiny Weather)",
        subtitle: "내일 비가 올까, 해가 뜰까?",
        core_concept: "운명도 날씨처럼 예측 가능합니다. 다가올 **'폭풍우(칠살운)'**를 미리 알고 우산을 준비하면, 오히려 **'빗물(기회)'**을 모을 수 있습니다.",
        saju_analysis_guide: "Explain the current 'Seun' (Year Luck) and 'Wolun' (Month Luck). If 'Chilsal' -> Pressure/Challenge (Umbrella needed). If 'Indong' -> Achievement/Paperwork."
    },
    'ms_life_wave': {
        title: "🌊 10년 대운의 파도타기 (Life Wave)",
        subtitle: "지금 노를 저을 때인가, 닻을 내릴 때인가?",
        core_concept: "인생에는 **'봄여름가을겨울'**이 있습니다. 당신이 지금 **'겨울(수성)'**을 지나고 있다면, 무리한 확장보다는 **'뿌리(내실)'**를 다져야 할 때입니다.",
        saju_analysis_guide: "Analyze the current 10-year 'Daewoon' season (Wood/Fire/Metal/Water). Map it to the User's Life Cycle (Growth vs Harvest vs Rest)."
    }
};

// 3. 💊 데일리/습관 (Daily) -> Energy Cheat Key
export const DAILY_MODES: Record<string, QuantumMode> = {
    'ms_daily_quest': {
        title: "⚔️ 오늘의 퀘스트 (Daily Quest)",
        subtitle: "오늘의 기질 데이터를 200% 활용하는 법",
        core_concept: "운은 기다리는 게 아니라 **'쓰는 것'**입니다. 오늘 들어온 **'재성(Money)'** 기운을 잡기 위해 지금 당장 해야 할 **'행동 미션'**을 드립니다.",
        saju_analysis_guide: "Based on today's Iljin (Daily Pillar), assign a specific micro-mission. E.g., If Fire day -> 'Speak up/Present'. If Water day -> 'Plan/Think'."
    },
    'ms_energy_station': {
        title: "🔋 오행 에너지 충전소 (Energy Station)",
        subtitle: "나에게 부족한 기운 채우기",
        core_concept: "오늘 유난히 지치나요? 당신에게 지금 **'목(Wood)'** 기운이 고갈되었습니다. 초록색 아이템이나 신맛 음료로 즉각 **'에너지 밸런스'**를 맞추세요.",
        saju_analysis_guide: "Calculate daily element balance. Prescribe 'Color', 'Food', 'Direction', and 'Activity' to boost the weakest or most needed element."
    }
};

// 4. 🌿 힐링/바이오 (Healing) -> Neural Healing
export const HEALING_MODES: Record<string, QuantumMode> = {
    'ms_sonic_cure': {
        title: "🎧 주파수 처방전 (Sonic Cure)",
        subtitle: "듣기만 해도 운이 좋아진다?",
        core_concept: "오행은 고유의 **'주파수(Hz)'**를 가집니다. 당신의 사주에 부족한 진동수를 **'바이노럴 비트'**와 **'자연의 소리'**로 공명시켜 무의식의 균형을 맞춥니다.",
        saju_analysis_guide: "Match Elements to Frequencies: Wood(396Hz), Fire(528Hz), Earth(639Hz), Metal(741Hz), Water(852Hz). Play the track for the user's Yongsin."
    },
    'ms_mental_detox': {
        title: "🧠 멘탈 디톡스 (Brain Cleanse)",
        subtitle: "뇌파를 씻어내는 호흡법",
        core_concept: "스트레스는 **'화(Fire)'** 기운의 폭주입니다. 뇌과학적으로 검증된 **'4-7-8 호흡'**과 **'수(Water)'** 기운의 시각화로 뇌의 열기를 즉각 식혀드립니다.",
        saju_analysis_guide: "Guide user through a breathing exercise visualizing 'Cool Water' descending and 'Hot Fire' ascending (Su-Seung-Hwa-Gang)."
    }
};

// Helper for Context Injection
export const getIntegratedQuantumContext = (intent: string, sajuData: any): string => {
    const allModes = { ...PERSONALITY_MODES, ...SAJU_MODES, ...DAILY_MODES, ...HEALING_MODES };
    const mode = allModes[intent];
    if (!mode) return "";
    return `[QUANTUM MODE: ${mode.title}]\nTarget: ${mode.subtitle}\nConcept: ${mode.core_concept}\nGuide: ${mode.saju_analysis_guide}`;
};
