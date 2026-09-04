'use client';

import React, { useState, useEffect } from 'react';
import { ViewModeSwitcher } from '../simple/ViewModeSwitcher';
import { ChevronLeft, ChevronRight, Watch, Smartphone, Heart, Sparkles, Sliders } from 'lucide-react';

interface WearableAppShellProps {
    children: React.ReactNode;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageTitles?: string[];
}

// 👓 50+ 노안전용 큰글씨 모드 Context
interface WearableContextType {
    isLargeText: boolean;
    setIsLargeText: (val: boolean) => void;
}

export const WearableContext = React.createContext<WearableContextType>({
    isLargeText: false,
    setIsLargeText: () => {}
});

export const useWearableContext = () => React.useContext(WearableContext);

export function WearableAppShell({
    children,
    currentPage,
    totalPages,
    onPageChange,
    pageTitles = []
}: WearableAppShellProps) {
    // 폼팩터: 'galaxy' (원형) | 'apple' (라운드 스퀘어 Ultra)
    const [formFactor, setFormFactor] = useState<'apple' | 'galaxy'>('apple');
    const [currentTime, setCurrentTime] = useState('10:08');
    const [isLargeText, setIsLargeText] = useState(false); // 50+ 노안전용 큰글씨 모드

    // 실시간 시계 흐름
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const isApple = formFactor === 'apple';

    return (
        <WearableContext.Provider value={{ isLargeText, setIsLargeText }}>
            <div className="min-h-screen w-full bg-[#05080f] flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans text-slate-100">
                
                {/* 상단 컨트롤 바 (모드 전환 + 워치 기종 선택 + 50+ 큰글씨 모드) */}
                <div className="w-full max-w-md flex flex-wrap items-center justify-between gap-2 pb-3 px-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                            <Watch size={13} className="text-cyan-400 animate-pulse" />
                            <span>ZERO-PULSE</span>
                        </span>

                        {/* 기종 선택 토글 (Apple Watch Ultra vs Galaxy Watch) */}
                        <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono">
                            <button
                                onClick={() => setFormFactor('apple')}
                                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                                    isApple ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Ultra
                            </button>
                            <button
                                onClick={() => setFormFactor('galaxy')}
                                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                                    !isApple ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Galaxy
                            </button>
                        </div>

                        {/* 👓 50+ 노안전용 큰글씨 모드 토글 버튼 */}
                        <button
                            onClick={() => setIsLargeText(!isLargeText)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                                isLargeText
                                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)] font-black'
                                    : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
                            }`}
                            title="50대 이상 시니어 및 노안 전용 큰글씨 초고대비 모드"
                        >
                            <span>👓</span>
                            <span>{isLargeText ? '큰글씨 ON' : '50+ 큰글씨'}</span>
                        </button>
                    </div>

                    <ViewModeSwitcher />
                </div>


            {/* 스마트워치 하드웨어 시뮬레이터 섀시 */}
            <div className="relative flex items-center justify-center py-2">
                {/* 상하 스트랩 시뮬레이션 그래픽 */}
                <div className="absolute -top-6 w-36 h-8 bg-gradient-to-b from-neutral-800 to-neutral-700 rounded-t-xl opacity-40 blur-[0.5px]" />
                <div className="absolute -bottom-6 w-36 h-8 bg-gradient-to-t from-neutral-800 to-neutral-700 rounded-b-xl opacity-40 blur-[0.5px]" />

                {/* 디지털 크라운 & 측면 액션 버튼 (Apple Watch Ultra 스타일) */}
                {isApple && (
                    <>
                        <div className="absolute -right-3 top-20 w-3 h-12 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-r-md border-y border-r border-neutral-500/40 shadow-md" />
                        <div className="absolute -right-2 top-36 w-2 h-8 bg-neutral-700 rounded-r border border-neutral-500/30" />
                        <div className="absolute -left-2.5 top-24 w-2.5 h-14 bg-orange-600 rounded-l-md border-y border-l border-orange-400/40 shadow-md" title="인터내셔널 오렌지 액션 버튼" />
                    </>
                )}

                {/* 디스플레이 베젤 프레임 (Apple Ultra 스퀘어 vs Galaxy 원형) */}
                <div
                    className={`relative size-[340px] sm:size-[380px] bg-black border-[6px] ${
                        isApple
                            ? 'rounded-[54px] border-neutral-700 shadow-[0_25px_60px_rgba(0,0,0,0.98)] ring-1 ring-white/20'
                            : 'rounded-full border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.98)] ring-1 ring-white/15'
                    } overflow-hidden flex flex-col items-center justify-between transition-all duration-500`}
                >
                    {/* 사파이어 크리스탈 엣지 반사광 */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.08] pointer-events-none z-30" />

                    {/* 시계 상단 상태바 (현재 시각 / 블루투스 / 심박 / 배터리) */}
                    <div className="w-full pt-3 px-6 flex items-center justify-between text-[11px] font-mono text-gray-400 shrink-0 z-20">
                        <span className="font-bold text-white tracking-wider">{currentTime}</span>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5 text-rose-400">
                                <Heart size={10} className="fill-rose-500 animate-pulse" />
                            </span>
                            <span className="text-emerald-400 font-bold">● 96%</span>
                        </div>
                    </div>

                    {/* 중앙 안전 영역 (Safe-Area) 콘텐츠 */}
                    <div className="flex-1 w-full max-w-[280px] h-full overflow-hidden relative flex flex-col items-center justify-center z-20">
                        {children}
                    </div>

                    {/* 하단 현재 탭 타이틀 & 네온 닷 인디케이터 */}
                    <div className="w-full pb-2.5 flex flex-col items-center justify-center gap-1 shrink-0 z-20">
                        {pageTitles[currentPage] && (
                            <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">
                                {pageTitles[currentPage]}
                            </span>
                        )}
                        <div className="flex items-center justify-center gap-1.5">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onPageChange(idx)}
                                    className={`rounded-full transition-all cursor-pointer ${
                                        currentPage === idx
                                            ? 'size-2 bg-cyan-400 scale-125 shadow-[0_0_8px_rgba(0,240,255,0.9)]'
                                            : 'size-1.5 bg-white/20 hover:bg-white/40'
                                    }`}
                                    title={pageTitles[idx] || `페이지 ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 좌우 베젤 터치 네비게이션 */}
                    <button
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="absolute left-1 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-0 transition-all cursor-pointer z-40 backdrop-blur-sm"
                        title="이전 화면"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-0 transition-all cursor-pointer z-40 backdrop-blur-sm"
                        title="다음 화면"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* 하단 친절한 안내 텍스트 */}
            <div className="mt-4 flex flex-col items-center gap-1 text-center">
                <p className="text-xs text-gray-300 font-medium">
                    ⌚ <strong className="text-white">Apple Watch Ultra</strong> 및 <strong className="text-white">Galaxy Watch</strong> 최적화 OLED 웰니스 코칭
                </p>
                <p className="text-[11px] text-gray-500">
                    상단 좌우 화살표나 하단 닷을 누르면 6대 생체 코칭 다이얼을 탐색할 수 있습니다.
                </p>
            </div>
        </div>
    </WearableContext.Provider>
    );
}

