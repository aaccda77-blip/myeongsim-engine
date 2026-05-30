'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Bug, Globe, ShieldCheck, Loader2, ChevronRight, Zap, Brain, Eye, Target, AlertTriangle, Scan, Radio, Terminal, Edit3, Save } from 'lucide-react';

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

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/os/daily-debugging', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId || 'anonymous', dayMaster, yearPillar, monthPillar, dayPillar, hourPillar, gender, targetDate })
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
      }
    };
    fetchReport();
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
    { id: 'overview', label: '바이오리듬', icon: Radio, color: 'text-cyan-400' },
    { id: 'matrix', label: '매트릭스 디버깅', icon: Bug, color: 'text-rose-400' },
    { id: 'coaching', label: '코칭 풀이', icon: Brain, color: 'text-amber-400' },
    { id: 'questions', label: '소크라테스 문답', icon: Scan, color: 'text-violet-400' },
    { id: 'reset', label: '의식 리셋', icon: Eye, color: 'text-cyan-400' },
    { id: 'zeropoint', label: 'Zero Point', icon: Target, color: 'text-emerald-400' },
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
                🤖 Myeongsim AI 매트릭스 디버깅 리포트
              </span>
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
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
          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Cpu className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm text-emerald-400 font-mono mb-1">매트릭스 디버깅 리포트 컴파일 중...</p>
                  <p className="text-xs text-slate-500">사주 기질 × 오늘 일진 × CBT·DBT·ACT·MBCT 통합 분석</p>
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
                        <span className="text-xs font-bold text-cyan-400 font-mono">타깃 OS</span>
                      </div>
                      <p className="text-sm text-cyan-100/80 leading-relaxed">{report.targetOS}</p>
                    </div>

                    {/* Daily Keyword */}
                    <div className="bg-gradient-to-r from-amber-950/30 to-rose-950/30 border border-amber-800/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 font-mono">오늘의 데일리 키워드</span>
                      </div>
                      <p className="text-base font-bold text-amber-200">{report.dailyKeyword}</p>
                    </div>

                    {/* Biorhythm Analysis */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Radio className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 font-mono">명심 바이오리듬</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{report.biorhythmAnalysis}</p>
                    </div>
                  </motion.div>
                )}

                {/* MATRIX DEBUGGING: 내면의 소스코드 + 투사된 현실 */}
                {activeSection === 'matrix' && (
                  <motion.div key="matrix" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <span className="text-xs font-bold text-slate-500 font-mono">매트릭스 디버깅 (CBT · DBT · ACT · MBCT 통합 마스터 로직)</span>
                    </div>

                    {/* Inner Source Code */}
                    <div className="bg-slate-950 border border-rose-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bug className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-rose-400 font-mono">내면의 소스코드</span>
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
                        <span className="text-xs font-bold text-violet-400 font-mono">투사된 현실</span>
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
                        <span className="text-xs font-bold text-amber-400 font-mono">명심 코칭 풀이</span>
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
                        <span className="text-xs font-bold text-violet-400 font-mono">소크라테스 문답 (객관화 및 효용성 검증)</span>
                      </div>
                      <p className="text-sm text-violet-100/80 leading-[1.9] italic">{report.socraticQuestion}</p>
                    </div>

                    <div className="bg-slate-950 border border-indigo-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🔁</span>
                        <span className="text-xs font-bold text-indigo-400 font-mono">재귀적 질문 (에러 로그의 기원)</span>
                      </div>
                      <p className="text-sm text-indigo-100/80 leading-[1.9] italic">{report.recursiveQuestion}</p>
                    </div>
                  </motion.div>
                )}

                {/* CONSCIOUSNESS RESET */}
                {activeSection === 'reset' && (
                  <motion.div key="reset" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-2">
                      <span className="text-xs font-bold text-slate-500 font-mono">의식 리셋 2단계 디버깅 프로세스</span>
                    </div>

                    {/* STEP 1 */}
                    <div className="bg-slate-950 border border-cyan-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">STEP 1</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 font-mono">👁️ 메타 인지 (객관적 관찰)</span>
                      </div>
                      <p className="text-sm text-cyan-100/80 leading-[1.9]">{report.step1_metaCognition}</p>
                      <p className="text-xs text-cyan-500/60 mt-3 italic">➔ 에고의 생각과 감정을 관찰자 시점으로 가만히 바라봅니다.</p>
                    </div>

                    <div className="text-center text-xs text-slate-600 font-mono">Deepen Awareness (차원 상승)</div>

                    {/* STEP 2 */}
                    <div className="bg-slate-950 border border-indigo-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">STEP 2</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🌌</span>
                        <span className="text-xs font-bold text-indigo-400 font-mono">알아차림의 알아차림 (순수 자각)</span>
                      </div>
                      <p className="text-sm text-indigo-100/80 leading-[1.9]">{report.step2_pureAwareness}</p>
                      <p className="text-xs text-indigo-500/60 mt-3 italic">➔ 관찰하고 있는 '텅 빈 배경 자체(자각 그 자체)'에 머무릅니다.</p>
                    </div>
                  </motion.div>
                )}

                {/* ZERO POINT SOLUTION */}
                {activeSection === 'zeropoint' && (
                  <motion.div key="zeropoint" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="bg-gradient-to-b from-emerald-950/30 to-slate-950 border border-emerald-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">✨</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">Zero Point 솔루션</span>
                      </div>
                      <p className="text-sm text-emerald-100/80 leading-[1.8] mb-5">{report.zeroPointSolution.intro}</p>

                      <div className="space-y-3">
                        {[
                          { num: 1, label: '수용', text: report.zeroPointSolution.step1_acceptance, color: 'text-cyan-400', border: 'border-cyan-900/30' },
                          { num: 2, label: '현재 앵커링', text: report.zeroPointSolution.step2_anchoring, color: 'text-blue-400', border: 'border-blue-900/30' },
                          { num: 3, label: '클린 코드 입력', text: report.zeroPointSolution.step3_cleanCode, color: 'text-amber-400', border: 'border-amber-900/30' },
                          { num: 4, label: '전념 행동', text: report.zeroPointSolution.step4_commitment, color: 'text-emerald-400', border: 'border-emerald-900/30' },
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
                      오늘의 매트릭스 디버깅 리포트를 읽고 난 후의 느낌, 떠오르는 통찰, 혹은 내일의 나에게 남기는 다짐을 기록해보세요.
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
