// Web Audio API 기반 미래지향적 신디사이저 효과음 모듈

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. 짧은 미래지향적 햅틱 비프음
export function playTechBeep(freq = 600, duration = 0.08, type: OscillatorType = 'sine') {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // 미래 테크 사운드를 위한 피치 슬라이드 (살짝 떨어짐)
    osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("AudioContext play error:", e);
  }
}

// 2. 528Hz 솔페지오 주파수를 포함한 맑고 영롱한 연성 성공 차임 (상승형 메이저 아르페지오)
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const baseNotes = [528.00, 659.25, 783.99, 1056.00]; // 528Hz 기반 솔페지오 C5-E5-G5-C6
  baseNotes.forEach((freq, idx) => {
    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // 맑은 벨 소리를 위한 어택/디케이
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.warn("Chime segment play error:", e);
      }
    }, idx * 75);
  });
}

// 3. 서서히 진동수가 웅웅거리며 차오르는 스캔 효과음
export function playScanPulse() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    // 피치 상승 효과
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.warn("Scan pulse play error:", e);
  }
}

// 4. 경고 사이렌 사운드 (낮고 묵직한 2단 진동음)
export function playWarningSiren() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    
    // 사이렌 주기 모듈레이션
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);
    osc.frequency.linearRampToValueAtTime(220, now + 0.5);
    osc.frequency.linearRampToValueAtTime(180, now + 0.75);
    osc.frequency.linearRampToValueAtTime(220, now + 1.0);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 1.0);
  } catch (e) {
    console.warn("Warning siren play error:", e);
  }
}
