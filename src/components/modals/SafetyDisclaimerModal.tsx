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
                        className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="bg-red-900/20 px-6 py-4 border-b border-red-500/20 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                            <h2 className="text-lg font-bold text-white tracking-wide">
                                {LEGAL_NOTICES.title}
                            </h2>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

                            {/* Alert Banner */}
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-200 leading-relaxed">
                                🚨 본 서비스는 <strong>의료 서비스가 아니며</strong>, 제공되는 모든 정보는 <strong>코칭 및 자기계발</strong> 목적입니다.
                            </div>

                            {LEGAL_NOTICES.sections.map((section, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-gray-500" />
                                        {section.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/40">
                            <button
                                onClick={handleAgree}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                            >
                                <CheckCircle className="w-5 h-5" />
                                {LEGAL_NOTICES.buttonText}
                            </button>
                            <p className="text-[10px] text-gray-500 text-center mt-3">
                                시작하기 버튼을 누르면 위 내용과 서비스 이용약관에 동의하는 것으로 간주합니다.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
