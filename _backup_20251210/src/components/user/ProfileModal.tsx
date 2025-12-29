'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Clock } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

interface ProfileModalProps {
    onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
    const { reportData, updateUserData } = useReportStore();

    // Initial state from current reportData or defaults
    const [name, setName] = useState(reportData?.userName || '');
    const [birthDate, setBirthDate] = useState(reportData?.birthDate || '');
    const [birthTime, setBirthTime] = useState(''); // Mock data didn't have specific time field separate
    const [gender, setGender] = useState<'male' | 'female'>('male'); // Default
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call or Saju Calculation
        await new Promise(resolve => setTimeout(resolve, 800));

        // [Simulation Mode] Generate random element scores for demo effect
        const randomScore = () => Math.floor(Math.random() * 80) + 20; // 20~100
        const newElements = {
            wood: randomScore(),
            fire: randomScore(),
            earth: randomScore(),
            metal: randomScore(),
            water: randomScore(),
        };

        // Update Store with new "Calculated" Data
        updateUserData({
            userName: name,
            birthDate: birthDate,
            saju: reportData ? {
                ...reportData.saju,
                elements: newElements,
                // Ideally dayMaster would also change based on logic, keeping static for now or randomizing
            } : undefined,
            stats: reportData ? {
                creativity: randomScore(),
                leadership: randomScore(),
                empathy: randomScore(),
                wealth: randomScore(),
                execution: randomScore(),
            } : undefined
        });

        setIsLoading(false);
        onClose();
        alert(`[시뮬레이션 완료]\n'${name}'님의 사주 분석이 끝났습니다!\n4페이지 에너지 지도가 변경되었습니다. 확인해보세요.`);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6 text-primary-olive">
                    <User className="w-6 h-6" />
                    <h2 className="text-xl font-serif font-bold">내 정보 입력</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">이름</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-olive transition-colors"
                            placeholder="이름을 입력하세요"
                        />
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">생년월일 (양력/음력)</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-olive transition-colors"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Birth Time */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">태어난 시간 (24시간제)</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    value={birthTime}
                                    onChange={(e) => setBirthTime(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-olive transition-colors appearance-none"
                                    placeholder="HH:mm"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">성별</label>
                            <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700 h-[46px]">
                                <button
                                    type="button"
                                    onClick={() => setGender('male')}
                                    className={`flex-1 rounded-md text-sm font-medium transition-all ${gender === 'male' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    남
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender('female')}
                                    className={`flex-1 rounded-md text-sm font-medium transition-all ${gender === 'female' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    여
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-olive text-white font-bold py-3 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
