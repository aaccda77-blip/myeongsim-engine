'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ChevronLeft, ChevronRight, HelpCircle, Sparkles, BookOpen, Layers, Info, Lock, ArrowRight, Zap } from 'lucide-react';
import { playTechBeep, playSuccessChime, playScanPulse } from '@/utils/sfx';
import { useLanguage } from '@/contexts/LanguageContext';
import GeniusExplainModal from './GeniusExplainModal';

interface GeniusFullReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

// 십자 크롭 마크 데코레이션 (PDF 인쇄물 정밀 가이드 재현)
const CropMarks = () => (
  <>
    {/* 좌상 */}
    <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none opacity-30">
      <div className="absolute top-2.5 left-0 w-5 h-[1px] bg-indigo-400" />
      <div className="absolute top-0 left-2.5 w-[1px] h-5 bg-indigo-400" />
    </div>
    {/* 우상 */}
    <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none opacity-30">
      <div className="absolute top-2.5 right-0 w-5 h-[1px] bg-indigo-400" />
      <div className="absolute top-0 right-2.5 w-[1px] h-5 bg-indigo-400" />
    </div>
    {/* 좌하 */}
    <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none opacity-30">
      <div className="absolute bottom-2.5 left-0 w-5 h-[1px] bg-indigo-400" />
      <div className="absolute bottom-0 left-2.5 w-[1px] h-5 bg-indigo-400" />
    </div>
    {/* 우하 */}
    <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none opacity-30">
      <div className="absolute bottom-2.5 right-0 w-5 h-[1px] bg-indigo-400" />
      <div className="absolute bottom-0 right-2.5 w-[1px] h-5 bg-indigo-400" />
    </div>
  </>
);

// 계측용 정밀 자 (Gauge Ruler Scale)
const GaugeRuler = () => (
  <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10 text-[6px] font-mono text-gray-400 select-none">
    <span>|</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
    <span>|</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
    <span>|</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
    <span>|</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
    <span>|</span>
  </div>
);

// 양방향 대칭형 눈금자
const BiDirectionalRuler = () => (
  <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20 text-[6px] font-mono text-gray-400 select-none px-1">
    <span>-100</span>
    <span>.</span>
    <span>-50</span>
    <span>.</span>
    <span>0</span>
    <span>.</span>
    <span>50</span>
    <span>.</span>
    <span>100</span>
  </div>
);

export default function GeniusFullReportModal({ isOpen, onClose, userProfile }: GeniusFullReportModalProps) {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // AI 설명 팝업용 State
  const [selectedIndicator, setSelectedIndicator] = useState<{ name: string; score: number | string } | null>(null);

  // 블러 마케팅 페이월 (Page 1은 무료 공개, Page 2~8은 890원 잠금)
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const isPageLocked = currentPage >= 2 && !isPaid;

  // 블러 잠금 마케팅 오버레이 렌더러
  const renderBlurPaywall = (children: React.ReactNode) => {
    if (!isPageLocked) return children;
    return (
      <div className="relative">
        {/* 블러 처리된 컨텐츠 (티저 미리보기) */}
        <div className="filter blur-[6px] opacity-40 select-none pointer-events-none max-h-[60vh] overflow-hidden">
          {children}
        </div>
        {/* 프리미엄 잠금 마케팅 오버레이 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-5 bg-gradient-to-t from-[#03050a] via-[#03050a]/95 to-[#03050a]/70 rounded-2xl text-center"
        >
          <div className="w-14 h-14 rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse">
            <Lock size={24} />
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mb-1.5">
            🔒 나의 정밀 분석 리포트 전체 해독
          </h4>
          <p className="text-[11px] sm:text-xs text-gray-300 max-w-sm mb-1 leading-relaxed">
            생년월일 기반 8차원 주파수 정밀 분석 결과를<br />
            <span className="text-amber-300 font-bold">단 890원</span>에 전 페이지 즉시 열람하실 수 있습니다.
          </p>
          <p className="text-[10px] text-gray-500 mb-4">Page {currentPage} ~ {8} / 총 40페이지 분량 잠금 해제</p>

          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-xs text-gray-400 line-through font-mono">정가 890원 (3회 이용권)</span>
            <span className="text-amber-400 font-extrabold text-xs">[91% OFF]</span>
            <span className="text-3xl font-black font-mono text-white">890</span>
            <span className="text-sm font-bold text-gray-300">원</span>
          </div>

          <button
            onClick={() => { setIsPaid(true); playSuccessChime(); }}
            className="w-full max-w-xs py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>890원에 전체 해독 열람하기</span>
            <ArrowRight size={16} />
          </button>

          <div className="mt-3 text-[10px] text-amber-300/70 flex items-center gap-1">
            <Zap size={11} className="fill-amber-300 text-amber-300" />
            <span>특허출원중 제 10-2025-0166877 호 · 생년월일 연동 정밀 분석</span>
          </div>
        </motion.div>
      </div>
    );
  };

  // 로딩바 애니메이션
  useEffect(() => {
    if (loading && isOpen) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [loading, isOpen]);

  // 정량 분석 데이터 페치
  useEffect(() => {
    if (!isOpen) return;

    const fetchFullData = async () => {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);
      playScanPulse();

      try {
        console.log('[GeniusFullReportModal] Payload userProfile:', JSON.stringify(userProfile));
        const response = await fetch('/api/coaching/genius-full', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userProfile?.id,
            birthDate: userProfile?.birthDate || userProfile?.birthDateString,
            birthTime: userProfile?.birthTime,
            calendarType: userProfile?.meta?.calendarType || userProfile?.calendarType || 'solar',
            gender: userProfile?.meta?.gender || userProfile?.gender || 'male',
            userName: userProfile?.userName || '명심가'
          }),
        });

        if (!response.ok) {
          throw new Error('정량 기질 지표 분석 중 에러가 발생했습니다.');
        }

        const resData = await response.json();
        if (resData.success && resData.geniusFullData) {
          setFullData(resData.geniusFullData);
          playSuccessChime();
        } else {
          throw new Error(resData.error || '분석 에러');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || '네트워크 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const totalPages = 8;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      playTechBeep();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      playTechBeep();
    }
  };

  const handleGraphElementClick = (name: string, score: number | string) => {
    setSelectedIndicator({ name, score });
    playTechBeep();
  };

  // SVG 도넛 차트 렌더러 (반지름 r=50 기준, 둘레=314.16)
  // 3중 동심 방사 트랙 게이지 렌더러 (Apple Fitness Ring 처럼 3대 역량 강도 시각화)
  const renderRadialTrackChart = (segments: { value: number; color: string; label: string }[]) => {
    const radii = [48, 36, 24];
    
    return (
      <svg width="130" height="130" viewBox="0 0 120 120" className="drop-shadow-[0_0_12px_rgba(99,102,241,0.2)]">
        <defs>
          <filter id="neon-glow-radial" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2.0" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {segments.map((seg, idx) => {
          const r = radii[idx] || 24;
          const circumference = 2 * Math.PI * r;
          const strokeLength = (seg.value / 100) * circumference;
          
          return (
            <g key={idx} className="origin-center -rotate-90">
              {/* 트랙 배경 */}
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#090b16"
                strokeWidth="7"
              />
              {/* 실제 채워지는 링 게이지 */}
              <motion.circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke={seg.color}
                strokeWidth="7"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeLinecap="round"
                filter="url(#neon-glow-radial)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.0, delay: idx * 0.15, ease: 'easeOut' }}
                className="cursor-pointer hover:stroke-[9px] transition-all duration-200"
                onClick={() => handleGraphElementClick(seg.label, `${seg.value}%`)}
              />
            </g>
          );
        })}
        <text cx="60" cy="60" x="60" y="63" textAnchor="middle" fill="rgba(255,255,255,0.4)" className="text-[7px] font-mono font-bold tracking-widest uppercase">
          CORE
        </text>
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-1 md:p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative w-full max-w-4xl bg-[#03050a]/98 border-2 border-indigo-500/20 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.25)] flex flex-col h-[98vh] md:h-[88vh] text-white"
      >
        {/* 정밀 기술 설계 백그라운드 그리드 (PDF 학술 보고서 스타일) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.012)_1px,transparent_1px)] bg-[size:12px_12px] md:bg-[size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_4px,transparent_4px),linear-gradient(90deg,rgba(255,255,255,0.002)_4px,transparent_4px)] bg-[size:60px_60px] md:bg-[size:80px_80px] pointer-events-none" />
        <CropMarks />

        {/* 상단 학술 헤더 메타선 */}
        <div className="w-full h-6 md:h-8 px-4 md:px-6 border-b border-white/5 flex items-center justify-between text-[7px] md:text-[8px] font-mono text-gray-500 tracking-widest relative z-10 pointer-events-none">
          <span>CLASSIFICATION: CONFIDENTIAL // PERSONAL PROFILE</span>
          <span className="text-indigo-500/30">MYEONGSIM COGNITIVE BLUEPRINT v3.0</span>
          <span>SYSTEM TIME: 2026.06 // SECURE LINK</span>
        </div>

        {/* 헤더 */}
        <header className="flex items-center justify-between px-4 py-2 md:px-6 md:py-4 border-b border-white/10 bg-[#060812]/90 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-3xl p-1.5 md:p-2 bg-indigo-950/60 border border-indigo-500/30 rounded-xl md:rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">🧬</span>
            <div>
              <h2 className="text-xs md:text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200">
                명심 천부성정 심리분석 보고서
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-0.5">
                <p className="text-[7px] md:text-[9px] text-indigo-400 font-bold font-mono tracking-widest uppercase flex items-center gap-1">
                  <span>EASTERN MYEONGRI & WESTERN NEUROSCIENCE INTEGRATION</span>
                  <span className="text-white/20">|</span>
                  <span className="text-pink-400 font-black">PAGE {currentPage} / {totalPages}</span>
                </p>
                {fullData?.gongWang && fullData.gongWang.length > 0 && (
                  <span className="text-[7px] md:text-[8px] bg-rose-500/10 border border-rose-500/30 text-rose-300 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    공망: {fullData.gongWang.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-ping scale-75"></div>
              <Loader2 size={40} className="text-indigo-400 animate-spin relative" />
            </div>
            <h3 className="text-sm font-black tracking-wider text-indigo-200 mb-2 uppercase">Synthesizing Myeongsim Matrix...</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mb-6 break-keep">
              오행의 순환 구조와 십신 역학 및 지장간에 투출된 기운을 융합하여 8개 영역의 전문 도표 리포트를 생성하는 중입니다.
            </p>
            <div className="w-72 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-indigo-400 font-mono mt-2">{loadingProgress}% CALIBRATING</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <span className="text-3xl mb-3">🚨</span>
            <h3 className="text-sm font-bold text-red-200 mb-2">기운 데이터 로드 오류</h3>
            <p className="text-xs text-red-400/80 max-w-sm mx-auto mb-6 break-keep">{error}</p>
            <button onClick={onClose} className="py-2.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all">창 닫기</button>
          </div>
        ) : (
          <>
            {/* 상단 팁 안내 */}
            <div className="bg-indigo-950/20 px-4 py-1.5 md:px-6 md:py-2 border-b border-white/5 text-[7px] md:text-[9px] text-indigo-300 font-bold flex items-center justify-center gap-1 relative z-10 text-center">
              <Info size={11} className="text-indigo-400 flex-shrink-0" />
              <span>[PDF 도표형 보고서 모드] 도표의 모든 행과 차트 요소를 클릭하시면 명심 AI 코치의 친절하고 상세한 감동 해설 카드가 팝업됩니다.</span>
            </div>

            {/* 페이지별 동적 렌더링 컨테이너 */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 relative z-10 scrollbar-thin select-text bg-[#03050a]/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, scale: 0.99, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.99, x: -8 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  className="h-full"
                >
                  {/* ==========================================
                      Page 1: 명심 에너지 포스필드 (3중 방사형 동심원 궤도 성좌도 탑재)
                      ========================================== */}
                  {currentPage === 1 && fullData?.forceField && (
                    <div className="space-y-3 flex flex-col h-full max-w-2xl mx-auto">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 1 / Myeongsim Core Energy Field</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">명심 에너지 포스필드 (기운의 지형도)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">자아(Core Ego)를 축으로 배치된 8대 명심 영역의 상생 상극 흐름도</p>
                      </div>

                      {/* 인터랙티브 SVG 토폴로지 맵 */}
                      <div className="flex-1 min-h-[250px] md:min-h-[340px] flex items-center justify-center bg-[#05070f] border border-white/10 rounded-2xl md:rounded-3xl relative overflow-hidden p-1 md:p-2 shadow-2xl">
                        <div className="w-full max-w-[260px] md:max-w-[340px] aspect-square relative">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                            <defs>
                              <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                <feComponentTransfer in="blur" result="glow">
                                  <feFuncA type="linear" slope="1.5" />
                                </feComponentTransfer>
                                <feMerge>
                                  <feMergeNode in="glow" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>

                            {/* 동심원 가이드 (50%, 75%, 100% 궤도) */}
                            <circle cx="200" cy="200" r="55" fill="none" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" strokeDasharray="3,3" />
                            <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" strokeDasharray="3,3" />
                            <circle cx="200" cy="200" r="145" fill="none" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" strokeDasharray="3,3" />

                            {/* 수치 비례 동적 8각 거미줄 방사형 궤도 */}
                            {(() => {
                              const nodes = [
                                { key: 'willpower', label: '주체 영역', sub: '의지', angle: -90, color: '#f87171' },
                                { key: 'lifeforce', label: '식상 영역', sub: '창조표현', angle: -45, color: '#fb923c' },
                                { key: 'drive', label: '관성 영역', sub: '규율구조', angle: 0, color: '#facc15' },
                                { key: 'intuition', label: '통찰 영역', sub: '수용성', angle: 45, color: '#4ade80' },
                                { key: 'orientation', label: '현실 영역', sub: '구조화', angle: 90, color: '#2dd4bf' },
                                { key: 'inspiration', label: '영감 영역', sub: '정신성', angle: 135, color: '#60a5fa' },
                                { key: 'mental', label: '논리 영역', sub: '사유', angle: 180, color: '#a78bfa' },
                                { key: 'concepts', label: '기획 영역', sub: '개념화', angle: 225, color: '#f472b6' },
                              ];
                              const maxVal = Math.max(...nodes.map(n => fullData.forceField[n.key] || 50));
                              const calculated = nodes.map(n => {
                                const val = fullData.forceField[n.key] || 50;
                                const r = 50 + (val / 100) * 95;
                                const rad = (n.angle * Math.PI) / 180;
                                return { ...n, val, cx: 200 + r * Math.cos(rad), cy: 200 + r * Math.sin(rad), isTop: val === maxVal };
                              });
                              const polyPts = calculated.map(n => `${n.cx},${n.cy}`).join(' ');
                              return (
                                <>
                                  <polygon points={polyPts} fill="rgba(249,115,22,0.12)" stroke="#f97316" strokeWidth="2" filter="url(#glow-orange)" />
                                  {calculated.map(nd => (
                                    <line key={`r-${nd.key}`} x1="200" y1="200" x2={nd.cx} y2={nd.cy} stroke={nd.color} strokeWidth={nd.isTop ? "2" : "1"} strokeDasharray={nd.isTop ? "none" : "3,3"} opacity={nd.isTop ? 0.85 : 0.35} />
                                  ))}
                                  {calculated.map(nd => {
                                    const sz = 11 + (nd.val / 100) * 8;
                                    return (
                                      <g key={nd.key} className="cursor-pointer group" onClick={() => handleGraphElementClick(`${nd.label} (${nd.sub})`, `${nd.val}%`)}>
                                        {nd.isTop && <circle cx={nd.cx} cy={nd.cy} r={sz + 8} fill="none" stroke="#facc15" strokeWidth="1.5" className="animate-ping opacity-50" />}
                                        <circle cx={nd.cx} cy={nd.cy} r={sz + 4} fill="transparent" className="group-hover:fill-white/10 transition-colors" />
                                        <circle cx={nd.cx} cy={nd.cy} r={sz} fill={nd.color} opacity={nd.isTop ? "1" : "0.8"} className="group-hover:scale-110 transition-all duration-300" />
                                        {nd.isTop && <text x={nd.cx} y={nd.cy - sz - 4} textAnchor="middle" fill="#FDE047" className="text-[10px] font-black select-none pointer-events-none">{'👑 1위'}</text>}
                                        <text x={nd.cx} y={nd.cy + sz + 11} textAnchor="middle" fill={nd.isTop ? "#FDE047" : "rgba(255,255,255,0.75)"} className="text-[7.5px] md:text-[9px] font-black pointer-events-none">{nd.label}</text>
                                        <text x={nd.cx} y={nd.cy + 3} textAnchor="middle" fill="#000" className="text-[7px] md:text-[8.5px] font-mono font-black pointer-events-none">{nd.val}%</text>
                                      </g>
                                    );
                                  })}
                                </>
                              );
                            })()}

                            {/* 중앙 ME 자아 노드 */}
                            <g
                              className="cursor-pointer group"
                              onClick={() => handleGraphElementClick('자아 영역 (Core Ego)', `${fullData.forceField.me}%`)}
                            >
                              <circle cx="200" cy="200" r="26" fill="rgba(99,102,241,0.2)" stroke="#818cf8" strokeWidth="2" filter="url(#glow-orange)" />
                              <circle cx="200" cy="200" r="18" fill="#818cf8" />
                              <text x="200" y="203" textAnchor="middle" fill="#fff" className="text-[9px] font-black tracking-widest uppercase">
                                EGO
                              </text>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      Page 2: 타고난 명심 알고리즘 (5대 천부 성정)
                      ========================================== */}
                  {currentPage === 2 && fullData?.specificTalents && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 2 / Inherited Cognitive Matrix</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">타고난 명심 알고리즘 (천부적 성정)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">지장간 가중치를 결합하여 두뇌 인지 시스템에서 작용하는 5대 핵심 행동 역량 분석</p>
                      </div>

                      {/* 1위 판정 및 도표 렌더러 */}
                      {(() => {
                        const items = [
                          { key: 'action', label: '식상 몰입 실행력', subTag: '🚀 아이디어 스피드 실행', desc: '식신/상관의 창조적 몰입 및 추진력', badge: '식상 기운 기준', color: 'from-emerald-500 to-teal-500', summary: '어떤 아이디어든 망설임 없이 즉시 현실로 직조해 내는 스피드 실행 엔진' },
                          { key: 'courage', label: '재관 변혁 돌파력', subTag: '⚡ 위기 파괴 & 한계 정면 돌파', desc: '편재/편관의 리스크 극복 및 돌파력', badge: '편재/편관 작용', color: 'from-rose-500 to-orange-500', summary: '어떤 난관이 와도 판을 뒤엎고 뚫고 나가는 강렬한 정면 돌파형 야성 엔진' },
                          { key: 'leadership', label: '관성 통합 제어력', subTag: '🏛️ 조직 통률 & 시스템 지율', desc: '관성/비겁의 조직 지시 및 조율력', badge: '관성/비겁 기반', color: 'from-indigo-500 to-purple-500', summary: '조직과 자신을 깊이 있게 통율하고 질서를 다잡는 시스템 구축 엔진' },
                          { key: 'structuring', label: '재성 현실 조직화', subTag: '📊 현실 자원 계산 & 구조화', desc: '재성의 논리적 분석 및 자원 조율', badge: '재성 오행 제어', color: 'from-amber-500 to-yellow-500', summary: '자금과 자원을 명확히 정밀 계산하고 구체적 구조로 엮어내는 현실 전략 엔진' },
                          { key: 'autonomy', label: '비겁 주도 자율력', subTag: '🛡️ 독립적 마이웨이', desc: '비겁의 주도적 몰입 및 자율성', badge: '비겁 자율 모드', color: 'from-cyan-500 to-blue-500', summary: '타인의 시선에 흔들리지 않고 고유의 마이웨이를 지키는 독립 주체 엔진' }
                        ];

                        const maxScore = Math.max(...items.map(i => fullData.specificTalents[i.key] || 0));
                        const topItem = items.find(i => (fullData.specificTalents[i.key] || 0) === maxScore) || items[0];
                        const userNameStr = userProfile?.userName || '명심가';

                        return (
                          <>
                            {/* 상단 1줄 천부 엔진 자각 인사이트 카드 */}
                            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl md:rounded-2xl p-3 md:p-3.5 text-center relative overflow-hidden shadow-lg">
                              <p className="text-[10px] md:text-xs text-amber-200 font-extrabold leading-relaxed break-keep">
                                💡 <span className="text-white underline decoration-amber-400 underline-offset-4">{userNameStr}</span> 님의 두뇌에는 <span className="text-amber-300 font-black">[{topItem.label} ({maxScore}%)]</span> 이(가) 가장 뜨겁게 가동 중입니다. {topItem.summary}을(를) 품고 계십니다.
                              </p>
                            </div>

                            {/* 모바일 짤림 방지형 학술 격자 테이블 */}
                            <div className="overflow-x-auto border border-indigo-500/20 rounded-xl md:rounded-2xl bg-[#090b16]/90 backdrop-blur-sm shadow-2xl">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-indigo-950/40 text-indigo-300 text-[8px] md:text-[10px] font-extrabold uppercase tracking-wider border-b border-indigo-500/20">
                                    <th className="py-2 px-2 md:py-3 md:px-4 w-1/3">성정 역량 (Dimension)</th>
                                    <th className="py-2 px-2 md:py-3 md:px-4 hidden sm:table-cell">핵심 작용 (Cognitive Factor)</th>
                                    <th className="py-2 px-2 md:py-3 md:px-4">기운 지수 게이지 (Intensity)</th>
                                    <th className="py-2 px-2 md:py-3 md:px-4 w-1/5 text-right">명리 원천</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map((item) => {
                                    const val = fullData.specificTalents[item.key] || 0;
                                    const isTop = val === maxScore;
                                    return (
                                      <tr
                                        key={item.key}
                                        onClick={() => handleGraphElementClick(item.label, `${val}%`)}
                                        className={`border-b border-white/5 cursor-pointer transition-all text-[9px] md:text-xs ${
                                          isTop ? 'bg-amber-500/10 hover:bg-amber-500/15 border-l-4 border-l-amber-400' : 'hover:bg-indigo-500/10'
                                        }`}
                                      >
                                        <td className="py-2.5 px-2 md:py-3.5 md:px-4 font-black text-white">
                                          <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <span>{item.label}</span>
                                              {isTop && (
                                                <span className="text-[8px] md:text-[9px] bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black px-1.5 py-0.5 rounded shadow-md animate-pulse">
                                                  👑 1위 슈퍼 엔진
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-[8px] md:text-[9.5px] text-amber-300/90 font-bold">{item.subTag}</span>
                                          </div>
                                        </td>
                                        <td className="py-2.5 px-2 md:py-3.5 md:px-4 text-gray-400 text-[8px] md:text-[10px] leading-relaxed hidden sm:table-cell">
                                          {item.desc}
                                        </td>
                                        <td className="py-2.5 px-2 md:py-3.5 md:px-4">
                                          <div className="flex items-center gap-1.5 md:gap-3">
                                            <span className={`text-[10px] md:text-[11px] font-mono font-black w-9 ${isTop ? 'text-amber-300 text-xs' : 'text-indigo-300'}`}>{val}%</span>
                                            <div className="flex-1 bg-white/5 h-4 md:h-5 rounded-md overflow-hidden border border-white/10 relative shadow-inner">
                                              <GaugeRuler />
                                              <motion.div
                                                className={`h-full bg-gradient-to-r ${item.color} relative z-10 opacity-90 ${isTop ? 'shadow-[0_0_12px_rgba(245,158,11,0.6)]' : ''}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${val}%` }}
                                                transition={{ duration: 1.1, ease: 'easeOut' }}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-2.5 px-2 md:py-3.5 md:px-4 text-right">
                                          <span className={`text-[7px] md:text-[8px] border font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider whitespace-nowrap ${
                                            isTop ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                          }`}>
                                            {item.badge}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* ==========================================
                      Page 3: 기운적 포지셔닝 & 파워베이스 (사회적 기여도)
                      ========================================== */}
                  {currentPage === 3 && fullData?.fulfill && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 3 / Social Dynamic Alignment</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">기운적 포지셔닝 (사회적 영향력)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">사회적 기여, 상생 협업, 독창 자아 지향성과 6대 잠재적 영향력 분포</p>
                      </div>

                      {/* SVG 도넛 차트 및 지향점 도표 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-[#090b16]/60 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-2xl">
                        <div className="flex justify-center py-1 scale-90 md:scale-100">
                          {renderRadialTrackChart([
                            { value: fullData.fulfill.societal, color: '#818cf8', label: '사회적 천명 지향 (Societal)' },
                            { value: fullData.fulfill.communal, color: '#34d399', label: '조화적 협업 지향 (Communal)' },
                            { value: fullData.fulfill.individual, color: '#f472b6', label: '독창적 자아 지향 (Individual)' }
                          ])}
                        </div>

                        <div className="overflow-hidden border border-white/10 rounded-lg bg-black/40">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-indigo-950/40 text-indigo-300 text-[8px] md:text-[9px] font-extrabold border-b border-white/10">
                                <th className="p-1.5 md:p-2.5">지향점 유형 (Orientation)</th>
                                <th className="p-1.5 md:p-2.5 w-1/4">강도 지수</th>
                                <th className="p-1.5 md:p-2.5 text-right hidden sm:table-cell">매핑 기운</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { label: '사회적 천명 지향 (Societal)', val: fullData.fulfill.societal, color: 'bg-[#818cf8]', badge: '관성 기운' },
                                { label: '조화적 협업 지향 (Communal)', val: fullData.fulfill.communal, color: 'bg-[#34d399]', badge: '재성/비겁' },
                                { label: '독창적 자아 지향 (Individual)', val: fullData.fulfill.individual, color: 'bg-[#f472b6]', badge: '식상/인성' }
                              ].map((x, i) => (
                                <tr
                                  key={i}
                                  onClick={() => handleGraphElementClick(x.label, `${x.val}%`)}
                                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer text-[9px] md:text-[10px]"
                                >
                                  <td className="p-1.5 md:p-2.5 flex items-center gap-1.5 font-bold text-gray-300">
                                    <span className={`w-2 h-2 rounded-full ${x.color}`} />
                                    {x.label}
                                  </td>
                                  <td className="p-1.5 md:p-2.5 font-mono font-black text-white">{x.val}%</td>
                                  <td className="p-1.5 md:p-2.5 text-right font-black text-gray-500 text-[8px] hidden sm:table-cell">{x.badge}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 최적 기운 포지션 */}
                      <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/20 rounded-xl p-2.5 md:p-3 flex items-center justify-between shadow-inner">
                        <div>
                          <span className="text-[8px] md:text-[9px] text-purple-400 font-black tracking-wider uppercase font-mono">나의 최적 명심 아키타입 (Preferred Role)</span>
                          <h4 className="text-xs md:text-sm font-black text-white mt-0.5">{fullData.teamRole}</h4>
                        </div>
                        <span className="text-[7px] md:text-[8px] bg-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 md:px-2.5 md:py-1 rounded border border-purple-500/40 font-mono whitespace-nowrap">
                          관성·비겁 조율 판정
                        </span>
                      </div>

                      {/* Powerbase 6대 영향력 격자 도표 */}
                      <div className="border border-indigo-500/20 rounded-xl md:rounded-2xl bg-[#090b16]/90 overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-indigo-950/40 text-indigo-300 text-[8px] md:text-[10px] font-extrabold uppercase tracking-wider border-b border-indigo-500/20">
                              <th className="py-2 px-2 md:py-2.5 md:px-4 w-1/3">조직 내 영향력 (Powerbase)</th>
                              <th className="py-2 px-2 md:py-2.5 md:px-4 w-1/5 hidden sm:table-cell">조합 기운</th>
                              <th className="py-2 px-2 md:py-2.5 md:px-4">에너지 스케일</th>
                              <th className="py-2 px-2 md:py-2.5 md:px-4 w-12 text-right">지수</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { label: '안정적 경영 관리력 (Stewardship)', badge: '정인 + 정관', idx: 0 },
                              { label: '시장 개척 추진력 (Pioneering Force)', badge: '겁재 + 편관', idx: 1 },
                              { label: '목적 중심 설계력 (Value Planning)', badge: '식신 + 편재', idx: 2 },
                              { label: '공감적 관계 촉진력 (Empathizer)', badge: '상관 + 비견', idx: 3 },
                              { label: '지속 가능 유지력 (Sustainability)', badge: '정인 + 정재', idx: 4 },
                              { label: '변화 혁신 창조력 (Metanoic Innovation)', badge: '편인 + 식신', idx: 5 }
                            ].map((item) => {
                              const val = fullData.powerbase[item.idx] || 0;
                              return (
                                <tr
                                  key={item.idx}
                                  onClick={() => handleGraphElementClick(item.label, `${val}%`)}
                                  className="border-b border-white/5 hover:bg-indigo-500/10 cursor-pointer transition-all text-[9px] md:text-xs"
                                >
                                  <td className="py-2 px-2 md:py-2.5 md:px-4 font-bold text-gray-300">{item.label}</td>
                                  <td className="py-2 px-2 md:py-2.5 md:px-4 text-gray-500 text-[8px] md:text-[9px] font-mono hidden sm:table-cell">{item.badge}</td>
                                  <td className="py-2 px-2 md:py-2.5 md:px-4">
                                    <div className="w-full bg-white/5 h-1.5 md:h-2 rounded-full overflow-hidden border border-white/10 relative">
                                      <div className="h-full bg-indigo-500/80" style={{ width: `${val}%` }} />
                                    </div>
                                  </td>
                                  <td className="py-2 px-2 md:py-2.5 md:px-4 text-right font-mono font-black text-indigo-300">{val}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      Page 4: 기운 정렬 프로필 (콤팩트 그리드로 모바일 최적화)
                      ========================================== */}
                  {currentPage === 4 && fullData?.talentProfile && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 4 / Cognitive Alignment Profiles</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">기운 정렬 프로필 (성정·협업·풍요)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">재능 발현, 최적 협업, 그리고 풍요 알고리즘의 세 가지 차원에서 매핑되는 구체적 인자</p>
                      </div>

                      {[
                        {
                          title: '재능 발현 유형 (Talent Profile)',
                          data: [
                            { label: '주체적 대의 창출형', badge: '식상 + 관성' },
                            { label: '자산 가치 개척형', badge: '재성 + 비겁' },
                            { label: '상생적 교류 공명형', badge: '비겁 + 식상' },
                            { label: '실무적 성과 주도형', badge: '재성 + 관성' },
                            { label: '통찰적 창의 설계형', badge: '식상 + 인성' },
                            { label: '구조적 자원 관리형', badge: '인성 + 재성' }
                          ],
                          scores: fullData.talentProfile
                        },
                        {
                          title: '최적 협업 환경 (Cooperation Profile)',
                          data: [
                            { label: '맥락적 유연 상생형', badge: '식상 순응' },
                            { label: '규율 기반 조직 안착형', badge: '정관 생조' },
                            { label: '수평적 연대 조율형', badge: '정재 구조' },
                            { label: '커뮤니티 가치 협업형', badge: '비겁 생조' },
                            { label: '밀접한 1:1 파트너십형', badge: '인성 상생' },
                            { label: '독립적 자율 몰입형', badge: '비겁/식상' }
                          ],
                          scores: fullData.coopProfile
                        },
                        {
                          title: '풍요 알고리즘 (Prosperity Profile)',
                          data: [
                            { label: '통찰적 정신 자립형', badge: '인성 독립' },
                            { label: '구조적 안정 축적형', badge: '정재 보관' },
                            { label: '이타적 나눔 상생형', badge: '식신 베풂' },
                            { label: '역동적 기회 투자형', badge: '편재/상관' },
                            { label: '명예 중심 가치 조율형', badge: '정관 통제' },
                            { label: '시스템 안정 보장형', badge: '재성 + 관성' }
                          ],
                          scores: fullData.prosperityProfile
                        }
                      ].map((section, sIdx) => (
                        <div key={sIdx} className="border border-indigo-500/20 rounded-xl md:rounded-2xl overflow-hidden bg-[#090b16]/90 shadow-2xl">
                          <div className="bg-indigo-950/40 py-1.5 px-3 md:py-2.5 md:px-4 border-b border-indigo-500/20 text-[10px] md:text-xs font-black text-indigo-300 tracking-wider">
                            {section.title}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-y divide-white/5 bg-[#090b16]/40">
                            {section.data.map((item, idx) => {
                              const scoreVal = section.scores[idx] || 0;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleGraphElementClick(item.label, `${scoreVal}%`)}
                                  className="text-left p-2.5 md:p-3.5 hover:bg-indigo-500/10 transition-all flex flex-col justify-between h-20 md:h-24 border-white/5"
                                >
                                  <div>
                                    <span className="text-[9px] md:text-[11px] font-black text-white block truncate">{item.label}</span>
                                    <span className="text-[7px] md:text-[8px] text-gray-500 font-mono block mt-0.5 tracking-tighter">{item.badge}</span>
                                  </div>
                                  <div className="flex items-end justify-between mt-1 md:mt-2">
                                    <span className="text-xs md:text-sm font-mono font-black text-indigo-300">{scoreVal}%</span>
                                    <div className="w-10 md:w-12 bg-white/5 h-1 md:h-1.5 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-400" style={{ width: `${scoreVal}%` }} />
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ==========================================
                      Page 5: 명심 의사결정 필터 (도넛형 파이 차트 및 인지 속도 게이지)
                      ========================================== */}
                  {currentPage === 5 && fullData?.mindWorks && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 5 / Cognitive Decision Filter</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">명심 의사결정 필터 (의사결정 토대)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">내가 정보를 필터링하는 두뇌 인지 구조와 의사결정 시 작동하는 판단적 우선순위 분포</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-[#090b16]/60 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-2xl">
                        <div className="flex justify-center py-1 scale-90 md:scale-100">
                          {renderRadialTrackChart([
                            { value: fullData.mindWorks.logical, color: '#38bdf8', label: '정량/논리 필터 (Logical)' },
                            { value: fullData.mindWorks.abstract, color: '#fb923c', label: '직관/성찰 필터 (Abstract)' },
                            { value: fullData.mindWorks.individual, color: '#c084fc', label: '독창/지식 필터 (Individual)' }
                          ])}
                        </div>

                        <div className="overflow-hidden border border-white/10 rounded-lg bg-black/40">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-indigo-950/40 text-indigo-300 text-[8px] md:text-[9px] font-extrabold border-b border-white/10">
                                <th className="p-1.5 md:p-2.5">나의 인지 구조 (How Mind Works)</th>
                                <th className="p-1.5 md:p-2.5 w-1/4">강도 지수</th>
                                <th className="p-1.5 md:p-2.5 text-right hidden sm:table-cell">매핑 기운</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { label: '정량/논리 필터 (Logical)', val: fullData.mindWorks.logical, color: 'bg-[#38bdf8]', badge: '정인/정재' },
                                { label: '직관/성찰 필터 (Abstract)', val: fullData.mindWorks.abstract, color: 'bg-[#fb923c]', badge: '편인/상관' },
                                { label: '독창/지식 필터 (Individual)', val: fullData.mindWorks.individual, color: 'bg-[#c084fc]', badge: '비겁/식신' }
                              ].map((x, i) => (
                                <tr
                                  key={i}
                                  onClick={() => handleGraphElementClick(x.label, `${x.val}%`)}
                                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer text-[9px] md:text-[10px]"
                                >
                                  <td className="p-1.5 md:p-2.5 flex items-center gap-1.5 font-bold text-gray-300">
                                    <span className={`w-2 h-2 rounded-full ${x.color}`} />
                                    {x.label}
                                  </td>
                                  <td className="p-1.5 md:p-2.5 font-mono font-black text-white">{x.val}%</td>
                                  <td className="p-1.5 md:p-2.5 text-right font-black text-gray-500 text-[8px] hidden sm:table-cell">{x.badge}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 의사결정 판단 토대 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="border border-white/10 rounded-xl bg-black/40 overflow-hidden">
                          <table className="w-full text-left border-collapse text-[9px] md:text-xs">
                            <thead>
                              <tr className="bg-indigo-950/40 text-indigo-300 font-extrabold border-b border-white/10">
                                <th className="py-2 px-3">판단 우선순위 (Decision Basis)</th>
                                <th className="py-2 px-3 text-right">강도 지수</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { label: '현실/경험 토대 (Empirical Reality)', val: fullData.decisionBasis.practical },
                                { label: '공명/관계 토대 (Resonant Empathy)', val: fullData.decisionBasis.empathic },
                                { label: '대의/규율 토대 (Sovereign Principles)', val: fullData.decisionBasis.mental }
                              ].map((item, idx) => (
                                <tr
                                  key={idx}
                                  onClick={() => handleGraphElementClick(item.label, `${item.val}%`)}
                                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                                >
                                  <td className="py-2.5 px-3 font-bold text-gray-300">{item.label}</td>
                                  <td className="py-2.5 px-3 text-right font-mono font-black text-white">{item.val}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 의사결정 속도 눈금 슬라이더 */}
                        <button
                          onClick={() => handleGraphElementClick('의사결정 스타일 (속도)', fullData.decisionSlider > 0 ? '심사숙고 통찰주의' : '즉흥적 실행주의')}
                          className="bg-[#090b16]/95 hover:bg-[#12152a]/95 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl p-4 flex flex-col justify-between text-left shadow-xl transition-all relative overflow-hidden"
                        >
                          <div>
                            <span className="text-[10px] font-black text-indigo-200 block">의사결정 스타일 (Decision Style)</span>
                            <span className="text-[8px] text-gray-500 font-mono block mt-0.5">식상(실행) vs 인성(사색) 역학 매핑</span>
                          </div>
                          
                          <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-2 font-mono">
                            <span>즉흥적 실행주의 (Spontaneous)</span>
                            <span>심사숙고 통찰주의 (Considerate)</span>
                          </div>

                          <div className="h-6 bg-white/5 rounded border border-white/10 relative mt-2 flex items-center px-1">
                            <BiDirectionalRuler />
                            <div
                              className={`absolute top-0 bottom-0 ${fullData.decisionSlider >= 0 ? 'left-1/2 bg-gradient-to-r from-purple-500 to-pink-500' : 'right-1/2 bg-gradient-to-l from-indigo-500 to-cyan-500'} opacity-35 z-0`}
                              style={{ width: `${Math.abs(fullData.decisionSlider) / 2.1}%` }}
                            />
                            <motion.div
                              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-400 border border-white rounded-full shadow-[0_0_10px_#6366f1] z-10"
                              style={{ left: `calc(50% + ${fullData.decisionSlider / 2.15}%)` }}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      Page 6: 리더십 스펙트럼 (자타 인식 듀얼 계측 도표 및 격차 수치 분석)
                      ========================================== */}
                  {currentPage === 6 && fullData?.leadershipPerception && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 6 / Sovereign Leadership Spectrum</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">소버린 리더십 스펙트럼 (자타 인식 도표)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">내가 생각하는 나의 통제력(Self-Perception)과 타인이 체감하는 나의 영향력(Perception) 격차 대조</p>
                      </div>

                      <div className="bg-[#090b16]/60 border border-white/10 rounded-xl py-1.5 px-3 text-[8px] md:text-[9px] text-gray-400 tracking-wider flex justify-center gap-6 font-mono font-bold">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-indigo-500 rounded-sm" /> 타인 인식 리더십 (Perception)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-pink-500 rounded-sm" /> 자기 인식 리더십 (Self-Perception)</span>
                      </div>

                      {/* 리더십 듀얼 계측기 격자 도표 */}
                      <div className="overflow-x-auto border border-indigo-500/20 rounded-xl md:rounded-2xl bg-[#090b16]/90 shadow-2xl">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-indigo-950/40 text-indigo-300 text-[8px] md:text-[10px] font-extrabold uppercase tracking-wider border-b border-indigo-500/20">
                              <th className="py-2.5 px-3 w-1/4">리더십 아키타입 (Type)</th>
                              <th className="py-2.5 px-3 w-1/5 hidden sm:table-cell">매칭 기운</th>
                              <th className="py-2.5 px-3">자타 인식 비교 게이지 (Perception Compare)</th>
                              <th className="py-2.5 px-3 w-16 text-right">자타 격차 (Gap)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { label: '솔선수범 인도형 (Exemplary)', badge: '식상 + 비겁 조율', idx: 0 },
                              { label: '목표제시 추진형 (Goal-Oriented)', badge: '관성 + 재성 제어', idx: 1 },
                              { label: '설득 합의형 (Consensual)', badge: '인성 + 비겁 설득', idx: 2 },
                              { label: '상황대처 적응형 (Situational)', badge: '식상 + 관성 조율', idx: 3 },
                              { label: '수평협력 소통형 (Democratic)', badge: '비견/비겁 조율', idx: 4 },
                              { label: '추진통제 주도형 (Directive)', badge: '편관/겁재 결단', idx: 5 }
                            ].map((item, idx) => {
                              const perception = fullData.leadershipPerception[item.idx] || 50;
                              const selfPerception = fullData.leadershipSelf[item.idx] || 50;
                              const gap = Math.abs(perception - selfPerception);

                              return (
                                <tr
                                  key={idx}
                                  onClick={() => handleGraphElementClick(item.label, `타인 ${perception}% / 자기 ${selfPerception}%`)}
                                  className="border-b border-white/5 hover:bg-indigo-500/10 cursor-pointer transition-all text-[9px] md:text-xs"
                                >
                                  <td className="py-2 px-3 font-black text-white">{item.label}</td>
                                  <td className="py-2 px-3 text-gray-500 text-[8px] md:text-[9px] font-mono hidden sm:table-cell">{item.badge}</td>
                                  <td className="py-2 px-3">
                                    <div className="space-y-1">
                                      {/* 타인 인식 바 */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-mono text-indigo-400 w-5">EXT</span>
                                        <div className="flex-1 bg-white/5 h-1.5 rounded overflow-hidden relative">
                                          <div className="h-full bg-indigo-500" style={{ width: `${perception}%` }} />
                                        </div>
                                        <span className="text-[8px] font-mono text-indigo-300 w-6 text-right">{perception}%</span>
                                      </div>
                                      {/* 자기 인식 바 */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-mono text-pink-400 w-5">INT</span>
                                        <div className="flex-1 bg-white/5 h-1.5 rounded overflow-hidden relative">
                                          <div className="h-full bg-pink-500" style={{ width: `${selfPerception}%` }} />
                                        </div>
                                        <span className="text-[8px] font-mono text-pink-300 w-6 text-right">{selfPerception}%</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono font-black">
                                    <span className={gap > 15 ? 'text-amber-400' : 'text-gray-400'}>
                                      ± {gap}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      Page 7: 스트레스 시프트 & 행동 본능 (모바일 뷰포트 압축 컴팩트 카드)
                      ========================================== */}
                  {currentPage === 7 && fullData?.behaviors && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 7 / Behavior Instinct & Stress Shift</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">행동 본능 및 스트레스 시프트</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">자아 주장과 상생 조율 사이에서 발현되는 6가지 행동 본능 및 스트레스 한계 드라이브</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
                        {[
                          { key: 'negotiation', title: '협업 조율 성향 (Negotiations)', left: '주도권 주장 (Assertive)', right: '상생적 절충 (Balancing)', badge: '비겁 vs 재성' },
                          { key: 'competition', title: '경쟁 대처 성향 (Competition)', left: '경쟁적 성취 (Competitive)', right: '협동적 공생 (Cooperative)', badge: '관성 vs 식상' },
                          { key: 'concepts', title: '생각 표현 방식 (Concepts)', left: '독자적 창조 (Elaborating)', right: '맥락적 수용 (Perceptive)', badge: '식상 vs 인성' },
                          { key: 'contact', title: '대인 관계 접속 (Contact)', left: '적극적 제안 (Approaching)', right: '신중한 경청 (Responding)', badge: '비겁 vs 인성' },
                          { key: 'conflicts', title: '갈등 해결 방식 (Conflicts)', left: '논리적 규명 (Clarifying)', right: '평화적 화합 (Harmonizing)', badge: '관성 vs 재성' },
                          { key: 'stress', title: '스트레스 한계 드라이브 (Stress)', left: '내부 책임감 압박 (Pressure)', right: '외부 상황 유연 대응 (External)', badge: '관성 vs 비겁' }
                        ].map((item) => {
                          const val = fullData.behaviors[item.key];
                          return (
                            <button
                              key={item.key}
                              onClick={() => handleGraphElementClick(item.title, val > 0 ? item.right : item.left)}
                              className="w-full text-left bg-[#090b16]/95 hover:bg-[#12152a]/95 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl p-2.5 md:p-4 transition-all relative overflow-hidden shadow-xl"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] md:text-xs font-black text-indigo-200 block truncate">{item.title}</span>
                                <span className="text-[6px] md:text-[8px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded px-1.5 py-0.5 font-mono uppercase tracking-wider block">
                                  {item.badge}
                                </span>
                              </div>
                              <div className="flex justify-between text-[7px] md:text-[8px] font-bold text-gray-500 mb-1.5 font-mono">
                                <span>{item.left}</span>
                                <span>{item.right}</span>
                              </div>
                              
                              <div className="h-5 md:h-6 bg-white/5 rounded border border-white/10 relative flex items-center px-1">
                                <BiDirectionalRuler />
                                {/* 양방향 충전식 컬러 바 */}
                                <div
                                  className={`absolute top-0 bottom-0 ${val >= 0 ? 'left-1/2 bg-gradient-to-r from-purple-500 to-pink-500' : 'right-1/2 bg-gradient-to-l from-indigo-500 to-cyan-500'} opacity-35 z-0`}
                                  style={{ width: `${Math.abs(val) / 2.1}%` }}
                                />
                                {/* 슬라이더 바늘 */}
                                <motion.div
                                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-purple-400 border border-white rounded-full shadow-[0_0_12px_#c084fc] z-10"
                                  style={{ left: `calc(50% + ${val / 2.15}%)` }}
                                />
                              </div>
                              
                              <div className="text-right mt-1">
                                <span className="text-[8px] md:text-[9px] font-mono font-black text-pink-400">
                                  Index: {val > 0 ? `+${val}` : val}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      Page 8: 인지 메타코드 (3열의 정갈한 인지 차원 매핑 도표)
                      ========================================== */}
                  {currentPage === 8 && fullData?.metaCode && renderBlurPaywall(
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Page 8 / Cognitive Meta Codes</span>
                        <h3 className="text-sm md:text-lg font-black mt-0.5">동기 및 인지 메타코드 (근원 동력)</h3>
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">의식의 근원동기, 생체에너지 조율 방식 등 나의 타고난 기질적 메타 인자 분석 결과</p>
                      </div>

                      {/* 2x2 네온 대시보드 카드 그리드 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-2">
                        {[
                          { 
                            title: '🔥 내면의 핵심 불꽃 (Innate Core Drive)', 
                            val: fullData.metaCode.motivation, 
                            score: fullData.metaCode.motivationScore || 75,
                            badge: '월지/일지 복합 분석', 
                            desc: '의식 깊은 곳에서 결정을 내리고 행동하게 만드는 근원적 동력',
                            quickTip: '💡 3초 해설: 당신의 자아가 어떤 가치를 쫓아 몸을 일으키고 행동을 결단하게 만드는지 그 핵심 열정의 근원입니다.'
                          },
                          { 
                            title: '👁️ 세상을 바라보는 렌즈 (Cognitive Perspective)', 
                            val: fullData.metaCode.perspective, 
                            score: fullData.metaCode.perspectiveScore || 80,
                            badge: '인성/식상 조율 판정', 
                            desc: '현상과 사건을 머릿속으로 해석하고 받아들이는 타고난 인지 프레임',
                            quickTip: '💡 3초 해설: 들어오는 모든 정보를 머릿속으로 조율하고 나만의 시선으로 이해해 내는 타고난 인지 성향입니다.'
                          },
                          { 
                            title: '⚡ 에너지 충전 메커니즘 (Energy Recharging Mode)', 
                            val: fullData.metaCode.activityMode, 
                            score: fullData.metaCode.activityModeScore || 65,
                            badge: '일간/비겁 에너지 밸런스', 
                            desc: '정신적, 신체적 피로를 해소하고 에너지를 복구하는 방식',
                            quickTip: '💡 3초 해설: 심신이 지치고 무기력할 때 나에게 가장 편안한 고유 주파수를 찾아 배터리를 채워주는 방법입니다.'
                          },
                          { 
                            title: '🧩 정보 수용 및 필터 방식 (Info Processing)', 
                            val: fullData.metaCode.infoProcessing, 
                            score: fullData.metaCode.infoProcessingScore || 70,
                            badge: '인성/지장간 투출 매핑', 
                            desc: '외부 데이터를 수용할 때 거치는 고유 필터링 메커니즘',
                            quickTip: '💡 3초 해설: 외부 정보와 다양한 자극들을 소화 불량 없이 내면에 차곡차곡 흡수하는 수용 및 소화 필터입니다.'
                          }
                        ].map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleGraphElementClick(m.title, `${m.val} (활성도: ${m.score}%)`)}
                            className="relative bg-[#060812]/85 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl p-3 md:p-4 cursor-pointer transition-all hover:bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.1)] flex flex-col justify-between space-y-3 group text-left"
                          >
                            {/* 카드 네온 장식 */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-indigo-500/30 rounded-tr-xl pointer-events-none group-hover:border-indigo-500/60 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-indigo-500/30 rounded-bl-xl pointer-events-none group-hover:border-indigo-500/60 transition-colors" />
 
                            <div>
                              {/* 상단 타이틀 & 뱃지 */}
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-[11px] md:text-sm font-black text-indigo-200 tracking-tight leading-tight">
                                  {m.title}
                                </h4>
                                <span className="text-[7px] md:text-[8px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider whitespace-nowrap">
                                  {m.badge}
                                </span>
                              </div>
                              
                              {/* 설명글 */}
                              <p className="text-[8px] md:text-[10px] text-gray-400 mt-1 leading-normal break-keep">
                                {m.desc}
                              </p>
                            </div>
 
                            {/* 중앙 핵심 특성값 */}
                            <div className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-2 text-center">
                              <span className="text-[10px] md:text-xs font-black text-white tracking-wide block">
                                {m.val}
                              </span>
                            </div>
 
                            {/* 하단 활성도 게이지바 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[7px] md:text-[8px] font-mono text-gray-500">
                                <span>기질 활성 스케일</span>
                                <span className="text-indigo-400 font-extrabold">{m.score}% ACT</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 md:h-2 rounded-full overflow-hidden border border-white/10 relative">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" 
                                  style={{ width: `${m.score}%` }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${m.score}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                />
                              </div>
                              {/* 5눈금 미세 지시자 */}
                              <div className="flex justify-between px-0.5 text-[6px] md:text-[7px] font-mono text-white/10 pointer-events-none">
                                <span>I</span>
                                <span>I</span>
                                <span>I</span>
                                <span>I</span>
                                <span>I</span>
                              </div>
                            </div>
 
                            {/* 초보자 3초 요약 꿀팁 */}
                            <div className="border-t border-white/5 pt-2 mt-1">
                              <p className="text-[9px] md:text-[10px] text-indigo-300/80 leading-relaxed font-bold break-keep">
                                {m.quickTip}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 페이지 네비게이션 네온 슬라이더 바 */}
            <footer className="p-4 border-t border-white/10 bg-[#060812] relative z-10 flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={handlePrevPage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all font-bold text-xs"
              >
                <ChevronLeft size={16} />
                <span>이전</span>
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      playTechBeep();
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentPage === i + 1 ? 'bg-indigo-500 shadow-[0_0_10px_#4f46e5] scale-125' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all font-bold text-xs"
              >
                <span>다음</span>
                <ChevronRight size={16} />
              </button>
            </footer>
          </>
        )}
      </motion.div>

      {/* AI 실시간 팝업 해설 모달 */}
      <AnimatePresence>
        {selectedIndicator && (
          <GeniusExplainModal
            isOpen={!!selectedIndicator}
            onClose={() => setSelectedIndicator(null)}
            userName={userProfile?.userName || '명심가'}
            saju={fullData?.saju}
            indicatorName={selectedIndicator.name}
            score={selectedIndicator.score}
            locale={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

