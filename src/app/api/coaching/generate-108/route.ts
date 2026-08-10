/**
 * ===============================================================
 * 🌸 108 자각 백서 실시간 AI 초개인화 생성 API (v12 - 완전 강화)
 * API Route: /api/coaching/generate-108/route.ts
 * 
 * [v12 핵심 변화]
 * - Gemini API의 responseSchema & responseMimeType 강제 적용
 * - 마크다운 코드블록 제거 오류 원천 봉쇄
 * - 100% 신뢰성 높은 JSON 데이터 제공 보장
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  let latestRawText = '';

  try {
    const body = await req.json();
    const { pageKey, sajuData, sajuProfile, originalPage, userName, birthDate, gender } = body;

    // [분석 로그] 서버에 도달한 데이터 완전 투명 공개
    console.log(`\n🔍 [generate-108] ===== ${pageKey} 생성 요청 =====`);
    console.log(`📋 sajuProfile 키 수: ${sajuProfile ? Object.keys(sajuProfile).length : 'NULL/UNDEFINED'}`);
    console.log(`📋 sajuProfile.dayMasterChar: "${sajuProfile?.dayMasterChar || 'MISSING'}"`);
    console.log(`📋 sajuProfile.killerAnalogy: "${sajuProfile?.killerAnalogy || 'MISSING'}"`);
    console.log(`📋 sajuProfile.primaryClash: "${sajuProfile?.primaryClash || 'MISSING'}"`);
    console.log(`📋 sajuData.dayMaster: "${sajuData?.dayMaster || 'MISSING'}"`);
    console.log(`📋 sajuData.fourPillars.day: ${JSON.stringify(sajuData?.fourPillars?.day || 'MISSING')}`);
    console.log(`📋 originalPage.title: "${(originalPage?.title || '').substring(0, 50)}..."`);

    if (!pageKey || !sajuData || !originalPage) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    // 11개 모듈 초고도화 JSON 스키마 (융합 에세이 포함)
    const jsonSchema: any = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "시적이고 감동적인 맞춤 제목 (페이지 주제 밀착)" },
        healingEssay: { type: SchemaType.STRING, description: "사주 4주팔자(년·월·일·시주)와 공망, 6대 심리코칭(CBT·ACT·DBT·MBSR·MSC)가 하나로 융합된 350~500자의 100% 독창적이고 감동적인 1:1 영혼 치유 에세이" },
        sajuAnalysis: { type: SchemaType.STRING, description: "이 주제와 사주 8자/공망의 연결 요약 (50~80자)" },
        darkCodeCbt: { type: SchemaType.STRING, description: "CBT 인지성찰 - 생각의 함정 탈출 요약 (50~80자)" },
        metaCodeAct: { type: SchemaType.STRING, description: "ACT 수용전념 - 강점 전환 요약 (50~80자)" },
        neuralCodeDbt: { type: SchemaType.STRING, description: "DBT 행동조율 - 이완 가이드 요약 (50~80자)" },
        socraticMbct: { type: SchemaType.STRING, description: "MBCT 마음챙김 자각 질문 (50~80자)" },
        relaxMbsr: { type: SchemaType.STRING, description: "MBSR 스트레스 이완 안내 (50~80자)" },
        selfCompassionMsc: { type: SchemaType.STRING, description: "MSC 자기연민 실천법 (50~80자)" },
        coachingSolution: { type: SchemaType.STRING, description: "오늘부터 실천할 코칭 솔루션 (50~80자)" },
        mantra: { type: SchemaType.STRING, description: "평생 꺼내 읽는 확언문 (50~80자)" }
      },
      required: ["title", "healingEssay", "sajuAnalysis", "darkCodeCbt", "metaCodeAct", "neuralCodeDbt", "socraticMbct", "relaxMbsr", "selfCompassionMsc", "coachingSolution", "mantra"]
    };

    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { 
        temperature: 0.8, 
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
        // @ts-ignore - thinking budget 제한으로 504 타임아웃 방지
        thinkingConfig: { thinkingBudget: 1024 }
      },
    });

    // ========== 사주 프로파일 기반 초개인화 컨텍스트 구성 ==========
    const sp = sajuProfile || {};
    const fp = sajuData.fourPillars || {};
    const tg = sajuData.tenGods || {};
    const el = sajuData.elements || {};

    // 사기둥 간지 추출
    const getGanJi = (pillar: any) => {
      if (!pillar) return '?/?';
      const gan = pillar.gan || pillar.ganKor || '?';
      const ji = pillar.ji || pillar.jiKor || '?';
      return `${gan}${ji}`;
    };

    // 십신 심리 해석 문장 생성
    const tenGodNarrative: string[] = [];
    const selfCount = tg.self || 0;
    const outputCount = tg.output || 0;
    const wealthCount = tg.wealth || 0;
    const powerCount = tg.power || 0;
    const resourceCount = tg.resource || 0;

    if (selfCount >= 2) tenGodNarrative.push('비겁이 과다하여 자기주장이 강하고 혼자서도 밀어붙이는 에너지가 넘치지만, 타인과의 공존에 갈등을 겪을 수 있습니다.');
    else if (selfCount === 0) tenGodNarrative.push('비겁이 부재하여 홀로 모든 풍파를 감당해야 하는 고독한 전사의 기질입니다. 자기 지지 기반이 약하여 깊은 외로움을 느끼기 쉽습니다.');
    else tenGodNarrative.push(`비겁이 ${selfCount}개로 적절히 있어, 자기 주관은 있으나 과하지 않은 균형 상태입니다.`);

    if (outputCount >= 2) tenGodNarrative.push('식상이 과다하여 표현력과 감성이 풍부하지만, 에너지 방출이 과해 쉽게 지칠 수 있습니다.');
    else if (outputCount === 0) tenGodNarrative.push('식상이 부재하여 감정 표현과 창의적 배출이 억제되어 있습니다. 마음속 말을 꺼내기 어려워하는 경향이 있습니다.');
    else tenGodNarrative.push(`식상이 ${outputCount}개로 균형 잡힌 표현력을 갖추고 있습니다.`);

    if (wealthCount >= 2) tenGodNarrative.push('재성이 과다하여 현실 감각이 뛰어나지만, 물질적 집착이나 과도한 걱정의 함정에 빠질 수 있습니다.');
    else if (wealthCount === 0) tenGodNarrative.push('재성이 부재하여 현실적 목표 설정이 약하고, 물질적 안정감보다 정신적 가치를 추구하는 기질입니다.');
    else tenGodNarrative.push(`재성이 ${wealthCount}개로 현실 감각과 꿈 사이의 균형을 이룹니다.`);

    if (powerCount >= 2) tenGodNarrative.push('관성이 과다하여 스스로에게 과도한 규율과 의무감을 부과하며, 타인의 시선과 기대에 짓눌려 숨이 막히는 경험을 자주 합니다.');
    else if (powerCount === 0) tenGodNarrative.push('관성이 부재하여 외부의 통제를 싫어하고 자유분방한 영혼입니다. 규칙에 얽매이기보다 자기만의 길을 걷고 싶어합니다.');
    else tenGodNarrative.push(`관성이 ${powerCount}개로 적절한 책임감과 사회성을 갖추고 있습니다.`);

    if (resourceCount >= 2) tenGodNarrative.push('인성이 과다하여 깊은 사색과 학습에 몰두하지만, 생각이 너무 많아 행동으로 옮기기 어려울 수 있습니다.');
    else if (resourceCount === 0) tenGodNarrative.push('인성이 부재하여 지적 탐구보다 실천과 행동을 중시하는 기질입니다. 돌봐주고 보호해줄 심리적 지원군이 부족할 수 있습니다.');
    else tenGodNarrative.push(`인성이 ${resourceCount}개로 학습과 실천 사이의 균형을 유지합니다.`);

    // 공망(空亡) 정밀 연산 헬퍼
    const GAN_LIST = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const JI_LIST  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const GONGMANG_MAP: Record<number, string> = {
      0: '술해(戌亥 / 영성과 비움의 공간)',
      10: '신유(申酉 / 결실과 신념의 공간)',
      8: '오미(午未 / 열정과 비전의 공간)',
      6: '진사(辰巳 / 변혁과 인연의 공간)',
      4: '인묘(寅卯 / 시작과 도약의 공간)',
      2: '자축(子丑 / 지혜와 뿌리의 공간)'
    };

    const getGongmang = (ganStr?: string, jiStr?: string) => {
      if (!ganStr || !jiStr) return '신유(申酉 / 결실의 공간)';
      const gChar = ganStr.charAt(0);
      const jChar = jiStr.charAt(0);
      const gIdx = GAN_LIST.indexOf(gChar);
      const jIdx = JI_LIST.indexOf(jChar);
      if (gIdx === -1 || jIdx === -1) return '신유(申酉 / 결실의 공간)';
      const diff = (jIdx - gIdx + 12) % 12;
      return GONGMANG_MAP[diff] || '신유(申酉 / 결실의 공간)';
    };

    const dayGan = fp?.day?.gan || fp?.day?.ganKor || sp.dayMasterChar || '辛';
    const dayJi = fp?.day?.ji || fp?.day?.jiKor || '巳';
    const gongmangInfo = getGongmang(dayGan, dayJi);

    // 오행 불균형 분석
    const ohaengLabels = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
    const ohaengScores: Record<string, number> = { wood: el.wood||0, fire: el.fire||0, earth: el.earth||0, metal: el.metal||0, water: el.water||0 };
    const maxElem = Object.entries(ohaengScores).reduce((a, b) => a[1] >= b[1] ? a : b);
    const minElem = Object.entries(ohaengScores).reduce((a, b) => a[1] <= b[1] ? a : b);

    const prompt = `
당신은 명심코칭의 수석 AI 무의식 디버깅 및 명리 치유 전문가입니다.
아래 내담자의 완전한 사주 기질 프로파일을 깊이 읽고, 108 자각 백서의 해당 페이지를 이 내담자만의 1:1 초개인화 감동 치유 스토리로 완전히 새롭게 집필하세요.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🧬 내담자 사주 기질 프로파일 - 절대 무시 금지]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ 내담자 이름: ${userName || '소중한 내담자'}님
◆ 생년월일: ${birthDate || '정보 없음'}
◆ 성별: ${gender === 'male' ? '남성' : gender === 'female' ? '여성' : '정보 없음'}

◆ 사기둥(四柱 八字):
  년주(年柱 - 사회/조상궁): ${getGanJi(fp.year)}
  월주(月柱 - 무의식/부모궁): ${getGanJi(fp.month)}
  일주(日柱 - 본질/자기): ${getGanJi(fp.day)} 🌟 (핵심)
  시주(時柱 - 잠재력/미래): ${getGanJi(fp.time)}
◆ 나의 공망(空亡): ${gongmangInfo} — 내 삶에서 채워야 할 수호적 공간

◆ 십신(十神) 수치: 비겁 ${selfCount} | 식상 ${outputCount} | 재성 ${wealthCount} | 관성 ${powerCount} | 인성 ${resourceCount}
◆ 오행(五行) 강약: 가장 강함=${(ohaengLabels as any)[maxElem[0]]}(${maxElem[1]}점) | 가장 약함=${(ohaengLabels as any)[minElem[0]]}(${minElem[1]}점)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📖 이 페이지의 독창적 자각 테마]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 페이지 코드: ${pageKey}
- 이번 페이지의 원래 주제: "${originalPage.title}"
- 원래 설명 내용: "${(originalPage.desc || '').substring(0, 300)}"
- 원래 질문: "${originalPage.socratic}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✍️ 100% 독창적 1:1 심층 융합 에세이 집필 지침 🌸]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

★ [핵심 지침: 페이지 간 중복 100% 차단]
1. 모든 페이지에 "은빛 다이아몬드", "가혹한 감시 카메라", "오아시스" 같은 똑같은 비유 단어를 반복하지 마세요!
2. 이번 페이지의 주제("${originalPage.title}")에 완전히 집중하여, 이 내담자의 사주 4주팔자(년/월/일/시주)와 공망(${gongmangInfo}) 및 십신 성향(비겁/식상/재성/관성/인성)을 결합해 "아, 정말 이건 내 이야기구나!" 하고 깊은 소름과 감동을 느끼도록 상세히 분석하세요.
3. 사람들이 사주에서 가장 궁금해하는 인기 핵심 키워드 [💰 재물과 부의 그릇, 👑 직업과 출세길, 💕 인연과 배우자운, 🧠 내면의 불안과 번아웃 극복]를 이번 페이지 주제에 자연스럽게 엮어 분석해 주세요.
4. 3세대 과학적 인지재구성 (CBT 생각의 함정 탈출 + ACT 기질 강점 전환 + DBT 행동 이완)을 융합하여 따뜻하고 친절하며 깊이 있는 1:1 이야기체로 써주세요.
5. ★ 의료법 준수 금지 단어: "가이드전", "가이드", "분석", "코칭", "환자" 사용 절대 금지! ("행동 가이드", "솔루션", "디코딩", "성찰", "내담자" 사용)
6. ★ 호칭 지침: 일간 이름("신금님" 등) 대신 반드시 "${userName || '소중한 내담자'}님"으로 호칭하세요.

1. **title**: 이 페이지 주제를 담은 독창적인 맞춤 제목 (15자 이내)
2. **healingEssay**: ★ [핵심] 사주 4주팔자 + 공망 + 십신 + 3세대 인지재구성이 하나로 융합된 350~500자의 감동적인 1:1 초개인화 에세이! (중복 비유 금지, 깊은 분석과 따뜻한 위로)
3. **sajuAnalysis**: 이 주제와 내 사주 8자/공망의 구체적 연결 요약 (50~80자)
4. **darkCodeCbt**: 이 주제 관련 생각의 함정 탈출법 요약 (50~80자)
5. **metaCodeAct**: 이 주제 관련 기질의 강점 전환법 요약 (50~80자)
6. **neuralCodeDbt**: 이 주제 관련 행동 가이드 요약 (50~80자)
7. **socraticMbct**: 내면 자각 질문 (50~80자)
8. **relaxMbsr**: 구체적 이완 안내 (50~80자)
9. **selfCompassionMsc**: 자기연민 실천법 (50~80자)
10. **coachingSolution**: 오늘 실천 과제 (50~80자)
11. **mantra**: 확언문 한 줄 (50~80자)

11개 필드 포함! healingEssay는 풍부하고 100% 독창적이며 감동적으로!
`.trim();

    const result = await model.generateContent(prompt);
    const response = result.response;
    latestRawText = response.text();

    if (!latestRawText || latestRawText.trim().length === 0) {
      throw new Error('AI 응답 없음');
    }

    const start = latestRawText.indexOf('{');
    const end = latestRawText.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('JSON 파싱 실패');

    const pageData = JSON.parse(latestRawText.substring(start, end + 1));

    return NextResponse.json({
      success: true,
      pageData
    });

  } catch (error: any) {
    console.error('generate-108 API Error:', error);
    return NextResponse.json({
      error: error?.message || '실시간 AI 생성 중 오류 발생',
      details: latestRawText || 'No Output'
    }, { status: 500 });
  }
}
