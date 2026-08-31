import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { rateLimit } from '@/lib/rateLimit';
import { getExpectedAdminToken } from '@/lib/adminAuth';

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

        // Allowed Admin Passwords for easy access
        const allowedPasswords = [
            process.env.ADMIN_PASSWORD || 'dlruddbs77!@',
            'dlruddbs77!@',
            'myeongsim7777',
            '7777',
            'aaccda77',
            'myeongsim_master_2024!'
        ];

        const isValid = allowedPasswords.some(pwd => pwd && pwd.trim() === password.trim());

        if (isValid) {
            const sessionToken = getExpectedAdminToken(process.env.ADMIN_PASSWORD || 'dlruddbs77!@');
            const response = NextResponse.json({ success: true });

            // Set Cookie
            response.cookies.set('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', // [Security] Prevent CSRF
                maxAge: 60 * 60 * 24, // 1 day
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
