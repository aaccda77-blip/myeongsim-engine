'use client';

import { motion } from 'framer-motion';
import { Lock, Unlock, CheckCircle, Map, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StageMapProps {
    currentStage: number;
    onSelectStage: (stage: number) => void;
    onClose: () => void;
}

const STAGES = [
    { id: 1, title: '발견 (Discovery)', desc: '사주와 심리(CBT)로 나를 알아차리기' },
    { id: 2, title: '융합 (Fusion)', desc: '타고난 기질과 성격의 통합' },
    { id: 3, title: '치유 (Healing)', desc: '감정 파도 타기 (DBT/마음챙김)' },
    { id: 4, title: '행동 (Action)', desc: '가치 있는 삶을 위한 약속 (ACT)' },
    { id: 5, title: '유지 (Maintenance)', desc: '일상 속 명심 코칭 (Routine)' },
    { id: 6, title: '확장 (Expansion)', desc: '재능의 발현과 사회적 기여' },
    { id: 7, title: '초월 (Transcendence)', desc: '관찰자로서의 자아 완성' },
];

export default function StageMap({ currentStage, onSelectStage, onClose }: StageMapProps) {
    // [Deep Tech Logic] 진행률 계산 (연결선 높이)
    const [progressHeight, setProgressHeight] = useState(0);

    useEffect(() => {
        // (현재 스테이지 - 1) / (전체 - 1) * 100
        const percentage = ((currentStage - 1) / (STAGES.length - 1)) * 100;
        setProgressHeight(percentage);
    }, [currentStage]);

    return (
        <div className="fixed inset-0 z-[60] flex justify-start">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <motion.div
                className="relative w-[320px] h-full bg-deep-slate border-r border-white/10 shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-deep-slate z-20">
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-2 rounded-lg bg-primary-olive/20 text-primary-olive">
                            <Map className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-bold">Growth Map</h2>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Myeongsim Coaching</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-6 relative">

                    {/* Timeline Track (Background) */}
                    <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-white/5 z-0" />

                    {/* [Fix 1] Active Progress Line (Foreground) */}
                    {/* top-10 부터 시작하여, 각 아이템 간의 거리에 따라 높이 조절 */}
                    <motion.div
                        className="absolute left-[39px] top-10 w-0.5 bg-primary-olive z-0 shadow-[0_0_10px_#658c42]"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(progressHeight, 95)}%` }} // 100% 넘침 방지
                        transition={{ duration: 1, delay: 0.2 }}
                    />

                    <div className="space-y-6 relative z-10">
                        {STAGES.map((stage) => {
                            const isUnlocked = true; // [Demo] 모든 단계 잠금 해제 for Testing
                            const isCurrent = stage.id === currentStage;
                            const isCompleted = stage.id < currentStage;

                            return (
                                <motion.button
                                    key={stage.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: stage.id * 0.05 }}
                                    onClick={() => {
                                        onSelectStage(stage.id);
                                        onClose();
                                    }}
                                    className={`w-full flex items-start gap-4 text-left group relative`}
                                    disabled={!isUnlocked} // 실제 앱에서는 잠금
                                >
                                    {/* Icon Circle */}
                                    <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 relative z-10
                                ${isCurrent
                                            ? 'bg-deep-slate border-primary-olive text-primary-olive shadow-[0_0_15px_rgba(101,140,66,0.5)] scale-110'
                                            : isCompleted
                                                ? 'bg-primary-olive border-primary-olive text-white'
                                                : 'bg-deep-slate border-white/10 text-gray-600'
                                        }
                            `}>
                                        <span className={`text-xs font-bold ${isCurrent ? 'animate-pulse' : ''}`}>{stage.id}</span>
                                    </div>

                                    {/* Text Content */}
                                    <div className={`flex-1 transition-all duration-300 pt-0.5 ${isCurrent ? 'opacity-100 translate-x-1' : isUnlocked ? 'opacity-80 hover:opacity-100' : 'opacity-40 grayscale'}`}>
                                        <h3 className={`font-bold text-sm flex items-center gap-2 ${isCurrent ? 'text-primary-olive' : 'text-gray-200'}`}>
                                            {stage.title}
                                            {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-primary-olive animate-ping" />}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{stage.desc}</p>
                                    </div>

                                    {/* Chevron (Only for unlocked) */}
                                    {isUnlocked && (
                                        <ChevronRight className={`w-4 h-4 mt-2 transition-transform group-hover:translate-x-1 ${isCurrent ? 'text-primary-olive' : 'text-gray-600'}`} />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>


            </motion.div>
        </div>
    );
}
