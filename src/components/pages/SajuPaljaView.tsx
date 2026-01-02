'use client';

import { motion } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { Wind, Flame, Mountain, Droplets, Swords, HelpCircle, ArrowLeft } from 'lucide-react';

type ElementType = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water' | 'Unknown';

const ELEMENT_CONFIG: Record<ElementType, { label: string; icon: any; color: string; bgGlow: string }> = {
    Wood: { label: '목(木)', icon: <Wind size={18} />, color: '#10B981', bgGlow: 'rgba(16, 185, 129, 0.2)' },
    Fire: { label: '화(火)', icon: <Flame size={18} />, color: '#EF4444', bgGlow: 'rgba(239, 68, 68, 0.2)' },
    Earth: { label: '토(土)', icon: <Mountain size={18} />, color: '#F59E0B', bgGlow: 'rgba(245, 158, 11, 0.2)' },
    Metal: { label: '금(金)', icon: <Swords size={18} />, color: '#9CA3AF', bgGlow: 'rgba(156, 163, 175, 0.2)' },
    Water: { label: '수(水)', icon: <Droplets size={18} />, color: '#3B82F6', bgGlow: 'rgba(59, 130, 246, 0.2)' },
    Unknown: { label: '미정', icon: <HelpCircle size={18} />, color: '#4B5563', bgGlow: 'rgba(75, 85, 99, 0.1)' }
};

const getElementKeyFromColor = (color: string | undefined): ElementType => {
    if (!color || typeof color !== 'string') return 'Unknown';
    const c = color.toUpperCase();
    if (c.includes('10B981')) return 'Wood';
    if (c.includes('EF4444')) return 'Fire';
    if (c.includes('F59E0B')) return 'Earth';
    if (c.includes('9CA3AF')) return 'Metal';
    if (c.includes('3B82F6')) return 'Water';
    return 'Unknown';
};

export default function SajuPaljaView() {
    const { reportData } = useReportStore();

    // [Safety Guard] 데이터가 없거나 형식이 깨졌을 때를 대비한 방어 로직
    const pillars = (reportData && reportData.saju && reportData.saju.fourPillars) ? reportData.saju.fourPillars : {
        year: { gan: '?', ji: '?', ganColor: '', jiColor: '' },
        month: { gan: '?', ji: '?', ganColor: '', jiColor: '' },
        day: { gan: '?', ji: '?', ganColor: '', jiColor: '' },
        time: { gan: '?', ji: '?', ganColor: '', jiColor: '' },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, rotateX: 15 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { delay: i * 0.1, type: 'spring', stiffness: 60 }
        })
    };

    const PillarCard = ({ title, subTitle, data, index }: { title: string, subTitle: string, data: any, index: number }) => {
        // [Safety Guard] data 자체가 없거나 gan이 없을 때 처리
        const safeData = data || { gan: '?', ji: '?', ganColor: '', jiColor: '' };
        const isUnknown = !safeData.gan || safeData.gan === '?';
        const ganKey = isUnknown ? 'Unknown' : getElementKeyFromColor(safeData.ganColor);
        const jiKey = isUnknown ? 'Unknown' : getElementKeyFromColor(safeData.jiColor);

        const ganConf = ELEMENT_CONFIG[ganKey] || ELEMENT_CONFIG['Unknown'];
        const jiConf = ELEMENT_CONFIG[jiKey] || ELEMENT_CONFIG['Unknown'];

        return (
            <motion.div
                custom={index}
                variants={cardVariants as any}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full h-full relative group perspective-1000 z-0 hover:z-50"
            >
                <div className={`relative h-full flex flex-col items-center justify-between p-4 rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm transition-all duration-300 
                    ${isUnknown
                        ? 'bg-white/5 border-white/5 grayscale'
                        : 'bg-gradient-to-b from-[#1a1f35]/90 to-[#0f1219]/90 border-white/5 group-hover:border-white/20 group-hover:shadow-2xl'
                    }`}
                >
                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30 pointer-events-none" />

                    {/* Title */}
                    <div className="z-10 flex flex-col items-center mb-2">
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] md:text-xs text-gray-400 font-serif tracking-widest uppercase">{title}</span>
                        </div>
                        <span className="text-[9px] text-primary-olive/60 mt-1 font-serif">{subTitle}</span>
                    </div>

                    {/* Characters */}
                    <div className="flex-1 flex flex-col justify-center items-center gap-4 md:gap-8 w-full z-10">
                        {/* Heaven */}
                        <div className="flex flex-col items-center">
                            <motion.span
                                className={`font-serif font-black ${isUnknown ? 'text-3xl text-gray-600' : 'text-4xl md:text-6xl'}`}
                                style={!isUnknown ? { color: ganConf.color, textShadow: `0 0 20px ${ganConf.bgGlow}` } : {}}
                            >
                                {isUnknown ? '?' : safeData.gan}
                            </motion.span>
                            {!isUnknown && <span className="text-[9px] text-white/40 mt-1">{ganConf.label}</span>}
                        </div>

                        <div className="w-8 h-[1px] bg-white/10" />

                        {/* Earth */}
                        <div className="flex flex-col items-center">
                            <motion.span
                                className={`font-serif font-black ${isUnknown ? 'text-3xl text-gray-600' : 'text-4xl md:text-6xl'}`}
                                style={!isUnknown ? { color: jiConf.color, textShadow: `0 0 20px ${jiConf.bgGlow}` } : {}}
                            >
                                {isUnknown ? '?' : safeData.ji}
                            </motion.span>
                            {!isUnknown && <span className="text-[9px] text-white/40 mt-1">{jiConf.label}</span>}
                        </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-2 flex gap-3 opacity-40 group-hover:opacity-80 transition-opacity z-10 h-[18px]">
                        {!isUnknown ? (
                            <span style={{ color: jiConf.color }}>{jiConf.icon}</span>
                        ) : (
                            <span className="text-gray-600 flex items-center gap-1">
                                <HelpCircle size={14} />
                                <span className="text-[9px]">Unknown</span>
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full min-h-full flex flex-col p-4 md:p-8 relative overflow-hidden bg-[#050505]">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-primary-olive/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col items-center mb-6 md:mb-10 shrink-0">
                <h1 className="text-2xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                    四柱八字 <span className="text-lg font-light text-gray-600 ml-1">Analysis</span>
                </h1>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center">

                {/* Reading Direction Guide */}
                <div className="hidden lg:flex justify-end w-full mb-2 opacity-50">
                    <span className="text-[10px] text-gray-400 tracking-widest uppercase flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3 text-primary-olive" />
                        Reading Direction (Right to Left)
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:flex-row-reverse gap-3 md:gap-6 h-auto lg:h-[500px]">
                    <div className="lg:flex-1 h-full">
                        <PillarCard title="년주 (Year)" subTitle="근(根) - 초년" data={pillars.year} index={0} />
                    </div>
                    <div className="lg:flex-1 h-full">
                        <PillarCard title="월주 (Month)" subTitle="묘(苗) - 청년" data={pillars.month} index={1} />
                    </div>
                    <div className="lg:flex-1 h-full">
                        <PillarCard title="일주 (Day)" subTitle="화(花) - 중년" data={pillars.day} index={2} />
                    </div>
                    <div className="lg:flex-1 h-full">
                        <PillarCard title="시주 (Time)" subTitle="실(實) - 말년" data={pillars.time} index={3} />
                    </div>
                </div>
            </div>
        </div>
    );
}
