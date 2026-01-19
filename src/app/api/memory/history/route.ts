import { NextRequest, NextResponse } from 'next/server';
import { MemoryServiceModule } from '@/modules/MemoryService';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const history = await MemoryServiceModule.fetchRecentChatLogs(userId);
        return NextResponse.json({ history });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, role, message, stage } = body;

        if (!userId || !role || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await MemoryServiceModule.saveChatLog(userId, role, message, stage || 1);

        // Also save to Vector DB for Long-Term Memory (RAG) context if it's a completed interaction
        // For now, we mainly focus on chat_logs persistence.

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
