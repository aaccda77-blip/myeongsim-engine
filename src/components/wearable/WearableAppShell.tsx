'use client';

import React, { useState } from 'react';
import { ViewModeSwitcher } from '../simple/ViewModeSwitcher';
import { ChevronLeft, ChevronRight, Watch } from 'lucide-react';

interface WearableAppShellProps {
    children: React.ReactNode;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function WearableAppShell({
    children,
    currentPage,
    totalPages,
    onPageChange
}: WearableAppShellProps) {
    return (
        <div className="min-h-screen w-full bg-[#0a101d] flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans">
            
            {/* 상단 모드 전환 바 (웨어러블 환경에서도 1초 만에 복귀 가능) */}
            <div className="w-full max-w-sm flex items-center justify-between pb-3 px-2">
                <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Watch size={13} />
                    <span>WEARABLE WATCH MODE</span>
                </span>
                <ViewModeSwitcher />
            </div>

            {/* 스마트워치 프레임 시뮬레이터 (Round-Safe 원형/라운드 사각 베젤) */}
            <div className="relative size-[320px] sm:size-[360px] rounded-full bg-[#121C2A] border-4 border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col items-center justify-between ring-1 ring-white/15">
                
                {/* 시계 상단 상태바 (10:08 / 94%) */}
                <div className="w-full pt-3 px-6 flex items-center justify-between text-[10px] font-mono text-gray-400 shrink-0 z-20">
                    <span>10:08</span>
                    <span className="text-emerald-400">● 94%</span>
                </div>

                {/* 중앙 안전 영역 (Safe-Area) 콘텐츠 */}
                <div className="flex-1 w-full max-w-[260px] h-full overflow-hidden relative flex flex-col items-center justify-center">
                    {children}
                </div>

                {/* 하단 페이지 닷 인디케이터 (6개 닷) */}
                <div className="w-full pb-3 flex items-center justify-center gap-1.5 shrink-0 z-20">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => onPageChange(idx)}
                            className={`rounded-full transition-all cursor-pointer ${
                                currentPage === idx
                                    ? 'size-2 bg-amber-400 scale-110 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                                    : 'size-1.5 bg-white/20 hover:bg-white/40'
                            }`}
                            title={`페이지 ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* 좌우 페이지 넘김 터치 영역 (스마트워치 베젤 터치 제어) */}
                <button
                    onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="absolute left-1 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-0 transition-all cursor-pointer z-30"
                >
                    <ChevronLeft size={16} />
                </button>

                <button
                    onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-0 transition-all cursor-pointer z-30"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* 안내 텍스트 */}
            <p className="text-[11px] text-gray-400 mt-4 text-center font-sans">
                스마트워치 및 소형 라운드 디스플레이 최적화 UI입니다. 좌우 닷을 눌러 페이지를 넘겨보세요.
            </p>
        </div>
    );
}
