'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function StartupDashboard() {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const handleConsultation = (intent: string) => {
        router.push(`/?intent=${intent}`);
    };

    const menuItems = [
        { id: 'dashboard', icon: 'dashboard', label: '종합 진단 현황', intent: null },
        { id: 'content', icon: 'explore', label: '스타트업 아이템 분석', intent: 'ms_startup_content_match' },
        { id: 'psychology', icon: 'psychology', label: '창업자 심리 분석', intent: 'ms_startup_neural_awakening' },
        { id: 'timing', icon: 'auto_graph', label: '기업 운세 및 전략', intent: 'ms_startup_timing' },
        { id: 'partner', icon: 'group_work', label: '공동 창업자 궁합', intent: 'ms_startup_partner' },
        { id: 'investment', icon: 'monetization_on', label: '투자 유치 타이밍', intent: 'ms_startup_investment' },
        { id: 'bm', icon: 'ads_click', label: '비즈니스 모델 검증', intent: 'ms_startup_bm_validation' }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#0f0d1a]">
            {/* Sidebar */}
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
                                setActiveMenu(item.id);
                                if (item.intent) handleConsultation(item.intent);
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
                        <a
                            onClick={() => router.push('/')}
                            className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            메인 챗봇
                        </a>
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
            <main className="flex-1 overflow-y-auto bg-[#0f0d1a]">
                <div className="max-w-6xl mx-auto px-8 py-10">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight text-white">기업 컨설팅 대시보드</h2>
                            <div className="flex items-center gap-3 text-[#a19db9]">
                                <span className="material-symbols-outlined text-xl">dark_mode</span>
                                <span className="text-sm font-medium">현재 기운: 점진적 성장기 • 수성 순행 중</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-full">
                            마지막 진단: 2일 전
                        </div>
                    </header>

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
                                                onClick={() => handleConsultation('ms_startup_timing')}
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
                            {[
                                { icon: 'explore', title: '스타트업 아이템 분석', desc: '타고난 자산과 우주의 기운을 바탕으로 최적의 사업 아이템과 소재를 매칭해 드립니다.', intent: 'ms_startup_content_match' },
                                { icon: 'psychology', title: '창업자 심리 분석', desc: '완벽주의, 번아웃 위험 등 창업자의 심리적 패턴 6가지를 심층 분석하여 멘탈 관리를 돕습니다.', intent: 'ms_startup_neural_awakening' },
                                { icon: 'group_work', title: '공동 창업자 궁합', desc: '파트너 간의 에너지 시너지, 갈등 관리 스타일 및 파트너십의 지속 가능성을 평가합니다.', intent: 'ms_startup_partner' },
                                { icon: 'monetization_on', title: '투자 유치 타이밍', desc: '최적의 IR 시점과 기업의 색깔에 맞는 투자자 성향(페르소나)을 제안합니다.', intent: 'ms_startup_investment' },
                                { icon: 'ads_click', title: '비즈니스 모델 검증', desc: '현재 BM이 시장의 거시적 흐름과 기업의 운때에 적합한지 천문학적 관점에서 검증합니다.', intent: 'ms_startup_bm_validation' },
                                { icon: 'groups', title: '3자 토론 코칭', desc: '진행자 + AI 코치 + 나, 실시간 토론 및 끼어들기 가능한 특별 세션입니다.', intent: 'facilitation' }
                            ].map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => service.intent === 'facilitation' ? router.push('/startup/facilitation') : handleConsultation(service.intent)}
                                    className="group bg-[#181526] border border-[#2b2839] p-6 rounded-xl hover:border-[#3211d4]/50 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="size-12 rounded-lg bg-white/5 flex items-center justify-center text-[#3211d4]">
                                            <span className="material-symbols-outlined">{service.icon}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-600 group-hover:text-[#3211d4] transition-colors">arrow_forward</span>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-white">{service.title}</h4>
                                    <p className="text-sm text-[#a19db9] leading-relaxed">{service.desc}</p>
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
