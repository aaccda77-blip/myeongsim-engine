import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DailyLuckEngine } from '@/lib/saju/DailyLuckEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, dayMaster } = body;

    if (!dayMaster) {
      return NextResponse.json({ error: 'dayMaster is required' }, { status: 400 });
    }

    const cleanDayMaster = dayMaster.charAt(0);
    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kstDate.toISOString().split('T')[0];

    // 1. 이미 저장된 개인화 데이터가 존재하면 즉시 반환
    if (userId && userId !== 'anonymous') {
      const { data: existingData, error: dbError } = await supabaseAdmin
        .from('user_healing_posts')
        .select('*')
        .eq('user_id', userId)
        .eq('date_string', dateString)
        .maybeSingle();

      if (existingData) {
        return NextResponse.json({ success: true, fromCache: true, data: existingData });
      }
    }

    // 2. 당일 일진 및 바이오리듬 연산 (사주 명리학 + 바이오리듬)
    const biorhythm = DailyLuckEngine.calculate(cleanDayMaster);

    // 3. Gemini AI 프롬프트 조립 및 호출
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `당신은 현대인의 깊은 무의식을 치유하는 가장 지혜롭고 따뜻한 명심(Myeongsim) 힐러입니다.
이 사용자는 타고난 기질(사주 일간)이 [${cleanDayMaster}]이며, 오늘 일진(오늘의 기운)은 [${biorhythm.ganji}]입니다.
오늘 이 사용자의 바이오리듬 종합 에너지 점수는 [${biorhythm.energyScore}/100]이며 에너지 레벨은 [${biorhythm.energyLevel}]이고, 현재 에고 대응 모드는 [${biorhythm.mode}]입니다.
오늘의 사주 심리학적 권고: "${biorhythm.advice}"

이 고유한 조건(기질, 당일 일진, 바이오리듬 에너지)을 기반으로, 오늘 이 사용자가 가장 상처받기 쉽거나 스트레스를 받을 수 있는 구체적인 결핍 테마를 하나 선정하여 4단계 모듈형 에세이로 작성해주세요.
글의 톤은 매우 부드럽고, 감동적이며, 사용자의 마음을 깊이 어루만지는 힐러의 목소리여야 합니다.

반드시 아래 JSON 구조를 지켜서 반환해주세요:
{
  "theme": "오늘의 치유 테마 (예: 사랑받지 못할까 봐 떨고 있는 날, 완벽주의에 지친 날 등)",
  "module1": {
    "title": "폭풍 속으로 (마주함)",
    "description": "오늘의 에너지 파동(${biorhythm.ganji})으로 인해 촉발되기 쉬운 역류(Backdraft) 현상에 대해 설명합니다. 가슴이 콕콕 찌르고 아린 이유를 따뜻하게 위로하는 문장으로 작성하세요."
  },
  "module2": {
    "title": "치유의 3박자 왈츠",
    "allowing": "허용 (Allowing): 올라오는 불안과 감정을 억누르지 않고 대문을 열어두는 태도",
    "embracing": "포용 (Embracing): 상처받은 내면의 아이를 안아주는 따뜻한 위로의 말",
    "accepting": "수용 (Acceptance): 불완전한 나와 친구가 되며 영점(Zero Point) 스크린에 도달하는 평온한 문장"
  },
  "module3": {
    "title": "자유를 향한 두 날개",
    "msc": "치유의 손길(MSC)이 필요할 때 나에게 건네는 무조건적인 사랑과 연민의 메시지",
    "act": "행동의 나침반(ACT)이 필요할 때 생각의 늪에서 빠져나와 가치 있는 삶으로 발걸음을 옮기도록 독려하는 메시지"
  },
  "module4": {
    "title": "오늘의 마음 처방전",
    "affirmations": [
      "허용을 위한 긍정 확언 1문장",
      "포용을 위한 긍정 확언 1문장",
      "수용을 위한 긍정 확언 1문장"
    ]
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON format from Gemini");
    }
    
    const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // 4. Supabase DB에 영구 저장 (로그인한 정상 유저일 경우)
    let savedPost = { 
      id: 'temp-id-' + Date.now(), 
      user_id: userId,
      date_string: dateString, 
      theme: parsedData.theme, 
      content: parsedData 
    };

    if (userId && userId !== 'anonymous') {
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('user_healing_posts')
        .insert([
          {
            user_id: userId,
            date_string: dateString,
            theme: parsedData.theme,
            content: parsedData
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase Healing Post DB Insert Error (ignoring to prevent failure):', insertError);
      } else if (insertedData) {
        savedPost = insertedData;
      }
    }

    return NextResponse.json({ success: true, fromCache: false, data: savedPost });
  } catch (error: any) {
    console.error("Personalized Daily Healing Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
