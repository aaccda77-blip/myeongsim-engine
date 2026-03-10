'use client';

import { useReportStore } from '@/store/useReportStore';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Star, Sparkles, AlertCircle, ShieldCheck,
    Zap, Heart, Brain, Target, Flame, ChevronLeft,
    ChevronRight, Lightbulb, Calendar, Clock
} from 'lucide-react';
import { useState } from 'react';

// Premium Action Card Component
function PremiumActionCard({
    icon: Icon,
    title,
    description,
    color,
    delay
}: {
    icon: any;
    title: string;
    description: string;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative group"
        >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity`} />
            <div className="relative bg-gradient-to-br from-deep-slate to-black/50 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Lucky Item Pill Component
function LuckyItemPill({ item, index }: { item: string; index: number }) {
    const colors = [
        'from-primary-olive/20 to-emerald-500/20 border-primary-olive/50',
        'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
        'from-purple-500/20 to-pink-500/20 border-purple-500/50',
        'from-amber-500/20 to-orange-500/20 border-amber-500/50',
        'from-rose-500/20 to-red-500/20 border-rose-500/50',
        'from-teal-500/20 to-green-500/20 border-teal-500/50',
    ];
    const color = colors[index % colors.length];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${color} border backdrop-blur-sm shadow-lg`}
        >
            <Sparkles className="w-3 h-3 text-white/70" />
            <span className="text-xs font-medium text-white">{item}</span>
        </motion.div>
    );
}

export default function ActionItemsView() {
    const { reportData, setStep } = useReportStore();
    const [committed, setCommitted] = useState(false);
    const [expandedAction, setExpandedAction] = useState<number | null>(null);

    // 체크박스 상태 관리
    const [checkedState, setCheckedState] = useState<boolean[]>(
        reportData?.actionPlan?.todos ? new Array(reportData.actionPlan.todos.length).fill(false) : []
    );

    // [Guard] 데이터 가드
    if (!reportData || !reportData.actionPlan) {
        return (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
                <AlertCircle className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-gray-400 text-sm">처방 데이터가 없습니다.</p>
            </div>
        );
    }

    const { actionPlan } = reportData;

    const handleCheck = (index: number) => {
        const updated = [...checkedState];
        updated[index] = !updated[index];
        setCheckedState(updated);
    };

    const handleCommit = () => {
        if (committed) return;
        setCommitted(true);

        // 프리미엄 Confetti
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#658c42', '#ffffff', '#a3e635', '#fbbf24'],
                zIndex: 100
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#658c42', '#ffffff', '#a3e635', '#fbbf24'],
                zIndex: 100
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // 다음 페이지로 자동 이동 (2초 후)
        setTimeout(() => setStep(13), 2000);
    };

    // 프리미엄 액션 아이템 생성
    const premiumActions = [
        {
            icon: Brain,
            title: '마인드셋 리셋',
            description: '아침에 일어나면 오늘의 만트라를 3번 읽으세요. 뇌에 새로운 회로가 만들어집니다.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Heart,
            title: '감정 체크인',
            description: '하루 3번, 지금 내 감정이 무엇인지 3초간 알아차리세요. 알아차림만으로 50%는 해결됩니다.',
            color: 'from-rose-500 to-orange-500'
        },
        {
            icon: Target,
            title: '마이크로 액션',
            description: '거창한 계획 대신, 딱 5분만 투자하는 작은 행동을 시작하세요. 시작이 반입니다.',
            color: 'from-primary-olive to-emerald-500'
        },
        {
            icon: Zap,
            title: '에너지 관리',
            description: '에너지가 떨어지면 무리하지 마세요. 잠깐의 휴식이 하루를 바꿉니다.',
            color: 'from-amber-500 to-yellow-500'
        }
    ];

    return (
        <div className="w-full flex flex-col pt-4 px-1 relative min-h-full">

            {/* Navigation */}
            <div className="flex justify-between items-center mb-4 px-2">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setStep(11)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setStep(13)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center shrink-0"
            >
                <div className="inline-flex items-center gap-2 text-primary-olive text-[10px] font-bold tracking-widest uppercase border border-primary-olive/30 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-olive/10 to-emerald-500/10 shadow-lg backdrop-blur-sm mb-4">
                    <Flame className="w-3 h-3" />
                    FINAL PRESCRIPTION
                </div>
                <h2 className="text-2xl font-serif font-bold text-white">
                    나를 위한 <span className="text-primary-olive">개운(開運)</span> 처방
                </h2>
                <p className="text-gray-500 text-xs mt-2">
                    운명을 바꾸는 구체적인 행동 가이드
                </p>
            </motion.div>

            {/* Lucky Items (Horizontal Scroll) */}
            <div className="mb-6 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 px-2 pb-2">
                    {(actionPlan.luckyItems || ['긍정적 마음', '작은 시작', '꾸준함']).map((item, i) => (
                        <LuckyItemPill key={i} item={item} index={i} />
                    ))}
                </div>
            </div>

            {/* Premium Action Cards */}
            <div className="space-y-4 mb-6 px-2">
                {premiumActions.map((action, i) => (
                    <PremiumActionCard
                        key={i}
                        icon={action.icon}
                        title={action.title}
                        description={action.description}
                        color={action.color}
                        delay={0.5 + i * 0.15}
                    />
                ))}
            </div>

            {/* Interactive Checklist */}
            <div className="w-full bg-gradient-to-br from-deep-slate/80 to-black/50 rounded-2xl p-5 border border-white/10 mb-6 backdrop-blur-sm shadow-xl mx-2">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-primary-olive" />
                    오늘의 미션 (Check List)
                </h3>

                <div className="space-y-3">
                    {(actionPlan.todos || ['오늘 하루 감사한 일 3가지 적기', '5분 명상하기', '물 8잔 마시기']).map((todo, idx) => {
                        const isChecked = checkedState[idx];
                        return (
                            <motion.div
                                key={idx}
                                layout
                                onClick={() => handleCheck(idx)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`
                                    group flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300
                                    ${isChecked
                                        ? 'bg-gradient-to-r from-primary-olive/20 to-emerald-500/10 border-primary-olive/50 shadow-lg shadow-primary-olive/10'
                                        : 'bg-black/30 border-white/5 hover:bg-black/50 hover:border-white/10'
                                    }
                                `}
                            >
                                {/* Custom Checkbox */}
                                <div className={`
                                    mt-0.5 w-6 h-6 rounded-lg border-2 flex shrink-0 items-center justify-center transition-all duration-300
                                    ${isChecked
                                        ? 'bg-gradient-to-br from-primary-olive to-emerald-500 border-primary-olive scale-110 shadow-lg'
                                        : 'border-gray-600 group-hover:border-primary-olive/50'
                                    }
                                `}>
                                    <AnimatePresence>
                                        {isChecked && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                            >
                                                <Check className="w-4 h-4 text-white stroke-[3]" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <span className={`text-sm transition-all duration-300 leading-relaxed ${isChecked ? 'text-gray-400 line-through decoration-primary-olive/50' : 'text-gray-200'}`}>
                                    {todo}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* AI Insight Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="w-full bg-gradient-to-br from-primary-olive/10 to-emerald-500/5 rounded-2xl p-5 border border-primary-olive/20 mb-6 mx-2 backdrop-blur-sm"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-primary-olive/20">
                        <Lightbulb className="w-5 h-5 text-primary-olive" />
                    </div>
                    <div>
                        <h4 className="text-primary-olive font-bold text-sm mb-1">AI 코치의 인사이트</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            {reportData.userName}님의 에너지 패턴을 분석한 결과,
                            <span className="text-primary-olive font-medium"> 오전 시간대</span>에 집중력이 가장 높습니다.
                            중요한 결정이나 창의적 작업은 오전에 진행하시는 것을 추천드립니다.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Commit Button */}
            <div className="w-full pb-6 px-2">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(101, 140, 66, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCommit}
                    disabled={committed}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${committed
                        ? 'bg-gradient-to-r from-primary-olive to-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-primary-olive to-emerald-600 text-white hover:shadow-primary-olive/30'
                        }`}
                >
                    {committed ? (
                        <>
                            <Check className="w-6 h-6" />
                            약속이 완료되었습니다!
                        </>
                    ) : (
                        <>
                            <Star className="w-5 h-5" />
                            나 자신과 약속하기
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
