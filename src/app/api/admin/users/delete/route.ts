import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { recordDeletedUser } from '@/lib/deletedUsers';
import { purgeUserFromMemory } from '@/lib/pendingWireTransfers';

export async function POST(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userId, email } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        console.log(`[AdminDelete] Permanently deleting user: ${userId} (${email || 'no email'})`);

        // 1. Delete from Supabase Auth (auth.users)
        try {
            const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
            if (authErr) {
                console.warn(`[AdminDelete] Supabase Auth delete notice:`, authErr.message);
            }
        } catch (e: any) {
            console.warn(`[AdminDelete] Auth delete exception:`, e.message);
        }

        // 2. Delete from public `users` table
        try {
            await supabaseAdmin
                .from('users')
                .delete()
                .eq('id', userId);
        } catch (e: any) {
            console.warn(`[AdminDelete] users table delete notice:`, e.message);
        }

        // 3. Delete from `profiles` table (if exists)
        try {
            await supabaseAdmin
                .from('profiles')
                .delete()
                .eq('id', userId);
        } catch (e: any) {}

        // 4. Record to permanent deleted storage so it never reappears in Admin list
        recordDeletedUser(userId, email);

        // 5. Purge from in-memory stores
        purgeUserFromMemory(userId);

        // 6. Audit Log
        try {
            await supabaseAdmin.from('security_logs').insert({
                action_type: 'DELETE_USER',
                target_user_id: userId,
                admin_id: 'system_admin',
                details: { reason: "Admin Manual Delete", email: email || null },
                ip_address: request.headers.get('x-forwarded-for') || 'unknown'
            });
        } catch (_) {}

        return NextResponse.json({ success: true, message: '가입자가 영구 삭제되었습니다.' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
