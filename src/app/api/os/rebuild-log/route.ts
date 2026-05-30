import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('user_rebuilding_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Failed to fetch rebuilding logs:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bugReport, selfPraise } = body;

    if (!userId || !bugReport || !selfPraise) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kstDate.toISOString().split('T')[0];

    const { data, error } = await supabaseAdmin
      .from('user_rebuilding_logs')
      .insert([{
        user_id: userId,
        date_string: dateString,
        bug_report: bugReport,
        self_praise: selfPraise
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Failed to post rebuilding log:", error);
    return NextResponse.json({ error: error.message || "Failed to post log" }, { status: 500 });
  }
}
