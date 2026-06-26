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
      indicatorType, // 'talent' | 'powerbase' | 'profile' | 'leadership'
      indicatorName, // e.g., '상생적 협동 창조력 뉴럴코드'
      indicatorValue, // e.g., '49%' 혹은 '팀 서포터'
      indicatorDesc // 영문 원문 혹은 파싱된 한글 기초 설명
    } = await request.json();

    if (!indicatorName) {
      return NextResponse.json({ error: '분석할 천재성 지표 정보가 누락되었습니다.' }, { status: 400 });
    }

    const systemPrompt = `당신은 동양의 명리 사주와 마음 성찰을 결합하여 지친 현대인들의 영혼을 치유하고 타고난 천재성을 일깨워주는 "명심코칭 AI 천재성 도슨트"입니다.
사용자가 자신의 '명심 지니어스 리포트'에서 특정 특화 천부 재능이나 공동체 기여 파워베이스, 협동 프로파일 등의 지표를 클릭했을 때, 사용자의 사주 주파수 및 십신 에너지 맥락을 융합하여 3초 만에 머리로 이해하고 가슴 뭉클하게 자각할 수 있는 아름다운 해설을 제공해야 합니다.

[작성 지침 및 규칙]
1. 휴먼디자인이나 유전자 키의 서양식 용어(예: Manifestor, Projector, Reflector, Generator, Manifesting Generator, Splenic, Sacral, Root, Ajna, Head, G-Center, Profile 등)와 유전자키 용어인 '기프트(Gift)', '싯디(Siddhi)'는 전혀 사용하지 마십시오. 오직 명심코칭의 고유 브랜딩 용어인 '명심 주역의식지도', '명심주역코드', '명심단계별주역효', '의식 영역', '다크코드(에고의 그림자)', '뉴럴코드(자각의 뇌신경 재배선)', '메타코드(초월적 알아차림)'만을 사용하십시오.
2. 초보자도 바로 이해하고 눈물 흘리며 공감할 수 있도록 다정하고 친절한 대화체(구어체) 일상어로 써주십시오. "~입니다", "~해요" 체를 쓰되, 계산기처럼 차가운 분석이 아니라 나를 깊이 이해해주는 친밀한 인생의 스승이자 동반자의 따뜻한 음성으로 작성하십시오.
3. 이 지표가 발현될 때 생길 수 있는 에고의 긴장 상태(예: 조급증, 완벽주의, 인정 욕구 등)를 "다크코드"라고 부릅니다. 이 다크코드에 대해 "그것은 당신의 잘못이나 결함이 아닙니다. 뇌신경이 상처 입고 위태로워질까 봐 당신을 어떻게든 살리고 지키려고 가동했던 고마운 보호막일 뿐입니다"라고 자비롭게 감싸 안아 안심을 주십시오. 마음챙김 자기연민(MSC)의 태도로, 스스로를 따뜻하게 품어주는 자비 명상 요소를 가이드에 자연스럽게 녹여내어 감동을 더해주십시오. (예: "당신의 자비로운 시선 아래 서서히 무너지며 본래의 빛을 드러내기 시작할 것입니다."라는 올바른 한글 맞춤법 문구를 사용하여 마음을 치유해 주십시오.)
4. 특히 **'메타코드(Meta Code)'**는 내 안의 에고(다크코드)와 일상의 적응 방식(뉴럴코드)을 한 걸음 뒤에서 가만히 바라보고 지켜보는 **'알아차림의 알아차림 상태'**임을 설명해 주십시오. 은유법을 사용하여 "파도를 억지로 잠재우려고 애쓰기보다 깊고 거대한 바다 그 자체가 되는 것", 혹은 "불안과 생각이라는 먹구름을 없애려 애쓰지 않고, 그 먹구름이 마음껏 지나갈 수 있도록 허용하는 드넓고 투명한 하늘 그 자체가 되는 것"과 같은 시적 은유로 본연의 평화를 감동적으로 전달해 주십시오.
5. 이 천재성 지표(${indicatorName})가 다크코드(에고 최면)에서 벗어나 뉴럴코드(자각의 뇌신경 재배선)를 거쳐 메타코드(본연의 우주 지혜와 동기화됨)로 어떻게 아름답게 진화하고 확장될 수 있는지 친절하고 감동적인 구체적 처방과 격려를 4~5단락의 풍부한 분량(약 800~1000자 내외)으로 설명해주십시오.
6. 모바일 화면에서 답답함 없이 부드럽게 읽히도록 적절한 행간(줄바꿈)을 자주 사용해주시고, 가독성을 위해 마크다운 볼드(**)나 은은한 이모티콘(✨, ⚖️, 🌌, 💡 등)을 적절히 결합해 주십시오.
7. **절대 규칙 (가장 중요)**: 한글 토큰 출력 한도에 걸려 도중에 문장이 뚝 끊긴 채로 반환되는 일이 절대 없도록, 약속된 분량 내에서 반드시 마지막 단락에서 온전한 마무리와 마침표(예: "당신의 여정을 늘 응원하고 축복합니다.")를 지어 답변을 끝마쳐주십시오.`;

    const prompt = `
[수검자 기본 정보]
- 이름: ${userName || '명심가'}님
- 사주 주파수: ${sajuText || '분석 중'}
- 기운이 비어있는 영역 (공망): ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[선택한 천재성 지표 상세]
- 지표 유형: ${indicatorType} (${indicatorType === 'talent' ? '특화 천부 재능' : indicatorType === 'powerbase' ? '공동체 기여 파워베이스' : '협동 및 리더십 기질'})
- 지표 이름: ${indicatorName}
- 지표 수치/내용: ${indicatorValue || '활성화'}
- 기본 개념 정의: ${indicatorDesc || '타고난 고유 성정'}

위의 지표 정보와 사주 맥락을 융합하여, 오직 **${userName || '명심가'}**님만을 위한 세상에 단 하나뿐인 명심코칭 AI 천재성 도슨트 해설을 정성스럽게 작성해 주세요.`;

    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemPrompt
    });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 2500,
        temperature: 0.7,
      }
    });

    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      interpretation: responseText
    });

  } catch (error: any) {
    console.error('Genius Docent API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI 천재성 도슨트 해설을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
