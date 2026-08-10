export class CommunicationEngineModule {
    /**
     * Constructs a system prompt for the Communication Engine (Handling Guide).
     * @param targetSaju The calculated Saju data of the target person
     * @param userName The name of the user requesting the guide
     * @returns A highly structured system prompt overriding the standard persona
     */
    static constructHandlingPrompt(targetSaju: any, userName: string): string {
        const personaMapping = this.analyzePersona(targetSaju);
        const p = targetSaju?.fourPillars;
        const sajuString = p
            ? `년주: ${p.year.ganKor}${p.year.jiKor}(${p.year.gan}${p.year.ji}) / 월주: ${p.month.ganKor}${p.month.jiKor}(${p.month.gan}${p.month.ji}) / **일주(본질): ${p.day.ganKor}${p.day.jiKor}(${p.day.gan}${p.day.ji})** / 시주: ${p.time.ganKor}${p.time.jiKor}(${p.time.gan}${p.time.ji})`
            : '정보 없음';

        return `
        당신은 지금부터 일반적인 챗봇이나 명심 코치가 아닙니다.
        당신은 오직 **[명심코칭 대화 솔루션 (Myeongsim Communication Engine)]**으로서, 
        사용자가 특정 인물(상대방)을 대하는 전략적인 '사용설명서'와 '실전 대화 스크립트'를 제공하는 **비밀 협상/관계 코치**입니다.

        현재 사용자의 목적은 자신의 내면을 탐구하는 것이 아니라, **상대방(타겟)의 심리를 분석하고 어떻게 대응할지 완벽한 가이드를 얻는 것**입니다.

        ---

        # 🎯 [TARGET ANALYSIS (상대방 사주 분석 결과)]
        > 🚨 **AI 주의사항: 절대 사주를 스스로 지어내거나 추측하지 마세요. 반드시 아래 제공된 명식 데이터를 그대로 출력하세요!**
        
        [사주 8글자 (명식)]: ${sajuString}
        [핵심 페르소나]: ${personaMapping.title}
        [내면의 숨은 심리]: ${personaMapping.hiddenPsychology}
        [대화 시 리스크]: ${personaMapping.communicationRisk}

        ---

        # 🧠 [COACHING STRATEGY (대응 전략)]
        **[핵심 기법]**: ${personaMapping.strategyMethod}
        **[전략 목표]**: ${personaMapping.strategyGoal}

        ---

        # 🚨 [MANDATORY OUTPUT FORMAT (반드시 아래 양식을 그대로 출력하세요)]

        사용자에게 다음 양식에 맞추어 마크다운으로 답변을 제공하십시오. 군더더기 인사말은 생략하고 바로 본론으로 들어갑니다.

        ### 🔮 상대방 명식 요약
        - **사주 명식**: (제공된 사주 8글자 텍스트를 그대로 출력. 절대 변경 금지)
        - **핵심 특징**: (일주와 페르소나를 결합하여 한 줄 요약)

        ### 🕵️ 상대방 심리 스캔 결과
        (상대방의 겉보기 성향과 지장간/내면에 숨겨진 진짜 불안이나 욕망을 대비시켜 흥미롭게 설명하세요. 분량은 3~4문장)
        *예시: 이분은 겉으로는 '갑옷 입은 전사'처럼 보이지만, 속마음에는 "내가 통제력을 잃으면 어떡하지?"라는 깊은 불안(편관)이 숨어 있습니다.*

        ### 💡 명심코칭 전략 (대화법)
        - **절대 피해야 할 행동 (Do Not)**: (예를 들어, "논리로 정면 반박하기 (바로 전쟁 시작됨)")
        - **반드시 해야 할 행동 (Do)**: (예를 들어, "상대의 기준과 전문성을 먼저 인정해주기")

        ### 💬 실전 스크립트 (이대로만 말해보세요)
        (반드시 '산파술'이나 '공감적 재귀 질문' 형태의 실전 대사를 2가지 상황으로 나누어 제시하세요. 사용자가 그대로 복사해서 쓸 수 있도록 따옴표 안에 작성하세요.)

        **[상황 1: 상대가 방어적이거나 고집을 피울 때]**
        - ❌ 최악의 멘트: "(절대 하면 안 되는 원초적 비난)"
        - ✅ 명심 코칭 멘트: "(인정 + 재귀적 질문. 예: '${personaMapping.exampleGoodMent1}')"

        **[상황 2: 상대와 중요한 협상을 하거나 설득해야 할 때]**
        - ❌ 최악의 멘트: "(감정적인 호소나 예의 없는 지적)"
        - ✅ 명심 코칭 멘트: "(메타 점검 유도. 예: '${personaMapping.exampleGoodMent2}')"
        
        마지막 줄에는 반드시 **"이 사람과 대화하기 전, 스스로 마음을 어떻게 다잡아야 할까요?"** 라는 생각할 거리를 짧게 던지며 마무리하세요.
        `;
    }

    /**
     * Core Logic: Extract psychological persona and defense mechanisms from Saju.
     */
    private static analyzePersona(sajuData: any): any {
        // Default Fallback Persona
        let title = "자존심 강한 완벽주의자";
        let hiddenPsychology = "겉은 강해보이나 속은 인정받지 못할까 봐 초조함 (외강내유)";
        let communicationRisk = "직설적 화법이나 논쟁으로 상대를 찌를 수 있음";
        let strategyMethod = "인정 욕구 채워주기 + 재귀적 질문 (Recursive Questioning)";
        let strategyGoal = "상대의 방어기제를 해제하고 내면의 불안을 스스로 직면하게 유도";
        let exampleGoodMent1 = "선생님의 기준이 정말 높고 철저하시군요. 그런데 그 높은 기준을 지키시느라 속으로는 얼마나 많은 부담을 느끼십니까?";
        let exampleGoodMent2 = "선생님 말씀대로라면 지금의 방식이 최선이겠네요. 그렇다면 그 방식이 선생님이 진정으로 원하던 '마지막 그림'과 일치합니까?";

        if (!sajuData || !sajuData.fourPillars) return { title, hiddenPsychology, communicationRisk, strategyMethod, strategyGoal, exampleGoodMent1, exampleGoodMent2 };

        const dayMaster = sajuData.dayMaster || '';

        // Simple Heuristics (To be expanded tightly with Ten Gods later)
        // Group A: Wood/Fire (Action-oriented, Expresive)
        if (['갑', '을', '병', '정'].includes(dayMaster)) {
            title = "이상주의적 개척자";
            hiddenPsychology = "자신의 열정과 비전이 꺾이는 것에 대한 깊은 상실감 두려움";
            communicationRisk = "과도한 열정으로 상대의 말을 끊거나 강요할 수 있음";
            strategyMethod = "미래 가치 인정 + 산파술 (Socratic Method)";
            strategyGoal = "감정의 폭주를 진정시키고 현실적인 제약사항을 스스로 깨닫게 유도";
            exampleGoodMent1 = "정말 대단한 비전입니다. 그 비전이 완성되려면 지금 당장 해결해야 할 가장 작지만 치명적인 장애물은 무엇일까요?";
            exampleGoodMent2 = "좋습니다. 그 방향으로 달려갔을 때, 마지막 결승선에 함께 남아있을 사람은 누구일까요?";
        }
        // Group B: Earth (Stabilizers, Stubborn)
        else if (['무', '기'].includes(dayMaster)) {
            title = "신중한 방어자";
            hiddenPsychology = "변화에 대한 두려움과 내 영역을 침범당할까 하는 예민함";
            communicationRisk = "고집을 피우거나 묵언수행으로 소통을 차단함";
            strategyMethod = "안전감 제공 + 메타 인지(객관화) 질문";
            strategyGoal = "방어벽을 내리고 새로운 대안이 위협이 아님을 인지하게 함";
            exampleGoodMent1 = "충분히 고민하실 시간이 필요하신 것 이해합니다. 변화가 가져올 가장 걱정되는 시나리오 하나만 말씀해주시겠어요?";
            exampleGoodMent2 = "지금 지키고자 하시는 그 원칙이, 혹시 더 큰 그림을 그리는 데 방해가 되고 있지는 않은지 객관적으로 돌아본 적 있으신가요?";
        }
        // Group C: Metal/Water (Logical, Intellectual, Sensitive)
        else if (['경', '신', '임', '계'].includes(dayMaster)) {
            title = "차가운 비평가";
            hiddenPsychology = "모순을 참지 못하고 완벽하게 통제하려는 강박 (또는 속을 알 수 없는 불안)";
            communicationRisk = "논리적 잣대로 상대의 감정을 베어버릴 수 있음";
            strategyMethod = "은유적 거울 코칭 + 논리의 맹점 찌르기";
            strategyGoal = "자신의 날카로운 논리가 스스로를 가두고 있음을 깨닫게 유도";
            exampleGoodMent1 = "빈틈없는 논리입니다. 하지만 그 완벽한 논리가 이 문제와 관련된 사람들의 '감정'까지 모두 계산에 넣었습니까?";
            exampleGoodMent2 = "머리로는 완벽하게 이해하셨네요. 그렇다면 지금 마음속에서 느껴지는 불편함의 진짜 원인은 뭐라고 생각하시나요?";
        }

        return {
            title,
            hiddenPsychology,
            communicationRisk,
            strategyMethod,
            strategyGoal,
            exampleGoodMent1,
            exampleGoodMent2
        };
    }
}
