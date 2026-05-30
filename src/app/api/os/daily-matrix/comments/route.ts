import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// 1) GET: 특정 날짜의 기록 가져오기
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId || userId === 'anonymous') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // 최신 글이 위로 오도록 내림차순 정렬
    const { data, error } = await supabaseAdmin
      .from('daily_matrix_comments')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matrix comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Unexpected error in getting matrix comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2) POST: 새로운 기록 작성하기
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, date, content } = body;

    if (!userId || userId === 'anonymous') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!date || !content || content.trim() === '') {
      return NextResponse.json({ error: 'Date and content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('daily_matrix_comments')
      .insert([
        {
          user_id: userId,
          date: date,
          content: content.trim()
        }
      ])
      .select();

    if (error) {
      console.error('Error saving matrix comment:', error);
      return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });

  } catch (error: any) {
    console.error('Unexpected error in saving matrix comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
