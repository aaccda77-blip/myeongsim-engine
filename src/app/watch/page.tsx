'use client';

import React from 'react';
import { WearableDashboard } from '@/components/wearable/WearableDashboard';
import { Sparkles, ArrowLeft, ShieldCheck, Heart, Headphones, Wind, Zap } from 'lucide-react';
import Link from 'next/link';

export default function WatchShowcasePage() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-cyan-500/30">
            {/* 상단 글로벌 헤더 */}
            <header className="w-full border-b border-white/10 bg-[#070d1d]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/report"
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>리포트로 돌아가기</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                            <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
                            <span>ZERO-PULSE WEARABLE 2.0</span>
                        </span>
                    </div>

                    <Link
                        href="/library"
                        className="text-xs text-gray-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                        도서관
                    </Link>
                </div>
            </header>

            {/* 메인 스마트워치 인터랙티브 영역 */}
            <main className="w-full flex-1 flex flex-col items-center justify-center p-4">
                <WearableDashboard />
            </main>

            {/* 하단 기능 소개 하이라이트 배너 */}
            <footer className="w-full border-t border-white/10 bg-[#060b18] py-6 px-4">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
                        세계 최고 수준의 손목 웰니스 코칭 아키텍처
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1">
                            <Heart size={16} className="text-rose-400" />
                            <span className="text-xs font-bold text-white">Live Bio-Pulse</span>
                            <span className="text-[10px] text-gray-400">실시간 심박수 & HRV</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1">
                            <Wind size={16} className="text-cyan-400" />
                            <span className="text-xs font-bold text-white">4-4-4-4 Box Breath</span>
                            <span className="text-[10px] text-gray-400">네이비씰 자율신경계 안정</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1">
                            <Headphones size={16} className="text-amber-400" />
                            <span className="text-xs font-bold text-white">Wrist Sound Lab</span>
                            <span className="text-[10px] text-gray-400">브라운노이즈 & 528Hz</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1">
                            <Zap size={16} className="text-indigo-400" />
                            <span className="text-xs font-bold text-white">1초 Zero Reset</span>
                            <span className="text-[10px] text-gray-400">양자 붕괴 영점 회귀</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
