'use client';

import { useReportStore } from '@/store/useReportStore';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';
import { useState } from 'react';

export default function ActionView() {
    const { reportData } = useReportStore();
    const [committed, setCommitted] = useState(false);

    if (!reportData) return null;

    const handleCommit = () => {
        setCommitted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#ffffff', '#FBBF24']
        });
    };

    return (
        <div className="h-full flex flex-col pt-8">
            <motion.div className="mb-6 text-center">
                <span className="text-primary-gold text-xs font-bold tracking-widest uppercase">Final Page</span>
                <h2 className="text-2xl font-serif text-white mt-2">나를 위한 처방</h2>
            </motion.div>

            {/* Lucky Items */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {reportData.actionPlan.luckyItems.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center text-center gap-2"
                    >
                        <Star className="w-4 h-4 text-primary-gold" />
                        <span className="text-xs text-gray-300">{item}</span>
                    </motion.div>
                ))}
            </div>

            {/* Checklist */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 mb-8 flex-1">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    실천 가이드
                </h3>
                <div className="space-y-4">
                    {reportData.actionPlan.todos.map((todo, idx) => (
                        <label key={idx} className="flex items-start gap-3 group cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-primary-gold" />
                            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                                {todo}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Commit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCommit}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg mb-4 ${committed
                        ? 'bg-green-600 text-white'
                        : 'bg-primary-gold text-deep-indigo shadow-primary-gold/20'
                    }`}
            >
                {committed ? "약속이 완료되었습니다" : "나 자신과 약속하기"}
            </motion.button>
        </div>
    );
}
