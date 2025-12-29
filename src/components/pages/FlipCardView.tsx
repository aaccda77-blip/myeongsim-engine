'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Check, RefreshCw, Fingerprint, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function FlipCardView() {
    const { reportData } = useReportStore();

    // UI States
    const [isFlipped, setIsFlipped] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    // [Deep Tech UX] 스크롤 힌트 상태 (카드 뒷면 내용이 길 경우)
    const [showScrollHint, setShowScrollHint] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // [Fix 1] 데이터 가드 (Safe Destructuring)
    if (!reportData || !reportData.psychology) {
        return (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>심리 분석 데이터가 없습니다.</p>
            </div>
        );
    }
    const { psychology } = reportData;

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
        }
    };

    const handleCheck = (index: number) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter((i) => i !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
        }
    };

    // [Deep Tech UX] 스크롤 가능 여부 감지
    // 카드가 뒤집혔을 때 내용이 넘치면 하단 페이드 효과 활성화
    useEffect(() => {
        if (isFlipped && contentRef.current) {
            const { scrollHeight, clientHeight } = contentRef.current;
            setShowScrollHint(scrollHeight > clientHeight);
        }
    }, [isFlipped, psychology.shadowDescription]);

    return (
        <section className="h-full py-4 px-2 flex flex-col items-center overflow-y-auto scrollbar-hide">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-6 shrink-0"
            >
                <span className="text-xs text-primary-olive font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                    Part 2. Psychological Mirror
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-4">내면의 그림자</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl items-start pb-20">

                {/* Left: Flip Card */}
                <div
                    className="perspective-1000 h-[320px] md:h-[400px] w-full cursor-pointer group select-none"
                    onClick={handleFlip}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label="내면의 그림자 카드 뒤집기"
                >
                    <motion.div
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="w-full h-full relative"
                    >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1a1f35] to-[#0f1219] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl hover:border-primary-olive/50 transition-colors z-20">
                            <div className="w-16 h-16 rounded-full bg-primary-olive/10 flex items-center justify-center mb-4">
                                <Fingerprint className="w-8 h-8 text-primary-olive group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">Shadow Self</h3>
                            <p className="text-xs text-gray-400 mb-4 text-center">나도 모르는 나의 이면</p>

                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest mt-auto">
                                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                                Tap to Flip
                            </div>
                        </div>

                        {/* Back Side */}
                        <div
                            className="absolute inset-0 backface-hidden bg-[#2d3748] border border-primary-olive/30 rounded-2xl flex flex-col items-center overflow-hidden shadow-[0_0_30px_rgba(101,140,66,0.1)]"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            {/* Scrollable Content */}
                            <div
                                ref={contentRef}
                                className="w-full h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary-olive/20 scrollbar-track-transparent"
                            >
                                <h3 className="text-lg font-bold text-primary-olive mb-3 sticky top-0 bg-[#2d3748]/95 backdrop-blur-sm py-2 z-10">
                                    {psychology.shadowTitle}
                                </h3>
                                <div className="w-8 h-[1px] bg-white/10 mx-auto mb-3 shrink-0" />
                                <p className="text-gray-300 leading-relaxed text-sm text-left whitespace-pre-line pb-4">
                                    {psychology.shadowDescription}
                                </p>
                            </div>

                            {/* [Fix 2] Scroll Hint Fade (내용이 넘칠 때만 하단에 표시) */}
                            {showScrollHint && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2d3748] to-transparent pointer-events-none flex items-end justify-center pb-2">
                                    <span className="text-[10px] text-primary-olive animate-bounce">▼ scroll</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Cognitive Distortion Checklist */}
                <div className="bg-deep-slate/50 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-gray-400" />
                        인지 왜곡 체크리스트
                    </h3>
                    <div className="space-y-2">
                        {(psychology.cognitiveDistortions || []).map((item, idx) => { // Safe array mapping
                            const isChecked = checkedItems.includes(idx);
                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleCheck(idx)}
                                    className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${isChecked ? 'bg-primary-olive/10 border-primary-olive/30' : 'bg-black/20 border-white/5 hover:bg-black/40'}`}
                                >
                                    <div className="flex items-start gap-3 p-3">
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex shrink-0 items-center justify-center transition-colors ${isChecked ? 'bg-primary-olive border-primary-olive' : 'border-gray-600'}`}>
                                            {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs md:text-sm transition-all ${isChecked ? 'text-gray-300' : 'text-gray-400'}`}>
                                                {item}
                                            </p>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isChecked && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-primary-olive/20 px-3 overflow-hidden"
                                            >
                                                <p className="text-[10px] text-primary-olive py-2 font-medium border-t border-primary-olive/10">
                                                    💡 상담사의 조언: 이 생각은 기질적 불안에서 온 착각일 수 있습니다.
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
