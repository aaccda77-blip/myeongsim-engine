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
    
    // 3. Gemini AI 프롬프트 조립 및 호출
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
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
  "code": "오늘의 소스코드 (예: 과도한 완벽주의와 책임감에 짓눌려 다 때려치우고 싶다는 도피 심리)",
  "reality": "오늘의 투사된 현실 (예: 결정적인 순간에 협조하지 않고 일을 망쳐버리는 동료나 지인)",
  "theme": { 
    "bg": "bg-emerald-950/40", 
    "border": "border-emerald-500/20", 
    "textTitle": "text-emerald-300", 
    "textLight": "text-emerald-100", 
    "textDark": "text-emerald-400/70", 
    "dot": "bg-emerald-400" 
  },
  "coaching": {
    "desc": "명심 코칭 풀이 (가장 핵심적인 훈련 목적: '사용자가 내면의 소스코드(예: 배신당할 것에 대한 불안, 통제 욕구 등)와 자신을 동일시하여 그 생각과 감정을 강하게 품으면, 마치 자석처럼 정확히 그에 상응하는 투사된 현실(예: 믿었던 사람의 거짓말, 상황의 악화 등)이 외부 세계에 끌려와 창조된다'는 무의식의 투사-창조 원리를 매일매일 다양한 예시와 비유로 날카롭게 일깨워 주는 해설을 작성할 것)",
    "socratic": "소크라테스 문답 (오늘 하루 동안 스스로에게 던져볼 만한 날카로운 관찰 질문)",
    "recursive": "재귀적 질문 (이 상태를 촉발한 과거의 최초 기원이나 내면의 집착 원인을 추적하는 질문)",
    "meta": "메타인지 (객관적 관찰) - 오늘 일진의 파동에 의해 요동치거나 가라앉은 감정과 생각을 제3자 관점(관찰자 시점)에서 가만히 바라보게 만드는 문구. 예: '지금 ...를 느끼는 나 자신을 있는 그대로 지켜볼 수 있는가?'",
    "pureAwareness": "알아차림의 알아차림 (순수 자각) - 그 관찰하는 주체마저도 묵묵히 감싸 안아 비추고 있는 텅 빈 알아차림의 공간 그 자체를 직접 깨닫고 현존하게 만드는 고차원의 지문. 예: '그 생각과 느낌 뒤에, 이 모든 변화를 바라보는 텅 빈 알아차림의 공간을 자각할 수 있는가? 그 공간은 판단하지 않고, 그저 존재하고 있음을 느껴보라.'",
    "awareness": "Zero Point 솔루션 (오늘의 바이오리듬과 모드에 맞게 행동 처방을 주되, 반드시 '저항하지 않고 떠오르는 감정이나 갈망(역류현상)을 100% 허용하고 가슴으로 온전히 느껴주면, 이 감정이 텅 빈 마음에 녹아들어 가장 자연스러운 균형(Zero Point)을 저절로 되찾는다'는 핵심 철학과 문맥을 반드시 포함하여 작성)"
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
    
    const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

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
