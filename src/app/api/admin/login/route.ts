import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        // [Hardcoded Security Key]
        // In production, use process.env.ADMIN_PASSWORD
        const SECRET_KEY = process.env.ADMIN_PASSWORD || 'myeongsim_master_2024!';

        if (password === SECRET_KEY) {
            const response = NextResponse.json({ success: true });

            // Set Cookie
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
