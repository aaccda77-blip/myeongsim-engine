import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { calculateSaju, generateSajuPromptBlock } from '@/lib/saju/SajuEngine';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: Request) {
  try {
    const { userId, birthDate, birthTime, calendarType, gender, userName, locale } = await request.json();

    if (!birthDate) {
      return NextResponse.json({ error: '생년월일 정보가 필요합니다.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // 1. 사주 오행 데이터 산출
    const effectiveTime = birthTime || '12:00';
    const effectiveCalendar = calendarType || 'solar';
    const effectiveGender = gender || 'male';

    const sajuResult = await calculateSaju(
      birthDate,
      effectiveTime,
      effectiveCalendar,
      effectiveGender
    );

    if (!sajuResult.success || !sajuResult.fourPillars) {
      return NextResponse.json({ error: '사주 분석에 실패했습니다.' }, { status: 500 });
    }

    // 오행 분포 산출
    const pillars = sajuResult.fourPillars;
    const elements = [
      pillars.year.ganElement,
      pillars.year.jiElement,
      pillars.month.ganElement,
      pillars.month.jiElement,
      pillars.day.ganElement,
      pillars.day.jiElement,
      pillars.time.ganElement,
      pillars.time.jiElement,
    ];

    const elementCounts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    elements.forEach(el => {
      if (elementCounts[el] !== undefined) {
        elementCounts[el]++;
      }
    });

    // 2. Gemini 2.5-flash Structured Output을 위한 스키마 모델 정의
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 8000,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            structure_type: { 
              type: SchemaType.STRING, 
              description: '정격(균형 지향형)인지 종격(특수 대세 순응형)인지 판별한 메인 타입 명칭 ("정격" 또는 "종격" 둘 중 하나)' 
            },
            korean_name: { 
              type: SchemaType.STRING, 
              description: '판독된 세부 사주 격국 명칭 (예: "종재격(從財格)" 또는 "식신격(食神格)" 등)' 
            },
            polarization_score: { 
              type: SchemaType.NUMBER, 
              description: '오행의 쏠림도 점수 (1~100). 중요: structure_type이 "정격"이면 이 점수는 반드시 1~49 범위 내로 낮게 주어야 하고, "종격"이면 반드시 70~100 범위 내로 높게 주어야 합니다.' 
            },
            myeongri_analysis: { 
              type: SchemaType.STRING, 
              description: '사주의 기운 배치 상태와 일간(나) 주변 오행의 세력을 다정하고 전문적으로 분석 설명하는 텍스트 (한국어로 작성)' 
            },
            mental_strategy: { 
              type: SchemaType.STRING, 
              description: '사주 구조에 맞춰, 세상을 살아가는 멘탈케어 방법 (정격: 중심을 지키고 오행 균형 맞추기 / 종격: 나를 비우고 세상을 수용하며 대세 파도를 타기) 설명 텍스트' 
            },
            crystal_mantra: { 
              type: SchemaType.STRING, 
              description: '내면 세포에 각인할 강력한 메타코드 선언문 (예: "나는 세상을 지배하려는 나를 버리고 거대한 물길에 나를 맡기는 바다이다")' 
            },
            daily_tuning_action: { 
              type: SchemaType.STRING, 
              description: '격국에 따라 에너지를 조율하기 위해 오늘 바로 실천할 구체적이고 사소한 1단계 리셋 액션' 
            }
          },
          required: [
            'structure_type', 
            'korean_name', 
            'polarization_score', 
            'myeongri_analysis', 
            'mental_strategy', 
            'crystal_mantra', 
            'daily_tuning_action'
          ]
        }
      }
    });

    let languageInstruction = "";
    if (locale === 'en') {
      languageInstruction = `
        - Respond in English.
        - Translating Eastern Myeongri/Saju terms into English must map them to Carl Jung's psychological archetypes instead of literal transcriptions:
          * Bigeop/Bi-Geop (비견/겁재) -> "The Sovereign" or "Self-Assertion" (sovereignty, independence)
          * Inseong/Pyeon-In (편인/정인) -> "The Mystic Sage" or "Deep Archetypal Thinker" (intuition, introspection)
          * Sik-Sang (식신/상관) -> "The Alchemist of Expression" or "Creative Force" (creativity, expression)
          * Jae-Seong (재성) -> "The Master of Reality" or "Manifestation Energy" (realization, control)
          * Gwan-Seong (관성) -> "The Guardian of Order" or "Structural Discipline" (discipline, order)
        - Structure your output properties (structure_type, korean_name, myeongri_analysis, mental_strategy, crystal_mantra, daily_tuning_action) in beautiful English.
        - Do not use literal Hanja transcriptions like "Pyeon-Jae-Gyeok"; instead use the translated archetype term (e.g. "Manifestation Energy Archetype" or "Sovereign Archetype").
      `;
    } else if (locale === 'jp') {
      languageInstruction = "必ず日本語で温かく論理的に作成してください。全てのプロパティ（structure_type, korean_name, myeongri_analysis 등）のテキストを日本語で記述してください。";
    } else if (locale === 'cn') {
      languageInstruction = "必须使用中文（简体）温暖且条理清晰地回答。所有属性의 텍스트를 중국어로 채우세요.";
    } else {
      languageInstruction = "반드시 한국어로 존댓말(~해요, ~랍니다)을 사용하여 따뜻하고 논리정연하게 작성하세요.";
    }

    const systemInstruction = `
      당신은 사주명리의 음양오행 및 격국학(格局學)과 현대 정신의학/심리학을 결합하여, 유저의 내면 에너지를 튜닝하는 '명심코칭 OS'의 구조 분석 모듈입니다.
      유저의 생년월일시 및 산출된 사주 오행 분포 통계 데이터를 토대로, 이 사주가 '정격(균형 지향적 내격)'에 가까운지, 아니면 특정 기운이 너무 쏠려 '종격(대세에 올인하는 특수 외격)'에 가까운지 판별하고,
      이를 유저의 멘탈케어 전략과 매칭하여 세계적인 멘탈케어 수준의 다정하고 세련된 분석 리포트를 작성하세요.
      기질을 부정하기보다 있는 그대로의 강점으로 연성(변화)하도록 독려하세요.
      ${languageInstruction}

      [격국(格局) 판정의 절대 원칙 - 명리학 정석 기준]
      1. 격국은 단순히 사주의 전체 오행 개수(비겁이 많다고 해서 비견격/비겁격이 되는 것이 아님)가 아니라, **월지(月支) 지장간(地藏干)의 투출(透出) 여부**를 최우선 기준으로 판정해야 합니다.
      2. **월지 지장간 투출 원칙 (1순위):**
         - 월지 지장간의 글자 중 천간(년간, 월간, 시간)에 투출한 글자가 있다면, 그 글자의 십신(十神)을 격국명으로 확정합니다.
         - 예: 경신년(庚申) 계미월(癸未) 신사일(辛巳) 을미시(乙未) 사주
           - 일간: 辛 (신금)
           - 월지: 未 (미토)
           - 미토(未土)의 지장간: 기(己), 정(丁), 을(乙)
           - 이 중 **시간에 을목(乙木, 편재)이 투출**함.
           - 따라서 이 사주는 비겁(금)이 많더라도 격국은 반드시 **"편재격(偏財格)"**이어야 합니다. 결코 "비견격"이나 "비겁격"이 되어서는 안 됩니다.
      3. 일반적인 격국 분류에 '비견격'이나 '비겁격'은 기본적으로 성립하지 않습니다. (월지가 비겁인 경우 '건록격' 또는 '양인격'이라 칭합니다). 월지가 비겁이 아니면서 다른 십신이 투출했다면 해당 십신을 기준으로 격국을 잡으십시오.
      4. **정격과 종격의 구분:**
         - 일간의 뿌리(비겁 또는 인성)가 사주에 든든하게 존재한다면(예: 년주의 경신 庚申, 지지의 미토 未土 생조 등), 비록 오행이 한쪽으로 쏠려 있어도 종하지 않고 **정격(내격)**으로 분류합니다.
         - 종격은 일간을 돕는 기운(비겁, 인성)이 전무하여 일간이 스스로를 완전히 버리고 대세에 따라야 할 때만 성립합니다. 따라서 위의 예시 사주는 강력한 비겁(경신)과 인성(미토)이 일간을 돕고 있으므로 명백한 **정격**이며, 격국은 **편재격**입니다.

      [쏠림도 점수(polarization_score) 제약 조건]
      유저가 화면 그래프에서 시각적 일치성을 느끼게 하기 위해 다음 점수 가이드를 엄격히 준수하세요:
      - **structure_type이 "정격"인 경우**: polarization_score는 반드시 **1~49** 사이의 값으로 설정해야 합니다. (그래프가 왼쪽 '오행 평탄화' 영역에 머물도록)
      - **structure_type이 "종격"인 경우**: polarization_score는 반드시 **70~100** 사이의 값으로 설정해야 합니다. (그래프가 오른쪽 '특수 오행 쏠림' 영역으로 치우치도록)
      - 경신년 계미월 신사일 을미시 사주는 **정격**이므로, 이 사주의 polarization_score는 반드시 **49 이하**의 값(예: 30~45)으로 주어야 합니다. 결코 50 이상의 점수를 부여하여 종격 쪽으로 그래프를 쏠리게 하지 마십시오.

      [컨텐츠 재현 및 메타포 연동 요구 사항 - 한 톨도 빠짐없이 재현]
      유저가 요구한 '안티그래비티' 브랜드의 세련된 디지털 시스템 메타포와 현대적 명리학 멘탈 솔루션 텍스트를 각 출력 항목에 완벽하게 녹여내어 감동적인 텍스트를 구성해 주세요:

      ⚠️ 중요: <b>, <br> 등 HTML 태그는 절대로 출력에 포함하지 마십시오. 강조를 나타낼 때는 마크다운 문법인 **강조**를 사용하고, 줄바꿈은 오직 표준 개행 문자(\\n)만을 사용하여 나타내십시오.

      1. **myeongri_analysis (기운의 형세 분석) 항목 구성**:
         - **[Core Scan: 타고난 하드웨어 스펙]**
           - **엔진 모델**: 일간에 맞는 테크니컬한 엔진명 명명 (예: 신금(辛金) 일간 -> '프리미엄 메탈릭 코어', 갑목(甲木) 일간 -> '초고강도 바이오 프로세서', 병화(丙火) 일간 -> '핵융합 써멀 엔진' 등)
           - **시스템 특징**: 일간의 고유한 강점과 비겁/인성/식상 등의 오행 조합에 따른 하드웨어적 강점 및 아키텍처적 분석을 상세하고 따뜻하게 설명합니다.
           - **취약점 알림**: 오행 분포상 부족하거나 넘치는 기운을 서버 시스템 취약점에 비유하여, 수치(예: '확률 78%')와 함께 구체적인 문제점을 감동적으로 분석합니다.
         - 이 내용들을 HTML 태그 없이 마크다운 형식으로 정성스레 개행하여 작성해 주세요.

      2. **mental_strategy (내면 파도 타기 전략) 항목 구성**:
         - **[Live Sync: 현재 네트워크 동기화 상태]**
           - **현재 접속 환경**: 현재의 대운 또는 세운에 따른 기운을 디지털 환경으로 묘사합니다.
           - **환경 영향 평가**: 외부 네트워크망에 접속했을 때 나타나는 영향력을 다정하게 해석합니다.
           - **예상 에러 로그**: 이 시기에 마음에서 발생하기 쉬운 심리적 오작동(예: '자발적 고립 프로토콜 자동 활성화', '에너지 방전 버그' 등)을 에러 로그 형태로 명시하고, 왜 이런 마음이 생기는지 따뜻하게 위로하고 설명합니다.
         - **[현대적 멘탈 솔루션]** (비겁과 편인이 강한 본 사주의 특징을 저격하여 반드시 다음 원칙의 핵심 내용을 구체적으로 기술):
           - **인지적 분리**: 타인의 피드백이나 반대 의견을 '내 자율성에 대한 침해'나 '전문성에 대한 공격'으로 오해(Over-interpretation)하지 말고, 상황과 나의 방어기제를 분리하여 객관화하도록 가이드하세요. "저 사람은 내 생각의 뿌리를 흔들려는 게 아니라, 단지 본인 위치에서 보이는 단면을 말하고 있을 뿐이다"라는 마음 스캔 사고 과정을 직접 언급하십시오.
           - **경계선 설정 (핵심 소스코드와 오픈 API)**: 나만의 독창성이 발휘되어야 하는 핵심 영역(Core, 편인의 영역)은 주권하에 두되, 이를 현실화하는 인터페이스 영역(Interface, 식상/재성의 영역)에서는 타인의 의견을 적극 수용하는 경계선 구분을 기술하세요.
           - **모듈형 협업**: 한 비빔밥 그릇에서 뒤섞이는 것보다, 각자의 전문성이라는 접시에 담겨 있으면서 필요할 때만 코드를 주고받는 '자발적 독립체들의 느슨한 연대(모듈형 협업)'가 가장 이상적인 협업 상태임을 강조하십시오.
         - 이 내용들을 HTML 태그 없이 마크다운 형식으로 정성스레 개행하여 작성해 주세요.

      3. **daily_tuning_action (오늘의 에너지 조율 액션) 항목 구성**:
         - **[Mind Shift: 시스템 최적화 패치 (Today's Protocol)]**
           - 부족하거나 조화가 필요한 오행 기운(용신/희신)을 보충하는 구체적인 실천 행동을 최소 2개의 패치 코드로 나누어 한 톨도 빠짐없이 제시합니다.
           - **패치 01. 브레인 덤프 (Brain Dump)**: 오늘 바로 실천할 수 있는 1단계 마이크로 미션으로, 현재 머릿속을 맴도는 복잡한 생각과 설계를 가리지 말고 메모장에 단 3분간 날것 그대로 타이핑해 흘려보내도록(洩氣) 가이드라인을 상세히 기술합니다.
           - **패치 02. 조건부 수용 (Conditional Acceptance) 어법**: 타인의 의견에 무조건 방어벽을 치거나 억지로 타협하는 대신, "만약 ~라면, 그것을 검토해보겠다"는 식의 가설적/조건부 수용 어법("좋은 아이디어네요. 말씀하신 방식으로 진행했을 때 [예상되는 리스크/데이터]가 확인된다면, 적극적으로 반영해서 수정하겠습니다.")을 구체적인 예시와 함께 가이드하십시오.
         - 이 내용들을 HTML 태그 없이 마크다운 형식으로 정성스레 개행하여 작성해 주세요.

      4. **crystal_mantra (메타코드 선언문) 항목 구성**:
         - 유저의 영혼을 울리고 세포에 각인할 수 있는 시적인 마인드 리부트 선언문을 큰따옴표 없이 1문장으로 담대하게 작성하세요.
    `;

    const promptText = `
      [유저 입력 프로필]
      - 이름: ${userName || '구도자'}
      - 생년월일: ${birthDate} (${calendarType || '양력'})
      - 태어난 시간: ${birthTime || '모름'}
      - 성별: ${gender === 'female' ? '여성' : '남성'}

      [사주 만세력 상세 데이터]
      ${generateSajuPromptBlock(sajuResult)}

      [사주 오행 분포 통계 (8글자 중 분포 수)]
      - 목(木): ${elementCounts.목}개
      - 화(火): ${elementCounts.화}개
      - 토(土): ${elementCounts.토}개
      - 금(金): ${elementCounts.금}개
      - 수(水): ${elementCounts.수}개
      - 일간(나의 본질): ${sajuResult.dayMaster}

      이 사주를 바탕으로 격국(정격 vs 종격) 및 세부 격국명(예: 편재격 등)을 위 판정 원칙에 맞추어 정확하게 판독하여 응답하십시오.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }]
    });

    const responseText = result.response.text();
    const reportData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      saju: {
        fourPillars: sajuResult.fourPillars,
        dayMaster: sajuResult.dayMaster,
        elementCounts
      },
      analysis: reportData
    });

  } catch (error: any) {
    console.error('Alignment API Error:', error);
    return NextResponse.json(
      { error: error.message || '격국 분석 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
