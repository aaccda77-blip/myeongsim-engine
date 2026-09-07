import { NextRequest, NextResponse } from 'next/server';
import { securityLogs } from '../security-status/route';
import { rateLimit } from '@/lib/rateLimit';
import { getExpectedAdminToken, isValidAdminPassword } from '@/lib/adminAuth';

// 관리자 로그인 전용 Rate Limiter: 15분 내 최대 5회 실패 시 잠금
const adminLoginLimiter = rateLimit({
    interval: 15 * 60 * 1000, // 15분
    maxRequests: 5 // 최대 5회 시도
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const { password, action } = body;

        // 🔒 1. 로그아웃 처리 요청 (action === 'logout')
        if (action === 'logout') {
            const response = NextResponse.json({ success: true, message: '안전하게 로그아웃되었습니다.' });
            response.cookies.set('admin_session', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 0,
                expires: new Date(0),
                path: '/'
            });
            return response;
        }

        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown-ip';

        // 🔒 Rate Limit Check
        const rateCheck = adminLoginLimiter.check(`admin-auth-${ip}`);
        if (!rateCheck.success) {
            return NextResponse.json({
                success: false,
                error: '로그인 연속 실패로 인해 계정이 15분간 일시 잠금되었습니다. 잠시 후 다시 시도해 주세요.'
            }, { status: 429 });
        }

        // 🔒 2. 비밀번호 검증
        if (password && isValidAdminPassword(password)) {
            const sessionToken = getExpectedAdminToken(password);
            const response = NextResponse.json({ success: true });

            // 4시간 보안 세션 부여 (24시간에서 단축하여 보안 강화)
            response.cookies.set('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 4, // 4 hours
                path: '/'
            });

            return response;
        } else {
            // [SECURITY AUDIT] Log failed login attempt
            securityLogs.push({
                id: `sec-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'FAILED_ADMIN_LOGIN',
                ip,
                detail: `관리자 비밀번호 불일치 (남은 시도 횟수: ${rateCheck.remaining}회)`
            });

            return NextResponse.json({
                success: false,
                error: `비밀번호가 올바르지 않습니다. (남은 시도: ${rateCheck.remaining}회)`
            }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true, message: '안전하게 로그아웃되었습니다.' });
    response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        expires: new Date(0),
        path: '/'
    });
    return response;
}

