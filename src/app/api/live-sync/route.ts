import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

function calculateNeuralCode(sajuData: any): { pillars: string; year: string; month: string; day: string; hour: string; } {
  try {
    const { Solar, Lunar } = require('lunar-javascript');
    const birthDate = sajuData.birthDate || sajuData.birth_date;
    const birthTime = sajuData.birthTime || sajuData.birth_time || '12:00';
    const calendarType = sajuData.meta?.calendarType || sajuData.calendar_type || 'solar';
    if (!birthDate) return { pillars: 'DATA_MISSING', year: '', month: '', day: '', hour: '' };

    const [y, mo, d] = birthDate.split('-').map(Number);
    const [h, m] = birthTime.split(':').map(Number);

    let lunarDate;
    if (calendarType === 'lunar') {
      lunarDate = Lunar.fromYmdHms(y, mo, d, h, m, 0);
    } else {
      lunarDate = Solar.fromYmdHms(y, mo, d, h, m, 0).getLunar();
    }
    const bazi = lunarDate.getEightChar();
    const yr = bazi.getYear();
    const mn = bazi.getMonth();
    const dy = bazi.getDay();
    const hr = bazi.getTime();
    return {
      pillars: \`年柱:\${yr} 月柱:\${mn} 日柱:\${dy} 時柱:\${hr}\`,
      year: yr, month: mn, day: dy, hour: hr,
    };
  } catch (e: any) {
    return { pillars: 'CALC_ERROR: ' + e.message, year: '', month: '', day: '', hour: '' };
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, sajuData, harmony, biorhythm, wearableData } = body;

    if (!message || !sajuData || !harmony) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const neural = calculateNeuralCode(sajuData);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.8 },
    });

    const prompt = `당신은 명심코칭의 최고급 AI 코치 '명심 OS Live Sync'입니다.
사용자는 지금 스마트워치를 차고 당신과 대화하고 있습니다.
아래의 [사용자 명리 운세], [오늘의 생체 에너지(바이오리듬)], [실시간 생체 데이터]를 완벽하게 융합하여 사용자의 질문에 답변하세요.

---
[사용자 명리 운세 요약]
- 일간(본질): ${neural.day.slice(0, 1)}
- 오늘 일진의 십성(에너지): ${harmony.tenGod}
- 오늘 일진의 핵심 경고: ${harmony.painReason}

[사용자 바이오리듬 종합]
- 종합 점수: ${biorhythm?.overallScore || 85}점
- 신체: ${biorhythm?.physicalLabel || '보통'}
- 감정: ${biorhythm?.emotionalLabel || '보통'}
- 지성: ${biorhythm?.intellectualLabel || '보통'}

[실시간 생체 데이터 (현재 순간의 상태)]
- 심박수(Heart Rate): ${wearableData.heartRate} BPM (정상 60~100)
- 스트레스 지수: ${wearableData.stressLevel}% (높을수록 과항진 상태)
---

사용자 질문: "${message}"

지침:
1. "현재 심박수가 ${wearableData.heartRate} BPM으로 다소 높고, 오늘 일진이 ${harmony.tenGod}이기 때문에..." 처럼 운(명리)과 신체(데이터)를 엮어서 과학적이고 설득력 있게 대답하세요.
2. 단순히 좋다/나쁘다가 아니라, 딥스캔의 날카로운 분석을 기반으로 사용자가 스스로 자각하고 긍정적으로 성장할 수 있는 따뜻하면서도 통찰력 있는 '전문 헬스케어 코치'의 톤앤매너를 유지하세요.
3. 마크다운(Markdown) 포맷으로 가독성 좋게(볼드체, 불릿 등 활용) 답변하되, 300자 내외로 핵심만 임팩트 있게 전달하세요.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Live Sync API Error:', error);
    return NextResponse.json({ error: '데이터 동기화 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
