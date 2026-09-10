'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, RotateCcw, Award, Play, Pause, Volume2, VolumeX, 
    Sparkles, Flame, Shield, Heart, Skull, Trophy
} from 'lucide-react';
import { passAcademyExam } from '@/lib/questUnlockManager';

interface MyeongsimGalagaGameProps {
    onExpEarned?: (amount: number) => void;
    onExamClear?: (level: number) => void;
    language?: 'kr' | 'en' | 'jp' | 'cn';
}

// 🌐 게임 다국어 텍스트
const GALAGA_I18N = {
    kr: {
        title: "명심 갤러그: 잡념 격퇴 아케이드",
        subtitle: "하늘에서 쏟아지는 왜곡된 생각을 자각 빔으로 시원하게 폭파하세요!",
        score: "격추 점수",
        highScore: "최고 기록",
        wave: "WAVE",
        bossWarning: "⚠️ WARNING: 거대 에고 보스 출현! ⚠️",
        gameOver: "게임 오버 (호흡을 가다듬으세요)",
        gameClear: "🎉 축하합니다! 모든 잡념 소멸 & 마음 0점 리셋!",
        startBtn: "🚀 출격! 잡념 격퇴 시작",
        restartBtn: "🔄 다시 도전하기",
        resumeBtn: "계속하기",
        pauseBtn: "일시정지",
        controlsGuide: "PC: 마우스 이동 / 모바일: 터치 드래그 (자동 발사)",
        bossName: "거대한 인지 왜곡의 에고",
        pureFactMsg: "✨ 모든 잡념이 가라앉고 고요한 영점(0)에 도달했습니다!",
        expEarned: "자각 EXP 획득!"
    },
    en: {
        title: "Zero-Point Galaga: Mind Invaders",
        subtitle: "Blast away negative intrusive thoughts with awareness lasers!",
        score: "Score",
        highScore: "High Score",
        wave: "WAVE",
        bossWarning: "⚠️ WARNING: Giant Ego Boss Approaching! ⚠️",
        gameOver: "GAME OVER (Take a deep breath)",
        gameClear: "🎉 Victory! All Dark Thoughts Destroyed!",
        startBtn: "🚀 Launch! Start Blasting",
        restartBtn: "🔄 Try Again",
        resumeBtn: "Resume",
        pauseBtn: "Pause",
        controlsGuide: "PC: Mouse Move / Mobile: Touch Drag (Auto-fires)",
        bossName: "The Giant Distorted Ego",
        pureFactMsg: "✨ Mind cleared of illusions, returning to pure Zero Point!",
        expEarned: "Awareness EXP Earned!"
    },
    jp: {
        title: "明心 ギャラガ: 雑念撃退アーケード",
        subtitle: "空から降り注ぐ歪んだ思考を自覚ビームで爽快に撃墜せよ！",
        score: "スコア",
        highScore: "ハイスコア",
        wave: "WAVE",
        bossWarning: "⚠️ WARNING: 巨大エゴボス出現！ ⚠️",
        gameOver: "ゲームオーバー (深呼吸しましょう)",
        gameClear: "🎉 勝利！全ての雑念が消滅しゼロポイントへ帰還！",
        startBtn: "🚀 出撃！雑念撃破スタート",
        restartBtn: "🔄 もう一度挑戦",
        resumeBtn: "再開",
        pauseBtn: "一時停止",
        controlsGuide: "PC: マウス移動 / スマホ: タッチドラッグ (自動連射)",
        bossName: "巨大な認知歪曲のエゴ",
        pureFactMsg: "✨ すべての雑念が浄化され、静寂なゼロポイントへ戻りました！",
        expEarned: "自覚EXP獲得！"
    },
    cn: {
        title: "明心大蜜蜂: 杂念击退街机",
        subtitle: "用觉察激光爽快轰碎从天而降的消极杂念与思维执念！",
        score: "击落分数",
        highScore: "最高分",
        wave: "WAVE",
        bossWarning: "⚠️ WARNING: 巨型执念魔王降临！ ⚠️",
        gameOver: "游戏结束 (请深吸一口气)",
        gameClear: "🎉 大获全胜！一切杂念灰飞烟灭，心智彻底归零！",
        startBtn: "🚀 出击！开启杂念击碎之旅",
        restartBtn: "🔄 再次挑战",
        resumeBtn: "继续",
        pauseBtn: "暂停",
        controlsGuide: "PC: 移动鼠标 / 手机: 触摸拖动 (自动连射)",
        bossName: "巨型认知扭曲之自我",
        pureFactMsg: "✨ 杂念散尽，重归清明安详的零点纯境！",
        expEarned: "觉察EXP增加！"
    }
};

// 잡념 에일리언 목록
const DARK_THOUGHTS = [
    { text: "난 무능해", color: "#f87171", points: 10, icon: "👾" },
    { text: "모든 게 망했어", color: "#fb923c", points: 15, icon: "🛸" },
    { text: "날 비웃을 거야", color: "#facc15", points: 20, icon: "👾" },
    { text: "다 때려치워", color: "#c084fc", points: 25, icon: "🚀" },
    { text: "과거의 후회", color: "#38bdf8", points: 30, icon: "🛸" },
    { text: "모두 내 탓이야", color: "#f43f5e", points: 20, icon: "👾" }
];

export default function MyeongsimGalagaGame({
    onExpEarned,
    onExamClear,
    language = 'kr'
}: MyeongsimGalagaGameProps) {
    const t = GALAGA_I18N[language] || GALAGA_I18N.kr;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 게임 상태
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover' | 'clear'>('idle');
    const [score, setScore] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);
    const [wave, setWave] = useState<number>(1);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [bossWarning, setBossWarning] = useState<boolean>(false);

    // 내부 게임 루프 레퍼런스
    const gameEngineRef = useRef<{
        player: { x: number; y: number; width: number; height: number; speed: number; power: number; shieldTimer: number };
        bullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }>;
        enemies: Array<{ x: number; y: number; vx: number; vy: number; width: number; height: number; text: string; color: string; points: number; hp: number; maxHp: number; diveTimer: number }>;
        enemyBullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number }>;
        particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; maxLife: number; size: number }>;
        items: Array<{ x: number; y: number; vy: number; type: 'power' | 'shield' | 'life'; label: string }>;
        stars: Array<{ x: number; y: number; speed: number; size: number; opacity: number }>;
        boss: { x: number; y: number; width: number; height: number; hp: number; maxHp: number; vx: number; active: boolean; shootTimer: number } | null;
        lastFireTime: number;
        fireInterval: number;
        score: number;
        lives: number;
        wave: number;
        keys: { [key: string]: boolean };
        mousePos: { x: number; y: number };
        animId: number | null;
    }>({
        player: { x: 200, y: 440, width: 32, height: 32, speed: 6, power: 1, shieldTimer: 0 },
        bullets: [],
        enemies: [],
        enemyBullets: [],
        particles: [],
        items: [],
        stars: [],
        boss: null,
        lastFireTime: 0,
        fireInterval: 160, // 약 6발/초
        score: 0,
        lives: 3,
        wave: 1,
        keys: {},
        mousePos: { x: 200, y: 440 },
        animId: null
    });

    // 🔊 8-Bit 레트로 사운드 신디사이저
    const play8BitTone = useCallback((freq: number, type: OscillatorType = 'square', duration: number = 0.08, gainVal: number = 0.1) => {
        if (isMuted) return;
        try {
            if (typeof window === 'undefined') return;
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }, [isMuted]);

    const playLaserSound = useCallback(() => {
        play8BitTone(880, 'square', 0.07, 0.06);
        setTimeout(() => play8BitTone(440, 'square', 0.07, 0.04), 25);
    }, [play8BitTone]);

    const playExplosionSound = useCallback(() => {
        play8BitTone(180, 'sawtooth', 0.22, 0.15);
        setTimeout(() => play8BitTone(90, 'triangle', 0.25, 0.15), 50);
    }, [play8BitTone]);

    const playPowerupSound = useCallback(() => {
        [528, 660, 792, 1056].forEach((f, idx) => {
            setTimeout(() => play8BitTone(f, 'sine', 0.12, 0.08), idx * 45);
        });
    }, [play8BitTone]);

    const playBossAlertSound = useCallback(() => {
        [300, 200, 300, 200].forEach((f, idx) => {
            setTimeout(() => play8BitTone(f, 'sawtooth', 0.2, 0.15), idx * 180);
        });
    }, [play8BitTone]);

    // 별 생성 (우주 배경)
    const initStars = (width: number, height: number) => {
        const stars = [];
        for (let i = 0; i < 60; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speed: 0.5 + Math.random() * 2,
                size: 1 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
        return stars;
    };

    // 적 에일리언 스폰 (편대 형성)
    const spawnEnemyWave = (canvasWidth: number) => {
        const enemies = [];
        const rows = 3;
        const cols = 5;
        const spacingX = 64;
        const spacingY = 40;
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
                    height: 28,
                    text: thought.text,
                    color: thought.color,
                    points: thought.points,
                    hp: 1,
                    maxHp: 1,
                    diveTimer: 180 + Math.floor(Math.random() * 300)
                });
            }
        }
        return enemies;
    };

    // 거대 에고 보스 소환
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
            shootTimer: 60
        };
    };

    // 게임 시작
    const startGame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const w = canvas.width;
        const h = canvas.height;

        gameEngineRef.current = {
            player: { x: w / 2, y: h - 50, width: 34, height: 34, speed: 6, power: 1, shieldTimer: 120 },
            bullets: [],
            enemies: spawnEnemyWave(w),
            enemyBullets: [],
            particles: [],
            items: [],
            stars: initStars(w, h),
            boss: null,
            lastFireTime: 0,
            fireInterval: 150,
            score: 0,
            lives: 3,
            wave: 1,
            keys: {},
            mousePos: { x: w / 2, y: h - 50 },
            animId: null
        };

        setScore(0);
        setLives(3);
        setWave(1);
        setGameState('playing');
        playPowerupSound();
    };

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

            // 1. 화면 클리어 (짙은 우주 블랙)
            ctx.fillStyle = '#070913';
            ctx.fillRect(0, 0, w, h);

            // 2. 별똥별 배경 스크롤
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

            // 3. 플레이어 위치 업데이트 (마우스/터치 위치 추종)
            const targetX = ge.mousePos.x;
            ge.player.x += (targetX - ge.player.x) * 0.25;
            ge.player.x = Math.max(20, Math.min(w - 20, ge.player.x));

            // 실드 타이머 감소
            if (ge.player.shieldTimer > 0) ge.player.shieldTimer--;

            // 4. 자동 발사 (Auto Fire)
            const now = Date.now();
            if (now - ge.lastFireTime > ge.fireInterval) {
                ge.lastFireTime = now;
                playLaserSound();

                if (ge.player.power === 1) {
                    ge.bullets.push({ x: ge.player.x, y: ge.player.y - 18, vx: 0, vy: -9, radius: 3, color: '#38bdf8' });
                } else if (ge.player.power === 2) {
                    // 트윈 레이저
                    ge.bullets.push({ x: ge.player.x - 10, y: ge.player.y - 18, vx: 0, vy: -9, radius: 3, color: '#38bdf8' });
                    ge.bullets.push({ x: ge.player.x + 10, y: ge.player.y - 18, vx: 0, vy: -9, radius: 3, color: '#38bdf8' });
                } else {
                    // 트리플 광선검 빔
                    ge.bullets.push({ x: ge.player.x - 14, y: ge.player.y - 18, vx: -1.2, vy: -9, radius: 3.5, color: '#a855f7' });
                    ge.bullets.push({ x: ge.player.x, y: ge.player.y - 20, vx: 0, vy: -10, radius: 4, color: '#06b6d4' });
                    ge.bullets.push({ x: ge.player.x + 14, y: ge.player.y - 18, vx: 1.2, vy: -9, radius: 3.5, color: '#a855f7' });
                }
            }

            // 5. 총알 이동 및 렌더링
            for (let i = ge.bullets.length - 1; i >= 0; i--) {
                const b = ge.bullets[i];
                b.x += b.vx;
                b.y += b.vy;

                // 총알 그리기
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 8;
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

                // 좌우 벽 바운스
                if (e.x < 30 || e.x > w - 30) {
                    e.vx *= -1;
                }

                // 다이빙 공격 카운트다운
                e.diveTimer--;
                if (e.diveTimer <= 0) {
                    e.y += 2.2;
                    e.x += Math.sin(e.y * 0.05) * 2;

                    // 화면 아래로 지나가면 위에서 다시 나타남
                    if (e.y > h + 20) {
                        e.y = 30;
                        e.diveTimer = 200 + Math.floor(Math.random() * 200);
                    }

                    // 가끔 총알 발사
                    if (Math.random() < 0.02) {
                        ge.enemyBullets.push({ x: e.x, y: e.y + 12, vx: 0, vy: 4, radius: 3 });
                    }
                }

                // 에일리언 기체 그리기
                ctx.fillStyle = e.color;
                ctx.shadowColor = e.color;
                ctx.shadowBlur = 10;
                
                // 외계인 본체 (다이아몬드/외계선 모양)
                ctx.beginPath();
                ctx.moveTo(e.x, e.y - 10);
                ctx.lineTo(e.x + 18, e.y);
                ctx.lineTo(e.x + 12, e.y + 12);
                ctx.lineTo(e.x - 12, e.y + 12);
                ctx.lineTo(e.x - 18, e.y);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                // 잡념 텍스트 라벨 (머리 위)
                ctx.font = 'bold 10px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(e.text, e.x, e.y - 14);

                // 플레이어 총알과의 충돌 판정
                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const b = ge.bullets[bi];
                    const dist = Math.hypot(b.x - e.x, b.y - e.y);
                    if (dist < 20) {
                        // 피격!
                        ge.bullets.splice(bi, 1);
                        e.hp--;

                        if (e.hp <= 0) {
                            // 폭발 파티클
                            for (let p = 0; p < 12; p++) {
                                ge.particles.push({
                                    x: e.x,
                                    y: e.y,
                                    vx: (Math.random() - 0.5) * 6,
                                    vy: (Math.random() - 0.5) * 6,
                                    color: e.color,
                                    life: 25,
                                    maxLife: 25,
                                    size: 2 + Math.random() * 3
                                });
                            }

                            // 파워업 아이템 드롭 (15% 확률)
                            if (Math.random() < 0.18) {
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
                            if (onExpEarned) onExpEarned(10);
                            ge.enemies.splice(i, 1);
                            break;
                        }
                    }
                }

                // 플레이어 본체와의 충돌
                if (ge.player.shieldTimer <= 0) {
                    const playerDist = Math.hypot(ge.player.x - e.x, ge.player.y - e.y);
                    if (playerDist < 26) {
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90; // 무적 시간 부여
                        playExplosionSound();

                        if (ge.lives <= 0) {
                            setGameState('gameover');
                            isRunning = false;
                            return;
                        }
                    }
                }
            }

            // 7. 보스전 업데이트 & 렌더링
            if (ge.boss && ge.boss.active) {
                const b = ge.boss;
                b.x += b.vx;
                if (b.x < 70 || b.x > w - 70) b.vx *= -1;

                b.shootTimer--;
                if (b.shootTimer <= 0) {
                    b.shootTimer = 45;
                    // 보스 유도 탄막 발사
                    ge.enemyBullets.push({ x: b.x - 30, y: b.y + 30, vx: -1, vy: 3.5, radius: 4 });
                    ge.enemyBullets.push({ x: b.x, y: b.y + 35, vx: 0, vy: 4, radius: 4.5 });
                    ge.enemyBullets.push({ x: b.x + 30, y: b.y + 30, vx: 1, vy: 3.5, radius: 4 });
                }

                // 보스 본체 그리기 (거대한 찌그러진 안경 + 에고 코어)
                ctx.save();
                ctx.translate(b.x, b.y);
                
                // 보스 오라
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 20;
                ctx.fillStyle = '#4c0519';
                ctx.beginPath();
                ctx.roundRect(-55, -25, 110, 50, 16);
                ctx.fill();

                // 찌그러진 안경 프레임
                ctx.strokeStyle = '#fb7185';
                ctx.lineWidth = 4;
                ctx.strokeRect(-48, -18, 40, 36);
                ctx.strokeRect(8, -18, 40, 36);
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.stroke();

                // 보스 눈동자 (빛남)
                ctx.fillStyle = '#f43f5e';
                ctx.beginPath();
                ctx.arc(-28, 0, 8, 0, Math.PI * 2);
                ctx.arc(28, 0, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

                // 보스 HP 바
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

                // 총알 충돌 판정
                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const blt = ge.bullets[bi];
                    if (Math.abs(blt.x - b.x) < 55 && Math.abs(blt.y - b.y) < 30) {
                        ge.bullets.splice(bi, 1);
                        b.hp--;

                        // 보스 피격 파티클
                        ge.particles.push({
                            x: blt.x,
                            y: blt.y,
                            vx: (Math.random() - 0.5) * 4,
                            vy: (Math.random() - 0.5) * 4,
                            color: '#f43f5e',
                            life: 15,
                            maxLife: 15,
                            size: 3
                        });

                        if (b.hp <= 0) {
                            // 보스 대폭발!
                            for (let p = 0; p < 40; p++) {
                                ge.particles.push({
                                    x: b.x + (Math.random() - 0.5) * 80,
                                    y: b.y + (Math.random() - 0.5) * 40,
                                    vx: (Math.random() - 0.5) * 8,
                                    vy: (Math.random() - 0.5) * 8,
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
                            if (onExpEarned) onExpEarned(50);
                            
                            // 평생교육원 시험 자동 통과 트리거
                            const examResult = passAcademyExam('quiz_galaga_boss', 2);
                            if (onExamClear) onExamClear(examResult.newLevel);

                            setGameState('clear');
                            isRunning = false;
                            return;
                        }
                    }
                }
            }

            // 적이 모두 전멸했을 때 ➔ 보스 소환 또는 다음 웨이브
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

            // 8. 적 총알 이동 및 충돌
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

                // 플레이어 피격
                if (ge.player.shieldTimer <= 0) {
                    const dist = Math.hypot(eb.x - ge.player.x, eb.y - ge.player.y);
                    if (dist < 18) {
                        ge.enemyBullets.splice(i, 1);
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90;
                        playExplosionSound();

                        if (ge.lives <= 0) {
                            setGameState('gameover');
                            isRunning = false;
                            return;
                        }
                        continue;
                    }
                }

                if (eb.y > h + 10) ge.enemyBullets.splice(i, 1);
            }

            // 9. 파워업 아이템 이동 및 획득
            for (let i = ge.items.length - 1; i >= 0; i--) {
                const it = ge.items[i];
                it.y += it.vy;

                // 아이템 렌더링
                ctx.fillStyle = it.type === 'power' ? '#f59e0b' : it.type === 'shield' ? '#06b6d4' : '#ec4899';
                ctx.beginPath();
                ctx.roundRect(it.x - 14, it.y - 10, 28, 20, 8);
                ctx.fill();

                ctx.font = 'bold 9px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(it.label, it.x, it.y + 4);

                // 플레이어 획득
                const dist = Math.hypot(it.x - ge.player.x, it.y - ge.player.y);
                if (dist < 26) {
                    ge.items.splice(i, 1);
                    playPowerupSound();
                    if (it.type === 'power') {
                        ge.player.power = Math.min(3, ge.player.power + 1);
                    } else if (it.type === 'shield') {
                        ge.player.shieldTimer = 300; // 5초 무적
                    } else if (it.type === 'life') {
                        ge.lives = Math.min(5, ge.lives + 1);
                        setLives(ge.lives);
                    }
                    ge.score += 50;
                    setScore(ge.score);
                }

                if (it.y > h + 20) ge.items.splice(i, 1);
            }

            // 10. 폭발 파티클
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

            // 11. 플레이어 본체 (ZERO-SHIP) 렌더링
            ctx.save();
            ctx.translate(ge.player.x, ge.player.y);

            // 실드 배리어 (무적 시)
            if (ge.player.shieldTimer > 0) {
                ctx.strokeStyle = '#38bdf8';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 12;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, 26, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // 영점 우주선 (삼각형 날개 + 콕핏)
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.moveTo(0, -18);
            ctx.lineTo(16, 14);
            ctx.lineTo(6, 10);
            ctx.lineTo(0, 14);
            ctx.lineTo(-6, 10);
            ctx.lineTo(-16, 14);
            ctx.closePath();
            ctx.fill();

            // 콕핏 (영점 빛)
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(0, -4, 5, 0, Math.PI * 2);
            ctx.fill();

            // 추진체 불꽃 애니메이션
            ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-4, 12);
            ctx.lineTo(0, 22 + Math.random() * 6);
            ctx.lineTo(4, 12);
            ctx.closePath();
            ctx.fill();

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

    // 마우스/터치 컨트롤 핸들러
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || e.touches.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    // 최고 점수 갱신
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
        }
    }, [score, highScore]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto select-none">
            {/* 상단 HUD 바: 점수 & 라이프 & 웨이브 & 사운드 토글 */}
            <div className="w-full px-3 py-2 bg-[#0c1022] rounded-2xl border border-white/10 flex items-center justify-between text-xs mb-2 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-mono font-bold text-cyan-300">
                        <Trophy size={14} className="text-amber-400" />
                        <span>{score} PTS</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-gray-400 text-[11px]">
                        <span>HI: {highScore}</span>
                    </div>
                </div>

                {/* 남은 라이프 (하트) */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                            key={i}
                            size={14}
                            className={i < lives ? 'text-rose-500 fill-rose-500' : 'text-white/10'}
                        />
                    ))}
                </div>

                {/* 사운드 토글 버튼 */}
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </div>

            {/* 캔버스 게임 화면 프레임 */}
            <div className="relative w-full aspect-[4/5] max-h-[460px] rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] bg-[#070913]">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={500}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    className="w-full h-full cursor-crosshair touch-none"
                />

                {/* 보스 출현 경보 오버레이 */}
                <AnimatePresence>
                    {bossWarning && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: 3, duration: 0.5 }}
                            className="absolute top-1/4 inset-x-0 mx-auto w-fit px-4 py-2 bg-rose-600/90 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.8)] flex items-center gap-2"
                        >
                            <span>{t.bossWarning}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 1. 시작 대기 화면 (IDLE) */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="size-16 rounded-3xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40 animate-bounce">
                            <Zap size={36} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-white">
                                {t.title}
                            </h3>
                            <p className="text-xs text-cyan-200/80 max-w-xs">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* 조작법 안내 */}
                        <div className="text-[11px] text-gray-300 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                            {t.controlsGuide}
                        </div>

                        <button
                            onClick={startGame}
                            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        >
                            <Play size={18} />
                            <span>{t.startBtn}</span>
                        </button>
                    </div>
                )}

                {/* 2. 게임 오버 화면 (GAMEOVER) */}
                {gameState === 'gameover' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
                    >
                        <div className="size-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                            <Skull size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-white">
                                {t.gameOver}
                            </h3>
                            <p className="text-xs text-gray-400">
                                괜찮습니다! 잡념은 그저 흘러가는 구름일 뿐입니다.
                            </p>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono space-y-1 w-48">
                            <div className="flex justify-between text-gray-300">
                                <span>최종 점수</span>
                                <span className="font-bold text-cyan-300">{score} PTS</span>
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all"
                        >
                            <RotateCcw size={16} />
                            <span>{t.restartBtn}</span>
                        </button>
                    </motion.div>
                )}

                {/* 3. 게임 클리어 화면 (VICTORY CLEAR) */}
                {gameState === 'clear' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
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
                            onClick={startGame}
                            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                        >
                            <RotateCcw size={16} />
                            <span>다음 스테이지 도전 ➔</span>
                        </button>
                    </motion.div>
                )}
            </div>

            {/* 하단 설명 가이드 */}
            <p className="text-[11px] text-gray-400 font-mono mt-2 text-center">
                💡 8-Bit 갤러그 아케이드 엔진 | Web Audio API 칩튠 사운드 적용
            </p>
        </div>
    );
}
