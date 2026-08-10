'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Bug, Globe, ShieldCheck, Loader2, ChevronRight, Zap, Brain, Eye, Target, AlertTriangle, Scan, Radio, Terminal, Edit3, Save, RefreshCw } from 'lucide-react';
import DragExplainWrapper from '@/components/common/DragExplainWrapper';


interface DebuggingReport {
  targetOS: string;
  dailyKeyword: string;
  biorhythmAnalysis: string;
  innerSourceCode: string;
  projectedReality: string;
  coachingInsight: string;
  socraticQuestion: string;
  recursiveQuestion: string;
  step1_metaCognition: string;
  step2_pureAwareness: string;
  zeroPointSolution: {
    intro: string;
    step1_acceptance: string;
    step2_anchoring: string;
    step3_cleanCode: string;
    step4_commitment: string;
    closing: string;
  };
}

interface Props {
  userId?: string;
  dayMaster: string;
  yearPillar?: string;
  monthPillar?: string;
  dayPillar?: string;
  hourPillar?: string;
  gender?: string;
  targetDate?: string;
  onClose: () => void;
}

export default function DailyDebuggingModal({ userId, dayMaster, yearPillar, monthPillar, dayPillar, hourPillar, gender, targetDate, onClose }: Props) {
  const [report, setReport] = useState<DebuggingReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [worksheetText, setWorksheetText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadReport = async (force: boolean = false) => {
    if (force) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const res = await fetch('/api/os/daily-debugging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId || 'anonymous', 
          dayMaster, 
          yearPillar, 
          monthPillar, 
          dayPillar, 
          hourPillar, 
          gender, 
          targetDate,
          forceRefresh: force 
        })
      });
      if (!res.ok) throw new Error('API 호출 실패');
      const data = await res.json();
      if (data.success && data.data?.content) {
        setReport(data.data.content);
        
        // 워크시트 내용 불러오기
        if (userId && userId !== 'anonymous') {
          const dateToLoad = targetDate || new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
          const wsRes = await fetch(`/api/os/debugging-worksheet?userId=${userId}&dateString=${dateToLoad}`);
          if (wsRes.ok) {
            const wsData = await wsRes.json();
            if (wsData.success && wsData.text) {
              setWorksheetText(wsData.text);
            }
          }
        }
      } else {
        throw new Error(data.error || '데이터 파싱 실패');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [userId, dayMaster, targetDate]);

  const handleSaveWorksheet = async () => {
    if (!userId || userId === 'anonymous') {
      setSaveMessage('로그인이 필요합니다.');
      return;
    }
    
    setIsSaving(true);
    setSaveMessage('');
    try {
      const dateToSave = targetDate || new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
      const res = await fetch('/api/os/debugging-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dateString: dateToSave, text: worksheetText })
      });
      if (res.ok) {
        setSaveMessage('성공적으로 저장되었습니다.');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      setSaveMessage('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'overview', label: '오늘의 마음 날씨', icon: Radio, color: 'text-cyan-400' },
    { id: 'matrix', label: '마음속 이야기', icon: Bug, color: 'text-rose-400' },
    { id: 'coaching', label: '따뜻한 코칭', icon: Brain, color: 'text-amber-400' },
    { id: 'questions', label: '마음 돌아보기', icon: Scan, color: 'text-violet-400' },
    { id: 'reset', label: '마음 웰니스', icon: Eye, color: 'text-cyan-400' },
    { id: 'zeropoint', label: '온전한 나', icon: Target, color: 'text-emerald-400' },
    { id: 'worksheet', label: '워크시트', icon: Edit3, color: 'text-rose-300' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/95 backdrop-blur-2xl"
      >
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-slate-800 px-5 py-3 flex justify-between items-center bg-slate-900/90 shrink-0">
            <h2 className="text-sm font-bold flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                🌿 오늘의 명심 마음 웰니스 리포트
              </span>
            </h2>
            <div className="flex items-center gap-2">
              {/* 새 기질로 다시 생성 버튼 */}
              {dayMaster && userId && userId !== 'anonymous' && (
                <button
                  onClick={() => loadReport(true)}
                  disabled={isLoading || isRefreshing}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all duration-300 ${
                    isRefreshing 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 cursor-not-allowed'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 shadow-sm'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                  {isRefreshing ? '재생성 중...' : '새 기질로 다시 생성 (AI)'}
                </button>
              )}
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          {!isLoading && report && (
            <div className="border-b border-slate-800 px-3 py-2 flex gap-1 overflow-x-auto scrollbar-hide shrink-0">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeSection === s.id
                      ? 'bg-slate-800 text-white border border-slate-600/50'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <s.icon className={`w-3 h-3 ${activeSection === s.id ? s.color : ''}`} />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide relative">
            <DragExplainWrapper>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Cpu className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm text-emerald-400 font-mono mb-1">오늘의 마음 웰니스 리포트를 준비하고 있어요...</p>
                  <p className="text-xs text-slate-500">당신의 타고난 기질과 오늘의 에너지를 정성껏 분석하고 있습니다</p>
                </div>
                <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 15, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <AlertTriangle className="w-10 h-10 text-rose-400" />
                <p className="text-sm text-rose-400">{error}</p>
                <button onClick={onClose} className="text-xs text-slate-400 underline">닫기</button>
              </div>
            )}

            {!isLoading && report && (
              <AnimatePresence mode="wait">
                {/* OVERVIEW: 타깃 OS + 바이오리듬 */}
                {activeSection === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    {/* Target OS Card */}
                    <div className="bg-slate-950 border border-cyan-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 font-mono">나의 타고난 기질</span>
                      </div>
                      <p className="text-sm text-cyan-100/80 leading-relaxed">{report.targetOS}</p>
                    </div>

                    {/* Daily Keyword */}
                    <div className="bg-gradient-to-r from-amber-950/30 to-rose-950/30 border border-amber-800/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 font-mono">오늘의 마음 테마</span>
                      </div>
                      <p className="text-base font-bold text-amber-200">{report.dailyKeyword}</p>
                    </div>

                    {/* Biorhythm Analysis */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Radio className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 font-mono">오늘의 마음 파동</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{report.biorhythmAnalysis}</p>
                    </div>
                  </motion.div>
                )}

                {/* MATRIX DEBUGGING: 내면의 소스코드 + 투사된 현실 */}
                {activeSection === 'matrix' && (
                  <motion.div key="matrix" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <span className="text-xs font-bold text-slate-500 font-mono">상처받은 마음의 이야기 (내면 깊은 곳의 목소리를 들어봅니다)</span>
                    </div>

                    {/* Inner Source Code */}
                    <div className="bg-slate-950 border border-rose-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bug className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-rose-400 font-mono">마음속 숨겨진 상처</span>
                      </div>
                      <p className="text-sm text-rose-100/80 leading-[1.8]">{report.innerSourceCode}</p>
                    </div>

                    <div className="flex justify-center">
                      <span className="text-lg">🔄</span>
                    </div>

                    {/* Projected Reality */}
                    <div className="bg-slate-950 border border-violet-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-violet-400" />
                        <span className="text-xs font-bold text-violet-400 font-mono">상처가 만들어낸 현실</span>
                      </div>
                      <p className="text-sm text-violet-100/80 leading-[1.8]">{report.projectedReality}</p>
                    </div>
                  </motion.div>
                )}

                {/* COACHING INSIGHT */}
                {activeSection === 'coaching' && (
                  <motion.div key="coaching" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="bg-slate-950 border border-amber-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">💡</span>
                        <span className="text-xs font-bold text-amber-400 font-mono">💡 따뜻한 명심 코칭</span>
                      </div>
                      <p className="text-sm text-amber-100/80 leading-[1.9]">{report.coachingInsight}</p>
                    </div>
                  </motion.div>
                )}

                {/* SOCRATIC + RECURSIVE QUESTIONS */}
                {activeSection === 'questions' && (
                  <motion.div key="questions" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="bg-slate-950 border border-violet-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🤔</span>
                        <span className="text-xs font-bold text-violet-400 font-mono">🤔 한 발짝 물러서서 바라보기</span>
                      </div>
                      <p className="text-sm text-violet-100/80 leading-[1.9] italic">{report.socraticQuestion}</p>
                    </div>

                    <div className="bg-slate-950 border border-indigo-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🔁</span>
                        <span className="text-xs font-bold text-indigo-400 font-mono">🔁 이 마음은 어디서 왔을까?</span>
                      </div>
                      <p className="text-sm text-indigo-100/80 leading-[1.9] italic">{report.recursiveQuestion}</p>
                    </div>
                  </motion.div>
                )}

                {/* CONSCIOUSNESS RESET */}
                {activeSection === 'reset' && (
                  <motion.div key="reset" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-2">
                      <span className="text-xs font-bold text-slate-500 font-mono">마음 웰니스 2단계 여행</span>
                    </div>

                    {/* STEP 1 */}
                    <div className="bg-slate-950 border border-cyan-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">STEP 1</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 font-mono">👁️ 한 걸음 물러서서 바라보기</span>
                      </div>
                      <p className="text-sm text-cyan-100/80 leading-[1.9]">{report.step1_metaCognition}</p>
                      <p className="text-xs text-cyan-500/60 mt-3 italic">➔ 지금 내 안에 떠오르는 생각과 감정을 있는 그대로 가만히 바라봅니다.</p>
                    </div>

                    <div className="text-center text-xs text-slate-600 font-mono">더 깊은 평화로 나아가기</div>

                    {/* STEP 2 */}
                    <div className="bg-slate-950 border border-indigo-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">STEP 2</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🌌</span>
                        <span className="text-xs font-bold text-indigo-400 font-mono">고요한 내면의 빛 (순수한 나)</span>
                      </div>
                      <p className="text-sm text-indigo-100/80 leading-[1.9]">{report.step2_pureAwareness}</p>
                      <p className="text-xs text-indigo-500/60 mt-3 italic">➔ 생각과 감정 너머에 있는 고요하고 맑은 본래의 나에게 머무릅니다.</p>
                    </div>
                  </motion.div>
                )}

                {/* ZERO POINT SOLUTION */}
                {activeSection === 'zeropoint' && (
                  <motion.div key="zeropoint" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="bg-gradient-to-b from-emerald-950/30 to-slate-950 border border-emerald-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">✨</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">✨ 온전한 나를 되찾는 길</span>
                      </div>
                      <p className="text-sm text-emerald-100/80 leading-[1.8] mb-5">{report.zeroPointSolution.intro}</p>

                      <div className="space-y-3">
                        {[
                          { num: 1, label: '수용', text: report.zeroPointSolution.step1_acceptance, color: 'text-cyan-400', border: 'border-cyan-900/30' },
                          { num: 2, label: '지금 이 순간', text: report.zeroPointSolution.step2_anchoring, color: 'text-blue-400', border: 'border-blue-900/30' },
                          { num: 3, label: '마음 다시 쓰기', text: report.zeroPointSolution.step3_cleanCode, color: 'text-amber-400', border: 'border-amber-900/30' },
                          { num: 4, label: '한 걸음 내딛기', text: report.zeroPointSolution.step4_commitment, color: 'text-emerald-400', border: 'border-emerald-900/30' },
                        ].map(item => (
                          <div key={item.num} className={`bg-slate-950 border ${item.border} rounded-lg p-3`}>
                            <div className="flex items-start gap-2">
                              <span className={`text-xs font-bold ${item.color} shrink-0 mt-0.5`}>{item.num}.</span>
                              <div>
                                <span className={`text-xs font-bold ${item.color}`}>[{item.label}]</span>
                                <p className="text-sm text-slate-300 leading-relaxed mt-1">{item.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 pt-4 border-t border-emerald-900/20">
                        <p className="text-sm text-emerald-200/90 leading-relaxed italic">{report.zeroPointSolution.closing}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* WORKSHEET (SELF-COACHING) */}
                {activeSection === 'worksheet' && (
                  <motion.div key="worksheet" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-rose-400" />
                        <span className="text-sm font-bold text-rose-300 font-mono">셀프 코칭 일기장</span>
                      </div>
                      {saveMessage && (
                        <span className={`text-xs ${saveMessage.includes('성공') ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {saveMessage}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400">
                      오늘의 마음 웰니스 리포트를 읽고 느낀 점, 떠오르는 생각, 혹은 내일의 나에게 남기는 따뜻한 다짐을 기록해보세요.
                    </p>

                    <div className="flex-1 relative min-h-[250px]">
                      <textarea
                        value={worksheetText}
                        onChange={(e) => setWorksheetText(e.target.value)}
                        placeholder="이곳에 나의 마음을 적어주세요..."
                        className="absolute inset-0 w-full h-full bg-slate-950 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500/50 resize-none transition-colors"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveWorksheet}
                        disabled={isSaving || !userId || userId === 'anonymous'}
                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        저장하기
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            </DragExplainWrapper>
          </div>


          {/* Footer Navigation */}
          {!isLoading && report && (
            <div className="border-t border-slate-800 px-5 py-3 flex justify-between items-center shrink-0 bg-slate-900/90">
              <button
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  if (idx > 0) setActiveSection(sections[idx - 1].id);
                }}
                disabled={activeSection === sections[0].id}
                className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 이전
              </button>
              <span className="text-xs text-slate-600 font-mono">
                {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
              </span>
              <button
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                }}
                disabled={activeSection === sections[sections.length - 1].id}
                className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                다음 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
