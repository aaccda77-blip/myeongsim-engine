'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, ArrowRight } from 'lucide-react';

interface PaybackBannerProps {
  expiresAt?: string; // ISO String (예: '2026-07-22T10:00:00Z')
  onUpgradeClick?: () => void;
}

export default function PaybackBanner({ expiresAt, onUpgradeClick }: PaybackBannerProps) {
  // Default to 24 hours from now if no expiresAt provided
  const [targetTime] = useState(() => {
    return expiresAt ? new Date(expiresAt).getTime() : new Date().getTime() + 24 * 60 * 60 * 1000;
  });

  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: '23',
    minutes: '59',
    seconds: '59',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-white relative overflow-hidden my-3 text-left"
    >
      {/* 은은한 금빛 글로우 효과 */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div>
          {/* 배지 */}
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/40 mb-1.5">
            <Gift size={12} className="text-amber-400" />
            <span>890원 100% 페이백 쿠폰 적용 중</span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-slate-100">
            특허출원중 기념 <span className="text-amber-400">890원 핀포인트 처방전</span> 혜택 적용 중!
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            생년월일 사주 오행 연동 1:1 심층 AI 코칭 (<span className="line-through text-gray-500">19,000원</span> → <strong className="text-amber-300 font-black">890원</strong>)
          </p>
        </div>

        {/* 카운트다운 타이머 & 버튼 */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
          {/* 타이머 */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Clock size={12} className="text-slate-500" />
            <span className="text-[10px] text-slate-400">한정시간</span>
            <span className="font-mono font-bold text-amber-400 ml-1 text-xs">
              {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
            </span>
          </div>

          {/* 처방 버튼 */}
          <button
            onClick={() => onUpgradeClick && onUpgradeClick()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>890원 처방받기 ➔</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
