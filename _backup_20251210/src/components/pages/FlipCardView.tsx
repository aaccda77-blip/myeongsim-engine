'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function FlipCardView() {
    const { reportData } = useReportStore();
    const [isFlipped, setIsFlipped] = useState(false);

    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col pt-8">
            <motion.div className="mb-8">
                <span className="text-primary-gold text-xs font-bold tracking-widest uppercase">Page 06</span>
                <h2 className="text-2xl font-serif text-white mt-2">내면의 그림자</h2>
                <p className="text-gray-400 text-sm mt-2">무의식 속에 숨겨진 당신의 불안을 마주하세요.</p>
            </motion.div>

            <div className="flex-1 flex items-center justify-center perspective-1000 py-4">
                <motion.div
                    className="w-full max-w-[280px] aspect-[2/3] relative cursor-pointer group"
                    onClick={() => setIsFlipped(!isFlipped)}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-primary-olive/30 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl">
                        <div className="w-full h-full border border-primary-olive/10 rounded-xl flex flex-col items-center justify-center">
                            <RefreshCw className="w-12 h-12 text-primary-olive mb-6 group-hover:rotate-180 transition-transform duration-700" />
                            <h3 className="text-xl font-serif text-white uppercase tracking-widest">The Shadow</h3>
                            <p className="text-xs text-gray-500 mt-4">Tap to Reveal</p>
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden bg-primary-olive/10 backdrop-blur-md border border-primary-olive rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-[0_0_30px_rgba(101,140,66,0.2)]"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <h3 className="text-lg font-bold text-primary-olive mb-4 underline decoration-1 underline-offset-4">
                            {reportData.psychology.shadowTitle}
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed mb-6">
                            {reportData.psychology.shadowDescription}
                        </p>
                        <div className="w-full h-[1px] bg-primary-olive/30 mb-4" />
                        <ul className="text-xs text-left text-gray-400 space-y-2 w-full pl-2">
                            {reportData.psychology.cognitiveDistortions.slice(0, 2).map((d, i) => (
                                <li key={i}>• {d}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
