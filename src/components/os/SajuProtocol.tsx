'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Scan, RefreshCcw, ShieldAlert, CheckCircle2, Orbit } from 'lucide-react';

export default function SajuProtocol() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      id: 'step1',
      title: '운명 한계 프로그램 종료',
      desc: '"내 사주가 원래 이래", "난 화(火)가 많아서 그래"라며 자신의 무한한 가능성을 8글자의 코드로 가둬버리려는 에고(Ego)의 자기합리화를 시스템에서 강제 종료합니다.',
      action: '운명 강제 종료 (Force Quit)',
      icon: <ShieldAlert className="w-6 h-6 text-zinc-400" />,
      color: 'from-zinc-500/20 to-slate-500/10',
      borderColor: 'border-zinc-500/30'
    },
    {
      id: 'step2',
      title: '팔자(카르마) 패턴 스캔',
      desc: '사주팔자는 정해진 숙명이 아니라, 그동안 무의식적으로 반복해온 [생각과 감정의 습관적 알고리즘]이 뭉쳐진 가상의 인격체임을 텅 빈 마음으로 스캔합니다.',
      action: '패턴 데이터 디버깅',
      icon: <Scan className="w-6 h-6 text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'step3',
      title: '운명 로그 영구 삭제',
      desc: '사주라는 홀로그램에 부여했던 모든 두려움과 맹신의 에너지를 텅 빈 마음에 녹여냅니다. 사주의 굴레가 사라지면 시스템은 한계 없는 창조의 상태로 진입합니다.',
      action: '운명 로그 포맷 (Format)',
      icon: <RefreshCcw className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-500/20 to-violet-500/10',
      borderColor: 'border-indigo-500/30'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(3); // Completed state
    }
  };

  const reset = () => setStep(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 overflow-y-auto relative gpu-accelerated scrollbar-hide pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black pointer-events-none" />
      <div className="fixed top-[-10%] right-[-10%] w-[70%] h-[70%] bg-zinc-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-xl flex flex-col items-center mt-4">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-white to-slate-300 mb-2 tracking-tight flex items-center justify-center gap-3">
            <Orbit className="w-7 h-7 text-zinc-400" />
            DESTINY FORMAT
          </h2>
          <p className="text-zinc-200/60 text-xs font-mono tracking-widest uppercase">
            사주팔자 디버깅 프로토콜
          </p>
        </header>

        <div className="w-full relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step < 3 ? (
              <motion.div
                key={steps[step].id}
                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                className={`w-full bg-gradient-to-br ${steps[step].color} border ${steps[step].borderColor} p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center shadow-inner border border-white/10">
                    {steps[step].icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">Phase 0{step + 1}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">{steps[step].title}</h3>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed break-keep mb-10 font-medium">
                  {steps[step].desc}
                </p>

                <button
                  onClick={handleNext}
                  className="w-full py-4 mt-auto bg-black/40 hover:bg-black/60 border border-white/20 rounded-2xl text-white font-bold tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                >
                  {steps[step].action}
                  <div className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-indigo-400 transition-colors animate-pulse" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-slate-900/60 border border-zinc-500/30 p-10 rounded-3xl backdrop-blur-xl text-center shadow-[0_0_50px_rgba(161,161,170,0.15)] flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-zinc-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-zinc-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">팔자(카르마) 포맷 완료</h3>
                <p className="text-zinc-300/70 text-sm leading-relaxed break-keep mb-8">
                  사주라는 8글자의 코드가 시스템에서 완전히 포맷되었습니다. 이제 당신의 운명은 과거의 습관적 알고리즘이 아닌, 텅 빈 마음(Zero Point)의 무한한 자유 속에서 매 순간 새롭게 창조됩니다.
                </p>
                <button
                  onClick={reset}
                  className="px-8 py-3 bg-zinc-500/20 hover:bg-zinc-500/40 text-zinc-300 rounded-full text-sm font-bold transition-colors"
                >
                  무한의 캔버스로 재부팅
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
