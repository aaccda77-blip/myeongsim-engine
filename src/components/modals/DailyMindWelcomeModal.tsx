'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Brain, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DailyMindWelcomeModalProps {
  onClose?: () => void;
}

export default function DailyMindWelcomeModal({ onClose }: DailyMindWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 하루에 1번만 띄우는 로컬 스토리지 검사
    const todayStr = new Date().toISOString().slice(0, 10);
    const hideDate = localStorage.getItem('myeongsim_daily_welcome_popup_hide_date');

    if (hideDate !== todayStr) {
      // 0.4초 후 감성적으로 팝업 렌더링
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleHideToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem('myeongsim_daily_welcome_popup_hide_date', todayStr);
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-[#090d16] border border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col select-none"
        >
          {/* 오로라 광원 배경 효과 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          </div>

          {/* 상단 특허 및 브랜딩 헤더 */}
          <div className="relative z-10 p-6 pb-4 border-b border-white/10 bg-slate-900/60 backdrop-blur-md flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow">
                  🧠
                </span>
                <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <span>🏛️ 대한민국 특허출원중</span>
                  <span className="font-mono text-amber-200">제 10-2025-0166877 호</span>
                </span>
              </div>
              <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-200 pt-1">
                명심 코칭 뇌신경 시프트 메시지
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                발명 명칭: 심리 및 생체데이터 기반 스트레스 관리 솔루션 (제3세대 CBT/ACT)
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* 본문 감성 캘리그라피 메시지 영역 */}
          <div className="relative z-10 p-6 space-y-5 text-left text-gray-200 leading-relaxed font-sans">
            
            {/* 시선 사로잡는 영감 인트로 카키 박스 */}
            <div className="p-4 bg-gradient-to-br from-slate-900/90 to-purple-950/40 border border-indigo-500/30 rounded-2xl space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles size={15} className="text-amber-400 animate-pulse" />
                <span>당신의 뇌신경 회로가 180도 리셋되는 과학적 순간</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed">
                매일매일 들어와서 읽기만 해도 뇌신경회로가 재구성되어 의식 마인드가 넓어져서 초능력이 생기지는 않지만,
              </p>
            </div>

            {/* 핵심 180도 시프트 감성 메시지 */}
            <div className="space-y-3 px-1">
              <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
                일상은 늘 평범하고 그대로일 수 있지만, <strong className="text-amber-300 font-extrabold underline decoration-amber-500/50 decoration-2 underline-offset-4">일상을 받아들이는 당신의 사고방식은 180도 시프트(Shift)</strong> 됩니다.
              </p>
              
              <p className="text-xs sm:text-sm text-indigo-200 font-normal leading-relaxed">
                세상을 살아갈 <span className="text-white font-bold">용기</span>와 <span className="text-white font-bold">희망</span>, 그리고 스스로 삶을 <span className="text-amber-300 font-bold">창조해 나아갈 수 있는 힘</span>이 생기는 최신 제3세대 심리학(CBT/ACT)을 이용한 과학적 매커니즘입니다.
              </p>

              <div className="pt-2 text-xs sm:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 flex items-center gap-1.5">
                <span>✨</span> 짧게라도 매일매일 들어와 당신의 삶에 따스한 활력을 얻어가시기 바랍니다.
              </div>
            </div>
          </div>

          {/* 하단 CTA 및 '오늘 하루 보지 않기' 결합 푸터 */}
          <div className="relative z-10 p-5 pt-3 border-t border-white/10 bg-slate-950 flex flex-col gap-2.5">
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <Brain size={16} className="text-amber-300" />
              <span>✨ 뇌신경 활력 얻고 명심 코칭 시작하기 ➔</span>
            </button>

            <div className="flex justify-between items-center px-2 pt-1 text-[11px] text-gray-400 font-medium">
              <button
                onClick={handleHideToday}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 size={13} className="text-amber-400" />
                <span>오늘 하루 이 창 보지 않기</span>
              </button>
              <button
                onClick={handleClose}
                className="hover:text-white transition-colors cursor-pointer text-gray-500"
              >
                닫기
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
