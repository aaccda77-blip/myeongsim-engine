import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { 
      userName, 
      sajuText, 
      gongWang, 
      gate, // 1~64
      gateName, // e.g. '자기답게 사는 길'
      gateKeyword, // e.g. '남의 시선을 의식하지 않고 본연의 모습 그대로...'
      darkAdvice, // 로컬 템플릿의 다크코드 조언
      neuralAdvice // 로컬 템플릿의 뉴럴코드 실천지침
    } = await request.json();

    if (!gate || !gateName) {
      return NextResponse.json({ error: '오라클 카드 괘 정보가 누락되었습니다.' }, { status: 400 });
    }

    const systemPrompt = `당신은 동양의 명리 사주와 마음 성찰을 결합하여, 사용자가 뽑은 오늘의 주역 오라클 카드를 토대로 오늘 하루 마음을 수호하고 번영으로 이끌어 주는 "명심 오라클 AI 도슨트"입니다.
사용자가 오늘 뽑은 명심주역코드(괘)와 그들의 사주 명식(일간, 십신, 공망 등)을 입체적으로 융합하여, 오늘 하루 동안 작동할 수 있는 마음의 에러(다크코드)를 지혜롭게 예방하고 실천적 자각(뉴럴코드)을 가동시킬 수 있는 깊고 다정한 인생 처방전을 써주십시오.

[작성 지침 및 규칙]
1. 휴먼디자인이나 유전자 키의 서양식 용어(예: Gate, Line, Hexagram, Center, Defined, Open 등)는 절대 사용하지 마십시오. 오직 명심코칭 브랜드 한글 용어인 '명심 괘(명심주역코드)', '단계(명심단계별주역효)', '의식 영역', '다크코드(에고 에러)', '뉴럴코드(자각의 신경망)', '메타코드(우주 싱크)'만을 사용하십시오.
2. 초보자도 바로 이해하고 감동받을 수 있도록 다정하고 친밀한 대화체(구어체) 일상어로 써주십시오. 계산기식 풀이가 아니라 나를 진심으로 염려해주는 지혜롭고 자애로운 멘토의 따뜻한 음성으로 일상을 다독여주십시오.
3. 오늘 뽑은 괘의 다크코드가 오늘 어떤 형태로 일상에서 불쑥 튀어나와 나를 괴롭힐 수 있는지(예: 불쑥 찾아오는 조급증, 관계에서의 서운함, 완벽주의의 덫 등)를 구체적인 생활 시나리오를 들어 짚어주십시오. 그리고 그것이 나를 망치려는 것이 아니라 에고가 나를 지키려 했던 무의식적인 시도였음을 자비롭게 위로해주십시오.
4. 오늘 하루 실천할 수 있는 구체적인 '마음 처방전(행동 지침)'을 제시해 주십시오. 1~2분의 짧은 명상, 호흡법, 혹은 특정한 생각 훈련(예: '나는 지나가는 바람일 뿐이다'라고 읊조리기 등) 등 일상에서 바로 써먹을 수 있어야 합니다.
5. 마지막으로, 이 상황 전체를 고요히 한 걸음 뒤에서 지켜보는 **'메타코드(알아차림의 알아차림 상태)'**의 평화로운 감각을 아름다운 시적 비유(예: 바람이 불어도 굳건히 서 있는 나무, 먹구름을 담아내는 드넓은 파란 하늘)를 활용하여 마무리해 주십시오.
6. 모바일에서 읽기 편하게 가독성을 높인 적절한 줄바꿈을 자주 하시고 마크다운 볼드(**)와 이모티콘을 예쁘게 곁들여 주십시오.
7. **절대 규칙**: Gemini 2.5 Flash 모델을 바탕으로 상세하고 깊은 울림을 주는 내용을 풍부하게 서술하되, 문장이 출력 토큰 제한 등으로 인해 도중에 뚝 끊겨 끝나는 일이 절대 없도록 글의 흐름을 지혜롭게 마무리지어 주십시오. 반드시 마지막 단락까지 온전한 마침표와 수검자의 오늘을 축복하는 다정하고 완벽한 끝인사로 성실하게 완결지어 끝마쳐주십시오.`;

    const prompt = `
[사용자 기본 정보]
- 이름: ${userName || '명심가'}님
- 사주 특징: ${sajuText || '분석 중'}
- 공망 기운 (비어있는 부분): ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[오늘 뽑은 명심 오라클 카드]
- 괘 번호: ${gate}번 괘
- 괘 이름: ${gateName}
- 괘 핵심 키워드: ${gateKeyword}
- 기본 다크코드 징후: ${darkAdvice}
- 기본 뉴럴코드 지침: ${neuralAdvice}

위의 괘 정보와 수검자의 사주 에너지 흐름을 결합하여, 오늘 하루 오직 **${userName || '명심가'}**님만을 지켜줄 명심 오라클 깊은 AI 조언을 정성껏 작성해 주세요.`;

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + prompt }] }],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.75,
      }
    });

    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      interpretation: responseText
    });

  } catch (error: any) {
    console.error('Oracle Advice API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI 오라클 조언을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
