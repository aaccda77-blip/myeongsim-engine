/**
 * PersonalityProfiler.ts - 백그라운드 성격 프로파일링 모듈
 * 
 * 목적: 사용자가 눈치채지 못하게 대화 중 성격 데이터를 자연스럽게 수집
 * 특징:
 *  - 낚시 질문 (Contextual Hooking)
 *  - 밸런스 게임 (Scenario Simulation)
 *  - 말투 분석 (Passive Scanning)
 *  - 빅파이브 / MBTI 유사 성향 추론
 */

// ============== 타입 정의 ==============

// 빅파이브 성격 특성 (OCEAN)
export interface BigFiveTraits {
    openness: number;           // 개방성 (0-100)
    conscientiousness: number;  // 성실성 (0-100)
    extraversion: number;       // 외향성 (0-100)
    agreeableness: number;      // 우호성 (0-100)
    neuroticism: number;        // 신경성 (0-100)
}

// MBTI 유사 성향
export interface MBTILeanings {
    ei: 'E' | 'I' | null;  // 외향/내향
    sn: 'S' | 'N' | null;  // 감각/직관
    tf: 'T' | 'F' | null;  // 사고/감정
    jp: 'J' | 'P' | null;  // 판단/인식
}

export interface PersonalityProfile {
    bigFive: BigFiveTraits;
    mbtiLeanings: MBTILeanings;
    inferredType: string;       // 예: "INFP-유사"
    confidence: number;         // 신뢰도 (0-100)
    dataPoints: number;         // 수집된 데이터 포인트 수
    lastUpdated: Date;
}

export interface ProfilingQuestion {
    id: string;
    type: 'fishing' | 'balance' | 'scenario';
    question: string;
    options?: string[];
    targetTrait: keyof BigFiveTraits | keyof MBTILeanings;
    mappings: Record<string, number>;  // 응답 → 점수 매핑
}

export interface TextAnalysisResult {
    wordCount: number;
    emotionWords: number;
    logicWords: number;
    questionMarks: number;
    exclamationMarks: number;
    avgSentenceLength: number;
    inferredTraits: Partial<BigFiveTraits>;
}

// ============== 질문 데이터베이스 ==============

const PROFILING_QUESTIONS: ProfilingQuestion[] = [
    // 외향/내향 (E/I)
    {
        id: 'ei_1',
        type: 'balance',
        question: '잠깐 머리를 식혀볼까요? 🍃 만약 로또에 당첨되어 휴가를 떠난다면:\n1. 아무도 없는 조용한 숲속 오두막\n2. 화려한 크루즈 파티에서 새로운 사람들 만나기\n어느 쪽이 더 "휴식"처럼 느껴지세요?',
        options: ['1', '2'],
        targetTrait: 'ei',
        mappings: { '1': -1, '2': 1 }  // 음수=I, 양수=E
    },
    {
        id: 'ei_2',
        type: 'fishing',
        question: '주말에 주로 어떻게 에너지를 충전하세요? 사람들과 만나는 편인가요, 혼자 시간을 보내는 편인가요?',
        targetTrait: 'ei',
        mappings: { '혼자': -1, '사람': 1, '만나': 1, '집': -1 }
    },

    // 감각/직관 (S/N)
    {
        id: 'sn_1',
        type: 'balance',
        question: '문제를 해결할 때 어떤 방식이 더 편하세요?\n1. 과거 경험과 데이터를 바탕으로 검증된 방법 사용\n2. 직감을 믿고 새로운 아이디어 시도',
        options: ['1', '2'],
        targetTrait: 'sn',
        mappings: { '1': -1, '2': 1 }  // 음수=S, 양수=N
    },

    // 사고/감정 (T/F)
    {
        id: 'tf_1',
        type: 'fishing',
        question: '중요한 결정을 내릴 때, 논리와 팩트를 더 중시하시나요, 아니면 사람들의 감정과 관계를 더 고려하시나요?',
        targetTrait: 'tf',
        mappings: { '논리': -1, '팩트': -1, '감정': 1, '관계': 1, '사람': 1 }
    },

    // 판단/인식 (J/P)
    {
        id: 'jp_1',
        type: 'fishing',
        question: '일을 할 때 미리 계획을 세우고 딱딱 정해진 대로 하는 게 편하세요, 아니면 상황에 따라 유연하게 대처하는 게 편하세요?',
        targetTrait: 'jp',
        mappings: { '계획': -1, '정해': -1, '유연': 1, '상황': 1, '즉흥': 1 }
    },

    // 개방성 (Openness)
    {
        id: 'o_1',
        type: 'scenario',
        question: '새로운 음식이나 경험을 시도하는 것에 대해 어떻게 생각하세요? 설레는 편인가요, 조금 부담스러운 편인가요?',
        targetTrait: 'openness',
        mappings: { '설레': 20, '좋아': 15, '새로': 10, '부담': -10, '익숙': -15 }
    },

    // 성실성 (Conscientiousness)
    {
        id: 'c_1',
        type: 'fishing',
        question: '약속 시간에 대해 어떻게 생각하세요? 딱 맞춰 도착하는 편인가요, 아니면 여유롭게 생각하는 편인가요?',
        targetTrait: 'conscientiousness',
        mappings: { '정확': 15, '칼같': 20, '일찍': 15, '여유': -10, '늦': -15 }
    },

    // 우호성 (Agreeableness)
    {
        id: 'a_1',
        type: 'scenario',
        question: '의견 충돌이 있을 때 어떻게 하시는 편인가요? 내 주장을 강하게 밀어붙이는 편인가요, 상대방과 조율하는 편인가요?',
        targetTrait: 'agreeableness',
        mappings: { '조율': 15, '맞춰': 15, '양보': 10, '주장': -10, '밀어': -15 }
    },

    // 신경성 (Neuroticism)
    {
        id: 'n_1',
        type: 'fishing',
        question: '스트레스를 받았을 때 금방 털어내는 편인가요, 오래 생각하는 편인가요?',
        targetTrait: 'neuroticism',
        mappings: { '털어': -15, '금방': -15, '잊어': -10, '오래': 15, '생각': 10, '걱정': 15 }
    }
];

// ============== 텍스트 분석 키워드 ==============

const EMOTION_KEYWORDS = ['느끼', '감정', '슬프', '기쁘', '화나', '사랑', '미워', '좋아', '싫어', '행복', '불안', '걱정'];
const LOGIC_KEYWORDS = ['왜냐하면', '그래서', '따라서', '논리', '팩트', '사실', '데이터', '분석', '결과', '이유'];
const INTROVERT_KEYWORDS = ['혼자', '조용', '집', '책', '생각', '내면'];
const EXTROVERT_KEYWORDS = ['사람', '모임', '파티', '친구', '같이', '함께', '만나'];

// ============== 핵심 함수 ==============

/**
 * 초기 프로필 생성
 */
export function createEmptyProfile(): PersonalityProfile {
    return {
        bigFive: {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50
        },
        mbtiLeanings: {
            ei: null,
            sn: null,
            tf: null,
            jp: null
        },
        inferredType: '분석 중...',
        confidence: 0,
        dataPoints: 0,
        lastUpdated: new Date()
    };
}

/**
 * 텍스트에서 성격 특성 추론 (Passive Scanning)
 */
export function analyzeTextForPersonality(text: string): TextAnalysisResult {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());

    let emotionWords = 0;
    let logicWords = 0;
    let introvertSignals = 0;
    let extrovertSignals = 0;

    const lowerText = text.toLowerCase();

    EMOTION_KEYWORDS.forEach(k => {
        if (lowerText.includes(k)) emotionWords++;
    });

    LOGIC_KEYWORDS.forEach(k => {
        if (lowerText.includes(k)) logicWords++;
    });

    INTROVERT_KEYWORDS.forEach(k => {
        if (lowerText.includes(k)) introvertSignals++;
    });

    EXTROVERT_KEYWORDS.forEach(k => {
        if (lowerText.includes(k)) extrovertSignals++;
    });

    const questionMarks = (text.match(/\?/g) || []).length;
    const exclamationMarks = (text.match(/!/g) || []).length;

    // 추론된 특성
    const inferredTraits: Partial<BigFiveTraits> = {};

    // 감정 vs 논리 → T/F 경향
    if (emotionWords > logicWords) {
        inferredTraits.agreeableness = 60;
    } else if (logicWords > emotionWords) {
        inferredTraits.agreeableness = 40;
    }

    // 내향 vs 외향 신호
    if (introvertSignals > extrovertSignals) {
        inferredTraits.extraversion = 40;
    } else if (extrovertSignals > introvertSignals) {
        inferredTraits.extraversion = 60;
    }

    // 느낌표 많음 → 외향성/개방성 높음
    if (exclamationMarks > 2) {
        inferredTraits.extraversion = (inferredTraits.extraversion || 50) + 10;
        inferredTraits.openness = 60;
    }

    // 문장 길이 → 성실성 (긴 문장 = 꼼꼼함)
    const avgLen = sentences.length > 0
        ? words.length / sentences.length
        : words.length;

    if (avgLen > 15) {
        inferredTraits.conscientiousness = 60;
    }

    return {
        wordCount: words.length,
        emotionWords,
        logicWords,
        questionMarks,
        exclamationMarks,
        avgSentenceLength: avgLen,
        inferredTraits
    };
}

/**
 * 대화 맥락에 맞는 프로파일링 질문 선택
 */
export function selectProfilingQuestion(
    context: string,
    existingProfile: PersonalityProfile
): ProfilingQuestion | null {
    // 이미 충분한 데이터가 있으면 질문 안 함
    if (existingProfile.dataPoints >= 8) {
        return null;
    }

    // 아직 파악 안 된 MBTI 차원 찾기
    const unknownDimensions: string[] = [];
    if (!existingProfile.mbtiLeanings.ei) unknownDimensions.push('ei');
    if (!existingProfile.mbtiLeanings.sn) unknownDimensions.push('sn');
    if (!existingProfile.mbtiLeanings.tf) unknownDimensions.push('tf');
    if (!existingProfile.mbtiLeanings.jp) unknownDimensions.push('jp');

    // 우선순위: 미파악 MBTI 차원 먼저
    if (unknownDimensions.length > 0) {
        const targetDimension = unknownDimensions[0];
        const candidates = PROFILING_QUESTIONS.filter(
            q => q.targetTrait === targetDimension
        );
        if (candidates.length > 0) {
            return candidates[Math.floor(Math.random() * candidates.length)];
        }
    }

    // 그 다음: 빅파이브 중 확신도 낮은 것
    const bigFiveQuestions = PROFILING_QUESTIONS.filter(
        q => typeof q.targetTrait === 'string' &&
            ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].includes(q.targetTrait)
    );

    if (bigFiveQuestions.length > 0) {
        return bigFiveQuestions[Math.floor(Math.random() * bigFiveQuestions.length)];
    }

    return null;
}

/**
 * 사용자 응답으로 프로필 업데이트
 */
export function updateProfileFromResponse(
    profile: PersonalityProfile,
    question: ProfilingQuestion,
    response: string
): PersonalityProfile {
    const updatedProfile = { ...profile };
    const lowerResponse = response.toLowerCase();

    // 매핑에서 점수 계산
    let score = 0;
    Object.entries(question.mappings).forEach(([keyword, points]) => {
        if (lowerResponse.includes(keyword.toLowerCase())) {
            score += points as number;
        }
    });

    // 직접 선택 (1, 2 등)
    if (question.options) {
        question.options.forEach((opt, idx) => {
            if (response.trim() === opt || response.includes(opt)) {
                score = Object.values(question.mappings)[idx] as number;
            }
        });
    }

    // MBTI 차원 업데이트
    if (['ei', 'sn', 'tf', 'jp'].includes(question.targetTrait)) {
        const dimension = question.targetTrait as keyof MBTILeanings;
        if (score < 0) {
            if (dimension === 'ei') updatedProfile.mbtiLeanings.ei = 'I';
            else if (dimension === 'sn') updatedProfile.mbtiLeanings.sn = 'S';
            else if (dimension === 'tf') updatedProfile.mbtiLeanings.tf = 'T';
            else if (dimension === 'jp') updatedProfile.mbtiLeanings.jp = 'J';
        } else if (score > 0) {
            if (dimension === 'ei') updatedProfile.mbtiLeanings.ei = 'E';
            else if (dimension === 'sn') updatedProfile.mbtiLeanings.sn = 'N';
            else if (dimension === 'tf') updatedProfile.mbtiLeanings.tf = 'F';
            else if (dimension === 'jp') updatedProfile.mbtiLeanings.jp = 'P';
        }
    }

    // 빅파이브 업데이트
    if (['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].includes(question.targetTrait)) {
        const trait = question.targetTrait as keyof BigFiveTraits;
        updatedProfile.bigFive[trait] = Math.max(0, Math.min(100,
            updatedProfile.bigFive[trait] + score
        ));
    }

    // 메타 정보 업데이트
    updatedProfile.dataPoints += 1;
    updatedProfile.confidence = Math.min(100, updatedProfile.dataPoints * 12);
    updatedProfile.lastUpdated = new Date();

    // 추론된 유형 업데이트
    updatedProfile.inferredType = inferMBTIType(updatedProfile.mbtiLeanings);

    return updatedProfile;
}

/**
 * MBTI 유형 추론
 */
function inferMBTIType(leanings: MBTILeanings): string {
    const { ei, sn, tf, jp } = leanings;

    const parts = [
        ei || '?',
        sn || '?',
        tf || '?',
        jp || '?'
    ];

    if (parts.includes('?')) {
        return `${parts.join('')}-분석 중`;
    }

    return `${parts.join('')}-유사`;
}

/**
 * 프로필 기반 상담 스타일 추천
 */
export function getCoachingStyleRecommendation(profile: PersonalityProfile): string {
    const { bigFive, mbtiLeanings } = profile;

    const recommendations: string[] = [];

    // 외향/내향
    if (mbtiLeanings.ei === 'I') {
        recommendations.push('조용하고 깊이 있는 대화 선호');
    } else if (mbtiLeanings.ei === 'E') {
        recommendations.push('활발하고 에너지 있는 대화 선호');
    }

    // 사고/감정
    if (mbtiLeanings.tf === 'T') {
        recommendations.push('논리적 해결책 제시가 효과적');
    } else if (mbtiLeanings.tf === 'F') {
        recommendations.push('감정 공감 후 해결책 제시');
    }

    // 신경성 높음
    if (bigFive.neuroticism > 60) {
        recommendations.push('안심시키는 톤 유지 필요');
    }

    // 개방성 높음
    if (bigFive.openness > 60) {
        recommendations.push('새로운 관점 제시에 열려 있음');
    }

    return recommendations.join(' | ') || '기본 코칭 스타일';
}

/**
 * 프로필 요약 문자열 생성
 */
export function formatProfileSummary(profile: PersonalityProfile): string {
    return `
[성격 프로필 분석]
- 추론된 유형: ${profile.inferredType}
- 신뢰도: ${profile.confidence}%
- 데이터 포인트: ${profile.dataPoints}개
- 외향성: ${profile.bigFive.extraversion}
- 개방성: ${profile.bigFive.openness}
- 성실성: ${profile.bigFive.conscientiousness}
- 우호성: ${profile.bigFive.agreeableness}
- 신경성: ${profile.bigFive.neuroticism}
- 코칭 스타일: ${getCoachingStyleRecommendation(profile)}
`.trim();
}
