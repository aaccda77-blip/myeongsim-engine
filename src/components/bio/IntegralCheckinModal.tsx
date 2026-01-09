'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { Heart, Activity, Users, Briefcase, X, ChevronRight, MessageCircle } from 'lucide-react';

interface IntegralCheckinModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onComplete: (advice: string, context: any) => void; // Trigger Chat
}

const SYMPTOMS = [
    { id: 'headache', label: '🤕 두통/편두통' },
    { id: 'anxiety', label: '😰 막연한 불안' },
    { id: 'drunk', label: '🍺 숙취/음주' },
    { id: 'insomnia', label: '😴 수면 부족' },
    { id: 'anger', label: '😡 분노/짜증' },
    { id: 'indigestion', label: '🤢 소화 불량' },
    { id: 'lethargy', label: '🫠 무기력' },
    { id: 'conflict', label: '🤬 관계 갈등' },
];

export default function IntegralCheckinModal({ isOpen, onClose, userId, onComplete }: IntegralCheckinModalProps) {
    // Check-in State
    const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
    const [scores, setScores] = useState({
        ul_mind: 5,
        ur_body: 5,
        ll_relation: 5,
        lr_system: 5
    });
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

    // Result State
    const [resultData, setResultData] = useState<{ advice: string, context: any } | null>(null);

    const handleScoreChange = (key: keyof typeof scores, value: number) => {
        setScores(prev => ({ ...prev, [key]: value }));
    };

    const toggleSymptom = (id: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        setStep('loading');
        try {
            const res = await fetch('/api/integral/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    dailyState: { ...scores, symptoms: selectedSymptoms }
                })
            });

            const data = await res.json();
            if (data.success) {
                setResultData(data.data);
                setStep('result');
            } else {
                alert('잠시 후 다시 시도해주세요.');
                setStep('input');
            }
        } catch (e) {
            console.error(e);
            setStep('input');
        }
    };

    const handleStartChat = () => {
        if (resultData) {
            onComplete(resultData.advice, resultData.context);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#11131a] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        🩺 통합 체크인 <span className="text-xs text-gray-500 font-normal">Integral Check-in</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {step === 'input' && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-400 text-center mb-4">
                                "머리가 아닌 <b>몸(Body)</b>이 느끼는 그대로 입력해주세요."
                            </p>

                            {/* UR Body */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-400 font-bold flex gap-1 items-center"><Activity size={14} /> 몸 (Body)</span>
                                    <span className="text-white font-mono">{scores.ur_body}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={scores.ur_body}
                                    onChange={(e) => handleScoreChange('ur_body', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <p className="text-xs text-gray-500 text-right">{scores.ur_body < 4 ? "아파요/피곤해요" : scores.ur_body > 7 ? "날아갈 것 같아요" : "평범해요"}</p>
                            </div>

                            {/* UL Mind */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-400 font-bold flex gap-1 items-center"><Heart size={14} /> 마음 (Mind)</span>
                                    <span className="text-white font-mono">{scores.ul_mind}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={scores.ul_mind}
                                    onChange={(e) => handleScoreChange('ul_mind', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>

                            {/* LL Relation */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-pink-400 font-bold flex gap-1 items-center"><Users size={14} /> 관계 (Relation)</span>
                                    <span className="text-white font-mono">{scores.ll_relation}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={scores.ll_relation}
                                    onChange={(e) => handleScoreChange('ll_relation', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>

                            {/* LR System */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-400 font-bold flex gap-1 items-center"><Briefcase size={14} /> 일/돈 (System)</span>
                                    <span className="text-white font-mono">{scores.lr_system}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={scores.lr_system}
                                    onChange={(e) => handleScoreChange('lr_system', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Symptoms */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">오늘의 증상 (선택)</label>
                                <div className="flex flex-wrap gap-2">
                                    {SYMPTOMS.map(sym => (
                                        <button
                                            key={sym.id}
                                            onClick={() => toggleSymptom(sym.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs transition-colors border \${
                                                selectedSymptoms.includes(sym.id) 
                                                ? 'bg-red-500/20 text-red-300 border-red-500/50' 
                                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                                            }`}
                                        >
                                            {sym.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                            >
                                분석 시작
                            </button>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-sm animate-pulse">Saju Data 동기화 중...</p>
                        </div>
                    )}

                    {step === 'result' && resultData && (
                        <div className="space-y-6">
                            {/* Insight Card */}
                            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-5 shadow-inner">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-bold text-lg">Daily Insight</h3>
                                    {/* Energy Battery */}
                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded">
                                        <span className="text-[10px] text-gray-400">ENERGY</span>
                                        <div className={`w-2 h-4 rounded-sm \${resultData.context?.saju?.energy_level === 'Critical_Heat' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <div className={`w-2 h-4 rounded-sm \${resultData.context?.saju?.energy_level === 'Critical_Heat' ? 'bg-red-500/50' : 'bg-green-500'}`}></div>
                                        <div className={`w-2 h-4 rounded-sm bg-gray-700`}></div>
                                    </div>
                                </div>

                                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                                    "{resultData.advice}"
                                </p>

                                {/* Context Tags for Geeky Users */}
                                <div className="mt-4 flex gap-2 flex-wrap">
                                    {resultData.context?.saju?.is_gongmang && (
                                        <span className="text-[10px] px-2 py-1 bg-gray-800 text-gray-400 rounded">🕳️ 공망(Void) 활성화</span>
                                    )}
                                    <span className="text-[10px] px-2 py-1 bg-gray-800 text-gray-400 rounded">🧬 Gene Key {resultData.context?.gene_keys?.lifes_work?.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <button
                                onClick={handleStartChat}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                            >
                                <MessageCircle size={18} />
                                코치와 상담 시작하기
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
