/**
 * ===============================================================
 * 🔮 명심코칭 온디맨드(On-Demand) 캐싱 API
 * API Route: /api/generate-myeongsim/route.ts
 * 
 * 기능:
 * - Supabase 'report_contents' 테이블 캐싱 (Cache Hit 시 API 비용 0원)
 * - 캐시 미스 시 Gemini 2.5 Flash API를 활용하여 108페이지 개인화 리포트 생성
 * - 생성 즉시 Supabase에 Upsert(캐싱)하여 중복 비용 방지
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

// 108페이지 상세 매핑에 맞는 프롬프트 조각 생성기
function getFrameworkPromptForPage(pageId: string, sajuProfile: any): { title: string; framework: string; prompt: string } {
  const p = sajuProfile || {};
  const dm = p.dayMasterChar || '辛金';
  
  // 108페이지 매핑 정보
  const mappings: Record<string, { title: string; framework: string; prompt: string }> = {
    p5_8: {
      title: "[핵심 기질 1] 일간 본질 분석",
      framework: "CBT 인지행동치료",
      prompt: `내담자의 타고난 일간(${dm})에 대한 본질 분석과 심리적 필터, 빛과 그림자를 인지행동치료(CBT) 관점에서 분석해주세요. 일간 기질의 치우침으로 인해 일상에서 발생하는 누수 스트레스를 진단하고 따뜻한 어조로 교정 방안을 써주세요.`
    },
    p9_12: {
      title: "[핵심 기질 2] 현대적 기질 메타포",
      framework: "CBT 인지행동치료",
      prompt: `내담자의 기질 메타포(${p.dayMasterAnalogy || '은빛 다이아몬드'})에 대해 비즈니스적 가치와 오작동 시의 자기파괴 메커니즘을 CBT 기법으로 진단해주세요. 왜곡된 인지 오류를 해제하는 맞춤 확언을 제안해주세요.`
    },
    p13_16: {
      title: "[결정적 재능] 잠재력 디코딩",
      framework: "MSC 자기자비 마음챙김",
      prompt: `내담자의 타고난 재능이 억압받았던 심리적 궤적을 짚어내고, 무의식 속 깊은 상처와 그림자 에너지를 스스로 따뜻하게 안아주고 보듬어주는 자기자비(MSC) 치유 처방을 기술해주세요.`
    },
    p17_20: {
      title: "[일주 분석] 시공간과 영역의 법칙",
      framework: "CBT 인지행동치료",
      prompt: `내담자의 일주 기질을 바탕으로 이동, 이직, 독립 등 삶의 주요 결정을 내릴 때 주도권을 쥐는 공간적 확장 전략과 커리어 가이드를 인지행동치료(CBT) 관점에서 설계해주세요.`
    },
    p21_24: {
      title: "[심화 분석 1] 과다 십신의 폭주 제어",
      framework: "MBCT 마음챙김 인지치료",
      prompt: `내담자의 과잉 십신으로 인해 발생하는 과밀 행동(예: 완벽주의, 불안 등)의 신경망 루프를 마음챙김 인지치료(MBCT) 기법으로 진단하고, 의식적 자각을 통해 뇌를 안정시키는 비즈니스 리추얼을 처방해주세요.`
    },
    p25_28: {
      title: "[심화 분석 2] 인지적 왜곡과 마인드셋",
      framework: "CBT 인지행동치료",
      prompt: `불안과 강박이 엄습할 때 그것이 실재가 아닌 단순한 에너지 쏠림 현상일 뿐임을 자각하고 분리하는 CBT 디커플링 기법을 친절하고 상세히 설명하고 감동적인 치유 스크립트를 작성해주세요.`
    },
    p29_32: {
      title: "[심화 분석 3] 결핍 십신의 보완과 소통",
      framework: "DBT 변증법적 행동치료",
      prompt: `결핍된 기운으로 인해 고질적으로 겪는 소통의 한계를 변증법적 행동치료(DBT)의 대인관계 효율성 기법으로 분석하고, 이를 대안적 시스템이나 말하기 코드로 채워나가는 메타 소통법을 설계해주세요.`
    },
    p33_36: {
      title: "[포커스 월간 운세 1] 기회의 달 폭발 전략",
      framework: "ACT 수용전념치료",
      prompt: `올해 에너지가 극대화되는 달에 리스크를 줄이고 가치 중심 행동(Committed Action)으로 나아가기 위한 실행 메뉴얼과 아침 확언 로그를 작성해주세요.`
    },
    p37_40: {
      title: "[포커스 월간 운세 2] 리스크 구간 방어 프로토콜",
      framework: "ACT 수용전념치료",
      prompt: `주의해야 할 리스크 달에 발생 가능한 판단 착오와 갈등 요소를 예방하고, 감정의 폭풍 속에서 관찰자 자아(Self-as-Context)로 신속히 복귀하기 위한 위기 관리 SOP를 처방해주세요.`
    },
    p41_46: {
      title: "[현재 대운 분석] 인생의 거대한 파도",
      framework: "MBSR 스트레스 완화",
      prompt: `현재 주도하는 10년 대운이 가해오는 압박을 스트레스 완화(MBSR) 관점에서 자아 탄력성으로 전환하는 명심 멘탈 바이오해킹 기술을 다루고, 신체적 긴장 완화 가이드를 처방해주세요.`
    },
    p47_50: {
      title: "[미래 대운 분석] 선행적 자산 설계",
      framework: "MSC 자기자비 마음챙김",
      prompt: `다가올 다음 대운의 징후를 알아차리고, 미래의 나에게 따뜻한 지지와 위안을 보내는 자기자비(MSC) 자산 설계 공식을 제안해주세요.`
    },
    p51_54: {
      title: "[타이밍 메타 코드] 운명 동기화",
      framework: "ACT 수용전념치료",
      prompt: `운의 흐름에 억지로 저항하여 힘을 낭비하지 않고, 고통을 수용(Acceptance)하여 우주의 주기와 행동 주기를 일치시키는 가치 전념 확언문을 집필해주세요.`
    },
    p55_59: {
      title: "[심리 구조] 내면 방어기제 해부",
      framework: "MBCT 마음챙김 인지치료",
      prompt: `내면 깊숙이 자리 잡은 고위험 핵심 신념과 방어기제의 뿌리를 해부하고, 칼날 같은 방어기제를 내려놓고 안전지대를 구축하는 MBCT 3분 마음챙김 호흡 프로토콜을 처방해주세요.`
    },
    p60_64: {
      title: "[기질 융합] 동서양 심리 지표 크로스 매핑",
      framework: "MSC 자기자비 마음챙김",
      prompt: `내담자의 사주 기질과 서양의 심리 기질(MBTI 등)을 자기자비(MSC)의 보편적 인간성 관점에서 크로스 매핑하고, 오행의 쏠림이 유발하는 성격 단점을 따뜻하게 수용하며 초강점 지능으로 승화시키는 결과를 시각화해 제안해주세요.`
    },
    p65_68: {
      title: "[명심 적성] 천명 기반 비즈니스 설계",
      framework: "CBT 인지행동치료",
      prompt: `격국과 용신을 자본주의 비즈니스에 투사하여 수익으로 전환되는 최대 부(富)의 확장 구조 아키텍처를 CBT의 기능적 인지교정으로 서술해주세요.`
    },
    p69_72: {
      title: "[리스크 관리] 인간 리스크 방어막",
      framework: "MSC 자기자비 마음챙김",
      prompt: `투자나 파트너십 시 취약점을 파고드는 상극 기질로부터 자신을 보호하기 위해, 상처받은 마음을 돌보는 MSC 기반의 자비로운 경계선(Boundary) 설정 및 메타 협상 스크립트를 작성해주세요.`
    },
    p73_76: {
      title: "[갭 분석 솔루션] 자아 디커플링 보정",
      framework: "MBCT 마음챙김 인지치료",
      prompt: `우주가 설계한 타고난 본질과 현재 살아가는 현실 페르소나의 불일치로 인한 무기력을 해결하기 위해, 영혼의 신호를 듣고 간극을 좁히는 갭 보정 공식을 선언해주세요.`
    },
    p77_80: {
      title: "[신살 승화] 살을 매력 자산으로",
      framework: "DBT 변증법적 행동치료",
      prompt: `신살의 파괴적 에너지를 독보적인 예술적 전문성이나 대중적 카리스마로 치환하는 공식을 제시하고, 감정이 극단으로 치달을 때 안정을 주는 DBT TIPP 프로토콜을 적용해주세요.`
    },
    p81_84: {
      title: "[대인 귀인] 운명의 인적 네트워크",
      framework: "MSC 자기자비 마음챙김",
      prompt: `내담자의 성장을 견인할 귀인을 만났을 때 상대방 무의식을 따뜻하게 연결하는 자비와 상생 동맹의 소통 기술을 MSC 관점에서 서술해주세요.`
    },
    p85_87: {
      title: "[연애 DNA] 무의식적 끌림의 미학",
      framework: "DBT 변증법적 행동치료",
      prompt: `천간 합과 지지 기운을 통해 강렬하게 끌리는 이상형과 친밀감 속에서 발현되는 다크 뉴럴 애착 패턴을 분석하고, 욕구를 우아하게 소통하는 연애 코드를 처방해주세요.`
    },
    p88_90: {
      title: "[관계 리스크] 검열의 함정",
      framework: "DBT 변증법적 행동치료",
      prompt: `파트너를 무의식적으로 검열하고 지치게 만드는 갈등 루프를 진단하고, 상대의 불완전함을 타당화(Validation)하며 존엄을 지켜내는 DBT DEAR MAN 대화 기술을 처방해주세요.`
    },
    p91_94: {
      title: "[결혼 및 파트너십] 영혼의 결합",
      framework: "DBT 변증법적 행동치료",
      prompt: `일지 배우자 자리에 숨겨진 오행 에너지 분석을 바탕으로, 부부 대운 충돌 시 가정을 방어하는 안전 시나리오와 조화로운 최종 결합 프로토콜을 제시해주세요.`
    },
    p95_98: {
      title: "[오행 솔루션] 신경학적 개운 처방",
      framework: "MBSR 스트레스 완화",
      prompt: `부족한 기운을 일상 공간 인테리어와 배치를 통해 조율하는 공간 에너지 아키텍처 및 뇌를 자극하는 개운 환경 처방(색상, 숫자, 방향)을 제시해주세요.`
    },
    p99_102: {
      title: "[액션 플랜] 고효율 리추얼 설계",
      framework: "MBSR 스트레스 완화",
      prompt: `기질적 게으름이나 미루기 행동을 예방하는 뇌 부팅용 모닝/나이트 리추얼 및 신체적 긴장감을 이완하는 보디스캔(Body Scan) 명상 가이드를 작성해주세요.`
    },
    p103_105: {
      title: "[마스터의 편지] 세공의 마침표",
      framework: "MSC 자기자비 마음챙김",
      prompt: `삶의 단련 과정을 견뎌낸 내담자의 영혼에 바치는 시적이고 감동적인 자기자비(MSC)의 헌사와 최종 마스터의 서신을 작성해주세요.`
    },
    p106_108: {
      title: "[명심코칭 메타 워크시트] 108일의 기적",
      framework: "MBSR 스트레스 완화",
      prompt: `108일간의 무의식 리프로그래밍을 위한 데일리 마인드 로그의 구체적인 기록법과 완전한 도약을 돕는 최종 마스터 체크리스트를 제안해주세요.`
    }
  };

  return mappings[pageId] || {
    title: "명심코칭 맞춤 분석",
    framework: "CBT 통합 아키텍처",
    prompt: `내담자의 사주 기질 프로파일을 바탕으로 해당 주제에 관하여 CBT, ACT, DBT 등의 기법을 통합적으로 활용해 상세한 가이드를 작성해주세요.`
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId, pageId, sajuData, sajuProfile } = await req.json();

    if (!userId || !pageId) {
      return NextResponse.json({ success: false, error: 'userId와 pageId가 필요합니다.' }, { status: 400 });
    }

    // 1. 수파베이스 캐시 조회 (Cache Hit Check)
    const { data: cacheData, error: cacheError } = await supabase
      .from('report_contents')
      .select('generated_text')
      .eq('user_id', userId)
      .eq('page_id', pageId)
      .maybeSingle();

    if (cacheData && !cacheError) {
      console.log(`✨ [Cache Hit] user_id: ${userId}, page_id: ${pageId}`);
      return NextResponse.json({ success: true, text: cacheData.generated_text });
    }

    console.log(`⚡ [Cache Miss] Generating new content via Gemini...`);

    // 2. 사주 프로파일 확보 (폴백 구조 작동)
    let finalSaju = sajuData;
    let finalProfile = sajuProfile;

    if (!finalSaju) {
      // Supabase 'users_saju' 또는 기존의 'report_contents'에 의존하지 않는 유저 만세력 데이터 탐색
      const { data: dbSaju } = await supabase
        .from('users_saju')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (dbSaju) {
        finalSaju = dbSaju.saju_data || dbSaju;
        finalProfile = dbSaju.profile_data || {};
      }
    }

    // 최종 폴백 데이터 구축
    if (!finalSaju) {
      finalSaju = {
        dayMaster: '신금',
        dayMasterChar: '辛',
        fourPillars: {
          year: { gan: '庚', ji: '申' },
          month: { gan: '癸', ji: '未' },
          day: { gan: '辛', ji: '巳', char: '辛' },
          time: { gan: '乙', ji: '未' }
        },
        elements: { wood: 1, fire: 1, earth: 2, metal: 2, water: 2 },
        tenGods: { self: 2, output: 2, wealth: 1, power: 1, resource: 2 }
      };
    }

    if (!finalProfile) {
      finalProfile = {
        dayMasterChar: finalSaju.dayMasterChar || '辛',
        dayMasterAnalogy: '빛나는 다이아몬드(辛金)',
        dayMasterShortAnalogy: '보석',
        sajuGanji: '庚申 癸未 辛巳 乙未'
      };
    }

    // 3. 페이지별 맞춤 프롬프트 조립
    const mapping = getFrameworkPromptForPage(pageId, finalProfile);
    
    const prompt = `
당신은 명심코칭의 수석 AI 무의식 디버깅 및 명리 치유 전문가입니다.
내담자의 타고난 사주 원국과 심리학적 아키텍처를 결합해, 다음 테마에 대한 초개인화 솔루션을 아주 감동적이고 시적이며 구체적으로 집필하십시오.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🧬 내담자 사주 기질 정보]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 일간(Day Master): ${finalSaju.dayMaster || '신금'} (${finalSaju.dayMasterChar || '辛'})
- 일주 별칭 및 메타포: ${finalProfile.dayMasterAnalogy || '빛나는 다이아몬드'}
- 사주 원국 흐름: ${finalProfile.sajuGanji || '庚申 癸未 辛巳 乙未'}
- 오행 구성: 목(${finalSaju.elements?.wood || 0}) 화(${finalSaju.elements?.fire || 0}) 토(${finalSaju.elements?.earth || 0}) 금(${finalSaju.elements?.metal || 0}) 수(${finalSaju.elements?.water || 0})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📖 오늘 디버깅할 치유 테마]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 섹션: ${mapping.title}
- 심리 프레임워크: ${mapping.framework}
- 핵심 치유 가이드라인:
${mapping.prompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✍️ 문체 및 출력 지침 (초고도화 필독)]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. **절대 가볍거나 짤막한 답변을 내놓지 마십시오.** 리포트의 신뢰도와 완성도를 위해 분량은 **최소 1,200자~1,500자 이상**으로 매우 깊이 있고 구체적으로 풍부하게 서술하십시오.
2. 전문적이고 딱딱한 용어(예: 인지적 융합, 변증법, 인지행동 등)는 배제하고, "생각의 사슬", "마음의 거울", "감정의 강물", "내면의 상처 코드" 같이 초보자도 쉽게 이해할 수 있는 다정하고 따뜻한 비유와 문장으로 설명하세요.
3. 말투는 경어체(~해요, ~일 것입니다, ~라네)를 섞어서, 영혼을 따뜻하게 안아주는 치유사와 같은 감동적인 느낌을 가득 담으세요.
4. 출력 형식은 반드시 아래의 **[3단계 마크다운 구조]**를 100% 동일하게 지켜 가독성 있게 렌더링하십시오.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📝 출력 마크다운 규격 템플릿]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌌 [여기에 섹션의 한글 타이틀 출력]

## 1. 🔍 기질적 인지 필터와 무의식 에러 코드 분석
- **무의식의 에러 로그**: 타고난 사주 오행의 치우침(${finalSaju.dayMasterChar} 일간 중심)과 오늘 페이지의 테마가 얽혀 발생하는 일상의 무의식적 걸림돌, 집착, 또는 판단 왜곡의 구체적 원인을 짚어냅니다.
- **생각과 자아의 분리 (디커플링)**: 내담자가 겪는 부정적인 생각이나 불안이 자신의 본질이 아님을 깨닫게 돕고, 관찰자 시점(Meta-Self)에서 이를 가만히 내려다볼 수 있는 메타 인지 공간을 설정해 줍니다.

## 2. 💡 명심 코칭 3단계 디버깅 처방전
- **1단계 (자각 - Scan)**: 마음속 일어나는 동요의 실체를 있는 그대로 인지하기 위한 자각 스캔법을 제안합니다.
- **2단계 (수용 - Accept)**: 부족하거나 치우친 에너지를 억누르지 않고, 오히려 삶의 무기로 활용할 수 있도록 허용하는 수용의 논리를 설명합니다.
- **3단계 (전념 행동 - Shift)**: 뇌의 과부하를 막고 실제로 행동으로 옮겨 현실을 리프로그래밍할 수 있는 모닝/나이트 3단계 리추얼 수칙을 처방합니다.

## 3. ✨ 오늘의 운명 동기화 메타 확언 (Meta-Affirmation)
- 내담자의 타고난 일주와 오행 주파수에 유기적으로 주파수를 맞춘, 가슴을 울리는 감동적이고 시적인 최종 확언 카드를 만들어 줍니다. (읽는 것만으로도 가슴이 벅차오르고 위안이 되도록 정성 들여 써주세요.)
`.trim();

    // 4. Gemini API 호출
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
        maxOutputTokens: 2048,
        // @ts-ignore
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    if (!generatedText) {
      throw new Error('Gemini API가 빈 텍스트를 반환했습니다.');
    }

    // 5. 생성된 결과를 Supabase 테이블에 Upsert (캐싱)
    const { error: upsertError } = await supabase
      .from('report_contents')
      .upsert({
        user_id: userId,
        page_id: pageId,
        title: mapping.title,
        generated_text: generatedText,
        updated_at: new Date()
      }, { onConflict: 'user_id,page_id' });

    if (upsertError) {
      console.warn('⚠️ Supabase 캐시 저장 실패:', upsertError);
    }

    return NextResponse.json({ success: true, text: generatedText });

  } catch (error: any) {
    console.error('❌ [/api/generate-myeongsim] 에러 발생:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
