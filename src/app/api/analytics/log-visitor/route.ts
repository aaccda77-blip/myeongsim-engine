import { NextRequest, NextResponse } from 'next/server';

// In-memory visitor store for daily unique visitors & total pageviews
const visitorStore = {
    today: new Date().toISOString().split('T')[0],
    uniqueIps: new Set<string>(),
    pageviews: 0,
};

export async function POST(req: NextRequest) {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        if (visitorStore.today !== todayStr) {
            visitorStore.today = todayStr;
            visitorStore.uniqueIps.clear();
            visitorStore.pageviews = 0;
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'guest-ip';
        visitorStore.uniqueIps.add(ip);
        visitorStore.pageviews += 1;

        return NextResponse.json({
            success: true,
            todayVisitors: visitorStore.uniqueIps.size,
            todayPageviews: visitorStore.pageviews,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET() {
    const todayStr = new Date().toISOString().split('T')[0];
    if (visitorStore.today !== todayStr) {
        visitorStore.today = todayStr;
        visitorStore.uniqueIps.clear();
        visitorStore.pageviews = 0;
    }
    return NextResponse.json({
        todayVisitors: Math.max(1, visitorStore.uniqueIps.size),
        todayPageviews: Math.max(1, visitorStore.pageviews),
    });
}
