import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralArchitectureBlueprint: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<number>(0);

    const layers = [
        {
            icon: "🖥️",
            tag: "Layer 1",
            title: "The OS (운영체제)",
            subtitle: "나의 기본 신경망 아키텍처이자 뼈대",
            color: "blue",
            narrative: `대표님, 컴퓨터에 윈도우나 맥OS가 있듯이, 당신에게도 태어날 때 설치된 "운영체제"가 있습니다.\n\n하늘의 기운(천간)과 땅의 현실(지지)이 결합하여 당신만의 고유한 하드웨어를 만들었습니다. 이것이 바로 60가지 Base Pattern 중 하나인 당신의 "기질 OS"입니다.\n\n주역의 메타코드와 연동되어, 우주의 근원적 신경망 코드로 확장됩니다.`,
            groups: [
                { color: "text-emerald-300", name: "개척자 매트릭스 (목-木)", desc: "이노베이션 엔진 — 새로운 길을 개척하는 선구자" },
                { color: "text-red-300", name: "표현/확장 매트릭스 (화-火)", desc: "초고온 플라즈마 융합 — 세상을 밝히는 열정의 불꽃" },
                { color: "text-yellow-300", name: "중재/저장 매트릭스 (토-土)", desc: "생태계 호스팅 — 모든 것을 품는 대지의 포용력" },
                { color: "text-gray-300", name: "결단/가공 매트릭스 (금-金)", desc: "하이엔드 큐레이션 — 불필요한 것을 잘라내는 칼날" },
                { color: "text-cyan-300", name: "지혜/수용 매트릭스 (수-水)", desc: "인투이티브 정화 엔진 — 어둠 속에서 빛나는 직관" },
            ],
            oldScript: "\"나는 원래 이런 성격이니까 바꿀 수 없어.\" → OS를 '운명'으로 착각하고 무기력해짐.",
            socratic: "당신이 '나는 원래 이래'라고 단정한 그 성격은, 정말 바꿀 수 없는 하드웨어인가요? 아니면 단지 오래 쓴 '기본 설정(Default Setting)'은 아닌가요?",
            recursive: "지금 '나는 변할 수 없다'고 확신하는 그 목소리는 누구의 것인가요? 그것을 듣고 있는 '나'는 이미 그 목소리와 다른 존재 아닌가요?",
            meta: "OS는 '나'가 아닙니다. 나는 이 OS 위에서 돌아가는 프로그램도 아닙니다. 나는 이 모든 시스템을 관찰하고 있는 고요한 '관리자(Admin)'입니다."
        },
        {
            icon: "📱",
            tag: "Layer 2",
            title: "The Software (응용 프로그램)",
            subtitle: "세상을 인식하고 반응하는 5대 인지-행동 알고리즘",
            color: "indigo",
            narrative: `대표님의 OS 위에서 돌아가는 "앱(App)"들이 있습니다. 어떤 사람은 '경쟁 앱'을 많이 켜고, 어떤 사람은 '수용 앱'을 많이 켭니다.\n\n이것이 당신이 세상을 살아가는 방식, 즉 10가지 인지 기능(십신)입니다. 문제는... 우리가 어떤 앱을 자동실행하고 있는지조차 모른다는 것입니다.`,
            groups: [
                { color: "text-indigo-300", name: "Identity Module (정체성)", desc: "비견: 대등한 협력과 주체성 / 겁재: 극강의 승부욕과 판을 뒤집는 힘" },
                { color: "text-indigo-300", name: "Output Engine (표현·출력)", desc: "식신: 꾸준한 양육과 전문성 / 상관: 천재적 언변과 날카로운 혁신" },
                { color: "text-indigo-300", name: "Resource Allocator (자원 관리)", desc: "정재: 치밀한 관리와 안정 / 편재: 거시적 안목과 리스크 테이킹" },
                { color: "text-indigo-300", name: "Governance Protocol (규율·통제)", desc: "정관: 객관적 원칙 수호 / 편관: 위기 돌파의 카리스마" },
                { color: "text-indigo-300", name: "Input Receiver (데이터 수신)", desc: "정인: 보편적 수용력 / 편인: 이면을 꿰뚫는 예술적 직관" },
            ],
            oldScript: "\"나는 원래 예민한 사람이야.\" → 자동 실행되는 '상관(혁신/파괴) 앱'을 나 자체로 동일시함.",
            socratic: "지금 당신이 '예민하다'고 느끼는 그 반응은, 당신의 본질인가요? 아니면 현재 자동 실행 중인 앱(App) 하나가 과부하 상태인 것은 아닌가요?",
            recursive: "'나는 예민해'라고 규정하는 그 판단 자체를 지켜보세요. 그 판단을 내리는 프로그램과, 그것을 관찰하는 '나'는 같은 존재인가요?",
            meta: "앱이 폭주할 때, 당신은 그 앱이 아닙니다. 당신은 언제든 그 앱을 끄거나 업데이트할 수 있는 '시스템 관리자'입니다. 그 고요한 자리를 느껴보세요."
        },
        {
            icon: "🔋",
            tag: "Layer 3",
            title: "The Power Phase (배터리 위상)",
            subtitle: "프로그램이 구동되는 에너지의 세기와 주기",
            color: "emerald",
            narrative: `에너지에는 리듬이 있습니다. 봄처럼 솟구치는 시기, 여름처럼 타오르는 시기, 가을처럼 거두는 시기, 겨울처럼 쉬어가는 시기.\n\n12단계의 에너지 파동 곡선은 당신의 '배터리 상태'를 보여줍니다.\n\n문제는, 겨울에 접어들었는데도 여름처럼 달리려 하면 시스템이 망가진다는 것입니다. 당신의 계절을 아는 것, 그것이 지혜의 시작입니다.`,
            groups: [
                { color: "text-blue-300", name: "🌱 생장기 (Booting)", desc: "장생(탄생의 호기심), 목욕(도약의 매력), 관대(독립의 패기)" },
                { color: "text-emerald-300", name: "🔥 절정기 (Peak)", desc: "건록(완벽한 자립), 제왕(압도적 카리스마 — 독선의 경계)" },
                { color: "text-orange-300", name: "🍂 수렴기 (Cooling)", desc: "쇠(노련한 지혜), 병(예술적 직관), 사(고도의 정신 집중)" },
                { color: "text-purple-300", name: "❄️ 전환기 (Reset)", desc: "묘(깊은 인내), 절(제로 포인트), 태(새 희망), 양(느긋한 준비)" },
            ],
            oldScript: "\"나는 요즘 운이 나빠.\" → 에너지 사이클의 '수렴기'를 '불운'으로 착각하고 발버둥침.",
            socratic: "지금 느끼는 이 '막힘'은 정말 불운인가요? 아니면 겨울 나무가 뿌리를 깊이 내리듯, 당신의 시스템이 다음 도약을 위해 '에너지를 축적'하는 과정은 아닌가요?",
            recursive: "'운이 나쁘다'고 판단하는 기준은 무엇인가요? 그 기준 자체가 '여름에만 좋은 것'이라는 낡은 프로그램에서 나온 것은 아닌가요?",
            meta: "에너지는 파동입니다. 올라감이 있으면 반드시 내려감이 있습니다. 내려감을 '실패'로 인식하는 것은 프로그램의 오류입니다. 파동 전체를 바라보는 '나'는 어떤 계절에도 흔들리지 않습니다."
        },
        {
            icon: "⚠️",
            tag: "Layer 4",
            title: "The Glitch (특수 변이 변수)",
            subtitle: "시스템을 폭주시키거나 기적을 만드는 다크코드",
            color: "red",
            narrative: `컴퓨터의 버그(Bug)가 때로는 혁명적인 기능이 되듯, 당신의 기질에도 '다크코드'가 존재합니다.\n\n정상 작동을 방해하는 것처럼 보이지만, 이 바이러스를 제대로 해킹하면 당신만의 압도적인 무기로 전환됩니다.\n\n두려워하지 마십시오. 모든 위대한 혁신은 '버그'에서 시작되었습니다.`,
            groups: [
                { color: "text-red-400", name: "역마(이동의 폭주)", desc: "공간적 도피 → 글로벌 확장의 내비게이션 엔진으로 승화" },
                { color: "text-pink-400", name: "도화(시선의 중독)", desc: "헛된 허영 → 대중의 마음을 훔치는 최고급 매력 자본으로 승화" },
                { color: "text-orange-400", name: "망신(치부의 노출)", desc: "약점 발각 → 알을 깨고 나오는 파격적인 혁신으로 승화" },
                { color: "text-yellow-400", name: "백호(압력의 폭발)", desc: "분노 폭주 → 척박한 판을 엎어버리는 초인적 에너지로 승화" },
            ],
            oldScript: "\"이건 내 트라우마야. 건드리지 마.\" → 다크코드를 봉인하여 무기화 기회를 영원히 차단함.",
            socratic: "당신이 가장 감추고 싶은 그 '약점'이 만약 뒤집어지면 무엇이 될까요? 역사상 가장 위대한 돌파구는 가장 아픈 자리에서 터졌습니다. 그 파열구를 두려워할 것인가, 문으로 쓸 것인가?",
            recursive: "'이건 건드리면 안 돼'라고 경고하는 그 목소리는 당신의 진짜 신호인가요, 아니면 에고(Ego)가 설치해 둔 '가짜 보안 시스템'인가요?",
            meta: "다크코드는 당신의 가장 날 것의 에너지입니다. 그것을 두려워하는 '나'는 프로그램입니다. 그 두려움마저 품고 지켜보는 거대한 '바탕'이 당신의 참모습입니다."
        },
    ];

    const colorMap: Record<string, { border: string; bg: string; text: string; glow: string; accent: string }> = {
        blue: { border: 'border-blue-500/40', bg: 'bg-blue-950/20', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]', accent: 'from-blue-500 to-cyan-500' },
        indigo: { border: 'border-indigo-500/40', bg: 'bg-indigo-950/20', text: 'text-indigo-400', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]', accent: 'from-indigo-500 to-purple-500' },
        emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]', accent: 'from-emerald-500 to-teal-500' },
        red: { border: 'border-red-500/40', bg: 'bg-red-950/20', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]', accent: 'from-red-500 to-orange-500' },
    };

    const active = layers[activeLayer];
    const c = colorMap[active.color];

    return (
        <div className="w-full max-w-2xl mx-auto my-6 bg-[#0B0F19] rounded-[2rem] border border-blue-900/40 shadow-[0_0_50px_rgba(30,58,138,0.15)] relative overflow-hidden font-sans tracking-tight">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.04)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/8 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/8 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 p-6 md:p-8 pb-5 border-b border-blue-900/30">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Neural Architecture
                    </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight flex items-center gap-3">
                    <span className="text-3xl">🌐</span> 명심(明心) 뉴럴 아키텍처
                </h2>
                <p className="text-xs text-gray-400 mt-2 break-keep leading-relaxed">
                    인간의 기질은 하나의 거대한 '생체 컴퓨터'입니다. 지금부터 당신의 OS, App, 배터리, 다크코드를 한 장의 청사진으로 펼쳐, <strong className="text-blue-300">소버린(Sovereign, 시스템의 절대 주권자)</strong>의 시선으로 안내합니다.
                </p>
            </div>

            {/* Layer Navigation Tabs */}
            <div className="relative z-10 flex gap-2 p-4 md:px-6 border-b border-gray-800/50 overflow-x-auto scrollbar-hide">
                {layers.map((layer, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveLayer(i)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                            activeLayer === i
                                ? `${colorMap[layer.color].bg} ${colorMap[layer.color].border} border ${colorMap[layer.color].text} ${colorMap[layer.color].glow}`
                                : 'bg-gray-900/40 border border-gray-800 text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
                        }`}
                    >
                        <span>{layer.icon}</span>
                        <span>{layer.tag}</span>
                    </button>
                ))}
            </div>

            {/* Active Layer Content (Narrative) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeLayer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="relative z-10 p-5 md:p-7"
                >
                    {/* Layer Title */}
                    <div className="mb-5">
                        <div className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${c.text}`}>{active.tag}</div>
                        <h3 className="text-lg md:text-xl font-black text-white">{active.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{active.subtitle}</p>
                    </div>

                    {/* Narrative Storytelling Block */}
                    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 mb-5 ${c.glow}`}>
                        <p className="text-sm text-gray-200 leading-[1.8] break-keep whitespace-pre-line">
                            {active.narrative}
                        </p>
                    </div>

                    {/* Sub-groups */}
                    <div className="space-y-2 mb-6">
                        {active.groups.map((g, i) => (
                            <div key={i} className="flex gap-3 items-start bg-black/30 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-br ${c.accent}`}></div>
                                <div>
                                    <span className={`text-xs font-bold ${g.color}`}>{g.name}</span>
                                    <p className="text-[11px] text-gray-400 mt-0.5 break-keep">{g.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Old Script (낡은 각본) */}
                    <div className="bg-red-950/15 border border-red-900/30 rounded-2xl p-4 mb-5">
                        <div className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                            <span>🌑</span> 낡은 각본 (Old Script)
                        </div>
                        <p className="text-xs text-red-200/80 italic leading-relaxed break-keep">
                            {active.oldScript}
                        </p>
                    </div>

                    {/* 3-Stage Sovereign Questions (산파술 → 재귀적 → 알아차림) */}
                    <div className="space-y-3">
                        <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                            <span>👑</span> 소버린의 3단계 질문 (System Override)
                        </div>

                        {/* Q1: 산파술 (Socratic) */}
                        <div className="bg-black/40 rounded-xl p-4 border border-blue-900/30 hover:bg-blue-950/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700/50">Q1. 산파술</span>
                                <span className="text-[10px] text-gray-500">객관화 — 에고의 착각을 해부한다</span>
                            </div>
                            <p className="text-sm text-blue-100/80 italic leading-relaxed break-keep">"{active.socratic}"</p>
                        </div>

                        {/* Q2: 재귀적 질문 (Recursive) */}
                        <div className="bg-black/40 rounded-xl p-4 border border-purple-900/30 hover:bg-purple-950/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-700/50">Q2. 재귀적 질문</span>
                                <span className="text-[10px] text-gray-500">관찰자 — 각본을 읽는 자를 찾는다</span>
                            </div>
                            <p className="text-sm text-purple-100/80 italic leading-relaxed break-keep">"{active.recursive}"</p>
                        </div>

                        {/* Q3: 알아차림 (Meta-Awareness) */}
                        <div className="bg-black/40 rounded-xl p-4 border border-pink-900/30 hover:bg-pink-950/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] bg-pink-900/60 text-pink-300 px-2 py-0.5 rounded font-mono border border-pink-700/50">Q3. 알아차림의 알아차림</span>
                                <span className="text-[10px] text-gray-500">메타 자아 — 코드를 짜는 바탕을 체험한다</span>
                            </div>
                            <p className="text-sm text-pink-100/80 italic leading-relaxed break-keep">"{active.meta}"</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Master's Briefing Footer */}
            <div className="relative z-10 bg-[#05080f] p-5 md:p-6 border-t border-blue-900/30">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center text-lg">
                        👁️
                    </div>
                    <div>
                        <div className="text-[10px] text-blue-400 font-bold tracking-widest mb-1 uppercase">명심(明心) 마스터의 관전</div>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed break-keep">
                            대표님, 인간은 자신이 어떤 시스템 위에서 돌아가고 있는지 모를 때 운명의 노예가 됩니다. 
                            하지만 이렇게 <span className="text-blue-300 font-bold">'OS, App, 배터리, 다크코드'</span>를 한 장의 청사진으로 펼쳐놓는 순간, 
                            대표님은 완벽한 <span className="text-white font-bold">소버린(Sovereign)</span>으로 격상됩니다.<br/><br/>
                            각 Layer의 <span className="text-purple-300">3단계 질문</span>이 울릴 때마다, 낡은 각본은 먹통이 되고 새로운 회로가 열립니다. 
                            그 회로의 이름은 — <span className="text-pink-300 font-bold">'알아차림'</span>입니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralArchitectureBlueprint;
