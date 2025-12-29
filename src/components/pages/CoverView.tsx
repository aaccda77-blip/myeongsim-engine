import { useReportStore } from '@/store/useReportStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Clock, ChevronRight, Loader2, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateSaju } from '@/utils/SajuCalculator';

import { ZODIAC_TIME_OPTIONS } from '@/constants/saju';

export default function CoverView() {
    const { nextStep, updateUserData, reportData } = useReportStore();

    // Form State
    const [name, setName] = useState(reportData?.userName || '');
    const [birthDate, setBirthDate] = useState(reportData?.birthDate || '');
    const [birthTime, setBirthTime] = useState(reportData?.birthTime || 'unknown');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'form' | 'result'>('form');
    const [previewPillars, setPreviewPillars] = useState<any>(null);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Calculation
        setTimeout(() => {
            const timeVal = birthTime === 'unknown' ? '12:00' : birthTime; // Default to noon for unknown
            const pillars = calculateSaju(birthDate, timeVal, calendarType, gender);
            setPreviewPillars(pillars);

            // [Fix] data synchronization
            // Update store immediately so Chat Interface can access the name
            // even before the user clicks "Go to Result"
            updateUserData({
                userName: name,
                birthDate,
                birthTime,
                gender: gender
            });

            setViewMode('result');
            setIsLoading(false);
        }, 800);
    };

    const handleConfirm = () => {
        if (!previewPillars) return;

        // 1. Calculate Elements
        const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const pillarsList = [previewPillars.year, previewPillars.month, previewPillars.day];
        if (birthTime !== 'unknown') pillarsList.push(previewPillars.time);

        pillarsList.forEach(p => {
            // Simple counting logic (copied from ProfileModal)
            const mapLabel = (l: string) => {
                if (l === '목') counts.wood++;
                if (l === '화') counts.fire++;
                if (l === '토') counts.earth++;
                if (l === '금') counts.metal++;
                if (l === '수') counts.water++;
            };
            mapLabel(p.gan.label);
            mapLabel(p.ji.label);
        });

        const total = pillarsList.length * 2;
        const newElements = {
            wood: (counts.wood / total) * 100,
            fire: (counts.fire / total) * 100,
            earth: (counts.earth / total) * 100,
            metal: (counts.metal / total) * 100,
            water: (counts.water / total) * 100
        };

        const dayMaster = previewPillars.dayMaster || `${previewPillars.day.gan.char} (${previewPillars.day.gan.color})`;

        updateUserData({
            userName: name,
            birthDate,
            birthTime,
            gender,
            saju: {
                ...reportData?.saju,
                elements: newElements,
                dayMaster,
                fourPillars: {
                    year: previewPillars.year,
                    month: previewPillars.month,
                    day: previewPillars.day,
                    time: birthTime === 'unknown' ? { gan: { char: '?' }, ji: { char: '?' } } : previewPillars.time,
                }
            } as any
        });

        nextStep(); // Move to Intro
    };

    const ResultPillar = ({ label, gan, ji }: { label: string, gan: any, ji: any }) => (
        <div className="flex flex-col items-center gap-1 bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
            <div className="flex flex-col items-center gap-1 font-serif font-bold text-xl">
                <span style={{ color: gan.color }}>{gan.char}</span>
                <span style={{ color: ji.color }}>{ji.char}</span>
            </div>
        </div>
    );

    return (
        <section className="min-h-full w-full flex flex-col items-center justify-center p-6 relative">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary-olive/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">
                        {viewMode === 'form' ? '명심코칭 시작하기' : '나의 사주 원국'}
                    </h1>
                    <p className="text-xs text-gray-400">
                        {viewMode === 'form'
                            ? '정확한 분석을 위해 태어난 정보를 입력해주세요.'
                            : '입력하신 정보가 맞는지 확인해주세요.'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'form' ? (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleCheck}
                            className="space-y-5"
                        >
                            {/* Name Input */}
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 ml-1">이름</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="홍길동"
                                        className="w-full bg-gray-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary-olive focus:ring-1 focus:ring-primary-olive transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Birth Date & Type */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs text-gray-500">생년월일</label>
                                    <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg">
                                        {['solar', 'lunar'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setCalendarType(type as any)}
                                                className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${calendarType === type ? 'bg-primary-olive text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                {type === 'solar' ? '양력' : '음력'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-gray-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary-olive outline-none appearance-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Time Select (Zodiac) */}
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 ml-1">태어난 시간</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-olive" />
                                    <select
                                        value={birthTime}
                                        onChange={(e) => setBirthTime(e.target.value)}
                                        className="w-full bg-gray-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary-olive outline-none appearance-none cursor-pointer"
                                    >
                                        {ZODIAC_TIME_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 text-gray-600 rotate-90" />
                                    </div>
                                </div>
                                {birthTime !== 'unknown' && (
                                    <p className="text-[10px] text-primary-olive/80 text-right px-2">
                                        * {ZODIAC_TIME_OPTIONS.find(o => o.value === birthTime)?.hint}
                                    </p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="flex gap-2 pt-2">
                                {['male', 'female'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g as any)}
                                        className={`flex-1 py-3 rounded-xl border transition-all text-sm font-medium ${gender === g
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'
                                            }`}
                                    >
                                        {g === 'male' ? '남성' : '여성'}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-olive text-white font-bold text-lg py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(101,140,66,0.3)] mt-6 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : '만세력 분석하기'}
                            </button>
                        </motion.form>

                    ) : (
                        // Result View
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-center gap-2 mb-6 text-primary-gold">
                                <Check className="w-5 h-5" />
                                <span className="text-sm font-bold">원국 분석 완료</span>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-8">
                                <ResultPillar
                                    label="시주"
                                    gan={birthTime === 'unknown' ? { char: '?', color: '#555' } : previewPillars.time.gan}
                                    ji={birthTime === 'unknown' ? { char: '?', color: '#555' } : previewPillars.time.ji}
                                />
                                <ResultPillar label="일주" gan={previewPillars.day.gan} ji={previewPillars.day.ji} />
                                <ResultPillar label="월주" gan={previewPillars.month.gan} ji={previewPillars.month.ji} />
                                <ResultPillar label="년주" gan={previewPillars.year.gan} ji={previewPillars.year.ji} />
                            </div>

                            <div className="text-center text-xs text-gray-400 mb-6 leading-relaxed">
                                <p>입력하신 정보가 정확한가요?</p>
                                <p className="mt-1 text-white font-medium">
                                    {name}님 ({calendarType === 'solar' ? '양력' : '음력'} {birthDate} {birthTime === 'unknown' ? '시간모름' : ZODIAC_TIME_OPTIONS.find(o => o.value === birthTime)?.label.split(' ')[0]})
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setViewMode('form')}
                                    className="flex-1 py-3 text-xs text-gray-400 font-bold hover:text-white transition-colors"
                                >
                                    수정하기
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-[2] bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                                >
                                    결과 확인하러 가기
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
