import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { z } from 'zod';

// [SECURITY] Strict Schema Validation (Zod)
const ApproveSchema = z.object({
    userId: z.string().uuid(),
    tier: z.enum(['TRIAL_30M', 'PASS_24H', 'VIP_7D', 'CHAT_3'])
});

export async function POST(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // [SECURITY] Validate Input
        const result = ApproveSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid Input', details: result.error.issues }, { status: 400 });
        }

        const { userId, tier } = result.data;
        const now = new Date();
        let expiresAt: Date | null = null;
        let paymentAmount = 0;

        // Calculate expiration based on tier (Server-Side Logic - Secure!)
        switch (tier) {
            case 'TRIAL_30M':
                expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
                paymentAmount = 3900;
                break;
            case 'PASS_24H':
                expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                paymentAmount = 9900;
                break;
            case 'VIP_7D':
                expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                paymentAmount = 49000;
                break;
        }

        // [DEBUG] Log the update attempt
        console.log(`[Admin] Approving User: ${userId}, Tier: ${tier}, ExpiresAt: ${expiresAt?.toISOString()}`);

        const { data, error } = await supabaseAdmin
            .from('users')
            .update({
                membership_tier: tier,
                is_active: true, // Force active
                expires_at: expiresAt!.toISOString(),
                payment_amount: paymentAmount,
                approved_at: now.toISOString(),
                approved_by: 'admin_api'
            })
            .eq('id', userId)
            .select();

        if (error) {
            console.error('[Admin] Update Error:', error);
            throw error;
        }

        console.log('[Admin] Update Result:', data);

        if (!data || data.length === 0) {
            console.error('[Admin] No rows updated. User ID might be wrong or RLS policy blocked it.');
            throw new Error('User not found or RLS blocked update (Check Service Role Key)');
        }

        // [ENTERPRISE] Audit Log (Who Appoved Whom and Why)
        await supabaseAdmin.from('security_logs').insert({
            action_type: 'APPROVE_USER',
            target_user_id: userId,
            admin_id: 'system_admin',
            details: { tier, expiresAt: expiresAt!.toISOString(), payment: paymentAmount },
            ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        });

        return NextResponse.json({ success: true, expiresAt: expiresAt!.toISOString() });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
