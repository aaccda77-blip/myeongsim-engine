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
    let authUserMap: Record<string, { email?: string; name?: string; phone?: string }> = {};

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // 1. Fetch Supabase Auth Users for accurate emails & names
        try {
            const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
            if (authData?.users) {
                authData.users.forEach(au => {
                    const meta = au.user_metadata || {};
                    const name = meta.full_name || meta.name || meta.display_name || meta.userName || '';
                    authUserMap[au.id] = {
                        email: au.email || '',
                        name: name,
                        phone: au.phone || meta.phone || '',
                    };
                });
            }
        } catch (authErr) {
            console.warn('[AdminUsers] listUsers error:', authErr);
        }

        // 2. Fetch database `users` table
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            users = data.map(u => {
                const authInfo = authUserMap[u.id] || {};
                const resolvedEmail = u.email || authInfo.email || '';
                const emailPrefix = resolvedEmail.includes('@') ? resolvedEmail.split('@')[0] : '';
                const resolvedName = u.name || u.depositor_name || u.depositorName || authInfo.name || (emailPrefix ? `${emailPrefix}님` : `회원_${u.id.slice(0, 6)}`);

                return {
                    ...u,
                    email: resolvedEmail,
                    name: resolvedName,
                    phone: u.phone || authInfo.phone || '',
                };
            });
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
                name: pending.depositorName ? `[입금신청] ${pending.depositorName}` : '입금 신청자',
                depositorName: pending.depositorName,
                phone: pending.maskedPhone || '',
                membership_tier: pending.membership_tier || 'CHAT_PASS',
                is_active: pending.is_active || false,
                payment_amount: pending.amount || 890,
                chat_turns_left: 10,
                created_at: pending.created_at,
            });
        } else {
            if (pending.depositorName) {
                users[existingIndex].depositorName = pending.depositorName;
                users[existingIndex].name = `[입금신청] ${pending.depositorName}`;
            }
            if (pending.is_active) {
                users[existingIndex].is_active = true;
            }
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

    // PRIVACY ENCRYPTION: Mask only real phone numbers (not names)
    const securedUsers = users.map(user => {
        const rawPhone = user.phone || '';
        return {
            ...user,
            name: user.name || user.depositorName || (user.email ? user.email.split('@')[0] : `가입자_${user.id.slice(0, 6)}`),
            phone: rawPhone ? maskPhoneNumber(rawPhone) : '',
            originalPhoneMasked: rawPhone ? maskPhoneNumber(rawPhone) : '',
        };
    });

    return NextResponse.json(securedUsers);
}
