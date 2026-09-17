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

    // Clean day master input just in case
    const cleanDayMaster = dayMaster.charAt(0);
    const today = new Date();
    // Use Korea Standard Time (KST = UTC+9) for date keying
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kstDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // 1. 이미 저장된 데이터가 존재하면 즉시 반환 (중복 생성 방지 및 일관된 경험 제공)
    if (userId && userId !== 'anonymous') {
      const { data: existingData, error: dbError } = await supabaseAdmin
        .from('user_daily_matrix')
        .select('*')
        .eq('user_id', userId)
        .eq('date', dateString)
        .maybeSingle();

      if (existingData) {
        return NextResponse.json({ success: true, fromCache: true, data: existingData });
      }
    }

    // 2. 당일 일진 및 바이오리듬 연산
    const biorhythm = DailyLuckEngine.calculate(cleanDayMaster);
    
    // 3. Gemini AI 또는 오프라인 맞춤 매트릭스 생성
    const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    let parsedData: any = null;

    if (isMockMode || !apiKey) {
      parsedData = {
        code: `[${cleanDayMaster}일간] 완벽하게 통제하고 대비해야만 안전하다는 생존 방어코드`,
        reality: `주변 사람들의 예기치 않은 행동과 통제할 수 없는 환경적 지연의 연속`,
        theme: {
          bg: "bg-emerald-950/40",
          border: "border-emerald-500/20",
          textTitle: "text-emerald-300",
          textLight: "text-emerald-100",
          textDark: "text-emerald-400/70",
          dot: "bg-emerald-400"
        },
        coaching: {
          desc: `오늘 일진(${biorhythm.ganji})의 에너지는 당신의 [${cleanDayMaster}] 기질과 만나 통제 욕구를 자극합니다. 내면에서 '상황을 완벽히 쥐어야 한다'는 집착이 강해질수록, 외부 현실은 오히려 그 통제를 벗어나는 정반대의 사건들을 비추어 줍니다.`,
          socratic: `통제하려 애쓰지 않아도 이 세상이 스스로 굴러가고 있음을 오늘 문득 알아차린 순간이 있나요?`,
          recursive: `언제부터 당신은 모든 것을 혼자 완벽하게 짊어져야만 안전하다고 믿게 되었을까요?`,
          meta: `지금 가슴과 어깨를 조여오는 '통제하고 싶은 욕구'를 한 걸음 물러나 관찰자 입장에서 조용히 지켜보세요.`,
          pureAwareness: `그 긴장과 불안 뒤편에, 이 모든 흐름을 판단 없이 묵묵히 품어주고 있는 텅 빈 알아차림의 공간을 느껴보세요.`,
          awareness: `상황을 바꾸려는 필사적인 애쓰기를 내려놓고, '통제할 수 없는 것을 기꺼이 흘려보낸다'는 영점(Zero Point)의 참된 수용에 머무르세요.`,
          msc_common_humanity: `불확실한 세상에서 안전을 갈망하는 것은 모든 인간의 보편적인 마음입니다. 결코 당신의 나약함이 아닙니다.`,
          msc_self_kindness: `모든 것을 완벽하게 책임지느라 지친 당신의 어깨를 토닥여주며 '오늘도 정말 수고 많았어'라고 자비롭게 말해주세요.`
        }
      };
    } else {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `당신은 인간의 무의식과 에고를 분석하고 치유하는 명심(Myeongsim) 시스템입니다.
이 사용자는 타고난 기질(사주 일간)이 [${cleanDayMaster}]이며, 오늘 일진(오늘의 기운)은 [${biorhythm.ganji}]입니다.
오늘 이 사용자의 바이오리듬 종합 에너지 점수는 [${biorhythm.energyScore}/100]이며 에너지 레벨은 [${biorhythm.energyLevel}]이고, 현재 에고 대응 모드는 [${biorhythm.mode}]입니다.
오늘의 사주 심리학적 권고: "${biorhythm.advice}"

이 모든 고유 조건(기질, 당일 일진, 바이오리듬 에너지)을 융합하여, 오늘 이 사용자의 내면에서 고개를 들기 가장 쉬운 무의식적 결핍/저항 패턴인 **'오늘의 소스코드'**와 그것이 현실에 정반대의 짝으로 끌어당겨 투사하는 **'오늘의 투사된 현실'**을 단 하나만 매칭하여 JSON 형식으로 새롭게 창조해 주세요.
매우 현실적이고, 소름 돋을 정도로 폐부를 찌르는 예시적인 통찰이어야 합니다.

반드시 아래 JSON 구조를 정확히 지켜서 순수한 JSON만 반환해 주세요. (마크다운 포맷이나 백틱 기호 외에 다른 텍스트는 섞지 마세요)

{
  "code": "오늘의 소스코드",
  "reality": "오늘의 투사된 현실",
  "theme": { 
    "bg": "bg-emerald-950/40", 
    "border": "border-emerald-500/20", 
    "textTitle": "text-emerald-300", 
    "textLight": "text-emerald-100", 
    "textDark": "text-emerald-400/70", 
    "dot": "bg-emerald-400" 
  },
  "coaching": {
    "desc": "명심 코칭 풀이",
    "socratic": "소크라테스 문답",
    "recursive": "재귀적 질문",
    "meta": "메타인지",
    "pureAwareness": "알아차림의 알아차림",
    "awareness": "Zero Point 솔루션",
    "msc_common_humanity": "보편적 연결",
    "msc_self_kindness": "연민의 자각"
  }
}

테마의 색상은 fuchsia, cyan, amber, rose, emerald, indigo, orange, teal, pink, violet, yellow 중에서 당일 에너지 레벨에 맞춰 어울리는 색을 선택하여 작성하세요.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from markdown or raw text
      const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON format from Gemini");
      }
      
      parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }

    // 4. Supabase DB에 영구 저장 (로그인한 정상 유저일 경우)
    if (userId && userId !== 'anonymous') {
      const { error: insertError } = await supabaseAdmin
        .from('user_daily_matrix')
        .insert([
          {
            user_id: userId,
            date: dateString,
            code: parsedData.code,
            reality: parsedData.reality,
            theme: parsedData.theme,
            coaching: parsedData.coaching
          }
        ]);

      if (insertError) {
        console.error('Supabase Daily Matrix DB Insert Error (ignoring to prevent failure):', insertError);
      }
    }

    return NextResponse.json({ success: true, fromCache: false, data: parsedData });
  } catch (error: any) {
    console.error("Personalized Daily Matrix Error:", error);
    // 폴백 기본 데이터 반환
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      data: {
        code: '알 수 없는 조급함과 긴장 (에너지 리밸런싱 상태)',
        reality: '계획대로 돌아가지 않아 신경이 곤두서는 상황',
        theme: { bg: 'bg-slate-800/80', border: 'border-slate-500/20', textTitle: 'text-slate-300', textLight: 'text-slate-100', textDark: 'text-slate-400/70', dot: 'bg-slate-400' },
        coaching: {
          desc: '오늘의 에너지를 로딩하는 데 병목이 생겼습니다. 이 또한 우주가 잠시 통제를 멈추고 쉬어가라는 사인을 보내는 것입니다.',
          socratic: '순간적인 연동 지연에 마음이 조급해진다면, 당신은 무엇을 놓칠까 걱정하고 있나요?',
          recursive: '어릴 때부터 원하는 대로 즉시 해결되지 않으면 분노하고 불안해하던 패턴은 누구로부터 배운 것인가요?',
          meta: '화면에 지연이 생겨 마음 한편이 삐딱해진 나 자신을 객관적으로 가만히 바라봅니다. 이것이 메타인지입니다.',
          pureAwareness: '그 마음에 끄달리지 않고 여여하게 스크린을 쳐다보는 텅 빈 알아차림의 무한한 지평을 자각합니다. 이것이 알아차림의 알아차림입니다.',
          awareness: '컴퓨터와 스마트폰을 향한 통제력을 내려놓고 30초간 창밖을 바라보며 깊은 호흡에 온전히 맡기세요.'
        }
      }
    });
  }
}
