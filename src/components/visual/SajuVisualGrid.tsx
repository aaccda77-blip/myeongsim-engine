"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Element Color Mapping with Gradients
const ELEMENT_STYLES: Record<string, { bg: string; gradient: string; glow: string; label: string }> = {
    '목': { bg: '#10B981', gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/50', label: '木' },
    '화': { bg: '#EF4444', gradient: 'from-red-500 to-orange-500', glow: 'shadow-red-500/50', label: '火' },
    '토': { bg: '#F59E0B', gradient: 'from-amber-500 to-yellow-500', glow: 'shadow-amber-500/50', label: '土' },
    '금': { bg: '#9CA3AF', gradient: 'from-gray-400 to-slate-500', glow: 'shadow-gray-400/50', label: '金' },
    '수': { bg: '#3B82F6', gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/50', label: '水' },
    'wood': { bg: '#10B981', gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/50', label: '木' },
    'fire': { bg: '#EF4444', gradient: 'from-red-500 to-orange-500', glow: 'shadow-red-500/50', label: '火' },
    'earth': { bg: '#F59E0B', gradient: 'from-amber-500 to-yellow-500', glow: 'shadow-amber-500/50', label: '土' },
    'metal': { bg: '#9CA3AF', gradient: 'from-gray-400 to-slate-500', glow: 'shadow-gray-400/50', label: '金' },
    'water': { bg: '#3B82F6', gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/50', label: '水' }
};

const KOREAN_LABELS: Record<string, string> = {
    'Hour': '시주',
    'Day': '일주',
    'Month': '월주',
    'Year': '연주'
};

interface PillarData {
    label: string;
    gan: { char: string; color: string; element: string };
    ji: { char: string; color: string; element: string };
    tenGods: { gan: string; ji: string };
}

interface PillarCardProps extends PillarData {
    onTap: () => void;
    isSelected: boolean;
}

// Premium Pillar Card
const PillarCard = ({ label, gan, ji, tenGods, onTap, isSelected }: PillarCardProps) => {
    const ganStyle = ELEMENT_STYLES[gan.element] || ELEMENT_STYLES['목'];
    const jiStyle = ELEMENT_STYLES[ji.element] || ELEMENT_STYLES['목'];

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onTap}
            className={`
                flex flex-col gap-2 p-3 rounded-2xl items-center min-w-[75px] cursor-pointer transition-all duration-300
                ${isSelected
                    ? 'bg-white/15 border-2 border-purple-400 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                backdrop-blur-xl
            `}
        >
            <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                {KOREAN_LABELS[label] || label}
            </span>

            {/* Gan (Stem) */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white 
                    shadow-lg ${ganStyle.glow}
                    bg-gradient-to-br ${ganStyle.gradient}
                `}
            >
                {gan.char}
            </motion.div>
            <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-500">{ganStyle.label}</span>
                <span className="text-[10px] text-white/70 font-medium">{tenGods.gan || '-'}</span>
            </div>

            {/* Ji (Branch) */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white 
                    shadow-lg ${jiStyle.glow}
                    bg-gradient-to-br ${jiStyle.gradient}
                `}
            >
                {ji.char}
            </motion.div>
            <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-500">{jiStyle.label}</span>
                <span className="text-[10px] text-white/70 font-medium">{tenGods.ji || '-'}</span>
            </div>
        </motion.div>
    );
};

interface SajuVisualGridProps {
    userProfile?: any;
}

export default function SajuVisualGrid({ userProfile }: SajuVisualGridProps) {
    const [selectedPillar, setSelectedPillar] = useState<number | null>(null);

    // Helper to get element from character or element name
    const getElement = (element: string | undefined): string => {
        if (!element) return '목';
        const map: Record<string, string> = {
            '목': '목', 'wood': '목',
            '화': '화', 'fire': '화',
            '토': '토', 'earth': '토',
            '금': '금', 'metal': '금',
            '수': '수', 'water': '수'
        };
        return map[element.toLowerCase()] || '목';
    };

    // Extract pillars from userProfile or use demo data
    const pillars = userProfile?.saju?.pillars;

    const data: PillarData[] = pillars ? [
        {
            label: "Hour",
            gan: { char: pillars.hour?.stem || '?', color: '', element: getElement(pillars.hour?.stemElement) },
            ji: { char: pillars.hour?.branch || '?', color: '', element: getElement(pillars.hour?.branchElement) },
            tenGods: { gan: pillars.hour?.stemTenGod || '', ji: pillars.hour?.branchTenGod || '' }
        },
        {
            label: "Day",
            gan: { char: pillars.day?.stem || '?', color: '', element: getElement(pillars.day?.stemElement) },
            ji: { char: pillars.day?.branch || '?', color: '', element: getElement(pillars.day?.branchElement) },
            tenGods: { gan: '본원', ji: pillars.day?.branchTenGod || '' }
        },
        {
            label: "Month",
            gan: { char: pillars.month?.stem || '?', color: '', element: getElement(pillars.month?.stemElement) },
            ji: { char: pillars.month?.branch || '?', color: '', element: getElement(pillars.month?.branchElement) },
            tenGods: { gan: pillars.month?.stemTenGod || '', ji: pillars.month?.branchTenGod || '' }
        },
        {
            label: "Year",
            gan: { char: pillars.year?.stem || '?', color: '', element: getElement(pillars.year?.stemElement) },
            ji: { char: pillars.year?.branch || '?', color: '', element: getElement(pillars.year?.branchElement) },
            tenGods: { gan: pillars.year?.stemTenGod || '', ji: pillars.year?.branchTenGod || '' }
        }
    ] : [
        // Demo data
        { label: "Hour", gan: { char: '정', color: '', element: '화' }, ji: { char: '미', color: '', element: '토' }, tenGods: { gan: '식신', ji: '편재' } },
        { label: "Day", gan: { char: '을', color: '', element: '목' }, ji: { char: '축', color: '', element: '토' }, tenGods: { gan: '본원', ji: '편재' } },
        { label: "Month", gan: { char: '병', color: '', element: '화' }, ji: { char: '인', color: '', element: '목' }, tenGods: { gan: '상관', ji: '겁재' } },
        { label: "Year", gan: { char: '갑', color: '', element: '목' }, ji: { char: '자', color: '', element: '수' }, tenGods: { gan: '겁재', ji: '편인' } }
    ];

    // Calculate 오행 counts
    const ohaengCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    data.forEach(p => {
        const ganEl = p.gan.element as keyof typeof ohaengCounts;
        const jiEl = p.ji.element as keyof typeof ohaengCounts;
        if (ohaengCounts[ganEl] !== undefined) ohaengCounts[ganEl]++;
        if (ohaengCounts[jiEl] !== undefined) ohaengCounts[jiEl]++;
    });
    const totalElements = Object.values(ohaengCounts).reduce((a, b) => a + b, 0) || 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Glassmorphic Container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            🏛️ 사주 원국
                        </h3>
                        <p className="text-gray-500 text-xs">터치하여 상세 정보 확인</p>
                    </div>
                    <div className="bg-purple-500/20 px-2 py-1 rounded-full text-[10px] text-purple-300 border border-purple-500/30">
                        팔자 분석
                    </div>
                </div>

                {/* Pillar Cards */}
                <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                    {data.map((p, i) => (
                        <PillarCard
                            key={i}
                            {...p}
                            onTap={() => setSelectedPillar(selectedPillar === i ? null : i)}
                            isSelected={selectedPillar === i}
                        />
                    ))}
                </div>

                {/* Selected Pillar Detail */}
                <AnimatePresence>
                    {selectedPillar !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                        >
                            <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-purple-300 font-bold">
                                        {KOREAN_LABELS[data[selectedPillar].label]} 상세
                                    </span>
                                    <button
                                        onClick={() => setSelectedPillar(null)}
                                        className="text-gray-500 hover:text-white text-xs"
                                    >
                                        ✕ 닫기
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-500">천간:</span>
                                        <span className="text-white ml-2 font-bold">{data[selectedPillar].gan.char}</span>
                                        <span className="text-gray-400 ml-1">({data[selectedPillar].gan.element})</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">십신:</span>
                                        <span className="text-emerald-400 ml-2 font-bold">{data[selectedPillar].tenGods.gan || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">지지:</span>
                                        <span className="text-white ml-2 font-bold">{data[selectedPillar].ji.char}</span>
                                        <span className="text-gray-400 ml-1">({data[selectedPillar].ji.element})</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">십신:</span>
                                        <span className="text-emerald-400 ml-2 font-bold">{data[selectedPillar].tenGods.ji || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 오행 분석 Bar - Dynamic */}
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-xs font-bold">오행 분석</span>
                        <div className="flex gap-2 text-[10px]">
                            {Object.entries(ohaengCounts).map(([el, count]) => (
                                <span key={el} className="flex items-center gap-1">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: ELEMENT_STYLES[el]?.bg || '#666' }}
                                    />
                                    <span className="text-gray-400">{el}{count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex h-3 w-full rounded-full overflow-hidden bg-white/5">
                        {Object.entries(ohaengCounts).map(([el, count]) => (
                            <motion.div
                                key={el}
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / totalElements) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={`bg-gradient-to-r ${ELEMENT_STYLES[el]?.gradient || 'from-gray-500 to-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
