/**
 * 🔍 모듈 상세 확장 API (Supabase 캐싱 포함)
 * 1순위: Supabase에 저장된 상세 내용이 있으면 즉시 반환 (AI 호출 0원)
 * 2순위: 없으면 AI로 생성 → Supabase에 저장 → 반환
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  let latestRawText = '';
  try {
    const body = await req.json();
    const { moduleType, shortContent, pageTitle, sajuProfile, userName, userKey, pageKey } = body;

    if (!moduleType || !shortContent) {
      return NextResponse.json({ error: '필수 데이터 누락' }, { status: 400 });
    }

    // ━━━ 1순위: Supabase에서 캐시된 상세 내용 조회 ━━━
    if (userKey && pageKey) {
      try {
        const { data: existing } = await supabaseAdmin
          .from('user_108_reports')
          .select('generated_content')
          .eq('user_key', userKey)
          .eq('page_key', pageKey)
          .maybeSingle();

        if (existing?.generated_content?.expandedDetails?.[moduleType]) {
          console.log(`✅ [캐시 히트] ${pageKey}/${moduleType} — AI 호출 없이 즉시 반환`);
          return NextResponse.json({
            success: true,
            detail: existing.generated_content.expandedDetails[moduleType],
            cached: true
          });
        }
      } catch (dbErr) {
        console.warn('DB 조회 중 오류 (AI로 폴백):', dbErr);
      }
    }

    // ━━━ 2순위: AI로 상세 풀이 생성 ━━━
    const sp = sajuProfile || {};

    const moduleLabels: Record<string, string> = {
      sajuAnalysis: '사주 기질 분석 — 내 사주가 이 주제에 미치는 영향',
      darkCodeCbt: '다크코드 (CBT 인지성찰) — 생각의 함정 해체',
      metaCodeAct: '메타코드 (ACT 수용전념) — 기질을 강점으로 전환',
      neuralCodeDbt: '뉴럴코드 (DBT 변증법적 행동조율) — 위기 시 행동 가이드',
      socraticMbct: '마음챙김 자각 (MBCT 마음챙김 성찰) — 내면 자각 질문',
      relaxMbsr: '스트레스 이완 (MBSR 이완 조율) — 이완 실천법',
      selfCompassionMsc: '자기연민 (MSC 자기연민) — 나를 따뜻하게 안아주기',
      coachingSolution: '코칭 솔루션 — 오늘부터 실천할 행동 과제',
      mantra: '만트라 확언 — 평생 꺼내 읽는 확언문'
    };

    const moduleLabel = moduleLabels[moduleType] || moduleType;

    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 2048,
        // @ts-ignore
        thinkingConfig: { thinkingBudget: 512 }
      },
    });

    const prompt = `
당신은 명심코칭의 AI 심리 치유 전문가예요.
아래 요약을 바탕으로, 내담자의 사주 4주팔자 및 공망 기질과 3세대 과학적 심리치료(CBT·ACT·DBT)를 융합하여 아주 상세하고 친절하며 감동적으로 풀어서 설명해 주세요.

[내담자 정보]
- 이름: ${userName || '소중한 내담자'}님
- 일간: ${sp.dayMasterChar || '알 수 없음'}

[페이지 주제 및 모듈]
- 주제: ${pageTitle || '자기 이해'}
- 모듈: ${moduleLabel}
- 요약 내용: "${shortContent}"

[작성 규칙]
1. 모든 모듈에서 똑같은 "은빛 다이아몬드", "감시 카메라" 같은 상투적 비유를 반복하지 마세요!
2. 해당 모듈의 핵심 내용("${moduleLabel}")과 사주 4주팔자 및 공망 기질을 깊게 분석하여 "아, 이 이야기는 정말 내 이야기구나!" 하고 깊이 감동받도록 써주세요.
3. 시중 사주에서 가장 관심사가 높은 인기 키워드 [재물운/부의 그릇, 직업과 소명, 인연과 관계, 내면의 불안 극복]를 자연스럽게 언급하며 1:1로 코칭해 주세요.
4. "~해요", "~거예요", "~죠" 같은 다정하고 따뜻한 이야기체로 써주세요.
5. 300~500자로 충분히 상세하게 설명해 주세요.
6. ★ 호칭 규칙: 내담자를 부를 때 사주 일간("신금님" 등)을 이름으로 쓰지 마세요. 반드시 "${userName || '소중한 내담자'}님"으로 불러주세요.
7. ★ 의료법 준수 금지 단어: "처방전", "처방", "진단", "치료", "환자" 단어 사용 절대 금지! ("행동 가이드", "솔루션", "디코딩", "조율", "성찰", "내담자" 사용)

마크다운이나 JSON 없이, 순수한 텍스트로만 답변해 주세요.
`.trim();

    const result = await model.generateContent(prompt);
    const response = result.response;
    const detailedText = response.text();
    latestRawText = detailedText;

    // ━━━ Supabase에 상세 내용 영구 저장 ━━━
    if (userKey && pageKey && detailedText) {
      try {
        // 기존 행 가져오기
        const { data: row } = await supabaseAdmin
          .from('user_108_reports')
          .select('generated_content')
          .eq('user_key', userKey)
          .eq('page_key', pageKey)
          .maybeSingle();

        if (row) {
          // 기존 generated_content에 expandedDetails 머지
          const updatedContent = {
            ...row.generated_content,
            expandedDetails: {
              ...(row.generated_content?.expandedDetails || {}),
              [moduleType]: detailedText
            }
          };

          await supabaseAdmin
            .from('user_108_reports')
            .update({ generated_content: updatedContent })
            .eq('user_key', userKey)
            .eq('page_key', pageKey);

          console.log(`💾 [DB 저장 완료] ${pageKey}/${moduleType} — 다음부터 AI 호출 불필요`);
        }
      } catch (saveErr) {
        console.warn('DB 저장 실패 (응답은 정상 반환):', saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      detail: detailedText,
      cached: false
    });

  } catch (error: any) {
    console.error('expand-module API Error:', error);
    return NextResponse.json({
      error: error?.message || '상세 설명 생성 중 오류',
      raw: latestRawText || 'No Output'
    }, { status: 500 });
  }
}
