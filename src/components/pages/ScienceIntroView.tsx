'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, RefreshCw, Zap, Shield, ArrowDown, Award, Compass, CheckCircle2 } from 'lucide-react';

export default function ScienceIntroView() {
    return (
        <div className="h-full flex flex-col overflow-y-auto pb-16 custom-scrollbar text-white font-sans selection:bg-amber-400 selection:text-slate-950">
            {/* ============================================================
                1. HERO SECTION: 명심코칭 3-Code × 3S Protocol
                ============================================================ */}
            <div className="relative px-5 pt-8 pb-10 text-center border-b border-gray-800/80 bg-gradient-to-b from-amber-500/10 via-purple-950/20 to-transparent">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-xl mx-auto space-y-3"
                >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>MYONGSIM MASTER MANIFESTO</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                        명심코칭 3-Code × 3S Protocol
                    </h1>

                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-left space-y-3 shadow-xl">
                        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed break-keep font-medium">
                            명심코칭이 말하는 변화는 <strong className="text-amber-300 font-black">지금의 나를 없애고 새로운 사람이 되는 과정이 아닙니다.</strong>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-keep font-normal">
                            내 안에 이미 존재하는 기질과 오래된 반응패턴을 발견하고, 그것을 ‘나 자신’과 동일시하던 상태에서 한 걸음 떨어져 바라보고, 있는 그대로 수용하면서 더 자유롭고 균형 있게 사용할 수 있게 되는 과정입니다.
                        </p>
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-[13px] font-bold leading-relaxed break-keep">
                            사주명리학은 여기에서 사람의 운명을 결정하는 답이 아니라, <br className="hidden sm:inline" />
                            <span className="text-amber-300 font-black underline decoration-amber-400/50 underline-offset-4">
                                내가 오랫동안 ‘나’라고 믿어온 기질과 반복패턴을 볼 수 있게 해주는 하나의 거울이자 브릿지
                            </span>
                            입니다.
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ============================================================
                2. 1. DARK CODE × SCAN
                ============================================================ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-5 py-7 border-b border-gray-800/80 max-w-xl mx-auto w-full"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 shadow-md">
                        <Eye className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 font-mono tracking-wider">STEP 01</span>
                        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                            1. DARK CODE × SCAN
                        </h2>
                    </div>
                </div>

                <div className="space-y-3.5 text-left text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                    <h3 className="text-sm sm:text-base font-bold text-amber-300">
                        “나는 원래 이런 사람이야”에서 패턴을 발견하다
                    </h3>

                    <p>
                        다크코드(Dark Code)는 나쁜 코드나 제거해야 할 결함을 뜻하지 않습니다.
                    </p>

                    <p>
                        오랜 시간 반복되어 너무 익숙해진 나머지 어느 순간부터 그것을 ‘나 자체’라고 믿게 된 사고·감정·행동의 자동패턴을 뜻합니다.
                    </p>

                    {/* 자동 패턴 인용 박스 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-gray-300 text-xs italic">
                            “나는 원래 예민해.”
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-gray-300 text-xs italic">
                            “나는 원래 사람을 못 믿어.”
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-gray-300 text-xs italic">
                            “나는 원래 인정받아야 해.”
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-gray-300 text-xs italic">
                            “나는 원래 화가 나면 참지 못해.”
                        </div>
                    </div>

                    <p>
                        이때 우리는 하나의 반응패턴을 경험하는 것이 아니라 그 패턴과 자신을 동일시하고 있습니다.
                    </p>

                    <p>
                        생각이 떠오른 것이 아니라 <strong className="text-white font-bold">‘그 생각이 곧 나’</strong>가 되고, 감정이 일어난 것이 아니라 <strong className="text-white font-bold">‘그 감정이 곧 나’</strong>가 됩니다.
                    </p>

                    <p>
                        명심코칭에서 사주명리는 이러한 오래된 기질과 자동반응을 발견하기 위한 하나의 관찰 프레임으로 사용됩니다.
                    </p>

                    <p>
                        사주가 “당신은 이런 사람이다”라고 결론내리는 것이 아니라,
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs sm:text-sm text-center">
                        “혹시 이런 패턴이 내 삶에서 반복되고 있지는 않은가?”
                    </div>

                    <p>
                        라고 스스로 관찰할 수 있도록 돕는 것입니다.
                    </p>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-l-4 border-slate-500 space-y-2 mt-3 shadow-md">
                        <p className="font-bold text-white text-xs sm:text-sm">
                            이것이 <span className="text-amber-300 font-black">SCAN</span>입니다.
                        </p>
                        <p className="text-xs text-gray-300">
                            다크코드를 없애기 전에 먼저 봅니다. 판단하지 않고, 고치려고 서두르지 않고,
                        </p>
                        <p className="text-xs sm:text-[13px] font-black text-amber-200">
                            “아, 내 안에서 지금 이 패턴이 자동으로 작동하고 있구나.” 하고 알아차립니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* ============================================================
                3. 2. NEURAL CODE × SYNC
                ============================================================ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-5 py-7 border-b border-gray-800/80 max-w-xl mx-auto w-full"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
                        <RefreshCw className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-indigo-400 font-mono tracking-wider">STEP 02</span>
                        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                            2. NEURAL CODE × SYNC
                        </h2>
                    </div>
                </div>

                <div className="space-y-3.5 text-left text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                    <h3 className="text-sm sm:text-base font-bold text-indigo-300">
                        패턴은 나의 전부가 아니다
                    </h3>

                    <p>
                        뉴럴코드(Neural Code)는 다크코드를 제거하는 과정이 아닙니다.
                    </p>

                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 font-bold text-xs sm:text-sm">
                        “이런 패턴이 내 안에 있다는 것을 인정하면서도, 이것이 나의 전부는 아니다.”
                    </div>

                    <p>
                        라고 바라볼 수 있는 힘을 기르는 과정입니다.
                    </p>

                    <p>
                        여기서 중요한 것이 <strong className="text-white font-bold">탈동일시</strong>입니다.
                    </p>

                    <p>
                        ACT의 ‘맥락적 자기(Self-as-Context)’처럼 생각과 감정의 내용 그 자체가 아니라 그것을 경험하고 관찰할 수 있는 관점으로 이동합니다.
                    </p>

                    <div className="space-y-2 my-2">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                            <span className="text-[11px] text-gray-400 line-through block">“나는 불안한 사람이다”에서</span>
                            <span className="text-xs sm:text-[13px] font-bold text-indigo-200 block">
                                👉 “지금 내 안에 불안이라는 경험이 일어나고 있다.”로,
                            </span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                            <span className="text-[11px] text-gray-400 line-through block">“나는 실패자다”에서</span>
                            <span className="text-xs sm:text-[13px] font-bold text-indigo-200 block">
                                👉 “지금 내 마음이 나에게 실패자라는 이야기를 하고 있다.”로 관점이 이동합니다.
                            </span>
                        </div>
                    </div>

                    <p>
                        그러나 명심코칭은 그 오래된 패턴을 적으로 만들지 않습니다.
                    </p>

                    <div className="p-3.5 rounded-xl bg-indigo-900/20 border border-indigo-500/30 text-xs text-indigo-200 space-y-1.5">
                        <p className="font-bold text-indigo-300">
                            🧬 과학적 심리 접근법의 비의료적 재구성
                        </p>
                        <p className="leading-relaxed">
                            DBT의 수용과 변화, ACT의 수용과 심리적 유연성, MBCT의 탈중심화와 알아차림, MSC의 자기연민과 자기친절과 같은 원리들을 활용하여 오랫동안 나를 지켜왔던 패턴까지도 <strong className="text-white">“그럴 수밖에 없었던 나의 한 부분”</strong>으로 이해하고 품습니다.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border-l-4 border-indigo-500 space-y-2 shadow-md">
                        <p className="font-bold text-white text-xs sm:text-sm">
                            이것이 <span className="text-indigo-300 font-black">SYNC</span>입니다.
                        </p>
                        <p className="text-xs text-gray-300">
                            내 기질과 싸우는 것이 아니라 현재의 나와 다시 관계를 맺고 조율하는 것입니다.
                        </p>
                        <p className="text-xs text-gray-300">
                            그 과정에서 자동적인 반응 대신 새로운 선택을 반복하면서 기존의 습관적 반응에서 벗어나 보다 유연한 사고와 행동방식을 학습해 갑니다.
                        </p>
                        <p className="text-xs sm:text-[13px] font-black text-indigo-200 pt-1">
                            명심코칭에서 이를 Neural Code라고 부릅니다.
                        </p>
                    </div>

                    <p className="text-[11.5px] text-gray-400 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-medium">
                        ※ 여기서 ‘Neural’은 코칭만으로 특정 신경망이 의학적으로 변경되었다고 진단한다는 의미가 아닙니다. 반복적인 경험과 학습을 통해 새로운 사고·행동 습관을 형성해 나가는 과정을 설명하기 위한 명심코칭의 자체적인 코칭 개념입니다.
                    </p>
                </div>
            </motion.section>

            {/* ============================================================
                4. 3. META CODE × SHIFT
                ============================================================ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-5 py-7 border-b border-gray-800/80 max-w-xl mx-auto w-full"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
                        <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-amber-400 font-mono tracking-wider">STEP 03</span>
                        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                            3. META CODE × SHIFT
                        </h2>
                    </div>
                </div>

                <div className="space-y-3.5 text-left text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                    <h3 className="text-sm sm:text-base font-bold text-amber-300">
                        알아차림을 알아차리다
                    </h3>

                    <p>
                        메타코드(Meta Code)는 더 좋은 성격을 만드는 마지막 단계가 아닙니다. 다크코드를 완전히 지워버린 상태도 아닙니다.
                    </p>

                    <p>
                        생각도 여전히 일어납니다. 감정도 올라옵니다. 오래된 기질도 존재합니다. 때로는 다크코드도 다시 작동합니다.
                    </p>

                    <p>
                        그러나 결정적으로 달라지는 것이 있습니다.
                    </p>

                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-black text-xs sm:text-sm">
                        그것이 일어나고 있다는 사실을 알아차릴 수 있습니다.
                    </div>

                    <p>
                        그리고 한 단계 더 깊어지면,
                    </p>

                    <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/40 text-purple-200 font-black text-xs sm:text-sm text-center">
                        ‘내가 지금 알아차리고 있다는 것’까지 알아차립니다.
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 text-center space-y-1.5 shadow-lg">
                        <span className="text-[11px] text-gray-400 block font-mono">명심코칭에서는 이것을</span>
                        <h4 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300">
                            알아차림의 알아차림 · Meta Code · Zero Point
                        </h4>
                        <span className="text-[11px] text-gray-400 block font-mono">라고 부릅니다.</span>
                    </div>

                    <p>
                        책 《제로포인트》가 말하는 것처럼 이것은 다크코드와 메타인지를 넘어, 자신의 내면에서 일어나는 현상을 바라볼 수 있는 보다 근원적인 관찰의 자리로 돌아가는 것을 의미합니다.
                    </p>

                    <p>
                        제로포인트에 도달했다고 해서 갑자기 돈이 많아지는 것도 아니고, 문제가 모두 사라지는 것도 아니며, 원하는 일이 기적처럼 이루어지는 것도 아닙니다.
                    </p>

                    <p>
                        현실은 그대로일 수도 있습니다. 불편한 사람도 존재하고, 실패도 일어나고, 불안도 찾아오고, 예상하지 못한 삶의 문제도 계속 생깁니다.
                    </p>

                    <p>
                        다만 이전과 다른 것은,
                    </p>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-slate-900 border-2 border-purple-500/50 text-white font-black text-xs sm:text-sm text-center shadow-lg">
                        그 모든 것에 자동으로 끌려갈 필요가 없어진다는 것입니다.
                    </div>

                    <div className="space-y-1 pl-3 border-l-2 border-amber-400/60 my-2 text-gray-200 text-xs sm:text-[13px]">
                        <p>생각이 있어도 생각에 갇히지 않고,</p>
                        <p>감정이 있어도 감정에 완전히 휩쓸리지 않고,</p>
                        <p>기질이 있어도 기질이 운명이 되지 않고,</p>
                        <p>사주에 나타난 패턴이 있어도 그것이 ‘나의 한계’를 결정하지 않습니다.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border-l-4 border-amber-400 space-y-2 shadow-md">
                        <p className="font-bold text-white text-xs sm:text-sm">
                            그 순간 비로소 <span className="text-amber-300 font-black">SHIFT</span>가 가능합니다.
                        </p>
                        <p className="text-xs sm:text-[13px] font-black text-amber-100 leading-relaxed">
                            SHIFT란 다른 사람이 되는 것이 아니라, 같은 나, 같은 기질, 같은 에너지를 더 자유롭고 지혜롭게 사용하는 능력입니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* ============================================================
                5. 사주를 버리는 것이 아니라 자유롭게 사용하는 것
                ============================================================ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-5 py-7 border-b border-gray-800/80 max-w-xl mx-auto w-full"
            >
                <div className="text-left space-y-3.5 text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                        <Compass className="w-3.5 h-3.5" />
                        <span>CORE PHILOSOPHY</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                        사주를 버리는 것이 아니라 자유롭게 사용하는 것
                    </h2>

                    <p>
                        그래서 명심코칭은 사주에서 벗어나라고 말하지 않습니다. 사주를 믿으라고도 말하지 않습니다.
                    </p>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-black text-xs sm:text-sm text-center">
                        사주에 나타난 기질과 패턴을 보고, 인정하고, 품고, 필요할 때 잘 사용하는 것. 이것이 목적입니다.
                    </div>

                    <div className="space-y-2 my-3">
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-300">
                                <strong className="text-white">강한 추진력</strong>이 있다면 그것을 없애는 것이 아니라 폭주가 아닌 <strong className="text-amber-300">실행력</strong>으로 사용하고,
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-300">
                                <strong className="text-white">예민함</strong>이 있다면 그것을 제거하는 것이 아니라 과민반응이 아닌 <strong className="text-amber-300">섬세함과 통찰</strong>로 사용하며,
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-300">
                                <strong className="text-white">경계심</strong>이 강하다면 그것을 나쁜 특성으로 규정하지 않고 관계를 파괴하는 방어가 아니라 <strong className="text-amber-300">자신을 지키는 건강한 경계</strong>로 활용하도록 돕습니다.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/40 text-center space-y-1">
                        <p className="text-xs text-gray-400">결국 문제는 기질 자체가 아니라</p>
                        <p className="text-xs sm:text-sm font-black text-amber-300">
                            그 기질에 끌려가느냐, 그 기질을 알아차리고 사용할 수 있느냐입니다.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* ============================================================
                6. 명심코칭의 변화 공식 (다이어그램)
                ============================================================ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-5 py-7 border-b border-gray-800/80 max-w-xl mx-auto w-full"
            >
                <div className="text-left space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-[11px] font-bold text-amber-400 font-mono tracking-widest">ALGORITHM</span>
                        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                            명심코칭의 변화 공식
                        </h2>
                    </div>

                    <div className="space-y-3 pt-2">
                        {/* 0. 사주·기질 */}
                        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-center shadow-md">
                            <span className="text-xs font-black text-gray-300">사주 · 기질 (선천적 출발점)</span>
                        </div>

                        <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-amber-400 animate-bounce" />
                        </div>

                        {/* 1. DARK CODE — SCAN */}
                        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-700 space-y-1 shadow-md">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-800 text-gray-200 border border-slate-700">
                                    DARK CODE — SCAN
                                </span>
                            </div>
                            <p className="text-xs sm:text-[13px] font-bold text-white pt-1">
                                “내가 나라고 믿어온 자동패턴을 발견한다.”
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-indigo-400 animate-bounce" />
                        </div>

                        {/* 2. NEURAL CODE — SYNC */}
                        <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 space-y-1 shadow-md">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    NEURAL CODE — SYNC
                                </span>
                            </div>
                            <p className="text-xs sm:text-[13px] font-bold text-indigo-100 pt-1 leading-relaxed">
                                “패턴과 나를 분리해 바라보고, 거부하지 않고 수용하며 새로운 선택을 학습한다.”
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-amber-400 animate-bounce" />
                        </div>

                        {/* 3. META CODE — SHIFT */}
                        <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-1 shadow-md">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    META CODE — SHIFT
                                </span>
                            </div>
                            <p className="text-xs sm:text-[13px] font-bold text-purple-100 pt-1 leading-relaxed">
                                “생각과 감정뿐 아니라 그것을 알아차리고 있는 나까지 알아차림을 통해 상황에 맞게 자유롭게 선택한다.”
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-amber-400 animate-bounce" />
                        </div>

                        {/* 4. ZERO POINT */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-indigo-600/20 border-2 border-amber-400/60 space-y-1 shadow-xl">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-sm">
                                    ZERO POINT
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm font-black text-amber-200 pt-1 leading-relaxed">
                                “삶을 통제하는 사람이 아니라, 삶 속에서 무엇에도 맹목적으로 끌려가지 않는 사람.”
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ============================================================
                7. 결국 명심코칭이 말하는 자유
                ============================================================ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-5 py-8 max-w-xl mx-auto w-full text-center space-y-4"
            >
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111625] to-[#0a0d16] border-2 border-amber-400/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-4 text-left">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Award className="w-5 h-5 text-amber-400" />
                        <h2 className="text-base sm:text-lg font-black text-white">
                            결국 명심코칭이 말하는 자유
                        </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                        명심코칭이 추구하는 것은 ‘더 완벽한 나’를 만드는 것이 아닙니다. 사주를 바꾸는 것도 아니고, 기질을 제거하는 것도 아니며, 다크코드를 박멸하는 것도 아닙니다.
                    </p>

                    <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                        <p className="text-xs sm:text-sm text-amber-100 font-bold leading-relaxed">
                            있는 그대로의 나를 온전히 보고, 있는 그대로 받아들이면서도, 그 어떤 패턴도 나의 전부라고 착각하지 않는 것.
                        </p>
                        <p className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed">
                            그리고 매 순간, 내가 가진 것을 어떻게 사용할 것인지를 선택할 수 있는 것.
                        </p>
                    </div>

                    <div className="pt-2 text-center">
                        <span className="text-xs text-gray-400 font-mono block mb-1">그것이 명심코칭이 말하는</span>
                        <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 py-1">
                            어떠한 것에도 걸림없는 자유인의 삶
                        </h3>
                        <span className="text-xs text-gray-400 font-mono">입니다.</span>
                    </div>
                </div>

                {/* 하단 특허 및 보건복지부 비의료 법률 면책 공지 */}
                <div className="pt-4 text-left">
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-[11px] text-gray-400 space-y-1.5 leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-gray-300">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span>특허출원 및 비의료 가이드라인 준수 고지</span>
                        </div>
                        <p>
                            • <strong>특허출원 제10-2025-0166877호:</strong> 「심리 및 생체데이터 기반 스트레스 관리 솔루션 제공 장치 및 이를 이용한 스트레스 관리 솔루션 제공 방법」 기반 설계.
                        </p>
                        <p>
                            • 보건복지부 「비의료 건강관리서비스 가이드라인」을 준수하며, 본 서비스는 의학적 진단 및 치료를 대체하지 않는 자기관리·코칭 서비스입니다.
                        </p>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
