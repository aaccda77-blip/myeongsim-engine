import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DailyLuckEngine } from '@/lib/saju/DailyLuckEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, dayMaster, forceRefresh } = body;

    if (!dayMaster) {
      return NextResponse.json({ error: 'dayMaster is required' }, { status: 400 });
    }

    const cleanDayMaster = dayMaster.charAt(0);
    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kstDate.toISOString().split('T')[0];

    // 1. 이미 저장된 개인화 데이터가 존재하면 즉시 반환
    if (userId && userId !== 'anonymous' && !forceRefresh) {
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

    // 3. Gemini AI 또는 오프라인 맞춤 힐링 콘텐츠 생성
    const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    let parsedData: any = null;

    if (isMockMode || !apiKey) {
      parsedData = {
        theme: `[${cleanDayMaster}일간] 스스로에게 씌웠던 엄격한 잣대를 내려놓고 온전해지는 날`,
        module1: {
          title: "폭풍 속으로 (마주함)",
          description: `오늘의 일진 에너지(${biorhythm.ganji})는 당신의 [${cleanDayMaster}] 기질과 공명하여 가슴 한편에 묵직한 부담감이나 인정받지 못할까 봐 떨리는 취약함을 건드릴 수 있습니다. 그 아림은 이상한 것이 아니라, 그동안 온 힘을 다해 살아오느라 지친 마음이 보내는 정직한 신호입니다.`
        },
        module2: {
          title: "치유의 3박자 왈츠",
          allowing: "허용 (Allowing): 마음에 이는 불안이나 조급함을 쫓아내려 애쓰지 말고, '아, 지금 내가 불안하구나'라며 대문을 활짝 열어줍니다.",
          embracing: "포용 (Embracing): '남들보다 뒤처지면 어쩌지'라며 가슴을 졸이던 내면의 어린 나를 따뜻하고 부드러운 눈빛으로 꼭 안아줍니다.",
          accepting: "수용 (Acceptance): 어떤 것도 억지로 증명할 필요 없는, 텅 비고 고요한 영점(Zero Point)의 자각 속으로 가만히 안주합니다."
        },
        module3: {
          title: "자유를 향한 두 날개",
          msc: "완벽해야만 사랑받을 수 있는 것이 아닙니다. 불완전한 상태 그대로의 당신 역시 이미 찬란하게 아름답습니다.",
          act: "오늘 가장 무겁게 느껴지는 할 일 중 한 가지에 대해 '이 정도면 충분해'라고 선언하고, 10분간 따뜻한 온수를 마시며 호흡을 음미해 보세요."
        },
        module4: {
          title: "오늘의 마음코칭솔루션",
          affirmations: [
            "나는 내 안의 모든 취약함과 서툰 감정을 온전히 허용합니다.",
            "나는 세상을 증명하려는 나를 넘어, 이미 온전한 존재 자체로 머뭅니다.",
            "나는 파도가 아닌 평화로운 바다로서 영점의 평온을 누립니다."
          ]
        }
      };
    } else {
      const genAI = new GoogleGenerativeAI(apiKey);
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
    "description": "설명"
  },
  "module2": {
    "title": "치유의 3박자 왈츠",
    "allowing": "허용",
    "embracing": "포용",
    "accepting": "수용"
  },
  "module3": {
    "title": "자유를 향한 두 날개",
    "msc": "MSC",
    "act": "ACT"
  },
  "module4": {
    "title": "오늘의 마음코칭솔루션",
    "affirmations": [
      "확언 1",
      "확언 2",
      "확언 3"
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
      
      parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }

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
        .upsert(
          {
            user_id: userId,
            date_string: dateString,
            theme: parsedData.theme,
            content: parsedData
          },
          { onConflict: 'user_id,date_string' }
        )
        .select()
        .single();

      if (insertError) {
        console.error('Supabase Healing Post DB Upsert Error (ignoring to prevent failure):', insertError);
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
