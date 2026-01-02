import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trophy, MessageCircleHeart } from 'lucide-react';
import { AccountabilityService, DailyMission } from '@/modules/AccountabilityService';
import confetti from 'canvas-confetti';

interface AccountabilityModalProps {
    onReward?: (xp: number) => void; // XP 보상 콜백
}

export const AccountabilityModal: React.FC<AccountabilityModalProps> = ({ onReward }) => {
    const [mission, setMission] = useState<DailyMission | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'question' | 'success' | 'encourage' | null>('question');

    useEffect(() => {
        // 앱 실행 시 체크인 확인
        const pending = AccountabilityService.checkPending();
        if (pending) {
            setMission(pending);
            setTimeout(() => setIsOpen(true), 2000); // 2초 뒤 자연스럽게 등장
        }
    }, []);

    const handleYes = () => {
        if (!mission) return;
        AccountabilityService.markResult(mission.id, true);
        setStep('success');

        // Celebrate
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#ffffff']
        });

        if (onReward) onReward(50); // 50 XP 지급
        setTimeout(() => setIsOpen(false), 4000); // 4초 뒤 닫힘
    };

    const handleNo = () => {
        if (!mission) return;
        AccountabilityService.markResult(mission.id, false);
        setStep('encourage');
        setTimeout(() => setIsOpen(false), 4000);
    };

    if (!isOpen || !mission) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-gold to-transparent" />

                    <div className="p-6 text-center">

                        {step === 'question' && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-primary-gold/10 flex items-center justify-center mx-auto mb-4 border border-primary-gold/30">
                                    <MessageCircleHeart className="w-8 h-8 text-primary-gold" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">기억하시나요?</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    지난 번에 약속하신 미션,<br />
                                    <span className="text-primary-gold font-bold text-base block mt-2">"{mission.text}"</span>
                                    <br />실천하셨나요?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleNo}
                                        className="flex-1 py-3 px-4 rounded-xl bg-gray-800 text-gray-400 font-medium hover:bg-gray-700 transition"
                                    >
                                        아직이요..
                                    </button>
                                    <button
                                        onClick={handleYes}
                                        className="flex-1 py-3 px-4 rounded-xl bg-primary-gold text-black font-bold hover:bg-yellow-400 transition shadow-lg shadow-primary-gold/20"
                                    >
                                        네, 했어요! 🎉
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 'success' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <Trophy className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">대단해요! 멋집니다! 🎉</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    <span className="text-green-400 font-bold">뇌과학적으로 검증된 사실:</span><br />
                                    지금 당신의 뇌에서 도파민이 분비되며<br />
                                    <span className="text-primary-gold font-semibold">신경회로가 재설계</span>되고 있습니다! 🧠✨<br />
                                    <span className="text-xs text-gray-400 mt-2 block">이런 작은 성취가 반복되면 새로운 습관이 뇌에 고정됩니다.</span>
                                    <span className="text-primary-gold font-bold block mt-2">+50 XP 획득!</span>
                                </p>
                            </motion.div>
                        )}

                        {step === 'encourage' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                                    <Check className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">괜찮아요, 내일 하면 되죠!</h3>
                                <p className="text-gray-300 text-sm">
                                    계속 의식하고 있다는 것 자체가<br />
                                    이미 시작입니다. 응원할게요! 💪
                                </p>
                            </motion.div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
