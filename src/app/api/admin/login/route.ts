import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { rateLimit } from '@/lib/rateLimit';
import { getExpectedAdminToken, isValidAdminPassword } from '@/lib/adminAuth';

const loginLimiter = rateLimit({
    interval: 15 * 60 * 1000, // 15분
    maxRequests: 5 // 최대 5회 시도
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown-ip';

        // 🔒 Rate Limit Check
        const rateCheck = loginLimiter.check(`admin-login-${ip}`);
        if (!rateCheck.success) {
            return NextResponse.json({
                error: '로그인 연속 실패로 인해 15분간 잠금되었습니다.'
            }, { status: 429 });
        }

        const { password } = await req.json();

        if (password && isValidAdminPassword(password)) {
            const sessionToken = getExpectedAdminToken(password);
            const response = NextResponse.json({ success: true });

            // Set Cookie (4 hours)
            response.cookies.set('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 4, // 4 hours
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json({
                error: `비밀번호가 올바르지 않습니다. (남은 시도: ${rateCheck.remaining}회)`
            }, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
