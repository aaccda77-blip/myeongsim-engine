import React from 'react';
import { motion } from 'framer-motion';

const NeuralArchitectureBlueprint: React.FC = () => {
    return (
        <div className="w-full max-w-3xl mx-auto my-6 bg-[#0B0F19] rounded-[2rem] border border-blue-900/40 shadow-[0_0_50px_rgba(30,58,138,0.2)] relative overflow-hidden font-sans tracking-tight">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.06)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header Area */}
            <div className="relative z-10 p-6 md:p-8 pb-6 border-b border-blue-900/30">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Myeongsim Master Plan
                    </span>
                    <span className="text-gray-500 font-mono text-[10px]">SYSTEM.CORE</span>
                </div>

                <div className="flex items-center gap-4 mb-3 mt-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        <div className="w-full h-full bg-[#0B0F19] rounded-2xl flex items-center justify-center text-3xl">
                            🌐
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                            명심(明心) 뉴럴 아키텍처
                        </h2>
                        <span className="text-xs md:text-sm text-blue-400 font-medium tracking-wide">
                            생체 컴퓨터 시스템 전체 조감도 (System Overview)
                        </span>
                    </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mt-4 break-keep">
                    인간의 기질은 하나의 거대한 '생체 컴퓨터'입니다. 
                    명심 코칭은 이 기질을 <strong className="text-blue-300">하드웨어(60갑자), 소프트웨어(10신), 배터리 상태(12운성), 바이러스 및 변수(12신살)</strong>로 해체하고 재조립합니다.
                </p>

                {/* Formula */}
                <div className="mt-5 bg-black/60 p-4 rounded-xl border border-blue-900/50 flex justify-center overflow-x-auto">
                    <code className="text-[10px] md:text-xs text-blue-200 font-mono whitespace-nowrap">
                        Sovereign_State = ∫ ( [OS × App] / DarkCode ) × Power dt
                    </code>
                </div>
            </div>

            {/* 4 Layers Grid */}
            <div className="relative z-10 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Layer 1: OS */}
                <div className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-5 hover:bg-blue-900/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🖥️</span>
                        <div>
                            <div className="text-[10px] font-mono text-blue-400 font-bold tracking-widest uppercase">Layer 1. The OS (운영체제)</div>
                            <div className="text-base font-black text-white">60 Base Pattern (하드웨어)</div>
                        </div>
                    </div>
                    <p className="text-xs text-blue-100/70 mb-3 break-keep leading-relaxed">
                        하늘의 기운(천간)과 땅의 현실(지지)이 결합된 60가지 고유 시스템 특성. 우주의 근원적 신경망 코드로 확장됩니다.
                    </p>
                    <ul className="space-y-2 text-[10px] md:text-xs font-mono text-gray-400">
                        <li className="flex justify-between"><span className="text-blue-300">개척자 매트릭스:</span> <span>이노베이션 엔진</span></li>
                        <li className="flex justify-between"><span className="text-red-300">표현/확장 매트릭스:</span> <span>초고온 플라즈마 융합</span></li>
                        <li className="flex justify-between"><span className="text-yellow-300">중재/저장 매트릭스:</span> <span>생태계 호스팅 시스템</span></li>
                        <li className="flex justify-between"><span className="text-gray-300">결단/가공 매트릭스:</span> <span>하이엔드 큐레이션</span></li>
                        <li className="flex justify-between"><span className="text-cyan-300">지혜/수용 매트릭스:</span> <span>인투이티브 정화 엔진</span></li>
                    </ul>
                </div>

                {/* Layer 2: Software */}
                <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-5 hover:bg-indigo-900/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📱</span>
                        <div>
                            <div className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">Layer 2. The Software</div>
                            <div className="text-base font-black text-white">5대 인지-행동 알고리즘 (App)</div>
                        </div>
                    </div>
                    <p className="text-xs text-indigo-100/70 mb-3 break-keep leading-relaxed">
                        내가 세상을 살아갈 때 어떤 앱(App)을 가장 많이 켜고 작동시키는가를 나타내는 인지 기능.
                    </p>
                    <ul className="space-y-2 text-[10px] md:text-xs text-gray-400">
                        <li><span className="text-indigo-300 font-bold">Identity (정체성):</span> 대등한 협력 / 극강의 승부욕</li>
                        <li><span className="text-indigo-300 font-bold">Output (출력):</span> 꾸준한 양육 / 천재적 파괴와 혁신</li>
                        <li><span className="text-indigo-300 font-bold">Resource (자원):</span> 치밀한 유지 / 거시적 장악(투자)</li>
                        <li><span className="text-indigo-300 font-bold">Governance (통제):</span> 시스템 규범 / 한계 극복 리더십</li>
                        <li><span className="text-indigo-300 font-bold">Input (수신):</span> 보편적 수용 / 직관적(예술적) 이면 꿰뚫기</li>
                    </ul>
                </div>

                {/* Layer 3: Power Phase */}
                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-5 hover:bg-emerald-900/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🔋</span>
                        <div>
                            <div className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">Layer 3. The Power Phase</div>
                            <div className="text-base font-black text-white">에너지 위상 곡선 (배터리)</div>
                        </div>
                    </div>
                    <p className="text-xs text-emerald-100/70 mb-3 break-keep leading-relaxed">
                        프로그램이 구동되는 에너지의 세기와 사이클 (Booting → Peak → Cooling → Reset).
                    </p>
                    <div className="flex space-x-1 h-2 bg-gray-800 rounded-full mb-3 overflow-hidden">
                        <div className="w-1/4 bg-blue-500/50"></div>
                        <div className="w-1/4 bg-emerald-500"></div>
                        <div className="w-1/4 bg-orange-500/50"></div>
                        <div className="w-1/4 bg-purple-500/30"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] md:text-xs">
                        <div className="text-blue-300">🌱 생장기 (Booting)<br/><span className="text-gray-500">탄생, 주목, 패기</span></div>
                        <div className="text-emerald-300">🔥 절정기 (Peak)<br/><span className="text-gray-500">자립, 압도적 권력</span></div>
                        <div className="text-orange-300">🍂 수렴기 (Cooling)<br/><span className="text-gray-500">노련함, 약화, 정지</span></div>
                        <div className="text-purple-300">❄️ 전환기 (Reset)<br/><span className="text-gray-500">저장, 단절, 잉태</span></div>
                    </div>
                </div>

                {/* Layer 4: Glitch */}
                <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 hover:bg-red-900/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <div className="text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase">Layer 4. The Glitch</div>
                            <div className="text-base font-black text-white">특수 변이 변수 (다크코드)</div>
                        </div>
                    </div>
                    <p className="text-xs text-red-100/70 mb-3 break-keep leading-relaxed">
                        작동을 방해하는 '버그'처럼 보이나 압도적인 무기가 되는 기적의 트리거(Dark Pattern).
                    </p>
                    <ul className="space-y-2 text-[10px] md:text-xs text-gray-400">
                        <li><span className="text-red-400 font-bold">망신(망신살):</span> 수치 노출 → <span className="text-white">파격적 혁신</span></li>
                        <li><span className="text-red-400 font-bold">도화(도화살):</span> 시선 중독 → <span className="text-white">최고급 매력 자본</span></li>
                        <li><span className="text-red-400 font-bold">역마(역마살):</span> 고립 도피 → <span className="text-white">글로벌 확장 엔진</span></li>
                        <li><span className="text-red-400 font-bold">백호(백호대살):</span> 압력 폭발 → <span className="text-white">불도저 에너지</span></li>
                    </ul>
                </div>
            </div>

            {/* Sovereign Core */}
            <div className="relative z-10 p-4 md:p-6 pb-8">
                <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 p-5 rounded-2xl border border-blue-500/30 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]">
                    <h3 className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 flex items-center justify-center gap-2">
                        <span>👑</span> The Core Hacking Tool: 소버린의 3단계 질문 (System Override)
                    </h3>
                    <p className="text-xs text-gray-300 text-center mb-4 break-keep">
                        이 64가지 신경망과 변수가 '각본(운명)'으로 옥죌 때, 시스템을 마비시키고 당신을 통제석(Admin)에 앉히는 궁극의 해킹 툴.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3 text-center">
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="text-blue-400 text-[10px] font-bold mb-1">1. 소파술 (객관화)</div>
                            <div className="text-[11px] text-gray-200">"이건 내 기질(에고)이 만든 착각인가, 팩트인가?"</div>
                        </div>
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                            <div className="text-purple-400 text-[10px] font-bold mb-1">2. 재귀적 질문 (관찰자)</div>
                            <div className="text-[11px] text-gray-200">"이 뻔한 각본대로 반응하고 있는 시스템을 누가 보고 있는가?"</div>
                        </div>
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 hover:border-pink-500/30 transition-colors">
                            <div className="text-pink-400 text-[10px] font-bold mb-1">3. 알아차림 (메타 자아)</div>
                            <div className="text-[11px] text-gray-200">"나는 이 흔들리는 코드가 아니라, 코드를 짜는 고요한 '바탕'이다."</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralArchitectureBlueprint;
