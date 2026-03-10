"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSaju, SajuResult } from '@/lib/saju/SajuEngine';

// Element Color Mapping with Premium Gradients
const ELEMENT_STYLES: Record<string, { bg: string; gradient: string; glow: string; label: string; icon: string }> = {
    '목': { bg: '#10B981', gradient: 'from-emerald-400 via-green-500 to-teal-600', glow: 'shadow-emerald-500/40', label: '木', icon: '🌲' },
    '화': { bg: '#EF4444', gradient: 'from-red-400 via-orange-500 to-pink-500', glow: 'shadow-red-500/40', label: '火', icon: '🔥' },
    '토': { bg: '#F59E0B', gradient: 'from-amber-400 via-yellow-500 to-orange-500', glow: 'shadow-amber-500/40', label: '土', icon: '🏔️' },
    '금': { bg: '#A1A1AA', gradient: 'from-zinc-300 via-slate-400 to-gray-500', glow: 'shadow-zinc-400/40', label: '金', icon: '⚔️' },
    '수': { bg: '#3B82F6', gradient: 'from-blue-400 via-indigo-500 to-purple-600', glow: 'shadow-blue-500/40', label: '水', icon: '💧' },
};

const PILLAR_LABELS = ['시주', '일주', '월주', '연주'];

interface PillarCardProps {
    label: string;
    ganChar: string;
    jiChar: string;
    ganElement: string;
    jiElement: string;
    isCenter?: boolean;
    onTap: () => void;
    isSelected: boolean;
}

// Premium Pillar Card with Glassmorphism
const PillarCard = ({ label, ganChar, jiChar, ganElement, jiElement, isCenter, onTap, isSelected }: PillarCardProps) => {
    const ganStyle = ELEMENT_STYLES[ganElement] || ELEMENT_STYLES['목'];
    const jiStyle = ELEMENT_STYLES[jiElement] || ELEMENT_STYLES['목'];

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -4 }}
            onClick={onTap}
            className={`
                flex flex-col gap-3 p-3 rounded-2xl items-center min-w-[72px] cursor-pointer transition-all duration-300
                ${isSelected
                    ? 'bg-gradient-to-b from-purple-500/30 to-pink-500/20 border-2 border-purple-400 shadow-xl shadow-purple-500/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'}
                ${isCenter ? 'ring-2 ring-gold-500/50' : ''}
                backdrop-blur-2xl
            `}
        >
            {/* Label */}
            <div className="flex items-center gap-1">
                <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">
                    {label}
                </span>
                {isCenter && <span className="text-[8px]">👑</span>}
            </div>

            {/* Heavenly Stem (Gan) */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white 
                    shadow-lg ${ganStyle.glow}
                    bg-gradient-to-br ${ganStyle.gradient}
                    relative overflow-hidden
                `}
            >
                <div className="absolute inset-0 bg-white/10 rounded-xl" />
                <span className="relative z-10 drop-shadow-lg">{ganChar}</span>
            </motion.div>
            <span className="text-[10px] text-gray-400">{ganStyle.label} {ganStyle.icon}</span>

            {/* Earthly Branch (Ji) */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: -2 }}
                className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white 
                    shadow-lg ${jiStyle.glow}
                    bg-gradient-to-br ${jiStyle.gradient}
                    relative overflow-hidden
                `}
            >
                <div className="absolute inset-0 bg-black/10 rounded-xl" />
                <span className="relative z-10 drop-shadow-lg">{jiChar}</span>
            </motion.div>
            <span className="text-[10px] text-gray-400">{jiStyle.label} {jiStyle.icon}</span>
        </motion.div>
    );
};

interface PremiumSajuGridProps {
    birthDate?: string; // 'YYYY-MM-DD' format
    birthTime?: string; // 'HH:mm' format
    calendarType?: 'solar' | 'lunar';
    gender?: 'male' | 'female';
    onEditBirthdate?: () => void; // Callback to navigate to birth date input screen
}

export default function PremiumSajuGrid({
    birthDate,
    birthTime = '12:00',
    calendarType = 'solar',
    gender = 'male',
    onEditBirthdate
}: PremiumSajuGridProps) {
    const [selectedPillar, setSelectedPillar] = useState<number | null>(null);

    // Calculate Saju using SajuEngine
    const sajuResult: SajuResult | null = useMemo(() => {
        if (!birthDate) return null;
        return calculateSaju(birthDate, birthTime, calendarType, gender);
    }, [birthDate, birthTime, calendarType, gender]);

    // If no birth date, show input prompt
    if (!birthDate || !sajuResult || !sajuResult.success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 text-center">
                    <div className="text-4xl mb-3">🔮</div>
                    <h3 className="text-white font-bold text-lg mb-2">사주 원국 분석</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        생년월일시를 입력하시면<br />당신만의 운명 설계도가 나타납니다
                    </p>
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm">
                        <span>✏️</span>
                        <span>정보 입력 필요</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    const { fourPillars, dayMaster, currentDaewoon, currentSeun } = sajuResult;

    // Prepare pillar data in order: 시주, 일주, 월주, 연주
    const pillarsArray = [
        { label: '시주', pillar: fourPillars.time },
        { label: '일주', pillar: fourPillars.day, isCenter: true },
        { label: '월주', pillar: fourPillars.month },
        { label: '연주', pillar: fourPillars.year },
    ];

    // Calculate 오행 counts
    const ohaengCounts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    pillarsArray.forEach(({ pillar }) => {
        if (pillar.ganElement && ohaengCounts[pillar.ganElement] !== undefined) ohaengCounts[pillar.ganElement]++;
        if (pillar.jiElement && ohaengCounts[pillar.jiElement] !== undefined) ohaengCounts[pillar.jiElement]++;
    });
    const totalElements = Object.values(ohaengCounts).reduce((a, b) => a + b, 0) || 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Premium Glassmorphic Container */}
            <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/30 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-5 shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            🏛️ 사주 원국
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">터치하여 상세 정보 확인</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                            {dayMaster} 일간
                        </span>
                        {currentDaewoon && (
                            <span className="text-[9px] text-gray-500">{currentDaewoon}</span>
                        )}
                        {onEditBirthdate && (
                            <button
                                onClick={onEditBirthdate}
                                className="bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 transition-all px-3 py-1.5 rounded-full text-[11px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                            >
                                ✏️ 만세력 변경
                            </button>
                        )}
                    </div>
                </div>

                {/* Pillar Cards */}
                <div className="flex justify-between gap-2 overflow-x-auto pb-3">
                    {pillarsArray.map((item, i) => (
                        <PillarCard
                            key={i}
                            label={item.label}
                            ganChar={item.pillar.ganKor}
                            jiChar={item.pillar.jiKor}
                            ganElement={item.pillar.ganElement}
                            jiElement={item.pillar.jiElement}
                            isCenter={item.isCenter}
                            onTap={() => setSelectedPillar(selectedPillar === i ? null : i)}
                            isSelected={selectedPillar === i}
                        />
                    ))}
                </div>

                {/* Selected Pillar Detail Panel */}
                <AnimatePresence>
                    {selectedPillar !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/30 border border-purple-500/30 rounded-2xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-purple-300 font-bold text-sm">
                                        {pillarsArray[selectedPillar].label} 상세
                                    </span>
                                    <button
                                        onClick={() => setSelectedPillar(null)}
                                        className="text-gray-500 hover:text-white transition-colors text-xs px-2 py-1 rounded-lg bg-white/5"
                                    >
                                        ✕ 닫기
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-black/20 rounded-xl p-3">
                                        <span className="text-gray-500 text-xs block mb-1">천간 (天干)</span>
                                        <span className="text-white text-lg font-bold">{pillarsArray[selectedPillar].pillar.ganKor}</span>
                                        <span className="text-gray-400 text-xs ml-2">({pillarsArray[selectedPillar].pillar.ganElement})</span>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-3">
                                        <span className="text-gray-500 text-xs block mb-1">지지 (地支)</span>
                                        <span className="text-white text-lg font-bold">{pillarsArray[selectedPillar].pillar.jiKor}</span>
                                        <span className="text-gray-400 text-xs ml-2">({pillarsArray[selectedPillar].pillar.jiElement})</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 오행 분석 Bar - Dynamic & Premium */}
                <div className="mt-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white text-xs font-bold">오행 분석</span>
                        <div className="flex gap-2 text-[10px]">
                            {Object.entries(ohaengCounts).map(([el, count]) => (
                                <span key={el} className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: ELEMENT_STYLES[el]?.bg || '#666' }}
                                    />
                                    <span className="text-gray-300">{el}{count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex h-4 w-full rounded-full overflow-hidden bg-black/30 border border-white/5">
                        {Object.entries(ohaengCounts).map(([el, count]) => (
                            <motion.div
                                key={el}
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / totalElements) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`bg-gradient-to-r ${ELEMENT_STYLES[el]?.gradient || 'from-gray-500 to-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Current Year Energy */}
                {currentSeun && (
                    <div className="mt-3 text-center">
                        <span className="text-[10px] text-gray-500">올해 세운: </span>
                        <span className="text-purple-300 text-xs font-bold">{currentSeun}년</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
