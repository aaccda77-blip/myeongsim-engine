import { NextRequest, NextResponse } from 'next/server';
import { addPendingWireTransfer } from '@/lib/pendingWireTransfers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { depositorName = '', amount = 890, userId = '', itemType = 'CHAT_3', orderName = '명심코칭 수다 3회 충전권' } = body;

        if (!depositorName.trim()) {
            return NextResponse.json({ error: '입금자 성함 또는 연락처를 입력해 주세요.' }, { status: 400 });
        }

        // Store pending wire transfer request securely in DB + Memory Store
        const pendingItem = await addPendingWireTransfer({
            depositorName: depositorName.trim(),
            userId,
            amount,
            itemType,
            orderName,
        });

        return NextResponse.json({
            success: true,
            message: '무통장 입금 승인 신청이 성공적으로 접수되었습니다. 관리자 확인 후 1~5분 이내 3회가 활성화됩니다.',
            pendingItem,
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
