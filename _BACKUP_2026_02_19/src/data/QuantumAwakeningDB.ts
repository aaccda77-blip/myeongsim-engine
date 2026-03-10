
export const QUANTUM_AWAKENING_CONTENT = {
    DIMENSION_1: {
        id: 'dim_1_xray',
        title: '🪄 1. 내 마음의 엑스레이 (Soul X-Ray)',
        subtitle: '보이지 않는 마음의 뼈대를 촬영합니다',
        concept: '우리의 마음에도 뼈대가 있습니다. 불안, 두려움, 무기력 같은 감정은 단순한 기분이 아니라, 이 뼈대가 뒤틀려서 생기는 통증입니다. S-C-A-R 엔진으로 당신의 마음 엑스레이를 찍어, 통증의 진짜 원인인 [다크 코드]를 찾아냅니다.',
        saju_guide: 'Day Master(일간) and Month Branch(월지) act as the backbone. Analyze conflict between innate self and social environment.'
    },
    DIMENSION_2: {
        id: 'dim_2_unlock',
        title: '🧬 2. 잠든 재능 깨우기 (Unlock Genetic Code)',
        subtitle: '당신조차 몰랐던 천재성을 해동합니다',
        concept: '누구나 태어날 때부터 받은 선물(Gift)이 있습니다. 하지만 세상의 기준에 맞추느라 포장지조차 뜯지 못한 채 창고에 넣어두었죠. 이제 그 먼지 쌓인 상자를 열어볼 시간입니다. 당신의 사주에 숨겨진 [뉴럴 코드]를 활성화합니다.',
        saju_guide: 'Analyze identifying strengths using Useful God(용신) and Hidden Stems(지장간). Unlock latent potential.'
    },
    DIMENSION_3: {
        id: 'dim_3_alchemy',
        title: '⚗️ 3. 약점이 무기가 되는 방 (Alchemy Lab)',
        subtitle: '결핍을 창조의 에너지로 바꿉니다',
        concept: '명심코칭의 핵심 철학, "오류가 아니라 장르입니다." 당신이 숨기고 싶어 하는 단점이나 결핍(공망)이야말로, 사실은 세상을 뒤집을 수 있는 가장 강력한 무기입니다. 관점의 연금술을 통해 그 약점을 황금으로 바꿉니다.',
        saju_guide: 'Reframe Void(공망) and Weakest Element as "Creative Space". Transform victim mindset to creator mindset.'
    },
    DIMENSION_4: {
        id: 'dim_4_frequency',
        title: '💞 4. 영혼의 주파수 맞추기 (Frequency Tuning)',
        subtitle: '나를 지키면서 세상과 연결되는 법',
        concept: '왜 어떤 사람과는 1분만 대화해도 지칠까요? 그것은 주파수가 맞지 않기 때문입니다. 억지로 맞추려 하지 마세요. 나의 고유한 주파수를 지키면서도, 타인과 아름다운 공명을 만들어내는 [관계의 조율법]을 배웁니다.',
        saju_guide: 'Analyze Relationship dynamics using Ten Gods(십성). Balance between Self(비겁) and Others(재관).'
    },
    DIMENSION_5: {
        id: 'dim_5_world',
        title: '🌍 5. 나만의 우주 건설 (World Building)',
        subtitle: '당신의 이야기가 세상의 치유가 됩니다',
        concept: '당신의 상처와 극복 스토리는 누군가에게는 유일한 구원(Map)이 됩니다. 개인의 성장을 넘어, 타인에게 기여하고 영향력을 미치는 [메타 코드]를 설계하여, 당신만의 세상을 건설하세요.',
        saju_guide: 'Expand context to Life Mission using Year Pillar(년주) and Graphic Imagery(물상). Definition of legacy.'
    }
};

export const QUANTUM_SCENARIOS = {
    'ms_quantum_xray': {
        ...QUANTUM_AWAKENING_CONTENT.DIMENSION_1,
        questions: ['최근 반복적으로 느끼는 부정적 감정이 있나요?', '그 감정을 색깔로 표현한다면?', '그 감정이 당신의 몸 어디에 머물러 있나요?']
    },
    'ms_quantum_code': {
        ...QUANTUM_AWAKENING_CONTENT.DIMENSION_2,
        questions: ['어릴 적 시간 가는 줄 모르고 했던 놀이는?', '남들은 어렵다는데 나는 쉬운 일은?', '돈을 안 받아도 해주고 싶은 일은?']
    },
    'ms_quantum_alchemy': {
        ...QUANTUM_AWAKENING_CONTENT.DIMENSION_3,
        questions: ['세상에서 지워버리고 싶은 나의 단점은?', '그 단점 때문에 얻게 된 특별한 능력은?', '만약 그 단점이 신이 주신 선물이라면?']
    },
    'ms_quantum_connect': {
        ...QUANTUM_AWAKENING_CONTENT.DIMENSION_4,
        questions: ['지금 가장 힘든 관계는 누구인가요?', '그 사람에게서 나의 어떤 모습이 보이나요?', '그 관계가 나에게 가르쳐주려는 교훈은?']
    },
    'ms_quantum_universe': {
        ...QUANTUM_AWAKENING_CONTENT.DIMENSION_5,
        questions: ['당신의 묘비명에 적히길 바라는 한 문장은?', '세상에 어떤 흔적을 남기고 싶나요?', '당신의 경험이 누구에게 도움이 될 수 있을까요?']
    }
};
