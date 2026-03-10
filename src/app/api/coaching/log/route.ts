import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { scenarioId, emotionTag, questTitle, userId } = body;

        if (!scenarioId || !emotionTag || !questTitle) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_coaching_logs')
            .insert([
                {
                    user_identifier: userId || 'anonymous',
                    scenario_id: scenarioId,
                    emotion_tag: emotionTag,
                    quest_title: questTitle,
                    quest_status: 'ASSIGNED',
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error (POST coaching/log):', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        console.error('API Error (POST coaching/log):', e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { logId } = body;

        if (!logId) {
            return NextResponse.json({ error: 'Missing logId' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_coaching_logs')
            .update({
                quest_status: 'COMPLETED',
                completed_at: new Date().toISOString()
            })
            .eq('id', logId)
            .select()
            .single();

        if (error) {
            console.error('Supabase Error (PATCH coaching/log):', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        console.error('API Error (PATCH coaching/log):', e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
