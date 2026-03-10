import { useReportStore } from '@/store/useReportStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Clock, ChevronRight, Loader2, Check, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateSaju } from '@/utils/SajuCalculator';
import { AuthService } from '@/modules/AuthService';

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

            updateUserData({
                userName: name,
                birthDate,
                birthTime,
                gender: gender,
                meta: {
                    ...reportData?.meta,
                    calendarType, // [Fix] Persist
                    gender,
                    isTimeUnknown: birthTime === 'unknown',
                    isLeapMonth: reportData?.meta?.isLeapMonth || false
                }
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
            meta: {
                ...reportData?.meta,
                calendarType, // [Fix] Persist Lunar/Solar selection to Global Store
                gender,
                isTimeUnknown: birthTime === 'unknown',
                isLeapMonth: reportData?.meta?.isLeapMonth || false // [Fix] Required field
            },
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
        <main className="w-full max-w-md h-full flex flex-col p-0 overflow-hidden relative mx-auto bg-[#1e262f]">
            {/* Background Decoration (Optional, kept from original but subtle) */}
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary-olive/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Scrollable Content Area */}
            <div className="flex-grow overflow-y-auto p-6 pb-24 z-10">
                {/* BEGIN: TopNavigation */}
                <nav className="flex justify-between items-center mb-10" data-purpose="navigation-bar">
                    <button aria-label="Menu" className="text-gray-400 hover:text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                    </button>
                    <div className="relative flex gap-2">
                        <button
                            onClick={async () => {
                                if (confirm('로그아웃 하시겠습니까?')) {
                                    await AuthService.logout();
                                    window.location.href = '/login';
                                }
                            }}
                            aria-label="Logout"
                            className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                        >
                            <LogIn className="w-4 h-4 rotate-180" />
                            <span>로그아웃</span>
                        </button>
                        <button aria-label="Notifications" className="text-gray-400 hover:text-white">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#1e262f]"></span>
                        </button>
                    </div>
                </nav>
                {/* END: TopNavigation */}

                {/* BEGIN: HeaderSection */}
                <section className="text-center mb-12" data-purpose="header-text">
                    <h1 className="text-3xl font-bold mb-3 tracking-tight text-[#e2e8f0]">
                        {viewMode === 'form' ? '명심코칭 시작하기' : '나의 사주 원국'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {viewMode === 'form'
                            ? '정확한 분석을 위해 태어난 정보를 입력해주세요.'
                            : '입력하신 정보가 맞는지 확인해주세요.'}
                    </p>
                </section>
                {/* END: HeaderSection */}

                {/* BEGIN: FormSection */}
                <AnimatePresence mode="wait">
                    {viewMode === 'form' ? (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 flex-grow"
                            onSubmit={handleCheck}
                        >
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 ml-1">이름</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="이름을 입력하세요"
                                        className="w-full bg-[#161d24] border border-[#2c3641] text-white rounded-lg pl-11 py-4 focus:ring-[#10b748] focus:border-[#10b748] transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Birth Date with Toggle */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-medium text-gray-500 ml-1">생년월일</label>
                                    <div className="flex bg-[#161d24] rounded-md p-0.5 border border-[#2c3641]">
                                        {/* Solar/Lunar Toggle */}
                                        {['solar', 'lunar'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setCalendarType(type as any)}
                                                className={`px-3 py-1 text-[10px] rounded-md font-medium transition-colors ${calendarType === type
                                                    ? 'bg-[#10b748] text-white'
                                                    : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                {type === 'solar' ? '양력' : '음력'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                        </svg>
                                    </span>
                                    {/* Date Input with custom style override for dark mode calendar icon */}
                                    <style jsx>{`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            filter: invert(1);
                                            opacity: 0.5;
                                            cursor: pointer;
                                        }
                                    `}</style>
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-[#161d24] border border-[#2c3641] text-white rounded-lg pl-11 pr-4 py-4 focus:ring-[#10b748] focus:border-[#10b748] transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Birth Time Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 ml-1">태어난 시간</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                        </svg>
                                    </span>
                                    <select
                                        value={birthTime}
                                        onChange={(e) => setBirthTime(e.target.value)}
                                        className="w-full bg-[#161d24] border border-[#2c3641] text-white rounded-lg pl-11 py-4 appearance-none focus:ring-[#10b748] focus:border-[#10b748] transition-all outline-none"
                                    >
                                        {ZODIAC_TIME_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-[#1e262f] text-white">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    </div>
                                </div>
                                {birthTime !== 'unknown' && (
                                    <p className="text-right text-[10px] text-gray-500">
                                        * {ZODIAC_TIME_OPTIONS.find(o => o.value === birthTime)?.hint}
                                    </p>
                                )}
                            </div>

                            {/* Gender Selection */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {['male', 'female'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g as any)}
                                        className={`py-4 rounded-lg font-bold text-sm transition-all ${gender === g
                                            ? 'bg-white text-[#1e262f] shadow-sm'
                                            : 'bg-[#161d24] border border-[#2c3641] text-gray-400'
                                            }`}
                                    >
                                        {g === 'male' ? '남성' : '여성'}
                                    </button>
                                ))}
                            </div>

                            {/* Main Action Button */}
                            <div className="pt-4">
                                <button
                                    className="w-full bg-[#10b748] hover:bg-green-600 text-white font-bold py-5 rounded-lg text-lg transition-colors shadow-[0_4px_14px_0_rgba(16,183,72,0.39)] flex justify-center items-center gap-2"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : '만세력 분석하기'}
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#161d24] border border-[#2c3641] rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-center gap-2 mb-6 text-[#10b748]">
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
                                    className="flex-[2] bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
                                >
                                    결과 확인하러 가기
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* END: FormSection */}

                {/* END: FormSection */}


            </div>

            {/* Bottom Navigation Bar */}
            <nav className="absolute bottom-0 left-0 right-0 bg-[#1e262f]/90 backdrop-blur-md border-t border-[#2c3641] py-3 px-8 flex justify-between items-center z-20">
                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="text-[10px] font-medium">Back</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 text-[#10b748] hover:text-green-400 transition-colors"
                    onClick={() => window.location.reload()}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="text-[10px] font-medium">Home</span>
                </button>
            </nav>
        </main>
    );
}
