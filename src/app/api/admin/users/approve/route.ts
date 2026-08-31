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
        let paymentAmount = 4900;
        let chatTurnsLeft = 3;
        let tier: 'TRIAL_30M' | 'PASS_24H' | 'VIP_7D' | 'CHAT_PASS' | 'STARTUP_VIP' = 'CHAT_PASS';

        // Flexible Tier Normalization
        const rawTierStr = String(rawTier).toUpperCase();
        if (rawTierStr.includes('STARTUP') || rawTierStr.includes('19800') || rawTierStr.includes('19,800') || rawTierStr.includes('스타트업')) {
            tier = 'STARTUP_VIP';
        } else if (rawTierStr.includes('TRIAL') || rawTierStr.includes('30분')) {
            tier = 'TRIAL_30M';
        } else if (rawTierStr.includes('PASS') || rawTierStr.includes('24시간')) {
            tier = 'PASS_24H';
        } else if (rawTierStr.includes('VIP') || rawTierStr.includes('7일') || rawTierStr.includes('BOOK')) {
            tier = 'VIP_7D';
        } else {
            tier = 'CHAT_PASS'; // Default 4,900 KRW Chat Pass
        }

        switch (tier) {
            case 'STARTUP_VIP':
                expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1년
                paymentAmount = 19800;
                chatTurnsLeft = 20;
                break;
            case 'TRIAL_30M':
                expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
                paymentAmount = 4900;
                chatTurnsLeft = 3;
                break;
            case 'PASS_24H':
                expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                paymentAmount = 4900;
                chatTurnsLeft = 3;
                break;
            case 'VIP_7D':
                expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                paymentAmount = 19800;
                chatTurnsLeft = 20;
                break;
            case 'CHAT_PASS':
                expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                paymentAmount = 4900;
                chatTurnsLeft = 3;
                break;
        }

        console.log(`[Admin] Approving User: ${userId}, Tier: ${tier} (raw: ${rawTier}), ChatTurns: ${chatTurnsLeft}`);

        // Try updating Supabase users
        const { data, error } = await supabaseAdmin
            .from('users')
            .upsert({
                id: userId,
                membership_tier: tier,
                is_active: true, // Force active
                expires_at: expiresAt!.toISOString(),
                payment_amount: paymentAmount,
                chat_turns_left: chatTurnsLeft,
                approved_at: now.toISOString(),
                approved_by: 'admin_api'
            }, { onConflict: 'id' })
            .select();

        // Mark as approved in pending memory store as well
        removePendingWireTransfer(userId);

        return NextResponse.json({
            success: true,
            tier,
            chatTurnsLeft,
            unlockedModules: tier === 'STARTUP_VIP'
                ? ['startup_vip', 'dark_code_debugger', 'bio_care', 'zero_music', 'coaching_20']
                : ['coaching_3'],
            expiresAt: expiresAt!.toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
