'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scale,
    Search,
    Layers,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    X,
    Brain,
    Shield,
    Flame,
    Zap,
    Table,
    LayoutGrid,
    ExternalLink,
    HelpCircle,
    Info,
    Send,
    Activity,
    Target,
    BookOpen,
    Compass,
    GraduationCap,
    Workflow,
    RefreshCw,
    Check,
    ChevronRight,
    Heart,
    Award
} from 'lucide-react';

export interface AssessmentItem {
    id: string;
    name: string;
    officialTrademarkNote?: string;
    category: 'cognitive' | 'behavior' | 'strength' | 'clinical' | 'symbolic';
    categoryLabel: string;
    whatItMeasures: string;
    typicalResult: string;
    respectfulHonor: string; // 각 검사의 학술적 기여와 고유성에 대한 존중
    commonWithMyeongsim: string;
    coreDifference: string;
    officialTestUrl: string;
    officialTestName: string;
    officialTestDesc: string;
    badgeColor: string;
    icon: string;
    highlight?: boolean;
}

export const ASSESSMENT_DATA: AssessmentItem[] = [
    {
        id: 'mbti',
        name: 'MBTI® (마이어스-브릭스 성격유형)',
        officialTrademarkNote: 'MBTI®는 The Myers & Briggs Foundation의 등록상표입니다.',
        category: 'cognitive',
        categoryLabel: '인지·선호',
        whatItMeasures: '에너지 방향(E/I), 정보 인식(S/N), 판단 기준(T/F), 생활 양식(J/P)의 심리적 선호',
        typicalResult: '16가지 성격 유형 프로파일 (INTJ, ENFP 등)',
        respectfulHonor: '융(C.G. Jung)의 심리유형론을 대중적으로 체계화하여 전 세계 수억 명에게 자기이해와 타인 존중의 기쁨을 선물한 기념비적 도구',
        commonWithMyeongsim: '타고난 심리적 선호와 고유한 인지 스타일을 이해하는 출발점',
        coreDifference: '선호 유형을 고정된 정체성으로 규정하기보다, 그 선호가 스트레스 시 언제 Dark Code(자동 방어기제)로 과출력되는지 관찰하고 유연하게 조율함',
        officialTestUrl: 'https://www.assesta.com',
        officialTestName: '한국MBTI연구소(어세스타) 공식 검사',
        officialTestDesc: '공인된 전문 기관의 정식 MBTI® Form M/Q 검사를 통해 가장 신뢰성 높은 본인 유형을 확인하실 수 있습니다.',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: '🧠',
        highlight: true
    },
    {
        id: 'big_five',
        name: 'Big Five (NEO-PI-R 성격특질)',
        officialTrademarkNote: '학술 심리학계의 표준 5요인 모델(OCEAN) 기반 평가도구입니다.',
        category: 'cognitive',
        categoryLabel: '인지·선호',
        whatItMeasures: '5대 성격특질의 강도 (외향성, 성실성, 개방성, 친화성, 정서안정성/신경성)',
        typicalResult: '5대 요인 백분위수 및 연속적 스펙트럼 프로파일',
        respectfulHonor: '수많은 실증 연구와 통계적 요인분석으로 입증된 현대 심리학계에서 가장 신뢰받는 표준 성격 특질 측정 체계',
        commonWithMyeongsim: '사람을 흑백 단일 유형이 아닌, 다차원적이고 연속적인 스펙트럼으로 섬세하게 조망',
        coreDifference: '특질의 강도 측정을 넘어, 특정 상황에서 특질이 촉발(Trigger)될 때 몸·생각·감정의 작동 순서를 자각(SCAN)하고 가치 중심 행동으로 전환(SHIFT)함',
        officialTestUrl: 'https://openpsychometrics.org/tests/IPIP-BFFM/',
        officialTestName: 'OpenPsychometrics IPIP Big-Five 공식 연구 포털',
        officialTestDesc: '학술 표준 IPIP 기반의 다차원 Big Five 특질 프로파일을 무료로 정밀하게 측정해보실 수 있습니다.',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: '📊'
    },
    {
        id: 'hexaco',
        name: 'HEXACO 모델',
        officialTrademarkNote: 'Kibeom Lee & Michael C. Ashton 교수의 6요인 성격 구조 모델입니다.',
        category: 'cognitive',
        categoryLabel: '인지·선호',
        whatItMeasures: '6대 성격특질 (정직-겸손성 H, 정서성 E, 외향성 X, 친화성 A, 성실성 C, 개방성 O)',
        typicalResult: '6개 차원 세부 척도 점수 프로파일',
        respectfulHonor: '기존 5요인에 ‘정직-겸손성(Honesty-Humility)’을 통합하여 도덕성과 권력 관계의 심리를 탁월하게 규명한 학술 모델',
        commonWithMyeongsim: '사람의 타고난 기질과 윤리적·관계적 에너지의 강약을 객관적으로 파악',
        coreDifference: '특질의 높고 낮음을 도덕적 우열로 평가하지 않고, 상황에 따른 에너지 출력 방향과 건강한 승화 방향을 함께 탐색',
        officialTestUrl: 'https://hexaco.org/',
        officialTestName: 'HEXACO 공식 연구소 웹 평가',
        officialTestDesc: '원저작자 연구팀의 공식 검사를 통해 6차원 성격 구조를 다국어로 정확히 진단받으실 수 있습니다.',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        icon: '💎'
    },
    {
        id: 'disc',
        name: 'DISC® 행동유형검사',
        officialTrademarkNote: 'DISC®는 John Wiley & Sons 및 공인 발행기관의 등록상표입니다.',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '행동 및 소통 스타일 (주도형 D, 사교형 I, 안정형 S, 신중형 C)',
        typicalResult: '상황별 우선적 행동 패턴 및 대인관계 프로파일',
        respectfulHonor: '비즈니스 현장과 조직 내 협업에서 서로 다른 행동 양식을 즉각 이해하고 소통을 극대화하도록 도운 실용적인 행동 모델',
        commonWithMyeongsim: '조직 및 관계에서 겉으로 드러나는 반복적 행동 패턴을 직관적으로 파악',
        coreDifference: '겉으로 관찰되는 행동 스타일을 넘어, 그 행동이 촉발되기 직전의 신체 감각, 무의식적 해석(Story), 내면의 생존 방어 패턴까지 조명',
        officialTestUrl: 'https://www.discprofile.com/',
        officialTestName: 'Everything DiSC® 공식 진단 포털',
        officialTestDesc: '글로벌 공인 기관의 정식 진단을 통해 비즈니스 현장에서의 정밀한 행동 스타일을 확인하실 수 있습니다.',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: '🤝',
        highlight: true
    },
    {
        id: 'enneagram',
        name: '에니어그램 (Enneagram)',
        officialTrademarkNote: 'The Enneagram Institute 및 세계에니어그램협회(IEA) 등에서 공인 발전된 모델입니다.',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '내면의 핵심 욕구, 근원적 두려움, 무의식적 방어기제와 3대 에너지 센터(장, 가슴, 머리)',
        typicalResult: '9가지 성격 유형, 날개(Wings), 통합/분열의 성장 방향',
        respectfulHonor: '단순한 외형적 행동을 넘어 인간 행동 이면의 깊은 결핍과 영적 성장 여정을 통찰력 있게 담아낸 심오한 내면 지도',
        commonWithMyeongsim: '무의식적 자동 반응 패턴, 근원적 두려움, 내적 성장 방향을 깊이 있게 다룸',
        coreDifference: '에니어그램의 깊은 동기 분석을 토대로, 일상 속 3S(State/Structure/Story) 관찰과 뇌신경계 안정, 모든 에고를 내려놓는 Zero Point까지 명시적으로 설계',
        officialTestUrl: 'https://www.enneagraminstitute.com/',
        officialTestName: 'The Enneagram Institute 공식 RHETI® 검사',
        officialTestDesc: '공인된 Riso-Hudson 에니어그램 정식 검사를 통해 나의 9가지 동기 프로파일을 깊이 있게 만나보세요.',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        icon: '🌌',
        highlight: true
    },
    {
        id: 'tci',
        name: 'TCI (기질 및 성격검사)',
        officialTrademarkNote: 'C.R. Cloninger 교수의 심리생물학적 인성 모델로 (주)마음사랑 공인 공급 도구입니다.',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '선천적 기질(자극추구, 위험회피, 보상의존성, 인내력)과 후천적 성격(자율성, 연대감, 자기초월)',
        typicalResult: '4가지 기질 차원과 3가지 성격 성숙도 백분위',
        respectfulHonor: '유전적·생물학적으로 타고난 기질과 후천적으로 성숙해가는 성격을 엄밀히 구분해 낸 인지생물학의 걸작',
        commonWithMyeongsim: '타고난 신체 하드웨어(기질)와 후천적 마음 운영체제를 명확히 구분하여 접근',
        coreDifference: '기질을 운명화하지 않고, Dark(생존 반응) ➔ Neural(의식적 선택) ➔ Meta(가치 창조)라는 3단계 의식 운영 프로세스로 승화시킴',
        officialTestUrl: 'https://www.maumsarang.kr/',
        officialTestName: '(주)마음사랑 TCI 공인 검사 안내',
        officialTestDesc: '전문 상담기관 및 공인 심리평가사를 통해 정식 TCI 프로파일과 성숙도 지수를 검사받으실 수 있습니다.',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        icon: '🧬'
    },
    {
        id: 'cliftonstrengths',
        name: 'CliftonStrengths® (갤럽 34 강점진단)',
        officialTrademarkNote: 'CliftonStrengths® 및 Gallup®은 Gallup, Inc.의 등록상표입니다.',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '자연스럽게 반복되는 사고·감정·행동의 탁월한 34가지 재능 테마',
        typicalResult: '개인별 Top 5 또는 34가지 시그니처 테마 순위 리포트',
        respectfulHonor: '약점 교정에 매몰되던 패러다임을 뒤흔들고, 인간이 가진 고유한 재능을 강점으로 극대화하는 긍정심리학의 대표 도구',
        commonWithMyeongsim: '결함 수정보다 개인 고유의 천부적 재능과 자원을 발굴하는 철학이 깊이 일치',
        coreDifference: '강점의 발휘뿐만 아니라, 스트레스 시 강점이 지나치게 과출력되어 타인에게 부담이 되는 그림자(Dark Code) 현상까지 포괄하여 균형을 맞춤',
        officialTestUrl: 'https://www.gallup.com/cliftonstrengths/',
        officialTestName: 'Gallup® 공식 CliftonStrengths 포털',
        officialTestDesc: '갤럽 공식 웹사이트에서 세계적인 34 강점 진단을 직접 수행하고 상세 리포트를 확인하실 수 있습니다.',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '🌟',
        highlight: true
    },
    {
        id: 'via_strengths',
        name: 'VIA 성격 강점 검사 (VIA Character Strengths)',
        officialTrademarkNote: 'VIA Institute on Character의 공식 긍정심리학 성격 덕목 도구입니다.',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '6대 보편적 덕목(지혜, 용기, 인간애, 정의, 절제, 초월)과 24개 성격 강점',
        typicalResult: '24개 강점 우선순위 프로파일',
        respectfulHonor: '전 세계 문화권을 통틀어 인류가 공통으로 가치 있게 여긴 24가지 덕목을 과학적으로 측정 가능하게 만든 긍정심리학의 자산',
        commonWithMyeongsim: '자신 안의 밝고 선한 잠재력과 본래적 가치에 주목하는 성장 지향적 관점',
        coreDifference: '덕목의 순위 파악에 머무르지 않고, 특정 상황에서 강점이 왜곡되거나 억압될 때의 내적 프로세스를 다루고 행동으로 실천함',
        officialTestUrl: 'https://www.viacharacter.org/',
        officialTestName: 'VIA Institute 공식 무료 성격 강점 검사',
        officialTestDesc: 'VIA 공식 연구재단에서 24가지 성격 강점 검사를 전 세계인에게 무료로 제공하고 있습니다.',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: '🕊️'
    },
    {
        id: 'hogan_hpi',
        name: 'Hogan HPI (호건 성격검사)',
        officialTrademarkNote: 'Hogan Assessment Systems, Inc.의 공인 비즈니스 인재 평가도구입니다.',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '평상시 사회적 관계 및 업무 환경에서 타인에게 비치는 평판 성격',
        typicalResult: '7대 주요 업무 척도 및 리더십 잠재력 지수',
        respectfulHonor: '자기 보고의 한계를 넘어 직장 동료와 조직이 체감하는 ‘사회적 평판’을 과학적으로 예측해 낸 리더십 평가의 최고봉',
        commonWithMyeongsim: '리더십과 커리어 환경에서의 실제 행동 예측 및 관계적 영향력을 중시',
        coreDifference: '업무 성향의 예측을 넘어, 업무 외적인 감정 회복, 내면의 신념 체계, 삶의 전반적 정체성까지 통합적으로 확장',
        officialTestUrl: 'https://www.hoganassessments.com/',
        officialTestName: 'Hogan Assessments 공식 글로벌 포털',
        officialTestDesc: '글로벌 유수 기업들이 채택한 공인 호건 리더십 및 성격 평가 시스템을 확인하실 수 있습니다.',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        icon: '👔'
    },
    {
        id: 'hogan_hds',
        name: 'Hogan HDS (탈선 위험 검사)',
        officialTrademarkNote: 'Hogan Assessment Systems, Inc.의 스트레스 시 탈선 행동 평가도구입니다.',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '극심한 스트레스나 번아웃 상황에서 무의식적으로 발현되는 11가지 탈선 행동(Derailers)',
        typicalResult: '탈선 요인별 위험도 백분위 프로파일',
        respectfulHonor: '평소에 탁월하던 리더가 위기 상황에서 왜 갑자기 조직을 위태롭게 만드는지 그 맹점을 정밀하게 밝혀낸 독보적 도구',
        commonWithMyeongsim: '명심코칭의 핵심 개념인 ‘Dark Code(생존을 위해 발달시킨 극단적 자동 방어기제)’와 가장 밀접하게 비교·공명하는 훌륭한 진단',
        coreDifference: 'HDS가 위험 성향의 측정과 통제에 집중한다면, 명심코칭은 그 탈선 반응을 자신이 살아남기 위해 선택했던 하나의 ‘생존 장르’로 품고 감사히 승화함',
        officialTestUrl: 'https://www.hoganassessments.com/',
        officialTestName: 'Hogan HDS 공식 안내 포털',
        officialTestDesc: '스트레스 시 리더십 탈선 위험(Derailers)을 정밀 분석하는 공식 HDS 체계를 살펴보세요.',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: '⚠️',
        highlight: true
    },
    {
        id: 'riasec',
        name: '홀랜드 직업흥미검사 (RIASEC)',
        officialTrademarkNote: 'John Holland 교수의 직업적 성격 유형 모델(대한민국 워크넷 공식 활용)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '6가지 직업 흥미 및 성격 환경 (실재형, 탐구형, 예술형, 사회형, 기업형, 관습형)',
        typicalResult: '우선 선호 흥미 코드(예: SEC, RIA) 및 추천 직무군',
        respectfulHonor: '수십 년간 수많은 청년과 직업인의 진로 탐색과 적성 일치에 가장 크게 기여한 직업 심리학의 표준',
        commonWithMyeongsim: '개인의 고유한 성향과 사회적 기여 영역의 최적 접점을 찾는 여정',
        coreDifference: '단순한 직무 카테고리 매칭을 넘어, 창업 및 자기 주권적 일의 의미, 번아웃 방지, 비즈니스 아키텍처 구축까지 총체적으로 코칭',
        officialTestUrl: 'https://www.work.go.kr/',
        officialTestName: '고용노동부 워크넷 공식 무료 심리검사',
        officialTestDesc: '국가 공인 고용 포털 워크넷에서 청소년·성인 직업선호도검사(L/S형)를 무료로 신뢰도 높게 받아보실 수 있습니다.',
        badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
        icon: '🧭'
    },
    {
        id: 'ecr_attachment',
        name: '성인애착검사 (ECR / ECR-R)',
        officialTrademarkNote: 'Brennan, Clark, & Shaver의 친밀관계 성인애착 척도 연구 모델입니다.',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '친밀한 대인관계 및 연인·가족 관계에서의 애착 불안과 애착 회피 수준',
        typicalResult: '4가지 애착 유형 (안정형, 불안형, 거부-회피형, 공포-회피형)',
        respectfulHonor: '유아기 형성된 내적 작동 모델이 성인기의 사랑, 신뢰, 갈등 반응에 미치는 강력한 영향을 설득력 있게 설명해 낸 대인관계 심리학의 정수',
        commonWithMyeongsim: '관계에서 반복되는 취약성과 자동 방어 패턴(거리두기 혹은 집착)을 투명하게 관찰',
        coreDifference: '자신을 ‘불안형/회피형’이라는 라벨에 가두지 않고, 관계의 두려움이 올라오는 찰나의 순간에 3S 프로토콜로 신경계를 안정시키고 새로운 소통을 선택함',
        officialTestUrl: 'https://openpsychometrics.org/',
        officialTestName: '공인 심리연구 오픈 척도 포털',
        officialTestDesc: '학술 연구용 공인 애착 척도 및 심리상담 전문기관을 통해 자신의 관계 패턴을 탐색해보실 수 있습니다.',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        icon: '❤️'
    },
    {
        id: 'mmpi',
        name: 'MMPI-2 / MMPI-3 (다면적 인성검사)',
        officialTrademarkNote: 'MMPI®는 University of Minnesota의 등록상표이며, 국내는 (주)마음사랑 공인 공급입니다.',
        category: 'clinical',
        categoryLabel: '임상·심층',
        whatItMeasures: '임상적 심리 특성, 정신건강 척도, 타당도 척도 및 방어 태도',
        typicalResult: '체계적인 임상 프로파일 및 표준 T점수 분포표',
        respectfulHonor: '엄격한 경험적 실증 기준과 방대한 규준 데이터를 갖춘, 세계 의학·임상 심리학계에서 가장 신뢰받는 최고의 객관적 성격 평가도구',
        commonWithMyeongsim: '무의식적인 심리적 스트레스와 방어 기제의 작동을 매우 정밀하고 깊이 있게 이해',
        coreDifference: 'MMPI는 정신건강의학과 및 공인 1급 심리전문가의 진단·치료 영역입니다. 명심코칭은 임상 치료가 아닌 건강한 성장과 자기 주권적 삶의 전환을 돕는 코칭 시스템입니다.',
        officialTestUrl: 'https://www.maumsarang.kr/',
        officialTestName: '(주)마음사랑 공식 MMPI 검사 안내',
        officialTestDesc: 'MMPI는 반드시 공인된 정신건강의학과, 종합병원, 전문 심리상담센터에서 임상 전문가의 지도하에 실시해야 합니다.',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        icon: '🏥'
    },
    {
        id: 'pai',
        name: 'PAI (성격평가질문지)',
        officialTrademarkNote: 'L.C. Morey 교수의 임상 진단 도구로 국내는 학지사 심리검사연구소 공인 보급입니다.',
        category: 'clinical',
        categoryLabel: '임상·심층',
        whatItMeasures: '성격 및 정신병리적 임상 증상, 대인관계 양식, 치료적 개입 가능성',
        typicalResult: '22개 척도의 표준 점수 프로파일',
        respectfulHonor: '명확한 개념적 구성과 최신 진단 기준을 결합하여 현대 임상 평가와 상담 현장에서 널리 인정받는 정밀 진단 체계',
        commonWithMyeongsim: '심리적 고통의 구체적 지점과 대인관계적 갈등 패턴을 세밀하게 포착',
        coreDifference: '전문 의료·상담 영역의 진단 도구이며, 명심코칭은 이를 존중하여 의학적 치료의 필요성을 인지하고 일반인의 자기 계발 영역에 집중합니다.',
        officialTestUrl: 'https://www.inpsyt.co.kr/',
        officialTestName: '학지사 인프사이트(INPSYT) 공인 포털',
        officialTestDesc: '전문 상담기관에서 공인 자격을 갖춘 상담전문가를 통해 정식 PAI 검사를 받으실 수 있습니다.',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        icon: '📋'
    },
    {
        id: 'saju_ohaeng',
        name: '사주·오행 명리학 체계',
        officialTrademarkNote: '동양 음양오행과 60갑자 기반의 전통 인문 상징 통계학 체계입니다.',
        category: 'symbolic',
        categoryLabel: '상징·원형',
        whatItMeasures: '출생 시점의 자연 기운(간지 8글자)과 목·화·토·금·수 오행의 상생상극 밸런스',
        typicalResult: '사주 사기둥(四柱), 일간 본성, 대운의 흐름',
        respectfulHonor: '수천 년간 동양 문화권에서 자연의 순환과 인간 삶의 생체 리듬을 관찰하고 집대성한 유서 깊은 인문 통계학적 상징 체계',
        commonWithMyeongsim: '명심코칭의 신체적 에너지 하드웨어(Hardware)를 해석하는 다채로운 은유적 재료',
        coreDifference: '미래를 점치는 숙명론이나 결정론을 철저히 배격하고, 나에게 부족하거나 넘치는 에너지를 자각하여 능동적으로 삶을 개운(開運)하는 코칭 언어로 현대화함',
        officialTestUrl: 'https://myeongsim.com',
        officialTestName: '명심 만세력 4기둥 정밀 분석',
        officialTestDesc: '명심코칭의 만세력 엔진을 통해 자신의 오행 밸런스와 일간 고유 에너지를 객관적으로 탐색해보실 수 있습니다.',
        badgeColor: 'bg-amber-600/20 text-amber-200 border-amber-500/30',
        icon: '☯️',
        highlight: true
    },
    {
        id: 'iching_64',
        name: '주역 64괘 (I Ching Life Code)',
        officialTrademarkNote: '동양 최고(最古)의 변화 철학 주역(周易)의 64가지 원형 상태 체계입니다.',
        category: 'symbolic',
        categoryLabel: '상징·원형',
        whatItMeasures: '삶과 우주가 마주하는 64가지 변화의 국면, 위기극복 지혜, 상호작용 원형',
        typicalResult: '본괘, 지괘, 6효의 변화 단계와 지혜의 경구',
        respectfulHonor: '카를 융이 ‘동시성(Synchronicity)’ 이론의 핵심 근거로 삼았던, 인간 의식과 우주의 깊은 연결을 은유하는 위대한 인류 지혜의 원형',
        commonWithMyeongsim: '명심코칭의 핵심 인지 지도인 ‘64 Life Code’의 원형적 영감이 됨',
        coreDifference: '전통 주역의 신비주의를 걷어내고, 인지과학·뇌과학과 결합하여 Dark ➔ Neural ➔ Meta의 3단계 마음 전환 프로토콜로 체계화함',
        officialTestUrl: 'https://myeongsim.com',
        officialTestName: '명심 64 Life Code 디코더',
        officialTestDesc: '현재 내가 마주한 상황의 괘와 변화의 방향성을 현대적 코칭 언어로 해독해보실 수 있습니다.',
        badgeColor: 'bg-yellow-600/20 text-yellow-200 border-yellow-500/30',
        icon: '📜'
    }
];

interface AssessmentComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartCoaching?: (assessmentName: string, prompt?: string) => void;
}

export default function AssessmentComparisonModal({
    isOpen,
    onClose,
    onStartCoaching
}: AssessmentComparisonModalProps) {
    const [mainTab, setMainTab] = useState<'benchmark' | 'meta_philosophy' | 'curriculum'>('benchmark');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [activeAlgorithmTab, setActiveAlgorithmTab] = useState<'mbti' | 'bigfive' | 'enneagram'>('mbti');

    // 필터링
    const filteredList = useMemo(() => {
        return ASSESSMENT_DATA.filter((item) => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = searchQuery.trim() === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.whatItMeasures.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.respectfulHonor.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 15 }}
                    className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-950 border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden"
                >
                    {/* 🌟 1. 헤더 영역: 경의와 상생의 선언 & 상표권 보호 고지 🌟 */}
                    <div className="shrink-0 p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/70 border-b border-white/10 relative">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide">
                                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                                    <span>공인 평가도구에 대한 존중 & 명심 메타코칭 프레임워크</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 font-serif">
                                    <span>대표 성격검사 체계와 명심코칭의 상호보완 벤치마크</span>
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
                                    <strong className="text-amber-300 font-semibold">“성격검사는 우리 내면의 지형을 정밀하게 보여주는 훌륭한 지도(Map)이며, 명심코칭은 그 지도를 가지고 삶을 지혜롭게 항해하는 운전·전환 시스템(Drive & Shift)입니다.”</strong>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                                aria-label="닫기"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 법적 상표권 귀속 및 공정 이용 안내 바 */}
                        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>
                                    <strong>상표권 존중 및 공정 비교 고지:</strong> MBTI®, DISC®, CliftonStrengths®, MMPI® 등 본문에 언급된 도구의 명칭은 각 소유권자의 고유 등록상표입니다. 본 자료는 학술 연구 및 이용자의 객관적 이해를 돕기 위한 교육·비교 목적으로 제공됩니다.
                                </span>
                            </div>
                            <span className="text-amber-400 font-bold shrink-0">
                                💡 각 공인 기관의 정식 검사를 적극 권장합니다
                            </span>
                        </div>

                        {/* 3대 메인 탭 */}
                        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 border-b border-white/5">
                            <button
                                onClick={() => setMainTab('benchmark')}
                                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                                    mainTab === 'benchmark'
                                        ? 'border-amber-400 text-amber-300 bg-amber-400/10 rounded-t-xl'
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                <Table className="w-4 h-4" />
                                <span>28대 공인검사 벤치마크 & 공식처</span>
                            </button>
                            <button
                                onClick={() => setMainTab('meta_philosophy')}
                                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                                    mainTab === 'meta_philosophy'
                                        ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10 rounded-t-xl'
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                <Compass className="w-4 h-4" />
                                <span>메타 프레임워크 & 실전 알고리즘</span>
                            </button>
                            <button
                                onClick={() => setMainTab('curriculum')}
                                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                                    mainTab === 'curriculum'
                                        ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10 rounded-t-xl'
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>평생교육원 16모듈 커리큘럼</span>
                            </button>
                        </div>
                    </div>

                    {/* 🌟 2. 메인 바디 컨텐츠 (스크롤 가능) 🌟 */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

                        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 1: 28대 검사 비교 & 공식처 ━━━━━━━━━━━━━━━━━━━━ */}
                        {mainTab === 'benchmark' && (
                            <div className="space-y-4">
                                {/* 검사 유도 및 존중 안내 배너 */}
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                                            <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                                            <span>먼저 공인된 전문 검사를 받아보시기를 추천드립니다!</span>
                                        </div>
                                        <p className="text-xs text-slate-300">
                                            정밀한 지도가 준비되면, 명심코칭이 그 지도를 들고 삶에서 자동 반응에 휘둘리지 않고 주체적으로 항해하는 힘을 더해드립니다.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-xl font-bold shrink-0">
                                        <Award className="w-3.5 h-3.5" />
                                        <span>지도(검사) + 운전(명심) = 완전한 자유</span>
                                    </div>
                                </div>

                                {/* 검색 및 카테고리 필터 바 */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                                    {/* 검색창 */}
                                    <div className="relative w-full sm:w-72">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="검사명 또는 측정 내용 검색..."
                                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                                        />
                                    </div>

                                    {/* 카테고리 칩 */}
                                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                                        {[
                                            { id: 'all', label: '전체 보기' },
                                            { id: 'cognitive', label: '인지·선호' },
                                            { id: 'behavior', label: '행동·비즈니스' },
                                            { id: 'strength', label: '강점·동기' },
                                            { id: 'clinical', label: '임상·심층' },
                                            { id: 'symbolic', label: '상징·원형' }
                                        ].map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                                                    selectedCategory === cat.id
                                                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                                                        : 'bg-white/5 text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 카드/테이블 뷰 토글 */}
                                    <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('card')}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                                viewMode === 'card' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <LayoutGrid className="w-3.5 h-3.5" />
                                            <span>카드</span>
                                        </button>
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                                viewMode === 'table' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <Table className="w-3.5 h-3.5" />
                                            <span>표</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 카드 뷰 */}
                                {viewMode === 'card' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredList.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                                                    item.highlight
                                                        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-amber-500/40 shadow-xl'
                                                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <div className="space-y-3">
                                                    {/* 상단 뱃지 & 아이콘 */}
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                                                            {item.categoryLabel}
                                                        </span>
                                                        <span className="text-2xl">{item.icon}</span>
                                                    </div>

                                                    {/* 타이틀 및 상표 고지 */}
                                                    <div>
                                                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                                                            {item.name}
                                                        </h3>
                                                        {item.officialTrademarkNote && (
                                                            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                                                                {item.officialTrademarkNote}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 검사의 위대한 기여에 대한 존중 */}
                                                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/20 text-xs">
                                                        <div className="flex items-center gap-1 text-amber-300 font-bold mb-1 text-[11px]">
                                                            <Heart className="w-3 h-3 text-amber-400" />
                                                            <span>이 검사가 인류에 기여한 지혜 (존중 포인트)</span>
                                                        </div>
                                                        <p className="text-slate-300 leading-relaxed text-[11px]">
                                                            {item.respectfulHonor}
                                                        </p>
                                                    </div>

                                                    {/* 무엇을 보는가 & 결과 */}
                                                    <div className="text-xs space-y-1.5 text-slate-300">
                                                        <div>
                                                            <span className="text-slate-400 font-medium">무엇을 보는가: </span>
                                                            <span className="text-white font-medium">{item.whatItMeasures}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 font-medium">대표 결과: </span>
                                                            <span className="text-cyan-300 font-medium">{item.typicalResult}</span>
                                                        </div>
                                                    </div>

                                                    {/* 명심코칭과의 공통점 및 핵심 시너지 */}
                                                    <div className="text-xs space-y-1 pt-2 border-t border-white/5">
                                                        <div className="flex items-start gap-1.5 text-slate-300">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                            <span><strong>공통점:</strong> {item.commonWithMyeongsim}</span>
                                                        </div>
                                                        <div className="flex items-start gap-1.5 text-amber-200">
                                                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                                            <span><strong>명심코칭 시너지:</strong> {item.coreDifference}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 하단 공식 사이트 유도 & 코칭 연계 버튼 */}
                                                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                                                    {/* 공식 검사 사이트 이동 버튼 */}
                                                    <a
                                                        href={item.officialTestUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 font-medium"
                                                        title={`${item.officialTestName} 방문`}
                                                    >
                                                        <span>공식 검사처 안내</span>
                                                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                                                    </a>

                                                    {/* 명심코칭 시너지 받기 버튼 */}
                                                    <button
                                                        onClick={() => {
                                                            const prompt = `[공인검사 시너지 코칭] ${item.name}의 검사 결과나 선호 양식을 바탕으로, 명심코칭의 3S(State/Structure/Story) 및 실전 전환(SHIFT) 시스템을 적용받고 싶습니다.`;
                                                            if (onStartCoaching) onStartCoaching(item.name, prompt);
                                                        }}
                                                        className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                                                    >
                                                        <span>명심코칭 시너지 시작</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* 테이블 뷰 */
                                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
                                        <table className="w-full text-left text-xs border-collapse min-w-[840px]">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-slate-950/80 text-amber-400 font-bold">
                                                    <th className="p-3 w-16">분류</th>
                                                    <th className="p-3 w-48">검사·모델명</th>
                                                    <th className="p-3 w-48">무엇을 보는가</th>
                                                    <th className="p-3 w-56">검사의 학술적 기여 (존중)</th>
                                                    <th className="p-3">명심코칭과의 시너지</th>
                                                    <th className="p-3 w-32 text-center">공식 사이트</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-slate-300">
                                                {filteredList.map((item) => (
                                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-3">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                                                                {item.categoryLabel}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 font-bold text-white">
                                                            <div className="flex items-center gap-1.5">
                                                                <span>{item.icon}</span>
                                                                <div>
                                                                    <div>{item.name}</div>
                                                                    {item.officialTrademarkNote && (
                                                                        <div className="text-[9px] text-slate-400 font-normal">
                                                                            {item.officialTrademarkNote}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">{item.whatItMeasures}</td>
                                                        <td className="p-3 text-[11px] text-slate-300 bg-slate-950/30">{item.respectfulHonor}</td>
                                                        <td className="p-3 text-amber-200">{item.coreDifference}</td>
                                                        <td className="p-3 text-center">
                                                            <a
                                                                href={item.officialTestUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-[11px] font-bold border border-cyan-500/30"
                                                            >
                                                                <span>검사처</span>
                                                                <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 2: 메타 프레임 & 실전 전환 알고리즘 ━━━━━━━━━━━━━━━━━━━━ */}
                        {mainTab === 'meta_philosophy' && (
                            <div className="space-y-6 max-w-5xl mx-auto">
                                {/* 1. 4대 핵심 차별화 원칙 */}
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/40 space-y-3">
                                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                                        <Compass className="w-4 h-4" />
                                        <span>책 《나는 믿는다, 그러나 갇히지 않는다》 핵심 통찰</span>
                                    </div>
                                    <h3 className="text-lg font-black text-white font-serif">
                                        “성격검사 위의 메타 프레임워크: 지도에서 운전으로”
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        기존 성격검사를 대체하거나 배척하지 않습니다. 성격검사는 <strong>나의 기질과 선호를 객관적으로 비춰주는 훌륭한 지도</strong>입니다. 명심코칭은 그 검사 결과에 갇히지 않고, <strong>“이 특성이 지금 어떻게 작동하고 있으며, 나는 그것에 끌려갈 것인가 아니면 자유롭게 사용할 것인가?”</strong>를 다루는 메타 운전 시스템입니다.
                                    </p>

                                    {/* 4단 공식 카드 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-xs">
                                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                                            <div className="text-slate-400 text-[10px] font-bold">1단계. 성격검사</div>
                                            <div className="text-cyan-300 font-bold">“나는 어떤 사람인가?”</div>
                                            <div className="text-[11px] text-gray-400">특성과 선호의 정밀한 이해 (지도)</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                                            <div className="text-slate-400 text-[10px] font-bold">2단계. 명심 SCAN·SYNC</div>
                                            <div className="text-amber-300 font-bold">“지금 어떻게 작동하는가?”</div>
                                            <div className="text-[11px] text-gray-400">스트레스 시 과출력·자동패턴 자각</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                                            <div className="text-slate-400 text-[10px] font-bold">3단계. Meta & Zero Point</div>
                                            <div className="text-purple-300 font-bold">“나는 성격보다 큰 존재인가?”</div>
                                            <div className="text-[11px] text-gray-400">유형 동일시 해제, 고요한 중심 회복</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                                            <div className="text-slate-400 text-[10px] font-bold">4단계. SHIFT (행동 선택)</div>
                                            <div className="text-emerald-300 font-bold">“지금 무엇을 선택할 것인가?”</div>
                                            <div className="text-[11px] text-gray-400">기질을 도구로 부리는 주권적 실행</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. 실전 전환 알고리즘 3선 (INTJ, Big Five, 에니어그램) */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Workflow className="w-4 h-4 text-amber-400" />
                                            <h4 className="text-sm font-black text-white">
                                                성격검사 결합 실전 알고리즘 (3대 대표 예시)
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
                                            <button
                                                onClick={() => setActiveAlgorithmTab('mbti')}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    activeAlgorithmTab === 'mbti' ? 'bg-amber-400 text-slate-950' : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                16선호(INTJ)
                                            </button>
                                            <button
                                                onClick={() => setActiveAlgorithmTab('bigfive')}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    activeAlgorithmTab === 'bigfive' ? 'bg-amber-400 text-slate-950' : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                Big Five(신경성)
                                            </button>
                                            <button
                                                onClick={() => setActiveAlgorithmTab('enneagram')}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    activeAlgorithmTab === 'enneagram' ? 'bg-amber-400 text-slate-950' : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                에니어그램(3번)
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2-A. INTJ 실전 알고리즘 */}
                                    {activeAlgorithmTab === 'mbti' && (
                                        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                                                        16대 인지·선호 양식 사례
                                                    </span>
                                                    <h5 className="text-base font-black text-white mt-1">
                                                        INTJ (전략 설계가)의 명심코칭 디버깅 프로세스
                                                    </h5>
                                                </div>
                                                <span className="text-2xl">♟️</span>
                                            </div>

                                            <div className="space-y-2 text-xs">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                                                        <div className="text-rose-400 font-bold">⚠️ 자동화된 그림자 반응 (Dark Code)</div>
                                                        <p className="text-slate-300 leading-relaxed">
                                                            <strong>Hardware:</strong> 전략·독립·분석 선호 ➔ <strong>Dark Code:</strong> “내가 직접 완벽하게 통제하지 않으면 망한다” ➔ <strong>Trigger:</strong> 동료의 사소한 실수 ➔ <strong>Story:</strong> “저 사람은 무능하다” ➔ <strong>Emotion:</strong> 짜증·불안 ➔ <strong>Behavior:</strong> 일 빼앗기, 차가운 비판, 독박 처리.
                                                        </p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                                                        <div className="text-emerald-300 font-bold">✨ 명심코칭의 개입 및 전환 (SHIFT)</div>
                                                        <p className="text-slate-300 leading-relaxed">
                                                            <strong>SCAN:</strong> “지금 사실은 실수가 1건 발생한 것인가, 동료 전체가 무능한 것인가?” ➔ <strong>SYNC:</strong> “통제하지 못하면 일이 실패할까 봐 두려운 내 오랜 패턴이 올라오는구나” ➔ <strong>SHIFT:</strong> 일 빼앗기 대신 기준을 명확히 합의하고 위임하기 ➔ <strong>Meta:</strong> 전략적 지성은 사람을 통제하는 칼이 아니라 팀을 살리는 시스템 설계 능력임을 자각.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2-B. Big Five 신경성 실전 알고리즘 */}
                                    {activeAlgorithmTab === 'bigfive' && (
                                        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                                                        학술 5대 특질 사례
                                                    </span>
                                                    <h5 className="text-base font-black text-white mt-1">
                                                        높은 정서반응성(신경성 N)의 명심 자각 프로세스
                                                    </h5>
                                                </div>
                                                <span className="text-2xl">📡</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                                                    <div className="text-rose-400 font-bold">⚠️ 특질에 휘둘릴 때</div>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        높은 신경성을 "고쳐야 할 성격적 결함"으로 자책하거나, 외부의 사소한 불확실성에 뇌의 편도체가 과열되어 만성 피로와 회피 행동으로 자동 진입함.
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
                                                    <div className="text-cyan-300 font-bold">✨ 명심코칭의 승화 관점</div>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        높은 정서반응성을 <strong>‘위험 신호를 남들보다 먼저 감지하는 고감도 안전 레이더’</strong>로 재정의. 레이더의 경보음이 울릴 때 1분 자각 호흡으로 몸을 진정시키고, 감정이 아닌 객관적 사실(Fact)을 기반으로 사전 리스크 방지 행동으로 전환.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2-C. 에니어그램 3번 실전 알고리즘 */}
                                    {activeAlgorithmTab === 'enneagram' && (
                                        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                                                        심층 동기 엔진 사례
                                                    </span>
                                                    <h5 className="text-base font-black text-white mt-1">
                                                        에니어그램 3번 (성취자 Driver)의 Zero Point 전환
                                                    </h5>
                                                </div>
                                                <span className="text-2xl">🏆</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                                                    <div className="text-rose-400 font-bold">⚠️ 성취 동일시의 덫</div>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        “나는 성과를 내야만 존재 가치가 있다”는 무의식적 믿음(Dark Code) ➔ 성과가 주춤할 때 극심한 수치심과 공허감 ➔ 타인의 시선에 맞춘 과도한 번아웃 질주.
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
                                                    <div className="text-purple-300 font-bold">✨ 명심 Zero Point 해방</div>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        <strong>Zero Point:</strong> “성과와 타이틀이라는 외투를 잠시 모두 벗어놓아도, 여전히 온전하게 살아 숨 쉬는 나는 누구인가?”를 자각. 성과를 인정받기 위한 도구가 아니라, 진정한 내면의 가치와 기쁨을 실현하는 창조적 에너지로 환원.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 3: 평생교육원 16모듈 커리큘럼 ━━━━━━━━━━━━━━━━━━━━ */}
                        {mainTab === 'curriculum' && (
                            <div className="space-y-6 max-w-5xl mx-auto">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                            <GraduationCap className="w-4 h-4" />
                                            <span>명심코칭 평생교육원 정규 전문과정</span>
                                        </div>
                                        <h3 className="text-lg font-black text-white font-serif">
                                            《성격검사 통합과 명심코칭 (Integrating Assessments & Meta Coaching)》
                                        </h3>
                                        <p className="text-xs text-slate-300">
                                            핵심 슬로건: <strong className="text-amber-300">“유형을 알되, 유형이 되지는 않는다. 나는 내 성격을 가지고 살아가는 주권적 존재다.”</strong>
                                        </p>
                                    </div>
                                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                                        총 16개 정규 모듈
                                    </span>
                                </div>

                                {/* 16개 모듈 리스트 (4x4 그리드) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { num: '01', title: '성격이란 무엇인가', desc: '연속적 특질(Trait)과 범주형 유형(Type)의 과학적 이해와 존중' },
                                        { num: '02', title: 'MBTI® 이해와 확장', desc: '16유형의 아름다운 인지 선호와 과출력 방지' },
                                        { num: '03', title: 'Big Five & HEXACO', desc: '통계 심리학의 표준 척도와 5대·6대 특질 스펙트럼' },
                                        { num: '04', title: 'DISC® 행동 프로토콜', desc: '비즈니스 현장에서의 소통과 갈등 조율' },
                                        { num: '05', title: '에니어그램 심층 동기', desc: '9대 근원적 두려움과 무의식적 방어기제 탐색' },
                                        { num: '06', title: 'TCI와 생물학적 기질', desc: '유전된 신체 하드웨어와 성숙한 마음의 분리' },
                                        { num: '07', title: '강점 진단과 덕목', desc: '갤럽 34 테마 및 VIA 24 덕목의 올바른 활용' },
                                        { num: '08', title: '성인애착과 관계패턴', desc: '친밀한 관계에서의 불안·회피 메커니즘' },
                                        { num: '09', title: 'Hogan과 리더십 탈선', desc: '스트레스 시 나타나는 Derailers와 평판 관리' },
                                        { num: '10', title: '임상평가와 코칭의 경계', desc: 'MMPI·PAI 등 전문 진단 도구 존중 및 의료와의 구별' },
                                        { num: '11', title: '동양 사주·주역 상징', desc: '결정론을 넘어선 자기이해의 인문학적 은유' },
                                        { num: '12', title: 'Dark Code 매핑 실습', desc: '나의 성격 검사 결과 뒤에 숨은 자동 방어선 추적' },
                                        { num: '13', title: 'SCAN 질문 만들기', desc: '내면의 이야기(Story)와 객관적 사실(Fact) 분리' },
                                        { num: '14', title: 'SYNC 수용 질문법', desc: '성격에 대한 자책을 멈추고 온전히 품어주는 기술' },
                                        { num: '15', title: 'SHIFT 행동 설계', desc: '자동 반응을 넘어 가치와 일치하는 행동 실행' },
                                        { num: '16', title: 'Zero Point와 온전함', desc: '모든 유형의 옷을 벗고 본래의 자유로 복귀' },
                                    ].map((mod) => (
                                        <div
                                            key={mod.num}
                                            className="p-3.5 rounded-xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                    Module {mod.num}
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold text-white line-clamp-1">
                                                {mod.title}
                                            </div>
                                            <div className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                                                {mod.desc}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* 🌟 3. 모달 하단 푸터 🌟 */}
                    <div className="shrink-0 px-6 py-3.5 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="text-slate-400 text-[11px]">
                            명심코칭은 각 공인 평가기관의 연구 성과와 저작권을 엄격히 존중하며, 공존과 시너지의 메타 코칭을 지향합니다.
                        </div>
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-colors cursor-pointer"
                        >
                            닫기
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
