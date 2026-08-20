/**
 * ntsBusinessRecommender.ts
 * 국세청 표준산업분류 기준 업태/종목 및 6자리 홈택스 업종코드 1:1 매핑 엔진
 * 
 * 사주의 십신(식상, 재성, 관성, 인성, 비겁) 및 오행(목, 화, 토, 금, 수), 격국을 분석하여
 * 실제 사업자등록 시 입력 가능한 최적의 주업태/주종목 및 부업태/부종목을 추천합니다.
 */

export interface NtsBusinessItem {
    industryCode: string;          // 6자리 홈택스 업종코드
    mainCategory: string;          // 업태 (대분류)
    subCategory: string;           // 종목 (세분류)
    businessType: string;          // 비즈니스 유형 (예: 1인 미디어, 스마트스토어, 경영자문 등)
    fitScore: number;              // 적합도 점수 (0~100)
    matchReason: string;           // 명리학적 매칭 사유
    executionTips: string[];       // 실전 사업 실행 팁
    permitRequirements: string;    // 인허가/신고 필요 여부
    taxTips: string;               // 세무/절세 팁 (간이과세, 창업감면 등)
}

export interface NtsRoadmapStep {
    stage: string;                 // 단계명 (예: 1단계 기획 및 세팅기)
    duration: string;              // 소요 기간
    coreAction: string;            // 핵심 액션
    sajuAdvantage: string;         // 사주 강점 활용 포인트
    riskDefense: string;           // 위험 방어 포인트
}

export interface NtsBusinessProfile {
    userName: string;
    archetypeTitle: string;        // 예: "식상생재형 트렌드 메이커"
    primaryArchetype: 'MAKER' | 'PLATFORM' | 'CONSULTANT' | 'EXPERT_SOLO' | 'LEADER';
    coreTenGod: string;            // 중심 십신 (예: 식신/상관, 정재/편재 등)
    dominantElement: string;       // 중심 오행 (예: 화(火), 수(水) 등)
    temperamentSummary: string;    // 선천적 비즈니스 기질 요약
    businessStrengths: string[];   // 3대 핵심 비즈니스 무기
    primaryBusiness: NtsBusinessItem;   // 주업종 (메인 비즈니스)
    secondaryBusiness: NtsBusinessItem; // 부업종 (수익 다각화 비즈니스)
    roadmap: NtsRoadmapStep[];     // 3단계 창업 로드맵
    hometaxGuide: {
        registrationOrder: string[];
        simpleTaxBenefit: string;
        mandatoryDocuments: string[];
    };
}

// -------------------------------------------------------------
// 국세청 공식 표준 업종 DB (12대 핵심 현대 비즈니스)
// -------------------------------------------------------------
const NTS_DATABASE: Record<string, NtsBusinessItem> = {
    // 1. 식상 발달: 크리에이터 / SW / 제조
    CREATOR_940306: {
        industryCode: '940306',
        mainCategory: '정보통신업',
        subCategory: '1인 미디어 콘텐츠 창작자 (유튜브·인스타·숏폼)',
        businessType: '1인 미디어 크리에이터 & 콘텐츠 지식 IP',
        fitScore: 96,
        matchReason: '식상(食傷)의 독창적 표현력과 수(水)·화(火)의 전파력이 결합되어 영상 및 디지털 콘텐츠 제작에 최적화된 기질입니다.',
        executionTips: [
            '초기에는 인적용역 프리랜서(3.3%)로 출발 후, 연 매출 2,400만원 초과 시 사업자등록 전환 권장',
            '자체 콘텐츠로 팬덤을 구축한 후 굿즈 제작 또는 강의 비즈니스로 파이프라인 확장'
        ],
        permitRequirements: '별도 인허가 불필요 (스튜디오/직원 고용 시 과세사업자 921505로 등록)',
        taxTips: '청년창업중소기업 세액감면(수도권 과밀억제권역 외 100%, 내 50%) 최대 5년간 소득세 감면 대상'
    },
    SOFTWARE_722000: {
        industryCode: '722000',
        mainCategory: '정보통신업',
        subCategory: '소프트웨어 개발 및 공급업 (SaaS·앱·솔루션)',
        businessType: 'IT 서비스 & AI 테크 솔루션 개발',
        fitScore: 94,
        matchReason: '금(金)의 구조적 논리력과 식상(食傷)의 엔지니어링 구현력이 결합되어 디지털 솔루션을 직접 구축하는 데 강력합니다.',
        executionTips: [
            'MVP(최소기능제품)를 1개월 내에 론칭하여 고객 피드백 기반 빠른 애자일 이터레이션 실행',
            'B2B 기업용 소프트웨어 라이선스 또는 정기 구독(SaaS) 모델로 안정적 현금흐름 창출'
        ],
        permitRequirements: '별도 인허가 불필요 (정부 R&D 및 벤처인증 신청 시 높은 가산점)',
        taxTips: '연구인력개발비 세액공제(중소기업 25%) 및 창업중소기업 세액감면 적용 가능'
    },
    FOOD_TAKEOUT_552123: {
        industryCode: '552123',
        mainCategory: '숙박 및 음식점업',
        subCategory: '간이 음식 포장 판매 전문점 (밀키트·포장디저트)',
        businessType: '소자본 테이크아웃 & 프리미엄 디저트 델리',
        fitScore: 91,
        matchReason: '식신(食神)의 미각적 감각과 토(土)의 정직한 식자재 가공 능력이 결합되어 미식 브랜드 론칭에 유리합니다.',
        executionTips: [
            '오프라인 홀 매장 대신 배달/포장/스마트스토어 밀키트 판매 위주로 고정비(임대료) 최소화',
            '인스타그램 감성 비주얼 패키징으로 2030 선물용 디저트 시장 공략'
        ],
        permitRequirements: '보건증 발급, 위생교육 이수 후 시/군/구청 식품접객업(일반음식점/휴게음식점) 영업신고증 필수',
        taxTips: '초기 시설 인테리어 및 주방기기 부가세 매입세액공제를 위해 세금계산서 100% 수취 필수'
    },

    // 2. 재성 발달: 이커머스 / 유통 / 금융
    ECOMMERCE_525101: {
        industryCode: '525101',
        mainCategory: '도매 및 소매업',
        subCategory: '전자상거래 소매업 (스마트스토어·쿠팡·자사몰)',
        businessType: '온라인 이커머스 & 트렌드 유통 셀러',
        fitScore: 97,
        matchReason: '재성(財星)의 시장 가격 분석력과 화(火)의 트렌드 포착력이 결합되어 상품 소싱 및 온라인 판매에 탁월합니다.',
        executionTips: [
            '초기 무재고 위탁판매로 시작하여 잘 팔리는 상위 20% 상품을 OEM/사입으로 전환하여 마진율 극대화',
            '상세페이지에 심리학적 구매 트리거(사회적 증거, 희소성) 장치 필수 탑재'
        ],
        permitRequirements: '정부24 통신판매업 신고 필수 (간이과세자는 직전연도 공급대가 4,800만원 미만 시 면제)',
        taxTips: '연 매출 8,000만원 미만 시 간이과세자 혜택(낮은 부가세율) 적용 가능'
    },
    OVERSEAS_PURCHASE_525105: {
        industryCode: '525105',
        mainCategory: '도매 및 소매업',
        subCategory: '해외직구대행업 (글로벌 소싱 구매대행)',
        businessType: '글로벌 구매대행 & 해외 유통 브로커리지',
        fitScore: 93,
        matchReason: '역마살(驛馬)의 글로벌 기운과 편재(偏財)의 환율/시세 차익 감각이 결합되어 무재고 소싱에 강점을 발휘합니다.',
        executionTips: [
            '타오바오, 아마존, 라쿠텐 등 틈새 카테고리(취미용품, 산업부품, 희귀의류) 핀포인트 소싱',
            '배송대행지(배대지) 2곳 이상 분산 계약으로 품절/배송지연 리스크 방어'
        ],
        permitRequirements: '통신판매업 신고 필수 + 수입식품/건강기능식품 취급 시 수입식품등 인터넷구매대행업 영업등록 필요',
        taxTips: '순수 판매금액이 아닌 [판매가 - 해외원가 - 해외배송비 = 수수료]에 대해서만 매출로 인정받는 소명 관리 철저'
    },
    FIN_ADVISORY_671201: {
        industryCode: '671201',
        mainCategory: '금융 및 보험업',
        subCategory: '투자 자문 및 자산관리 컨설팅',
        businessType: '자산 관리 & 금융 재테크 포트폴리오 자문',
        fitScore: 90,
        matchReason: '정재(正財)의 치밀한 리스크 관리와 금(金)의 수치 정밀성이 결합되어 신뢰도 높은 자산 설계에 적합합니다.',
        executionTips: [
            '개인 맞춤형 절세/연금/부동산 포트폴리오 분석 리포트 유료 구독 모델화',
            '사주 재운 흐름과 결합한 심층 자산관리 코칭으로 대체 불가한 포지셔닝 선점'
        ],
        permitRequirements: '유사투자자문업 신고 또는 관련 금융 라이선스 요건 확인 필요',
        taxTips: '전문 용역 서비스로 초기 부가세 조기환급 및 출장/자료수집 경비 처리 최적화'
    },

    // 3. 관성 발달: 경영컨설팅 / B2B / 프로젝트 대행
    CONSULTING_741400: {
        industryCode: '741400',
        mainCategory: '전문, 과학 및 기술 서비스업',
        subCategory: '경영 컨설팅업 (전략·조직·인사·브랜딩)',
        businessType: 'B2B 기업 전략 & 경영 시스템 자문',
        fitScore: 98,
        matchReason: '정관(正官)의 조직 통솔력과 토(土)의 중립적 조율 감각이 결합되어 기업의 시스템 문제를 해결하는 데 최적화되었습니다.',
        executionTips: [
            '스타트업/중소기업 대상 1:1 진단 컨설팅 패키지(월정액 리테이너) 계약 추진',
            '성공 사례(Case Study) 중심의 백서 및 리포트를 배포하여 인바운드 B2B 리드 획득'
        ],
        permitRequirements: '별도 인허가 불필요 (인증기관 심사원 자격 보유 시 단가 급상승)',
        taxTips: '대표자 1인 지식서비스업으로 시설 감가상각 없이 높은 영업이익률 및 법인 전환 유리'
    },
    EVENT_AGENCY_749907: {
        industryCode: '749907',
        mainCategory: '사업시설 관리, 사업 지원 및 임대 서비스업',
        subCategory: '행사 기획 및 대행업 (MICE·컨퍼런스·팝업스토어)',
        businessType: '문화 예술 행사 & 비즈니스 프로젝트 총괄 대행',
        fitScore: 92,
        matchReason: '편관(偏官)의 위기 돌파력과 화(火)의 화려한 무대 기획력이 결합되어 돌발 상황이 많은 프로젝트 총괄에 탁월합니다.',
        executionTips: [
            '지자체/공공기관 입찰(나라장터) 참여 및 기업 팝업스토어 프로젝트 턴키 수주',
            '사전 타임라인 및 비상 대응 매뉴얼 템플릿화로 외주 파트너사 일괄 조율'
        ],
        permitRequirements: '별도 인허가 불필요 (공공 입찰 시 기업신용평가등급 관리 필요)',
        taxTips: '행사 용역비 외주 정산 시 원천징수(3.3%) 및 세금계산서 수수 관리 철저'
    },

    // 4. 인성 발달: 교육 / 심리코칭 / 지식출판
    EDUCATION_ADVISORY_930921: {
        industryCode: '930921',
        mainCategory: '교육 서비스업',
        subCategory: '교육관련 자문 및 평가업 (커리어·입시·멘토링)',
        businessType: '지식 멘토링 & 1:1 역량 평가 진단',
        fitScore: 98,
        matchReason: '정인(正印)의 학문적 깊이와 목(木)의 육성·양육 본능이 결합되어 사람을 가르치고 잠재력을 깨우는 천직입니다.',
        executionTips: [
            '사주 십신 기반의 독자적인 직무 적성 진단 툴을 패키징하여 1회 15~30만원 선결제 코칭 진행',
            '검증된 진단 리포트를 PDF 전자책 및 VOD 온라인 강의로 확장(원소스 멀티유즈)'
        ],
        permitRequirements: '별도 인허가 불필요 (오프라인 다수인 교습 시 학원/교습소 등록 필요, 1:1 온라인 컨설팅은 자유업)',
        taxTips: '도서출판/순수 교육용역의 경우 부가가치세 면세 혜택 적용 검토 가능'
    },
    COUNSELING_WELLNESS_851909: {
        industryCode: '851909',
        mainCategory: '보건업 및 사회복지 서비스업',
        subCategory: '심리상담 및 웰니스 힐링 센터 (비의료 상담)',
        businessType: '마인드케어 & 웰니스 라이프 코칭 센터',
        fitScore: 96,
        matchReason: '편인(偏印)의 깊은 직관력과 수(水)의 감정 공감력이 결합되어 내면의 상처를 치유하고 무의식을 리셋하는 데 최고입니다.',
        executionTips: [
            '뇌파 사운드, 호흡 테라피, 사주 자각을 결합한 3주 마인드 리셋 멤버십 프로그램 운영',
            '익명 보장 프라이빗 온라인 룸(Zoom/전용앱)을 통해 전국/해외 고객 유치'
        ],
        permitRequirements: '의료 행위가 아닌 비의료 심리상담/코칭 서비스는 자유업종으로 사업자등록 즉시 가능',
        taxTips: '상담실 공간 임차 시 임차료 및 상담 교구 경비 처리'
    },

    // 5. 비겁 발달: 1인 독립 프리랜서 / 전문 디자인
    SOLO_FREELANCER_940909: {
        industryCode: '940909',
        mainCategory: '협회 및 단체, 수리 및 기타 개인 서비스업',
        subCategory: '1인 프리랜서 독립 컨설팅 (기타 자영업)',
        businessType: '1인 독립 전문가 & 퍼스널 브랜딩 프리랜서',
        fitScore: 97,
        matchReason: '비견/겁재(比劫)의 강한 주체성과 금(金)의 타협 없는 고집이 결합되어 조직에 얽매이지 않는 1인 독립 기업에 가장 적합합니다.',
        executionTips: [
            '나만의 고유 강점을 극대화한 퍼스널 브랜드 웹사이트 구축 및 크몽/숨고 프리미엄 전문가 등록',
            '단순 시급제 노동을 지양하고 프로젝트 단위 성과보수 계약으로 단가 점진적 인상'
        ],
        permitRequirements: '별도 인허가 불필요 (3.3% 사업소득자 또는 일반과세 사업자등록 선택 가능)',
        taxTips: '연간 수입 4,800만원 이하 시 단순경비율 적용으로 간편 소득세 신고 가능'
    },
    SPECIAL_DESIGN_742202: {
        industryCode: '742202',
        mainCategory: '전문, 과학 및 기술 서비스업',
        subCategory: '전문 디자인업 (시각·브랜드·UI/UX 디자인)',
        businessType: '브랜드 아이덴티티 & 디지털 UI/UX 디자인 스튜디오',
        fitScore: 94,
        matchReason: '식상(食傷)의 예술적 감각과 목(木)의 심미안이 결합되어 시각적 가치를 창조하는 디자인 비즈니스에 유리합니다.',
        executionTips: [
            '비핸스(Behance), 핀터레스트 기반 고품질 포트폴리오 아카이브 구축',
            '초기 창업가를 위한 [로고 + 브랜드 가이드 + 웹사이트] 올인원 디자인 패키지 상품화'
        ],
        permitRequirements: '별도 인허가 불필요 (산업디자인전문회사 등록 시 공공 디자인 용역 입찰 가능)',
        taxTips: '디자인 장비(MacBook, 태블릿, 모니터) 및 소프트웨어 구독료(Adobe, Figma) 100% 경비 처리'
    }
};

// -------------------------------------------------------------
// 사주 데이터 기반 국세청 비즈니스 프로파일 계산 함수
// -------------------------------------------------------------
export function calculateNtsBusinessProfile(userProfile: any): NtsBusinessProfile {
    const userName = userProfile?.userName || userProfile?.name || '명심가';
    const saju = userProfile?.saju || {};
    
    // 오행 및 십신 분석
    const ohaengScores = saju?.ohaengScores || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
    const tenGods = saju?.tenGods || { output: 2, wealth: 2, power: 1, resource: 2, self: 1 };
    
    // 최고 점수 십신 파악
    const maxTenGodScore = Math.max(
        tenGods.output || 0,
        tenGods.wealth || 0,
        tenGods.power || 0,
        tenGods.resource || 0,
        tenGods.self || 0
    );

    let primaryArchetype: NtsBusinessProfile['primaryArchetype'] = 'MAKER';
    let archetypeTitle = '식상생재형 트렌드 메이커';
    let coreTenGod = '식신 / 상관 (창의와 구현)';
    let dominantElement = '화(火) · 수(水) 순환';
    let temperamentSummary = '기존의 틀에 갇히기보다 새로운 아이디어를 시각화하고 세상에 발산하는 메이커형 기질이 가장 뛰어납니다.';
    let businessStrengths = [
        '트렌드를 빠르게 캐치하여 즉시 상품화하는 번뜩이는 실행력',
        '고객의 감성을 자극하는 독창적인 콘텐츠 스토리텔링 능력',
        '초기 자본을 최소화하고 디지털로 확장하는 린(Lean) 비즈니스 감각'
    ];

    let primaryBusiness = NTS_DATABASE.CREATOR_940306;
    let secondaryBusiness = NTS_DATABASE.ECOMMERCE_525101;

    // 분기 1: 재성 우세 (유통 / 금융 / 플랫폼)
    if (tenGods.wealth >= maxTenGodScore && tenGods.wealth > 1) {
        primaryArchetype = 'PLATFORM';
        archetypeTitle = '재성 중심형 디지털 유통 & 플랫폼 아키텍트';
        coreTenGod = '정재 / 편재 (유통과 자산 운용)';
        dominantElement = '금(金) · 토(土) 결집';
        temperamentSummary = '시장의 수요와 가격 흐름을 정확히 읽어내고, 자본과 상품을 회전시켜 부가가치를 창출하는 상업적 수완이 탁월합니다.';
        businessStrengths = [
            '마진율과 손익분기점(BEP)을 치밀하게 계산하는 탁월한 재무 감각',
            '공급망(소싱처)과 판매 채널을 다각화하는 유통 네트워크 구축력',
            '재고 리스크를 분산하고 현금흐름을 방어하는 안정적 운영 능력'
        ];
        primaryBusiness = NTS_DATABASE.ECOMMERCE_525101;
        secondaryBusiness = NTS_DATABASE.OVERSEAS_PURCHASE_525105;
    }
    // 분기 2: 관성 우세 (경영자문 / B2B 대행)
    else if (tenGods.power >= maxTenGodScore && tenGods.power > 1) {
        primaryArchetype = 'LEADER';
        archetypeTitle = '관성 리더십형 B2B 전략 컨설턴트';
        coreTenGod = '정관 / 편관 (조직 관리와 시스템 조율)';
        dominantElement = '토(土) · 금(金) 규율';
        temperamentSummary = '고객사 및 공공기관과의 신뢰 구축 능력이 뛰어나며, 복잡한 프로젝트를 시스템적으로 정돈하고 통솔하는 기질입니다.';
        businessStrengths = [
            'B2B 기업 및 공공기관의 공식 프로세스를 꿰뚫어 보는 제도권 장악력',
            '다양한 이해관계자를 하나로 묶어내는 중재 및 협상 리더십',
            '장기적인 신뢰 관계를 바탕으로 고단가 용역 계약을 수주하는 브랜드 권위'
        ];
        primaryBusiness = NTS_DATABASE.CONSULTING_741400;
        secondaryBusiness = NTS_DATABASE.EVENT_AGENCY_749907;
    }
    // 분기 3: 인성 우세 (교육 / 웰니스 / 심리코칭)
    else if (tenGods.resource >= maxTenGodScore && tenGods.resource > 1) {
        primaryArchetype = 'CONSULTANT';
        archetypeTitle = '인성 지식형 웰니스 & 교육 멘토 아키텍트';
        coreTenGod = '정인 / 편인 (지식 자산과 치유 직관)';
        dominantElement = '목(木) · 수(水) 양육';
        temperamentSummary = '사람들의 내면적 결핍과 성장 욕구를 정확히 진단하고, 지식과 통찰을 통해 인생의 방향을 재정렬해주는 멘토형 기질입니다.';
        businessStrengths = [
            '전문 지식과 심리 통찰을 체계적인 교육 커리큘럼으로 구조화하는 능력',
            '고객의 깊은 고민을 경청하고 무의식의 엉킨 실타래를 풀어주는 공감 파워',
            '전자책, VOD, 1:1 세션 등 지식 자산(IP)을 영구히 레버리지하는 사업 모델'
        ];
        primaryBusiness = NTS_DATABASE.EDUCATION_ADVISORY_930921;
        secondaryBusiness = NTS_DATABASE.COUNSELING_WELLNESS_851909;
    }
    // 분기 4: 비겁 우세 (1인 독립 기업 / 전문 기술)
    else if (tenGods.self >= maxTenGodScore && tenGods.self > 1) {
        primaryArchetype = 'EXPERT_SOLO';
        archetypeTitle = '비겁 주권형 1인 독립 비즈니스 마스터';
        coreTenGod = '비견 / 겁재 (주체성과 독립적 전문성)';
        dominantElement = '금(金) · 목(木) 결단';
        temperamentSummary = '누구의 간섭도 받지 않는 1인 독립 체제에서 가장 폭발적인 몰입력과 품질을 선보이는 프로페셔널 기질입니다.';
        businessStrengths = [
            '타협하지 않는 장인정신과 압도적인 기술 완성도',
            '조직의 불필요한 의사결정 낭비 없이 1인 체제로 초고속 론칭하는 스피드',
            '퍼스널 브랜드 파워를 바탕으로 대체 불가능한 고부가가치 전문가 포지셔닝'
        ];
        primaryBusiness = NTS_DATABASE.SOLO_FREELANCER_940909;
        secondaryBusiness = NTS_DATABASE.SPECIAL_DESIGN_742202;
    }

    // 3단계 창업 로드맵 생성
    const roadmap: NtsRoadmapStep[] = [
        {
            stage: '1단계: [0 to 1] 무자본 린 기획 & 1인 MVP 검증기',
            duration: '초기 1~3개월',
            coreAction: `${primaryBusiness.subCategory} 관련 1인 핵심 서비스/상품 1개를 정의하고, 홈택스 업종코드(${primaryBusiness.industryCode})를 준비하여 초기 고객 10명 피드백 수집`,
            sajuAdvantage: `${coreTenGod}의 강점을 활용하여 초기 고정비(임대료·인건비) 0원으로 시작`,
            riskDefense: '과도한 설비 투자 금지, 100% 선주문/선결제 방식으로 현금 유동성 확보'
        },
        {
            stage: '2단계: [1 to 10] 공식 사업자등록 & 마케팅 엔진 가동기',
            duration: '3~6개월 차',
            coreAction: `홈택스 정식 사업자등록 완료 + ${secondaryBusiness.subCategory}(${secondaryBusiness.industryCode}) 부업종 추가를 통한 2중 수익 파이프라인 구축`,
            sajuAdvantage: '주업종의 브랜딩 효과와 부업종의 현금흐름이 상생하여 사업 안정성 200% 상승',
            riskDefense: '월별 세무 장부(매입/매출 증빙) 자동화 세팅으로 종합소득세 폭탄 방어'
        },
        {
            stage: '3단계: [10 to 100] 지식 자산화 & 자동화 시스템 확장기',
            duration: '6~12개월 이후',
            coreAction: '나의 비즈니스 노하우를 패키징하여 구독 모델 또는 파트너십 외주 시스템으로 전환, 내가 일하지 않아도 돌아가는 시스템 구축',
            sajuAdvantage: '사주 대운의 상승 흐름을 타고 개인 사업자에서 법인 전환 또는 상표권 IP 자산화',
            riskDefense: '권한 위임 시 계약서 및 비밀유지서약(NDA) 철저 작성으로 내부 기밀 유출 방어'
        }
    ];

    return {
        userName,
        archetypeTitle,
        primaryArchetype,
        coreTenGod,
        dominantElement,
        temperamentSummary,
        businessStrengths,
        primaryBusiness,
        secondaryBusiness,
        roadmap,
        hometaxGuide: {
            registrationOrder: [
                '1. 국세청 홈택스(hometax.go.kr) 접속 ➔ [국세증명·사업자등록] ➔ [개인 사업자등록 신청]',
                `2. 주업종 입력: 업종코드 [${primaryBusiness.industryCode}] 검색 후 선택 (${primaryBusiness.mainCategory} / ${primaryBusiness.subCategory})`,
                `3. 부업종 입력: 업종코드 [${secondaryBusiness.industryCode}] 추가 선택 (${secondaryBusiness.mainCategory} / ${secondaryBusiness.subCategory})`,
                '4. 사업장 소재지: 자택 주소로 무상 등록 가능 (임대차계약서 없이 주민등록상 주소지 활용 가능)',
                '5. 과세유형 선택: 초기 연 매출 8,000만원 미만 예상 시 [간이과세자] 선택 (부가세 절세)'
            ],
            simpleTaxBenefit: '연간 공급대가 8,000만원 미만 시 간이과세자로 등록하면 부가가치세 부담이 일반과세자 대비 최대 70% 이상 절감됩니다.',
            mandatoryDocuments: [
                '본인 신분증 (홈택스 간편인증으로 대체 가능)',
                '임대차계약서 사본 (사업장을 별도로 임차한 경우에만 필요, 자택 등록 시 불필요)',
                '인허가 신고증 (해당 업종에 한함)'
            ]
        }
    };
}
