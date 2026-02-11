import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';

        if (password === ADMIN_PASSWORD) {
            // [Security] Set HTTP-Only Cookie
            // In a real app, use a signed token (JWT). Here, a simple session flag.
            // We use a "token" that is just a hash of the password to verify on server.
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
            return NextResponse.json({ success: false, error: '비밀번호가 틀렸습니다.' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}
