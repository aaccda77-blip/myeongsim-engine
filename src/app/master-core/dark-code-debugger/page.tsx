'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { useRouter } from 'next/navigation';
import { Terminal, Cpu, ShieldAlert, Zap, RefreshCw, Send, CheckCircle2, ArrowLeft, Play, Layers } from 'lucide-react';

interface DebuggerReport {
  errorCode: string;
  errorName: string;
  diagnose: string;
  neuralRewrite: string;
  metaMantra: string;
  systemLog: string[];
  blessing: string;
}

export default function DarkCodeDebuggerPage() {
  const router = useRouter();
  const { reportData } = useReportStore();

  // 🔒 잠금 상태 (스마트스토어 VIP 또는 유료 결제 시만 해금)
  const [isLocked, setIsLocked] = useState(true);

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

  // Form states
  const [birthInput, setBirthInput] = useState(autoBirthDate);
  const [birthTime, setBirthTime] = useState('12:00');
  const [isTimeUnknown, setIsTimeUnknown] = useState(true);
  const [userConcern, setUserConcern] = useState('');

  // Process states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [report, setReport] = useState<DebuggerReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Interactive wiring states
  const [isRewired, setIsRewired] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);

  // Reflection Console States
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Audio/Visual effects
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // 🔒 잠금 해제 체크
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkUnlocked = localStorage.getItem('myeongsim_dark_code_unlocked') === 'true';
      const isPaidUser = localStorage.getItem('myeongsim_paid_user') === 'true';
      const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true';
      if (isDarkUnlocked || isSmartVip || isPaidUser) {
        setIsLocked(false);
      }
    }
  }, []);

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

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scanLogs]);

  // 🔒 잠금 화면 렌더링
  if (isLocked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0d1a] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#181526] border border-amber-400/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl"
        >
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-amber-400/10 border border-amber-400/20">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-white">무의식 다크코드 디버거</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            이 콘텐츠는 <strong className="text-amber-300">청류스마트스토어 구매자 단독 VIP 혜택</strong>으로 제공됩니다.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-left">
            <p className="text-[11px] text-amber-200 leading-relaxed">
              👑 <strong>청류스마트스토어</strong>에서 도서를 구매하시면 <span className="text-white font-bold">스타트업 리포트 + 다크코드 디버거 + 바이오케어 + 힐링송 + 20회 코칭</span> 올인원 슈퍼패키지가 전면 무료 해금됩니다!
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://smartstore.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              📖 청류스마트스토어에서 구매하기
            </a>
            <button
              onClick={() => router.back()}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold transition-all"
            >
              ← 뒤로 가기
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const runScanningSimulation = (targetReport: DebuggerReport) => {
    setScanStep(0);
    setIsScanning(true);
    setScanLogs([]);
    setReport(null);
    setIsRewired(false);
    setIsCompiling(false);
    setIsCompiled(false);
    setIsSubmitted(false);
    setAnswers(['', '', '']);

    const logs = [
      `[SYSTEM] Connecting to Consciousness Core OS Gateway...`,
      `[SYSTEM] Connected. Initializing Neural Scan protocol...`,
      `[SCAN] Fetching Birthdate & Saju configurations: ${birthInput} ${isTimeUnknown ? '(Time: Unknown)' : `(Time: ${birthTime})`}`,
      `[SCAN] Reading Core DayMaster and Modality variables...`,
      `[SCAN] Scraping unconscious dark code log: "${userConcern || 'Silence'}"`,
      `[ANALYZING] Scrutinizing memory dump for Annihilation Fear vectors...`,
      `[ANALYZING] Detecting hypnotic cognitive identification tags...`,
      `[WARNING] Dark Code anomaly detected in Ego OS v1.0.0 memory block!`,
      `[SCAN COMPLETE] System analysis finished.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setScanLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setReport(targetReport);
        }, 800);
      }
    }, 450);
  };

  const handleStartDebugging = async () => {
    if (!birthInput.trim()) {
      setErrorMsg('생년월일을 입력해 주세요 (예: 1980-07-07)');
      return;
    }

    setIsScanning(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/coaching/dark-code-debugger', {
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
        runScanningSimulation(data);
      } else {
        throw new Error('의식 데이터 분석에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('서버와의 의식 주파수 수신에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setIsScanning(false);
    }
  };

  const handleRewire = () => {
    setIsRewired(true);
    setIsCompiling(true);
    
    // Simulate compilation steps
    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
    }, 1500);
  };

  const handleAnswerChange = (idx: number, val: string) => {
    const updated = [...answers];
    updated[idx] = val;
    setAnswers(updated);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#03060E] max-w-2xl mx-auto shadow-2xl overflow-hidden font-mono text-gray-200 pb-20 select-text">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-emerald-950/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-purple-950/25 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-emerald-500/10 backdrop-blur-md bg-black/30">
        <button 
          onClick={() => router.push('/master-core')}
          className="p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          <Terminal size={14} className="text-emerald-400 animate-pulse" />
          <h1 className="text-xs font-black tracking-widest text-emerald-400 font-mono">
            DARK CODE DEBUGGER v1.0
          </h1>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 px-5 py-6 space-y-6">
        
        {/* Intro Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest uppercase">
            <Cpu size={11} />
            <span> 의식 오류 실시간 재배선 </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">다크코드 디버거</h2>
          <p className="text-[11px] text-gray-400 max-w-sm mx-auto leading-relaxed break-keep">
            내면에 침투한 부정적 오류 데이터(다크코드)를 검출하고, 뇌 신경망을 본래거울의 맑은 주파수(뉴럴코드)로 재배선하여 메타코드를 갱신합니다.
          </p>
        </div>

        {/* Input Form Panel */}
        <div className="border border-emerald-500/10 rounded-2xl bg-black/40 p-5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/25 via-teal-500/5 to-transparent"></div>
          <h3 className="text-[10px] font-bold text-emerald-400 font-mono mb-4 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={12} />
            <span>01 / 단말기 사주 정보 및 오류 로그 입력</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-emerald-400/70 font-bold mb-1.5 uppercase">BIRTH DATE (생년월일)</label>
                <input 
                  type="text" 
                  value={birthInput}
                  onChange={(e) => setBirthInput(e.target.value)}
                  placeholder="예: 1980-07-07 (양/음력 구분 없음)"
                  className="w-full bg-black/60 border border-emerald-500/15 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 placeholder-gray-700 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] text-emerald-400/70 font-bold mb-1.5 uppercase">BIRTH TIME (태어난 시간)</label>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={birthTime}
                    disabled={isTimeUnknown}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-black/60 border border-emerald-500/15 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 placeholder-gray-700 transition disabled:opacity-30 disabled:border-emerald-500/5 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setIsTimeUnknown(!isTimeUnknown)}
                    className={`px-4 py-3 rounded-xl border text-[10px] font-bold whitespace-nowrap transition-all duration-200 flex items-center justify-center ${
                      isTimeUnknown 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-black/60 border-emerald-500/15 text-gray-500 hover:text-white hover:bg-emerald-500/5'
                    }`}
                  >
                    시간 모름
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-emerald-400/70 font-bold mb-1.5 uppercase">ERROR LOG (오늘의 통증, 고민, 번뇌)</label>
              <textarea 
                rows={2}
                value={userConcern}
                onChange={(e) => setUserConcern(e.target.value)}
                placeholder="답답하고 무기력해요, 시험에 떨어졌어요, 미래가 막막하고 불안해요 등 솔직하게 입력하세요..."
                className="w-full bg-black/60 border border-emerald-500/15 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 placeholder-gray-700 transition resize-none leading-relaxed font-mono"
              />
            </div>

            <button
              onClick={handleStartDebugging}
              disabled={isScanning || isCompiling}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-black text-xs font-black tracking-widest shadow-lg shadow-emerald-950/20 transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>시스템 정밀 스캐닝 중...</span>
                </>
              ) : (
                <>
                  <Zap size={13} />
                  <span>디버깅 스캔 시작</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-[10px] font-semibold text-center mt-3">{errorMsg}</p>
          )}
        </div>

        {/* Live Terminal Log Stream */}
        {scanLogs.length > 0 && (
          <div className="border border-emerald-500/10 rounded-2xl bg-[#020409] p-4 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto shadow-inner text-emerald-500/80 scrollbar-thin scrollbar-thumb-emerald-950">
            {scanLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-emerald-600 select-none">&gt;&gt;</span>
                <span className={log?.includes('[WARNING]') ? 'text-amber-400 font-bold' : log?.includes('[SCAN COMPLETE]') ? 'text-cyan-400 font-bold' : ''}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}

        {/* Coached Interactive Interface */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Error Code & Name */}
              <div className="border border-red-500/20 bg-red-950/5 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex-shrink-0 animate-pulse">
                  <ShieldAlert size={20} />
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-red-400 font-mono tracking-wider">ERROR DETECTED // CODE: {report.errorCode}</div>
                  <h4 className="text-sm font-extrabold text-white font-serif">{report.errorName}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed pt-1.5 break-keep">
                    {report.diagnose}
                  </p>
                </div>
              </div>

              {/* Interactive Wiring Schematic */}
              <div className="border border-emerald-500/10 rounded-2xl bg-black/60 p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="text-[9px] font-mono text-emerald-500 mb-6 tracking-widest uppercase flex items-center justify-center gap-1.5">
                  <Layers size={10} />
                  <span>의식 회로도 (Neural Connection Wiring)</span>
                </div>

                {/* Node Schema Rendering */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-14 mb-6 relative z-10">
                  {/* Left Node: Dark Code (Object) */}
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      isRewired 
                        ? 'border-gray-800 bg-gray-950/40 text-gray-600' 
                        : 'border-red-500 bg-red-950/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    }`}>
                      <span className="text-xs font-bold font-serif">다크코드</span>
                    </div>
                    <span className="text-[8px] text-gray-500 mt-2 font-mono">통증/고민 (객체)</span>
                  </div>

                  {/* Connection Wire */}
                  <div className="flex flex-col items-center flex-1 w-full max-w-[100px] md:max-w-none">
                    <div className="relative w-0.5 h-8 md:w-32 md:h-0.5 bg-gray-800">
                      {/* Red pulse (connected) */}
                      {!isRewired && (
                        <div className="absolute inset-0 bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></div>
                      )}
                      {/* Green pulse (rewired) */}
                      {isRewired && (
                        <motion.div 
                          initial={{ scaleX: 0 }} 
                          animate={{ scaleX: 1 }} 
                          className="absolute inset-0 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] origin-left"
                        ></motion.div>
                      )}
                    </div>
                    <span className={`text-[8px] mt-2 font-mono ${isRewired ? 'text-emerald-400 font-bold' : 'text-red-400'}`}>
                      {isRewired ? '● 뉴럴코드 재배선 완료' : '▲ 최면적 강제 결합'}
                    </span>
                  </div>

                  {/* Right Node: Observer True Self (Subject) */}
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      isRewired 
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                        : 'border-indigo-500 bg-indigo-950/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    }`}>
                      <span className="text-xs font-bold font-serif">메타코드</span>
                    </div>
                    <span className="text-[8px] text-gray-500 mt-2 font-mono">본래거울 (주체)</span>
                  </div>
                </div>

                {/* Wiring Action Button */}
                {!isRewired ? (
                  <button
                    onClick={handleRewire}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-600 hover:to-amber-700 text-black text-xs font-black tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
                  >
                    ⚔️ 생각의 사슬 자르기 (Rewire Connection)
                  </button>
                ) : (
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 py-2">
                    <Zap size={12} className="animate-bounce" />
                    <span>회로 재배선 패치 설치 성공!</span>
                  </div>
                )}
              </div>

              {/* Rewired Neural Code Output */}
              <AnimatePresence>
                {isCompiled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    {/* Compilation Console logs */}
                    <div className="bg-black border border-emerald-500/10 rounded-2xl p-4 text-[10px] text-emerald-500 space-y-1">
                      <div>[COMPILE] Initializing System-Level Neural-Reconfig... Success.</div>
                      <div>[COMPILE] Injecting dynamic Meta-Code patch... Success.</div>
                      <div>[SYSTEM] EGO OS REBOOT COMPLETED. VERSION v2.0.0-META.</div>
                    </div>

                    {/* 1. Neural Rewrite Guide */}
                    <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/5 relative">
                      <div className="text-[9px] font-mono text-emerald-400 mb-3 tracking-wider flex items-center gap-1">
                        <Zap size={10} />
                        <span>💡 뉴럴코드 가이드 (주파수 관점 재배선)</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed break-keep font-serif">
                        {report.neuralRewrite}
                      </p>
                    </div>

                    {/* 2. Meta Mantra */}
                    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
                      <div className="text-[9px] font-mono text-indigo-400 mb-3 tracking-wider flex items-center gap-1">
                        <Cpu size={10} />
                        <span>🧬 메타코드 자각 선언문</span>
                      </div>
                      <p className="text-sm text-indigo-100/90 leading-relaxed font-serif break-keep italic text-center py-2 font-semibold">
                        &ldquo;{report.metaMantra}&rdquo;
                      </p>
                    </div>

                    {/* 3. Reflection Command Center */}
                    <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-950/5">
                      <div className="text-[9px] font-mono text-purple-400 mb-3 tracking-wider flex items-center gap-1">
                        <Terminal size={10} />
                        <span>🔍 의식 복구 명령 스크립트 작성 (수취인 반송)</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-4 break-keep leading-relaxed font-sans">
                        가슴의 울림을 소리 내어 읽고 아래 콘솔란에 가벼운 대답을 적어 본래거울로 로그 파일을 완전히 소멸해 보세요.
                      </p>

                      <div className="space-y-4">
                        {report.systemLog.map((q, i) => (
                          <div key={i} className="space-y-2 border-l border-purple-500/20 pl-3">
                            <p className="text-xs text-purple-300 font-semibold leading-relaxed font-serif">{i + 1}. {q}</p>
                            <input 
                              type="text" 
                              disabled={isSubmitted}
                              value={answers[i]}
                              onChange={(e) => handleAnswerChange(i, e.target.value)}
                              placeholder="가슴의 울림을 한 줄 적어보세요..."
                              className="w-full bg-black/50 border border-emerald-500/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-purple-500 placeholder-gray-800 transition font-mono"
                            />
                          </div>
                        ))}
                      </div>

                      {!isSubmitted ? (
                        <button
                          onClick={() => setIsSubmitted(true)}
                          className="w-full py-3 mt-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 text-purple-400 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <Send size={12} />
                          <span>메타코드 서버로 전송 및 로그 소멸(Upload & Clean Logs)</span>
                        </button>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-center text-xs text-emerald-400 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={14} />
                          <span>[OS LOG WIPE SUCCESS] 모든 다크코드 로그가 우주 먼지처럼 초기화되었습니다. ✨</span>
                        </motion.div>
                      )}
                    </div>

                    {/* 4. Cosmic Blessing */}
                    <div className="text-center py-6 border-t border-emerald-500/10">
                      <span className="text-[9px] font-mono text-gray-500 tracking-widest block mb-3">COSMIC TUNING FREQUENCY</span>
                      <p className="text-xs text-gray-400 font-serif leading-relaxed italic break-keep max-w-sm mx-auto">
                        &ldquo;{report.blessing}&rdquo;
                      </p>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
