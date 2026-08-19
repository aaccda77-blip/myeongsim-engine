import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPendingWireTransfers } from '@/lib/pendingWireTransfers';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const name = (searchParams.get('name') || '').trim();
        const userId = (searchParams.get('userId') || '').trim();

        if (!name && !userId) {
            return NextResponse.json({ approved: false, message: '이름 또는 사용자 ID가 필요합니다.' });
        }

        // 1. Check in-memory pending store FIRST (Ultra Fast)
        const pendingItems = getPendingWireTransfers();
        const pending = pendingItems.find(p => 
            (userId && p.id === userId) || 
            (userId && p.userId === userId) ||
            (name && p.depositorName === name) ||
            (name && p.depositorName.includes(name))
        );

        if (pending && pending.is_active) {
            return NextResponse.json({
                approved: true,
                chatTurnsLeft: 3,
                tier: 'CHAT_3',
                message: '승인이 완료되었습니다! 3회 코칭이 즉시 활성화되었습니다.'
            });
        }

        // 2. Check in Supabase `users` table
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            let query = supabaseAdmin.from('users').select('*');
            if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
                query = query.or(`id.eq.${userId},name.ilike.%${name}%`);
            } else if (name) {
                query = query.ilike('name', `%${name}%`);
            }

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
                const approvedUser = data.find(u => u.is_active === true || u.chat_turns_left > 0);
                if (approvedUser) {
                    return NextResponse.json({
                        approved: true,
                        chatTurnsLeft: approvedUser.chat_turns_left || 3,
                        tier: approvedUser.membership_tier || 'CHAT_3',
                        message: '승인이 완료되었습니다! 3회 코칭이 즉시 활성화되었습니다.'
                    });
                }
            }
        }

        if (pending && !pending.is_active) {
            return NextResponse.json({
                approved: false,
                isPending: true,
                message: '현재 무통장 입금 확인 중입니다. 1~5분 이내 승인됩니다.'
            });
        }

        return NextResponse.json({
            approved: false,
            isPending: false,
            message: '입금 신청 기록을 찾을 수 없습니다.'
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
