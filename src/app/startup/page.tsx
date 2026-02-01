'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function StartupDashboard() {
    const router = useRouter();

    const handleConsultation = (intent: string) => {
        // 챗봇으로 이동하면서 intent 전달
        router.push(`/?intent=${intent}`);
    };

    const services = [
        {
            id: 'content_match',
            icon: 'explore',
            title: '스타트업 아이템 분석',
            desc: '타고난 자산과 우주의 기운을 바탕으로 최적의 사업 아이템과 소재를 매칭해 드립니다.',
            intent: 'ms_startup_content_match'
        },
        {
            id: 'neural_awakening',
            icon: 'psychology',
            title: '창업자 심리 분석',
            desc: '완벽주의, 번아웃 위험 등 창업자의 심리적 패턴 6가지를 심층 분석하여 멘탈 관리를 돕습니다.',
            intent: 'ms_startup_neural_awakening'
        },
        {
            id: 'partner',
            icon: 'group_work',
            title: '공동 창업자 궁합',
            desc: '파트너 간의 에너지 시너지, 갈등 관리 스타일 및 파트너십의 지속 가능성을 평가합니다.',
            intent: 'ms_startup_partner'
        },
        {
            id: 'investment',
            icon: 'monetization_on',
            title: '투자 유치 타이밍',
            desc: '최적의 IR 시점과 기업의 색깔에 맞는 투자자 성향(페르소나)을 제안합니다.',
            intent: 'ms_startup_investment'
        },
        {
            id: 'bm_validation',
            icon: 'ads_click',
            title: '비즈니스 모델 검증',
            desc: '현재 BM이 시장의 거시적 흐름과 기업의 운때에 적합한지 천문학적 관점에서 검증합니다.',
            intent: 'ms_startup_bm_validation'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
                            <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight text-white">Startup Fortune</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Enterprise Solution</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">chat</span>
                        메인 챗봇
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tight text-white">기업 컨설팅 대시보드</h2>
                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="material-symbols-outlined text-xl">dark_mode</span>
                                <span className="text-sm font-medium">현재 기운: 점진적 성장기 • 수성 순행 중</span>
                            </div>
                        </div>
                    </div>

                    {/* Featured Card */}
                    <div className="relative overflow-hidden group rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-[1px]">
                        <div className="bg-slate-900/90 backdrop-blur-xl rounded-[calc(1rem-1px)] p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 size-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 size-72 bg-blue-500/10 rounded-full blur-3xl"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
                                <div className="flex-1 space-y-6">
                                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-purple-500/20 text-purple-400">
                                        <span className="material-symbols-outlined text-4xl">auto_graph</span>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-4xl font-black tracking-tight text-white">비즈니스 연간 운세 및 전략 분석</h3>
                                        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                                            우주의 흐름과 시장의 사이클을 결합하여, 귀하의 스타트업이 언제 도약하고 언제 내실을 다져야 할지 정밀하게 분석합니다.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <button
                                            onClick={() => handleConsultation('ms_startup_timing')}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-500/20 transition-all flex items-center gap-2"
                                        >
                                            정밀 진단 시작하기
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden lg:block w-72 h-72 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-64 rounded-full border-2 border-dashed border-purple-400/30 animate-[spin_60s_linear_infinite]"></div>
                                        <div className="absolute size-48 rounded-full border-2 border-purple-400/20"></div>
                                        <span className="material-symbols-outlined text-8xl text-purple-400/40">stars</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Services Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">전문 진단 서비스</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleConsultation(service.intent)}
                                className="group bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl hover:border-purple-500/50 hover:bg-slate-900/70 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <span className="material-symbols-outlined">{service.icon}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-purple-400 transition-colors">arrow_forward</span>
                                </div>
                                <h4 className="text-lg font-bold mb-2 text-white">{service.title}</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 backdrop-blur-xl">
                        <p className="text-slate-300 text-lg">더 자세한 상담이 필요하신가요?</p>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-xl shadow-purple-500/20 transition-all"
                        >
                            <span className="material-symbols-outlined">chat</span>
                            AI 코치와 1:1 상담하기
                        </button>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 backdrop-blur-xl bg-black/20 py-10 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-lg">verified</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Data-Driven Corporate Astrology</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500">© 2024 STARTUP FORTUNE.</p>
                </div>
            </footer>
        </div>
    );
}
