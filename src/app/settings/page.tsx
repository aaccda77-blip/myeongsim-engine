/**
 * [설정 및 계정 관리 페이지] - /settings
 * 
 * 기능:
 * - 로그인된 사용자 프로필 정보 조회
 * - 하단 "위험 구역(Danger Zone)"에 회원탈퇴(WithdrawButton) 배치
 * - 비로그인 유저 진입 시 /login으로 안전하게 구동 리다이렉트
 */

'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Shield, User, LogOut, ArrowLeft, AlertTriangle } from 'lucide-react';
import WithdrawButton from '@/components/auth/WithdrawButton';
import Footer from '@/components/Footer';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session || !session.user) {
                    router.push('/login');
                    return;
                }
                setUser(session.user);
            } catch (error) {
                console.error('Settings user fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#070C16] flex justify-center items-center text-gray-400 text-sm">
                설정 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070C16] text-gray-200 flex flex-col justify-between">
            {/* Header */}
            <div className="w-full max-w-md mx-auto px-5 pt-8 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-base font-bold tracking-widest text-amber-300">SETTINGS</h1>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                {/* Profile Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl space-y-4 mb-6 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg border border-white/20 shadow-inner">
                            {user?.email?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-100">{user?.email || '회원 사용자'}</span>
                            <span className="text-[11px] text-gray-500 font-mono">ID: {user?.id?.substring(0, 16)}...</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                        <span className="text-gray-400">계정 연동</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> 구글 보안 인증됨
                        </span>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-3 mb-10">
                    <button
                        onClick={handleLogout}
                        className="w-full p-4 rounded-2xl bg-white/[0.03] hover:bg-white/5 border border-white/5 flex items-center justify-between text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-4 h-4 text-gray-400" />
                            <span>로그아웃</span>
                        </div>
                        <span className="text-gray-500">→</span>
                    </button>
                </div>

                {/* Danger Zone (위험 구역) */}
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3 shadow-2xl mb-12">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>위험 구역 (Danger Zone)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                        계정을 탈퇴하면 저장된 사주 분석 리포트, 코칭 대화 내역 및 이용 권한이 영구 파기됩니다.
                    </p>
                    <div className="pt-1 flex justify-end">
                        <WithdrawButton />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
