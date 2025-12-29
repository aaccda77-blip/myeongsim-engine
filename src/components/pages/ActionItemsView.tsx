'use client';

import { useReportStore } from '@/store/useReportStore';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function ActionItemsView() {
    const { reportData } = useReportStore();
    const [committed, setCommitted] = useState(false);

    // 체크박스 상태 관리
    const [checkedState, setCheckedState] = useState<boolean[]>(
        reportData?.actionPlan?.todos ? new Array(reportData.actionPlan.todos.length).fill(false) : []
    );

    // [Fix 1] 데이터 가드
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

        // [Fix 2] 브랜드 컬러 Confetti
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#658c42', '#ffffff', '#a3e635'], // Olive Theme
                zIndex: 100 // 모달 위로 터지게
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#658c42', '#ffffff', '#a3e635'],
                zIndex: 100
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <div className="w-full flex flex-col pt-6 px-2 relative">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center shrink-0"
            >
                <span className="text-primary-olive text-[10px] font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                    Final Prescription
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-4">나를 위한 개운(開運) 처방</h2>
            </motion.div>

            {/* Lucky Items (Grid) */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {(actionPlan.luckyItems || []).map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-deep-slate border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-lg hover:border-primary-olive/50 transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary-olive/20 transition-colors">
                            <Sparkles className="w-4 h-4 text-primary-olive" />
                        </div>
                        <span className="text-xs text-gray-300 font-medium break-keep">{item}</span>
                    </motion.div>
                ))}
            </div>

            {/* Checklist (Full Content) */}
            <div className="w-full bg-deep-slate/50 rounded-2xl p-5 border border-white/5 mb-8 flex flex-col backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-primary-olive" />
                    실천 가이드 (To-Do)
                </h3>

                <div className="space-y-3">
                    {(actionPlan.todos || []).map((todo, idx) => {
                        const isChecked = checkedState[idx];
                        return (
                            <motion.div
                                key={idx}
                                layout
                                onClick={() => handleCheck(idx)}
                                className={`
                        group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-300
                        ${isChecked
                                        ? 'bg-primary-olive/10 border-primary-olive/30'
                                        : 'bg-black/20 border-white/5 hover:bg-black/40'
                                    }
                    `}
                            >
                                {/* Custom Checkbox */}
                                <div className={`
                        mt-0.5 w-5 h-5 rounded-md border flex shrink-0 items-center justify-center transition-all duration-300
                        ${isChecked
                                        ? 'bg-primary-olive border-primary-olive scale-105'
                                        : 'border-gray-600 group-hover:border-primary-olive'
                                    }
                    `}>
                                    {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </div>

                                <span className={`text-sm transition-all duration-300 leading-relaxed ${isChecked ? 'text-gray-400 line-through decoration-primary-olive/50' : 'text-gray-200'}`}>
                                    {todo}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Commit Button (Standard Flow) */}
            <div className="w-full pb-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCommit}
                    disabled={committed}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${committed
                        ? 'bg-primary-olive text-white cursor-default opacity-90'
                        : 'bg-primary-olive text-white shadow-primary-olive/30 hover:shadow-primary-olive/50'
                        }`}
                >
                    {committed ? (
                        <>
                            <Check className="w-5 h-5" />
                            약속이 완료되었습니다
                        </>
                    ) : (
                        "나 자신과 약속하기"
                    )}
                </motion.button>
            </div>
        </div>
    );
}
