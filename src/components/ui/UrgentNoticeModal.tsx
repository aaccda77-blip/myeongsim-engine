// src/components/ui/UrgentNoticeModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface UrgentNoticeModalProps {
    expiryDate: string; // 만료 시간 (예: "2025-12-31T23:59:59")
    onExtend: () => void; // 연장하기 버튼 클릭 시 실행할 함수 (결제창 오픈 등)
}

export const UrgentNoticeModal = ({ expiryDate, onExtend }: UrgentNoticeModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false); // 세션 당 1회만 노출

    useEffect(() => {
        if (!expiryDate) return;

        const checkTime = () => {
            const now = new Date().getTime();
            const end = new Date(expiryDate).getTime();
            const diff = end - now;

            // 조건: 남은 시간이 0초 초과 ~ 5분(300,000ms) 이하이고, 아직 보여준 적 없을 때
            if (diff > 0 && diff <= 5 * 60 * 1000 && !hasShown) {
                setIsOpen(true);
                setHasShown(true); // 중복 노출 방지 플래그
            }
        };

        // 1초마다 체크
        const timer = setInterval(checkTime, 1000);
        return () => clearInterval(timer);
    }, [expiryDate, hasShown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* 1. 배경 블러 처리 (Backdrop) */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)} // 배경 클릭 시 닫기
            />

            {/* 2. 모달 본문 */}
            <div className="relative bg-slate-900 border border-red-500/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">

                {/* 상단 장식: 긴급 아이콘 */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 p-2 rounded-full border border-red-500/50">
                    <div className="bg-red-500 rounded-full p-2 animate-pulse">
                        <AlertTriangle className="text-white" size={24} />
                    </div>
                </div>

                <div className="mt-6 text-center space-y-2">
                    <h2 className="text-xl font-bold text-white">
                        연결 종료 <span className="text-red-400">5분 전</span>
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        마스터 H와의 심층 분석 세션이 곧 종료됩니다.<br />
                        중요한 조언이 끊기지 않도록 시간을 확보하세요.
                    </p>
                </div>

                {/* 3. 액션 버튼 그룹 */}
                <div className="mt-6 space-y-3">
                    {/* 연장하기 (강조) */}
                    <button
                        onClick={() => {
                            onExtend();
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-95"
                    >
                        <Clock size={18} />
                        <span>시간 연장하고 대화 계속하기</span>
                        <ArrowRight size={18} />
                    </button>

                    {/* 닫기 (약하게) */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full text-slate-500 text-sm hover:text-slate-300 py-2 transition-colors"
                    >
                        괜찮습니다, 남은 5분만 쓸게요.
                    </button>
                </div>
            </div>
        </div>
    );
};
