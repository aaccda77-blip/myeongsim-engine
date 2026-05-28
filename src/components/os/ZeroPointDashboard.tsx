'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, CheckCircle2, AlertTriangle, Wind } from 'lucide-react';

const THEMES = {
  deepSea: {
    name: '심해의 안식처',
    icon: '🌊',
    color: 'from-blue-600 to-indigo-900',
    zeroColor: 'from-cyan-400 to-blue-600',
    quote: '오늘 하루 세상의 거친 파도와 마주하기 전, 잠시 이곳 깊고 안전한 바닷속에 머물러도 좋습니다. 여기서는 아무것도 애쓸 필요가 없습니다.'
  },
  forest: {
    name: '따뜻한 숨결이 닿는 겨울 숲',
    icon: '🌿',
    color: 'from-emerald-700 to-green-900',
    zeroColor: 'from-emerald-400 to-teal-500',
    quote: '밤새 차갑게 굳어있던 당신의 마음에 따뜻한 불꽃을 지핍니다. 얼어붙은 상처가 천천히 녹아내리며, 다시 앞으로 나아갈 온기가 차오릅니다.'
  },
  space: {
    name: '새벽이슬 머금은 우주',
    icon: '🌌',
    color: 'from-purple-700 to-fuchsia-900',
    zeroColor: 'from-purple-400 to-pink-500',
    quote: '가슴이 아리고 떨리는 것은 당신이 살아있다는 우주의 신호입니다. 그 떨림을 밀어내지 말고, 이 투명한 소리의 물결 위에 가만히 띄워 보내주세요.'
  },
  embrace: {
    name: '나를 안아주는 온전한 주파수',
    icon: '🕊️',
    color: 'from-rose-700 to-pink-900',
    zeroColor: 'from-rose-400 to-orange-400',
    quote: '사랑하는 나의 영혼아, 얼마나 애를 쓰며 여기까지 왔니. 지금 이 순간만큼은 모든 무거운 짐을 내려놓고, 그저 나의 이 따뜻한 품에 기대어 쉬렴.'
  }
};

// 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
const getDayTheme = (dayIndex: number) => {
  switch (dayIndex) {
    case 1:
    case 5:
      return THEMES.deepSea;
    case 2:
    case 0:
      return THEMES.forest;
    case 3:
    case 6:
      return THEMES.space;
    case 4:
      return THEMES.embrace;
    default:
      return THEMES.deepSea;
  }
};

export default function ZeroPointDashboard() {
  const [dayIndex, setDayIndex] = useState(1);
  const [isAligned, setIsAligned] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDayIndex(new Date().getDay());
  }, []);

  const theme = getDayTheme(dayIndex);

  const startPress = () => {
    if (isAligned) return;
    setIsPressing(true);
    setProgress(0);
    
    // Haptic feedback start
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 50, 50]);
    }

    let currentProgress = 0;
    progressInterval.current = setInterval(() => {
      currentProgress += 2; // 2% every 20ms = 100% in 1 second
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        completeAlignment();
      }
    }, 20);
  };

  const completeAlignment = () => {
    stopPress();
    setIsAligned(true);
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200); // Stronger haptic on completion
    }
  };

  const stopPress = () => {
    setIsPressing(false);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (!isAligned) {
      setProgress(0);
    }
  };

  // Consciousness Gauge Steps
  const steps = [
    { label: '애쓰기 (Striving)', icon: AlertTriangle, activeColor: 'text-rose-400' },
    { label: '환멸 (Disillusionment)', icon: Wind, activeColor: 'text-amber-400' },
    { label: '진정한 수용 (Zero Point)', icon: CheckCircle2, activeColor: 'text-emerald-400' }
  ];

  let currentStep = 0;
  if (isAligned) currentStep = 2;
  else if (isPressing && progress > 50) currentStep = 1;

  return (
    <div className="w-full bg-slate-900/40 rounded-3xl border border-slate-700/50 overflow-hidden relative mb-8 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />
      
      <div className="p-6 md:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8 z-10">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 mb-2">
            뉴럴 바이오-싱크 캘린더
          </h2>
          <p className="text-sm text-slate-400">
            오늘 내 의식의 영점(Zero Point)을 맞춰보세요.
          </p>
        </div>

        {/* Dynamic Aura Energy Wave */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center z-10">
          {/* Animated Wave Background */}
          <motion.div
            animate={{
              rotate: isAligned ? [0, 360] : isPressing ? [0, 720] : [0, 360],
              scale: isAligned ? [1, 1.05, 1] : isPressing ? [1, 0.9, 1] : [1, 1.1, 1],
              borderRadius: isAligned 
                ? ["50%", "50%", "50%"] 
                : ["40% 60% 70% 30%", "30% 70% 40% 60%", "60% 40% 30% 70%", "40% 60% 70% 30%"]
            }}
            transition={{
              rotate: { duration: isAligned ? 20 : isPressing ? 5 : 10, repeat: Infinity, ease: "linear" },
              scale: { duration: isAligned ? 4 : isPressing ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" },
              borderRadius: { duration: isAligned ? 10 : 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`absolute inset-0 opacity-80 blur-xl transition-all duration-1000 bg-gradient-to-br 
              ${isAligned ? theme.zeroColor : isPressing ? 'from-amber-600 to-rose-900' : 'from-rose-600 to-slate-900'}`}
          />
          
          <motion.div
            animate={{
              rotate: isAligned ? [360, 0] : isPressing ? [360, -360] : [360, 0],
              borderRadius: isAligned 
                ? ["50%", "50%", "50%"] 
                : ["30% 70% 40% 60%", "60% 40% 30% 70%", "40% 60% 70% 30%", "30% 70% 40% 60%"]
            }}
            transition={{
              rotate: { duration: isAligned ? 25 : isPressing ? 4 : 8, repeat: Infinity, ease: "linear" },
              borderRadius: { duration: isAligned ? 12 : 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`absolute inset-4 opacity-90 transition-all duration-1000 bg-gradient-to-tr
              ${isAligned ? theme.zeroColor : isPressing ? 'from-orange-500 to-red-800' : 'from-red-500 to-zinc-900'}`}
          />

          {/* Interactive Button */}
          <button
            onPointerDown={startPress}
            onPointerUp={stopPress}
            onPointerLeave={stopPress}
            disabled={isAligned}
            className={`relative z-20 w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden
              ${isAligned ? 'bg-slate-900/40 backdrop-blur-sm border border-cyan-500/50' : 'bg-slate-900/80 backdrop-blur-md border border-rose-500/30'}
            `}
          >
            {/* Press Progress Ring */}
            {!isAligned && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-rose-500/20"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${progress * 3.14} 1000`}
                  className="text-amber-400 transition-all duration-75"
                />
              </svg>
            )}

            {isAligned ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                <span className="text-4xl mb-2">{theme.icon}</span>
                <span className="text-xs font-bold text-cyan-200">Zero Point</span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-rose-200">
                <Fingerprint className={`w-10 h-10 mb-2 ${isPressing ? 'animate-pulse text-amber-300' : ''}`} />
                <span className="text-xs font-medium uppercase tracking-wider">{isPressing ? '정렬 중...' : '길게 누르기'}</span>
              </div>
            )}
          </button>
        </div>

        {/* Message Area */}
        <div className="mt-10 max-w-lg min-h-[120px] text-center z-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isAligned ? (
              <motion.div
                key="agitated"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-[15px] leading-relaxed text-rose-300/80 bg-rose-950/30 p-4 rounded-xl border border-rose-900/50">
                  지금 에고가 과거의 피로 데이터를 처리하느라 공회전(DMN) 중입니다. <br/>
                  억지로 힘내려고 애쓰지 마세요. 중앙을 지그시 눌러 전원을 잠시 꺼주세요.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="aligned"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                  <span className="text-lg">{theme.icon}</span>
                  <span className="text-xs font-bold text-slate-300">{theme.name} 테마 활성화</span>
                </div>
                <p className="text-[15px] leading-relaxed text-cyan-100 bg-cyan-950/20 p-5 rounded-2xl border border-cyan-500/20 font-medium">
                  "{theme.quote}"
                </p>
                <div className="text-xs text-slate-500 animate-pulse pt-2">
                  (이어폰을 꽂고 편안히 호흡하세요)
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3-Step Gauge */}
        <div className="w-full max-w-md mt-10 grid grid-cols-3 gap-2 relative z-10">
          {/* Connecting line */}
          <div className="absolute top-4 left-[16%] right-[16%] h-[2px] bg-slate-800 -z-10" />
          
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isPassed = idx < currentStep;
            const StepIcon = step.icon;
            
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 mb-2
                  ${isActive ? 'bg-slate-800 border-2 border-slate-600 scale-110 shadow-lg' : 
                    isPassed ? 'bg-slate-900 border border-slate-700' : 'bg-slate-900 border border-slate-800'}`}
                >
                  <StepIcon className={`w-4 h-4 transition-colors duration-500
                    ${isActive ? step.activeColor : isPassed ? 'text-slate-500' : 'text-slate-700'}`} 
                  />
                </div>
                <span className={`text-[10px] md:text-xs text-center font-medium transition-colors duration-500
                  ${isActive ? 'text-slate-200' : isPassed ? 'text-slate-500' : 'text-slate-700'}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
