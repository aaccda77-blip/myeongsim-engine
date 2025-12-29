'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import { useRef } from 'react';

interface TimelineProps {
    timeline: {
        year: number;
        weather: 'sun' | 'cloud' | 'rain';
        description: string;
    }[];
}

const WeatherIcon = ({ type }: { type: 'sun' | 'cloud' | 'rain' }) => {
    switch (type) {
        case 'sun': return <Sun className="w-8 h-8 text-yellow-500" />;
        case 'cloud': return <Cloud className="w-8 h-8 text-gray-400" />;
        case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
        default: return null;
    }
};

export default function FateTimeline({ timeline }: TimelineProps) {
    const scrollRef = useRef(null);

    return (
        <section className="py-24 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Part 3. 운의 흐름 (Flow of Fate)</h2>

                <div ref={scrollRef} className="flex overflow-x-auto pb-8 gap-6 snap-x hide-scrollbar">
                    {timeline.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className={`min-w-[300px] md:min-w-[350px] p-8 rounded-2xl border snap-center flex flex-col items-center text-center relative ${item.year === 2025 // Assuming 2025 is 'current' for demo
                                    ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/20 border-primary-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                                    : 'bg-black/40 border-gray-800'
                                }`}
                        >
                            {item.year === 2025 && (
                                <div className="absolute top-4 right-4 text-xs font-bold text-primary-gold border border-primary-gold px-2 py-1 rounded">
                                    CURRENT
                                </div>
                            )}

                            <div className="text-5xl font-bold text-gray-700 mb-6">{item.year}</div>
                            <div className="mb-6 bg-white/5 p-4 rounded-full">
                                <WeatherIcon type={item.weather} />
                            </div>
                            <p className="text-lg text-gray-200">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
