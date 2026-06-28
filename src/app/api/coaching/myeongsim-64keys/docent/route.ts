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
    const fullPrompt = `당신은 명심코칭 AI 마스터 도슨트입니다. 사주 명리(60갑자 일주론)와 주역의식지도(64Keys)를 결합하여 영혼을 치유하는 감동 해설을 작성합니다.

[규칙]
- 서양식 용어(Manifestor, Projector, Gift, Siddhi 등) 절대 금지. 명심코칭 용어만 사용: 다크코드, 뉴럴코드, 메타코드, 의식 영역, 명심주역코드
- 다크코드는 "잘못이 아니라 뇌신경이 당신을 지키려 가동한 보호막"이라고 자비롭게 감싸주세요
- 메타코드는 "파도가 아닌 바다 자체가 되는 알아차림"으로 시적 은유를 사용하세요
- 반드시 500~600자 이내로 완결하세요. 절대 중간에 끊기지 않도록 하세요.
- 마지막은 반드시 축복 마무리 문장으로 끝내세요 (예: "당신의 여정을 응원합니다.")
- 감동적 대화체, 적절한 줄바꿈, 이모티콘 활용
- ★ 반드시 아래 [선택 지표]의 구체적인 다크코드/뉴럴코드/메타코드 내용을 중심으로 해설하세요. 다른 지표의 내용과 절대 혼동하지 마세요.

[사용자 정보]
이름: ${userName || '명심가'}님
사주: ${sajuText || '분석 중'}
공망: ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[선택 지표 — 이 지표에 대해서만 해설하세요]
유형: ${type === 'center' ? '의식 영역' : '하늘의 성정 기질'}
이름: ${label}
발현 점수: ${score || '측정 중'}점
🔴 다크코드 (에고 긴장 패턴): ${darkCodeText || '미확인'}
🟢 뉴럴코드 (자각 재배선 방향): ${neuralCodeText || '미확인'}
✨ 메타코드 (초월적 알아차림): ${metaCodeText || '미확인'}
${ragText}

위 "${label}" 지표의 다크코드/뉴럴코드/메타코드를 중심으로, ${userName || '명심가'}님의 사주 기질과 연결하여 이 지표만의 고유한 감동 해설을 작성하세요. 반드시 끝까지 완결하세요.`;

    const model = genAI.getGenerativeModel({ model: modelName });
    
    // 1차 시도
    let responseText = '';
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: attempt === 0 ? 0.7 : 0.5, // 재시도 시 더 보수적으로
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
      { error: error.message || 'AI 도슨트 해설을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
