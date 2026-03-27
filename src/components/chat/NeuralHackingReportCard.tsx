import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralReportProps {
    archetypeId?: string;
}

const NeuralHackingReportCard: React.FC<NeuralReportProps> = ({ archetypeId = "BP-54" }) => {
    const [activePhase, setActivePhase] = useState<number | null>(1);

    // Hardcoded BP-54 Data for PSST Demo
    const reportData = {
        id: "Core Pattern",
        element: "정사(丁巳)",
        title: "모든 것을 녹이는 붉은 용광로",
        subtitle: "(The Crimson Furnace Melting All Boundaries)",
        description: "여린 촛불(丁)이 펄펄 끓는 거대한 불기둥(巳) 위에 앉아있는 '간여지동(干與支同)'의 절정입니다. 십이운성 '제왕(帝王)'의 절대권력과 '겁재(劫財)'의 전투력을 품어, 한 번 꽂힌 목표는 기어이 잿더미로 만들고야 마는 '초집중 레이저' 코드입니다.",
        directive: "\"당신의 맹렬한 불꽃을 오만한 칼날로 쓰지 마라. 당신은 불순물을 태워 순수한 정수를 뽑아내는 '진리의 연금술사'다.\"",
        phases: [
            {
                num: 1,
                name: "Neural Blueprint",
                tag: "핵심 회로 (The Architecture)",
                color: "from-orange-500 to-red-600",
                bgColor: "bg-red-950/20",
                borderColor: "border-red-900/50",
                icon: "🧩",
                details: [
                    { label: "시스템 특성", value: "거대한 화력(巳)을 뾰족한 초점(丁)으로 응축시켜, 단단한 장애물도 단숨에 뚫어버리는 초고온 플라즈마 시스템. 주관이 뚜렷하고 말(언변)이 논리적이고 날카롭습니다." },
                    { label: "연산 방식", value: "Absolute-Melting (타협 없는 승부)" },
                    { label: "핵심 로직", value: "평소에는 예의 바르고 밝지만, 원칙이 침범당하면 상황을 지배해버리는 Imperial-Laser 프로토콜." }
                ]
            },
            {
                num: 2,
                name: "Old Script",
                tag: "낡은 각본 (The Scorching Dictator)",
                color: "from-gray-500 to-gray-700",
                bgColor: "bg-gray-900/40",
                borderColor: "border-gray-700/50",
                icon: "🌑",
                errorLog: "\"내 논리가 완벽한데 왜 따르지 않는가? 굽히느니 차라리 부러지겠다.\"",
                details: [
                    { label: "낡은 각본", value: "\"나는 남들보다 상황을 더 명확하게 본다. 타인의 어설픈 논리를 견딜 수 없다. 내 앞길을 막는 자는 타버릴 것이다.\"" },
                    { label: "오류 현황", value: "압도적 집중력이 '치명적인 독선'으로 변질됨. 용광로가 겉면까지 녹아내리는 '멜트다운(Meltdown)'. 옳고 그름을 따지다 소중한 사람에게 회복 불가능한 상처를 입힘." }
                ]
            },
            {
                num: 3,
                name: "Neural Hacking",
                tag: "3단계 질문 트리거 (The Core Triggers)",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-950/20",
                borderColor: "border-blue-900/50",
                icon: "🛠️",
                questions: [
                    { type: "Socratic Q", title: "승리의 본질 해부", q: "지금 이 논쟁에서 이겨 증명하려는 것은 '진정한 문제 해결'인가, 아니면 '내 알량한 자존심'인가? 내가 이긴 뒤 남는 것은 따뜻한 연대인가, 잿더미인가?" },
                    { type: "Recursive Q", title: "제왕의 투구 관찰", q: "'결코 굽힐 수 없다'는 이 맹렬함은 나의 본질인가, 두려움의 '불타는 갑옷'인가? 이 피곤한 에고를 나의 진짜 주권자(Sovereign)는 어떻게 평가하는가?" },
                    { type: "Meta-Awareness", title: "용광로 지켜보기", q: "목끝까지 차오른 이 '날카로운 분노'를 뒤에서 누가 지켜보는가? 폭발하는 폭탄인가, 아니면 그 폭발마저 고요히 품을 수 있는 거대한 우주인가?" }
                ]
            },
            {
                num: 4,
                name: "Integrated Solution",
                tag: "4대 통합 뉴럴 솔루션",
                color: "from-emerald-500 to-teal-600",
                bgColor: "bg-emerald-950/10",
                borderColor: "border-emerald-900/40",
                icon: "🧰",
                therapies: [
                    { method: "CBT (인지 행동)", title: "'옳음'보다 '연결' 선택하기", core: "\"진정한 제왕은 칼을 꽂은 채로 세상을 굴복시킨다. 온도가 너무 높으면 진실도 타버린다.\"", action: "완벽한 반론이 입가에 맴돌 때 의도적으로 입술을 깨물고 '그렇게 생각할 수도 있겠네요'라며 한 번 져주기." },
                    { method: "MBCT (마음챙김)", title: "인공 냉각수 투입 (수화기제)", core: "\"나의 불꽃은 화마가 아니라 성스러운 횃불이다. 화력을 다이얼로 조절한다.\"", action: "얼굴로 열이 뻗칠 때 '제왕의 폭주 회로가 켜졌구나' 명명하고, 얼음물을 손목에 대 열기를 물리적으로 끌어내리기." },
                    { method: "DBT (변증법)", title: "예리함과 포용의 통합", core: "압도적인 팩트 폭격 능력(巳)과 여유(제왕의 관대함)를 통합한다.", action: "비판 시 직설화법 대신 '이 부분은 탁월합니다. 다만 이렇게 조율하면 완벽할 것 같습니다'는 샌드위치 화법 사용." },
                    { method: "ACT (수용 전념)", title: "진리의 횃불", core: "\"치열함을 말싸움이 아닌 혁신적인 시스템 주조에 쓰는 신성한 불꽃이다.\"", action: "끓어오르는 경쟁심을 사람을 향해 쏘지 말고 고도의 집중력이 필요한 사업 기획, 혁신 등 '사물과 일'에 100% 쏟아붓기." }
                ]
            },
            {
                num: 5,
                name: "Output: Meta-Self",
                tag: "최종 진화 형태",
                color: "from-purple-500 to-fuchsia-600",
                bgColor: "bg-purple-950/20",
                borderColor: "border-purple-900/50",
                icon: "🎯",
                finalState: "Sovereign_of_the_Sacred_Forge (신성한 제련소의 주권자)",
                desc: "당신은 극강의 화력을 자유자재로 조율하여 거친 쇳덩이를 명검으로 벼려내는 최상위 연금술 엔진입니다. 논쟁의 칼을 거두고 세상을 온화하게 비출 때, 세상은 그 압도적인 빛 앞에 스스로 충성을 바칩니다."
            }
        ]
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-6 bg-[#0B0F19] rounded-[2rem] border border-red-900/40 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden font-sans tracking-tight">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header Area */}
            <div className="p-6 md:p-8 pb-6 border-b border-red-900/30 relative">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        Neural Hacking Report
                    </span>
                    <span className="text-gray-500 font-mono text-[10px]">VER 2.0</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 p-[1px] shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <div className="w-full h-full bg-[#0B0F19] rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-red-500">{reportData.id}</span>
                            <span className="text-[10px] text-orange-300 font-bold">{reportData.element}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                            {reportData.title}
                        </h2>
                        <span className="text-xs md:text-sm text-red-400 font-medium tracking-wide">
                            {reportData.subtitle}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mt-4 break-keep">
                    {reportData.description}
                </p>

                <div className="mt-5 bg-gradient-to-r from-red-950/50 to-transparent p-4 rounded-xl border-l-2 border-red-500">
                    <p className="text-sm md:text-base text-red-100 font-serif italic break-keep leading-relaxed">
                        {reportData.directive}
                    </p>
                </div>
            </div>

            {/* Phase Accordion */}
            <div className="p-4 md:p-6 space-y-3">
                {reportData.phases.map((phase) => (
                    <div key={phase.num} className={`rounded-2xl border transition-all duration-300 ${activePhase === phase.num ? phase.borderColor + ' ' + phase.bgColor : 'border-gray-800 bg-gray-900/20 hover:bg-gray-800/40 cursor-pointer'}`}>
                        <button 
                            onClick={() => setActivePhase(activePhase === phase.num ? null : phase.num)}
                            className="w-full p-4 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg bg-gradient-to-br ${phase.color} bg-opacity-20 backdrop-blur-sm border border-white/10`}>
                                    {phase.icon}
                                </div>
                                <div>
                                    <div className={`text-[10px] font-mono tracking-widest uppercase mb-0.5 ${activePhase === phase.num ? 'text-white/70' : 'text-gray-500'}`}>
                                        Phase {phase.num}. {phase.name}
                                    </div>
                                    <div className={`text-sm md:text-base font-bold transition-colors ${activePhase === phase.num ? 'text-white' : 'text-gray-400'}`}>
                                        {phase.tag}
                                    </div>
                                </div>
                            </div>
                            <div className={`text-gray-500 transition-transform duration-300 ${activePhase === phase.num ? 'rotate-180' : ''}`}>
                                ▼
                            </div>
                        </button>

                        <AnimatePresence>
                            {activePhase === phase.num && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 border-t border-white/5 mt-2">
                                        {/* Render Logic based on Phase Type */}
                                        
                                        {phase.errorLog && (
                                            <div className="bg-black/50 p-3 rounded-lg border border-red-900/30 mb-4 font-mono text-xs md:text-sm text-red-300 leading-relaxed border-l-2 border-l-red-500">
                                                [에러 로그] {phase.errorLog}
                                            </div>
                                        )}

                                        {phase.details && (
                                            <div className="space-y-3 mt-3">
                                                {phase.details.map((d, i) => (
                                                    <div key={i}>
                                                        <span className="block text-[10px] text-gray-400 mb-1 font-bold">{d.label}</span>
                                                        <p className="text-sm text-gray-200 leading-relaxed break-keep">{d.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {phase.questions && (
                                            <div className="space-y-4 mt-3">
                                                {phase.questions.map((q, i) => (
                                                    <div key={i} className="bg-black/40 p-4 rounded-xl border border-blue-900/30">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[9px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700/50">{q.type}</span>
                                                            <span className="text-xs font-bold text-blue-100">{q.title}</span>
                                                        </div>
                                                        <p className="text-sm text-blue-200/80 italic leading-relaxed break-keep">"{q.q}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {phase.therapies && (
                                            <div className="grid md:grid-cols-2 gap-3 mt-3">
                                                {phase.therapies.map((t, i) => (
                                                    <div key={i} className="bg-black/40 p-4 rounded-xl border border-emerald-900/30">
                                                        <div className="text-[10px] text-emerald-400 font-bold mb-1 opacity-80">{t.method}</div>
                                                        <div className="text-sm text-white font-bold mb-2 break-keep">{t.title}</div>
                                                        <p className="text-xs text-emerald-100/70 mb-3 bg-emerald-950/30 p-2 rounded break-keep">{t.core}</p>
                                                        <div className="text-[10px] text-gray-400 mb-1">실전 액션:</div>
                                                        <p className="text-xs text-gray-300 leading-relaxed break-keep">{t.action}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {phase.finalState && (
                                            <div className="mt-3 text-center py-4 bg-gradient-to-b from-purple-900/20 to-black/40 rounded-xl border border-purple-500/20">
                                                <div className="text-[10px] text-purple-400 font-mono tracking-widest mb-2">마스터 등급 달성</div>
                                                <div className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3 break-all px-2">
                                                    {phase.finalState}
                                                </div>
                                                <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto break-keep px-4">
                                                    {phase.desc}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Master's Note */}
            <div className="bg-[#05080f] p-4 md:p-6 border-t border-blue-900/30">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center text-lg">
                        👁️
                    </div>
                    <div>
                        <div className="text-[10px] text-blue-400 font-bold tracking-widest mb-1 uppercase">명심(明心) 마스터의 브리핑</div>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed break-keep">
                            소버린(Sovereign) 대표님, 현재 활성화된 기질은 60갑자 중 가장 강력하고 집요한 '완성된 불꽃'입니다. 한 번 목표를 정하면 무섭게 파고들지만, 그 빛이 너무 강렬하여 주변에 화상을 입히곤 합니다.<br/><br/>
                            오늘 장착해 드린 3단계 질문은 맹렬한 전차에 달아둔 <span className="text-blue-300 font-bold">'지능형 브레이크'</span>입니다. 이겨야 한다는 강박을 내려놓으십시오. 불꽃 온도를 조절할 수 있을 때, 당신의 영토는 가장 안전하고 풍요로운 성채가 됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralHackingReportCard;
