'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, Heart, ShieldAlert, Zap, BookOpen, Compass, Mail, Loader2, ArrowRight, Layers } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju } from '@/lib/saju/SajuEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

interface PremiumReportData {
  overview: {
    title: string;
    saju_analysis_name: string;
  };
  part0: {
    title: string;
    subtitle: string;
    core_element: string;
    core_description: string;
    dark_code_analysis: string;
    neural_code_blueprint: string;
    meta_code_analysis: string;
  };
  part1: {
    title: string;
    subtitle: string;
    content: string;
    mbsr_coaching: string;
    wealth_flow?: {
      labels: string[];
      values: number[];
      description: string;
    };
    daewoon_flow?: {
      cycle_description: string;
      milestones: {
        year: number;
        age: number;
        stem: string;
        branch: string;
        score: number;
        is_active: boolean;
        label: string;
      }[];
    };
  };
  part2: {
    title: string;
    subtitle: string;
    content: string;
    recursive_question: { question: string; guide: string };
    meta_question: { question: string; guide: string };
  };
  part3: {
    title: string;
    subtitle: string;
    content: string;
    socratic_question: { question: string; guide: string };
  };
  part4: {
    title: string;
    subtitle: string;
    ohaeng_remedy: string;
    act_action_plan: string;
    awareness_question: { question: string; guide: string };
    master_letter: { title: string; letter: string };
  };
}

export default function PremiumReportModal({ isOpen, onClose, userProfile }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<PremiumReportData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);
  const [showWealthModal, setShowWealthModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);

  const { reportData: storeReportData } = useReportStore();

  const saju = userProfile?.saju || storeReportData?.saju || {};
  const userName = userProfile?.userName || (storeReportData as any)?.userName || '회원';

  // 한자 파싱 헬퍼 함수
  const getHanzi = (pillar: any, part: 'stem' | 'branch'): string => {
    if (!pillar) return '';
    if (typeof pillar === 'string') {
      if (part === 'stem') return pillar.charAt(0) || '';
      return pillar.charAt(1) || '';
    }
    if (part === 'stem') {
      const gan = pillar.gan || pillar.stem;
      if (!gan) return '';
      if (typeof gan === 'string') return gan;
      if (typeof gan === 'object') return gan.char || gan.kanji || gan.name || '';
    } else {
      const ji = pillar.ji || pillar.branch;
      if (!ji) return '';
      if (typeof ji === 'string') return ji;
      if (typeof ji === 'object') return ji.char || ji.kanji || ji.name || '';
    }
    return '';
  };

  const dayPillarGan = getHanzi(saju?.dayPillar || saju?.fourPillars?.day, 'stem') || '辛';
  const dayPillarJi = getHanzi(saju?.dayPillar || saju?.fourPillars?.day, 'branch') || '巳';
  const dayPillar = `${dayPillarGan}${dayPillarJi}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      const fetchPremiumReport = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
          // 사용자의 생년월일시 정보 동적 연동
          const rawDate = userProfile?.birthDate || userProfile?.birth_date || storeReportData?.birthDate || userProfile?.user_metadata?.saju_data?.date || userProfile?.user_metadata?.birth_date;
          const rawTime = userProfile?.birthTime || userProfile?.birth_time || storeReportData?.birthTime || '12:00';
          const calType = userProfile?.calendar_type || storeReportData?.meta?.calendarType || 'solar';
          const gender = userProfile?.gender || storeReportData?.gender || 'male';

          let computedSajuResult = null;
          if (rawDate) {
            try {
              computedSajuResult = calculateSaju(rawDate, rawTime, calType, gender);
            } catch (calcErr) {
              console.warn("Saju calculation error in premium modal:", calcErr);
            }
          }

          const birthYear = rawDate ? parseInt(rawDate.split('-')[0], 10) : 1980;
          const computedDaewoonList = computedSajuResult?.daewoonList || saju?.daewoonList || [];
          const computedStartAge = (computedDaewoonList && computedDaewoonList[0])
            ? (computedDaewoonList[0].startYear - birthYear)
            : 10;

          const res = await fetch('/api/secure/premium-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              saju: {
                dayPillar: { stem: dayPillarGan, branch: dayPillarJi },
                yearPillar: saju?.yearPillar || saju?.fourPillars?.year,
                monthPillar: saju?.monthPillar || saju?.fourPillars?.month,
                hourPillar: saju?.hourPillar || saju?.fourPillars?.time,
                daewoonList: computedDaewoonList,
                daewoonStartAge: computedStartAge,
                gongmang: saju?.gongmang || []
              }
            }),
          });

          if (!res.ok) throw new Error('Failed to generate report');
          const result = await res.json();
          if (result.success && result.data) {
            setReportData(result.data);
          } else {
            throw new Error(result.error || 'Server returns failed');
          }
        } catch (e) {
          console.error(e);
          setErrorMsg('프리미엄 레포트를 생성하는 도중 네트워크 순환 에러가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPremiumReport();
    }
  }, [isOpen, mounted, userProfile, storeReportData, dayPillarGan, dayPillarJi]);

  if (!isOpen || !mounted) return null;

  const tabLabels = [
    '0. 나를 알아보기',
    '1. 타이밍의 기술',
    '2. 마인드 디버깅',
    '3. 관계의 기술',
    '4. 실천의 시작'
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col my-6 max-h-[92vh]"
      >
        {/* Glow effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start relative z-10 bg-slate-950/40 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              Myeongsim Premium Deep Report
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {reportData?.overview?.title || `${userName}님만을 위한 심층 리포트`}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold text-amber-300/90 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                {reportData?.overview?.saju_analysis_name || '팔방미인형 (균형 잡힌 사주)'}
              </span>
              <span className="text-[10px] text-slate-400">
                이 사주 조합은 전체의 0.8%만 해당합니다
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="px-6 py-4 pb-3 border-b border-white/5 flex gap-2 overflow-x-auto overflow-y-visible relative z-10 bg-slate-950/20 scrollbar-none items-center">
          {tabLabels.map((label, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setShowLetter(false);
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                activeTab === idx
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/25 scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              <div className="text-sm font-bold text-slate-200">명심 프리미엄 리포트 로딩 중...</div>
              <div className="text-xs text-slate-500">CBT, DBT, ACT, MBSR 코칭법과 다크/뉴럴 코드를 조율 중입니다.</div>
            </div>
          ) : errorMsg ? (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-200">오류 발생</h4>
                <p className="text-xs text-slate-400 mt-1">{errorMsg}</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Part 0. 나를 알아보기 */}
              {activeTab === 0 && reportData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-5"
                >
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      핵심 기질 설계도
                    </h3>
                    <p className="text-base font-extrabold text-white">{reportData.part0.core_element}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{reportData.part0.core_description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 다크 코드 */}
                    <div className="bg-slate-950/60 border border-red-500/20 rounded-2xl p-5 hover:border-red-500/40 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-[10px] font-black text-red-400">DARK CODE</span>
                        <h4 className="text-sm font-bold text-red-200">다크코드 (무의식적 덫)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{reportData.part0.dark_code_analysis}</p>
                    </div>

                    {/* 뉴럴 코드 */}
                    <div className="bg-slate-950/60 border border-emerald-500/20 rounded-2xl p-5 hover:border-emerald-500/40 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black text-emerald-400">NEURAL CODE</span>
                        <h4 className="text-sm font-bold text-emerald-200">뉴럴코드 (신경 회로 개선)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{reportData.part0.neural_code_blueprint}</p>
                    </div>

                    {/* 메타 코드 */}
                    <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-5 hover:border-amber-500/40 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-black text-amber-400">META CODE</span>
                        <h4 className="text-sm font-bold text-amber-200">메타코드 (본질적 자각)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{reportData.part0.meta_code_analysis}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Part 1. 타이밍의 기술 */}
              {activeTab === 1 && reportData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-6"
                >
                  <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl space-y-2">
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Life Waves & Timing</div>
                    <h3 className="text-base font-extrabold text-white">{reportData.part1.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{reportData.part1.content}</p>
                  </div>

                  {/* 시기별 재산 흐름 곡선 그래프 */}
                  <div 
                    onClick={() => setShowWealthModal(true)}
                    className="p-5 bg-slate-950 border border-amber-500/20 rounded-3xl space-y-4 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-pointer hover:border-amber-500/40 active:scale-[0.99] transition-all group/wealth"
                  >
                    <div className="flex items-center justify-between border-b border-amber-500/10 pb-3">
                      <div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                          Quantum Wealth Flow
                          <span className="text-[8px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded-md font-bold group-hover/wealth:animate-pulse">클릭 시 상세 해설</span>
                        </span>
                        <h4 className="text-sm font-black text-amber-100">{userName}님의 평생 자산규모 파동 (재산 흐름 곡선)</h4>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">정통 재물운 디코딩</span>
                    </div>

                    {/* SVG Curve Graph with Grid Background */}
                    <div className="w-full relative bg-slate-950/80 border border-amber-500/10 rounded-2xl p-4 overflow-hidden h-[240px]">
                      <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                        <defs>
                          {/* 격자 무늬 패턴 */}
                          <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(245, 158, 11, 0.03)" strokeWidth="1" />
                          </pattern>
                          {/* 가우시안 네온 발광 필터 */}
                          <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          {/* 그라데이션 채우기 */}
                          <linearGradient id="wealth-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Background */}
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                        {/* Bezier Path calculations based on data */}
                        {(() => {
                          const wFlow = (reportData.part1 as any)?.wealth_flow || { values: [55, 80, 45, 95] };
                          const valArray = wFlow.values || [55, 80, 45, 95];
                          
                          const x1 = 60, y1 = 150 - (valArray[0] / 100) * 110;
                          const x2 = 190, y2 = 150 - (valArray[1] / 100) * 110;
                          const x3 = 310, y3 = 150 - (valArray[2] / 100) * 110;
                          const x4 = 440, y4 = 150 - (valArray[3] / 100) * 110;

                          const pathData = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2} C ${(x2 + x3) / 2} ${y2}, ${(x2 + x3) / 2} ${y3}, ${x3} ${y3} C ${(x3 + x4) / 2} ${y3}, ${(x3 + x4) / 2} ${y4}, ${x4} ${y4}`;
                          const areaData = `${pathData} L ${x4} 180 L ${x1} 180 Z`;

                          return (
                            <>
                              {/* Filled Gradient Area */}
                              <path d={areaData} fill="url(#wealth-gradient)" />
                              
                              {/* Neon Glow Outer Path (Subtle purple aura) */}
                              <path d={pathData} fill="none" stroke="#a855f7" strokeWidth="6" opacity="0.35" filter="url(#neon-glow-filter)" strokeLinecap="round" />
                              
                              {/* Main Curve Stroke (Golden Orange) */}
                              <path d={pathData} fill="none" stroke="#f59e0b" strokeWidth="3.5" filter="url(#neon-glow-filter)" strokeLinecap="round" />

                              {/* Horizontal Guide Lines */}
                              <line x1="40" y1="40" x2="460" y2="40" stroke="rgba(245, 158, 11, 0.08)" strokeDasharray="3,3" />
                              <line x1="40" y1="95" x2="460" y2="95" stroke="rgba(245, 158, 11, 0.08)" strokeDasharray="3,3" />
                              <line x1="40" y1="150" x2="460" y2="150" stroke="rgba(245, 158, 11, 0.08)" strokeDasharray="3,3" />

                              {/* Nodes & Text Labels */}
                              {[
                                { x: x1, y: y1, val: valArray[0], label: '현재' },
                                { x: x2, y: y2, val: valArray[1], label: '10년 뒤' },
                                { x: x3, y: y3, val: valArray[2], label: '20년 뒤' },
                                { x: x4, y: y4, val: valArray[3], label: '30년 뒤' }
                              ].map((node, i) => (
                                <g key={i} className="group/node cursor-pointer">
                                  <circle cx={node.x} cy={node.y} r="12" fill="rgba(245,158,11,0.08)" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                                  <circle cx={node.x} cy={node.y} r="7" fill="rgba(168,85,247,0.2)" stroke="#f59e0b" strokeWidth="2" />
                                  <circle cx={node.x} cy={node.y} r="3" fill="#ffffff" />
                                  
                                  <foreignObject x={node.x - 30} y={node.y - 35} width="60" height="24" className="overflow-visible">
                                    <div className="bg-slate-900/95 border border-amber-500/30 rounded-lg px-1 py-0.5 text-[8.5px] font-black text-amber-300 text-center shadow-lg backdrop-blur-sm transform group-hover/node:scale-105 transition-transform">
                                      {node.label}
                                    </div>
                                  </foreignObject>
                                  
                                  <text x={node.x} y={node.y + 19} fill="#fbbf24" fontSize="9" fontWeight="900" textAnchor="middle" className="font-sans">
                                    {node.val}%
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                    <p className="text-[11px] text-amber-200/60 leading-relaxed font-medium pl-1 italic">
                      * {(reportData.part1 as any)?.wealth_flow?.description || '시기별 재산 운의 파동에 따른 맞춤형 관리와 투자 밸런스가 중요한 열쇠입니다.'}
                    </p>
                  </div>

                  {/* 나의 대운 흐름 S자 타임라인 */}
                  <div className="p-5 bg-slate-950 border border-blue-950/40 rounded-3xl space-y-5 relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.03)]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Quantum Destiny Cycle</span>
                        <h4 className="text-sm font-black text-slate-200">나의 평생 대운 흐름 (S자 은하수 타임라인)</h4>
                      </div>
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold">10년 대운 주기</span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {(reportData.part1 as any)?.daewoon_flow?.cycle_description || `${userName}님의 대운 주기는 다음과 같이 인생의 격변점과 전환기를 형성합니다.`}
                    </p>

                    {/* S-curve Layout Grid container */}
                    <div className="relative bg-slate-900/40 border border-white/5 rounded-2xl p-6 overflow-hidden min-h-[380px]">
                      {/* S-shaped Connective Line via SVG absolute underlay */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 340">
                        <style>{`
                          @keyframes dashflow {
                            to {
                              stroke-dashoffset: -20;
                            }
                          }
                          .animate-s-curve-line {
                            animation: dashflow 1.5s linear infinite;
                          }
                        `}</style>
                        {/* Glow outline path (Extended for 10 nodes) */}
                        <path 
                          d="M 75 50 C 200 50, 200 50, 325 50 C 360 50, 360 130, 325 130 C 200 130, 200 130, 75 130 C 40 130, 40 210, 75 210 C 200 210, 200 210, 325 210 C 360 210, 360 290, 325 290 L 75 290" 
                          fill="none" 
                          stroke="rgba(59, 130, 246, 0.08)" 
                          strokeWidth="6" 
                          strokeLinecap="round"
                        />
                        {/* Flowing dotted path (Extended for 10 nodes) */}
                        <path 
                          d="M 75 50 C 200 50, 200 50, 325 50 C 360 50, 360 130, 325 130 C 200 130, 200 130, 75 130 C 40 130, 40 210, 75 210 C 200 210, 200 210, 325 210 C 360 210, 360 290, 325 290 L 75 290" 
                          fill="none" 
                          stroke="rgba(59, 130, 246, 0.35)" 
                          strokeWidth="3.5" 
                          strokeDasharray="6,6" 
                          className="animate-s-curve-line"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Daewoon Grid Nodes Mapping (S-curve mapping to Grid Rows & Columns) */}
                      <div className="grid grid-cols-3 gap-y-10 relative z-10">
                        {(() => {
                          const dwFlow = (reportData.part1 as any)?.daewoon_flow || { milestones: [] };
                          
                          // 한자 한글 독음 매핑 정의
                          const STEM_KOR: Record<string, string> = { '甲':'갑', '乙':'을', '丙':'병', '丁':'정', '戊':'무', '己':'기', '庚':'경', '辛':'신', '壬':'임', '癸':'계' };
                          const ZHI_KOR: Record<string, string> = { '子':'자', '丑':'축', '寅':'인', '卯':'묘', '辰':'진', '巳':'사', '오':'오', '午':'오', '미':'미', '未':'미', '申':'신', '酉':'유', '戌':'술', '亥':'해' };
                          
                          // 백세 시대를 감안하여 최대 10개 대운 주기 슬라이싱
                          const milestones = dwFlow.milestones && dwFlow.milestones.length > 0
                            ? dwFlow.milestones.slice(0, 10)
                            : [
                                { year: 1980, age: 0, stem: '庚', branch: '申', score: 50, is_active: false, label: '탄생기' },
                                { year: 1990, age: 10, stem: '己', branch: '未', score: 60, is_active: false, label: '준비기' },
                                { year: 2000, age: 20, stem: '戊', branch: '午', score: 70, is_active: false, label: '성장기' },
                                { year: 2010, age: 30, stem: '丁', branch: '巳', score: 85, is_active: false, label: '도약기' },
                                { year: 2020, age: 40, stem: '丙', branch: '辰', score: 95, is_active: true, label: '황금기' },
                                { year: 2030, age: 50, stem: '乙', branch: '卯', score: 75, is_active: false, label: '안정기' },
                                { year: 2040, age: 60, stem: '甲', branch: '寅', score: 60, is_active: false, label: '성숙기' },
                                { year: 2050, age: 70, stem: '癸', branch: '丑', score: 55, is_active: false, label: '수확기' },
                                { year: 2060, age: 80, stem: '壬', branch: '子', score: 65, is_active: false, label: '황혼기' },
                                { year: 2070, age: 90, stem: '辛', branch: '亥', score: 70, is_active: false, label: '지혜기' }
                              ].slice(0, 10);

                          const colStartClasses = [
                            'col-start-1 justify-self-center', // 0 (좌)
                            'col-start-2 justify-self-center', // 1 (중)
                            'col-start-3 justify-self-center', // 2 (우)
                            'col-start-3 justify-self-center', // 3 (우) - 줄바꿈
                            'col-start-2 justify-self-center', // 4 (중)
                            'col-start-1 justify-self-center', // 5 (좌)
                            'col-start-1 justify-self-center', // 6 (좌) - 줄바꿈
                            'col-start-2 justify-self-center', // 7 (중)
                            'col-start-3 justify-self-center', // 8 (우)
                            'col-start-3 justify-self-center'  // 9 (우) - 줄바꿈
                          ];

                          // 오행 테마 컬러 계산 함수
                          const getOhaengColor = (stemChar: string) => {
                            const kor = STEM_KOR[stemChar] || '';
                            if (['갑', '을'].includes(kor)) {
                              return {
                                border: 'border-emerald-500/50',
                                text: 'text-emerald-400',
                                bg: 'bg-emerald-950/20',
                                glow: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
                                activeBg: 'bg-emerald-500',
                                name: '목(木) - 솟구치는 새싹의 푸른 생명력'
                              };
                            }
                            if (['병', '정'].includes(kor)) {
                              return {
                                border: 'border-red-500/50',
                                text: 'text-red-400',
                                bg: 'bg-red-950/20',
                                glow: 'shadow-[0_0_15px_rgba(239,68,68,0.35)]',
                                activeBg: 'bg-red-500',
                                name: '화(火) - 활활 타오르는 창조와 열정'
                              };
                            }
                            if (['무', '기'].includes(kor)) {
                              return {
                                border: 'border-amber-500/50',
                                text: 'text-amber-400',
                                bg: 'bg-amber-950/20',
                                glow: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
                                activeBg: 'bg-amber-500',
                                name: '토(土) - 모든 것을 품는 풍요로운 대지'
                              };
                            }
                            if (['경', '신'].includes(kor)) {
                              return {
                                border: 'border-slate-400/50',
                                text: 'text-slate-300',
                                bg: 'bg-slate-900/40',
                                glow: 'shadow-[0_0_15px_rgba(203,213,225,0.35)]',
                                activeBg: 'bg-slate-300',
                                name: '금(金) - 단단하고 예리한 성찰과 결단력'
                              };
                            }
                            if (['임', '계'].includes(kor)) {
                              return {
                                border: 'border-blue-500/50',
                                text: 'text-blue-400',
                                bg: 'bg-blue-950/20',
                                glow: 'shadow-[0_0_15px_rgba(59,130,246,0.35)]',
                                activeBg: 'bg-blue-500',
                                name: '수(水) - 깊고 유연하게 흐르는 지혜의 샘물'
                              };
                            }
                            return {
                              border: 'border-slate-700',
                              text: 'text-slate-400',
                              bg: 'bg-slate-950',
                              glow: '',
                              activeBg: 'bg-slate-500',
                              name: '알 수 없음'
                            };
                          };

                          return milestones.map((m: any, idx: number) => {
                            const gridClass = colStartClasses[idx] || 'justify-self-center';
                            const ohaeng = getOhaengColor(m.stem);
                            const stemKor = STEM_KOR[m.stem] || m.stem;
                            const branchKor = ZHI_KOR[m.branch] || m.branch;

                            return (
                              <div 
                                key={idx} 
                                onClick={() => setSelectedMilestone({ ...m, ohaengName: ohaeng.name })}
                                className={`flex flex-col items-center gap-1.5 relative ${gridClass} group/node cursor-pointer active:scale-95 transition-all`}
                                title="클릭 시 상세 해설"
                              >
                                {m.is_active && (
                                  <div className="absolute inset-0 -m-3 bg-blue-500/15 rounded-full blur-md animate-pulse pointer-events-none" />
                                )}

                                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 transition-all relative ${ohaeng.glow} ${
                                  m.is_active 
                                    ? `${ohaeng.activeBg} border-white text-slate-950 font-black scale-110 shadow-lg shadow-blue-500/20 group-hover/node:scale-115` 
                                    : `bg-slate-950 hover:bg-slate-900 hover:border-white ${ohaeng.border} ${ohaeng.text} group-hover/node:scale-105`
                                }`}>
                                  <span className={`text-[7px] font-bold tracking-tight opacity-75 ${m.is_active ? 'text-slate-900' : 'text-slate-500'}`}>{m.year}</span>
                                  <span className="text-sm font-black tracking-tighter flex items-center gap-0.5 mt-0.5">
                                    <span>{m.stem}{m.branch}</span>
                                  </span>
                                  <span className={`text-[8px] font-extrabold ${m.is_active ? 'text-slate-950' : 'text-slate-400'} opacity-90 scale-90`}>
                                    ({stemKor}{branchKor})
                                  </span>
                                </div>

                                <div className="text-center">
                                  <div className="text-[10px] font-black text-slate-300">{m.age}세 대운</div>
                                  <div className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full mt-1 ${
                                    m.is_active 
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30 font-black' 
                                      : 'bg-white/5 text-slate-500 border border-white/5'
                                  }`}>
                                    {m.label} ({m.score}점)
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 rounded-2xl">
                    <div className="flex gap-2 items-center mb-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-bold text-purple-300">MBSR / MBCT 가이드</span>
                      <h4 className="text-xs font-bold text-white">타이밍 극복을 위한 마음챙김</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{reportData.part1.mbsr_coaching}</p>
                  </div>
                </motion.div>
              )}

              {/* Part 2. 마인드 디버깅 */}
              {activeTab === 2 && reportData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4"
                >
                  <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl">
                    <div className="flex gap-1.5 items-center mb-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[9px] font-bold text-blue-400">CBT & DBT 통합 디버깅</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{reportData.part2.content}</p>
                  </div>

                  {/* 질문 카드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 재귀적 질문 */}
                    <div className="bg-slate-950/70 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
                      <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        재귀적 질문 (Recursive Inquiry)
                      </div>
                      <h5 className="text-sm font-extrabold text-white mb-2 font-serif">"{reportData.part2.recursive_question.question}"</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{reportData.part2.recursive_question.guide}</p>
                    </div>

                    {/* 메타 질문 */}
                    <div className="bg-slate-950/70 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
                      <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        메타 질문 (Meta Perspective)
                      </div>
                      <h5 className="text-sm font-extrabold text-white mb-2 font-serif">"{reportData.part2.meta_question.question}"</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{reportData.part2.meta_question.guide}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Part 3. 관계의 기술 */}
              {activeTab === 3 && reportData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4"
                >
                  <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl">
                    <div className="flex gap-1.5 items-center mb-2">
                      <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-[9px] font-bold text-pink-400">MSC (자기 연민) 소통학</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{reportData.part3.content}</p>
                  </div>

                  {/* 소크라테스 질문 */}
                  <div className="bg-slate-950/70 border border-pink-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />
                    <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      소크라테스 질문 (Socratic Inquiry)
                    </div>
                    <h5 className="text-sm font-extrabold text-white mb-2 font-serif">"{reportData.part3.socratic_question.question}"</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{reportData.part3.socratic_question.guide}</p>
                  </div>
                </motion.div>
              )}

              {/* Part 4. 실천의 시작 & 마스터의 편지 */}
              {activeTab === 4 && reportData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-5"
                >
                  {/* 개운법 */}
                  <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                      🔮 오행 균형 회복 개운법
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{reportData.part4.ohaeng_remedy}</p>
                  </div>

                  {/* ACT 가이드 */}
                  <div className="bg-slate-950/60 border border-emerald-500/20 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                      🏃 ACT (수용 전념) 가치 전념 실천 계획
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{reportData.part4.act_action_plan}</p>
                  </div>

                  {/* 알아차림 질문 */}
                  <div className="bg-slate-950/70 border border-indigo-500/20 rounded-2xl p-5">
                    <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      알아차림의 알아차림 (Awareness of Awareness) - 메타코드
                    </div>
                    <h5 className="text-sm font-extrabold text-white mb-2 font-serif">"{reportData.part4.awareness_question.question}"</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{reportData.part4.awareness_question.guide}</p>
                  </div>

                  {/* 마스터 편지 트리거 */}
                  <div className="pt-2">
                    {!showLetter ? (
                      <button
                        onClick={() => setShowLetter(true)}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:from-amber-500 hover:to-amber-700"
                      >
                        <Mail className="w-4 h-4 text-slate-950 animate-bounce" />
                        <span> 마스터의 감동 손편지 개봉하기 💌</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-[#1a1612] border border-amber-500/40 rounded-2xl shadow-inner relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
                        <h4 className="text-sm font-bold text-amber-300 mb-4 flex items-center justify-between border-b border-amber-500/20 pb-2">
                          <span>{reportData.part4.master_letter.title}</span>
                          <button
                            onClick={() => setShowLetter(false)}
                            className="text-xs text-slate-500 hover:text-slate-300"
                          >
                            접기
                          </button>
                        </h4>
                        <p className="text-xs md:text-sm text-amber-100/90 leading-loose whitespace-pre-wrap font-serif select-none">
                          {reportData.part4.master_letter.letter}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Myeongsim Premium 5-Part Integration Report v1.0</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all duration-150"
            >
              마인드 가이드 저장 완료
            </button>
          </div>
        </div>
      </motion.div>

      {/* 💰 재산 흐름 곡선 상세 팝업 모달 */}
      <AnimatePresence>
        {showWealthModal && reportData && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">Detailed Wealth Analysis</span>
                  <h3 className="text-lg font-black text-white">{userName}님의 재물 파동 상세 해석</h3>
                </div>
                <button
                  onClick={() => setShowWealthModal(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 수치 요약 */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-white/5 text-center">
                {(() => {
                  const wFlow = (reportData.part1 as any)?.wealth_flow || { values: [55, 80, 45, 95] };
                  const labels = wFlow.labels || ["현재", "10년 뒤", "20년 뒤", "30년 뒤"];
                  return (wFlow.values || [55, 80, 45, 95]).map((val: number, i: number) => (
                    <div key={i}>
                      <div className="text-[9px] text-slate-500 font-bold">{labels[i]}</div>
                      <div className="text-sm font-black text-amber-400 mt-0.5">{val}%</div>
                    </div>
                  ));
                })()}
              </div>

              {/* 시적 은유법의 감동 분석 에세이 */}
              <div className="text-xs text-slate-300 leading-relaxed space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-amber-500/10">
                <p className="font-medium text-amber-200">
                  🌱 "재물이라는 강물은 밀려오는 때가 있으면, 잠시 굽이치며 숨을 고르는 썰물의 골짜기가 있습니다."
                </p>
                <p>
                  사용자님의 재산 곡선은 우주적 호흡에 맞춰 흐르고 있습니다. 수치가 상승하는 구간은 곡식들이 따스한 가을 햇살 아래 스스로 영글어 창고로 굴러 들어오는 **'황금의 계절'**입니다. 
                </p>
                <p>
                  반면 수치가 다소 조정을 겪는 골짜기 구간은 결코 쇠락의 시기가 아닙니다. 이는 다음 더 풍요로운 봄에 엄청난 싹을 틔워내기 위해, 대지가 차가운 눈불 아래 영양분을 축적하는 **'사색과 준비의 겨울'**과 같습니다.
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  * {(reportData.part1 as any)?.wealth_flow?.description || '시기별 재산 운의 파동에 따른 맞춤형 관리와 투자 밸런스가 중요한 열쇠입니다.'}
                </p>
              </div>

              {/* 마음 디버깅 솔루션 */}
              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-2xl flex gap-2.5 items-start">
                <Heart className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-black text-purple-300">재물 불안에 대처하는 마음챙김 (MBSR)</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    수치에 연연하여 미래의 불안에 잠식되지 마세요. 재물 파동의 썰물이 찾아올 때는 호흡을 멈추고 고요한 이 순간의 실존적 풍요로움을 알아차리는 훈련이 필요합니다.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWealthModal(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                지혜의 지침을 품고 돌아가기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🧭 대운 구슬 상세 팝업 모달 */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-blue-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.25)] space-y-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Destiny Milestone Card</span>
                  <h3 className="text-lg font-black text-white">
                    🧭 {selectedMilestone.age}세 평생 대운 심층 풀이
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 대운 상세 정보 태그 */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-black bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full">
                  대운 간지: {selectedMilestone.stem}{selectedMilestone.branch} ({selectedMilestone.stem}{selectedMilestone.branch} 대운)
                </span>
                <span className="px-3 py-1 text-xs font-black bg-slate-800 text-slate-300 rounded-full">
                  시작년도: {selectedMilestone.year}년
                </span>
                <span className="px-3 py-1 text-xs font-black bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full">
                  {selectedMilestone.label} ({selectedMilestone.score}점)
                </span>
              </div>

              {/* 오행 정보 */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">작용하는 오행 에너지</span>
                <span className="text-xs text-blue-400 font-extrabold">{selectedMilestone.ohaengName || '조화로운 기운'}</span>
              </div>

              {/* 은유와 비유가 가득한 다정한 해석 */}
              <div className="text-xs text-slate-300 leading-relaxed space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-blue-500/10">
                <p className="font-semibold text-blue-200">
                  🍁 "계절은 서둘러 피지 않고, 정해진 길을 묵묵히 걸어 꽃과 단풍을 피워냅니다."
                </p>
                <p>
                  사용자님의 **{selectedMilestone.age}세 대운**은 인생의 지도 위에 **'{selectedMilestone.label}'**의 깃발을 꽂는 의미 있는 약속의 시간입니다. 
                </p>
                <p>
                  이 10년은 차가웠던 땅속에서 마침내 튼튼한 씨앗이 껍질을 뚫고 올라와, 하늘을 향해 힘차게 잎을 뻗는 **'도약과 자각의 시간'**이 될 것입니다. 점수 {selectedMilestone.score}점의 에너지가 증명하듯, 사용자님의 내면의 주권은 흔들림 없이 튼튼하게 중심을 지키고 있습니다.
                </p>
                <p className="text-[11px] text-slate-400">
                  비록 가끔 비바람이 불어올지라도, 그 비바람마저도 더 깊은 뿌리를 내리기 위한 자연의 다정한 선물임을 기억해 주세요. 
                </p>
              </div>

              {/* 코칭 팁 */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex gap-2.5 items-start">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-black text-emerald-300">이 10년을 대하는 실천 행동 강령 (ACT)</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    불안을 억지로 제거하려 분투하지 마세요. {selectedMilestone.label}의 기류 속에서 자신이 진정으로 가치 있게 생각하는 행동을 정해 한 걸음씩 묵묵히 나아가는 수용전념 가이드이 필요한 시기입니다.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                우주적 타이밍을 마음에 새기고 닫기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
