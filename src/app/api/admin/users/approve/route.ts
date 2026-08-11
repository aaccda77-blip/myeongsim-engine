import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { removePendingWireTransfer } from '@/lib/pendingWireTransfers';
import { z } from 'zod';

const ApproveSchema = z.object({
    userId: z.string().min(1), // Accept valid string or UUID
    tier: z.enum(['TRIAL_30M', 'PASS_24H', 'VIP_7D', 'CHAT_3'])
});

export async function POST(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const result = ApproveSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid Input', details: result.error.issues }, { status: 400 });
        }

        const { userId, tier } = result.data;
        const now = new Date();
        let expiresAt: Date | null = null;
        let paymentAmount = 890;

        switch (tier) {
            case 'TRIAL_30M':
                expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
                paymentAmount = 890;
                break;
            case 'PASS_24H':
                expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                paymentAmount = 890;
                break;
            case 'VIP_7D':
                expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                paymentAmount = 890;
                break;
            case 'CHAT_3':
                expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days valid for 3 chat uses
                paymentAmount = 890;
                break;
        }

        console.log(`[Admin] Approving User: ${userId}, Tier: ${tier}`);

        // Try updating Supabase users
        const { data, error } = await supabaseAdmin
            .from('users')
            .upsert({
                id: userId,
                membership_tier: tier,
                is_active: true, // Force active
                expires_at: expiresAt!.toISOString(),
                payment_amount: paymentAmount,
                chat_turns_left: 3,
                approved_at: now.toISOString(),
                approved_by: 'admin_api'
            }, { onConflict: 'id' })
            .select();

        // Also clean up from pending memory store
        removePendingWireTransfer(userId);

        return NextResponse.json({ success: true, expiresAt: expiresAt!.toISOString() });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
