'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';

export default function ActionItemsView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div className="mb-8">
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">11. Action Items</span>
                <h2 className="text-2xl font-serif text-white mt-2">행운의 열쇠 (Lucky Keys)</h2>
                <p className="text-sm text-gray-400 mt-2">일상을 바꾸는 작은 실천들을 제안합니다.</p>
            </motion.div>

            {/* Lucky Items */}
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-olive" /> 행운의 아이템
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
                {reportData.actionPlan.luckyItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center text-center overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-primary-olive/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                        <span className="text-sm text-gray-200 relative z-10">{item}</span>
                    </motion.div>
                ))}
            </div>

            {/* Lucky Colors */}
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary-olive" /> 행운의 컬러
            </h3>
            <div className="flex gap-4 mb-8">
                {reportData.actionPlan.colors.map((color, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + (idx * 0.1) }}
                        className="flex items-center gap-3 bg-white/5 pr-4 rounded-full border border-white/10"
                    >
                        <div className={`w-10 h-10 rounded-full ${color === 'Gold' ? 'bg-yellow-500' : 'bg-green-800'} shadow-lg`} />
                        <span className="text-sm text-gray-300">{color}</span>
                    </motion.div>
                ))}
            </div>

            {/* Checklist */}
            <div className="bg-secondary-slate/50 rounded-2xl p-6 border border-white/5 flex-1">
                <h3 className="text-white font-bold mb-4 text-sm">실천 가이드</h3>
                <div className="space-y-4">
                    {reportData.actionPlan.todos.map((todo, idx) => (
                        <label key={idx} className="flex items-start gap-3 group cursor-pointer">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded checked:bg-primary-olive checked:border-primary-olive transition-colors" />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors peer-checked:line-through peer-checked:text-gray-600">
                                {todo}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
