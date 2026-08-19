'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, CheckCircle2, Building2 } from 'lucide-react';
import { getContentLockStatus, incrementContentViewCount } from '@/lib/contentLockManager';

interface TeaserBlurPaywallProps {
  title: string;
  freePreviewText?: string;
  freePreviewComponent?: React.ReactNode;
  lockedComponent: React.ReactNode;
  onUnlock?: () => void;
  isUnlockedDefault?: boolean;
}

export default function TeaserBlurPaywall({
  title,
  freePreviewText,
  freePreviewComponent,
  lockedComponent,
  onUnlock,
  isUnlockedDefault = false,
}: TeaserBlurPaywallProps) {
  const [lockStatus, setLockStatus] = useState({ isLocked: false, isApproved: false, remainingViews: 3 });
  const [hasRequestedApproval, setHasRequestedApproval] = useState(false);

  useEffect(() => {
    // 모달/리포트가 열릴 때마다 뷰 카운트 1 증가 후 열람 잠금 상태 확인
    const updatedStatus = incrementContentViewCount();
    setLockStatus(updatedStatus);
  }, []);

  const handleRequestApproval = async () => {
    setHasRequestedApproval(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('myeongsim_approval_requested', 'true');
      const userId = localStorage.getItem('myeongsim_user_id') || `guest-${Date.now()}`;
      const userName = localStorage.getItem('myeongsim_user_name') || '수검자';
      fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, tier: 'CHAT_3', amount: 890 })
      }).catch(e => console.error("Payment request error:", e));
    }
  };

  const isActuallyLocked = !isUnlockedDefault && !lockStatus.isApproved && lockStatus.isLocked;

  return (
    <div className="w-full relative space-y-4 text-left font-sans">
      {/* 1. Free Preview Component / Text (Teaser) */}
      {(freePreviewText || freePreviewComponent) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              [무료 요약] {title} 핵심 미리보기
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
              {lockStatus.isApproved ? '관리자 승인 완료' : `열람 가능 ${lockStatus.remainingViews}회 남아있음`}
            </span>
          </div>

          {freePreviewText && (
            <p className="text-xs text-gray-200 leading-relaxed pt-1">
              {freePreviewText}
            </p>
          )}

          {freePreviewComponent}
        </div>
      )}

      {/* 2. Locked / Unlocked Content Area */}
      <div className="relative rounded-2xl overflow-hidden min-h-[180px]">
        {isActuallyLocked ? (
          <>
            {/* Blurred Content Background (마케팅을 활용한 딥 글래스모피즘 블러 효과) */}
            <div className="filter blur-xl opacity-20 select-none pointer-events-none p-5 space-y-4 max-h-[320px] overflow-hidden bg-slate-950/90 rounded-2xl border border-white/5">
              {lockedComponent}
            </div>

            {/* Paywall Lock Overlay Container (무통장 입금 & 관리자 1:1 승인 시스템) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-900/90 rounded-2xl border border-amber-500/50 text-center shadow-[0_0_40px_rgba(245,158,11,0.25)] backdrop-blur-md"
            >
              <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.35)] animate-pulse">
                <Lock size={22} />
              </div>

              <h4 className="text-sm sm:text-base font-black text-amber-300 mb-1 flex items-center gap-1.5">
                🔒 3회 컨텐츠 이용이 완료되었습니다.
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                <strong>관리자 승인이 완료 되면 잠금이 해제되어 3회 추가 이용이 가능합니다.</strong>
              </p>

              {/* Approval Request Button */}
              {!hasRequestedApproval ? (
                <button
                  type="button"
                  onClick={handleRequestApproval}
                  className="w-full max-w-sm py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <CheckCircle2 size={16} />
                  <span>관리자 승인 요청하기</span>
                </button>
              ) : (
                <div className="w-full max-w-sm py-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>관리자 승인 대기 중 (승인 완료 시 3회 추가 이용 가능)</span>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          /* Unlocked Full Component */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>{title} 정밀 핀포인트 해독 열람 중</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">UNLOCKED</span>
            </div>

            {lockedComponent}
          </motion.div>
        )}
      </div>
    </div>
  );
}
