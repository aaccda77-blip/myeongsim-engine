'use client';

import { motion } from 'framer-motion';

export default function TotemCanvas({ profile }: { profile: any }) {
    // Determine 5-elements (simplified Mock)
    const elements = [
        { name: '木', color: '#4ADE80', value: 40 },
        { name: '火', color: '#EF4444', value: 70 },
        { name: '土', color: '#D97706', value: 30 },
        { name: '金', color: '#E5E7EB', value: 60 },
        { name: '水', color: '#3B82F6', value: 50 },
    ];

    return (
        <div className="relative w-full h-64 flex items-end justify-center gap-4 md:gap-8 px-8">
            {elements.map((el, i) => (
                <div key={el.name} className="flex flex-col items-center gap-2 group">
                    <div className="relative w-8 md:w-12 h-40 bg-gray-800 rounded-t-lg overflow-hidden flex items-end">
                        {/* Fill Bar */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${el.value}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                            className="w-full relative"
                            style={{ backgroundColor: el.color }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </motion.div>
                    </div>

                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-xs font-serif font-bold text-gray-400">{el.name}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-600 mt-1 group-hover:bg-primary-olive transition-colors" />
                    </motion.div>
                </div>
            ))}

            {/* Background Grid Line */}
            <div className="absolute bottom-10 left-0 right-0 h-[1px] bg-white/10 pointer-events-none" />
        </div>
    );
}
