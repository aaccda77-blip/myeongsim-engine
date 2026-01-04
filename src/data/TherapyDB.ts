/**
 * 통합 심리 치유 아키타입 데이터베이스 (Integrated Therapy Archetypes DB)
 * 
 * 4대 심리 기법을 사용자 성향(Gene Key/오행)에 따라 자동 매칭:
 * - CBT (인지행동치료): 생각 교정
 * - DBT (변증법적 행동치료): 감정 조절
 * - ACT (수용전념치료): 수용과 행동
 * - MBCT (마음챙김 인지치료): 알아차림
 */

export type TherapyType = 'CBT' | 'DBT' | 'ACT' | 'MBCT';

export interface DarkCode {
    trigger: string;      // 트리거 상황
    thought: string;      // 자동 사고
    emotion: string;      // 주요 감정
    bodySignal?: string;  // 신체 반응
}

export interface NeuralCode {
    method: string;       // 기법 이름
    action: string;       // 구체적 행동 지시
    duration?: string;    // 권장 시간
    intensity: 'gentle' | 'moderate' | 'intensive';
}

export interface MetaCode {
    state: string;        // 메타 상태
    desc: string;         // 설명
    awareness_question: string; // 알아차림의 알아차림 질문
}

export interface TherapyArchetype {
    id: string;
    name: string;
    name_ko: string;
    related_gene_keys: number[];
    related_ohaeng: ('목' | '화' | '토' | '금' | '수')[];
    therapy_type: TherapyType;
    dark_code: DarkCode;
    neural_code: NeuralCode;
    meta_code: MetaCode;
    affirmation: string;  // 자기 확언
}

export const THERAPY_ARCHETYPES: Record<string, TherapyArchetype> = {
    // =========================================================================
    // [ACT 처방형] - 회피/억압/통제 성향
    // "싸우지 말고 수용하라"
    // =========================================================================
    "ARCH_ACT_CONTROLLER": {
        id: "type_controller_act",
        name: "The Controller",
        name_ko: "통제자",
        related_gene_keys: [21, 45, 26],
        related_ohaeng: ['금', '토'],
        therapy_type: "ACT",
        dark_code: {
            trigger: "내 뜻대로 안 될 때",
            thought: "내가 이걸 잡지 않으면 다 망해!",
            emotion: "분노, 불안",
            bodySignal: "어깨 긴장, 턱 악물림"
        },
        neural_code: {
            method: "Creative Hopelessness (창조적 절망)",
            action: "통제하려는 노력이 오히려 당신을 힘들게 한다는 걸 인정하세요. 꽉 쥔 주먹을 펴고, 파도에 몸을 맡기듯 상황을 '허용'해보세요. 30초간 손바닥을 펴고 '놓아버린다'를 속으로 반복하세요.",
            duration: "30초",
            intensity: "gentle"
        },
        meta_code: {
            state: "Meta-Awareness (주시자)",
            awareness_question: "지금 '통제하려는 나'를 바라보고 있는 그 존재는 누구입니까?",
            desc: "통제하려는 나를 그저 바라보는 '큰 나'로 머무르세요."
        },
        affirmation: "나는 흐름을 신뢰합니다. 내려놓음 속에서 진정한 힘을 찾습니다."
    },

    "ARCH_ACT_AVOIDER": {
        id: "type_avoider_act",
        name: "The Avoider",
        name_ko: "회피자",
        related_gene_keys: [12, 33, 56],
        related_ohaeng: ['수', '금'],
        therapy_type: "ACT",
        dark_code: {
            trigger: "불편한 상황이 다가올 때",
            thought: "이건 나중에 생각하자. 지금은 못 해.",
            emotion: "두려움, 무력감",
            bodySignal: "가슴 답답함, 몸이 움츠러듦"
        },
        neural_code: {
            method: "Expansion & Willingness (확장과 기꺼이함)",
            action: "이 감정을 밀어내지 마세요. 오히려 '기꺼이' 경험해보겠다고 선언하세요. 불편함이 몸 어디에 있는지 찾아 그 부위에 손을 얹고 숨을 불어넣으세요.",
            duration: "1분",
            intensity: "moderate"
        },
        meta_code: {
            state: "The Observing Self (관찰하는 자아)",
            awareness_question: "두려워하는 이 '나'를 지켜보는 더 넓은 '나'는 어디 있습니까?",
            desc: "감정은 파도이고, 당신은 바다입니다."
        },
        affirmation: "나는 불편함과 함께 걸어갈 용기가 있습니다."
    },

    // =========================================================================
    // [DBT 처방형] - 감정 기복이 심한 성향
    // "감정을 견디고 조절하라"
    // =========================================================================
    "ARCH_DBT_CHALLENGER": {
        id: "type_challenger_dbt",
        name: "The Challenger",
        name_ko: "도전자",
        related_gene_keys: [39, 51, 55],
        related_ohaeng: ['화', '목'],
        therapy_type: "DBT",
        dark_code: {
            trigger: "무시당했다고 느낄 때",
            thought: "감히 나를 건드려? 가만 안 둬!",
            emotion: "분노, 적개심",
            bodySignal: "심박수 상승, 얼굴 달아오름"
        },
        neural_code: {
            method: "TIPP Skill (체온 조절)",
            action: "생각하지 마세요. 지금 당장 찬물로 얼굴을 적시거나, 얼음을 손에 쥐세요. 체온을 낮춰야 뇌의 감정 센터가 진정됩니다.",
            duration: "30초~1분",
            intensity: "intensive"
        },
        meta_code: {
            state: "Wise Mind (지혜로운 마음)",
            awareness_question: "이 '화난 나'를 보고 있는 고요한 존재는 누구입니까?",
            desc: "이성과 감정이 균형을 이룬 중심점으로 돌아오세요."
        },
        affirmation: "나의 힘은 반응이 아닌 선택에서 나옵니다."
    },

    "ARCH_DBT_PERFECTIONIST": {
        id: "type_perfectionist_dbt",
        name: "The Perfectionist",
        name_ko: "완벽주의자",
        related_gene_keys: [18, 48, 16],
        related_ohaeng: ['금', '목'],
        therapy_type: "DBT",
        dark_code: {
            trigger: "실수를 했거나 기준에 못 미칠 때",
            thought: "왜 이것도 못해? 난 쓸모없어.",
            emotion: "수치심, 자기혐오",
            bodySignal: "가슴 조임, 목 막힘"
        },
        neural_code: {
            method: "Opposite Action (반대 행동)",
            action: "지금 숨고 싶은 충동이 드시죠? 정반대로 하세요. 고개를 들고, 어깨를 펴고, 거울을 보며 '나는 충분하다'고 말하세요.",
            duration: "1분",
            intensity: "moderate"
        },
        meta_code: {
            state: "Radical Acceptance (근본적 수용)",
            awareness_question: "자신을 비난하는 그 '목소리'를 듣고 있는 당신은 누구입니까?",
            desc: "완벽하지 않아도 사랑받을 가치가 있습니다."
        },
        affirmation: "나는 진행 중인 작품입니다. 완성이 아닌 성장이 목표입니다."
    },

    "ARCH_DBT_SENSITIVE": {
        id: "type_sensitive_dbt",
        name: "The Empath",
        name_ko: "감성인",
        related_gene_keys: [19, 49, 55],
        related_ohaeng: ['수', '화'],
        therapy_type: "DBT",
        dark_code: {
            trigger: "타인의 감정에 압도될 때",
            thought: "왜 나만 이렇게 많이 느끼지? 견딜 수가 없어.",
            emotion: "압도감, 슬픔",
            bodySignal: "눈물, 가슴 먹먹함"
        },
        neural_code: {
            method: "Self-Soothe (자기 위로)",
            action: "다섯 감각으로 자신을 달래세요. 따뜻한 차 한 잔, 부드러운 담요, 좋아하는 향기. 지금 당장 자신에게 친절한 한 가지를 해주세요.",
            duration: "5분",
            intensity: "gentle"
        },
        meta_code: {
            state: "Boundless Compassion (무한 자비)",
            awareness_question: "이 모든 감정을 품고 있는 더 넓은 공간은 무엇입니까?",
            desc: "감정은 당신을 통과하는 것이지, 당신이 아닙니다."
        },
        affirmation: "나의 민감함은 약점이 아니라 깊이입니다."
    },

    // =========================================================================
    // [MBCT 처방형] - 생각이 꼬리를 무는 성향
    // "생각에서 빠져나와라"
    // =========================================================================
    "ARCH_MBCT_WORRIER": {
        id: "type_worrier_mbct",
        name: "The Worrier",
        name_ko: "걱정인",
        related_gene_keys: [61, 63, 64],
        related_ohaeng: ['금', '수'],
        therapy_type: "MBCT",
        dark_code: {
            trigger: "미래가 불확실할 때",
            thought: "만약에 안 되면 어떡하지? 큰일이야.",
            emotion: "불안, 초조",
            bodySignal: "위장 불편, 손발 저림"
        },
        neural_code: {
            method: "Grounding 5-4-3-2-1",
            action: "지금 이 순간으로 돌아오세요. 보이는 것 5가지, 들리는 것 4가지, 만져지는 것 3가지, 냄새 2가지, 맛 1가지를 찾으세요.",
            duration: "2분",
            intensity: "gentle"
        },
        meta_code: {
            state: "Pure Presence (순수 현존)",
            awareness_question: "생각하고 있는 '나'를 알아차리고 있는 그 '앎'은 무엇입니까?",
            desc: "생각은 구름이고, 당신은 하늘입니다."
        },
        affirmation: "지금 이 순간, 나는 안전합니다."
    },

    "ARCH_MBCT_OVERTHINKER": {
        id: "type_overthinker_mbct",
        name: "The Analyzer",
        name_ko: "분석가",
        related_gene_keys: [17, 43, 62],
        related_ohaeng: ['목', '금'],
        therapy_type: "MBCT",
        dark_code: {
            trigger: "결정을 내려야 할 때",
            thought: "더 분석해야 해. 아직 정보가 부족해.",
            emotion: "혼란, 마비",
            bodySignal: "두통, 피로"
        },
        neural_code: {
            method: "Body Scan (바디 스캔)",
            action: "머리에서 내려오세요. 발바닥이 땅에 닿아있는 감각에 1분간 집중하세요. 생각이 떠오르면 그냥 '생각이 떠오르네'하고 다시 발로 돌아오세요.",
            duration: "3분",
            intensity: "gentle"
        },
        meta_code: {
            state: "Stillness Beyond Thought (생각 너머의 고요)",
            awareness_question: "분석하는 마음을 관찰하고 있는 그 '고요함'은 어디에 있습니까?",
            desc: "답은 생각 밖에 있습니다."
        },
        affirmation: "나는 충분히 알고 있습니다. 지금 행동할 준비가 되었습니다."
    },

    "ARCH_MBCT_RUMINATOR": {
        id: "type_ruminator_mbct",
        name: "The Ruminator",
        name_ko: "반추자",
        related_gene_keys: [36, 47, 6],
        related_ohaeng: ['수', '화'],
        therapy_type: "MBCT",
        dark_code: {
            trigger: "과거의 일이 떠오를 때",
            thought: "그때 왜 그랬을까... 다르게 했어야 했는데.",
            emotion: "후회, 우울",
            bodySignal: "전신 무력감, 어깨 처짐"
        },
        neural_code: {
            method: "Leaves on a Stream (나뭇잎 명상)",
            action: "눈을 감고 시냇물을 상상하세요. 떠오르는 생각을 나뭇잎에 올려 물에 띄워 보내세요. 생각과 싸우지 말고 그냥 보내주세요.",
            duration: "5분",
            intensity: "gentle"
        },
        meta_code: {
            state: "Eternal Now (영원한 현재)",
            awareness_question: "과거를 기억하는 이 '기억'은 어디에서 일어나고 있습니까? 지금 여기 아닙니까?",
            desc: "과거는 생각 속에만 존재합니다. 진짜 존재하는 것은 지금뿐입니다."
        },
        affirmation: "나는 과거를 놓아주고, 현재에 머무릅니다."
    },

    // =========================================================================
    // [CBT 처방형] - 인지 왜곡이 심한 성향
    // "생각을 교정하라"
    // =========================================================================
    "ARCH_CBT_CATASTROPHIZER": {
        id: "type_catastrophizer_cbt",
        name: "The Catastrophizer",
        name_ko: "파국화자",
        related_gene_keys: [36, 18, 28],
        related_ohaeng: ['화', '수'],
        therapy_type: "CBT",
        dark_code: {
            trigger: "작은 문제가 생겼을 때",
            thought: "이건 재앙이야! 모든 게 끝났어!",
            emotion: "공포, 절망",
            bodySignal: "심장 두근거림, 과호흡"
        },
        neural_code: {
            method: "Decatastrophizing (탈파국화)",
            action: "질문하세요: '최악의 시나리오는 뭐지? 그게 정말 일어날 확률은? 일어나도 살아남을 수 있을까?' 대부분 'Yes'입니다.",
            duration: "2분",
            intensity: "moderate"
        },
        meta_code: {
            state: "The Witness (목격자)",
            awareness_question: "두려워하는 이 '나'를 지켜보고 있는 평온한 존재는 누구입니까?",
            desc: "당신은 폭풍이 아니라 폭풍을 보는 하늘입니다."
        },
        affirmation: "나는 이전에도 어려움을 극복했고, 지금도 할 수 있습니다."
    },

    "ARCH_CBT_MIND_READER": {
        id: "type_mindreader_cbt",
        name: "The Mind Reader",
        name_ko: "독심술사",
        related_gene_keys: [13, 19, 44],
        related_ohaeng: ['화', '목'],
        therapy_type: "CBT",
        dark_code: {
            trigger: "타인의 반응이 애매할 때",
            thought: "저 사람 분명 나를 싫어해. 표정이 그래.",
            emotion: "불안, 피해의식",
            bodySignal: "목 조임, 시선 회피"
        },
        neural_code: {
            method: "Evidence Testing (증거 검증)",
            action: "잠깐! 그 생각을 법정에 세우세요. '그 사람이 나를 싫어한다'는 증거는? 반대 증거는? 대부분 당신이 만들어낸 가정입니다.",
            duration: "2분",
            intensity: "moderate"
        },
        meta_code: {
            state: "Clear Seeing (명료한 봄)",
            awareness_question: "해석하는 이 '마음'을 바라보는 더 넓은 '앎'은 무엇입니까?",
            desc: "해석은 사실이 아닙니다."
        },
        affirmation: "나는 가정이 아닌 사실에 기반해 판단합니다."
    }
};

// =========================================================================
// 사용자 성향에 따른 치료 기법 매칭 엔진
// =========================================================================

export interface UserProfile {
    dominantOhaeng?: ('목' | '화' | '토' | '금' | '수')[];
    geneKeys?: number[];
    userType?: 'emotional' | 'cognitive' | 'instinctive';
}

/**
 * 사용자 프로필에 맞는 치료 아키타입 찾기
 */
export function findTherapyArchetype(profile: UserProfile): TherapyArchetype[] {
    const results: TherapyArchetype[] = [];

    for (const archetype of Object.values(THERAPY_ARCHETYPES)) {
        let score = 0;

        // 오행 매칭
        if (profile.dominantOhaeng) {
            const ohaengMatch = profile.dominantOhaeng.filter(
                o => archetype.related_ohaeng.includes(o)
            ).length;
            score += ohaengMatch * 2;
        }

        // Gene Key 매칭
        if (profile.geneKeys) {
            const geneMatch = profile.geneKeys.filter(
                g => archetype.related_gene_keys.includes(g)
            ).length;
            score += geneMatch * 3;
        }

        // 사용자 유형 매칭
        if (profile.userType) {
            const typeMapping: Record<string, TherapyType[]> = {
                'emotional': ['DBT', 'ACT'],
                'cognitive': ['CBT', 'MBCT'],
                'instinctive': ['ACT', 'DBT']
            };
            if (typeMapping[profile.userType]?.includes(archetype.therapy_type)) {
                score += 2;
            }
        }

        if (score > 0) {
            results.push({ ...archetype, _matchScore: score } as any);
        }
    }

    // 점수순 정렬
    return results.sort((a: any, b: any) => b._matchScore - a._matchScore);
}

/**
 * 감정 유형에 따른 추천 치료법
 */
export function getTherapyByEmotion(emotion: string): TherapyArchetype[] {
    const emotionMap: Record<string, string[]> = {
        '분노': ['ARCH_DBT_CHALLENGER', 'ARCH_ACT_CONTROLLER'],
        '불안': ['ARCH_MBCT_WORRIER', 'ARCH_CBT_CATASTROPHIZER'],
        '우울': ['ARCH_MBCT_RUMINATOR', 'ARCH_ACT_AVOIDER'],
        '수치심': ['ARCH_DBT_PERFECTIONIST', 'ARCH_ACT_AVOIDER'],
        '두려움': ['ARCH_ACT_AVOIDER', 'ARCH_MBCT_WORRIER'],
        '압도감': ['ARCH_DBT_SENSITIVE', 'ARCH_MBCT_OVERTHINKER']
    };

    const keys = emotionMap[emotion] || [];
    return keys.map(key => THERAPY_ARCHETYPES[key]).filter(Boolean);
}

// =========================================================================
// Meta-Awareness 질문 (The Pause) 공통
// =========================================================================

export const META_AWARENESS_QUESTIONS = [
    "지금 이 감정을 느끼고 있는 '나'를 바라보고 있는 그 존재는 누구입니까?",
    "생각이 일어나는 것을 알아차리고 있는 그 '앎' 자체는 무엇입니까?",
    "모든 경험이 일어나고 사라지는 그 '배경'은 변하지 않습니다. 그것이 당신입니다.",
    "지금 이 순간, 알아차림을 알아차리고 있습니까?",
    "감정과 생각의 주인은 누구입니까? 그것을 보고 있는 당신입니다."
];

export function getRandomMetaQuestion(): string {
    return META_AWARENESS_QUESTIONS[Math.floor(Math.random() * META_AWARENESS_QUESTIONS.length)];
}
