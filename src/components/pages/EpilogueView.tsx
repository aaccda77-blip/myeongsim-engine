'use client';

import { useReportStore } from '@/store/useReportStore';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, ChevronLeft, Home, Loader2, Check, Sparkles, Copy, X } from 'lucide-react';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function EpilogueView() {
    const { reportData, setStep, reset } = useReportStore();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const reportRef = useRef<HTMLDivElement>(null);

    // Data Guard
    if (!reportData || !reportData.actionPlan) return null;

    // 🎨 실제 PDF 생성 함수
    const handleDownload = async () => {
        if (isDownloading || isDownloaded) return;
        setIsDownloading(true);

        try {
            // 전체 리포트 페이지를 캡처할 요소 찾기
            const reportElement = document.getElementById('premium-report-content');

            if (!reportElement) {
                // Fallback: 현재 보이는 화면 캡처
                const canvas = await html2canvas(document.body, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#0f1419',
                    logging: false
                });

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(
                    canvas.toDataURL('image/png'),
                    'PNG',
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                pdf.save(`명심코칭_리포트_${reportData.userName || 'user'}.pdf`);
            } else {
                const canvas = await html2canvas(reportElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#0f1419',
                    logging: false
                });

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(
                    canvas.toDataURL('image/png'),
                    'PNG',
                    0,
                    0,
                    imgWidth,
                    imgHeight
                );

                pdf.save(`명심코칭_리포트_${reportData.userName || 'user'}.pdf`);
            }

            setIsDownloading(false);
            setIsDownloaded(true);

            // 축하 폭죽 (Olive Theme)
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#658c42', '#ffffff', '#a3e635', '#fbbf24'],
                zIndex: 100
            });

            showToastMessage('🎉 PDF가 저장되었습니다!');

            // 3초 후 상태 복귀
            setTimeout(() => setIsDownloaded(false), 3000);

        } catch (error) {
            console.error('PDF 생성 실패:', error);
            setIsDownloading(false);
            showToastMessage('PDF 생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 🔗 공유하기 (Toast 피드백 포함)
    const handleShare = async () => {
        const shareData = {
            title: '명심코칭 리포트',
            text: `"${reportData.actionPlan.affirmation}" - 나만의 운명 리포트 확인하기`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showToastMessage('✨ 공유되었습니다!');
            } else {
                // PC 등 미지원 시 클립보드 복사
                await navigator.clipboard.writeText(window.location.href);
                showToastMessage('📋 링크가 복사되었습니다!');
            }
        } catch (error) {
            // 사용자가 공유를 취소한 경우
            if ((error as Error).name !== 'AbortError') {
                await navigator.clipboard.writeText(window.location.href);
                showToastMessage('📋 링크가 복사되었습니다!');
            }
        }
    };

    // 🏠 처음으로 (네비게이션)
    const handleGoHome = () => {
        setStep(1);
    };

    // ⬅️ 이전 페이지로
    const handleGoBack = () => {
        setStep(12); // ActionItemsView로 이동
    };

    // Toast 메시지 표시
    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div
            id="premium-report-content"
            className="h-full flex flex-col items-center justify-center pt-4 pb-12 text-center relative px-4"
        >
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-primary-olive to-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm flex items-center gap-2"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons (Top) */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-2 py-2">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleGoBack}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleGoHome}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <Home className="w-5 h-5 text-gray-400" />
                </motion.button>
            </div>

            {/* Background Aura with Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary-olive/10 via-emerald-500/5 to-transparent rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-primary-olive/50 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-ping delay-500" />
                <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping delay-1000" />
            </div>

            {/* Header Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 z-10"
            >
                <span className="inline-flex items-center gap-2 text-[10px] bg-gradient-to-r from-primary-olive/20 to-emerald-500/20 border border-primary-olive/50 px-4 py-1.5 rounded-full text-primary-olive font-bold tracking-[0.2em] shadow-lg backdrop-blur-sm">
                    <Sparkles className="w-3 h-3" />
                    MIND TOTEM - END MODE
                </span>
            </motion.div>

            {/* Mantra Card Design */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 relative z-10 w-full max-w-sm"
            >
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-olive/20 via-transparent to-emerald-500/20 rounded-3xl blur-xl opacity-50" />

                    <div className="relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <span className="text-[10px] bg-deep-slate border border-primary-olive/50 px-4 py-1.5 rounded-full text-primary-olive font-bold tracking-[0.2em] shadow-lg">
                                MY MANTRA
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-serif text-white leading-relaxed italic mt-4 drop-shadow-lg">
                            &quot;{reportData.actionPlan.affirmation}&quot;
                        </h1>

                        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary-olive to-transparent mx-auto mt-8 opacity-70" />

                        <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">
                            {reportData.userName}님의 소우주
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Inspirational Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mb-10 z-10"
            >
                <p className="text-gray-300 text-base font-medium mb-2">
                    당신의 이야기는 이제 시작입니다.
                </p>
                <p className="text-gray-500 text-sm leading-loose">
                    이 리포트는 단지 지도일 뿐입니다.<br />
                    <span className="text-primary-olive">진짜 여행은 당신의 발걸음</span>으로 완성됩니다.
                </p>
            </motion.div>

            {/* Premium Action Buttons */}
            <div className="flex flex-col w-full max-w-xs gap-3 z-10">
                {/* Primary: PDF Download */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(101, 140, 66, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`
                        relative w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all overflow-hidden
                        ${isDownloaded
                            ? 'bg-gradient-to-r from-primary-olive to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-white to-gray-100 text-deep-slate hover:from-gray-100 hover:to-white'
                        }
                    `}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                            <span className="text-gray-500">리포트 생성 중...</span>
                        </>
                    ) : isDownloaded ? (
                        <>
                            <Check className="w-5 h-5" />
                            저장 완료!
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            PDF 소장하기
                        </>
                    )}
                </motion.button>

                {/* Secondary: Share */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white font-bold shadow-lg flex items-center justify-center gap-3 hover:from-white/15 hover:to-white/10 transition-all backdrop-blur-sm"
                >
                    <Share2 className="w-5 h-5" />
                    공유하기
                </motion.button>

                {/* Tertiary: Go Back */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    onClick={handleGoHome}
                    className="w-full py-3 rounded-xl text-gray-500 text-sm font-medium hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                    <Home className="w-4 h-4" />
                    처음부터 다시 보기
                </motion.button>
            </div>

            {/* Footer Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-10 text-[10px] text-gray-600 font-serif tracking-widest z-10"
            >
                Myeongsim Coaching © 2025
            </motion.div>
        </div>
    );
}
