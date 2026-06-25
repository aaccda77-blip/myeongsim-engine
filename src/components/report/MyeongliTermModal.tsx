'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { getMyeongliEssay } from '@/data/MyeongliEssayDB';

interface MyeongliTermModalProps {
    isOpen: boolean;
    onClose: () => void;
    term: string | null;
}

export default function MyeongliTermModal({ isOpen, onClose, term }: MyeongliTermModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !mounted || !term) return null;

    const data = getMyeongliEssay(term);

    // 매칭되는 에세이 데이터가 없을 경우 폴백 처리
    const title = data?.title || term;
    const subtitle = data?.subtitle || '🌌 내면의 에너지와 잠재력 코드';
    const essay = data?.essay || `당신이 선택하신 '${term}' 용어는 당신의 영혼 설계도를 해독하는 열쇠입니다. 본질적인 성향과 우주의 흐름이 맞물려 작용하는 역동적인 에너지를 의미합니다. 이 용어에 얽힌 본질적인 영감을 리포트 본문에서 더 자세히 통찰해 보세요.`;

    const modalContent = (
        <React.Fragment>
            {/* 뒷배경 블러 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
                {/* 모달 본체 */}
                <motion.div
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 20, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-[#0a0b12]/95 border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col justify-between"
                    style={{
                        boxShadow: '0 0 50px rgba(139, 92, 246, 0.15), inset 0 0 0 1px rgba(255,255,255,0.05)'
                    }}
                >
                    {/* 내장 오로라 네온 배경 */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0%,transparent_50%)]" />
                        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,transparent_50%)]" />
                    </div>

                    {/* 상단 헤더 */}
                    <div className="relative z-10 p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01] select-none">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-purple-400" />
                            <div>
                                <h2 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-300">
                                    명리학 지혜 백과
                                </h2>
                                <p className="text-[9px] text-zinc-500 tracking-wider uppercase font-mono">Myeongli Wisdom Essay</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-zinc-500 hover:text-white transition-colors cursor-pointer border border-zinc-800/80 p-1.5 rounded-xl hover:bg-zinc-900"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* 메인 콘텐츠 영역 (스크롤 적용) */}
                    <div className="relative z-10 p-6 overflow-y-auto space-y-5 flex-1 scrollbar-hide">
                        
                        {/* 은유 타이틀 카드 */}
                        <div className="p-5 bg-gradient-to-br from-purple-950/20 to-indigo-950/20 border border-purple-500/10 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-2 right-2 text-yellow-400/30">
                                <Sparkles size={24} className="animate-pulse" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                            <p className="text-xs text-purple-300/90 font-medium leading-relaxed">
                                {subtitle}
                            </p>
                        </div>

                        {/* 본문 에세이 */}
                        <div className="text-xs leading-relaxed text-zinc-300 font-normal space-y-4">
                            {essay.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="whitespace-pre-line tracking-wide">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                    </div>

                    {/* 하단 푸터 / 확인 및 돌아가기 버튼 */}
                    <div className="relative z-10 p-5 border-t border-white/5 bg-[#06070a]/90 select-none">
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 active:scale-[0.98] text-white font-bold rounded-2xl text-xs transition-all cursor-pointer shadow-lg shadow-purple-950/40 border border-purple-500/20"
                        >
                            확인 완료 (이전 화면으로 돌아가기) ↩️
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </React.Fragment>
    );

    return createPortal(modalContent, document.body);
}
