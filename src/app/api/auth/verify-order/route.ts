import { NextRequest, NextResponse } from 'next/server';
import { verifySmartStoreOrder } from '@/lib/orderVerification';
import { rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const orderLimiter = rateLimit({
    interval: 60 * 1000, // 1분
    maxRequests: 10 // 1분에 최대 10회
});

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
        const rateCheck = orderLimiter.check(`order-${ip}`);
        if (!rateCheck.success) {
            return NextResponse.json({
                success: false,
                message: '너무 많은 인증 시도가 발생했습니다. 1분 후 다시 시도해 주세요.'
            }, { status: 429 });
        }

        const body = await req.json().catch(() => ({}));
        const { orderNumber = '', userId = '', depositorName = '', channel } = body;

        if (!orderNumber || typeof orderNumber !== 'string') {
            return NextResponse.json({
                success: false,
                message: '도서 구매 주문번호 또는 영수증 승인번호를 입력해 주세요.'
            }, { status: 400 });
        }

        // 입력값 길이 안전성 검증 (최대 64자)
        if (orderNumber.length > 64) {
            return NextResponse.json({
                success: false,
                message: '유효하지 않은 형식의 주문번호입니다.'
            }, { status: 400 });
        }

        const isMaster = orderNumber.toUpperCase().includes('CHEONGRYU-MASTER') || orderNumber.toUpperCase().includes('VIP-FREEPASS');

        // 관리자 대기열 등록 (입력만으로 자동 해제 방지, 관리자 승인 필요)
        const { addPendingWireTransfer } = await import('@/lib/pendingWireTransfers');
        await addPendingWireTransfer({
            depositorName: depositorName || `도서구매(${orderNumber.slice(-6)})`,
            userId: userId || orderNumber,
            amount: 0,
            itemType: 'BOOK_ZERO_POINT',
            orderName: `도서구매인증: ${orderNumber}`
        });

        if (!isMaster) {
            // 일반 독자의 경우 관리자 승인 대기
            return NextResponse.json({
                success: false,
                pendingApproval: true,
                message: '도서 구매 주문번호가 접수되었습니다! 관리자가 구매 내역 확인 후 수분 내에 [열어주기 (승인)]를 완료합니다.'
            }, { status: 202 });
        }

        const result = await verifySmartStoreOrder(orderNumber, userId, depositorName, channel);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: result.message
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            record: result.record
        });
    } catch (error: any) {
        console.error('[Verify Order Error]:', error);
        return NextResponse.json({
            success: false,
            message: '주문번호 인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요.'
        }, { status: 500 });
    }
}
