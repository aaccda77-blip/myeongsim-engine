"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DailyData {
    energyScore: number;
    mode: 'Attack' | 'Defense' | 'Recovery';
    advice: string;
    goldenTime: string;
    ganji: string;
}

export const DailyBiorhythmWidget = ({ dayMaster }: { dayMaster: string }) => {
    const [data, setData] = useState<DailyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/secure/daily-biorhythm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dayMaster })
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json.data);
                }
            } catch (e) {
                console.error("Failed to fetch biorhythm", e);
            } finally {
                setLoading(false);
            }
        };

        if (dayMaster) {
            fetchData();
        }
    }, [dayMaster]);

    if (loading) return <div className="h-24 w-full animate-pulse bg-gray-800 rounded-xl" />;
    if (!data) return null;

    const getModeColor = (mode: string) => {
        if (mode === 'Attack') return '#EF4444'; // Red/Fire
        if (mode === 'Recovery') return '#10B981'; // Green/Wood
        return '#3B82F6'; // Blue/Water (Defense)
    };

    const color = getModeColor(data.mode);

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            border: `1px solid ${color}40`,
            boxShadow: `0 4px 20px ${color}10`
        }}>
            {/* Header: Battery & Score */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-16 border-2 border-gray-600 rounded-lg p-1">
                        <motion.div
                            initial={{ height: '0%' }}
                            animate={{ height: `${data.energyScore}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{
                                width: '100%',
                                position: 'absolute',
                                bottom: '2px',
                                left: '2px',
                                right: '2px',
                                background: color,
                                borderRadius: '4px'
                            }}
                        />
                        {/* Battery Nipple */}
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-gray-600 rounded-t-sm" />
                    </div>
                    <div>
                        <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Today's Energy</div>
                        <div className="text-3xl font-black text-white flex items-baseline gap-1">
                            {data.energyScore}<span className="text-sm font-normal text-gray-400">%</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: `${color}20`,
                        color: color,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                    }}>
                        {data.mode === 'Attack' ? '⚔️ ATTACK' : data.mode === 'Defense' ? '🛡️ DEFENSE' : '🌿 RECHARGE'}
                    </div>
                    <div className="text-gray-400 text-xs">{data.ganji}일 (오늘의 운)</div>
                </div>
            </div>

            {/* Advice Text */}
            <p className="text-gray-200 text-sm font-medium leading-relaxed mb-4">
                "{data.advice}"
            </p>

            {/* Golden Time & Boss Radar */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                    <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Golden Time ⏰</div>
                    <div className="text-white text-xs font-bold">{data.goldenTime}</div>
                </div>
                <button
                    className="bg-gray-800/50 rounded-xl p-3 border border-gray-700 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    onClick={() => alert("동료/상사의 사주를 입력하여 오늘의 기분을 미리 파악하세요! (Coming Soon)")}
                >
                    <span className="text-[10px] uppercase font-bold text-gray-500">Boss Radar</span>
                    <span className="text-lg">📡</span>
                </button>
            </div>
        </div>
    );
};
