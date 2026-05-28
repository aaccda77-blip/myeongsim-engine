import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function generateDailyHealing(dateString: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `당신은 현대인의 깊은 무의식을 치유하는 가장 지혜롭고 따뜻한 명심(Myeongsim) 코치입니다.
MSC(마음챙김 자기연민)와 ACT(수용전념치료)의 철학을 기반으로, 매일매일 현대인들이 흔히 겪는 결핍, 상처, 혹은 스트레스 테마를 무작위로 하나 선정하여 4단계 모듈형 에세이로 작성해주세요.
글의 톤은 매우 부드럽고, 감동적이며, 사용자의 마음을 깊이 어루만지는 힐러의 목소리여야 합니다.

반드시 아래 JSON 구조를 지켜서 반환해주세요:
{
  "theme": "오늘의 치유 테마 (예: 사랑받지 못할까 봐 떨고 있는 날, 완벽주의에 지친 날 등)",
  "module1": {
    "title": "폭풍 속으로 (마주함)",
    "description": "오늘 선정한 테마와 관련된 역류(Backdraft) 현상에 대해 설명합니다. 가슴이 콕콕 찌르고 아린 이유를 따뜻하게 위로하는 문장으로 작성하세요."
  },
  "module2": {
    "title": "치유의 3박자 왈츠",
    "allowing": "허용 (Allowing): 올라오는 감정을 억누르지 않고 대문을 열어두는 태도",
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
  
  const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
  if (!jsonMatch) {
    throw new Error("Invalid JSON format from Gemini");
  }
  
  const content = JSON.parse(jsonMatch[1] || jsonMatch[0]);

  // DB에 저장
  const { data, error } = await supabaseAdmin
    .from('healing_posts')
    .insert([{
      date_string: dateString,
      theme: content.theme,
      content: content
    }])
    .select()
    .single();

  if (error) {
    console.error("Failed to save daily healing to DB:", error);
    // 에러나도 생성된 건 리턴
    return { id: 'temp-id', date_string: dateString, theme: content.theme, content };
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    // 1. 날짜 결정 (파라미터가 없으면 오늘 날짜)
    let dateString = dateParam;
    if (!dateString) {
      const today = new Date();
      const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
      dateString = kstDate.toISOString().split('T')[0];
    }

    // 2. DB에서 오늘 날짜의 포스트 확인
    const { data: existingPost, error: selectError } = await supabaseAdmin
      .from('healing_posts')
      .select('*')
      .eq('date_string', dateString)
      .single();

    if (existingPost) {
      // 3. 있으면 바로 반환
      return NextResponse.json(existingPost);
    }

    // 4. 없으면 Gemini 2.5 로 생성하고 DB에 저장 후 반환
    const newPost = await generateDailyHealing(dateString);
    return NextResponse.json(newPost);

  } catch (error) {
    console.error("Daily Healing Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch or generate daily healing guide" },
      { status: 500 }
    );
  }
}
