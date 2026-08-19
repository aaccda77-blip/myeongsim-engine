// src/lib/engine/sajuAlchemyFusion.ts

export interface SajuTenGodsScore {
    gwan: number;   // 관성 점수 (0 ~ 100)
    sik: number;    // 식상 점수 (0 ~ 100)
    jae: number;    // 재성 점수 (0 ~ 100)
    in: number;     // 인성 점수 (0 ~ 100)
    bi: number;     // 비겁 점수 (0 ~ 100)
}

export interface FusionResult {
    sajuDominantGod: string;
    matchedArchetypeId: string;
    archetypeTitle: string;
    personalizedDiagnosis: string;
    actionProtocol: string;
    myungsimMantra: string;
    scores: SajuTenGodsScore;
    dayMaster: string;
}

// 오행 매핑
const ELEMENT_MAP: Record<string, 'WOOD' | 'FIRE' | 'EARTH' | 'METAL' | 'WATER'> = {
    '甲': 'WOOD', '갑': 'WOOD', '乙': 'WOOD', '을': 'WOOD', '寅': 'WOOD', '인': 'WOOD', '卯': 'WOOD', '묘': 'WOOD',
    '丙': 'FIRE', '병': 'FIRE', '丁': 'FIRE', '정': 'FIRE', '巳': 'FIRE', '사': 'FIRE', '午': 'FIRE', '오': 'FIRE',
    '戊': 'EARTH', '무': 'EARTH', '己': 'EARTH', '기': 'EARTH', '辰': 'EARTH', '진': 'EARTH', '戌': 'EARTH', '술': 'EARTH', '丑': 'EARTH', '축': 'EARTH', '未': 'EARTH', '미': 'EARTH',
    '庚': 'METAL', '경': 'METAL', '辛': 'METAL', '신': 'METAL', '申': 'METAL', '酉': 'METAL', '유': 'METAL',
    '壬': 'WATER', '임': 'WATER', '癸': 'WATER', '계': 'WATER', '亥': 'WATER', '해': 'WATER', '子': 'WATER', '자': 'WATER',
};

// 십신 관계 판정 (나 vs 대상)
function getTenGodRelation(me: string, target: string): 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN' {
    const meEl = ELEMENT_MAP[me] || 'METAL';
    const targetEl = ELEMENT_MAP[target] || 'EARTH';

    if (meEl === targetEl) return 'BI'; // 비겁

    const GENERATES: Record<string, string> = { WOOD: 'FIRE', FIRE: 'EARTH', EARTH: 'METAL', METAL: 'WATER', WATER: 'WOOD' };
    const OVERCOMES: Record<string, string> = { WOOD: 'EARTH', EARTH: 'WATER', WATER: 'FIRE', FIRE: 'METAL', METAL: 'WOOD' };

    if (GENERATES[meEl] === targetEl) return 'SIK'; // 내가 생함: 식상
    if (OVERCOMES[meEl] === targetEl) return 'JAE'; // 내가 극함: 재성
    if (GENERATES[targetEl] === meEl) return 'IN';  // 나를 생함: 인성
    if (OVERCOMES[targetEl] === meEl) return 'GWAN';// 나를 극함: 관성

    return 'GWAN';
}

// 사주 8글자 간지에서 5대 십신 점수 동적 계산
export function extractTenGodsScoresFromGanji(sajuGanji: string, dayMaster: string): SajuTenGodsScore {
    const raw = sajuGanji || '';
    const dm = dayMaster || '辛';

    const scores: SajuTenGodsScore = { gwan: 20, sik: 20, jae: 20, in: 20, bi: 20 };

    for (const char of raw) {
        if (ELEMENT_MAP[char]) {
            const rel = getTenGodRelation(dm, char);
            if (rel === 'GWAN') scores.gwan += 18;
            else if (rel === 'SIK') scores.sik += 18;
            else if (rel === 'JAE') scores.jae += 18;
            else if (rel === 'IN') scores.in += 18;
            else if (rel === 'BI') scores.bi += 18;
        }
    }

    // 월지/일지 가중치 부여 (미/사/신/유 등)
    if (raw.includes('미') || raw.includes('술') || raw.includes('축') || raw.includes('진')) {
        const rel = getTenGodRelation(dm, '未');
        scores[rel.toLowerCase() as keyof SajuTenGodsScore] += 12;
    }
    if (raw.includes('사') || raw.includes('오')) {
        const rel = getTenGodRelation(dm, '巳');
        scores[rel.toLowerCase() as keyof SajuTenGodsScore] += 12;
    }
    if (raw.includes('신') || raw.includes('유')) {
        const rel = getTenGodRelation(dm, '申');
        scores[rel.toLowerCase() as keyof SajuTenGodsScore] += 12;
    }

    return scores;
}

export function calculateSajuAlchemyFusion(params: {
    sajuGanji?: string;
    dayMaster?: string;
    sajuScores?: Partial<SajuTenGodsScore>;
    userSelectedShadow?: string;
}): FusionResult {
    const dm = params.dayMaster || '辛';
    const ganji = params.sajuGanji || '';
    
    // 사주 8글자가 있으면 동적으로 십신 점수 산출
    const calculatedScores = ganji ? extractTenGodsScoresFromGanji(ganji, dm) : {
        gwan: params.sajuScores?.gwan ?? 85,
        sik: params.sajuScores?.sik ?? 60,
        jae: params.sajuScores?.jae ?? 70,
        in: params.sajuScores?.in ?? 75,
        bi: params.sajuScores?.bi ?? 65,
    };

    // 1. 사주 원국에서 가장 강한 십신 기운 추출
    const gods = [
        { key: "GWAN", name: "관성(官星)", score: calculatedScores.gwan, archetype: "ARCHITECT" },
        { key: "SIK", name: "식상(食傷)", score: calculatedScores.sik, archetype: "PRECISION_MASTER" },
        { key: "JAE", name: "재성(財星)", score: calculatedScores.jae, archetype: "STRATEGIC_SAFEGUARD" },
        { key: "IN", name: "인성(印星)", score: calculatedScores.in, archetype: "DEEP_INNOVATOR" },
        { key: "BI", name: "비겁(比劫)", score: calculatedScores.bi, archetype: "EMPATHY_CATALYST" },
    ];

    gods.sort((a, b) => b.score - a.score);
    const dominant = gods[0];

    // 2. 사주 십신과 현대 심리학 아키타입 융합 매핑
    const FUSION_MAP: Record<string, { title: string; diagnosis: string; protocol: string; mantra: string }> = {
        ARCHITECT: {
            title: "사주 관성격(官星格) × 시스템 경계선 아키텍트",
            diagnosis: "타고난 관(官)의 강한 규율과 책임감이 '내가 다 떠안아야 한다'는 과잉 책임·구원자 그림자로 작동하고 있었습니다. 이제 남의 불을 끄는 소방수에서, 배외측 전전두엽(DLPFC)을 가동해 '불이 나지 않는 R&R과 프로세스 뼈대'를 세우는 시스템 아키텍트로 주권을 확립합니다.",
            protocol: "남의 문제를 대신 처리하지 않고, 타인이 스스로 완수할 수 있는 '프로세스의 뼈대'만 넘겨준다.",
            mantra: "세상을 구하지 않아도 내 존재의 주권은 온전하고 안전하다.",
        },
        PRECISION_MASTER: {
            title: "사주 식상격(食傷格) × 초정밀 장인 마스터",
            diagnosis: "식상(食傷)의 탁월한 표현욕과 비판적 감각이 '100점이 아니면 다 쓰레기다'라는 비타협적 완벽주의로 변질되어 있었습니다. 시작의 인지 검열을 끄고(10분 시동), 마감 직전에 식상 특유의 '0.1% 오차를 제어하는 장인정신'을 폭발시킵니다.",
            protocol: "시작할 때는 30점짜리 거친 초안을 깔아두고, 마감 직전 10분에 내 정밀함을 쏟아붓는다.",
            mantra: "서툰 10분의 착수가 완벽한 백일몽보다 천 배 더 위대하다.",
        },
        STRATEGIC_SAFEGUARD: {
            title: "사주 재성격(財星格) × 전략적 위험 방어 아키텍트",
            diagnosis: "재성(財星)의 결과 도출 및 환경 통제 본능이 '상황을 틀어쥐지 못하면 망한다'는 통제 강박과 만성적 교감신경 긴장을 불렀습니다. 모든 것을 통제하려는 소모전을 멈추고, '선제적 Plan B 헷징력'으로 신경계를 보호합니다.",
            protocol: "통제하려 애쓰는 대신, 최악의 시나리오를 방어할 'Plan B 매뉴얼 1줄'만 작성하고 즉시 손을 뗀다.",
            mantra: "모든 것을 통제하지 않아도, 나는 어떤 흐름이든 탈 준비가 되어 있다.",
        },
        DEEP_INNOVATOR: {
            title: "사주 인성격(印星格) × 심층 본질 혁신가",
            diagnosis: "인성(印星)의 깊은 사유와 직관 에너지가 행동을 지연시키는 '생각 과잉(Overthinking)'과 회피형 미루기에 갇혀 있었습니다. 미루기를 게으름이 아닌 'DMN 무의식적 아이디어 숙성'으로 전환하여 10분 마이크로 시동으로 혁신을 완성합니다.",
            protocol: "완벽한 계획을 세우려 하지 말고 10분만 마이크로 착수한 뒤, 뇌의 무의식 처리에 나머지를 맡긴다.",
            mantra: "깊은 쉼과 무의식적 숙성 또한 창조의 가장 강력한 한 축이다.",
        },
        EMPATHY_CATALYST: {
            title: "사주 비겁격(比劫格) × 공감 임파워먼트 촉진가",
            diagnosis: "비겁(比劫)의 강한 연대감과 동질감이 타인의 감정에 과도하게 동조되어 함께 침몰하는 '소진형 공감'을 유발했습니다. 남의 짐을 대신 드는 대신, '단단한 주권을 유지하며 상대의 자립을 깨우는 임파워먼트 멘토'로 거듭납니다.",
            protocol: "남의 고통에 뛰어들지 않고, 따뜻한 경청과 질문 1개로 상대 스스로 답을 찾게 돕는다.",
            mantra: "내가 온전한 중심을 지킬 때, 내 주변의 사람들도 온전해진다.",
        },
    };

    const info = FUSION_MAP[dominant.archetype];

    return {
        sajuDominantGod: dominant.name,
        matchedArchetypeId: dominant.archetype,
        archetypeTitle: info.title,
        personalizedDiagnosis: info.diagnosis,
        actionProtocol: info.protocol,
        myungsimMantra: info.mantra,
        scores: calculatedScores,
        dayMaster: dm
    };
}

