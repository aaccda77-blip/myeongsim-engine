const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/aaccd/Downloads/ux/myeongsim-report/.env' });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `당신은 인간의 무의식과 에고를 분석하는 명심(Myeongsim) 시스템입니다.
오늘의 날짜(2026-05-29)와 사람들의 보편적인 심리 상태에 영감을 받아, 사람들이 흔히 겪는 에고의 강박 패턴(무의식의 소스코드)과 그것이 현실에서 투사되는 정반대의 짝(투사된 현실)을 **하나만** 새롭게 창조해서 JSON 형식으로 반환해 주세요. 매일 달라지는 독창적인 주제여야 합니다.
반드시 아래 JSON 구조를 정확히 지켜주세요.

{
  "code": "내면의 소스코드 (예: 무능력함에 대한 수치심)",
  "reality": "투사된 현실 (예: 끊임없는 경쟁과 압박)",
  "theme": { "bg": "bg-fuchsia-950/40", "border": "border-fuchsia-500/20", "textTitle": "text-fuchsia-300", "textLight": "text-fuchsia-100", "textDark": "text-fuchsia-400/70", "dot": "bg-fuchsia-400" },
  "coaching": {
    "desc": "명심 코칭 풀이 (원리 설명)",
    "socratic": "소크라테스 문답 (날카로운 질문)",
    "recursive": "재귀적 질문 (과거/원인 추적)",
    "meta": "메타 인지 (객관적 관찰 - 생각이나 감정이 일어나는 것을 한걸음 물러나서 관찰자 입장에서 있는 그대로 지켜보도록 하는 문구. 예: '지금 미래를 계획해야 한다는 생각이나 불만족스러운 감정이 일어나는 것을 가만히 지켜볼 수 있는가?')",
    "pureAwareness": "알아차림의 알아차림 (순수 의식) - 그 생각과 감정 뒤에 그것을 온전히 바라보고 있는 고요하고 텅 빈 알아차림의 공간 자체를 직접 자각하게 하는 순수 의식 안내 문구. 예: '그 생각과 감정 뒤에 있는, 이 모든 것을 바라보고 있는 텅 빈 알아차림의 공간을 자각할 수 있는가? 그 공간은 판단하지 않고, 그저 존재하고 있음을 느껴보라.')",
    "awareness": "Zero Point 솔루션(True Acceptance) - 외부 현실의 변화(예: 타인의 인정, 고통의 소멸)를 얻으려는 '애쓰기(Striving)'를 철저히 배제하고, 특정한 결과를 바라지 않고 오직 내면의 결핍을 온전히 수용하여 '온전한 자립'에 이르는 진정한 수용(True Acceptance) 해결책 문구",
    "msc_common_humanity": "[보편적 연결 - Common Humanity] 소크라테스/재귀적 질문 후, 이 고통이나 감정적 투사가 나만의 결함이 아니라 인간이라면 누구나 겪는 보편적 본성임을 일깨워 고립감을 해소하는 위로의 문구 (예: 타인에게 인정받고 싶어 하는 것은 인간이라면 누구나 가진 보편적인 본성입니다. 당신만의 에러가 아닙니다.)",
    "msc_self_kindness": "[연민의 자각 - Self-Kindness] 날카로운 통찰 후, 내면의 방어기제나 상처가 역류하지 않도록 가장 아끼는 친구를 대하듯 스스로에게 친절과 지지를 보내는 따뜻한 자애 문구 (예: 그 결핍을 만들어낸 과거의 어린 당신을 이제는 따뜻하게 안아줄 때입니다.)"
  }
}
테마 색상은 fuchsia, cyan, amber, rose, emerald, indigo, orange, teal, pink, violet, yellow 중에서 자유롭게 선택하여 생성하세요.`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch(e) {
    console.error(e);
  }
}
run();
