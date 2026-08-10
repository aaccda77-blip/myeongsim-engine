'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, BookOpen, Compass, ShieldAlert, Coins, HelpCircle } from 'lucide-react';
import { playTechBeep, playSuccessChime, playScanPulse } from '@/utils/sfx';
import { useLanguage } from '@/contexts/LanguageContext';

interface GeniusReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

interface GeniusReportData {
  forceField: { analysis: string; open_points: string; receptive_points: string };
  myeongsimAlgorithm: { talents: string[]; dynamic_expression: string };
  positioning: { role_name: string; influence_desc: string; environmental_sync: string };
  decisionFilter: { mechanism: string; brain_science_tip: string; recommendation: string };
  prosperity: { financial_type: string; behavioral_economics: string; stress_reduction_tip: string };
  stressShift: { vulnerability: string; cbt_mission: string; recovery_action: string };
}

export default function GeniusReportModal({ isOpen, onClose, userProfile }: GeniusReportModalProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<GeniusReportData | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // 로딩 진행바 애니메이션
  useEffect(() => {
    if (loading && isOpen) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 35);
      return () => clearInterval(interval);
    }
  }, [loading, isOpen]);

  // API 데이터 페칭
  useEffect(() => {
    if (!isOpen) return;

    const fetchGeniusReport = async () => {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);

      // 스캔 효과음 울리기
      playScanPulse();

      try {
        const response = await fetch('/api/coaching/genius', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userProfile?.id,
            birthDate: userProfile?.birthDate || userProfile?.birthDateString,
            birthTime: userProfile?.birthTime,
            calendarType: userProfile?.calendarType || 'solar',
            gender: userProfile?.gender || 'male',
            userName: userProfile?.userName || '명심가',
            locale: language,
          }),
        });

        if (!response.ok) {
          throw new Error('천부 성정 데이터를 로드하는 중 에러가 발생했습니다.');
        }

        const data = await response.json();
        if (data.success && data.geniusReport) {
          setReportData(data.geniusReport);
          // 성공 아르페지오 차임 소리
          playSuccessChime();
        } else {
          throw new Error(data.error || '리포트 생성 실패');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || '알 수 없는 네트워크 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchGeniusReport();
  }, [isOpen, userProfile, language]);

  if (!isOpen) return null;

  // 탭 클릭 핸들러 (햅틱 비프음 재생)
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    playTechBeep();
  };

  // 도움말 매핑 정보 (전통 명리 - 현대 심리/뇌과학 융합 용어 설명)
  const HELP_DETAILS = [
    {
      title: '🌌 명심 에너지 포스필드',
      desc: '동양 사주의 오행(나무, 불, 흙, 쇠, 물)과 나를 돕는 기운(비겁, 인성), 세상으로 뻗어 나가는 기운(식상, 재성, 관성)의 역학 관계를 3D 지형도로 모델링한 기운 맵입니다. 내가 세상에 에너지를 발산하는 "주체적 영역"과 타인과 공명하고 흡수하는 "수용적 영역"의 분포를 뇌과학적 관점에서 함께 설명합니다.'
    },
    {
      title: '🧬 타고난 명심 알고리즘',
      desc: '내가 태어날 때 코딩된 고유한 정신적 기질과 성정(십신)을 뜻합니다. 식상(창조와 몰입), 관성(조직과 통제), 재성(구조와 실현)이 내 두뇌 인지 시스템에서 어떤 특별한 강점과 재능으로 작동하는지 분석합니다.'
    },
    {
      title: '🪐 기운적 포지셔닝',
      desc: '내가 다른 사람들과 얽힐 때(조직, 관계, 사회) 무의식적으로 발휘하는 사회적 에너지 장과 영향력입니다. 사주의 관성과 비겁이 빚어내는 역학 관계를 통해, 당신이 속한 그룹 안에서 가장 편안하고 강력하게 상생하는 위치를 잡아줍니다.'
    },
    {
      title: '🧭 명심 의사결정 필터',
      desc: '사주에서 지혜와 생각을 뜻하는 "인성"과 현실적인 성과를 뜻하는 "재성"의 비율을 분석합니다. 나의 인지적 필터가 감각/직관 위주로 작동하는지, 아니면 실질적인 논리와 분석으로 움직이는지 뇌과학적 스트레스 반응과 연계해 올바른 의사결정 모형을 제시합니다.'
    },
    {
      title: '🪙 풍요 알고리즘',
      desc: '사주 명리에서 재물을 뜻하는 정재와 편재의 패턴을 현대의 행동경제학과 결합하여 나의 돈에 대한 무의식적 불안과 투자 유형을 분석합니다. 소비와 자산의 흐름을 인지할 때 뇌의 스트레스를 최소화하는 법을 안내합니다.'
    },
    {
      title: '🚨 스트레스 시프트 모드',
      desc: '과도한 부하나 스트레스가 닥쳤을 때 나도 모르게 오작동하게 되는 정신 회로(인지 왜곡)를 사주 기운의 결핍/과다와 결합해 분석합니다. 이후 인지행동코칭(CBT)와 수용전념코칭(ACT)에 기반한 "10분 리부트 패치" 미션을 제공하여 에너지를 정상으로 돌려놓습니다.'
    }
  ];

  const tabs = [
    { label: '에너지 포스필드', icon: '🌌' },
    { label: '천부 알고리즘', icon: '🧬' },
    { label: '기운 포지셔닝', icon: '🪐' },
    { label: '의사결정 필터', icon: '🧭' },
    { label: '풍요 알고리즘', icon: '🪙' },
    { label: '스트레스 시프트', icon: '🚨' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-2xl bg-[#090D1A]/95 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col h-[85vh] md:h-[80vh] text-white"
      >
        {/* 네온 장식 백그라운드 아우라 */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

        {/* 헤더 */}
        <header className="flex items-center justify-between p-5 border-b border-white/5 bg-white/2 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">🧬</span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200">
                명심 천부 성정 리포트
              </h2>
              <p className="text-[10px] text-indigo-300 font-semibold font-mono tracking-wider uppercase">
                Myeongsim OS / Traditional Saju & Cognitive Science Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 도움말 토글 */}
            <button
              onClick={() => {
                setShowHelp(!showHelp);
                playTechBeep();
              }}
              className={`p-2 rounded-xl transition-all border ${
                showHelp 
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
              title="도움말 열기"
            >
              <HelpCircle size={18} />
            </button>

            {/* 닫기 */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* 메인 로딩 화면 */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-ping scale-75"></div>
              <Loader2 size={40} className="text-indigo-400 animate-spin relative" />
            </div>
            <h3 className="text-base font-bold text-indigo-200 mb-2">천부 알고리즘 해독 및 기운 동기화 중</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed mb-6 break-keep">
              생년월일 기반의 오행 주파수를 스캔하여 현대 뇌과학/심리학적 인지 렌즈로 연성 리포트를 생성하는 중입니다.
            </p>
            
            {/* 프로그레시브 로딩바 */}
            <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-indigo-400 font-mono mt-2">{loadingProgress}% COMPLETE</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl mb-4">
              <ShieldAlert className="text-red-400" size={32} />
            </div>
            <h3 className="text-base font-bold text-red-200 mb-2">리포트 해독 실패</h3>
            <p className="text-xs text-red-400/80 max-w-sm mx-auto mb-6 break-keep">{error}</p>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all"
            >
              창 닫기
            </button>
          </div>
        ) : (
          <>
            {/* 초보자용 가이드 배너 (도움말이 켜졌을 때 상단에 슬라이드 인) */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-indigo-950/80 border-b border-indigo-500/20 px-6 py-4 overflow-hidden relative z-20"
                >
                  <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-4 flex gap-3">
                    <div className="text-xl flex-shrink-0">💡</div>
                    <div>
                      <h4 className="text-xs font-extrabold text-indigo-200 mb-1">{HELP_DETAILS[activeTab].title} 명심 AI 코치 가이드</h4>
                      <p className="text-[11px] text-indigo-300/90 leading-relaxed break-keep">
                        {HELP_DETAILS[activeTab].desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 가로 탭 바 */}
            <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-white/5 bg-white/1 scrollbar-none relative z-10 select-none">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => handleTabClick(idx)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    activeTab === idx
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-200 shadow-inner'
                      : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 본문 콘텐츠 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto p-6 relative z-10 scrollbar-thin select-text">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="space-y-6"
                >
                  {/* 탭 1: 명심 에너지 포스필드 */}
                  {activeTab === 0 && reportData?.forceField && (
                    <div className="space-y-6">
                      <div className="bg-[#121829] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 text-4xl opacity-10">🌌</div>
                        <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-3">
                          <span>🪐</span> 기운의 전체 지형도 분석
                        </h3>
                        <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line break-keep font-medium">
                          {reportData.forceField.analysis}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 relative">
                          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
                            <span>🟢</span> 주체적 발현 지점 (Open wide)
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed break-keep">
                            {reportData.forceField.open_points}
                          </p>
                        </div>
                        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5 relative">
                          <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mb-2.5">
                            <span>🟣</span> 수용적 연결 지점 (Receptive)
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed break-keep">
                            {reportData.forceField.receptive_points}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 탭 2: 타고난 명심 알고리즘 */}
                  {activeTab === 1 && reportData?.myeongsimAlgorithm && (
                    <div className="space-y-6">
                      <div className="bg-[#121829] border border-white/5 rounded-2xl p-5">
                        <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-4">
                          <span>🧬</span> 3대 천부 성정 핵심 재능
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {reportData.myeongsimAlgorithm.talents.map((talent, i) => (
                            <div key={i} className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 text-center">
                              <span className="text-xs font-extrabold text-indigo-200">{talent}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#121829] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 text-4xl opacity-10">⚙️</div>
                        <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-3">
                          <span>🌀</span> 천부 성정의 역동적 흐름과 뇌과학
                        </h3>
                        <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line break-keep font-medium">
                          {reportData.myeongsimAlgorithm.dynamic_expression}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 탭 3: 기운적 포지셔닝 */}
                  {activeTab === 2 && reportData?.positioning && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5 text-center">
                        <span className="text-[10px] text-purple-300 font-bold tracking-widest uppercase">My Social Role</span>
                        <h3 className="text-lg font-black text-white mt-1">{reportData.positioning.role_name}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#121829] border border-white/5 rounded-2xl p-5">
                          <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2.5">
                            <span>👥</span> 무의식적 사회적 영향력
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed break-keep">
                            {reportData.positioning.influence_desc}
                          </p>
                        </div>
                        <div className="bg-[#121829] border border-white/5 rounded-2xl p-5">
                          <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2.5">
                            <span>🌱</span> 환경적 상생 동기화 프로토콜
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed break-keep">
                            {reportData.positioning.environmental_sync}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 탭 4: 명심 의사결정 필터 */}
                  {activeTab === 3 && reportData?.decisionFilter && (
                    <div className="space-y-6">
                      <div className="bg-[#121829] border border-white/5 rounded-2xl p-5">
                        <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-3">
                          <span>🧭</span> 인지적 조율 의사결정 메커니즘
                        </h3>
                        <p className="text-xs text-gray-200 leading-relaxed break-keep font-medium">
                          {reportData.decisionFilter.mechanism}
                        </p>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 relative">
                        <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                          <span>💡</span> 의사결정 뇌과학 튜닝 조언
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed break-keep">
                          {reportData.decisionFilter.brain_science_tip}
                        </p>
                      </div>

                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 relative">
                        <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mb-2">
                          <span>🎯</span> 의사결정 액션 권장사항
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed break-keep">
                          {reportData.decisionFilter.recommendation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 탭 5: 풍요 알고리즘 */}
                  {activeTab === 4 && reportData?.prosperity && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Financial Mindset</span>
                          <h3 className="text-base font-black text-white mt-0.5">{reportData.prosperity.financial_type}</h3>
                        </div>
                        <Coins size={36} className="text-amber-400 opacity-80" />
                      </div>

                      <div className="bg-[#121829] border border-white/5 rounded-2xl p-5">
                        <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-3">
                          <span>📈</span> 리스크 대처 및 행동경제학 패턴
                        </h3>
                        <p className="text-xs text-gray-200 leading-relaxed break-keep font-medium">
                          {reportData.prosperity.behavioral_economics}
                        </p>
                      </div>

                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                          <span>🧘</span> 뇌의 재정적 스트레스 감소 팁 (Cortisol Reset)
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed break-keep">
                          {reportData.prosperity.stress_reduction_tip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 탭 6: 스트레스 시프트 모드 */}
                  {activeTab === 5 && reportData?.stressShift && (
                    <div className="space-y-6">
                      <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                        <h3 className="text-sm font-black text-rose-400 flex items-center gap-2 mb-3">
                          <span>🚨</span> 스트레스 발생 시 취약 기운 & 인지 오류
                        </h3>
                        <p className="text-xs text-gray-200 leading-relaxed break-keep font-medium">
                          {reportData.stressShift.vulnerability}
                        </p>
                      </div>

                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 text-4xl opacity-10">🧘</div>
                        <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-2.5">
                          <span>🎯</span> CBT/ACT 융합 리부트 미션
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed break-keep">
                          {reportData.stressShift.cbt_mission}
                        </p>
                      </div>

                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                          <span>⚡</span> 번아웃 즉각 차단 액션 (10분 프로토콜)
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed break-keep">
                          {reportData.stressShift.recovery_action}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 푸터 버튼 */}
            <footer className="p-5 border-t border-white/5 bg-white/1 relative z-10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 text-xs font-bold transition-all duration-200 active:scale-95"
              >
                리포트 정독 완료
              </button>
              <button
                onClick={() => {
                  setShowHelp(!showHelp);
                  playTechBeep();
                }}
                className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{showHelp ? '명심 AI 코치 끄기' : '명심 AI 코치 가이드'}</span>
                <BookOpen size={14} />
              </button>
            </footer>
          </>
        )}
      </motion.div>
    </div>
  );
}
