'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, BrainCircuit, Lightbulb, Shield, Zap, Crown, ChevronRight } from 'lucide-react';
import { playSuccessChime, playTechBeep } from '@/utils/sfx';

interface GeniusExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  saju: any;
  indicatorName: string;
  score: number | string;
  locale: string;
}

interface ExplanationData {
  title: string;
  scientific_metaphor: string;
  // 3단계 주파수 연금술
  dark_scan: string;
  neural_sync: string;
  meta_shift: string;
  switch_action: string;
  // 구버전 호환
  deep_explanation?: string;
  tuning_action?: string;
}

type FrequencyPhase = 'dark' | 'neural' | 'meta';

const PHASE_CONFIG = {
  dark: {
    label: '1. SCAN',
    subtitle: '다크코드 자비 수용',
    hz: '0Hz',
    icon: Shield,
    color: 'rose',
    bgGradient: 'from-rose-950/60 to-rose-900/30',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-200',
    accentColor: 'text-rose-400',
    glowColor: 'rgba(225,29,72,0.3)',
    barWidth: '33%',
    barColor: 'bg-rose-500',
  },
  neural: {
    label: '2. SYNC',
    subtitle: '뉴럴코드 역량 재배선',
    hz: '432Hz',
    icon: BrainCircuit,
    color: 'blue',
    bgGradient: 'from-blue-950/60 to-indigo-900/30',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-200',
    accentColor: 'text-blue-400',
    glowColor: 'rgba(59,130,246,0.3)',
    barWidth: '66%',
    barColor: 'bg-blue-500',
  },
  meta: {
    label: '3. SHIFT',
    subtitle: '메타코드 제로포인트 창조',
    hz: '963Hz',
    icon: Crown,
    color: 'amber',
    bgGradient: 'from-amber-950/60 to-yellow-900/30',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-200',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(217,119,6,0.3)',
    barWidth: '100%',
    barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
  },
};

export default function GeniusExplainModal({
  isOpen,
  onClose,
  userName,
  saju,
  indicatorName,
  score,
  locale
}: GeniusExplainModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplanationData | null>(null);
  const [phase, setPhase] = useState<FrequencyPhase>('dark');

  useEffect(() => {
    if (!isOpen) return;
    setPhase('dark'); // 열릴 때마다 1단계부터 시작

    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch('/api/coaching/genius-explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, saju, locale, indicatorName, score }),
        });

        if (!response.ok) {
          throw new Error('명심 AI 코치 해설을 가져오는 데 실패했습니다.');
        }

        const resData = await response.json();
        if (resData.success && resData.data) {
          setData(resData.data);
          playSuccessChime();
        } else {
          throw new Error(resData.error || 'AI 해석 오류');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || '네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, indicatorName, score, locale, userName, saju]);

  if (!isOpen) return null;

  const currentConfig = PHASE_CONFIG[phase];
  const PhaseIcon = currentConfig.icon;

  const getPhaseContent = () => {
    if (!data) return '';
    if (phase === 'dark') return data.dark_scan || data.deep_explanation || '';
    if (phase === 'neural') return data.neural_sync || '';
    return data.meta_shift || '';
  };

  const handleNextPhase = () => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(40);
    }
    if (phase === 'dark') setPhase('neural');
    else if (phase === 'neural') setPhase('meta');
  };

  const isLastPhase = phase === 'meta';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md" onClick={(e) => { if (e.target === e.currentTarget) { onClose(); playTechBeep(); } }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="relative w-full max-w-md bg-[#060A14]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white"
        style={{ boxShadow: `0 0 60px ${data ? currentConfig.glowColor : 'rgba(168,85,247,0.2)'}` }}
      >
        {/* 동적 오라 배경 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data ? currentConfig.bgGradient : 'from-purple-950/40 to-indigo-950/20'} transition-all duration-700 pointer-events-none`} />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-full blur-[60px] pointer-events-none" />

        {/* 닫기 */}
        <button
          onClick={() => { onClose(); playTechBeep(); }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-all z-20 border border-white/5"
        >
          <X size={16} />
        </button>

        <div className="relative z-10 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-ping scale-75" />
                <Loader2 size={36} className="text-purple-400 animate-spin relative" />
              </div>
              <p className="text-sm text-indigo-300 animate-pulse font-bold">
                3단계 주파수 연금술을 준비하는 중...
              </p>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">
                {userName}님의 생년월일 × 기질 코드 연결 중
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">⚠️</span>
              <h3 className="text-sm font-bold text-red-400 mb-1">분석 에러</h3>
              <p className="text-xs text-gray-400 max-w-xs">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-4">

              {/* ── 헤더: 특허 + 타이틀 ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[8px] text-amber-400/80 font-mono font-bold tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    📜 특허출원중 제10-2025-0166877호
                  </span>
                  <span className="text-[8px] text-emerald-400/80 font-mono font-bold tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    🔬 3S Protocol
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white leading-snug">{data.title}</h3>
              </div>

              {/* ── 뇌과학 메타포 ── */}
              <div className="bg-purple-500/10 border border-purple-500/25 rounded-xl p-3 flex gap-2.5">
                <BrainCircuit className="text-purple-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-purple-200 font-bold leading-relaxed break-keep italic">
                  "{data.scientific_metaphor}"
                </p>
              </div>

              {/* ── 주파수 스펙트럼 바 (0Hz → 432Hz → 963Hz) ── */}
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-gray-400 font-mono font-bold tracking-wider">FREQUENCY SPECTRUM</span>
                  <motion.span
                    key={currentConfig.hz}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-mono font-black ${currentConfig.accentColor}`}
                  >
                    {currentConfig.hz}
                  </motion.span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${currentConfig.barColor}`}
                    initial={{ width: '0%' }}
                    animate={{ width: currentConfig.barWidth }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[8px] font-mono text-gray-500">
                  <span className={phase === 'dark' ? 'text-rose-400 font-bold' : ''}>0Hz 비상</span>
                  <span className={phase === 'neural' ? 'text-blue-400 font-bold' : ''}>432Hz 조율</span>
                  <span className={phase === 'meta' ? 'text-amber-400 font-bold' : ''}>963Hz 각성</span>
                </div>
              </div>

              {/* ── 3단계 탭 선택기 ── */}
              <div className="flex gap-1.5">
                {(['dark', 'neural', 'meta'] as FrequencyPhase[]).map((p) => {
                  const cfg = PHASE_CONFIG[p];
                  const isActive = phase === p;
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={p}
                      onClick={() => { setPhase(p); if (typeof window !== 'undefined' && window.navigator?.vibrate) window.navigator.vibrate(30); }}
                      className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-black transition-all duration-300 flex flex-col items-center gap-0.5 border ${
                        isActive
                          ? `${cfg.borderColor} bg-${cfg.color}-900/40 ${cfg.accentColor} shadow-lg`
                          : 'border-white/5 bg-white/[0.02] text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── 현재 단계 콘텐츠 ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-br ${currentConfig.bgGradient} rounded-xl p-4 border ${currentConfig.borderColor} max-h-48 overflow-y-auto no-scrollbar`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <PhaseIcon size={16} className={currentConfig.accentColor} />
                    <div>
                      <h4 className={`text-xs font-black ${currentConfig.accentColor}`}>{currentConfig.label}: {currentConfig.subtitle}</h4>
                      <span className="text-[9px] text-gray-400 font-mono">{currentConfig.hz} 주파수 대역</span>
                    </div>
                  </div>
                  <p className={`text-xs ${currentConfig.textColor} leading-relaxed whitespace-pre-line break-keep font-medium`}>
                    {getPhaseContent()}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* ── 1분 행동 스위치 (메타 단계에서만 표시) ── */}
              {isLastPhase && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex gap-2.5"
                >
                  <Zap className="text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-[11px] font-black text-emerald-400 mb-1">⚡ 1분 3S 행동 스위치 마운트</h4>
                    <p className="text-[11px] text-gray-200 leading-relaxed break-keep font-medium">
                      {data.switch_action || data.tuning_action}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── 하단 액션 버튼 ── */}
              <div className="flex items-center gap-2 pt-1">
                {!isLastPhase ? (
                  /* 다음 단계 버튼 */
                  <button
                    onClick={handleNextPhase}
                    className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r ${
                      phase === 'dark' ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20' : 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/20'
                    } text-white text-xs font-black shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5`}
                  >
                    <span>{phase === 'dark' ? '✨ 뉴럴코드 재배선으로' : '👑 메타코드 각성으로'}</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  /* 최종 단계: 챗봇 연결 및 890원 핀포인트 처방전 결제 전환 브릿지 */
                  <div className="flex-1 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        if (typeof window !== 'undefined') {
                          window.location.href = '/report';
                        }
                      }}
                      className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-[12px] font-extrabold transition-all duration-200 active:scale-95 text-center flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    >
                      <Zap size={14} className="text-emerald-400" /> 오늘의 890원 핀포인트 솔루션 소장하기
                    </button>
                  </div>
                )}
                <button
                  onClick={() => { onClose(); playTechBeep(); }}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all duration-200 active:scale-95 border border-white/10"
                >
                  닫기
                </button>
              </div>

            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
