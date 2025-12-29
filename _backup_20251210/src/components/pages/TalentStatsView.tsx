'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';

export default function TalentStatsView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    const stats = [
        { label: "창의성 (Creativity)", val: reportData.stats.creativity, color: "bg-purple-500" },
        { label: "리더십 (Leadership)", val: reportData.stats.leadership, color: "bg-red-500" },
        { label: "공감능력 (Empathy)", val: reportData.stats.empathy, color: "bg-blue-500" },
        { label: "재물감각 (Wealth)", val: reportData.stats.wealth, color: "bg-yellow-500" },
        { label: "실행력 (Execution)", val: reportData.stats.execution, color: "bg-green-500" },
    ];

    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">05. Talents</span>
                <h2 className="text-2xl font-serif text-white mt-2">나의 잠재력 스탯</h2>
                <p className="text-sm text-gray-400 mt-2">어떤 능력이 가장 빛나고 있나요?</p>
            </motion.div>

            <div className="flex-1 flex flex-col justify-center gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300 font-bold">{stat.label}</span>
                            <span className="text-primary-olive font-mono">{stat.val}</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.val}%` }}
                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_currentColor] opacity-80`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5 mt-8">
                <p className="text-xs text-gray-400 leading-relaxed">
                    <strong className="text-white">Tip:</strong> {reportData.stats.execution < 50 ? "실행력을 보완하면 폭발적인 성장이 가능합니다." : "균형 잡힌 능력을 활용해 보세요."}
                </p>
            </div>
        </div>
    );
}
