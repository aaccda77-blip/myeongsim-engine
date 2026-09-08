'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Flame,
    Rocket,
    X,
    CheckCircle2,
    TrendingUp,
    ShieldAlert,
    Users,
    DollarSign,
    Calendar,
    ArrowRight,
    Sparkles,
    Briefcase,
    Zap,
    Target,
    Compass,
    ChevronRight,
    Award
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type BusinessTab = 'dna' | 'wealth' | 'timing';

interface BusinessArchitectureDashboardProps {
    onClose?: () => void;
    initialTab?: BusinessTab;
    onChatIntent?: (intent: string, prompt: string) => void;
    userProfile?: any;
    isFullScreen?: boolean;
}

// 4대 CEO 아키타입 정의
interface CeoArchetype {
    id: string;
    title: string;
    subtitle: string;
    mentor: string;
    icon: string;
    badge: string;
    color: string;
    bgGradient: string;
    borderGlow: string;
    coreTrait: string;
    superpowers: string[];
    weaknesses: string[];
    partnerMatch: {
        role: string;
        type: string;
        reason: string;
    };
    fatalFlaw: string;
    radarScores: {
        innovation: number;   // 창의·혁신
        management: number;   // 시스템·운영
        capital: number;      // 자본·수익화
        fandom: number;       // 팬덤·영향력
        grit: number;         // 위기돌파력
    };
}

// 4대 머니 파이프라인 정의
interface MoneyPipeline {
    id: string;
    title: string;
    subTitle: string;
    icon: string;
    speedScore: number;
    scalabilityScore: number;
    formula: string;
    actionBlueprint: string[];
    pricingStrategy: string;
    fitReason: string;
}

// ============================================================================
// Data Models
// ============================================================================

const CEO_ARCHETYPES: Record<string, CeoArchetype> = {
    creative: {
        id: 'creative',
        title: '창조형 혁신가 (Creative Disruptor)',
        subtitle: '세상에 없던 가치를 직관으로 설계하는 프로덕트 리더',
        mentor: '스티브 잡스 / 브라이언 체스키 (Airbnb)',
        icon: '💡',
        badge: '식상(食傷) 발달형 리더',
        color: '#A855F7',
        bgGradient: 'from-purple-900/50 via-indigo-950/40 to-slate-900/60',
        borderGlow: 'border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.2)]',
        coreTrait: '압도적인 감각과 집요한 디테일, 기존 룰을 깨뜨리는 파괴적 상상력',
        superpowers: [
            '시장 미충족 니즈(Pain Point)를 직관적으로 감지',
            '고객이 열광하는 매력적인 제품/콘텐츠 기획력',
            '타협 없는 퀄리티로 초기 슈퍼팬 결집'
        ],
        weaknesses: [
            '반복적인 일상 업무나 회계/세무/계약 디테일의 번아웃',
            '아이디어가 너무 많아 제품 완성이 늦어지는 경향'
        ],
        partnerMatch: {
            role: 'COO (최고운영책임자)',
            type: '시스템형 관리자 (관성·인성형)',
            reason: '대표의 폭발적 아이디어를 꼼꼼한 프로세스와 표준 운영 매뉴얼(SOP)로 안착시켜 줄 파트너가 필수입니다.'
        },
        fatalFlaw: '경영 리스크 주의보: 완벽주의로 인한 론칭 지연 및 정량적 재무 관리 소홀. 80% 상태에서 먼저 시장에 던지세요!',
        radarScores: { innovation: 98, management: 45, capital: 70, fandom: 88, grit: 82 }
    },
    manager: {
        id: 'manager',
        title: '시스템 총괄 CEO (System Architect)',
        subtitle: '빈틈없는 프로세스와 정밀한 조직으로 스케일하는 경영자',
        mentor: '팀 쿡 (Apple) / 사티아 나델라 (Microsoft)',
        icon: '🏛️',
        badge: '관성·인성(官印) 발달형 리더',
        color: '#3B82F6',
        bgGradient: 'from-blue-900/50 via-slate-950/40 to-slate-900/60',
        borderGlow: 'border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.2)]',
        coreTrait: '무결점 시스템, 리스크 없는 공급망 구축, 효율 극대화 및 조직 안정화',
        superpowers: [
            '복잡한 비즈니스를 한눈에 들어오는 자동화 시스템으로 정리',
            '정확한 손익분기점(BEP) 통제 및 안정적인 현금흐름 유지',
            '팀원들의 역할 분담과 성과 지표(KPI) 명확화'
        ],
        weaknesses: [
            '확실하지 않은 리스크 앞에서 의사결정이 지나치게 신중해짐',
            '파괴적인 신규 시장 개척보다는 기존 시스템 개선에 치중'
        ],
        partnerMatch: {
            role: 'CPO (최고제품책임자) / 신사업 리드',
            type: '파괴적 혁신가 (식상·편재형)',
            reason: '시스템을 빈틈없이 채울 새로운 킬러 아이템과 파괴적 비전을 공급해 줄 혁신적 파트너가 필요합니다.'
        },
        fatalFlaw: '경영 리스크 주의보: 분석 마비 증후군. 모든 데이터가 갖춰질 때까지 기다리면 타이밍을 놓칩니다. 작은 실험을 허용하세요!',
        radarScores: { innovation: 55, management: 96, capital: 85, fandom: 65, grit: 90 }
    },
    dealer: {
        id: 'dealer',
        title: '스케일 머니 딜러 (Scale Capitalist)',
        subtitle: '기회를 포착하여 대규모 레버리지와 자본을 움직이는 승부사',
        mentor: '손정의 (SoftBank) / 피터 틸 (Founders Fund)',
        icon: '💎',
        badge: '재성(財星) 발달형 리더',
        color: '#F59E0B',
        bgGradient: 'from-amber-900/50 via-amber-950/30 to-slate-900/60',
        borderGlow: 'border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]',
        coreTrait: '기민한 시장 감각, 빠른 딜메이킹, 자본의 흐름을 읽는 머니 센스',
        superpowers: [
            '돈이 될 만한 트렌드와 황금 시장을 남들보다 반 박자 빠르게 포착',
            '제휴·투자·M&A 등 공격적인 레버리지 활용 능력',
            '단기 트랙션을 폭발적인 현금 흐름으로 전환하는 세일즈력'
        ],
        weaknesses: [
            '수익성이 즉시 나지 않는 기초 R&D나 조직 문화 관리에 소홀',
            '단기 성과에 집착해 롱런 제품의 깊이를 놓칠 위험'
        ],
        partnerMatch: {
            role: 'CTO (최고기술책임자) / 리서치 총괄',
            type: '원천 기술 전문가 (정인·비겁형)',
            reason: '대표가 빠르고 화려하게 자본을 유치하는 동안, 뒷단의 제품 퀄리티와 특허/기술 해자를 굳건히 지켜줄 파트너가 필수입니다.'
        },
        fatalFlaw: '경영 리스크 주의보: 무리한 외형 확장 및 레버리지 과다. 런웨이 12개월 이상을 항상 방어선으로 구축해 두세요!',
        radarScores: { innovation: 78, management: 60, capital: 98, fandom: 75, grit: 88 }
    },
    brander: {
        id: 'brander',
        title: '비전 브랜더 & 사상가 (Visionary Leader)',
        subtitle: '강력한 철학과 메시지로 거대한 팬덤을 결집시키는 리더',
        mentor: '일론 머스크 (Tesla) / 사이먼 시넥',
        icon: '🔥',
        badge: '비겁·화기(比劫·火) 발달형 리더',
        color: '#EC4899',
        bgGradient: 'from-pink-900/50 via-rose-950/30 to-slate-900/60',
        borderGlow: 'border-pink-500/40 shadow-[0_0_25px_rgba(236,72,153,0.2)]',
        coreTrait: '흔들리지 않는 대의명분, 사람을 움직이는 스토리텔링, 강력한 신념',
        superpowers: [
            '추종자들을 열광시키는 독보적인 퍼스널 브랜드 구축',
            '어려운 비전도 가슴 뛰는 미션으로 번역하는 커뮤니케이션력',
            '위기 상황에서도 지지자들을 결집시켜 돌파하는 카리스마'
        ],
        weaknesses: [
            '타인의 의견을 잘 수용하지 않는 독선적인 리더십 경향',
            '현실적인 비용 구조보다 원대한 이상을 앞세우는 위험'
        ],
        partnerMatch: {
            role: 'CFO (최고재무책임자) / 전략 기획 리드',
            type: '냉철한 현실주의자 (재관형)',
            reason: '대표의 가슴 뛰는 꿈을 현실적인 예산과 손익 계산서로 검증해 주고 제동을 걸어줄 브레이크 파트너가 반드시 필요합니다.'
        },
        fatalFlaw: '경영 리스크 주의보: 팬덤에 취해 핵심 비즈니스 모델(BM) 검증 지연. 신뢰를 잃지 않도록 약속한 납기일을 사수하세요!',
        radarScores: { innovation: 86, management: 52, capital: 74, fandom: 99, grit: 92 }
    }
};

const MONEY_PIPELINES: MoneyPipeline[] = [
    {
        id: 'pipe_ip',
        title: '지식 IP & 라이선스 모델',
        subTitle: '자면서도 돈이 들어오는 독점 노하우 자동화 자산',
        icon: '📚',
        speedScore: 85,
        scalabilityScore: 98,
        formula: '고유 노하우 × 디지털 패키징 = 무한 복제 현금흐름',
        actionBlueprint: [
            '내가 3년 이상 몰입해 검증한 문제 해결 비법을 10개 핵심 공식으로 문서화',
            '노션 템플릿, VOD 강좌, 전자책 등 원가 0원의 디지털 제품으로 패키징',
            '전용 랜딩페이지 + 자동 이메일/카카오 시퀀스로 24시간 판매 자동화 구축'
        ],
        pricingStrategy: '입문 3.9만원 ➡️ 실천 워크북 12만원 ➡️ 마스터 라이선스 120만원',
        fitReason: '원가가 들지 않아 실패 비용이 0원이며, 한번 세팅하면 시간 대비 수익률이 가장 높습니다.'
    },
    {
        id: 'pipe_fandom',
        title: '팬덤 커뮤니티 구독 모델',
        subTitle: '1,000명의 진성 팬이 평생 지지하는 고정 수익 파이프라인',
        icon: '👑',
        speedScore: 78,
        scalabilityScore: 90,
        formula: '공통의 가치관 × 지속적 결속 = 매월 반복되는 MRR(구독수익)',
        actionBlueprint: [
            '내 철학에 동의하는 타겟 고객 100명을 오픈채팅방/비공개 커뮤니티로 무료 유치',
            '주 1회 라이브 Q&A 및 독점 인사이트 공유로 대체 불가능한 친밀감 형성',
            '월 회비 기반의 VIP 멤버십(정기 소모임, 전용 자료, 네트워킹) 론칭'
        ],
        pricingStrategy: '월 2.9만원 베이직 ➡️ 월 9.9만원 VIP 클럽 ➡️ 연간 150만원 프라이빗 이너서클',
        fitReason: '사주에서 사람을 끌어당기는 비겁/식상 에너지를 가장 정직하게 현금화하는 길입니다.'
    },
    {
        id: 'pipe_b2b',
        title: '고단가 B2B 솔루션 모델',
        subTitle: '소수의 프리미엄 기업 고객에게 확실한 솔루션을 고단가로 납품',
        icon: '💼',
        speedScore: 92,
        scalabilityScore: 75,
        formula: '기업의 절박한 고통(Pain) 해결 = 건당 천만원대 즉각적 자금 확보',
        actionBlueprint: [
            '중소기업/전문직이 겪는 법률·세무·마케팅·시스템 병목 1개 선정',
            '결과 중심의 턴키(Turn-key) 제안서 작성 (예: "30일 내 리드 200% 증가")',
            '초기 3개 기업에 포트폴리오용 무료/성공보수제 파일럿 적용 후 레퍼런스 확정'
        ],
        pricingStrategy: '초기 진단 150만원 ➡️ 솔루션 구축 800만원~2,000만원 + 월 유지자문 150만원',
        fitReason: '적은 트래픽으로도 즉각 대규모 현금을 창출하여 초기 런웨이를 확보할 수 있습니다.'
    },
    {
        id: 'pipe_platform',
        title: '플랫폼 & 자동화 시스템 모델',
        subTitle: '수요자와 공급자를 연결하고 마진을 취하는 비즈니스',
        icon: '🌐',
        speedScore: 70,
        scalabilityScore: 99,
        formula: '트래픽 중개 × 프로세스 표준화 = 기하급수적 플랫폼 수수료',
        actionBlueprint: [
            '공급자가 흩어져 있고 수요자가 찾기 힘든 버티컬 니치 마켓 발굴',
            '노코드 툴(Bubble, Framer, Airtable)로 최소 기능 연결 매칭 보드 2주 내 제작',
            '초기 거래 50건을 수기 매칭으로 검증 후 거래 수수료/등록비 과금 모델 장착'
        ],
        pricingStrategy: '거래액 대비 10~15% 매칭 수수료 or 월간 파트너 등록비 19만원',
        fitReason: '시스템이 돌아가기 시작하면 대표가 자리를 비워도 비즈니스가 스스로 확장됩니다.'
    }
];

// ============================================================================
// Main Component
// ============================================================================

export default function BusinessArchitectureDashboard({
    onClose,
    initialTab = 'dna',
    onChatIntent,
    userProfile,
    isFullScreen = false
}: BusinessArchitectureDashboardProps) {
    const { reportData } = useReportStore();
    const [currentTab, setCurrentTab] = useState<BusinessTab>(initialTab);
    const [checkedMissions, setCheckedMissions] = useState<Record<string, boolean>>({
        m1: true,
        m2: false,
        m3: false,
        m4: false
    });

    // 1. 사용자 사주 기반 엔진 매핑
    const effectiveData = userProfile || reportData;
    const saju = effectiveData?.saju;

    // 일간(DayMaster) 및 사주 지표 안전 추출
    const dayMaster = saju?.dayMaster ||
        (saju?.fourPillars?.day?.gan?.char) ||
        (saju?.dayPillar?.stem) ||
        '갑';

    const ohaeng = saju?.ohaeng || { wood: 25, fire: 25, earth: 20, metal: 15, water: 15 };

    // CEO 아키타입 자동 판별 알고리즘
    const detectedCeoTypeKey = useMemo(() => {
        // 일간 및 오행 특성에 따른 매칭
        const woodFireScore = (ohaeng.wood || 0) + (ohaeng.fire || 0);
        const metalWaterScore = (ohaeng.metal || 0) + (ohaeng.water || 0);
        const earthScore = (ohaeng.earth || 0);

        if (['갑', '을', '병'].includes(dayMaster) || woodFireScore > 50) {
            return (ohaeng.fire || 0) > (ohaeng.wood || 0) ? 'brander' : 'creative';
        } else if (['경', '신', '임', '계'].includes(dayMaster) || metalWaterScore > 50) {
            return (ohaeng.metal || 0) > (ohaeng.water || 0) ? 'manager' : 'dealer';
        } else if (['무', '기'].includes(dayMaster) || earthScore > 30) {
            return 'manager';
        }
        return 'creative';
    }, [dayMaster, ohaeng]);

    const activeCeo = CEO_ARCHETYPES[detectedCeoTypeKey] || CEO_ARCHETYPES.creative;

    // 추천 머니 파이프라인 1순위
    const recommendedPipeline = useMemo(() => {
        if (activeCeo.id === 'creative') return MONEY_PIPELINES[0]; // 지식 IP
        if (activeCeo.id === 'brander') return MONEY_PIPELINES[1];  // 팬덤 구독
        if (activeCeo.id === 'manager') return MONEY_PIPELINES[2];  // B2B 솔루션
        return MONEY_PIPELINES[3]; // 플랫폼
    }, [activeCeo]);

    const toggleMission = (id: string) => {
        setCheckedMissions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // 1:1 상담 핸들러
    const handleConsultChat = (topic: string, query: string) => {
        if (onChatIntent) {
            onChatIntent('BUSINESS_ARCHITECTURE_COACHING', query);
            if (onClose) onClose();
        } else {
            // 라우팅 fallback
            window.location.href = `/report/startup?consult=${encodeURIComponent(topic)}`;
        }
    };

    return (
        <div
            className={`
                relative w-full bg-[#080811] text-slate-100 flex flex-col
                ${isFullScreen ? 'min-h-screen' : 'h-[92vh] max-h-[92vh] rounded-t-3xl md:rounded-3xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden'}
            `}
        >
            {/* 상단 앰비언트 글로우 백그라운드 효과 */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

            {/* 헤더 섹션 */}
            <header className="sticky top-0 z-40 bg-[#080811]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-rose-500 p-[1.5px] shadow-lg">
                            <div className="w-full h-full bg-[#0d0d1a] rounded-[14px] flex items-center justify-center text-xl">
                                🚀
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                                    비즈니스 아키텍처
                                    <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30">
                                        PRO 3S
                                    </span>
                                </h1>
                            </div>
                            <p className="text-[11px] md:text-xs text-slate-400">
                                내 사주에 맞는 무실패 창업 전략 <span className="text-slate-600">|</span> 일간 [{dayMaster}] 맞춤 분석
                            </p>
                        </div>
                    </div>

                    {/* 닫기 버튼 */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
                            aria-label="닫기"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* 3대 핵심 네비게이션 탭 (사용자 메뉴 100% 동일) */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 bg-white/5 border border-white/10 rounded-2xl">
                    <button
                        onClick={() => setCurrentTab('dna')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                            currentTab === 'dna'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <Brain className="w-4 h-4 text-purple-300" />
                        <span>CEO DNA</span>
                    </button>

                    <button
                        onClick={() => setCurrentTab('wealth')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                            currentTab === 'wealth'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <Flame className="w-4 h-4 text-amber-300" />
                        <span>머니 마그넷</span>
                    </button>

                    <button
                        onClick={() => setCurrentTab('timing')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                            currentTab === 'timing'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <Rocket className="w-4 h-4 text-emerald-300" />
                        <span>퀀텀 스케일</span>
                    </button>
                </div>
            </header>

            {/* 메인 스크롤 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6 space-y-6 pb-28">
                <AnimatePresence mode="wait">
                    {/* ============================================================ */}
                    {/* TAB 1: 🧠 CEO DNA (리더십 코드) */}
                    {/* ============================================================ */}
                    {currentTab === 'dna' && (
                        <motion.div
                            key="dna"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            {/* 아키타입 메인 히어로 카드 */}
                            <div className={`p-6 rounded-3xl bg-gradient-to-br ${activeCeo.bgGradient} border ${activeCeo.borderGlow} relative overflow-hidden`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                {activeCeo.badge}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                롤모델: {activeCeo.mentor}
                                            </span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                            <span>{activeCeo.icon}</span>
                                            <span>{activeCeo.title}</span>
                                        </h2>
                                        <p className="text-xs md:text-sm text-purple-200/80 mt-1 font-medium">
                                            "{activeCeo.subtitle}"
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 items-center justify-center text-3xl shrink-0 border border-white/15">
                                        {activeCeo.icon}
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-white/10 text-xs md:text-sm text-slate-300 leading-relaxed">
                                    <strong className="text-white">🧬 코어 메커니즘:</strong> {activeCeo.coreTrait}
                                </div>
                            </div>

                            {/* 5대 리더십 레이더 스펙트럼 */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        선천적 5각 리더십 역량 게이지
                                    </h3>
                                    <span className="text-[11px] text-slate-400">사주 원국 정밀 산출</span>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { label: '창의·파괴적 혁신', score: activeCeo.radarScores.innovation, color: 'from-purple-500 to-indigo-500' },
                                        { label: '조직 관리·시스템 규율', score: activeCeo.radarScores.management, color: 'from-blue-500 to-cyan-500' },
                                        { label: '자본 레버리지·수익화', score: activeCeo.radarScores.capital, color: 'from-amber-500 to-yellow-500' },
                                        { label: '팬덤 소통·대중 흡인력', score: activeCeo.radarScores.fandom, color: 'from-pink-500 to-rose-500' },
                                        { label: '불확실성 위기돌파력', score: activeCeo.radarScores.grit, color: 'from-emerald-500 to-teal-500' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-slate-300">{item.label}</span>
                                                <span className="text-white font-bold">{item.score}점</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.score}%` }}
                                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3대 필살기 & 취약점 비교 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/25">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                        대표의 3대 무기 (Superpowers)
                                    </h4>
                                    <ul className="space-y-2">
                                        {activeCeo.superpowers.map((p, i) => (
                                            <li key={i} className="text-xs md:text-sm text-slate-200 flex items-start gap-2">
                                                <span className="text-emerald-400 font-bold">✓</span>
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/25">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                                        <ShieldAlert className="w-4 h-4" />
                                        번아웃 주의 영역 (Vulnerabilities)
                                    </h4>
                                    <ul className="space-y-2">
                                        {activeCeo.weaknesses.map((w, i) => (
                                            <li key={i} className="text-xs md:text-sm text-slate-300 flex items-start gap-2">
                                                <span className="text-rose-400 font-bold">!</span>
                                                <span>{w}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* 필수 C-Level 파트너 궁합 */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-indigo-400" />
                                    <h3 className="text-sm font-bold text-white">
                                        사주 맞춤 최적의 C-Level 파트너 궁합
                                    </h3>
                                </div>
                                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 mt-2">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                                            추천 영입: {activeCeo.partnerMatch.role}
                                        </span>
                                        <span className="text-xs text-slate-300 font-medium">
                                            ({activeCeo.partnerMatch.type})
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {activeCeo.partnerMatch.reason}
                                    </p>
                                </div>
                            </div>

                            {/* 치명적 경영 리스크 경고 */}
                            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                                <span className="text-xl">⚠️</span>
                                <div className="text-xs md:text-sm text-amber-200/90 leading-relaxed">
                                    {activeCeo.fatalFlaw}
                                </div>
                            </div>

                            {/* 1:1 상담 CTA */}
                            <div className="pt-2">
                                <button
                                    onClick={() => handleConsultChat(
                                        'CEO_DNA',
                                        `저는 사주 일간 '${dayMaster}'의 '${activeCeo.title}' 유형입니다. 저에게 가장 적합한 조직 빌딩 방식과 제가 피해야 할 치명적 경영 리스크를 구체적인 사례와 함께 1:1로 코칭해주세요.`
                                    )}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🧠 내 CEO DNA로 1:1 경영 전략 심층 상담받기</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ============================================================ */}
                    {/* TAB 2: 🔥 머니 마그넷 (부의 필살기) */}
                    {/* ============================================================ */}
                    {currentTab === 'wealth' && (
                        <motion.div
                            key="wealth"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            {/* 머니 마그넷 헤더 카드 */}
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        부의 최단거리 공식
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        일간 [{dayMaster}] ✕ 재성 수용체
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                    <span>🔥</span>
                                    <span>내 사주가 돈을 버는 가장 빠른 길</span>
                                </h2>
                                <p className="text-xs md:text-sm text-amber-200/90 mt-1">
                                    노동력을 갈아 넣지 않고, 사주의 타고난 기질을 현금 파이프라인으로 전환하는 4대 무기입니다.
                                </p>

                                {/* 1순위 추천 파이프라인 하이라이트 */}
                                <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl shrink-0">
                                            {recommendedPipeline.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-amber-400 font-bold uppercase">사주 원국 1순위 최적화 파이프라인</p>
                                            <h4 className="text-base font-black text-white">{recommendedPipeline.title}</h4>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <span className="text-xs font-mono text-amber-300 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                                            확장성 {recommendedPipeline.scalabilityScore}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 4대 부의 파이프라인 매트릭스 */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-amber-400" />
                                    내 사주 맞춤 4대 부의 파이프라인 맵
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {MONEY_PIPELINES.map((pipe) => {
                                        const isBest = pipe.id === recommendedPipeline.id;
                                        return (
                                            <div
                                                key={pipe.id}
                                                className={`p-5 rounded-2xl border transition-all ${
                                                    isBest
                                                        ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{pipe.icon}</span>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                                                {pipe.title}
                                                                {isBest && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-extrabold">
                                                                        BEST
                                                                    </span>
                                                                )}
                                                            </h4>
                                                            <p className="text-[11px] text-slate-400">{pipe.subTitle}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="my-3 p-2.5 rounded-xl bg-black/40 border border-white/5">
                                                    <p className="text-xs font-mono text-amber-300 font-bold">
                                                        {pipe.formula}
                                                    </p>
                                                </div>

                                                {/* 3단계 실행 청사진 */}
                                                <div className="space-y-1.5 mb-3">
                                                    {pipe.actionBlueprint.map((step, sIdx) => (
                                                        <div key={sIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                                            <span className="text-amber-400 font-bold shrink-0">{sIdx + 1}.</span>
                                                            <span className="leading-snug">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                                                    <span className="text-slate-400">가격 퍼널 전략:</span>
                                                    <span className="font-bold text-amber-200">{pipe.pricingStrategy}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 머니 락커 (돈 새는 구멍 차단) */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 to-amber-950/30 border border-rose-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                                    <h3 className="text-sm font-bold text-white">
                                        부의 수용체 방어벽: 머니 락커 (Money Locker)
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    사주에서 재물이 새어나가는 가장 큰 구멍은 <strong className="text-rose-300">"검증 없는 과도한 선투자"</strong>와 <strong className="text-amber-300">"사무실·인테리어 등 고정비 과다 지출"</strong>입니다.
                                </p>
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                                        <div className="font-bold text-emerald-400 mb-0.5">고정비 최소화</div>
                                        <div className="text-slate-400 text-[11px]">사무실 대신 1인 홈오피스/노션 시작</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                                        <div className="font-bold text-amber-400 mb-0.5">선판매 후제작</div>
                                        <div className="text-slate-400 text-[11px]">10명의 사전 유료 예약 후 프로덕트 완성</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                                        <div className="font-bold text-purple-400 mb-0.5">현금 방어선</div>
                                        <div className="text-slate-400 text-[11px]">최소 6개월간 사업 유지 현금 확보</div>
                                    </div>
                                </div>
                            </div>

                            {/* 1:1 상담 CTA */}
                            <div className="pt-2">
                                <button
                                    onClick={() => handleConsultChat(
                                        'MONEY_MAGNET',
                                        `제 사주 일간 '${dayMaster}'에 가장 최적화된 '${recommendedPipeline.title}'을 제 현실 상황에 맞춰 실제로 어떻게 세팅하고 가격을 매겨야 하는지 구체적인 3단계 실행 가이드를 코칭해주세요.`
                                    )}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🔥 내 부의 필살기로 1:1 수익화 모델 상담받기</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ============================================================ */}
                    {/* TAB 3: 🚀 퀀텀 스케일 (확장 타이밍) */}
                    {/* ============================================================ */}
                    {currentTab === 'timing' && (
                        <motion.div
                            key="timing"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            {/* 퀀텀 타이밍 히어로 카드 */}
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        확장 타이밍 알고리즘
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        대운 & 세운 결합 분석
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                    <span>🚀</span>
                                    <span>언제 엑셀을 밟아야 하는가?</span>
                                </h2>
                                <p className="text-xs md:text-sm text-emerald-200/90 mt-1">
                                    사업의 성패는 속도가 아니라 타이밍입니다. 지금이 씨앗을 뿌릴 때인지, 전면 공격할 때인지 정확히 알아야 실패하지 않습니다.
                                </p>

                                {/* 현재 비즈니스 기상도 상태 */}
                                <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                                            ☀️
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-emerald-400 font-bold uppercase">2025~2026 나의 비즈니스 기상도</p>
                                            <h4 className="text-base font-black text-white">도약 & 시장 개척기 (Launch & Traction)</h4>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                                        공격 60% / 수비 40%
                                    </span>
                                </div>
                            </div>

                            {/* 4계절 비즈니스 사이클 매트릭스 */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Compass className="w-4 h-4 text-emerald-400" />
                                    비즈니스 4계절 사이클 로드맵
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        {
                                            phase: '🌱 씨앗 & 내실기',
                                            timing: '시스템 빌딩',
                                            action: '아이템 선정, 린 MVP 개발, 10명 피드백',
                                            color: 'border-slate-500/30 bg-slate-900/40 text-slate-300'
                                        },
                                        {
                                            phase: '☀️ 도약 & 개척기',
                                            timing: '현재 나의 구간!',
                                            action: '공격적 콘텐츠 마케팅, 첫 유료 고객 100명 확보',
                                            color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200 shadow-md shadow-emerald-500/10'
                                        },
                                        {
                                            phase: '🚀 퀀텀 확장기',
                                            timing: '전면 액셀 스케일',
                                            action: '팀 빌딩, 광고 레버리지, B2B 제휴 및 대형 투자',
                                            color: 'border-indigo-500/30 bg-indigo-950/30 text-indigo-300'
                                        },
                                        {
                                            phase: '🛡️ 수비 & 현금확보기',
                                            timing: '자산 방어',
                                            action: '내실 다지기, 누수 차단, 영업이익률 극대화',
                                            color: 'border-amber-500/30 bg-amber-950/30 text-amber-300'
                                        }
                                    ].map((cycle, cIdx) => (
                                        <div key={cIdx} className={`p-4 rounded-2xl border ${cycle.color}`}>
                                            <div className="text-xs font-bold mb-1">{cycle.phase}</div>
                                            <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 inline-block mb-2">
                                                {cycle.timing}
                                            </div>
                                            <p className="text-[11px] leading-relaxed opacity-90">{cycle.action}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 분기별 비즈니스 골든타임 캘린더 */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-400" />
                                        올해 분기별 비즈니스 골든타임 행동 지침
                                    </h3>
                                    <span className="text-[11px] text-slate-400">월운(月運) 연동</span>
                                </div>

                                <div className="space-y-2.5">
                                    {[
                                        { q: '1분기 (기반 구축)', act: '킬러 오퍼 설계 및 랜딩페이지 완성, 사전 예약 리드 50명 수집', badge: '기반 다지기' },
                                        { q: '2분기 (공식 론칭)', act: '정식 유료 론칭, 바이럴 챌린지 퍼널 가동, 초기 매출 500만원 달성', badge: '골든 론칭' },
                                        { q: '3분기 (제휴 확장)', act: '인접 분야 전문가와 크로스 프로모션, B2B 납품 제안서 배포', badge: '네트워크 확장' },
                                        { q: '4분기 (시스템 자동화)', act: '연간 실적 회고, 반복 업무 외주/자동화 세팅, 내년 스케일업 준비', badge: '시스템 안착' },
                                    ].map((item, qIdx) => (
                                        <div key={qIdx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-emerald-400 shrink-0">{item.q}</span>
                                                <span className="text-slate-300">{item.act}</span>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold shrink-0 border border-emerald-500/30">
                                                {item.badge}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 인터랙티브 3개년 마일스톤 미션 체크리스트 */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/20 to-emerald-950/20 border border-teal-500/25">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-teal-400" />
                                    무실패 3개년 퀀텀 스케일 실천 마일스톤
                                </h3>

                                <div className="space-y-2">
                                    {[
                                        { id: 'm1', label: '1단계: 내 사주 맞춤 핵심 킬러 상품 1개 정의 및 프로토타입 완성' },
                                        { id: 'm2', label: '2단계: 무료 챌린지 퍼널을 통해 신뢰 고객 100명 모으기' },
                                        { id: 'm3', label: '3단계: 첫 번째 자동화 결제 파이프라인 개설 및 월 300만원 매출 돌파' },
                                        { id: 'm4', label: '4단계: 취약 영역을 메꿔줄 C-Level 파트너 영입 및 법인 전환 스케일업' },
                                    ].map((m) => {
                                        const isChecked = checkedMissions[m.id];
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => toggleMission(m.id)}
                                                className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                                    isChecked
                                                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs border ${
                                                    isChecked ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-white/20'
                                                }`}>
                                                    {isChecked ? '✓' : ''}
                                                </div>
                                                <span className="text-xs md:text-sm font-medium">{m.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 1:1 상담 CTA */}
                            <div className="pt-2">
                                <button
                                    onClick={() => handleConsultChat(
                                        'QUANTUM_TIMING',
                                        `지금 제 사주 대운과 올해 세운에서 제가 언제 사업의 엑셀을 가장 강하게 밟아야 하고, 올해 몇 월에 신제품 론칭이나 이직/창업을 실행해야 가장 성공 확률이 높은지 1:1로 코칭해주세요.`
                                    )}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🚀 내 최적의 타이밍으로 1:1 스케일업 전략 상담받기</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
