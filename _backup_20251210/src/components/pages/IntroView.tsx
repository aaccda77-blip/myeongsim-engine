'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function IntroView() {
    const { nextStep, reportData } = useReportStore();

    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, type: 'spring' }}
                className="mb-12 relative"
            >
                <div className="w-24 h-24 rounded-full border border-primary-gold/30 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary-gold animate-pulse" />
                </div>
                <div className="absolute inset-0 border border-primary-gold/10 rounded-full scale-150 animate-[spin_10s_linear_infinite]" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-serif text-white mb-6 leading-relaxed"
            >
                <span className="text-primary-gold">{reportData.userName}</span>님,<br />
                소우주에 오신 것을<br />환영합니다.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-400 mb-16 text-sm leading-7"
            >
                당신의 탄생 순간에 새겨진 하늘의 암호를<br />
                지금부터 하나씩 풀어보려 합니다.<br />
                준비가 되셨나요?
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="px-10 py-4 bg-primary-gold text-deep-indigo font-bold rounded-full hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
                입장하기
            </motion.button>
        </div>
    );
}
