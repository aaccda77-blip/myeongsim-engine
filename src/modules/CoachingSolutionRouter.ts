/**
 * CoachingSolutionRouter.ts
 * 5대 코칭 솔루션 라우터
 * 
 * 사용자 상태에 따라 최적의 코칭 방법론을 자동 매칭
 * CBT/ACT/MBCT/MBSR/DBT 기반 코칭 솔루션 (치료가 아닌 코칭!)
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 * ⚠️ 법적 면책: 모든 솔루션은 '코칭'이며 '의료 행위'가 아님
 */

export interface CoachingSolution {
    id: string;
    name: string;
    nameEn: string;
    basis: string;
    targetState: string;
    triggerKeywords: string;
    protocol: string[];
    promptInstruction: string;
}

export class CoachingSolutionRouter {

    static readonly SOLUTIONS: CoachingSolution[] = [
        {
            id: 'COGNITIVE_REFRAME',
            name: '인지 리프레이밍 코칭',
            nameEn: 'Cognitive Reframe Coaching',
            basis: 'CBT(인지행동) 기반 셀프 코칭',
            targetState: '부정적 자동 사고, 인지 왜곡, 흑백 논리, 과잉 일반화',
            triggerKeywords: '항상|절대|못해|안돼|최악|망했|실패|바보|무능|쓸모없',
            protocol: [
                '1단계: 자동 사고 포착 — "지금 떠오른 생각을 그대로 적어보세요"',
                '2단계: 인지 왜곡 감별 — "이 생각에 혹시 과장이나 일반화가 포함되어 있나요?"',
                '3단계: 대안적 사고 — "같은 상황을 가장 친한 친구에게 설명한다면 뭐라고 하시겠어요?"',
                '4단계: 행동 실험 — "이 새로운 관점으로 내일 한 가지만 시도해 보시겠어요?"'
            ],
            promptInstruction: `사용자가 부정적 자동 사고(흑백 논리, 과잉 일반화, 재앙화)를 보이면:
1. 즉시 위로하지 말고, "그 생각을 한번 적어볼까요?"로 외현화 유도
2. "혹시 이 생각에 '항상/절대' 같은 극단적 표현이 있나요?"로 왜곡 감별
3. "가장 친한 친구가 같은 말을 했다면 뭐라고 해주시겠어요?"로 자기 연민 유도
4. 구체적 행동 실험 1가지 제안`
        },
        {
            id: 'VALUE_COMMITMENT',
            name: '가치 전념 코칭',
            nameEn: 'Value Commitment Coaching',
            basis: 'ACT(수용전념) 기반 셀프 코칭',
            targetState: '통제 불가능한 상황에 대한 집착, 회피 행동, 경험 회피',
            triggerKeywords: '바꿀수없|어쩔수없|운명|포기|도망|피하|참을수없|견딜수없',
            protocol: [
                '1단계: 개방 — "통제할 수 없는 것과 통제할 수 있는 것을 나눠보세요"',
                '2단계: 알아차림 — "이 감정이 있어도, 당신은 여전히 한 발을 내딛을 수 있습니다"',
                '3단계: 가치 탐색 — "이 상황에서 당신에게 정말 중요한 가치는 무엇인가요?"',
                '4단계: 전념 행동 — "그 가치에 맞는 작은 행동 1가지를 지금 약속해 보세요"'
            ],
            promptInstruction: `사용자가 통제 불가능한 상황에 집착하거나 회피하면:
1. 바꿀 수 있는 것(X축)과 바꿀 수 없는 것(Z축)을 분리하도록 안내
2. "이 감정을 없애려 하지 않아도 됩니다. 감정은 있되, 행동은 선택할 수 있습니다"
3. "지금 당신에게 가장 중요한 가치는 무엇인지" 탐색
4. 가치 기반 마이크로 행동 1가지 약속 유도`
        },
        {
            id: 'MINDFUL_AWARENESS',
            name: '마음챙김 인식 코칭',
            nameEn: 'Mindful Awareness Coaching',
            basis: 'MBCT(마음챙김인지) 기반 셀프 코칭',
            targetState: '반추 사고, 우울 루프, 과거 집착, 미래 불안',
            triggerKeywords: '계속생각|멈출수없|잠이안|되새김|후회|걱정|불안|우울|반복',
            protocol: [
                '1단계: 알아차림 — "지금 이 생각이 반복되고 있다는 것을 알아차리셨군요. 그것만으로 이미 한 발 나아간 겁니다"',
                '2단계: 현재 앵커링 — "지금 발바닥이 바닥에 닿는 느낌에 주의를 기울여 보세요"',
                '3단계: 생각 라벨링 — "그 생각에 이름을 붙여볼까요? \'걱정이 또 왔구나\' 하고"',
                '4단계: 부드러운 전환 — "그 생각을 구름처럼 흘려보내고, 지금 이 순간으로 돌아오세요"'
            ],
            promptInstruction: `사용자가 반추 사고나 과거 집착, 미래 불안을 보이면:
1. "지금 이 생각이 반복되고 있다는 걸 알아차리셨군요" — 메타인지 활성화
2. 감각 접지(grounding) 유도: 발바닥 느낌, 호흡 느낌 등 현재 감각으로 안내
3. "그 생각에 '걱정이 왔다'고 이름표를 붙여보세요" — 탈동일시
4. 절대 "생각하지 마세요"라고 하지 말 것. "흘려보내세요"로 유도`
        },
        {
            id: 'STRESS_REGULATION',
            name: '스트레스 조절 코칭',
            nameEn: 'Stress Regulation Coaching',
            basis: 'MBSR(스트레스 완화) 기반 셀프 코칭',
            targetState: '급성 스트레스, 분노 폭발, 신체 긴장, 과각성 상태',
            triggerKeywords: '화가|짜증|스트레스|긴장|두통|어깨|숨막|심장|떨려|폭발',
            protocol: [
                '1단계: 생체 신호 인식 — "지금 몸에서 어떤 신호가 오고 있나요? 어깨 긴장? 심박수 상승?"',
                '2단계: 호흡 조절 — "4초 들이쉬고, 7초 내쉬는 호흡을 3회 실시하세요"',
                '3단계: 바디 스캔 — "머리부터 발끝까지, 긴장된 곳을 찾아서 의도적으로 이완해 보세요"',
                '4단계: 안전 기지 — "지금 가장 안전하고 편안한 장소를 떠올려 보세요. 그곳에 있는 것처럼 느껴보세요"'
            ],
            promptInstruction: `사용자가 급성 스트레스, 분노, 신체 긴장을 표현하면:
1. 먼저 분석하지 말고, 즉시 신체 감각을 묻기: "지금 몸에서 어떤 신호가 느껴지나요?"
2. 4-7-8 호흡법 안내 (4초 흡입, 7초 유지, 8초 호출)
3. 간단한 바디 스캔 안내
4. 안전 기지(Safe Place) 시각화로 부교감신경 활성화`
        },
        {
            id: 'RELATIONSHIP_SKILL',
            name: '관계 기술 코칭',
            nameEn: 'Relationship Skill Coaching',
            basis: 'DBT(변증법적 행동) 기반 대인관계 코칭',
            targetState: '관계 갈등, 감정 조절 실패, 대인관계 패턴 반복',
            triggerKeywords: '싸움|이별|배신|갈등|화해|용서|관계|대인|소통|오해',
            protocol: [
                '1단계: 감정 인식 — "지금 이 관계에서 느끼는 감정을 정확히 이름 붙여 보세요"',
                '2단계: 상대 관점 — "상대방은 같은 상황을 어떻게 느끼고 있을까요?"',
                '3단계: 요구 표현 — "\'나-메시지\'로 바꿔볼까요? \'네가 ~해서 화나\' 대신 \'나는 ~할 때 ~하게 느껴\'"',
                '4단계: 경계 설정 — "이 관계에서 당신이 지켜야 할 선은 어디인가요?"'
            ],
            promptInstruction: `사용자가 관계 갈등이나 대인관계 문제를 표현하면:
1. 감정 라벨링: "지금 느끼는 감정을 정확히 뭐라고 표현할 수 있을까요?"
2. 역할 전환: "상대방의 입장에서 이 상황을 바라보면 어떨까요?"
3. 나-메시지(I-Message) 훈련: "너 때문에" → "나는 ~할 때 ~하게 느낀다"
4. 건강한 경계(Boundary) 설정 안내`
        },
    ];

    /** 사용자 메시지에서 최적 코칭 솔루션 감지 */
    static detectSolution(userMessage: string): CoachingSolution | null {
        for (const sol of this.SOLUTIONS) {
            const regex = new RegExp(sol.triggerKeywords, 'i');
            if (regex.test(userMessage)) return sol;
        }
        return null;
    }

    /** AI 프롬프트 주입용 코칭 솔루션 프로토콜 생성 */
    static generatePromptProtocol(): string {
        let protocol = `\n[💊 5대 코칭 솔루션 라우터 (Coaching Solution Router)]\n`;
        protocol += `**중요**: 아래는 '치료'가 아닌 '셀프 코칭 솔루션'입니다.\n`;
        protocol += `사용자의 상태에 따라 가장 적합한 코칭 방법론을 자동 선택하여 적용하십시오.\n`;
        protocol += `⚠️ 절대 '처방', '치료', '진단'이라는 단어를 사용하지 마십시오. '코칭', '솔루션', '훈련'만 사용.\n\n`;

        for (const sol of this.SOLUTIONS) {
            protocol += `### [${sol.id}] ${sol.name} (${sol.nameEn})\n`;
            protocol += `기반: ${sol.basis}\n`;
            protocol += `대상 상태: ${sol.targetState}\n`;
            protocol += `감지 키워드: ${sol.triggerKeywords.split('|').join(', ')}\n`;
            protocol += `**프로토콜:**\n`;
            for (const step of sol.protocol) {
                protocol += `  ${step}\n`;
            }
            protocol += `**AI 적용 지침:**\n${sol.promptInstruction}\n\n`;
        }

        protocol += `### [솔루션 선택 우선순위]\n`;
        protocol += `1. 신체 긴장/분노 감지 → **STRESS_REGULATION** 우선 (먼저 몸을 안정시켜야)\n`;
        protocol += `2. 반추/우울 감지 → **MINDFUL_AWARENESS** (현재로 돌아오기)\n`;
        protocol += `3. 부정적 자동 사고 → **COGNITIVE_REFRAME** (생각 바꾸기)\n`;
        protocol += `4. 통제 불가 집착 → **VALUE_COMMITMENT** (가치로 전환)\n`;
        protocol += `5. 관계 갈등 → **RELATIONSHIP_SKILL** (소통 기술)\n\n`;
        protocol += `**혼합 적용**: 상황에 따라 2개 이상의 솔루션을 순차적으로 적용할 수 있습니다.\n`;
        protocol += `예: 분노 폭발 → 먼저 STRESS_REGULATION(호흡) → 이후 COGNITIVE_REFRAME(생각 재구성)\n`;

        return protocol;
    }
}
