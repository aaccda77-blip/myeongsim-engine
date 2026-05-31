import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const userId = searchParams.get('userId');

    // 1. 공통 힐링 포스트 가져오기
    const { data: globalPosts, error: globalError } = await supabaseAdmin
      .from('healing_posts')
      .select('id, date_string, theme, created_at')
      .order('date_string', { ascending: false })
      .limit(limit);

    if (globalError) throw globalError;

    let mergedPosts = [...(globalPosts || [])];

    // 2. 유저가 로그인해 있다면 개인 맞춤형 포스트도 가져와서 병합
    if (userId && userId !== 'anonymous') {
      const { data: userPosts, error: userError } = await supabaseAdmin
        .from('user_healing_posts')
        .select('id, date_string, theme, created_at')
        .eq('user_id', userId)
        .order('date_string', { ascending: false })
        .limit(limit);

      if (!userError && userPosts && userPosts.length > 0) {
        // 개인 포스트가 있다면 병합 시작 (날짜가 겹치면 개인 포스트를 우선시)
        const postMap = new Map<string, any>();
        
        // 공통 글들을 먼저 맵에 넣고
        mergedPosts.forEach(p => postMap.set(p.date_string, { ...p, isPersonal: false }));
        
        // 개인 글들을 덮어쓰기하여 진짜 맞춤 글이 노출되게 함!
        userPosts.forEach(p => postMap.set(p.date_string, { ...p, isPersonal: true }));
        
        // 다시 날짜 역순으로 정렬해서 리스트화
        mergedPosts = Array.from(postMap.values())
          .sort((a, b) => b.date_string.localeCompare(a.date_string))
          .slice(0, limit);
      }
    }

    return NextResponse.json(mergedPosts);
  } catch (error) {
    console.error("Failed to fetch healing board archives:", error);
    return NextResponse.json({ error: "Failed to fetch archives" }, { status: 500 });
  }
}
