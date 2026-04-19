'use client';

/**
 * useAuthUser — Supabase 세션에서 현재 로그인 유저의 ID를 안전하게 추출하는 훅
 *
 * [모듈식 설계]
 * - 기존 챗봇 시스템(MyeongsimChat, /api/myeongsim-chat, /api/chat)에 전혀 영향 없음
 * - 미인증 상태에서는 null 반환 → 컴포넌트가 알아서 폴백 처리
 * - 로그인 완료 후 자동으로 실제 userId로 업데이트
 */

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface AuthUser {
    id: string | null;
    email: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export function useAuthUser(): AuthUser {
    const [user, setUser] = useState<AuthUser>({
        id: null,
        email: null,
        isLoading: true,
        isAuthenticated: false,
    });

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1) 현재 세션 즉시 조회
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? null,
                    isLoading: false,
                    isAuthenticated: true,
                });
            } else {
                setUser({ id: null, email: null, isLoading: false, isAuthenticated: false });
            }
        });

        // 2) 세션 변경 구독 (로그인/로그아웃 시 자동 반영)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? null,
                    isLoading: false,
                    isAuthenticated: true,
                });
            } else {
                setUser({ id: null, email: null, isLoading: false, isAuthenticated: false });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return user;
}
