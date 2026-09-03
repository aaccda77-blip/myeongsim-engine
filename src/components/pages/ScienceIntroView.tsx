'use client';

import { motion } from 'framer-motion';

export default function ScienceIntroView() {
    return (
        <div className="h-full flex flex-col overflow-y-auto pb-8">
            {/* Hero Section */}
            <div className="relative px-6 pt-8 pb-12 text-center border-b border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-[#658c42]/10 to-transparent pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h1 className="text-white text-2xl font-bold mb-3 leading-tight">
                        바이오-코드와 심리,<br />그리고 웰니스 케어
                    </h1>
                    <p className="text-gray-400 text-sm mb-3">
                        당신의 삶을 다차원적으로 관리하는
                    </p>
                    <p className="text-[#658c42] text-lg font-bold">
                        데이터 기반 초개인화 멘탈 헬스케어,<br />명심코칭
                    </p>
                    <div className="mt-6 px-2 flex justify-center">
                        <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl w-full">
                            <p className="text-gray-300 text-[12px] leading-[1.7] break-keep">
                                &quot;명심코칭은 <span className="text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-400/20">고정된 Z축(초기 기질값)</span> 위에서,
                                <span className="text-purple-400 font-bold underline underline-offset-4 decoration-purple-400/20">X축(신경가소성 훈련)</span>을 통해,
                                <br />
                                매 순간 <span className="text-amber-400 font-bold underline underline-offset-4 decoration-amber-400/20">Y축(실시간 신경망)</span>을 최상의 상태로 유지하는
                                <br />
                                <span className="text-white font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    &apos;라이프 알고리즘 최적화 기술&apos;
                                </span>
                                입니다.&quot;
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Section 1: 코드를 읽다 (Decoding) */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-6 py-8 border-b border-gray-800"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#658c42]/20 rounded-xl flex items-center justify-center border border-[#658c42]/30">
                        <span className="material-symbols-outlined text-[#658c42] text-xl">auto_awesome</span>
                    </div>
                    <div>
                        <span className="text-[#658c42] text-xs font-bold">01</span>
                        <h2 className="text-white text-lg font-bold">코드를 읽다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    &quot;당신의 고유한 신경망 패턴과 최적의 타이밍을 데이터로 해석합니다.&quot;
                </p>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-400 text-xs">spa</span>
                            🧬 뉴럴 아키타입 분석 (Neural Archetype Analysis)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            2천 년 시계열 통계 데이터를 기반으로, 당신이 타고난 기질적 강점과 스트레스 취약점을 분석하여 삶의 설계를 돕는 &apos;초기 설정값(Default Setting)&apos;을 제공합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-400 text-xs">yin_yang</span>
                            0️⃣1️⃣ 바이너리 패턴 알고리즘 (Binary Pattern Algorithm)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            변화하는 환경 변수(0과 1) 속에서, 나아갈 때와 멈출 때를 계산하는 &apos;의사결정 최적화 로직&apos;을 제안합니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Section 2: 마음을 튜닝하다 (Tuning) */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-6 py-8 border-b border-gray-800"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <span className="material-symbols-outlined text-blue-400 text-xl">psychology</span>
                    </div>
                    <div>
                        <span className="text-blue-400 text-xs font-bold">02</span>
                        <h2 className="text-white text-lg font-bold">마음을 튜닝하다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    &quot;검증된 뇌과학 이론을 기반으로 신경 회로를 재설계(Rewiring)합니다.&quot;
                </p>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1">🧠 인지 재구조화 (CBT & ACT)</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            인지행동 및 수용전념 이론을 활용하여, 부정적으로 고착된 생각의 자동 회로(Auto-pilot)를 긍정적이고 유연한 회로로 재배선(Rewiring)합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1">⚖️ 감정 조절 프로토콜 (DBT)</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            감정의 파동을 조절하고 대인관계 기술을 향상시켜, 사회적 상황에서의 심리적 항상성(Homeostasis)을 유지하도록 돕습니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1">🧘‍♂️ 뉴로-마인드풀니스 (MBCT & MBSR)</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            뇌의 &apos;디폴트 모드 네트워크(DMN)&apos;를 안정시키는 과학적 명상 기법으로 회복탄력성을 극대화합니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Section 3: 몸을 세우다 (Bio-Syncing) */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-6 py-8 border-b border-gray-800"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                        <span className="material-symbols-outlined text-green-400 text-xl">health_and_safety</span>
                    </div>
                    <div>
                        <span className="text-green-400 text-xs font-bold">03</span>
                        <h2 className="text-white text-lg font-bold">몸을 세우다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    &quot;국가 공인 전문가가 설계한 생활 습관 엔지니어링 솔루션입니다.&quot;
                </p>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-xs">school</span>
                            👨‍⚕️ 라이프 스타일 코칭 (Licensed Bio-Manager)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            보건교육사(국가공인)가 직접 설계한 커리큘럼으로, 개인의 바이오 리듬에 맞춘 건강 습관을 교육하고 코칭합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-xs">fitness_center</span>
                            🏃‍♂️ 활동량 캘리브레이션 (Activity Calibration)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            웨어러블 데이터와 연동하여, 현재 신체 에너지 레벨에 딱 맞는 맞춤형 활동 루틴과 휴식 가이드를 제시합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-xs">restaurant</span>
                            🥗 뉴트리-밸런스 로직 (Nutri-Balance Logic)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            현재의 대사 상태와 기질 분석을 통해, 부족한 에너지를 채우고 과잉된 에너지를 배출하는 최적의 영양 밸런스를 제안합니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Section 4: 기술로 증명하다 (Verification) */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-6 py-8 border-b border-gray-800"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                        <span className="material-symbols-outlined text-purple-400 text-xl">neurology</span>
                    </div>
                    <div>
                        <span className="text-purple-400 text-xs font-bold">04</span>
                        <h2 className="text-white text-lg font-bold">기술로 증명하다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    &quot;특허출원(제10-2025-0166877호) 기반의 독보적인 [예측-검증] 융합 시스템&quot;
                </p>

                <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4">
                        <h3 className="text-purple-300 font-bold text-sm mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            🔒 특허출원 기반 바이오-싱크 기술
                        </h3>
                        <p className="text-gray-300 text-[10px] leading-relaxed mb-2">
                            <strong>특허출원 명칭:</strong> 심리 및 생체데이터 기반 스트레스 관리 솔루션
                        </p>
                        <p className="text-gray-400 text-[10px] leading-relaxed mb-2">
                            <strong>출원 번호:</strong> 10-2025-0166877
                        </p>
                        <p className="text-gray-300 text-[10px] leading-relaxed">
                            <strong>핵심 기술:</strong> 스마트워치가 감지한 실시간 생체 신호(HRV, 심박수)와 사용자의 기질 데이터(Z축)를 융합 분석하여, 즉각적인 스트레스 해소 솔루션을 제공하고 그 효과를 수치로 검증하는 피드백 시스템.
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                        <h3 className="text-blue-300 font-bold text-sm mb-1">🌐 토탈 웰니스 솔루션 (Total Wellness Solution)</h3>
                        <p className="text-gray-300 text-xs leading-relaxed">
                            동양의 통찰(Insight)과 현대의 데이터 사이언스(Data Science)를 결합하여, 정신(Mental)-신체(Physical)-사회(Social) 건강을 아우르는 통합 라이프 OS.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <div className="px-6 py-8 text-center">
                <h2 className="text-white text-xl font-bold mb-2">
                    오류(Error)가 아니라,<br />장르(Genre)입니다.
                </h2>
                <p className="text-gray-400 text-xs">
                    이제 명심코칭 시스템과 함께,<br />당신이라는 고유한 장르를 완성하세요.
                </p>
            </div>

            {/* Disclaimer */}
            <div className="px-6 pb-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-yellow-300 font-bold text-xs mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">info</span>
                        서비스 이용 유의사항
                    </h3>
                    <p className="text-gray-300 text-[10px] leading-relaxed">
                        본 서비스는 보건복지부의 <strong>&apos;비의료 건강관리 서비스 가이드라인&apos;</strong>을 준수합니다.
                        제공되는 모든 정보는 <strong>자기 주도적 건강 관리(Self-Care)</strong>를 위한 과학적 보조 수단이며,
                        <strong> 의학적 분석, 코칭, 가이드을 대체할 수 없습니다.</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
