'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';

export default function WealthGaugeView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">08. Wealth</span>
                <h2 className="text-2xl font-serif text-white mt-2">나의 재물 그릇</h2>
                <p className="text-sm text-gray-400 mt-2">당신이 담을 수 있는 부의 크기는 얼마일까요?</p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Cup Container */}
                <div className="w-48 h-64 border-4 border-white/20 border-t-0 rounded-b-[3rem] relative overflow-hidden backdrop-blur-sm bg-white/5">
                    {/* Water */}
                    <motion.div
                        initial={{ height: '0%' }}
                        animate={{ height: `${reportData.wealth.score}%` }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-0 w-full bg-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                    >
                        {/* Wave effect overlay */}
                        <div className="absolute top-0 w-full h-4 bg-blue-400/30 animate-pulse" />
                    </motion.div>

                    {/* Score Text */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2 }}
                            className="text-4xl font-serif font-bold text-white drop-shadow-lg"
                        >
                            {reportData.wealth.score}
                            <span className="text-lg text-blue-200">%</span>
                        </motion.span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="mt-8 bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl text-center"
                >
                    <p className="text-sm text-blue-100 leading-relaxed font-serif">
                        &quot;{reportData.wealth.description}&quot;
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
