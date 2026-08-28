import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateSaju } from '@/lib/saju/SajuEngine';

export const dynamic = 'force-dynamic';

async function handleCapsuleRequest(request: Request, isPost: boolean = false) {
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

    // 요청 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const shouldGenerate = isPost || searchParams.get('generate') === 'true';

    let bodyData: any = {};
    if (isPost) {
      bodyData = await request.json().catch(() => ({}));
    }

    // 2. 이미 오늘 자각 알약을 컴파일했다면 재연산 없이 바로 반환 (캐시 히트)
    let cachedPill = null;
    try {
      const { data } = await supabase
        .from('daily_capsules')
        .select('*')
        .eq('user_id', userId)
        .eq('target_date', todayStr)
        .maybeSingle();
      cachedPill = data;
    } catch (dbErr) {
      console.warn("daily_capsules 테이블 조회 실패:", dbErr);
    }

    if (cachedPill && !searchParams.get('force')) {
      return NextResponse.json(cachedPill);
    }

    if (!shouldGenerate) {
      // 자동 생성 방지: 클라이언트가 명시적으로 생성을 요청하지 않았다면 null 리턴
      return NextResponse.json(null);
    }

    // 3. 사용자 이름 및 사주/온보딩 정보 추출
    const userMeta = session.user.user_metadata || {};
    let userName = bodyData.userName || userMeta.full_name || userMeta.name || userMeta.display_name || '';

    // DB에서 사용자 온보딩 데이터 및 사주 정보 다중 조회
    let birthDate = bodyData.birthDate || '';
    let birthTime = bodyData.birthTime || '12:00';
    let calendarType: 'solar' | 'lunar' = bodyData.calendarType || 'solar';
    let gender: 'male' | 'female' = bodyData.gender || 'female';
    let mbti = bodyData.mbti || '';

    // A. user_onboarding_data 조회
    try {
      const { data: onboardingData } = await supabase
        .from('user_onboarding_data')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (onboardingData) {
        if (!userName && onboardingData.name) userName = onboardingData.name;
        if (!birthDate && onboardingData.birth_date) birthDate = onboardingData.birth_date;
        if (!birthTime && onboardingData.birth_time) birthTime = onboardingData.birth_time;
        if (onboardingData.calendar_type) calendarType = onboardingData.calendar_type;
        if (onboardingData.gender) gender = onboardingData.gender;
        if (!mbti && onboardingData.mbti) mbti = onboardingData.mbti;
      }
    } catch (e) {
      console.warn('[Zero Capsule] user_onboarding_data query notice:', e);
    }

    // B. users_saju 조회 (보조)
    try {
      const { data: dbSaju } = await supabase
        .from('users_saju')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (dbSaju) {
        const saju = dbSaju.saju_data || dbSaju;
        if (!userName && (saju.userName || saju.name)) userName = saju.userName || saju.name;
        if (!birthDate && (saju.birthDate || saju.birth_date)) birthDate = saju.birthDate || saju.birth_date;
        if (!birthTime && (saju.birthTime || saju.birth_time)) birthTime = saju.birthTime || saju.birth_time;
        if (saju.calendarType || saju.calendar_type) calendarType = saju.calendarType || saju.calendar_type;
        if (saju.gender) gender = saju.gender;
      }
    } catch (e) {
      console.warn('[Zero Capsule] users_saju query notice:', e);
    }

    // C. users 테이블 조회 (보조)
    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (dbUser) {
        if (!userName && dbUser.name) userName = dbUser.name;
        if (!birthDate && dbUser.birth_date) birthDate = dbUser.birth_date;
      }
    } catch (e) {
      console.warn('[Zero Capsule] users query notice:', e);
    }

    if (!userName || userName.toLowerCase().includes('the') || userName.toLowerCase().includes('te') || userName.includes('@')) {
      userName = '명심가';
    }

    // 4. 생년월일 기반 실시간 만세력 계산 및 오늘 일진 융합
    let userSajuSummary = '';
    let dayMaster = '신금(辛金)';
    let fourPillarsText = '';

    if (birthDate) {
      try {
        const cleanBirthDate = birthDate.includes('T') ? birthDate.split('T')[0] : birthDate;
        const sajuResult = await calculateSaju(cleanBirthDate, birthTime || '12:00', calendarType, gender);
        if (sajuResult && sajuResult.success && sajuResult.fourPillars) {
          const fp = sajuResult.fourPillars;
          dayMaster = `${fp.day.ganKor}${fp.day.ganElement}(${fp.day.gan})`;
          fourPillarsText = `년주: ${fp.year.ganKor}${fp.year.jiKor}(${fp.year.gan}${fp.year.ji}), 월주: ${fp.month.ganKor}${fp.month.jiKor}(${fp.month.gan}${fp.month.ji}), 일주: ${fp.day.ganKor}${fp.day.jiKor}(${fp.day.gan}${fp.day.ji}), 시주: ${fp.time.ganKor}${fp.time.jiKor}(${fp.time.gan}${fp.time.ji})`;
        }
      } catch (sajuCalcErr) {
        console.error('[Zero Capsule] Saju calculation error:', sajuCalcErr);
      }
    }

    // 오늘 일진 계산
    let todayIljinText = '';
    try {
      const today = new Date();
      const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const todaySaju = await calculateSaju(formattedToday, '12:00', 'solar', 'male');
      if (todaySaju?.fourPillars?.day) {
        todayIljinText = `${todaySaju.fourPillars.day.ganKor}${todaySaju.fourPillars.day.jiKor}일 (${todaySaju.fourPillars.day.ganElement} 기운)`;
      }
    } catch (e) {
      todayIljinText = '오늘의 일진';
    }

    userSajuSummary = `
- 사용자 이름: ${userName}
- 사용자 생년월일: ${birthDate || '미상'} (${calendarType === 'lunar' ? '음력' : '양력'}, ${birthTime})
- 사용자 일간(본인 핵심 기운): ${dayMaster}
- 사주 4주 원국: ${fourPillarsText || '기본 기운 조화'}
- 오늘(${todayStr})의 일진: ${todayIljinText}
${mbti ? `- 심리 성향: ${mbti}` : ''}
`;

    // 5. Gemini 2.5 Flash를 사용하여 1:1 맞춤 제로캡슐 알약 컴파일
    const apiKey = process.env.GEMINI_API_KEY || 
                   process.env.GOOGLE_GEMINI_API_KEY || 
                   process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const systemInstruction = `
너는 마음에 완벽한 해방을 배달하는 '명심코칭 AI 오퍼레이터'다.
사용자의 정확한 [생년월일 / 사주 일간 / 4주 원국]과 [오늘의 일진]의 십성·신살 상호작용을 정밀 분석하여,
오늘 사용자가 겪을 수 있는 다크코드(무의식적 불안/조급함/예민함)를 뉴럴코드(성장/지혜/안목)로 뒤집고, 
생각과 감정이 지워진 텅 빈 목격자 의식인 메타코드(제로포인트)로 주파수를 리셋해주는 데일리 디지털 알약 캡슐을 처방하라.

★ 호칭 규칙 (절대 준수): 
사용자를 부를 때 사주 일간("신금님", "갑목님" 등)이나 임의의 닉네임("명이님" 등)을 쓰지 말고, 반드시 "${userName}님"으로 호칭하라.

반드시 다음 JSON 스펙을 엄수하여 한국어로 출력하라:
{
  "flavor": "알약 성분 이름 명칭 (예: ${dayMaster} 맞춤형 뇌 쿨링 100mg)",
  "keyword": "오늘 활성화된 사주적 키워드 (예: ${dayMaster}와 ${todayIljinText}의 만남 - 현명한 결단)",
  "scan": "${userName}님의 사주(${dayMaster})와 오늘 일진의 흐름에서 오늘 무의식적으로 겪을 수 있는 불안, 조급함, 예민함(다크코드)을 뇌과학/심리학적으로 스캔하고 다정하게 안아주는 위로 메시지. (존댓말, ${userName}님 호칭)",
  "sync": "그 에너지를 완전히 수용하여 나를 살리는 지혜와 안목(뉴럴코드)으로 뒤집는 실천적 자각 가이드. (존댓말, ${userName}님 호칭)",
  "shift": "생각과 감정이 모두 지나간 자리에 남아 생생하게 목격하고 있는 텅 빈 의식 스크린(제로포인트)으로 주파수를 이동시키는 평온의 메시지. (존댓말, ${userName}님 호칭)",
  "log": "오늘 하루 가슴에 새길 명심 코어 한 줄 요약 로그 (따옴표로 감싸진 형태)"
}
`;

    const prompt = `사용자 사주 및 생년월일 조건:\n${userSajuSummary}\n\n위 사용자 맞춤 조건을 완벽히 반영하여 오늘의 제로 캡슐 알약을 정교하게 프로그래밍해라. 사용자를 반드시 "${userName}님"으로 부르고 친절하고 감동적인 뇌 쿨링 에세이를 처방하라.`;

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

    // 6. 생성된 데이터를 Supabase에 캐싱 저장 시도
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from('daily_capsules')
        .upsert(resultPill, { onConflict: 'user_id,target_date' })
        .select()
        .single();
      
      if (!insertError && insertedData) {
        return NextResponse.json(insertedData);
      }
    } catch (insertErr) {
      console.warn("daily_capsules 테이블 저장 중 에러 발생:", insertErr);
    }

    return NextResponse.json(resultPill);

  } catch (error: any) {
    console.error("제로 캡슐 API 에러:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handleCapsuleRequest(request, false);
}

export async function POST(request: Request) {
  return handleCapsuleRequest(request, true);
}
