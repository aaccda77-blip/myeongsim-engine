import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DefusionMissionCardProps {
    defaultTargetText: string;
    onComplete: () => void;
}

export const DefusionMissionCard: React.FC<DefusionMissionCardProps> = ({ defaultTargetText, onComplete }) => {
    const [userInput, setUserInput] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [defusedText, setDefusedText] = useState('');
    const [step, setStep] = useState<number>(1); // 1: 입력, 2: 격리 격상, 3: 완전 이탈

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        setIsSubmitted(true);
        // "나는 실패할 것이다" -> "나는 내가 '실패할 것 같다'는 생각을 갖고 있다"
        // 유저가 쓴 문장을 부드럽게 감싸서 메타인지 격리문으로 치환
        const cleanInput = userInput.replace(/(~할 것이다|한다|할거야|하다)/g, '할 것 같다');
        setDefusedText(`나는 내가 "${cleanInput}" 라는 생각을 가지고 있다.`);
        setStep(2);
    };

    return (
        <div className="bg-gray-800/80 border border-blue-500/20 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            {/* Top Indicator */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">Phase 1: 인지 탈융합 (Cognitive Defusion)</span>
                <span className="px-2 py-0.5 rounded bg-blue-900/40 text-[10px] text-blue-300 font-mono">생각 격리 프로세스</span>
            </div>

            <AnimatePresence mode="wait">
                {/* STEP 1: 입력창 */}
                {step === 1 && (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="bg-blue-950/20 border border-blue-500/10 p-4 rounded-xl">
                            <p className="text-xs text-blue-300 font-mono uppercase tracking-wider mb-2">🧠 시스템이 추천하는 격리 타겟:</p>
                            <p className="text-sm md:text-base text-gray-200 font-serif leading-relaxed italic">
                                "{defaultTargetText}"
                            </p>
                        </div>

                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            지금 당신의 머릿속을 괴롭히고 가두는 그 두려운 문장을 아래 입력창에 **그대로 똑같이** 또는 **당신만의 단어**로 타이핑해 보세요.
                        </p>

                        <form onSubmit={handleTextSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="예: 나는 이번 프로젝트를 완벽히 망치고 말 거야"
                                className="w-full bg-gray-950 border border-gray-700/60 focus:border-blue-500 text-white rounded-xl px-4 py-3.5 text-sm outline-none transition-colors shadow-inner"
                                maxLength={80}
                            />
                            <button
                                type="submit"
                                disabled={!userInput.trim()}
                                className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md ${
                                    userInput.trim() 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer active:scale-98 shadow-blue-500/15'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                ⚡ 에고 융합 해제 및 생각 격리 개시
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* STEP 2: 탈융합 변환 시각화 */}
                {step === 2 && (
                    <motion.div
                        key="step-2"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6 text-center py-6"
                    >
                        <div className="text-4xl animate-bounce mb-2">🛸</div>
                        <h4 className="text-lg font-bold text-gray-200">생각 객관화 및 메타 격리 성공</h4>
                        
                        <div className="my-6 p-5 rounded-2xl bg-gray-950 border border-blue-500/20 relative overflow-hidden flex flex-col justify-center min-h-[100px]">
                            {/* Neon Flow Effect */}
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full"></div>
                            
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-base md:text-lg text-blue-400 font-serif leading-relaxed italic z-10"
                            >
                                {defusedText}
                            </motion.p>
                        </div>

                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                            문장이 변한 것이 보이시나요? 당신은 **'실패 그 자체'**가 아니라, 단지 **'실패할 것이라는 생각'**을 쥐고 있는 넓고 안전한 우주와 같은 존재입니다.
                        </p>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide transition-all active:scale-98 shadow-md shadow-indigo-500/15"
                            >
                                🌌 이 생각을 백그라운드로 완전히 던져 격리하기
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: 격리 완료 및 이탈 처리 */}
                {step === 3 && (
                    <motion.div
                        key="step-3"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 text-center py-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-16 h-16 rounded-full bg-green-900/30 border border-green-500 flex items-center justify-center text-green-400 text-3xl mx-auto shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        >
                            ✓
                        </motion.div>

                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-green-400">탈융합 격리 프로세스 완료</h4>
                            <p className="text-xs md:text-sm text-gray-400">
                                생각 팝업창이 시스템 백그라운드로 안전하게 격리 수용되었습니다.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-900/60 rounded-xl max-w-sm mx-auto text-xs text-gray-400 text-left border border-gray-800">
                            💡 **알아차림 노하우**: 이 생각은 언제든 다시 떠오를 수 있습니다. 그럴 때마다 싸우려 하지 마시고, *"아, 내 머릿속에 또 그 생각이 떠올랐다는 것을 내가 지켜보고 있구나"* 하고 조용히 비추어 주면 작동을 멈춥니다.
                        </div>

                        <button
                            onClick={onComplete}
                            className="w-full max-w-xs py-3.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm tracking-wide transition-colors active:scale-98"
                        >
                            ➡️ 다음 단계: 5분 강제 전념 행동 가동
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
