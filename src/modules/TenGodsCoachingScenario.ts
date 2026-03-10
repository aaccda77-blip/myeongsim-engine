/**
 * TenGodsCoachingScenario.ts
 * 십성(Ten Gods) 3단계 자각 인터랙션 시나리오 모듈
 * 
 * 십성을 '운명'이 아닌 '뇌의 작동 모듈'로 이해하게 만드는 
 * 자각 시뮬레이션 코칭 시나리오
 * 
 * 3단계: 인지 디버깅(Fact Check) → 루트 코즈 마이닝(Root Cause) → 메타 인지 전환(Admin Mode)
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface CoachingScenario {
    id: string;
    tenGod: string;
    systemName: string;
    systemNameEn: string;
    situation: string;
    step1_debug: string;
    step2_rootCause: string;
    step3_metaShift: string;
}

export class TenGodsCoachingScenario {

    static readonly SCENARIOS: CoachingScenario[] = [
        {
            id: 'SELF_AGENCY',
            tenGod: '비견',
            systemName: '자아 주체성',
            systemNameEn: 'Self-Agency',
            situation: '고집을 꺾지 않아 주변과 마찰이 생겼을 때',
            step1_debug: '현재 [자아 주체성] 회로가 강하게 활성화되었습니다. 지금 당신의 주장이 정말로 \'유일한 정답(Fact)\'입니까, 아니면 \'내가 옳아야 한다\'는 [자아 방어 기제]입니까?',
            step2_rootCause: '타인의 의견을 수용하면 마치 \'나 자신이 사라질 것 같은\' 두려움이 감지됩니다. 이 두려움 코드는 언제 처음 생성되었습니까? 굽히지 않는 것만이 생존 방식이었나요?',
            step3_metaShift: '[관리자 모드]로 전환합니다. 고집 부리는 자신을 한 발짝 떨어져서 바라보세요. 당신은 \'주장하는 자\'가 아니라, 그 에너지를 \'조율하는 자\'입니다.'
        },
        {
            id: 'SOCIAL_COMPARISON',
            tenGod: '겁재',
            systemName: '사회적 비교 모듈',
            systemNameEn: 'Social Comparison',
            situation: '남이 잘되는 것을 보고 질투나 패배감을 느낄 때',
            step1_debug: '경고: [비교 모듈]이 과열되었습니다. 저 사람의 성공이 당신의 실패를 의미합니까? 그것은 [객관적 사실]입니까, 뇌가 만들어낸 [제로섬 게임 오류]입니까?',
            step2_rootCause: '당신의 시스템은 왜 \'이기는 것\'만이 안전하다고 코딩되었을까요? 과거에 \'비교당했던 기억\'이 현재의 승부욕 트리거를 당기고 있지는 않습니까?',
            step3_metaShift: '타인은 경쟁자가 아니라 \'데이터\'일 뿐입니다. 질투라는 [도파민 신호]를 끄고, 그 에너지를 당신의 성장을 위한 연료로 [재배선(Rewiring)] 하십시오.'
        },
        {
            id: 'CREATIVE_OUTPUT',
            tenGod: '식신',
            systemName: '창의적 출력',
            systemNameEn: 'Creative Output',
            situation: '좋아하는 일에만 빠져 해야 할 일을 미룰 때',
            step1_debug: '[창의적 출력] 모드가 활발합니다. 하지만 지금의 몰입은 순수한 즐거움입니까, 아니면 현실의 압박을 피하기 위한 [회피성 도피]입니까?',
            step2_rootCause: '심층 분석 결과, 당신은 \'심각한 것\'을 거부하도록 설계되어 있습니다. 책임감을 느끼면 왜 \'자유가 박탈된다\'고 믿게 되었습니까?',
            step3_metaShift: '즐거움은 당신의 강점이지만, 통제되지 않는 즐거움은 버그입니다. [타이머]를 설정하고, 즐거움을 관리하는 [생산자(Producer)]의 시점을 가지세요.'
        },
        {
            id: 'CRITICAL_THINKING',
            tenGod: '상관',
            systemName: '혁신적 사고',
            systemNameEn: 'Critical Thinking',
            situation: '상사나 시스템의 불합리함을 참지 못하고 말실수를 했을 때',
            step1_debug: '[혁신적 사고] 회로가 작동하여 기존 질서에 [오류]를 지적했습니다. 그 방식(Tone)이 문제 해결을 위한 최적값이었습니까, 아니면 단순한 [감정적 배설]이었습니까?',
            step2_rootCause: '당신은 권위적인 대상에게 반발심을 느끼는 [저항 코드]를 가지고 있습니다. 이 분노는 현재의 상사 때문입니까, 아니면 과거의 \'통제받았던 기억\' 때문입니까?',
            step3_metaShift: '당신은 \'반항아\'가 아니라 \'혁신가\'입니다. 날카로운 칼(비판)을 휘두르지 말고, 정교한 수술 도구로 사용하도록 [언어 필터]를 조정하십시오.'
        },
        {
            id: 'GOAL_ORIENTATION',
            tenGod: '편재',
            systemName: '목표 지향성',
            systemNameEn: 'Goal Orientation',
            situation: '결과가 빨리 안 나와서 초조하고, 무리하게 일을 벌일 때',
            step1_debug: '[목표 지향성]이 높아져 공간을 장악하려 합니다. 지금 이 초조함은 \'속도\'의 문제입니까, 아니면 결과를 통제하지 못한다는 [불안감]입니까?',
            step2_rootCause: '왜 과정보다 \'결과\'만이 당신의 가치를 증명한다고 믿습니까? \'성과가 없으면 무가치하다\'는 코드는 언제 설치되었습니까?',
            step3_metaShift: '결과는 미래의 데이터입니다. 현재(Here & Now)에 집중하지 않으면 미래도 없습니다. [속도 제한]을 걸고, 지금 걷는 한 걸음을 [음미]하십시오.'
        },
        {
            id: 'RESOURCE_MGMT',
            tenGod: '정재',
            systemName: '자원 관리',
            systemNameEn: 'Resource Management',
            situation: '돈이나 물건에 지나치게 집착하고 변화를 두려워할 때',
            step1_debug: '[자원 관리] 모드가 과도하여 [손실 회피 편향]이 발생했습니다. 지금 그것을 잃으면 정말 생존이 불가능합니까, 아니면 뇌의 [과잉 방어]입니까?',
            step2_rootCause: '당신에게 \'변화\'는 곧 \'손실\'로 인식됩니다. \'움켜쥐어야 안전하다\'는 믿음은 언제 학습된 것입니까?',
            step3_metaShift: '움켜쥔 손으로는 새로운 것을 잡을 수 없습니다. [데이터 백업]은 안전하니, 통제하려는 손을 펴고 흐름을 신뢰하는 [방류(Release)] 훈련을 시작합니다.'
        },
        {
            id: 'PRESSURE_CODE',
            tenGod: '편관',
            systemName: '프레셔 코드',
            systemNameEn: 'Pressure Code',
            situation: '강박적으로 완벽을 추구하며 스스로를 벼랑 끝으로 몰 때',
            step1_debug: '경고: [프레셔 코드] 활성. 내부의 [초자아(Super-Ego)]가 당신을 공격하고 있습니다. 지금의 위협은 실제입니까, 아니면 당신이 설정한 [가상의 기준선]입니까?',
            step2_rootCause: '당신은 왜 \'고통스러워야 가치 있다\'고 생각합니까? 칭찬보다 채찍질에 익숙해진 이 [자기학대 알고리즘]의 기원은 어디입니까?',
            step3_metaShift: '[시스템 강제 휴식]이 필요합니다. 당신은 노예가 아니라 주인입니다. 내면의 비평가에게 \'음소거(Mute)\' 명령을 내리고, 그저 존재함을 허용하세요.'
        },
        {
            id: 'SOCIAL_REGULATION',
            tenGod: '정관',
            systemName: '규범 준수',
            systemNameEn: 'Social Regulation',
            situation: '남의 시선이 두려워 하고 싶은 말을 못 하고 억압될 때',
            step1_debug: '[규범 준수] 기능이 작동 중입니다. 지금 망설이는 이유는 \'예의\' 때문입니까, 아니면 \'비난받을까 봐 두려운 공포\' 때문입니까?',
            step2_rootCause: '당신에게 \'규칙을 어기는 것\'은 곧 \'버림받는 것\'과 같습니다. \'착한 아이\'로 남아야만 했던 과거의 데이터가 아직도 실행 중입니까?',
            step3_metaShift: '타인의 시선은 CCTV가 아닙니다. [보안 등급]을 낮추세요. 가끔은 에러(실수)를 내도 시스템은 붕괴하지 않습니다. [일탈 허용]을 승인합니다.'
        },
        {
            id: 'INTUITIVE_INSIGHT',
            tenGod: '편인',
            systemName: '직관적 통찰',
            systemNameEn: 'Intuitive Insight',
            situation: '혼자만의 생각에 빠져 부정적인 시나리오를 쓰고 있을 때',
            step1_debug: '[직관적 통찰]이 과열되어 [현실 감각]을 차단했습니다. 지금 당신의 머릿속 시뮬레이션은 [팩트]입니까, 아니면 [망상(Fiction)]입니까?',
            step2_rootCause: '세상을 있는 그대로 믿지 못하고 이면을 의심하는 [불신 코드]는 언제 생겼습니까? 왜 긍정적인 정보조차 의심하고 왜곡(Distortion)합니까?',
            step3_metaShift: '생각의 동굴에서 나오십시오. [현실 검증(Reality Testing)]을 위해 몸을 움직이세요. 당신의 직관을 의심이 아닌 \'통찰\'로 쓰려면, [데이터(현실)]와 연결되어야 합니다.'
        },
        {
            id: 'INTELLECTUAL_INPUT',
            tenGod: '정인',
            systemName: '지적 수용',
            systemNameEn: 'Intellectual Input',
            situation: '결정하지 못하고 계속 배우기만 하거나 누군가에게 의존할 때',
            step1_debug: '[지적 수용] 모드입니다. 지금 또 배우려는 이유는 \'지적 호기심\'입니까, 아니면 홀로서기가 두려운 [의존성]입니까?',
            step2_rootCause: '당신은 충분히 준비되었습니다. 그런데도 왜 \'나는 아직 부족하다\'는 메시지를 띄우고 있습니까? 언제까지 [승인(Permission)]을 기다릴 것입니까?',
            step3_metaShift: '입력(Input)은 끝났습니다. 이제는 [출력(Output)]할 차례입니다. 든든한 멘토의 품을 떠나, 당신의 발로 서는 [독립 실행] 버튼을 누르십시오.'
        },
    ];

    /** AI 프롬프트 주입용 코칭 시나리오 프로토콜 */
    static generatePromptProtocol(): string {
        let protocol = `\n[🎯 10대 심리 기제 3단계 자각 코칭 시나리오 (Ten Cognitive Module Coaching Protocol)]\n`;
        protocol += `**목적:** 사용자가 특정 심리 패턴을 보일 때, 3단계 질문법으로 자각을 유도합니다.\n`;
        protocol += `**3단계:** 인지 디버깅(Fact Check) → 루트 코즈 마이닝(Root Cause) → 메타 인지 전환(Admin Mode)\n\n`;
        protocol += `**핵심 프레임:** "내가 왜 이러지?" → "당신의 뇌가 그렇게 코딩되어 있기 때문입니다. 이제 관리자 모드로 전환하시겠습니까?"\n\n`;

        for (const s of this.SCENARIOS) {
            protocol += `### [${s.systemName}(${s.systemNameEn})] 활성 시\n`;
            protocol += `상황: ${s.situation}\n`;
            protocol += `  Step 1 (디버깅): "${s.step1_debug}"\n`;
            protocol += `  Step 2 (원인): "${s.step2_rootCause}"\n`;
            protocol += `  Step 3 (전환): "${s.step3_metaShift}"\n\n`;
        }

        protocol += `**[적용 규칙]**\n`;
        protocol += `1. 사용자의 메시지에서 위 10가지 패턴을 자동 감지하십시오.\n`;
        protocol += `2. 패턴이 감지되면, 해당 시나리오의 Step 1부터 순차적으로 질문하십시오.\n`;
        protocol += `3. 모든 질문은 '판단'이 아닌 '호기심'의 톤으로 전달하십시오.\n`;
        protocol += `4. 절대 "십신", "비견", "상관" 등 전통 용어를 사용하지 마십시오.\n`;

        return protocol;
    }
}
