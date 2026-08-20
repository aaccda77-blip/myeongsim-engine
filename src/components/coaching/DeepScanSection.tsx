'use client';

/**
 * ===============================================================
 * 🔍 DeepScanSection — Myeongsim Deep Scan UI 컴포넌트 v2
 * ===============================================================
 * 카드 요약 → "📖 전체 상세 분석 보기" 버튼 → narrative 展開
 * ClashCard 내 "🔬 심층 해설" 섹션 추가
 * ===============================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import {
  AlertTriangle, Loader2, ShieldAlert, Cpu, Zap,
  Star, ChevronDown, ChevronUp, RefreshCw, Clock,
  BookOpen, Microscope,
} from 'lucide-react';

// ─── 타입 ───────────────────────────────────────────
interface Clash {
  term: string;
  title: string;
  logic: string;
  reality: string;
  deepExplanation?: string;
}
interface DeepScanReport {
  level: 'DANGER' | 'CAUTION' | 'GOOD';
  levelLabel: string;
  levelEmoji: string;
  headline: string;
  intro: string;
  clashes: Clash[];
  narrative?: string;
  shift: string;
  encouragement?: string | null;
  caution?: string | null;
}

// ─── 레벨 별 스타일 테마 ─────────────────────────────
const LEVEL_THEME = {
  DANGER: {
    bg: 'bg-red-950/30',
    border: 'border-red-500/40',
    glow: '0 0 40px rgba(239,68,68,0.15)',
    headerBg: 'bg-red-950/50',
    headerBorder: 'border-red-500/30',
    iconColor: 'text-red-400',
    accent: '#ef4444',
    accentLight: '#fca5a5',
    badgeBg: 'bg-red-900/60',
    badgeBorder: 'border-red-500/50',
    badgeText: 'text-red-300',
    cardBg: 'bg-red-950/20',
    cardBorder: 'border-red-900/40',
    termColor: 'text-red-400',
    pulse: true,
    tag: '⚠️ 위험 경보',
    narrativeBg: 'bg-red-950/15 border-red-900/30',
    narrativeTitle: 'text-red-300',
  },
  CAUTION: {
    bg: 'bg-amber-950/20',
    border: 'border-amber-500/30',
    glow: '0 0 40px rgba(245,158,11,0.10)',
    headerBg: 'bg-amber-950/40',
    headerBorder: 'border-amber-500/25',
    iconColor: 'text-amber-400',
    accent: '#f59e0b',
    accentLight: '#fde68a',
    badgeBg: 'bg-amber-900/50',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    cardBg: 'bg-amber-950/15',
    cardBorder: 'border-amber-900/30',
    termColor: 'text-amber-400',
    pulse: false,
    tag: '🟡 주의 권고',
    narrativeBg: 'bg-amber-950/15 border-amber-900/30',
    narrativeTitle: 'text-amber-300',
  },
  GOOD: {
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-500/30',
    glow: '0 0 40px rgba(16,185,129,0.12)',
    headerBg: 'bg-emerald-950/40',
    headerBorder: 'border-emerald-500/25',
    iconColor: 'text-emerald-400',
    accent: '#10b981',
    accentLight: '#6ee7b7',
    badgeBg: 'bg-emerald-900/50',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    cardBg: 'bg-emerald-950/15',
    cardBorder: 'border-emerald-900/30',
    termColor: 'text-emerald-400',
    pulse: false,
    tag: '✨ 가속 권장',
    narrativeBg: 'bg-emerald-950/15 border-emerald-900/30',
    narrativeTitle: 'text-emerald-300',
  },
};

// ─── 충돌 카드 컴포넌트 ──────────────────────────────
function ClashCard({
  clash, index, accent, termColor, cardBg, cardBorder, level,
}: {
  clash: Clash; index: number; accent: string; termColor: string;
  cardBg: string; cardBorder: string; level: string;
}) {
  const [open, setOpen] = useState(true);
  const [showDeep, setShowDeep] = useState(false);

  const icon = level === 'DANGER' ? '💥' : level === 'CAUTION' ? '⚡' : '✨';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className={`rounded-2xl border overflow-hidden ${cardBg} ${cardBorder}`}
    >
      {/* 카드 헤더 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black"
            style={{ backgroundColor: accent + '25', color: accent }}
          >
            {index + 1}
          </div>
          <div>
            <p className={`text-[10px] font-mono font-bold tracking-widest mb-0.5 ${termColor}`}>
              {clash.term}
            </p>
            <p className="text-[13px] font-bold text-white leading-snug break-keep">
              {icon} {clash.title}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
          : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />}
      </button>

      {/* 카드 본문 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* 로직 */}
              <div
                className="rounded-xl p-3.5"
                style={{ background: accent + '0f', borderLeft: `3px solid ${accent}60` }}
              >
                <p className="text-[9px] font-mono tracking-widest mb-1.5" style={{ color: accent }}>
                  📐 명리 로직
                </p>
                <p className="text-[12px] text-slate-200 leading-relaxed break-keep">
                  {clash.logic}
                </p>
              </div>

              {/* 현실 */}
              <div className="rounded-xl p-3.5 bg-white/[0.04] border border-white/[0.07]">
                <p className="text-[9px] font-mono tracking-widest text-slate-400 mb-1.5">
                  🔎 현실에서의 작동
                </p>
                <p className="text-[12px] text-slate-300 leading-relaxed break-keep">
                  {clash.reality}
                </p>
              </div>

              {/* 심층 해설 — 클릭으로 토글 */}
              {clash.deepExplanation && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowDeep(!showDeep)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all"
                    style={{
                      color: accent,
                      background: accent + '12',
                      border: `1px dashed ${accent}40`,
                    }}
                  >
                    <Microscope className="w-3 h-3" />
                    {showDeep ? '심층 해설 접기' : '🔬 심층 고전 명리 해설 보기'}
                  </button>
                  <AnimatePresence>
                    {showDeep && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="rounded-xl p-3.5"
                          style={{ background: accent + '08', border: `1px solid ${accent}25` }}
                        >
                          <p className="text-[9px] font-mono tracking-widest mb-2" style={{ color: accent }}>
                            📜 고전 명리 심층 해설
                          </p>
                          <p className="text-[12px] text-slate-300 leading-relaxed break-keep whitespace-pre-line">
                            {clash.deepExplanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────
interface Props {
  sajuData: any;
  harmony: any;
  biorhythm?: any;
}

export default function DeepScanSection({ sajuData, harmony, biorhythm }: Props) {
  const { deepScanResult, setDeepScanResult } = useReportStore();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugDetails, setDebugDetails] = useState<string | null>(null);
  const [sentData, setSentData] = useState<string | null>(null);
  const [neuralCode, setNeuralCode] = useState<string | null>(null);
  const [todayUngi, setTodayUngi] = useState<{ yearGanZhi: string; monthGanZhi: string; dayGanZhi: string } | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);




  const [showNarrative, setShowNarrative] = useState(false);

  // 카운트다운 타이머
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const id = setInterval(() => {
      setRateLimitSeconds(s => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [rateLimitSeconds]);

  const report = deepScanResult ? (() => {
    try { return JSON.parse(deepScanResult) as DeepScanReport; } catch { return null; }
  })() : null;

  const theme = report ? LEVEL_THEME[report.level] : null;

   const startDeepScan = async () => {
    if (rateLimitSeconds > 0) return;
    
    // ── 사주 데이터 존재 여부 사전 체크
    if (!sajuData) {
      setError('사주 정보가 입력되지 않았습니다. 만세력 탭에서 생년월일을 입력하고 보고서를 먼저 생성해 주세요.');
      return;
    }

    setIsScanning(true);
    setError(null);
    setDebugDetails(null);
    setSentData(null);
    setNeuralCode(null);
    setShowNarrative(false);

    try {
      const res = await fetch('/api/deep-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sajuData,
          dayMaster: harmony?.userDayMaster || sajuData?.saju?.fourPillars?.day?.gan || sajuData?.dayMaster,
          harmony, // ✅ 십성 데이터 주입
          biorhythm, // ✅ 바이오리듬(생체 에너지) 데이터 주입
          // ✅ 브라우저 로컬 날짜 전송 (서버 UTC 시간대 문제 방지)
          clientDate: (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          })(),
        }),
      });


      const data = await res.json().catch(() => null);

      if (res.status === 429) {
        setRateLimitSeconds(10);
        setError(data?.message || 'AI 사용량 제한 중입니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      if (!res.ok) {
        if (data?.details) {
          const detailsString = typeof data.details === 'object' 
            ? JSON.stringify(data.details, null, 2) 
            : data.details;
          setDebugDetails(detailsString);
        }
        if (data?.sentData) {
          setSentData(typeof data.sentData === 'object' ? JSON.stringify(data.sentData, null, 2) : data.sentData);
        }
        if (data?.neuralCode) {
          setNeuralCode(data.neuralCode);
        }
        throw new Error(data?.error || `서버 오류 (${res.status})`);
      }




      if (data?.success && data?.report) {
        setDeepScanResult(JSON.stringify(data.report));
        // 오늘 운기 정보도 함께 저장
        if (data?.todayUngi) {
          setTodayUngi(data.todayUngi);
        }
      } else {
        throw new Error(data?.error || '보고서 생성 실패');
      }

    } catch (err: any) {
      // 에러 객체에 details가 있다면 그것까지 포함해서 표시
      setError(err.message || '서버 통신 중 오류 발생');
      if (err.details) {
        console.error('AI RAW RESPONSE:', err.details);
      }
    } finally {

      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* ── 대기 화면: 스캔 전 ── */}
      {!report && !isScanning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* 경고 배너 */}
          <div className="flex items-center gap-3 p-3.5 mb-3 bg-red-950/30 border border-red-500/20 rounded-2xl">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            </motion.div>
            <div>
              <p className="text-xs font-bold text-red-300">Myeongsim Deep Scan · 선제 경보 시스템</p>
              <p className="text-[10px] text-red-400/70 mt-0.5 break-keep leading-snug">
                사주 원국 + 세운 + 월운 + 오늘 일진의 4개 톱니바퀴 충돌을 AI가 실시간 연산합니다
              </p>
            </div>
          </div>

          {/* 오늘의 운기 배지 */}
          {(() => {
            const { Solar } = require !== undefined ? { Solar: null } : { Solar: null };
            // 클라이언트 임시 표시용 (서버에서 정확히 계산됨)
            const today = new Date();
            return (
              <div className="flex gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/30 border border-amber-500/20">
                  <span className="text-[9px] text-amber-500/60 uppercase font-black">세운</span>
                  <span className="text-[11px] font-bold text-amber-400">丙午년</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/30 border border-purple-500/20">
                  <span className="text-[9px] text-purple-500/60 uppercase font-black">월운</span>
                  <span className="text-[11px] font-bold text-purple-400">庚辰월</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 animate-pulse">
                  <span className="text-[9px] text-cyan-500/70 uppercase font-black">일진</span>
                  <span className="text-[12px] font-black text-cyan-300">
                    {today.getMonth() === 3 && today.getDate() === 21 ? '乙丑' :
                     today.getMonth() === 3 && today.getDate() === 22 ? '丙寅' :
                     '오늘일진'}
                  </span>
                  <span className="text-[8px] text-cyan-500/50">일</span>
                </div>
              </div>
            );
          })()}


          {/* 스캔 버튼 */}
          <button
            type="button"
            onClick={startDeepScan}
            className="w-full relative flex flex-col items-center justify-center p-7 bg-[#080b10] border border-red-900/40 rounded-2xl overflow-hidden hover:border-red-500/40 hover:bg-red-950/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent pointer-events-none"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="mb-4 opacity-60 pointer-events-none"
            >
              <Cpu className="w-12 h-12 text-red-400" />
            </motion.div>
            <p className="text-white font-black text-[15px] tracking-widest uppercase mb-1 pointer-events-none">
              DEEP SCAN 가동
            </p>
            <p className="text-[11px] text-slate-500 break-keep text-center pointer-events-none">
              오늘 하루 조심하세요! · 시스템 충돌 내역 전면 분석
            </p>
          </button>
        </motion.div>
      )}

      {/* ── 로딩 화면 ── */}
      {isScanning && (
        <div className="flex flex-col items-center justify-center p-10 border border-red-500/20 bg-black/50 rounded-2xl">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
          <p className="text-sm font-mono text-red-400 tracking-widest animate-pulse mb-1">
            SCANNING...
          </p>
          <p className="text-[10px] text-slate-500 text-center break-keep">
            사주 원국과 우주의 시간을 종합 연산 중입니다
          </p>
        </div>
      )}

      {/* ── 에러/레이트 리밋 화면 ── */}
      {error && !isScanning && (
        <div className={`p-5 border rounded-2xl text-center ${
          rateLimitSeconds > 0
            ? 'bg-amber-900/20 border-amber-500/30'
            : 'bg-red-900/20 border-red-500/30'
        }`}>
          {rateLimitSeconds > 0 ? (
            <>
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-amber-300 mb-1">⏳ AI 연산 쿨타임 중</p>
              <p className="text-xs text-amber-200/80 mb-3 break-keep">{error}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-500/30 rounded-xl">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-amber-400"
                />
                <span className="font-mono font-black text-amber-300 text-lg">
                  {rateLimitSeconds}초
                </span>
                <span className="text-amber-400/60 text-[10px]">후 재시도 가능</span>
              </div>
            </>
          ) : (
            <>
              <ShieldAlert className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-xs text-red-300 mb-3 break-keep">{error}</p>
              
              {debugDetails && (
                <div className="mt-4 mb-4 p-4 bg-black border-2 border-red-500/30 rounded-2xl text-left shadow-2xl">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" /> 
                    CRITICAL DEBUG INFO (AI RAW OUTPUT)
                  </p>
                  <p className="text-[11px] text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto">
                    {debugDetails}
                  </p>
                  
                  {neuralCode && (
                    <div className="mt-2 pt-2 border-t border-red-500/10">
                      <p className="text-[9px] font-black text-cyan-500 uppercase mb-1 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5" /> Neural Code (Calculated)
                      </p>
                      <p className="text-[12px] text-cyan-400 font-bold tracking-widest bg-cyan-950/20 p-2 rounded-lg">
                        {neuralCode}
                      </p>
                    </div>
                  )}

                  {sentData && (

                    <div className="mt-4 pt-3 border-t border-red-500/10">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Sent Data (Payload)
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono break-all line-clamp-3 bg-red-950/20 p-2 rounded-lg">
                        {sentData}
                      </p>
                    </div>
                  )}

                  <p className="mt-3 text-[9px] text-slate-500 italic">


                    * 위 텍스트를 복사해서 안티그라비티에게 전달해주세요.
                  </p>
                </div>
              )}


              <button

                type="button"
                onClick={startDeepScan}
                className="text-[11px] px-4 py-1.5 bg-red-950/60 border border-red-500/50 rounded-lg hover:bg-red-900/60 text-red-300"
              >
                다시 시도
              </button>
            </>
          )}
        </div>
      )}

      {/* ── 결과 화면 ── */}
      {report && theme && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border overflow-hidden ${theme.bg} ${theme.border}`}
          style={{ boxShadow: theme.glow }}
        >
          {/* 헤더 배지 */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.headerBg} ${theme.headerBorder}`}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={theme.pulse ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                transition={{ duration: 1.2, repeat: theme.pulse ? Infinity : 0 }}
              >
                <span className="text-xl">{report.levelEmoji}</span>
              </motion.div>
              <div>
                <p className="text-[9px] font-mono tracking-widest text-slate-400">
                  MYEONGSIM DEEP SCAN · 오늘의 에너지 판정
                </p>
                <p className={`text-xs font-black tracking-wide ${theme.badgeText}`}>
                  {theme.tag} — {report.levelLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={startDeepScan}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              title="다시 스캔"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* 헤드라인 */}
            <div>
              <p
                className="text-[17px] font-black text-white break-keep leading-snug mb-2"
                style={{ textShadow: `0 0 20px ${theme.accent}40` }}
              >
                {report.headline}
              </p>
              <p className="text-[12px] text-slate-300 leading-relaxed break-keep">
                {report.intro}
              </p>
            </div>

            {/* 충돌 기제 카드 목록 */}
            {report.clashes && report.clashes.length > 0 && (
              <div className="space-y-3">
                <p
                  className="text-[9px] font-mono tracking-widest font-bold"
                  style={{ color: theme.accent }}
                >
                  {report.level === 'GOOD' ? '✨ 오늘의 길한 기제 분석' : '💥 시스템 충돌 기제 해체'}
                </p>
                {report.clashes.map((clash, i) => (
                  <ClashCard
                    key={i}
                    clash={clash}
                    index={i}
                    accent={theme.accent}
                    termColor={theme.termColor}
                    cardBg={theme.cardBg}
                    cardBorder={theme.cardBorder}
                    level={report.level}
                  />
                ))}
              </div>
            )}

            {/* CAUTION 전용 주의 박스 */}
            {report.level === 'CAUTION' && report.caution && (
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-900/10">
                <p className="text-[9px] font-mono tracking-widest text-amber-400 mb-1.5">
                  ⚡ 오늘 특히 주의할 영역
                </p>
                <p className="text-[12px] text-amber-200 leading-relaxed break-keep">
                  {report.caution}
                </p>
              </div>
            )}

            {/* GOOD 전용 가속 전략 */}
            {report.level === 'GOOD' && report.encouragement && (
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-900/10">
                <p className="text-[9px] font-mono tracking-widest text-emerald-400 mb-1.5 flex items-center gap-1">
                  <Star className="w-3 h-3" /> 오늘의 에너지 가속 전략
                </p>
                <p className="text-[12px] text-emerald-200 leading-relaxed break-keep">
                  {report.encouragement}
                </p>
              </div>
            )}

            {/* Shift 액션 플랜 */}
            <div
              className="p-4 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accent}05)`,
                border: `1px solid ${theme.accent}35`,
              }}
            >
              <p
                className="text-[9px] font-mono tracking-widest font-bold mb-2 flex items-center gap-1.5"
                style={{ color: theme.accent }}
              >
                <Zap className="w-3 h-3" />
                {report.level === 'GOOD' ? '💡 Shift · 오늘의 가속 플랜' : '💡 Shift · 명심 액션 플랜'}
              </p>
              <p className="text-[12px] text-slate-200 leading-relaxed break-keep">
                {report.shift}
              </p>
            </div>

            {/* ── 📖 전체 상세 분석 보기 버튼 ── */}
            {report.narrative && (
              <>
                <button
                  type="button"
                  onClick={() => setShowNarrative(!showNarrative)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-[12px] transition-all duration-200"
                  style={{
                    background: showNarrative
                      ? `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)`
                      : `linear-gradient(135deg, ${theme.accent}12, ${theme.accent}06)`,
                    border: `1px solid ${theme.accent}${showNarrative ? '50' : '30'}`,
                    color: theme.accent,
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  {showNarrative ? '상세 분석 접기' : '📖 소름주의 : 전체 상세 분석 보기'}
                  {showNarrative
                    ? <ChevronUp className="w-3.5 h-3.5" />
                    : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <AnimatePresence>
                  {showNarrative && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`rounded-2xl border p-5 space-y-4 ${theme.narrativeBg}`}
                      >
                        <p
                          className="text-[9px] font-mono tracking-widest font-bold flex items-center gap-1.5"
                          style={{ color: theme.accent }}
                        >
                          <BookOpen className="w-3 h-3" />
                          {report.level === 'DANGER'
                            ? '🔍 Myeongsim Deep Scan · 전체 시스템 충돌 분석 리포트'
                            : report.level === 'CAUTION'
                            ? '🔍 Myeongsim Deep Scan · 균형 에너지 분석 리포트'
                            : '🔍 Myeongsim Deep Scan · 가속 에너지 분석 리포트'}
                        </p>
                        <div className="space-y-3">
                          {report.narrative.split('\n').filter(Boolean).map((paragraph, i) => (
                            <p
                              key={i}
                              className="text-[13px] text-slate-200 leading-[1.9] break-keep"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* 푸터 */}
            <p className="text-center text-[9px] font-mono text-slate-600">
              Myeongsim OS · Deep Scan 분석 완료 · 내일 새벽 00:00 자동 초기화
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
