import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardList, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

interface SajuAnalysisReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SajuAnalysisReportModal({ isOpen, onClose }: SajuAnalysisReportModalProps) {
    const { reportData } = useReportStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Client-side check
        return () => setMounted(false);
    }, []);

    // 1. Data Calculation (Real-time)
    const analysis = useMemo(() => {
        if (!reportData?.saju) return null;

        const { dayMaster, elements } = reportData.saju;

        // Identity (Day Master)
        // Handle object vs string dayMaster
        const dmChar = typeof dayMaster === 'string' ? dayMaster.charAt(0) : (dayMaster as any)?.char || '?';
        const dmElement = typeof dayMaster === 'string' ? '본질' : (dayMaster as any)?.label || '본질'; // Simple fallback

        // Energy Balance (Dominant/Weakest)
        // elements is { wood: 20, fire: 10, ... }
        const entries = Object.entries(elements || {});
        // Sort by percentage descending
        const sorted = entries.sort(([, a], [, b]) => (b as number) - (a as number));

        const dominant = sorted[0];
        const weakest = sorted[sorted.length - 1];

        const ELEMENT_KOR: Record<string, string> = {
            wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
        };
        const ELEMENT_ICON: Record<string, string> = {
            wood: '🌲', fire: '🔥', earth: '⛰️', metal: '⚔️', water: '🌊'
        };

        // State (Mock Core Dynamics Engine for now - consistent hash based on dayMaster)
        // In a real app, this would come from the expensive calculation engine
        const levelBase = 400;
        const levelOffset = (dmChar.charCodeAt(0) % 100);
        const level = levelBase + levelOffset;

        return {
            identity: {
                char: dmChar,
                desc: getDayMasterDesc(dmChar)
            },
            energy: {
                max: { label: ELEMENT_KOR[dominant[0]], icon: ELEMENT_ICON[dominant[0]], val: dominant[1] },
                min: { label: ELEMENT_KOR[weakest[0]], icon: ELEMENT_ICON[weakest[0]], val: weakest[1] }
            },
            state: {
                level: level,
                trend: '상승 국면 📈', // Simulation
                msg: getLevelMessage(level)
            }
        };
    }, [reportData]);

    // Portal Target Logic
    if (!isOpen || !mounted) return null;

    const modalContent = (
        <React.Fragment>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
                {/* Modal Container - Obsidian Glass Style */}
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm bg-[#0B0915]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
                    style={{
                        boxShadow: '0 0 40px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)'
                    }}
                >
                    {/* Living Background Effect inside Modal */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.1)_0%,transparent_50%)] animate-slow-spin" />
                    </div>

                    {/* Header */}
                    <div className="relative z-10 p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div>
                            <h2 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F4E2D8] via-[#BA9F8F] to-[#F4E2D8]"
                                style={{ textShadow: '0 2px 10px rgba(186,159,143,0.3)' }}
                            >
                                사주 분석 리포트
                            </h2>
                            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">Core Dynamics Analysis</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 space-y-6">

                        {/* Section 1: My 5 Elements & Characters */}
                        <ReportSection title="나의 오행과 글자" icon={<UserIcon />}>
                            {analysis ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700/30 to-amber-900/30 border border-amber-500/30 flex items-center justify-center text-2xl relative group">
                                        <span className="relative z-10">{analysis.identity.char}</span>
                                        <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full group-hover:bg-amber-500/40 transition-all" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">당신의 본질은</p>
                                        <p className="text-lg font-bold text-[#F4E2D8]">
                                            <span className="text-amber-400">&apos;{analysis.identity.desc}&apos;</span> 입니다.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </ReportSection>

                        {/* Section 2: Energy Balance */}
                        <ReportSection title="에너지 균형" icon={<Activity size={14} className="text-rose-400" />}>
                            {analysis ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <EnergyCard
                                        label="가장 강한 에너지"
                                        value={analysis.energy.max.label}
                                        icon={analysis.energy.max.icon}
                                        color="text-amber-200"
                                        bg="bg-amber-900/20"
                                        border="border-amber-500/30"
                                    />
                                    <EnergyCard
                                        label="가장 약한 에너지"
                                        value={analysis.energy.min.label}
                                        icon={analysis.energy.min.icon}
                                        color="text-blue-200"
                                        bg="bg-blue-900/20"
                                        border="border-blue-500/30"
                                    />
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </ReportSection>

                        {/* Section 3: My Current State */}
                        <ReportSection title="나의 현재 상태" icon={<TrendingUp size={14} className="text-emerald-400" />}>
                            {analysis ? (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                                    {/* Breathing Effect */}
                                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />

                                    <div className="relative z-10 flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">의식 레벨 (Consciousness)</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-serif font-bold text-white">{analysis.state.level}</span>
                                                <span className="text-xs text-emerald-400 font-bold">{analysis.state.msg}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                                                {analysis.state.trend}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </ReportSection>

                    </div>

                    {/* Footer */}
                    <div className="relative z-10 p-4 border-t border-white/5 bg-[#08070F] text-center">
                        <p className="text-[10px] text-gray-600">
                            * 이 리포트는 '명심코칭 워크북' 작성을 위해 제공됩니다.
                        </p>
                    </div>

                </motion.div>
            </motion.div>
        </React.Fragment>
    );

    return createPortal(modalContent, document.body);
}

// Subcomponents based on design spec
function ReportSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center border border-white/5">
                    {icon}
                </div>
                <h3 className="text-sm font-bold text-gray-200 font-serif">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function EnergyCard({ label, value, icon, color, bg, border }: any) {
    return (
        <div className={`p-3 rounded-xl border ${bg} ${border} flex flex-col items-center justify-center gap-1`}>
            <span className="text-[10px] text-gray-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className={`font-bold ${color}`}>{value}</span>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <AlertCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">데이터가 없습니다.<br />채팅을 통해 정보를 입력해주세요.</p>
        </div>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-purple-300">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

// Helper Functions
function getDayMasterDesc(char: string) {
    const map: Record<string, string> = {
        '甲': '곧게 뻗는 큰 나무', '을': '유연한 덩굴 식물',
        '丙': '세상을 비추는 태양', '정': '어둠을 밝히는 촛불',
        '戊': '믿음직한 큰 산', '기': '만물을 기르는 밭',
        '庚': '강인한 바위/원석', '신': '섬세한 보석/칼',
        '壬': '깊고 넓은 바다', '계': '스며드는 봄비'
    };
    return map[char] || '미지의 탐험가';
}

function getLevelMessage(level: number) {
    if (level >= 500) return '사랑/기쁨';
    if (level >= 400) return '이성/통찰';
    if (level >= 300) return '자발성';
    if (level >= 200) return '용기';
    return '현재 측정 중';
}
