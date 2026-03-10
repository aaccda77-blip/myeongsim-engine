'use client';

import { motion } from 'framer-motion';
import { Book, Lock, Sparkles } from 'lucide-react';
import React from 'react';

interface BookCoverProps {
    name: string;
    date: string;
    onOpen: () => void;
}

export default function BookCover({ name, date, onOpen }: BookCoverProps) {
    return (
        <div className="relative cursor-pointer group perspective-1000" onClick={onOpen}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary-olive/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* The Book */}
            <motion.div
                whileHover={{ scale: 1.02, rotateY: -5 }}
                className="relative w-[300px] h-[450px] md:w-[360px] md:h-[520px] bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black rounded-r-2xl rounded-l-md shadow-2xl border-r-4 border-b-4 border-white/5 flex flex-col items-center justify-between py-16 px-8 text-center over"
                style={{
                    boxShadow: '20px 20px 60px rgba(0,0,0,0.5), inset 1px 1px 2px rgba(255,255,255,0.1)'
                }}
            >
                {/* Book Spine Hinges */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-900 to-black border-l border-white/10 rounded-l-md" />

                {/* Top Decoration */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border border-primary-olive/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 border border-primary-olive/10 rounded-full animate-ping opacity-30" />
                        <Sparkles className="w-6 h-6 text-primary-olive" />
                    </div>
                    <span className="text-[10px] text-primary-olive uppercase tracking-[0.3em]">Confidential Record</span>
                </div>

                {/* Title */}
                <div className="space-y-4 relative z-10">
                    <h1 className="text-3xl font-serif font-bold text-white leading-tight">
                        MIND<br />TOTEM
                    </h1>
                    <div className="h-[1px] w-12 bg-gray-700 mx-auto" />
                    <p className="text-lg text-gray-400 font-serif italic">
                        The Soul Archive<br />of {name}
                    </p>
                </div>

                {/* Bottom Unlock UI */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Lock className="w-3 h-3" />
                        <span>Touch to Unlock</span>
                    </div>
                </div>

                {/* Ambient Light Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black pointer-events-none rounded-r-2xl" />
            </motion.div>
        </div>
    );
}
