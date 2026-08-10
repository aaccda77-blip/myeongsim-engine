import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  let stageId = 1;
  try {
    const body = await req.json();
    stageId = body.stageId || 1;
    const { 
      userName, 
      stageTitle, 
      sajuPillars, 
      birthOhaeng, 
      gongmangName, 
      activeGongmangs,
      dayMaster,
      dayMasterTrait,
      gyeokguk
    } = body;


    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `당신은 동양의 사주명리학과 현대의 인지심리학(CBT/ACT/DBT)을 통합한 최고 권위의 '명심(明心) 라이프 아키텍트'입니다.
사용자 이름: ${userName || '익명'}
선택한 성장 단계: STEP ${stageId} - ${stageTitle}

[사용자 선천 사주 원국 정보]
- 4주(년주/월주/일주/시주): ${JSON.stringify(sajuPillars || {})}
- 선천 오행 분포: ${JSON.stringify(birthOhaeng || {})}
- 일간(나를 상징하는 오행 본질): ${dayMaster || '알 수 없음'} (${dayMasterTrait || ''})
- 격국(나의 주된 사회적 도구/행동 패턴): ${gyeokguk || '알 수 없음'}
- 공망(비어있음/마음의 틈새): ${gongmangName || '없음'} (활성 영역: ${JSON.stringify(activeGongmangs || [])})

[성장 단계 테마]
- 1단계 발견: 선천 오행 분포로 본 본연의 기질과 잠재력 탐색
- 2단계 융합: 선천 기질(일주, 공망)과 후천 성격(MBTI/DISC 등)의 정렬
- 3단계 치유: 공망이나 취약 오행(결핍)으로 인한 감정적 불안/집착의 내려놓음과 마음 치유
- 4단계 행동: 십신(재성/관성 등) 및 용신 오행을 활용한 실천적 행동 지침
- 5단계 유지: 일상에서 무너진 오행을 조율하고 평화를 유지하는 방법
- 6단계 확장: 지장간에 숨겨진 천재성과 내면의 재능을 사회적으로 꽃피우는 법
- 7단계 초월: 사주 팔자라는 기질적 한계를 뛰어넘어 관찰자로서 온전한 자아를 완성하는 법

위의 사주 정보와 선택한 성장 단계(STEP ${stageId} - ${stageTitle})를 융합하여, 사용자가 지금 이 단계에서 마주해야 할 내면의 이야기와 성장 가이드를 작성해주세요. 

[작성 규칙]
1. 난해한 한자어나 명리학 전문 용어는 초보자도 바로 이해할 수 있도록 일상어로 부드럽고 다정하게 풀어 설명하세요.
2. 에고의 불안이나 방어기제를 어루만지고 위로를 건네는 따뜻하고 감동적인 '명심코칭' 특유의 지혜로운 문체로 적어주세요.
3. 모든 분석 내용은 마크다운 개행 문자를 적절히 포함하여 가독성 있게 구조화해 주세요.
4. 반드시 아래 JSON 형식 스펙을 완벽하게 지켜서 마크다운 백틱 없이 순수한 JSON으로만 응답하세요.

{
  "stageName": "치유 (Healing) 등 단계명",
  "sajuCore": "사주에서 이번 단계에 가장 핵심적으로 연결되는 특징 1줄 요약",
  "mainAnalysis": "사용자의 사주 기질과 성장 단계가 융합된 상세하고 깊이 있는 정밀 가이드 분석 문장 (200~400자 사이, 따뜻하고 감동적이며 가독성 있는 개행 포함)",
  "dailyPractice": "오늘 바로 실천할 수 있는 아주 구체적이고 사소한 마음 또는 행동 습관 1가지 가이드"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Stage Analysis API generation error:', error);
    
    // 에러 발생 시 부드러운 Fallback 데이터 제공
    const fallbackData: Record<number, any> = {
      1: {
        stageName: '발견 (Discovery)',
        sajuCore: '선천 오행의 흐름을 통한 기질 발견',
        mainAnalysis: '당신의 선천적인 오행 분포는 당신이 세상에 첫 발을 내디딜 때 쥐고 태어난 아름다운 무기입니다. 어떤 기운은 넉넉하게 채워져 있고, 어떤 기운은 조금은 비어있을 수 있습니다. 중요한 것은 이 불균형조차도 당신이라는 고유한 우주를 빛나게 하는 소중한 결이라는 점입니다. 나를 가만히 바라보며 인정하는 것부터 시작해 보세요.',
        dailyPractice: '거울을 보고 "이 모습 그대로가 나다"라고 다정하게 미소 지으며 속삭여 주기.'
      },
      2: {
        stageName: '융합 (Fusion)',
        sajuCore: '선천적 사주 기질과 후천적 성격의 상생',
        mainAnalysis: '타고난 사주라는 씨앗과 그동안 살아오며 형성된 성격이라는 꽃이 조화롭게 어우러지는 순간입니다. 선천 기질이 당신의 깊은 무의식의 닻이라면, 후천 성격은 거센 바람에 맞서는 돛입니다. 닻과 돛이 서로 충돌하지 않고 같은 방향을 바라볼 때, 당신은 가장 편안하고 안전하게 나아갈 수 있습니다.',
        dailyPractice: '나의 행동 패턴 중 "이것만큼은 정말 나답다"고 느끼는 특징 3가지 적어보기.'
      },
      3: {
        stageName: '치유 (Healing)',
        sajuCore: '사주 공망과 취약 오행이 주는 마음의 틈새 치유',
        mainAnalysis: '누구나 사주 원국에서 비어있거나 취약한 기운이 존재합니다. 그것은 결함이 아니라, 더 거대한 우주의 지혜를 담기 위한 고요한 빈 그릇과 같습니다. 억지로 무언가를 쟁취하여 채우려 버둥거리지 않고, 비어있는 그 상태 그대로를 따스한 호흡으로 수용할 때 비로소 진정한 마음의 치유가 시작됩니다.',
        dailyPractice: '불안이 밀려올 때 3초간 숨을 들이마시고 3초간 멈췄다가 천천히 내쉬기.'
      },
      4: {
        stageName: '행동 (Action)',
        sajuCore: '나를 돕는 용신 오행과 십신의 에너지를 깨우는 행동',
        mainAnalysis: '마음의 평화를 지키는 것뿐만 아니라, 현실로 한 발짝 나아가기 위한 강력한 실천 에너지가 필요합니다. 사주에서 당신의 삶에 동력을 불어넣는 십신(재성이나 식상 등)의 기운을 활용하세요. 생각 속에 갇혀 머뭇거리지 않고 단 5초 안에 가벼운 발걸음을 떼어놓을 때, 당신의 우주는 살아 움직이기 시작합니다.',
        dailyPractice: '지금 하고 싶지만 미루고 있던 일 중 가장 작은 단위를 5분 안에 바로 실행하기.'
      },
      5: {
        stageName: '유지 (Maintenance)',
        sajuCore: '오행 에너지를 조율하고 삶의 규칙을 유지하는 힘',
        mainAnalysis: '빛나는 순간보다 중요한 것은 매일의 평안함을 가꾸는 정돈된 일상입니다. 사주의 극단적인 충돌이나 불균형 기운이 나를 덮치지 않도록, 나만의 고요한 쉼표와 일상 루틴을 견고히 해야 합니다. 매일 일정한 시간에 호흡을 가다듬고 내면을 점검하는 시스템은 당신을 지키는 든든한 방화벽이 됩니다.',
        dailyPractice: '매일 아침 눈을 뜨자마자 따뜻한 물 한 잔을 마시며 몸의 온기를 느껴보기.'
      },
      6: {
        stageName: '확장 (Expansion)',
        sajuCore: '지장간 속에 내재된 무한한 천재성과 사회적 확장',
        mainAnalysis: '땅의 기운(지지) 밑에 은밀하게 숨겨진 지장간(地藏干)은 당신이 아직 채 꺼내지 못한 보물상자입니다. 이것은 척박한 환경 속에서도 싹을 틔울 준비를 마친 위대한 재능의 씨앗입니다. 세상이 원하는 기준이 아닌, 내 마음에 숨겨진 이 보석을 기꺼이 세상으로 꺼내어 나누고 공헌해 보세요.',
        dailyPractice: '주변의 고마운 사람에게 마음이 담긴 칭찬이나 감사의 메시지 1통 보내기.'
      },
      7: {
        stageName: '초월 (Transcendence)',
        sajuCore: '우주적 설계도를 뛰어넘는 온전한 관찰자적 자아',
        mainAnalysis: '사주는 우리가 타고난 기질의 지도일 뿐, 우리의 절대적인 한계가 아닙니다. 사주의 얽매인 관계와 운명의 흐름을 객관적으로 관찰하는 순간, 당신은 사주에 갇힌 에고를 뛰어넘어 모든 것을 수용하는 거대하고 고요한 우주 자체가 됩니다. 모든 좋고 나쁨을 초월한 참나를 마주해 보세요.',
        dailyPractice: '눈을 감고 "나는 내 생각과 기질을 가만히 바라보는 투명한 하늘이다"라고 명상하기.'
      }
    };

    const targetStageId = stageId || 1;
    const stageFallback = fallbackData[targetStageId] || fallbackData[1];
    
    return NextResponse.json({ success: true, data: stageFallback });
  }
}
