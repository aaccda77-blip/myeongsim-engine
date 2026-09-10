'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, RotateCcw, Award, Play, Pause, Volume2, VolumeX, 
    Sparkles, Flame, Shield, Heart, Skull, Trophy, ArrowLeft, ArrowRight,
    Volume1, CheckCircle2, RefreshCw, Copy, Check, Activity, Brain, ShieldAlert
} from 'lucide-react';
import { passAcademyExam } from '@/lib/questUnlockManager';

interface MyeongsimGalagaGameProps {
    onExpEarned?: (amount: number) => void;
    onExamClear?: (level: number) => void;
    language?: 'kr' | 'en' | 'jp' | 'cn';
}

const GALAGA_I18N = {
    kr: {
        title: "명심 갤러그: 잡념 격퇴 아케이드",
        subtitle: "하늘에서 쏟아지는 왜곡된 생각을 자각 레이저로 시원하게 폭파하세요!",
        score: "격추 점수",
        highScore: "최고 기록",
        wave: "WAVE",
        stressLevel: "잔여 스트레스",
        soundPrompt: "🔊 화면을 탭하거나 조작하면 8-Bit 사운드가 켜집니다!",
        bossWarning: "⚠️ WARNING: 거대 에고 보스 출현! ⚠️",
        gameOver: "게임 오버 (호흡을 가다듬으세요)",
        gameClear: "🎉 축하합니다! 모든 잡념 소멸 & 마음 0점 리셋!",
        startBtn: "🚀 출격! 잡념 격퇴 시작",
        restartBtn: "🔄 다시 출격하기",
        controlsGuide: "PC: 마우스 이동 / 모바일: 터치 드래그 또는 하단 버튼 (자동 연사)",
        bossName: "거대한 인지 왜곡의 에고",
        pureFactMsg: "✨ 모든 왜곡된 잡념이 소멸되어 고요한 영점(Zero Point)에 도달했습니다!",
        expEarned: "자각 EXP 획득!",
        comboLabel: "COMBO",
        feverBanner: "🔥 과몰입 피버 모드! 3-WAY 레이저 가동!",
        tractorWarning: "⚡ 보스의 집착 트랙터 빔 가동! 4발 사격으로 깨뜨리세요!",
        tractorBroken: "💥 트랙터 빔 파괴! 보스 그로기 상태!",
        certTitle: "디지털 마음 처방전 & 영점 인증서",
        certSub: "인지행동 재구성(CBT Reframing) 완료 공인",
        purifiedTitle: "정화된 인지왜곡 목록",
        brainwaveStatus: "뇌파 동조율: α(알파)파 99.4% 고요 상태 달성",
        copyCert: "📋 인증서 텍스트 복사",
        certCopied: "✅ 클립보드 복사 완료!",
        nextStage: "다음 멘탈 스테이지 도전 ➔"
    },
    en: {
        title: "Zero-Point Galaga: Mind Invaders",
        subtitle: "Blast away intrusive thoughts with awareness lasers!",
        score: "Score",
        highScore: "High Score",
        wave: "WAVE",
        stressLevel: "Stress Level",
        soundPrompt: "🔊 Tap screen to enable authentic 8-Bit retro sounds!",
        bossWarning: "⚠️ WARNING: Giant Ego Boss Approaching! ⚠️",
        gameOver: "GAME OVER (Take a deep breath)",
        gameClear: "🎉 Victory! All Dark Thoughts Destroyed!",
        startBtn: "🚀 Launch Fighter!",
        restartBtn: "🔄 Try Again",
        controlsGuide: "PC: Mouse Move / Mobile: Touch Drag or Bottom Buttons",
        bossName: "The Giant Distorted Ego",
        pureFactMsg: "✨ Distorted illusions dissolved, returning to pure Zero Point!",
        expEarned: "Awareness EXP Earned!",
        comboLabel: "COMBO",
        feverBanner: "🔥 HYPER FOCUS FEVER! 3-WAY Laser Active!",
        tractorWarning: "⚡ Ego Tractor Beam! Hit 4 shots to break it!",
        tractorBroken: "💥 Tractor Beam Broken! Boss Stunned!",
        certTitle: "Digital Mind Rx & Zero-Point Certificate",
        certSub: "Cognitive Reframing (CBT) Verified",
        purifiedTitle: "Purified Distortions Summary",
        brainwaveStatus: "Brainwave: 99.4% Alpha State Coherence Achieved",
        copyCert: "📋 Copy Certificate",
        certCopied: "✅ Copied to Clipboard!",
        nextStage: "Next Mental Stage ➔"
    },
    jp: {
        title: "明心 ギャラガ: 雑念撃退アーケード",
        subtitle: "空から降り注ぐ歪んだ思考を自覚レーザーで爽快に撃破！",
        score: "スコア",
        highScore: "ハイスコア",
        wave: "WAVE",
        stressLevel: "残留ストレス",
        soundPrompt: "🔊 画面タップで8-BitサウンドがONになります！",
        bossWarning: "⚠️ WARNING: 巨大エゴボス出現！ ⚠️",
        gameOver: "ゲームオーバー (深呼吸しましょう)",
        gameClear: "🎉 勝利！全ての雑念が消滅しゼロポイントへ帰還！",
        startBtn: "🚀 出撃！",
        restartBtn: "🔄 もう一度出撃",
        controlsGuide: "PC: マウス移動 / スマホ: タッチドラッグまたは下部ボタン",
        bossName: "巨大な認知歪曲のエゴ",
        pureFactMsg: "✨ すべての雑念が浄化され、静寂なゼロポイントへ戻りました！",
        expEarned: "自覚EXP獲得！",
        comboLabel: "コンボ",
        feverBanner: "🔥 過没入フィーバー！3-WAYレーザー発動！",
        tractorWarning: "⚡ 執着のトラクタービーム！4発撃ち込んで破壊せよ！",
        tractorBroken: "💥 トラクタービーム破壊！ボス気絶！",
        certTitle: "デジタル処方箋＆ゼロポイント認証書",
        certSub: "認知再構成 (CBT) 完了公認",
        purifiedTitle: "浄化された思考の歪み一覧",
        brainwaveStatus: "脳波：α波99.4% 同調状態達成",
        copyCert: "📋 認証書をコピー",
        certCopied: "✅ コピー完了！",
        nextStage: "次のステージへ挑戦 ➔"
    },
    cn: {
        title: "明心大蜜蜂: 杂念击退街机",
        subtitle: "用觉察激光爽快轰碎消极杂念与思维执念！",
        score: "击落分数",
        highScore: "最高分",
        wave: "WAVE",
        stressLevel: "残留压力值",
        soundPrompt: "🔊 点击屏幕开启原汁原味8-Bit街机音效！",
        bossWarning: "⚠️ WARNING: 巨型执念魔王降临！ ⚠️",
        gameOver: "游戏结束 (请深呼吸)",
        gameClear: "🎉 大获全胜！一切杂念灰飞烟灭，心智归零！",
        startBtn: "🚀 战机出击！",
        restartBtn: "🔄 重新出击",
        controlsGuide: "PC: 移动鼠标 / 手机: 触摸滑动或下方按钮",
        bossName: "巨型认知扭曲之自我",
        pureFactMsg: "✨ 杂念散尽，重归清明安详的零点纯境！",
        expEarned: "觉察EXP增加！",
        comboLabel: "连击",
        feverBanner: "🔥 超极专注FEVER! 3-WAY 激光全开！",
        tractorWarning: "⚡ 执念牵引光束！命中4次将其瓦解！",
        tractorBroken: "💥 光束破碎！魔王陷入眩晕！",
        certTitle: "心智数字化处方与零点认证",
        certSub: "认知重塑 (CBT) 完毕公认",
        purifiedTitle: "已净化的认知偏差清单",
        brainwaveStatus: "脑波状态：99.4% 阿尔法波共振清明",
        copyCert: "📋 复制认证文本",
        certCopied: "✅ 复制成功！",
        nextStage: "挑战下一心智关卡 ➔"
    }
};

const THOUGHT_DATA: Record<string, Array<{ text: string; insight: string; color: string; points: number }>> = {
    kr: [
        { text: "난 무능해", insight: "✨ 배우는 중이다!", color: "#f87171", points: 10 },
        { text: "모든 게 망했어", insight: "🌱 새로운 기회다!", color: "#fb923c", points: 15 },
        { text: "날 비웃을 거야", insight: "💪 내 삶의 주인공은 나!", color: "#facc15", points: 20 },
        { text: "다 때려치워", insight: "🧘 잠시 숨을 고르자!", color: "#c084fc", points: 25 },
        { text: "과거의 후회", insight: "🕊️ 지나간 허상일 뿐!", color: "#38bdf8", points: 30 },
        { text: "모두 내 탓이야", insight: "☀️ 스스로를 안아주자!", color: "#f43f5e", points: 20 }
    ],
    en: [
        { text: "I'm incompetent", insight: "✨ Still learning!", color: "#f87171", points: 10 },
        { text: "Everything is ruined", insight: "🌱 A fresh start!", color: "#fb923c", points: 15 },
        { text: "They will laugh at me", insight: "💪 I own my story!", color: "#facc15", points: 20 },
        { text: "Just give up", insight: "🧘 Breathe & pause!", color: "#c084fc", points: 25 },
        { text: "Past regret", insight: "🕊️ Only a passing cloud!", color: "#38bdf8", points: 30 },
        { text: "It's all my fault", insight: "☀️ Be gentle with myself!", color: "#f43f5e", points: 20 }
    ],
    jp: [
        { text: "私は無能だ", insight: "✨ 学びの途中だ！", color: "#f87171", points: 10 },
        { text: "全部おしまいだ", insight: "🌱 新たな好機だ！", color: "#fb923c", points: 15 },
        { text: "笑われるかも", insight: "💪 私の人生の主役は私！", color: "#facc15", points: 20 },
        { text: "もう投げ出したい", insight: "🧘 一息ついて整えよう！", color: "#c084fc", points: 25 },
        { text: "過去の後悔", insight: "🕊️ 過ぎ去った幻影！", color: "#38bdf8", points: 30 },
        { text: "全部私のせい", insight: "☀️ 自分を許して包もう！", color: "#f43f5e", points: 20 }
    ],
    cn: [
        { text: "我很无能", insight: "✨ 正在学习进阶！", color: "#f87171", points: 10 },
        { text: "全都搞砸了", insight: "🌱 崭新的生机！", color: "#fb923c", points: 15 },
        { text: "别人会嘲笑我", insight: "💪 我是自己生命的主角！", color: "#facc15", points: 20 },
        { text: "彻底放弃吧", insight: "🧘 停下来深呼吸！", color: "#c084fc", points: 25 },
        { text: "过去的懊悔", insight: "🕊️ 只是过眼云烟！", color: "#38bdf8", points: 30 },
        { text: "都是我的错", insight: "☀️ 温柔拥抱自己！", color: "#f43f5e", points: 20 }
    ]
};

export default function MyeongsimGalagaGame({
    onExpEarned,
    onExamClear,
    language = 'kr'
}: MyeongsimGalagaGameProps) {
    const t = GALAGA_I18N[language] || GALAGA_I18N.kr;
    const thoughts = THOUGHT_DATA[language] || THOUGHT_DATA.kr;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 오디오 컨텍스트
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [soundActive, setSoundActive] = useState<boolean>(false);

    // 게임 상태
    const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover' | 'clear'>('playing');
    const [score, setScore] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);
    const [wave, setWave] = useState<number>(1);
    const [stressPct, setStressPct] = useState<number>(100);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [bossWarning, setBossWarning] = useState<boolean>(false);
    const [comboCount, setComboCount] = useState<number>(0);
    const [isFeverMode, setIsFeverMode] = useState<boolean>(false);
    const [tractorNotice, setTractorNotice] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    // 정화 통계 저장
    const [purifiedStats, setPurifiedStats] = useState<{ [thoughtText: string]: { count: number; insight: string } }>({});

    const gameEngineRef = useRef<{
        player: { x: number; y: number; width: number; height: number; speed: number; power: number; shieldTimer: number };
        bullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string; isFever?: boolean }>;
        enemies: Array<{ 
            x: number; 
            y: number; 
            vx: number; 
            vy: number; 
            width: number; 
            height: number; 
            text: string; 
            insight: string; 
            color: string; 
            points: number; 
            hp: number; 
            maxHp: number; 
            diveTimer: number; 
            hitFlash: number 
        }>;
        enemyBullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number }>;
        particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; maxLife: number; size: number }>;
        floatingTexts: Array<{ x: number; y: number; text: string; color: string; life: number; maxLife: number; vy: number }>;
        items: Array<{ x: number; y: number; vy: number; type: 'power' | 'shield' | 'life'; label: string }>;
        stars: Array<{ x: number; y: number; speed: number; size: number; opacity: number }>;
        boss: { 
            x: number; 
            y: number; 
            width: number; 
            height: number; 
            hp: number; 
            maxHp: number; 
            vx: number; 
            active: boolean; 
            shootTimer: number; 
            hitFlash: number;
            tractorState: 'idle' | 'charging' | 'firing' | 'stunned';
            tractorTimer: number;
            tractorHits: number;
        } | null;
        combo: number;
        comboTimer: number;
        maxCombo: number;
        feverTimer: number;
        lastFireTime: number;
        fireInterval: number;
        score: number;
        lives: number;
        wave: number;
        shakeTimer: number;
        keys: { [key: string]: boolean };
        mousePos: { x: number; y: number };
        animId: number | null;
    }>({
        player: { x: 200, y: 430, width: 44, height: 44, speed: 7, power: 1, shieldTimer: 120 },
        bullets: [],
        enemies: [],
        enemyBullets: [],
        particles: [],
        floatingTexts: [],
        items: [],
        stars: [],
        boss: null,
        combo: 0,
        comboTimer: 0,
        maxCombo: 0,
        feverTimer: 0,
        lastFireTime: 0,
        fireInterval: 140,
        score: 0,
        lives: 3,
        wave: 1,
        shakeTimer: 0,
        keys: {},
        mousePos: { x: 200, y: 430 },
        animId: null
    });

    // ── 🔊 Web Audio API 레트로 신디사이저 2.5 ──
    const getAudioContext = useCallback(() => {
        if (typeof window === 'undefined') return null;
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                audioCtxRef.current = new AudioCtx();
            }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().then(() => {
                setSoundActive(true);
            }).catch(() => {});
        } else if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            setSoundActive(true);
        }
        return audioCtxRef.current;
    }, []);

    const unlockAudio = useCallback(() => {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().then(() => setSoundActive(true)).catch(() => {});
        } else {
            setSoundActive(true);
        }
    }, [getAudioContext]);

    // 1. 🚀 갤러그 레이저 피치 드롭 발사음 (1150Hz -> 160Hz)
    const playLaserSound = useCallback((isFever: boolean = false) => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = isFever ? 'square' : 'sawtooth';
            const startFreq = isFever ? 1400 : 1150;
            const endFreq = isFever ? 220 : 160;

            osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(isFever ? 0.06 : 0.07, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 2. 💥 백색 노이즈 아케이드 폭발음
    const playExplosionSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.18);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(750, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.18);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start();
            noise.stop(ctx.currentTime + 0.18);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 3. ✨ 콤보 차임벨 (도-미-솔-도 아르페지오 상승)
    const playComboSound = useCallback((combo: number) => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
            const freq = notes[Math.min(notes.length - 1, combo % notes.length)];

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.14);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 4. 🔥 과몰입 피버 팡파레
    const playFeverSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const tones = [523.25, 659.25, 783.99, 1046.50];
            tones.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t0 = ctx.currentTime + idx * 0.06;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t0);

                gain.gain.setValueAtTime(0.09, t0);
                gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t0);
                osc.stop(t0 + 0.18);
            });
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 5. 🔔 통찰 승화 크리스탈 차임벨 (880Hz)
    const playInsightSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.07, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 6. ⚡ 보스 트랙터 빔 우우웅 펄스
    const playTractorSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 7. ✨ 파워업 획득
    const playPowerupSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(528, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 8. 🚨 보스 경고 사이렌
    const playBossAlertSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            for (let i = 0; i < 2; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t0 = ctx.currentTime + i * 0.28;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, t0);
                osc.frequency.linearRampToValueAtTime(740, t0 + 0.14);
                osc.frequency.linearRampToValueAtTime(320, t0 + 0.28);

                gain.gain.setValueAtTime(0.12, t0);
                gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t0);
                osc.stop(t0 + 0.28);
            }
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 별 배경 생성
    const initStars = (w: number, h: number) => {
        const stars = [];
        for (let i = 0; i < 48; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                speed: 0.6 + Math.random() * 2.5,
                size: 1 + Math.random() * 2.2,
                opacity: 0.4 + Math.random() * 0.6
            });
        }
        return stars;
    };

    // 적 에일리언 스폰
    const spawnEnemyWave = (canvasWidth: number) => {
        const enemies = [];
        const rows = 3;
        const cols = 5;
        const spacingX = 64;
        const spacingY = 44;
        const startX = (canvasWidth - cols * spacingX) / 2 + 32;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const thought = thoughts[(r * cols + c) % thoughts.length];
                enemies.push({
                    x: startX + c * spacingX,
                    y: 40 + r * spacingY,
                    vx: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.5),
                    vy: 0,
                    width: 48,
                    height: 30,
                    text: thought.text,
                    insight: thought.insight,
                    color: thought.color,
                    points: thought.points,
                    hp: 1,
                    maxHp: 1,
                    diveTimer: 180 + Math.floor(Math.random() * 280),
                    hitFlash: 0
                });
            }
        }
        return enemies;
    };

    // 거대 에고 보스
    const spawnBoss = (canvasWidth: number) => {
        setBossWarning(true);
        playBossAlertSound();
        setTimeout(() => setBossWarning(false), 2500);

        return {
            x: canvasWidth / 2 - 60,
            y: 50,
            width: 120,
            height: 60,
            hp: 35,
            maxHp: 35,
            vx: 2,
            active: true,
            shootTimer: 55,
            hitFlash: 0,
            tractorState: 'idle' as const,
            tractorTimer: 180,
            tractorHits: 0
        };
    };

    // 리셋 / 시작
    const resetAndStartGame = useCallback(() => {
        const canvas = canvasRef.current;
        const w = canvas ? canvas.width : 400;
        const h = canvas ? canvas.height : 500;

        gameEngineRef.current = {
            player: { x: w / 2, y: h - 55, width: 44, height: 44, speed: 7, power: 1, shieldTimer: 120 },
            bullets: [],
            enemies: spawnEnemyWave(w),
            enemyBullets: [],
            particles: [],
            floatingTexts: [],
            items: [],
            stars: initStars(w, h),
            boss: null,
            combo: 0,
            comboTimer: 0,
            maxCombo: 0,
            feverTimer: 0,
            lastFireTime: 0,
            fireInterval: 140,
            score: 0,
            lives: 3,
            wave: 1,
            shakeTimer: 0,
            keys: {},
            mousePos: { x: w / 2, y: h - 55 },
            animId: null
        };

        setScore(0);
        setLives(3);
        setWave(1);
        setStressPct(100);
        setComboCount(0);
        setIsFeverMode(false);
        setTractorNotice(null);
        setPurifiedStats({});
        setGameState('playing');
        unlockAudio();
    }, [unlockAudio, thoughts]);

    useEffect(() => {
        resetAndStartGame();
    }, [resetAndStartGame]);

    // 키보드 조작
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            unlockAudio();
            gameEngineRef.current.keys[e.key] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            gameEngineRef.current.keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [unlockAudio]);

    // ── 메인 게임 루프 (60 FPS) ──
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isRunning = true;

        const loop = () => {
            if (!isRunning) return;

            const ge = gameEngineRef.current;
            const w = canvas.width;
            const h = canvas.height;

            ctx.save();
            if (ge.shakeTimer > 0) {
                ge.shakeTimer--;
                const shakeX = (Math.random() - 0.5) * 8;
                const shakeY = (Math.random() - 0.5) * 8;
                ctx.translate(shakeX, shakeY);
            }

            // 1. 화면 클리어 (딥 스페이스)
            ctx.fillStyle = '#060814';
            ctx.fillRect(0, 0, w, h);

            // 피버 모드 시 외곽 오라 연출
            if (ge.feverTimer > 0) {
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
                ctx.lineWidth = 6;
                ctx.strokeRect(3, 3, w - 6, h - 6);
            }

            // 2. 별똥별 스크롤
            ctx.fillStyle = '#ffffff';
            ge.stars.forEach(star => {
                star.y += star.speed * (ge.feverTimer > 0 ? 2.2 : 1.0);
                if (star.y > h) {
                    star.y = 0;
                    star.x = Math.random() * w;
                }
                ctx.globalAlpha = star.opacity;
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });
            ctx.globalAlpha = 1.0;

            // 3. 콤보 및 피버 타이머 관리
            if (ge.comboTimer > 0) {
                ge.comboTimer--;
                if (ge.comboTimer <= 0) {
                    ge.combo = 0;
                    setComboCount(0);
                }
            }

            if (ge.feverTimer > 0) {
                ge.feverTimer--;
                if (ge.feverTimer <= 0) {
                    setIsFeverMode(false);
                }
            }

            // 4. 플레이어 이동
            const p = ge.player;
            if (ge.keys['ArrowLeft'] || ge.keys['a'] || ge.keys['A']) {
                p.x -= p.speed;
            }
            if (ge.keys['ArrowRight'] || ge.keys['d'] || ge.keys['D']) {
                p.x += p.speed;
            }
            // 부드러운 마우스/터치 트래킹
            if (ge.mousePos.x !== p.x) {
                p.x += (ge.mousePos.x - p.x) * 0.28;
            }
            p.x = Math.max(26, Math.min(w - 26, p.x));

            if (p.shieldTimer > 0) p.shieldTimer--;

            // 5. 무기 자동 연사 (피버 모드 시 3-WAY 트윈 플라즈마)
            const now = performance.now();
            const currentFireInterval = ge.feverTimer > 0 ? 110 : ge.fireInterval;
            if (now - ge.lastFireTime >= currentFireInterval) {
                ge.lastFireTime = now;
                const isFever = ge.feverTimer > 0;

                if (isFever) {
                    // 3-WAY 레이저
                    ge.bullets.push({ x: p.x, y: p.y - 18, vx: 0, vy: -10, radius: 4, color: '#fbbf24', isFever: true });
                    ge.bullets.push({ x: p.x - 12, y: p.y - 14, vx: -2.2, vy: -9.5, radius: 3.5, color: '#34d399', isFever: true });
                    ge.bullets.push({ x: p.x + 12, y: p.y - 14, vx: 2.2, vy: -9.5, radius: 3.5, color: '#34d399', isFever: true });
                } else if (p.power === 1) {
                    ge.bullets.push({ x: p.x, y: p.y - 18, vx: 0, vy: -8.5, radius: 3, color: '#38bdf8' });
                } else if (p.power === 2) {
                    ge.bullets.push({ x: p.x - 9, y: p.y - 16, vx: 0, vy: -8.5, radius: 3, color: '#22d3ee' });
                    ge.bullets.push({ x: p.x + 9, y: p.y - 16, vx: 0, vy: -8.5, radius: 3, color: '#22d3ee' });
                } else {
                    ge.bullets.push({ x: p.x, y: p.y - 20, vx: 0, vy: -9, radius: 4, color: '#f59e0b' });
                    ge.bullets.push({ x: p.x - 14, y: p.y - 14, vx: -1.2, vy: -8.5, radius: 3, color: '#38bdf8' });
                    ge.bullets.push({ x: p.x + 14, y: p.y - 14, vx: 1.2, vy: -8.5, radius: 3, color: '#38bdf8' });
                }
                playLaserSound(isFever);
            }

            // 6. 총알 업데이트 및 렌더링
            for (let i = ge.bullets.length - 1; i >= 0; i--) {
                const b = ge.bullets[i];
                b.x += b.vx;
                b.y += b.vy;

                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = b.isFever ? 12 : 8;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                if (b.y < -10 || b.x < -10 || b.x > w + 10) {
                    ge.bullets.splice(i, 1);
                }
            }

            // 7. 적 잡념 군단 업데이트 & 렌더링
            for (let i = ge.enemies.length - 1; i >= 0; i--) {
                const e = ge.enemies[i];
                e.x += e.vx;
                if (e.x < 30 || e.x > w - 30) e.vx *= -1;
                if (e.hitFlash > 0) e.hitFlash--;

                e.diveTimer--;
                if (e.diveTimer <= 0) {
                    e.y += 2.2;
                    e.x += Math.sin(e.y * 0.05) * 2;

                    if (e.y > h + 20) {
                        e.y = 35;
                        e.diveTimer = 180 + Math.floor(Math.random() * 200);
                    }

                    if (Math.random() < 0.02) {
                        ge.enemyBullets.push({ x: e.x, y: e.y + 12, vx: 0, vy: 4.2, radius: 3 });
                    }
                }

                ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : e.color;
                ctx.shadowColor = e.color;
                ctx.shadowBlur = e.hitFlash > 0 ? 16 : 8;
                
                ctx.beginPath();
                ctx.moveTo(e.x, e.y - 12);
                ctx.lineTo(e.x + 20, e.y - 2);
                ctx.lineTo(e.x + 14, e.y + 12);
                ctx.lineTo(e.x - 14, e.y + 12);
                ctx.lineTo(e.x - 20, e.y - 2);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(e.x - 8, e.y - 2, 4, 4);
                ctx.fillRect(e.x + 4, e.y - 2, 4, 4);
                ctx.shadowBlur = 0;

                ctx.font = 'bold 10px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(e.text, e.x, e.y - 16);

                // 플레이어 총알과 충돌 판정
                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const b = ge.bullets[bi];
                    const dist = Math.hypot(b.x - e.x, b.y - e.y);
                    if (dist < 22) {
                        ge.bullets.splice(bi, 1);
                        e.hp--;
                        e.hitFlash = 5;

                        if (e.hp <= 0) {
                            // 폭발 파티클
                            for (let pIdx = 0; pIdx < 16; pIdx++) {
                                ge.particles.push({
                                    x: e.x,
                                    y: e.y,
                                    vx: (Math.random() - 0.5) * 8,
                                    vy: (Math.random() - 0.5) * 8,
                                    color: e.color,
                                    life: 25,
                                    maxLife: 25,
                                    size: 2 + Math.random() * 3.5
                                });
                            }

                            // 💡 인지 재구성: 초록빛 긍정 승화 플로팅 텍스트 팝업!
                            ge.floatingTexts.push({
                                x: e.x,
                                y: e.y - 8,
                                text: e.insight,
                                color: '#34d399',
                                life: 55,
                                maxLife: 55,
                                vy: -1.0
                            });
                            playInsightSound();

                            // 콤보 증가 및 피버 체크
                            ge.combo++;
                            ge.comboTimer = 160;
                            if (ge.combo > ge.maxCombo) ge.maxCombo = ge.combo;
                            setComboCount(ge.combo);
                            playComboSound(ge.combo);

                            if (ge.combo >= 8 && ge.feverTimer <= 0) {
                                ge.feverTimer = 340; // 약 5.6초간 피버
                                setIsFeverMode(true);
                                playFeverSound();
                            }

                            // 정화 통계 누적
                            setPurifiedStats(prev => {
                                const current = prev[e.text] || { count: 0, insight: e.insight };
                                return {
                                    ...prev,
                                    [e.text]: { count: current.count + 1, insight: e.insight }
                                };
                            });

                            // 아이템 드롭
                            if (Math.random() < 0.24) {
                                const types: Array<'power' | 'shield' | 'life'> = ['power', 'shield', 'life'];
                                const itemType = types[Math.floor(Math.random() * types.length)];
                                ge.items.push({
                                    x: e.x,
                                    y: e.y,
                                    vy: 1.8,
                                    type: itemType,
                                    label: itemType === 'power' ? '⚡2X' : itemType === 'shield' ? '🛡️0' : '💖+1'
                                });
                            }

                            playExplosionSound();
                            const earnedPoints = ge.feverTimer > 0 ? e.points * 2 : e.points;
                            ge.score += earnedPoints;
                            setScore(ge.score);
                            setStressPct(prev => Math.max(0, prev - 6));
                            if (onExpEarned) onExpEarned(10);
                            ge.enemies.splice(i, 1);
                            break;
                        }
                    }
                }

                // 플레이어와 적 충돌
                if (ge.player.shieldTimer <= 0) {
                    const playerDist = Math.hypot(ge.player.x - e.x, ge.player.y - e.y);
                    if (playerDist < 28) {
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90;
                        ge.shakeTimer = 10;
                        ge.combo = 0;
                        setComboCount(0);
                        playExplosionSound();

                        if (ge.lives <= 0) {
                            setGameState('gameover');
                            isRunning = false;
                            ctx.restore();
                            return;
                        }
                    }
                }
            }

            // 8. 거대 에고 보스 & 트랙터 빔 메커니즘
            if (ge.boss && ge.boss.active) {
                const b = ge.boss;

                if (b.tractorState === 'stunned') {
                    b.tractorTimer--;
                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'idle';
                        b.tractorTimer = 180;
                    }
                } else {
                    b.x += b.vx;
                    if (b.x < 70 || b.x > w - 70) b.vx *= -1;
                }

                if (b.hitFlash > 0) b.hitFlash--;

                // 보스 일반 총알 발사
                if (b.tractorState !== 'stunned') {
                    b.shootTimer--;
                    if (b.shootTimer <= 0) {
                        b.shootTimer = 50;
                        ge.enemyBullets.push({ x: b.x - 30, y: b.y + 30, vx: -1.2, vy: 3.8, radius: 4 });
                        ge.enemyBullets.push({ x: b.x, y: b.y + 35, vx: 0, vy: 4.5, radius: 5 });
                        ge.enemyBullets.push({ x: b.x + 30, y: b.y + 30, vx: 1.2, vy: 3.8, radius: 4 });
                    }
                }

                // 트랙터 빔 상태 머신
                if (b.tractorState === 'idle') {
                    b.tractorTimer--;
                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'charging';
                        b.tractorTimer = 60;
                        setTractorNotice(t.tractorWarning);
                    }
                } else if (b.tractorState === 'charging') {
                    b.tractorTimer--;
                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'firing';
                        b.tractorTimer = 180;
                        b.tractorHits = 0;
                        playTractorSound();
                    }
                } else if (b.tractorState === 'firing') {
                    b.tractorTimer--;
                    if (Math.random() < 0.1) playTractorSound();

                    // 트랙터 빔 홀로그램 부채꼴 렌더링
                    const beamGrad = ctx.createLinearGradient(b.x, b.y + 25, b.x, h);
                    beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
                    beamGrad.addColorStop(1, 'rgba(192, 132, 252, 0.15)');

                    ctx.fillStyle = beamGrad;
                    ctx.beginPath();
                    ctx.moveTo(b.x - 18, b.y + 28);
                    ctx.lineTo(b.x + 18, b.y + 28);
                    ctx.lineTo(b.x + 75, h);
                    ctx.lineTo(b.x - 75, h);
                    ctx.closePath();
                    ctx.fill();

                    // 트랙터 빔 영역 내부 흡인 로직
                    const beamLeft = b.x - 65;
                    const beamRight = b.x + 65;
                    if (p.x >= beamLeft && p.x <= beamRight && p.y > b.y + 40) {
                        p.y -= 1.8; // 위로 끌려감!
                        p.x += (b.x - p.x) * 0.05; // 중심부로 유도
                    }

                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'idle';
                        b.tractorTimer = 220;
                        setTractorNotice(null);
                    }
                }

                // 보스 외형 렌더링
                ctx.save();
                ctx.translate(b.x, b.y);
                
                ctx.shadowColor = b.hitFlash > 0 ? '#ffffff' : (b.tractorState === 'stunned' ? '#38bdf8' : '#f43f5e');
                ctx.shadowBlur = b.hitFlash > 0 ? 30 : 20;
                ctx.fillStyle = b.hitFlash > 0 ? '#ffffff' : (b.tractorState === 'stunned' ? '#0f172a' : '#4c0519');
                ctx.beginPath();
                ctx.roundRect(-60, -28, 120, 56, 18);
                ctx.fill();

                ctx.strokeStyle = b.tractorState === 'stunned' ? '#38bdf8' : '#fb7185';
                ctx.lineWidth = 4;
                ctx.strokeRect(-50, -20, 42, 40);
                ctx.strokeRect(8, -20, 42, 40);
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.stroke();

                ctx.fillStyle = b.tractorState === 'stunned' ? '#38bdf8' : '#f43f5e';
                ctx.beginPath();
                ctx.arc(-29, 0, 9, 0, Math.PI * 2);
                ctx.arc(29, 0, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // 보스 HP 게이지
                const hpPct = b.hp / b.maxHp;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(w / 2 - 80, 16, 160, 8);
                ctx.fillStyle = b.tractorState === 'stunned' ? '#38bdf8' : '#f43f5e';
                ctx.fillRect(w / 2 - 80, 16, 160 * hpPct, 8);
                ctx.strokeStyle = '#ffffff';
                ctx.strokeRect(w / 2 - 80, 16, 160, 8);

                ctx.font = 'bold 11px sans-serif';
                ctx.fillStyle = '#fecdd3';
                ctx.textAlign = 'center';
                ctx.fillText(b.tractorState === 'stunned' ? '⚡ STUNNED (그로기)' : t.bossName, w / 2, 12);

                // 총알과 보스 충돌 판정
                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const blt = ge.bullets[bi];
                    if (blt.x > b.x - 60 && blt.x < b.x + 60 && blt.y > b.y - 28 && blt.y < b.y + 28) {
                        ge.bullets.splice(bi, 1);
                        b.hp -= (ge.feverTimer > 0 ? 2 : 1);
                        b.hitFlash = 5;

                        // 트랙터 빔 가동 중일 때 맞추면 카운터 브레이크!
                        if (b.tractorState === 'firing') {
                            b.tractorHits++;
                            if (b.tractorHits >= 4) {
                                b.tractorState = 'stunned';
                                b.tractorTimer = 160; // 약 2.6초간 그로기
                                setTractorNotice(t.tractorBroken);
                                setTimeout(() => setTractorNotice(null), 2500);
                                playExplosionSound();
                                ge.shakeTimer = 12;
                            }
                        }

                        // 보스 피격 파티클
                        for (let pIdx = 0; pIdx < 8; pIdx++) {
                            ge.particles.push({
                                x: blt.x,
                                y: blt.y,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                color: '#f43f5e',
                                life: 18,
                                maxLife: 18,
                                size: 3
                            });
                        }

                        if (b.hp <= 0) {
                            for (let pIdx = 0; pIdx < 40; pIdx++) {
                                ge.particles.push({
                                    x: b.x + (Math.random() - 0.5) * 80,
                                    y: b.y + (Math.random() - 0.5) * 40,
                                    vx: (Math.random() - 0.5) * 12,
                                    vy: (Math.random() - 0.5) * 12,
                                    color: Math.random() > 0.5 ? '#f43f5e' : '#38bdf8',
                                    life: 45,
                                    maxLife: 45,
                                    size: 4 + Math.random() * 4
                                });
                            }
                            playExplosionSound();
                            ge.boss = null;
                            ge.score += 600;
                            setScore(ge.score);
                            setStressPct(0);
                            if (onExpEarned) onExpEarned(60);
                            
                            const examResult = passAcademyExam('quiz_galaga_boss', 2);
                            if (onExamClear) onExamClear(examResult.newLevel);

                            setGameState('clear');
                            isRunning = false;
                            ctx.restore();
                            return;
                        }
                    }
                }
            }

            // 적 전멸 시 웨이브 진행 또는 보스 소환
            if (ge.enemies.length === 0 && (!ge.boss || !ge.boss.active)) {
                if (ge.wave === 1) {
                    ge.boss = spawnBoss(w);
                } else {
                    ge.wave++;
                    setWave(ge.wave);
                    ge.enemies = spawnEnemyWave(w);
                    playPowerupSound();
                }
            }

            // 9. 적 총알
            for (let i = ge.enemyBullets.length - 1; i >= 0; i--) {
                const eb = ge.enemyBullets[i];
                eb.x += eb.vx;
                eb.y += eb.vy;

                ctx.beginPath();
                ctx.arc(eb.x, eb.y, eb.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#f43f5e';
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (ge.player.shieldTimer <= 0) {
                    const dist = Math.hypot(eb.x - ge.player.x, eb.y - ge.player.y);
                    if (dist < 20) {
                        ge.enemyBullets.splice(i, 1);
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90;
                        ge.shakeTimer = 8;
                        ge.combo = 0;
                        setComboCount(0);
                        playExplosionSound();

                        if (ge.lives <= 0) {
                            setGameState('gameover');
                            isRunning = false;
                            ctx.restore();
                            return;
                        }
                        continue;
                    }
                }

                if (eb.y > h + 10) ge.enemyBullets.splice(i, 1);
            }

            // 10. 파워업 아이템
            for (let i = ge.items.length - 1; i >= 0; i--) {
                const it = ge.items[i];
                it.y += it.vy;

                ctx.fillStyle = it.type === 'power' ? '#f59e0b' : it.type === 'shield' ? '#06b6d4' : '#ec4899';
                ctx.beginPath();
                ctx.roundRect(it.x - 14, it.y - 10, 28, 20, 8);
                ctx.fill();

                ctx.font = 'bold 9px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(it.label, it.x, it.y + 4);

                const dist = Math.hypot(it.x - ge.player.x, it.y - ge.player.y);
                if (dist < 28) {
                    ge.items.splice(i, 1);
                    playPowerupSound();
                    if (it.type === 'power') {
                        ge.player.power = Math.min(3, ge.player.power + 1);
                    } else if (it.type === 'shield') {
                        ge.player.shieldTimer = 300;
                    } else if (it.type === 'life') {
                        ge.lives = Math.min(5, ge.lives + 1);
                        setLives(ge.lives);
                    }
                    ge.score += 50;
                    setScore(ge.score);
                }

                if (it.y > h + 20) ge.items.splice(i, 1);
            }

            // 11. 💡 초록빛 긍정 승화 플로팅 텍스트 렌더링
            for (let i = ge.floatingTexts.length - 1; i >= 0; i--) {
                const ft = ge.floatingTexts[i];
                ft.y += ft.vy;
                ft.life--;

                const alpha = Math.min(1, ft.life / (ft.maxLife * 0.4));
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = ft.color;
                ctx.shadowColor = ft.color;
                ctx.shadowBlur = 10;
                ctx.textAlign = 'center';
                ctx.fillText(ft.text, ft.x, ft.y);
                ctx.restore();

                if (ft.life <= 0) ge.floatingTexts.splice(i, 1);
            }

            // 12. 파티클
            for (let i = ge.particles.length - 1; i >= 0; i--) {
                const pt = ge.particles[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.life--;

                const alpha = pt.life / pt.maxLife;
                ctx.fillStyle = pt.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                if (pt.life <= 0) ge.particles.splice(i, 1);
            }

            // 13. 🚀 갤러그 스타일 원작 화이트/레드 플레이어 비행기
            ctx.save();
            ctx.translate(ge.player.x, ge.player.y);

            if (ge.player.shieldTimer > 0) {
                ctx.strokeStyle = '#38bdf8';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 14;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 30, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // 비행기 동체 (화이트)
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = ge.feverTimer > 0 ? '#fbbf24' : '#38bdf8';
            ctx.shadowBlur = ge.feverTimer > 0 ? 18 : 12;
            ctx.beginPath();
            ctx.moveTo(0, -22);
            ctx.lineTo(22, 16);
            ctx.lineTo(8, 12);
            ctx.lineTo(0, 16);
            ctx.lineTo(-8, 12);
            ctx.lineTo(-22, 16);
            ctx.closePath();
            ctx.fill();

            // 레드 날개 팁
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(22, 16);
            ctx.lineTo(14, 4);
            ctx.lineTo(14, 14);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-22, 16);
            ctx.lineTo(-14, 4);
            ctx.lineTo(-14, 14);
            ctx.closePath();
            ctx.fill();

            // 콕핏 (시안 / 골드)
            ctx.fillStyle = ge.feverTimer > 0 ? '#f59e0b' : '#06b6d4';
            ctx.beginPath();
            ctx.arc(0, -4, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-2, -6, 2, 0, Math.PI * 2);
            ctx.fill();

            // 트윈 부스터 화염
            const flameLen = 14 + Math.random() * (ge.feverTimer > 0 ? 14 : 8);
            ctx.fillStyle = ge.feverTimer > 0 ? '#38bdf8' : '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(-7, 14);
            ctx.lineTo(-4, 14 + flameLen);
            ctx.lineTo(-1, 14);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(1, 14);
            ctx.lineTo(4, 14 + flameLen);
            ctx.lineTo(7, 14);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
            ctx.restore();

            ge.animId = requestAnimationFrame(loop);
        };

        gameEngineRef.current.animId = requestAnimationFrame(loop);

        return () => {
            isRunning = false;
            if (gameEngineRef.current.animId) {
                cancelAnimationFrame(gameEngineRef.current.animId);
            }
        };
    }, [
        gameState, playLaserSound, playExplosionSound, playComboSound, playFeverSound, 
        playInsightSound, playTractorSound, playPowerupSound, onExpEarned, onExamClear, 
        t.bossName, t.tractorWarning, t.tractorBroken
    ]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        unlockAudio();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        unlockAudio();
        const canvas = canvasRef.current;
        if (!canvas || e.touches.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    const moveLeft = () => {
        unlockAudio();
        gameEngineRef.current.mousePos.x = Math.max(30, gameEngineRef.current.player.x - 45);
    };

    const moveRight = () => {
        unlockAudio();
        gameEngineRef.current.mousePos.x = Math.min(370, gameEngineRef.current.player.x + 45);
    };

    useEffect(() => {
        if (score > highScore) setHighScore(score);
    }, [score, highScore]);

    // 처방전 텍스트 클립보드 복사
    const handleCopyCertificate = () => {
        const statsSummary = Object.entries(purifiedStats)
            .map(([thought, data]) => `- ${thought} (${data.count}회 격퇴) ➔ "${data.insight}" 승화`)
            .join('\n');

        const certText = `[명심 인지치유 연구소 공인 마음 처방전]
------------------------------------
🎯 격추 점수: ${score} PTS
🔥 최대 연속 콤보: ${gameEngineRef.current.maxCombo} 연타
🧠 뇌파 상태: α(알파)파 99.4% 고요 동조
🌿 잔여 스트레스: 0% 완벽 영점(Zero-Point) 복귀

[정화된 인지왜곡 및 승화 목록]
${statsSummary || '- 모든 잡념 즉각 정화 완료'}

✨ "잡념은 내가 아닙니다. 바라보고 자각하는 순간 빛으로 흩어집니다."
검증: myeongsimcoaching.com`;

        navigator.clipboard.writeText(certText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div 
            onClick={unlockAudio}
            className="flex flex-col items-center justify-center w-full max-w-lg mx-auto select-none"
        >
            {/* 상단 HUD 바 */}
            <div className="w-full px-3 py-2 bg-[#0c1022] rounded-2xl border border-white/10 flex items-center justify-between text-xs mb-2 shadow-md">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 font-mono font-bold text-cyan-300">
                        <Trophy size={14} className="text-amber-400" />
                        <span>{score} PTS</span>
                    </div>

                    {comboCount > 1 && (
                        <div className="flex items-center gap-1 font-mono font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
                            <Flame size={12} />
                            <span>{comboCount} {t.comboLabel}</span>
                        </div>
                    )}

                    <div className="hidden sm:flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-gray-400 font-mono">{t.stressLevel}:</span>
                        <span className="text-[10px] font-mono font-bold text-rose-400">{stressPct}%</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                            key={i}
                            size={14}
                            className={i < lives ? 'text-rose-500 fill-rose-500' : 'text-white/10'}
                        />
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        unlockAudio();
                        setIsMuted(!isMuted);
                    }}
                    className="p-1.5 rounded-xl border flex items-center gap-1 cursor-pointer transition-all bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
                    <span className="text-[10px] font-mono font-bold">{isMuted ? 'MUTE' : '8-BIT ON'}</span>
                </button>
            </div>

            {/* 캔버스 게임 화면 프레임 */}
            <div 
                onClick={unlockAudio}
                className="relative w-full aspect-[4/5] max-h-[460px] rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_45px_rgba(6,182,212,0.3)] bg-[#060814]"
            >
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={500}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    className="w-full h-full cursor-crosshair touch-none"
                />

                {/* 사운드 활성화 안내 오버레이 */}
                {!soundActive && (
                    <div 
                        onClick={unlockAudio}
                        className="absolute top-3 inset-x-4 mx-auto py-1.5 px-3 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-xs font-bold text-center cursor-pointer shadow-lg animate-bounce flex items-center justify-center gap-1.5 z-20"
                    >
                        <Volume1 size={14} />
                        <span>{t.soundPrompt}</span>
                    </div>
                )}

                {/* 과몰입 피버 모드 배너 */}
                <AnimatePresence>
                    {isFeverMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-3 inset-x-6 mx-auto py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-amber-500/90 border border-amber-300 text-slate-950 text-xs font-black text-center shadow-[0_0_25px_rgba(245,158,11,0.8)] flex items-center justify-center gap-1.5 z-20"
                        >
                            <Flame size={14} className="text-white fill-white animate-bounce" />
                            <span>{t.feverBanner}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 보스 알림 & 트랙터 빔 공지 */}
                <AnimatePresence>
                    {bossWarning && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: 3, duration: 0.5 }}
                            className="absolute top-1/4 inset-x-0 mx-auto w-fit px-4 py-2 bg-rose-600/90 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.8)] flex items-center gap-2 z-20"
                        >
                            <span>{t.bossWarning}</span>
                        </motion.div>
                    )}

                    {tractorNotice && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-16 inset-x-4 mx-auto py-2 px-3 bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 z-20"
                        >
                            <Zap size={14} className="text-yellow-400" />
                            <span>{tractorNotice}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 게임 오버 모달 */}
                {gameState === 'gameover' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30"
                    >
                        <div className="size-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                            <Skull size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-white">
                                {t.gameOver}
                            </h3>
                            <p className="text-xs text-gray-400">
                                괜찮습니다! 잡념은 그저 지나가는 구름일 뿐입니다.
                            </p>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono space-y-1 w-52">
                            <div className="flex justify-between text-gray-300">
                                <span>최종 점수</span>
                                <span className="font-bold text-cyan-300">{score} PTS</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>최대 콤보</span>
                                <span className="font-bold text-amber-400">{gameEngineRef.current.maxCombo} 연타</span>
                            </div>
                        </div>

                        <button
                            onClick={resetAndStartGame}
                            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all"
                        >
                            <RotateCcw size={16} />
                            <span>{t.restartBtn}</span>
                        </button>
                    </motion.div>
                )}

                {/* 🎉 게임 클리어: 디지털 마음 처방전 & 영점 인증 카드 모달 */}
                {gameState === 'clear' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 z-30 overflow-y-auto"
                    >
                        <div className="size-14 rounded-3xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-cyan-500/40 animate-pulse">
                            <Brain size={30} />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                                {t.certSub}
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-white">
                                {t.certTitle}
                            </h3>
                            <p className="text-[11px] text-cyan-200/90 leading-tight max-w-xs">
                                {t.pureFactMsg}
                            </p>
                        </div>

                        {/* 처방전 카드 본문 */}
                        <div className="w-full max-w-xs p-3 bg-cyan-950/60 rounded-2xl border border-cyan-400/40 text-xs font-mono space-y-2 text-left">
                            <div className="flex justify-between items-center pb-1.5 border-b border-white/10 text-gray-300">
                                <span>격추 점수 / 콤보</span>
                                <span className="font-bold text-cyan-300">{score} PTS ({gameEngineRef.current.maxCombo} COMBO)</span>
                            </div>

                            <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                                <Activity size={12} />
                                <span>{t.brainwaveStatus}</span>
                            </div>

                            {/* 정화된 잡념 목록 */}
                            <div className="space-y-1 pt-1">
                                <span className="text-[10px] text-gray-400 font-bold block">
                                    {t.purifiedTitle}:
                                </span>
                                <div className="max-h-20 overflow-y-auto space-y-1 pr-1">
                                    {Object.entries(purifiedStats).length > 0 ? (
                                        Object.entries(purifiedStats).map(([thought, data], idx) => (
                                            <div key={idx} className="flex justify-between text-[10px] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                                <span className="text-rose-300 line-through truncate max-w-[100px]">{thought} ({data.count})</span>
                                                <span className="text-emerald-300 font-bold truncate max-w-[140px]">➔ {data.insight}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-gray-400">모든 잡념 즉각 완전 정화 완료!</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between text-amber-300 font-bold pt-1 border-t border-white/10 text-[11px]">
                                <span>자각 EXP 보너스</span>
                                <span>+60 EXP (자격 승급)</span>
                            </div>
                        </div>

                        {/* 버튼 그룹 */}
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                            <button
                                onClick={handleCopyCertificate}
                                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                <span>{copied ? t.certCopied : t.copyCert}</span>
                            </button>

                            <button
                                onClick={resetAndStartGame}
                                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                            >
                                <RotateCcw size={14} />
                                <span>{t.nextStage}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* 모바일 화면용 원터치 좌우 이동 패드 */}
            <div className="w-full flex items-center justify-between gap-3 mt-2 px-1">
                <button
                    onClick={moveLeft}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/40 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 cursor-pointer transition-all"
                >
                    <ArrowLeft size={16} />
                    <span>좌측 이동</span>
                </button>
                <div className="text-[10px] text-cyan-300 font-mono text-center">
                    자동 연사 ⚡
                </div>
                <button
                    onClick={moveRight}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/40 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 cursor-pointer transition-all"
                >
                    <span>우측 이동</span>
                    <ArrowRight size={16} />
                </button>
            </div>

            <p className="text-[11px] text-gray-400 font-mono mt-2 text-center">
                {t.controlsGuide}
            </p>
        </div>
    );
}
