import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    if (!userId || userId === 'anonymous') {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // 최신순으로 생성된 리포트 목록 가져오기
    const { data, error } = await supabaseAdmin
      .from('user_debugging_reports')
      .select('id, date_string, content, created_at')
      .eq('user_id', userId)
      .order('date_string', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // 목록 렌더링에 필요한 핵심 데이터만 추출
    const formattedData = data.map((item: any) => ({
      id: item.id,
      date_string: item.date_string,
      dailyKeyword: item.content?.dailyKeyword || '키워드 없음',
      targetOS: item.content?.targetOS || '알 수 없음',
      created_at: item.created_at
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Failed to fetch debugging board:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
