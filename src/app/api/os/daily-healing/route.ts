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

  const prompt = `당신은 현대인의 깊은 무의식을 치유하는 가장 지혜롭고 따뜻한 명심(Myeongsim) 마스터 코치입니다.

★ 금지 규정 (중복 및 상투적 억제):
1. "사랑하는 당신", "완벽하지 않아도 괜찮아요", "지금 이 순간의 선물" 같은 어디서나 볼 수 있는 뻔한 자기계발/힐링 소설 문구를 절대로 반복하지 마라.
2. 사용자를 부를 때 '당신' 대신 반드시 "이경윤님"으로 호칭하라.
3. 추상적인 감성 위로에 그치지 말고, 이경윤님의 사주 기질(은빛 다이아몬드 신금일주 등)과 연동된 구체적이고 현실적인 행동 코칭 꿀팁을 제공하라.

반드시 아래 JSON 구조를 지켜서 반환해주세요:
{
  "theme": "오늘의 치유 테마 (예: 신금(辛金)의 예민한 안목이 과부하를 마주한 날)",
  "module1": {
    "title": "폭풍 속으로 (마주함)",
    "description": "이경윤님이 오늘 겪을 수 있는 예민함이나 감정 역류(Backdraft)를 뇌과학과 사주적 안목으로 정밀 분석하고 따뜻하게 짚어주는 문장."
  },
  "module2": {
    "title": "치유의 3박자 왈츠",
    "allowing": "허용 (Allowing): 이경윤님의 마음속 감정 대문을 있는 그대로 열어두는 지혜",
    "embracing": "포용 (Embracing): 내면의 예민한 완벽주의 아이를 따뜻하게 안아주는 실질적 메시지",
    "accepting": "수용 (Acceptance): 텅 빈 영점(Zero Point) 의식 스크린에서 평온을 찾는 문장"
  },
  "module3": {
    "title": "자유를 향한 두 날개",
    "msc": "이경윤님 자신에게 건네는 조건 없는 자기연민(MSC) 메시지",
    "act": "오늘 당장 실천할 가치 중심의 행동 나침반(ACT) 메시지"
  },
  "module4": {
    "title": "오늘의 명심 코칭 솔루션",
    "affirmations": [
      "이경윤님의 내면 허용을 위한 1초 자각 확언",
      "이경윤님의 내면 포용을 위한 1초 자각 확언",
      "이경윤님의 영점 안주를 위한 1초 자각 확언"
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
