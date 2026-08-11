'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TeaserBlurPaywallProps {
  title: string;
  price?: number; // e.g. 890, 990, 1900
  originalPrice?: number; // e.g. 9900
  freePreviewText?: string;
  freePreviewComponent?: React.ReactNode;
  lockedComponent: React.ReactNode;
  onUnlock?: () => void;
  isUnlockedDefault?: boolean;
}

export default function TeaserBlurPaywall({
  title,
  price = 890, originalPrice = 9900,
  freePreviewText,
  freePreviewComponent,
  lockedComponent,
  onUnlock,
  isUnlockedDefault = false,
}: TeaserBlurPaywallProps) {
  const [isUnlocked, setIsUnlocked] = useState(isUnlockedDefault);

  const handleUnlockClick = () => {
    if (onUnlock) {
      onUnlock();
    } else {
      // Simulate micro-paywall unlock
      setIsUnlocked(true);
    }
  };

  return (
    <div className="w-full relative space-y-4 text-left font-sans">
      {/* 1. Free Preview Component / Text (Teaser) */}
      {(freePreviewText || freePreviewComponent) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              [무료 공개] {title} 핵심 자각 요약
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              0원 즉시 열람
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
      <div className="relative rounded-2xl overflow-hidden min-h-[160px]">
        {!isUnlocked ? (
          <>
            {/* Blurred Content Background */}
            <div className="filter blur-md opacity-30 select-none pointer-events-none p-4 space-y-4 max-h-[280px] overflow-hidden bg-black/40 rounded-2xl border border-white/5">
              {lockedComponent}
            </div>

            {/* Paywall Lock Overlay Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-5 bg-gradient-to-t from-[#070A12] via-[#0A0E1A]/95 to-transparent rounded-2xl border border-amber-500/40 text-center shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-2.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                <Lock size={20} />
              </div>

              <h4 className="text-sm sm:text-base font-black text-white mb-1">
                🔒 {title} 정밀 해독 열람
              </h4>
              <p className="text-xs text-gray-300 max-w-xs mb-3 leading-relaxed">
                나의 본질 무의식 코드 70% 딥 해독 및 3단계 메타코드(제로포인트) 각성 솔루션이 잠겨 있습니다.
              </p>

              {/* Price Display */}
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-xs text-gray-400 line-through font-mono">정가 {originalPrice.toLocaleString()}원</span>
                <span className="text-amber-400 font-extrabold text-xs">
                  [{Math.round((1 - price / originalPrice) * 100)}% OFF]
                </span>
                <span className="text-2xl font-black font-mono text-white">{price.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-300">원</span>
              </div>

              {/* CTA Unlock Button */}
              <button
                onClick={handleUnlockClick}
                className="w-full max-w-xs py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{price.toLocaleString()}원에 1초 만에 전체 해독 열람하기</span>
                <ArrowRight size={15} />
              </button>

              <div className="mt-2 text-[10px] text-amber-300/80 flex items-center gap-1">
                <Zap size={11} className="fill-amber-300 text-amber-300" />
                <span>오늘 결제 시 890원 3회 이용권 할인 쿠폰 즉시 발급</span>
              </div>
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
