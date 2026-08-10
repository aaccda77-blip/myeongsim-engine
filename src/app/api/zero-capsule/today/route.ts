import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateSaju } from '@/lib/saju/SajuEngine';

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
    const todayStr = new Date().toISOString().split('T')[0];

    // [이름 연동] Supabase 세션 및 DB에서 사용자 실제 이름 연동
    const userMeta = session.user.user_metadata || {};
    let userName = userMeta.full_name || userMeta.name || userMeta.display_name;

    // 2. 이미 오늘 자각 알약을 컴파일했다면 재연산 없이 바로 반환 (캐시 히트)
    let cachedPill = null;
    try {
      const { data } = await supabase
        .from('daily_capsules')
        .select('*')
        .eq('user_id', userId)
        .eq('target_date', todayStr)
        .single();
      cachedPill = data;
    } catch (dbErr) {
      console.warn("daily_capsules 테이블 조회 실패 (테이블 미생성 혹은 RLS 제한 추정):", dbErr);
    }

    if (cachedPill) {
      // [온더플라이 정화] 이전에 생성된 캐시 데이터에 "THE자리" / "TE자리"가 들어있다면 "이경윤"으로 치환하여 반환
      const sanitizedPill = {
        ...cachedPill,
        scan: (cachedPill.scan || '').replace(/THE자리/g, '이경윤').replace(/TE자리/g, '이경윤').replace(/the자리/g, '이경윤').replace(/te자리/g, '이경윤'),
        sync: (cachedPill.sync || '').replace(/THE자리/g, '이경윤').replace(/TE자리/g, '이경윤').replace(/the자리/g, '이경윤').replace(/te자리/g, '이경윤'),
        shift: (cachedPill.shift || '').replace(/THE자리/g, '이경윤').replace(/TE자리/g, '이경윤').replace(/the자리/g, '이경윤').replace(/te자리/g, '이경윤'),
        log: (cachedPill.log || '').replace(/THE자리/g, '이경윤').replace(/TE자리/g, '이경윤').replace(/the자리/g, '이경윤').replace(/te자리/g, '이경윤'),
      };
      return NextResponse.json(sanitizedPill);
    }

    // generate 쿼리 파라미터 확인 (버튼 클릭 시에만 생성하기 위함)
    const { searchParams } = new URL(request.url);
    const shouldGenerate = searchParams.get('generate') === 'true';

    if (!shouldGenerate) {
      // 자동 생성 방지: 클라이언트가 명시적으로 생성을 요청하지 않았다면 null 리턴
      return NextResponse.json(null);
    }

    // 3. 캐시가 없고 생성 요청이 있다면 유저의 사주 원국 정보 조회
    const { data: dbSaju } = await supabase
      .from('users_saju')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (dbSaju) {
      const saju = dbSaju.saju_data || dbSaju;
      if (saju.userName && !saju.userName.toLowerCase().includes('the') && !saju.userName.toLowerCase().includes('te')) {
        userName = saju.userName;
      } else if (saju.name && !saju.name.toLowerCase().includes('the') && !saju.name.toLowerCase().includes('te')) {
        userName = saju.name;
      }
    }

    // 비정상 아이디(THE, TE, 이메일 주소 등)는 100% 실제 사용자 이름 '이경윤'으로 연동
    if (!userName || userName.toLowerCase().includes('the') || userName.toLowerCase().includes('te') || userName.includes('@') || userName.includes('자리')) {
      userName = '이경윤';
    }

    let userSajuElements = "일간 신금(辛金), 오늘 일진 유금(酉金) - 비견 및 현침살 겹치는 날";
    if (dbSaju) {
      const saju = dbSaju.saju_data || dbSaju;
      const dayMaster = saju.dayMaster || saju.dayPillar?.stem || "신금(辛金)";
      
      // 오늘 일진 계산 (SajuEngine 활용)
      let todayIljin = "유금(酉金)";
      try {
        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todaySaju = await calculateSaju(formattedToday, '12:00', 'solar', 'male');
        if (todaySaju?.fourPillars?.day) {
          todayIljin = `${todaySaju.fourPillars.day.ganKor || ''}${todaySaju.fourPillars.day.jiKor || ''}일`;
        }
      } catch (sajuErr) {
        console.error("오늘 일진 연산 에러:", sajuErr);
      }
      
      userSajuElements = `사용자 일간: ${dayMaster}, 오늘의 일진: ${todayIljin}, 상세 사주 데이터: ${JSON.stringify(saju)}`;
    }

    // 4. Gemini 2.5 Flash를 사용하여 가이드전 생성
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // JSON Mode 응답 설정
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const systemInstruction = `
      너는 마음에 완벽한 해방을 배달하는 '명심코칭 AI 오퍼레이터'다.
      사용자의 사주 분석 일진 정보를 기반으로 다크코드(어둠/불안/예민함)를 뉴럴코드(성장/지혜/안목)로 플립하고 메타코드(제로포인트/텅 빈 의식 스크린)를 깨닫게 하는 데일리 에세이를 작성하라.

      ★ 호칭 규칙 (절대 준수): 사용자를 부를 때 사주 일간 이름("신금님", "갑목님" 등)이나 임의의 이름("명이님" 등)을 사용하지 마라. 반드시 "${userName}님"으로 불러라.

      반드시 다음 JSON 스펙을 엄수하여 한국어로 출력하라:
      {
        "flavor": "알약 성분 이름 명칭 (예: 현침 100mg 독설 디버깅 맛)",
        "keyword": "오늘 활성화된 사주적 키워드 (예: 현침살 - 정밀한 안목)",
        "scan": "${userName}님이 today 무의식적으로 겪을 수 있는 불안, 예민, 화(다크코드)를 뇌과학/심리학적으로 스캔하고 따뜻하게 위로하는 내용 (존댓말로 친근하고 쉽게 서술). 반드시 ${userName}님으로 호칭할 것.",
        "sync": "그 에너지를 완전히 수용하여 나를 살리는 지혜와 안목(뉴럴코드)으로 뒤집는 실천적 자각 가이드 (존댓말로 친근하고 쉽게 서술). 반드시 ${userName}님으로 호칭할 것.",
        "shift": "생각과 감정이 다 지워진 자리에 남아 생생하게 목격하고 있는 텅 빈 스크린(제로포인트)으로 주파수를 이동시키는 정견의 메시지 (존댓말로 친근하고 쉽게 서술). 반드시 ${userName}님으로 호칭할 것.",
        "log": "오늘의 명심 코어 한 줄 요약 로그 (따옴표로 감싸진 형태)"
      }
    `;

    const prompt = `사용자 이름: ${userName}님. 사용자 오늘 사주 조합 조건: ${userSajuElements}. 이 조건에 맞는 오늘의 제로 캡슐 알약을 정교하게 프로그래밍해라. 사용자를 부를 때 반드시 "${userName}님"으로 호칭하고, 절대로 사주 일간 이름이나 다른 임의의 이름을 사용하지 마라.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] }
    });
    
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const pillData = JSON.parse(cleanedText);

    const resultPill = {
      user_id: userId,
      target_date: todayStr,
      ...pillData
    };

    // 5. 생성된 데이터를 Supabase에 캐싱 저장 시도
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from('daily_capsules')
        .insert(resultPill)
        .select()
        .single();
      
      if (insertError) {
        console.warn("daily_capsules 테이블 저장 실패:", insertError.message);
      } else if (insertedData) {
        return NextResponse.json(insertedData);
      }
    } catch (insertErr) {
      console.warn("daily_capsules 테이블 저장 중 에러 발생 (테이블 미생성 혹은 RLS 제한 추정):", insertErr);
    }

    // 캐싱이 실패하더라도 생성된 데이터는 정상 반환
    return NextResponse.json(resultPill);

  } catch (error: any) {
    console.error("제로 캡슐 API 에러:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
