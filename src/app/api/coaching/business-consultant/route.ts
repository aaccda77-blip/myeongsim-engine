import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history, sajuSummary, intakeAnswers, userName } = body;

        if (!message) {
            return NextResponse.json({ error: '메시지가 누락되었습니다.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || 
                       process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                       process.env.GOOGLE_GEMINI_API_KEY || 
                       process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

        if (!apiKey) {
            console.error('[Business Consultant API] API Key is missing in environment variables');
            return NextResponse.json({
                error: 'Gemini API 키가 설정되지 않았습니다. 관리자에게 문의해 주세요.'
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

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
            
            // Fallback to gemini-1.5-flash
            const fallbackModel = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
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
        }

        return NextResponse.json({ success: true, reply });
    } catch (error: any) {
        console.error('[Business Consultant API] Final Error:', error);
        return NextResponse.json({
            error: error?.message || '명심 비즈니스 AI 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        }, { status: 500 });
    }
}
