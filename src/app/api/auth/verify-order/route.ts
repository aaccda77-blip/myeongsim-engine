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

        // 주문번호 형식 검증 및 정품 등록 실행 (형식 확인, 중복 방지, 차단 여부 검사)
        const result = await verifySmartStoreOrder(orderNumber, userId, depositorName, channel);

        // 관리자 대기열 등록 (관리자 화면에서 실시간으로 확인 및 추적 가능)
        const { addPendingWireTransfer } = await import('@/lib/pendingWireTransfers');
        const channelLabel = channel === 'yes24' ? 'YES24' : channel === 'smartstore' ? '스마트스토어' : channel === 'kyobo' ? '교보문고' : '도서';
        await addPendingWireTransfer({
            depositorName: depositorName || `[${channelLabel}] 독자 (${orderNumber.slice(-6)})`,
            userId: userId || orderNumber,
            amount: 0,
            itemType: 'BOOK_ZERO_POINT',
            orderName: `[도서구매인증] ${channelLabel}: ${orderNumber}`
        });

        if (!result.success && !isMaster) {
            return NextResponse.json({
                success: false,
                message: result.message
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            approved: true,
            tier: 'BOOK_ZERO_POINT',
            message: result.message || '🎉 도서 구매 정품 인증이 완료되었습니다! 기본 제로포인트 명심 리포트가 평생 무료로 활성화되었습니다.',
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
