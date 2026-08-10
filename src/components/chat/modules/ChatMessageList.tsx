'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Volume2, VolumeX, FileText, Copy, Check, Lock, Zap } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatMessageListProps {
    messages: Message[];
    userMessageCount: number;
    isPaidUser: boolean;
    speakingMessageId: string | null;
    copiedMessageId: string | null;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    handleSpeak: (id: string, text: string) => void;
    handleCopy: (id: string, text: string) => void;
    handleChipClick: (prompt: string) => void;
    setShowCardModal: (show: boolean) => void;
    setShowMicroPassModal: (show: boolean) => void;
}

export default function ChatMessageList({
    messages,
    userMessageCount,
    isPaidUser,
    speakingMessageId,
    copiedMessageId,
    messagesEndRef,
    handleSpeak,
    handleCopy,
    handleChipClick,
    setShowCardModal,
    setShowMicroPassModal
}: ChatMessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar relative min-h-0">
            {/* Empty State Welcome Screen */}
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-5 py-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative">
                        <Sparkles className="w-10 h-10 text-amber-300 animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-md">
                        <h3 className="text-lg font-black text-white">안녕하세요! 영혼의 AI 코치입니다 ✨</h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-keep font-medium">
                            연동된 생년월일과 사주팔자를 바탕으로<br />
                            <strong>3세대 현장 코칭심리학(ACT·CBT·MBCT·IFS) 8대 과학적 도구</strong>를 가동하여 1:1 핑퐁 코칭을 진행합니다.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2 justify-center max-w-md">
                        <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
                            🛡️ Step 1. SCAN (다크코드 수용)
                        </span>
                        <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full font-bold">
                            🧠 Step 2. SYNC (뇌회로 재배선)
                        </span>
                        <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                            👑 Step 3. SHIFT (영점 각성)
                        </span>
                    </div>
                </div>
            )}

            {/* Chat Message Stream */}
            {messages.map((m, index) => {
                const isBlurred = userMessageCount >= 3 && !isPaidUser && index >= 6;
                return (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 sm:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} ${
                            isBlurred ? 'blur-sm opacity-40 select-none pointer-events-none' : ''
                        }`}
                    >
                        {/* Avatar */}
                        <div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-md ${
                                m.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-400/40'
                                    : 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            }`}
                        >
                            {m.role === 'user' ? '나' : '明'}
                        </div>

                        {/* Content Card */}
                        <div
                            className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5.5 text-xs sm:text-sm leading-relaxed ${
                                m.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 text-indigo-100 border border-indigo-500/30 rounded-tr-none shadow-lg'
                                    : 'bg-slate-900/90 text-gray-100 border border-amber-400/30 rounded-tl-none shadow-xl backdrop-blur-md'
                            }`}
                        >
                            <div className="whitespace-pre-wrap break-words font-medium space-y-2">
                                {m.content}
                            </div>

                            {/* Assistant Footer Actions */}
                            {m.role === 'assistant' && (
                                <div className="flex items-center justify-between gap-2 text-[10px] font-mono pt-3 border-t border-white/10 mt-3 flex-wrap">
                                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                                        <span>🔬 3세대 현장 코칭심리학 메커니즘 (ACT · CBT · MBCT · IFS)</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 ml-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleSpeak(m.id, m.content)}
                                            className={`px-2.5 py-1 rounded-xl font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                                                speakingMessageId === m.id
                                                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                                                    : 'bg-white/5 hover:bg-white/15 text-amber-300 border-amber-400/30'
                                            }`}
                                        >
                                            {speakingMessageId === m.id ? (
                                                <>
                                                    <VolumeX size={12} />
                                                    <span>음성 정지</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Volume2 size={12} />
                                                    <span>🔊 음성 힐링</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowCardModal(true)}
                                            className="px-3 py-1.5 rounded-xl font-bold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer text-xs min-h-[36px] shadow-sm"
                                        >
                                            <FileText size={12} />
                                            <span>📜 1:1 가이드 카드</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleCopy(m.id, m.content)}
                                            className="px-3 py-1.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer text-xs min-h-[36px] shadow-sm"
                                        >
                                            {copiedMessageId === m.id ? (
                                                <>
                                                    <Check size={12} className="text-emerald-400" />
                                                    <span className="text-emerald-400 font-bold">복사됨!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    <span>복사</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}

            {/* 3회 무료 완료 후 890원 서비스 잠금 마케팅 카드 */}
            {userMessageCount >= 3 && !isPaidUser && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#0c1427]/95 to-slate-950 border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] relative overflow-hidden text-center text-white z-30"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col items-center mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
                            <Lock className="w-7 h-7" />
                        </div>
                        <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-sm font-mono">
                            🔒 첫 3회 무료 코칭 완료 (서비스 잠금)
                        </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white mb-2 leading-snug break-keep">
                        ☕ 890원으로<br />
                        <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy underline-offset-4 font-black">
                            1:1 맞춤 영혼 코칭 3회 더 이어가기
                        </span>
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto mb-4 font-medium break-keep">
                        커피 한 잔보다 가벼운 금액으로,<br />
                        내 안의 고민을 명심 멘토와 끊김 없이 해결해 보세요.
                    </p>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-left mb-6 max-w-md mx-auto space-y-1">
                        <p className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                            <span>📜 [명심코칭 오픈 & 특허 출원 한정 혜택]</span>
                        </p>
                        <p className="text-[11px] text-gray-200 font-medium leading-[1.65]">
                            특허 정식 출원 승인 시까지 특별 혜택가 <strong className="text-amber-300 font-black">890원</strong>에 제공되며, 정식 등록 완료 후 <span className="text-amber-200 font-bold">B2C 99,000원</span> / <span className="text-amber-200 font-bold">B2B 기업용 300,000원(30만원)</span>으로 정상 인상될 예정입니다.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowMicroPassModal(true)}
                        className="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 to-yellow-500 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                    >
                        <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
                        <span>💳 890원에 3회 즉시 충전하기 ➔</span>
                    </button>
                </motion.div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
