/**
 * [회원탈퇴 버튼 컴포넌트] - WithdrawButton.tsx
 * 
 * [동작 순서]
 * 1. 탈퇴 버튼 클릭 시 2단계 재확인 창(window.confirm)을 통해 사용자 최종 확인
 * 2. 확인 시 POST /api/account/withdraw 서버 API 호출
 * 3. 성공 시 Supabase Auth signOut 및 로컬 스토리지 데이터 정리 후 /login 페이지로 리다이렉트
 * 4. 처리 중일 때는 버튼 비활성화 및 "탈퇴 처리 중..." 상태 표시
 * 5. 오류 발생 시 사용자 알림 메시지 출력
 */

'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { UserX, Loader2 } from 'lucide-react';

interface WithdrawButtonProps {
    className?: string;
    onWithdrawSuccess?: () => void;
}

export default function WithdrawButton({ className = '', onWithdrawSuccess }: WithdrawButtonProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleWithdraw = async () => {
        const confirmResult = window.confirm(
            '정말 탈퇴하시겠습니까?\n사주 분석 결과, 마스터 코칭 기록 및 모든 이용 내역이 영구히 삭제되며 되돌릴 수 없습니다.'
        );

        if (!confirmResult) return;

        try {
            setIsProcessing(true);

            const res = await fetch('/api/account/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || '회원탈퇴 처리에 실패했습니다.');
            }

            // 1. Supabase Client 세션 파기
            await supabase.auth.signOut();

            // 2. 로컬스토리지 명심코칭 캐시 파기
            try {
                localStorage.removeItem('myeongsim_report_store');
                localStorage.removeItem('myeongsim_view_mode');
                sessionStorage.clear();
            } catch (e) {
                console.warn('Storage cleanup warning:', e);
            }

            alert('회원탈퇴 및 모든 데이터 파기가 완료되었습니다.\n그동안 명심코칭을 이용해주셔서 감사합니다.');

            if (onWithdrawSuccess) {
                onWithdrawSuccess();
            } else {
                router.push('/login');
            }

        } catch (error: any) {
            console.error('Withdrawal error:', error);
            alert(error.message || '탈퇴 처리 중 문제가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handleWithdraw}
            disabled={isProcessing}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>탈퇴 처리 중...</span>
                </>
            ) : (
                <>
                    <UserX className="w-3.5 h-3.5" />
                    <span>회원탈퇴</span>
                </>
            )}
        </button>
    );
}
