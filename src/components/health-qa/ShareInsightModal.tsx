/**
 * ShareInsightModal.tsx
 * 건강상식 공유 모달
 * 
 * 디자인: 모던 하단 시트
 * 기능: 카카오톡/인스타그램/문자 공유, 이미지 자동 생성
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { HealthQATemplate } from '@/data/HealthKnowledgeDB';

interface ShareInsightModalProps {
    qaData: HealthQATemplate;
    onClose: () => void;
}

export default function ShareInsightModal({ qaData, onClose }: ShareInsightModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 공유 이미지 생성
    useEffect(() => {
        generateShareImage();
    }, [qaData]);

    const generateShareImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas 크기 설정 (인스타그램 스토리 비율 9:16)
        canvas.width = 1080;
        canvas.height = 1920;

        // 배경 그라데이션
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#6B8E23');
        gradient.addColorStop(1, '#3D5016');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 텍스트 설정
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';

        // 핵심 메시지 (큰 따옴표로 감싸기)
        ctx.font = 'bold 72px "Noto Sans KR", sans-serif';
        const coreMessage = qaData.answer.core_message.substring(0, 50) + '...';
        wrapText(ctx, `"${coreMessage}"`, canvas.width / 2, 800, 900, 90);

        // 출처
        ctx.font = '36px "Noto Sans KR", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('명심 AI 코치', canvas.width / 2, 1600);

        // 로고 (간단한 원)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 400, 80, 0, Math.PI * 2);
        ctx.fill();
    };

    // 텍스트 줄바꿈 헬퍼 함수
    const wrapText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
    ) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    };

    // 카카오톡 공유
    const handleKakaoShare = async () => {
        try {
            // TODO: 카카오 SDK 연동
            // Kakao.Link.sendDefault({ ... });

            // 공유 기록 저장
            await fetch('/api/health-qa/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qaId: qaData.id, platform: 'kakao' })
            });

            alert('카카오톡 공유 기능은 곧 추가됩니다!');
        } catch (error) {
            console.error('카카오톡 공유 실패:', error);
        }
    };

    // 인스타그램 공유 (이미지 다운로드)
    const handleInstagramShare = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `명심코칭_건강상식_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);

            // 공유 기록 저장
            fetch('/api/health-qa/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qaId: qaData.id, platform: 'instagram' })
            });
        });
    };

    // 문자 공유
    const handleSMSShare = () => {
        const text = `${qaData.question}\n\n${qaData.answer.core_message}\n\n명심코칭에서 더 많은 건강 팁을 확인하세요!`;
        const smsUrl = `sms:?body=${encodeURIComponent(text)}`;
        window.location.href = smsUrl;

        // 공유 기록 저장
        fetch('/api/health-qa/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qaId: qaData.id, platform: 'sms' })
        });
    };

    // 링크 복사
    const handleCopyLink = async () => {
        const url = `${window.location.origin}/health-qa/${qaData.id}`;

        try {
            await navigator.clipboard.writeText(url);
            alert('링크가 복사되었습니다!');

            // 공유 기록 저장
            await fetch('/api/health-qa/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qaId: qaData.id, platform: 'link' })
            });
        } catch (error) {
            console.error('링크 복사 실패:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            {/* 배경 클릭 시 닫기 */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* 모달 컨텐츠 */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative w-full flex flex-col bg-white dark:bg-[#1C1C1E] rounded-t-[32px] shadow-2xl max-w-md mx-auto"
            >
                {/* Handle */}
                <div className="flex h-5 w-full items-center justify-center pt-5 pb-1">
                    <div className="h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-3 pb-2">
                    <h3 className="text-[#111813] dark:text-white tracking-tight text-xl font-bold">
                        인사이트 공유하기
                    </h3>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xl">
                            close
                        </span>
                    </button>
                </div>

                {/* Preview Image */}
                <div className="px-6 py-4">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-auto"
                            style={{ aspectRatio: '9/16' }}
                        />
                    </div>
                    <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-4 font-medium tracking-tight">
                        공유될 이미지 미리보기
                    </p>
                </div>

                {/* Share Buttons */}
                <div className="px-6 pb-5 pt-1">
                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={handleKakaoShare}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#FEE500] flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-[#3C1E1E] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    chat_bubble
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                카카오톡
                            </span>
                        </button>

                        <button
                            onClick={handleInstagramShare}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-white text-[28px]">
                                    photo_camera
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                인스타그램
                            </span>
                        </button>

                        <button
                            onClick={handleSMSShare}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#34C759] flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    sms
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                메시지
                            </span>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm group-active:scale-95 transition-transform text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-[28px]">
                                    ios_share
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                더보기
                            </span>
                        </button>
                    </div>
                </div>

                {/* Link Copy Button */}
                <div className="px-6 pb-10">
                    <button
                        onClick={handleCopyLink}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl h-14 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition-all text-[#111813] dark:text-white text-[15px] font-bold"
                    >
                        <span className="material-symbols-outlined text-xl">link</span>
                        <span>링크 복사하기</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
