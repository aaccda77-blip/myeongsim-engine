'use client';

import React from 'react';
import { Heart, Zap, Sparkles, ArrowRight, ShieldAlert, Activity } from 'lucide-react';
import { useWatchData } from '@/services/health/WatchDataService';
import { useWearableContext } from './WearableAppShell';

interface WearableBioPulseProps {
    onGoToBreath?: () => void;
    onGoToEmergency?: () => void;
}

export function WearableBioPulse({ onGoToBreath, onGoToEmergency }: WearableBioPulseProps) {
    const { isLargeText } = useWearableContext();
    const data = useWatchData();
    const { bpm, hrv, stressLevel, stressScore, autonomicBalance, zeroPointAlignment } = data;

    // 스트레스 레벨별 테마 색상
    const isHighStress = stressLevel === 'HIGH' || bpm > 90;
    const accentColor = isHighStress ? '#FF3B30' : stressLevel === 'MODERATE' ? '#FF9500' : '#00F0FF';

    return (
        <div className="flex flex-col items-center justify-between h-full py-2 px-2 text-center select-none font-sans w-full">
            {/* 상단 헤더 라벨 */}
            <div className="flex items-center justify-between w-full px-1.5 pt-1">
                <span className={`${isLargeText ? 'text-xs font-black text-cyan-300' : 'text-[10px] text-gray-400 font-bold'} font-mono tracking-wider flex items-center gap-1`}>
                    <Activity size={isLargeText ? 14 : 12} className="text-cyan-400 animate-pulse" />
                    <span>BIO-PULSE</span>
                </span>
                <span className={`${isLargeText ? 'text-[10px] px-2.5 py-0.5' : 'text-[9px] px-2 py-0.5'} rounded-full font-mono font-black ${
                    isHighStress ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                    stressLevel === 'MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                    {stressLevel === 'HIGH' ? '🚨 긴장' : stressLevel === 'MODERATE' ? '주의' : '🌱 최적'}
                </span>
            </div>

            {/* 중앙 실시간 BPM & 심박 애니메이션 */}
            <div className="relative my-auto flex flex-col items-center justify-center">
                {/* 외곽 회전 펄스 링 */}
                <div className={`relative ${isLargeText ? 'size-32 sm:size-36' : 'size-28 sm:size-32'} flex items-center justify-center`}>
                    <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                        {/* 배경 트랙 */}
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className="stroke-white/10 fill-none"
                            strokeWidth="5"
                        />
                        {/* HRV 게이지 아크 */}
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke={accentColor}
                            className="fill-none transition-all duration-700"
                            strokeWidth="5"
                            strokeDasharray="264"
                            strokeDashoffset={264 - (264 * Math.min(hrv, 80)) / 80}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* 내부 심박수 & 박동 아이콘 */}
                    <div className="flex flex-col items-center justify-center z-10">
                        <Heart
                            size={isLargeText ? 26 : 22}
                            className="transition-transform duration-300 mb-0.5"
                            style={{
                                color: isHighStress ? '#FF3B30' : '#FF2D55',
                                fill: isHighStress ? '#FF3B30' : '#FF2D55',
                                filter: 'drop-shadow(0 0 8px rgba(255, 45, 85, 0.6))',
                                transform: `scale(${1 + ((bpm % 10) / 40)})`
                            }}
                        />
                        <div className="flex items-baseline gap-1">
                            <span className={`${isLargeText ? 'text-4xl sm:text-5xl' : 'text-3xl'} font-black text-white font-mono tracking-tighter`}>
                                {bpm}
                            </span>
                            <span className={`${isLargeText ? 'text-xs font-black text-amber-300' : 'text-[10px] font-bold text-gray-400'}`}>BPM</span>
                        </div>
                        <span className={`${isLargeText ? 'text-[11px] text-cyan-200' : 'text-[10px] text-cyan-300'} font-mono font-black -mt-0.5`}>
                            HRV {hrv}ms
                        </span>
                    </div>
                </div>

                {/* 자율신경계 균형 (교감 SNS vs 부교감 PNS) */}
                <div className={`${isLargeText ? 'w-[220px]' : 'w-[200px]'} mt-1 bg-black/50 border border-white/10 rounded-xl p-1.5 px-2.5`}>
                    <div className={`flex justify-between ${isLargeText ? 'text-[10px] font-black' : 'text-[9px] font-mono'} mb-1`}>
                        <span className="text-amber-400">교감 {autonomicBalance.sympathetic}%</span>
                        <span className="text-emerald-400">부교감 {autonomicBalance.parasympathetic}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                            style={{ width: `${autonomicBalance.sympathetic}%` }}
                        />
                        <div
                            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500"
                            style={{ width: `${autonomicBalance.parasympathetic}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 하단 퀵 액션 버튼 */}
            <div className={`w-full ${isLargeText ? 'max-w-[230px]' : 'max-w-[210px]'} pb-1 space-y-1`}>
                {isHighStress ? (
                    <button
                        onClick={onGoToEmergency || onGoToBreath}
                        className={`w-full ${isLargeText ? 'py-2.5 text-xs' : 'py-2 text-[11px]'} px-3 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all cursor-pointer`}
                    >
                        <ShieldAlert size={isLargeText ? 14 : 12} />
                        <span>30초 긴급 심박 안정</span>
                    </button>
                ) : (
                    <button
                        onClick={onGoToBreath}
                        className={`w-full ${isLargeText ? 'py-2 text-xs' : 'py-1.5 text-[11px]'} px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-black flex items-center justify-center gap-1 border border-white/15 transition-all cursor-pointer`}
                    >
                        <span>4-4-4-4 박스 호흡</span>
                        <ArrowRight size={isLargeText ? 13 : 11} />
                    </button>
                )}
            </div>
        </div>
    );
}
