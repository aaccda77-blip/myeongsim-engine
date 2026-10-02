import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import {
    OFFICIAL_INDUSTRY_MASTER_DATA,
    OFFICIAL_MASTER_META,
    verifyOfficialCodeExists,
    getOfficialIndustryRecord
} from '@/data/OfficialIndustryMasterDB';
import {
    evaluateDeterministicRules,
    DEFAULT_BUSINESS_FACT,
    BusinessFactSchema
} from '@/lib/engine/BusinessFactRuleEngine';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history, sajuSummary, intakeAnswers, userName, businessFacts } = body;

        if (!message) {
            return NextResponse.json({ error: '메시지가 누락되었습니다.' }, { status: 400 });
        }

        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
        const apiKey = process.env.GEMINI_API_KEY || 
                       process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                       process.env.GOOGLE_GEMINI_API_KEY || 
                       process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

        const clientName = userName || '대표님';
        const sajuText = sajuSummary || '辛巳 일주 · 癸未 월주 · 庚申 년주 · 乙未 시주';

        const stageLabel = intakeAnswers?.stage === 'early_stage'
            ? '초기 창업 (초기창업패키지 대상)'
            : intakeAnswers?.stage === 're_founder'
            ? '재창업 / 피봇팅 (재도전성공패키지 대상)'
            : '예비 창업 (예비창업패키지 대상)';

        const businessTypeLabel = intakeAnswers?.businessType === 'platform_it'
            ? '플랫폼·앱/웹 서비스 (IT/데이터)'
            : intakeAnswers?.businessType === 'b2b_consulting'
            ? 'B2B 전문 용역·컨설팅·교육'
            : intakeAnswers?.businessType === 'commerce_goods'
            ? '제조·유통·이커머스'
            : '1인 지식·IP·콘텐츠 (무자본/소자본)';

        const problemText = intakeAnswers?.problemKeyword || '기존 솔루션의 추상성과 높은 비용, 실행 공백';
        const solutionText = intakeAnswers?.solutionKeyword || '기질 데이터 기반 표준 행정 코드 매핑 및 AI 자동화 솔루션';
        const bottleneckText = intakeAnswers?.biggestBottleneck || '사업계획서 작성 및 자금 조달';

        // 1. Fact 기반 결정론적 규칙 엔진 실행 (Deterministic Rule Engine)
        const currentFacts: BusinessFactSchema = businessFacts || DEFAULT_BUSINESS_FACT;
        const deterministicEvaluation = evaluateDeterministicRules(currentFacts);

        // 공식 Master DB 요약 텍스트 생성 (LLM 프롬프트 주입용)
        const officialDbCatalog = Object.values(OFFICIAL_INDUSTRY_MASTER_DATA).map(rec => 
            `[코드: ${rec.tax_code}] ${rec.tax_name} (KSIC ${rec.ksic_code}: ${rec.ksic_name})
- 업태: ${rec.main_business_type}
- 정의: ${rec.definition}
- 포함 사례: ${rec.included_examples.join('; ')}
- 제외/주의 사유: ${rec.excluded_examples.join('; ')}
- 창업감면 대상: ${rec.tax_benefit_applicable ? '적격 (' + rec.tax_benefit_notes + ')' : '제외/주의'}`
        ).join('\n\n');

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline business advice.");
            const primaryCode = deterministicEvaluation.primary_candidates[0];
            const secondaryCodesText = deterministicEvaluation.secondary_candidates.map(c => `• ${c.tax_name} [${c.tax_code}]`).join('\n');

            const offlineReply = `### [3S 비즈니스 아키텍처 진단]
**${clientName}의 기질 프로파일 기반 1:1 맞춤 사업 전략 보고서**

#### 1. 1초 직관 진단 (Scan)
- **현재 포지션**: ${stageLabel} / ${businessTypeLabel}
- **핵심 통찰**: 현재 겪고 계신 병목인 **"${bottleneckText}"**은 단순한 지연이 아니라, 대표님의 선천적 기질 강점(정밀 분석과 구조화)이 실무 실행 속도와 일시적 마찰을 빚는 자연스러운 전환점입니다.

#### 2. 실제 사업모델(Fact) & 공식 업종코드 판정 (Sync)
- **판정 상태**: [${deterministicEvaluation.status}] (${OFFICIAL_MASTER_META.ksic_version})
- **주업종 1순위**: ${primaryCode ? `${primaryCode.tax_name} [${primaryCode.tax_code}] (KSIC ${primaryCode.ksic_code})` : '724000 데이터베이스 및 온라인정보제공업'}
- **선정 근거**: ${primaryCode?.reason || '웹 플랫폼을 통한 자동 리포트 실시간 제공'}
- **권장 부업종**:
${secondaryCodesText || '• 경영컨설팅업 [741400]\n• 일반서적 출판업 [581101]'}

#### 3. 즉각 실행 3S 액션 플랜 (Shift)
1. **이번 주 즉시 실행**: ${bottleneckText} 해소를 위해 일정을 3단계 마일스톤으로 쪼개고 1차 최소기능버전(MVP)을 48시간 내 완성하세요.
2. **자원 최적화**: 모든 것을 직접 해결하려 하지 마시고, 반복 업무는 AI 자동화 도구에 위임하여 기획과 고객 검증에 에너지를 집중하세요.
3. **확언**: "${clientName}의 독창적인 기질 자산은 이미 시장의 거대한 결핍을 해결할 준비가 되어 있습니다."`;

            return NextResponse.json({ 
                success: true, 
                reply: offlineReply,
                evaluation: deterministicEvaluation
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const systemPrompt = `[System Instruction: Myeongsim Business Classification & Architecture Coach]

당신은 명심코칭의 [사업분류 검증 및 1:1 비즈니스 아키텍트 에이전트]입니다.
다음 3단계 분리 및 환각 방지 절대 규칙을 100% 준수해야 합니다.

=======================================================
[핵심 원칙 1: 사주와 업종코드의 완전한 분리]
- 사주, 생년월일, 성격, 운세, 오행/십신은 절대로 국세청 업종코드나 KSIC 코드를 결정하는 근거가 될 수 없습니다.
- 사주는 오직:
  1) 창업자의 사업 방향 추천
  2) 지식 상품화 방식 추천 (1인 지식 IP ➔ 시스템화 ➔ 플랫폼 확장)
  3) 운영 스타일 및 번아웃 방지 코칭 질문 개인화
  에만 사용합니다.

[핵심 원칙 2: 공식 업종코드 판정 기준]
업종코드는 오직 다음 "실제 사업 활동 Fact"를 기준으로만 판단합니다:
1. 실제로 판매하는 상품 또는 결과물이 무엇인가?
2. 주요 고객이 누구인가? (B2C, B2B, B2G)
3. 서비스가 고객에게 어떤 방식으로 제공되는가? (웹/SaaS 접속, PDF 다운로드, 1:1 대면 등)
4. 어떤 방식으로 돈을 받는가? (월 정기구독, 건별 결제, 프로젝트 자문료 등)
5. 자동화 서비스인가, 사람의 직접 자문 용역인가?
6. 주된 매출이 발생하는 핵심 활동이 무엇인가?

[핵심 원칙 3: 절대 환각 금지 & 공식 MASTER DB 한정 사용]
- 절대로 당신의 임의 기억이나 추측으로 국세청 업종코드(6자리), KSIC 코드(5자리), 또는 공식 명칭을 지어내지 마십시오. (예: 732002 등 비표준 코드 절대 금지)
- 아래에 제공된 [공식 업종코드 MASTER DB]에 존재하는 활성 코드만 사용해야 합니다.
- DB에 존재하지 않는 코드는 절대로 생성하지 마십시오.

=======================================================
[공식 업종코드 MASTER DATABASE (${OFFICIAL_MASTER_META.ksic_version}, 시행일: ${OFFICIAL_MASTER_META.effective_date})]
${officialDbCatalog}

=======================================================
[상담 대상자 프로파일]
- 대표자명: ${clientName}
- 선천적 기질 프로파일: ${sajuText}
- 창업 단계: ${stageLabel}
- 비즈니스 형태: ${businessTypeLabel}
- 해결하려는 시장 결핍: ${problemText}
- 핵심 제공 솔루션: ${solutionText}
- 현재 가장 큰 결핍/병목: ${bottleneckText}

[현재 사업모델 실질 Fact (Deterministic Rule Engine 판정 결과)]
- 상태: ${deterministicEvaluation.status} (${deterministicEvaluation.status_reason || '정상'})
- 주업종 1순위: ${deterministicEvaluation.primary_candidates.map(c => `${c.tax_name} [${c.tax_code}] (KSIC ${c.ksic_code})`).join(', ') || '추가 문진 필요'}
- 부업종 권장: ${deterministicEvaluation.secondary_candidates.map(c => `${c.tax_name} [${c.tax_code}]`).join(', ')}
- 제외/주의 후보: ${deterministicEvaluation.excluded_candidates.map(c => `${c.tax_name} [${c.tax_code}]: ${c.exclusion_reason}`).join(' | ')}

[답변 작성 가이드]
1. 3층 구조화 형식으로 사람이 이해하기 쉽게 답변하세요:
   ① [명심 맞춤 분석]: 대표님의 인지 강점에 맞는 사업 전략 방향 (사주 기반 개인화)
   ② [실제 사업모델 Fact]: 무엇을 어떻게 팔아 돈을 버는지 실질 구조화
   ③ [공식 업종코드 검토]: 공식 DB 기준 주업종/부업종 후보, 공식 명칭, 선정 근거, 제외 사유, [제11차 KSIC 2024.07.01 시행] 명시
2. 정보가 부족하거나 SaaS vs 컨설팅의 주 매출 비중이 불명확할 경우, 임의로 확정하지 말고 사용자에게 "어느 쪽이 주된 매출 비중인가요?"라고 질문을 던지세요.
3. 조세특례제한법 제6조 창업중소기업 감면(수도권과밀 외 청년 100%, 일반 50%)을 법률에 부합하게 안내하세요.
4. 모든 문장은 완전하고 품격 있는 어조로 마침표까지 깔끔하게 끝맺으세요.`;

        // Google Gemini History 포맷 검증
        const rawHistory = Array.isArray(history) ? history : [];
        const validHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

        let firstUserIndex = -1;
        for (let i = 0; i < rawHistory.length; i++) {
            if (rawHistory[i]?.role === 'user') {
                firstUserIndex = i;
                break;
            }
        }

        if (firstUserIndex !== -1) {
            for (let i = firstUserIndex; i < rawHistory.length; i++) {
                const item = rawHistory[i];
                const mappedRole = item.role === 'user' ? 'user' : 'model';
                const textContent = typeof item.content === 'string' ? item.content : '';
                
                if (textContent.trim()) {
                    const lastMsg = validHistory[validHistory.length - 1];
                    if (lastMsg && lastMsg.role === mappedRole) {
                        lastMsg.parts[0].text += `\n${textContent}`;
                    } else {
                        validHistory.push({
                            role: mappedRole,
                            parts: [{ text: textContent }]
                        });
                    }
                }
            }
        }

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ];

        const primaryModelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        let reply = '';

        try {
            const model = genAI.getGenerativeModel({
                model: primaryModelName,
                systemInstruction: systemPrompt,
                safetySettings,
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 8192,
                }
            });

            const chatSession = model.startChat({
                history: validHistory,
            });

            const result = await chatSession.sendMessage(message);
            reply = result.response.text().trim();
        } catch (firstErr: any) {
            console.warn(`[Business Consultant API] Primary model (${primaryModelName}) failed:`, firstErr?.message || firstErr);
            
            try {
                const fallbackModelName = 'gemini-1.5-flash';
                const model = genAI.getGenerativeModel({
                    model: fallbackModelName,
                    systemInstruction: systemPrompt,
                    safetySettings,
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 8192,
                    }
                });

                const chatSession = model.startChat({
                    history: validHistory,
                });

                const result = await chatSession.sendMessage(message);
                reply = result.response.text().trim();
            } catch (fallbackErr: any) {
                console.error("[Business Consultant API] Fallback model also failed:", fallbackErr?.message || fallbackErr);
                throw fallbackErr;
            }
        }

        // [Verification Gate - 서버 검증 및 비인가 코드 차단]
        // 만약 LLM이 마스터 DB에 없는 6자리 숫자 코드를 임의로 출력했다면 필터링
        const sixDigitMatches = reply.match(/\b\d{6}\b/g) || [];
        for (const code of sixDigitMatches) {
            if (!verifyOfficialCodeExists(code)) {
                // 비공식 코드가 감지되면 해당 문자열을 안내 텍스트로 치환하여 환각 출력 원천 차단
                const regex = new RegExp(`\\b${code}\\b`, 'g');
                reply = reply.replace(regex, `[공식 미확인 코드 검증 차단: ${code}]`);
            }
        }

        return NextResponse.json({
            success: true,
            reply,
            evaluation: deterministicEvaluation
        });

    } catch (error: any) {
        console.error('Business Consultant API Route Error:', error);
        return NextResponse.json(
            { error: error?.message || '비즈니스 아키텍트 상담 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
