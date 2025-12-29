'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';

export default function RelationBubbleView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">07. Relations</span>
                <h2 className="text-2xl font-serif text-white mt-2">나의 관계 별자리</h2>
                <p className="text-sm text-gray-400 mt-2">나를 성장시키는 인연과 주의해야 할 인연.</p>
            </motion.div>

            <div className="flex-1 relative flex items-center justify-center">
                {/* Central Self */}
                <div className="absolute w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center z-10 backdrop-blur-md">
                    <span className="text-white font-bold font-serif">Me</span>
                </div>

                {/* Helpful Relations */}
                <div className="absolute w-full h-full">
                    {reportData.relations.helpful.map((rel, idx) => (
                        <motion.div
                            key={`help-${idx}`}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: 1,
                                x: idx === 0 ? -80 : 80,
                                y: idx === 0 ? -100 : -100
                            }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-primary-olive/20 border border-primary-olive/50 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_20px_rgba(101,140,66,0.3)]"
                        >
                            <span className="text-[10px] text-primary-olive font-bold uppercase mb-1">Helpful</span>
                            <span className="text-xs text-white font-bold">{rel}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Harmful Relations */}
                <div className="absolute w-full h-full">
                    {reportData.relations.harmful.map((rel, idx) => (
                        <motion.div
                            key={`harm-${idx}`}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: 1,
                                x: idx === 0 ? -80 : 80,
                                y: idx === 0 ? 100 : 100
                            }}
                            transition={{ delay: 0.8, type: 'spring' }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-red-500/10 border border-red-500/30 flex flex-col items-center justify-center text-center p-2"
                        >
                            <span className="text-[10px] text-red-400 font-bold uppercase mb-1">Caution</span>
                            <span className="text-xs text-gray-300 font-medium">{rel}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
