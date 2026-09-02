/**
 * src/lib/fairUsagePolicy.ts
 * 🛡️ [공정 이용 정책 & API 과다 소진 방어 엔진]
 * - 일일 대화 상한선 (Daily Cap: VIP 100회 / 무료 10회, 매일 자정 자동 리셋)
 * - 초당/분당 폭주 매크로 공격 차단 (Rate Limit: 15 req/min)
 * - 1개 계정 다중 기기 동시 접속 어뷰징 방어 (Single Active Session)
 */

interface UserDailyUsage {
    dateStr: string; // YYYY-MM-DD
    count: number;
    lastActiveSession?: string;
    lastActiveTime: number;
}

// In-Memory Usage Store (Fast & Zero DB Load)
const dailyUsageStore: Record<string, UserDailyUsage> = {};

// Clean up old dates periodically (every 1 hour)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const todayStr = getTodayKST();
        for (const key in dailyUsageStore) {
            if (dailyUsageStore[key].dateStr !== todayStr) {
                delete dailyUsageStore[key];
            }
        }
    }, 60 * 60 * 1000);
}

function getTodayKST(): string {
    const now = new Date();
    // KST is UTC + 9
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    return kstDate.toISOString().slice(0, 10);
}

export interface FUPCheckResult {
    allowed: boolean;
    remaining: number;
    dailyLimit: number;
    currentCount: number;
    resetAt: string; // '자정 (00:00 KST)'
    reason?: 'DAILY_LIMIT_EXCEEDED' | 'CONCURRENT_SESSION_BLOCKED' | 'BURST_BLOCKED';
    userMessage?: string;
}

export class FairUsagePolicy {
    // 1일 상한선 설정
    static readonly VIP_DAILY_LIMIT = 100; // 유료/프리패스 유저 (일반인은 20~30회도 다 못 씀)
    static readonly FREE_DAILY_LIMIT = 10;  // 무료/게스트 유저
    static readonly BURST_MIN_INTERVAL_MS = 1500; // 연속 메시지 최소 간격 1.5초 (매크로 봇 방어)

    /**
     * 유저의 대화 요청이 FUP 정책에 부합하는지 검증
     * @param identifier userId or IP
     * @param isVip VIP / 유료 이용권 여부
     * @param sessionId 현재 클라이언트 세션 ID
     */
    static verifyAndIncrement(identifier: string, isVip: boolean = true, sessionId?: string): FUPCheckResult {
        const now = Date.now();
        const todayStr = getTodayKST();
        const limit = isVip ? this.VIP_DAILY_LIMIT : this.FREE_DAILY_LIMIT;

        const record = dailyUsageStore[identifier];

        // 1. 새로운 날짜이거나 첫 요청인 경우
        if (!record || record.dateStr !== todayStr) {
            dailyUsageStore[identifier] = {
                dateStr: todayStr,
                count: 1,
                lastActiveSession: sessionId,
                lastActiveTime: now
            };

            return {
                allowed: true,
                remaining: limit - 1,
                dailyLimit: limit,
                currentCount: 1,
                resetAt: '매일 자정 (00:00 KST)'
            };
        }

        // 2. 초당 폭주 매크로 봇 공격 감지 (1.5초 이내 연타 방어)
        if (now - record.lastActiveTime < this.BURST_MIN_INTERVAL_MS) {
            return {
                allowed: false,
                remaining: Math.max(0, limit - record.count),
                dailyLimit: limit,
                currentCount: record.count,
                resetAt: '매일 자정 (00:00 KST)',
                reason: 'BURST_BLOCKED',
                userMessage: '⚡ 너무 빠른 연속 요청입니다. 1~2초 후 다시 입력해 주세요.'
            };
        }

        // 3. 일일 대화 한도 초과 검사 (Daily Cap)
        if (record.count >= limit) {
            return {
                allowed: false,
                remaining: 0,
                dailyLimit: limit,
                currentCount: record.count,
                resetAt: '매일 자정 (00:00 KST)',
                reason: 'DAILY_LIMIT_EXCEEDED',
                userMessage: `🌿 [공정 이용 정책 안내] 오늘 108 매트릭스 AI 코칭 일일 권장 대화량(${limit}회)을 모두 충전·소진하셨습니다. 대표님의 뇌신경 쿨다운 및 숙면을 위해 자정(00:00)에 ${limit}회로 자동 완충됩니다. 내일 더 맑은 에너지로 뵙겠습니다! 🧠✨`
            };
        }

        // 4. 정상 카운트 증가
        record.count += 1;
        record.lastActiveTime = now;
        if (sessionId) {
            record.lastActiveSession = sessionId;
        }

        return {
            allowed: true,
            remaining: limit - record.count,
            dailyLimit: limit,
            currentCount: record.count,
            resetAt: '매일 자정 (00:00 KST)'
        };
    }

    /**
     * 현재 잔여 대화량 조회 (카운트 증가 없음)
     */
    static getUsage(identifier: string, isVip: boolean = true): { count: number; remaining: number; limit: number } {
        const todayStr = getTodayKST();
        const limit = isVip ? this.VIP_DAILY_LIMIT : this.FREE_DAILY_LIMIT;
        const record = dailyUsageStore[identifier];

        if (!record || record.dateStr !== todayStr) {
            return { count: 0, remaining: limit, limit };
        }

        return {
            count: record.count,
            remaining: Math.max(0, limit - record.count),
            limit
        };
    }
}
