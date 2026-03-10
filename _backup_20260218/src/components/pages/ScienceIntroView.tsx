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
                        운명과 심리,<br />그리고 웰니스 케어
                    </h1>
                    <p className="text-gray-400 text-sm mb-3">
                        당신의 삶을 입체적으로 관리하는
                    </p>
                    <p className="text-[#658c42] text-lg font-bold">
                        데이터 기반 토탈 헬스케어,<br />명심코칭
                    </p>
                    {/* New Motto - Sophisticated Design */}
                    <div className="mt-6 px-2 flex justify-center">
                        <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl w-full">
                            <p className="text-gray-300 text-[12px] leading-[1.7] break-keep">
                                "명심코칭은 <span className="text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-400/20">고정된 Z축(DNA)</span> 위에서,
                                <span className="text-purple-400 font-bold underline underline-offset-4 decoration-purple-400/20">X축(후성유전적 노력)</span>을 통해,
                                <br />
                                매 순간 <span className="text-amber-400 font-bold underline underline-offset-4 decoration-amber-400/20">Y축(뇌신경망)</span>을 최상의 상태로 유지하는
                                <br />
                                <span className="text-white font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    '운명 최적화 기술'
                                </span>
                                입니다."
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Section 1: 운명학 */}
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
                        <h2 className="text-white text-lg font-bold">지도를 펼치다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    "나를 둘러싼 우주의 기운과 내면의 패턴을 해석합니다."
                </p>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-400 text-xs">spa</span>
                            명리학 (Saju)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            타고난 기질과 에너지 흐름을 분석하여, 삶의 방향성을 제시하는 '잠재력 지도'를 제공합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-400 text-xs">yin_yang</span>
                            주역 (I Ching)
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            변화하는 삶의 국면 속에서 나아감과 물러남의 때를 아는 '지혜의 나침반'을 제안합니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Section 2: 심리학 */}
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
                        <h2 className="text-white text-lg font-bold">마음을 깨우다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    "검증된 심리 이론을 기반으로 마음의 근육을 단련합니다."
                </p>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1">CBT & ACT 기반 코칭</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            인지행동 및 수용전념 이론을 활용하여 생각의 패턴을 긍정적으로 재구성합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1">DBT (변증법적 행동치료)</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            감정 조절과 대인관계 기술을 향상시켜 삶의 균형을 찾도록 돕습니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1">MBCT & MBSR 프로그램</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            마음챙김 기반 스트레스 완화 기법으로 마음의 회복탄력성을 높입니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Section 3: 건강관리 */}
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
                    "국가 공인 전문가가 설계한 생활 습관 솔루션입니다."
                </p>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-xs">school</span>
                            보건교육사
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            개인의 건강 수준을 평가하고, 올바른 건강 생활 습관을 형성하도록 교육 및 상담합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-xs">fitness_center</span>
                            건강운동관리
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            개인의 체력과 신체 상태를 고려한 맞춤형 운동 루틴과 활동 가이드를 설계합니다.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-xs">restaurant</span>
                            영양분석+맞춤조합
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            식습관 분석을 통해 내 몸에 맞는 영양 밸런스를 맞추는 식단 관리법을 제안합니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Section 4: 기술 혁신 */}
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
                        <h2 className="text-white text-lg font-bold">기술로 완성하다</h2>
                    </div>
                </div>

                <p className="text-gray-300 text-xs mb-4 leading-relaxed italic">
                    "특허 출원으로 검증된 독보적인 융합 분석 기술"
                </p>

                <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4">
                        <h3 className="text-purple-300 font-bold text-sm mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            특허 출원 기술 적용
                        </h3>
                        <p className="text-gray-300 text-[10px] leading-relaxed mb-2">
                            <strong>발명의 명칭:</strong> 심리 및 생체데이터 기반 스트레스 관리 솔루션 제공 장치 및 이를 이용한 스트레스 관리 솔루션 제공 방법
                        </p>
                        <p className="text-gray-400 text-[10px] leading-relaxed mb-2">
                            <strong>출원 번호:</strong> 10-2025-0166877
                        </p>
                        <p className="text-gray-300 text-[10px] leading-relaxed">
                            <strong>핵심 기술:</strong> 사용자 단말기 및 웨어러블 기기를 통해 수집된 심리·생체 데이터를 융합 분석하여, 개인 맞춤형 스트레스 관리 및 예방 솔루션을 제공하는 통합 시스템
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                        <h3 className="text-blue-300 font-bold text-sm mb-1">Total Wellness Solution</h3>
                        <p className="text-gray-300 text-xs leading-relaxed">
                            동양의 통찰과 현대의 생체 데이터 분석 기술을 결합하여, 정신적(Mental), 신체적(Physical), 사회적(Social) 건강을 아우르는 통합 라이프 코칭
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <div className="px-6 py-8 text-center">
                <h2 className="text-white text-xl font-bold mb-2">
                    오류가 아니라,<br />장르입니다.
                </h2>
                <p className="text-gray-400 text-xs">
                    이제 명심코칭과 함께,<br />당신이라는 장르를 완성하세요.
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
                        본 서비스는 보건복지부의 <strong>'비의료 건강관리 서비스 가이드라인'</strong>을 준수합니다.
                        제공되는 모든 정보는 건강 증진 및 생활 습관 개선을 위한 보조적인 수단이며,
                        <strong>의학적 진단, 치료, 처방을 대체할 수 없습니다.</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
