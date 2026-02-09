import { NextRequest, NextResponse } from 'next/server';
import { MemoryServiceModule } from '@/modules/MemoryService';
import { requireAuth } from '@/lib/auth';

export const GET = requireAuth(async (req: NextRequest, auth) => {
    try {
        // Use authenticated user ID instead of query param
        const history = await MemoryServiceModule.fetchRecentChatLogs(auth.userId);
        return NextResponse.json({ history });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});

export const POST = requireAuth(async (req: NextRequest, auth) => {
    try {
        const body = await req.json();
        const { role, message, stage } = body;

        if (!role || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use authenticated user ID
        await MemoryServiceModule.saveChatLog(auth.userId, role, message, stage || 1);

        // Also save to Vector DB for Long-Term Memory (RAG) context if it's a completed interaction
        // For now, we mainly focus on chat_logs persistence.

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
