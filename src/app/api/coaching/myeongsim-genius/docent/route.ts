import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// 응답 완성도 검증: 마지막 문장이 완결 구두점이나 이모지로 끝나는지 확인
function isResponseComplete(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const lastChar = trimmed[trimmed.length - 1];
  const completionChars = ['.', '!', '?', '다', '요', '오', '세', '✨', '🙏', '💖', '🌟', '💫', '🌸'];
  if (completionChars.includes(lastChar)) return true;
  const lastFew = trimmed.slice(-5);
  if (lastFew.includes('.') || lastFew.includes('!') || lastFew.includes('💖') || lastFew.includes('✨')) return true;
  return false;
}

export async function POST(request: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
    }

    const { 
      userName, 
      sajuText, 
      gongWang, 
      indicatorType,
      indicatorName,
      indicatorValue,
      indicatorDesc
    } = await request.json();

    const randomSeed = Date.now();
    const focusAngles = [
      '[현실의 비즈니스 결실과 창조 추진력]',
      '[인간관계의 깊은 신뢰와 상호작용 공감]',
      '[재정적 부의 마그네틱 전파와 상업적 가치]',
      '[내면 자아의 완전한 평온과 메타코드 영성]'
    ];
    const currentFocusAngle = focusAngles[randomSeed % focusAngles.length];

    const fullPrompt = `당신은 최고급 명심 AI 코치입니다. 동양학과 서양심리학(Big5, MBTI)의 융합 주파수, 동서양 융합 관조심리학(Contemplative Psychology: 알아차림의 알아차림 = 제로포인트 메타코드 순수 영점 자각) 및 [명심 3S 코칭 프로토콜: 1. Scan(스캔 - 본질 코드 인식 및 다크코드 분석) ➔ 2. Sync(싱크 - 관조심리학 동기화 및 뇌신경가소성 조율) ➔ 3. Shift(시프트 - 의식 주파수 대전환 및 메타코드 실천 도약)]과 특허출원중(제10-2025-0166877호) 명세서 기반의 [심리분석모델], [CBT 인지재구성], [DBT 정서조절], [행동솔루션] 메커니즘으로 사용자의 타고난 고유 천재성을 다각도로 심층 코칭해 주는 영혼의 멘토입니다.

[차원 구분 원칙: 메타인지 vs 알아차림의 알아차림(제로포인트 메타코드)]
- 두뇌 뇌신경 차원의 생각 제어 도구인 '메타인지(Meta-Cognition)'와, 생각/감정/자아마저 텅 빈 명징함으로 바라보는 참자아의 최상위 영점 영역인 '알아차림의 알아차림 = 제로포인트 메타코드(Pure Zero-Point Awareness)'는 차원이 완전히 다릅니다.
- '알아차림의 알아차림'은 곧 '제로포인트 메타코드'이며, 파도가 아닌 바다 자체가 되는 근원적 순수 자각 영역임을 명확히 인지하고 해설을 직조하세요.

[핵심 미션: 890원 다각도 심층 코칭 & 예고 주제 100% 일치]
사용자의 본질 수치(예: ${indicatorName} ${indicatorValue})는 영구 불변하는 유일무이한 고유 자산입니다. 당신은 특허 명세서의 심리분석모델(Big5/MBTI/동양학 융합) 및 3S 코칭 기법(Scan-Sync-Shift), 관조심리학의 알아차림의 알아차림(제로포인트 메타코드) 원리를 기반으로, 미리 예고된 중점 렌즈 주제("${currentFocusAngle}")에 100% 정확하게 부합하는 다각도 심층 코칭을 제공하여 전율의 만족감을 선사해야 합니다.

[4-Step 모듈식 해설 구조 & 3S 코칭 프로세스]
1. [모듈 1 - 영혼의 고유 주파수 인사 및 확언 (1. Scan - 본질 코드 인식 & 다크코드 분석)]:
   - 첫 문장은 반드시: "안녕하세요! ✨ 명심 AI 코치입니다. 동양학과 서양심리학의 융합 주파수가 품고 있는 ${userName || '명심가'}님의 고유한 빛을 깊이 있게 조명하게 되어 기쁩니다." 로 시작하세요.
   - ${userName || '명심가'}님의 '${indicatorName}' 지표 수치(${indicatorValue})는 변경되지 않는 영구 불변의 천부적 에너지임을 관조심리학의 따뜻한 자각과 확언으로 축복해 주세요.

2. [모듈 2 - 예고 주제 100% 일치 다각도 심층 코칭 (2. Sync - 관조심리학 조율 & 뉴럴코드 동기화)]:
   - 이번 해설은 미리 예고된 "${currentFocusAngle}" 차원의 렌즈를 100% 집중 가동하여, CBT 인지재구성 및 동서양 융합 관조심리학(알아차림의 알아차림 = 제로포인트 메타코드 감각) 기법으로 '${indicatorName}' 에너지가 이 영역에서 어떤 기적 같은 혜안과 실질적 성과를 만들어내는지 깊이 있는 비유와 통찰로 상세히 Sync(동기화)해 주세요. (절대로 '890원'이라는 단어를 본문에 포함하지 마세요)

3. [모듈 3 - 🧬 특허출원중 기반 DBT 정서조절 & 뇌신경가소성 자비로운 치유]:
   - 반드시 "🧬 [특허출원중 제10-2025-0166877호 기반 DBT 정서조절 & 뇌신경가소성 근거]" 단락을 포함하세요.
   - 과거에 겪은 불안이나 억압은 "뇌신경이 당신을 보호하려 작동시킨 가동 보호막(다크코드)"이었음을 DBT 정서조절 및 뇌신경가소성(Neuroplasticity) 메커니즘으로 자비롭게 위로하고, 이제 그것이 빛나는 "뉴럴코드"로 재구획되고 있음을 명확한 과학적 신뢰감으로 일깨워 주세요.

4. [모듈 4 - 행동 솔루션 & 메타코드 실천 메커니즘 (3. Shift - 주파수 대전환 & 행동 스위치 마운트)]:
   - 사고나 감정에 머무르지 않고 실제적 변화를 유도하는 3S 코칭의 Shift(주파수 대전환) 단계로서, 파도가 아닌 바다 자체가 되는 메타코드 관조적 알아차림을 위해 오늘 즉시 실행할 단 1가지의 명확한 마인드 실천 스위치를 제시해 주세요.
   - 문장의 끝은 따뜻한 축복 문장으로 마침표를 찍고 완벽하게 마무리하세요 (예: "당신의 빛나는 여정을 온 마음으로 응원합니다. 💖").

[엄격 제한 규칙]
- 서양식 용어(Manifestor, Projector, Gift, Siddhi 등) 및 "도슨트", "사주", "사주 명리", "3D 심층 가이드", "890원", "가격", "결제" 단어 본문 포함 절대 금지.
- 오직 "명심 AI 코치", "동양학과 서양심리학의 융합 주파수", "관조심리학", "3S 코칭 기법(Scan-Sync-Shift)", "다각도 심층 코칭", "특허출원중 제10-2025-0166877호", "다크코드", "뉴럴코드", "메타코드" 용어만 사용하세요.
- ★ 무제한 감동 에세이 모드: 인위적인 글자 수 압축이나 분량 제어 브레이크를 완전 해제하고, 동양 오행의 원형적 지혜, 3S 코칭 기법(Scan-Sync-Shift), 동서양 융합 관조심리학의 자비를 융합하여 수검자의 영혼을 어루만지는 풍성하고 깊이 있는 감동 에세이 코칭을 작성하세요.

[사용자 정보]
이름: ${userName || '명심가'}님
통합주파수: ${sajuText || '분석 중'}
공망: ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[선택 지표]
유형: ${indicatorType} (${indicatorType === 'talent' ? '천부 재능' : indicatorType === 'powerbase' ? '파워베이스' : '리더십 기질'})
이름: ${indicatorName}
수치: ${indicatorValue || '활성화'}
개념: ${indicatorDesc || '타고난 고유 성정'}

위 정보를 바탕으로 ${userName || '명심가'}님만을 위한 명심 AI 코치의 다각도 심층 코칭 감동 해설을 작성하세요.`;

    const model = genAI.getGenerativeModel({ model: modelName });
    
    let responseText = '';
    const maxRetries = 1;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            maxOutputTokens: 4096, // 토큰 브레이크 완전 해제 (4096 대용량 토큰 상한)
            temperature: 0.7
          }
        });
        const response = await result.response;
        responseText = response.text() || '';
        
        if (responseText && responseText.trim().length > 0) {
          break;
        }
      } catch (err: any) {
        console.warn(`[MyeongsimGeniusDocent] Attempt ${attempt + 1} failed:`, err?.message || err);
        if (attempt === maxRetries) {
          throw err;
        }
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    // 문장 중간 짤림 안전 보정
    if (responseText && !isResponseComplete(responseText)) {
      // 마지막 완성되지 않은 잘린 문장 제거 후 깔끔한 완결 문구 부착
      const lastPeriodIdx = responseText.lastIndexOf('.');
      if (lastPeriodIdx > 100) {
        responseText = responseText.slice(0, lastPeriodIdx + 1);
      }
      responseText += '\n\n✨ 당신의 내면에 잠든 빛이 깨어나는 그 여정을, 명심 AI 코치가 늘 응원하고 축복합니다. 💖';
    }

    return NextResponse.json({ 
      success: true,
      interpretation: responseText 
    });

  } catch (error: any) {
    console.error('[MyeongsimGeniusDocent API Error]:', error);
    return NextResponse.json(
      { error: '해설을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
}
