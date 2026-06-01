import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_108_reports')
            .select('page_key, generated_content')
            .eq('user_id', userId);

        if (error) {
            console.error('Supabase GET Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Convert array to a record map: { P01: {...}, P02: {...} }
        const reportsMap = data.reduce((acc, row) => {
            acc[row.page_key] = row.generated_content;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({ success: true, reports: reportsMap });
    } catch (err: any) {
        console.error('GET /api/coaching/108-reports error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, pageKey, generatedContent } = body;

        if (!userId || !pageKey || !generatedContent) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('user_108_reports')
            .upsert(
                {
                    user_id: userId,
                    page_key: pageKey,
                    generated_content: generatedContent
                },
                { onConflict: 'user_id,page_key' }
            );

        if (error) {
            console.error('Supabase POST Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('POST /api/coaching/108-reports error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
