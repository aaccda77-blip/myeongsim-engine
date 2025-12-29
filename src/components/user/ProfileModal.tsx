'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Clock } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { calculateSaju } from '@/utils/SajuCalculator';
import { ZODIAC_TIME_OPTIONS } from '@/constants/saju';

interface ProfileModalProps {
    onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
    const { reportData, updateUserData } = useReportStore();

    // Initial state from current reportData or defaults
    const [name, setName] = useState(reportData?.userName || '');
    const [birthDate, setBirthDate] = useState(reportData?.birthDate || '');
    const [birthTime, setBirthTime] = useState(reportData?.birthTime || 'unknown'); // [UX] Default 'unknown'
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
    const [viewMode, setViewMode] = useState<'input' | 'result'>('input');
    const [previewPillars, setPreviewPillars] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);



    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Calculation Delay
        setTimeout(() => {
            const timeVal = birthTime === 'unknown' ? '12:00' : birthTime; // Handle Unknown
            const pillars = calculateSaju(birthDate, timeVal, calendarType, gender);
            setPreviewPillars(pillars);
            setViewMode('result');
            setIsLoading(false);
        }, 600);
    };

    const handleConfirm = () => {
        if (!previewPillars) {
            handleCheck({ preventDefault: () => { } } as React.FormEvent);
            return;
        }

        // 1. Calculate Element Distribution (Real)
        const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const pillars = [previewPillars.year, previewPillars.month, previewPillars.day, previewPillars.time];

        pillars.forEach(p => {
            // Gan
            if (p.gan.label === '목') counts.wood++;
            if (p.gan.label === '화') counts.fire++;
            if (p.gan.label === '토') counts.earth++;
            if (p.gan.label === '금') counts.metal++;
            if (p.gan.label === '수') counts.water++;
            // Ji
            if (p.ji.label === '목') counts.wood++;
            if (p.ji.label === '화') counts.fire++;
            if (p.ji.label === '토') counts.earth++;
            if (p.ji.label === '금') counts.metal++;
            if (p.ji.label === '수') counts.water++;
        });

        const total = 8;
        const newElements = {
            wood: (counts.wood / total) * 100,
            fire: (counts.fire / total) * 100,
            earth: (counts.earth / total) * 100,
            metal: (counts.metal / total) * 100,
            water: (counts.water / total) * 100
        };

        // 2. Day Master (Real)
        const dayMaster = previewPillars.dayMaster || `${previewPillars.day.gan.char} (${previewPillars.day.gan.color})`;

        // 3. Simple Keywords based on Day Master (Client-side heuristic)
        const getKeywords = (dm: string) => {
            if (dm.includes('갑') || dm.includes('을')) return ["성장", "창의성", "유연함"];
            if (dm.includes('병') || dm.includes('정')) return ["열정", "표현력", "활기"];
            if (dm.includes('무') || dm.includes('기')) return ["포용력", "신뢰", "안정"];
            if (dm.includes('경') || dm.includes('신')) return ["결단력", "정확성", "의리"];
            if (dm.includes('임') || dm.includes('계')) return ["지혜", "유동성", "통찰"];
            return ["다재다능", "밸런스"];
        };
        const newKeywords = getKeywords(dayMaster);

        updateUserData({
            userName: name,
            birthDate: birthDate,
            birthTime: birthTime,
            gender: gender,
            saju: {
                ...reportData?.saju, // Keep existing if needed, but overwrite criticals
                elements: newElements,
                dayMaster: dayMaster,
                dayMasterTrait: "분석 중...", // Placeholder until API updates it or we add logic
                keywords: newKeywords,
                fourPillars: {
                    year: { gan: previewPillars.year.gan.char, ji: previewPillars.year.ji.char, ganColor: previewPillars.year.gan.color, jiColor: previewPillars.year.ji.color },
                    month: { gan: previewPillars.month.gan.char, ji: previewPillars.month.ji.char, ganColor: previewPillars.month.gan.color, jiColor: previewPillars.month.ji.color },
                    day: { gan: previewPillars.day.gan.char, ji: previewPillars.day.ji.char, ganColor: previewPillars.day.gan.color, jiColor: previewPillars.day.ji.color },

                    time: birthTime === 'unknown' ? { gan: { char: '?' }, ji: { char: '?' } } : { gan: previewPillars.time.gan.char, ji: previewPillars.time.ji.char, ganColor: previewPillars.time.gan.color, jiColor: previewPillars.time.ji.color },
                },
                // [NOTE] Daewoon/Seun will be refined by Server API (PromptEngine)
                // We provide basics here so UI doesn't crash
                current_luck_cycle: {
                    name: "분석 중",
                    season: "Calculating...",
                    direction: "Wait",
                    is_transition: false,
                    mission_summary: "AI 정밀 분석이 필요합니다"
                },
                current_yearly_luck: {
                    year: new Date().getFullYear().toString(),
                    element: "Calculating...",
                    ten_god_type: "-",
                    action_guide: "AI 리포트를 생성해주세요",
                    interaction: "-"
                }
            } as any
        });

        onClose();
    };

    const ResultCard = ({ label, gan, ji }: { label: string, gan: any, ji: any }) => (
        <div className="flex flex-col items-center gap-1 bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <span className="text-[10px] text-gray-400 font-serif uppercase tracking-widest">{label}</span>
            <div className="flex flex-col items-center gap-2 my-1">
                <span className="text-2xl font-serif font-bold" style={{ color: gan.color, textShadow: `0 0 10px ${gan.color}40` }}>{gan.char}</span>
                <span className="text-2xl font-serif font-bold" style={{ color: ji.color, textShadow: `0 0 10px ${ji.color}40` }}>{ji.char}</span>
            </div>
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gan.color }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ji.color }} />
            </div>
        </div>
    );

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
                className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
            >
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-olive/5 via-transparent to-transparent animate-slow-spin pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {viewMode === 'input' ? (
                    <>
                        <div className="flex items-center gap-3 mb-6 text-primary-olive relative z-10">
                            <User className="w-6 h-6" />
                            <h2 className="text-xl font-serif font-bold">내 정보 입력</h2>
                        </div>

                        <form onSubmit={handleCheck} className="space-y-4 relative z-10">
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

                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-xs text-gray-500">생년월일</label>
                                    <div className="flex bg-gray-800 rounded-md p-0.5 border border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setCalendarType('solar')}
                                            className={`px-3 py-1 text-[10px] rounded transition-all ${calendarType === 'solar' ? 'bg-gray-600 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            양력
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCalendarType('lunar')}
                                            className={`px-3 py-1 text-[10px] rounded transition-all ${calendarType === 'lunar' ? 'bg-primary-olive text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            음력
                                        </button>
                                    </div>
                                </div>
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

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">태어난 시간</label>
                                    <div className="relative">
                                        <select
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-8 py-3 text-white focus:outline-none focus:border-primary-olive transition-colors appearance-none cursor-pointer text-sm"
                                        >
                                            {ZODIAC_TIME_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value} className="bg-gray-800 text-white">
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
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
                                    className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? '분석 중...' : '만세력 확인하기'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10"
                    >
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-xs text-primary-olive uppercase tracking-widest mb-1">Identity Verification</span>
                            <h2 className="text-xl font-serif font-bold text-white">나의 사주 원국</h2>
                            <p className="text-xs text-gray-500 mt-2">
                                {name || '사용자'}님의 {calendarType === 'solar' ? '양력' : '음력'} {birthDate} {birthTime}
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-8">
                            <ResultCard label="시주 (Time)" gan={birthTime === 'unknown' ? { char: '?', color: '#555' } : previewPillars.time.gan} ji={birthTime === 'unknown' ? { char: '?', color: '#555' } : previewPillars.time.ji} />
                            <ResultCard label="일주 (Day)" gan={previewPillars.day.gan} ji={previewPillars.day.ji} />
                            <ResultCard label="월주 (Month)" gan={previewPillars.month.gan} ji={previewPillars.month.ji} />
                            <ResultCard label="년주 (Year)" gan={previewPillars.year.gan} ji={previewPillars.year.ji} />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setViewMode('input')}
                                className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-bold"
                            >
                                다시 입력
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-[2] py-3 rounded-xl bg-primary-olive text-white font-bold hover:brightness-110 shadow-[0_0_15px_rgba(101,140,66,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <span>이 정보로 시작하기</span>
                            </button>
                        </div>

                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
