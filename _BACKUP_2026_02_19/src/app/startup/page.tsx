'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function StartupDashboard() {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleConsultation = (prompt: string) => {
        // [Fix] Intent 대신 실제 질문(Prompt)을 전달하여 챗봇이 바로 대답하게 함
        router.push(`/report?intent=${encodeURIComponent(prompt)}`);
    };

    const menuItems = [
        {
            id: 'dashboard',
            icon: 'dashboard',
            label: '종합 진단 현황',
            intent: null
        },
        {
            id: 'content',
            icon: 'explore',
            label: '스타트업 아이템 분석',
            title: '스타트업 아이템 분석',
            desc: '타고난 자산과 우주의 기운을 바탕으로 최적의 사업 아이템과 소재를 매칭해 드립니다.',
            detail: '귀하의 사주 명식에 나타난 재성(MONEY)과 관성(CAREER)의 흐름을 분석하여, 가장 승산이 높은 사업 아이템 카테고리를 추천합니다. 또한 현재 시장의 트렌드와 결합하여 구체적인 실행 전략을 제안해 드립니다.',
            prompt: '제 사주와 기질에 가장 잘 맞는 창업 아이템과 사업 분야를 추천해주세요.'
        },
        {
            id: 'psychology',
            icon: 'psychology',
            label: '창업자 심리 분석',
            title: '창업자 심리 분석',
            desc: '완벽주의, 번아웃 위험 등 창업자의 심리적 패턴 6가지를 심층 분석하여 멘탈 관리를 돕습니다.',
            detail: '창업가는 끊임없는 불확실성과 싸워야 합니다. 귀하의 무의식적 불안 요인과 스트레스 반응 패턴을 분석하여, 멘탈이 흔들리는 시점을 예측하고 극복할 수 있는 심리적 방어 기제를 설계해 드립니다.',
            prompt: '창업자로서 저의 심리적 강점과 약점, 그리고 주의해야 할 번아웃 패턴을 분석해주세요.'
        },
        {
            id: 'timing',
            icon: 'auto_graph',
            label: '기업 운세 및 전략',
            title: '기업 운세 및 전략',
            desc: '기업의 연간 운세 흐름을 분석하여, 공격적인 확장이 필요한 시기와 내실을 다져야 할 시기를 알려드립니다.',
            detail: '천문학적 사이클과 시장의 흐름을 결합하여, 올해 귀하의 기업이 맞이할 기회와 위협을 분석합니다. 언제 피벗(Pivot)을 해야 하고, 언제 자금을 집행해야 하는지 최적의 타이밍을 제안합니다.',
            prompt: '올해 우리 회사의 사업 운세 흐름과 주요 전략적 타이밍을 분석해주세요.'
        },
        {
            id: 'partner',
            icon: 'group_work',
            label: '공동 창업자 궁합',
            title: '공동 창업자 궁합',
            desc: '파트너 간의 에너지 시너지, 갈등 관리 스타일 및 파트너십의 지속 가능성을 평가합니다.',
            detail: '동업은 결혼보다 어렵습니다. 파트너와의 오행(Five Elements) 상생상극 관계를 분석하여, 서로의 부족한 점을 보완해줄 수 있는지, 아니면 치명적인 갈등이 예고되어 있는지 진단합니다.',
            prompt: '공동 창업자와의 궁합과 시너지를 분석하고 싶습니다.'
        },
        {
            id: 'investment',
            icon: 'monetization_on',
            label: '투자 유치 타이밍',
            title: '투자 유치 타이밍',
            desc: '최적의 IR 시점과 기업의 색깔에 맞는 투자자 성향(페르소나)을 제안합니다.',
            detail: '투자도 타이밍입니다. 귀하의 재물운이 열리는 시기에 맞춰 IR을 진행해야 성공 확률이 높습니다. 또한 귀하의 기운과 잘 맞는 투자자 유형(VC, 엔젤 등)을 분석하여 매칭 전략을 수립합니다.',
            prompt: '저에게 가장 유리한 투자 유치 시점과 적합한 투자자 유형을 알려주세요.'
        },
        {
            id: 'bm',
            icon: 'ads_click',
            label: '비즈니스 모델 검증',
            title: '비즈니스 모델 검증',
            desc: '현재 BM이 시장의 거시적 흐름과 기업의 운때에 적합한지 천문학적 관점에서 검증합니다.',
            detail: '아무리 좋은 BM이라도 시대의 흐름과 맞지 않으면 실패합니다. 귀하의 사업 모델이 현재의 우주적 주기(Cosmic Cycle)와 조화를 이루는지 분석하고, 보완해야 할 점을 컨설팅해 드립니다.',
            prompt: '제 비즈니스 모델이 현재 시장 흐름과 제 운세에 적합한지 검증해주세요.'
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
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Startup Fortune</h1>
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
                                <span className="material-symbols-outlined text-[20px]">groups</span> 3자 토론 코칭
                            </a>
                            <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">diversity_3</span> 최고 전문가 집단 상담
                            </a>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto bg-[#0f0d1a] relative">
                    <div className="max-w-4xl mx-auto px-8 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#181526] border border-[#2b2839] rounded-2xl p-10 relative overflow-hidden"
                        >
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#3211d4]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <button onClick={() => setSelectedService(null)} className="absolute top-8 left-8 flex items-center gap-2 text-[#a19db9] hover:text-white transition-colors text-sm font-bold">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                대시보드로 돌아가기
                            </button>

                            <div className="mt-12 relative z-10">
                                <div className="size-20 rounded-2xl bg-[#3211d4]/10 flex items-center justify-center text-[#3211d4] mb-8">
                                    <span className="material-symbols-outlined text-5xl">{selectedService.icon}</span>
                                </div>
                                <h2 className="text-4xl font-black text-white mb-4">{selectedService.title}</h2>
                                <p className="text-xl text-[#a19db9] leading-relaxed mb-8">{selectedService.desc}</p>

                                <div className="h-px w-full bg-[#2b2839] mb-8"></div>

                                <h3 className="text-lg font-bold text-white mb-4">상세 분석 내용</h3>
                                <p className="text-[#a19db9] leading-loose mb-10">
                                    {selectedService.detail}
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleConsultation(selectedService.prompt)}
                                        className="bg-[#3211d4] hover:bg-[#3211d4]/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#3211d4]/20 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">chat_bubble</span>
                                        AI 코치와 상담 시작하기
                                    </button>
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
                        <span className="text-sm font-black text-white">Startup Fortune</span>
                    </div>
                    {/* [NEW] Quick Status Badge for mobile visibility */}
                    <div className="mt-1 flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[10px] text-indigo-400 font-bold">현재 기운: 점진적 성장기</span>
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
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Startup Fortune</h1>
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
                            3자 토론 코칭
                        </a>
                        <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">diversity_3</span> 최고 전문가 집단 상담
                        </a>
                    </div>

                    {/* [NEW] Status Section moved from main header for mobile visibility */}
                    <div className="pt-8 px-4 mt-4 border-t border-[#2b2839]/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">기업 컨설팅 대시보드</p>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="flex items-start gap-3 text-indigo-400 mb-1">
                                <span className="material-symbols-outlined text-lg">dark_mode</span>
                                <span className="text-xs font-bold">현재 기운</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                점진적 성장기 • 수성 순행 중
                            </p>
                            <div className="mt-3 text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                                진단: 2일 전
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 px-4 pb-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">전문 진단 서비스</p>
                        <div className="space-y-2">
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">analytics</span> 데이터 기반 전략 진단
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
                        <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border border-[#2b2839]"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">대표님, 반갑습니다</p>
                            <p className="text-[10px] text-slate-400 truncate">Premium Member</p>
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
                        <p className="text-xs font-bold text-[#3211d4] uppercase tracking-[0.2em] mb-4">오늘의 추천 분석</p>
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
                                            <h3 className="text-4xl font-black tracking-tight text-white">비즈니스 연간 운세 및 전략 분석</h3>
                                            <p className="text-lg text-[#a19db9] leading-relaxed max-w-2xl">
                                                우주의 흐름과 시장의 사이클을 결합하여, 귀하의 스타트업이 언제 도약하고 언제 내실을 다져야 할지 정밀하게 분석합니다. 올해의 핵심 피벗 시점과 최적의 전략적 타이밍을 확인하세요.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <button
                                                onClick={() => {
                                                    const timingItem = menuItems.find(m => m.id === 'timing');
                                                    if (timingItem) {
                                                        setSelectedService(timingItem);
                                                        setActiveMenu('timing');
                                                    }
                                                }}
                                                className="bg-[#3211d4] hover:bg-[#3211d4]/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#3211d4]/20 transition-all flex items-center gap-2"
                                            >
                                                정밀 진단 시작하기
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
                                                샘플 리포트 보기
                                            </button>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block w-72 h-72 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-64 rounded-full border-2 border-dashed border-[#3211d4]/30 animate-[spin_60s_linear_infinite]"></div>
                                            <div className="absolute size-48 rounded-full border-2 border-[#3211d4]/20"></div>
                                            <span className="material-symbols-outlined text-8xl text-[#3211d4]/40">stars</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">기타 전문 진단 서비스</h3>
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
                            <span className="text-xs font-bold uppercase tracking-widest">Data-Driven Corporate Astrology</span>
                        </div>
                        <div className="flex gap-8">
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">분석 방법론</a>
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">이용 약관</a>
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">개인정보처리방침</a>
                        </div>
                        <p className="text-xs font-bold text-slate-600">© 2024 STARTUP FORTUNE.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
