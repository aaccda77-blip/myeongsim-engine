'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, CreditCard, Landmark } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentRequested: (depositorName: string) => void;
}

export default function PaymentModal({ isOpen, onClose, onPaymentRequested }: PaymentModalProps) {
    const [depositorName, setDepositorName] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bank Info
    const BANK_INFO = {
        name: '농협',
        account: '351-0733-820813',
        holder: '이경윤'
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('농협 351-0733-820813');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!depositorName.trim()) {
            alert('입금자명을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Trigger parent callback
        onPaymentRequested(depositorName);

        setIsSubmitting(false);
        onClose();
        setDepositorName('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative w-full max-w-md bg-gray-900 border border-primary-gold/30 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-2 text-primary-gold font-bold text-lg">
                                <CreditCard className="w-5 h-5" />
                                <span>무통장 입금 안내</span>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">

                            {/* Bank Account Info Card */}
                            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Landmark className="w-24 h-24" />
                                </div>

                                <p className="text-gray-400 text-xs font-medium mb-1">입금하실 계좌</p>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-white text-xl font-bold tracking-tight">{BANK_INFO.name}</span>
                                    <span className="text-gray-300 text-sm mb-1">{BANK_INFO.holder}</span>
                                </div>
                                <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-white/5">
                                    <span className="text-primary-gold font-mono text-lg flex-1">{BANK_INFO.account}</span>
                                    <button
                                        onClick={handleCopy}
                                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                                    >
                                        {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                        {isCopied ? '복사됨' : '복사'}
                                    </button>
                                </div>
                            </div>

                            {/* Despositor Input */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300 font-medium">입금자명 (본인 확인용)</label>
                                <input
                                    type="text"
                                    value={depositorName}
                                    onChange={(e) => setDepositorName(e.target.value)}
                                    placeholder="예: 홍길동"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-gold focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-500">* 입금 내역 확인 후 리포트가 해금됩니다.</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-primary-gold hover:bg-yellow-500 text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary-gold/10 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        <span>처리 중...</span>
                                    </>
                                ) : (
                                    <span>입금 완료 (확인 요청)</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
