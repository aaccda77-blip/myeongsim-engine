'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MirrorRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MirrorRoomModal({ isOpen, onClose }: MirrorRoomModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl h-[85vh] bg-[#08090a] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
                    >
                        {/* 플로팅 닫기 버튼 */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2.5 bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-full transition-all duration-200 cursor-pointer active:scale-95 text-zinc-400 hover:text-white"
                            aria-label="닫기"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* 거울의 방 컨텐츠 Iframe */}
                        <div className="w-full h-full flex-grow relative">
                            <iframe 
                                src="/mind_refresh.html" 
                                className="w-full h-full border-0 select-none"
                                title="알아차림의 거울"
                                sandbox="allow-scripts allow-same-origin allow-popups"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
