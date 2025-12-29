import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Layers, AlertCircle } from 'lucide-react';

interface BioSyncDashboardProps {
    data: {
        nature: {
            label: string;
            score: number;
            code_name: string;
        };
        nurture: {
            label: string;
            score: number;
            code_level: string;
            gap_alert: boolean;
        };
    };
}

export default function BioSyncDashboard({ data }: BioSyncDashboardProps) {
    if (!data || !data.nature || !data.nurture) return null; // [Safety] Prevent Crash on incomplete data

    const { nature, nurture } = data;
    const gap = Math.abs(nature.score - nurture.score);
    const isCritical = gap >= 30;

    return (
        <div className="w-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-gray-300 tracking-wider">BIOSYNC DASHBOARD</span>
                </div>
                {nurture.gap_alert && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded-full animate-pulse">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] text-red-400 font-bold">GAP WARNING</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex items-center justify-between gap-4 relative">
                {/* Connector Line */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-0.5 bg-gradient-to-r from-amber-500/30 to-cyan-500/30 -z-0" />

                {/* Left: Nature Core */}
                <div className="flex-1 flex flex-col items-center z-10">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 bg-amber-500/10 flex items-center justify-center mb-3 relative group">
                        <Zap className="w-6 h-6 text-amber-500" />
                        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-20" />
                    </div>
                    <span className="text-xs text-amber-500 font-bold mb-1">{nature.label}</span>
                    <span className="text-[10px] text-gray-400 text-center">{nature.code_name}</span>
                    <span className="text-xl font-bold text-white mt-1">{nature.score}</span>
                </div>

                {/* Center: Gap Visualizer */}
                <div className="flex flex-col items-center">
                    <div className={`px-3 py-1 rounded-full border ${isCritical ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                        <span className="text-xs font-bold">GAP {gap}</span>
                    </div>
                </div>

                {/* Right: Nurture Wave */}
                <div className="flex-1 flex flex-col items-center z-10">
                    <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center mb-3 relative">
                        <Layers className="w-6 h-6 text-cyan-500" />
                        {/* Wave Animation Mockup */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-cyan-500/20 rounded-b-full overflow-hidden">
                            <div className="w-full h-full bg-cyan-500/30 animate-pulse" />
                        </div>
                    </div>
                    <span className="text-xs text-cyan-500 font-bold mb-1">{nurture.label}</span>
                    <span className="text-[10px] text-gray-400 text-center">{nurture.code_level}</span>
                    <span className="text-xl font-bold text-white mt-1">{nurture.score}</span>
                </div>
            </div>

            {/* Footer Insight */}
            <div className="px-4 py-2 bg-black/20 text-center border-t border-gray-800">
                <p className="text-[10px] text-gray-500">
                    {isCritical
                        ? "⚠️ 설계된 본성과 현재 상태의 괴리가 큽니다. '다크 코드'가 활성화되었습니다."
                        : "✅ 본성과 현실이 조화를 이루고 있습니다. '뉴럴 코드'가 작동 중입니다."}
                </p>
            </div>
        </div>
    );
}
