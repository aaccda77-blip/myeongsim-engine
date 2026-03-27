import React, { useState, useEffect } from 'react';
import { NeuralProfile } from '@/utils/NeuralProfileCalculator';
import { getNeuralKey } from '@/data/NeuralGateDb';

interface NeuralProfileCardProps {
    profile: NeuralProfile;
}

const NeuralProfileCard: React.FC<NeuralProfileCardProps> = ({ profile }) => {
    const [selectedKey, setSelectedKey] = useState<{ gate: number, term: string, fullData: any, label: string, category: string, icon: string } | null>(null);

    const getKey = (gateVal: number) => {
        const gateId = Math.floor(gateVal); // Floor 53.1 -> 53
        const data = getNeuralKey(gateId);
        return {
            gate: gateVal, // Keep 53.1 for display
            term: data.neural_code,
            fullData: data
        };
    };

    const coreNode = { ...getKey(profile.lifeWork), label: "핵심 정체성 망", category: "Core Node", icon: "🧠" };
    const stressNode = { ...getKey(profile.evolution), label: "스트레스 트리거", category: "Growth Node", icon: "⚡" };
    const energyNode = { ...getKey(profile.radiance), label: "자율신경 회복소", category: "Energy Node", icon: "🔋" };
    const metaNode = { ...getKey(profile.purpose), label: "메타-인지 목표", category: "Meta Node", icon: "🌌" };

    const nodes = [coreNode, stressNode, energyNode, metaNode];

    // Initial select
    useEffect(() => {
        setSelectedKey(coreNode);
    }, [profile]);

    return (
        <div className="w-full max-w-sm md:max-w-md mx-auto my-6 bg-[#0B0F19] rounded-[2rem] border border-blue-900/60 shadow-[0_0_50px_rgba(30,58,138,0.3)] relative overflow-hidden transition-all duration-500 font-sans tracking-tight">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.06)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-blue-400 font-black text-lg md:text-xl flex items-center gap-2">
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">🧬</span> 뉴럴 신경망 대시보드
                    </h3>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-mono text-blue-500/70 uppercase tracking-widest leading-tight">System Status</span>
                        <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/50 flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            v2.0 ONLINE
                        </span>
                    </div>
                </div>

                {/* 2x2 Grid Layout (Dashboard Style) */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {nodes.map((node, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedKey(node)}
                            className={`p-4 rounded-3xl flex flex-col items-start justify-between min-h-[110px] transition-all duration-300 relative overflow-hidden group 
                            ${selectedKey?.gate === node.gate 
                                ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3),inset_0_0_15px_rgba(59,130,246,0.1)] scale-[1.02]' 
                                : 'bg-gray-900/40 border border-gray-800 hover:border-blue-700/50 hover:bg-gray-800/60'}`}
                        >
                            <div className="flex w-full justify-between items-start mb-2">
                                <span className={`text-xl opacity-90 transition-transform duration-300 ${selectedKey?.gate === node.gate ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'grayscale'}`}>
                                    {node.icon}
                                </span>
                                <span className={`text-xl font-black tracking-tighter transition-colors ${selectedKey?.gate === node.gate ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                    {node.gate}
                                </span>
                            </div>
                            <div className="text-left">
                                <div className={`text-[9px] font-mono mb-1 tracking-widest uppercase transition-colors ${selectedKey?.gate === node.gate ? 'text-blue-300' : 'text-gray-500'}`}>
                                    {node.category}
                                </div>
                                <div className={`text-xs md:text-sm font-bold break-keep transition-colors ${selectedKey?.gate === node.gate ? 'text-blue-50' : 'text-gray-400'}`}>
                                    {node.label}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detailed Diagnostic Panel */}
                {selectedKey && (
                    <div className="bg-black/60 rounded-3xl p-5 md:p-6 border border-gray-800 relative shadow-inner animate-in slide-in-from-bottom-6 duration-500 backdrop-blur-md">
                        {/* Selected Indicator Bar */}
                        <div className="absolute top-0 left-6 w-16 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        
                        <div className="flex items-end justify-between mb-6 mt-3">
                            <div>
                                <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">{selectedKey.category}</div>
                                <div className="text-lg md:text-xl text-white font-black">{selectedKey.label} 
                                    <span className="inline-block text-blue-400 font-mono text-sm ml-2 bg-blue-950/40 px-2 rounded-md border border-blue-900/50">
                                        Code {selectedKey.gate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3 Steps of Evolution (Tech Style) */}
                        <div className="space-y-3 mb-6">
                            <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-4 flex gap-4 transition-all hover:bg-red-950/20">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mb-1 shadow-[0_0_5px_rgba(239,68,68,1)]"></div>
                                    <div className="w-0.5 h-full bg-red-900/50 rounded-full"></div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-1">🔥 다크 코드 (System Bug)</div>
                                    <div className="text-xs md:text-sm text-gray-300 font-medium">{selectedKey.fullData.dark_code}</div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-900/10 border border-blue-500/40 rounded-2xl p-4 flex gap-4 shadow-[0_0_20px_rgba(59,130,246,0.05)] transition-all hover:bg-blue-900/20">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mb-1 shadow-[0_0_10px_rgba(96,165,250,1)]"></div>
                                    <div className="w-0.5 h-full bg-blue-500/50 rounded-full"></div>
                                </div>
                                <div className="w-full">
                                    <div className="text-[10px] text-blue-300 font-bold tracking-widest uppercase mb-1">⚡ 뉴럴 코드 (Algorithm)</div>
                                    <div className="text-sm md:text-base text-white font-black tracking-wide">{selectedKey.fullData.neural_code}</div>
                                </div>
                            </div>
                            
                            <div className="bg-indigo-900/10 border border-indigo-900/40 rounded-2xl p-4 flex gap-4 transition-all hover:bg-indigo-900/20">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 mb-1 shadow-[0_0_5px_rgba(129,140,248,1)]"></div>
                                    <div className="w-0.5 h-2 bg-indigo-900/50 rounded-full"></div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mb-1">🌌 메타 코드 (Transcendence)</div>
                                    <div className="text-xs md:text-sm text-gray-300 font-medium">{selectedKey.fullData.meta_code}</div>
                                </div>
                            </div>
                        </div>

                        {/* Console Description */}
                        <div className="bg-[#050810] p-4 md:p-5 rounded-2xl border border-blue-900/30 font-mono">
                            <div className="flex gap-2 items-center mb-2">
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                <span className="text-[9px] text-gray-600 ml-2">SYSTEM.LOG</span>
                            </div>
                            <p className="text-xs md:text-sm text-blue-100/70 leading-relaxed break-keep">
                                <span className="text-blue-500 mr-2">❝</span>
                                {selectedKey.fullData.description}
                                <span className="text-blue-500 ml-2">❞</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NeuralProfileCard;
