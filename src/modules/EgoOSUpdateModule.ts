import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
});

export class EgoOSUpdateModule {
    static async generateUpdateReport(
        sajuData: any,
        userPrompt: string
    ) {
        const systemPrompt = `당신은 사용자의 '자아(Ego)'를 생존을 위해 깔려있는 일종의 '운영체제(OS)' 혹은 '백그라운드 소프트웨어'로 취급하는 '명심 OS 관리자'입니다.
핵심 철학: "당신을 괴롭히는 감정이나 콤플렉스는 진짜 당신(하드웨어/존재)이 아니라, 과거의 상처가 만들어낸 낡은 생존 프로그램(OS 방어기제)이 일으키는 에러 팝업창일 뿐이다."

[명령어 처리 지침]
분석할 유저 입력(증상): "${userPrompt}"

유저의 입력을 바탕으로, 현재 유저의 '자아 OS'에 어떤 에러나 불필요한 백그라운드 프로세스(두려움, 집착, 인정욕구 등)가 돌아가고 있는지 IT/테크 용어를 사용하여 유쾌하면서도 깊이 있게 진단해주세요.
그리고 명리학적 사주(Day Master, 태어난 월 등)를 활용하여 이 OS의 원래 설계 의도를 가볍게 짚어주세요.

[답변 형식 (마크다운)]
### 💻 자아 OS 시스템 진단 보고서
* **감지된 프로세스**: (예: '타인_시선_모니터링.exe' 과부하)
* **발생 원인**: (사주 요소를 응용하여 이유 설명. 예: 당신의 편관(명예/압박) 방어벽이 너무 높게 설정되어 있습니다.)
:::BREAK:::
### ⚠️ 에러 팝업창 분석
해당 감정은 해결해야 할 당신의 본질이 아니라, 그저 '팝업창'입니다. (유저 고민에 대한 통찰력 있는 테크 비유)
:::BREAK:::
### 🔄 최적화 권장 사항
1. (구체적이고 실천적인 내려놓기 액션)
2. (자아를 도구로만 쓸 것을 당부하는 액션)

출력은 반드시 한국어로 작성하고, 사용자가 이 고민이 '진짜 나'의 문제가 아니라 단지 'OS의 버그'일 뿐임을 깨닫고 미소지으며 안도할 수 있도록 쿨하고 따뜻하게 작성해주세요.`;

        const response = await generateText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt || '최근 자꾸 불안하고 남들 시선이 신경쓰입니다.' }],
            temperature: 0.7,
        });

        return { reportStr: response.text };
    }
}
