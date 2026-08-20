/**
 * ntsBusinessRecommender.ts
 * 국세청 표준산업분류 기준 업태/종목 및 6자리 홈택스 업종코드 1:1 매핑 엔진
 * + [명심 비즈니스 4대 실행 영역] (마케팅·시장성, 인사·조직, 재무·세무, 정부지원사업 타겟팅)
 * + 중소벤처기업부 표준 PSST 사업계획서 프레임워크 & 창업 멘탈 웰니스 엔진
 */

export type StartupStageType = 'solo_pre' | 'early_team' | 're_founder';

export interface NtsCodeDetail {
    code: string;
    title: string;
    businessModel: string;
    categoryGroup?: string; // '코어 엔진 (주)', '신뢰 자산 (주)', 'IP 자산화 (부)', '수익 확장 (부)'
}

export interface NtsBusinessSection {
    sectionTitle: string;
    badge: string;
    matchReason: string;
    mainCategory: string; // 업태
    subCategories: NtsCodeDetail[]; // 종목 리스트 (6자리 코드 포함)
    realWorldApplication: string; // 실전 비즈니스 적용
    colorTheme: 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose';
}

export interface PillarProfileItem {
    pillarName: string; // '일간/일지', '월간/월지' 등
    ganji: string;      // '신사(辛巳)', '계미(癸未)' 등
    tenGodLabel: string;// '정관 巳火 / 辛金 일간'
    corePower: string;  // '정밀한 분석력과 공신력·시스템'
    desc: string;
}

export interface NtsScaleUpStep {
    phase: string;        // 'Foundation (신뢰 구축)', 'Productization (제품화)', 'Ecosystem (플랫폼화)'
    keyword: string;      // '공신력 확보', '디지털 프로덕트 구축' 등
    coreAction: string;   // 실행 가이드
    sajuEngine: string;   // 활용되는 사주 기운
    leveragePoint: string;// 레버리지 포인트
}

export interface BurnoutEnergyGuide {
    cognitiveTrap: {
        title: string;
        risk: string;
        prescription: string;
    }[];
    dailyRhythmProtocol: {
        timeSlot: string;
        energyFocus: string;
        action: string;
        sajuElement: string;
    }[];
}

// 명심 비즈니스 4대 실행 영역 융합 진단
export interface MyeongsimBusiness4Areas {
    marketing: {
        sajuEngine: string; // '식상(癸水) + 재성(乙木)'
        targetCustomer: string;
        salesChannel: string;
        conversionStrategy: string;
    };
    hrOrg: {
        sajuEngine: string; // '비겁(庚申) + 관성(巳火)'
        idealTeamRole: string;
        conflictTrigger: string;
        delegationProtocol: string;
    };
    financeTax: {
        sajuEngine: string; // '인성(未土) + 관성(巳火)'
        taxReductionRate: string;
        recommendedLocation: string;
        legalStructure: string;
    };
    govSupportTarget: {
        recommendedPrograms: { name: string; targetFunding: string; tip: string }[];
        competitivenessScore: number;
    };
}
export type ManagementConsultant4Areas = MyeongsimBusiness4Areas; // 하위 호환성 유지

// 중기부 표준 PSST 사업계획서 뼈대
export interface PsstBlueprint {
    problem: {
        title: string;
        marketPainPoint: string;
        urgency: string;
    };
    solution: {
        title: string;
        coreMvp: string;
        differentiation: string;
    };
    scaleUp: {
        title: string;
        businessModel: string;
        expansionRoadmap: string;
    };
    team: {
        title: string;
        founderStrength: string;
        recommendedHiring: string;
    };
}

export interface NtsBusinessArchitectureReport {
    stage: StartupStageType;
    userName: string;
    sajuSummaryText: string;
    identityTitle: string;          // 예: "지식 IP 기반 솔루션 아키텍트 & 플랫폼 빌더"
    slogan: string;
    pillarBreakdowns: PillarProfileItem[];
    coreCompetencies: {
        title: string;
        tenGodFormula: string;
        description: string;
    }[];
    businessArchitectureMap: {
        infra: string;
        solution: string;
        contentIp: string;
        targetPlatform: string;
    };
    taxonomyTable: {
        classification: string;   // '코어 엔진 (주)', '신뢰 자산 (주)', 'IP 자산화 (부)', '수익 확장 (부)'
        mainIndustry: string;     // 추천 국세청 업태
        subIndustryAndCodes: { name: string; code: string }[]; // 세부 종목명 및 업종코드
        businessModel: string;    // 비즈니스 모델 연계
        colorTheme: 'amber' | 'emerald' | 'cyan' | 'purple';
    }[];
    primaryBusiness1: NtsBusinessSection; // 주업종 1 (메인 인프라)
    primaryBusiness2: NtsBusinessSection; // 주업종 2 (전문 솔루션 & 자문)
    secondaryBusiness: NtsBusinessSection;// 부업종 (콘텐츠 & IP & 교육)
    burnoutGuide: BurnoutEnergyGuide;      // Step 3: 번아웃 방지 & 에너지 효율화 가이드
    hometaxRegistrationGuide: {
        mainSelection: string; // 주업태 / 주종목 권장안
        subSelections: string[]; // 부업태 / 부종목 권장 리스트
        adminChecklist: { step: string; place: string; action: string }[];
        taxBenefits: string;
    };
    scaleUpRoadmap: NtsScaleUpStep[];
    
    // [NEW] 명심 비즈니스 4대 핵심 실행 영역 & PSST 사업계획서
    consultant4Areas: ManagementConsultant4Areas;
    psstBlueprint: PsstBlueprint;
    
    chatAssitantPrompts: { title: string; prompt: string; icon: string }[];
}

// -------------------------------------------------------------
// 1. [1인 지식기업 / 예비창업자] 롤모델 리포트
// -------------------------------------------------------------
export const PRE_STARTUP_REPORT: NtsBusinessArchitectureReport = {
    stage: 'solo_pre',
    userName: '명심가 (예비창업자)',
    sajuSummaryText: '경신년(庚申) · 계미월(癸未) · 신사일(辛巳) · 을미시(乙未)',
    identityTitle: '지식 IP 기반 1인 솔루션 아키텍트 & 부트스트래퍼',
    slogan: '나만의 전문 지식을 디지털 프로덕트와 표준 코드로 전환하여 무자본으로 시작하는 1인 기업가',
    pillarBreakdowns: [
        {
            pillarName: '일간 / 일지 (Core Identity)',
            ganji: '신사 (辛巳)',
            tenGodLabel: '신금(辛金) 일간 + 사화(巳火) 정관',
            corePower: '정밀한 분석력(辛金)과 제도권 공신력·시스템(巳火)',
            desc: '원칙과 정확성을 바탕으로 신뢰도 높은 표준 프로토콜과 품질 관리 체계를 구축하는 본원적 역량.'
        },
        {
            pillarName: '월간 / 월지 (Social Weapon)',
            ganji: '계미 (癸未)',
            tenGodLabel: '계수(癸水) 식신 + 미토(未土) 편인',
            corePower: '특화된 지식·전문성(未土)과 직관적 솔루션 표출(癸水)',
            desc: '방대한 데이터와 심도 있는 이론을 자신만의 프레임워크와 알고리즘으로 명쾌하게 가공해내는 필살기.'
        },
        {
            pillarName: '시간 / 시지 (Future Asset)',
            ganji: '을미 (乙未)',
            tenGodLabel: '을목(乙木) 편재 + 미토(未土) 목고(木庫)',
            corePower: '지식의 자산화·수익 다각화(乙木)와 축적된 DB(未土)',
            desc: '단발성 용역을 넘어 출판, VOD, 툴, 구독 모델 등 지식재산권(IP)을 다각화하여 지속적 부를 창출하는 창구.'
        },
        {
            pillarName: '년간 / 년지 (Global Infrastructure)',
            ganji: '경신 (庚申)',
            tenGodLabel: '경금(庚金) · 신금(申金) 간여지동 겁재',
            corePower: '스케일업 인프라 잠재력(庚申)',
            desc: '향후 파트너십과 커뮤니티 확장을 통해 1인 기업에서 플랫폼으로 진화할 수 있는 강력한 씨앗.'
        }
    ],
    coreCompetencies: [
        {
            title: '1. 무자본 지식 프로덕트화',
            tenGodFormula: '식신(癸水) + 편인(未土)',
            description: '재고 부담 없이 노션 템플릿, 전자책, 진단 툴킷 등 디지털 자산을 즉각 패키징하는 능력.'
        },
        {
            title: '2. 공신력 중심 B2B 자문 앵커링',
            tenGodFormula: '정관(巳火) + 신금(辛金)',
            description: '단순 강의를 넘어 기업이 신뢰할 수 있는 공식 인증 프로토콜과 평가 보고서 납품 역량.'
        },
        {
            title: '3. 멀티 파이프라인 수익 창출',
            tenGodFormula: '편재(乙木) + 신사(辛巳)',
            description: '1회성 상담료가 아닌 지식 라이선스, 디지털 판매, 정기 구독의 다채널 수익 구조화.'
        }
    ],
    businessArchitectureMap: {
        infra: '정보통신 / 소프트웨어 / 데이터베이스 (724000)',
        solution: '전문 경영·심리 컨설팅 / 1:1 진단 자문 (741400)',
        contentIp: '단행본·전자책 출판 (581101) / 온라인 VOD 교육 (930921)',
        targetPlatform: '1인 부트스트래핑 지식 플랫폼'
    },
    taxonomyTable: [
        {
            classification: '코어 엔진 (주)',
            mainIndustry: '정보통신업',
            subIndustryAndCodes: [
                { name: '데이터베이스 및 온라인정보 제공업', code: '724000' },
                { name: '응용 소프트웨어 개발 및 공급업', code: '722000' }
            ],
            businessModel: '온라인 심리·진로 진단 웹 서비스, 데이터 기반 코칭 SaaS 플랫폼',
            colorTheme: 'emerald'
        },
        {
            classification: '신뢰 자산 (주)',
            mainIndustry: '전문, 과학 및 기술 서비스업',
            subIndustryAndCodes: [
                { name: '경영 컨설팅업', code: '741400' },
                { name: '인문 및 사회과학 연구개발업', code: '732002' }
            ],
            businessModel: 'B2B 기업 리더십 진단, 1:1 프리미엄 경영·커리어 솔루션 자문 용역',
            colorTheme: 'cyan'
        },
        {
            classification: 'IP 자산화 (부)',
            mainIndustry: '출판 및 교육 서비스업',
            subIndustryAndCodes: [
                { name: '일반서적 출판업 (전자책 포함)', code: '581101' },
                { name: '교육관련 자문 및 평가업', code: '930921' }
            ],
            businessModel: '도서·e-Book 발행, 온라인 VOD 클래스, 전문 워크숍 및 라이선스',
            colorTheme: 'purple'
        },
        {
            classification: '수익 확장 (부)',
            mainIndustry: '도매 및 소매업',
            subIndustryAndCodes: [
                { name: '전자상거래 소매업', code: '525101' }
            ],
            businessModel: '디지털 템플릿(Notion/PDF), 웰니스 교구재 및 다이어리 온라인 판매',
            colorTheme: 'amber'
        }
    ],
    primaryBusiness1: {
        sectionTitle: '메인 코어 엔진: 지식 데이터베이스 & SaaS',
        badge: '주업종 1순위 (추천)',
        matchReason: '癸水(식신)의 직관적 솔루션과 辛金(정밀성)을 디지털 시스템으로 전환',
        mainCategory: '정보통신업',
        colorTheme: 'emerald',
        subCategories: [
            { code: '724000', title: '데이터베이스 및 온라인정보 제공업', businessModel: '1:1 진단 플랫폼, 유료 인사이트 구독' },
            { code: '722000', title: '응용 소프트웨어 개발 및 공급업', businessModel: '웰니스 진단 알고리즘 웹 애플리케이션' }
        ],
        realWorldApplication: '사용자가 생년월일과 고민을 입력하면 맞춤 알고리즘으로 자동 분석 리포트를 제공하는 SaaS'
    },
    primaryBusiness2: {
        sectionTitle: '신뢰 자산 엔진: B2B 경영 컨설팅 & R&D',
        badge: '주업종 2순위 (공신력)',
        matchReason: '巳火(정관)의 제도권 공신력과 辛金(전문 분석력)의 결합',
        mainCategory: '전문, 과학 및 기술 서비스업',
        colorTheme: 'cyan',
        subCategories: [
            { code: '741400', title: '경영 컨설팅업', businessModel: '스타트업 팀 진단, B2B 조직 코칭' },
            { code: '732002', title: '인문 및 사회과학 연구개발업', businessModel: '사주·기질 분석 프레임워크 연구용역' }
        ],
        realWorldApplication: '기업 고객에게 리더십 진단 및 조직 케미스트리 분석 보고서를 납품하는 고단가 용역'
    },
    secondaryBusiness: {
        sectionTitle: 'IP 자산화 엔진: 출판, 교육 및 커머스',
        badge: '부업종 (수익 다각화)',
        matchReason: '未土(편인/지식창고)에 축적된 콘텐츠를 乙木(편재)로 현금 흐름화',
        mainCategory: '출판 / 교육 / 전자상거래',
        colorTheme: 'purple',
        subCategories: [
            { code: '581101', title: '일반서적 출판업', businessModel: '종이책, 전자책(e-Book), 오디오북 출판' },
            { code: '930921', title: '교육관련 자문 및 평가업', businessModel: '온라인 코칭 과정, 전문가 양성 워크숍' },
            { code: '525101', title: '전자상거래 소매업', businessModel: '디지털 템플릿, 웰니스 플래너 온라인 유통' }
        ],
        realWorldApplication: '단행본 출간을 통한 브랜드 권위 확보 ➔ VOD 강의 ➔ 디지털 템플릿 판매로 이어지는 퍼널'
    },
    burnoutGuide: {
        cognitiveTrap: [
            {
                title: '완벽주의(辛金)로 인한 론칭 지연',
                risk: '100% 완벽한 콘텐츠를 만들려다 시장 피드백을 놓치고 탈진',
                prescription: '60% 완성도에서 MVP(최소기능제품)로 먼저 배포하고, 고객 피드백을 통해 80%로 업데이트'
            },
            {
                title: '감정 소모형 1:1 코칭 과다',
                risk: '모든 고객을 1:1 대면 상담으로만 대응하여 시간과 에너지가 고갈',
                prescription: '자주 묻는 질문과 기초 진단은 자동화 리포트(724000) 및 VOD로 전환하고 1:1은 프리미엄으로 한정'
            }
        ],
        dailyRhythmProtocol: [
            {
                timeSlot: '오전 09:00 ~ 12:00 (황금 몰입기)',
                energyFocus: '지식 설계 & MVP 개발',
                action: '외부 연락을 차단하고 계수(식신)의 창의적 설계 및 콘텐츠 기획에 몰입',
                sajuElement: '계수(식신) · 미토(편인)'
            },
            {
                timeSlot: '오후 14:00 ~ 17:00 (시스템 루틴기)',
                energyFocus: '행정·세무·고객 응대',
                action: '사화(정관)의 원칙적 관리 역량으로 사업자등록, 결제 시스템 점검, 파트너 소통',
                sajuElement: '사화(정관)'
            },
            {
                timeSlot: '저녁 19:00 ~ 21:00 (에너지 회복 & 인출)',
                energyFocus: '성과 리뷰 & 지식 아카이빙',
                action: '을목(편재)의 부가가치 점검 및 미토(지식창고)에 하루의 인사이트를 기록하고 휴식',
                sajuElement: '을목(편재) · 미토(목고)'
            }
        ]
    },
    // Step 4: 원클릭 실전 행정 & 인허가 블루프린트
    hometaxRegistrationGuide: {
        mainSelection: '정보통신업 / 데이터베이스 및 온라인정보 제공업 (724000)',
        subSelections: [
            '전문, 과학 및 기술 서비스업 / 경영 컨설팅업 (741400)',
            '출판업 / 일반서적 출판업 (581101) ※ 지자체 출판사 신고 후 추가',
            '교육 서비스업 / 교육관련 자문 및 평가업 (930921)',
            '도매 및 소매업 / 전자상거래 소매업 (525101)'
        ],
        adminChecklist: [
            { step: '1단계 (관할 지자체)', place: '시·군·구청 문화체육과', action: '출판사 등록신고 및 신고필증 수령 (출판업 영위 시 선행 필수)' },
            { step: '2단계 (국세청 홈택스)', place: 'hometax.go.kr', action: '주업종 [724000] 및 부업종 [741400, 581101, 930921, 525101] 일괄 사업자등록' },
            { step: '3단계 (정부24)', place: 'gov.kr', action: '통신판매업 신고 완료 (온라인 결제 및 디지털 콘텐츠 다운로드 판매 시 필수)' }
        ],
        taxBenefits: '정보통신업(SW/데이터베이스) 및 전문·과학·기술 서비스업은 중소기업 창업 감면 대상 업종에 포함되어, 청년/수도권 과밀억제권역 외 창업 시 소득세·법인세를 5년간 최대 50~100% 전액 감면받을 수 있는 극도로 유리한 코드 조합입니다.'
    },
    // Step 5: 3단계 스케일업 로드맵 (Zero to Infinity)
    scaleUpRoadmap: [
        {
            phase: 'Step 1. Foundation (신뢰 구축)',
            keyword: '사화(정관) · 미토(편인) 발동',
            coreAction: '저서 집필 및 전문 라이선스 확보로 시장 내 독점적 포지셔닝과 압도적 공신력 선점',
            sajuEngine: '정관(巳火)의 신뢰성과 편인(未土)의 학문적 깊이를 결합하여 초기 1인 브랜드 앵커링',
            leveragePoint: '책 1권으로 수백 명의 잠재 고객을 인바운드로 끌어들이는 신뢰 레버리지'
        },
        {
            phase: 'Step 2. Productization (제품화)',
            keyword: '계수(식신) · 신금(辛金) 발동',
            coreAction: '1:1 대면 코칭을 자동화된 디지털 진단 도구(SaaS), VOD 강의 및 디지털 툴킷으로 전환',
            sajuEngine: '식신(癸水)의 정밀한 로직과 신금(辛金)의 디테일한 완성도로 24시간 자동 동작 시스템 완성',
            leveragePoint: '나의 시간이 투입되지 않아도 매출이 일어나는 디지털 프로덕트 레버리지'
        },
        {
            phase: 'Step 3. Ecosystem (플랫폼화)',
            keyword: '경신(겁재) · 을목(편재) 발동',
            coreAction: '파트너 코치 양성, B2B 엔터프라이즈 제휴, 커뮤니티 확장을 통한 레버리지 극대화',
            sajuEngine: '겁재(庚申)의 인프라 파워와 편재(乙木)의 거대한 시장 회전력으로 지식 기업 엑시트/스케일업',
            leveragePoint: '타인의 시간과 거대한 네트워크를 레버리지하는 플랫폼 생태계 파워'
        }
    ],
    consultant4Areas: {
        marketing: {
            sajuEngine: '식상(癸水) + 재성(乙木)',
            targetCustomer: '자신의 천직과 최적 업종을 찾고 싶어하는 지식 창업자 및 커리어 전환자',
            salesChannel: '자가진단 무료 리포트 ➔ 뉴스레터/단행본 ➔ 프리미엄 B2B 자문 퍼널',
            conversionStrategy: '국세청 6자리 표준 코드 무료 매핑으로 신뢰를 얻고, 심층 컨설팅으로 업셀링'
        },
        hrOrg: {
            sajuEngine: '비겁(庚申) + 관성(巳火)',
            idealTeamRole: '1인 총괄 기획자 (콘텐츠/로직/세일즈 총괄) + 외주 개발/디자인 파트너십',
            conflictTrigger: '외주 작업물의 정밀도 부족 시 스트레스 급증 (신금 완벽주의)',
            delegationProtocol: '구체적인 체크리스트와 표준 프로토콜 문서를 사전에 제공하여 감정 소모 차단'
        },
        financeTax: {
            sajuEngine: '인성(未土) + 관성(巳火)',
            taxReductionRate: '청년 창업 시 5년간 소득세 100% 감면 (수도권 과밀억제권역 외 724000 코드 적용 시)',
            recommendedLocation: '비과밀억제권역 비상주 공유오피스 활용하여 세액감면 극대화',
            legalStructure: '초기 간이과세/일반과세자 ➔ 연매출 1.5억 초과 시 법인 전환 검토'
        },
        govSupportTarget: {
            recommendedPrograms: [
                { name: '예비창업패키지 (중기부)', targetFunding: '최대 1억 원 (평균 5,000만 원)', tip: '기질 데이터 기반 AI 맞춤 진단 SaaS BM으로 지원 시 높은 점수' },
                { name: '청년창업사관학교', targetFunding: '최대 1억 원 + 사업공간', tip: '지식 IP 소프트웨어 및 코칭 시스템 자동화 모델로 제안' },
                { name: '신사업창업사관학교 (소진공)', targetFunding: '최대 4,000만 원', tip: '온오프라인 융합 웰니스 지식 콘텐츠 커머스로 접근' }
            ],
            competitivenessScore: 92
        }
    },
    psstBlueprint: {
        problem: {
            title: '1. 문제 인식 (Problem)',
            marketPainPoint: '기존 진로·사주 상담의 지나친 추상성(운세 풀이에 그침)과 높은 비용, 1회성 상담 후 실행 불가능',
            urgency: '창업 준비생 및 N잡러의 87%가 자신의 적성에 맞는 구체적 업태·종목과 행정 절차를 몰라 시간과 자금을 낭비함'
        },
        solution: {
            title: '2. 실현 가능성 (Solution)',
            coreMvp: '사주 인지과학 분석 엔진을 국세청 6자리 업종코드와 1:1 매핑하여 3초 만에 사업화 로드맵을 도출하는 AI 웹 플랫폼',
            differentiation: '명심 비즈니스 4대 실행 영역과 연계된 원클릭 행정/세무 가이드 및 PSST 사업계획서 뼈대 자동 생성 기술'
        },
        scaleUp: {
            title: '3. 성장 전략 (Scale-up)',
            businessModel: '1) 무료 진단 기반 리드 수집 ➔ 2) 심층 리포트 및 AI 챗봇 유료 구독 ➔ 3) B2B 조직 진단 솔루션 납품',
            expansionRoadmap: '1년차: 지식 IP 단행본 출간 및 1인 SaaS 론칭 ➔ 2년차: B2B 기업 리더십 진단 프로그램 확장'
        },
        team: {
            title: '4. 팀 구성 (Team)',
            founderStrength: '신사(辛巳)의 정밀 시스템 설계력 + 계미(癸未)의 심층 지식 가공력 보유한 솔루션 아키텍트',
            recommendedHiring: '초기: 프론트엔드/백엔드 풀스택 파트너 1인 ➔ 성장기: B2B 세일즈 및 콘텐츠 마케터 영입'
        }
    },
    chatAssitantPrompts: [
        {
            title: '1. 1인 MVP 론칭 전략',
            icon: '🚀',
            prompt: '내 기질에서 정보통신업(724000)을 주업종으로 잡고 첫 달에 무자본으로 론칭할 수 있는 1인 지식 MVP 모델을 구체화해줘.'
        },
        {
            title: '2. 청년창업 100% 감면 행정',
            icon: '🏛️',
            prompt: '국세청 홈택스 사업자등록 시 724000과 741400을 묶어 5개년 소득세 감면을 최대로 받는 비상주 사업장 등록 팁을 알려줘.'
        },
        {
            title: '3. 예비창업패키지 PSST 작성',
            icon: '📝',
            prompt: '내 명식의 강점을 반영하여 예비창업패키지 사업계획서(PSST)의 [문제 인식]과 [실현 가능성] 항목의 스토리라인 초안을 써줘.'
        }
    ]
};

// -------------------------------------------------------------
// 2. [초기 스타트업 / 팀 빌딩] 롤모델 리포트
// -------------------------------------------------------------
export const EARLY_STARTUP_REPORT: NtsBusinessArchitectureReport = {
    ...PRE_STARTUP_REPORT,
    stage: 'early_team',
    userName: '명심가 (스타트업 대표)',
    identityTitle: '스케일업 플랫폼 아키텍트 & 테크 스타트업 파운더',
    slogan: '팀의 다차원 기질을 동기화하고 기술과 인프라를 레버리지하여 폭발적 성장을 만드는 스타트업 리더',
    consultant4Areas: {
        marketing: {
            sajuEngine: '식상(癸水) + 재성(乙木) + 겁재(庚申)',
            targetCustomer: '조직 생산성 혁신 및 직원 번아웃 예방을 원하는 IT/스타트업/대기업 HR 부서',
            salesChannel: 'B2B SaaS 무료 트라이얼 ➔ 기업 진단 데모데이 ➔ 연간 엔터프라이즈 구독 계약',
            conversionStrategy: '부서별 기질 케미스트리 진단 무료 워크숍 제공 후 전사 솔루션 도입 유도'
        },
        hrOrg: {
            sajuEngine: '겁재(庚申) + 정관(巳火)',
            idealTeamRole: 'CEO (비전/전략/시스템 설계) + CTO (엔지니어링) + COO (오퍼레이션/HR)',
            conflictTrigger: '역할(R&R) 모호성 및 마이크로매니징으로 인한 핵심 팀원 이탈 리스크',
            delegationProtocol: '사화(정관)의 OKR 시스템을 정립하고, 세부 실행 권한은 庚申(팀원)에게 100% 위임'
        },
        financeTax: {
            sajuEngine: '편재(乙木) + 정관(巳火)',
            taxReductionRate: '창업중소기업 세액감면(50~100%) + 벤처기업 인증 시 취득세/재산세 감면',
            recommendedLocation: '판교/강남 테크 밸리 또는 수도권 외 테크노파크 거점',
            legalStructure: '주식회사 설립 및 스톡옵션 풀(10~15%) 사전 설계'
        },
        govSupportTarget: {
            recommendedPrograms: [
                { name: '초기창업패키지 (중기부)', targetFunding: '최대 1억 원', tip: 'PMF(제품-시장 적합성) 검증 데이터 및 B2B 유료 고객 확보 전략 강조' },
                { name: 'TIPS(민관공동창업자금)', targetFunding: 'R&D 최대 5억 + 연계 2억', tip: 'AI 기질 분석 알고리즘 및 멘탈케어 데이터 독창성 특허 부각' },
                { name: '중기부 디딤돌 R&D 지원사업', targetFunding: '최대 1.2억 원', tip: '생체신호 연계형 바이오 웰니스 알고리즘 기술 개발 과제로 신청' }
            ],
            competitivenessScore: 96
        }
    },
    psstBlueprint: {
        problem: {
            title: '1. 문제 인식 (Problem)',
            marketPainPoint: '원격근무 확산 및 스타트업 고성장 과정에서 팀원 간 갈등과 번아웃으로 인한 핵심 인재 퇴사율 38% 육박',
            urgency: '단순 심리상담(EAP)은 사후 처방에 불과하여, 입사 단계부터 기질적 케미스트리를 진단하고 예방하는 솔루션 부재'
        },
        solution: {
            title: '2. 실현 가능성 (Solution)',
            coreMvp: '다차원 기질 설계도 기반 팀 빌딩 최적화 & 실시간 갈등 예방 B2B 웰니스 SaaS (명심 OS)',
            differentiation: '동양 명리 인지과학과 서양 성격유형론을 융합한 독자적 특허 알고리즘 및 실시간 AI 코칭'
        },
        scaleUp: {
            title: '3. 성장 전략 (Scale-up)',
            businessModel: '임직원 1인당 월 9,900원의 B2B SaaS 구독료 + 프리미엄 팀 코칭 워크숍 업셀링',
            expansionRoadmap: '국내 1,000개 테크 스타트업 도입 ➔ 글로벌 HR Tech 시장(미국/일본) 진출'
        },
        team: {
            title: '4. 팀 구성 (Team)',
            founderStrength: '시스템 아키텍처(辛巳) 및 데이터 알고리즘(癸未) 전문성을 갖춘 연쇄 창업가',
            recommendedHiring: 'B2B 엔터프라이즈 세일즈 리드 및 AI/ML 데이터 사이언티스트'
        }
    },
    chatAssitantPrompts: [
        {
            title: '1. 팀 갈등 예방 & R&R 분배',
            icon: '👥',
            prompt: '대표인 나의 신사(辛巳) 기질과 개발팀장(화/토 과다) 사이의 소통 마찰을 줄이고 최적의 R&R을 분배하는 법을 알려줘.'
        },
        {
            title: '2. 초기창업패키지/TIPS 전략',
            icon: '💡',
            prompt: '초기창업패키지 서류 심사 통과를 위해 우리 BM의 [기술적 차별성]과 [스케일업 지표]를 강조하는 문장을 작성해줘.'
        },
        {
            title: '3. B2B 엔터프라이즈 영업 퍼널',
            icon: '📈',
            prompt: '기업 HR 담당자에게 제안할 [조직 케미스트리 & 번아웃 예방 프로그램]의 1장짜리 콜드메일 제안서 초안을 써줘.'
        }
    ]
};

// -------------------------------------------------------------
// 3. [재창업 / 피봇팅] 롤모델 리포트
// -------------------------------------------------------------
export const RE_FOUNDER_REPORT: NtsBusinessArchitectureReport = {
    ...PRE_STARTUP_REPORT,
    stage: 're_founder',
    userName: '명심가 (재도전 기업가)',
    identityTitle: '리스크 분산형 피봇팅 마스터 & 턴어라운드 디렉터',
    slogan: '과거의 실패 경험을 최고의 지적 자산으로 전환하여 리스크 없는 견고한 현금 흐름을 재구축하는 사업가',
    consultant4Areas: {
        marketing: {
            sajuEngine: '편인(未土) + 편재(乙木)',
            targetCustomer: '동일한 실패와 번아웃을 겪고 있는 재도전 창업자, 소상공인, 리스크 회피형 사업가',
            salesChannel: '실패 디브리핑 인사이트 콘텐츠 ➔ 고관여 턴어라운드 마스터마인드 ➔ 비즈니스 피봇팅 컨설팅',
            conversionStrategy: '실패 비용을 90% 줄여주는 무자본 지식 비즈니스 구조 전환 프레임워크 제공'
        },
        hrOrg: {
            sajuEngine: '신금(辛金) + 사화(巳火)',
            idealTeamRole: '린(Lean) 조직: 대표 1인 핵심 의사결정 + 검증된 프로젝트 단위 프리랜서 네트워크',
            conflictTrigger: '과도한 고정비(인건비/임대료) 지출로 인한 심리적 압박감 재발',
            delegationProtocol: '모든 고정비를 변동비화하고, 성과 공유형 파트너십 계약으로 리스크 분산'
        },
        financeTax: {
            sajuEngine: '정관(巳火) + 미토(未土)',
            taxReductionRate: '재창업자 신용회복 지원 및 중소벤처기업진흥공단 재도전 자금 연계',
            recommendedLocation: '창업보육센터/재도전성공센터 입주로 임대료 및 인프라 비용 제로화',
            legalStructure: '성실경영평가 통과 후 재창업 전용 법인 설립 및 채무 분리'
        },
        govSupportTarget: {
            recommendedPrograms: [
                { name: '재도전성공패키지 (중기부)', targetFunding: '최대 1억 원 (평균 6,000만 원)', tip: '과거 실패 원인의 철저한 분석(디브리핑) 및 리스크 헷징된 신규 BM 강조' },
                { name: '중진공 재창업자금 (융자)', targetFunding: '최대 5억 원 (저금리 정책자금)', tip: '고정비 최소화된 지식 서비스 및 플랫폼 매출 모델로 상환 안전성 어필' },
                { name: '소상공인 희망리턴패키지', targetFunding: '재창업 사업화 최대 2,000만 원', tip: '디지털 전환 및 전자상거래/온라인정보제공업 피봇팅 계획 제시' }
            ],
            competitivenessScore: 94
        }
    },
    psstBlueprint: {
        problem: {
            title: '1. 문제 인식 (Problem)',
            marketPainPoint: '과거 하드웨어/과도한 초기 투자로 인한 실패 경험 분석: 높은 고정비와 시장 수요 검증 실패',
            urgency: '재도전 창업자의 72%가 과거 실패의 심리적 트라우마와 자금 부족으로 새로운 도전을 주저함'
        },
        solution: {
            title: '2. 실현 가능성 (Solution)',
            coreMvp: '과거 축적된 전문 지식과 노하우를 자산화한 무자본 지식 IP & 자동화 진단 플랫폼 피봇팅',
            differentiation: '인건비와 서버비 외 고정비가 0원에 수렴하며, 런칭 첫 주부터 영업이익률 85% 이상 달성 가능한 BM'
        },
        scaleUp: {
            title: '3. 성장 전략 (Scale-up)',
            businessModel: '검증된 지식 콘텐츠 D2C 판매 ➔ 턴어라운드 컨설팅 용역 ➔ 구독형 진단 플랫폼 전환',
            expansionRoadmap: '초기 6개월: 손익분기점 달성 및 월 현금흐름 2,000만 원 확보 ➔ 2년차: 정부 재도전 자금 유치'
        },
        team: {
            title: '4. 팀 구성 (Team)',
            founderStrength: '산전수전의 실전 사업 경험 + 辛巳(정밀 시스템) 기반의 빈틈없는 리스크 관리 역량',
            recommendedHiring: '초기 무고용 1인 체제 ➔ 수익 발생 후 퍼포먼스 마케터 및 운영 매니저 계약직 영입'
        }
    },
    chatAssitantPrompts: [
        {
            title: '1. 과거 실패 디브리핑 & 피봇팅',
            icon: '🔄',
            prompt: '과거 내 사업의 실패 요인을 명식의 인지적 함정(辛金 완벽주의, 무리한 확장) 관점에서 객관화하고 신규 BM을 도출해줘.'
        },
        {
            title: '2. 재도전성공패키지 사업계획서',
            icon: '🛡️',
            prompt: '중기부 [재도전성공패키지] 합격을 위해 [과거 실패원인 분석 및 개선 방안]을 설득력 있게 작성해줘.'
        },
        {
            title: '3. 고정비 제로화 턴어라운드',
            icon: '💎',
            prompt: '직원 채용 없이 순수 지식 IP와 국세청 6자리 코드를 활용해 월 순익을 가장 빠르게 만드는 턴어라운드 로드맵을 알려줘.'
        }
    ]
};

// -------------------------------------------------------------
// [NEW] 1분 완성 창업 진단 질문지 (Intake Form) 인터페이스
// -------------------------------------------------------------
export interface StartupIntakeAnswers {
    stage: 'pre_startup' | 'early_stage' | 're_founder'; // Q1. 창업 단계
    businessType: 'knowledge_ip' | 'platform_it' | 'b2b_consulting' | 'commerce_goods'; // Q2. 비즈니스 형태
    problemKeyword: string; // Q3. 해결할 시장 결핍/문제점
    solutionKeyword: string; // Q4. 고객에게 제공할 핵심 가치/솔루션
    biggestBottleneck: 'funding_plan' | 'team_hr' | 'marketing_sales' | 'mental_burnout'; // Q5. 현재 가장 큰 결핍
}

export interface MyeongsimOnePointCheck {
    recommendedMainCode: string;
    recommendedMainTitle: string;
    taxBenefitStatus: string;
    requiredPermits: string[];
    recommendedGovPrograms: { name: string; targetFunding: string; tip: string }[];
}
export type ManagementOnePointCheck = MyeongsimOnePointCheck; // 호환성 유지

export interface PersonalizedPsstReport {
    sajuSummaryText: string;
    identityTitle: string;
    intakeAnswers: StartupIntakeAnswers;
    problem: {
        title: string;
        marketPainPoint: string;
        founderMotivation: string;
        urgency: string;
    };
    solution: {
        title: string;
        coreMvp: string;
        differentiation: string;
        techMilestone: string;
    };
    scaleUp: {
        title: string;
        businessModel: {
            b2c: string;
            b2b: string;
            b2g: string;
        };
        gtmStrategy: string;
    };
    team: {
        title: string;
        founderStrength: string;
        hrComplementPlan: string;
    };
    onePointCheck: MyeongsimOnePointCheck;
}

// -------------------------------------------------------------
// [HELPER] 사주 데이터가 문자열 또는 객체인 경우 안전하게 한자/문자 추출
// -------------------------------------------------------------
export function extractChar(val: any, fallback: string = ''): string {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
        return val.hanja || val.char || val.name || val.stem || val.branch || val.label || fallback;
    }
    return String(val) || fallback;
}

export function parseSajuFourPillars(saju: any) {
    if (!saju) {
        return {
            yGan: '庚', yJi: '申',
            mGan: '癸', mJi: '未',
            dGan: '辛', dJi: '巳',
            tGan: '乙', tJi: '未',
            summaryText: '庚申년 · 癸未월 · 辛巳일 · 乙未시'
        };
    }

    const fp = saju.fourPillars || {};
    const yp = saju.yearPillar || saju.year_pillar || fp.year || {};
    const mp = saju.monthPillar || saju.month_pillar || fp.month || {};
    const dp = saju.dayPillar || saju.day_pillar || fp.day || {};
    const tp = saju.hourPillar || saju.hour_pillar || saju.timePillar || fp.time || {};

    const yGan = extractChar(yp.gan !== undefined ? yp.gan : yp.stem, '庚');
    const yJi = extractChar(yp.ji !== undefined ? yp.ji : yp.branch, '申');

    const mGan = extractChar(mp.gan !== undefined ? mp.gan : mp.stem, '癸');
    const mJi = extractChar(mp.ji !== undefined ? mp.ji : mp.branch, '未');

    const dGan = extractChar(dp.gan !== undefined ? dp.gan : dp.stem, '辛');
    const dJi = extractChar(dp.ji !== undefined ? dp.ji : dp.branch, '巳');

    const tGan = extractChar(tp.gan !== undefined ? tp.gan : tp.stem, '乙');
    const tJi = extractChar(tp.ji !== undefined ? tp.ji : tp.branch, '未');

    const summaryText = `${yGan}${yJi}년 · ${mGan}${mJi}월 · ${dGan}${dJi}일 · ${tGan}${tJi}시`;

    return { yGan, yJi, mGan, mJi, dGan, dJi, tGan, tJi, summaryText };
}

// -------------------------------------------------------------
// 사용자 사주 데이터를 분석하여 맞춤 리포트를 생성하는 통합 엔진
// -------------------------------------------------------------
export function generateNtsBusinessArchitecture(
    userProfile: any, 
    stage: StartupStageType = 'solo_pre'
): NtsBusinessArchitectureReport {
    const userName = userProfile?.userName || userProfile?.name || '명심가';
    const saju = userProfile?.saju || {};
    
    // 스테이지에 따른 기본 롤모델 데이터 선택
    let targetTemplate: NtsBusinessArchitectureReport;
    if (stage === 'early_team') {
        targetTemplate = EARLY_STARTUP_REPORT;
    } else if (stage === 're_founder') {
        targetTemplate = RE_FOUNDER_REPORT;
    } else {
        targetTemplate = PRE_STARTUP_REPORT;
    }

    const baseReport: NtsBusinessArchitectureReport = JSON.parse(JSON.stringify(targetTemplate));
    baseReport.userName = userName;

    // 사주 데이터가 있으면 안전하게 파싱하여 반영
    if (saju && (saju.fourPillars || saju.yearPillar || saju.year_pillar || saju.dayPillar || saju.day_pillar)) {
        const p = parseSajuFourPillars(saju);
        baseReport.sajuSummaryText = p.summaryText;

        // Pillar breakdown의 간지 텍스트도 동적 업데이트
        if (Array.isArray(baseReport.pillarBreakdowns) && baseReport.pillarBreakdowns.length >= 4) {
            baseReport.pillarBreakdowns[0].ganji = `${p.dGan}${p.dJi}`;
            baseReport.pillarBreakdowns[1].ganji = `${p.mGan}${p.mJi}`;
            baseReport.pillarBreakdowns[2].ganji = `${p.tGan}${p.tJi}`;
            baseReport.pillarBreakdowns[3].ganji = `${p.yGan}${p.yJi}`;
        }
    }

    return baseReport;
}

// -------------------------------------------------------------
// [NEW] 사주 기질 + 5문항 진단 답변 융합 ➔ 개인화 PSST 리포트 생성기
// -------------------------------------------------------------
export function generatePersonalizedPsstArchitecture(
    userProfile: any,
    answers: StartupIntakeAnswers
): PersonalizedPsstReport {
    const userName = userProfile?.userName || userProfile?.name || '명심가';
    const saju = userProfile?.saju || {};
    const p = parseSajuFourPillars(saju);
    const sajuSummaryText = p.summaryText;

    // 1. 업종 및 국세청 코드 매핑
    let mainCode = '724000';
    let mainTitle = '데이터베이스 및 온라인정보 제공업';
    let requiredPermits = ['통신판매업 신고 (지자체)'];
    let taxBenefit = '창업중소기업 세액감면 대상 업종 (수도권 과밀억제권역 외 창업 시 5개년 소득세/법인세 최대 50~100% 감면)';

    if (answers.businessType === 'knowledge_ip') {
        mainCode = '724000';
        mainTitle = '데이터베이스 및 온라인정보 제공업 / 전자출판';
        requiredPermits = ['통신판매업 신고', '출판사 등록신고 (도서/전자책 발행 시)'];
    } else if (answers.businessType === 'platform_it') {
        mainCode = '722000';
        mainTitle = '응용 소프트웨어 개발 및 공급업 (722000) / 데이터베이스 제공업 (724000)';
        requiredPermits = ['통신판매업 신고', '부가통신사업자 신고'];
        taxBenefit = '벤처기업 인증 및 소프트웨어 진흥법 세제 혜택 최대 100% 감면';
    } else if (answers.businessType === 'b2b_consulting') {
        mainCode = '741400';
        mainTitle = '경영 컨설팅업 (741400) / 교육관련 자문 및 평가업 (930921)';
        requiredPermits = ['통신판매업 신고 (온라인 교육 진행 시)', '원격평생교육원 인허가 (규모 확장 시)'];
    } else if (answers.businessType === 'commerce_goods') {
        mainCode = '525101';
        mainTitle = '통신판매업 / 전자상거래 소매업 (525101)';
        requiredPermits = ['통신판매업 신고', '식품위생교육 및 영업신고 (식품/건기식 취급 시)'];
    }

    // 2. 창업 단계별 추천 지원사업 매핑
    let govPrograms: { name: string; targetFunding: string; tip: string }[] = [];
    if (answers.stage === 'pre_startup') {
        govPrograms = [
            { name: '중기부 예비창업패키지 (일반/특화)', targetFunding: '최대 1억 원 (평균 5,000만 원)', tip: '기질 데이터 기반 지식 IP 및 솔루션 자동화 BM 강조' },
            { name: '소진공 신사업창업사관학교', targetFunding: '최대 4,000만 원 (사업화 자금)', tip: '온오프라인 융합 웰니스 콘텐츠 및 코칭 서비스 제안' },
            { name: '청년창업사관학교 (만 39세 이하)', targetFunding: '최대 1억 원 + 입주 공간', tip: 'SaaS 솔루션 아키텍처 및 1인 지식 기업 스케일업' }
        ];
    } else if (answers.stage === 'early_stage') {
        govPrograms = [
            { name: '중기부 초기창업패키지', targetFunding: '최대 1억 원 (평균 7,000만 원)', tip: 'PMF(제품 시장 적합성) 검증 지표 및 B2B 유료 고객 확보 전략 어필' },
            { name: 'TIPS (민관공동창업자금)', targetFunding: 'R&D 최대 5억 + 사업화 2억', tip: '특허 알고리즘 및 AI 인지과학 기반 멘탈케어 기술성 강조' },
            { name: '중기부 디딤돌 첫걸음 R&D', targetFunding: '최대 1.2억 원', tip: '기질 분석 및 바이오 웰니스 솔루션 연구개발 과제 신청' }
        ];
    } else {
        govPrograms = [
            { name: '중기부 재도전성공패키지 (지식서비스)', targetFunding: '최대 1억 원 (평균 6,000만 원)', tip: '과거 실패 원인의 철저한 디브리핑 및 리스크 헷징된 무자본 BM 부각' },
            { name: '중진공 재창업자금 (융자)', targetFunding: '최대 5억 원 (저금리 정책자금)', tip: '고정비 최소화된 지식 서비스 모델로 안정적 상환 계획 제시' },
            { name: '소상공인 희망리턴패키지', targetFunding: '재창업 사업화 최대 2,000만 원', tip: '디지털 전환 및 온라인 정보제공업 피봇팅' }
        ];
    }

    // 3. 결핍(Bottleneck)별 HR 보완 처방
    let hrPlan = '';
    if (answers.biggestBottleneck === 'funding_plan') {
        hrPlan = '자금 조달 및 사업계획서 작성을 신속히 완료하기 위해, PSST 프레임워크 뼈대를 기반으로 표준 정량 지표 작성을 우선하고 전문 멘토링 풀을 활용합니다.';
    } else if (answers.biggestBottleneck === 'team_hr') {
        hrPlan = '대표자의 과도한 완벽주의와 행정 리소스 소모를 방어하기 위해 프론트엔드 개발 및 퍼포먼스 마케팅 파트는 파트너십 또는 검증된 외주 풀(Pool)로 세팅하여 에너지 누수를 차단합니다.';
    } else if (answers.biggestBottleneck === 'marketing_sales') {
        hrPlan = '초기 세일즈 전환율을 극대화하기 위해 1-Page 무료 진단 리포트를 활용한 오가닉 리드 수집 퍼널을 최우선 가동하고, 콘텐츠 마케팅 외주 파트너와 성과 공유형 협업을 구축합니다.';
    } else {
        hrPlan = '대표자의 번아웃 예방을 위해 매일 오전 황금 몰입 시간에만 코어 기획을 진행하고, 고객 응대와 행정은 표준 프로토콜 템플릿으로 자동화하여 심리적 안전지대를 확보합니다.';
    }

    const problemDesc = answers.problemKeyword || '기존 솔루션의 지나친 추상성과 높은 비용, 1회성 상담 후 실제 실행 불가능한 실행 공백(Execution Gap)';
    const solutionDesc = answers.solutionKeyword || '기질 데이터 기반 표준 행정 코드 자동 매핑 및 3초 만에 사업화 로드맵을 완성하는 AI 솔루션 플랫폼';

    return {
        sajuSummaryText,
        identityTitle: `${userName} 대표의 [${answers.businessType === 'knowledge_ip' ? '지식 IP 기반 1인 솔루션 기업' : answers.businessType === 'platform_it' ? 'AI 웰니스 테크 플랫폼' : answers.businessType === 'b2b_consulting' ? 'B2B 전문 경영·인재 솔루션' : 'D2C 웰니스 커머스 기업'}]`,
        intakeAnswers: answers,
        problem: {
            title: '1. 문제 인식 (Problem & Motivation)',
            marketPainPoint: `시장 결핍: ${problemDesc}으로 인해 수많은 고객과 창업 준비생들이 막대한 시간과 자금을 낭비하고 제도권 비즈니스로 안착하지 못함.`,
            founderMotivation: `창업자 필연적 동기 (${p.mGan}${p.mJi}월 식신·인성 기질): 방대한 지식과 심리 메커니즘을 정밀하게 구조화할 수 있는 대표자의 선천적 인지 역량을 바탕으로, 시장의 비효율을 객관적 지표와 표준 코드로 해결해야 한다는 필연성을 절감하여 창업을 결심함.`,
            urgency: '단순 상담이나 단발성 콘텐츠는 사후 처방에 불과하여, 창업 진입 단계부터 표준화된 국세청 업종코드와 비즈니스 아키텍처를 원클릭으로 도출하는 혁신 플랫폼이 시급함.'
        },
        solution: {
            title: '2. 실현 가능성 (Solution & Architecture)',
            coreMvp: `핵심 솔루션 (${p.dGan}${p.dJi}일 정밀 시스템 기반): 사용자 기질 데이터를 표준 행정 분류로 자동 치환하는 엔진 구축 및 ${solutionDesc} 개발.`,
            differentiation: `차별화 요소: 단순 심리검사를 넘어 국가 공인 국세청 표준 코드(${mainCode}) 매핑, 세제 감면 혜택, 중기부 PSST 사업계획서 뼈대까지 1-Stop으로 제공하는 올인원(All-in-One) 솔루션.`,
            techMilestone: '1차: AI 1분 창업 진단 및 국세청 6자리 코드 자동 추천 웹 배포 ➔ 2차: 1:1 맞춤형 PSST 사업계획서 실시간 인터뷰 생성기 고도화.'
        },
        scaleUp: {
            title: '3. 성장 전략 & 수익 모델 (Scale-up & BM)',
            businessModel: {
                b2c: '기본 엔진: 디지털 진단 리포트 및 지식 IP(전자책/VOD/툴킷) 자동화 판매',
                b2b: '수익 극대화: 기업 임직원 번아웃 방지 및 부서별 기질 케미스트리 조직 진단 컨설팅 용역',
                b2g: '스케일업: 공공 창업지원단 및 지자체 청년 창업 멘탈 웰니스 프로그램 납품'
            },
            gtmStrategy: '1단계: 1분 무료 진단 배포를 통한 초기 1만 명 잠재 고객 DB 확보 ➔ 2단계: 유료 프리미엄 심층 리포트 및 1:1 맞춤 사업적성 코칭 구독 전환.'
        },
        team: {
            title: '4. 팀 구성 및 조직 역량 (Team & HR)',
            founderStrength: `대표자 코어 역량 (${p.yGan}${p.yJi}년 클라우드 플랫폼 인프라 레버리지): 무거운 온프레미스 고정비 조직을 지양하고, 비물리적 디지털 시스템(AI·지식 IP·SaaS)과 분산 전문가 네트워크를 총괄하는 플랫폼 아키텍트 역량 보유.`,
            hrComplementPlan: `보완 및 스케일업 전략 (HR): ${hrPlan} (공망 리프레이밍: 사람을 직접 통제하는 수직적 고용 대신, 누구나 활동할 수 있는 열린 시스템 플랫폼을 제공하여 한계비용 제로로 스케일업)`
        },
        onePointCheck: {
            recommendedMainCode: mainCode,
            recommendedMainTitle: mainTitle,
            taxBenefitStatus: taxBenefit,
            requiredPermits,
            recommendedGovPrograms: govPrograms
        }
    };
}


