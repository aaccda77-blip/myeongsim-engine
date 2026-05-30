import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const dateString = searchParams.get('dateString');

    if (!userId || !dateString) {
      return NextResponse.json({ success: false, error: 'userId and dateString are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('user_frequency_worksheets')
      .select('worksheet_text')
      .eq('user_id', userId)
      .eq('date_string', dateString)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json({ success: true, text: data?.worksheet_text || '' });
  } catch (error: any) {
    console.error('Failed to GET frequency worksheet:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, dateString, text } = await req.json();

    if (!userId || !dateString) {
      return NextResponse.json({ success: false, error: 'userId and dateString are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('user_frequency_worksheets')
      .upsert(
        { user_id: userId, date_string: dateString, worksheet_text: text, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,date_string' }
      )
      .select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Failed to POST frequency worksheet:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
