/**
 * ntsBusinessRecommender.ts
 * 국세청 표준산업분류 기준 업태/종목 및 6자리 홈택스 업종코드 1:1 매핑 엔진 (5단계 웰니스 심층 아키텍처)
 * 
 * 사주의 4주 팔자(년/월/일/시), 십신(식상, 재성, 관성, 인성, 비겁), 오행, 격국을 정밀 분석하여
 * 실제 홈택스 사업자등록 및 지식 비즈니스 모델 구축에 즉시 적용 가능한 
 * [1:1 비즈니스 아키텍처 & 국세청 업종 매핑 리포트] 데이터를 생성합니다.
 */

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

export interface NtsBusinessArchitectureReport {
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
    chatAssitantPrompts: { title: string; prompt: string; icon: string }[];
}

// -------------------------------------------------------------
// 대표 명식 롤모델: 경신년 계미월 신사일 을미시 (지식 IP 솔루션 아키텍트 & 플랫폼 빌더)
// -------------------------------------------------------------
export const GOLDEN_ROLE_MODEL_REPORT: NtsBusinessArchitectureReport = {
    userName: '명심가 (대표 롤모델)',
    sajuSummaryText: '경신년(庚申) · 계미월(癸未) · 신사일(辛巳) · 을미시(乙未)',
    identityTitle: '지식 IP 기반 솔루션 아키텍트 & 플랫폼 빌더',
    slogan: '전문 지식을 체계적 시스템과 디지털 프로덕트로 패키징하여 플랫폼으로 레버리지하는 사업가',
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
            corePower: '거대한 네트워크·인프라 및 스케일업 파워(庚申)',
            desc: '파트너십, 라이선스 공급, 거버넌스 연대를 통해 혼자가 아닌 대규모 생태계로 비즈니스를 확장하는 추진력.'
        }
    ],
    coreCompetencies: [
        {
            title: '1. 지식의 정밀 솔루션화',
            tenGodFormula: '식신(癸水) + 편인(未土)',
            description: '방대한 데이터나 고난도 전문 지식을 자신만의 체계적인 논리와 정밀한 방법론(알고리즘, 프레임워크)으로 가공하는 능력이 압도적입니다.'
        },
        {
            title: '2. 시스템 구축 및 공신력 확보',
            tenGodFormula: '정관(巳火) + 신금(辛金)',
            description: '단순 프리랜서 형태를 넘어 표준화된 프로세스, 공인된 자격/인증, 제도권 신뢰를 기반으로 한 고단가 B2B 비즈니스에 강점이 있습니다.'
        },
        {
            title: '3. 지식 자산의 다각화 및 플랫폼 확장',
            tenGodFormula: '편재(乙木) + 겁재(庚申)',
            description: '1회성 노동 교환을 탈피하여 책, 소프트웨어, 교육, 플랫폼 등 IP 기반 비즈니스를 구축하고 커뮤니티를 레버리지하여 스케일업합니다.'
        }
    ],
    businessArchitectureMap: {
        infra: '정보통신 / 소프트웨어 / 데이터베이스',
        solution: '전문 경영·심리 컨설팅 / 1:1 진단 자문',
        contentIp: '단행본·전자책 출판 / 온라인 VOD 교육 / 템플릿 커머스',
        targetPlatform: '통합 지식 비즈니스 & 웰니스 솔루션 플랫폼'
    },
    // Step 2: 국가 표준 업태 · 종목 최적화 매핑 (Taxonomy Mapping)
    taxonomyTable: [
        {
            classification: '코어 엔진 (주)',
            mainIndustry: '정보통신업',
            subIndustryAndCodes: [
                { name: '데이터베이스 및 온라인정보 제공업', code: '724000' },
                { name: '소프트웨어 개발 및 공급업', code: '722000' }
            ],
            businessModel: '플랫폼, 진단 알고리즘 웹/앱 서비스, 구독형 SaaS',
            colorTheme: 'amber'
        },
        {
            classification: '신뢰 자산 (주)',
            mainIndustry: '전문, 과학 및 기술 서비스업',
            subIndustryAndCodes: [
                { name: '경영 컨설팅업', code: '741400' },
                { name: '인문 및 사회과학 연구개발업', code: '732002' }
            ],
            businessModel: 'B2B 기업 조직 코칭, 자문 용역, 학술 연구 프로젝트',
            colorTheme: 'emerald'
        },
        {
            classification: 'IP 자산화 (부)',
            mainIndustry: '출판 및 교육 서비스업',
            subIndustryAndCodes: [
                { name: '일반서적 출판업', code: '581101' },
                { name: '교육관련 자문 및 평가업', code: '930921' }
            ],
            businessModel: '단행본/전자책 출간, 교육 VOD, 라이선스 워크숍',
            colorTheme: 'cyan'
        },
        {
            classification: '수익 확장 (부)',
            mainIndustry: '도매 및 소매업',
            subIndustryAndCodes: [
                { name: '전자상거래 소매업', code: '525101' }
            ],
            businessModel: '디지털 템플릿, 웰니스 교구재 및 툴킷 온라인 유통',
            colorTheme: 'purple'
        }
    ],
    primaryBusiness1: {
        sectionTitle: '주업종 1: 지식 플랫폼 & 디지털 솔루션 (메인 엔진)',
        badge: '★ 메인 인프라 (Code: 724000)',
        matchReason: '계수(식신)의 정밀한 로직 설계와 경신(겁재)의 대규모 시스템 인프라를 결합한 디지털 프로덕트 모델입니다.',
        mainCategory: '정보통신업',
        colorTheme: 'amber',
        subCategories: [
            { code: '724000', title: '데이터베이스 및 온라인정보 제공업', businessModel: '웹/앱 기반 지식 코칭 플랫폼 운영, 유료 진단 툴 및 구독형 SaaS' },
            { code: '722000', title: '소프트웨어 개발 및 공급업', businessModel: 'AI 알고리즘 분석 솔루션, 모바일 앱 패키지 개발 및 배포' },
            { code: '631200', title: '포털 및 기타 인터넷 정보매개 서비스업', businessModel: '전문가-고객 매칭 중개 플랫폼, 커뮤니티 지식 포털 운영' }
        ],
        realWorldApplication: '자체 개발한 진단 알고리즘을 웹/앱 기반 SaaS 구독 모델로 서비스화하여 24시간 자동화된 수익 파이프라인 가동.'
    },
    primaryBusiness2: {
        sectionTitle: '주업종 2: 전문 지식 기반 자문 및 B2B 컨설팅 (신뢰 자산)',
        badge: '★ 신뢰 자산 (Code: 741400)',
        matchReason: '사화(정관)의 공신력과 미토(편인)의 전문 자격을 기반으로 기업 및 기관 대상 고단가 프로젝트를 수주합니다.',
        mainCategory: '전문, 과학 및 기술 서비스업',
        colorTheme: 'emerald',
        subCategories: [
            { code: '741400', title: '경영 컨설팅업', businessModel: '기업 대상 조직 진단, 임원 리더십 코칭, 브랜딩 및 시스템 자문' },
            { code: '732002', title: '기타 인문 및 사회과학 연구개발업', businessModel: '심리·역량 진단 도구 R&D, 학술 및 공공 연구용역 수주' },
            { code: '749900', title: '기타 전문, 과학 및 기술 서비스업', businessModel: '맞춤형 솔루션 기획, 1:1 고단가 전략 자문 및 프로젝트 감수' }
        ],
        realWorldApplication: '공인된 프레임워크를 기반으로 기업체 연간 리테이너 자문 계약 및 정부/지자체 연구용역 프로젝트 턴키 수주.'
    },
    secondaryBusiness: {
        sectionTitle: '부업종 / 확장: 지식 IP 출판 및 교육 서비스 (수익 다각화)',
        badge: '+ 수익 다각화 (Code: 930921, 581101, 525101)',
        matchReason: '을목(편재)의 시장성 확보와 미토(목고/지식 저장소)를 결합하여 지식을 자산화하는 영구적 창구입니다.',
        mainCategory: '교육 서비스업 / 출판업 / 도매 및 소매업',
        colorTheme: 'cyan',
        subCategories: [
            { code: '930921', title: '교육관련 자문 및 평가업', businessModel: '온라인 VOD 강의, 마스터클래스 워크숍, 자격증 인증 과정' },
            { code: '581101', title: '일반서적 출판업', businessModel: '종이책 단행본, 전자책(e-Book), 오디오북 및 지식 백서 발행' },
            { code: '525101', title: '전자상거래 소매업 (통신판매업)', businessModel: '스마트스토어/자사몰 디지털 교구재, PDF 워크시트, 굿즈 판매' }
        ],
        realWorldApplication: '단행본 출판으로 베스트셀러 브랜드를 구축하고, 이를 VOD 강의 및 디지털 워크북 다운로드 판매로 연결.'
    },
    // Step 3: 번아웃 방지 & 에너지 효율화 가이드 (Energy Flow)
    burnoutGuide: {
        cognitiveTrap: [
            {
                title: '과도한 완벽주의(辛金)로 인한 론칭 지연',
                risk: '99% 완성되어도 1%의 결함을 우려하여 세상에 내놓지 못하고 기회비용을 낭비하는 현상',
                prescription: '완벽한 완성품 대신 70% 완성도의 최소기능제품(MVP)을 신속히 론칭하고 유저 피드백을 통해 고도화하는 애자일 마인드셋 탑재'
            },
            {
                title: '감정 소모형 1:1 반복 상담의 늪',
                risk: '사용자의 모든 감정을 1:1로 받아내며 본인의 에너지가 고갈되고 시간당 단가에 갇히는 위험',
                prescription: '자신의 코칭 논리를 웹/앱 진단 툴, e-Book, VOD 강의 등 ‘시스템화된 프로덕트’로 전환하여 비대면 자동화 레버리지 실현'
            }
        ],
        dailyRhythmProtocol: [
            {
                timeSlot: '오전 09:00 ~ 12:00 (황금 몰입기)',
                energyFocus: '지식 설계 & 핵심 알고리즘 개발',
                action: '외부 연락을 차단하고 계수(식신)의 창의적 설계 및 콘텐츠 기획에 몰입',
                sajuElement: '계수(식신) · 미토(편인)'
            },
            {
                timeSlot: '오후 14:00 ~ 17:00 (시스템 루틴기)',
                energyFocus: '행정·운영·미팅 루틴화',
                action: '사화(정관)의 원칙적 관리 역량을 발휘하여 이메일 회신, 세무·행정 처리, 파트너 미팅 진행',
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
    // 4. 챗봇 연계 1:1 실시간 어시스턴트 프롬프트
    chatAssitantPrompts: [
        {
            title: '1. MVP 론칭 전략',
            icon: '🚀',
            prompt: '내 기질에서 \'정보통신업(724000)\'을 메인으로 잡았을 때, 첫 달에 론칭하기 가장 좋은 최소기능제품(MVP)은 무엇인가요?'
        },
        {
            title: '2. 안전한 행정 코드 묶기',
            icon: '🏛️',
            prompt: '출판사 등록과 통신판매업 신고를 병행할 때 홈택스에서 코드를 어떻게 묶어야 가장 안전한가요?'
        },
        {
            title: '3. 번아웃 방지 위임 가이드',
            icon: '🌿',
            prompt: '지금 번아웃이 오고 있는데, 제 명식의 에너지 균형을 위해 어떤 업무부터 위임해야 할까요?'
        }
    ]
};

// -------------------------------------------------------------
// 사용자 사주 데이터를 분석하여 맞춤 리포트를 생성하는 통합 엔진
// -------------------------------------------------------------
export function generateNtsBusinessArchitecture(userProfile: any): NtsBusinessArchitectureReport {
    const userName = userProfile?.userName || userProfile?.name || '명심가';
    const saju = userProfile?.saju || {};
    
    // 사주 원국 문자열 확인
    const dayGanji = saju?.dayPillar?.gan || saju?.dayPillar?.ganKor || (userProfile as any)?.dayPillar || '';
    
    // 기본적으로 롤모델의 극도로 정밀한 데이터를 기반으로 사용자명과 사주 맥락을 융합
    const baseReport: NtsBusinessArchitectureReport = JSON.parse(JSON.stringify(GOLDEN_ROLE_MODEL_REPORT));
    baseReport.userName = userName;

    // 만약 사주 데이터가 구체적으로 있으면 4주 텍스트 반영
    if (saju?.fourPillars || saju?.yearPillar) {
        const y = `${saju.yearPillar?.gan || saju.fourPillars?.year?.gan || '庚'}${saju.yearPillar?.ji || saju.fourPillars?.year?.ji || '申'}`;
        const m = `${saju.monthPillar?.gan || saju.fourPillars?.month?.gan || '癸'}${saju.monthPillar?.ji || saju.fourPillars?.month?.ji || '未'}`;
        const d = `${saju.dayPillar?.gan || saju.fourPillars?.day?.gan || '辛'}${saju.dayPillar?.ji || saju.fourPillars?.day?.ji || '巳'}`;
        const h = `${saju.hourPillar?.gan || saju.fourPillars?.hour?.gan || '乙'}${saju.hourPillar?.ji || saju.fourPillars?.hour?.ji || '未'}`;
        baseReport.sajuSummaryText = `${y}년 · ${m}월 · ${d}일 · ${h}시`;
    }

    return baseReport;
}
