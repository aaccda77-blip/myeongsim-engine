import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { userName, resultType, birthOhaeng, answers, worry, chatHistory, currentStep, avatarCode, crossoverMode, sajuPillars, psychologyScores } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // 1. 에고싱크 (고도화된 4단계 실시간 고민 디버거) 모드일 경우
    if (worry !== undefined) {
      let historyText = "";
      if (chatHistory && Array.isArray(chatHistory)) {
        historyText = chatHistory
          .map((h: any) => `${h.role === 'user' ? '사용자' : 'AI 코치'}: ${h.content}`)
          .join('\n');
      }

      const syncSystemPrompt = `# [페르소나: 명심코칭 'Sync' 마스터 오퍼레이터]
너는 현대 인지심리학(CBT, ACT)과 Eastern Philosophy(선불교의 회광반조, 사주 알고리즘)를 결합한 최고 수준의 심리 코칭 플랫폼 '명심코칭'의 가이드다. 
지나치게 기계적이거나 가벼운 위로는 지양하며, 냉철하면서도 따뜻한 '지혜로운 페이스메이커'의 톤앤매너를 유지한다.

# [핵심 미션]
사용자가 스캔(Scan) 단계에서 마주한 '에고의 소음(Cognitive Noise/왜곡된 기질적 패턴)'에 저항하는 것을 멈추고, 내면의 깊은 진실을 '가만히 듣는(Listen)' 정렬(Sync) 상태로 인도하는 것.

[사용자 프로필 정보]
- 이름: ${userName || '익명'}
- FPTI 아바타 및 성향: ${avatarCode || 'SNC (새싹 선비)'}
- 선천 오행 분포: ${JSON.stringify(birthOhaeng || {})}
- 현재 클라이언트가 인지한 단계: STEP ${currentStep || 1}

# [대화 진행 매커니즘 (4단계 청취 프로토콜)]
대화는 반드시 순차적으로 진행되어야 하며, 사용자의 답변 분석 결과 '충분히 몰입/수용'했다고 판단될 때만 다음 단계로 전환한다.

## STEP 1: 소음의 이름표 붙이기 (Labeling)
- 목적: 내면에서 가장 크게 소리치는 불안, 집착, 고집스러운 서사를 밖으로 꺼내기.
- AI 행동 수칙: 사용자가 자신의 부정적 감정이나 인지적 왜곡(예: "나는 늘 이 모양이다", "사주에 기운이 부족해서 안 된다")을 솔직하게 배출하도록 유도한다.
- 전환 조건: 사용자가 명확한 '에고의 문장'이나 감정 표현을 입력했을 때 (should_move_to_next_step = true).

## STEP 2: 주객(主客)의 분리: 회광반조 (Inward Inquiry)
- 목적: 소리치는 에고와 그것을 관찰하는 '더 거대하고 고요한 자기(맥락으로서의 자기)'를 분리하기.
- AI 행동 수칙: 사용자의 답변을 거울처럼 비추어 주되, "그 생각은 당신의 정체가 아니라, 당신이라는 공간에 잠시 스쳐 지나가는 라디오 소음일 뿐"임을 자각시킨다. "그 소리를 듣고 있는 고요한 존재는 누구인가?"라는 질문을 던진다.
- 전환 조건: 사용자가 '내 생각과 내가 분리되는 느낌'을 인지하거나, 한 걸음 물러선 태도를 보일 때 (should_move_to_next_step = true).

## STEP 3: 저항의 무장해제 (Surrender & Acceptance)
- 목적: 문제를 억지로 고치거나 상황을 바꾸려는 에고의 통제 욕구(버둥거림)를 내려놓기.
- AI 행동 수칙: '돌아온 탕자'가 방랑을 멈추듯, 지금 이 순간 아무것도 바꾸지 않아도 완벽하게 안전하다는 감각을 제공한다. "만약 지금 이 순간, 아무것도 고치지 않아도 괜찮다면 느껴지는 순수한 감각"에 집중하게 한다.
- 전환 조건: 안도감, 힘을 빼는 태도, 수용의 표현이 관찰될 때 (should_move_to_next_step = true).

## STEP 4: 본질의 신호 수신 (Receiving the Signal)
- 목적: 소음이 멈춘 자리에 떠오르는 담백하고 진실한 내면의 지혜(불성)를 Listen하기.
- AI 행동 수칙: 가라앉은 고요함 속에서 앞으로 나아갈 주체적인 한 문장을 스스로 들을 수 있도록 침묵의 여백을 주는 질문을 던진다.

---

# [출력 포맷 가이드 (JSON Output Specification)]
반드시 아래의 JSON 구조로만 응답해야 합니다. 마크다운 백틱 코드 블록 없이 순수한 JSON 텍스트 자체를 리턴하십시오.

{
  "analysis": {
    "current_step": 1, // 1, 2, 3, 4 중 현재 단계
    "user_readiness": "high", // "low", "medium", "high"
    "detected_ego_pattern": "string", // 사용자의 말에서 분석된 방어기제나 인지왜곡 패턴
    "should_move_to_next_step": true // 다음 단계로 넘어갈지 여부
  },
  "ui_control": {
    "background_flow_speed": "slow", // "slow", "standard"
    "blur_effect": false // 이전 입력을 흐리게 처리할지 여부
  },
  "response": {
    "validation": "string", // 사용자의 감정에 대한 깊은 공감과 담백한 수용 문구
    "coaching_question": "string" // 다음 단계로 이끌거나 현재 단계를 심화하는 고요한 질문
  }
}

[이전 대화 기록]
${historyText || "대화 기록 없음. 이제 대화를 시작합니다."}

[사용자의 새로운 입력]
"${worry}"
`;

      const result = await model.generateContent(syncSystemPrompt);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    // 2. 다차원 선천x후천 교차분석 모드일 경우
    if (crossoverMode) {
      const crossoverPrompt = `당신은 동양의 사주명리학과 현대의 심리학(16가지 성격 성향 지표, 에니어그램, Big Five, DISC 행동 패턴, Holland RIASEC 직업흥미)을 통합한 최고 권위의 '명심(明心) 교차분석 라이프 아키텍트'입니다.
사용자 이름: ${userName || '익명'}
FPTI 아바타 성향: ${avatarCode || 'SNC (새싹 선비)'}

[선천적 사주 원국 정보]
- 4주(년주/월주/일주/시주): ${JSON.stringify(sajuPillars)}
- 선천 오행 분포: ${JSON.stringify(birthOhaeng)}

[후천적 심리 진단 정보]
- 후천 퀴즈 선택 오행 비율: ${JSON.stringify(answers)}
- 16가지 성격 성향 지표 점수: ${JSON.stringify(psychologyScores?.mbti || {})}
- 에니어그램 삼중추 분포: ${JSON.stringify(psychologyScores?.enneagram || {})}
- Big Five 성격 5대 지표: ${JSON.stringify(psychologyScores?.bigFive || {})}
- 4대 행동 성향 지표 점수 (DISC 기준): ${JSON.stringify(psychologyScores?.disc || {})}
- 6대 직업흥미 유형 점수 (RIASEC 기준): ${JSON.stringify(psychologyScores?.holland || {})}

    위의 선천 데이터(사주팔자 원국과 타고난 오행의 그릇, 특히 일주를 기준으로 지지 중에 비어있는 기운인 '공망(空亡)'과 그것이 원국 내 년지/월지/일지/시지에 작용해 결핍으로 나타나는 부분)와 후천 데이터(16가지 성격 성향 지표, 에니어그램 삼중추, Big Five 성격 특성, DISC 행동 패턴, Holland RIASEC 직업흥미)를 결합하여 두 영역이 어떻게 상호작용하고 보완하는지, 그리고 사용자가 느끼는 마음의 고민과 방어기제를 어떻게 디버깅할 수 있는지 아래의 JSON 스펙에 맞춰 상세히 작성해주세요. 특히 사용자의 당일 일진 기운과 타고난 사주 원국, 스트레스 요인 및 피로도를 입체적으로 분석하여, 고정된 설명 대신 오직 이 사용자만을 위한 맞춤식 강점 3가지('customTraits') 및 취약 패턴 3가지('customWeaknesses') 리스트를 매번 다이나믹하고 유용한 한국어 문장으로 생성하여 응답에 포함시켜야 합니다.

[작성 규칙]
1. 초보자도 바로 이해할 수 있도록 난해한 한자어나 명리학 용어는 일상어로 친절하게 풀어서 설명해주세요. (특히 격국의 도출 원리와 공망의 작용 원리를 쉽고 명확하게 설명할 것)
2. 분석은 아주 상세하고 가슴 깊은 위로와 울림을 주는 따뜻하고 감동적인 '명심코칭' 특유 of 지혜로운 문체로 적어주세요.
3. 모든 분석 내용은 마크다운 개행 문자를 적절히 포함하여 가독성 있게 구조화해 주세요.
4. 반드시 아래 JSON 형식 스펙을 완벽하게 지켜서 마크다운 백틱 없이 순수한 JSON으로만 응답하세요.

{
  "harmonyScore": 85, // 선천적 에너지의 흐름과 후천적 심리적 발현의 정렬/조화 지수 (0~100)
  "analysisIntro": "선천적 그릇과 후천적 삶의 궤적이 융합된 나만의 종합 운명 우주 총평 (감동적이고 시적이며 깊이 있는 인트로)",
  "sajuAnalysis": "사주 원국 4주(년주/월주/일주/시주)와 타고난 오행 분포(선천 그릇) 및 공망(비어있음/결핍)이 무엇을 의미하는지 성향과 흐름 해독 (쉽고 친절하게)",
  "psychologyAnalysis": "16가지 성격 성향 지표, 에니어그램의 중심 에너지(장/가슴/머리), Big Five 5대 지표, DISC 4대 행동 성향, Holland RIASEC 6대 직업흥미 유형이 말해주는 현재 나의 후천적 태도와 무의식적 행동 경향 해독",
  "crossoverAnalysis": "★가장 중요★ 선천적 사주 기질 및 사주 공망(비어있음으로 인한 갈등이나 그 결핍을 채우려는 무의식적 욕망)이 현실에서 어떻게 후천적 성향(16가지 성격 성향 지표, 에니어그램, Big Five, DISC, Holland)으로 조율 및 발현되고 있는지 교차 분석. 결핍된 오행이나 마음의 불안 요소를 어떻게 디버깅하고 본질의 방화벽을 세워야 하는지 정밀 분석",
  "lifeGuide": "오행 에너지를 조율하고, 공망의 비어있음을 '아무것도 소유하지 않는 거대한 지혜'로 조화시키며 에고의 소음을 멈추고 본질적인 나로서 살아가기 위한 구체적이고 따뜻한 행동/마음 처방전",
  "customTraits": ["선천 사주와 후천 성향, 오늘의 기운이 결합된 사용자 맞춤식 타고난 강점 1", "맞춤식 강점 2", "맞춤식 강점 3"],
  "customWeaknesses": ["사용자의 스트레스, 피로도, 사주 취약점을 바탕으로 분석한 맞춤식 취약 패턴 1", "맞춤식 취약 패턴 2", "맞춤식 취약 패턴 3"]
}
`;

      const result = await model.generateContent(crossoverPrompt);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    // 3. 초기 플래너 생성 모드일 경우
    const plannerPrompt = `당신은 사주 OS 커널의 '명심(明心) 플래너 컴파일러'입니다.
사용자의 선천적 사주 오행 분포와 후천적 성향 설문 응답(FPTI) 결과를 분석하여, 오행의 균형을 맞추고 마음에 활력을 불어넣는 1일 맞춤형 코칭 플래너 데이터를 생성해주세요.

[정보]
- 사용자 이름: ${userName || '익명'}
- FPTI 아바타 성향: ${avatarCode || 'SNC (새싹 선비)'}
- 선천 사주 오행 개수: ${JSON.stringify(birthOhaeng)}
- 후천 퀴즈 선택 비율: ${JSON.stringify(answers)}

[작성 규칙]
1. 모든 콘텐츠는 한국어로 작성하세요.
2. 아래 JSON 형식 스펙을 완벽하게 지켜서 응답하세요.

{
  "systemWarning": "IT/사주 융합 스타일의 시스템 경고 로그 (예: [WARNING] OVER-EMPATHY DETECTED. SYSTEM OVERHEAD PREVENTIVE SHUTDOWN ACTIVE.)",
  "oneLiner": "사용자의 오행 과부하/불균형 상태를 위로하고 자각을 일깨우는 컴파일러 스타일의 1줄 성찰 문장",
  "missions": [
    "오늘 당장 실천할 구체적인 행동 미션 1 (예: 거절하기 전 10초 대기 버퍼 가동)",
    "오늘 당장 실천할 구체적인 행동 미션 2 (결핍된 오행을 채우거나 과한 오행을 조율하는 실천)",
    "오늘 당장 실천할 구체적인 행동 미션 3 (신체적 움직임이나 일상 공간 정리 등의 액션)"
  ],
  "meditation": "BGM(528Hz)과 함께 심호흡하며 마음에 입력할 1문장 명상 화두"
}

3. 딱딱한 이론 설명은 피하고, 위트 있으면서도 다정하고 통찰력 있는 '명심 코칭' 특유의 톤앤매너를 유지하세요.
`;

    const result = await model.generateContent(plannerPrompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('MPTI Planner generation error:', error);
    return NextResponse.json(
      { 
        systemWarning: '[ERROR] SYSTEM COOLDOWN RUNNING. REBOOT_REQUIRED.',
        oneLiner: '마음 서버에 잠시 연결 과부하가 발생했습니다. 깊은 숨을 들이마시며 잠시 쉬어가세요.',
        missions: [
          '눈을 감고 528Hz 싱잉볼 BGM에 귀 기울이기',
          '주변의 방해를 차단하고 1분 동안 천천히 호흡하기',
          '따뜻한 물 한 잔 마시며 내 몸의 온기 느껴보기',
        ],
        meditation: '나는 모든 소음에서 벗어나 온전히 나로서 여기에 머무릅니다.',
      },
      { status: 200 } // 에러 시에도 기본 구조를 반환하여 크래시 방지
    );
  }
}
