import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use service role since we verify session via requireAuth
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const GET = requireAuth(async (req: NextRequest, auth) => {
    try {
        const userId = auth.userId;
        const sessionIdParam = req.nextUrl.searchParams.get('sessionId');

        if (!userId || userId.startsWith('guest-')) {
            return NextResponse.json({ messages: [], sessionId: null });
        }

        let targetSessionId = sessionIdParam;

        // If no sessionId is provided, find the most recent one for this user
        if (!targetSessionId) {
            const { data: latestLog, error: latestError } = await supabase
                .from('myeongsim_chat_logs')
                .select('session_id')
                .eq('user_id', userId)
                .not('session_id', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (!latestError && latestLog && latestLog.session_id) {
                targetSessionId = latestLog.session_id;
            }
        }

        let query = supabase
            .from('myeongsim_chat_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50); // increased limit to 50 for a full session

        if (targetSessionId) {
            query = query.eq('session_id', targetSessionId);
        } else {
            // If there's no session ID at all (legacy data), just fetch the latest 50 legacy messages
            query = query.is('session_id', null);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[Myeongsim Chat History] Fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
        }

        // Format to align with ai/react useChat `Message` interface
        const messages = (data || []).reverse().map((log: any) => ({
            id: log.id,
            role: log.role,
            content: log.content,
            createdAt: log.created_at
        }));

        return NextResponse.json({ 
            messages, 
            sessionId: targetSessionId || null 
        });

    } catch (error: any) {
        console.error('[Myeongsim Chat History] API Error:', error);
        return NextResponse.json(
            { error: '명심 AI 챗봇 히스토리 로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
});
