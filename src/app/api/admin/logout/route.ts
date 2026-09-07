import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({
        success: true,
        message: '관리자 세션이 정상적으로 종료되었습니다.'
    });

    // Wipes admin_session cookie completely
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

export async function GET(request: NextRequest) {
    return POST(request);
}
