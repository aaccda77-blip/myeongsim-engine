'use client';

import { motion } from 'framer-motion';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

interface SajuRadarProps {
    data: {
        wood: number;
        fire: number;
        earth: number;
        metal: number;
        water: number;
    };
    keywords: string[];
}

export default function SajuRadarChart({ data, keywords }: SajuRadarProps) {
    const chartData = [
        { subject: '목(Wood)', A: data.wood, fullMark: 100 },
        { subject: '화(Fire)', A: data.fire, fullMark: 100 },
        { subject: '토(Earth)', A: data.earth, fullMark: 100 },
        { subject: '금(Metal)', A: data.metal, fullMark: 100 },
        { subject: '수(Water)', A: data.water, fullMark: 100 },
    ];

    return (
        <section id="part1-energy" className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center w-full max-w-4xl"
            >
                <h2 className="text-3xl font-bold text-white mb-2">Part 1. 나의 에너지 (Energy)</h2>
                <p className="text-gray-400 mb-12">당신의 오행(Five Elements) 밸런스를 분석합니다.</p>

                {/* Radar Chart Container */}
                <div className="h-[400px] w-full flex justify-center mb-8 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#4B5563" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#D4AF37', fontSize: 14 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="none" />
                            <Radar
                                name="My Energy"
                                dataKey="A"
                                stroke="#D4AF37"
                                strokeWidth={3}
                                fill="#D4AF37"
                                fillOpacity={0.4}
                                isAnimationActive={true}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap justify-center gap-4">
                    {keywords.map((keyword, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className="px-6 py-2 rounded-full border border-gray-600 text-soft-gold bg-deep-indigo/50 backdrop-blur-sm"
                        >
                            {keyword}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
