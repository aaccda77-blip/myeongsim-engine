'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CandyRitualCanvasProps {
  phase: 'intro' | 'scan' | 'sync' | 'shift';
  flavor: string;
}

export default function CandyRitualCanvas({ phase, flavor }: CandyRitualCanvasProps) {
  const [waveSeed, setWaveSeed] = useState<number>(0);

  // 뇌파 움직임 시뮬레이션을 위한 애니메이션 루프
  useEffect(() => {
    let animationId: number;
    const updateWave = () => {
      setWaveSeed((prev) => (prev + 0.08) % (Math.PI * 2));
      animationId = requestAnimationFrame(updateWave);
    };
    animationId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // 단계별 뇌파 패스(d) 생성 함수
  const generateBrainwavePath = () => {
    const width = 300;
    const height = 60;
    const points = [];
    const step = 4;
    
    // phase에 따른 진폭과 주파수 제어
    let amplitude = 15;
    let frequency = 0.05;
    let noise = 0;

    if (phase === 'scan') {
      amplitude = 18;
      frequency = 0.12;
      noise = 5; // 거친 뇌파 노이즈
    } else if (phase === 'sync') {
      amplitude = 8;
      frequency = 0.04;
      noise = 0.5; // 안정된 뇌파
    } else if (phase === 'shift') {
      amplitude = 1.5;
      frequency = 0.01;
      noise = 0; // 극도의 평온함
    } else {
      amplitude = 4;
      frequency = 0.03;
    }

    for (let x = 0; x <= width; x += step) {
      // 거친 노이즈 시뮬레이션
      const noiseVal = noise > 0 
        ? (Math.sin(x * 0.5 + waveSeed * 5) * noise * 0.5) + (Math.cos(x * 1.2 - waveSeed * 3) * noise * 0.3)
        : 0;
      
      const y = (height / 2) + Math.sin(x * frequency + waveSeed) * amplitude + noiseVal;
      points.push(`${x},${y}`);
    }

    return `M ${points.join(' L ')}`;
  };

  // 알사탕 크기 & 밝기 매핑
  const getCandyScale = () => {
    switch (phase) {
      case 'intro': return 1.0;
      case 'scan': return 0.8;
      case 'sync': return 0.5;
      case 'shift': return 0.0; // 완전히 녹음
      default: return 1.0;
    }
  };

  const candyScale = getCandyScale();

  // phase에 따른 대표 컬러셋
  const getThemeColor = () => {
    switch (phase) {
      case 'scan': return { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' }; // Yellow
      case 'sync': return { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' }; // Purple
      case 'shift': return { primary: '#60a5fa', glow: 'rgba(96, 165, 250, 0.5)' }; // Blue
      default: return { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' }; // Intro Blue
    }
  };

  const theme = getThemeColor();

  return (
    <div className="w-full aspect-[4/3] max-w-sm mx-auto relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-zinc-950/40 border border-white/5 backdrop-blur-md">
      {/* CSS 커스텀 키프레임 주입 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes scanMove {
          0%, 100% { top: 10%; opacity: 0.8; }
          50% { top: 90%; opacity: 0.8; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.35; }
        }
        @keyframes rotateOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-scanMove {
          animation: scanMove 4s ease-in-out infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .animate-rotateOrbit {
          animation: rotateOrbit 12s linear infinite;
        }
      `}} />

      {/* 우주 성운 Glow 배경 백그라운드 */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[70px] transition-all duration-1000 animate-pulseGlow"
          style={{ backgroundColor: theme.primary }}
        />
      </div>

      {/* 1. SCAN PHASE: 아바타 와이어프레임 & 스캔 바 연출 */}
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* 아바타 와이어프레임 형상 */}
            <svg viewBox="0 0 100 100" className="w-44 h-44 text-yellow-500/10 stroke-yellow-500/30 stroke-[1.5] fill-none">
              <path d="M50,20 C58,20 62,28 62,35 C62,45 50,52 50,52 C50,52 38,45 38,35 C38,28 42,20 50,20 Z" />
              <path d="M15,90 C15,75 30,65 50,65 C70,65 85,75 85,90" strokeDasharray="3 3" />
              <circle cx="50" cy="35" r="3" className="fill-yellow-500/40" />
            </svg>
            
            {/* 레이저 스캔 바 */}
            <div className="absolute left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_12px_#eab308] animate-scanMove" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SYNC PHASE: 은하수 궤도 가동 */}
      <AnimatePresence>
        {phase === 'sync' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none animate-rotateOrbit"
          >
            {/* 궤도 회전 입자들 */}
            <svg viewBox="0 0 100 100" className="w-56 h-56 text-purple-500/30">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 15" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
              {/* 공전하는 밝은 노드들 */}
              <circle cx="90" cy="50" r="2.5" fill="#a855f7" className="shadow-[0_0_10px_#a855f7]" />
              <circle cx="10" cy="50" r="2" fill="#c084fc" />
              <circle cx="50" cy="78" r="1.5" fill="#e879f9" />
              <circle cx="50" cy="22" r="2" fill="#a855f7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SHIFT PHASE: 완전히 녹아 흩어지며 공간 팽창 */}
      <AnimatePresence>
        {phase === 'shift' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-blue-500/[0.03]"
          >
            {/* 빛의 메타코드 스크린 틀 */}
            <div className="absolute inset-4 border border-blue-500/20 rounded-2xl flex items-center justify-center">
              <div className="text-[10px] text-blue-400/30 font-mono absolute top-2 left-2">META_SCREEN_ACTIVE // 60FPS</div>
              <div className="text-[10px] text-blue-400/30 font-mono absolute bottom-2 right-2">ZERO_POINT_OS</div>
              
              {/* 사방으로 뻗는 레이아웃 가이드 선 */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-500/5" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-blue-500/5" />
            </div>
            
            {/* 중앙 광원 폭발 파동 */}
            <motion.div 
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 2.2, opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              className="w-24 h-24 rounded-full border border-blue-500/40 bg-blue-500/10 blur-[2px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 중앙 디지털 알사탕 (Zero-Point Candy) */}
      <div 
        className="w-32 h-32 flex items-center justify-center transition-all duration-1000 relative z-20 animate-float"
        style={{ transform: `scale(${candyScale})` }}
      >
        {/* 알사탕 형상 렌더링 (SVG) */}
        {candyScale > 0 && (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]">
            <defs>
              {/* 네온 그라데이션 광원 */}
              <linearGradient id="candyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" /> {/* 밝은 바이올렛 */}
                <stop offset="50%" stopColor="#a855f7" /> {/* 미디엄 퍼플 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* 블루 */}
              </linearGradient>
              <linearGradient id="wrapperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.1)" stopOpacity="0.1" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 투명 사탕 껍질 날개 (좌측) */}
            <path d="M15,50 C5,40 5,25 20,35 C28,39 30,48 30,50 C30,52 28,61 20,65 C5,75 5,60 15,50 Z" 
              fill="url(#wrapperGrad)" 
              stroke="#a855f7" 
              strokeWidth="0.7" 
              strokeDasharray="2 2"
            />
            {/* 투명 사탕 껍질 날개 (우측) */}
            <path d="M85,50 C95,40 95,25 80,35 C72,39 70,48 70,50 C70,52 72,61 80,65 C95,75 95,60 85,50 Z" 
              fill="url(#wrapperGrad)" 
              stroke="#3b82f6" 
              strokeWidth="0.7" 
              strokeDasharray="2 2"
            />

            {/* 알사탕 본체 (Glow 적용) */}
            <circle cx="50" cy="50" r="23" 
              fill="url(#candyGrad)" 
              filter="url(#softGlow)" 
              stroke="rgba(255,255,255,0.25)" 
              strokeWidth="0.7" 
            />

            {/* 입체감을 주는 상단 반사 하이라이트 */}
            <ellipse cx="44" cy="40" rx="9" ry="5" transform="rotate(-15 44 40)" fill="rgba(255,255,255,0.5)" />
            <circle cx="59" cy="42" r="2" fill="rgba(255,255,255,0.6)" />

            {/* 알사탕 속 '0(Zero)' 심볼 */}
            <text x="50" y="56" 
              textAnchor="middle" 
              className="fill-white font-serif font-bold text-[18px] opacity-80"
              style={{ userSelect: 'none' }}
            >
              0
            </text>
          </svg>
        )}
      </div>

      {/* 💡 초보자를 위한 디지털 알사탕 1초 도슨트 툴팁 */}
      <div className="absolute top-3 inset-x-3 bg-slate-950/90 border border-purple-500/40 rounded-xl px-3 py-1.5 text-center text-[10px] font-sans z-30 shadow-lg backdrop-blur-md">
        <span className="font-black text-amber-300">💡 디지털 알사탕(0)의 의미: </span>
        <span className="text-slate-200 font-medium">
          지친 뇌(DMN)의 과부하를 0(Zero)으로 비우고 이경윤님의 본질 주파수를 일깨우는 10초 자각 알사탕입니다.
        </span>
      </div>

      {/* 뇌파 (편도체) 파형 디스플레이 영역 */}
      <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center pointer-events-none z-30">
        <svg className="w-72 h-14 overflow-visible">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="20%" stopColor={theme.primary} />
              <stop offset="80%" stopColor={theme.primary} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d={generateBrainwavePath()}
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="1.5"
            filter="url(#neonGlow)"
            className="transition-all duration-700"
          />
        </svg>
        <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider mt-0.5">
          {phase === 'intro' && '🔮 뇌 과부하 정밀 컴파일 준비'}
          {phase === 'scan' && '⚠️ 편도체 과부하 감지 // 과열된 생각 스캔 중'}
          {phase === 'sync' && '✨ 제로포인트 주파수 정렬 // 마음 이완 중'}
          {phase === 'shift' && '🌌 본질 스크린 각성 // 제로포인트 시프트 완료'}
        </span>
      </div>

      {/* 알사탕 레이블 표시 */}
      {phase === 'intro' && candyScale > 0 && (
        <div className="absolute top-4 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1 text-[9px] font-mono text-purple-300 tracking-wider backdrop-blur-md z-30">
          🍬 {flavor.length > 20 ? flavor.slice(0, 18) + '...' : flavor}
        </div>
      )}
    </div>
  );
}
