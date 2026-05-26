'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Zap, Lock, Crown, ArrowRight, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DETAILED_COACHING_GUIDE } from '../../constants/detailedCoachingGuide';

/**
 * MetaFrequencyPanel.tsx
 * 의식 주파수 측정 프리미엄 패널 (Dark / Neural / Meta Code)
 * 
 * ⚠️ 독립 컴포넌트 — 기존 LiveSyncSection에 영향 없음
 */

interface MetaFrequencyPanelProps {
  sajuData: any;
  harmony: any;
  biorhythm: any;
  bio?: any;
  isPremium?: boolean;
}

type ConsciousnessLevel = 'dark' | 'neural' | 'meta';

const LEVEL_CONFIG = {
  dark: {
    label: '다크 코드', emoji: '🔻', color: '#ef4444',
    bg: 'bg-red-950/20', border: 'border-red-500/30', text: 'text-red-300',
    glow: 'shadow-red-500/20', metaphor: '구름에 가려진 태양',
    insight: '"이 패턴이 나야"라고 동일시된 상태',
  },
  neural: {
    label: '뉴럴 코드', emoji: '🔹', color: '#06b6d4',
    bg: 'bg-cyan-950/20', border: 'border-cyan-500/30', text: 'text-cyan-300',
    glow: 'shadow-cyan-500/20', metaphor: '구름이 걷힌 태양',
    insight: '패턴을 도구로 인식하고 활용하는 상태',
  },
  meta: {
    label: '메타 코드', emoji: '🚀', color: '#f59e0b',
    bg: 'bg-amber-950/20', border: 'border-amber-500/30', text: 'text-amber-300',
    glow: 'shadow-amber-500/20', metaphor: '태양을 즐기되 집착 없는 자유',
    insight: '하되 안 할 수도 있는 궁극의 자유',
  },
};

export default function MetaFrequencyPanel({ sajuData, harmony, biorhythm, bio, isPremium = true }: MetaFrequencyPanelProps) {
  const [dailyState, setDailyState] = useState<any>(null);
  const [aiReply, setAiReply] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ConsciousnessLevel | null>(null);
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    level: ConsciousnessLevel;
    label: string;
    emoji: string;
    tag: string;
    desc: string;
    tenGod: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 초기 로드: 오늘의 3계층 코드 가져오기 (일진은 서버에서 자동 계산)
  useEffect(() => {
    fetchFrequencyState();
  }, []);

  // bio 데이터가 변경되면, 서버에 다시 분석을 요청할지 여부는 판단 필요함 (일단은 초기 진입 시 + 측정 버튼 클릭 시에만 반영됨)
  
  const fetchFrequencyState = async (level?: ConsciousnessLevel) => {
    setIsLoading(true);
    try {
      const currentBio = bio || { stress: 55, hrv: 40, heartRate: 85 };
      const res = await fetch('/api/meta-frequency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedLevel: level,
          bio: currentBio,
          biorhythm,
          sajuData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDailyState(data.dailyState);
        if (level) {
          setAiReply(data.aiReply);
          setIsAnalyzed(true);
        }
      }
    } catch {
      // 에러 시 무시
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLevel = (level: ConsciousnessLevel) => {
    const code = level === 'dark' ? dailyState?.darkCode
               : level === 'neural' ? dailyState?.neuralCode
               : dailyState?.metaCode;
    
    // codeName에서 십성(예: '정재') 추출
    const match = dailyState?.codeName?.match(/\[오늘의 에너지:\s*([^\]]+)\]/);
    const tenGod = match ? match[1].trim() : '비견';

    if (selectedLevel === level) {
      // 이미 선택된 상태에서 한 번 더 누르면 -> 프리미엄 상세 해독 모달 팝업 오픈!
      if (code) {
        setModalData({
          level,
          label: LEVEL_CONFIG[level].label,
          emoji: LEVEL_CONFIG[level].emoji,
          tag: code.tag,
          desc: code.desc,
          tenGod
        });
        setIsModalOpen(true);
      }
    } else {
      setSelectedLevel(level);
      setIsDescExpanded(true); // 새로운 카드 선택 시 친절하게 펼쳐서 다 보여주기!
      setAiReply('');
      setIsAnalyzed(false);
      fetchFrequencyState(level);
    }
  };

  const handleRefresh = () => {
    setSelectedLevel(null);
    setAiReply('');
    setIsAnalyzed(false);
    fetchFrequencyState();
  };

  // 스크롤
  useEffect(() => {
    if (scrollRef.current && aiReply) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiReply]);

  // ─── 프리미엄 잠금 화면 ───
  if (!isPremium) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-[#0b1018] border border-amber-500/20 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
        <Lock className="w-10 h-10 text-amber-400/50 mx-auto mb-3" />
        <h3 className="text-[14px] font-bold text-amber-300 mb-2">🔒 의식 주파수 분석</h3>
        <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
          나의 다크/뉴럴/메타 코드를 실시간으로 측정하고<br />
          재귀적 자기질문으로 깊은 셀프 자각을 경험하세요
        </p>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-[12px] font-bold text-white hover:scale-105 transition-transform flex items-center gap-1.5 mx-auto">
          <Crown className="w-3.5 h-3.5" /> 프리미엄 시작하기
        </button>
      </motion.div>
    );
  }

  // ─── 메인 패널 ───
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0b1018] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* 배경 글로우 */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* ─── 헤더 ─── */}
      <div className="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="text-[12px] font-bold text-slate-200">의식 주파수 분석</span>
          <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-mono border border-amber-500/20">PREMIUM</span>
        </div>
        <button onClick={handleRefresh} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div ref={scrollRef} className="p-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">

        {/* ─── 오늘의 3계층 코드 카드 ─── */}
        {dailyState && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 font-mono">
                오늘의 일진: {dailyState.todayPillar} · {dailyState.codeName}
              </p>
              {dailyState.gongmang?.isTodayGongmang && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 animate-pulse">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                  <span className="text-[8px] font-bold text-indigo-300">공망 감지</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['dark', 'neural', 'meta'] as ConsciousnessLevel[]).map((level) => {
                const cfg = LEVEL_CONFIG[level];
                const code = level === 'dark' ? dailyState.darkCode
                           : level === 'neural' ? dailyState.neuralCode
                           : dailyState.metaCode;
                const isSelected = selectedLevel === level;
                return (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectLevel(level)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-300 ${
                      isSelected
                        ? `${cfg.bg} ${cfg.border} ring-1 ring-offset-1 ring-offset-[#0b1018]`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-[14px] mb-1">{cfg.emoji}</div>
                    <div className={`text-[9px] font-bold mb-0.5 ${isSelected ? cfg.text : 'text-slate-300'}`}>
                      {cfg.label}
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono">{code.tag}</div>
                    <div className={`text-[8px] text-slate-400 mt-1 leading-relaxed break-keep transition-all duration-300 ${
                      isSelected && isDescExpanded ? '' : 'line-clamp-2'
                    }`}>
                      {code.desc}
                    </div>
                    {isSelected && (
                      <div className="text-[7px] text-amber-400/80 block text-right mt-1.5 font-mono select-none opacity-90 animate-pulse">
                        ✨ 한 번 더 눌러 상세 처방
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── 주파수 게이지 바 ─── */}
        {selectedLevel && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-slate-500 font-mono">의식 주파수 스펙트럼</span>
              <span className={`text-[9px] font-bold ${LEVEL_CONFIG[selectedLevel].text}`}>
                {LEVEL_CONFIG[selectedLevel].emoji} {LEVEL_CONFIG[selectedLevel].label}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden relative">
              <div className="absolute inset-0 flex">
                <div className="w-1/3 bg-gradient-to-r from-red-600/60 to-red-500/30" />
                <div className="w-1/3 bg-gradient-to-r from-cyan-600/60 to-cyan-500/30" />
                <div className="w-1/3 bg-gradient-to-r from-amber-600/60 to-amber-500/30" />
              </div>
              <motion.div
                className="absolute top-0 h-full w-1 bg-white rounded-full shadow-lg shadow-white/50"
                initial={{ left: '16%' }}
                animate={{
                  left: selectedLevel === 'dark' ? '16%'
                      : selectedLevel === 'neural' ? '50%'
                      : '83%',
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[7px] text-red-400/60">동일시</span>
              <span className="text-[7px] text-cyan-400/60">탈동일시</span>
              <span className="text-[7px] text-amber-400/60">초월</span>
            </div>
          </motion.div>
        )}

        {/* ─── 주파수 위치 설명 ─── */}
        {selectedLevel && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border ${LEVEL_CONFIG[selectedLevel].bg} ${LEVEL_CONFIG[selectedLevel].border}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[12px]">{LEVEL_CONFIG[selectedLevel].emoji}</span>
              <span className={`text-[10px] font-bold ${LEVEL_CONFIG[selectedLevel].text}`}>
                현재 주파수: {LEVEL_CONFIG[selectedLevel].label}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed break-keep mb-2">
              {LEVEL_CONFIG[selectedLevel].metaphor}
            </p>
            <p className="text-[10px] text-slate-400 italic break-keep">
              💡 {LEVEL_CONFIG[selectedLevel].insight}
            </p>
          </motion.div>
        )}

        {/* ─── 바이오 교차 분석 ─── */}
        {selectedLevel && dailyState?.bioSyncMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-slate-300 leading-relaxed break-keep">
              {dailyState.bioSyncMessage}
            </p>
          </motion.div>
        )}

        {/* ─── 공망(Gongmang) 융합 가이드 ─── */}
        {dailyState?.gongmang?.isTodayGongmang && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-tighter">Gongmang Fusion Active</span>
            </div>
            <p className="text-[9px] text-indigo-200/80 leading-relaxed break-keep">
              {dailyState.gongmang.description}
            </p>
          </motion.div>
        )}

        {/* ─── AI 재귀적 코칭 응답 ─── */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3">
            <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              {[0, 0.1, 0.2].map((d, i) => (
                <span key={i} className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
              <span className="text-[10px] text-slate-500 ml-2">의식 주파수 분석 중...</span>
            </div>
          </motion.div>
        )}

        {aiReply && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="bg-amber-950/15 border border-amber-500/20 rounded-2xl rounded-tl-none p-3 max-w-[90%]">
              <div className="prose prose-invert prose-sm max-w-none text-[12px] leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiReply}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── 재귀적 자기질문 카드 (AI 응답 후) ─── */}
        {isAnalyzed && !isLoading && dailyState?.selfInquiry && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-xl bg-gradient-to-br from-violet-950/30 to-indigo-950/20 border border-violet-500/20">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px]">🪞</span>
              <span className="text-[9px] font-bold text-violet-300">재귀적 자기질문</span>
            </div>
            <p className="text-[11px] text-violet-100 leading-relaxed break-keep italic">
              "{dailyState.selfInquiry}"
            </p>
            <div className="mt-3 flex gap-2">
              {selectedLevel !== 'meta' && (
                <button
                  onClick={() => handleSelectLevel(
                    selectedLevel === 'dark' ? 'neural' : 'meta'
                  )}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20 text-[10px] text-violet-200 hover:bg-violet-500/25 transition-all">
                  <ArrowRight className="w-3 h-3" />
                  다음 주파수로 이동
                </button>
              )}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 hover:bg-white/10 transition-all">
                <RefreshCw className="w-3 h-3" />
                다시 측정
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── 안내 (초기 상태) ─── */}
        {!selectedLevel && dailyState && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-4">
            <p className="text-[11px] text-slate-400 mb-1">
              ☝️ 위의 3가지 카드 중 <strong className="text-slate-200">지금 나에게 가장 가까운 것</strong>을 선택하세요
            </p>
            <p className="text-[9px] text-slate-600">
              당신의 의식 주파수 위치를 측정하고 재귀적 자기질문을 시작합니다
            </p>
          </motion.div>
        )}
      </div>

      {/* ─── 프리미엄 상세 해독 모달 (Glassmorphism & Metallic Neon) ─── */}
      <AnimatePresence>
        {isModalOpen && modalData && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            {/* 백드롭 블러 암전 배경 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* 모달 본체 */}
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-md bg-slate-950/90 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 text-slate-100 backdrop-blur-xl"
            >
              {/* 상단 럭셔리 글로우 */}
              <div 
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-60 h-60 blur-3xl rounded-full opacity-35 animate-pulse" 
                style={{
                  background: `radial-gradient(circle, ${LEVEL_CONFIG[modalData.level].color} 0%, transparent 70%)`
                }}
              />

              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all z-20"
              >
                <span className="sr-only">닫기</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 모달 헤더 */}
              <div className="text-center mb-5 relative z-10">
                <span className="text-[28px] inline-block mb-1.5 animate-bounce">{modalData.emoji}</span>
                <h4 className="text-[13px] font-mono tracking-widest text-slate-400 uppercase">
                  {modalData.tenGod} 에너지 해독
                </h4>
                <h3 className="text-[20px] font-black tracking-tight" style={{ color: LEVEL_CONFIG[modalData.level].color }}>
                  {modalData.label} 상세 처방 보고서
                </h3>
                <div className="mt-1 text-[10px] text-slate-500 font-mono">
                  CODE NAME: {modalData.tag}
                </div>
              </div>

              {/* 모달 바디 (내용) */}
              <div className="space-y-4 relative z-10 max-h-[350px] overflow-y-auto pr-1">
                {/* 1. 상태 심층 분석 */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <h5 className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    현재 의식 주파수 현상
                  </h5>
                  <p className="text-[12px] text-slate-300 leading-relaxed break-keep font-light">
                    {DETAILED_COACHING_GUIDE[modalData.tenGod]?.[modalData.level]?.detailedDesc || modalData.desc}
                  </p>
                </div>

                {/* 2. 에고 디버깅 처방 */}
                <div className="bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-indigo-500/20 rounded-2xl p-4">
                  <h5 className="text-[11px] font-bold text-indigo-300 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    에고 디버깅 해독 솔루션 (ACT)
                  </h5>
                  <p className="text-[12px] text-indigo-200 leading-relaxed break-keep font-light">
                    {DETAILED_COACHING_GUIDE[modalData.tenGod]?.[modalData.level]?.debuggingPrescription || '현재 의식 상태를 한 걸음 떨어져 관찰하며 깊은 호흡으로 에너지를 정돈해 보세요.'}
                  </p>
                </div>

                {/* 3. 오늘 당장 실천할 액션 플랜 */}
                <div className="bg-gradient-to-br from-amber-950/20 to-slate-950 border border-amber-500/20 rounded-2xl p-4">
                  <h5 className="text-[11px] font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    오늘의 마이크로 실천 행동
                  </h5>
                  <p className="text-[12px] text-amber-100 leading-relaxed break-keep font-semibold">
                    💡 {DETAILED_COACHING_GUIDE[modalData.tenGod]?.[modalData.level]?.dailyActionPlan || '내 삶의 주체로서 작은 긍정적인 행동을 온전히 선택하여 실행해보세요.'}
                  </p>
                </div>
              </div>

              {/* 하단 제어 */}
              <div className="mt-6 flex justify-end gap-2 relative z-10">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 rounded-xl text-[12px] font-bold text-slate-200 transition-all border border-white/5 active:scale-95"
                >
                  확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
