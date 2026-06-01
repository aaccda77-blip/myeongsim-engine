'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MindResetSection from './MindResetSection';

interface MindResetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MindResetModal({ isOpen, onClose }: MindResetModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-slate-950 border border-emerald-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(16,185,129,0.15)] relative custom-scrollbar flex flex-col"
                >
                    {/* 닫기 버튼 */}
                    <div className="absolute top-4 right-4 z-[3100]">
                        <button
                            onClick={onClose}
                            className="bg-gray-800/80 p-2 rounded-full text-gray-400 hover:text-white border border-gray-700/50 backdrop-blur-sm transition-all shadow-lg"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="w-full h-full p-2 pt-14">
                        <MindResetSection />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
