'use client';

import React, { useState } from 'react';
import { X, Key, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
    onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
    const [accessKey, setAccessKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showDeposit, setShowDeposit] = useState(false);
    const [isConsentChecked, setIsConsentChecked] = useState(false); // [New] Privacy Consent State

    const handleVerifyKey = async () => {
        if (!accessKey.trim()) {
            setErrorMsg('코드를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/verify-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessKey: accessKey.trim() })
            });

            const data = await res.json();

            if (data.valid) {
                // Success: Save key and reload
                localStorage.setItem('access_key', accessKey.trim());
                if (data.expiresAt) {
                    localStorage.setItem('session_expires_at', data.expiresAt);
                }
                window.location.reload();
            } else {
                setErrorMsg(data.message || '유효하지 않은 코드입니다.');
            }
        } catch (e) {
            console.error(e);
            setErrorMsg('서버 연결 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContact = () => {
        // [User Request] Link to Kakao Open Chat
        window.open('https://open.kakao.com/o/svmwpk8h', '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-sm bg-[#151922] border border-gray-700 rounded-2xl p-6 relative shadow-2xl">
                {/* 
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-6 h-6" />
                </button> 
                */}
                {/* Close disabled to force login */}

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/50">
                        <Key className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">입장 코드를 입력하세요</h2>
                    <p className="text-sm text-gray-400">
                        이용권 구매 후 발급받은<br />6자리 코드를 입력해주세요.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="예: X7A-9B2"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerifyKey()}
                            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-center tracking-widest text-lg font-mono uppercase"
                        />
                        {errorMsg && (
                            <p className="text-red-400 text-xs mt-2 text-center animate-shake">
                                ⚠️ {errorMsg}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleVerifyKey}
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                        {isLoading ? '확인 중...' : '입장하기 🚀'}
                    </button>

                    {/* Deposit Info Accordion (Strategic Pricing) */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setShowDeposit(!showDeposit)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/50 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                이용권 가격 & 구매 방법
                            </span>
                            {showDeposit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                            {showDeposit && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="bg-gray-900 px-4 py-3 text-sm border-t border-gray-700 space-y-3"
                                >
                                    {/* Pricing Table */}
                                    <div className="grid gap-2">
                                        {/* 1. Decoy */}
                                        <div className="flex justify-between items-center p-2 rounded bg-gray-800 border border-gray-700 opacity-80">
                                            <div>
                                                <div className="text-gray-400 text-xs line-through">5,000원</div>
                                                <div className="text-white font-bold">맛보기권 (30분)</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-indigo-400 font-bold">3,900원</div>
                                            </div>
                                        </div>

                                        {/* 2. Anchor (BEST) */}
                                        <div className="relative flex justify-between items-center p-3 rounded bg-indigo-900/30 border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                                                ★ BEST
                                            </div>
                                            <div>
                                                <div className="text-gray-400 text-xs line-through">30,000원</div>
                                                <div className="text-white font-bold text-lg">자유이용권 (24시간)</div>
                                                <div className="text-[10px] text-indigo-300">시간은 48배, 가격은 단 2.5배!</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[#FAE300] font-black text-xl">9,900원</div>
                                            </div>
                                        </div>

                                        {/* 3. VIP */}
                                        <div className="flex justify-between items-center p-2 rounded bg-gray-800 border border-gray-700">
                                            <div>
                                                <div className="text-gray-400 text-xs line-through">100,000원</div>
                                                <div className="text-white font-bold">VIP 주간권 (7일)</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-purple-400 font-bold">49,000원</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* [New] Privacy Consent Checkbox */}
                                    <div className="mt-4 p-3 bg-gray-800/80 rounded-lg border border-gray-600">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isConsentChecked}
                                                    onChange={(e) => setIsConsentChecked(e.target.checked)}
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-500 bg-gray-700 transition-all checked:border-indigo-500 checked:bg-indigo-500 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-300 leading-tight select-none group-hover:text-white transition-colors">
                                                [필수] 상담 및 입금 확인을 위해 핸드폰 번호를 수집합니다. 동의하십니까?
                                            </span>
                                        </label>
                                    </div>

                                    {/* Bank Info & Contact Button (Gated by Consent) */}
                                    {isConsentChecked && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 space-y-3"
                                        >
                                            <div className="bg-black/40 p-3 rounded-lg border border-gray-700/50 font-mono text-xs">
                                                농협<br />
                                                <span className="text-white text-sm font-bold block mt-1 select-all">351-0733-820813</span>
                                                <span className="block mt-1">예금주: 이경윤</span>
                                            </div>

                                            <p className="text-xs text-gray-400 text-center">
                                                입금 후 아래 버튼을 눌러주세요.<br />
                                                <span className="text-indigo-400">"지금 입금했습니다"</span>라고 남기시면<br />
                                                즉시 입장 코드를 보내드립니다.
                                            </p>

                                            <button
                                                onClick={handleContact}
                                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FAE300] text-black font-bold hover:opacity-90 transition-opacity text-sm shadow-lg animate-pulse"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                입금 확인 / 코드 받기 (카톡)
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Guide */}
                    {!showDeposit && (
                        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                            <p className="text-[10px] text-gray-600">
                                관리자 문의가 필요하신가요? <span className="underline cursor-pointer hover:text-gray-400" onClick={() => setShowDeposit(true)}>이용권 안내 열기</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
