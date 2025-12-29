
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { accessKey } = await req.json();

        if (!accessKey) {
            return NextResponse.json({ valid: false, message: '코드를 입력해주세요.' }, { status: 400 });
        }

        // Supabase Client (Admin Role required to update Users table securely if needed, but here we use Anon Key with RLS Policy)
        // Note: For production, we should use SERVICE_ROLE_KEY to update timestamps securely.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Check if Key Exists
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('access_key', accessKey)
            .single();

        if (error || !user) {
            return NextResponse.json({ valid: false, message: '유효하지 않은 코드입니다.' }, { status: 404 });
        }

        const now = new Date();
        const durationMinutes = user.duration_minutes || 30;

        // 2. Master Key Logic (Lifetime)
        // If duration is massive (>500,000 mins), treat as lifetime.
        if (durationMinutes > 500000) {
            return NextResponse.json({
                valid: true,
                expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString(), // +10 Years
                isMaster: true
            });
        }

        // 3. First Use Logic (Activate)
        if (!user.active_at) {
            const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

            // Set active_at and expires_at
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    active_at: now.toISOString(),
                    expires_at: expiresAt.toISOString()
                })
                .eq('id', user.id);

            if (updateError) {
                console.error("Update Error:", updateError);
                return NextResponse.json({ valid: false, message: '서버 오류: 활성화 실패' }, { status: 500 });
            }

            return NextResponse.json({
                valid: true,
                expiresAt: expiresAt.toISOString(),
                remainingMinutes: durationMinutes
            });
        }

        // 4. Returning User Logic (Check Expiry)
        const expiresAt = new Date(user.expires_at);
        if (now > expiresAt) {
            return NextResponse.json({
                valid: false,
                message: '이용 시간이 만료되었습니다. 충전이 필요합니다.',
                expired: true
            }, { status: 403 });
        }

        const remainingMs = expiresAt.getTime() - now.getTime();
        const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

        return NextResponse.json({
            valid: true,
            expiresAt: expiresAt.toISOString(),
            remainingMinutes: remainingMinutes
        });

    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ valid: false, message: '서버 내부 오류' }, { status: 500 });
    }
}
