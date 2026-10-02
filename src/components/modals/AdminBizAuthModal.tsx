'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, X, Sparkles, AlertCircle } from 'lucide-react';

interface AdminBizAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AdminBizAuthModal({
    isOpen,
    onClose,
    onSuccess,
}: AdminBizAuthModalProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isShake, setIsShake] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = password.trim();

        // 영문 자판으로 '강미숙77!@' = 'rkdalstnr77!@'
        // 한글 자판으로 직접 입력한 '강미숙77!@' 도 편리하게 허용
        const isValid = trimmed === 'rkdalstnr77!@' || trimmed === '강미숙77!@';

        if (isValid) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('myeongsim_biz_admin_unlocked', 'true');
            }
            setErrorMsg('');
            setPassword('');
            onSuccess();
            onClose();
        } else {
            setErrorMsg('비밀번호가 일치하지 않습니다. 관리자 전용 비밀번호를 확인해주세요.');
            setIsShake(true);
            setTimeout(() => setIsShake(false), 500);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in font-sans text-left">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ 
                        scale: 1, 
                        opacity: 1,
                        x: isShake ? [-10, 10, -10, 10, 0] : 0
                    }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-md bg-gradient-to-b from-[#131b2e] via-[#0b101c] to-[#050811] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-[0_25px_80px_rgba(245,158,11,0.25)] text-left overflow-hidden text-white"
                >
                    {/* 상단 앰비언트 글로우 */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                    {/* 닫기 버튼 */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="닫기"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* 상단 헤더 뱃지 */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10.5px] font-black font-mono tracking-wider flex items-center gap-1.5 shadow-sm">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>ADMIN SECURE ACCESS</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                            관리자 전용
                        </span>
                    </div>

                    {/* 모달 타이틀 */}
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <span>비즈니스 아키텍트 인증</span>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                        본 메뉴는 관리자 및 연구원 전용 비공개 솔루션입니다. 열람을 위해 보안 비밀번호를 입력해 주세요.
                    </p>

                    {/* 비밀번호 폼 */}
                    <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>관리자 비밀번호</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoFocus
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errorMsg) setErrorMsg('');
                                    }}
                                    placeholder="비밀번호 입력 (영문 자판 기준)"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono tracking-wider pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* 에러 메시지 */}
                        {errorMsg && (
                            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5 animate-fade-in">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div className="pt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span>인증 및 열람하기</span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-[10px] text-gray-400 text-center">
                        ※ 승인된 관리자 계정만 접근 가능하며 비인가 접근은 제한됩니다.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
