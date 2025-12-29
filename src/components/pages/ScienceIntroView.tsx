'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export default function ScienceIntroView() {
    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">02. Introduction</span>
                <h2 className="text-2xl font-serif text-white mt-2 leading-tight">
                    운명학과 심리학의<br />만남
                </h2>
            </motion.div>

            <div className="flex-1 flex flex-col gap-6 justify-center">
                {/* Card 1: Saju */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-secondary-slate/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-24 h-24 text-primary-olive" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary-olive/20 flex items-center justify-center mb-4 text-primary-olive">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-serif text-lg mb-2">명리학 (Saju)</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        나를 둘러싼 우주의 기운과 타고난 에너지의 패턴을 분석합니다. 이는 당신이 가진 &apos;잠재력의 지도&apos;입니다.
                    </p>
                </motion.div>

                {/* Card 2: Psychology */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-secondary-slate/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Brain className="w-24 h-24 text-blue-400" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                        <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-serif text-lg mb-2">심리학 (Psychology)</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        현재의 마음 상태와 행동 패턴을 분석합니다. 이는 당신이 지도를 보며 걸어가는 &apos;발걸음&apos;입니다.
                    </p>
                </motion.div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-gray-500 mt-8"
            >
                이 리포트는 두 학문의 통찰을 통해<br />가장 나답게 사는 법을 제안합니다.
            </motion.p>
        </div>
    );
}
