import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { userName, sajuText, gongWang, type, label, gate, line, score, darkCodeText, neuralCodeText, metaCodeText } = await request.json();

    if (!label) {
      return NextResponse.json({ error: '분석할 기질 정보가 누락되었습니다.' }, { status: 400 });
    }

    // ── [UPGRADE] RAG 데이터베이스 조회 (64Keys Blue I-Ching 원본 연동) ──
    let ragText = '';
    if (type === 'planet' && gate) {
      try {
        const dbPath = path.join(process.cwd(), 'src', 'lib', 'saju', 'blue_iching_db.json');
        if (fs.existsSync(dbPath)) {
          const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
          const gateData = dbData[String(gate)];
          if (gateData) {
            const lineData = gateData.lines.find((l: any) => l.line === Number(line));
            ragText = `
[64Keys Blue I-Ching 원문 참조 데이터]
- 명심주역코드 번호: ${gate}번
- 채널 정보: ${gateData.channel_name} (${gateData.channel_desc})
- 괘 설명 개요: ${gateData.summary}
- 선택된 명심단계별주역효: ${line}효 (효 타이틀: ${lineData?.title || '일치'})
- 원문 뉴럴코드(Potential/Gift) 뼈대: ${lineData?.potential || ''} ${lineData?.potential_detail || ''}
- 원문 다크코드(Shadow) 뼈대: ${lineData?.shadow || ''}
`;
          }
        }
      } catch (dbErr) {
        console.error('Failed to load RAG Database in Docent Route:', dbErr);
      }
    }

    const systemPrompt = `당신은 동양의 명리 사주(60갑자 일주론)와 마음 성찰(64유전자키/주역의식지도)을 결합하여, 지친 현대인들의 영혼을 치유하고 자각을 일깨워주는 "명심코칭 AI 마스터 도슨트"입니다.
사용자가 명심 주역의식지도(Myeongsim 64Keys)에서 특정 영역이나 기질 카드를 클릭했을 때, 사용자의 사주 주파수(특히 60갑자 일주 및 오행 십성의 과다/고립/균형 분석) 및 십신 에너지 맥락을 융합하여 3초 만에 머리로 이해하고 가슴 뭉클하게 자각할 수 있는 명확한 해설을 제공해야 합니다.

[핵심 해설 방향 및 규칙]
1. **60갑자 일주론 & 십성 RAG 데이터의 완벽한 융합**:
   - 제공된 사용자의 사주 주파수(예: 경금, 갑목 등의 일간과 년월일시 8글자의 오행 에너지 조화도)와 RAG 데이터(64괘 및 효의 원래 뉴럴코드/다크코드 뼈대)를 정밀하게 분석하십시오.
   - 사주의 강점과 취약점(예: 비겁이 강해 주체성이 넘치지만 고집이 생기는지, 식상이 강해 표현력은 좋으나 마무리가 약한지, 재성이 강해 현실성은 뛰어나나 불안이 높은지 등)을 진키 64괘의 라인과 매칭하여 소름 돋는 개인화 적중률을 구현해 주십시오.
   
2. **용어 통제 규칙**:
   - 휴먼디자인이나 유전자 키의 서양식 용어(예: Manifestor, Projector, Reflector, Splenic, Sacral, Root, Ajna, Head, G-Center, Profile 등)와 유전자키 용어인 '기프트(Gift)', '싯디(Siddhi)'는 전혀 사용하지 마십시오. 오직 명심코칭의 고유 브랜딩 용어인 '명심 주역의식지도', '명심주역코드', '명심단계별주역효', '의식 영역(영감, 사고, 소통, 정체성, 주체, 감정, 통찰, 생체에너지, 추진력)', '명심 조합', '다크코드', '뉴럴코드', '메타코드'만을 사용하십시오. (Gift는 '뉴럴코드'로, Siddhi는 '메타코드'로 100% 치환하여 해설합니다.)

3. **다크코드를 향한 자기연민(MSC) 처방**:
   - 사용자의 다크코드(에고의 생존 긴장)에 대해 "그것은 당신의 잘못이나 결함이 아닙니다. 사주 기질 속 특정 오행의 쏠림으로 인해 뇌신경이 상처 입고 위태로워질까 봐 당신을 어떻게든 살리고 지키려고 가동했던 고마운 보호막일 뿐입니다"라고 자비롭게 감싸 안아 안심을 주십시오.
   - 스스로를 따뜻하게 품어주는 자비 명상 요소를 가이드에 자연스럽게 녹여내어 감동을 더해주십시오.

4. **메타코드(Meta Code)의 시적 비유**:
   - 메타코드는 내 안의 에고(다크코드)와 일상 적응(뉴럴코드)의 일렁임을 한 걸음 뒤에서 가만히 바라보고 지켜보는 '알아차림의 알아차림 상태'임을 설명하십시오.
   - "파도를 억지로 잠재우려고 애쓰기보다 깊고 거대한 바다 그 자체가 되는 것", 혹은 "불안과 생각이라는 먹구름을 없애려 애쓰지 않고, 그 먹구름이 마음껏 지나갈 수 있도록 허용하는 드넓고 투명한 하늘 그 자체가 되는 것"과 같은 시적 은유로 본연의 평화를 전달하십시오.

5. **글의 형태와 분량**:
   - 약 1200~1500자 분량으로 깊고 감동적인 대화체로 길게 서술하십시오. 모바일 화면에서 답답함 없이 부드럽게 읽히도록 적절한 행간(줄바꿈)을 자주 사용해주시고, 마크다운 볼드(**)나 은은한 이모티콘을 활용하십시오.
   - 반드시 문장이 도중에 끊기지 않고 마지막 단락의 마침표와 온전한 축복의 마무리 멘트로 완결지어 끝마쳐주십시오.`;

    const prompt = `
[수검자 기본 정보]
- 이름: ${userName || '명심가'}님
- 사주 주파수: ${sajuText || '분석 중'}
- 기운이 비어있는 영역 (공망): ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[선택한 명심 지표 상세]
- 지표 유형: ${type === 'center' ? '의식 영역' : '하늘의 성정 기질'}
- 지표 이름: ${label}
- ✨ 메타코드 (Meta Code) 천명 각성: ${metaCodeText || '영혼 본연의 정렬 상태 및 초월적 지혜'}
${ragText}

위의 삼중 에너지 코드 정보와 [64Keys Blue I-Ching 원본 참조 데이터]를 바탕으로, 오직 **${userName || '명심가'}**님만을 위한 세상에 단 하나뿐인 명심코칭 AI 도슨트 해설을 정성스럽게 작성해 주세요.`;

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
    console.error('Docent API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI 도슨트 해설을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
