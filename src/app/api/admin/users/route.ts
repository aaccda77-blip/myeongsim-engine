import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPendingWireTransfers } from '@/lib/pendingWireTransfers';
import { maskPhoneNumber } from '@/lib/phoneSecurity';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let users: any[] = [];
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            users = data;
        }
    }

    // Merge in-memory pending wire transfers
    const pendingMemoryItems = getPendingWireTransfers();
    pendingMemoryItems.forEach(pending => {
        const existingIndex = users.findIndex(u => u.id === pending.id || u.name === pending.depositorName);
        if (existingIndex === -1) {
            users.unshift({
                id: pending.id,
                email: '무통장 입금 신청',
                name: pending.depositorName,
                phone: pending.maskedPhone,
                membership_tier: pending.membership_tier || 'CHAT_PASS',
                is_active: pending.is_active || false,
                payment_amount: pending.amount || 4900,
                chat_turns_left: 10,
                created_at: pending.created_at,
            });
        } else if (pending.is_active) {
            users[existingIndex].is_active = true;
        }
    });

    // 승인 대기(is_active === false) 회원 무조건 최상단(#1 순위)으로 정렬
    users.sort((a, b) => {
        const pendingA = a.is_active === false ? 1 : 0;
        const pendingB = b.is_active === false ? 1 : 0;
        if (pendingA !== pendingB) {
            return pendingB - pendingA; // is_active === false 우선 노출
        }
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    // PRIVACY ENCRYPTION: Mask all phone numbers in admin API response
    const securedUsers = users.map(user => {
        const rawPhone = user.phone || user.depositorName || user.name || '';
        return {
            ...user,
            name: user.name || user.depositorName || '입금 신청자',
            phone: maskPhoneNumber(rawPhone),
            originalPhoneMasked: maskPhoneNumber(rawPhone),
        };
    });

    return NextResponse.json(securedUsers);
}
