// src/components/ui/TimeCapsule.tsx
'use client';

import React from 'react';
import { usePassTimer } from '@/hooks/usePassTimer';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface TimeCapsuleProps {
    expiryDate: string; // 예: "2025-12-31T23:59:59"
    onExpire?: () => void;
}

export const TimeCapsule = ({ expiryDate, onExpire }: TimeCapsuleProps) => {
    const { timeLeft, percent, isUrgent, isExpired } = usePassTimer(expiryDate, onExpire);

    // 디자인 분기 처리
    const baseColor = isUrgent ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
    const icon = isUrgent ? <AlertTriangle size={14} className="animate-pulse" /> : <Clock size={14} />;
    const label = isUrgent ? "종료 임박" : "이용 중";

    if (isExpired) {
        return (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-600 text-gray-400 text-xs font-medium">
                🔒 이용권 만료됨
            </div>
        );
    }

    return (
        <div className={`relative flex items-center gap-3 px-4 py-2 rounded-full border ${baseColor} backdrop-blur-md shadow-lg transition-all duration-300`}>
            {/* 1. 진행률 바 (배경에 깔림) */}
            <div
                className={`absolute left-0 top-0 bottom-0 rounded-full ${isUrgent ? 'bg-red-500/20' : 'bg-emerald-500/20'} transition-all duration-1000`}
                style={{ width: `${percent}%`, zIndex: -1 }}
            />

            {/* 2. 상태 아이콘 및 텍스트 */}
            <div className="flex items-center gap-2 z-10">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>

            <div className="h-3 w-[1px] bg-current opacity-30 mx-1"></div>

            {/* 3. 타이머 숫자 */}
            <div className="text-sm font-mono font-bold tracking-widest tabular-nums z-10">
                {timeLeft}
            </div>

            {/* 4. 데이패스 뱃지 */}
            {!isUrgent && (
                <div className="ml-1 flex items-center gap-1 text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                    <Sparkles size={8} className="text-yellow-400" />
                    <span>DAY PASS</span>
                </div>
            )}
        </div>
    );
};
