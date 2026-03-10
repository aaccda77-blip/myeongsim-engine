import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userId } = await request.json();

        // Use service role to delete (bypasses RLS)
        const { error } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        // [ENTERPRISE] Audit Log (Who Appoved Whom and Why)
        await supabaseAdmin.from('security_logs').insert({
            action_type: 'DELETE_USER',
            target_user_id: userId,
            admin_id: 'system_admin',
            details: { reason: "Admin Manual Delete" },
            ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
