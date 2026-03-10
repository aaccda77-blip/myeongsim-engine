
import React, { useEffect, useState } from 'react';
import { Activity, Zap, Cpu } from 'lucide-react';

interface ConsciousnessEngineProps {
    baseLevel: number;
    trend?: 'up' | 'down' | 'stable';
    size?: 'sm' | 'md' | 'lg';
}

export const ConsciousnessEngine: React.FC<ConsciousnessEngineProps> = ({
    baseLevel,
    trend = 'up',
    size = 'md'
}) => {
    const [displayLevel, setDisplayLevel] = useState(baseLevel);
    const [intensity, setIntensity] = useState(0);

    // [Engine Logic] Dynamic Fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            // Random fluctuation (-2 to +3)
            const fluctuation = Math.floor(Math.random() * 6) - 2;
            const flow = trend === 'up' ? 1 : trend === 'down' ? -1 : 0;

            setDisplayLevel(prev => {
                const next = baseLevel + fluctuation + flow;
                return next > 0 ? next : 0;
            });

            // Pulse intensity logic
            setIntensity(Math.random());
        }, 800 + Math.random() * 500); // Organic interval

        return () => clearInterval(interval);
    }, [baseLevel, trend]);

    // Size configuration
    const sizeConfig = {
        sm: { text: 'text-2xl', ring: 'w-16 h-16', orbit: 'w-20 h-20' },
        md: { text: 'text-4xl', ring: 'w-24 h-24', orbit: 'w-32 h-32' },
        lg: { text: 'text-6xl', ring: 'w-32 h-32', orbit: 'w-48 h-48' }
    };
    const s = sizeConfig[size];

    return (
        <div className="relative flex items-center justify-center py-6 group cursor-pointer" title="Quantum Consciousness Engine">

            {/* [Layer 1] Back Glow (Ambient) */}
            <div className={`absolute ${s.orbit} bg-primary-gold/5 rounded-full blur-xl animate-pulse`}></div>

            {/* [Layer 2] Orbital Ring (Rotating) */}
            <div className={`absolute ${s.orbit} rounded-full border border-primary-gold/20 border-t-primary-gold/80 animate-spin-slow shadow-[0_0_15px_rgba(212,175,55,0.1)]`}></div>

            {/* [Layer 3] Inner Core Ring (Reverse Rotate) */}
            <div className={`absolute ${s.ring} rounded-full border border-dashed border-primary-gold/40 animate-reverse-spin`}></div>

            {/* [Layer 4] Engine HUD Text */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-[10px] text-primary-gold/60 uppercase tracking-widest font-mono mb-1">
                    Neural Sync
                </span>

                <div className={`font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-primary-gold to-orange-400 ${s.text} tabular-nums tracking-tighter drop-shadow-lg`}>
                    {displayLevel}
                </div>

                <div className="flex items-center gap-1 mt-1">
                    <Activity className={`w-3 h-3 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {trend === 'up' ? 'ASCENDING' : trend === 'down' ? 'UNSTABLE' : 'STABLE'}
                    </span>
                    <span className="text-[9px] text-gray-600 ml-1 font-mono">
                        {(intensity * 100).toFixed(0)}% LOAD
                    </span>
                </div>
            </div>

            {/* [Layer 5] Arc Reactor Flash */}
            <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-75 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
};
