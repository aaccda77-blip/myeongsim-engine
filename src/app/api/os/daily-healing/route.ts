import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function generateDailyHealing(dateString: string) {
  const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

  let content: any = null;

  if (isMockMode || !apiKey) {
    content = {
      theme: "신금(辛金)의 섬세한 심미안이 휴식을 마주한 날",
      module1: {
        title: "폭풍 속으로 (마주함)",
        description: "이경윤님이 오늘 겪을 수 있는 내면의 완벽주의적 긴장이나 감정 역류는 당신의 결함이 아니라, 높은 기준을 지키려 뇌가 가동한 방어 회로입니다. 가만히 숨을 고르며 그 피로감을 바라보세요."
      },
      module2: {
        title: "치유의 3박자 왈츠",
        allowing: "허용 (Allowing): 답답하거나 조급한 마음이 올라올 때 그것을 억누르지 않고 마음의 대문을 활짝 열어둡니다.",
        embracing: "포용 (Embracing): '잘해내지 못하면 어쩌지'라며 긴장한 내면의 예민한 아이에게 부드러운 포옹을 건넵니다.",
        accepting: "수용 (Acceptance): 통제하려는 손아귀의 힘을 풀고, 어떤 조건 없이도 이미 평온한 텅 빈 영점(Zero Point) 의식에 닻을 내립니다."
      },
      module3: {
        title: "자유를 향한 두 날개",
        msc: "완벽하지 않아도 당신이라는 존재의 빛은 결코 바래지 않습니다. 지금 이 순간 자신에게 가장 너그러운 친구가 되어주세요.",
        act: "오늘 가장 마음에 걸리는 일 한 가지에서 완벽주의를 20% 내려놓고, 5분간 창밖 하늘을 바라보며 깊은 숨을 쉬어보세요."
      },
      module4: {
        title: "오늘의 명심 코칭 솔루션",
        affirmations: [
          "나는 지금 이 순간 일어나는 모든 감정을 조건 없이 허용합니다.",
          "나는 불완전함 속에서도 이미 온전하고 아름다운 존재입니다.",
          "나는 파도가 아닌 깊고 평화로운 바다 그 자체로 머뭅니다."
        ]
      }
    };
  } else {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `당신은 현대인의 깊은 무의식을 치유하는 가장 지혜롭고 따뜻한 명심(Myeongsim) 마스터 코치입니다.

★ 금지 규정 (중복 및 상투적 억제):
1. "사랑하는 당신", "완벽하지 않아도 괜찮아요", "지금 이 순간의 선물" 같은 어디서나 볼 수 있는 뻔한 자기계발/힐링 소설 문구를 절대로 반복하지 마라.
2. 사용자를 부를 때 '당신' 대신 반드시 "이경윤님"으로 호칭하라.
3. 추상적인 감성 위로에 그치지 말고, 이경윤님의 사주 기질(은빛 다이아몬드 신금일주 등)과 연동된 구체적이고 현실적인 행동 코칭 꿀팁을 제공하라.

반드시 아래 JSON 구조를 지켜서 반환해주세요:
{
  "theme": "오늘의 치유 테마",
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
    "msc": "MSC 메시지",
    "act": "ACT 메시지"
  },
  "module4": {
    "title": "오늘의 명심 코칭 솔루션",
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
    
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON format from Gemini");
    }
    
    content = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  }

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
