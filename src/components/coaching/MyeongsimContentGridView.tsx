'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Lock, Shield, Compass, ChevronRight, Gift, Clock, Flame, Award, Heart, CheckCircle2, Layers, X, Briefcase } from 'lucide-react';
import PaybackBanner from './PaybackBanner';
import DailyScanWidget from './DailyScanWidget';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import FounderWelcomeLetterBanner from './FounderWelcomeLetterBanner';

const MultiDimensionalBlueprint = dynamic(() => import('@/components/chat/MultiDimensionalBlueprint'), { ssr: false });

interface MyeongsimContentGridViewProps {
  userProfile?: any;
  onOpenMicroPassModal?: () => void;
  onOpen64KeysModal?: () => void;
  onOpenOhaengModal?: () => void;
  onOpenGeniusModal?: () => void;
  onOpenFullPassModal?: () => void;
  onOpenNtsModal?: () => void;
}

export default function MyeongsimContentGridView({
  userProfile,
  onOpenMicroPassModal,
  onOpen64KeysModal,
  onOpenOhaengModal,
  onOpenGeniusModal,
  onOpenFullPassModal,
  onOpenNtsModal,
}: MyeongsimContentGridViewProps) {
  const userName = userProfile?.userName || '명심가';
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 animate-in fade-in duration-500 text-left">
      
      {/* ==========================================
          0. [Version 2: Emotional Founder Letter] 감성 편지글형 접이식 배너
          ========================================== */}
      <FounderWelcomeLetterBanner userName={userName} />

      {/* ==========================================
          1. [비즈니스 설계] 5단계 웰니스 심층 리포트 & 국세청 업종 매핑 배너 카드
          ========================================== */}
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenNtsModal}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c1830] via-[#101428] to-[#1a1226] border-2 border-emerald-500/50 p-5 sm:p-6 shadow-2xl hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between z-10">
          <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10.5px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>[비즈니스 설계] 5단계 웰니스 심층 리포트</span>
          </span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            🏛️ 국세청 1:1 매핑
          </span>
        </div>

        <div className="my-3 z-10 space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors font-serif">
            국세청 업태·종목 분류 기반 1:1 비즈니스 아키텍처
          </h3>
          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-sans">
            인지 아키타입 진단 ➔ 표준 업종 매핑(724000/741400) ➔ 번아웃 방지 ➔ 원클릭 행정/절세 ➔ 3단계 스케일업 로드맵
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-emerald-300/90 font-mono">
            <span className="bg-slate-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">1. 아키타입</span>
            <span className="bg-slate-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">2. 업종 매핑</span>
            <span className="bg-slate-950/80 border border-rose-500/30 px-2 py-0.5 rounded text-rose-300">3. 번아웃 방지</span>
            <span className="bg-slate-950/80 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-300">4. 실전 행정</span>
            <span className="bg-slate-950/80 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300">5. 스케일업</span>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 1:1 비즈니스 챗봇 어시스턴트 즉시 연동
          </span>
          <span className="text-emerald-300 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            열람하기 <ChevronRight className="w-4 h-4" />
          </span>
        </div>

        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all" />
      </motion.div>

      {/* ==========================================
          2. 24h 실시간 타이머 및 페이백 배너 (Loss Aversion)
          ========================================== */}
      <PaybackBanner onUpgradeClick={onOpenFullPassModal || onOpenMicroPassModal} />

      {/* ==========================================
          3. 10초 자각 체크인 데일리 스캔 위젯
          ========================================== */}
      <DailyScanWidget userProfile={userProfile} />

      {/* ==========================================
          4. 사주아이 스타일 큼직한 비주얼 카드 그리드
          ========================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <h2 className="text-sm font-black text-white tracking-wide">
              명심 핀포인트 큐레이션 라인업
            </h2>
          </div>
          <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
            소액 핀포인트 과금 적용
          </span>
        </div>

        {/* 1등 전면 메인 강조 카드: 나의 다차원 기질 설계도 (Dark / Neural / Meta) */}
        <motion.div
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBlueprintModal(true)}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171c35] via-[#101428] to-[#1d1430] border-2 border-amber-400/50 p-5 sm:p-6 shadow-2xl hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
        >
          {/* Top Badges */}
          <div className="flex justify-between items-start z-10">
            <span className="bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> 다차원 기질 설계도
            </span>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-[11px] px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
              ⚡ 890원 ~ 1,900원 (30% 무료)
            </span>
          </div>

          {/* Visual Content */}
          <div className="my-4 z-10 flex items-center gap-4">
            <div className="text-5xl shrink-0 group-hover:scale-110 transition-transform duration-300">
              📐
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors font-serif">
                나의 기질 설계도 <span className="text-xs font-mono font-normal text-amber-200/80">(Dark · Neural · Meta)</span>
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                상단 30% 무료 맛보기 + 핵심 70% 가우시안 블러 & 핀포인트 락 해제
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-amber-300/90 font-mono">
                <span className="bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded text-rose-300">⚠️ Dark 890원</span>
                <span className="bg-blue-950/60 border border-blue-500/40 px-2 py-0.5 rounded text-blue-300">✨ Neural 990원</span>
                <span className="bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300">👑 Meta 1,900원</span>
              </div>
            </div>
          </div>

          {/* Bottom Payback Coupon Badge */}
          <div className="z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" /> 890원 100% 페이백 쿠폰 지급
            </span>
            <span className="text-amber-300 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              열람하기 <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          {/* Background Glow */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />
        </motion.div>

        {/* 2x2 서브 큐레이션 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: 890원 오행 상생 밸런스 솔루션 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenMicroPassModal || onOpenOhaengModal}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1738] via-[#12122b] to-[#0a0a1a] border border-purple-500/30 p-5 shadow-2xl hover:border-purple-400/60 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div className="flex justify-between items-start z-10">
              <span className="bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-purple-400" /> 오행 밸런스
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                ⚡ 890원
              </span>
            </div>

            <div className="space-y-2 my-3 z-10">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🔮
              </div>
              <h3 className="text-base font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                오늘의 오행 밸런스 & 핀포인트 솔루션
              </h3>
              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                나를 보듬는 최적 오행, 수호 행운 시간, 귀인 방위 1초 만에 락 해제
              </p>
            </div>

            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px]">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> 890원 환급 쿠폰 지급
              </span>
              <span className="text-purple-300 font-extrabold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                열람 <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
          </motion.div>

          {/* Card 2: 990원 사회적 기여 파워베이스 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenGeniusModal || onOpenMicroPassModal}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a233a] via-[#101726] to-[#0a0a1a] border border-blue-500/30 p-5 shadow-2xl hover:border-blue-400/60 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div className="flex justify-between items-start z-10">
              <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-400" /> 조직 영향력
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                ⚡ 990원
              </span>
            </div>

            <div className="space-y-2 my-3 z-10">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🧬
              </div>
              <h3 className="text-base font-black text-white tracking-tight group-hover:text-blue-300 transition-colors">
                사회적 기여 & 파워베이스 디코딩
              </h3>
              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                조직 및 관계 내에서 무의식적으로 발휘하는 내 파워베이스 해독
              </p>
            </div>

            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px]">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> 990원 환급 쿠폰 지급
              </span>
              <span className="text-blue-300 font-extrabold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                열람 <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          </motion.div>

          {/* Card 3: 1,900원 명심 마스터코어 (4대 기질 & 9대 영역) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpen64KeysModal || onOpenMicroPassModal}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b1810] via-[#1a100b] to-[#0a0a1a] border border-amber-500/30 p-5 shadow-2xl hover:border-amber-400/60 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div className="flex justify-between items-start z-10">
              <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" /> 4대 기질 & 9대 영역
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                💎 1,900원
              </span>
            </div>

            <div className="space-y-2 my-3 z-10">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🗺️
              </div>
              <h3 className="text-base font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                명심 마스터코어 정밀 디코딩 서판
              </h3>
              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                타고난 26대 주역 파동 코드 & 9대 인지 센터의 무의식 해독
              </p>
            </div>

            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px]">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> 1,900원 환급 쿠폰 지급
              </span>
              <span className="text-amber-300 font-extrabold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                열람 <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          </motion.div>

          {/* Card 4: 특허출원 3,900원 마스터코어 (최종 업셀) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenFullPassModal || onOpenMicroPassModal}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-amber-900/60 to-indigo-950 border border-amber-500/40 p-5 shadow-2xl hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div className="flex justify-between items-start z-10">
              <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <CrownIcon className="w-3 h-3 text-amber-400" /> 특허출원중 86% 한정특가
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1 font-mono">
                👑 3,900원
              </span>
            </div>

            <div className="space-y-2 my-3 z-10 text-left">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🔮
              </div>
              <h3 className="text-base font-black text-amber-300 tracking-tight group-hover:text-amber-200 transition-colors">
                특허출원중 명심 마스터코어
              </h3>
              <p className="text-[10px] text-amber-100/90 line-clamp-2 leading-relaxed">
                특허출원중 번호: 제 10-2025-0166877 호 (출원인: 이경윤) | 심리 및 생체데이터 기반 스트레스 관리 솔루션
              </p>
            </div>

            <div className="z-10 flex items-center justify-between border-t border-amber-500/20 pt-2.5 text-[10px]">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                📜 특허출원중 공식 인증
              </span>
              <span className="text-amber-300 font-extrabold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                해독하기 <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />
          </motion.div>

        </div>
      </div>

      {/* 팝업 모달: 나의 다차원 기질 설계도 (MultiDimensionalBlueprint) */}
      <AnimatePresence>
        {showBlueprintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl my-8 bg-slate-900 rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden"
            >
              {/* 모달 헤더 닫기 버튼 */}
              <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" /> 명심 핀포인트 큐레이션
                </span>
                <button
                  onClick={() => setShowBlueprintModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 모달 바디: MultiDimensionalBlueprint */}
              <div className="p-2 sm:p-6 max-h-[85vh] overflow-y-auto">
                <MultiDimensionalBlueprint showActionButton={false} />
              </div>
            </motion.div>
          </div>
        )}
        {/* 4. 하단 회사 정보 및 고객센터 푸터 */}
        <div className="pt-8">
          <Footer />
        </div>
      </AnimatePresence>
    </div>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return <span className={className}>👑</span>;
}

