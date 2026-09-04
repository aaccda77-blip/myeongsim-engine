// Web Audio API 기반 뇌파 치유 주파수, 브라운 노이즈 및 자연음 실시간 합성 엔진

export type FrequencyPresetId = 'brown_noise' | '528hz' | '432hz' | 'schumann' | 'gamma40' | 'delta3' | 'fear396';
export type AmbientSoundId = 'none' | 'rain' | 'waves' | 'wind';

export interface FrequencyPreset {
    id: FrequencyPresetId;
    hzDisplay: string;
    name: string;
    subtitle: string;
    description: string;
    moodTag: string; // 어떤 기분일 때 추천하는지
    recommendWhen: string[]; // 구체적 추천 상황 3선
    scientificPrinciple: string; // 뇌과학적 작동 메커니즘
    readingSynergy: string; // ZERO POINT 독서 시너지 팁
    benefits: string[];
    color: string;
    tag: string;
}

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
    {
        id: 'brown_noise',
        hzDisplay: 'Brownian',
        name: '딥 브라운 노이즈 (Deep Brown Noise)',
        subtitle: '잡생각 강제 종료 · 두뇌 소음 차단',
        description: '저주파(1/f²) 음향 파동으로 뇌의 감각 과부하를 즉각 차단하고, 꼬리를 무는 번민과 잡념을 깊은 침묵 속으로 침잠시키는 전 세계 1위 몰입 사운드입니다.',
        moodTag: '🌪️ 머릿속이 잡생각과 걱정으로 터질 것 같을 때',
        recommendWhen: [
            '머릿속 생각이 꼬리를 물고 멈추지 않아 책에 집중이 안 될 때',
            '주의가 산만해져 책 한 페이지를 온전히 넘기기 힘들 때',
            '깊고 아늑한 비행기 객실이나 동굴처럼 완벽한 고립감이 필요할 때'
        ],
        scientificPrinciple: '고주파 성분을 6dB/octave로 완만히 감쇠시킨 브라운 파동이 청각 피질의 과각성을 진정시키고, 멍때림 회로인 DMN(Default Mode Network)을 즉각 안정화합니다.',
        readingSynergy: '《ZERO POINT》 제1부 [내 안의 소음 멈추기] 챕터를 읽을 때 최고의 몰입감을 선사합니다.',
        benefits: ['잡생각 즉각 소거', 'ADHD 산만함 억제', '깊은 두뇌 쿨다운'],
        color: 'from-amber-600 to-amber-800',
        tag: '잡생각차단'
    },
    {
        id: '528hz',
        hzDisplay: '528 Hz',
        name: '기적과 세포 복구 (Miracle & DNA)',
        subtitle: '솔페지오 사랑과 변혁의 파동',
        description: '손상된 생체 에너지를 회복하고 마음속 깊은 긴장과 자기방어 기제를 부드럽게 녹여내는 가장 강력한 고대 치유 주파수입니다.',
        moodTag: '💔 마음이 지치고 무기력하며 다정한 위로가 필요할 때',
        recommendWhen: [
            '온종일 사람과 일에 치여 가슴이 답답하고 굳어있을 때',
            '나 자신을 온전히 사랑하고 수용하는 다정한 감각을 깨우고 싶을 때',
            '세포 하나하나가 편안하게 이완되는 신체적 치유를 원할 때'
        ],
        scientificPrinciple: '528Hz는 물 분자의 수소결합 구조를 안정화하고, 부교감 신경계를 활성화하여 체내 코르티솔(스트레스 호르몬) 분비를 유의미하게 억제합니다.',
        readingSynergy: '《ZERO POINT》 제3부 3장 [432Hz와 528Hz: 생체 파동 치유의 과학] 챕터와 함께 들을 때 감동이 배가됩니다.',
        benefits: ['세포 에너지 활성화', '스트레스 호르몬 감소', '심리적 무조건적 수용'],
        color: 'from-amber-400 to-yellow-500',
        tag: '치유·위로'
    },
    {
        id: '432hz',
        hzDisplay: '432 Hz',
        name: '우주 공명과 깊은 평온 (Cosmic Calm)',
        subtitle: '베르디 황금비 우주 튜닝',
        description: '자연의 고유 진동수와 수학적으로 완벽히 일치하는 피타고라스 황금 비율 파동으로, 뇌파를 알파파(8-12Hz)로 매끄럽게 안정시킵니다.',
        moodTag: '📖 조용히 홀로 깊은 사색과 독서에 빠져들고 싶을 때',
        recommendWhen: [
            '카페나 지하철에서 주변 소음에 방해받지 않고 오롯이 책만 읽고 싶을 때',
            '지적인 각성과 내면의 통찰을 얻고 싶을 때',
            '두통이나 안구 피로로 신경이 곤두서 있을 때'
        ],
        scientificPrinciple: '기준 음높이(A=432Hz)는 심박수 및 뇌파의 알파 대역과 자연스러운 공진을 유도하여, 교감 신경계의 긴장을 풀고 편안한 각성(Relaxed Alertness)을 만듭니다.',
        readingSynergy: '《ZERO POINT》 전체를 처음부터 끝까지 정독할 때 배경음으로 가장 편안하게 녹아듭니다.',
        benefits: ['잡념 소거', '독서 몰입도 200% 향상', '두통 및 안구 피로 완화'],
        color: 'from-cyan-400 to-blue-500',
        tag: '사색·독서'
    },
    {
        id: 'schumann',
        hzDisplay: '7.83 Hz',
        name: '슈만 공명 (Earth Resonance)',
        subtitle: '지구의 심장 박동 그라운딩',
        description: '지구 표면과 전리층 사이에서 공명하는 지구 자기장의 고유 진동수(7.83Hz)를 유도하여 과열된 뇌를 대지 위에 단단하게 밀착(Grounding)시킵니다.',
        moodTag: '🔋 번아웃과 무기력으로 삶의 중심을 잃어버렸을 때',
        recommendWhen: [
            '스마트폰과 디지털 화면에 중독되어 머리가 멍하고 붕 뜬 기분일 때',
            '미래에 대한 막연한 불안으로 현실에 발이 닿지 않을 때',
            '깊은 숲속이나 대자연 속에 파묻힌 듯한 안정감을 원할 때'
        ],
        scientificPrinciple: '인간의 뇌파는 지구의 슈만 공명 주파수(7.83Hz)와 동조할 때 생체 리듬의 생체 시계(Circadian Rhythm)가 정상화되고 자율신경계가 균형을 되찾습니다.',
        readingSynergy: '《ZERO POINT》 제2부 [운명의 알고리즘 리셋] 챕터의 핵심 통찰을 흡수할 때 강력 추천합니다.',
        benefits: ['번아웃 증후군 회복', '신경계 과열 쿨다운', '현존감(Grounding) 회복'],
        color: 'from-emerald-400 to-teal-500',
        tag: '그라운딩'
    },
    {
        id: 'gamma40',
        hzDisplay: '40 Hz',
        name: '감마파 초집중 (Deep Flow & Focus)',
        subtitle: '최고 인지 몰입 · 영감 활성화',
        description: '뇌의 좌우 반구와 전전두엽 신경망을 완벽하게 동기화하여 고도의 문제 해결력과 직관적 영감을 폭발시키는 뇌과학 검증 주파수입니다.',
        moodTag: '⚡ 단시간에 책의 핵심을 날카롭게 꿰뚫고 싶을 때',
        recommendWhen: [
            '중요한 시험, 글쓰기, 사업적 결단을 앞두고 고도의 집중이 필요할 때',
            '책을 읽으며 내 삶과 비즈니스에 적용할 번뜩이는 아이디어를 얻고 싶을 때',
            '늘어지는 졸음을 쫓고 정신을 명료하게 깨우고 싶을 때'
        ],
        scientificPrinciple: '40Hz 감마 뇌파는 뇌의 각기 다른 영역들이 정보를 초고속으로 통합 처리할 때 생성되는 파동으로, MIT 연구팀 등에서 인지력 증진 효과가 증명되었습니다.',
        readingSynergy: '독서 후 실천 워크시트를 작성하거나 내 인생의 전략을 설계할 때 청취하세요.',
        benefits: ['초고밀도 집중 상태 진입', '기억 저장율 향상', '직관적 통찰력 각성'],
        color: 'from-purple-400 to-indigo-500',
        tag: '초집중'
    },
    {
        id: 'delta3',
        hzDisplay: '3 Hz',
        name: '델타파 숙면과 무의식 리셋 (Delta Reset)',
        subtitle: '깊은 렘수면 및 뇌세포 휴식',
        description: '꿈조차 꾸지 않는 가장 깊은 서파 수면(Slow-wave Sleep) 상태의 뇌파를 모방하여, 낮 동안 쌓인 뇌 노폐물과 신경 독소를 정화합니다.',
        moodTag: '🌙 침대에 누워 잠들기 직전, 오늘 하루를 편안히 매듭짓고 싶을 때',
        recommendWhen: [
            '잠자리에 누워도 낮에 있었던 일들이 떠올라 뒤척일 때',
            '수면 유도 타이머(30분~60분)를 맞춰두고 편안하게 잠에 빠져들고 싶을 때',
            '수면의 질이 낮아 아침에 일어나도 몸이 천근만근일 때'
        ],
        scientificPrinciple: '0.5~4Hz의 델타파는 뇌의 글림프 시스템(Glymphatic System)을 작동시켜 뇌척수액이 뇌 속 독성 단백질을 씻어내고 신경세포를 복구하게 만듭니다.',
        readingSynergy: '침대에서 조명을 어둡게 하고 나이트 테마로 마지막 챕터를 읽으며 잠을 청할 때 최적입니다.',
        benefits: ['불면증 완화', '수면 잠복기 단축', '아침 피로도 감소'],
        color: 'from-blue-600 to-indigo-800',
        tag: '숙면·휴식'
    },
    {
        id: 'fear396',
        hzDisplay: '396 Hz',
        name: '두려움과 자책감 해방 (Fear Release)',
        subtitle: '뿌리 차크라 정화 · 내면의 자유',
        description: '무의식 깊은 곳에 똬리 틀고 있는 죄책감, 과거의 후회, 트라우마적 방어기제를 소거하고 나를 향한 온전한 신뢰와 자신감을 되찾아줍니다.',
        moodTag: '🛡️ 자책감과 과거의 실패, 불안감이 마음을 짓누를 때',
        recommendWhen: [
            '"내가 또 실패하면 어쩌지?" 하는 두려움이 엄습할 때',
            '과거의 실수나 타인의 비난이 귓가에 맴돌아 마음이 무거울 때',
            '내면의 당당한 용기와 주도권을 되찾고 싶을 때'
        ],
        scientificPrinciple: '396Hz는 생존 본능을 관장하는 뇌간과 편도체(Amygdala)의 적색 공포 경보를 안정적인 주파수로 정류하여 신경계의 자기방어 장벽을 완화합니다.',
        readingSynergy: '《ZERO POINT》의 감정 리셋 및 심리 디버깅 문장을 정독할 때 감정 정화의 눈물을 경험하게 합니다.',
        benefits: ['공포·불안 회로 진정', '자존감과 용기 회복', '마음의 평정 복구'],
        color: 'from-rose-500 to-pink-600',
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

    // 브라운 노이즈 전용 버퍼 소스 노드
    private brownSource: AudioBufferSourceNode | null = null;
    private brownFilter: BiquadFilterNode | null = null;

    // 자연음(앰비언트) 노드들
    private ambientSource: AudioBufferSourceNode | null = null;
    private ambientGain: GainNode | null = null;
    private ambientFilter: BiquadFilterNode | null = null;
    private ambientLfo: OscillatorNode | null = null;

    // 마스터 게인
    private masterGain: GainNode | null = null;

    // 상태
    private currentPreset: FrequencyPresetId = 'brown_noise';
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

            // 새 톤/브라운노이즈 시작
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

    // 톤 및 브라운 노이즈 합성 로직
    private startTone(preset: FrequencyPresetId) {
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;

        this.freqGain = ctx.createGain();
        this.freqGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.freqGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.freqVol * 0.08), ctx.currentTime + 1.2);
        this.freqGain.connect(this.masterGain);

        if (preset === 'brown_noise') {
            // 🌟 딥 브라운 노이즈 (Brownian Noise: 6dB/octave 저주파 감쇠)
            const bufferSize = ctx.sampleRate * 4;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.025 * white)) / 1.025;
                lastOut = output[i];
                output[i] *= 3.8; // 볼륨 정규화
            }

            this.brownSource = ctx.createBufferSource();
            this.brownSource.buffer = noiseBuffer;
            this.brownSource.loop = true;

            this.brownFilter = ctx.createBiquadFilter();
            this.brownFilter.type = 'lowpass';
            this.brownFilter.frequency.setValueAtTime(360, ctx.currentTime); // 360Hz 이하 묵직한 저음만 통과

            this.brownSource.connect(this.brownFilter);
            this.brownFilter.connect(this.freqGain);
            this.brownSource.start();
        } else if (preset === '528hz') {
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
        if (this.brownSource) {
            try { this.brownSource.stop(); this.brownSource.disconnect(); } catch (e) {}
            this.brownSource = null;
        }
        if (this.brownFilter) {
            try { this.brownFilter.disconnect(); } catch (e) {}
            this.brownFilter = null;
        }
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
