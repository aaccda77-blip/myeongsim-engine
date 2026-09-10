// @ts-nocheck
/**
 * 명심코칭 AI 질문 횟수 제한 모듈 (베타 오픈 기념 한시적 무료 정책)
 * 1. 하루 3번 이하 (자정 KST 기준 리셋)
 * 2. 동일 콘텐츠 연속 3회 이상 질문 제한 (최대 연속 2회까지만 허용, 3회 시 차단)
 */

export const DAILY_AI_QUESTION_LIMIT = 3;
export const MAX_CONSECUTIVE_IDENTICAL_QUESTIONS = 2; // 3회째부터 차단

export interface DailyAiUsage {
    date: string; // 'YYYY-MM-DD' (KST)
    count: number;
}

/**
 * 한국 표준시(KST) 기준 오늘의 날짜 문자열 반환 ('YYYY-MM-DD')
 */
export function getTodayKSTString(): string {
    try {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return formatter.format(new Date());
    } catch {
        return new Date().toISOString().slice(0, 10);
    }
}

/**
 * 오늘 사용한 AI 질문 횟수 조회
 */
export function getDailyAiUsage(): DailyAiUsage {
    if (typeof window === 'undefined') {
        return { date: getTodayKSTString(), count: 0 };
    }
    try {
        const today = getTodayKSTString();
        const raw = localStorage.getItem('myeongsim_ai_daily_usage');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.date === today) {
                return { date: today, count: Number(parsed.count) || 0 };
            }
        }
        // 날짜가 바뀌었거나 첫 이용인 경우 초기화
        const newUsage = { date: today, count: 0 };
        localStorage.setItem('myeongsim_ai_daily_usage', JSON.stringify(newUsage));
        return newUsage;
    } catch {
        return { date: getTodayKSTString(), count: 0 };
    }
}

/**
 * 남은 AI 질문 횟수 조회
 */
export function getRemainingAiQuestions(isAdmin: boolean = false): number {
    if (isAdmin) return 999;
    const usage = getDailyAiUsage();
    return Math.max(0, DAILY_AI_QUESTION_LIMIT - usage.count);
}

/**
 * AI 질문 전송 전 사전 검증
 */
export function checkAiQuestionLimit(content: string, isAdmin: boolean = false): {
    allowed: boolean;
    reason?: 'daily_limit' | 'consecutive_duplicate';
    remainingToday: number;
    message?: string;
    modalTitle?: string;
} {
    // 관리자 세션은 검증 우회
    if (isAdmin) {
        return { allowed: true, remainingToday: 999 };
    }

    const todayUsage = getDailyAiUsage();
    const remaining = Math.max(0, DAILY_AI_QUESTION_LIMIT - todayUsage.count);

    // 1. 하루 질문 횟수 제한 검증 (하루 3번 이하)
    if (todayUsage.count >= DAILY_AI_QUESTION_LIMIT) {
        return {
            allowed: false,
            reason: 'daily_limit',
            remainingToday: 0,
            modalTitle: '✨ 오늘의 AI 질문 한도 (3/3회) 완료',
            message: `명심코칭 앱 베타 오픈 기간 동안 깊이 있는 성찰과 제로포인트 몰입을 위해 하루 최대 3회의 AI 코칭 질문이 제공됩니다.\n\n오늘 준비된 질문 한도(3회)를 모두 사용하셨습니다.\n오늘 나눈 대화와 리포트의 통찰을 천천히 체화해보시고, 내일 자정(00:00)에 다시 질문해 주세요! 🌿`
        };
    }

    // 2. 동일 콘텐츠 연속 3회 이상 질문 검증
    const cleanContent = (content || '').trim().replace(/\s+/g, ' ');
    if (typeof window !== 'undefined' && cleanContent) {
        try {
            const lastText = (localStorage.getItem('myeongsim_ai_last_question') || '').trim();
            const consecutiveCount = Number(localStorage.getItem('myeongsim_ai_consecutive_count') || 0);

            if (cleanContent === lastText && consecutiveCount >= MAX_CONSECUTIVE_IDENTICAL_QUESTIONS) {
                return {
                    allowed: false,
                    reason: 'consecutive_duplicate',
                    remainingToday: remaining,
                    modalTitle: '🌿 동일 질문 연속 입력 제한',
                    message: `동일한 내용으로 연속 3회 이상 질문하실 수 없습니다.\n\n궁금한 점을 다른 관점으로 질문해 주시거나, 이전 코칭 답변을 바탕으로 마음의 영점(Zero-Point)을 자각해 보세요. 🙏`
                };
            }
        } catch {}
    }

    return { allowed: true, remainingToday: remaining };
}

/**
 * AI 질문 성공 시 기록 및 카운트 증가
 */
export function recordAiQuestion(content: string, isAdmin: boolean = false): { remainingToday: number } {
    if (isAdmin) return { remainingToday: 999 };
    if (typeof window === 'undefined') return { remainingToday: DAILY_AI_QUESTION_LIMIT };

    try {
        const today = getTodayKSTString();
        const currentUsage = getDailyAiUsage();
        const nextCount = (currentUsage.date === today ? currentUsage.count : 0) + 1;
        localStorage.setItem('myeongsim_ai_daily_usage', JSON.stringify({ date: today, count: nextCount }));

        // 동일 질문 연속 카운터 업데이트
        const cleanContent = (content || '').trim().replace(/\s+/g, ' ');
        const lastText = (localStorage.getItem('myeongsim_ai_last_question') || '').trim();
        const prevCount = Number(localStorage.getItem('myeongsim_ai_consecutive_count') || 0);

        if (cleanContent === lastText) {
            localStorage.setItem('myeongsim_ai_consecutive_count', String(prevCount + 1));
        } else {
            localStorage.setItem('myeongsim_ai_last_question', cleanContent);
            localStorage.setItem('myeongsim_ai_consecutive_count', '1');
        }

        return { remainingToday: Math.max(0, DAILY_AI_QUESTION_LIMIT - nextCount) };
    } catch {
        return { remainingToday: 0 };
    }
}
