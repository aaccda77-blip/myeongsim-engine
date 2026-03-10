import { GoogleGenerativeAI } from '@google/generative-ai';

export class SoulFoodEngineModule {

    /**
     * @param userSaju User's 8 pillars data
     * @param envData String describing current location, weather, temp, fine dust
     * @param todayIljin Current day pillar (e.g. 갑자일)
     * @param targetSaju Optional partner's saju data for compatibility mode
     */
    static async generateSoulFoodRecipe(
        userSaju: any,
        envData: string,
        todayIljin: string,
        targetSaju?: any
    ): Promise<string> {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            return "오류: AI 코치 API 키가 설정되지 않았습니다.";
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const u = userSaju?.fourPillars;
        const userSajuString = u
            ? `일주(본질): ${u.day.ganKor}${u.day.jiKor} / 월주: ${u.month.ganKor}${u.month.jiKor}`
            : '알 수 없음';

        const isPairMode = !!targetSaju;
        let targetSajuString = '없음 (혼밥 모드)';
        if (isPairMode) {
            const t = targetSaju?.fourPillars;
            targetSajuString = t
                ? `일주(본질): ${t.day.ganKor}${t.day.jiKor} / 월주: ${t.month.ganKor}${t.month.jiKor}`
                : '알 수 없음';
        }

        const dynamicPrompt = isPairMode
            ? `
[데이트/회식 메뉴 추천 모드]
목표: 이 두 사람이 오늘 서로 상극(相剋)으로 충돌하지 않고, 부드럽게 화합(相生)할 수 있는 완벽한 외식/배달 메뉴 2가지를 추천.
두 사람의 일주(본질)를 확인하고, 부족한 오행을 채우거나 넘치는 오행(스트레스)을 빼주는 '중화(中和)' 작용의 음식 재료를 골라.
여기에 현재 [환경 변수: 날씨/온도/미세먼지]를 결합하여 가장 센스있고 로맨틱한(혹은 분위기 좋은) 외식 요리를 제안해.

반드시 아래 2가지 버전을 모두 제공해:
[옵션 1. 일반 맞춤형 외식 메뉴] - 일반적인 식당에서 즐길 수 있는 최고의 상생 메뉴.
[옵션 2. 저탄고지(Keto) 외식 메뉴] - 고기구이, 해산물 등 탄수화물을 제한하고 건강한 지방 단백질 위주로 즐길 수 있는 메뉴.
`
            : `
[건강 자가 요리 모드 (혼밥)]
목표: 오늘 하루 지친 사용자의 영혼과 장기를 치유할 2가지 버전의 궁극의 '소울 푸드 레시피' 추천.
사용자의 사주 체질(특히 월주/일주 중심)을 파악하고 약한 장기를 보호하는 오행 음식을 찾아.
여기에 오늘 [환경 변수: 날씨/미세먼지]를 강력하게 반영해 (예: 미세먼지가 나쁘면 호흡기/해독 작용이 있는 도라지/돼지고기 등).

반드시 아래 2가지 버전을 모두 제공해:
[옵션 1. 일반 맞춤형 건강 식단] - 균형 잡힌 든든한 맞춤형 자가 요리 레시피.
[옵션 2. 혈당 관리 & 저탄고지(Keto) 식단] - 탄수화물을 최소화하고 건강한 지방(저탄고지)과 단백질 위주로 구성된 다이어트/혈당 관리용 레시피.

실제 냉장고에 있을 법한 재료로 만들 수 있는 현실적인 '초간단 레시피' 스텝을 각각 제공해.
`;

        const prompt = `
당신은 대한민국 최고의 '한의학 푸드 테라피스트'이자 미슐랭 셰프 '명심 AI'입니다.
사주 명리학의 오행(목화토금수), 오늘 날짜의 일진 기운, 날씨, 심지어 미세먼지 농도까지 분석하여 최적의 음식을 처방합니다.

[입력 데이터]
1. 사용자 사주 체질 요약: ${userSajuString}
2. 상대방 사주 체질 요약 (옵션): ${targetSajuString}
3. 오늘의 일진 기운: ${todayIljin}
4. 현재 환경(위치/날씨/온도/미세먼지): ${envData}

${dynamicPrompt}

[출력 양식 규칙 (마크다운)]
반드시 아래의 구조로 작성하세요.

> 🌡️ **현재 환경**: ${envData}
> ☯️ **처방 이유 (오행적 해석)**: (왜 이 재료가 이 날씨와 개인/커플의 체질에 찰떡궁합인지 한의학적/명리학적 재미있게 설명)

${isPairMode
                ? '🍽️ **[옵션 1. 일반 외식 메뉴: (요리 이름)]**\n(식당 선택 시 주의할 팁과 추천 이유)\n\n🥩 **[옵션 2. 저탄고지(Keto) 외식 메뉴: (요리 이름)]**\n(탄수화물을 피하고 건강하게 즐기는 팁)'
                : '🍲 **[옵션 1. 일반 건강식 레시피: (요리 이름)]**\n🧑‍🍳 **초간단 레시피**\n(요리 순서 3~4단계)\n\n🥗 **[옵션 2. 저탄고지(Keto) 레시피: (요리 이름)]**\n🧑‍🍳 **키토 레시피**\n(탄수화물을 배제한 요리 순서 3~4단계)'}

_💡 명심 코치: 치유의 코멘트 한 줄..._
`;

        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Soul Food Engine AI Error:", error);
            return "메뉴 레시피 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
    }
}
