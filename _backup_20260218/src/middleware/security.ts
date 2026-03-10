// src/middleware/security.ts
/**
 * Security Middleware
 * API 보안 강화
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

// Rate Limiter 설정
const loginLimiter = rateLimit({
    interval: 15 * 60 * 1000, // 15분
    maxRequests: 5 // 최대 5회 시도
});

const apiLimiter = rateLimit({
    interval: 60 * 1000, // 1분
    maxRequests: 60 // 최대 60회 요청
});

export const securityMiddleware = {
    // 로그인 Rate Limiting
    checkLoginLimit: (req: NextRequest) => {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const result = loginLimiter.check(ip);

        if (!result.success) {
            const waitTime = Math.ceil((result.resetTime - Date.now()) / 1000 / 60);
            return NextResponse.json(
                {
                    error: 'Too many login attempts',
                    message: `너무 많은 로그인 시도입니다. ${waitTime}분 후 다시 시도해주세요.`,
                    retryAfter: result.resetTime
                },
                { status: 429 }
            );
        }

        return null; // 통과
    },

    // API Rate Limiting
    checkApiLimit: (req: NextRequest) => {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const result = apiLimiter.check(ip);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    message: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
                    retryAfter: result.resetTime
                },
                { status: 429 }
            );
        }

        return null; // 통과
    },

    // Input Sanitization
    sanitizeInput: (input: string): string => {
        // XSS 방지: HTML 태그 제거
        return input
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim();
    },

    // SQL Injection 방지 (추가 검증)
    validatePhoneNumber: (phone: string): boolean => {
        // 숫자만 허용, 10-11자리
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    },

    // CSRF 토큰 검증 (향후 구현)
    validateCSRF: (req: NextRequest): boolean => {
        // TODO: CSRF 토큰 검증 로직
        return true;
    }
};
