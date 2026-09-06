import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const validUsername = 'aaccda77';
        const validPassword = 'rkdaltnr77!@';

        // Valid credentials check
        const isValid = 
            (username === validUsername && password === validPassword) ||
            (username === 'aaccda77' && password === '7777') ||
            (username === 'admin' && (password === '7777' || password === 'dlruddbs77!@' || password === 'myeongsim7777'));

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: '인증에 성공했습니다. 명심코칭으로 입장합니다.'
        });

        // 30 days access cookies
        response.cookies.set({
            name: 'myeongsim_site_access',
            value: 'granted',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        response.cookies.set({
            name: 'myeongsim_site_access_client',
            value: 'granted',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });

        response.cookies.set({
            name: 'admin_session',
            value: 'true',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const siteAccess = request.cookies.get('myeongsim_site_access')?.value;
    const clientAccess = request.cookies.get('myeongsim_site_access_client')?.value;
    const adminSession = request.cookies.get('admin_session')?.value;

    const hasAccess = siteAccess === 'granted' || clientAccess === 'granted' || !!adminSession;
    return NextResponse.json({ hasAccess });
}
