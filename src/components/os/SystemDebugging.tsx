'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, PowerOff } from 'lucide-react';

export default function SystemDebugging() {
  const [isDebugging, setIsDebugging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Camera handling (Optional feature as per plan)
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isDebugging && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(e => console.warn('Camera access denied or unavailable', e));
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isDebugging]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDebugging && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => {
          const next = p + 1;
          if (next > 30 && phase === 0) setPhase(1);
          if (next > 70 && phase === 1) setPhase(2);
          if (next >= 100) clearInterval(interval);
          return next;
        });
      }, 150); // 15 seconds total
    }
    return () => clearInterval(interval);
  }, [isDebugging, progress, phase]);

  const startDebugging = () => {
    setIsDebugging(true);
    setProgress(0);
    setPhase(0);
  };

  const stopDebugging = () => {
    setIsDebugging(false);
    setProgress(0);
    setPhase(0);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 overflow-hidden relative">
      {/* Background Camera / Ambience */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
      {isDebugging && (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale contrast-125 mix-blend-screen"
        />
      )}
      <div className={`absolute inset-0 transition-colors duration-1000 ${isDebugging ? 'bg-indigo-950/50' : 'bg-transparent'}`} />

      <div className="z-10 w-full max-w-xl flex flex-col h-full items-center justify-center">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-teal-300 mb-2 tracking-tight">
            SYSTEM DEBUGGING
          </h2>
          <p className="text-emerald-200/60 text-sm font-mono tracking-widest uppercase">
            Neural Balance Protocol
          </p>
        </header>

        {!isDebugging ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full flex flex-col items-center"
          >
            <div className="w-full bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-3xl mb-8 backdrop-blur-md text-center">
              <ShieldAlert className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-emerald-100 font-bold mb-2">과부하 감지됨</h3>
              <p className="text-emerald-200/70 text-sm leading-relaxed mb-6 break-keep">
                현재 몸에 묵직한 감각(갈망, 두려움, 분노)이 걸려있습니다. 스토리(생각)를 차단하고, 순수한 물리적 감각에만 접속하여 에너지를 정화합니다.
              </p>
              <button 
                onClick={startDebugging}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black tracking-widest uppercase shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
              >
                디버깅 시작 (Start)
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full flex flex-col items-center relative"
          >
            {/* Guide Messages */}
            <div className="h-24 flex items-center justify-center text-center mb-8">
              <AnimatePresence mode="wait">
                {phase === 0 && (
                  <motion.p key="phase0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-emerald-100 text-lg font-medium">
                    "스토리를 차단합니다.<br/>가슴의 답답함, 심장의 쿵쾅거림 그 자체만 느끼세요."
                  </motion.p>
                )}
                {phase === 1 && (
                  <motion.p key="phase1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-emerald-100 text-lg font-medium">
                    "판단하지 않고 온전히 수용합니다.<br/>거울 속 나의 텅 빈 눈동자를 바라보세요."
                  </motion.p>
                )}
                {phase === 2 && progress < 100 && (
                  <motion.p key="phase2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-teal-100 text-lg font-medium">
                    "에너지가 정화되고 있습니다.<br/>이제 당신은 관찰자(Zero Point)입니다."
                  </motion.p>
                )}
                {progress >= 100 && (
                  <motion.p key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-emerald-300 text-xl font-black">
                    SYSTEM ZERO POINT REACHED
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Neural Progress Bar */}
            <div className="w-full relative h-32 flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-emerald-500/20" />
              
              {/* Wave Animation representing Turbulence settling down */}
              {progress < 100 ? (
                <div className="flex gap-1 items-center h-full">
                  {[...Array(20)].map((_, i) => {
                    const amplitude = Math.max(2, 50 - (progress / 2)); // Settles down over time
                    return (
                      <motion.div
                        key={i}
                        animate={{ height: [10, amplitude + Math.random() * 20, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                        className="w-1.5 rounded-full bg-emerald-400"
                        style={{ opacity: 0.3 + (progress / 200) }}
                      />
                    );
                  })}
                </div>
              ) : (
                <motion.div 
                  initial={{ height: 50, opacity: 0 }} 
                  animate={{ height: 2, opacity: 1, width: '100%' }} 
                  className="bg-teal-400 rounded-full shadow-[0_0_20px_#2dd4bf]"
                />
              )}
            </div>

            <div className="mt-8 flex items-center gap-4 text-emerald-400 font-mono text-xl">
              <Activity className="w-5 h-5 animate-pulse" />
              {progress.toFixed(0)}%
            </div>

            {progress >= 100 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={stopDebugging}
                className="mt-12 px-6 py-2 border border-teal-500/50 text-teal-300 rounded-full hover:bg-teal-500/20 transition-all font-mono"
              >
                COMPLETE & RETURN
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
