'use client';

import { useReportStore } from '@/store/useReportStore';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export default function EpilogueView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    const handleDownload = () => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.8 },
            colors: ['#658c42', '#ffffff', '#FBBF24']
        });
        alert("PDF 다운로드가 시작됩니다. (Demo)");
    };

    return (
        <div className="h-full flex flex-col items-center justify-center pt-8 pb-12 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-12 relative"
            >
                <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-gray-400 tracking-[0.2em] mb-6 inline-block">
                    MY MANTRA
                </span>
                <h1 className="text-3xl md:text-4xl font-serif text-white leading-relaxed italic">
                    &quot;{reportData.actionPlan.affirmation}&quot;
                </h1>
                <div className="w-16 h-1 bg-primary-olive mx-auto mt-8 rounded-full opacity-50" />
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-500 text-sm mb-12 leading-loose"
            >
                당신의 계절은 이제 막 시작되었습니다.<br />
                언제든 이 지도를 펼쳐보세요.
            </motion.p>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="bg-white text-deep-slate px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
                <Download className="w-5 h-5" />
                PDF 리포트 저장하기
            </motion.button>
        </div>
    );
}
