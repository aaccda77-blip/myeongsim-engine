'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun } from 'lucide-react';

export default function TimelineView() {
    const { reportData } = useReportStore();

    if (!reportData) return null;

    const WeatherIcon = ({ type }: { type: 'sun' | 'cloud' | 'rain' }) => {
        switch (type) {
            case 'sun': return <Sun className="w-8 h-8 text-yellow-500" />;
            case 'cloud': return <Cloud className="w-8 h-8 text-gray-400" />;
            case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col pt-8">
            <motion.div className="mb-8">
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">10. Flow</span>
                <h2 className="text-2xl font-serif text-white mt-2">2025년 월별 흐름</h2>
                <p className="text-gray-400 text-sm mt-2">당신의 계절이 어떻게 흘러가는지 확인하세요.</p>
            </motion.div>

            <div className="flex-1 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-8 flex items-center">
                <div className="flex gap-6">
                    {reportData.timeline.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`min-w-[260px] p-6 rounded-2xl border flex flex-col justify-between h-[320px] relative ${item.weather === 'sun'
                                ? 'bg-gradient-to-br from-deep-slate to-gray-900 border-primary-olive shadow-[0_0_20px_rgba(101,140,66,0.2)]'
                                : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <div className="text-4xl font-bold text-gray-500/50">{item.month}월</div>

                            <div className="flex flex-col items-center gap-4 my-4">
                                <WeatherIcon type={item.weather} />
                                <span className="text-sm font-medium text-gray-300">
                                    {item.weather === 'sun' ? '맑음' : item.weather === 'cloud' ? '구름 조금' : '비'}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm text-center leading-relaxed border-t border-dashed border-gray-700 pt-4">
                                &quot;{item.description}&quot;
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
