'use client';

import React, { useState, useEffect } from 'react';
import { LEGAL_NOTICES } from '@/constants/LegalNotices';
import { ShieldAlert, CheckCircle, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafetyDisclaimerModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        // Check if user has already agreed
        const hasAgreed = localStorage.getItem('myeongsim_legal_agreed');
        if (!hasAgreed) {
            setIsVisible(true);
        }
    }, []);

    const handleAgree = () => {
        localStorage.setItem('myeongsim_legal_agreed', 'true');
        setIsVisible(false);
    };

    // Don't render anything on server-side or if not visible
    if (!hasMounted || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-slate-900 border-2 border-red-500/40 rounded-3xl w-full max-w-xl shadow-[0_0_50px_rgba(220,38,38,0.25)] overflow-hidden flex flex-col max-h-[88vh]"
                    >
                        {/* Header */}
                        <div className="bg-red-950/40 px-5 sm:px-6 py-4 border-b border-red-500/30 flex items-center gap-3 shrink-0">
                            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                                    {LEGAL_NOTICES.title}
                                </h2>
                                <p className="text-[11px] text-gray-400 mt-0.5">보건복지부 비의료 건강관리서비스 가이드라인 준수 고지</p>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar text-left">

                            {/* Alert Banner */}
                            <div className="bg-gradient-to-r from-red-500/15 via-orange-500/15 to-amber-500/15 border border-red-500/30 rounded-2xl p-4 text-xs sm:text-sm text-red-200 leading-relaxed shadow-inner">
                                <span className="font-black text-white block mb-1">🚨 의료 행위 부존재 및 비의료 목적 고지</span>
                                {LEGAL_NOTICES.summary}
                            </div>

                            {LEGAL_NOTICES.sections.map((section: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2.5">
                                    <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                                        <span>{section.title}</span>
                                    </h3>

                                    {section.description && (
                                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                                            {section.description}
                                        </p>
                                    )}

                                    {section.bullets && section.bullets.length > 0 && (
                                        <ul className="space-y-1.5 my-2 pl-2 border-l-2 border-amber-500/30">
                                            {section.bullets.map((b: string, bIdx: number) => (
                                                <li key={bIdx} className="text-xs text-gray-200 flex items-start gap-1.5">
                                                    <span className="text-amber-400 font-bold">•</span>
                                                    <span className="leading-snug">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {section.extraNotice && (
                                        <p className="text-[11.5px] text-amber-200/90 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 whitespace-pre-line mt-2">
                                            {section.extraNotice}
                                        </p>
                                    )}

                                    {section.content && (
                                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-5 sm:p-6 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
                            <button
                                onClick={handleAgree}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl transition-all active:scale-98 shadow-[0_0_25px_rgba(225,29,72,0.4)] cursor-pointer"
                            >
                                <CheckCircle className="w-5 h-5 text-white" />
                                <span>{LEGAL_NOTICES.buttonText}</span>
                            </button>
                            <p className="text-[11px] text-gray-400 text-center mt-2.5 font-medium leading-relaxed">
                                {LEGAL_NOTICES.footerCaption || '‘동의하고 코칭 시작하기’ 버튼을 선택하면 서비스 이용약관 및 본 서비스 안내 내용을 확인하고 동의한 것으로 처리됩니다.'}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
