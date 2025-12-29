'use client';

import { useReportStore } from '@/store/useReportStore';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Download, Share2, RefreshCcw, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

export default function EpilogueView() {
    const { reportData, setStep, reset } = useReportStore();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    // Data Guard
    if (!reportData || !reportData.actionPlan) return null;

    const handleDownload = () => {
        if (isDownloading || isDownloaded) return;

        setIsDownloading(true);

        // [Deep Tech Logic] PDF 생성 시뮬레이션 (UX)
        // 실제로는 html2canvas + jspdf 등을 여기서 실행
        setTimeout(() => {
            setIsDownloading(false);
            setIsDownloaded(true);

            // 축하 폭죽 (Olive Theme)
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#658c42', '#ffffff', '#cbd5e1'],
                zIndex: 100
            });

            // 3초 후 상태 복귀
            setTimeout(() => setIsDownloaded(false), 3000);
        }, 1500);
    };

    const handleShare = () => {
        // 모바일 네이티브 공유 기능 호출
        if (navigator.share) {
            navigator.share({
                title: '명심코칭 리포트',
                text: `"${reportData.actionPlan.affirmation}" - 나만의 운명 리포트 확인하기`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            // PC 등 미지원 시 클립보드 복사
            navigator.clipboard.writeText(window.location.href);
            alert("링크가 복사되었습니다. (Toast로 변경 권장)");
        }
    };

    const handleRestart = () => {
        if (confirm("모든 데이터가 초기화되고 처음으로 돌아갑니다. 계속하시겠습니까?")) {
            reset(); // 스토어 초기화
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center pt-8 pb-12 text-center relative px-4">

            {/* Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-olive/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12 relative z-10 w-full max-w-sm"
            >
                {/* Mantra Card Design */}
                <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] bg-deep-slate border border-primary-olive/50 px-3 py-1 rounded-full text-primary-olive font-bold tracking-[0.2em] shadow-lg">
                            MY MANTRA
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-serif text-white leading-relaxed italic mt-4">
                        &quot;{reportData.actionPlan.affirmation}&quot;
                    </h1>

                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary-olive to-transparent mx-auto mt-8 opacity-70" />

                    <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">
                        {reportData.userName}님의 소우주
                    </p>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-400 text-sm mb-10 leading-loose z-10"
            >
                당신의 계절은 이제 막 시작되었습니다.<br />
                언제든 이 지도를 펼쳐보세요.
            </motion.p>

            {/* Action Buttons */}
            <div className="flex flex-col w-full max-w-xs gap-3 z-10">
                {/* 1. PDF Download Button */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`
                        relative w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all overflow-hidden
                        ${isDownloaded
                            ? 'bg-primary-olive text-white'
                            : 'bg-white text-deep-slate hover:bg-gray-100'
                        }
                    `}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            <span className="text-gray-500">리포트 생성 중...</span>
                        </>
                    ) : isDownloaded ? (
                        <>
                            <Check className="w-5 h-5" />
                            저장되었습니다
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            PDF 리포트 소장하기
                        </>
                    )}
                </motion.button>

                {/* 2. Secondary Actions (Share & Restart) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex gap-3"
                >
                    <button
                        onClick={handleShare}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        공유하기
                    </button>
                    <button
                        onClick={handleRestart}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        처음부터
                    </button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-8 text-[10px] text-gray-600 font-serif tracking-widest"
            >
                Myeongsim Coaching © 2025
            </motion.div>
        </div>
    );
}
