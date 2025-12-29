'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function RadarChartView() {
    const { reportData } = useReportStore();

    if (!reportData) return null;

    const chartData = [
        { subject: '목(Wood)', A: reportData.saju.elements.wood, fullMark: 100 },
        { subject: '화(Fire)', A: reportData.saju.elements.fire, fullMark: 100 },
        { subject: '토(Earth)', A: reportData.saju.elements.earth, fullMark: 100 },
        { subject: '금(Metal)', A: reportData.saju.elements.metal, fullMark: 100 },
        { subject: '수(Water)', A: reportData.saju.elements.water, fullMark: 100 },
    ];

    return (
        <div className="h-full flex flex-col pt-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <span className="text-primary-gold text-xs font-bold tracking-widest uppercase">Page 04</span>
                <h2 className="text-2xl font-serif text-white mt-2">나의 에너지 지도</h2>
                <p className="text-gray-400 text-sm mt-2">다섯 가지 오행의 균형을 확인하세요.</p>
            </motion.div>

            {/* Fixed height to ensure rendering */}
            <div className="w-full h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="none" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                            itemStyle={{ color: '#658c42' }}
                        />
                        <Radar
                            name="My Energy"
                            dataKey="A"
                            stroke="#658c42"
                            strokeWidth={3}
                            fill="#658c42"
                            fillOpacity={0.5}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white/5 p-6 rounded-xl mt-8 border border-white/5">
                <h3 className="text-white font-bold mb-2">💡 분석 결과</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    당신은 <strong className="text-primary-gold">{reportData.saju.dayMaster}</strong>의 기운을 타고났습니다.
                    {reportData.saju.elements.metal > 80 && " 특히 금(Metal)의 기운이 강하여 결단력과 원칙을 중요시하는 성향이 돋보입니다."}
                </p>
            </div>
        </div>
    );
}
