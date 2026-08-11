'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Smartphone, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { AuthService } from '@/modules/AuthService';
import { generateDeviceFingerprint } from '@/modules/SessionManager';

interface PhoneAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userId: string, isNewUser: boolean) => void;
    selectedTier?: 'TRIAL' | 'PASS' | 'VIP';
    mode?: 'login' | 'register'; // [NEW] Mode prop
    currentUserId?: string; // [NEW] If user is logged in
}

import SimpleCaptcha from './SimpleCaptcha';

export default function PhoneAuthModal({ isOpen, onClose, onLoginSuccess, selectedTier = 'TRIAL', mode = 'login', currentUserId }: PhoneAuthModalProps) {
    const [phone, setPhone] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const isLoginMode = mode === 'login';

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

        if (!isCaptchaVerified) {
            setError('자동 입력 방지 퀴즈를 풀어주세요.');
            return;
        }

        if (phone.length < 12) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // [FIX] Generate device fingerprint
            const deviceFingerprint = await generateDeviceFingerprint();

            let user = null;

            // [Condition 1: Update Existing User]
            if (currentUserId && mode === 'register') {
                const updated = await AuthService.updateUserPhoneAndTier(currentUserId, phone, deviceFingerprint, selectedTier);
                if (updated) {
                    alert('등록되었습니다. 관리자 승인을 기다려주세요.');
                    onLoginSuccess(currentUserId, false);
                    onClose();
                    setIsLoading(false);
                    return;
                } else {
                    setError('등록에 실패했습니다. 이미 사용 중인 번호일 수 있습니다.');
                    setIsLoading(false);
                    return;
                }
            }

            // [Condition 2: Login/Register New User]
            else {
                // [Module Call] Auth Service with Tier (correct parameter order)
                user = await AuthService.loginWithPhone(phone, deviceFingerprint, selectedTier);
            }

            if (user) {
                // [FIX] Tier별 한글 설명 매핑 (VIP 제거 -> 단발성 충전권 이름으로 개정)
                const tierNames: Record<string, string> = {
                    'TRIAL_30M': '💬 890원 대화 3회 충전',
                    'TRIAL': '💬 890원 대화 3회 충전',
                    'PASS_24H': '🔬 1,900원 오행 리포트',
                    'PASS': '🔬 1,900원 오행 리포트',
                    'VIP_7D': '🔮 890원 (3회 이용) 마스터코어',
                    'VIP': '🔮 890원 (3회 이용) 마스터코어',
                    'FREE': '기본 무료 대화'
                };

                let successMsg = '로그인되었습니다.';
                if (user.membership_tier && user.membership_tier !== 'FREE') {
                    const tierDisplay = tierNames[user.membership_tier] || user.membership_tier;

                    // TRIAL 티어는 입금 대기 안내 추가
                    if (user.membership_tier.includes('TRIAL')) {
                        successMsg = `${tierDisplay} 이용권이 등록되었습니다.\n\n📞 관리자와 1:1 대화를 통해 입금 확인 후 사용이 가능합니다.`;
                    } else {
                        successMsg = `[프리미엄 인증] ${tierDisplay} 이용권이 활성화되었습니다. ✨`;
                    }
                }
                alert(successMsg);

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
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
                                <h3 className="text-white font-bold text-lg">{isLoginMode ? '안심 로그인' : '연락처 등록'}</h3>
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

                        {/* Captcha */}
                        <div className="px-1">
                            <SimpleCaptcha onVerify={setIsCaptchaVerified} />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isCaptchaVerified}
                            className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isLoading || !isCaptchaVerified
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed hidden-shadow'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{isLoginMode ? '시작하기' : '등록하기'}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Divider - Only in Login Mode */}
                        {isLoginMode && (
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-700" />
                                </div>
                                <span className="relative z-10 bg-slate-900 px-4 text-xs text-gray-500 font-medium">OR</span>
                            </div>
                        )}

                        {/* Google Login Button - Only in Login Mode */}
                        {isLoginMode && (
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        setIsLoading(true);
                                        await AuthService.loginWithGoogle();
                                    } catch (error) {
                                        console.error(error);
                                        setError('구글 로그인 중 오류가 발생했습니다.');
                                        setIsLoading(false);
                                    }
                                }}
                                className="w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 bg-white text-gray-800 hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Google 계정으로 계속하기</span>
                            </button>
                        )}
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
