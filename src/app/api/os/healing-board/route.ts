import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const { data, error } = await supabaseAdmin
      .from('healing_posts')
      .select('id, date_string, theme, created_at')
      .order('date_string', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch healing board archives:", error);
    return NextResponse.json({ error: "Failed to fetch archives" }, { status: 500 });
  }
}
