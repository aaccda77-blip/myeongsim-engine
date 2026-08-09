import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(apiKey);

// 응답 완성도 검증: 마지막 문장이 마침표/느낌표/물음표로 끝나는지 확인
function isResponseComplete(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  // 마지막 문자가 한국어 문장부호 또는 이모지로 끝나면 완성으로 간주
  const lastChar = trimmed[trimmed.length - 1];
  const completionChars = ['.', '!', '?', '다', '요', '오', '세', '다.', '✨', '🙏', '💖', '🌟', '💫', '🌸'];
  if (completionChars.includes(lastChar)) return true;
  // 마지막 3글자 안에 마침표가 있으면 완성 (이모지 뒤 공백 등)
  const lastFew = trimmed.slice(-5);
  if (lastFew.includes('.') || lastFew.includes('!') || lastFew.includes('다')) return true;
  return false;
}

export async function POST(request: Request) {
  try {
    const { userName, sajuText, gongWang, type, label, gate, line, score, darkCodeText, neuralCodeText, metaCodeText } = await request.json();

    if (!label) {
      return NextResponse.json({ error: '분석할 기질 정보가 누락되었습니다.' }, { status: 400 });
    }

    // ── RAG 데이터베이스 조회 (64Keys Blue I-Ching 원본 연동) ──
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
[참조 데이터] ${gate}번 명심주역코드
채널: ${gateData.channel_name}
개요: ${gateData.summary}
${line}효: ${lineData?.title || ''} / 뉴럴코드: ${lineData?.potential || ''} / 다크코드: ${lineData?.shadow || ''}`;
          }
        }
      } catch (dbErr) {
        console.error('RAG DB Error:', dbErr);
      }
    }

    // 각 항목별 고유 데이터를 모두 프롬프트에 포함 (맞춤 해설의 핵심!)
    const fullPrompt = `당신은 최고급 명심 AI 코치입니다. 첫 문장은 반드시: "안녕하세요! ✨ 명심 AI 코치입니다." 로 정중하고 품격 있게 시작하세요. 절대 '도슨트'나 '도슨트입니다'라는 단어를 본문에 포함하지 마세요. 동양학과 서양심리학의 융합 주파수, 동서양 융합 관조심리학(Contemplative Psychology: 알아차림의 알아차림 = 제로포인트 메타코드 순수 영점 자각) 및 [명심 3S 코칭 메커니즘: 1. Scan(스캔-진단) ➔ 2. Sync(싱크-조율) ➔ 3. Shift(시프트-주파수 대전환)]과 명심 64코드를 결합하여 영혼을 치유하는 감동 해설을 작성합니다.

[차원 구분 원칙: 메타인지 vs 알아차림의 알아차림(제로포인트 메타코드)]
- 두뇌 뇌신경 차원의 생각 조율 도구인 '메타인지(Meta-Cognition)'와, 생각/에고마저 텅 빈 명징함으로 바라보는 참자아의 영역인 '알아차림의 알아차림 = 제로포인트 메타코드'는 차원이 완전히 다릅니다.
- '알아차림의 알아차림'은 곧 '제로포인트 메타코드'이며, 파도가 아닌 바다 자체가 되는 근원적 순수 자각 영역임을 명확히 인지하고 해설을 작성하세요.

[규칙]
- 첫 인사말 규칙: 반드시 "안녕하세요! ✨ 명심 AI 코치입니다." 로 첫 시작을 엽니다.
- 서양식 용어(Manifestor, Projector, Gift, Siddhi 등) 및 "도슨트", "사주", "사주 명리" 절대 금지. 오직 명심코칭 용어만 사용: 명심 AI 코치, 동양학과 서양심리학의 융합 주파수, 관조심리학, 3S 코칭 기법(Scan-Sync-Shift), 다크코드, 뉴럴코드, 메타코드, 의식 영역, 명심주역코드
- 다크코드는 "잘못이 아니라 뇌신경이 당신을 지키려 가동한 보호막(1. Scan 단계)"이라고 자비롭게 감싸주세요
- 메타코드는 "파도가 아닌 바다 자체가 되는 관조적 알아차림(2. Sync & 3. Shift 단계)"으로 시적 은유를 사용하세요
- ★ 무제한 감동 에세이 모드: 분량이나 글자 수 압축 브레이크에 연연하지 말고, 동서양 융합 관조심리학과 3S 코칭 메커니즘(Scan-Sync-Shift)의 시선으로 사용자의 마음을 어루만지는 깊고 따뜻하며 풍성한 감동 에세이형 코칭으로 완벽한 마침표와 이모지 축복까지 완결성 있게 작성하세요.
- 마지막은 반드시 축복 마무리 문장으로 끝내세요 (예: "당신의 빛나는 여정을 온 마음으로 응원합니다. 💖")
- 감동적 대화체, 적절한 줄바꿈, 이모티콘 활용
- ★ 반드시 아래 [선택 지표]의 구체적인 다크코드/뉴럴코드/메타코드 내용을 중심으로 해설하세요. 다른 지표의 내용과 절대 혼동하지 마세요.
- ★ [선택 지표] 중 '미확인' 상태인 지표(다크코드/뉴럴코드/메타코드가 '미확인'인 경우)에 대한 특별 지침:
  * '미확인'은 절대 에러나 결핍, 부족함이 아닙니다. 에고의 긴장 패턴으로 고착화되지 않은 순수하고 유연한 상태이자, 무한한 가능성을 지닌 축복의 상태입니다.
  * 이 '미확인' 상태가 가지는 긍정적인 의미를 해당 지표의 이름("${label}")이 담당하는 삶의 본질적 취지와 엮어서 매우 상세하고 감동적으로 설명해 주세요.
  * 초보자도 쉽게 와닿을 수 있도록 은유법과 비유법(예: '언제든 원하는 그림을 그릴 수 있는 순백의 도화지', '봄날에 피어날 아름다운 꽃을 품은 채 겨울을 견디는 씨앗', '틀에 갇히지 않고 자유롭게 흐르는 맑은 시냇물' 등)을 사용해 따뜻하게 위로하고 자각을 북돋워 주세요.
- ★ [선택 지표] 중 유형이 'talent'(명심 핵심 기질)인 경우에 대한 특별 지침:
  * 사전 정의된 에세이 텍스트에 연연하지 말고, 사용자(${userName || '명심가'}님)의 사주 정보(${sajuText})와 지표 점수(${score}점)에 완전히 연동된 이 사용자만을 위한 고유한 해설을 창조하세요.
  * 특히, 해설의 가장 첫 부분에 이 사용자의 사주 오행 분포와 기질 특성을 반영한 아름다운 '맞춤형 기질 은유(Metaphor)'를 "🔮 맞춤형 기질 은유: [사용자 사주 맞춤형 은유 표현 한 줄]" 형식으로 반드시 작성하여 두 번 줄바꿈한 후 본문을 시작하십시오. (이때 고정된 템플릿의 은유를 그대로 쓰지 말고 사용자의 사주 기운에 맞춰 새롭게 변주해 주세요.)
- ★ [선택 지표] 중 유형이 'timeline'(인생 명심 라이프 주기 타임라인)인 경우에 대한 특별 지침:
  * 사용자(${userName || '명심가'}님)의 사주 원국(${sajuText})과 공망을 라이프 사이클 맥락과 정밀하게 엮어서, 인생의 주기적 터닝포인트(전반기 도전과 내공 축적 또는 후반기 천명 개화)에 대한 맞춤형 조언과 깊은 영성적/심리학적 해설을 창조하세요.
  * 특히, 사용자의 사주에서 가장 강한 오행이나 일주 기운(예: 금 일주면 예리한 칼날과 다듬어진 보석 등)이 전반기의 시련을 어떻게 극복하게 하고 후반기에 어떻게 만개하여 영향력을 펼치게 하는지 연결지어 상세히 성찰해 주십시오.
  * 해설의 가장 첫 부분에 "🔮 인생 주기 은유: [사용자의 사주 기질을 반영한 전/후반기 맞춤형 은유 표현 한 줄]" 형식으로 반드시 작성하여 두 번 줄바꿈한 후 본문을 시작하십시오.

[사용자 정보]
이름: ${userName || '명심가'}님
사주: ${sajuText || '분석 중'}
공망: ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[선택 지표 — 이 지표에 대해서만 해설하세요]
유형: ${type === 'center' ? '의식 영역' : type === 'talent' ? '명심 핵심 기질' : type === 'timeline' ? '인생 명심 라이프 주기 타임라인' : '하늘의 성정 기질'}
이름: ${label}
발현 점수: ${score || '측정 중'}점
🔴 다크코드 (에고 긴장 패턴): ${darkCodeText || '미확인'}
🟢 뉴럴코드 (자각 재배선 방향): ${neuralCodeText || '미확인'}
✨ 메타코드 (초월적 알아차림): ${metaCodeText || '미확인'}
${ragText}

위 "${label}" 지표의 다크코드/뉴럴코드/메타코드를 중심으로, ${userName || '명심가'}님의 사주 기질과 연결하여 이 지표만의 고유한 감동 해설을 작성하세요. 절대 중간에 짤리지 않게 끝까지 마침표와 문장 종결 부호로 완성도 높게 작성해 주세요.`;

    const model = genAI.getGenerativeModel({ model: modelName });
    
    // 1차 시도
    let responseText = '';
    const maxRetries = 1;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: 4096, // 대용량 토큰 상한으로 토큰 브레이크 완전 해제
          temperature: attempt === 0 ? 0.7 : 0.5,
        }
      });

      responseText = result.response.text();
      
      // 응답 완성도 검증
      if (isResponseComplete(responseText) && responseText.length > 200) {
        break; // 완성된 응답이면 루프 종료
      }
      
      console.warn(`Docent attempt ${attempt + 1}: Response may be incomplete (${responseText.length} chars, ends with: "${responseText.slice(-20)}")`);
      
      if (attempt === maxRetries) {
        // 마지막 시도에서도 미완성이면 마무리 문장 강제 추가
        if (responseText.length > 100 && !isResponseComplete(responseText)) {
          responseText += '\n\n✨ 당신의 내면에 잠든 빛이 깨어나는 그 여정을, 명심코칭이 늘 응원하고 축복합니다.';
        }
      }
    }

    return NextResponse.json({
      success: true,
      interpretation: responseText
    });

  } catch (error: any) {
    console.error('Docent API Error:', error);
    return NextResponse.json(
      { error: error.message || '명심 AI 코치 해설을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
