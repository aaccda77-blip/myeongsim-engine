'use client';

import React from 'react';
import { Smile } from 'lucide-react';

interface ChatMoodSwitchBarProps {
    selectedMood: string;
    setSelectedMood: (mood: string) => void;
    setShowMindStateModal: (show: boolean) => void;
}

export default function ChatMoodSwitchBar({
    selectedMood,
    setSelectedMood,
    setShowMindStateModal
}: ChatMoodSwitchBarProps) {
    const MOOD_OPTIONS = [
        { key: '불안·완벽주의', label: '🛡️ 불안·완벽주의' },
        { key: '조바심·스트레스', label: '🔥 조바심·스트레스' },
        { key: '무기력·혼란', label: '🌧️ 무기력·혼란' },
        { key: '평온·영점 각성', label: '👑 평온·영점 각성' }
    ];

    return (
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] sm:text-xs text-amber-300 font-black shrink-0 flex items-center gap-1 font-mono whitespace-nowrap">
                    <Smile size={13} className="text-amber-400 animate-pulse" />
                    마음 상태:
                </span>
                {MOOD_OPTIONS.map((emo) => {
                    const isActive = selectedMood === emo.key;
                    return (
                        <button
                            key={emo.key}
                            type="button"
                            onClick={() => setSelectedMood(emo.key)}
                            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all shrink-0 active:scale-95 cursor-pointer whitespace-nowrap border ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                                    : 'bg-white/5 hover:bg-white/15 border-white/10 text-gray-300 hover:text-amber-200'
                            }`}
                        >
                            {emo.label}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => setShowMindStateModal(true)}
                className="px-2.5 py-1 rounded-full bg-amber-400/15 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black transition-all shrink-0 active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm whitespace-nowrap ml-auto"
            >
                ⚙️ 8대 감정 팝업 ➔
            </button>
        </div>
    );
}
