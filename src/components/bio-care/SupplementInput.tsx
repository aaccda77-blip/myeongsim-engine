/**
 * /components/bio-care/SupplementInput.tsx
 * 영양제 등록 폼
 */

'use client';

import React, { useState } from 'react';
import { SUPPLEMENT_DATABASE, Supplement, TimingCategory } from '@/data/NutrientTimingDB';
import { motion, AnimatePresence } from 'framer-motion';

interface SupplementInputProps {
    onAdd: (supplement: Supplement, timing: TimingCategory) => void;
}

export default function SupplementInput({ onAdd }: SupplementInputProps) {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
    const [customTiming, setCustomTiming] = useState<TimingCategory>('morning');

    const filteredSupplements = SUPPLEMENT_DATABASE.filter(sup =>
        sup.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        if (selectedSupplement) {
            onAdd(selectedSupplement, customTiming);
            setShowModal(false);
            setSearchTerm('');
            setSelectedSupplement(null);
            setCustomTiming('morning');
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-[#658c42] hover:bg-[#7aa350] text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">add_circle</span>
                영양제 추가하기
            </button>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-[#1f2937] rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[80vh] overflow-y-auto"
                        >
                            <h3 className="text-white text-lg font-bold mb-4">
                                영양제 추가
                            </h3>

                            {/* 검색 */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="영양제 이름 검색..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#658c42]"
                                />
                            </div>

                            {/* 영양제 목록 */}
                            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                                {filteredSupplements.map((sup) => (
                                    <button
                                        key={sup.id}
                                        onClick={() => {
                                            setSelectedSupplement(sup);
                                            setCustomTiming(sup.optimalTiming);
                                        }}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${selectedSupplement?.id === sup.id
                                                ? 'bg-[#658c42] text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="font-bold">{sup.name}</div>
                                        <div className="text-xs opacity-70 mt-1">
                                            {sup.description}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* 선택된 영양제 정보 */}
                            {selectedSupplement && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                                    <h4 className="text-white font-bold mb-2">섭취 시간 설정</h4>
                                    <div className="space-y-2">
                                        {(['morning', 'meal', 'evening'] as TimingCategory[]).map((timing) => (
                                            <button
                                                key={timing}
                                                onClick={() => setCustomTiming(timing)}
                                                className={`w-full p-3 rounded-xl text-left transition-all ${customTiming === timing
                                                        ? 'bg-[#658c42] text-white'
                                                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold">
                                                        {timing === 'morning' && '🟢 아침 공복'}
                                                        {timing === 'meal' && '🟡 식사 직후'}
                                                        {timing === 'evening' && '🟣 저녁/취침 전'}
                                                    </span>
                                                    {selectedSupplement.optimalTiming === timing && (
                                                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                                            권장
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {customTiming !== selectedSupplement.optimalTiming && (
                                        <p className="text-yellow-400 text-xs mt-3">
                                            ⚠️ 권장 시간: {selectedSupplement.optimalTiming === 'morning' && '아침 공복'}
                                            {selectedSupplement.optimalTiming === 'meal' && '식사 직후'}
                                            {selectedSupplement.optimalTiming === 'evening' && '저녁/취침 전'}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 버튼 */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!selectedSupplement}
                                    className="flex-1 py-3 bg-[#658c42] hover:bg-[#7aa350] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    추가
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
