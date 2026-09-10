'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, RotateCcw, Award, Play, Pause, Volume2, VolumeX, 
    Sparkles, Flame, Shield, Heart, Skull, Trophy, ArrowLeft, ArrowRight,
    Volume1, CheckCircle2, RefreshCw
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
        pureFactMsg: "✨ 모든 잡념이 우주 먼지로 소멸되어 고요한 영점(0)에 도달했습니다!",
        expEarned: "자각 EXP 획득!"
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
        pureFactMsg: "✨ Mind cleared of illusions, returning to pure Zero Point!",
        expEarned: "Awareness EXP Earned!"
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
        expEarned: "自覚EXP獲得！"
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
        expEarned: "觉察EXP增加！"
    }
};

const DARK_THOUGHTS = [
    { text: "난 무능해", color: "#f87171", points: 10 },
    { text: "모든 게 망했어", color: "#fb923c", points: 15 },
    { text: "날 비웃을 거야", color: "#facc15", points: 20 },
    { text: "다 때려치워", color: "#c084fc", points: 25 },
    { text: "과거의 후회", color: "#38bdf8", points: 30 },
    { text: "모두 내 탓이야", color: "#f43f5e", points: 20 }
];

export default function MyeongsimGalagaGame({
    onExpEarned,
    onExamClear,
    language = 'kr'
}: MyeongsimGalagaGameProps) {
    const t = GALAGA_I18N[language] || GALAGA_I18N.kr;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 오디오 컨텍스트 싱글톤 관리
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

    const gameEngineRef = useRef<{
        player: { x: number; y: number; width: number; height: number; speed: number; power: number; shieldTimer: number };
        bullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }>;
        enemies: Array<{ x: number; y: number; vx: number; vy: number; width: number; height: number; text: string; color: string; points: number; hp: number; maxHp: number; diveTimer: number; hitFlash: number }>;
        enemyBullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number }>;
        particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; maxLife: number; size: number }>;
        items: Array<{ x: number; y: number; vy: number; type: 'power' | 'shield' | 'life'; label: string }>;
        stars: Array<{ x: number; y: number; speed: number; size: number; opacity: number }>;
        boss: { x: number; y: number; width: number; height: number; hp: number; maxHp: number; vx: number; active: boolean; shootTimer: number; hitFlash: number } | null;
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
        items: [],
        stars: [],
        boss: null,
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

    // ── 🔊 Web Audio API 레트로 신디사이저 2.0 ──
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

    // 1. 🚀 갤러그 레이저 피치 드롭 발사음 (1100Hz -> 160Hz 쀼웅!)
    const playLaserSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
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

    // 3. ✨ 파워업 획득 사운드 (528Hz 솔페지오)
    const playPowerupSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            [528, 660, 792, 1056].forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.04);
                gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.14);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.04);
                osc.stop(ctx.currentTime + idx * 0.04 + 0.14);
            });
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 4. 🚨 보스 경보음
    const playBossAlertSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            [440, 220, 440, 220].forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.18);
                gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.18);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.16);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.18);
                osc.stop(ctx.currentTime + idx * 0.18 + 0.16);
            });
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 별 생성
    const initStars = (width: number, height: number) => {
        const stars = [];
        for (let i = 0; i < 70; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
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
                const thought = DARK_THOUGHTS[(r * cols + c) % DARK_THOUGHTS.length];
                enemies.push({
                    x: startX + c * spacingX,
                    y: 40 + r * spacingY,
                    vx: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.5),
                    vy: 0,
                    width: 48,
                    height: 30,
                    text: thought.text,
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
            hp: 30,
            maxHp: 30,
            vx: 2,
            active: true,
            shootTimer: 55,
            hitFlash: 0
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
            items: [],
            stars: initStars(w, h),
            boss: null,
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
        setGameState('playing');
        unlockAudio();
    }, [unlockAudio]);

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

            // 1. 화면 클리어
            ctx.fillStyle = '#060814';
            ctx.fillRect(0, 0, w, h);

            // 2. 별똥별 스크롤
            ctx.fillStyle = '#ffffff';
            ge.stars.forEach(star => {
                star.y += star.speed;
                if (star.y > h) {
                    star.y = 0;
                    star.x = Math.random() * w;
                }
                ctx.globalAlpha = star.opacity;
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });
            ctx.globalAlpha = 1.0;

            // 3. 플레이어 이동
            if (ge.keys['ArrowLeft'] || ge.keys['a'] || ge.keys['A']) {
                ge.player.x -= ge.player.speed;
                ge.mousePos.x = ge.player.x;
            } else if (ge.keys['ArrowRight'] || ge.keys['d'] || ge.keys['D']) {
                ge.player.x += ge.player.speed;
                ge.mousePos.x = ge.player.x;
            } else {
                const targetX = ge.mousePos.x;
                ge.player.x += (targetX - ge.player.x) * 0.3;
            }

            ge.player.x = Math.max(26, Math.min(w - 26, ge.player.x));
            ge.player.y = h - 55;

            if (ge.player.shieldTimer > 0) ge.player.shieldTimer--;

            // 4. 자동 발사
            const now = Date.now();
            if (now - ge.lastFireTime > ge.fireInterval) {
                ge.lastFireTime = now;
                playLaserSound();

                if (ge.player.power === 1) {
                    ge.bullets.push({ x: ge.player.x, y: ge.player.y - 22, vx: 0, vy: -10, radius: 3.5, color: '#38bdf8' });
                } else if (ge.player.power === 2) {
                    ge.bullets.push({ x: ge.player.x - 12, y: ge.player.y - 20, vx: 0, vy: -10, radius: 3.5, color: '#38bdf8' });
                    ge.bullets.push({ x: ge.player.x + 12, y: ge.player.y - 20, vx: 0, vy: -10, radius: 3.5, color: '#38bdf8' });
                } else {
                    ge.bullets.push({ x: ge.player.x - 16, y: ge.player.y - 20, vx: -1.2, vy: -10, radius: 4, color: '#c084fc' });
                    ge.bullets.push({ x: ge.player.x, y: ge.player.y - 24, vx: 0, vy: -11, radius: 4.5, color: '#06b6d4' });
                    ge.bullets.push({ x: ge.player.x + 16, y: ge.player.y - 20, vx: 1.2, vy: -10, radius: 4, color: '#c084fc' });
                }
            }

            // 5. 총알 이동 및 렌더링
            for (let i = ge.bullets.length - 1; i >= 0; i--) {
                const b = ge.bullets[i];
                b.x += b.vx;
                b.y += b.vy;

                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (b.y < -10) {
                    ge.bullets.splice(i, 1);
                }
            }

            // 6. 적 에일리언 업데이트 & 렌더링
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

                // 총알 충돌 판정
                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const b = ge.bullets[bi];
                    const dist = Math.hypot(b.x - e.x, b.y - e.y);
                    if (dist < 22) {
                        ge.bullets.splice(bi, 1);
                        e.hp--;
                        e.hitFlash = 5;

                        if (e.hp <= 0) {
                            for (let p = 0; p < 16; p++) {
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

                            if (Math.random() < 0.22) {
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
                            ge.score += e.points;
                            setScore(ge.score);
                            setStressPct(prev => Math.max(0, prev - 6));
                            if (onExpEarned) onExpEarned(10);
                            ge.enemies.splice(i, 1);
                            break;
                        }
                    }
                }

                if (ge.player.shieldTimer <= 0) {
                    const playerDist = Math.hypot(ge.player.x - e.x, ge.player.y - e.y);
                    if (playerDist < 28) {
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90;
                        ge.shakeTimer = 10;
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

            // 7. 거대 에고 보스
            if (ge.boss && ge.boss.active) {
                const b = ge.boss;
                b.x += b.vx;
                if (b.x < 70 || b.x > w - 70) b.vx *= -1;

                if (b.hitFlash > 0) b.hitFlash--;

                b.shootTimer--;
                if (b.shootTimer <= 0) {
                    b.shootTimer = 48;
                    ge.enemyBullets.push({ x: b.x - 30, y: b.y + 30, vx: -1.2, vy: 3.8, radius: 4 });
                    ge.enemyBullets.push({ x: b.x, y: b.y + 35, vx: 0, vy: 4.5, radius: 5 });
                    ge.enemyBullets.push({ x: b.x + 30, y: b.y + 30, vx: 1.2, vy: 3.8, radius: 4 });
                }

                ctx.save();
                ctx.translate(b.x, b.y);
                
                ctx.shadowColor = b.hitFlash > 0 ? '#ffffff' : '#f43f5e';
                ctx.shadowBlur = b.hitFlash > 0 ? 30 : 20;
                ctx.fillStyle = b.hitFlash > 0 ? '#ffffff' : '#4c0519';
                ctx.beginPath();
                ctx.roundRect(-60, -28, 120, 56, 18);
                ctx.fill();

                ctx.strokeStyle = '#fb7185';
                ctx.lineWidth = 4;
                ctx.strokeRect(-50, -20, 42, 40);
                ctx.strokeRect(8, -20, 42, 40);
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.stroke();

                ctx.fillStyle = '#f43f5e';
                ctx.beginPath();
                ctx.arc(-29, 0, 9, 0, Math.PI * 2);
                ctx.arc(29, 0, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                const hpPct = b.hp / b.maxHp;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(w / 2 - 80, 16, 160, 8);
                ctx.fillStyle = '#f43f5e';
                ctx.fillRect(w / 2 - 80, 16, 160 * hpPct, 8);
                ctx.strokeStyle = '#ffffff';
                ctx.strokeRect(w / 2 - 80, 16, 160, 8);

                ctx.font = 'bold 11px sans-serif';
                ctx.fillStyle = '#fecdd3';
                ctx.textAlign = 'center';
                ctx.fillText(t.bossName, w / 2, 12);

                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const blt = ge.bullets[bi];
                    if (Math.abs(blt.x - b.x) < 60 && Math.abs(blt.y - b.y) < 32) {
                        ge.bullets.splice(bi, 1);
                        b.hp--;
                        b.hitFlash = 4;

                        if (b.hp <= 0) {
                            ge.shakeTimer = 25;
                            for (let p = 0; p < 50; p++) {
                                ge.particles.push({
                                    x: b.x + (Math.random() - 0.5) * 80,
                                    y: b.y + (Math.random() - 0.5) * 40,
                                    vx: (Math.random() - 0.5) * 10,
                                    vy: (Math.random() - 0.5) * 10,
                                    color: p % 2 === 0 ? '#38bdf8' : '#facc15',
                                    life: 45,
                                    maxLife: 45,
                                    size: 4 + Math.random() * 4
                                });
                            }
                            playExplosionSound();
                            ge.boss = null;
                            ge.score += 500;
                            setScore(ge.score);
                            setStressPct(0);
                            if (onExpEarned) onExpEarned(50);
                            
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

            // 8. 적 총알
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

            // 9. 파워업 아이템
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

            // 10. 파티클
            for (let i = ge.particles.length - 1; i >= 0; i--) {
                const p = ge.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;

                const alpha = p.life / p.maxLife;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                if (p.life <= 0) ge.particles.splice(i, 1);
            }

            // 11. 🚀 갤러그 스타일 원작 화이트/레드 플레이어 비행기
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

            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(0, -22);
            ctx.lineTo(22, 16);
            ctx.lineTo(8, 12);
            ctx.lineTo(0, 16);
            ctx.lineTo(-8, 12);
            ctx.lineTo(-22, 16);
            ctx.closePath();
            ctx.fill();

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

            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(0, -4, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-2, -6, 2, 0, Math.PI * 2);
            ctx.fill();

            const flameLen = 14 + Math.random() * 8;
            ctx.fillStyle = '#f59e0b';
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
    }, [gameState, playLaserSound, playExplosionSound, playPowerupSound, onExpEarned, onExamClear, t.bossName]);

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

                {!soundActive && (
                    <div 
                        onClick={unlockAudio}
                        className="absolute top-3 inset-x-4 mx-auto py-1.5 px-3 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-xs font-bold text-center cursor-pointer shadow-lg animate-bounce flex items-center justify-center gap-1.5 z-20"
                    >
                        <Volume1 size={14} />
                        <span>{t.soundPrompt}</span>
                    </div>
                )}

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
                </AnimatePresence>

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

                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono space-y-1 w-48">
                            <div className="flex justify-between text-gray-300">
                                <span>최종 점수</span>
                                <span className="font-bold text-cyan-300">{score} PTS</span>
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

                {gameState === 'clear' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30"
                    >
                        <div className="size-16 rounded-3xl bg-gradient-to-tr from-cyan-400 to-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40 animate-pulse">
                            <Sparkles size={36} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-white">
                                {t.gameClear}
                            </h3>
                            <p className="text-xs text-cyan-200/90 leading-relaxed max-w-xs">
                                {t.pureFactMsg}
                            </p>
                        </div>

                        <div className="p-3.5 bg-cyan-950/60 rounded-2xl border border-cyan-400/40 text-xs font-mono space-y-1 w-56">
                            <div className="flex justify-between text-gray-300">
                                <span>격추 점수</span>
                                <span className="font-bold text-cyan-300">{score} PTS</span>
                            </div>
                            <div className="flex justify-between text-emerald-300 font-bold">
                                <span>보너스</span>
                                <span>+50 EXP (자격승급)</span>
                            </div>
                        </div>

                        <button
                            onClick={resetAndStartGame}
                            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                        >
                            <RotateCcw size={16} />
                            <span>다음 스테이지 도전 ➔</span>
                        </button>
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
