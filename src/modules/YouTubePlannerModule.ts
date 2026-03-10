import { GoogleGenerativeAI } from '@google/generative-ai';

export class YouTubePlannerModule {

    /**
     * @param topic User's requested YouTube topic or keywords
     * @param userSaju User's 8 pillars data to generate a personalized hook/content
     * @param todayIljin Current day pillar
     */
    static async generateYouTubePlan(
        topic: string,
        userSaju: any,
        todayIljin: string
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

        const prompt = `
당신은 대한민국 최고의 'AI 유튜브 기획자'이자 '명심 코치'입니다. 당신은 사용자가 입력한 기획/주제를 바탕으로, 유튜브 조회수가 폭발할 수 있는 후킹(Hooking) 중심의 콘텐츠 기획안을 모듈식으로 생성합니다.

명심 코치 특유의 '뼈 때리는 현실 감각'과 '따뜻한 통찰력'을 더해서 콘텐츠를 기획해야 합니다.

[기획 데이터]
1. 사용자가 원하는 영상 주제/키워드: ${topic}
2. 사용자 사주 체질 요약 (크리에이터의 에너지): ${userSajuString}
3. 오늘의 기운(일진): ${todayIljin}

[요청 사항]
사용자의 사주 체질과 오늘의 기운을 참고하여, 해당 주제(${topic})를 가장 매력적으로 다룰 수 있는 유튜브 기획안을 다음 3가지 파트로 나누어 출력하세요.

1. **[클릭률 폭발! 기운 기반 타이틀 3선]**
   - 시청자의 호기심을 극대화하고, 심리적인 결핍을 건드려 무조건 클릭하게 만드는 제목 3개를 제안하세요. (과장이나 어그로가 아닌, 인사이트 기반의 후킹)

2. **[명심 톤앤매너 오프닝 스크립트 초안]**
   - 영상의 첫 30초 오프닝 대본입니다. 명심 코치 특유의 "따뜻한 팩트 폭행" 톤 앤 매너로 시청자의 뼈를 때리며 시작해서 위로와 통찰로 이어지는 나레이션 대본을 작성하세요.

3. **[시선을 끄는 썸네일 기획안]**
   - 썸네일에 들어갈 '대문짝만 한 텍스트 카피' 1개
   - AI(Midjourney 등)로 생성하거나 직접 촬영할 때 참고할 수 있는 썸네일 이미지/디자인 구도(표정, 오브젝트, 색상 톤) 묘사

[출력 양식 규칙 (마크다운)]
매우 프로페셔널하고, 당장이라도 영상을 만들고 싶어지도록 동기를 부여하는 톤으로 아래 구조에 맞춰 작성하세요.

🎬 **[명심 튜브 기획: ${topic}]**

> 🔮 **크리에이터 에너지 분석**: (오늘 일진 ${todayIljin}와 크리에이터 사주 체질에 비추어, 이 주제를 "어떤 태도/느낌"으로 말해야 조회수가 터질지 조언)

🔥 **1. 하이퍼 후킹 제목 3선 (CTR 최적화)**
(제목 3가지 나열)

🗣️ **2. 명심 코치 스타일의 오프닝 스크립트 (첫 30초)**
(대사 형태의 스크립트 작성 - 지문 포함)

🖼️ **3. 썸네일 시각화 큐레이션**
*   **핵심 텍스트:** (썸네일용 아주 짧은 문구)
*   **디자인 구도:** (이미지 묘사)

_💡 명심 코치: 유튜브 알고리즘은 본질을 이길 수 없습니다. 자, 카메라를 켜보시죠!_
`;

        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("YouTube Planner Engine AI Error:", error);
            return "유튜브 콘텐츠 기획 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
    }
}
