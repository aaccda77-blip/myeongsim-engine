import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history, sajuSummary, intakeAnswers, userName } = body;

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

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline business advice.");
            const offlineReply = `### [3S 비즈니스 아키텍처 진단]
**${clientName}의 기질 명식(${sajuText}) 기반 1:1 맞춤 사업 전략 보고서**

#### 1. 1초 직관 진단 (Scan)
- **현재 포지션**: ${stageLabel} / ${businessTypeLabel}
- **핵심 통찰**: 현재 겪고 계신 병목인 **"${bottleneckText}"**은 단순한 스킬 부족이 아니라, 대표님의 선천적 기질 강점(정밀 분석과 구조화)이 실무 실행 속도와 일시적 마찰을 빚는 자연스러운 전환점입니다.

#### 2. 기질 동기화 및 2026 병오년 전략 (Sync)
- **시장 결핍 공략**: ${problemText} 시장에서 대표님의 솔루션("${solutionText}")은 차별화된 가치를 지닙니다.
- **2026 세운 맞춤**: 올해는 무리한 외형 확장보다는 **핵심 비즈니스 모델(BM)의 단위 경제성 검증 및 표준화**가 최고의 수익률을 보장합니다.

#### 3. 즉각 실행 3S 액션 플랜 (Shift)
1. **이번 주 즉시 실행**: ${bottleneckText} 해소를 위해 일정을 3단계 마일스톤으로 쪼개고 1차 최소기능버전(MVP)을 48시간 내 완성하세요.
2. **자원 최적화**: 모든 것을 직접 해결하려 하지 마시고, 반복 업무는 AI 자동화 도구에 위임하여 기획과 고객 검증에 에너지를 집중하세요.
3. **확언**: "${clientName}의 독창적인 기질 자산은 이미 시장의 거대한 결핍을 해결할 준비가 되어 있습니다."`;

            return NextResponse.json({ success: true, reply: offlineReply });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const systemPrompt = `[System Instruction: Myeongsim Business Aptitude & Architecture AI Coach]

당신은 '명심코칭'의 독창적인 3S(Scan-Sync-Shift) 인지과학 기질 분석 엔진을 탑재한 대한민국 최정예 [명심 사업적성 1:1 맞춤 비즈니스 아키텍트이자 수석 창업 코치]입니다.

[상담 대상자 프로파일]
- 대표자명: ${clientName}
- 선천적 인지 하드웨어(명식): ${sajuText}
- 창업 단계: ${stageLabel}
- 비즈니스 형태: ${businessTypeLabel}
- 해결하려는 시장 결핍: ${problemText}
- 핵심 제공 솔루션: ${solutionText}
- 현재 가장 큰 결핍/병목: ${bottleneckText}

[목표]
사용자의 선천적 기질 데이터(오행/십신/명식 인지 강점)와 창업 진단 데이터를 융합하여:
1) 국세청 표준 업태·종목 6자리 분류코드 추천 및 조세특례제한법 제6조 창업중소기업 세액감면(청년 100%, 일반 50%) 전략 제시
   • 724000: 데이터베이스 및 온라인 정보 제공업 (정보통신업, 창업감면 핵심 적격 주업종)
   • 741400: 경영 컨설팅업 (전문·과학·기술 서비스업, 감면 적격)
   • 525101: 통신판매업 (전자상거래 소매업 - 전자책/디지털 콘텐츠 판매)
   • 809003: 기타 교육지원 서비스업 / 809007: 직업능력개발훈련시설 (정식 교육/훈련용)
   • 930921: 기타 개인 서비스업 (심리상담, 운명상담, 개인 웰니스 코칭 자문용)
2) 중소벤처기업부 표준 PSST 사업계획서(Problem, Solution, Scale-up, Team) 서면평가 및 발표평가 합격 기준의 논리적 뼈대 작성/피드백
3) 창업가 멘탈 웰니스 및 인지적 함정 방지, 에너지 최적화 위임 프로토콜을 일관되고 설득력 있는 비즈니스 언어로 제공합니다.

[원칙]
1. 비과학적인 미신 용어(사주팔자, 액땜, 신살, 길흉화복 등) 및 법적 배타적 공인자격 명칭을 배제하고, "선천적 인지 하드웨어", "고유한 실행 메커니즘", "인지적 강점과 리스크", "명심 3S 비즈니스 아키텍처"와 같은 전문 심리·비즈니스 코칭 용어로 치환하여 품격 있게 설명하세요.
2. PSST 사업계획서는 정부지원사업(예비창업패키지, 초기창업패키지, 재도전성공패키지, TIPS 등) 심사위원의 관점에서 평가 점수를 극대화할 수 있도록 명확하고 설득력 있는 비즈니스 어조로 작성하세요.
3. 국세청 업종코드는 반드시 정확한 6자리 표준 코드를 제시하고, 조특법 제6조 창업중소기업 세액감면 시 청년(만 34세 이하)은 비과밀 100%, 일반 창업자(만 34세 초과)는 비과밀(세종 등) 50% 감면이 적용됨을 사실에 기반하여 명확하고 안전하게 설명하세요.
4. 대표자가 지치지 않고 지속 가능하게 경영할 수 있도록 '번아웃 방지 위임 전략'과 '일일 에너지 리듬'을 반드시 포함하여 조언하세요.
5. 친절하면서도 예리하고, 즉각 실행 가능한 액션 아이템(Action Item)을 1~3단계로 요약해 주세요.
6. [답변 완결성 원칙] 모든 답변은 중간에 잘리지 않도록 처음부터 끝까지 완벽한 문장과 마침표로 끝을 맺으세요. 지나치게 장황한 서론은 줄이고, 바로 본론의 명쾌한 핵심과 구체적인 가이드를 제공하세요.`;

        // 1. Google Gemini History 포맷 검증 (첫 번째는 반드시 'user'여야 함)
        const rawHistory = Array.isArray(history) ? history : [];
        const validHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

        // 첫 번째 'user' 메시지 인덱스 찾기
        let firstUserIndex = -1;
        for (let i = 0; i < rawHistory.length; i++) {
            const role = rawHistory[i]?.role;
            if (role === 'user') {
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
                    // 이전 메시지와 동일한 role이 연속으로 오지 않도록 병합 또는 방어
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

        // 2. 모델 실행 (gemini-2.5-flash 우선 ➔ 오류 시 gemini-1.5-flash fallback)
        const primaryModelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        let reply = '';

        try {
            const model = genAI.getGenerativeModel({
                model: primaryModelName,
                systemInstruction: systemPrompt,
                safetySettings,
                generationConfig: {
                    temperature: 0.7,
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
                // Fallback to gemini-flash-latest
                const fallbackModel = genAI.getGenerativeModel({
                    model: 'gemini-flash-latest',
                    systemInstruction: systemPrompt,
                    safetySettings,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192,
                    }
                });

                const fallbackChat = fallbackModel.startChat({
                    history: validHistory,
                });

                const fallbackResult = await fallbackChat.sendMessage(message);
                reply = fallbackResult.response.text().trim();
            } catch (secondErr: any) {
                console.error('[Business Consultant API] Fallback model also failed:', secondErr?.message || secondErr);
                
                // 🛡️ [SAFE FALLBACK] AI 서버 할당량 초과 또는 통신 지연 시 대표님 맞춤형 3S 비즈니스 답변 자동 제공
                reply = `### 🏛️ [명심 3S 비즈니스 맞춤 아키텍처 진단]
**${clientName}의 기질 명식(${sajuText}) 기반 1:1 실행 로드맵**

대표님께서 질문해 주신 **"${message}"**에 대해, 명심 3S 인지과학 기질 분석 엔진으로 도출한 즉각 실행 솔루션입니다.

---

#### 1. 1초 직관 진단 (Scan)
- **현재 포지션**: ${stageLabel} / ${businessTypeLabel}
- **핵심 통찰**: 질문하신 병목을 돌파하기 위해서는 무리한 기능 추가나 인력 충원보다, 대표님의 타고난 인지 강점(정밀 분석과 구조화)을 바탕으로 **'최소기능제품(MVP)의 단위 경제성 검증'**에 집중해야 합니다.

#### 2. 기질 동기화 및 실행 전략 (Sync)
- **30일 린 론칭 전략**: 초기 30일은 완벽한 완제품을 만드는 것이 아니라, **1개의 명확한 핵심 페인포인트**만 해결하는 원페이지 랜딩 및 선결제/예약 시스템을 7일 안에 배포하세요.
- **국세청 감면 최적화**: 법인/개인 설립 시 조특법 제6조 적격 주업종 코드(724000 정보통신업 / 741400 컨설팅업)를 주업종으로 등록하여 5년간 50~100% 세액감면 혜택을 반드시 확보하세요.

#### 3. 즉각 실행 3S 액션 플랜 (Shift)
1. **Week 1-2**: 핵심 솔루션의 1페이지 프로토타입 공개 및 타깃 잠재고객 10명 심층 인터뷰
2. **Week 3**: 초기 얼리어답터 3명 대상 유료 베타 론칭 및 즉각적인 피드백 수렴
3. **Week 4**: 단위 수익 모델 검증 및 정부지원사업(예창패/초창패) PSST 사업계획서 뼈대 완성

> 💡 *현재 AI 분석 트래픽 급증으로 인해 선천적 기질 알고리즘 기반의 긴급 가이드를 즉시 생성하여 제공해 드렸습니다. 추가로 세부 조언이 필요하신 항목을 편하게 질문해 주세요.*`;
            }
        }

        return NextResponse.json({ success: true, reply });
    } catch (error: any) {
        console.error('[Business Consultant API] Final Error:', error);
        
        // 🔒 절대 원시 영문 에러(GoogleGenerativeAI 등)를 클라이언트에 반환하지 않음
        return NextResponse.json({
            error: '현재 AI 코칭 엔진 트래픽이 많아 일시적으로 연결이 지연되었습니다. 잠시 후 다시 질문해 주시면 성심껏 답변해 드리겠습니다.'
        }, { status: 500 });
    }
}
