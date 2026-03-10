/**
 * /components/bio-care/SleepRitual.tsx
 * 딥 슬립 리추얼 - 수면 의식 가이드
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SleepRitual() {
    const [step, setStep] = useState(0); // 0: 시작 전, 1: 영양제, 2: 호흡, 3: 완료

    // 단계별 가이드 데이터
    const ritualSteps = [
        {
            title: "오늘의 마침표",
            desc: "뇌를 쉬게 할 시간입니다. 준비되셨나요?",
            btn: "수면 의식 시작하기",
            icon: "bedtime",
            color: "indigo"
        },
        {
            title: "이완 영양제 섭취",
            desc: "테아닌(뇌 이완)과 마그네슘(근육 이완)을 드셨나요?",
            btn: "네, 섭취했습니다",
            icon: "medication",
            color: "yellow",
            tip: "* 삭센다 사용 시 불면증이 있다면 이 조합이 도움이 됩니다."
        },
        {
            title: "4-7-8 호흡하기",
            desc: "4초 마시고, 7초 참고, 8초간 길게 내뱉으세요. (3회)",
            btn: "호흡 완료, 나른해집니다",
            icon: "air",
            color: "blue"
        },
        {
            title: "굿나잇, 명심하세요",
            desc: "내일 아침 더 가벼워진 몸으로 만나요.",
            btn: "잘 자요",
            icon: "check_circle",
            color: "green"
        }
    ];

    const current = ritualSteps[step];

    const getIconColor = (color: string) => {
        switch (color) {
            case 'indigo': return 'text-indigo-400';
            case 'yellow': return 'text-yellow-400';
            case 'blue': return 'text-blue-400';
            case 'green': return 'text-green-400';
            default: return 'text-indigo-400';
        }
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setStep(0);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-white relative overflow-hidden">
            {/* 배경 별 장식 */}
            <div className="absolute top-4 right-6 text-slate-700 text-2xl">✨</div>
            <div className="absolute bottom-10 left-4 text-slate-700 text-2xl">✨</div>
            <div className="absolute top-1/2 left-6 text-slate-700 text-xl">🌙</div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative z-10 flex flex-col items-center text-center space-y-5 py-4"
                >
                    {/* 아이콘 애니메이션 */}
                    <motion.div
                        animate={step === 2 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: step === 2 ? Infinity : 0, duration: 2 }}
                        className="p-4 bg-white/10 rounded-full backdrop-blur-sm"
                    >
                        <span className={`material-symbols-outlined text-5xl ${getIconColor(current.color)}`}>
                            {current.icon}
                        </span>
                    </motion.div>

                    <div>
                        <h3 className="text-xl font-bold mb-2 text-indigo-100">{current.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                            {current.desc}
                        </p>
                    </div>

                    {/* 진행 상태 바 (Steps) */}
                    {step < 3 && (
                        <div className="flex gap-2 mb-2">
                            {[0, 1, 2].map((idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === step ? 'bg-indigo-400 w-6' : 'bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <button
                        onClick={handleNext}
                        className={`w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 ${step === 3
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50'
                                : 'bg-white text-slate-900 hover:bg-slate-100'
                            }`}
                    >
                        {current.btn}
                    </button>

                    {/* 팁 메시지 */}
                    {current.tip && (
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            {current.tip}
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* 보건교육 안내 */}
            {step === 0 && (
                <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                    <p className="text-indigo-200 text-xs leading-relaxed">
                        💡 <strong>보건교육사 Tip</strong><br />
                        양질의 수면은 성장호르몬 분비를 촉진하여 지방 분해를 돕습니다.
                        삭센다 효과를 극대화하려면 7~8시간 수면을 권장합니다.
                    </p>
                </div>
            )}
        </div>
    );
}
