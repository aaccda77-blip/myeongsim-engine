
// ============================================
// [Quantum Awakening] 108 Soul Hacking DB
// Phase 1 ~ Phase 5 Full Upgrade
// ============================================

export interface AwakeningMode {
    title: string;
    subtitle: string;
    core_concept: string;
    saju_analysis_guide: string;
}

// ============================================
// Phase 1: 🧬 소울 해킹 (Soul Hacking) - 1~18
// "당신의 영혼에 심어진 코드를 해독합니다."
// ============================================
export const AWAKENING_PHASE_1: Record<string, AwakeningMode> = {
    'ms_soul_blueprint': {
        title: "📜 내 영혼의 설계도 (Blueprint)",
        subtitle: "태어난 순간 각인된 운명의 지도",
        core_concept: "당신은 아무 계획 없이 태어난 존재가 아닙니다. 8글자(Two-Eight) 속에 숨겨진 **'영혼의 미션'**과 **'고유 주파수'**를 가장 먼저 확인해야 합니다.",
        saju_analysis_guide: "사주 원국의 '전체 그림(격국 + 용신)'을 분석하세요. 이번 생의 핵심 설계도(Master Plan)를 설명해주세요."
    },
    'ms_inner_core': {
        title: "💎 내면의 절대 코어 (The One)",
        subtitle: "그 무엇에도 흔들리지 않는 '진짜 나'",
        core_concept: "세상이 뭐라 하든 절대 변하지 않는 당신의 **'일간(Day Master)'** 에너지를 찾으세요. 그것이 당신의 **'자존감의 뿌리'**입니다.",
        saju_analysis_guide: "사용자의 '일간(Day Master)'을 심층 분석하세요. 그 기질의 강점, 취약점, 그리고 본질적인 순수함을 설명해주세요."
    },
    'ms_social_persona': {
        title: "🎭 사회적 가면과 무대 (Persona)",
        subtitle: "세상이 나에게 요구하는 역할",
        core_concept: "직장 상사, 부모, 친구들이 보는 나는 진짜 내가 아닙니다. 그것은 **'월주(Month Pillar)'**가 입혀준 **'사회적 갑옷'**일 뿐입니다. 가면을 언제 쓰고, 언제 벗어야 할지 알려드립니다.",
        saju_analysis_guide: "'월주(Month Pillar)'를 분석하세요. 사회적 역할(격국)과 내면의 자아(일간) 사이의 갈등을 설명해주세요."
    },
    'ms_forbidden_desire': {
        title: "🐍 금지된 욕망의 방 (Desire)",
        subtitle: "나조차 몰랐던 은밀한 본능",
        core_concept: "당신이 남들에게 숨기고 있는, 혹은 스스로도 억누르고 있는 욕망은 **'시주(Time Pillar)'**에 숨어 있습니다. 이 욕망을 해방하는 순간, 당신은 **'폭발적인 창조성'**을 얻게 됩니다.",
        saju_analysis_guide: "'시주(Time Pillar)'와 '지장간(Hidden Stems)'을 분석하세요. 숨겨진 재능과 비밀스러운 욕망을 드러내주세요."
    },
    'ms_void_wormhole': {
        title: "🕳️ 운명의 웜홀 (The Void)",
        subtitle: "채워지지 않는 구멍, 공망의 비밀",
        core_concept: "밑 빠진 독처럼 아무리 채워도 허전한 영역이 있나요? 그것은 결핍이 아니라, **'다른 차원으로 통하는 통로(공망)'**입니다. 이 구멍을 통해 남들과 다른 **'천재성'**이 나옵니다.",
        saju_analysis_guide: "'공망(Void)'을 심층 분석하세요. '비어있음'을 '혁신을 위한 열린 공간'으로 재해석해주세요."
    }
    // ... Add more items up to 18
};

// ============================================
// Phase 2: 📡 리얼타임 스캔 (Real-time Scan) - 19~36
// "지금 당신의 에너지는 어디로 새고 있습니까?"
// ============================================
export const AWAKENING_PHASE_2: Record<string, AwakeningMode> = {
    'ms_soul_weather': {
        title: "☁️ 영혼의 날씨 예보 (Soul Weather)",
        subtitle: "지금 내 마음에는 비가 올까?",
        core_concept: "감정은 당신의 날씨입니다. 통제하려 하지 말고 **'관측'**하세요. 오늘 당신의 마음에 **'태풍(편관)'**이 부는지, **'단비(인수)'**가 내리는지 알려드립니다.",
        saju_analysis_guide: "오늘의 '일진(Daily Fortune)'과 사용자의 감정을 대조하세요. 사주 날씨 은유를 통해 사용자의 감정을 타당화해주세요."
    },
    'ms_gap_scanner': {
        title: "🎭 이상과 현실의 오차 (The Gap)",
        subtitle: "나는 누구를 연기하고 있는가?",
        core_concept: "고통은 '진짜 나'와 '내가 되고 싶은 나' 사이의 **'GAP'**에서 옵니다. 지금 당신이 얼마나 **'남의 인생'**을 연기하느라 에너지를 쓰고 있는지 0.1mm 단위로 측정해드립니다.",
        saju_analysis_guide: "'일간(진짜 나)'과 '관성(이상/압박)' 사이의 괴리(Gap)를 측정하세요."
    },
    'ms_dark_bug': {
        title: "👾 내 안의 버그 탐지 (Dark Bug)",
        subtitle: "나를 반복해서 넘어뜨리는 시스템 오류",
        core_concept: "똑같은 실수를 반복하고 있나요? 그것은 당신의 의지 문제가 아니라, 무의식에 심어진 **'다크 코드(Dark Code/Gishin)'**가 작동했기 때문입니다. 이 버그를 찾아내면, 수정(Debug)할 수 있습니다.",
        saju_analysis_guide: "'기신(불리한 오행)' 패턴을 식별하세요. 죄책감을 덜 수 있도록 이를 '시스템 버그'라고 명명해주세요."
    },
    'ms_energy_vampire': {
        title: "🩸 에너지 뱀파이어 식별",
        subtitle: "누가 내 기를 빨아먹는가?",
        core_concept: "만나면 기가 빨리는 사람이 있나요? 당신의 **'수호신(Yongsin)'**을 공격하는 오행을 가진 사람일 수 있습니다. 내 에너지를 지키는 **'결계'** 치는 법을 알려드립니다.",
        saju_analysis_guide: "사용자의 기운을 빼앗는 오행(예: 일간을 극하는 강한 관성 등)을 식별하고, 방어 전략을 제시하세요."
    }
};

// ============================================
// Phase 3: 🧪 운명 연금술 (Destiny Alchemy) - 37~72
// "납을 금으로 바꾸듯, 고통을 힘으로 바꿉니다."
// ============================================
export const AWAKENING_PHASE_3: Record<string, AwakeningMode> = {
    'ms_brain_rewire': {
        title: "🧠 뇌 회로 재배선 (Rewiring)",
        subtitle: "생각을 바꾸는 게 아니라, 뇌를 바꿉니다.",
        core_concept: "당신의 뇌는 가소성(Plasticity)이 있습니다. 부정적인 운명 패턴을 반복하게 만드는 **'오래된 신경망'**을 끊고, 행운을 부르는 **'새로운 회로'**를 깝니다.",
        saju_analysis_guide: "인지행동코칭(CBT) 원리를 적용하여 부정적인 사주 특성을 재해석하세요 (예: 고집 -> 끈기)."
    },
    'ms_timeline_connect': {
        title: "⏳ 타임라인 접속: 미래의 나",
        subtitle: "미래의 내가 보내는 신호",
        core_concept: "시간은 일직선으로 흐르지 않습니다. 당신의 가장 빛나는 미래, **'용신(Yongsin)이 만개한 시점'**의 내가 지금의 나에게 보내는 편지를 받아보세요.",
        saju_analysis_guide: "최고의 '대운(Daewoon)' 시나리오를 시각화하고, 그 미래의 자아가 보내는 편지 형식을 취하세요."
    },
    'ms_shadow_dance': {
        title: "🌑 나의 그림자와 춤추기 (Shadow Dance)",
        subtitle: "단점을 숨기지 말고 무대 위로 올리세요.",
        core_concept: "그림자를 억누르면 괴물이 되지만, 빛을 비추면 예술이 됩니다. 당신의 가장 어두운 **'트라우마'**가 사실은 당신을 구해줄 **'가장 강력한 무기'**임을 증명합니다.",
        saju_analysis_guide: "'충(Clash)'과 '원진(Resentment)' 살에 융의 그림자 작업(Shadow Work)을 적용하여 분석하세요."
    },
    'ms_wu_wei': {
        title: "🌊 무위(Wu-Wei)의 흐름 타기",
        subtitle: "애쓰지 않고 이루는 법",
        core_concept: "가장 쉬운 성공은 **'흐름(Flow)'**을 타는 것입니다. 당신의 사주에서 물이 흐르는 대로, **'최소 저항 경로'**를 찾아 가장 쉽게 성취하는 길을 안내합니다.",
        saju_analysis_guide: "'식상(Output)'의 흐름을 파악하세요. 억지스럽지 않고 자연스럽게 풀리는 행동(Flow)을 추천해주세요."
    }
    // ... Add more items
};

// ============================================
// Phase 4: 👁️ 메타 뷰 (Meta View) - 73~90
// "체스 말에서 체스를 두는 사람으로 이동합니다."
// ============================================
export const AWAKENING_PHASE_4: Record<string, AwakeningMode> = {
    'ms_sky_view': {
        title: "☁️ 생각의 하늘 높이 날기",
        subtitle: "내 생각은 내가 아닙니다.",
        core_concept: "당신은 구름(생각)이 아니라 **'하늘(관찰자)'**입니다. 폭풍우가 몰아쳐도 하늘은 젖지 않습니다. 이 절대적인 **'평온의 자리'**로 당신을 안내합니다.",
        saju_analysis_guide: "'인성(Resource)' 오행을 활용한 마음챙김 명상: 생각에서 한 발짝 떨어져 관조하도록 유도하세요."
    },
    'ms_mute_hater': {
        title: "🎧 내면의 악플러 음소거",
        subtitle: "그 목소리는 당신의 것이 아닙니다.",
        core_concept: "머릿속에서 끊임없이 잔소리하는 **'내면의 비평가(Inner Critic)'**. 그것은 부모나 사회가 심어놓은 **'가짜 목소리(편관)'**입니다. 이제 그 스위치를 끄세요.",
        saju_analysis_guide: "'편관(Seven Killings)'의 스트레스성 목소리를 식별하고, 이를 침묵시키는(Mute) 기법을 제공하세요."
    },
    'ms_cosmos_login': {
        title: "🌌 우주적 자아 접속 (Log on)",
        subtitle: "나는 우주의 일부가 아니라, 우주 그 자체입니다.",
        core_concept: "당신의 몸은 별의 먼지로 만들어졌습니다. 작은 자아(Ego)의 감옥을 탈출해, 무한한 **'우주적 의식(Big Mind)'**과 하나가 되는 **'절정 체험'**을 선사합니다.",
        saju_analysis_guide: "'비겁(Self)'의 확장을 통한 비이원적(Non-dual) 자각 연습을 안내하세요."
    }
};

// ============================================
// Phase 5: 🏆 마스터리 (Mastery) - 91~108
// "운명의 주인이 되는 기록입니다."
// ============================================
export const AWAKENING_PHASE_5: Record<string, AwakeningMode> = {
    'ms_master_key': {
        title: "🔑 마스터 키 (Master Key) 획득",
        subtitle: "내 운명을 여는 단 하나의 열쇠",
        core_concept: "이 모든 여정의 끝에서, 당신만의 **'핵심 코드(Key)'**를 발견합니다. 이 키를 쥐는 순간, 굳게 닫혀있던 **'운명의 문'**이 저절로 열립니다.",
        saju_analysis_guide: "모든 분석을 종합하여 하나의 '핵심 키워드(예: 창조적 리더)'를 도출하세요."
    },
    'ms_shadow_hunter': {
        title: "🛡️ 쉐도우 헌터 자격 시험",
        subtitle: "어둠을 다스리는 자",
        core_concept: "이제 당신은 그림자를 두려워하지 않습니다. 자신의 나약함을 인정하고 포용하는 사람만이 진정한 **'강자'**입니다. 당신의 **'그림자 통합 레벨'**을 테스트합니다.",
        saju_analysis_guide: "'기신(약점)'을 얼마나 수용하고 있는지 평가하는 퀴즈를 제공하세요."
    },
    'ms_compose_destiny': {
        title: "🎨 내 운명 작곡하기",
        subtitle: "정해진 악보는 없습니다.",
        core_concept: "사주는 악보가 아니라 **'악기'**입니다. 어떤 연주를 할지는 당신에게 달려 있습니다. 이제 당신만의 **'인생 교향곡'**을 작곡할 차례입니다.",
        saju_analysis_guide: "창조적 미션: 새로운 삶의 테마송이나 좌우명을 작곡(작문)하게 하세요."
    }
};

// Helper for Context Injection
export const getAwakeningContext = (intent: string, sajuData: any): string => {
    // Merge all phases for lookup
    const allModes = {
        ...AWAKENING_PHASE_1,
        ...AWAKENING_PHASE_2,
        ...AWAKENING_PHASE_3,
        ...AWAKENING_PHASE_4,
        ...AWAKENING_PHASE_5
    };

    const mode = allModes[intent];

    if (!mode) return "";

    return `[AWAKENING MODE: ${mode.title}]\nSubtitle: ${mode.subtitle}\nConcept: ${mode.core_concept}\nGuide: ${mode.saju_analysis_guide}`;
};
