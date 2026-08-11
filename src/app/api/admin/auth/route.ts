import { NextRequest, NextResponse } from 'next/server';
import { securityLogs } from '../security-status/route';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown-ip';

        if (password === ADMIN_PASSWORD) {
            const sessionToken = Buffer.from(password).toString('base64');
            const response = NextResponse.json({ success: true });

            response.cookies.set('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
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
                detail: '관리자 비밀번호 불일치 (무단 접근 시도)'
            });

            return NextResponse.json({ success: false, error: '비밀번호가 틀렸습니다.' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}
