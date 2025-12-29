'use client';

import { motion } from 'framer-motion';
import { Lock, Unlock, CheckCircle, Map } from 'lucide-react';

interface StageMapProps {
    currentStage: number;
    onSelectStage: (stage: number) => void;
    onClose: () => void;
}

const STAGES = [
    { id: 1, title: '진단 (Diagnosis)', desc: '사주와 CBT로 나를 알기' },
    { id: 2, title: '융합 (Fusion)', desc: '기질과 성격의 통합' },
    { id: 3, title: '치유 (Healing)', desc: '감정 파도 타기 (DBT)' },
    { id: 4, title: '행동 (Action)', desc: '가치 있는 삶 살기 (ACT)' },
    { id: 5, title: '유지 (Maintenance)', desc: '마음챙김과 현존 (MBCT)' },
    { id: 6, title: '확장 (Expansion)', desc: '재능의 사회적 기여' },
    { id: 7, title: '초월 (Transcendence)', desc: '관찰자로서의 자아' },
];

export default function StageMap({ currentStage, onSelectStage, onClose }: StageMapProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex justify-start"
            onClick={onClose}
        >
            <motion.div
                className="w-[300px] h-full bg-gray-900 border-r border-white/10 p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
            >
                <div className="flex items-center gap-2 mb-8 text-primary-olive">
                    <Map className="w-6 h-6" />
                    <h2 className="text-xl font-serif font-bold">Growth Map</h2>
                </div>

                <div className="space-y-4 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-800 -z-10" />

                    {STAGES.map((stage) => {
                        const isUnlocked = stage.id <= currentStage;
                        const isCurrent = stage.id === currentStage;

                        return (
                            <button
                                key={stage.id}
                                onClick={() => {
                                    // Demo: Allow clicking any stage to unlock/test
                                    onSelectStage(stage.id);
                                    onClose();
                                }}
                                className={`w-full flex items-start gap-4 p-3 rounded-xl transition-all ${isCurrent ? 'bg-primary-olive/20 border border-primary-olive' : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 
                            ${isCurrent ? 'bg-primary-olive border-primary-olive text-white' :
                                        isUnlocked ? 'bg-gray-800 border-primary-olive text-primary-olive' : 'bg-gray-900 border-gray-700 text-gray-500'}
                        `}>
                                    {isCurrent ? <span className="font-bold">{stage.id}</span> :
                                        isUnlocked ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                                </div>

                                <div className="text-left">
                                    <h3 className={`font-bold ${isCurrent ? 'text-primary-olive' : isUnlocked ? 'text-gray-200' : 'text-gray-500'}`}>
                                        {stage.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">{stage.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}
