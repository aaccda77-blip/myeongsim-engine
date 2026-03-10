import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        // [Hardcoded Security Key]
        // In production, use process.env.ADMIN_PASSWORD
        const SECRET_KEY = process.env.ADMIN_PASSWORD || 'myeongsim_master_2024!';

        // [Security] Timing Attack Protection
        // 1. Ensure consistent length for comparison
        const inputBuffer = Buffer.from(password);
        const secretBuffer = Buffer.from(SECRET_KEY);

        let isValid = false;

        // Prevent length leaking by checking length first but continuing execution
        if (inputBuffer.length === secretBuffer.length) {
            // Constant-time comparison
            isValid = crypto.timingSafeEqual(inputBuffer, secretBuffer);
        }

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
