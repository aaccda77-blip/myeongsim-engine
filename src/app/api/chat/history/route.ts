import { coachingService } from '@/services/coachingService';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const sessionId = searchParams.get('sessionId'); // [New]

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Fetch history from DB
        const logs = await coachingService.getChatHistory(userId, 50, sessionId || undefined);

        // Map to frontend format
        const history = logs.map((log: any) => ({
            id: log.id,
            role: log.role,
            content: log.content,
            createdAt: log.created_at,
            metadata: log.metadata || {}
        }));

        return NextResponse.json({ messages: history });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
