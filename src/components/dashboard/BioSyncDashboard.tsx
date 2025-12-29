'use client';

import React from 'react';
import { useWatchData } from '@/services/health/WatchDataService';
import { Activity, Heart, Zap, Watch } from 'lucide-react';
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
            case 'HIGH': return 'text-orange-500 border-orange-500/30 bg-orange-500/10 shadow-orange-500/20';
            case 'MODERATE': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20';
            case 'LOW': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10 shadow-emerald-400/20';
            default: return 'text-gray-400 border-gray-600/30 bg-gray-800/50';
        }
    };

    const statusColor = getStatusColor();

    return (
        <div className="w-full max-w-md mx-auto mb-4">
            <AnimatePresence mode='wait'>
                {status === 'SYNCING' ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-900/80 border border-gray-800 backdrop-blur-sm"
                    >
                        <Watch className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span className="text-xs text-blue-300 font-mono tracking-wider">CONNECTING DEVICE...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-4 transition-colors duration-500 ${statusColor.split(' ')[2]} ${statusColor.split(' ')[1]}`}
                    >
                        {/* Header: Device Status */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${statusColor.split(' ')[2]}`}>
                                    <Activity className={`w-3 h-3 ${statusColor.split(' ')[0]}`} />
                                </div>
                                <span className={`text-xs font-bold tracking-wider ${statusColor.split(' ')[0]}`}>
                                    BIO-SYNC ACTIVE
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/20 border border-current/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-mono opacity-80">LIVE</span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* BPM Block */}
                            <div className="bg-black/20 rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden group">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 60 / bpm }}
                                    className="mb-1"
                                >
                                    <Heart className={`w-4 h-4 ${statusColor.split(' ')[0]}`} fill="currentColor" fillOpacity={0.2} />
                                </motion.div>
                                <span className="text-lg font-bold text-white leading-none">{bpm}</span>
                                <span className="text-[9px] text-white/50 font-mono">BPM</span>
                            </div>

                            {/* HRV Block (Stress) */}
                            <div className="bg-black/20 rounded-lg p-2 flex flex-col items-center justify-center">
                                <Zap className={`w-4 h-4 mb-1 ${stressLevel === 'HIGH' ? 'text-orange-400' : 'text-blue-400'}`} />
                                <span className="text-lg font-bold text-white leading-none">{hrv}</span>
                                <span className="text-[9px] text-white/50 font-mono">HRV (ms)</span>
                            </div>

                            {/* Status Text Block */}
                            <div className="bg-black/20 rounded-lg p-2 flex flex-col items-center justify-center text-center">
                                <span className={`text-[10px] font-bold ${statusColor.split(' ')[0]}`}>
                                    {stressLevel === 'LOW' ? 'FLOW' : stressLevel === 'MODERATE' ? 'ALERT' : 'STRESS'}
                                </span>
                                <span className="text-[8px] text-white/40 mt-1 leading-tight">Current State</span>
                            </div>
                        </div>

                        {/* Steps / Footer */}
                        <div className="mt-3 flex justify-between items-center text-[9px] text-white/30 font-mono border-t border-white/5 pt-2">
                            <span>STEPS: {steps}</span>
                            <span>SOURCE: WATCH_BRIDGE_V1</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
