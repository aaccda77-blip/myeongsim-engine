/**
 * ZenProtocol.ts - 선(禪) 모드 비상 개입 시스템
 * 
 * 목적: 사용자가 특정 심리 상태에 빠졌을 때 자동 발동하는 개입 시스템
 * 특징:
 *  - 미래 집착 감지 → 귀류논증 응답
 *  - 남 탓/피해자 모드 → 거울 요법 응답
 *  - 패닉/과부하 → 마인드 벨 (강제 중단)
 */

// ============== 타입 정의 ==============

export type ZenMode = 'future_obsession' | 'victim_mode' | 'panic_overload' | 'none';

export interface ZenAnalysis {
    mode: ZenMode;
    confidence: number;        // 0-100
    triggerKeywords: string[]; // 감지된 키워드
    shouldIntervene: boolean;  // 개입 필요 여부
    intervention: string;      // 개입 응답 텍스트
    promptInjection: string;   // AI 프롬프트에 주입할 지시
}

// ============== 키워드 사전 ==============

// 1. 미래 집착 키워드 ("언제 좋아져요?")
const FUTURE_OBSESSION_KEYWORDS = [
    '언제', '몇 년', '몇 달', '언젠가', '미래에',
    '좋아져', '나아져', '풀려', '해결돼',
    '들어와', '생겨', '바뀌',
    '재회', '결혼', '부자', '성공',
    '운이', '운세', '대운', '언제쯤',
    '기다려', '잠볶댐' // 잠자리가 불안해서 못 잔다 등
];

// 2. 피해자 모드 키워드 ("저 사람 때문에")
const VICTIM_MODE_KEYWORDS = [
    '때문에', '탓', '잘못', '책임',
    '상사', '부장', '팀장', '부모님', '엄마', '아빠', '시어머니',
    '남편', '와이프', '아내', '남자친구', '여자친구',
    '괴롭', '당했', '피해', '억울', '불공평',
    '왜 나만', '왜 나한테', '나만 그래',
    '타고난', '팔자', '운명', '사주가 안 좋',
    '내 인생이', '망했', '꼬였'
];

// 3. 패닉/과부하 키워드
const PANIC_KEYWORDS = [
    '미치겠', '미칠 것 같', '죽을 것 같', '숨 막혀',
    '어떡해', '어떻게', '모르겠', '안 돼',
    '불안', '공황', '패닉', '잠이 안', '잠도 못',
    '아니 그래서', '근데 그게', '아 그리고',
    '너무', '진짜', '정말', '대체',
    '미쳐', '죽겠', '힘들어'
];

// ============== 개입 응답 템플릿 ==============

const INTERVENTIONS = {
    future_obsession: {
        responses: [
            `잠깐, 질문을 바꿔볼게요. 만약 제가 "2년 뒤에 좋아집니다"라고 말한다면, **오늘 하루는 대충 살아도 괜찮다는 뜻일까요?**

미래를 묻는 그 마음 뒤에 숨은 **'지금의 회피'**를 먼저 마주하세요. 
진짜 질문은 "언제?"가 아니라 **"지금 나는 왜 불안한가?"**입니다.`,

            `선생님, 미래를 알고 싶은 마음... 충분히 이해합니다.
하지만 **"언제 좋아져요?"**라는 질문에는 함정이 숨어 있어요.

그 질문의 진짜 속마음은 **"지금이 너무 힘들어요"**입니다.
미래보다 **지금 이 순간의 고통**을 먼저 다뤄볼까요?`,

            `2024년 운세보다 중요한 건 **오늘의 선택**입니다.
운명은 "기다리면 오는 것"이 아니라 **"만들어가는 것"**이에요.

"언제?"를 묻기 전에 **"지금 뭘 할 수 있지?"**를 먼저 물어보세요.
작은 행동 하나가 운명의 타이밍을 앞당깁니다.`
        ],
        promptInjection: `
:::ZEN_MODE_ACTIVATED:::
[개입 유형] 미래 집착 감지 (Future Obsession)
[AI 지시] 
1. "언제", "몇 년 뒤" 등의 예언적 답변을 하지 마라.
2. 대신 "왜 지금 불안한가?"로 질문을 전환하라.
3. 귀류논증: "그렇다면 지금은 대충 살아도 된다는 뜻인가?"
4. 현재 행동(Action)에 집중하도록 유도하라.
:::END_ZEN:::
`
    },

    victim_mode: {
        responses: [
            `잠깐요. 그 사람이 문제인가요, 아니면 선생님 안의 **'인정받고 싶은 마음'**이 문제인가요?

지금 화를 내고 있는 그 주체(에고)가 **누구인지** 먼저 확인하세요.
외부를 바꿀 수는 없지만, **내 반응**은 바꿀 수 있습니다.`,

            `선생님, 힘드셨겠어요. 그 감정은 진짜입니다.
하지만 한 가지만 물어볼게요.

**"그 사람이 없었다면, 나는 완벽히 행복했을까요?"**

외부 탓 뒤에는 종종 **내면의 상처**가 숨어 있어요.
그 상처를 함께 들여다볼까요?`,

            `"~때문에"라는 말이 반복될 때, 저는 이렇게 생각해요.
**"내 에너지의 리모컨을 그 사람에게 맡기고 있구나"**

리모컨을 돌려받으세요. 
**선생님의 기분은 선생님이 컨트롤**할 수 있어요.`
        ],
        promptInjection: `
:::ZEN_MODE_ACTIVATED:::
[개입 유형] 피해자 모드 감지 (Victim Mode)
[AI 지시]
1. "힘드셨겠어요"로 공감하되, 거기서 멈추지 마라.
2. 거울 요법: 외부 탓을 내면 탐색으로 전환하라.
3. "그 사람 대신 당신 안에서 무엇이 반응하고 있는가?"
4. 에고(Ego) 분리: "화내는 나"와 "그것을 지켜보는 나"를 구분하게 하라.
5. 리모컨 비유: "당신의 감정을 타인에게 맡기지 마라"
:::END_ZEN:::
`
    },

    panic_overload: {
        responses: [
            `🔔 :::MIND_BELL:::

**멈추세요.**

생각이 꼬리를 물고 낭떠러지로 가고 있습니다.
**지금 당장 휴대폰을 내려놓고 숨을 3번 쉬세요.**

3번 쉴 때까지 대화를 이어가지 않겠습니다.

깊게... 들이쉬고... 내쉬고...
준비되면 말씀해 주세요.`,

            `🔔 **잠깐요.**

선생님의 메시지에서 **마음이 과열된 신호**가 감지됐어요.
지금은 분석보다 **진정**이 먼저입니다.

**5초 동안 숨을 참았다가 천천히 내쉬세요.**
그리고 창밖을 한 번 바라봐 주세요.

괜찮아지면 다시 이야기해요.`,

            `🔔 **스톱.**

지금 선생님의 뇌는 **과부하 상태**예요.
생각이 생각을 낳고, 불안이 불안을 낳고 있어요.

해결책은 **생각을 끊는 것**입니다.

**지금 당장 일어나서 물 한 잔 마시세요.**
그것만 하고 돌아오세요. 기다릴게요.`
        ],
        promptInjection: `
:::ZEN_MODE_ACTIVATED:::
[개입 유형] 패닉/과부하 감지 (Panic Overload)
[AI 지시]
1. 긴 분석이나 조언을 하지 마라.
2. 마인드 벨: 짧고 단호하게 "멈추세요"로 시작하라.
3. 즉각적인 신체 행동(호흡, 물 마시기, 창밖 보기)을 지시하라.
4. 사용자가 진정될 때까지 복잡한 대화를 피하라.
5. "괜찮아지면 말씀해 주세요"로 마무리.
:::END_ZEN:::
`
    }
};

// ============== 핵심 함수 ==============

/**
 * 텍스트 길이 분석 (장문 감지)
 */
function isLongRambling(text: string): boolean {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.split(/\s+/).length;

    // 10문장 이상 또는 200단어 이상이면 과부하 의심
    return sentences.length >= 10 || words >= 200;
}

/**
 * 키워드 매칭 점수 계산
 */
function calculateKeywordScore(text: string, keywords: string[]): { score: number; matched: string[] } {
    const lowerText = text.toLowerCase();
    let score = 0;
    const matched: string[] = [];

    for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
            score += 1;
            matched.push(keyword);
        }
    }

    return { score, matched };
}

/**
 * 메인 분석 함수: Zen 모드 필요 여부 판단
 */
export function analyzeForZenMode(
    userMessage: string,
    conversationHistory?: string[]
): ZenAnalysis {
    // 기본 결과 (개입 불필요)
    const noIntervention: ZenAnalysis = {
        mode: 'none',
        confidence: 0,
        triggerKeywords: [],
        shouldIntervene: false,
        intervention: '',
        promptInjection: ''
    };

    // 대화 컨텍스트 결합
    let fullContext = userMessage;
    if (conversationHistory && conversationHistory.length > 0) {
        fullContext = `${conversationHistory.slice(-2).join(' ')} ${userMessage}`;
    }

    // 1. 패닉/과부하 체크 (최우선)
    const panicResult = calculateKeywordScore(fullContext, PANIC_KEYWORDS);
    const isRambling = isLongRambling(userMessage);

    if (panicResult.score >= 3 || (panicResult.score >= 2 && isRambling)) {
        const responses = INTERVENTIONS.panic_overload.responses;
        return {
            mode: 'panic_overload',
            confidence: Math.min(100, panicResult.score * 25),
            triggerKeywords: panicResult.matched,
            shouldIntervene: true,
            intervention: responses[Math.floor(Math.random() * responses.length)],
            promptInjection: INTERVENTIONS.panic_overload.promptInjection
        };
    }

    // 2. 미래 집착 체크
    const futureResult = calculateKeywordScore(fullContext, FUTURE_OBSESSION_KEYWORDS);

    if (futureResult.score >= 2) {
        const responses = INTERVENTIONS.future_obsession.responses;
        return {
            mode: 'future_obsession',
            confidence: Math.min(100, futureResult.score * 20),
            triggerKeywords: futureResult.matched,
            shouldIntervene: true,
            intervention: responses[Math.floor(Math.random() * responses.length)],
            promptInjection: INTERVENTIONS.future_obsession.promptInjection
        };
    }

    // 3. 피해자 모드 체크
    const victimResult = calculateKeywordScore(fullContext, VICTIM_MODE_KEYWORDS);

    if (victimResult.score >= 2) {
        const responses = INTERVENTIONS.victim_mode.responses;
        return {
            mode: 'victim_mode',
            confidence: Math.min(100, victimResult.score * 20),
            triggerKeywords: victimResult.matched,
            shouldIntervene: true,
            intervention: responses[Math.floor(Math.random() * responses.length)],
            promptInjection: INTERVENTIONS.victim_mode.promptInjection
        };
    }

    return noIntervention;
}

/**
 * Zen 개입 응답 생성 (사주 정보와 융합)
 */
export function generateZenResponse(
    analysis: ZenAnalysis,
    dayMasterNature?: string // 예: "큰 나무", "바위"
): string {
    if (!analysis.shouldIntervene) {
        return '';
    }

    let response = analysis.intervention;

    // 사주 정보가 있으면 융합
    if (dayMasterNature && dayMasterNature !== '자연') {
        const natureAdditions: Record<ZenMode, string> = {
            future_obsession: `\n\n선생님은 **${dayMasterNature}**의 기질을 가지셨어요. ${dayMasterNature}는 조급해하지 않아도 됩니다. 자기 속도로 자라면 됩니다.`,
            victim_mode: `\n\n**${dayMasterNature}**의 기질을 가진 분이 외부에 휘둘리면 안 돼요. 그 단단함(또는 유연함)이 선생님의 무기입니다.`,
            panic_overload: `\n\n**${dayMasterNature}**도 가끔은 쉬어가야 해요. 쉼도 성장의 일부입니다.`,
            none: ''
        };

        response += natureAdditions[analysis.mode] || '';
    }

    return response;
}

/**
 * 프롬프트 주입용 Zen 블록 생성
 */
export function generateZenPromptBlock(analysis: ZenAnalysis): string {
    if (!analysis.shouldIntervene) {
        return '';
    }

    return analysis.promptInjection;
}
