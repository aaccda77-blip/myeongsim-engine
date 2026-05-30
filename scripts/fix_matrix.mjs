import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  console.log(`[1] 5월 29일(${dateStr}) 기준 잘못된 매트릭스 데이터 삭제 중...`);

  // 1. Get today's rows
  const { data: rows, error: selectErr } = await supabase
    .from('user_daily_matrix')
    .select('*')
    .eq('date', dateStr);

  if (selectErr) {
    console.error('조회 오류:', selectErr);
    return;
  }

  if (!rows || rows.length === 0) {
    console.log('오늘 자 데이터가 없습니다.');
    return;
  }

  console.log(`발견된 오늘 자 데이터 수: ${rows.length}`);

  for (const row of rows) {
    console.log(`- 유저 ${row.user_id}의 매트릭스 데이터 삭제 중...`);
    await supabase.from('user_daily_matrix').delete().eq('id', row.id);
    
    // 2. Request new matrix for this user with '신'
    console.log(`[2] 유저 ${row.user_id}의 신금(辛金) 데이터 새롭게 생성 요청 중...`);
    try {
      const res = await fetch('https://myeongsim-report.vercel.app/api/os/my-daily-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: row.user_id, dayMaster: '신' })
      });
      const resData = await res.json();
      if (resData.success) {
        console.log('✅ 신금 매트릭스 생성 성공!');
      } else {
        console.log('❌ 생성 실패:', resData);
      }
    } catch (e) {
      console.error('API 호출 중 오류:', e);
    }
  }
}

run();
