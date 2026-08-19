// src/components/coaching/MicroPassModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle2, Building2 } from 'lucide-react';

interface MicroPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    userSajuData?: any;
    onUpgradeToFullPass?: () => void;
}

export const MicroPassModal: React.FC<MicroPassModalProps> = ({
    isOpen,
    onClose
}) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleRequestApproval = async () => {
        setIsSubmitted(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_approval_requested', 'true');
            const userId = localStorage.getItem('myeongsim_user_id') || `guest-${Date.now()}`;
            const userName = localStorage.getItem('myeongsim_user_name') || '수검자';
            fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userName, tier: 'CHAT_3', amount: 890 })
            }).catch(e => console.error("Payment request error:", e));
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-sm bg-[#0a0a14] border border-amber-500/40 rounded-[28px] p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden text-white text-left"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                        <Lock size={20} />
                    </div>

                    <h3 className="text-base font-black text-amber-300 mb-1">
                        🔒 컨텐츠 3회 이용 완료
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-5">
                        3회 컨텐츠 이용이 완료되었습니다.<br />
                        <strong>관리자 승인이 완료 되면 잠금이 해제되어 3회 추가 이용이 가능합니다.</strong>
                    </p>

                    {!isSubmitted ? (
                        <button
                            type="button"
                            onClick={handleRequestApproval}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            <span>관리자 승인 요청하기</span>
                        </button>
                    ) : (
                        <div className="w-full py-3.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span>관리자 승인 대기 중 (승인 완료 시 3회 추가 이용 가능)</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MicroPassModal;
