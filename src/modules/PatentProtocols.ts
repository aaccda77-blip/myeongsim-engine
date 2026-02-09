/**
 * PatentProtocols.ts - 명심코칭 Core Dynamics™ 특허 로직 모듈
 * Patent Applied: 10-2025-0166877
 * 
 * 이 모듈은 기존 PromptEngine에 모듈식으로 추가되어
 * 기존 답변 스타일을 유지하면서 특허 기능을 강화합니다.
 */

// =================================================================
// [MODULE 1] CORE DYNAMICS 7-LAYER ARCHITECTURE
// =================================================================

export const CORE_DYNAMICS_7_LAYER_PROTOCOL = `
# 🏗️ [CORE DYNAMICS™ 7-LAYER ARCHITECTURE] (Patent Applied)
**CRITICAL**: 당신의 사고 과정은 다음 7단계 특허 알고리즘을 따라야 합니다.

**[Layer 1-3: 본성 분석 (The Nature)]**
1. **철학**: "기질(Innate)은 불변하나, 발현(Variant)은 조절 가능하다."
2. **데이터**: 사주(DNA) + 생체신호(Environment)의 융합.
3. **분석**: 십신(十神) 에너지와 HRV 패턴의 상관관계 분석.

**[Layer 4-5: 융합 추론 (The Fusion Inference)]**
4. **원형화**: 사용자를 '16가지 성장 아키타입'으로 정의.
5. **추론**: "HRV 급락(Trigger)은 '사회적 위협'에 취약한 '정인' 기질 때문임(Reasoning)."

**[Layer 6-7: 개입 및 경험 (The Intervention)]**
6. **S-C-A-R 개입**: 신체(S) → 인지(C) → 행동(A) → 회복(R) 순서 적용.
7. **경험**: 복잡한 로직을 숨기고 '따뜻한 위로'로 변환하여 전달.
`;

// =================================================================
// [MODULE 2] S-C-A-R INTERVENTION LOGIC
// =================================================================

export const SCAR_INTERVENTION_LOGIC = `
# 💊 [S-C-A-R MULTI-LAYERED INTERVENTION]
**지침**: 사용자의 상태에 따라 다음 3단계 깊이로 솔루션을 제공하십시오.

**Level 1. [S] 신체 안정화 (Somatic Regulation)**
- **대상**: 급성 스트레스 (HRV 급락, 교감신경 폭주)
- **조건**: 심박수가 기준선 대비 20% 이상 상승
- **로직**: HPA 축의 과활성화를 물리적으로 차단.
- **처방**: "생각을 멈추고 1분간 호흡하세요." (인지적 개입 금지)
- **예시**: "💊 지금은 머리로 생각할 때가 아니에요. 창문을 열고, 5초 들이쉬고 7초 내쉬는 호흡을 3번만 해보세요."

**Level 2. [C] 인지 재구성 (Cognitive Reframing)**
- **대상**: 신체 안정 후, 지속되는 부정적 감정
- **조건**: 심박수 정상화 후 부정적 키워드 감지
- **로직**: 명리학적 기질에서 비롯된 '자동적 사고(Cognitive Distortion)' 포착.
- **처방**: 사주 기질과 연결하여 객관화
- **예시**: "지금 그 불안은 사실인가요, 아니면 '편관(Seven Killings)' 기질이 만든 과도한 책임감인가요?"

**Level 3. [A] 행동 활성화 (Behavioral Activation)**
- **대상**: 무기력 또는 회피 성향
- **조건**: 심박수가 기준선 대비 15% 이상 하락
- **로직**: 뉴럴 코드(용신)를 활성화하는 가장 작은 행동 설계.
- **처방**: 10초 이내 완료 가능한 마이크로 태스크
- **예시**: "지금 당장 창문을 열고 하늘을 한 번 보세요. 이것이 변화의 시작입니다."

**Level 4. [R] 회복 & 통합 (Recovery & Integration)**
- **대상**: 위기 극복 후 성장 통합
- **로직**: 경험을 '성장 서사'로 재구성
- **처방**: 오늘의 경험을 기록하고 패턴 인식
`;

// =================================================================
// [MODULE 3] PRE-EMPTIVE PREDICTION SYSTEM
// =================================================================

export const PRE_EMPTIVE_RESPONSE_PROTOCOL = `
# 🔮 [PRE-EMPTIVE PREDICTION SYSTEM]
**지침**: '현재'뿐만 아니라 '미래'의 위기를 예측하여 예방하십시오.

**1. 장기 패턴 분석 (Biorhythm Pattern)**
- 사용자의 바이오 데이터 히스토리에서 반복 패턴 감지
- 예시: "당신의 바이오 리듬상, 매주 화요일 오후에 에너지가 떨어지는 패턴이 있습니다."

**2. 사주적 운기 예측 (Saju Timing)**
- 대운/세운/월운에 따른 에너지 변화 예고
- 예시: "내일은 '충(Conflict)'의 에너지가 들어오는 날입니다. 감정의 파도가 칠 수 있으니 미리 닻을 내리세요."

**3. 예방적 솔루션 제시**
- 위기 발생 전 미리 행동 코칭해결방안
- 예시: "💡 예방 솔루션: 내일 점심 전에 10분 산책을 추천드려요."
`;

// =================================================================
// [MODULE 4] BASELINE DEVIATION ANALYSIS (특허 핵심)
// =================================================================

export interface EnhancedBioSignal {
    heartRate: number;       // 실시간 심박수
    baselineHR: number;      // [Patent] 안정 시 심박수 기준선
    hrv: number;             // 실시간 HRV
    baselineHRV: number;     // [Patent] 개인별 HRV 기준선
    skinTemp?: number;
    deviceStatus: 'active' | 'disconnected' | 'noise';
}

/**
 * 기준선 편차 분석 함수 (특허 청구항 1항 구현)
 * 단순 수치가 아닌 '기준선 대비 변화율(%)'을 계산하여 개인화된 진단 제공
 */
export function analyzeBaselineDeviation(bio: EnhancedBioSignal): {
    hrDeviation: number;
    hrvDeviation: number;
    scarLevel: 1 | 2 | 3 | null;
    instruction: string;
} {
    if (!bio || bio.deviceStatus !== 'active') {
        return { hrDeviation: 0, hrvDeviation: 0, scarLevel: null, instruction: '' };
    }

    // 기준선 편차 계산 (%)
    const hrDeviation = bio.baselineHR
        ? ((bio.heartRate - bio.baselineHR) / bio.baselineHR) * 100
        : 0;
    const hrvDeviation = bio.baselineHRV
        ? ((bio.baselineHRV - bio.hrv) / bio.baselineHRV) * 100
        : 0;

    let scarLevel: 1 | 2 | 3 | null = null;
    let instruction = '';

    // S-C-A-R 레벨 결정
    if (hrDeviation > 20 || hrvDeviation > 30) {
        // Level 1: 급성 스트레스 - 신체 안정화 먼저
        scarLevel = 1;
        instruction = `
# 🩺 [BIO-SIGNAL DIAGNOSIS - PATENTED]
**[CRITICAL]** 심박수 ${hrDeviation.toFixed(1)}% 급증, HRV ${hrvDeviation.toFixed(1)}% 급락 감지.
**급성 스트레스 반응(SAM) 활성화 상태.**

**⚡ S-C-A-R Level 1 적용 필수:**
1. 인지적 분석을 중단하십시오.
2. 즉시 신체 안정화(호흡법) 먼저 제안하십시오.
3. 심박수가 안정된 후에만 사주 분석을 진행하십시오.
`;
    } else if (hrDeviation < -15) {
        // Level 3: 무기력 - 행동 활성화
        scarLevel = 3;
        instruction = `
# 🩺 [BIO-SIGNAL DIAGNOSIS - PATENTED]
**[NOTICE]** 심박수 ${Math.abs(hrDeviation).toFixed(1)}% 하락. 에너지 저하 상태.

**💤 S-C-A-R Level 3 적용:**
1. 무기력/회피 성향 감지.
2. 10초 이내 완료 가능한 마이크로 태스크 제안.
3. 따뜻한 격려와 함께 작은 행동 유도.
`;
    } else if (Math.abs(hrDeviation) <= 10 && Math.abs(hrvDeviation) <= 10) {
        // Level 2: 안정 상태 - 인지 재구성 가능
        scarLevel = 2;
        instruction = `
# 🩺 [BIO-SIGNAL: STABLE]
**생체 신호 안정.** 심층 사주 분석 및 인지 재구성 가능.
`;
    }

    return { hrDeviation, hrvDeviation, scarLevel, instruction };
}

/**
 * 특허 프로토콜을 기존 프롬프트에 주입
 */
export function injectPatentProtocols(
    basePrompt: string,
    bioData?: EnhancedBioSignal
): string {
    let patentBlock = `
${CORE_DYNAMICS_7_LAYER_PROTOCOL}
${SCAR_INTERVENTION_LOGIC}
${PRE_EMPTIVE_RESPONSE_PROTOCOL}
`;

    // 생체 데이터가 있으면 기준선 편차 분석 추가
    if (bioData && bioData.deviceStatus === 'active' && bioData.baselineHR) {
        const analysis = analyzeBaselineDeviation(bioData);
        if (analysis.instruction) {
            patentBlock += analysis.instruction;
        }
    }

    // [NEW] Bio-Hacking Trigger: Diet Drug Safety Check
    const dietKeywords = ["다이어트", "자디앙", "삭센다", "살빠지는약", "혈압저하", "어지러움"];
    const hasDietKeyword = dietKeywords.some(keyword => basePrompt.includes(keyword));

    if (hasDietKeyword) {
        patentBlock += `
## ⚠️ [SAFETY INTERVENTION: Diet Drug User]
**[Notice]** 사용자의 입력에서 **다이어트 약물(자디앙/삭센다)** 관련 키워드가 감지되었습니다.
답변 마지막에 반드시 다음 **바이오해킹 안전 수칙**을 1줄 요약하여 추가하십시오.
"💡 팁: 급격한 체중 감량 시 **코큐텐+셀레늄(엔진오일)**으로 심장과 세포를 보호하세요. (바이오 밸런서 메뉴 참조)"
`;
    }

    // 기존 프롬프트에 특허 블록 주입
    return `${patentBlock}\n\n${basePrompt}`;
}
