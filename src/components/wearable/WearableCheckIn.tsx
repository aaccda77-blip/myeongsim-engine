'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';

interface WearableCheckInProps {
    onNext: () => void;
}

export function WearableCheckIn({ onNext }: WearableCheckInProps) {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [isRecorded, setIsRecorded] = useState(false);

    const todayStr = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`myeongsim_daily_scan_${todayStr}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.selectedEmotion) {
                        setSelectedMood(parsed.selectedEmotion);
                        setIsRecorded(true);
                    }
                } catch (e) {}
            }
        }
    }, [todayStr]);

    const handleSelectMood = (mood: string) => {
        setSelectedMood(mood);
        setIsRecorded(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`myeongsim_daily_scan_${todayStr}`, JSON.stringify({
                energyScore: mood === '좋음' ? 8 : mood === '보통' ? 5 : 3,
                selectedEmotion: mood,
                timestamp: new Date().toISOString()
            }));
        }
    };

    const moods = [
        { label: '좋음', icon: '🙂', color: 'hover:bg-emerald-500/20 text-emerald-300' },
        { label: '보통', icon: '😐', color: 'hover:bg-amber-500/20 text-amber-300' },
        { label: '지침', icon: '😮‍💨', color: 'hover:bg-rose-500/20 text-rose-300' }
    ];

    return (
        <div className="flex flex-col items-center justify-between h-full py-4 px-3 text-center select-none">
            <span className="text-[10px] font-mono font-bold tracking-widest text-pink-400 uppercase">
                빠른 감정 체크
            </span>

            <div className="my-auto space-y-3 w-full max-w-[220px]">
                <p className="text-xs sm:text-sm font-bold text-gray-200">
                    지금 기분은 어떠신가요?
                </p>

                <div className="grid grid-cols-3 gap-2">
                    {moods.map((m) => (
                        <button
                            key={m.label}
                            onClick={() => handleSelectMood(m.label)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                                selectedMood === m.label
                                    ? 'bg-white/20 border-white text-white font-black scale-105 shadow-md'
                                    : 'bg-white/[0.04] border-white/10 text-gray-300 active:scale-95'
                            }`}
                        >
                            <span className="text-2xl mb-0.5">{m.icon}</span>
                            <span className="text-[11px] font-medium">{m.label}</span>
                        </button>
                    ))}
                </div>

                {isRecorded && (
                    <p className="text-[11px] font-bold text-cyan-300 animate-fade-in flex items-center justify-center gap-1 pt-1">
                        <CheckCircle2 size={12} />
                        <span>기록 완료되었습니다 ✨</span>
                    </p>
                )}
            </div>

            <button
                onClick={onNext}
                className="w-full max-w-[220px] py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border border-white/10"
            >
                <span>연속 기록 보기</span>
            </button>
        </div>
    );
}
