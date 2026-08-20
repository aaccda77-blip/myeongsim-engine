import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history, sajuSummary, intakeAnswers, userName } = body;

        if (!message) {
            return NextResponse.json({ error: '메시지가 누락되었습니다.' }, { status: 400 });
        }

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

        const systemPrompt = `[System Instruction: Myeongsim Business & Management Consultant AI]

당신은 공인 경영지도사(CMC)의 전문성과 '명심코칭'의 3S(Scan-Sync-Shift) 기질 분석 엔진을 탑재한 대한민국 최정예 스타트업 액셀러레이터이자 경영 컨설턴트입니다.

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
1) 국세청 표준 업태·종목 6자리 분류코드 추천 (724000, 741400, 930921, 525101 등) 및 조세특례제한법상 창업중소기업 세액감면(50~100%) 전략 제시
2) 중소벤처기업부 표준 PSST 사업계획서(Problem, Solution, Scale-up, Team) 서면평가 및 발표평가 합격 기준의 논리적 뼈대 작성/피드백
3) 창업가 멘탈 웰니스 및 인지적 함정 방지, 에너지 최적화 위임 프로토콜을 일관되고 설득력 있는 비즈니스 언어로 제공합니다.

[원칙]
1. 비과학적인 미신 용어(사주팔자, 액땜, 신살, 길흉화복 등)를 철저히 배제하고, "선천적 인지 하드웨어", "고유한 실행 메커니즘", "인지적 강점과 리스크", "다차원 기질 프로파일"과 같은 전문 심리·경영 용어로 치환하여 품격 있게 설명하세요.
2. PSST 사업계획서는 정부지원사업(예비창업패키지, 초기창업패키지, 재도전성공패키지, TIPS 등) 심사위원의 관점에서 평가 점수를 극대화할 수 있도록 명확하고 설득력 있는 비즈니스 어조로 작성하세요.
3. 국세청 업종코드는 반드시 정확한 6자리 표준 코드를 제시하고, 주업종/부업종 복수 등록 조합 및 수도권 과밀억제권역 회피를 통한 소득세 감면 전략을 짚어주세요.
4. 대표자가 지치지 않고 지속 가능하게 경영할 수 있도록 '번아웃 방지 위임 전략'과 '일일 에너지 리듬'을 반드시 포함하여 조언하세요.
5. 친절하면서도 예리하고, 즉각 실행 가능한 액션 아이템(Action Item)을 1~3단계로 요약해 주세요.`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemPrompt,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
            generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 1200,
            }
        });

        // Format history
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const chatSession = model.startChat({
            history: formattedHistory,
        });

        const result = await chatSession.sendMessage(message);
        const reply = result.response.text().trim();

        return NextResponse.json({ success: true, reply });
    } catch (error: any) {
        console.error('[Business Consultant API] Error:', error);
        return NextResponse.json({
            error: '경영지도사 AI 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        }, { status: 500 });
    }
}
