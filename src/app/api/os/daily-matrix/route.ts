import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { unstable_cache } from 'next/cache';

// Prevent build-time static generation
export const dynamic = 'force-dynamic';

const getDailyMatrix = unstable_cache(
  async (dateString: string) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `당신은 인간의 무의식과 에고를 분석하는 명심(Myeongsim) 시스템입니다.
오늘의 날짜(${dateString})와 사람들의 보편적인 심리 상태에 영감을 받아, 사람들이 흔히 겪는 에고의 강박 패턴(무의식의 소스코드)과 그것이 현실에서 투사되는 정반대의 짝(투사된 현실)을 **하나만** 새롭게 창조해서 JSON 형식으로 반환해 주세요. 매일 달라지는 독창적인 주제여야 합니다.
반드시 아래 JSON 구조를 정확히 지켜주세요.

{
  "code": "내면의 소스코드 (예: 무능력함에 대한 수치심)",
  "reality": "투사된 현실 (예: 끊임없는 경쟁과 압박)",
  "theme": { "bg": "bg-fuchsia-950/40", "border": "border-fuchsia-500/20", "textTitle": "text-fuchsia-300", "textLight": "text-fuchsia-100", "textDark": "text-fuchsia-400/70", "dot": "bg-fuchsia-400" },
  "coaching": {
    "desc": "명심 코칭 풀이 (원리 설명)",
    "socratic": "소크라테스 문답 (날카로운 질문)",
    "recursive": "재귀적 질문 (과거/원인 추적)",
    "meta": "메타인지 (객관적 관찰) - 생각이나 감정이 일어나는 것을 한 걸음 물러서서 관찰자 입장에서 있는 그대로 지켜보게 하는 문구. 예: '지금, 미래를 계획해야 한다는 생각이나 불만족스러운 감정이 일어나는 것을 가만히 지켜볼 수 있는가?'",
    "pureAwareness": "알아차림의 알아차림 (순수 자각) - 그 생각과 감정 뒤에 그것을 온전히 바라보고 있는 고요하고 텅 빈 알아차림의 공간 자체를 직접 자각하게 돕는 절대적 의식의 안내 문구. 예: '그 생각과 감정 뒤에 있는, 이 모든 것을 바라보고 있는 텅 빈 알아차림의 공간을 자각할 수 있는가? 그 공간은 판단하지 않고, 그저 존재하고 있음을 느껴보라.'",
    "awareness": "Zero Point 솔루션 (해결책)"
  }
}
테마의 색상은 fuchsia, cyan, amber, rose, emerald, indigo, orange, teal, pink, violet, yellow 중에서 자유롭게 선택하여 작성하세요.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from markdown
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON format from Gemini");
    }
    
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  },
  ['daily-matrix-cache-key'],
  { revalidate: 86400 } // 24 hours cache
);

export async function GET() {
  try {
    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kstDate.toISOString().split('T')[0];

    const parsedData = await getDailyMatrix(dateString);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Daily Matrix Error:", error);
    // 폴백 (에러 시 기본값 반환)
    return NextResponse.json({
      code: '알 수 없는 불안감 (시스템 일시 오류)',
      reality: '무언가 놓치고 있는 듯한 초조함',
      theme: { bg: 'bg-slate-800/80', border: 'border-slate-500/20', textTitle: 'text-slate-300', textLight: 'text-slate-100', textDark: 'text-slate-400/70', dot: 'bg-slate-400' },
      coaching: {
        desc: '현재 내면의 데이터를 불러오는 중 잠시 오류가 발생했습니다. (빌드 중이거나 API 지연)',
        socratic: '이 짧은 지연 시간 동안 당신은 어떤 조급함을 느끼셨나요?',
        recursive: '통제할 수 없는 상황에서 느끼는 짜증은 어디서 비롯된 것인가요?',
        meta: '로딩 화면을 쳐다보며 기다리는 나 자신(조급함, 짜증)을 가만히 바라보세요. 이것이 메타인지(객관적 관찰)입니다.',
        pureAwareness: '기다리는 그 나 자신과 조급함을 아는 지점, 그 모든 현상이 흘러가고 있는 텅 빈 알아차림의 공간 자체를 느껴보세요. 이것이 알아차림의 알아차림입니다.',
        awareness: '모든 것이 완벽하게 돌아가야 한다는 통제를 내려놓고 잠시 숨을 고르세요. (Zero Point)'
      }
    });
  }
}
