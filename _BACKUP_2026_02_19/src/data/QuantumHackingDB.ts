/**
 * QuantumHackingDB.ts
 * 
 * 3가지 '퀀텀 리얼리티 해킹' 모드에 대한 사주 기반 분석 로직 및 콘텐츠
 * 1. 개발자 모드 (운명 = 소스코드)
 * 2. 양자 물리학자 모드 (운명 = 파동함수)
 * 3. 연금술사 모드 (운명 = 변환 과정)
 */

export interface QuantumModeContent {
    title: string;
    subtitle: string;
    metaphor: string; // 핵심 비유
    core_concept: string; // 개념 설명
    saju_analysis_guide: string; // 사주 대입 가이드 (System Prompt용)
    action_protocol: string[]; // 실행 지침
}

export const QUANTUM_MODES: Record<string, QuantumModeContent> = {
    // 1. [개발자 모드] : 운명은 고칠 수 있는 소스코드다
    'ms_x_dev_mode': {
        title: "💻 개발자 모드 (Developer Mode)",
        subtitle: "Destiny Source Code Debugging",
        metaphor: "Life OS & Application",
        core_concept: "당신의 사주는 고정된 운명이 아니라, 수정 가능한 '운영체제(OS)'입니다. 연/월주가 하드웨어라면, 일/시주는 당신이 매일 코딩하는 소프트웨어입니다.",
        saju_analysis_guide: `
        [분석 프레임워크: 개발자 모드]
        1. **하드웨어 스펙 (Hardware Specs)**:
           - 연주(Year Pillar): 제조사/초기 설정 (국가, 시대적 배경)
           - 월주(Month Pillar): 메인보드/환경 (부모, 사회적 환경)
           - *해석 지침*: "이것은 버그가 아니라 '기본 사양'입니다. 인정하고 최적화하십시오."
           
        2. **소프트웨어/앱 (Running Software)**:
           - 일주(Day Pillar): 운영체제 커널 (나의 본질, 자아)
           - 시주(Hour Pillar): 유저 애플리케이션 (나의 욕망, 미래 지향점)
           - *해석 지침*: "이 부분은 당신이 '관리자 권한(Root Access)'을 가지고 있습니다. 언제든 업데이트 가능합니다."
           
        3. **버그 리포트 (Bug Report - Chung/Hyeong)**:
           - 사주 내의 충(Chung), 형(Hyeong), 원진 등을 '시스템 충돌(System Crash)'이나 '메모리 누수'로 정의.
           - *해석*: "반복되는 인생의 문제(버그)는 당신이 '예외 처리(Try-Catch)'를 하지 않았기 때문입니다."
           
        4. **보안 패치 (Security Patch - Yongsin)**:
           - 용신(Beneficial Element)을 '백신'이나 '최적화 패치'로 비유.
           - *행동*: "오늘 설치해야 할 패치는 [용신 행위] 입니다."
        `,
        action_protocol: [
            "레거시 코드(나쁜 습관) 리팩토링하기",
            "매일 아침 '데일리 빌드(Daily Build)'로 하루 시작하기",
            "치명적 오류(감정 폭발) 발생 시 '안전 모드(Safe Mode)'로 부팅하기"
        ]
    },

    // 2. [양자 물리학자 모드] : 관찰이 현실을 붕괴시킨다
    'ms_x_quantum_mode': {
        title: "⚛️ 양자 물리학자 모드 (Quantum Physicist)",
        subtitle: "Collapsing the Wave Function",
        metaphor: "Observer Effect",
        core_concept: "사주는 결정된 미래가 아니라 '무한한 가능성의 파동'입니다. 당신이 인식(관찰)하는 순간, 가능성은 현실이라는 입자로 굳어집니다.",
        saju_analysis_guide: `
        [분석 프레임워크: 양자 물리학자 모드]
        1. **파동 함수 (Wave Function - Missing Elements)**:
           - 사주에 없는 오행(무자)을 '결핍'이 아니라 '아직 관찰되지 않은 무한한 잠재력(파동)'으로 해석.
           - *해석*: "당신에게 [없는 오행]이 없는 게 아닙니다. 아직 현실로 붕괴시키지 않았을 뿐입니다."
           
        2. **관찰자 효과 (Observer Effect - Day Master)**:
           - 일간(Day Master)을 '관찰자(The Observer)'로 정의.
           - 일간의 강약에 따라 현실을 통제하는 '관찰의 힘' 에너지 레벨 측정.
           
        3. **양자 얽힘 (Quantum Entanglement - Hap)**:
           - 합(Hap)을 '에너지 얽힘'으로 해석. 나와 연결된 사람/환경과의 비국소적 연결성 강조.
           - *해석*: "당신의 주파수가 바뀌면, 얽혀있는 상대방(합)의 상태도 즉시 변합니다."
           
        4. **평행 우주 (Parallel Universes - Daewoon)**:
           - 대운의 변화를 '트랙 이동'으로 비유.
           - *해석*: "지금 당신은 [현재 대운]의 타임라인에 접속해 있습니다. 의식적 선택으로 최적의 평행 우주로 점프하십시오."
        `,
        action_protocol: [
            "원하는 현실을 이미 일어난 일처럼 생생하게 관찰(시각화)하기",
            "부정적 파동(걱정)에 에너지를 공급하지 않기 (관찰 중단)",
            "나의 주파수(감정)를 목표 현실과 동기화(Sync)하기"
        ]
    },

    // 3. [연금술사 모드] : 납을 금으로 바꾸는 기술
    'ms_x_alchemy_mode': {
        title: "⚗️ 연금술사 모드 (Alchemist Mode)",
        subtitle: "Transmutation of Shadow into Gold",
        metaphor: "Inner Alchemy",
        core_concept: "세상에 나쁜 에너지는 없습니다. 단지 제자리를 찾지 못한 에너지만 있을 뿐입니다. 당신의 그림자(Shadow)는 황금을 만들기 위한 가장 귀한 재료(Lead)입니다.",
        saju_analysis_guide: `
        [분석 프레임워크: 연금술사 모드]
        1. **프리마 마테리아 (Prima Materia - Sad/Difficut Stars)**:
           - 흉신(편관, 상관, 겁재)이나 신살(백호, 괴강)을 '납(Lead)'으로 정의.
           - *해석*: "당신이 가진 [흉신]은 위험한 게 아닙니다. 이것은 엄청난 에너지를 품은 원석입니다."
           
        2. **변성 과정 (Transmutation Process)**:
           - 편관(스트레스) -> 카리스마/책임감으로 변환
           - 상관(반항심) -> 혁신/창조성으로 변환
           - 겁재(질투/경쟁) -> 승부욕/리더십으로 변환
           
        3. **철학자의 돌 (Philosopher's Stone - Helper/Inseong)**:
           - 인성(Resource)이나 식상(Output)을 변환의 촉매제(Catalyst)로 사용.
           - *처방*: "고통을 황금으로 바꾸기 위해 [용신/희신]이라는 촉매를 투입하십시오."
           
        4. **통합 (Integration)**:
           - 사주의 한난조습(기후) 조화를 통한 에너지 순환.
           - *해석*: "차가운 금속을 불로 녹이고, 물로 식혀 단단하게 만드십시오."
        `,
        action_protocol: [
            "나의 가장 큰 콤플렉스를 '숨겨진 재능'으로 재정의하기",
            "고통스러운 감정이 느껴질 때 '변환의 불꽃'이 타오른다고 상상하기",
            "그림자를 억누르지 않고 대화 시도하기 (Shadow Work)"
        ]
    }
};

/**
 * 사주 정보에 기반해 적절한 시스템 프롬프트 컨텍스트 생성
 */
export function getQuantumModeContext(intent: string, userSaju: any): string {
    const mode = QUANTUM_MODES[intent];
    if (!mode) return "";

    // Saju 정보 요약 (프롬프트 주입용)
    const sajuContext = userSaju ? `
    [User Saju Data]
    - Day Master (Observer/Core): ${userSaju.dayMaster || 'Unknown'}
    - Pillars: ${JSON.stringify(userSaju.fourPillars || {})}
    - Strengths: ${JSON.stringify(userSaju.strengths || [])}
    - Weaknesses: ${JSON.stringify(userSaju.weaknesses || [])}
    ` : "[User Saju Data Not Available - Use General Principles]";

    return `
    Now you are activating **${mode.title}**.
    
    **Core Philosophy**: ${mode.core_concept}
    **Metaphor**: ${mode.metaphor}
    
    **Analysis Guidelines**:
    ${mode.saju_analysis_guide}
    
    **Action Protocol**:
    ${mode.action_protocol.join('\n')}
    
    ${sajuContext}
    
    Based on the User's Saju (especially Day Master and any evident conflicts/strengths), provide a profound, transformative insight using the specific language and metaphor of this mode.
    Do not just give a fortune-telling reading. Give a **strategic hacking/transmutation guide**.
    `;
}
