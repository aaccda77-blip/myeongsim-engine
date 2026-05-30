import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    if (!userId || userId === 'anonymous') {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('user_frequency_shifts')
      .select('id, date_string, content, created_at')
      .eq('user_id', userId)
      .order('date_string', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const formattedData = data.map((item: any) => ({
      id: item.id,
      date_string: item.date_string,
      dailyKeyword: item.content?.dailyKeyword || '키워드 없음',
      targetOS: item.content?.targetOS || '알 수 없음',
      created_at: item.created_at
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Failed to fetch frequency board:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
