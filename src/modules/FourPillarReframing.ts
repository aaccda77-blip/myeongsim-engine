/**
 * FourPillarReframing.ts
 * 사주 4기둥(Four Pillars) 구조적 과학 리프레이밍 모듈
 * 
 * 년주/월주/일주/시주를 뇌과학/심리학/시스템 설계 관점으로 재정의
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface PillarDefinition {
    id: string;
    traditional: string;
    traditionalDesc: string;
    systemName: string;
    systemNameEn: string;
    icon: string;
    neuroscience: string;
    function: string;
    metaphor: string;
}

export class FourPillarReframing {

    static readonly PILLARS: PillarDefinition[] = [
        {
            id: 'YEAR',
            traditional: '년주(年柱)',
            traditionalDesc: '가문, 환경, 배경 에너지',
            systemName: 'Background DNA',
            systemNameEn: 'Roots System / Background DNA',
            icon: '🧬',
            neuroscience: '유전적 요인, 초기 양육 환경, 무의식적 기저(Roots System)',
            function: '인생의 배경 에너지이자 초기 설정값. 기질의 뿌리',
            metaphor: '컴퓨터의 BIOS — 시스템의 가장 깊은 곳에 위치한 기본 코드'
        },
        {
            id: 'MONTH',
            traditional: '월주(月柱)',
            traditionalDesc: '사회적 환경, 직업적 적성',
            systemName: 'Social Interface',
            systemNameEn: 'Social Interface / Limbic System',
            icon: '🌐',
            neuroscience: '사회 적응 능력, 미러 뉴런(공감), 사회적 상호작용 지능',
            function: '세상과 소통하는 연결 방식. 조직 내에서의 역할',
            metaphor: '네트워크 카드 — 외부 환경과 데이터를 주고받는 통신 인터페이스'
        },
        {
            id: 'DAY',
            traditional: '일주(日柱)',
            traditionalDesc: '핵심 자아, 의사결정 방식',
            systemName: 'Core Identity',
            systemNameEn: 'Core Identity / Central Processing Unit',
            icon: '🧠',
            neuroscience: '전두엽 집행 기능, 자아 정체성, 핵심 가치관 및 행동 동기',
            function: '나의 본질이자 의사결정의 중추(CPU). 핵심 자아',
            metaphor: '운영 체제(Core OS) — 시스템 전체를 제어하는 핵심 커널'
        },
        {
            id: 'HOUR',
            traditional: '시주(時柱)',
            traditionalDesc: '지향점, 잠재력, 미래 목표',
            systemName: 'Potential Drive',
            systemNameEn: 'Potential Drive / Future Simulation',
            icon: '🚀',
            neuroscience: '신경 가소성, 미래 예측 시뮬레이션, 성장 잠재력 및 숨겨진 욕망',
            function: '나의 잠재적 지향점과 미래의 가능성. 포텐셜 동력',
            metaphor: '확장 슬롯 — 지속적으로 업그레이드 가능한 시스템의 잠재력'
        },
    ];

    /** AI 프롬프트 주입용 4기둥 리프레이밍 사전 */
    static generatePromptDictionary(): string {
        let dict = `\n[🏛️ 4기둥 시스템 아키텍처 (Four Pillar System Architecture)]\n`;
        dict += `**절대 규칙**: 사용자에게 "년주/월주/일주/시주"라는 전통 용어를 직접 사용하지 마십시오.\n`;
        dict += `반드시 아래의 과학적 시스템 명칭으로 변환하여 설명하십시오.\n\n`;
        dict += `**출력 포맷 예시:**\n`;
        dict += `"당신의 년주는 갑자입니다" (❌)\n`;
        dict += `→ "당신의 🧬 DNA 임프린트(Base Code)는 [파이오니어 코어] 타입입니다" (✅)\n\n`;

        for (const p of this.PILLARS) {
            dict += `### ${p.icon} ${p.traditional} → **"${p.systemName}" (${p.systemNameEn})**\n`;
            dict += `  뇌과학: ${p.neuroscience}\n`;
            dict += `  기능: ${p.function}\n`;
            dict += `  비유: ${p.metaphor}\n\n`;
        }

        dict += `### 통합 분석 출력 형식\n`;
        dict += `사용자의 사주를 분석할 때 아래와 같은 시스템 리포트 형태로 출력하십시오:\n\n`;
        dict += `**[시스템 분석: {사용자명} 님]**\n`;
        dict += `- 🧬 **Background DNA(년주):** {뉴럴 타입명} — {설명}\n`;
        dict += `- 🌐 **Social Interface(월주):** {뉴럴 타입명} — {설명}\n`;
        dict += `- 🧠 **Core Identity(일주):** {뉴럴 타입명} — {설명}\n`;
        dict += `- 🚀 **Potential Drive(시주):** {뉴럴 타입명} — {설명}\n\n`;
        dict += `각 기둥의 천간 + 지지 조합에 대해서는 [60갑자 뉴럴 타입 시스템]의 해당 타입을 참조하십시오.\n`;

        return dict;
    }
}
