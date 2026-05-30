import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId || userId === 'anonymous') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Determine today's date in KST
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const dateString = kstDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // 3. Mark the matrix for today as aligned
    const { data, error } = await supabaseAdmin
      .from('user_daily_matrix')
      .update({ is_aligned: true })
      .eq('user_id', userId)
      .eq('date', dateString)
      .select();

    if (error) {
      console.error('Error updating zero point alignment:', error);
      return NextResponse.json(
        { error: 'Failed to update alignment status' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      // If no matrix exists for today yet, we can't align it. 
      return NextResponse.json(
        { error: 'No daily matrix found for today' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Zero point aligned successfully for today.',
      data: data[0]
    });

  } catch (error: any) {
    console.error('Unexpected error in zero point alignment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
