import { NextRequest, NextResponse } from 'next/server';
import { addPendingWireTransfer } from '@/lib/pendingWireTransfers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { 
            depositorName = '', 
            amount = 98000, 
            userId = '', 
            itemType = 'MONTHLY_98K', 
            orderName = '특허출원기념 월정액 98,000원 ALL-PASS',
            productName = '' 
        } = body;

        const effectiveOrderName = productName || orderName;

        if (!depositorName.trim()) {
            return NextResponse.json({ error: '입금자 성함 또는 연락처를 입력해 주세요.' }, { status: 400 });
        }

        // Store pending wire transfer request securely in DB + Memory Store
        const pendingItem = await addPendingWireTransfer({
            depositorName: depositorName.trim(),
            userId,
            amount: Number(amount) || 98000,
            itemType: itemType || 'MONTHLY_98K',
            orderName: effectiveOrderName,
        });

        return NextResponse.json({
            success: true,
            message: '무통장 입금 승인 신청이 성공적으로 접수되었습니다. 관리자 확인 후 즉시 124개 전 서비스가 활성화됩니다.',
            pendingItem,
            bankInfo: {
                bank: '카카오뱅크',
                accountNumber: '3333-01-2345678',
                accountHolder: '청류 이경윤',
                amount: Number(amount) || 98000,
            }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
