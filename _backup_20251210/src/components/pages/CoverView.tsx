'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Stars } from 'lucide-react';
import StarBackground from './StarBackground';

export default function CoverView() {
    const { nextStep, reportData } = useReportStore();
    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background Animated Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <StarBackground key={i} />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="mb-12 relative z-10"
            >
                <div className="w-24 h-24 rounded-full border border-primary-olive/30 flex items-center justify-center mx-auto mb-8 bg-primary-olive/5 backdrop-blur-sm">
                    <Stars className="w-10 h-10 text-primary-olive animate-pulse" />
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="z-10"
            >
                <p className="text-primary-olive text-xs font-bold tracking-[0.3em] uppercase mb-4">
                    Premium Report
                </p>
                <h1 className="text-4xl font-serif text-white mb-6 leading-tight">
                    <span className="text-gray-400 text-2xl block mb-2 font-sans font-light">Welcome,</span>
                    {reportData.userName}님
                </h1>
                <div className="w-12 h-[1px] bg-white/20 mx-auto my-8" />
                <p className="text-gray-400 text-sm leading-relaxed mb-12">
                    당신을 위한 12페이지의<br />
                    인생 지도가 준비되었습니다.
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="px-10 py-4 bg-primary-olive text-white font-bold rounded-full hover:bg-opacity-90 transition-colors shadow-[0_0_20px_rgba(101,140,66,0.3)] z-10"
            >
                여정 시작하기
            </motion.button>
        </div>
    );
}
