import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Brain, Cpu, Wifi } from 'lucide-react';

interface MindSyncStatusBarProps {
    level: number;
    xp: number; // 0-100
    stateLabel: string; // e.g., "의식 각성 (AWAKE)"
    isLevelUp?: boolean;
    actionButtons?: React.ReactNode;
    isBioSynced?: boolean;
    bioSyncStatusText?: string;
    onOpenBioModal?: () => void;
}

// [UX] Premium Status Label - 고급스러운 인터렉티브 라벨
const PremiumStatusLabel = ({ text }: { text: string }) => {
    return (
        <motion.span
            className="relative inline-flex items-center gap-1.5 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {/* 메인 텍스트 - 부드러운 그라데이션 */}
            <motion.span
                className="relative z-10 font-bold tracking-wide bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_100%]"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {text}
            </motion.span>

            {/* 호버 시 부드러운 언더라인 효과 */}
            <motion.span
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* 부드러운 글로우 오버레이 */}
            <motion.span
                className="absolute inset-0 -z-10 rounded-md bg-emerald-500/0 blur-md"
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                transition={{ duration: 0.3 }}
            />
        </motion.span>
    );
};

export const MindSyncStatusBar: React.FC<MindSyncStatusBarProps> = ({
    level,
    xp,
    stateLabel,
    isLevelUp = false,
    actionButtons,
    isBioSynced = false,
    bioSyncStatusText = '생체 데이터 미연동',
    onOpenBioModal,
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

    const nextLevelXP = 100 - Math.floor(displayXP);

    return (
        <div className="w-full bg-[#0a0f18]/95 backdrop-blur-md border-b border-white/10 relative overflow-hidden shadow-xl z-50">
            {/* [Living Background] Digital Grid Scanning */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="px-3 sm:px-4 py-2 flex items-center justify-between relative z-10 gap-2">

                {/* Left: Level Badge & Neural Status */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
                    <div className="relative group cursor-pointer" onClick={onOpenBioModal}>
                        {/* Level Ring */}
                        <motion.div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-[2px] backdrop-blur-md relative z-10
                            ${isLevelUp ? 'border-primary-gold bg-primary-gold/10' : 'border-cyan-500/30 bg-white/5'}`}
                            animate={isLevelUp ? {
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                                borderColor: ['#DAA520', '#FFF', '#DAA520']
                            } : {
                                borderColor: ['rgba(34,211,238,0.2)', 'rgba(34,211,238,0.5)', 'rgba(34,211,238,0.2)']
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <span className={`font-black text-xs ${isLevelUp ? 'text-primary-gold' : 'text-white'}`}>
                                Lv.<span className="text-sm font-mono">{level}</span>
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
                                    <div className="w-16 h-16 rounded-full bg-primary-gold/40 blur-xl" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Text Info & Bio Sync Status */}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                            {isLevelUp ? <Zap className="w-3 h-3 text-yellow-400 animate-bounce shrink-0" /> : <Brain className="w-3 h-3 text-cyan-400 shrink-0" />}
                            <span className="text-xs font-bold tracking-wider truncate">
                                <PremiumStatusLabel text={stateLabel} />
                            </span>
                        </div>

                        {/* [NEW] Bio Sync Status Pill (Interactive) */}
                        <div className="flex items-center gap-1.5 mt-0.5" onClick={onOpenBioModal}>
                            {isBioSynced ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full cursor-pointer hover:bg-emerald-900/80 transition-all truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                                    <span>🟢 {bioSyncStatusText}</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-full cursor-pointer hover:bg-amber-900/90 transition-all animate-pulse truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    <span>🔴 생체데이터 미연동 [클릭하여 연동]</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Sync Status & Progress */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
                    <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <Cpu className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-bold text-gray-300 font-mono">
                                {level >= 10 ? '✨ 최고 메타 관찰자 레벨' : `다음 Lv.${level + 1}까지 ${nextLevelXP}%`}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-16 sm:w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden relative border border-white/10">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xp}%` }}
                                />
                            </div>
                            <span className="text-[9px] text-cyan-400 font-mono font-bold">{Math.floor(displayXP)}%</span>
                        </div>
                    </div>

                    {/* Action Buttons Slot */}
                    {actionButtons && (
                        <div className="flex items-center gap-1">
                            {actionButtons}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
