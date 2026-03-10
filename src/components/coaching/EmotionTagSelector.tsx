import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
    tags: string[];
    onTagSelect: (tag: string) => void;
}

export default function EmotionTagSelector({ tags, onTagSelect }: Props) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="w-full bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm mb-4">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-gray-300">오늘의 감정 에너지 (3S 코칭)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                    <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTagSelect(tag)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:border-purple-500/50 transition-all shadow-sm flex items-center gap-1"
                    >
                        {tag}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
