'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SleepAudioEngine } from '@/lib/audio/SleepAudioEngine';

// ─── 타입 ────────────────────────────────────────
type Phase = 'IDLE' | 'BREATHING' | 'TRANSITIONING' | 'SLEEP_PLAYING';

type BreathStep = '들숨' | '머무름' | '날숨';

// ─── 호흡 사이클 설정 ────────────────────────────
const BREATHING_DURATION = 60; // 총 60초
const CYCLE_INHALE = 4;       // 들숨 4초
const CYCLE_HOLD = 2;         // 머무름 2초
const CYCLE_EXHALE = 6;       // 날숨 6초
const CYCLE_TOTAL = CYCLE_INHALE + CYCLE_HOLD + CYCLE_EXHALE; // 12초

// 수면 타이머 (30분)
const SLEEP_TIMER_SECONDS = 30 * 60;

// ─── 유틸 ────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getBreathStep(elapsed: number): { step: BreathStep; progress: number } {
  const pos = elapsed % CYCLE_TOTAL;
  if (pos < CYCLE_INHALE) {
    return { step: '들숨', progress: pos / CYCLE_INHALE };
  }
  if (pos < CYCLE_INHALE + CYCLE_HOLD) {
    return { step: '머무름', progress: (pos - CYCLE_INHALE) / CYCLE_HOLD };
  }
  return {
    step: '날숨',
    progress: (pos - CYCLE_INHALE - CYCLE_HOLD) / CYCLE_EXHALE,
  };
}

// ─── 컴포넌트 ────────────────────────────────────
export default function OneMinuteToSleepContainer() {
  const [phase, setPhase] = useState<Phase>('IDLE');
  const [countdown, setCountdown] = useState(BREATHING_DURATION);
  const [breathStep, setBreathStep] = useState<BreathStep>('들숨');
  const [breathProgress, setBreathProgress] = useState(0);
  const [sleepRemaining, setSleepRemaining] = useState(SLEEP_TIMER_SECONDS);
  const [isDimmed, setIsDimmed] = useState(true);

  const engineRef = useRef<SleepAudioEngine | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── 정리 ──
  useEffect(() => {
    return () => {
      breathTimerRef.current && clearInterval(breathTimerRef.current);
      sleepTimerRef.current && clearInterval(sleepTimerRef.current);
      engineRef.current?.stopAll();
    };
  }, []);

  // ── 호흡 시작 ──
  const startBreathing = useCallback(async () => {
    const engine = new SleepAudioEngine();
    await engine.init();
    engineRef.current = engine;

    setPhase('BREATHING');
    setCountdown(BREATHING_DURATION);

    let elapsed = 0;

    // 첫 벨 재생
    engine.playBreathingBell();

    breathTimerRef.current = setInterval(() => {
      elapsed++;
      const remaining = BREATHING_DURATION - elapsed;
      setCountdown(remaining);

      const { step, progress } = getBreathStep(elapsed);
      setBreathStep(step);
      setBreathProgress(progress);

      // 매 사이클 시작 시 벨
      if (elapsed % CYCLE_TOTAL === 0 && remaining > 0) {
        engine.playBreathingBell();
      }

      // 60초 완료 → 수면 전환
      if (remaining <= 0) {
        if (breathTimerRef.current) clearInterval(breathTimerRef.current);
        transitionToSleep();
      }
    }, 1000);
  }, []);

  // ── 수면 전환 ──
  const transitionToSleep = useCallback(() => {
    setPhase('TRANSITIONING');
    engineRef.current?.autoTransitionToSleep(4.0, 0.3);

    setTimeout(() => {
      setPhase('SLEEP_PLAYING');
      setSleepRemaining(SLEEP_TIMER_SECONDS);

      sleepTimerRef.current = setInterval(() => {
        setSleepRemaining((prev) => {
          if (prev <= 1) {
            if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
            engineRef.current?.stopAll();
            setPhase('IDLE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 4500);
  }, []);

  // ── 정지 ──
  const handleStop = useCallback(async () => {
    breathTimerRef.current && clearInterval(breathTimerRef.current);
    sleepTimerRef.current && clearInterval(sleepTimerRef.current);
    await engineRef.current?.stopAll();
    setPhase('IDLE');
    setCountdown(BREATHING_DURATION);
    setSleepRemaining(SLEEP_TIMER_SECONDS);
  }, []);

  // ── 호흡 원 크기 ──
  const circleScale =
    breathStep === '들숨'
      ? 1 + breathProgress * 0.5
      : breathStep === '머무름'
        ? 1.5
        : 1.5 - breathProgress * 0.5;

  // ─── 렌더링 ─────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080d1a] p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#0f1629] p-8 shadow-2xl">

        {/* ── IDLE ── */}
        {phase === 'IDLE' && (
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="text-6xl" role="img" aria-label="달">
              🌙
            </span>
            <h2 className="text-xl font-semibold text-[#b8c5d6]">
              오늘 하루 수고한 나를 위한
              <br />
              1분 자비 호흡
            </h2>
            <p className="text-sm text-[#6b7a8d] leading-relaxed">
              편안히 누운 상태에서 시작하세요.
              <br />
              432Hz 호흡 종소리와 함께
              <br />
              4초 들숨, 2초 머무름, 6초 날숨으로
              <br />
              당신의 하루를 부드럽게 내려놓습니다.
            </p>
            <button
              onClick={startBreathing}
              className="mt-2 rounded-2xl bg-gradient-to-r from-teal-600 to-purple-700 px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95"
            >
              호흡 시작하고 편안히 눕기
            </button>
          </div>
        )}

        {/* ── BREATHING ── */}
        {(phase === 'BREATHING' || phase === 'TRANSITIONING') && (
          <div className="flex flex-col items-center gap-6">
            {/* 카운트다운 */}
            <div className="text-4xl font-light tracking-wider text-[#8ecae6]">
              {formatTime(countdown)}
            </div>

            {/* 호흡 원 */}
            <div className="relative flex items-center justify-center h-48 w-48">
              <div
                className="absolute rounded-full bg-gradient-to-br from-teal-500/30 to-purple-600/20 transition-transform duration-1000 ease-in-out"
                style={{
                  width: '120px',
                  height: '120px',
                  transform: `scale(${circleScale})`,
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-2xl font-semibold text-white">
                  {breathStep}
                </span>
                <span className="text-xs text-[#6b7a8d]">
                  {breathStep === '들숨'
                    ? '코로 천천히 들이쉽니다'
                    : breathStep === '머무름'
                      ? '숨을 부드럽게 머금습니다'
                      : '입으로 길게 내쉽니다'}
                </span>
              </div>
            </div>

            {/* 단계 인디케이터 */}
            <div className="flex gap-4 text-xs text-[#4a5568]">
              <span className={breathStep === '들숨' ? 'text-teal-400' : ''}>
                들숨 {CYCLE_INHALE}초
              </span>
              <span className={breathStep === '머무름' ? 'text-purple-400' : ''}>
                머무름 {CYCLE_HOLD}초
              </span>
              <span className={breathStep === '날숨' ? 'text-teal-400' : ''}>
                날숨 {CYCLE_EXHALE}초
              </span>
            </div>

            {phase === 'TRANSITIONING' && (
              <p className="text-sm text-[#6b7a8d] animate-pulse">
                수면 사운드로 전환 중...
              </p>
            )}
          </div>
        )}

        {/* ── SLEEP_PLAYING ── */}
        {phase === 'SLEEP_PLAYING' && (
          <div
            className="flex flex-col items-center gap-6 transition-opacity duration-500"
            style={{ opacity: isDimmed ? 0.25 : 0.9 }}
            onMouseEnter={() => setIsDimmed(false)}
            onMouseLeave={() => setIsDimmed(true)}
            onTouchStart={() => setIsDimmed(false)}
            onTouchEnd={() => setIsDimmed(true)}
          >
            <span className="text-5xl" role="img" aria-label="수면">
              🌊
            </span>
            <p className="text-sm text-[#6b7a8d]">
              델타파 바이노럴 비트 + 브라운 노이즈
            </p>
            <div className="text-3xl font-light tracking-widest text-[#8ecae6]">
              {formatTime(sleepRemaining)}
            </div>
            <p className="text-xs text-[#4a5568]">
              수면 타이머 · 30분 후 자동 종료
            </p>

            {/* 컨트롤 */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleStop}
                className="rounded-xl bg-[#1a2233] px-6 py-3 text-sm text-[#b8c5d6] transition-all hover:bg-[#243044]"
              >
                정지
              </button>
              <button
                onClick={() => setIsDimmed((d) => !d)}
                className="rounded-xl bg-[#1a2233] px-6 py-3 text-sm text-[#b8c5d6] transition-all hover:bg-[#243044]"
              >
                {isDimmed ? '밝게' : '어둡게'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
