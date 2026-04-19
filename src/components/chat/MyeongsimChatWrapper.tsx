'use client';

/**
 * MyeongsimChatWrapper — 기존 MyeongsimChat을 감싸는 클라이언트 래퍼
 *
 * [역할 분리]
 * - useAuthUser 훅으로 실제 로그인 userId 주입
 * - MyeongsimChat 컴포넌트는 전혀 수정하지 않음
 * - 로딩 중: 스켈레톤 UI 표시
 * - 미인증: 게스트 ID 사용 (기존 동작 유지)
 */

import { useAuthUser } from '@/hooks/useAuthUser';
import MyeongsimChat from '@/components/chat/MyeongsimChat';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function MyeongsimChatWrapper() {
    const { id: userId, isLoading, isAuthenticated } = useAuthUser();

    // ── 로딩 중: 세션 확인 대기
    if (isLoading) {
        return (
            <div className="flex flex-col h-[600px] max-h-[85vh] w-full max-w-2xl bg-[#0d131a]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-48 bg-white/5 rounded" />
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Sparkles className="w-6 h-6 text-primary-olive/50" />
                    </motion.div>
                </div>
            </div>
        );
    }

    // ── 인증 완료: 실제 userId 주입 / 미인증: 게스트 ID
    const effectiveUserId = isAuthenticated && userId
        ? userId
        : `guest-${Math.random().toString(36).slice(2, 9)}`; // 게스트도 세션별 고유 ID

    return (
        <div className="w-full max-w-2xl">
            {/* 인증 상태 배지 (개발 환경에서만 표시) */}
            {process.env.NODE_ENV === 'development' && (
                <div className={`mb-2 px-3 py-1 rounded-full text-[10px] font-mono text-center w-fit mx-auto
                    ${isAuthenticated
                        ? 'bg-green-950/40 text-green-400 border border-green-500/30'
                        : 'bg-yellow-950/40 text-yellow-400 border border-yellow-500/30'
                    }`}>
                    {isAuthenticated ? `✅ 인증됨 · ${userId?.slice(0, 8)}...` : '⚠️ 게스트 모드'}
                </div>
            )}

            {/* 기존 MyeongsimChat — 변경 없음, userId만 교체 */}
            <MyeongsimChat userId={effectiveUserId} />
        </div>
    );
}
