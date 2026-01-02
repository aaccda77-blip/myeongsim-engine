import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Brain, Cpu, Wifi } from 'lucide-react';

interface MindSyncStatusBarProps {
    level: number;
    xp: number; // 0-100
    stateLabel: string; // e.g., "MIND WANDERER"
    isLevelUp?: boolean;
}

// [Growth Map Configuration]


// [UX] Glitch Text Component for "Hacking" feel
const GlitchText = ({ text }: { text: string }) => {
    return (
        <span className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500 opacity-0 group-hover:opacity-70 animate-pulse translate-x-[1px] skew-x-12">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[1px] -skew-x-12">{text}</span>
        </span>
    );
};

export const MindSyncStatusBar: React.FC<MindSyncStatusBarProps> = ({
    level,
    xp,
    stateLabel,
    isLevelUp = false,
}) => {
    const [displayXP, setDisplayXP] = useState(0);

    // [UX] Number Count-up Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayXP(prev => {
                if (prev < xp) return Math.min(prev + 1, xp);
                if (prev > xp) return Math.max(prev - 1, xp);
                return prev;
            });
        }, 20);
        return () => clearInterval(interval);
    }, [xp]);

    return (
        <div className="w-full bg-[#0a0f18] border-b border-white/5 relative overflow-hidden shadow-xl z-50">
            {/* [Living Background] Digital Grid Scanning */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="px-4 py-3 flex items-center justify-between relative z-10">

                {/* Left: Level Badge & Neural Status */}
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer">
                        {/* Level Ring */}
                        <motion.div
                            className={`w-11 h-11 rounded-full flex items-center justify-center border-[2px] backdrop-blur-md relative z-10
                            ${isLevelUp ? 'border-primary-gold bg-primary-gold/10' : 'border-white/10 bg-white/5'}`}
                            animate={isLevelUp ? {
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                                borderColor: ['#DAA520', '#FFF', '#DAA520']
                            } : {
                                borderColor: ['rgba(255,255,255,0.1)', 'rgba(34,211,238,0.3)', 'rgba(255,255,255,0.1)']
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <span className={`font-black text-sm ${isLevelUp ? 'text-primary-gold' : 'text-white'}`}>
                                Lv.<span className="text-lg">{level}</span>
                            </span>
                        </motion.div>

                        {/* Spinning Ring */}
                        <motion.div
                            className="absolute -inset-1 rounded-full border border-cyan-500/30 border-dashed"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Particle Effect on Level Up */}
                        <AnimatePresence>
                            {isLevelUp && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 2 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center -z-10"
                                >
                                    <div className="w-20 h-20 rounded-full bg-primary-gold/40 blur-xl" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {isLevelUp ? <Zap className="w-3 h-3 text-yellow-400 animate-bounce" /> : <Brain className="w-3 h-3 text-cyan-400" />}
                            <span className={`text-sm font-bold tracking-wider ${level >= 5 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400' : 'text-gray-200'}`}>
                                <GlitchText text={stateLabel} />
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-mono">
                                NEURAL LINK
                            </span>
                            <span className="flex gap-0.5">
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 h-1 bg-green-500 rounded-full" />
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, delay: 0.2, repeat: Infinity }} className="w-1 h-1 bg-green-500 rounded-full" />
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, delay: 0.4, repeat: Infinity }} className="w-1 h-1 bg-green-500 rounded-full" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Sync Status (Simplified for Space) */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <Brain className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs font-bold text-gray-300">Target Lv.{level}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
                                <motion.div
                                    className="h-full bg-cyan-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xp}%` }}
                                />
                            </div>
                            <span className="text-[9px] text-cyan-400 font-mono">{Math.floor(displayXP)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
