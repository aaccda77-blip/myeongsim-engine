'use client';

import { motion } from 'framer-motion';
import { Brain, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface PsychProps {
    data: {
        shadowTitle: string;
        shadowDescription: string;
        cognitiveDistortions: string[];
    };
}

export default function PsychFlipCard({ data }: PsychProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleCheck = (index: number) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter((i) => i !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
        }
    };

    return (
        <section className="min-h-screen py-20 px-4 bg-black/30 flex flex-col items-center justify-center">
            <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-3xl font-bold text-white mb-16"
            >
                Part 2. 심리 거울 (Psychological Mirror)
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">

                {/* Left: Flip Card */}
                <div className="perspective-1000 h-[400px] w-full cursor-pointer group" onClick={handleFlip}>
                    <motion.div
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring' }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="w-full h-full relative"
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl flex flex-col items-center justify-center p-8 shadow-2xl">
                            <RefreshCw className="w-12 h-12 text-primary-gold mb-6 group-hover:rotate-180 transition-transform duration-700" />
                            <h3 className="text-2xl font-serif text-white">내면의 그림자</h3>
                            <p className="text-sm text-gray-500 mt-2">클릭하여 뒤집기</p>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 backface-hidden bg-white/5 border border-primary-gold/30 rounded-xl flex flex-col items-center justify-center p-8 text-center"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <h3 className="text-xl font-bold text-primary-gold mb-4">{data.shadowTitle}</h3>
                            <p className="text-gray-300 leading-relaxed">{data.shadowDescription}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Cognitive Distortion Checklist */}
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        인지 왜곡 체크리스트
                    </h3>
                    <div className="space-y-4">
                        {data.cognitiveDistortions.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleCheck(idx)}
                                className="flex items-center gap-4 p-4 rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer transition-colors"
                            >
                                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${checkedItems.includes(idx) ? 'bg-primary-gold border-primary-gold' : 'border-gray-600'}`}>
                                    {checkedItems.includes(idx) && <Check className="w-4 h-4 text-black" />}
                                </div>
                                <div>
                                    <p className={`transition-all ${checkedItems.includes(idx) ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                        {item}
                                    </p>
                                    {checkedItems.includes(idx) && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="text-xs text-primary-gold mt-1 font-mono"
                                        >
                                            ▶ 이를 객관적으로 바라보는 연습이 필요합니다.
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
