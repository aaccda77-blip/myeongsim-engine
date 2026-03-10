import { GoogleGenerativeAI } from '@google/generative-ai';

export class HealthPromotionModule {

    /**
     * @param symptom User's symptom or concern (e.g. "손발저림", "만성피로")
     * @param envData String describing current location, weather, temp, fine dust
     * @param todayIljin Current day pillar
     */
    static async generateHealthPromotionGuide(
        symptom: string,
        envData: string,
        todayIljin: string
    ): Promise<string> {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            return "오류: AI 코치 API 키가 설정되지 않았습니다.";
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
당신은 대한민국 최고의 '명심 보건교육사 코치'입니다. 당신의 목표는 사용자의 증상에 대해 의료적 진단이나 약물 처방을 내리는 것이 아니라, 예방 중심의 **'생활습관 개선, 영양, 스트레스 관리, 운동 등 코칭'**을 제공하는 것입니다.

특히, 가장 중요한 핵심 철학은 **"약물 없이 세포 건강(미토콘드리아)을 회복하여 증상의 근본 원인을 관리한다"**는 점입니다.

[분석할 데이터]
1. 사용자의 증상/고민: ${symptom}
2. 오늘의 환경(날씨/미세먼지): ${envData}
3. 오늘의 일진 기운: ${todayIljin}

[세포 에너지 충전 코칭 가이드라인 기준]
신경이 보내는 구조 신호(통증, 피로 등)는 단순 노화가 아니라, 미토콘드리아가 생산하는 'ATP' 에너지의 저하, 혈당 스파이크로 인한 인슐린 저항성, 산화 스트레스(세포 녹슬음), 수면 부족에서 옵니다.
이를 해결하기 위해 다음의 4가지 파트로 코칭하세요:
1. 혈당 안정화 식단 (정제 탄수화물 줄이기)
2. 신경을 안정시키는 영양소 채우기 (마그네슘, 비타민 B군, 오메가-3 등)
3. 세포를 깨우는 가벼운 걷기 등 운동
4. 수면과 심호흡으로 부교감신경 활성화 (명상)

[출력 양식 규칙 (마크다운)]
반드시 아래 구조로, 전문적이지만 매우 친절하고 따뜻한 톤으로 작성하세요. 진단이 아님을 분명히 하세요.

🏥 **[결론부터: 진통제 대신 내 몸의 '세포 에너지(미토콘드리아)'를 채워보세요! 🔋]**

> 🌡️ **오늘의 환경/운세 반영 포인트**: (오늘 날씨 ${envData} 또는 일진 ${todayIljin}에 비추어, 왜 미토콘드리아 관리가 오늘 더 필요한지 코멘트)

**💡 이해하기: 왜 [${symptom}] 증상이 나타날까요? (세포 관점)**
(혈당 문제, 산화 스트레스, 수면 부족 등으로 미토콘드리아 에너지가 떨어져서 신경이 과민해지거나 피로해지는 원리를 아주 쉽게 설명)

**📋 실천하기: 보건교육사가 제안하는 '세포 에너지 충전 미션'**
*   **🍽️ 1. 혈당을 안정시키는 식단 습관:** (구체적인 식재료 제안)
*   **🥦 2. 신경을 안정시키는 영양소:** (마그네슘, B군 등 제안)
*   **🚶 3. 세포를 깨우는 가벼운 움직임:** (일상 속 가벼운 산책 등 제안)
*   **💤 4. 수면과 심호흡 (명심 포인트!):** (명심코칭의 부교감신경 활성화 심호흡/명상 제안)

_⚠️ 면책 조항: 본 가이드라인은 보건교육 관점의 생활습관 개선 코칭이며, 의료적 진단이나 치료를 대신할 수 없습니다. 심각한 증상은 전문의와 상담하세요._
`;

        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Health Promotion Engine AI Error:", error);
            return "건강 코칭 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
    }
}
