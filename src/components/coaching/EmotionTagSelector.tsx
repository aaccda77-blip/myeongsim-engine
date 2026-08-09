import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
    tags: string[];
    onTagSelect: (tag: string) => void;
}

export default function EmotionTagSelector({ tags, onTagSelect }: Props) {
    if (!tags || tags.length === 0) return null;

    const todayStr = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

    return (
        <div className="w-full bg-gradient-to-r from-slate-900/80 via-purple-950/30 to-slate-900/80 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-200">
                        오늘의 감정 에너지 렌즈 (3S 코칭)
                    </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                    📅 {todayStr} 매일 자동 갱신
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTagSelect(tag)}
                        className="px-3.5 py-2 bg-gradient-to-r from-slate-900 to-purple-950/50 hover:from-purple-900 hover:to-indigo-900 border border-amber-400/30 hover:border-amber-300 rounded-full text-xs font-bold text-amber-100 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                        <span>🔮</span>
                        <span>{tag}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
