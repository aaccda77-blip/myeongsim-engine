'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Feather, Leaf } from 'lucide-react';

export default function IdentityView() {
    const { reportData } = useReportStore();
    if (!reportData) return null;

    return (
        <div className="h-full flex flex-col pt-8 pb-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
            >
                <span className="text-primary-olive text-xs font-bold tracking-widest uppercase">03. My Identity</span>
                <h2 className="text-2xl font-serif text-white mt-2">나의 본질 (Day Master)</h2>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* 3D Visual Placeholder */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-48 h-48 rounded-full bg-gradient-to-tr from-green-900 to-primary-olive/30 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(101,140,66,0.2)]"
                >
                    <div className="absolute inset-0 border border-primary-olive/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    <Leaf className="w-20 h-20 text-primary-olive drop-shadow-[0_0_15px_rgba(101,140,66,0.5)]" />
                </motion.div>

                <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-serif text-white mb-2"
                >
                    {reportData.saju.dayMasterTrait}
                </motion.h3>
                <p className="text-primary-olive font-bold text-sm bg-primary-olive/10 px-3 py-1 rounded-full mb-8">
                    {reportData.saju.dayMaster}
                </p>

                {/* Keywords */}
                <div className="grid grid-cols-3 gap-3 w-full">
                    {reportData.saju.keywords.map((keyword, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center gap-2"
                        >
                            <Feather className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-200 font-medium">{keyword}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
