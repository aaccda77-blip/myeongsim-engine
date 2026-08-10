'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ExecutiveDashboardModal from '@/components/startup/ExecutiveDashboardModal';

export default function StartupDashboard() {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isExecutiveDashboardOpen, setIsExecutiveDashboardOpen] = useState(false);

    const handleConsultation = (prompt: string) => {
        // [Fix] Intent 대신 실제 질문(Prompt)을 전달하여 챗봇이 바로 대답하게 함
        router.push(`/report?intent=${encodeURIComponent(prompt)}`);
    };

    const menuItems = [
        {
            id: 'dashboard',
            icon: 'dashboard',
            label: '종합 분석 현황',
            intent: null
        },
        {
            id: 'content',
            icon: 'explore',
            label: '사업 아이템 & 적성 적합도',
            title: '사업 아이템 & 적성 적합도',
            desc: '창업자의 선천적 역량 구조와 기질 데이터를 바탕으로 최적의 사업 아이템 및 분야를 매칭합니다.',
            detail: '귀하의 선천적 기질 프로필에 나타난 식상(INNOVATION)과 재성(CAPITAL)의 흐름을 정밀 분석하여, 가장 사업적 타당성이 높은 아이템 카테고리를 도출합니다. 또한 현재 시장 트렌드와 결합하여 구체적인 제품·서비스 실행 전략을 수립해 드립니다.',
            prompt: '제 기질 프로필에 가장 잘 맞는 창업 아이템과 사업 분야를 추천해주세요.',
            highlights: [
                { title: '선천적 식상·재성 역량 도출', desc: '창업가의 타고난 식상(INNOVATION)과 재성(CAPITAL) 데이터 기반 최적 사업 소재 매칭' },
                { title: '시장 트렌드 & 피벗 전략', desc: '거시적 시장 트렌드와 결합한 고승률 사업 카테고리 선정 및 3단계 피벗 실행 로드맵' },
                { title: '핵심 콤피턴시 리스크 검증', desc: '사업 추진 과정에서 나타날 수 있는 기질적 취약점 및 조직 실행력 리스크 사전 예방' }
            ]
        },
        {
            id: 'psychology',
            icon: 'psychology',
            label: '창업자 리더십 & 마인드셋',
            title: '창업자 리더십 & 마인드셋',
            desc: '완벽주의, 번아웃 등 대표자의 6대 핵심 인지 패턴을 정밀 분석하여 멘탈 회복력을 강화합니다.',
            detail: '창업가는 극심한 불확실성과 결정 피로(Decision Fatigue) 속에서 조직을 이끌어야 합니다. 일간 및 인성 기전 기반의 의식 오류 패턴을 분석하여, 리더십 균열 시점을 사전 예방하고 지속 가능한 CEO 멘탈리티를 구축해 드립니다.',
            prompt: '창업자로서 저의 심리적 강점과 약점, 그리고 주의해야 할 번아웃 패턴을 분석해주세요.',
            highlights: [
                { title: '6대 핵심 인지 패턴 정밀 분석', desc: '완벽주의, 번아웃, 결정 피로(Decision Fatigue) 등 대표자의 심리적 스트레스 기전 분석' },
                { title: '리더십 균열 시점 예방 가이드', desc: '조직 확장 및 위기 상황 시 발동되는 무의식적 방어 기제 분석 및 멘탈 회복력 강화' },
                { title: 'CEO 맞춤형 수석 리더십 프로필', desc: '지속 가능한 최고경영자 멘탈리티 유지를 위한 마인드 버그 디버깅 및 자기조율 전략' }
            ]
        },
        {
            id: 'timing',
            icon: 'auto_graph',
            label: '기업 경영 모멘텀 & 전략',
            title: '기업 경영 모멘텀 & 전략',
            desc: '기업의 연간 성장 사이클을 분석하여, 공격적 확장과 조직 정실의 최적 타이밍을 제안합니다.',
            detail: '세운과 대운의 거시적 경영 사이클을 분석하여, 올해 귀하의 기업이 맞이할 피벗 적기와 자금 집행 및 조직 확장 최적 타이밍을 정밀 분석합니다.',
            prompt: '올해 우리 회사의 사업 경영 모멘텀과 주요 전략적 타이밍을 분석해주세요.',
            highlights: [
                { title: '연간 경영 모멘텀 타임라인', desc: '분기별/월별 사업 확장, 조직 재정비 및 리스크 방어 적기 도출' },
                { title: '피벗 & 자금 집행 타이밍', desc: '자금 조달(IR) 및 B2B 대형 계약 체결 최적 구간 정밀 분석' },
                { title: '조직 확장 리스크 제어', desc: '비겁/형살 구간에 대비한 HR 조직 개편 및 법률적 리스크 사전 방어책 제안' }
            ]
        },
        {
            id: 'partner',
            icon: 'group_work',
            label: '공동 창업자 케미스트리 & 시너지',
            title: '공동 창업자 케미스트리 & 시너지',
            desc: '공동 창업자 간 기질 상성, 갈등 해결 스타일 및 리더십 파트너십의 지속 가능성을 평가합니다.',
            detail: '공동 창업은 기업의 생존을 결정짓는 핵심 요소입니다. 파트너 간 궁합 및 오행·기질 모달리티 시너지를 분석하여, 서로의 리더십 공백을 보완하는 최상의 조직 케미스트리를 분석하고 갈등 예방 가이드를 제공합니다.',
            prompt: '공동 창업자와의 시너지와 협업 평가를 분석하고 싶습니다.',
            highlights: [
                { title: '파트너 기질 상성 & 오행 시너지', desc: '공동 창업자 간 오행 상생상극 및 비겁·관성 시너지를 통한 역량 보완성 평가' },
                { title: '갈등 해결 & 의사결정 스타일', desc: '위기 시 의사결정 충돌 가능성 분석 및 파트너십 지속 가능성 리포트 도출' },
                { title: '리더십 역할 분담 시스템', desc: 'CEO, CTO, COO 등 핵심 C-Level 간 역할 충돌 방지를 위한 최적 R&R 방안 설계' }
            ]
        },
        {
            id: 'investment',
            icon: 'monetization_on',
            label: '투자 유치 & 자금조달 타이밍',
            title: '투자 유치 & 자금조달 타이밍',
            desc: '최적의 자금 조달(IR) 적기를 도출하고, 기업 문화에 부합하는 투자자 페르소나를 매칭합니다.',
            detail: '자금 조달 역시 정밀한 타이밍의 예술입니다. 귀하의 재성(財) 및 관성(官) 에너지가 최고조에 달하는 시점에 맞춰 IR 및 라운드 오픈을 진행할 때 유동성 성공 확률이 가장 높습니다. 적합한 투자자 페르소나 매칭 전략을 제공합니다.',
            prompt: '저에게 가장 유리한 투자 유치 시점과 적합한 투자자 유형을 알려주세요.',
            highlights: [
                { title: '자금 조달(IR) 최적 타임윈도우', desc: '재성(財) 및 관성(官) 에너지가 최고조에 달하는 IR 및 라운드 오픈 시점 정밀 도출' },
                { title: '투자자(VC/엔젤) 페르소나 매칭', desc: '기업의 상성 데이터에 잘 부합하고 장기 시너지를 극대화할 최적 투자자 유형 분석' },
                { title: '유동성 리스크 & 런웨이 방어 전략', desc: '자금 고갈 위험 구간 사전 인지 및 라운드 마감 타임라인 리스크 관리 제안' }
            ]
        },
        {
            id: 'bm',
            icon: 'ads_click',
            label: '비즈니스 모델(BM) 타당성 검증',
            title: '비즈니스 모델(BM) 타당성 검증',
            desc: '현재 BM이 거시적 시장 흐름 및 기업의 선천적 시스템 역량에 부합하는지 정밀 검증합니다.',
            detail: '아무리 독창적인 BM이라도 시장의 생태계 사이클과 조화를 이루지 못하면 정체됩니다. 귀하의 사업 모델 내 수익 창출 구조(식신생재) 및 시장 안착(재생관) 타당성을 명리·경영학적으로 종합 검증하고 피벗 가이드를 제공합니다.',
            prompt: '제 비즈니스 모델이 현재 시장 흐름에 적합한지 검증해주세요.',
            highlights: [
                { title: '식신생재 & 재생관 타당성 검증', desc: '수익 창출 구조(식신생재) 및 시장 안착(재생관) 타당성의 명리·경영학 종합 검증' },
                { title: '거시적 시장 사이클 부합도', desc: '현재 BM이 거시 경제 및 산업 생태계 사이클과 조화를 이루는지 적합도 정밀 분석' },
                { title: 'BM 피벗 & 수익 모델 고도화 가이드', desc: '시장 정체 극복을 위한 비즈니스 모델 수정 방향성 및 차세대 수익 드라이버 제안' }
            ]
        }
    ];

    // [View Logic] 상세 보기 모드
    if (selectedService) {
        return (
            <div className="flex h-screen overflow-hidden bg-[#0f0d1a]">
                {/* Same Sidebar (Simplified for brevity implies layout consistency) */}
                <aside className="w-72 bg-[#131022] border-r border-[#2b2839] flex flex-col h-full z-50">
                    <div className="p-6 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-[#3211d4] shadow-lg shadow-[#3211d4]/20 text-white">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Startup Coaching</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Enterprise Solution</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">컨설팅 메뉴</p>
                        {menuItems.map((item) => (
                            <a
                                key={item.id}
                                onClick={() => {
                                    if (item.id === 'dashboard') {
                                        setSelectedService(null);
                                        setActiveMenu('dashboard');
                                    } else {
                                        setSelectedService(item);
                                        setActiveMenu(item.id);
                                    }
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg group transition-all cursor-pointer ${activeMenu === item.id
                                    ? 'bg-[#3211d4]/10 text-[#3211d4] border-r-2 border-[#3211d4]'
                                    : 'text-[#a19db9] hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className={`text-sm ${activeMenu === item.id ? 'font-bold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </a>
                        ))}
                        <div className="pt-8 px-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">특별 기능</p>
                            <a onClick={() => router.push('/startup/facilitation')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">groups</span> 창업팀 다자간 코칭
                            </a>
                            <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">diversity_3</span> 수석 아키텍트 그룹 자문
                            </a>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto bg-[#0f0d1a] relative custom-scrollbar">
                    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#181526] border border-[#2b2839] rounded-2xl p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#3211d4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <button onClick={() => setSelectedService(null)} className="absolute top-6 left-8 flex items-center gap-2 text-[#a19db9] hover:text-white transition-colors text-sm font-bold">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                대시보드로 돌아가기
                            </button>

                            <div className="mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                {/* Left Info Column */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="size-16 rounded-2xl bg-[#3211d4]/10 border border-[#3211d4]/20 flex items-center justify-center text-[#3211d4]">
                                        <span className="material-symbols-outlined text-4xl">{selectedService.icon}</span>
                                    </div>
                                    <div>
                                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                                            Enterprise Diagnosis Core
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">{selectedService.title}</h2>
                                        <p className="text-base md:text-lg text-[#a19db9] leading-relaxed">{selectedService.desc}</p>
                                    </div>

                                    <div className="h-px w-full bg-[#2b2839]"></div>

                                    {/* [NEW] 3대 핵심 리포트 Bullet Points */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <span className="text-amber-400">📌</span>
                                            본 분석에서 제공되는 3대 핵심 리포트
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedService.highlights ? (
                                                selectedService.highlights.map((h: any, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all">
                                                        <div className="size-6 rounded-lg bg-[#3211d4]/20 border border-[#3211d4]/40 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0 mt-0.5">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-white mb-0.5">{h.title}</p>
                                                            <p className="text-[11px] text-slate-400 leading-relaxed">{h.desc}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-[#a19db9] leading-relaxed">{selectedService.detail}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={() => setIsExecutiveDashboardOpen(true)}
                                            className="w-full sm:w-auto bg-gradient-to-r from-[#3211d4] to-[#5b36ff] hover:from-[#3211d4]/90 hover:to-[#5b36ff]/90 text-white px-8 py-4 rounded-xl font-extrabold text-base md:text-lg shadow-xl shadow-[#3211d4]/30 transition-all flex items-center justify-center gap-3 group"
                                        >
                                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform text-amber-300">bolt</span>
                                            <span>경영 모멘텀 정밀 분석 실행하기</span>
                                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Visual Emblem & Chart Box */}
                                <div className="lg:col-span-5 bg-[#131022] border border-[#2b2839] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-400 text-sm">verified_user</span>
                                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Enterprise Security</span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                                    </div>

                                    {/* Central Graphic Radar & Momentum Spectrum */}
                                    <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                                        <div className="size-48 rounded-full border border-indigo-500/30 flex items-center justify-center animate-[spin_120s_linear_infinite] relative">
                                            <div className="size-36 rounded-full border border-dashed border-purple-500/40 animate-[spin_60s_linear_infinite_reverse]"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-36 h-36 text-indigo-400/40" viewBox="0 0 100 100">
                                                    <polygon points="50,10 88,32 88,76 50,95 12,76 12,32" fill="none" stroke="currentColor" strokeWidth="0.8" />
                                                    <polygon points="50,22 75,36 65,70 50,82 25,68 28,34" fill="rgba(99,102,241,0.2)" stroke="#818cf8" strokeWidth="1.5" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">DATA-DRIVEN ENGINE</span>
                                            <span className="text-xl font-black text-white font-mono my-0.5">N-DEEP-SYNC</span>
                                            <span className="text-[10px] text-slate-400 font-medium">99.8% 정밀도 도출</span>
                                        </div>
                                    </div>

                                    {/* Security Badges Footer */}
                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                        <span>ISO-27001 ENCRYPTED</span>
                                        <span>DATA-DRIVEN AI</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        );
    }

    // [Default View] 대시보드 메인
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0f0d1a]">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden p-4 bg-[#131022] border-b border-[#2b2839] flex items-center justify-between z-[60]">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-[#3211d4] flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                        <span className="text-sm font-black text-white">Startup Coaching</span>
                    </div>
                    {/* [NEW] Quick Status Badge for mobile visibility */}
                    <div className="mt-1 flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[10px] text-indigo-400 font-bold">현재 경영 모멘텀: 점진적 성장기</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="material-symbols-outlined text-slate-400"
                >
                    {isSidebarOpen ? 'close' : 'menu'}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                ${isSidebarOpen ? 'flex' : 'hidden md:flex'} 
                fixed md:relative inset-0 md:inset-auto 
                w-full md:w-72 bg-[#131022] border-r border-[#2b2839] flex-col h-full z-50
            `}>
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-[#3211d4] shadow-lg shadow-[#3211d4]/20 text-white">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Startup Coaching</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Enterprise Solution</p>
                        </div>
                    </div>
                    {/* [NEW] Close button - navigates to main app */}
                    <button
                        onClick={() => router.push('/report')}
                        className="material-symbols-outlined text-slate-400 hover:text-white transition-colors"
                        title="명심코칭AI 메인으로"
                    >
                        close
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">컨설팅 메뉴</p>
                    {menuItems.map((item) => (
                        <a
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'dashboard') {
                                    setActiveMenu('dashboard');
                                    setSelectedService(null);
                                } else {
                                    setActiveMenu(item.id);
                                    setSelectedService(item); // 바로 상세 보기로 이동
                                }
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg group transition-all cursor-pointer ${activeMenu === item.id
                                ? 'bg-[#3211d4]/10 text-[#3211d4] border-r-2 border-[#3211d4]'
                                : 'text-[#a19db9] hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className={`text-sm ${activeMenu === item.id ? 'font-bold' : 'font-medium'}`}>
                                {item.label}
                            </span>
                        </a>
                    ))}

                    <div className="pt-8 px-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">특별 기능</p>
                        <a
                            onClick={() => router.push('/startup/facilitation')}
                            className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                            창업팀 다자간 코칭
                        </a>
                        <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">diversity_3</span> 수석 아키텍트 그룹 자문
                        </a>
                    </div>

                    {/* [NEW] Status Section moved from main header for mobile visibility */}
                    <div className="pt-8 px-4 mt-4 border-t border-[#2b2839]/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">기업 컨설팅 대시보드</p>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="flex items-start gap-3 text-indigo-400 mb-1">
                                <span className="material-symbols-outlined text-lg">insights</span>
                                <span className="text-xs font-bold">현재 경영 모멘텀</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                점진적 성장기 • 안정적 확장 단계
                            </p>
                            <div className="mt-3 text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                                분석: 2일 전
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 px-4 pb-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">전문 분석 서비스</p>
                        <div className="space-y-2">
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">analytics</span> 데이터 기반 전략 분석
                            </a>
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">balance</span> 법률/행정 리스크 점검
                            </a>
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">hub</span> 조직 구조 및 시스템 설계
                            </a>
                        </div>
                    </div>
                </nav>

                <div className="p-6 border-t border-[#2b2839]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border border-[#2b2839] flex items-center justify-center text-white font-bold text-xs">
                            CEO
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">이경윤 대표님 (명심코칭)</p>
                            <p className="text-[10px] text-indigo-400 font-extrabold tracking-wider truncate">Enterprise Member</p>
                        </div>
                    </div>
                    <button className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3211d4] px-4 text-xs font-bold text-white shadow-lg shadow-[#3211d4]/30 transition-all hover:bg-[#3211d4]/90">
                        <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                        <span>크레딧 충전</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#0f0d1a] custom-scrollbar">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">
                    {/* Header removed and moved to sidebar for mobile visibility */}

                    <section className="mb-12">
                        <p className="text-xs font-bold text-[#3211d4] uppercase tracking-[0.2em] mb-4">Enterprise Core Report</p>
                        <div className="relative overflow-hidden group rounded-2xl bg-gradient-to-br from-[#3211d4] to-[#5b36ff] p-[1px]">
                            <div className="bg-[#181526] rounded-[calc(1rem-1px)] p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 size-96 bg-[#3211d4]/10 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-24 -left-24 size-72 bg-[#3211d4]/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
                                    <div className="flex-1 space-y-6">
                                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[#3211d4]/10 text-[#3211d4]">
                                            <span className="material-symbols-outlined text-4xl">auto_graph</span>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                                                비즈니스 연간 경영 모멘텀 & 전략 분석
                                            </h3>
                                            <p className="text-base md:text-lg text-[#a19db9] leading-relaxed max-w-2xl">
                                                선천적 사업 구조와 세운의 흐름을 다차원으로 분석하여, 귀하의 기업이 언제 과감하게 도약하고 언제 조직의 내실을 다져야 할지 정밀 분석합니다. 올해의 핵심 피벗(Pivot) 적기 및 최적의 자금/확장 타이밍을 확인하세요.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <button
                                                onClick={() => setIsExecutiveDashboardOpen(true)}
                                                className="bg-[#3211d4] hover:bg-[#3211d4]/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#3211d4]/20 transition-all flex items-center gap-2"
                                            >
                                                ⚡ 경영 모멘텀 정밀 분석 실행하기
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                            <button
                                                onClick={() => setIsExecutiveDashboardOpen(true)}
                                                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                                            >
                                                샘플 리포트 보기
                                            </button>
                                        </div>
                                    </div>

                                    {/* [NEW] B2B Radar Chart & Corporate Momentum Visualization */}
                                    <div className="hidden lg:block w-80 h-80 relative flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-72 rounded-full border border-[#3211d4]/30 animate-[spin_90s_linear_infinite] flex items-center justify-center">
                                                <div className="size-56 rounded-full border border-dashed border-[#5b36ff]/40 animate-[spin_45s_linear_infinite_reverse]"></div>
                                            </div>

                                            {/* Radar Polygon Grid */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <svg className="w-64 h-64 text-[#5b36ff]/40" viewBox="0 0 100 100">
                                                    <polygon points="50,10 88,32 88,76 50,95 12,76 12,32" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                                                    <polygon points="50,25 73,38 73,68 50,80 27,68 27,38" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
                                                    <line x1="50" y1="10" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                                                    <line x1="12" y1="32" x2="88" y2="76" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                                                    <line x1="12" y1="76" x2="88" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

                                                    {/* Data Curve */}
                                                    <polygon points="50,18 80,35 68,72 50,86 20,70 24,36" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="1.8" />

                                                    {/* Data Nodes */}
                                                    <circle cx="50" cy="18" r="2.5" fill="#c084fc" />
                                                    <circle cx="80" cy="35" r="2.5" fill="#6366f1" />
                                                    <circle cx="68" cy="72" r="2.5" fill="#38bdf8" />
                                                    <circle cx="50" cy="86" r="2.5" fill="#a78bfa" />
                                                    <circle cx="20" cy="70" r="2.5" fill="#34d399" />
                                                    <circle cx="24" cy="36" r="2.5" fill="#fbbf24" />
                                                </svg>
                                            </div>

                                            {/* Center Momentum Score Badge */}
                                            <div className="absolute size-24 rounded-full bg-[#131022]/90 border border-indigo-500/50 shadow-2xl flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
                                                <span className="text-[8px] font-bold tracking-wider text-indigo-400 uppercase">MOMENTUM</span>
                                                <span className="text-lg font-black text-white font-mono leading-none my-0.5">94.8%</span>
                                                <span className="text-[8px] text-emerald-400 font-bold">🚀 도약 적기</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">기타 전문 분석 서비스</h3>
                            <a className="text-sm font-bold text-[#3211d4] hover:underline cursor-pointer">전체 보기</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {menuItems.filter(i => i.id !== 'dashboard').map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => {
                                        setSelectedService(service);
                                        setActiveMenu(service.id);
                                    }}
                                    className="group bg-[#181526] border border-[#2b2839] p-6 rounded-xl hover:border-[#3211d4]/50 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="size-12 rounded-lg bg-white/5 flex items-center justify-center text-[#3211d4]">
                                            <span className="material-symbols-outlined">{service.icon}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-600 group-hover:text-[#3211d4] transition-colors">arrow_forward</span>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-white">{service.label}</h4>
                                    <p className="text-sm text-[#a19db9] leading-relaxed line-clamp-2">{service.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="border-t border-[#2b2839] py-10">
                    <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-lg">verified</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Data-Driven Corporate Coaching</span>
                        </div>
                        <div className="flex gap-8">
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">분석 방법론</a>
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">이용 약관</a>
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">개인정보처리방침</a>
                        </div>
                        <p className="text-xs font-bold text-slate-600">© 2024 STARTUP COACHING.</p>
                    </div>
                </footer>
            </main>

            {/* [Executive Dashboard 1-Page Briefing Modal] */}
            <ExecutiveDashboardModal
                isOpen={isExecutiveDashboardOpen}
                onClose={() => setIsExecutiveDashboardOpen(false)}
                companyName="(주)명심코칭"
                ceoName="이경윤 대표님"
                onStartChat={handleConsultation}
            />
        </div>
    );
}