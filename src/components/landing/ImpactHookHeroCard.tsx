'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Shield, Zap, Compass } from 'lucide-react';

interface ImpactHookHeroCardProps {
    onStartClick?: () => void;
}

export default function ImpactHookHeroCard({ onStartClick }: ImpactHookHeroCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-3xl bg-gradient-to-br from-[#12172b] via-[#0d101d] to-[#1a1226] border-2 border-amber-500/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden text-left font-sans space-y-4"
        >
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="flex items-center justify-between z-10 relative">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>[버전 3: 임팩트 숏폼 훅]</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                    3초 과학적 웰니스 진단
                </span>
            </div>

            {/* Main Punch Headline */}
            <div className="space-y-1 z-10 relative">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-serif tracking-tight">
                    &quot;사주를 믿지 마세요.<br />
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                        당신의 고유한 메커니즘을 이해하세요.
                    </span>&quot;
                </h2>
                <p className="text-xs text-gray-300">
                    단순 점술이 아닌, 타고난 인지 패턴과 신경망 에너지의 과학적 웰니스 해석
                </p>
            </div>

            {/* 3 Core Checkpoints */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 z-10 relative text-xs text-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-[10px]">
                        ✓
                    </div>
                    <span>동양 심신학과 제3세대 심리학의 정밀 융합</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-[10px]">
                        ✓
                    </div>
                    <span>1:1 맞춤형 웰니스 메커니즘 & 국세청 업종 해독</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-[10px]">
                        ✓
                    </div>
                    <span>증명하는 삶(Doing)에서 온전한 삶(Being)으로의 전환</span>
                </div>
            </div>

            {/* CTA Button */}
            {onStartClick && (
                <button
                    onClick={onStartClick}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 z-10 relative active:scale-[0.99]"
                >
                    <Compass className="w-4 h-4" />
                    <span>무료로 나의 메커니즘 해독하기</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
}
