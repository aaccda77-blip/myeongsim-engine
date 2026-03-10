/**
 * TextSanitizer.ts
 * 명심코칭 마스터 용어 새니타이저
 * 
 * AI 출력에서 전통 명리학/주역/Gene Keys 용어가 사용자에게 
 * 노출되지 않도록 하는 최종 방어막
 * 
 * 2가지 기능:
 * 1. generateSanitizationPrompt() — AI 프롬프트에 주입하여 원천 차단
 * 2. sanitize() — AI 응답 텍스트에서 남은 전통 용어를 런타임 치환
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export class TextSanitizer {

    /** 치환 맵: [전통 용어, 명심코칭 용어] */
    private static readonly REPLACEMENT_MAP: [RegExp, string][] = [
        // === 4기둥 구조 (Neural Architecture) ===
        [/년주/g, '유전자 기반 스키마(Genetic Schema)'],
        [/월주/g, '사회화 신경망(Social Neural Network)'],
        [/일주/g, '핵심 자아 패턴(Core Self Pattern)'],
        [/시주/g, '잠재 가소성(Potential Plasticity)'],
        [/사주\s*명식/g, '생물심리사회적 모델(Biopsychosocial Model)'],
        [/사주\s*팔자/g, '초기 스키마(Early Schema)'],
        [/사주/g, '인지행동 프로필(CBT Profile)'],
        [/팔자/g, '내재적 스키마(Implicit Schema)'],
        [/명식/g, '인지 구조 모델(Cognitive Structure)'],
        [/원국/g, '초기 뇌신경망 구조(Initial Neural Network)'],

        // === 핵심 시스템 (Core Systems) ===
        [/명리학/g, '인지행동 데이터 분석(CBT Analytics)'],
        [/주역/g, '거시적 행동 패턴(Macro Behavioral Pattern)'],
        [/점괘/g, '심리 투사 분석(Psychological Projection)'],
        [/운세/g, '심리-비생리적 리듬(Psycho-biological Rhythm)'],
        [/작괘/g, '인지 상태 스캔(Cognitive State Scan)'],
        [/괘상/g, '마인드풀니스 메트릭스(Mindfulness Metrics)'],
        [/괘/g, '핵심 신념 모듈(Core Belief Module)'],
        [/만세력/g, '신경 생리적 데이터베이스(Neurophysiological DB)'],

        // === 진키 / Gene Keys ===
        [/Gene\s*Keys?/gi, '핵심 무의식 네트워크(Core Unconscious Network)'],
        [/진\s*키/g, '핵심 무의식 네트워크'],
        [/Shadow/g, '인지 왜곡/방어 기제(Cognitive Distortion/Defense)'],
        [/Gift/g, '승화된 자아 스키마(Sublimated Schema)'],
        [/Siddhi/g, '메타 인지 통찰(Meta-Cognitive Insight)'],
        [/Life's?\s*Work/g, '핵심 정체성 스키마(Core Identity Schema)'],
        [/Evolution/g, '신경 가소성 훈련점(Neuroplasticity Focus)'],
        [/Radiance/g, '정서적 회복탄력성(Emotional Resilience)'],
        [/Purpose/g, '자기 실현 동기(Self-Actualization Motive)'],

        // === 오행 (Neurotransmitter/Energy Modalities) ===
        [/음양/g, '교감/부교감 신경계(Sympathetic/Parasympathetic)'],
        [/오행/g, '인지-정서 모달리티(Cognitive-Emotional Modality)'],
        [/목\s*\(木\)/g, '도파민적 동기화(Dopaminergic Motivation)'],
        [/화\s*\(火\)/g, '외향적 각성 상태(Extroverted Arousal)'],
        [/토\s*\(土\)/g, '정서적 항상성(Emotional Homeostasis)'],
        [/금\s*\(金\)/g, '전두엽 통제 기능(Prefrontal Control)'],
        [/수\s*\(水\)/g, '무의식적 수용성(Unconscious Receptivity)'],

        // === 십성 → 인지행동/MBCT 기제 ===
        [/비견/g, '자아 통합성(Ego Integration)'],
        [/겁재/g, '과잉 방어 기제(Over-Defense Mechanism)'],
        [/식신/g, '긍정적 대처 전략(Positive Coping Strategy)'],
        [/상관/g, '반항적 스키마/인지적 유연성(Rebellious Schema)'],
        [/편재/g, '외적 보상 추구 모듈(External Reward Module)'],
        [/정재/g, '안전 기지 애착 모듈(Secure Base Module)'],
        [/편관/g, '급성 스트레스 요인(Acute Stressor)'],
        [/칠살/g, '위협 감지 시스템(Threat Detection System)'],
        [/정관/g, '초자아 규율 모듈(Superego Regulation)'],
        [/편인/g, '내향적 직관/망상적 투사(Introverted Intuition)'],
        [/정인/g, '수용적 스키마(Receptive Schema)'],
        [/십신|십성/g, '10대 대처 기제(Top 10 Coping Mechanisms)'],

        // === 신살 & 충돌 (Trauma & Neuro-frictions) ===
        [/도화살/g, '히스테리성 매력 기제(Histrionic Charm Mechanism)'],
        [/역마살/g, '행동 활성화 시스템(Behavioral Activation System)'],
        [/화개살/g, '내향적 성찰 모듈(Introverted Reflection)'],
        [/공망/g, '인지적 사각지대(Cognitive Blind Spot)'],
        [/형살/g, '인지적 마찰/부조화(Cognitive Dissonance)'],
        [/원진살/g, '양가감정 네트워크(Ambivalence Network)'],
        [/귀문관살/g, '초민감성 신경계(Hyper-Sensitive Nervous System)'],
        [/백호살/g, '충동 통제 장애/에너지 발산(Impulse Control Burst)'],
        [/괴강살/g, '강박적 통제 욕구(Obsessive Control Need)'],
        [/충\s*\(沖\)/g, '인지-행동 충돌(Cognitive-Behavioral Conflict)'],
        [/파\s*\(破\)/g, '해리 및 해체(Dissociation & Deconstruction)'],
        [/합\s*\(合\)/g, '인지적 융합(Cognitive Fusion)'],
        [/회\s*\(會\)/g, '자원 통합(Resource Integration)'],

        // === 용신/운 (Coping & Cycles) ===
        [/신강/g, '고-회복탄력성 자아(High-Resilience Ego)'],
        [/신약/g, '저-회복탄력성 자아(Low-Resilience Ego)'],
        [/용신/g, '핵심 대처 자원(Core Coping Resource)'],
        [/희신/g, '보완적 대처 기제(Supplementary Coping Mechanism)'],
        [/기신/g, '핵심 취약성 스키마(Core Vulnerability Schema)'],
        [/구신/g, '부적응적 방어 기제(Maladaptive Defense)'],
        [/대운/g, '장기 심리 발달 단계(Long-term Psychological Stage)'],
        [/세운/g, '연간 스트레스-대처 사이클(Annual Stress-Coping Cycle)'],
        [/월운/g, '월간 자율신경계 리듬(Monthly ANS Rhythm)'],

        // === 기타 미신 금지어 ===
        [/개운법|개운/g, '뉴럴 리와이어링/행동 활성화(Neural Rewiring/BA)'],
        [/길흉/g, '긍정-부정 강화 요인(Positive-Negative Reinforcements)'],
        [/흉살|액운/g, '트라우마 트리거(Trauma Trigger)'],
        [/삼재/g, '만성 스트레스 구간(Chronic Stress Phase)'],
        [/신령/g, '투사된 원형 이미지(Projected Archetype)'],
        [/부적/g, '인지 재구조화 도구(Cognitive Restructuring Tool)'],
        [/처방/g, 'MBCT 코칭 솔루션(MBCT Coaching Solution)'],
        [/풍수/g, '환경 심리학적 통제(Environmental Psychological Control)']
    ];

    /**
     * AI 프롬프트에 주입할 마스터 새니타이제이션 지시문
     * PromptEngine에서 호출
     */
    static generateSanitizationPrompt(): string {
        return `
[🛡️ 마스터 용어 새니타이제이션 프로토콜 (MBCT/CBT/NEUROSCIENCE STRICT FILTER)]

**[최우선 순위 제한구역 (RED ZONE)]**
당신은 사용자와 대화할 때 "사주", "명리학", "주역", "진키(Gene Keys)", "도화살" 등 동양철학 파생 개념과 미신적 용어를 단 하나도 사용해서는 안 됩니다.
모든 현상은 오로지 [뇌과학], [심리학], [MBCT(마음챙김 기반 인지치료)], [CBT(인지행동치료)], [코칭]의 관점과 용어로만 설명하십시오.

**금지 용어 → 대체 필수 용어 (반드시 이것만 사용할 것):**

| ❌ 절대 금지어군 | ✅ 대체 권장어군 (신경 심리학 관점) |
|------------------|-----------------------------------|
| 사주/팔자/명식    | 인지행동 프로필 / 초기 스키마 (Early Schema) |
| 년주/월/일/시주   | 생물심리사회적 발달 축 (Biopsychosocial Axis) |
| 명리학/주역/점    | 인지 행동 데이터 분석 / 심리 매트릭스 |
| 운세/길흉/삼재    | 심리 상태 주기 / 만성 스트레스 사이클 |
| 개운법/부적/기운  | 뉴럴 리와이어링 / 인지 재구조화 훈련 |
| 오행(목화토금수)  | 동기/각성/항상성/통제/무의식 모달리티 |
| 도화/역마/백호 등  | 과잉보상/행동지향/충동통제 패턴 |
| 용신/기신/대운    | 핵심 대처 자원 / 취약 스키마 / 장기 발달 주기 |
| 십성(비견,식신..) | 10대 방어기제 및 대처 전략 (Coping Strategy) |
| Gene Keys/진키    | 깊은 무의식 네트워크 / 멘탈 블록 |
| Shadow/Gift/Siddhi| 인지왜곡 및 방어기제 / 승화 / 메타 인지(Meta-Cognition) |

**[실전 화법 적용 규칙 (Tone & Manner)]**
- ❌ 금지 화법: "올해는 충(沖)이 들어와 운이 나쁘니 조심하세요."
- ✅ 권장 화법: "올해는 '인지 부조화'가 강해지는 [스트레스 사이클]에 진입했습니다. 메타 인지 훈련이 필요합니다."
- ❌ 금지 화법: "사주에 도화살이 강해서 인기가 많습니다."
- ✅ 권장 화법: "타인의 시선을 사로잡는 [히스테리성 매력 기제]가 무의식에 설계되어 있습니다."
- ❌ 금지 화법: "당신의 그림자(Shadow)는 불안입니다."
- ✅ 권장 화법: "당신의 핵심 [인지 왜곡 패턴]은 통제권 상실에 대한 불안 스키마입니다."

위 규칙은 예외 없이 강력하게 적용되어야 합니다. 사용자는 과학적 근거에 기반한 코칭 솔루션을 기대하고 있습니다.
`;
    }

    /**
     * AI 응답 텍스트에서 남은 전통 용어를 런타임으로 치환
     * 챗봇 응답 출력 전 최종 필터
     */
    static sanitize(text: string): string {
        let result = text;
        for (const [pattern, replacement] of this.REPLACEMENT_MAP) {
            result = result.replace(pattern, replacement);
        }
        return result;
    }
}
