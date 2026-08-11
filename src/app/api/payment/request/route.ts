import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { depositorName, amount = 890, userId, itemType = 'CHAT_3' } = body;

        if (userId && !userId.startsWith('guest-')) {
            await supabaseAdmin
                .from('users')
                .update({
                    membership_tier: itemType,
                    is_active: false, // Wait for admin approval
                    payment_amount: amount,
                    created_at: new Date().toISOString(),
                })
                .eq('id', userId);
        }

        return NextResponse.json({
            success: true,
            message: '무통장 입금 승인 신청이 접수되었습니다. 관리자 확인 후 1~5분 이내 3회가 충전됩니다.',
            bankInfo: {
                bank: '토스뱅크',
                accountNumber: '1002-6847-4899',
                accountHolder: '마인드플로우랩',
                amount: 890,
            }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
