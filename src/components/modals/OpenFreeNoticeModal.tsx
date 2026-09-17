'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, BookOpen, ExternalLink, AlertTriangle, 
  CheckCircle, X, Gift, Heart, Copy, Check, Mail, 
  MessageSquareShare, Globe 
} from 'lucide-react';

export default function OpenFreeNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const BANK_INFO = {
    bank: '토스뱅크',
    account: '1002-6847-4899',
    holder: '마인드플로우랩',
    label: '자율후원',
  };

  const FEEDBACK_EMAIL = 'admin@mindflowlab.co.kr';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const todayStr = new Date().toISOString().split('T')[0];
    const hideDate = localStorage.getItem('myeongsim_hide_open_free_modal');

    // 오늘 하루 보지 않기가 설정되어 있지 않은 경우에만 팝업 표시
    if (hideDate !== todayStr) {
      const timer = setTimeout(() => setIsOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowToday && typeof window !== 'undefined') {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('myeongsim_hide_open_free_modal', todayStr);
    }
    setIsOpen(false);
  };

  const handleCopyAccount = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${BANK_INFO.bank} ${BANK_INFO.account} ${BANK_INFO.holder}`);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    }
  };

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(FEEDBACK_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 cursor-pointer"
        />

        {/* Modal Container: 큼직하고 시원한 max-w-2xl sm:max-w-3xl 와이드 디자인 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-2xl sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-9 shadow-[0_0_80px_rgba(16,185,129,0.3)] text-white text-left z-10 my-auto scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent"
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-28 -left-28 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-28 -right-28 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-96 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer z-20"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-sm">
              <Gift size={15} className="text-emerald-400" />
              GRAND OPENING
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <Sparkles size={15} className="text-amber-400 fill-amber-400" />
              전면 무료 개방
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <Heart size={14} className="text-rose-400 fill-rose-400" />
              연구개발 자율후원
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
            🎉 오픈기념 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">전면 무료 서비스</span> 개방 안내
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
            명심(明心) 솔루션을 찾아주신 여러분을 진심으로 환영합니다!<br className="hidden sm:inline" />
            오픈을 기념하여 <strong>모든 결제 시스템을 전면 해제</strong>하고 누구나 편안하게 체험하실 수 있도록 <strong>100% 무료</strong>로 활짝 열어두었습니다.
          </p>

          {/* Grid Layout for Notices and Sponsoring */}
          <div className="space-y-4 mb-6">
            {/* 1. 자율후원 안내 박스 (강조) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/40 border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white">마인드플로우랩 연구개발 자율후원 안내</h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 text-[11px] font-extrabold">
                      자율후원
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-1">
                    무료로 보시고, 마인드플로우랩 연구개발비용을 자율후원 해주시면 앱 개발 및 고도화에 큰 힘이 됩니다.
                  </p>
                </div>
              </div>

              {/* 후원 계좌 상세 카드 */}
              <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-black/70 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400 font-medium">후원 계좌 (토스뱅크)</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-white flex items-center gap-2 flex-wrap">
                    <span className="text-emerald-400 font-semibold">{BANK_INFO.bank}</span>
                    <span className="tracking-wider text-emerald-200">{BANK_INFO.account}</span>
                    <span className="text-xs text-gray-300 font-normal">({BANK_INFO.holder})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                    copiedAccount
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : 'bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/40 hover:brightness-110 active:scale-95'
                  }`}
                >
                  {copiedAccount ? (
                    <>
                      <Check size={16} />
                      <span>계좌 복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>후원계좌 복사하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. 피드백 및 기능 제안 이메일 박스 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/40 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm sm:text-base">
                <MessageSquareShare size={18} className="text-indigo-400" />
                <span>앱 추가 의견 및 피드백 접수</span>
              </div>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                앱에 추가하고 싶으신 내용이나 피드백을 주시면, 연구개발에 적극 반영하도록 하겠습니다. 진심으로 감사드립니다.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-black/60 border border-indigo-500/30">
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-indigo-200 font-semibold truncate">
                  <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                  <span>{FEEDBACK_EMAIL}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="py-1.5 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedEmail ? '복사됨' : '메일 복사'}</span>
                  </button>
                  <a
                    href={`mailto:${FEEDBACK_EMAIL}?subject=[명심앱 피드백 및 기능제안]`}
                    className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>이메일 보내기</span>
                    <ExternalLink size={13} />
                  </a>
                  <a
                    href="https://lab.mindflowlab.co.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe size={13} />
                    <span>홈페이지</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. 이용 시 안내사항 (일부 서비스 제한 가능성) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed space-y-2">
              <div className="font-bold flex items-center gap-2 text-amber-300 text-sm sm:text-base">
                <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
                <span>무료 기간 서비스 이용 안내</span>
              </div>
              <p className="text-gray-100 text-xs sm:text-sm leading-relaxed break-keep font-medium">
                오픈출시기념 전컨텐츠무료이나 일부컨텐츠 api비용처리때문에 일부작동이 안될수 있습니다. 이점 감안하시어 컨텐츠 이용부탁드립니다. 감사합니다.
              </p>
            </div>

            {/* 4. YES24 공식 도서 링크 배너 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 flex-shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">도서 《제로포인트》로 더 깊은 통찰 만나보기</h4>
                    <p className="text-[11px] sm:text-xs text-indigo-200/80">생년월일 사주와 뇌과학 심리코칭의 원리 수록</p>
                  </div>
                </div>

                <a
                  href="https://www.yes24.com/Product/Goods/195946431"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 flex-shrink-0"
                >
                  <span>YES24 공식 도서 바로가기</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={20} />
              <span>확인하고 무료로 시작하기</span>
            </button>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 px-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none hover:text-gray-300">
                <input
                  type="checkbox"
                  checked={dontShowToday}
                  onChange={(e) => setDontShowToday(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-0 focus:outline-none cursor-pointer bg-slate-900"
                />
                <span>오늘 하루 보지 않기</span>
              </label>

              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-300 underline underline-offset-2 cursor-pointer text-xs sm:text-sm"
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
