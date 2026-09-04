// Web Audio API 기반 뇌파 치유 주파수 및 자연음 실시간 합성 엔진

export type FrequencyPresetId = '528hz' | '432hz' | 'schumann' | 'gamma40' | 'delta3' | 'fear396';
export type AmbientSoundId = 'none' | 'rain' | 'waves' | 'wind';

export interface FrequencyPreset {
    id: FrequencyPresetId;
    hzDisplay: string;
    name: string;
    subtitle: string;
    description: string;
    benefits: string[];
    color: string;
    tag: string;
}

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
    {
        id: '528hz',
        hzDisplay: '528 Hz',
        name: '기적과 세포 복구 (Miracle & DNA)',
        subtitle: '솔페지오 사랑의 파동',
        description: '손상된 생체 에너지를 회복하고 마음속 깊은 긴장과 저항감을 녹여내는 대표적인 치유 주파수입니다.',
        benefits: ['세포 에너지 활성화', '스트레스 호르몬 감소', '심리적 안정감'],
        color: 'from-amber-400 to-yellow-500',
        tag: '치유·변혁'
    },
    {
        id: '432hz',
        hzDisplay: '432 Hz',
        name: '우주 공명과 깊은 평온 (Cosmic Calm)',
        subtitle: '베르디 황금비 튜닝',
        description: '자연의 고유 진동수와 수학적으로 완벽히 일치하는 파동으로, 뇌파를 알파파(8-12Hz)로 부드럽게 안정시킵니다.',
        benefits: ['잡념 소거', '독서 몰입도 향상', '두통 및 안구 피로 완화'],
        color: 'from-cyan-400 to-blue-500',
        tag: '독서·명상'
    },
    {
        id: 'schumann',
        hzDisplay: '7.83 Hz',
        name: '슈만 공명 (Earth Resonance)',
        subtitle: '지구의 심장 박동 그라운딩',
        description: '지구 자기장의 공명 주파수(7.83Hz)를 유도하여 과열된 뇌를 대지 위에 차분하게 밀착(Grounding)시킵니다.',
        benefits: ['번아웃 증후군 회복', '신경계 과열 쿨다운', '현존감 회복'],
        color: 'from-emerald-400 to-teal-500',
        tag: '그라운딩'
    },
    {
        id: 'gamma40',
        hzDisplay: '40 Hz',
        name: '감마파 초집중 (Deep Flow & Focus)',
        subtitle: '최고 인지 몰입 모드',
        description: '뇌의 전전두엽 신경망을 동기화하여 고도의 집중력과 직관적 통찰력을 촉진하는 뇌과학 검증 주파수입니다.',
        benefits: ['초고밀도 독서 집중', '기억력 강화', '직관적 깨달음'],
        color: 'from-purple-400 to-indigo-500',
        tag: '초집중'
    },
    {
        id: 'delta3',
        hzDisplay: '3 Hz',
        name: '델타파 숙면과 무의식 리셋 (Delta Reset)',
        subtitle: '깊은 렘수면 및 뇌세포 휴식',
        description: '깊은 수면 상태의 뇌파를 모방하여 불면과 야간 두뇌 피로를 깨끗이 씻어내고 무의식을 편안하게 재부팅합니다.',
        benefits: ['불면증 완화', '깊은 수면 유도', '수면 전 독서 최적화'],
        color: 'from-blue-500 to-indigo-600',
        tag: '숙면·휴식'
    },
    {
        id: 'fear396',
        hzDisplay: '396 Hz',
        name: '두려움과 자책감 해방 (Fear Release)',
        subtitle: '뿌리 차크라 해방 주파수',
        description: '가슴속 묵은 죄책감, 실패에 대한 두려움, 무의식적 방어기제를 녹여내고 단단한 내면의 자신감을 깨웁니다.',
        benefits: ['불안·공포 소거', '자존감 회복', '마음의 평정'],
        color: 'from-rose-400 to-pink-500',
        tag: '불안정화'
    }
];

export class BrainwaveEngine {
    private ctx: AudioContext | null = null;
    private isRunning = false;

    // 주파수 노드들
    private mainOsc: OscillatorNode | null = null;
    private subOsc: OscillatorNode | null = null;
    private lfoOsc: OscillatorNode | null = null;
    private freqGain: GainNode | null = null;

    // 자연음(앰비언트) 노드들
    private ambientSource: AudioBufferSourceNode | null = null;
    private ambientGain: GainNode | null = null;
    private ambientFilter: BiquadFilterNode | null = null;
    private ambientLfo: OscillatorNode | null = null;

    // 마스터 게인
    private masterGain: GainNode | null = null;

    // 상태
    private currentPreset: FrequencyPresetId = '528hz';
    private currentAmbient: AmbientSoundId = 'none';
    private masterVol = 0.7;
    private freqVol = 0.6;
    private ambientVol = 0.5;

    // 타이머
    private timerIntervalId: any = null;
    private timerSecondsLeft = 0;
    private onTimerTick?: (secondsLeft: number) => void;

    private getContext(): AudioContext {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    public isPlaying(): boolean {
        return this.isRunning;
    }

    public getCurrentPreset(): FrequencyPresetId {
        return this.currentPreset;
    }

    public getCurrentAmbient(): AmbientSoundId {
        return this.currentAmbient;
    }

    public getVolumes() {
        return {
            master: this.masterVol,
            freq: this.freqVol,
            ambient: this.ambientVol,
        };
    }

    // 주파수 음향 시작/업데이트
    public start(presetId: FrequencyPresetId = this.currentPreset, ambientId: AmbientSoundId = this.currentAmbient) {
        try {
            const ctx = this.getContext();
            this.currentPreset = presetId;
            this.currentAmbient = ambientId;

            // 마스터 게인 노드 초기화
            if (!this.masterGain) {
                this.masterGain = ctx.createGain();
                this.masterGain.connect(ctx.destination);
            }
            this.masterGain.gain.setValueAtTime(this.masterVol, ctx.currentTime);

            // 기존 사운드 중지
            this.stopTone();
            this.stopAmbient();

            // 새 톤 시작
            this.startTone(presetId);

            // 새 앰비언트 시작
            if (ambientId !== 'none') {
                this.startAmbient(ambientId);
            }

            this.isRunning = true;
        } catch (e) {
            console.error('[BrainwaveEngine] Start error:', e);
        }
    }

    // 톤 합성 로직
    private startTone(preset: FrequencyPresetId) {
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;

        this.freqGain = ctx.createGain();
        this.freqGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.freqGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.freqVol * 0.08), ctx.currentTime + 1.2);
        this.freqGain.connect(this.masterGain);

        if (preset === '528hz') {
            this.mainOsc = ctx.createOscillator();
            this.mainOsc.type = 'sine';
            this.mainOsc.frequency.setValueAtTime(528, ctx.currentTime);
            this.mainOsc.connect(this.freqGain);
            this.mainOsc.start();

            this.subOsc = ctx.createOscillator();
            this.subOsc.type = 'sine';
            this.subOsc.frequency.setValueAtTime(1056, ctx.currentTime);
            const subGain = ctx.createGain();
            subGain.gain.setValueAtTime(0.18, ctx.currentTime);
            this.subOsc.connect(subGain);
            subGain.connect(this.freqGain);
            this.subOsc.start();
        } else if (preset === '432hz') {
            this.mainOsc = ctx.createOscillator();
            this.mainOsc.type = 'sine';
            this.mainOsc.frequency.setValueAtTime(432, ctx.currentTime);
            this.mainOsc.connect(this.freqGain);
            this.mainOsc.start();

            this.subOsc = ctx.createOscillator();
            this.subOsc.type = 'sine';
            this.subOsc.frequency.setValueAtTime(438, ctx.currentTime);
            const subGain = ctx.createGain();
            subGain.gain.setValueAtTime(0.35, ctx.currentTime);
            this.subOsc.connect(subGain);
            subGain.connect(this.freqGain);
            this.subOsc.start();
        } else if (preset === 'schumann') {
            this.mainOsc = ctx.createOscillator();
            this.mainOsc.type = 'sine';
            this.mainOsc.frequency.setValueAtTime(136.1, ctx.currentTime);

            const tremoloGain = ctx.createGain();
            tremoloGain.gain.setValueAtTime(0.5, ctx.currentTime);

            this.lfoOsc = ctx.createOscillator();
            this.lfoOsc.type = 'sine';
            this.lfoOsc.frequency.setValueAtTime(7.83, ctx.currentTime);
            this.lfoOsc.connect(tremoloGain.gain);
            this.lfoOsc.start();

            this.mainOsc.connect(tremoloGain);
            tremoloGain.connect(this.freqGain);
            this.mainOsc.start();
        } else if (preset === 'gamma40') {
            this.mainOsc = ctx.createOscillator();
            this.mainOsc.type = 'sine';
            this.mainOsc.frequency.setValueAtTime(200, ctx.currentTime);
            this.mainOsc.connect(this.freqGain);
            this.mainOsc.start();

            this.subOsc = ctx.createOscillator();
            this.subOsc.type = 'sine';
            this.subOsc.frequency.setValueAtTime(240, ctx.currentTime);
            const subGain = ctx.createGain();
            subGain.gain.setValueAtTime(0.65, ctx.currentTime);
            this.subOsc.connect(subGain);
            subGain.connect(this.freqGain);
            this.subOsc.start();
        } else if (preset === 'delta3') {
            this.mainOsc = ctx.createOscillator();
            this.mainOsc.type = 'sine';
            this.mainOsc.frequency.setValueAtTime(108, ctx.currentTime);

            const deltaGain = ctx.createGain();
            deltaGain.gain.setValueAtTime(0.4, ctx.currentTime);

            this.lfoOsc = ctx.createOscillator();
            this.lfoOsc.type = 'sine';
            this.lfoOsc.frequency.setValueAtTime(3, ctx.currentTime);
            this.lfoOsc.connect(deltaGain.gain);
            this.lfoOsc.start();

            this.mainOsc.connect(deltaGain);
            deltaGain.connect(this.freqGain);
            this.mainOsc.start();
        } else if (preset === 'fear396') {
            this.mainOsc = ctx.createOscillator();
            this.mainOsc.type = 'sine';
            this.mainOsc.frequency.setValueAtTime(396, ctx.currentTime);
            this.mainOsc.connect(this.freqGain);
            this.mainOsc.start();

            this.subOsc = ctx.createOscillator();
            this.subOsc.type = 'sine';
            this.subOsc.frequency.setValueAtTime(792, ctx.currentTime);
            const subGain = ctx.createGain();
            subGain.gain.setValueAtTime(0.2, ctx.currentTime);
            this.subOsc.connect(subGain);
            subGain.connect(this.freqGain);
            this.subOsc.start();
        }
    }

    // 자연음 합성 (Rain, Waves, Wind)
    private startAmbient(type: AmbientSoundId) {
        if (!this.ctx || !this.masterGain || type === 'none') return;
        const ctx = this.ctx;

        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        if (type === 'rain') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }
        } else if (type === 'waves' || type === 'wind') {
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        }

        this.ambientSource = ctx.createBufferSource();
        this.ambientSource.buffer = noiseBuffer;
        this.ambientSource.loop = true;

        this.ambientFilter = ctx.createBiquadFilter();
        if (type === 'rain') {
            this.ambientFilter.type = 'lowpass';
            this.ambientFilter.frequency.setValueAtTime(1400, ctx.currentTime);
        } else if (type === 'waves') {
            this.ambientFilter.type = 'lowpass';
            this.ambientFilter.frequency.setValueAtTime(450, ctx.currentTime);

            this.ambientLfo = ctx.createOscillator();
            this.ambientLfo.type = 'sine';
            this.ambientLfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        } else if (type === 'wind') {
            this.ambientFilter.type = 'bandpass';
            this.ambientFilter.frequency.setValueAtTime(480, ctx.currentTime);
            this.ambientFilter.Q.setValueAtTime(1.5, ctx.currentTime);
        }

        this.ambientGain = ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.ambientVol * 0.07), ctx.currentTime + 1.5);

        if (type === 'waves' && this.ambientLfo) {
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(this.ambientVol * 0.04, ctx.currentTime);
            this.ambientLfo.connect(lfoGain.gain);
            this.ambientLfo.start();
        }

        this.ambientSource.connect(this.ambientFilter);
        this.ambientFilter.connect(this.ambientGain);
        this.ambientGain.connect(this.masterGain);

        this.ambientSource.start();
    }

    private stopTone() {
        if (this.mainOsc) {
            try { this.mainOsc.stop(); this.mainOsc.disconnect(); } catch (e) {}
            this.mainOsc = null;
        }
        if (this.subOsc) {
            try { this.subOsc.stop(); this.subOsc.disconnect(); } catch (e) {}
            this.subOsc = null;
        }
        if (this.lfoOsc) {
            try { this.lfoOsc.stop(); this.lfoOsc.disconnect(); } catch (e) {}
            this.lfoOsc = null;
        }
        if (this.freqGain) {
            try { this.freqGain.disconnect(); } catch (e) {}
            this.freqGain = null;
        }
    }

    private stopAmbient() {
        if (this.ambientSource) {
            try { this.ambientSource.stop(); this.ambientSource.disconnect(); } catch (e) {}
            this.ambientSource = null;
        }
        if (this.ambientLfo) {
            try { this.ambientLfo.stop(); this.ambientLfo.disconnect(); } catch (e) {}
            this.ambientLfo = null;
        }
        if (this.ambientFilter) {
            try { this.ambientFilter.disconnect(); } catch (e) {}
            this.ambientFilter = null;
        }
        if (this.ambientGain) {
            try { this.ambientGain.disconnect(); } catch (e) {}
            this.ambientGain = null;
        }
    }

    public stop() {
        this.stopTone();
        this.stopAmbient();
        this.clearTimer();
        this.isRunning = false;
    }

    public setMasterVolume(vol: number) {
        this.masterVol = Math.max(0, Math.min(1, vol));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
        }
    }

    public setFrequencyVolume(vol: number) {
        this.freqVol = Math.max(0, Math.min(1, vol));
        if (this.freqGain && this.ctx) {
            this.freqGain.gain.setValueAtTime(this.freqVol * 0.08, this.ctx.currentTime);
        }
    }

    public setAmbientVolume(vol: number) {
        this.ambientVol = Math.max(0, Math.min(1, vol));
        if (this.ambientGain && this.ctx) {
            this.ambientGain.gain.setValueAtTime(this.ambientVol * 0.07, this.ctx.currentTime);
        }
    }

    public setTimer(minutes: number, onTick?: (secondsLeft: number) => void) {
        this.clearTimer();
        if (minutes <= 0) return;

        this.timerSecondsLeft = minutes * 60;
        this.onTimerTick = onTick;

        this.timerIntervalId = setInterval(() => {
            this.timerSecondsLeft -= 1;
            if (this.onTimerTick) this.onTimerTick(this.timerSecondsLeft);

            if (this.timerSecondsLeft <= 0) {
                this.fadeOutAndStop();
            }
        }, 1000);
    }

    private fadeOutAndStop() {
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 3);
            setTimeout(() => {
                this.stop();
            }, 3100);
        } else {
            this.stop();
        }
    }

    public clearTimer() {
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
        this.timerSecondsLeft = 0;
        if (this.onTimerTick) this.onTimerTick(0);
    }
}

// 싱글톤 인스턴스
let instance: BrainwaveEngine | null = null;
export function getBrainwaveEngine(): BrainwaveEngine {
    if (!instance) {
        instance = new BrainwaveEngine();
    }
    return instance;
}
