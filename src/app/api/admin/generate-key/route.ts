
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Helper to generate random code (e.g. A3X-9P2)
function generateRandomKey() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 to avoid confusion
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.slice(0, 3) + '-' + result.slice(3);
}

export async function POST(req: Request) {
    try {
        const { adminKey, type } = await req.json();

        // 1. Verify Admin Key (Simple Auth)
        // Check against the master key we inserted (master-key-2025)
        // Ideally fetch from DB, but for MVP strict check is safer hardcoded here OR checked against DB.
        // Let's check DB for 'master-key-2025' or whatever the user passed.

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Verify the provided admin key allows this action
        const { data: adminUser } = await supabase
            .from('users')
            .select('duration_minutes')
            .eq('access_key', adminKey)
            .single();

        if (!adminUser || adminUser.duration_minutes < 500000) { // < 500,000 means not a master key
            return NextResponse.json({ success: false, message: '관리자 권한이 없습니다.' }, { status: 403 });
        }

        // 2. Generate New Key
        const newKey = generateRandomKey();
        const duration = type === '24h' ? 1440 : 30; // 1440 mins = 24h, 30 mins = 30m

        // 3. Insert into DB
        const { error } = await supabase
            .from('users')
            .insert({
                access_key: newKey,
                duration_minutes: duration,
                coins: 0
            });

        if (error) {
            console.error("Insert Error", error);
            return NextResponse.json({ success: false, message: '키 생성 실패 (중복 등)' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            key: newKey,
            duration: duration
        });

    } catch (e) {
        console.error("Gen Key Error", e);
        return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
    }
}
