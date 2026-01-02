/**
 * FrequencyDetector.ts - 실시간 주파수 감지 모듈
 * 
 * 목적: 사용자의 현재 감정/에너지 상태를 감지하고 3단계 레벨로 분류
 * 특징:
 *  - Dark Code (버그) / Neural Code (엔진) / Meta Code (초월) 감지
 *  - 감지 결과에 따라 AI 태도 모드 제안 (치료사/코치/현자)
 *  - 사주 기질과 융합된 처방 생성
 */

// ============== 타입 정의 ==============
export type FrequencyLevel = 'dark' | 'neural' | 'meta';

export type AIMode = 'therapist' | 'coach' | 'sage';

export interface FrequencyAnalysis {
    level: FrequencyLevel;
    confidence: number;           // 0-1
    suggestedMode: AIMode;
    keywords: string[];           // 감지된 키워드
    emotionalTone: string;        // 감정 톤 요약
    prescription: string;         // 권장 처방 방향
}

// ============== 키워드 사전 ==============

// Level 1: Dark Code (버그 상태) - 부정적 감정, 두려움, 피해의식
const DARK_CODE_KEYWORDS = [
    // 부정적 감정
    '힘들', '지쳐', '무력', '우울', '불안', '두렵', '무섭', '걱정',
    '한심', '짜증', '화나', '분노', '억울', '서럽', '외롭', '공허',
    // 자책/피해의식
    '내 탓', '왜 나만', '못해', '안 돼', '싫어', '포기', '그만',
    '도망', '숨고싶', '모르겠', '막막', '답답', '막혀',
    // 극단적 표현
    '죽고싶', '사라지고', '끝내', '없어지', '의미없'
];

// Level 2: Neural Code (엔진 상태) - 해결 의지, 질문, 행동 모색
const NEURAL_CODE_KEYWORDS = [
    // 질문/탐색
    '어떻게', '방법', '알려', '도와', '조언', '추천',
    // 의지/결심
    '해볼', '시작', '바꿔', '노력', '도전', '시도', '결심',
    // 긍정적 긴장
    '잘할', '될까', '가능', '기회', '새로', '변화',
    // 호기심
    '궁금', '왜', '뭐가', '어떤', '알고싶'
];

// Level 3: Meta Code (초월 상태) - 깨달음, 감사, 평온, 이타심
const META_CODE_KEYWORDS = [
    // 깨달음
    '알겠', '이해', '깨달', '느껴', '보여',
    // 감사/평온
    '감사', '고마', '평온', '편안', '행복', '기쁨', '만족',
    // 초월적 인식
    '과정', '의미', '성장', '배움', '여정', '흐름',
    // 이타심
    '나눔', '도움', '베풀', '함께', '연결', '사랑'
];

// ============== 핵심 함수 ==============

/**
 * 텍스트에서 키워드 매칭 점수 계산
 */
function calculateKeywordScore(text: string, keywords: string[]): number {
    let score = 0;
    const normalizedText = text.toLowerCase();

    for (const keyword of keywords) {
        if (normalizedText.includes(keyword)) {
            score += 1;
            // 반복 사용 시 가중치
            const regex = new RegExp(keyword, 'gi');
            const matches = normalizedText.match(regex);
            if (matches && matches.length > 1) {
                score += (matches.length - 1) * 0.5;
            }
        }
    }

    return score;
}

/**
 * 감정 톤 요약 생성
 */
function summarizeEmotionalTone(level: FrequencyLevel): string {
    switch (level) {
        case 'dark':
            return '부정적 감정/불안/자책이 감지됩니다';
        case 'neural':
            return '긍정적 의지/호기심/행동 모색 중입니다';
        case 'meta':
            return '평온함/깨달음/감사의 상태입니다';
    }
}

/**
 * AI 모드에 따른 처방 방향 제안
 */
function generatePrescription(level: FrequencyLevel, dayMaster?: string): string {
    const dayMasterText = dayMaster ? `${dayMaster}일간의 ` : '';

    switch (level) {
        case 'dark':
            return `[치료사 모드] 공감과 수용 우선. ${dayMasterText}에너지가 과열된 상태. 진정과 탈융합 필요.`;
        case 'neural':
            return `[코치 모드] 동기부여와 행동 촉구. ${dayMasterText}잠재력 활성화 타이밍. 구체적 미션 제시.`;
        case 'meta':
            return `[현자 모드] 인정과 지지. ${dayMasterText}초월 상태 유지. 깊은 질문으로 통찰 확장.`;
    }
}

/**
 * 메인 분석 함수: 사용자 입력에서 주파수 레벨 감지
 */
export function analyzeFrequency(
    userMessage: string,
    conversationHistory?: string[],
    dayMaster?: string
): FrequencyAnalysis {
    // 현재 메시지 + 최근 대화 컨텍스트 결합
    let fullContext = userMessage;
    if (conversationHistory && conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-3).join(' ');
        fullContext = `${recentHistory} ${userMessage}`;
    }

    // 각 레벨별 점수 계산
    const darkScore = calculateKeywordScore(fullContext, DARK_CODE_KEYWORDS);
    const neuralScore = calculateKeywordScore(fullContext, NEURAL_CODE_KEYWORDS);
    const metaScore = calculateKeywordScore(fullContext, META_CODE_KEYWORDS);

    const totalScore = darkScore + neuralScore + metaScore;

    // 레벨 결정 (가장 높은 점수)
    let level: FrequencyLevel;
    let matchedKeywords: string[] = [];
    let confidence: number;

    if (darkScore >= neuralScore && darkScore >= metaScore) {
        level = 'dark';
        matchedKeywords = DARK_CODE_KEYWORDS.filter(k => fullContext.includes(k));
        confidence = totalScore > 0 ? darkScore / totalScore : 0.5;
    } else if (metaScore >= neuralScore) {
        level = 'meta';
        matchedKeywords = META_CODE_KEYWORDS.filter(k => fullContext.includes(k));
        confidence = totalScore > 0 ? metaScore / totalScore : 0.5;
    } else {
        level = 'neural';
        matchedKeywords = NEURAL_CODE_KEYWORDS.filter(k => fullContext.includes(k));
        confidence = totalScore > 0 ? neuralScore / totalScore : 0.5;
    }

    // 기본값: 키워드 없으면 Neural (중립)
    if (totalScore === 0) {
        level = 'neural';
        confidence = 0.5;
    }

    // AI 모드 매핑
    const modeMap: Record<FrequencyLevel, AIMode> = {
        dark: 'therapist',
        neural: 'coach',
        meta: 'sage'
    };

    return {
        level,
        confidence: Math.min(1, confidence),
        suggestedMode: modeMap[level],
        keywords: matchedKeywords.slice(0, 5), // 상위 5개만
        emotionalTone: summarizeEmotionalTone(level),
        prescription: generatePrescription(level, dayMaster)
    };
}

/**
 * 주파수 레벨에 따른 프롬프트 인젝션 문자열 생성
 */
export function generateFrequencyPromptBlock(analysis: FrequencyAnalysis): string {
    const levelEmoji = {
        dark: '🔻',
        neural: '➖',
        meta: '🔺'
    };

    const levelName = {
        dark: 'Dark Code (버그 상태)',
        neural: 'Neural Code (엔진 상태)',
        meta: 'Meta Code (초월 상태)'
    };

    const modeInstruction = {
        therapist: '치료사처럼 공감하고 수용하세요. 판단하지 말고, 감정을 있는 그대로 인정하세요.',
        coach: '코치처럼 동기를 부여하고 행동을 촉구하세요. 구체적인 미션을 제시하세요.',
        sage: '현자처럼 깊은 인정과 지지를 보내세요. 질문으로 통찰을 확장하세요.'
    };

    return `
:::FREQUENCY_ANALYSIS:::
${levelEmoji[analysis.level]} **현재 감지된 주파수**: ${levelName[analysis.level]}
- 신뢰도: ${(analysis.confidence * 100).toFixed(0)}%
- 감정 톤: ${analysis.emotionalTone}
- 감지된 키워드: ${analysis.keywords.join(', ') || '없음'}

**🎭 AI 모드**: [${analysis.suggestedMode.toUpperCase()}]
${modeInstruction[analysis.suggestedMode]}

**💊 처방 방향**: ${analysis.prescription}
:::END_FREQUENCY:::
`;
}

/**
 * 위험 신호 감지 (자해/자살 관련)
 */
export function detectCrisisSignal(text: string): boolean {
    const crisisKeywords = ['죽고싶', '자살', '사라지고싶', '끝내고싶', '없어지고싶'];
    return crisisKeywords.some(k => text.includes(k));
}
