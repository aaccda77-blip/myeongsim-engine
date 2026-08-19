/**
 * SleepAudioEngine
 * ─────────────────────────────────────────────
 * Web Audio API 기반 수면 유도 오디오 엔진
 * - 432Hz 호흡 종소리 (사인파 + 엔벨로프)
 * - 델타 바이노럴 비트 (216Hz L + 218Hz R = 2Hz 델타)
 * - 브라운 노이즈 (로우패스 180Hz)
 * - 호흡 → 수면 크로스페이드 전환
 */

export class SleepAudioEngine {
  private ctx: AudioContext | null = null;
  private breathingGain: GainNode | null = null;
  private sleepMasterGain: GainNode | null = null;

  // 수면 사운드 노드 참조 (정리용)
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private brownNoiseSource: AudioBufferSourceNode | null = null;

  private isInitialized = false;

  /**
   * AudioContext 및 게인 노드 초기화
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    this.ctx = new AudioContext();

    // 호흡 사운드용 게인
    this.breathingGain = this.ctx.createGain();
    this.breathingGain.gain.value = 1.0;
    this.breathingGain.connect(this.ctx.destination);

    // 수면 사운드 마스터 게인 (초기 볼륨 0)
    this.sleepMasterGain = this.ctx.createGain();
    this.sleepMasterGain.gain.value = 0;
    this.sleepMasterGain.connect(this.ctx.destination);

    // 수면 사운드 제너레이터 셋업
    this.setupSleepSoundGenerators();

    this.isInitialized = true;
  }

  /**
   * 432Hz 사인 톤 호흡 벨 재생
   * 엔벨로프: 페이드 인 0.1초 → 페이드 아웃 3.5초
   */
  playBreathingBell(): void {
    if (!this.ctx || !this.breathingGain) return;

    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 432;

    const envelope = this.ctx.createGain();
    envelope.gain.setValueAtTime(0, now);

    // 페이드 인 0.1초
    envelope.gain.linearRampToValueAtTime(0.6, now + 0.1);
    // 페이드 아웃 3.5초
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + 3.5);

    osc.connect(envelope);
    envelope.connect(this.breathingGain);

    osc.start(now);
    osc.stop(now + 4.0);

    // 자동 정리
    osc.onended = () => {
      osc.disconnect();
      envelope.disconnect();
    };
  }

  /**
   * 수면 사운드 제너레이터 생성 (프라이빗)
   * - 델타 바이노럴 비트: Left 216Hz + Right 218Hz → 2Hz 델타파
   * - 브라운 노이즈: 랜덤 버퍼 + 로우패스 필터 180Hz
   */
  private setupSleepSoundGenerators(): void {
    if (!this.ctx || !this.sleepMasterGain) return;

    // ── 델타 바이노럴 비트 ──
    const merger = this.ctx.createChannelMerger(2);

    // 왼쪽 귀: 216Hz
    this.binauralLeftOsc = this.ctx.createOscillator();
    this.binauralLeftOsc.type = 'sine';
    this.binauralLeftOsc.frequency.value = 216;

    const leftGain = this.ctx.createGain();
    leftGain.gain.value = 0.3;
    this.binauralLeftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0); // 왼쪽 채널

    // 오른쪽 귀: 218Hz
    this.binauralRightOsc = this.ctx.createOscillator();
    this.binauralRightOsc.type = 'sine';
    this.binauralRightOsc.frequency.value = 218;

    const rightGain = this.ctx.createGain();
    rightGain.gain.value = 0.3;
    this.binauralRightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1); // 오른쪽 채널

    merger.connect(this.sleepMasterGain);

    this.binauralLeftOsc.start();
    this.binauralRightOsc.start();

    // ── 브라운 노이즈 ──
    const sampleRate = this.ctx.sampleRate;
    const bufferLength = sampleRate * 4; // 4초 버퍼 (루프)
    const noiseBuffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
    const data = noiseBuffer.getChannelData(0);

    // 브라운 노이즈 생성: 랜덤 워크 누적
    let lastOut = 0;
    for (let i = 0; i < bufferLength; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5; // 증폭
    }

    this.brownNoiseSource = this.ctx.createBufferSource();
    this.brownNoiseSource.buffer = noiseBuffer;
    this.brownNoiseSource.loop = true;

    // 로우패스 필터 180Hz
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 180;
    lowpass.Q.value = 0.7;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.5;

    this.brownNoiseSource.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(this.sleepMasterGain);

    this.brownNoiseSource.start();
  }

  /**
   * 호흡 → 수면 사운드 자동 전환 (크로스페이드)
   * @param fadeDuration 전환 시간 (기본 4초)
   * @param targetVolume 수면 사운드 목표 볼륨 (기본 0.3)
   */
  autoTransitionToSleep(
    fadeDuration: number = 4.0,
    targetVolume: number = 0.3
  ): void {
    if (!this.ctx || !this.breathingGain || !this.sleepMasterGain) return;

    const now = this.ctx.currentTime;

    // 호흡 볼륨 페이드 아웃
    this.breathingGain.gain.setValueAtTime(
      this.breathingGain.gain.value,
      now
    );
    this.breathingGain.gain.exponentialRampToValueAtTime(
      0.001,
      now + fadeDuration
    );

    // 수면 사운드 페이드 인
    this.sleepMasterGain.gain.setValueAtTime(0.001, now);
    this.sleepMasterGain.gain.exponentialRampToValueAtTime(
      targetVolume,
      now + fadeDuration
    );
  }

  /**
   * 모든 사운드 정지 + AudioContext 정리
   * @param fadeDuration 페이드 아웃 시간 (기본 2초)
   */
  async stopAll(fadeDuration: number = 2.0): Promise<void> {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 호흡 게인 페이드 아웃
    if (this.breathingGain) {
      this.breathingGain.gain.setValueAtTime(
        this.breathingGain.gain.value,
        now
      );
      this.breathingGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + fadeDuration
      );
    }

    // 수면 게인 페이드 아웃
    if (this.sleepMasterGain) {
      this.sleepMasterGain.gain.setValueAtTime(
        this.sleepMasterGain.gain.value,
        now
      );
      this.sleepMasterGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + fadeDuration
      );
    }

    // 페이드 아웃 후 정리
    await new Promise((resolve) =>
      setTimeout(resolve, fadeDuration * 1000 + 100)
    );

    try {
      this.binauralLeftOsc?.stop();
      this.binauralRightOsc?.stop();
      this.brownNoiseSource?.stop();
    } catch {
      // 이미 정지된 노드 무시
    }

    await this.ctx.close();

    // 참조 초기화
    this.ctx = null;
    this.breathingGain = null;
    this.sleepMasterGain = null;
    this.binauralLeftOsc = null;
    this.binauralRightOsc = null;
    this.brownNoiseSource = null;
    this.isInitialized = false;
  }
}
