import { coachingService } from '@/services/coachingService';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const GET = requireAuth(async (req: NextRequest, auth) => {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId'); // [New]

        // Use authenticated user ID instead of query param
        const userId = auth.userId;

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
});
