import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { removePendingWireTransfer, recordApprovedUser } from '@/lib/pendingWireTransfers';
import { z } from 'zod';

const ApproveSchema = z.object({
    userId: z.string().min(1),
    name: z.string().optional(),
    depositorName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
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

        const { userId, tier: rawTier = '', name = '', depositorName = '', phone = '', email = '' } = result.data;
        const effectiveName = (depositorName || name || '').replace('[입금신청]', '').trim();
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

        console.log(`[Admin] Approving User: ${userId} (${effectiveName}), Tier: ${tier}, Active: ${isActiveExplicit}`);

        // Build update object with name/phone preservation
        const updatePayload: any = {
            id: userId,
            membership_tier: tier,
            is_active: isActiveExplicit,
            expires_at: expiresAt!.toISOString(),
            payment_amount: paymentAmount,
            chat_turns_left: chatTurnsLeft,
            approved_at: now.toISOString(),
            approved_by: 'admin_api'
        };
        if (effectiveName) updatePayload.name = effectiveName;
        if (phone) updatePayload.phone = phone;
        if (email && email.includes('@')) updatePayload.email = email;

        // 1. Try updating Supabase users by ID
        try {
            await supabaseAdmin
                .from('users')
                .upsert(updatePayload, { onConflict: 'id' });
        } catch (dbErr) {
            console.warn('[AdminApprove] Supabase upsert error by id:', dbErr);
        }

        // 2. Also update by name in Supabase users if name is present
        if (effectiveName) {
            try {
                await supabaseAdmin
                    .from('users')
                    .update({
                        membership_tier: tier,
                        is_active: isActiveExplicit,
                        expires_at: expiresAt!.toISOString(),
                        chat_turns_left: chatTurnsLeft,
                        approved_at: now.toISOString()
                    })
                    .ilike('name', `%${effectiveName}%`);
            } catch (nameErr) {
                console.warn('[AdminApprove] Supabase update by name notice:', nameErr);
            }
        }

        // 3. Mark as approved in pending memory store & record to approved cache
        if (isActiveExplicit) {
            removePendingWireTransfer(userId);
            recordApprovedUser({
                userId,
                name: effectiveName,
                phone,
                tier
            });
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
