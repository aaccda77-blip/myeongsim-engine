import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Supabase 서버 클라이언트 생성 및 현재 유저 확인
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // 세션이 없다면 401 Unauthorized 리턴
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. daily_capsules 테이블에서 해당 유저의 모든 이력을 최근 순으로 정렬하여 조회
    const { data, error } = await supabase
      .from('daily_capsules')
      .select('*')
      .eq('user_id', userId)
      .order('target_date', { ascending: false });

    if (error) {
      throw error;
    }

    const rawData = data || [];
    const fixedData = rawData.map((pill: any) => {
      const fixText = (text: string) => {
        if (!text || typeof text !== 'string') return text;
        return text.replace(/이윤님/g, '이경윤님');
      };
      return {
        ...pill,
        flavor: fixText(pill.flavor),
        keyword: fixText(pill.keyword),
        scan: fixText(pill.scan),
        sync: fixText(pill.sync),
        shift: fixText(pill.shift),
        log: fixText(pill.log)
      };
    });

    return NextResponse.json(fixedData);
  } catch (error: any) {
    console.error("제로 캡슐 히스토리 API 에러:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
