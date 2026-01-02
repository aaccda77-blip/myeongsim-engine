'use client';

import { motion } from 'framer-motion';

interface GrowthMapIndicatorProps {
    currentStage: number; // 1-7
}

const STAGE_CONFIG = {
    1: { name: "발견", emoji: "📊", color: "from-blue-500 to-cyan-500" },
    2: { name: "융합", emoji: "🧩", color: "from-purple-500 to-pink-500" },
    3: { name: "치유", emoji: "🌿", color: "from-green-500 to-emerald-500" },
    4: { name: "행동", emoji: "⚡", color: "from-orange-500 to-yellow-500" },
    5: { name: "유지", emoji: "🔄", color: "from-indigo-500 to-blue-500" },
    6: { name: "확장", emoji: "🌍", color: "from-teal-500 to-cyan-500" },
    7: { name: "초월", emoji: "🧘", color: "from-violet-500 to-purple-500" }
};

export default function GrowthMapIndicator({ currentStage }: GrowthMapIndicatorProps) {
    const stage = STAGE_CONFIG[currentStage as keyof typeof STAGE_CONFIG] || STAGE_CONFIG[1];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-full"
        >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center text-xs shadow-lg`}>
                {stage.emoji}
            </div>
            <span className="text-xs font-medium text-gray-300">
                현재: <span className="text-white font-bold">{stage.name} 단계</span>
            </span>
        </motion.div>
    );
}
