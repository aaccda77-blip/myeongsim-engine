'use client';

import React from 'react';
import { useViewMode } from '@/hooks/useViewMode';
import { LayoutGrid, Sparkles } from 'lucide-react';

interface ViewModeSwitcherProps {
    compact?: boolean;
}

export function ViewModeSwitcher({ compact = false }: ViewModeSwitcherProps) {
    const { viewMode, setViewMode } = useViewMode();

    return (
        <div className="flex items-center p-1 rounded-xl bg-[#0e1624] border border-white/10 shadow-inner">
            <button
                onClick={() => setViewMode('simple')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewMode === 'simple'
                        ? 'bg-[#182333] text-amber-300 font-bold shadow-sm border border-amber-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="핵심 내용만 간결하게 안내"
            >
                <Sparkles size={13} className={viewMode === 'simple' ? 'text-amber-400' : 'text-gray-500'} />
                <span>간편모드</span>
            </button>

            <button
                onClick={() => setViewMode('classic')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewMode === 'classic'
                        ? 'bg-[#182333] text-cyan-300 font-bold shadow-sm border border-cyan-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="모든 기능과 상세 3D 시각화 보기"
            >
                <LayoutGrid size={13} className={viewMode === 'classic' ? 'text-cyan-400' : 'text-gray-500'} />
                <span>기본모드</span>
            </button>
        </div>
    );
}
