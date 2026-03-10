'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Heart, Coins, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';

// [Deep Tech Logic] 스탯 설정 (아이콘 및 테마 컬러)
const STAT_CONFIG = [
    { key: 'creativity', label: "창의성 (Creativity)", icon: <Lightbulb size={16} />, color: "from-purple-500 to-indigo-600", shadow: "shadow-purple-500/30" },
    { key: 'leadership', label: "리더십 (Leadership)", icon: <Trophy size={16} />, color: "from-red-500 to-rose-600", shadow: "shadow-red-500/30" },
    { key: 'empathy', label: "공감능력 (Empathy)", icon: <Heart size={16} />, color: "from-pink-500 to-rose-400", shadow: "shadow-pink-500/30" },
    { key: 'wealth', label: "재물감각 (Wealth)", icon: <Coins size={16} />, color: "from-amber-400 to-yellow-600", shadow: "shadow-amber-500/30" },
    { key: 'execution', label: "실행력 (Execution)", icon: <Zap size={16} />, color: "from-emerald-400 to-green-600", shadow: "shadow-emerald-500/30" },
];

export default function TalentStatsView() {
    const { reportData } = useReportStore();

    // Data Guard
    if (!reportData || !reportData.stats) return null;
    const { stats } = reportData;

    // [Deep Tech Logic] 동적 분석 (가장 높은/낮은 스탯 찾기)
    const analysis = useMemo(() => {
        // stats 객체를 배열로 변환하여 정렬
        const entries = Object.entries(stats).map(([key, val]) => ({ key, val: Number(val) }));
        const sorted = entries.sort((a, b) => b.val - a.val);

        const best = sorted[0];
        const worst = sorted[sorted.length - 1];

        return { best, worst };
    }, [stats]);

    // 스탯별 코멘트 생성기
    const getInsightMessage = (bestKey: string) => {
        switch (bestKey) {
            case 'creativity': return "남다른 아이디어로 문제를 해결하는 혁신가형입니다.";
            case 'leadership': return "조직을 이끌고 책임을 지는 리더의 자질이 탁월합니다.";
            case 'empathy': return "타인의 마음을 읽고 치유하는 능력이 가장 빛납니다.";
            case 'wealth': return "흐름을 읽고 자산을 증식하는 감각이 뛰어납니다.";
            case 'execution': return "생각한 것을 현실로 만드는 추진력이 강력합니다.";
            default: return "균형 잡힌 능력을 보유하고 있습니다.";
        }
    };

    return (
        <div className="h-full flex flex-col pt-6 pb-8 px-2 overflow-y-auto scrollbar-hide">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 shrink-0"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                    05. Hidden Talents
                </span>
                <h2 className="text-2xl font-serif text-white mt-4">나의 잠재력 스탯</h2>
                <p className="text-sm text-gray-400 mt-2">데이터로 분석된 당신의 핵심 능력치입니다.</p>
            </motion.div>

            {/* Stats Bars */}
            <div className="flex-1 flex flex-col justify-start gap-5">
                {STAT_CONFIG.map((config, idx) => {
                    // 타입 안전하게 접근
                    const value = (stats as any)[config.key] || 0;

                    return (
                        <motion.div
                            key={config.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2 text-gray-300 font-bold">
                                    <span className="text-gray-500">{config.icon}</span>
                                    {config.label}
                                </div>
                                <span className="text-white font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-xs">
                                    {value}/100
                                </span>
                            </div>

                            {/* Progress Bar Background */}
                            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                                {/* Grid Lines Overlay */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                                {/* Animated Bar */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value}%` }}
                                    transition={{ duration: 1.2, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                                    className={`h-full rounded-full bg-gradient-to-r ${config.color} relative group`}
                                >
                                    {/* Glow Effect */}
                                    <div className={`absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]`} />
                                    <div className={`absolute inset-0 opacity-50 ${config.shadow} shadow-[0_0_15px_currentColor]`} />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Dynamic Insight Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-deep-slate border border-primary-olive/30 rounded-2xl p-5 mt-6 shadow-lg backdrop-blur-md relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp size={40} className="text-primary-olive" />
                </div>

                <h4 className="text-primary-olive font-bold text-sm mb-2 flex items-center gap-2">
                    <TrendingUp size={16} />
                    핵심 강점 분석
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed">
                    당신의 최고 강점은 <strong className="text-white underline decoration-primary-olive decoration-2 underline-offset-4">{STAT_CONFIG.find(c => c.key === analysis.best.key)?.label.split(' ')[0]}</strong>입니다.<br />
                    {getInsightMessage(analysis.best.key)}
                </p>

                {/* Weakness Tip (Optional) */}
                {analysis.worst.val < 50 && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex gap-2 items-start">
                        <AlertTriangle size={14} className="text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-400">
                            Tip: {STAT_CONFIG.find(c => c.key === analysis.worst.key)?.label.split(' ')[0]}을(를) 보완하면 더 큰 성장이 가능합니다.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
