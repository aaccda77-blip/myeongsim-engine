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
        const exists = users.some(u => u.id === pending.id || u.name === pending.depositorName);
        if (!exists) {
            users.unshift({
                id: pending.id,
                email: '무통장 입금 신청',
                name: pending.depositorName,
                phone: pending.maskedPhone,
                membership_tier: pending.membership_tier,
                is_active: false,
                payment_amount: pending.amount,
                chat_turns_left: 3,
                created_at: pending.created_at,
            });
        }
    });

    // PRIVACY ENCRYPTION: Mask all phone numbers in admin API response
    const securedUsers = users.map(user => {
        const rawPhone = user.phone || user.depositorName || user.name || '';
        return {
            ...user,
            phone: maskPhoneNumber(rawPhone),
            originalPhoneMasked: maskPhoneNumber(rawPhone),
        };
    });

    return NextResponse.json(securedUsers);
}
