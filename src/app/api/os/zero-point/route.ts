import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || userId === 'anonymous') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Fetch the user's daily matrix entries for the last 7 days
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    
    // 7 days ago
    const sevenDaysAgo = new Date(kstDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateLimitString = sevenDaysAgo.toISOString().split('T')[0];

    const { data: matrices, error } = await supabaseAdmin
      .from('user_daily_matrix')
      .select('date, is_aligned')
      .eq('user_id', userId)
      .gte('date', dateLimitString)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching zero point data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch zero point data' },
        { status: 500 }
      );
    }

    // 2. Calculate the zero point score
    let score = 50; // Default base score if no data
    let status = 'Agitated';
    let alignedCount = 0;
    
    // We only evaluate based on days they actually generated a matrix.
    const totalMatrices = matrices?.length || 0;

    if (totalMatrices > 0) {
      alignedCount = matrices.filter((m: any) => m.is_aligned).length;
      score = Math.round((alignedCount / totalMatrices) * 100);
    }

    // Determine Tier
    if (score >= 90) {
      status = 'Transcendence';
    } else if (score >= 70) {
      status = 'Stable';
    } else if (score >= 40) {
      status = 'Agitated';
    } else {
      status = 'Chaos';
    }

    // Generate color mapping
    let color = '#10b981'; // Emerald (Stable)
    if (status === 'Transcendence') color = '#6366f1'; // Indigo
    if (status === 'Agitated') color = '#f59e0b'; // Amber
    if (status === 'Chaos') color = '#e11d48'; // Rose

    const zeroPointData = [
      { name: '에고', uv: 100 - score, fill: status === 'Chaos' || status === 'Agitated' ? color : '#334155' }, 
      { name: '영점', uv: score, fill: status === 'Transcendence' || status === 'Stable' ? color : '#94a3b8' },
    ];

    return NextResponse.json({ 
      success: true, 
      score,
      status,
      color,
      totalAnalyzedDays: totalMatrices,
      alignedDays: alignedCount,
      chartData: zeroPointData
    });

  } catch (error: any) {
    console.error('Unexpected error in zero point stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
