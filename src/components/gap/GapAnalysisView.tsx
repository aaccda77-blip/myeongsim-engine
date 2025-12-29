"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { GapAnalysisService } from '@/modules/GapAnalysisService';
import { QuestionModule, Question } from '@/modules/QuestionModule';

// Mock Innate Vector (Saju Profile - Example: [Fire, Wood, Water, Metal, Earth])
const INITIAL_INNATE_VECTOR = [5, 3, 2, 4, 1];

export default function GapAnalysisView() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

    // Vectors
    const [innateVector] = useState<number[]>(INITIAL_INNATE_VECTOR);
    const [acquiredVector, setAcquiredVector] = useState<number[]>([0, 0, 0, 0, 0]); // Starts neutral

    // Analysis Result
    const [result, setResult] = useState({ matchingScore: 0, gapLevel: 0 });

    // Level Calculation (1-9 based on Gap)
    // Low Gap (0%) -> Level 9 (Mastery)? Or Level 1?
    // Usually High Level = Better. So Low Gap = High Level.
    // Let's assume Level 1 = Beginner (High Gap), Level 9 = Master (Low Gap).
    // Formula: 10 - ceil(Gap / 10). Gap 90% -> Level 1. Gap 0% -> Level 10 (or 9 max).
    const codeLevel = Math.max(1, Math.min(9, Math.floor((100 - result.gapLevel) / 10)));

    // Load Questions on Mount (Default to NC-06 for generic view, or can be prop-driven)
    useEffect(() => {
        setQuestions(QuestionModule.getQuestions('NC-06'));
    }, []);

    // Recalculate Gap whenever acquiredVector changes
    useEffect(() => {
        if (innateVector.length > 0) {
            const gapRes = GapAnalysisService.calculateGap(innateVector, acquiredVector);
            setResult(gapRes);
        }
    }, [acquiredVector, innateVector]);

    const handleOptionSelect = (optionValue: number[]) => {
        // Accumulate vector values (Acquired Personality is built over time)
        setAcquiredVector(prev => prev.map((val, idx) => val + (optionValue[idx] || 0)));

        // Next Question or Finish
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            // End of Questions behavior (optional: Reset or Show Report)
        }
    };

    const currentQuestion = questions[currentQuestionIdx];

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden font-sans">

            {/* --- TOP: Real-time Visual Gauge & Level --- */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-6 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl z-10 transition-all duration-700">
                <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400 opacity-70">
                    Saju-Gap Analysis Protocol v1.0
                </div>

                {/* Animated Circles & Bar */}
                <div className="relative w-64 h-64 flex items-center justify-center">

                    {/* Innate Circle (Fixed Reference) */}
                    <div className="absolute w-60 h-60 border-2 border-dashed border-gray-600 rounded-full opacity-30 animate-spin-slow" />

                    {/* Orange Bar (Gap Indicator) - "Innate vs Acquired" tension */}
                    {/* Visualizing the "Gap" as an Orange Arc or Bar that grows */}
                    <div
                        className="absolute rounded-full border-[6px] border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            width: `${100 + (result.gapLevel * 1.5)}px`, // Expands with Gap
                            height: `${100 + (result.gapLevel * 1.5)}px`,
                            opacity: 0.8 + (result.gapLevel / 200),
                            transform: `rotate(${result.gapLevel * 3.6}deg)` // Rotates with tension
                        }}
                    />

                    {/* Acquired Gauge (Blue/Cyan - Matching) */}
                    <div
                        className="absolute rounded-full border-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-1000"
                        style={{
                            width: `${20 + (result.matchingScore * 1.8)}px`,
                            height: `${20 + (result.matchingScore * 1.8)}px`,
                            opacity: 0.5
                        }}
                    ></div>

                    {/* Level Number Display */}
                    <div className="absolute z-20 text-center">
                        <div className="text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500">
                            <span className="text-orange-400 text-2xl align-top">Lv.</span>{codeLevel}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-cyan-200 mt-2">
                            Gap: {result.gapLevel}%
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mt-8 text-center h-10">
                    <p className={`text-sm font-medium ${result.gapLevel > 30 ? 'text-orange-400' : 'text-cyan-200'} animate-pulse`}>
                        {result.gapLevel > 30
                            ? "⚠️ Dark Code Detected (Gap High)"
                            : "✨ Neural Code Optimized (Flow State)"}
                    </p>
                </div>
            </div>

            {/* --- BOTTOM: Question Module Interaction --- */}
            <div className="flex-1 bg-white items-center justify-center p-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] text-slate-800 transition-transform duration-500 transform translate-y-0 relative z-20">

                {/* Drag Handle */}
                <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 cursor-pointer hover:bg-gray-300 transition-colors" />

                <div className="max-w-md mx-auto h-full flex flex-col justify-start">
                    {currentQuestion ? (
                        <div className="animate-fade-in-up">
                            {/* Question Text */}
                            <h2 className="text-xl font-bold mb-6 text-slate-900 leading-snug">
                                <span className="text-cyan-600 mr-2">Q{currentQuestionIdx + 1}.</span>
                                {currentQuestion.text}
                            </h2>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option.value)}
                                        className="w-full text-left p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-cyan-50 hover:border-cyan-200 hover:shadow-md transition-all duration-200 active:scale-98 flex items-center group"
                                    >
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 group-hover:border-cyan-500 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-slate-700 font-medium group-hover:text-slate-900">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 animate-fade-in">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Finished</h3>
                            <p className="text-gray-500 mb-8">당신의 선천적 기질과 후천적 환경의 조화도는 {result.matchingScore}% 입니다.</p>
                            <button
                                onClick={() => {
                                    setAcquiredVector([0, 0, 0, 0, 0]);
                                    setCurrentQuestionIdx(0);
                                }}
                                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all"
                            >
                                Re-Test
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Styles for Custom Animation (if generic CSS not available) */}
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
