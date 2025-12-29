'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function LifeWaveView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">09. Life Wave</span>
                <h2 className="text-2xl font-serif text-white mt-2">인생의 파동 (10년 대운)</h2>
                <p className="text-sm text-gray-400 mt-2">당신의 인생 그래프는 지금 어디쯤 와 있을까요?</p>
            </motion.div>

            <div className="w-full h-[300px] mt-8 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.lifeWave} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="age"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(val) => `${val}세`}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#334155', borderRadius: '12px' }}
                            itemStyle={{ color: '#658c42' }}
                            formatter={(val) => [`${val}점`, '운세 점수']}
                            labelFormatter={(label) => `${label}세 대운`}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#658c42"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#1f2937', stroke: '#658c42', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#658c42' }}
                            animationDuration={2000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 bg-white/5 border border-white/5 p-4 rounded-xl">
                <h4 className="text-white font-bold text-sm mb-2">💡 분석 포인트</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                    30대에 급격한 상승 곡선이 보입니다. 이때가 인생의 <strong>황금기(Golden Age)</strong>입니다.
                    지금 준비하는 노력들이 이때 큰 결실을 맺게 됩니다.
                </p>
            </div>
        </div>
    );
}
