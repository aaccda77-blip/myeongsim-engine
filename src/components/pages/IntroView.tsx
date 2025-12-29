'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function IntroView() {
    const { nextStep, reportData, setStep } = useReportStore();

    // [Fix 1] 데이터 가드 (Data Guard)
    // 데이터가 없으면 안내 문구를 띄우거나 커버로 리다이렉트
    if (!reportData) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
                <p className="text-gray-400 mb-6">분석된 데이터가 없습니다.</p>
                <button
                    onClick={() => setStep(1)} // 커버로 이동
                    className="px-6 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
                >
                    처음으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">

            {/* Animation Icon */}
            <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
                className="mb-10 relative"
            >
                <div className="w-24 h-24 rounded-full border border-primary-olive/30 flex items-center justify-center bg-primary-olive/5 backdrop-blur-sm">
                    {/* [Fix 2] Brand Color: Gold -> Olive */}
                    <Sparkles className="w-10 h-10 text-primary-olive animate-pulse" />
                </div>

                {/* Spinning Ring (Tailwind -> Framer Motion conversion for smoother control) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-primary-olive/20 border-t-primary-olive rounded-full scale-125"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-white/10 rounded-full scale-150 opacity-50"
                />
            </motion.div>

            {/* Greeting Text */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-serif text-white mb-6 leading-relaxed"
            >
                <span className="text-primary-olive font-bold decoration-wavy underline decoration-primary-olive/30 underline-offset-4">
                    {reportData.userName}
                </span>님,<br />
                소우주에 오신 것을<br />환영합니다.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-400 mb-12 text-sm md:text-base leading-7 md:leading-8 max-w-xs break-keep"
            >
                당신의 탄생 순간에 새겨진<br />
                하늘의 암호를 풀어보려 합니다.<br />
                <span className="text-primary-olive/80">준비가 되셨나요?</span>
            </motion.p>

            {/* CTA Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="group relative px-10 py-4 bg-primary-olive text-white font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(101,140,66,0.4)] transition-all hover:shadow-[0_0_30px_rgba(101,140,66,0.6)]"
            >
                <span className="relative z-10 flex items-center gap-2">
                    입장하기
                </span>
                {/* Button Hover Glow Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
        </div>
    );
}
