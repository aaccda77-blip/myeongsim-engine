'use client';

import React from 'react';
import { useWatchData } from '@/services/health/WatchDataService';
import { Activity, Heart, Zap, Watch, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BioSyncDashboardProps {
    data?: any;
}

export default function BioSyncDashboard({ data }: BioSyncDashboardProps) {
    // If data is injected (from ChatInterface), use it primarily
    // Otherwise fallback to useWatchData (Live Hook)
    const liveData = useWatchData();

    // Merge or Select Data source
    const bpm = data?.bpm || liveData.bpm;
    const hrv = data?.hrv || liveData.hrv;
    const steps = data?.steps || liveData.steps;
    const stressLevel = data?.stressLevel || liveData.stressLevel;
    const status = data ? 'CONNECTED' : liveData.status;

    // Determine UI Colors based on Stress Level
    const getStatusColor = () => {
        switch (stressLevel) {
            case 'HIGH': return 'from-orange-500/20 to-red-500/20 border-orange-500/50 text-orange-200';
            case 'MODERATE': return 'from-yellow-400/20 to-orange-400/20 border-yellow-400/50 text-yellow-200';
            case 'LOW': return 'from-emerald-400/20 to-teal-400/20 border-emerald-400/50 text-emerald-200';
            default: return 'from-gray-800/50 to-gray-900/50 border-gray-700 text-gray-400';
        }
    };

    // Accent color for icons/text
    const getAccentColor = () => {
        switch (stressLevel) {
            case 'HIGH': return 'text-orange-400';
            case 'MODERATE': return 'text-yellow-400';
            case 'LOW': return 'text-emerald-400';
            default: return 'text-gray-400';
        }
    };

    const statusGradient = getStatusColor();
    const accentColor = getAccentColor();

    return (
        <div className="w-full max-w-md mx-auto mb-4 font-sans">
            <AnimatePresence mode='wait'>
                {status === 'SYNCING' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md shadow-lg"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                            <Watch className="w-5 h-5 text-blue-400 relative z-10" />
                        </div>
                        <span className="text-xs text-blue-200/80 font-mono tracking-widest animate-pulse">
                            뉴럴 링크 연결 중...
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative rounded-2xl border backdrop-blur-xl p-5 overflow-hidden transition-all duration-500 bg-gradient-to-br ${statusGradient} shadow-2xl`}
                    >
                        {/* [Living Background] Pulse Effect synced with BPM */}
                        <motion.div
                            animate={{ opacity: [0.05, 0.2, 0.05] }}
                            transition={{ duration: 60 / (bpm || 60), repeat: Infinity, ease: "easeInOut" }}
                            className={`absolute inset-0 bg-${stressLevel === 'HIGH' ? 'red' : stressLevel === 'MODERATE' ? 'orange' : 'teal'}-500/30 blur-2xl z-0`}
                        />

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <Activity className={`w-4 h-4 ${accentColor}`} />
                                <span className={`text-xs font-bold tracking-wider ${accentColor} drop-shadow-md`}>BIO-SYNC ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20 border border-white/5">
                                <div className={`w-1.5 h-1.5 rounded-full ${status === 'CONNECTED' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                                <span className="text-[10px] text-gray-400 font-medium">{status}</span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {/* Heart Rate Block (Major Animation) */}
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflown-hidden group">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        filter: ["drop-shadow(0 0 0px rgba(0,0,0,0))", "drop-shadow(0 0 15px rgba(255,100,100,0.6))", "drop-shadow(0 0 0px rgba(0,0,0,0))"]
                                    }}
                                    transition={{
                                        duration: 60 / (bpm || 60),
                                        repeat: Infinity,
                                        ease: "circOut", // Snappy beat
                                        repeatDelay: 60 / (bpm || 60) * 0.2
                                    }}
                                    className="mb-2 relative"
                                >
                                    <Heart className={`w-8 h-8 ${accentColor} fill-current opacity-90`} />
                                </motion.div>
                                <div className="text-3xl font-black text-white tracking-tighter flex items-end gap-1 leading-none">
                                    {bpm}
                                    <span className="text-[10px] font-normal text-gray-400 mb-1">BPM</span>
                                </div>
                                <div className="text-[9px] text-gray-500 mt-1">Real-time Rhythm</div>
                            </div>

                            {/* Stress/HRV Block */}
                            <div className="flex flex-col gap-2">
                                <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col justify-center flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap className="w-3 h-3 text-yellow-400" />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Stress Level</span>
                                    </div>
                                    <div className={`text-lg font-bold ${accentColor}`}>
                                        {stressLevel}
                                    </div>
                                </div>
                                <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col justify-center flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-3 h-3 text-purple-400" />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">HRV</span>
                                    </div>
                                    <div className="text-lg font-bold text-white">
                                        {hrv} <span className="text-[10px] text-gray-500 font-normal">ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Message */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 relative z-10">
                            <Watch className="w-3 h-3 text-gray-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                "당신의 심장이 <span className="text-white font-medium">{stressLevel === 'LOW' ? '평온하게' : '빠르게'}</span> 뛰고 있습니다.
                                {stressLevel === 'LOW' ? ' 지금의 리듬을 유지하세요.' : ' 잠시 눈을 감고 호흡을 고르세요.'}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
