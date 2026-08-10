'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useReportStore } from '@/store/useReportStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  Compass, 
  Activity, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Home, 
  RefreshCw 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { playTechBeep, playSuccessChime } from '@/utils/sfx';
import { useLanguage } from '@/contexts/LanguageContext';

interface AlignmentAnalysis {
  structure_type: '정격' | '종격';
  korean_name: string;
  polarization_score: number;
  myeongri_analysis: string;
  mental_strategy: string;
  crystal_mantra: string;
  daily_tuning_action: string;
}

interface SajuData {
  fourPillars: any;
  dayMaster: string;
  elementCounts: Record<string, number>;
}

export default function AlignmentPage() {
  const router = useRouter();
  const { reportData } = useReportStore();
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saju, setSaju] = useState<SajuData | null>(null);
  const [analysis, setAnalysis] = useState<AlignmentAnalysis | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // 1. 유저 정보 조회 및 API 호출
  useEffect(() => {
    const fetchAlignment = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // DB의 users 테이블에서 메인 생년월일 및 정보 최우선 조회
        let dbUser: any = null;
        try {
          const { data, error } = await supabase
            .from('users')
            .select('birth_date, birth_time, calendar_type, gender, name')
            .eq('id', session.user.id)
            .single();
          
          if (!error && data) {
            dbUser = data;
          }
        } catch (dbErr) {
          console.warn("Failed to fetch user profile from DB, using session fallback:", dbErr);
        }

        const meta = session.user.user_metadata || {};
        
        // [우선순위 재정렬] 1순위: 클라이언트 전역 스토어(reportData) / 2순위: DB users 테이블 / 3순위: 세션 메타데이터
        const storeSaju = (reportData?.saju || {}) as any;
        const storeMeta = (reportData?.meta || {}) as any;

        const effectiveName = reportData?.userName || dbUser?.name || meta.userName || meta.name || '사용자';
        const effectiveBirthDate = reportData?.birthDate || dbUser?.birth_date || meta.birth_date || storeSaju?.birthDate || (reportData as any)?.birthDate;
        const effectiveBirthTime = reportData?.birthTime || dbUser?.birth_time || meta.birth_time || storeSaju?.birthTime || (reportData as any)?.birthTime || '12:00';
        const effectiveCalendarType = storeMeta?.calendarType || dbUser?.calendar_type || meta.calendar_type || storeSaju?.calendarType || (reportData as any)?.calendarType || 'solar';
        const effectiveGender = reportData?.gender || dbUser?.gender || meta.gender || storeSaju?.gender || (reportData as any)?.gender || 'male';

        const profile = {
          userId: session.user.id,
          userName: effectiveName,
          birthDate: effectiveBirthDate,
          birthTime: effectiveBirthTime === 'unknown' ? '12:00' : effectiveBirthTime,
          calendarType: effectiveCalendarType,
          gender: effectiveGender,
        };

        setUserProfile(profile);

        if (!profile.birthDate) {
          setErrorMsg('사주 생년월일 정보가 존재하지 않습니다. 프로필을 먼저 등록해 주세요.');
          setIsLoading(false);
          return;
        }

        setIsAnalyzing(true);
        const res = await fetch('/api/coaching/alignment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...profile,
            locale: language
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '격국 분석 API 호출 중 에러가 발생했습니다.');

        setSaju(data.saju);
        setAnalysis(data.analysis);
        playSuccessChime();
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || '격국 분석 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
        setIsAnalyzing(false);
      }
    };

    fetchAlignment();
  }, [router, reportData]);

  // 오행 컬러 맵
  const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    목: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    화: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
    토: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    금: { bg: 'rgba(156, 163, 175, 0.15)', text: '#e5e7eb', border: 'rgba(156, 163, 175, 0.3)' },
    수: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#05070a] flex flex-col justify-center items-center gap-4 text-white font-mono">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-xs text-gray-400 animate-pulse tracking-widest uppercase">명심 격국 연금술 알고리즘 분석 중...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-gradient-to-b from-[#05070a] to-[#0a0d17] text-white flex flex-col pb-28 select-none overflow-x-hidden scanline-bg">
      {/* Decorative Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[380px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none z-0 animate-aura-breath"></div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full h-[280px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none z-0 animate-aura-breath" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-white/5 backdrop-blur-md bg-black/10">
        <button 
          onClick={() => router.push('/master-core')}
          className="p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 font-mono text-neon-cyan">
          GEOPGUK ALCHEMY
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-5 py-6 space-y-6">
        
        {errorMsg ? (
          /* Error State */
          <div className="bg-[#0f111a] border border-red-500/20 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed break-keep">{errorMsg}</p>
            <button
              onClick={() => router.push('/report')}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold transition-all"
            >
              생년월일 등록하러 가기
            </button>
          </div>
        ) : (
          /* Active Analysis View */
          <AnimatePresence mode="wait">
            {analysis && saju && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                
                {/* 1. 격국 판독 메인 카드 */}
                <motion.div 
                   whileHover={{ scale: 1.01, y: -2 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="relative overflow-hidden bg-gradient-to-br from-[#0d1020]/90 to-[#121630]/85 border border-violet-500/30 rounded-3xl p-6 shadow-2xl shadow-neon-violet backdrop-blur-md cursor-pointer"
                 >
                  {/* Subtle 3D Grid Decorative lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-violet-400 font-mono uppercase bg-violet-950/40 border border-violet-800/30 px-2.5 py-1 rounded-full">
                      격국 판독 시스템
                    </span>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                      className="text-xl opacity-75"
                    >
                      ☯️
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xs text-gray-400 font-medium">{userProfile?.userName || '사용자'}님의 사주 격국</h2>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-100">
                        {analysis.korean_name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                        analysis.structure_type === '정격' 
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/20' 
                          : 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/20'
                      }`}>
                        {analysis.structure_type}
                      </span>
                    </div>
                  </div>

                  {/* 일간 소개 */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>나의 태생적 일간(본질)</span>
                    <span className="font-bold text-white px-2 py-1 rounded bg-white/5 border border-white/10">{saju.dayMaster}</span>
                  </div>
                </motion.div>

                {/* 2. 오행 에너지 쏠림도 & 분포 차트 */}
                <div className="bg-[#0b0e1a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-cyan-400" />
                    <h3 className="text-xs font-bold tracking-wider font-mono text-cyan-400 uppercase">오행 에너지 쏠림 인덱스</h3>
                  </div>

                  {/* 쏠림도 게이지 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">오행 평탄화 (정격)</span>
                      <span className="font-mono font-bold text-cyan-400">{analysis.polarization_score}%</span>
                      <span className="text-gray-400">특수 오행 쏠림 (종격)</span>
                    </div>
                    
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.polarization_score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-violet-500 to-indigo-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 text-center leading-relaxed break-keep">
                      * 점수가 높을수록 한 오행의 세력이 거대하여 나를 비우고 세력에 순응(종격)해야 함을 뜻합니다.
                    </p>
                  </div>

                  {/* 오행 갯수 디스플레이 */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {Object.entries(saju.elementCounts).map(([el, count]) => {
                      const style = ELEMENT_COLORS[el] || { bg: 'rgba(255,255,255,0.05)', text: '#fff', border: 'rgba(255,255,255,0.1)' };
                      return (
                        <div 
                          key={el}
                          style={{ backgroundColor: style.bg, borderColor: style.border }}
                          className="border rounded-xl p-2.5 text-center flex flex-col items-center gap-1.5"
                        >
                          <span style={{ color: style.text }} className="text-xs font-black">{el}</span>
                          <span className="text-sm font-black font-mono">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. 명리 분석 & 멘탈 가이드 전략 */}
                <div className="space-y-4">
                  <div className="bg-[#0b0e1a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Compass size={16} className="text-violet-400" />
                      <h3 className="text-xs font-bold tracking-wider font-mono text-violet-400 uppercase">기운의 형세 분석</h3>
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed break-keep markdown-container">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-extrabold text-violet-300">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        }}
                      >
                        {analysis.myeongri_analysis}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="bg-[#0b0e1a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-amber-400" />
                      <h3 className="text-xs font-bold tracking-wider font-mono text-amber-400 uppercase">내면 파도 타기 전략</h3>
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed break-keep markdown-container">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-extrabold text-amber-300">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        }}
                      >
                        {analysis.mental_strategy}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* 4. 참거울 메타코드 선언문 */}
                <div className="relative overflow-hidden bg-gradient-to-r from-violet-950/20 to-indigo-950/20 border border-violet-500/20 rounded-3xl p-6 text-center space-y-4">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-violet-500/10 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles size={12} className="text-violet-400 animate-pulse" />
                    <span className="text-[9px] font-bold tracking-widest text-violet-400 font-mono uppercase">MIND REBOOT MANTRA</span>
                    <Sparkles size={12} className="text-violet-400 animate-pulse" />
                  </div>

                  <blockquote className="text-sm md:text-base font-extrabold text-indigo-100 leading-relaxed italic break-keep px-2">
                    "{analysis.crystal_mantra}"
                  </blockquote>
                </div>

                {/* 5. 오늘의 기운 조율 리셋 액션 */}
                <div className="bg-[#0c1224]/50 border border-indigo-500/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <h3 className="text-xs font-bold tracking-wider font-mono text-emerald-400 uppercase">오늘의 에너지 조율 액션</h3>
                  </div>
                  
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">🌱</span>
                    <div className="text-xs text-gray-300 leading-relaxed break-keep markdown-container w-full">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-extrabold text-emerald-300">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        }}
                      >
                        {analysis.daily_tuning_action}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* 6. 홈 및 리셋 메뉴 버튼 */}
        <div className="pt-4 flex gap-3 justify-center">
          <motion.button
            onClick={() => {
              playTechBeep();
              router.push('/master-core');
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>이전으로</span>
          </motion.button>
          
          <motion.button
            onClick={() => {
              playTechBeep();
              router.push('/report');
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-950/30 cursor-pointer"
          >
            <Home size={14} />
            <span>메인화면으로</span>
          </motion.button>
        </div>

      </main>
    </div>
  );
}
