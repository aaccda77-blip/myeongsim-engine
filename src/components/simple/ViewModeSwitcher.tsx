'use client';

import React from 'react';
import { useViewMode } from '@/hooks/useViewMode';
import { LayoutGrid, Sparkles, Watch } from 'lucide-react';

interface ViewModeSwitcherProps {
    compact?: boolean;
}

export function ViewModeSwitcher({ compact = false }: ViewModeSwitcherProps) {
    const { viewMode, setViewMode } = useViewMode();

    return (
        <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-[#0e1624] border border-white/10 shadow-inner">
            {/* 1. 간편모드 */}
            <button
                onClick={() => setViewMode('simple')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer ${
                    viewMode === 'simple'
                        ? 'bg-[#182333] text-amber-300 font-bold shadow-sm border border-amber-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="핵심 내용만 간결하게 안내 (모바일)"
            >
                <Sparkles size={12} className={viewMode === 'simple' ? 'text-amber-400' : 'text-gray-500'} />
                <span>간편</span>
            </button>

            {/* 2. 기본모드 */}
            <button
                onClick={() => setViewMode('classic')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer ${
                    viewMode === 'classic'
                        ? 'bg-[#182333] text-cyan-300 font-bold shadow-sm border border-cyan-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="모든 기능과 상세 3D 시각화 보기 (풀버전)"
            >
                <LayoutGrid size={12} className={viewMode === 'classic' ? 'text-cyan-400' : 'text-gray-500'} />
                <span>기본</span>
            </button>

            {/* 3. 웨어러블 워치 모드 */}
            <button
                onClick={() => setViewMode('wearable')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer ${
                    viewMode === 'wearable'
                        ? 'bg-[#182333] text-emerald-300 font-bold shadow-sm border border-emerald-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="스마트워치 / 초소형 화면 최적화 (3초 체크)"
            >
                <Watch size={12} className={viewMode === 'wearable' ? 'text-emerald-400' : 'text-gray-500'} />
                <span>워치</span>
            </button>
        </div>
    );
}
