// server-only import removed for type safety in client components

export interface UserSoulProfile {
    name?: string; // [Added] 사용자 이름
    // 1. 기질 데이터 (Nativity / Saju)
    nativity: {
        birth_date: string;       // 생년월일
        birth_time: string;       // 태어난 시간
        dayMaster: string;        // 일간 (본질, 예: 'Gap-Wood')
        traits_summary: string;   // 기질 요약 (예: '창의적이나 마무리가 약함')
        wealth_luck?: string;     // [Additional] 재물운 데이터 (PromptEngine 사용)

        // [Scientific Saju] 정밀 만세력 데이터
        saju_characters?: {
            year: string;
            month: string;
            day: string;
            hour: string;
        };

        // [대운 정보]
        current_luck_cycle?: {
            name: string;         // 예: 갑자 대운
            season: string;       // 예: 겨울
            mission_summary?: string;
        };

        // [★ 필수] 이 부분이 정의되어 있어야 PromptEngine에서 에러가 안 납니다.
        current_yearly_luck?: {
            year: string;         // 예: 2025
            element: string;      // 예: 을사(푸른 뱀)
            ten_god_type: string; // 예: 식신
            action_guide: string; // 예: 창조적 활동
            interaction?: string; // 예: 충/합
        };
    };

    // 2. 심리 데이터 (Psychology)
    psych_profile?: {
        risk_factors?: {
            primary: string;        // 주요 스트레스 요인
        };
        mbti?: string;            // (선택) 보조 지표
    };

    // 3. 통합 데이터 (선택)
    fusion_traits?: {
        fusion_insight: string;   // 사주+심리 통합 소견
    };
}
