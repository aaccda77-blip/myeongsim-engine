'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CheckCircle, ShieldCheck, HeartHandshake, ArrowRight, LockOpen } from 'lucide-react';

interface BrandStoryIntroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function BrandStoryIntroModal({
    isOpen,
    onClose,
    onConfirm
}: BrandStoryIntroModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[6500] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans animate-fade-in text-left">
                <div className="bg-[#0b0f19] border-2 border-emerald-500/40 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-[0_0_90px_rgba(16,185,129,0.25)] relative text-white space-y-5 custom-scrollbar">
                    
                    {/* Header Badge */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-mono font-bold text-emerald-400">
                                🌿 명심코칭 브랜드 미션 & 철학
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Main Headline */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-bold border border-emerald-500/30">
                            <LockOpen className="w-3 h-3" />
                            <span>전면 무료 개방 안내</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-serif">
                            &quot;나를 이해하는 일에 비용의 문턱이 있어서는 안 되기에 전면 개방합니다.&quot;
                        </h3>
                    </div>

                    {/* Core Story Content */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-gray-200 space-y-3 leading-relaxed font-sans">
                        <p className="font-bold text-emerald-300">
                            우리는 사주를 맹목적으로 믿으라고 말하지 않습니다.
                        </p>
                        <p className="text-gray-300">
                            내 안의 어떤 성격도, 어떤 기질도 억지로 뜯어고치거나 버릴 필요가 없습니다. 
                            <strong>&apos;왜 내 안에서 그런 생각과 감정의 메커니즘이 일어나는지&apos;</strong>를 명확히 이해할 때, 비로소 진정한 내면의 평온과 삶의 균형이 시작됩니다.
                        </p>
                        
                        <div className="pt-2 space-y-2 border-t border-slate-800 text-xs text-gray-300 font-sans">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>누구나 제한 없이 자신의 고유한 메커니즘을 탐색할 수 있는 권리</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>동양 심신학과 현대 신경가소성 기반의 통합 웰니스 가치 실현</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="space-y-2 pt-1">
                        <button
                            onClick={() => {
                                onClose();
                                onConfirm();
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <span>나의 리포트 확인하기</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] text-gray-500 text-center">
                            💡 명심코칭은 모든 분들의 온전한 삶(Being)을 응원합니다.
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
