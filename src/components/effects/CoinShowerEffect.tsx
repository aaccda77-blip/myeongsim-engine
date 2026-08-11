'use client';

import React, { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CoinShowerRef {
    triggerCoinShower: () => void;
}

interface CoinParticle {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
    icon: string;
}

const COIN_ICONS = ['🪙', '💰', '✨', '👑', '🪙', '💰'];

export const playCoinClinkingSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const frequencies = [1318.51, 1567.98, 1975.53, 2093.00, 2637.02, 3135.96]; // E6, G6, B6, C7, E7, G7 metallic notes

        frequencies.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

            gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + idx * 0.04);
            osc.stop(ctx.currentTime + idx * 0.04 + 0.25);
        });
    } catch (e) {
        console.error('[Coin Sound Error]', e);
    }
};

export const CoinShowerEffect = forwardRef<CoinShowerRef>((_, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [coins, setCoins] = useState<CoinParticle[]>([]);

    const triggerCoinShower = useCallback(() => {
        const newCoins: CoinParticle[] = Array.from({ length: 35 }).map((_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100, // percentage x-position
            delay: Math.random() * 0.35,
            duration: 1.2 + Math.random() * 0.8,
            size: 24 + Math.random() * 20,
            rotation: (Math.random() - 0.5) * 720,
            icon: COIN_ICONS[Math.floor(Math.random() * COIN_ICONS.length)],
        }));

        setCoins(newCoins);
        setIsActive(true);
        playCoinClinkingSound();

        // Screen Shake Effect on body
        if (typeof document !== 'undefined') {
            document.body.classList.add('animate-shake');
            setTimeout(() => {
                document.body.classList.remove('animate-shake');
            }, 600);
        }

        setTimeout(() => {
            setIsActive(false);
        }, 2200);
    }, []);

    useImperativeHandle(ref, () => ({
        triggerCoinShower,
    }));

    return (
        <AnimatePresence>
            {isActive && (
                <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
                    {/* Golden Top Glow Burst */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 0.8, 0], scale: 1.2 }}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-amber-400/30 via-yellow-500/10 to-transparent blur-3xl pointer-events-none"
                    />

                    {/* Falling Coins */}
                    {coins.map((coin) => (
                        <motion.div
                            key={coin.id}
                            initial={{
                                top: '-10%',
                                left: `${coin.x}%`,
                                opacity: 1,
                                rotate: 0,
                                scale: 0.5,
                            }}
                            animate={{
                                top: '105%',
                                rotate: coin.rotation,
                                scale: [0.8, 1.2, 1],
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: coin.duration,
                                delay: coin.delay,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className="absolute font-black drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] flex items-center justify-center select-none"
                            style={{ fontSize: `${coin.size}px` }}
                        >
                            {coin.icon}
                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
});

CoinShowerEffect.displayName = 'CoinShowerEffect';
