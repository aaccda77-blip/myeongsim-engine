/**
 * ===============================================================
 * 🌸 108 자각 백서 실시간 AI 초개인화 생성 API (v7 - 완전 리빌드)
 * API Route: /api/coaching/generate-108/route.ts
 * 
 * [v7 핵심 변화]
 * - 클라이언트에서 사전 계산된 풍부한 사주 프로파일(sajuProfile)을 수신
 * - 일간 은유, 관성/식상/재성/비겁 은유, 충 해석, 대운 등 모든 기질 데이터를 활용
 * - AI가 사용자의 구체적인 기질 특성을 깊이 이해하고 감동적인 1:1 치유 스토리를 집필
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  let latestRawText = '';

  try {
    const body = await req.json();
    const { pageKey, sajuData, sajuProfile, originalPage } = body;

    // [진단 로그] 서버에 도달한 데이터 완전 투명 공개
    console.log(`\n🔍 [generate-108] ===== ${pageKey} 생성 요청 =====`);
    console.log(`📋 sajuProfile 키 수: ${sajuProfile ? Object.keys(sajuProfile).length : 'NULL/UNDEFINED'}`);
    console.log(`📋 sajuProfile.dayMasterChar: "${sajuProfile?.dayMasterChar || 'MISSING'}"`);
    console.log(`📋 sajuProfile.killerAnalogy: "${sajuProfile?.killerAnalogy || 'MISSING'}"`);
    console.log(`📋 sajuProfile.primaryClash: "${sajuProfile?.primaryClash || 'MISSING'}"`);
    console.log(`📋 sajuData.dayMaster: "${sajuData?.dayMaster || 'MISSING'}"`);
    console.log(`📋 sajuData.fourPillars.day: ${JSON.stringify(sajuData?.fourPillars?.day || 'MISSING')}`);
    console.log(`📋 sajuData.tenGods: ${JSON.stringify(sajuData?.tenGods || 'MISSING')}`);
    console.log(`📋 sajuData.elements: ${JSON.stringify(sajuData?.elements || 'MISSING')}`);
    console.log(`📋 originalPage.title: "${(originalPage?.title || '').substring(0, 50)}..."`);

    if (!pageKey || !sajuData || !originalPage) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
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

◆ 사기둥(四柱):
  년주(年柱): ${getGanJi(fp.year)} — 조상궁, 사회적 환경
  월주(月柱): ${getGanJi(fp.month)} — 부모궁, 성장 환경
  일주(日柱): ${getGanJi(fp.day)} — 🌟 본인의 핵심 🌟
  시주(時柱): ${getGanJi(fp.time)} — 자녀궁, 잠재력

◆ 일간(Day Master): ${sp.dayMasterChar || sajuData.dayMaster || '알 수 없음'}
  → 은유: "${sp.dayMasterAnalogy || '(알 수 없음)'}"
  → 짧은 은유: "${sp.dayMasterShortAnalogy || ''}"

◆ 내면의 검열관 (관성/Official Star):
  → 한자: ${sp.killerElement || '?'}
  → 은유: "${sp.killerAnalogy || '?'}"
  → 십신명: ${sp.killerName || '?'}

◆ 감정의 출구 (식상/Expression Star):
  → 한자: ${sp.expressionElement || '?'}
  → 은유: "${sp.expressionAnalogy || '?'}"
  → 짧은 은유: "${sp.expressionShortAnalogy || '?'}"
  → 십신명: ${sp.expressionName || '?'}

◆ 마음의 방해꾼 (조후/Dryer):
  → 한자: ${sp.dryerElement || '?'}
  → 은유: "${sp.dryerAnalogy || '?'}"

◆ 경쟁의 그림자 (비겁/Rival Star):
  → 한자: ${sp.competitorElement || '?'}
  → 은유: "${sp.competitorAnalogy || '?'}"
  → 십신명: ${sp.competitorName || '?'}

◆ 나의 보물 자산 (재성/Asset Star):
  → 한자: ${sp.assetElement || '?'}
  → 은유: "${sp.assetAnalogy || '?'}"
  → 짧은 은유: "${sp.assetShortAnalogy || '?'}"
  → 십신명: ${sp.assetName || '?'}

◆ 핵심 충(沖)/형(刑): ${sp.primaryClash || '없음'}
◆ 현재 대운: ${sp.currentDaewoonGanji || '정보 없음'}

◆ 십신(十神) 수치: 비겁 ${selfCount} | 식상 ${outputCount} | 재성 ${wealthCount} | 관성 ${powerCount} | 인성 ${resourceCount}

◆ 십신 심리 서사:
${tenGodNarrative.map(n => `  · ${n}`).join('\n')}

◆ 오행(五行) 점수: ${Object.entries(ohaengScores).map(([k,v]) => `${(ohaengLabels as any)[k]}=${v}`).join(' | ')}
  → 가장 강한 기운: ${(ohaengLabels as any)[maxElem[0]]}(${maxElem[1]}점) — 과잉 주의
  → 가장 약한 기운: ${(ohaengLabels as any)[minElem[0]]}(${minElem[1]}점) — 치유적 보강 필요

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📖 이 페이지의 원래 치유 테마 가이드]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 페이지: ${pageKey}
- 원래 제목: ${originalPage.title}
- 원래 설명: ${(originalPage.desc || '').substring(0, 300)}
- 원래 질문: ${originalPage.socratic}
- 원래 확약문: ${originalPage.recursive}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✍️ 초개인화 재집필 지침 - 감동 극대화]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **내담자의 일간 은유를 적극 활용하세요**: "${sp.dayMasterShortAnalogy || '일간'}"이라는 이 내담자 고유의 본질을 중심으로 치유 서사를 풀어가세요.

2. **십신 심리 서사를 깊이 녹여넣으세요**: 위의 "십신 심리 서사" 각 문장을 읽고, 이 내담자만이 경험할 수 있는 구체적인 심리적 고통과 치유 포인트를 설명문에 자연스럽게 녹여 넣으세요. "비겁이 0개이므로..." 같은 기계적 표현 대신 "당신 안에는 홀로 풍파를 견뎌야 하는 고독한 전사의 기질이 있습니다" 같은 따뜻한 은유를 사용하세요.

3. **오행 불균형을 치유적으로 반영하세요**: ${(ohaengLabels as any)[minElem[0]]}(${minElem[1]}점)이 가장 부족하므로, 이 기운을 채워주는 방향으로 치유 서사를 전개하세요. ${(ohaengLabels as any)[maxElem[0]]}(${maxElem[1]}점)이 가장 강하므로 과잉의 부작용도 다정하게 짚어주세요.

4. **충/형 갈등을 구체적으로 반영하세요**: "${sp.primaryClash || '없음'}"이 이 내담자의 내면에서 어떤 갈등과 교착을 만드는지 구체적으로 설명해 주세요.

5. **관성의 은유("${sp.killerAnalogy || '검열관'}")와 식상의 은유("${sp.expressionShortAnalogy || '표현'}")를 적극 활용**하여 이 내담자의 억압과 해방의 역학을 생생히 그려주세요.

6. **이 사람의 이야기처럼** 써주세요. 읽는 사람이 "이건 정확히 내 이야기다, 어떻게 이렇게 잘 알지?" 하고 소름이 끼칠 정도로 구체적이고 개인적인 톤으로 작성하세요.

7. **desc는 300~400자**, 다정하고 격조 높은 힐링 톤앤매너, 뇌과학/심리학 용어를 자연스럽게 융합하세요.

⚠️ JSON만 출력. 마크다운 코드블록(\`\`\`) 금지. "{" 로 시작하여 "}" 로 끝낼 것.

{
  "title": "이 내담자만의 맞춤형 제목 (일간 은유 또는 핵심 기질 반영)",
  "desc": "이 내담자의 사주 기질에 딱 맞춘 300~400자 감동 치유 설명문",
  "socratic": "이 내담자의 십신 특성에 기반한 예리하고 다정한 자각 질문",
  "recursive": "이 내담자만의 뇌 신경망 이완 확약문 (시적이고 장엄하게)"
}
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
