import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';

        if (password === ADMIN_PASSWORD) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: '비밀번호가 틀렸습니다.' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}
