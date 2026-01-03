"use client";

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { LifeCycleEngine } from '@/lib/saju/LifeCycleEngine';

interface Props {
    onSelectAge: (age: number, score: number) => void;
}

export default function LifeCurveChart({ onSelectAge }: Props) {
    const data = useMemo(() => {
        // Mock birthdate for demo
        return LifeCycleEngine.calculate(new Date('1990-01-01')).chartData;
    }, []);

    return (
        <div className="w-full h-[250px] mt-6 relative">
            <h3 className="text-gray-300 text-sm font-bold mb-4 px-2">📈 인생 운세 그래프 (터치하여 탐색)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    onClick={(e) => {
                        if (e && e.activePayload && e.activePayload[0]) {
                            const p = e.activePayload[0].payload;
                            onSelectAge(p.age, p.score);
                        }
                    }}
                >
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="age" tick={{ fill: '#666', fontSize: 10 }} interval={4} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#9ca3af' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#8B5CF6"
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        activeDot={{ r: 6, fill: '#fff', stroke: '#8B5CF6', strokeWidth: 2 }}
                    />
                    <ReferenceLine y={50} stroke="#ffffff20" strokeDasharray="3 3" />
                </AreaChart>
            </ResponsiveContainer>

            <div className="absolute top-2 right-4 bg-purple-500/20 px-2 py-1 rounded text-[10px] text-purple-300 border border-purple-500/30">
                120년 흐름
            </div>
        </div>
    );
}
