'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { User, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

export default function RelationBubbleView() {
    const { reportData } = useReportStore();

    // Data Guard
    if (!reportData || !reportData.relations) return null;

    const { helpful = [], harmful = [] } = reportData.relations;

    // [Deep Tech Logic] 동적 위치 계산 함수
    // count: 아이템 개수, radius: 거리, startAngle: 시작 각도, arc: 배치할 범위 각도
    const calculatePositions = (count: number, radius: number, startAngle: number, arc: number) => {
        if (count === 0) return [];
        const step = count === 1 ? 0 : arc / (count - 1); // 1개면 중앙, 여러개면 부채꼴

        return Array.from({ length: count }, (_, i) => {
            // 1개일 때는 부채꼴의 중앙에 배치
            const angle = count === 1
                ? startAngle + arc / 2
                : startAngle + (step * i);

            const radian = (angle * Math.PI) / 180;
            return {
                x: Math.cos(radian) * radius,
                y: Math.sin(radian) * radius,
                delay: i * 0.1
            };
        });
    };

    // 위치 데이터 메모이제이션 (상단 180도: 귀인, 하단 180도: 주의)
    const nodePositions = useMemo(() => {
        const helpfulPos = calculatePositions(helpful.length, 110, 210, 120); // 상단 아치 (210도 ~ 330도)
        const harmfulPos = calculatePositions(harmful.length, 110, 30, 120);  // 하단 아치 (30도 ~ 150도)
        return { helpfulPos, harmfulPos };
    }, [helpful.length, harmful.length]);

    return (
        <div className="h-full flex flex-col pt-6 pb-8 px-2 overflow-hidden">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-center shrink-0"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                    07. Relationship Constellation
                </span>
                <h2 className="text-2xl font-serif text-white mt-4">나의 관계 별자리</h2>
                <p className="text-sm text-gray-400 mt-2">당신을 둘러싼 인연의 에너지를 시각화합니다.</p>
            </motion.div>

            {/* Network Graph Container */}
            <div className="flex-1 relative flex items-center justify-center w-full min-h-[360px]">

                {/* [Deep Tech Visual] Background Grids */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
                <div className="absolute w-[220px] h-[220px] rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-white/5 animate-[spin_40s_linear_infinite_reverse]" />

                {/* 1. Connecting Lines (SVG Layer) - Z-Index: 0 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    <g transform="translate(50%, 50%)"> {/* 중심점을 화면 중앙으로 */}
                        {/* Helpful Lines */}
                        {nodePositions.helpfulPos.map((pos, i) => (
                            <motion.line
                                key={`line-help-${i}`}
                                x1={0} y1={0} x2={pos.x} y2={pos.y}
                                stroke="#658c42" // Olive
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                transition={{ duration: 1, delay: 0.5 + pos.delay }}
                            />
                        ))}
                        {/* Harmful Lines */}
                        {nodePositions.harmfulPos.map((pos, i) => (
                            <motion.line
                                key={`line-harm-${i}`}
                                x1={0} y1={0} x2={pos.x} y2={pos.y}
                                stroke="#f43f5e" // Rose
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.3 }}
                                transition={{ duration: 1, delay: 0.8 + pos.delay }}
                            />
                        ))}
                    </g>
                </svg>

                {/* 2. Central Node (Me) - Z-Index: 10 */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.8 }}
                    className="absolute z-10 w-20 h-20 rounded-full bg-deep-slate border-2 border-white/20 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md"
                >
                    <User className="w-8 h-8 text-white mb-1" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Me</span>
                </motion.div>

                {/* 3. Helpful Nodes (Orbit) */}
                {nodePositions.helpfulPos.map((pos, i) => (
                    <motion.div
                        key={`help-${i}`}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{ scale: 1, x: pos.x, y: pos.y }}
                        transition={{ delay: 0.5 + pos.delay, type: 'spring', stiffness: 100 }}
                        // Floating Animation
                        className="absolute z-10 w-24 h-24 flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                            className="w-full h-full rounded-full bg-primary-olive/10 border border-primary-olive/40 flex flex-col items-center justify-center text-center p-2 shadow-lg backdrop-blur-sm"
                        >
                            <Heart className="w-4 h-4 text-primary-olive mb-1 fill-primary-olive/20" />
                            <span className="text-[9px] text-primary-olive font-bold uppercase mb-0.5 tracking-wider">Helpful</span>
                            <span className="text-xs text-white font-bold leading-tight break-keep">{helpful[i]}</span>
                        </motion.div>
                    </motion.div>
                ))}

                {/* 4. Harmful Nodes (Orbit) */}
                {nodePositions.harmfulPos.map((pos, i) => (
                    <motion.div
                        key={`harm-${i}`}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{ scale: 1, x: pos.x, y: pos.y }}
                        transition={{ delay: 0.8 + pos.delay, type: 'spring', stiffness: 100 }}
                        className="absolute z-10 w-24 h-24 flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, 5, 0] }} // 반대로 움직임
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                            className="w-full h-full rounded-full bg-rose-500/10 border border-rose-500/30 flex flex-col items-center justify-center text-center p-2 shadow-lg backdrop-blur-sm"
                        >
                            <ShieldAlert className="w-4 h-4 text-rose-400 mb-1" />
                            <span className="text-[9px] text-rose-400 font-bold uppercase mb-0.5 tracking-wider">Caution</span>
                            <span className="text-xs text-gray-300 font-medium leading-tight break-keep">{harmful[i]}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Legend / Tip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-4 px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-center"
            >
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Sparkles className="w-3 h-3 text-primary-olive" />
                    <span>귀인은 가까이, 주의할 인연은 적당한 거리를 유지하세요.</span>
                </div>
            </motion.div>
        </div>
    );
}
