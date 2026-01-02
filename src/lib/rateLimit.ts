// src/lib/rateLimit.ts
/**
 * Rate Limiting Middleware
 * 무차별 대입 공격(Brute Force) 방어
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
    interval: number; // 시간 간격 (ms)
    maxRequests: number; // 최대 요청 수
}

export const rateLimit = (config: RateLimitConfig) => {
    return {
        check: (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
            const now = Date.now();
            const key = identifier;

            // 기존 기록 확인
            if (!store[key] || now > store[key].resetTime) {
                // 새로운 윈도우 시작
                store[key] = {
                    count: 1,
                    resetTime: now + config.interval
                };
                return {
                    success: true,
                    remaining: config.maxRequests - 1,
                    resetTime: store[key].resetTime
                };
            }

            // 제한 확인
            if (store[key].count >= config.maxRequests) {
                return {
                    success: false,
                    remaining: 0,
                    resetTime: store[key].resetTime
                };
            }

            // 카운트 증가
            store[key].count++;
            return {
                success: true,
                remaining: config.maxRequests - store[key].count,
                resetTime: store[key].resetTime
            };
        }
    };
};

// 정리 작업 (메모리 누수 방지)
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (now > store[key].resetTime) {
            delete store[key];
        }
    });
}, 60000); // 1분마다 정리
