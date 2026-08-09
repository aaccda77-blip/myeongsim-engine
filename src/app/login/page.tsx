'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthService } from '@/modules/AuthService';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';
import MyeongsimSunLogo from '@/components/common/MyeongsimSunLogo';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        let isSubscribed = true;
        const safetyTimer = setTimeout(() => {
            if (isSubscribed) {
                console.warn('[LoginPage] Safety timeout triggered');
                setIsCheckingAuth(false);
            }
        }, 5000);

        const checkAuth = async () => {
            try {
                // 1. localStorage에 세션 토큰이 남아있는지 먼저 동기식 확인
                const hasLocalToken = typeof window !== 'undefined' && (() => {
                    try {
                        return Object.keys(localStorage).some(k => k.includes('auth-token') || k.includes('sb-'));
                    } catch (e) { return false; }
                })();

                // 2. 수파베이스 세션 체크
                let { data: { session } } = await supabase.auth.getSession();

                // 로컬 토큰이 있거나 세션이 없으면 잠시 대기하며 재시도
                if (!session && hasLocalToken) {
                    const delays = [200, 600, 1200];
                    for (const delay of delays) {
                        await new Promise(r => setTimeout(r, delay));
                        const { data: { session: s } } = await supabase.auth.getSession();
                        if (s) {
                            session = s;
                            break;
                        }
                    }
                }

                if ((session || hasLocalToken) && isSubscribed) {
                    console.log('[LoginPage] Active session or local token detected! Redirecting to /report...');
                    router.push('/report');
                    return;
                }
            } catch (e) {
                console.warn('[LoginPage] checkAuth error:', e);
            } finally {
                if (isSubscribed) {
                    setIsCheckingAuth(false);
                    clearTimeout(safetyTimer);
                }
            }
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[LoginPage] Auth event:', event);
            if (session && isSubscribed) {
                router.push('/report');
            }
        });

        return () => {
            isSubscribed = false;
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, [router]);

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            await AuthService.loginWithGoogle();
        } catch (error) {
            console.error(error);
            alert('로그인 중 오류가 발생했습니다.');
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500/80 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-between items-center bg-[#050B14] relative overflow-y-auto">
            {/* Deep Space Background Animation */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050B14] to-[#050B14]"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
                <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8000ms]"></div>

                {/* Subtle Stars/Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            </div>

            {/* Login Card Section */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[420px]"
                >
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                        {/* Inner Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
                        <div className="absolute -top-[100px] -left-[100px] w-[200px] h-[200px] bg-blue-500/20 blur-[80px] group-hover:bg-blue-500/30 transition-all duration-700"></div>

                        {/* Content */}
                        <div className="relative flex flex-col items-center text-center">

                            {/* Logo Wrapper (AURO Luxury Sun Logo) */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/80 via-yellow-400 to-amber-600 p-[1px] shadow-xl shadow-amber-500/20 mb-8"
                            >
                                <div className="w-full h-full rounded-2xl bg-[#0A0F16] flex items-center justify-center relative overflow-hidden">
                                    <MyeongsimSunLogo size={46} />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 to-yellow-500/15 opacity-60 pointer-events-none"></div>
                                </div>
                            </motion.div>

                            {/* Title & Subtitle */}
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-3 tracking-tight">
                                    명심코칭
                                </h1>
                                <p className="text-sm text-gray-400 font-light leading-relaxed mb-10">
                                    타고난 코드를 해석하고<br />
                                    최적의 나를 엔지니어링하세요
                                </p>
                            </motion.div>

                            {/* Google Login Button */}
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="w-full"
                            >
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="group relative w-full flex items-center justify-center gap-3 bg-white text-[#0A0F16] font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-[#0A0F16]" />
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            <span>Google 계정으로 시스템 접속</span>
                                        </>
                                    )}
                                </button>
                            </motion.div>

                            {/* Divider / Footer Text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="mt-8 flex flex-col gap-1 text-center"
                            >
                                <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                                    Secure Access
                                </p>
                                <div className="flex items-center gap-2 justify-center mt-1">
                                    <div className="w-1 h-1 rounded-full bg-green-500/50"></div>
                                    <span className="text-[10px] text-gray-600">Protected by Supabase Auth</span>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Legal Business Footer */}
            <div className="w-full relative z-10 mt-auto">
                <Footer />
            </div>
        </div>
    );
}
