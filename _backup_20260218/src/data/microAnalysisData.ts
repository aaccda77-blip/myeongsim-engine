export interface CrossAnalysisRule {
    role_type: 'wealth' | 'career' | 'study';
    energy_group: 'strong' | 'weak' | 'storage' | 'new'; // Groups of Wunsung
    message: string;
}

export const CROSS_ANALYSIS_DATA: CrossAnalysisRule[] = [
    // Wealth (Jae)
    { role_type: 'wealth', energy_group: 'strong', message: "돈 그릇이 거대합니다. 월급보다는 사업이나 투자를 통해 거부가 될 그릇입니다." },
    { role_type: 'wealth', energy_group: 'weak', message: "돈 욕심은 많으나 담을 그릇이 약합니다. 무리한 투자보다는 지키는 재테크를 하세요." },
    { role_type: 'wealth', energy_group: 'storage', message: "돈을 버는 것보다 모으는 데 천재적입니다. 알부자가 될 상이니 절대 돈 자랑 마세요." },
    { role_type: 'wealth', energy_group: 'new', message: "새로운 수익원을 창출하는 능력이 탁월합니다. N잡러나 창업에 유리합니다." },

    // Career (Gwan)
    { role_type: 'career', energy_group: 'strong', message: "조직 내에서 리더가 될 운명입니다. 카리스마로 사람들을 이끄세요." },
    { role_type: 'career', energy_group: 'weak', message: "조직 생활보다는 프리랜서나 전문직이 훨씬 잘 맞습니다. 자유롭게 일하세요." },
    { role_type: 'career', energy_group: 'storage', message: "한 직장에 오래 머물거나, 남들이 모르는 특수한 직무를 맡게 됩니다." },
    { role_type: 'career', energy_group: 'new', message: "능력보다 인기와 인맥으로 직장에서 성공하는 스타일입니다. 평판 관리가 생명입니다." },

    // Study (In)
    { role_type: 'study', energy_group: 'strong', message: "학문적 성취가 높고, 배운 것을 크게 써먹을 수 있습니다." },
    { role_type: 'study', energy_group: 'weak', message: "깊이 있는 학문이나 철학, 예술 분야에서 대성합니다. 정신적 지도자가 될 수 있습니다." },
    { role_type: 'study', energy_group: 'storage', message: "고전이나 역사, 종교 등 오래된 학문에 깊은 인연이 있습니다." },
    { role_type: 'study', energy_group: 'new', message: "새로운 지식이나 트렌드를 배우는 데 빠릅니다. 얼리어답터 기질이 있습니다." }
];

export interface ComplexRule {
    pair: [string, string];
    name: string;
    keyword: string;
    psychology: string;
    sublimation: string;
}

export const COMPLEX_DATA: ComplexRule[] = [
    { pair: ['자', '유'], name: '자유귀문', keyword: '동자신/예술성', psychology: "어린아이 같은 순수함과 예민함이 공존합니다. 작은 일에도 쉽게 상처받지만, 감각은 천재적입니다.", sublimation: "예술, 디자인, 엔터테인먼트 분야로 승화하세요." },
    { pair: ['축', '오'], name: '축오원진', keyword: '분노조절', psychology: "평소엔 얌전하다가도 욱하면 물불 안 가리고 폭발하는 에너지가 있습니다.", sublimation: "요리, 금속 공예, 격렬한 운동으로 에너지를 푸세요." },
    { pair: ['인', '미'], name: '인미귀문', keyword: '직관력', psychology: "멍하니 있다가도 남들이 못 보는 미래를 꿰뚫는 직관이 번뜩입니다.", sublimation: "기획자, 작가, 점술가 활동 추천." },
    { pair: ['묘', '신'], name: '묘신귀문', keyword: '장군/과시', psychology: "두뇌 회전이 빠르고 리더십이 있지만, 남을 무시하거나 잘난 체하는 경향이 있습니다.", sublimation: "전략가, 비평가, 지휘관 추천." },
    { pair: ['진', '해'], name: '진해귀문', keyword: '결벽/집착', psychology: "자기만의 세계가 강하고 완벽을 추구합니다. 남들이 이해하기 힘든 독특한 취향이 있습니다.", sublimation: "연구원, 프로그래머, 정밀 분석가 추천." },
    { pair: ['사', '술'], name: '사술원진', keyword: '통찰/의심', psychology: "사람 속을 꿰뚫어 보는 능력이 너무 좋아 오히려 상처받고 의심이 많습니다.", sublimation: "상담가, 변호사, 형사, 심리학자 추천." }
];
