
import React from 'react';
import { NeuralProfile } from '@/utils/NeuralProfileCalculator';
import { getNeuralKey } from '@/data/neural_keys_db';

interface NeuralProfileCardProps {
    profile: NeuralProfile;
}

const NeuralProfileCard: React.FC<NeuralProfileCardProps> = ({ profile }) => {
    const [selectedKey, setSelectedKey] = React.useState<{ gate: number, term: string, fullData: any, label: string } | null>(null);

    const getKey = (gate: number) => {
        const data = getNeuralKey(gate);
        return {
            gate,
            term: data.neural_code, // Main term is Neural Code (Gift)
            fullData: data
        };
    };

    const lifeWork = getKey(profile.lifeWork);
    const evolution = getKey(profile.evolution);
    const radiance = getKey(profile.radiance);
    const purpose = getKey(profile.purpose);

    // Initial select
    React.useEffect(() => {
        setSelectedKey({ ...lifeWork, label: "Life's Work" });
    }, [profile]);

    const Circle = ({ data, label, position }: { data: any, label: string, position: string }) => (
        <button
            onClick={() => setSelectedKey({ ...data, label })}
            className={`absolute flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 
            ${selectedKey?.gate === data.gate ? 'border-white bg-emerald-900/60 scale-110 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'border-emerald-500 bg-black/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}
            backdrop-blur-sm ${position} z-10 transition-all duration-300 hover:scale-110 cursor-pointer group`}
        >
            <span className={`text-xs font-bold mb-1 tracking-wider uppercase transition-colors ${selectedKey?.gate === data.gate ? 'text-white' : 'text-emerald-400'}`}>{label}</span>
            <span className="text-3xl text-white font-extrabold mb-1 group-hover:text-primary-gold transition-colors">{data.gate}</span>
            <span className="text-[10px] text-gray-300 text-center px-2 leading-tight break-keep">{data.term}</span>
        </button>
    );

    return (
        <div className="w-full max-w-sm mx-auto my-6 p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden transition-all duration-500 animate-in fade-in zoom-in-95">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <h3 className="text-center text-emerald-400 font-bold mb-8 text-lg flex items-center justify-center gap-2">
                <span className="text-xl">🧬</span> Neural Code Architecture
            </h3>

            <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent -translate-y-1/2 animate-pulse"></div>
                <div className="absolute top-0 left-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent -translate-x-1/2 animate-pulse"></div>

                {/* Circles */}
                <Circle data={lifeWork} label="Life's Work" position="top-0 left-1/2 -translate-x-1/2" />
                <Circle data={radiance} label="Radiance" position="top-1/2 left-0 -translate-y-1/2" />
                <Circle data={evolution} label="Evolution" position="top-1/2 right-0 -translate-y-1/2" />
                <Circle data={purpose} label="Purpose" position="bottom-0 left-1/2 -translate-x-1/2" />

                {/* Center Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse z-20"></div>
            </div>

            {/* Detailed Panel (Interactive) */}
            {selectedKey && (
                <div className="mt-8 pt-6 border-t border-emerald-500/30 animate-in slide-in-from-bottom-5 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-emerald-400 font-bold uppercase tracking-widest">{selectedKey.label}</span>
                        <span className="text-2xl font-black text-white">Gate {selectedKey.gate}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-[10px] text-gray-500 mb-1">DARK</div>
                            <div className="text-xs text-gray-400 font-medium break-keep">{selectedKey.fullData.dark_code}</div>
                        </div>
                        <div className="p-2 bg-emerald-900/30 rounded-lg border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <div className="text-[10px] text-emerald-400 mb-1">NEURAL</div>
                            <div className="text-xs text-white font-bold break-keep">{selectedKey.fullData.neural_code}</div>
                        </div>
                        <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-[10px] text-purple-400 mb-1">META</div>
                            <div className="text-xs text-gray-300 font-medium break-keep">{selectedKey.fullData.meta_code}</div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed text-center italic bg-black/40 p-3 rounded-lg border border-gray-800">
                        "{selectedKey.fullData.description}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default NeuralProfileCard;
