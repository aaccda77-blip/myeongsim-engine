import React from 'react';

interface InterruptGaugeProps {
    gapLevel: number;
    matchingScore: number;
    isActive?: boolean;
    compact?: boolean; // [Feature] Compact Mode for Scroll
}

export default function InterruptGauge({ gapLevel, matchingScore, isActive = true, compact = false }: InterruptGaugeProps) {
    const codeLevel = isActive ? Math.max(1, Math.min(9, Math.floor((100 - gapLevel) / 10))) : 0;

    return (
        <div
            className={`w-full flex items-center justify-center relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg z-10 
            transition-all duration-500 ease-in-out
            ${!isActive ? 'grayscale opacity-70' : ''}
            ${compact ? 'h-12 py-1 gap-4' : 'h-32 p-2 gap-0'}
            `}
        >

            {/* Compact Mode: Horizontal Layout */}
            {compact ? (
                <div className="flex items-center justify-between w-full px-6 max-w-md animate-fade-in">
                    {/* Left: Level & Status */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-orange-500/50 animate-spin-slow" />
                            <span className="text-white font-bold text-sm">Lv.{codeLevel}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold ${gapLevel > 30 ? 'text-orange-400' : 'text-cyan-400'}`}>
                                {gapLevel > 30 ? "⚠️ 에너지 불균형" : "✨ 최적화 상태"}
                            </span>
                        </div>
                    </div>

                    {/* Right: Gap Bar */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 uppercase">Sync</span>
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-cyan-400 transition-all duration-700"
                                style={{ width: `${matchingScore}%` }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Original Expanded Version */}
                    <div className="relative w-24 h-24 flex items-center justify-center">

                        {/* Innate Circle */}
                        <div className="absolute w-20 h-20 border-2 border-dashed border-gray-600 rounded-full opacity-30 animate-spin-slow" />

                        {/* Orange Bar */}
                        <div
                            className="absolute rounded-full border-[4px] border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                            style={{
                                width: `${80 + (gapLevel * 0.5)}px`,
                                height: `${80 + (gapLevel * 0.5)}px`,
                                opacity: 0.8 + (gapLevel / 200),
                                transform: `rotate(${gapLevel * 3.6}deg)`
                            }}
                        />

                        {/* Acquired Gauge */}
                        <div
                            className="absolute rounded-full border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-1000"
                            style={{
                                width: `${20 + (matchingScore * 0.6)}px`,
                                height: `${20 + (matchingScore * 0.6)}px`,
                                opacity: 0.5
                            }}
                        ></div>

                        {/* Level Number */}
                        <div className="absolute z-20 text-center">
                            <div className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500">
                                <span className="text-orange-400 text-xs align-top">Lv.</span>{codeLevel}
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className="ml-4 flex flex-col justify-center">
                        <div className="text-xs uppercase tracking-widest text-gray-400">에너지 규율</div>
                        <div className={`text-sm font-bold ${gapLevel > 30 ? 'text-orange-400' : 'text-cyan-400'} animate-pulse`}>
                            {gapLevel > 30 ? "⚠️ 에너지 불균형" : "✨ 최적화 상태"}
                        </div>
                        <div className="text-[10px] text-slate-500">본연 일치율: {matchingScore}%</div>
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
