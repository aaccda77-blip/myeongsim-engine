import { NextRequest, NextResponse } from 'next/server';
import { isOrderBlocked, getBlockedOrders } from '@/lib/orderVerification';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const order = searchParams.get('order')?.trim();

        if (!order) {
            return NextResponse.json({
                success: true,
                blocked: false,
            });
        }

        const blocked = isOrderBlocked(order);
        const blockedList = getBlockedOrders();
        const matched = blockedList.find(b => b.orderNumber.toUpperCase() === order.toUpperCase());

        return NextResponse.json({
            success: true,
            order,
            blocked,
            reason: matched ? matched.reason : null,
            blockedAt: matched ? matched.blockedAt : null,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            blocked: false,
            error: error.message,
        }, { status: 500 });
    }
}
