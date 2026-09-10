import { NextRequest, NextResponse } from 'next/server';
import { syncSmartStoreOrders } from '@/lib/naverCommerceApi';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const days = Number(body.days) || 14;

        const result = await syncSmartStoreOrders(days);

        return NextResponse.json({
            success: result.success,
            message: result.message,
            syncedCount: result.syncedCount,
            orders: result.orders
        });
    } catch (error: any) {
        console.error('[Admin Sync SmartStore Error]:', error);
        return NextResponse.json({
            success: false,
            message: error.message || '스마트스토어 주문 동기화 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const result = await syncSmartStoreOrders(7);
        return NextResponse.json({
            success: result.success,
            message: result.message,
            syncedCount: result.syncedCount
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || '동기화 오류'
        }, { status: 500 });
    }
}
