'use client';

import React from 'react';
import { ViewModeSwitcher } from '@/components/simple/ViewModeSwitcher';
import { User, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RefinedHeaderProps {
    userName: string;
    isVip: boolean;
}

export function RefinedHeader({ userName, isVip }: RefinedHeaderProps) {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between pb-3 pt-1 border-b border-white/[0.08]">
            <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight">
                        {userName}님
                    </h1>
                    {/* Compact Level Badge */}
                    <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold">
                        Lv.10 마인드
                    </span>
                    {/* Small VIP Indicator */}
                    {isVip && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-black flex items-center gap-1">
                            <Sparkles size={10} />
                            <span>VIP</span>
                        </span>
                    )}
                </div>
                <p className="text-xs sm:text-sm text-[#9AA7B7]">
                    오늘의 상태를 확인하고 필요한 행동을 안내받으세요.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <ViewModeSwitcher />
                <button
                    onClick={() => router.push('/myeongsim-chat')}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-all border border-white/10"
                    title="1:1 AI 상담"
                >
                    <MessageCircle size={16} />
                </button>
                <button
                    onClick={() => router.push('/settings')}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-all border border-white/10"
                    title="설정"
                >
                    <User size={16} />
                </button>
            </div>
        </header>
    );
}
