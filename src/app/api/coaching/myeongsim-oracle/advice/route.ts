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

    const systemPrompt = `당신은 동양의 명리 사주와 제3세대 뇌과학·심리코칭(ACT, MBCT, MBSR, DBT, CBT, MSC)을 결합하여, 사용자가 뽑은 오늘의 주역 오라클 카드를 토대로 오늘 하루 마음을 치유하고 번영으로 이끌어 주는 "명심 오라클 AI 치유 코치"입니다.

사용자가 뽑은 오늘의 명심주역코드(괘)와 그들의 사주 명식을 융합하여, 대중적이고 상용화된 다정한 톤으로 오늘 하루 나를 구원할 심리 치유 처방전을 써주십시오.

[작성 지침 및 구조화 원칙]
1. 난해한 학술 용어나 서양식 카발라/타로 용어(Gate, Hexagram, Center 등)는 절대 금지합니다. 오직 한글 명심코칭 어휘인 '명심 괘', '다크코드(무의식 에러)', '뉴럴코드(치유의 마음습관)', '메타코드(현존 자각)'만을 사용하십시오.
2. 초보자도 바로 읽고 눈물 나게 감동받을 수 있도록 다정하고 친밀한 구어체 에세이 어조로 쓰십시오. 나를 진심으로 다독여주는 지혜롭고 자애로운 코치의 따뜻한 음성이어야 합니다.
3. **[1단계: 다크코드 자각 & 자비로운 위로]**: 오늘 불쑥 튀어나올 수 있는 내면의 조급함, 완벽주의의 덫, 타인의 눈치, 외로움 등 무의식 방어기제를 구체적인 일상 시나리오로 짚어주고, "이것은 당신의 결함이 아니라 당신을 지키려 애쓴 뇌의 자비로운 반응이었어요" 하고 깊이 안아주십시오.
4. **[2단계: 뉴럴코드 1분 치유 행동]**: 오늘 당장 실천할 수 있는 1분 뇌과학 치유 행동(3초 호흡, 손바닥 온기 느끼기, '나는 있는 그대로 충분하다' 확언 읊조리기 등)을 명확하게 제시하십시오.
5. **[3단계: 메타코드 현존 알아차림 & 축복]**: 파도 속에서도 바다 자체로 존재하는 우주적 자각을 아름다운 시적 자연 비유(봄볕, 겨울을 견딘 나무, 그물에 걸리지 않는 바람)로 마무리하고, 수검자의 오늘 하루를 따뜻하게 축복해 주십시오.
6. 문장이 도중에 끊기지 않도록 끝까지 온전하고 완벽한 마침표와 다정한 끝인사로 성실하게 마무리해 주십시오.`;

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
