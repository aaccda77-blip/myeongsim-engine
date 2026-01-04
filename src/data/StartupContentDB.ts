/**
 * StartupContentDB.ts - 스타트업 코칭 콘텐츠 데이터베이스
 * 
 * 천재적 사고 공식, 무실패 전략, 성장 전술을 구조화한 데이터
 * 사용자의 Genius Report 결과에 맞춰 매칭됩니다.
 */

// ============================================================================
// 1. 천재적 사고 공식 (Genius Thinking Formulas)
// ============================================================================

export interface ThinkingFormula {
    id: string;
    name: string;
    formula_text: string;
    description: string;
    application_guide: string;
    related_strength: string[]; // Powerbase 연결
}

export const THINKING_FORMULAS: ThinkingFormula[] = [
    {
        id: "TF_01",
        name: "천재적 통찰 공식",
        formula_text: "문제 × 반전 = 기회",
        description: "모든 불편함 속에는 비즈니스 기회가 숨어있다. 불편함을 180도 뒤집어 해결책으로 만들어라.",
        application_guide: "1. 일상에서 '짜증나는' 순간 3개를 적기\n2. 각각을 180도 뒤집어 생각하기\n3. '만약 이것이 해결된다면?'이라고 질문하기",
        related_strength: ['innovation', 'analysis']
    },
    {
        id: "TF_02",
        name: "문제 재정의 알고리즘",
        formula_text: "Why × 5 = 진짜 문제",
        description: "표면적 문제가 아닌 근본 문제를 찾아라. '왜?'를 5번 반복하면 진짜 고객의 Pain Point가 드러난다.",
        application_guide: "1. 해결하고 싶은 문제를 적기\n2. '왜 그게 문제지?'를 5번 반복\n3. 마지막 답이 진짜 공략할 시장",
        related_strength: ['analysis', 'structure']
    },
    {
        id: "TF_03",
        name: "1인 독점 공식",
        formula_text: "좁은 시장 + 깊은 전문성 = 독점",
        description: "넓은 시장에서 경쟁하지 말고, 아주 좁은 시장에서 1등 하라. '동창회 앱'처럼 특정 니치를 파고들어라.",
        application_guide: "1. 관심 분야를 '축소'하기 (예: 건강 → 40대 직장인 허리 → 앉아서 일하는 개발자 허리)\n2. 그 좁은 영역에서 최고가 되기\n3. 이후 점진적 확장",
        related_strength: ['realization', 'development']
    },
    {
        id: "TF_04",
        name: "커뮤니티 퍼스트 전략",
        formula_text: "사람 × 신뢰 = 플랫폼",
        description: "앱을 만들기 전에 커뮤니티(부족)를 먼저 만들어라. 1,000명의 진성 팬이 모든 것의 시작이다.",
        application_guide: "1. 내가 도와줄 수 있는 '사람들'을 정의하기\n2. 그들이 모여있는 곳(카페, 오픈채팅)에서 가치 제공\n3. 신뢰가 쌓이면 그때 제품 제안",
        related_strength: ['communication', 'networks']
    },
    {
        id: "TF_05",
        name: "환급형 챌린지 퍼널",
        formula_text: "저가 검증 + 환급 약속 = 무위험 진입",
        description: "고가 제품을 팔기 전, 저가 챌린지로 신뢰를 구축하라. 목표 달성 시 환급하면 고객 저항이 사라진다.",
        application_guide: "1. 핵심 가치를 담은 7일/21일 챌린지 설계\n2. 저렴한 참가비 + 완주 시 환급 조건\n3. 챌린지 성공자에게 프리미엄 프로그램 제안",
        related_strength: ['marketSuccess', 'sustainability']
    },
    {
        id: "TF_06",
        name: "통찰 증폭 공식",
        formula_text: "개인 경험 × 보편적 원리 = 바이럴 콘텐츠",
        description: "나만의 경험을 보편적 교훈으로 승화시켜라. '나는 이렇게 했다'가 아니라 '당신도 이렇게 할 수 있다'로 포장하라.",
        application_guide: "1. 나의 실패/성공 경험을 적기\n2. 그 경험에서 '누구나 적용 가능한 원칙' 추출\n3. '~하는 3가지 방법' 형식으로 콘텐츠화",
        related_strength: ['communication', 'transformation']
    },
    {
        id: "TF_07",
        name: "MVP 린 공식",
        formula_text: "최소 기능 × 빠른 피드백 = 성공 확률",
        description: "완벽한 제품이 아니라 '작동하는 최소 버전'을 빠르게 출시하고 피드백으로 개선하라.",
        application_guide: "1. 핵심 가치 1개만 담은 MVP 정의\n2. 2주 안에 프로토타입 제작\n3. 10명에게 테스트 후 개선",
        related_strength: ['realization', 'execution']
    },
    {
        id: "TF_08",
        name: "PLG 성장 공식",
        formula_text: "Wow Moment × 공유 = 자연 성장",
        description: "광고 없이 제품이 스스로 팔리게 하라. 사용자가 'Wow!'하는 순간을 만들면 입소문이 퍼진다.",
        application_guide: "1. 고객이 '오!' 할 첫 30초 경험 설계\n2. 그 경험을 공유하기 쉽게 만들기\n3. 공유한 사람에게 보상 제공",
        related_strength: ['innovation', 'marketSuccess']
    },
    {
        id: "TF_09",
        name: "팀 시너지 공식",
        formula_text: "나의 약점 = 파트너의 강점",
        description: "혼자 하면 빠르지만 함께 하면 멀리 간다. 나와 반대 유형의 파트너를 찾아라.",
        application_guide: "1. 나의 Powerbase에서 가장 낮은 영역 확인\n2. 그 영역이 강한 사람을 파트너로 영입\n3. 역할 분담 명확히 하기",
        related_strength: ['partnership', 'management']
    },
    {
        id: "TF_10",
        name: "자금 조달 타이밍",
        formula_text: "검증된 트랙션 × 적절한 시기 = 투자 유치",
        description: "투자는 아이디어가 아니라 '증명된 성장'에 들어온다. PMF(Product Market Fit)를 먼저 달성하라.",
        application_guide: "1. 매출 또는 사용자 성장 그래프 만들기\n2. MRR(월 반복 매출) 300만원 이상 달성\n3. 그 후 정부지원금/엔젤투자 순서로 접근",
        related_strength: ['sustainability', 'structure']
    }
];

// ============================================================================
// 2. 무실패 전략 (Fail-proof Strategies)
// ============================================================================

export interface FailproofStrategy {
    id: string;
    name: string;
    subtitle: string;
    core_concept: string;
    why_it_works: string;
    action_steps: string[];
    success_metric: string;
    recommended_for: string[]; // Powerbase types
}

export const FAILPROOF_STRATEGIES: FailproofStrategy[] = [
    {
        id: "FS_01",
        name: "환급형 챌린지 퍼널",
        subtitle: "고가 상품 판매 전 신뢰 구축 전략",
        core_concept: "저렴한 챌린지로 고객과 먼저 관계를 맺고, 성공 경험을 준 후 프리미엄 상품을 제안한다.",
        why_it_works: "고객은 '실패해도 돈이 돌아온다'는 안전장치가 있으면 쉽게 시작한다. 한번 성공 경험을 하면 다음 구매 저항이 사라진다.",
        action_steps: [
            "7일 또는 21일 챌린지 커리큘럼 설계",
            "참가비 3~5만원 + 완주 시 전액 환급 조건 설정",
            "카카오 오픈채팅방에서 매일 미션 & 인증",
            "완주자에게 프리미엄 프로그램(30~50만원) 할인 제안",
            "후기와 사례를 다음 챌린지 마케팅에 활용"
        ],
        success_metric: "챌린지 완주율 70% 이상, 프리미엄 전환율 30% 이상",
        recommended_for: ['communication', 'communities']
    },
    {
        id: "FS_02",
        name: "커뮤니티 퍼스트",
        subtitle: "앱보다 부족(Tribe)을 먼저 만들기",
        core_concept: "제품을 만들기 전에 내가 도와줄 '사람들의 모임'을 먼저 만들어라. 그들의 니즈를 직접 들으면 실패 확률이 0에 가까워진다.",
        why_it_works: "시장 검증이 자동으로 된다. 커뮤니티 멤버 = 초기 고객 = 입소문 전파자가 된다.",
        action_steps: [
            "내가 도와줄 수 있는 '타겟 페르소나' 정의",
            "그들이 모여있는 온라인 공간(네이버 카페, 인스타) 탐색",
            "그 공간에서 '무료로' 가치 있는 정보 제공 (3개월)",
            "나를 팔로우하는 100명 형성 후 오픈채팅 초대",
            "500명 되면 유료 프로그램 론칭"
        ],
        success_metric: "커뮤니티 500명 달성, 주 1회 이상 자발적 활동",
        recommended_for: ['communication', 'networks', 'partnership']
    },
    {
        id: "FS_03",
        name: "딥 니치 전략",
        subtitle: "'동창회 앱'처럼 좁은 시장 먼저 지배하기",
        core_concept: "넓은 시장에서 1% 점유보다, 좁은 시장에서 100% 독점이 훨씬 쉽다. 아주 작은 시장에서 1등이 되어 확장하라.",
        why_it_works: "경쟁이 없다. 해당 니치에서 '유일한 솔루션'이 되면 검색/입소문이 집중된다.",
        action_steps: [
            "관심 분야를 3단계로 축소 (예: 피트니스 → 40대 여성 → 40대 직장맘 홈트)",
            "그 좁은 타겟의 Pain Point #1 파악",
            "오직 그 문제만 해결하는 초심플 제품/서비스 만들기",
            "해당 니치 커뮤니티에서 바이럴",
            "성공 후 인접 시장으로 확장"
        ],
        success_metric: "해당 니치에서 인지도 1위, 검색 시 최상단 노출",
        recommended_for: ['analysis', 'development', 'autonomous']
    }
];

// ============================================================================
// 3. 성장 전술 (Growth Tactics)
// ============================================================================

export interface GrowthTactic {
    id: string;
    name: string;
    category: 'marketing' | 'product' | 'team' | 'funding';
    description: string;
    key_actions: string[];
    tools_recommended: string[];
}

export const GROWTH_TACTICS: GrowthTactic[] = [
    {
        id: "GT_01",
        name: "PLG (Product-Led Growth)",
        category: 'product',
        description: "광고비 없이 제품 자체가 마케팅이 되게 하라. 사용자가 'Wow!'하는 첫 경험이 핵심이다.",
        key_actions: [
            "Onboarding 30초 안에 'Aha!' 순간 설계",
            "공유하면 보상받는 Referral 시스템 구축",
            "무료 버전으로 가치 경험 → 유료 업그레이드 유도"
        ],
        tools_recommended: ["Notion", "Figma", "Mixpanel"]
    },
    {
        id: "GT_02",
        name: "1,000 진성 팬 확보",
        category: 'marketing',
        description: "케빈 켈리의 법칙: 매년 100달러를 쓰는 1,000명의 팬만 있으면 독립 가능하다.",
        key_actions: [
            "내 콘텐츠의 '슈퍼팬' 10명 먼저 찾기",
            "그들과 1:1 대화로 니즈 깊이 파악",
            "슈퍼팬이 다른 팬을 데려오게 인센티브 설계"
        ],
        tools_recommended: ["카카오 오픈채팅", "인스타그램", "뉴스레터(스티비)"]
    },
    {
        id: "GT_03",
        name: "인스타그램 마케팅",
        category: 'marketing',
        description: "릴스와 스토리를 활용해 개인 브랜드를 빠르게 구축하라.",
        key_actions: [
            "하루 1개 릴스 업로드 (30일 챌린지)",
            "CTA(Call to Action) 명확히: '프로필 링크 클릭'",
            "DM으로 관계 구축 → 상품 제안"
        ],
        tools_recommended: ["CapCut", "Canva", "Later"]
    },
    {
        id: "GT_04",
        name: "정부지원금 레버리지",
        category: 'funding',
        description: "초기 스타트업은 투자보다 정부지원금이 효율적이다. 사업계획서 작성 능력을 키워라.",
        key_actions: [
            "K-Startup 사이트에서 공고 모니터링",
            "예비창업패키지, 초기창업패키지 순서로 도전",
            "사업계획서 템플릿 숙지 및 멘토 피드백 받기"
        ],
        tools_recommended: ["K-Startup", "창업진흥원", "중소벤처부"]
    },
    {
        id: "GT_05",
        name: "린 팀 빌딩",
        category: 'team',
        description: "초기에는 풀타임 고용보다 파트타임/프리랜서로 유연하게 팀을 구성하라.",
        key_actions: [
            "핵심 역할 2개 정의 (예: 개발, 마케팅)",
            "각 역할에 맞는 프리랜서/파트너 탐색",
            "지분 또는 성과급으로 동기부여"
        ],
        tools_recommended: ["크몽", "숨고", "원티드"]
    }
];

// ============================================================================
// 4. 비즈니스 유형별 추천 (Business Type Recommendations)
// ============================================================================

export interface BusinessType {
    id: string;
    type: string;
    title: string;
    description: string;
    recommended_formulas: string[];
    recommended_strategies: string[];
    ideal_powerbase: string[];
}

export const BUSINESS_TYPES: BusinessType[] = [
    {
        id: "BT_COMMUNITY",
        type: "COMMUNITY_LEADER",
        title: "커뮤니티 리더형",
        description: "사람을 모으고 연결하는 능력이 핵심. 커뮤니티/플랫폼 비즈니스에 적합합니다.",
        recommended_formulas: ["TF_04", "TF_06", "TF_09"],
        recommended_strategies: ["FS_02"],
        ideal_powerbase: ['communication', 'networks', 'communities']
    },
    {
        id: "BT_MAKER",
        type: "MAKER",
        title: "Maker(제작자)형",
        description: "직접 만들고 개선하는 것을 즐기는 유형. 제품 중심 스타트업에 적합합니다.",
        recommended_formulas: ["TF_03", "TF_07", "TF_08"],
        recommended_strategies: ["FS_03"],
        ideal_powerbase: ['innovation', 'realization', 'development']
    },
    {
        id: "BT_STRATEGIST",
        type: "STRATEGIST",
        title: "전략가형",
        description: "분석하고 계획 세우는 것이 강점. 컨설팅/코칭 비즈니스에 적합합니다.",
        recommended_formulas: ["TF_01", "TF_02", "TF_10"],
        recommended_strategies: ["FS_01", "FS_03"],
        ideal_powerbase: ['analysis', 'management', 'structure']
    }
];

// ============================================================================
// Export All
// ============================================================================

export const STARTUP_COACHING_CONTENT = {
    thinkingFormulas: THINKING_FORMULAS,
    failproofStrategies: FAILPROOF_STRATEGIES,
    growthTactics: GROWTH_TACTICS,
    businessTypes: BUSINESS_TYPES
};
