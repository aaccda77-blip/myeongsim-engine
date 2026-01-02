'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/modules/AuthService';
import { Sparkles, Lock, Phone, ArrowRight } from 'lucide-react';
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';

export default function LoginPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!agreedToPrivacy) {
            setError('개인정보 처리방침에 동의해주세요.');
            return;
        }

        if (!phoneNumber || phoneNumber.length < 10) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // Phone authentication
            const user = await AuthService.loginWithPhone(phoneNumber, 'TRIAL');

            if (user) {
                // Success message based on ticket status
                let message = '로그인되었습니다.';
                if (user.membership_tier && user.membership_tier !== 'FREE') {
                    message = `환영합니다! ${user.membership_tier} 이용권이 확인되었습니다. ✨`;
                }

                alert(message);

                // Save to localStorage for persistence
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_user_id', user.id);
                    localStorage.setItem('myeongsim_login_at', new Date().toISOString());
                }

                // Redirect to main page
                router.push('/');
            } else {
                setError('로그인에 실패했습니다. 번호를 확인해주세요.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-gold to-orange-500 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">명심코칭</h1>
                    <p className="text-slate-400">이용권 로그인</p>
                </div>

                {/* Login Form */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Phone Number Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                휴대폰 번호
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="01012345678"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/20 transition-all"
                                    maxLength={11}
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                💡 하이픈(-) 없이 숫자만 입력해주세요
                            </p>
                        </div>

                        {/* Privacy Agreement */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={agreedToPrivacy}
                                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-primary-gold focus:ring-primary-gold focus:ring-offset-0"
                                disabled={isLoading}
                            />
                            <label htmlFor="privacy" className="text-sm text-slate-300">
                                <button
                                    type="button"
                                    onClick={() => setShowPrivacyModal(true)}
                                    className="text-primary-gold hover:underline font-medium"
                                >
                                    개인정보 처리방침
                                </button>
                                에 동의합니다. (필수)
                                <br />
                                <span className="text-xs text-slate-500">
                                    휴대폰 번호는 SHA-256 암호화되어 안전하게 저장됩니다.
                                </span>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !phoneNumber || !agreedToPrivacy}
                            className="w-full py-3 bg-gradient-to-r from-primary-gold to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>로그인 중...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    <span>이용권 확인 및 로그인</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-300 mb-2">
                            💙 <strong>이용권 보유자 전용</strong>
                        </p>
                        <ul className="text-xs text-blue-200/80 space-y-1">
                            <li>• TRIAL, PASS, VIP 이용권 자동 확인</li>
                            <li>• 구매하신 휴대폰 번호로 로그인하세요</li>
                            <li>• 로그인 후 바로 코칭 시작 가능</li>
                        </ul>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-slate-400">
                            이용권이 없으신가요?{' '}
                            <button
                                onClick={() => router.push('/')}
                                className="text-primary-gold hover:underline"
                            >
                                무료 체험하기
                            </button>
                        </p>
                        <p className="text-xs text-slate-500">
                            문의: support@myeongsim.com
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            <PrivacyPolicyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
            />
        </div>
    );
}
