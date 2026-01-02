'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Smartphone, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { AuthService } from '@/modules/AuthService';

interface PhoneAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userId: string, isNewUser: boolean) => void;
    selectedTier?: 'TRIAL' | 'PASS' | 'VIP';
}

export default function PhoneAuthModal({ isOpen, onClose, onLoginSuccess, selectedTier = 'TRIAL' }: PhoneAuthModalProps) {
    const [phone, setPhone] = useState('');
    const [agreed, setAgreed] = useState(false); // [Legal]
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const formatPhone = (value: string) => {
        const numbers = value.replace(/[^0-9]/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) {
            setError('개인정보 수집 및 이용에 동의해주세요.');
            return;
        }

        if (phone.length < 12) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            // [Module Call] Auth Service with Tier
            const user = await AuthService.loginWithPhone(phone, selectedTier);

            if (user) {
                // Success
                let successMsg = '로그인되었습니다.';
                if (user.membership_tier && user.membership_tier !== 'FREE') {
                    successMsg = `[프리미엄 인증] ${user.membership_tier} 이용권이 확인되었습니다.`;
                }
                alert(successMsg); // Simple feedback for now, or use toast

                onLoginSuccess(user.id, user.is_new_user);
                onClose();
            } else {
                setError('로그인에 실패했습니다. 번호를 확인해주세요.');
            }
        } catch (err) {
            console.error("Auth Fail:", err);
            setError('시스템 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">안심 로그인</h3>
                                <p className="text-xs text-gray-400">전화번호는 암호화되어 안전하게 저장됩니다.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">휴대폰 번호</label>
                            <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handleChange}
                                    placeholder="010-0000-0000"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors text-lg tracking-wider"
                                    maxLength={13}
                                />
                            </div>
                            {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
                        </div>

                        {/* [Privacy Checkbox] Legal Compliance */}
                        <div className="flex items-start gap-3 px-1">
                            <input
                                type="checkbox"
                                id="privacy-agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-gray-600 bg-black/50 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="privacy-agree" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                                <span className="text-white font-bold">[필수] 개인정보 수집 및 이용 동의</span><br />
                                수집된 전화번호는 <span className="text-gray-300">단방향 암호화(Hash)</span>되어 식별 불가능한 형태로 저장되며, 오직 서비스 이용 자격 확인 용도로만 사용됩니다.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>시작하기</span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="px-6 pb-6 text-center">
                        <p className="text-[10px] text-gray-600">
                            입력하신 정보는 단방향 암호화 처리되어 누구도 식별할 수 없습니다.<br />
                            안심하고 서비스를 이용하세요.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
