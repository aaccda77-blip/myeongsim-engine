'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, RefreshCw, LogOut } from 'lucide-react';
import PaymentCard from '@/components/chat/PaymentCard';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'; // Added for logout
import PhoneAuthModal from './PhoneAuthModal';

export default function PaymentLockOverlay({ onRefresh, userId }: { onRefresh: () => Promise<boolean>, userId?: string }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter(); // Added router

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const isLocked = await onRefresh();
        // Wait a bit for UX
        setTimeout(() => {
            setIsRefreshing(false);
            if (isLocked) {
                alert("아직 승인되지 않았습니다.\n입금 확인까지 최대 10분이 소요될 수 있습니다.\n문제가 지속되면 하단 '관리자와 대화'를 이용해주세요.");
            }
        }, 500);
    };

    // Logout function
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // [NEW] Phone Auth Modal State
    const [showPhoneAuth, setShowPhoneAuth] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'TRIAL' | 'PASS' | 'VIP'>('PASS');

    // Phone Auth Success Handler
    const handleLoginSuccess = async (userId: string, isNewUser: boolean) => {
        setIsRefreshing(true);
        // Force refresh user status
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 1000);
        setShowPhoneAuth(false);
    };

    return (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 overflow-y-auto">

            {/* Lock Icon Animation */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-500/10 shrink-0"
            >
                <Lock className="w-8 h-8 text-red-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2 font-serif">접근이 제한되었습니다</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
                서비스를 이용하시려면<br />
                <span className="text-primary-gold font-bold">이용권 구매</span> 또는 <span className="text-indigo-400 font-bold">관리자 승인</span>이 필요합니다.
            </p>

            {/* Payment Options - Pass handler to open modal */}
            <div className="w-full max-w-sm">
                <PaymentCard
                    onDetailedReport={() => setShowPhoneAuth(true)}
                />
            </div>

            {/* Refresh & Contact Actions */}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-xs pb-10">
                <button
                    onClick={handleRefresh}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/5"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>승인 확인 (새로고침)</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 text-gray-500 hover:text-white transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                </button>
            </div>

            <p className="py-6 text-[10px] text-gray-600">
                입금 후 승인까지 최대 10분이 소요될 수 있습니다.<br />
                문의 사항은 하단 '관리자와 대화'를 이용해주세요.
            </p>

            {/* Phone Auth Modal for Registration */}
            <PhoneAuthModal
                isOpen={showPhoneAuth}
                onClose={() => setShowPhoneAuth(false)}
                onLoginSuccess={handleLoginSuccess}
                selectedTier={selectedTier}
                mode="register" // [NEW] Hide Google Login
                currentUserId={userId} // [NEW] Link current user
            />
        </div>
    );
}
