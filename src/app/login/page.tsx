'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthService } from '@/modules/AuthService';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/report');
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
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
            <div className="min-h-screen bg-[#1e262f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#10b748] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e262f] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#10b748]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#10b748]/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo & Title */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#10b748] to-[#0d8f3a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#10b748]/30">
                            <span className="text-4xl">🔮</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-[#e2e8f0] mb-3 tracking-tight"
                    >
                        명심코칭
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 text-sm leading-relaxed"
                    >
                        당신의 운명을 읽고<br />마음을 치유합니다
                    </motion.p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#161d24] border border-[#2c3641] rounded-2xl p-8 shadow-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-2 text-center">시작하기</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        구글 계정으로 간편하게 로그인하세요
                    </p>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-4 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#fbc02d"></path>
                                    <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#e53935"></path>
                                    <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4caf50"></path>
                                    <path d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1565c0"></path>
                                </svg>
                                <span>Google로 계속하기</span>
                            </>
                        )}
                    </button>

                    {/* Privacy Notice */}
                    <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
                        로그인하시면 <span className="text-[#10b748]">개인정보 처리방침</span> 및<br />
                        <span className="text-[#10b748]">서비스 이용약관</span>에 동의하는 것으로 간주됩니다.
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center mt-8"
                >
                    <p className="text-xs text-gray-600">
                        © 2026 명심코칭. All rights reserved.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
