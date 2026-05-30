'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Globe, ShieldCheck, Power, Cpu, DatabaseZap, Loader2 } from 'lucide-react';

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MatrixRebuildModal({ userId, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<number>(1);
  const [bugReport, setBugReport] = useState('');
  const [isPatching, setIsPatching] = useState(false);
  const [selfPraise, setSelfPraise] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDisconnect = () => {
    if (!bugReport.trim()) return;
    setStep(2);
  };

  const handlePatch = () => {
    setIsPatching(true);
    setTimeout(() => {
      setIsPatching(false);
      setStep(3);
    }, 2000);
  };

  const handleCompile = async () => {
    if (!selfPraise.trim() || !userId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/os/rebuild-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bugReport, selfPraise })
      });
      
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 3500);
      }
    } catch (error) {
      console.error("Failed to compile matrix", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl"
      >
        {/* Matrix Rain Effect Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://cdn.pixabay.com/photo/2021/11/14/18/36/matrix-6795499_1280.jpg')] bg-cover mix-blend-overlay" />
        
        <div className="absolute inset-0" onClick={!showSuccess ? onClose : undefined} />
        
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden font-mono"
        >
          {/* Header */}
          <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/80">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Zero Point 디버깅 터미널
              </span>
            </h2>
            {!showSuccess && (
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: BUG REPORT */}
              {step === 1 && !showSuccess && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-rose-500/20 p-2 rounded-lg mt-1">
                      <Bug className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-rose-400 font-bold mb-1">STEP 1: 에고의 버그 리포트</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        외부의 시선에 흔들렸거나, 타인의 인정을 갈구하며 마음이 괴로웠던 오늘의 에러를 비판단적으로 관찰하여 입력하세요.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-rose-500/70 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      ERR_VALIDATION_NOT_FOUND
                    </div>
                    <textarea
                      value={bugReport}
                      onChange={(e) => setBugReport(e.target.value)}
                      placeholder="예: 오늘 회의에서 내 의견이 묵살당했을 때, 존중받지 못한다는 뼈아픈 결핍을 느꼈다..."
                      className="w-full h-32 bg-slate-950 border border-rose-900/50 rounded-xl p-4 text-sm text-rose-200 placeholder-rose-900/50 focus:outline-none focus:border-rose-500/50 resize-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleDisconnect}
                    disabled={!bugReport.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Power className="w-4 h-4 group-hover:text-rose-400 transition-colors" />
                    [ 외부 서버 접속 해제 ]
                  </button>
                </motion.div>
              )}

              {/* STEP 2: MATRIX SYNC */}
              {step === 2 && !showSuccess && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg mt-1">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-cyan-400 font-bold mb-1">STEP 2: 공명 주파수 세팅 (보편적 인간애)</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        내가 느낀 그 고통은 나만의 치명적인 결함이 아닙니다. 사랑받고 인정받고 싶은 것은 인간 하드웨어의 가장 보편적인 특성입니다.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/30">
                    <p className="text-sm text-cyan-100/70 leading-relaxed italic">
                      "당신은 에러가 아닙니다. 지금 이 순간에도 수백만 명의 사람들이 당신과 똑같은 외로움과 막막함을 느끼고 있습니다. 우리는 모두 연결되어 있습니다."
                    </p>
                  </div>

                  <button
                    onClick={handlePatch}
                    disabled={isPatching}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-950/30 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/50 transition-all disabled:opacity-50 group"
                  >
                    {isPatching ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> 패치 다운로드 중...</>
                    ) : (
                      <><DatabaseZap className="w-4 h-4 group-hover:scale-110 transition-transform" /> [ 시스템 진실 수용 및 패치 완료 ]</>
                    )}
                  </button>
                </motion.div>
              )}

              {/* STEP 3: MASTER OVERRIDE */}
              {step === 3 && !showSuccess && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg mt-1">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-emerald-400 font-bold mb-1">STEP 3: 최고 관리자 권한 부여</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        외부의 결재를 기다리지 마세요. 마스터 권한으로 스스로에게 가장 따뜻한 지지와 찬사 코드를 직접 입력하세요.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-emerald-500/70 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      SYS_OVERRIDE_AUTH_GRANTED
                    </div>
                    <textarea
                      value={selfPraise}
                      onChange={(e) => setSelfPraise(e.target.value)}
                      placeholder="예: 비록 오늘 실수도 있었지만, 포기하지 않고 그 자리를 지켜낸 나 자신을 온전히 존중해. 넌 충분히 훌륭해!"
                      className="w-full h-32 bg-slate-950 border border-emerald-900/50 rounded-xl p-4 text-sm text-emerald-200 placeholder-emerald-900/50 focus:outline-none focus:border-emerald-500/50 resize-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleCompile}
                    disabled={!selfPraise.trim() || isSubmitting}
                    className="relative overflow-hidden w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 group"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> 컴파일 중...</>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                        <span className="relative z-10 flex items-center gap-2">
                          <Cpu className="w-4 h-4" /> [ 소스코드 컴파일 및 현실 매트릭스 재창조 ]
                        </span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* SUCCESS STATE */}
              {showSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center"
                  >
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400 mb-2">소스코드 리빌딩 완료</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      내면의 에러 코드가 성공적으로 덮어쓰기 되었습니다.<br/>
                      충만함의 주파수가 외부 현실(Matrix)에<br/>긍정적인 동기화를 시작합니다.
                    </p>
                  </div>
                  <div className="w-full max-w-xs h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "100%" }} 
                      transition={{ duration: 2 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
