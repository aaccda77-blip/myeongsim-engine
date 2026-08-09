import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
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
            const response = NextResponse.json({ success: true });

            // Set Cookie
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', // [Security] Prevent CSRF
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
