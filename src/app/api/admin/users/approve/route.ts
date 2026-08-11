import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { removePendingWireTransfer } from '@/lib/pendingWireTransfers';
import { z } from 'zod';

const ApproveSchema = z.object({
    userId: z.string().min(1),
    tier: z.string().optional()
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

        const { userId, tier: rawTier = '' } = result.data;
        const now = new Date();
        let expiresAt: Date | null = null;
        let paymentAmount = 890;
        let tier: 'TRIAL_30M' | 'PASS_24H' | 'VIP_7D' | 'CHAT_3' = 'CHAT_3';

        // Flexible Tier Normalization
        const rawTierStr = String(rawTier).toUpperCase();
        if (rawTierStr.includes('TRIAL') || rawTierStr.includes('30분')) {
            tier = 'TRIAL_30M';
        } else if (rawTierStr.includes('PASS') || rawTierStr.includes('24시간')) {
            tier = 'PASS_24H';
        } else if (rawTierStr.includes('VIP') || rawTierStr.includes('7일')) {
            tier = 'VIP_7D';
        } else {
            tier = 'CHAT_3'; // Default 890 KRW 3-Turn Access
        }

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

        console.log(`[Admin] Approving User: ${userId}, Tier: ${tier} (raw: ${rawTier})`);

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

        return NextResponse.json({ success: true, tier, expiresAt: expiresAt!.toISOString() });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
