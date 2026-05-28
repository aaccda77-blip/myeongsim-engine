'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cigarette, Scan, RefreshCcw, ShieldAlert, CheckCircle2, GlassWater } from 'lucide-react';

export default function AddictionProtocol() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      id: 'step1',
      title: '금단 강박 프로그램 종료',
      desc: '"참아야 해"라고 에고가 억누를수록 뇌의 도파민 회로는 폭발적인 결핍을 창조합니다. 담배와 술과 싸우려는 통제자의 발버둥을 시스템에서 즉시 종료하세요.',
      action: '강제 종료 (Force Quit)',
      icon: <ShieldAlert className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-fuchsia-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'step2',
      title: '도파민 갈망 데이터 스캔',
      desc: '충동이 치솟을 때 억누르지 말고, 그 갈망 밑에 깔린 진짜 감정(스트레스, 공허함, 외로움)의 인격체를 텅 빈 마음으로 100% 마주하여 스캔합니다.',
      action: '갈망 데이터 디버깅',
      icon: <Scan className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-500/20 to-blue-500/10',
      borderColor: 'border-indigo-500/30'
    },
    {
      id: 'step3',
      title: '공허함 로그 영구 삭제',
      desc: '불안과 공허함의 에너지가 텅 빈 마음에 녹아 사라지면, 시스템은 더 이상 담배나 술로 도파민을 강제 보상할 이유를 상실합니다.',
      action: '공허함 로그 정화',
      icon: <RefreshCcw className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-sky-500/10',
      borderColor: 'border-cyan-500/30'
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
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-xl flex flex-col items-center mt-4">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-fuchsia-300 mb-2 tracking-tight flex items-center justify-center gap-3">
            <GlassWater className="w-7 h-7 text-purple-400" />
            ADDICTION DETOX
          </h2>
          <p className="text-purple-200/60 text-xs font-mono tracking-widest uppercase">
            금연/금주 도파민 디버깅
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
                  <div className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-cyan-400 transition-colors animate-pulse" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-slate-900/60 border border-indigo-500/30 p-10 rounded-3xl backdrop-blur-xl text-center shadow-[0_0_50px_rgba(99,102,241,0.15)] flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">도파민 회로 리셋 완료</h3>
                <p className="text-indigo-100/70 text-sm leading-relaxed break-keep mb-8">
                  의존성을 만들어내던 무의식의 공허함이 소멸되었습니다. 시스템은 인위적인 도파민 자극 없이도 완전한 평온함(Zero Point)을 유지합니다.
                </p>
                <button
                  onClick={reset}
                  className="px-8 py-3 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-full text-sm font-bold transition-colors"
                >
                  시스템 재시작
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
