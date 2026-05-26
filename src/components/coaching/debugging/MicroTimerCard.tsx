import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroTimerCardProps {
    actionGuide: string;
    targetSeconds: number;
    onComplete: () => void;
}

export const MicroTimerCard: React.FC<MicroTimerCardProps> = ({ actionGuide, targetSeconds = 300, onComplete }) => {
    const [secondsLeft, setSecondsLeft] = useState(targetSeconds);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, secondsLeft]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setSecondsLeft(targetSeconds);
        setIsFinished(false);
    };

    // 테스트 검증 편의를 위해 10초 스킵 버튼도 유쾌하게 추가합니다.
    const skipToTest = () => {
        setSecondsLeft(5);
        setIsActive(true);
    };

    return (
        <div className="bg-gray-800/80 border border-purple-500/20 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            {/* Top Indicator */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">Phase 2: 마이크로 렌더링 (Committed Action)</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-[10px] text-purple-300 font-mono">5분 강제 전념행동</span>
            </div>

            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key="active-timer"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6 text-center"
                    >
                        {/* Timer Display */}
                        <div className="relative w-44 h-44 mx-auto flex items-center justify-center rounded-full border-4 border-gray-700/60 shadow-inner">
                            {/* Neon Glow Circle */}
                            <div className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                                isActive 
                                ? 'border-purple-500 animate-pulse shadow-[0_0_25px_rgba(168,85,247,0.4)]' 
                                : 'border-gray-600'
                            }`}></div>
                            
                            <div className="z-10">
                                <span className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    {formatTime(secondsLeft)}
                                </span>
                                <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-1">
                                    {isActive ? '시스템 쿨링 작동 중' : '시작 대기 중'}
                                </p>
                            </div>
                        </div>

                        {/* Action Mission Guide */}
                        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/10 text-left max-w-md mx-auto">
                            <strong className="block text-purple-300 text-xs font-mono mb-1 uppercase">📝 강제 쿨링 미션 요령:</strong>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">
                                {actionGuide}
                            </p>
                        </div>

                        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                            완벽주의 락을 해제하기 위해 지금 즉시 생각을 끄고 본 미션을 딱 5분간만 수행하세요. 완성도는 0점이어도 완벽한 100점입니다!
                        </p>

                        {/* Control Buttons */}
                        <div className="flex justify-center items-center gap-4 pt-2">
                            <button
                                onClick={toggleTimer}
                                className={`px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-98 shadow-md ${
                                    isActive
                                    ? 'bg-red-900/40 hover:bg-red-800/40 border border-red-500/30 text-red-300 shadow-red-500/10'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/15'
                                }`}
                            >
                                {isActive ? '⏸ 잠시 멈춤' : '▶ 디버깅 미션 스타트'}
                            </button>
                            
                            {(secondsLeft < targetSeconds) && (
                                <button
                                    onClick={resetTimer}
                                    className="p-3.5 rounded-xl bg-gray-900 border border-gray-700/60 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                                    title="초기화"
                                >
                                    ↻
                                </button>
                            )}
                        </div>

                        {/* Skip/Test Button */}
                        <div className="pt-2">
                            <button 
                                onClick={skipToTest}
                                className="text-[10px] text-gray-500 hover:text-purple-400 font-mono tracking-widest uppercase transition-colors"
                            >
                                🧪 시뮬레이션 고속 스킵 (5초 앞으로)
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="finished-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 text-center py-8"
                    >
                        {/* Celebrate Particles Simulation */}
                        <motion.div
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 10 }}
                            className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-500 flex items-center justify-center text-white text-4xl mx-auto shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                        >
                            🏆
                        </motion.div>

                        <div className="space-y-2">
                            <h4 className="text-2xl font-black text-amber-400 tracking-tight">시스템 디버깅 전원 켜짐!</h4>
                            <p className="text-xs md:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                                축하합니다! 완벽주의 강박 락을 부수고 첫 마이크로 전념행동을 안전하게 완료하셨습니다.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-900/60 rounded-xl max-w-md mx-auto text-xs text-gray-400 text-left border border-gray-800 leading-relaxed space-y-2">
                            <span className="font-bold text-amber-300 block">💡 뇌 과학 보고서:</span>
                            <span>행동을 개시하는 즉시 뇌의 **전전두엽(PFC)**이 도파민을 분비하기 시작하여 강박적인 불안 회로가 자동 무력화됩니다. 완벽하게 준비하려고 기다리지 마세요. 일단 움직이는 것이 진짜 해답입니다!</span>
                        </div>

                        <button
                            onClick={onComplete}
                            className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-900 font-bold text-sm tracking-wider transition-colors active:scale-98"
                        >
                            🎉 완료하고 관리자 모드 피드백 받기
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
