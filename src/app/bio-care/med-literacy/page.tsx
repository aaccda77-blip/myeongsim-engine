/**
 * /bio-care/med-literacy/page.tsx
 * 약물 리터러시 - 내 약 가이드
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MEDICATIONS, type MedicationInfo } from '@/data/BioCareData';

export default function MedLiteracyPage() {
    const router = useRouter();
    const [selectedMed, setSelectedMed] = useState<MedicationInfo | null>(null);

    if (selectedMed) {
        return (
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                    <button
                        onClick={() => setSelectedMed(null)}
                        className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                        {selectedMed.name}
                    </h2>
                </header>

                <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                    {/* 약물 기본 정보 */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-400 text-2xl">
                                    {selectedMed.icon}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl font-serif">{selectedMed.name}</h3>
                                <p className="text-blue-300 text-sm">{selectedMed.genericName}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {selectedMed.mechanism}
                            </p>
                        </div>
                    </div>

                    {/* 일반적인 부작용 */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-400">info</span>
                            일반적인 부작용
                        </h4>
                        <ul className="space-y-2">
                            {selectedMed.commonSideEffects.map((effect, idx) => (
                                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    {effect}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 위험 신호 */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                        <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">warning</span>
                            즉시 병원 방문 필요
                        </h4>
                        <ul className="space-y-2">
                            {selectedMed.warningSignals.map((signal, idx) => (
                                <li key={idx} className="text-red-200 text-sm flex items-start gap-2">
                                    <span className="text-red-400 mt-1">⚠️</span>
                                    {signal}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 영양 팁 */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                        <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">restaurant</span>
                            영양 관리 팁
                        </h4>
                        <ul className="space-y-2">
                            {selectedMed.nutritionTips.map((tip, idx) => (
                                <li key={idx} className="text-green-200 text-sm flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 심화 가이드 (삭센다 전용) */}
                    {selectedMed.id === 'saxenda' && (
                        <button
                            onClick={() => router.push('/bio-care/med-literacy/saxenda-guide')}
                            className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-5 hover:from-blue-500/30 hover:to-purple-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-400">school</span>
                                        담낭 건강 심화 가이드
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        왜 '잘 먹는 것'이 중요한지 알아보세요
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-blue-400">arrow_forward</span>
                            </div>
                        </button>
                    )}

                    {/* 수분 트래커 (자디앙 전용) */}
                    {selectedMed.id === 'jardiance' && (
                        <button
                            onClick={() => router.push('/bio-care/med-literacy/jardiance-hydration')}
                            className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-5 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-cyan-400">water_drop</span>
                                        수분 섭취 트래커
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        매일 목표 달성하고 탈수 예방하세요
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-cyan-400">arrow_forward</span>
                            </div>
                        </button>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.back()}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    약물 리터러시
                </h2>
            </header>

            {/* Intro */}
            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                    <span className="material-symbols-outlined text-blue-400 text-3xl">medication</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 font-serif">
                    내 약 가이드
                </h3>
                <p className="text-gray-400 text-sm">
                    복용 중인 약물을 선택하여<br />작용 원리와 주의사항을 확인하세요.
                </p>
            </div>

            {/* Medication List */}
            <main className="flex-1 p-6 space-y-3 pb-8">
                {MEDICATIONS.map((med) => (
                    <button
                        key={med.id}
                        onClick={() => setSelectedMed(med)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-blue-400">
                                    {med.icon}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold mb-1">{med.name}</h4>
                                <p className="text-gray-500 text-xs">{med.genericName}</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-600 group-hover:text-[#658c42] transition-colors">
                                chevron_right
                            </span>
                        </div>
                    </button>
                ))}
            </main>
        </div>
    );
}
