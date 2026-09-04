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
        const isActiveExplicit = (body as any).isActive !== undefined ? Boolean((body as any).isActive) : true;
        const now = new Date();
        let expiresAt: Date | null = null;
        let paymentAmount = 98000;
        let chatTurnsLeft = 30;
        let tier: string = 'MONTHLY_98K';

        // Flexible Tier Normalization
        const rawTierStr = String(rawTier).toUpperCase();
        if (rawTierStr.includes('LOCK') || isActiveExplicit === false) {
            tier = 'GUEST';
            paymentAmount = 0;
            chatTurnsLeft = 0;
            expiresAt = now;
        } else if (rawTierStr.includes('98000') || rawTierStr.includes('98,000') || rawTierStr.includes('MONTHLY') || rawTierStr.includes('월정액')) {
            tier = 'MONTHLY_98K';
            expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30일 올패스
            paymentAmount = 98000;
            chatTurnsLeft = 50;
        } else if (rawTierStr.includes('BOOK') || rawTierStr.includes('도서') || rawTierStr.includes('ZERO_POINT')) {
            tier = 'BOOK_ZERO_POINT';
            expiresAt = new Date(now.getTime() + 365 * 10 * 24 * 60 * 60 * 1000); // 10년 (평생)
            paymentAmount = 19800;
            chatTurnsLeft = 20;
        } else if (rawTierStr.includes('STARTUP') || rawTierStr.includes('19800') || rawTierStr.includes('19,800') || rawTierStr.includes('스타트업')) {
            tier = 'STARTUP_VIP';
            expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1년
            paymentAmount = 19800;
            chatTurnsLeft = 20;
        } else if (rawTierStr.includes('TRIAL') || rawTierStr.includes('30분')) {
            tier = 'TRIAL_30M';
            expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
            paymentAmount = 4900;
            chatTurnsLeft = 3;
        } else if (rawTierStr.includes('PASS') || rawTierStr.includes('24시간')) {
            tier = 'PASS_24H';
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            paymentAmount = 4900;
            chatTurnsLeft = 3;
        } else {
            tier = 'MONTHLY_98K';
            expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            paymentAmount = 98000;
            chatTurnsLeft = 50;
        }

        console.log(`[Admin] Approving User: ${userId}, Tier: ${tier} (raw: ${rawTier}), Active: ${isActiveExplicit}`);

        // Try updating Supabase users
        const { data, error } = await supabaseAdmin
            .from('users')
            .upsert({
                id: userId,
                membership_tier: tier,
                is_active: isActiveExplicit,
                expires_at: expiresAt!.toISOString(),
                payment_amount: paymentAmount,
                chat_turns_left: chatTurnsLeft,
                approved_at: now.toISOString(),
                approved_by: 'admin_api'
            }, { onConflict: 'id' })
            .select();

        // Mark as approved in pending memory store as well
        if (isActiveExplicit) {
            removePendingWireTransfer(userId);
        }

        return NextResponse.json({
            success: true,
            tier,
            isActive: isActiveExplicit,
            chatTurnsLeft,
            unlockedModules: (tier === 'MONTHLY_98K' || tier === 'STARTUP_VIP')
                ? ['all_pass', 'watch_9_dials', 'bio_care', 'zero_music', 'coaching_50', 'report_108']
                : tier === 'BOOK_ZERO_POINT'
                ? ['book_zero_point', 'today_fortune', 'basic_report']
                : [],
            expiresAt: expiresAt!.toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
