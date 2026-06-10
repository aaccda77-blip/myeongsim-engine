'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, Heart, ShieldAlert, Zap, BookOpen, Compass, Mail, Loader2, ArrowRight, Layers } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

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
              <div className="text-xs text-slate-500">CBT, DBT, ACT, MBSR 치료법과 다크/뉴럴 코드를 조율 중입니다.</div>
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
                  <div className="p-5 bg-[#171412] border border-amber-600/30 rounded-3xl space-y-4 relative overflow-hidden shadow-[inset_0_0_20px_rgba(217,119,6,0.05)]">
                    <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                      <div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Wealth Trend</span>
                        <h4 className="text-sm font-black text-amber-100">{userName}님의 평생 자산규모 (시기별 재산 흐름)</h4>
                      </div>
                      <span className="text-[10px] text-amber-500/70 font-semibold bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded-full">정통 재물운 풀이</span>
                    </div>

                    {/* SVG Curve Graph with Grid Background */}
                    <div className="w-full relative bg-[#0f0d0c] border border-amber-500/10 rounded-2xl p-4 overflow-hidden h-[240px]">
                      <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                        <defs>
                          {/* 격자 무늬 패턴 */}
                          <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(217, 119, 6, 0.05)" strokeWidth="1" />
                          </pattern>
                          {/* 그라데이션 채우기 */}
                          <linearGradient id="wealth-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
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
                              {/* Curve Stroke */}
                              <path d={pathData} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />

                              {/* Horizontal Guide Lines */}
                              <line x1="40" y1="40" x2="460" y2="40" stroke="rgba(217, 119, 6, 0.1)" strokeDasharray="3,3" />
                              <line x1="40" y1="95" x2="460" y2="95" stroke="rgba(217, 119, 6, 0.1)" strokeDasharray="3,3" />
                              <line x1="40" y1="150" x2="460" y2="150" stroke="rgba(217, 119, 6, 0.1)" strokeDasharray="3,3" />

                              {/* Nodes & Text Labels */}
                              {[
                                { x: x1, y: y1, val: valArray[0], label: '현재' },
                                { x: x2, y: y2, val: valArray[1], label: '10년 뒤' },
                                { x: x3, y: y3, val: valArray[2], label: '20년 뒤' },
                                { x: x4, y: y4, val: valArray[3], label: '30년 뒤' }
                              ].map((node, i) => (
                                <g key={i} className="group/node">
                                  <circle cx={node.x} cy={node.y} r="10" fill="rgba(217,119,6,0.15)" className="animate-ping" style={{ animationDuration: '3s' }} />
                                  <circle cx={node.x} cy={node.y} r="5" fill="#171412" stroke="#d97706" strokeWidth="3" />
                                  
                                  <foreignObject x={node.x - 30} y={node.y - 32} width="60" height="24">
                                    <div className="bg-amber-950/90 border border-amber-500/40 rounded px-1 py-0.5 text-[9px] font-extrabold text-amber-200 text-center shadow-md">
                                      {node.label}
                                    </div>
                                  </foreignObject>
                                  
                                  <text x={node.x} y={node.y + 18} fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
                                    {node.val}%
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                    <p className="text-[11px] text-amber-200/70 leading-relaxed font-medium pl-1 italic">
                      * {(reportData.part1 as any)?.wealth_flow?.description || '시기별 재산 운의 파동에 따른 맞춤형 관리와 투자 밸런스가 중요한 열쇠입니다.'}
                    </p>
                  </div>

                  {/* 나의 대운 흐름 S자 타임라인 */}
                  <div className="p-5 bg-[#121417] border border-blue-900/30 rounded-3xl space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Daewoon Cycle</span>
                        <h4 className="text-sm font-black text-slate-100">나의 평생 대운 흐름 (S자 운명 궤적)</h4>
                      </div>
                      <span className="text-[10px] text-blue-400 bg-blue-500/5 border border-blue-500/20 px-2 py-0.5 rounded-full">10년 대운 주기</span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {(reportData.part1 as any)?.daewoon_flow?.cycle_description || `${userName}님의 대운 주기는 다음과 같이 인생의 격변점과 전환기를 형성합니다.`}
                    </p>

                    {/* S-curve Layout Grid container */}
                    <div className="relative bg-slate-950/70 border border-white/5 rounded-2xl p-6 overflow-hidden min-h-[300px]">
                      {/* S-shaped Connective Line via SVG absolute underlay */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 280">
                        <path 
                          d="M 75 60 C 200 60, 200 60, 325 60 C 350 60, 350 140, 325 140 C 200 140, 200 140, 200 140 L 75 140 C 50 140, 50 220, 75 220 C 200 220, 200 220, 325 220" 
                          fill="none" 
                          stroke="rgba(96, 165, 250, 0.15)" 
                          strokeWidth="3" 
                          strokeDasharray="5,5" 
                        />
                      </svg>

                      {/* Daewoon Grid Nodes Mapping (S-curve mapping to Grid Rows & Columns) */}
                      <div className="grid grid-cols-3 gap-y-12 relative z-10">
                        {(() => {
                          const dwFlow = (reportData.part1 as any)?.daewoon_flow || { milestones: [] };
                          const milestones = dwFlow.milestones && dwFlow.milestones.length > 0
                            ? dwFlow.milestones
                            : [
                                { year: 1996, age: 17, stem: '庚', branch: '戌', score: 40, is_active: false, label: '과도기' },
                                { year: 2006, age: 27, stem: '己', branch: '酉', score: 60, is_active: false, label: '준비기' },
                                { year: 2016, age: 37, stem: '戊', branch: '申', score: 75, is_active: false, label: '도약기' },
                                { year: 2026, age: 47, stem: '丁', branch: '未', score: 90, is_active: true, label: '황금기' },
                                { year: 2036, age: 57, stem: '丙', branch: '午', score: 65, is_active: false, label: '안정기' },
                                { year: 2046, age: 67, stem: '乙', branch: '巳', score: 50, is_active: false, label: '성숙기' },
                                { year: 2056, age: 77, stem: '甲', branch: '辰', score: 80, is_active: false, label: '수확기' }
                              ];

                          const colStartClasses = [
                            'col-start-1 justify-self-center', // 0
                            'col-start-2 justify-self-center', // 1
                            'col-start-3 justify-self-center', // 2
                            'col-start-3 justify-self-center', // 3 (2026)
                            'col-start-2 justify-self-center', // 4 (2036)
                            'col-start-1 justify-self-center', // 5 (2046)
                            'col-start-2 justify-self-center', // 6 (2056)
                            'col-start-3 justify-self-center'  // 7
                          ];

                          return milestones.map((m: any, idx: number) => {
                            const gridClass = colStartClasses[idx] || 'justify-self-center';
                            return (
                              <div key={idx} className={`flex flex-col items-center gap-1.5 relative ${gridClass}`}>
                                {m.is_active && (
                                  <div className="absolute inset-0 -m-3 bg-blue-500/10 rounded-full blur-lg animate-pulse" />
                                )}

                                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 transition-all relative ${
                                  m.is_active 
                                    ? 'bg-blue-600 border-blue-400 text-white font-black shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-110' 
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                }`}>
                                  <span className="text-[8px] font-bold opacity-75">{m.year}</span>
                                  <span className="text-xs font-black tracking-tight">{m.stem}{m.branch}</span>
                                </div>

                                <div className="text-center">
                                  <div className="text-[10px] font-extrabold text-slate-300">{m.age}세 대운</div>
                                  <div className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full mt-0.5 ${
                                    m.is_active 
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
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
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-bold text-purple-300">MBSR / MBCT 처방</span>
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

                  {/* ACT 처방 */}
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
    </div>
  );
}
