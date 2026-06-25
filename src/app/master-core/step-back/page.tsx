'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Loader2, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

interface CoachedReport {
  greeting: string;
  metaphor: string;
  coaching_insight: string;
  self_dialogue: string[];
  blessing: string;
}

export default function StepBackCoachingPage() {
  const router = useRouter();
  const { reportData } = useReportStore();

  const userName = reportData?.userName || '명심가';
  const autoBirthDate = useMemo(() => {
    const data = reportData as any;
    if (!data) return '';
    return data.saju?.birthDate || data.birthDate || '';
  }, [reportData]);

  const autoBirthTime = useMemo(() => {
    const data = reportData as any;
    if (!data) return '';
    return data.birthTime || '';
  }, [reportData]);

  // UI state variables
  const [birthInput, setBirthInput] = useState(autoBirthDate);
  const [birthTime, setBirthTime] = useState('12:00');
  const [isTimeUnknown, setIsTimeUnknown] = useState(true);
  const [userConcern, setUserConcern] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<CoachedReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [chainSliced, setChainSliced] = useState(false);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto trigger if birthday/time is already in store on load
  useEffect(() => {
    if (autoBirthDate) {
      setBirthInput(autoBirthDate);
    }
    if (autoBirthTime) {
      if (autoBirthTime === 'unknown') {
        setIsTimeUnknown(true);
        setBirthTime('12:00');
      } else {
        setIsTimeUnknown(false);
        setBirthTime(autoBirthTime);
      }
    }
  }, [autoBirthDate, autoBirthTime]);

  const handleGenerateReport = async () => {
    if (!birthInput.trim()) {
      setErrorMsg('생년월일을 입력해 주세요 (예: 1995-10-24)');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setReport(null);
    setChainSliced(false);
    setIsSubmitted(false);
    setAnswers(['', '', '']);

    try {
      const response = await fetch('/api/coaching/step-back', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: birthInput,
          birthTime: isTimeUnknown ? 'unknown' : birthTime,
          userName,
          sajuPillars: reportData?.saju || null,
          userConcern: userConcern.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        throw new Error('의식 자각 정보를 연성하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('우주적 의식의 진동수가 일시적으로 맞지 않습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (idx: number, val: string) => {
    const updated = [...answers];
    updated[idx] = val;
    setAnswers(updated);
  };

  const handleSubmission = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#05070A] max-w-2xl mx-auto shadow-2xl overflow-hidden font-sans text-white pb-16 select-text">
      {/* Background Deep Cosmic Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] left-[-20%] w-[90vw] h-[90vw] max-w-[600px] bg-purple-900/15 rounded-full blur-[180px] animate-pulse duration-[8s]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[500px] bg-fuchsia-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[30%] right-[10%] w-[50vw] h-[50vw] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        
        {/* Fine Star Dust Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/5 backdrop-blur-md bg-black/10">
        <button 
          onClick={() => router.push('/master-core')}
          className="p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 font-mono">
          거울 뒤로 한 걸음
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 px-5 py-6">
        
        {/* Core Intro Concept */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Sparkles size={12} className="text-indigo-400" />
            <span className="text-indigo-300 text-[10px] font-bold tracking-wider uppercase font-mono">STEP BACK INTO AWARENESS</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2">본래 거울의 자리로 물러서기</h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto break-keep">
            통증과 생각을 나와 동일시하지 않고, 한 걸음 뒤로 물러나 안팎의 일체 세상을 고요히 비추는 감동적인 자각 공간입니다.
          </p>
        </div>

        {/* Input Form Panel */}
        <div className="bg-[#0D1222]/50 border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-md">
          <h3 className="text-xs font-bold text-indigo-400 font-mono mb-4 uppercase tracking-wider">01 / 생년월일 및 오늘의 고민 기입</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold mb-1.5 font-mono uppercase">BIRTH DATE (생년월일)</label>
                <input 
                  type="text" 
                  value={birthInput}
                  onChange={(e) => setBirthInput(e.target.value)}
                  placeholder="예: 1980-07-07 (양/음력 구분 없음)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 placeholder-gray-600 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-bold mb-1.5 font-mono uppercase">BIRTH TIME (태어난 시간)</label>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={birthTime}
                    disabled={isTimeUnknown}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 placeholder-gray-600 transition disabled:opacity-30 disabled:border-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => setIsTimeUnknown(!isTimeUnknown)}
                    className={`px-4 py-3 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center justify-center ${
                      isTimeUnknown 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                        : 'bg-black/40 border-white/10 text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    시간 모름
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1.5 font-mono uppercase">CURRENT CONCERN / PAIN (오늘의 통증, 번뇌 혹은 고민)</label>
              <textarea 
                rows={2}
                value={userConcern}
                onChange={(e) => setUserConcern(e.target.value)}
                placeholder="가슴이 답답해요, 무릎 통증에 휩쓸려요, 혹은 외롭고 불안해요 등 자유롭게 적어보세요..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 placeholder-gray-600 transition resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black tracking-wider shadow-lg shadow-indigo-950/30 transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>의식 자각 리포트 연성 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  <span>거울 자각 리포트 받기</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-[10px] font-semibold text-center mt-3">{errorMsg}</p>
          )}
        </div>

        {/* Coached Output Panel */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* 1. Greeting 편지 */}
              <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="text-[10px] font-mono text-indigo-400 mb-3 tracking-wider">🌸 마음의 편지</div>
                <p className="text-sm text-indigo-100/90 leading-relaxed font-serif break-keep italic">
                  &ldquo;{report.greeting}&rdquo;
                </p>
              </div>

              {/* 2. Metaphor 설명 */}
              <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-950/5">
                <div className="text-[10px] font-mono text-purple-400 mb-3 tracking-wider">🌿 따뜻한 비유</div>
                <p className="text-xs text-gray-300 leading-relaxed break-keep font-medium">
                  {report.metaphor}
                </p>
              </div>

              {/* 3. Coaching Insight & Chain Breaker Interactive */}
              <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-950/5 relative">
                <div className="text-[10px] font-mono text-pink-400 mb-3 tracking-wider">💡 자각의 칼날 (관점 전환)</div>
                <p className="text-xs text-gray-200 leading-relaxed break-keep mb-6">
                  {report.coaching_insight}
                </p>

                {/* Chain Breaker Interactive Simulation */}
                <div className="border border-white/5 rounded-xl p-4 bg-black/40 text-center relative overflow-hidden">
                  <div className="text-[10px] font-mono text-gray-500 mb-4">느낌과 생각을 분리하는 의식적 차단 장치</div>
                  
                  <div className="flex justify-center items-center gap-6 mb-4 relative z-10">
                    <div className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-[10px] font-bold text-red-400">
                      강렬한 통증 (객체)
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`h-0.5 w-12 bg-gradient-to-r ${chainSliced ? 'from-transparent to-transparent' : 'from-red-500 to-indigo-500'} transition-all duration-500 relative`}>
                        {!chainSliced && (
                          <div className="absolute top-[-4px] left-[18px] w-2 h-2 rounded-full bg-white animate-ping"></div>
                        )}
                      </div>
                      <span className="text-[8px] text-gray-500 mt-1 font-mono">{chainSliced ? '분리 완료' : '최면 결합'}</span>
                    </div>

                    <div className="px-3 py-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[10px] font-bold text-indigo-400">
                      느끼는 주체 (나)
                    </div>
                  </div>

                  <button
                    onClick={() => setChainSliced(!chainSliced)}
                    className={`py-2 px-4 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                      chainSliced 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                    }`}
                  >
                    {chainSliced ? '✨ 연결고리 해제됨' : '⚔️ 생각의 사슬 자르기'}
                  </button>
                </div>
              </div>

              {/* 4. Self Coaching Dialogue & Input */}
              <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-950/5">
                <div className="text-[10px] font-mono text-amber-400 mb-3 tracking-wider">🔍 수취인 없는 3가지 반조 (셀프 코칭)</div>
                <p className="text-[11px] text-gray-400 mb-4 break-keep leading-relaxed">
                  아래 질문을 소리 내어 가슴으로 읽어보고, 떠오르는 생각을 가볍게 작성하며 내 안의 괴로움을 담아둘 가짜 주체(수취인)가 없음을 자명하게 돌이켜보세요.
                </p>

                <div className="space-y-4">
                  {report.self_dialogue.map((q, i) => (
                    <div key={i} className="space-y-2 border-l border-amber-500/20 pl-3">
                      <p className="text-xs text-amber-100 font-semibold leading-relaxed font-serif">{i + 1}. {q}</p>
                      <input 
                        type="text" 
                        disabled={isSubmitted}
                        value={answers[i]}
                        onChange={(e) => handleAnswerChange(i, e.target.value)}
                        placeholder="가슴의 울림을 한 줄 적어보세요..."
                        className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-600 placeholder-gray-700 transition"
                      />
                    </div>
                  ))}
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmission}
                    className="w-full py-3 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-400 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>자각 완료하고 마스터에게 반송하기</span>
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-center text-xs text-emerald-400 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    <span>[수취인 없음 - 반송 완료] 편지가 우주 먼지처럼 본래거울로 돌아갔습니다. ✨</span>
                  </motion.div>
                )}
              </div>

              {/* 5. Blessing 시구 */}
              <div className="text-center py-6 border-t border-white/5">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest block mb-3">COSMIC BLESSING</span>
                <p className="text-sm text-gray-300 font-serif leading-relaxed italic break-keep max-w-sm mx-auto">
                  &ldquo;{report.blessing}&rdquo;
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
