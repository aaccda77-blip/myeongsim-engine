// src/lib/alchemy/archetypeEngine.ts

export interface UserFlowSelections {
    step1_fear: "fear_incompetence" | "fear_loss_of_control" | "fear_rejection" | "fear_overwhelm";
    step2_persona: "inner_child" | "inner_teen" | "inner_adult";
    step3_goldValue: "val_excellence" | "val_sovereignty" | "val_connection" | "val_risk_prevention" | "val_essence";
    step4_acceptance: "acc_cognitive" | "acc_somatic" | "acc_courageous";
    step5_action: "act_micro_focus" | "act_boundary_nvc" | "act_deep_rest";
}

export interface TransmutedSuperpower {
    archetypeId: string;
    title: string;
    subTitle: string;
    emblemIcon: string;
    sovereigntyScore: number;
    shadowPattern: {
        fromDarkCode: string;
        underlyingIntention: string;
        transmutedGift: string; // 승화된 뉴럴 코드 (Neural Code)
    };
    superpowerAnalysis: {
        coreAbility: string;
        neuroMechanism: string;
        workplaceAdvantage: string;
    };
    activationProtocol: string;
    zeroPointMantra: string;
}

// 5대 핵심 아키텍처 마스터 데이터
export const ARCHETYPE_REGISTRY: Record<string, Omit<TransmutedSuperpower, "subTitle" | "sovereigntyScore">> = {
    ARCHITECT: {
        archetypeId: "ARCHITECT",
        title: "시스템 경계선 아키텍트 (System Boundary Architect)",
        emblemIcon: "🏛️",
        shadowPattern: {
            fromDarkCode: "타인의 위기까지 혼자 밤새워 떠안는 과잉 책임감",
            underlyingIntention: "내가 손을 놓으면 시스템과 관계가 무너질 것이라는 불안",
            transmutedGift: "불을 직접 끄는 소방수가 아닌, 불이 나지 않는 구조를 세우는 시스템 설계력",
        },
        superpowerAnalysis: {
            coreAbility: "경계선 설정 및 메타 프로세스 최적화",
            neuroMechanism: "과열된 배외측 전전두엽(DLPFC)을 '개별 개입'에서 '규칙 및 구조화'로 전환하여 에너지 보존",
            workplaceAdvantage: "혼자 번아웃되지 않고, 명확한 R&R(역할과 책임)을 정의하여 팀 전체의 생산성을 견인함",
        },
        activationProtocol: "남의 불을 끌 힘으로, 내 1순위 과제의 프로세스 뼈대를 세운다.",
        zeroPointMantra: "세상을 구하지 않아도 나의 주권은 온전하며 안전하다.",
    },

    PRECISION_MASTER: {
        archetypeId: "PRECISION_MASTER",
        title: "초정밀 장인 마스터 (High-Precision Master)",
        emblemIcon: "💎",
        shadowPattern: {
            fromDarkCode: "100점이 아니면 착수조차 거부하는 완벽주의 및 자책",
            underlyingIntention: "무능하고 무책임한 사람으로 낙인찍힐까 봐 발동된 방어",
            transmutedGift: "0.1%의 오차도 놓치지 않는 탁월한 심미안과 장인 수준의 완성도",
        },
        superpowerAnalysis: {
            coreAbility: "초정밀 품질 제어 및 핵심 디테일 감각",
            neuroMechanism: "시작 단계에서는 전두엽의 검열을 끄고(마이크로 시동), 후반부 수렴 단계에서 정밀 신경망을 집중 발현",
            workplaceAdvantage: "초안의 마찰을 뚫고 착수만 하면 타의 추종을 불허하는 고품질 결과물을 완성함",
        },
        activationProtocol: "30점짜리 거친 초안을 먼저 깔아두고, 후반부에 내 정밀함을 발휘한다.",
        zeroPointMantra: "서툰 착수가 완벽한 공상보다 천 배 더 위대하다.",
    },

    STRATEGIC_SAFEGUARD: {
        archetypeId: "STRATEGIC_SAFEGUARD",
        title: "전략적 위험 방어 아키텍트 (Strategic Risk Safeguard)",
        emblemIcon: "🛡️",
        shadowPattern: {
            fromDarkCode: "모든 변수를 틀어쥐려다 신경계가 과열되는 통제 강박",
            underlyingIntention: "예측하지 못한 변수로 삶이 통제 불능에 빠지는 것에 대한 공포",
            transmutedGift: "잠재적 위기를 선제 감지하고 완벽한 Plan B를 구축하는 리스크 헷징력",
        },
        superpowerAnalysis: {
            coreAbility: "선제적 리스크 헤징 및 위기 관리 아키텍처 구축",
            neuroMechanism: "편도체의 과잉 경보 에너지를 '선제적 프로토콜 1줄 문서화'로 즉각 변환하여 안정화",
            workplaceAdvantage: "위기 상황에서도 당황하지 않고 조직이 의지할 수 있는 안전 매뉴얼을 제시함",
        },
        activationProtocol: "걱정에 에너지를 쓰지 않고, 3분 안에 선제적 Plan B 1줄로 고정한다.",
        zeroPointMantra: "통제하려 애쓰지 않아도, 나는 어떤 파도든 탈 준비가 되어 있다.",
    },

    DEEP_INNOVATOR: {
        archetypeId: "DEEP_INNOVATOR",
        title: "심층 본질 혁신가 (Deep Incubation Innovator)",
        emblemIcon: "🔮",
        shadowPattern: {
            fromDarkCode: "막막함에 압도되어 딴짓을 하거나 도망치는 회피/미루기",
            underlyingIntention: "과부하된 뇌가 에너지를 긴급 보존하기 위해 발동한 셧다운",
            transmutedGift: "복잡한 문제의 본질을 꿰뚫고 무의식적 숙성을 통해 해법을 찾아내는 직관력",
        },
        superpowerAnalysis: {
            coreAbility: "본질 직관 및 비선형적 패러다임 전환",
            neuroMechanism: "디폴트 모드 네트워크(DMN)의 무의식적 연결망을 활용해 기존 틀을 깨는 혁신 아이디어 창출",
            workplaceAdvantage: "남들이 보지 못하는 사각지대를 직관적으로 포착하여 새로운 해법을 제시함",
        },
        activationProtocol: "10분 마이크로 시동만 걸어두고, 나머지 숙성은 뇌의 무의식 처리에 맡긴다.",
        zeroPointMantra: "쉼과 숙성 또한 창조의 가장 강력한 한 부분이다.",
    },

    EMPATHY_CATALYST: {
        archetypeId: "EMPATHY_CATALYST",
        title: "공감 임파워먼트 촉진가 (Empathy Catalyst)",
        emblemIcon: "🌿",
        shadowPattern: {
            fromDarkCode: "거절하지 못해 남의 감정 쓰레기통 역할을 자처하는 소진형 공감",
            underlyingIntention: "관계가 단절되거나 미움받을까 봐 나를 희생하는 방어",
            transmutedGift: "나를 소진시키지 않으면서 타인의 잠재력을 깨우는 성숙한 임파워먼트",
        },
        superpowerAnalysis: {
            coreAbility: "심리적 안전지대 구축 및 동기 부여 리더십",
            neuroMechanism: "거울신경세포(Mirror Neurons)의 공감 능력을 타인 '구원'이 아닌 '경청과 자립 유도'로 환류",
            workplaceAdvantage: "타인의 자립심을 해치지 않고 스스로 답을 찾도록 돕는 진정한 멘토 역할을 수행함",
        },
        activationProtocol: "남의 짐을 대신 들지 않고, 스스로 들 수 있도록 따뜻한 질문 1개를 던진다.",
        zeroPointMantra: "내가 온전해야 내가 사랑하는 사람들도 온전해진다.",
    },
};

export function calculateArchetypeAndStrengths(selections: Partial<UserFlowSelections>): TransmutedSuperpower {
    // 1. 핵심 아키텍처 결정 (Step 3 황금 가치 우선, Step 1 기저 공포 보조)
    let targetKey = "ARCHITECT";

    switch (selections.step3_goldValue) {
        case "val_excellence":
            targetKey = "PRECISION_MASTER";
            break;
        case "val_sovereignty":
            targetKey = selections.step1_fear === "fear_loss_of_control" ? "STRATEGIC_SAFEGUARD" : "ARCHITECT";
            break;
        case "val_risk_prevention":
            targetKey = "STRATEGIC_SAFEGUARD";
            break;
        case "val_essence":
            targetKey = "DEEP_INNOVATOR";
            break;
        case "val_connection":
            targetKey = selections.step1_fear === "fear_rejection" ? "EMPATHY_CATALYST" : "ARCHITECT";
            break;
        default:
            targetKey = "ARCHITECT";
    }

    const base = ARCHETYPE_REGISTRY[targetKey];

    // 2. Step 2 (내면 페르소나)에 따른 수식어(Tone Subtitle) 결정
    let subTitle = "책임의 무게를 시스템으로 승화시킨 개척자";
    switch (selections.step2_persona) {
        case "inner_child":
            subTitle = "순수한 열정을 되찾은 창조적 마스터";
            break;
        case "inner_teen":
            subTitle = "책임의 무게를 시스템으로 승화시킨 개척자";
            break;
        case "inner_adult":
            subTitle = "냉철한 자기 주권을 확립한 시스템 리더";
            break;
    }

    // 3. Step 4(수용성) + Step 5(실행성) 기반의 자기 주권 점수 산출
    let score = 78; // 베이스라인
    if (selections.step4_acceptance === "acc_somatic") score += 10;
    if (selections.step4_acceptance === "acc_courageous") score += 12;
    if (selections.step4_acceptance === "acc_cognitive") score += 8;

    if (selections.step5_action === "act_micro_focus") score += 10;
    if (selections.step5_action === "act_boundary_nvc") score += 13;
    if (selections.step5_action === "act_deep_rest") score += 10;

    return {
        ...base,
        subTitle,
        sovereigntyScore: Math.min(score, 100),
    };
}
