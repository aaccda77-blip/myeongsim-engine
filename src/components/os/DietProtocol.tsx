'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Battery, BatteryWarning, Scan, RefreshCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DietProtocol() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      id: 'step1',
      title: '"살 빼야 해" 강박 프로그램 종료',
      desc: '내 몸을 통제하려는 에고의 집착을 시스템에서 로그아웃합니다.',
      action: '강제 종료 (Force Quit)',
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      color: 'from-rose-500/20 to-pink-500/10',
      borderColor: 'border-rose-500/30'
    },
    {
      id: 'step2',
      title: '가짜 식탐(갈망) 데이터 스캔',
      desc: '지금 느끼는 갈망 뒤에 숨은 진짜 감정(스트레스, 외로움)을 텅 빈 마음으로 바라봅니다.',
      action: '갈망 데이터 디버깅',
      icon: <Scan className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      id: 'step3',
      title: '바디 수치심 로그 영구 삭제',
      desc: '거울 속 내 몸을 향한 비참함과 원망의 에너지를 느껴서 텅 빈 마음속으로 녹여냅니다.',
      action: '수치심 로그 정화',
      icon: <RefreshCcw className="w-6 h-6 text-teal-400" />,
      color: 'from-teal-500/20 to-emerald-500/10',
      borderColor: 'border-teal-500/30'
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
      <div className="fixed top-[10%] left-[-20%] w-[70%] h-[70%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-xl flex flex-col items-center mt-4">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-rose-300 mb-2 tracking-tight flex items-center justify-center gap-3">
            <BatteryWarning className="w-7 h-7 text-pink-400" />
            BODY DEBUGGING
          </h2>
          <p className="text-pink-200/60 text-xs font-mono tracking-widest uppercase">
            다이어트 강박 해제 프로토콜
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
                  <div className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-green-400 transition-colors animate-pulse" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-slate-900/60 border border-teal-500/30 p-10 rounded-3xl backdrop-blur-xl text-center shadow-[0_0_50px_rgba(20,184,166,0.15)] flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">정렬 완료</h3>
                <p className="text-teal-100/70 text-sm leading-relaxed break-keep mb-8">
                  원인을 제공하던 무의식의 결핍 데이터가 지워졌습니다. 이제 시스템은 애쓰지 않아도 가장 건강하고 가벼운 상태로 저절로 정렬됩니다.
                </p>
                <button
                  onClick={reset}
                  className="px-8 py-3 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 rounded-full text-sm font-bold transition-colors"
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
