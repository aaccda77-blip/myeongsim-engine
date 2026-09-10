'use client';

import React from 'react';
import { useViewMode } from '@/hooks/useViewMode';
import { LayoutGrid, Sparkles, Watch, Compass } from 'lucide-react';

interface ViewModeSwitcherProps {
    compact?: boolean;
}

export function ViewModeSwitcher({ compact = false }: ViewModeSwitcherProps) {
    const { viewMode, setViewMode } = useViewMode();

    return (
        <div className="flex items-center p-0.5 rounded-xl bg-[#0e1624] border border-white/10 shadow-inner shrink-0">
            {/* 1. 기본모드 Classic */}
            <button
                type="button"
                onClick={() => setViewMode('classic')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    viewMode === 'classic'
                        ? 'bg-[#182333] text-cyan-300 font-bold shadow-sm border border-cyan-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="기본 모드: 모든 기능과 상세 3D 시각화 보기 (풀버전)"
            >
                <LayoutGrid size={13} className={viewMode === 'classic' ? 'text-cyan-400' : 'text-gray-500'} />
                {viewMode === 'classic' && <span className="font-bold">기본</span>}
            </button>

            {/* 2. 리파인모드 Refined (프로덕션 프리미엄) */}
            <button
                type="button"
                onClick={() => setViewMode('refined')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    viewMode === 'refined'
                        ? 'bg-[#182333] text-amber-300 font-bold shadow-sm border border-amber-400/40'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="리파인 모드: 프로덕션 프리미엄 AI 코칭 레이아웃"
            >
                <Compass size={13} className={viewMode === 'refined' ? 'text-amber-400' : 'text-gray-500'} />
                {viewMode === 'refined' && <span className="font-bold">리파인</span>}
            </button>

            {/* 3. 간편모드 Simple */}
            <button
                type="button"
                onClick={() => setViewMode('simple')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    viewMode === 'simple'
                        ? 'bg-[#182333] text-yellow-300 font-bold shadow-sm border border-yellow-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="간편 모드: 핵심 내용만 간결하게 안내 (모바일)"
            >
                <Sparkles size={13} className={viewMode === 'simple' ? 'text-yellow-400' : 'text-gray-500'} />
                {viewMode === 'simple' && <span className="font-bold">간편</span>}
            </button>

            {/* 4. 워치모드 Wearable */}
            <button
                type="button"
                onClick={() => setViewMode('wearable')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    viewMode === 'wearable'
                        ? 'bg-[#182333] text-emerald-300 font-bold shadow-sm border border-emerald-400/30'
                        : 'text-gray-400 hover:text-white'
                }`}
                title="워치 모드: 스마트워치 / 초소형 화면 최적화 (3초 체크)"
            >
                <Watch size={13} className={viewMode === 'wearable' ? 'text-emerald-400' : 'text-gray-500'} />
                {viewMode === 'wearable' && <span className="font-bold">워치</span>}
            </button>
        </div>
    );
}
