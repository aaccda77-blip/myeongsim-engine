import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Briefcase, Sparkles, Target, Zap } from 'lucide-react';

interface TalentReportCardProps {
    data: {
        coreStrength: {
            title: string;
            description: string;
        };
        keywords: string[];
        jobAptitude: string[];
        elements: {
            wood: number;
            fire: number;
            earth: number;
            metal: number;
            water: number;
        };
    };
}

export default function TalentReportCard({ data }: TalentReportCardProps) {
    const {
        coreStrength = { title: '분석 중...', description: '데이터를 불러오는 중입니다.' },
        keywords = [],
        jobAptitude = [],
        elements = { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 }
    } = data || {};

    // Normalize for bar chart (Check for valid elements object)
    const validElements = elements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
    const maxVal = Math.max(...Object.values(validElements), 1); // Avoid 0 division
    const getPercent = (val: number) => Math.min(100, (val / maxVal) * 100);

    return (
        <div className="w-full max-w-sm mx-auto bg-gray-900/60 border border-amber-500/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg my-4">
            {/* Header: Core Archetype */}
            <div className="bg-gradient-to-r from-amber-900/40 to-gray-900/40 p-5 border-b border-amber-500/20 relative">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Trophy size={64} className="text-amber-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">Core Talent</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{coreStrength.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                    {coreStrength.description}
                </p>
            </div>

            <div className="p-5 space-y-6">
                {/* Element Balance Bars */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <Zap size={12} /> 에너지 밸런스 (Energy OS)
                    </h4>
                    <div className="space-y-2">
                        {[
                            { label: '목(Wood)', val: elements.wood, color: 'bg-green-500' },
                            { label: '화(Fire)', val: elements.fire, color: 'bg-red-500' },
                            { label: '토(Earth)', val: elements.earth, color: 'bg-yellow-600' },
                            { label: '금(Metal)', val: elements.metal, color: 'bg-gray-400' },
                            { label: '수(Water)', val: elements.water, color: 'bg-blue-500' },
                        ].map((el) => (
                            <div key={el.label} className="flex items-center gap-3">
                                <span className="text-[10px] text-gray-500 w-12">{el.label}</span>
                                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getPercent(el.val)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full ${el.color} shadow-[0_0_10px_currentColor]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keywords Grid */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <Sparkles size={12} /> 강점 키워드
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-amber-200">
                                #{kw}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Job Aptitude */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <Briefcase size={12} /> 추천 직무 분야
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {jobAptitude.map((job, i) => (
                            <div key={i} className="bg-gray-800/50 p-2 rounded text-center text-xs text-gray-300 border border-gray-700/50">
                                {job}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
