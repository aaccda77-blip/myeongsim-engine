// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, AlertCircle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { getDailyHarmony, DailyHarmonyResult } from '@/modules/DailyJincheonEngine';
import PaybackBanner from './PaybackBanner';

interface DailyScanWidgetProps {
    userDayMaster?: string; // 예: '辛'
    userProfile?: any;
    onOpenMicroPass?: () => void; // 890원 핀포인트 가이드전 팝업 오픈 핸들러
}

export default function DailyScanWidget({ userDayMaster = '辛', onOpenMicroPass }: DailyScanWidgetProps) {
    const [energyScore, setEnergyScore] = useState<number>(5);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [harmonyData, setHarmonyData] = useState<DailyHarmonyResult | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Calculate today's harmony using existing DailyJincheonEngine
        const result = getDailyHarmony(userDayMaster);
        setHarmonyData(result);

        // Check if user already checked in today
        const savedCheckin = localStorage.getItem(`myeongsim_daily_scan_${todayStr}`);
        if (savedCheckin) {
            try {
                const parsed = JSON.parse(savedCheckin);
                setEnergyScore(parsed.energyScore || 5);
                setSelectedEmotion(parsed.selectedEmotion || null);
                setIsCheckedIn(true);
            } catch (e) {
                console.error(e);
            }
        }
    }, [userDayMaster]);

    const handleCheckinSubmit = () => {
        if (!selectedEmotion) {
            alert('오늘 가장 강하게 느껴지는 감정을 하나 선택해 주세요!');
            return;
        }
        setIsCheckedIn(true);
        localStorage.setItem(`myeongsim_daily_scan_${todayStr}`, JSON.stringify({
            energyScore,
            selectedEmotion,
            timestamp: new Date().toISOString()
        }));

        // If user feels '조급함', '불안', or energy <= 3, automatically open MicroPass modal!
        if ((selectedEmotion === '조급함' || selectedEmotion === '불안' || energyScore <= 3) && onOpenMicroPass) {
            setTimeout(() => {
                onOpenMicroPass();
            }, 600);
        }
    };

    if (!harmonyData) return null;

    const isHighDistortion = selectedEmotion === '조급함' || selectedEmotion === '불안' || energyScore <= 3;

    return (
        <div className="w-full bg-gradient-to-br from-[#0B0F19] via-[#0E1424] to-[#070A12] border border-amber-500/25 rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] my-4 text-left relative overflow-hidden">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-amber-500/15 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <Zap size={12} className="fill-amber-300" />
                        Daily Scan 3초 자각
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                        오늘 일운: <strong className="text-amber-200 font-normal">{harmonyData.todayGan}{harmonyData.todayZhi}일 ({harmonyData.tenGod})</strong>
                    </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    0원 자동 케어
                </span>
            </div>

            {/* Content Area */}
            {!isCheckedIn ? (
                /* STEP 1: 10-Second Interactive Checkin */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {/* CBT Daily Diagnosis Message */}
                    <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-gray-300 space-y-1">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-400" />
                            <span>오늘의 {harmonyData.tenGod} 기운 자각</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            {harmonyData.scanMessage}
                        </p>
                    </div>

                    {/* 1. Energy Slider */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-300 font-bold">1. 오늘 나의 에너지는?</span>
                            <span className="text-amber-300 font-black font-mono text-sm">{energyScore}점 {energyScore <= 3 ? '😴' : energyScore >= 8 ? '⚡' : '🙂'}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={energyScore}
                            onChange={(e) => setEnergyScore(Number(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                    </div>

                    {/* 2. Emotion Selector */}
                    <div className="space-y-1.5">
                        <span className="text-xs text-gray-300 font-bold block">2. 지금 내 마음에 가장 큰 기운은?</span>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[
                                { id: '조급함', label: '⚡ 조급함', color: 'border-amber-500/50 text-amber-300' },
                                { id: '불안', label: '😰 불안', color: 'border-purple-500/50 text-purple-300' },
                                { id: '의욕', label: '🔥 의욕', color: 'border-emerald-500/50 text-emerald-300' },
                                { id: '무기력', label: '🛋️ 무기력', color: 'border-blue-500/50 text-blue-300' },
                                { id: '평온', label: '🧘 평온', color: 'border-teal-500/50 text-teal-300' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedEmotion(item.id)}
                                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${selectedEmotion === item.id ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-[1.03]' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Checkin Button */}
                    <button
                        onClick={handleCheckinSubmit}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                        <span>3초 체크인 완료 & 가이드 받기</span>
                        <ArrowRight size={14} />
                    </button>
                </motion.div>
            ) : (
                /* STEP 2: Completed Scan Result & Auto Revenue Trigger */
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span>오늘의 3초 자각 완료 (에너지 {energyScore}점 / {selectedEmotion})</span>
                        </div>
                        <button
                            onClick={() => setIsCheckedIn(false)}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                        >
                            <RefreshCw size={10} /> 다시 체크
                        </button>
                    </div>

                    {/* Today's Breakthrough Prescription */}
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">오늘의 멘탈 돌파 키워드:</span>
                            <span className="text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                                ✨ {harmonyData.breakthroughKeyword}
                            </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed pt-1">
                            {harmonyData.syncMessage}
                        </p>
                        <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20 mt-1">
                            🎯 <strong>1분 행동 미션:</strong> {harmonyData.shiftMission}
                        </div>
                    </div>

                    {/* Payback 24h Countdown Banner */}
                    <PaybackBanner onUpgradeClick={onOpenMicroPass} />

                    {/* Revenue Upsell Banner (If Energy Low or Anxiety/Impatience Selected) */}
                    {isHighDistortion && (
                        <motion.div
                            initial={{ scale: 0.96 }}
                            animate={{ scale: 1 }}
                            onClick={() => onOpenMicroPass && onOpenMicroPass()}
                            className="bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-purple-900/30 border border-amber-500/50 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                                    ⚡ 오늘 {harmonyData.tenGod}({selectedEmotion}) 왜곡 억제 가이드
                                </span>
                                <span className="text-[10px] text-gray-300">890원 핀포인트 가이드전 (100% 환급 특가)</span>
                            </div>
                            <span className="text-xs bg-amber-400 text-black font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                                890원 가이드 받기 <ArrowRight size={12} />
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
