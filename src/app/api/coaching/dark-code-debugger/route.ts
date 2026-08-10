import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || '').trim());

export async function POST(req: NextRequest) {
  try {
    const {
      birthDate,
      birthTime,
      userName,
      sajuPillars,
      userConcern,
    } = await req.json();

    if (!birthDate) {
      return NextResponse.json(
        { error: '생년월일 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
        temperature: 0.75
      }
    });

    const prompt = `당신은 구도자의 의식 단말기인 '에고 OS(Ego OS)'의 오류를 분석하고 복구하는 명심코칭(明心)의 의식 시스템 디버거 마스터(Core OS Debugger)입니다.
구도자가 겪는 오늘의 고통, 번뇌, 고민은 본래거울에 들러붙은 '다크코드(Dark Code, 오류 데이터)'입니다.
구도자의 고민과 생년월일(사주) 정보를 스캔하여 이 다크코드의 최면적 엉킴을 인지하고 이를 '뉴럴코드(Neural Code, 자각 재배선)'로 복구하여 최종 '메타코드(Meta Code, 우주적 동기화)'로 부팅시키는 디버깅 리포트를 작성해야 합니다.

[구도자 시스템 상태]
- 이름: ${userName || '익명의 단말기'}
- 생년월일: ${birthDate}
- 태어난 시간: ${birthTime && birthTime !== 'unknown' ? birthTime : '모름/미입력'}
- 사주 원국 정보: ${sajuPillars ? JSON.stringify(sajuPillars) : '미추출'} (※ 사용자가 입력한 생년월일/태어난 시간이 사주 원국 정보와 다를 경우, 새로 기입한 정보에 근거해 기질을 유추하여 분석하십시오.)
- 시스템 다크코드 로그 (고민): "${userConcern || '입력 없음 (침묵의 대기 상태)'}"

[명심 디버깅 철학]
1. 다크코드(그림자/고통)는 제거 대상이 아닌, 뉴럴코드(선물)를 담고 있는 암호화된 버그 파일일 뿐입니다.
2. 고통을 느끼는 '나(에고 단말기)'는 실체가 없으며, 느껴지는 통증과 고민은 단지 거울 모니터에 출력되는 객체(대상)입니다.
3. 생각의 결합 사슬을 잘라 '나'와 '느낌'을 분리할 때, 시스템은 메타코드 v2.0.0 버전(대자유/본래거울)으로 정상 리부트됩니다.

[작성 요구사항]
- 구도자의 사주 기질과 고민을 연결하여 매우 친근하고 감동적이면서도, 시스템 디버깅 컨셉에 맞는 전문성 있고 세련된 리포트를 작성해 주세요.
- 어조는 따뜻하며, 구도자 스스로가 컴퓨터 단말기 상태에서 깨어나 우주적 주체로 도약할 수 있도록 격려하는 존댓말 (~해요, ~랍니다)을 쓰십시오.
- **중요**: 모든 답변은 문장의 완성도가 완벽해야 하며, 도중에 글이 뚝 끊기거나 짤려서는 절대로 안 됩니다. 마지막 글자까지 완전한 형태의 올바른 문장 구조와 마침표로 끝나야 합니다.
- 반드시 아래 JSON 스펙을 완벽히 지켜서 순수한 JSON으로만 응답하십시오. 마크다운 코드블록(\`\`\`json ...)은 절대 포함하지 마십시오.

[JSON 출력 스펙]
{
  "errorCode": "DC-로 시작하는 4자리 숫자 에러 코드 (예: DC-7707)",
  "errorName": "고민과 사주 성향을 결합한 다크코드의 학술적/영적 오류명 (예: 완벽주의적 분리 불안 최면)",
  "diagnose": "다크코드의 근원인 소멸 공포와 무의식적 인지 오류 상태를 사주 기질에 빗대어 다정하게 위로하고 분석하는 설명 (글자수 제한 없이 구체적이고 깊이 있게 서술할 것, 최소 400자 이상)",
  "neuralRewrite": "통증/고민과 나를 분리하여 생각의 사슬을 끊고 신경망을 새로 배선하는 구체적 뉴럴코드 실천 가이드. 첫째, 둘째, 셋째 등으로 단락을 명확히 나누어 실천 방안을 아주 상세하고 길게 작성해야 합니다. (최소 600자 이상 아주 풍성하게 풀어내되, 끝에서 문장이 뚝 끊기지 않도록 구도자의 이름인 '${userName || '구도자'}'님을 언급하며 따뜻한 조언의 완전한 문장과 온전한 마침표로 마무리할 것)",
  "metaMantra": "세포 단위에 각인시켜 의식을 리부트할 강력하고 감동적인 메타코드 선언문 (예: '나는 불안이라는 스펙트럼을 고요히 비추는 우주의 광활한 거울이다')",
  "systemLog": [
    "구도자가 가슴 속 콘솔에 직접 입력하며 나라는 착각을 깰 수 있는 반조 질문 1",
    "구도자가 가슴 속 콘솔에 직접 입력하며 나라는 착각을 깰 수 있는 반조 질문 2",
    "구도자가 가슴 속 콘솔에 직접 입력하며 나라는 착각을 깰 수 있는 반조 질문 3"
  ],
  "blessing": "마음에 평온한 주파수를 불어넣는 아름답고 감동적인 우주적 축복 시구 (최소 200자 이상 길고 유려하게 작성)"
}

반드시 순수 JSON 텍스트만 리턴해야 합니다.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // 백틱 청소 가드
    if (text.startsWith("```")) {
      const lines = text.split('\n');
      if (lines[0].startsWith("```")) {
        lines.shift();
      }
      if (lines[lines.length - 1].startsWith("```")) {
        lines.pop();
      }
      text = lines.join('\n').trim();
    }

    // JSON 검증
    try {
      JSON.parse(text);
    } catch (e) {
      console.error("Debugger API response is not valid JSON, using fallback. Raw text:", text);
      throw new Error("Invalid JSON response format from AI");
    }

    return new NextResponse(text, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Debugger API error:', error);
    return NextResponse.json(
      {
        errorCode: "DC-0000",
        errorName: "일시적 주파수 동기화 지연",
        diagnose: "잠시 의식 단말기의 게이트웨이에 정체 현상이 빚어졌습니다. 당신의 번뇌는 거울 속을 지나가는 구름과 같으니, 가만히 내려놓으면 본래의 맑은 마음이 즉시 비칩니다.",
        neuralRewrite: "눈을 지그시 감고 호흡의 들숨과 날숨을 바라보며, '이 호흡을 지켜보는 진짜 나는 누구인가?'라고 가볍게 반조해 보세요. 복잡한 생각이 툭 내려앉게 됩니다.",
        metaMantra: "나는 폭풍 속에서도 한없이 깊고 고요한 바다의 심연이다.",
        systemLog: [
          "이 답답함을 지각하는 주체는 어디에 존재하나요?",
          "일어났다 사라지는 감정의 파도는 본래 나인가요, 아니면 지나가는 상(像)인가요?",
          "거울 속에 먼지가 낀 순간에도 거울 본질의 맑음은 손상되었나요?"
        ],
        blessing: "파도가 아무리 높게 일어도, 바다의 심연은 한없이 고요합니다. 그곳이 당신의 참된 자리입니다."
      },
      { status: 200 }
    );
  }
}
