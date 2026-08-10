'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Info, X, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju } from '@/utils/SajuCalculator';

const STRESS_FACTORS = ['커리어', '인간관계', '건강', '재정', '가족'];

const calculateSajuMetrics = (pillars: any, isTimeUnknown: boolean) => {
    const ohaeng = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const tenGods = { resource: 0, output: 0, self: 0, power: 0, wealth: 0 };

    const pillarsList = [pillars.year, pillars.month, pillars.day];
    if (!isTimeUnknown && pillars.time && pillars.time.gan?.char !== '?') {
        pillarsList.push(pillars.time);
    }

    const ELEMENT_ORDER = ['목', '화', '토', '금', '수'];
    const EN_ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'];

    pillarsList.forEach(p => {
        const ganEl = p.gan?.label;
        const jiEl = p.ji?.label;

        if (ganEl && ELEMENT_ORDER.includes(ganEl)) {
            const enName = EN_ELEMENTS[ELEMENT_ORDER.indexOf(ganEl)];
            ohaeng[enName as keyof typeof ohaeng] += 1;
        }
        if (jiEl && ELEMENT_ORDER.includes(jiEl)) {
            const enName = EN_ELEMENTS[ELEMENT_ORDER.indexOf(jiEl)];
            ohaeng[enName as keyof typeof ohaeng] += 1;
        }
    });

    const dmElement = pillars.day?.gan?.label;
    const dmIndex = ELEMENT_ORDER.indexOf(dmElement);

    if (dmIndex !== -1) {
        pillarsList.forEach(p => {
            const checkTenGods = (el: string) => {
                const idx = ELEMENT_ORDER.indexOf(el);
                if (idx !== -1) {
                    const diff = (idx - dmIndex + 5) % 5;
                    if (diff === 0) tenGods.self += 1;
                    else if (diff === 1) tenGods.output += 1;
                    else if (diff === 2) tenGods.wealth += 1;
                    else if (diff === 3) tenGods.power += 1;
                    else if (diff === 4) tenGods.resource += 1;
                }
            };

            if (p.gan?.label) checkTenGods(p.gan.label);
            if (p.ji?.label) checkTenGods(p.ji.label);
        });
    }

    const total = pillarsList.length * 2;
    const elements = {
        wood: Math.round((ohaeng.wood / total) * 100),
        fire: Math.round((ohaeng.fire / total) * 100),
        earth: Math.round((ohaeng.earth / total) * 100),
        metal: Math.round((ohaeng.metal / total) * 100),
        water: Math.round((ohaeng.water / total) * 100),
    };

    return { ohaeng, tenGods, elements };
};

export default function OnboardingFlow() {
    const router = useRouter();
    const { updateUserData } = useReportStore();
    const [step, setStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: 선천적 명리 데이터
        birthDate: '',
        birthTime: '12:00',
        isTimeUnknown: false,
        gender: '', // 남성, 여성, 기타
        // Step 2: 후성유전학적 상태
        stressFactors: [] as string[],
        sleepQuality: 3, // 1~5
        energyLevel: 50, // 0~100
        // Step 3: 심리 지표
        mbti: '', // 16가지 성격 유형
        enneagram: '',
        bigFive: '',
        disc: '',
        // Step 4: 약관 동의
        agreedToTerms: false
    });

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

    const handleComplete = () => {
        if (!formData.agreedToTerms) {
            alert('명심코칭 시작을 위해 약관 및 면책 조항에 동의해주세요.');
            return;
        }

        // ── [핵심 수정] 만세력 입력값을 useReportStore에 저장 ──
        if (formData.birthDate) {
            try {
                const timeVal = formData.isTimeUnknown ? '12:00' : formData.birthTime;
                const genderVal = formData.gender === '여성' ? 'female' : 'male';
                const pillars = calculateSaju(formData.birthDate, timeVal, 'solar', genderVal);

                // 오행 및 십성 계산
                const metrics = calculateSajuMetrics(pillars, formData.isTimeUnknown);

                const dayMaster = pillars.dayMaster ||
                    `${pillars.day?.gan?.char || '?'} (${pillars.day?.gan?.color || '#fff'})`;

                updateUserData({
                    birthDate: formData.birthDate,
                    birthTime: formData.isTimeUnknown ? 'unknown' : formData.birthTime,
                    gender: genderVal,
                    meta: {
                        calendarType: 'solar',
                        gender: genderVal,
                        isTimeUnknown: formData.isTimeUnknown,
                        isLeapMonth: false,
                    } as any,
                    saju: {
                        elements: metrics.elements,
                        ohaeng: metrics.ohaeng,
                        tenGods: metrics.tenGods,
                        dayMaster,
                        fourPillars: {
                            year:  pillars.year,
                            month: pillars.month,
                            day:   pillars.day,
                            time:  formData.isTimeUnknown
                                ? { gan: { char: '?', label: '?', color: '#666' }, ji: { char: '?', label: '?', color: '#666' } }
                                : pillars.time,
                        },
                    } as any,
                });

                console.log('✅ [OnboardingFlow] 만세력 데이터 스토어 저장 완료:', { dayMaster, birthDate: formData.birthDate });
            } catch (e) {
                console.error('[OnboardingFlow] 사주 계산 오류:', e);
            }
        }

        // 데이터 저장 완료 후 라우팅
        router.push('/myeongsim-chat');
    };

    const toggleStressFactor = (factor: string) => {
        setFormData(prev => ({
            ...prev,
            stressFactors: prev.stressFactors.includes(factor)
                ? prev.stressFactors.filter(f => f !== factor)
                : [...prev.stressFactors, factor]
        }));
    };

    return (
        <main className="min-h-screen bg-[#0d131a] flex justify-center items-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary-olive/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10 flex flex-col min-h-[600px] max-h-[90vh]">

                {/* Header (Progress bar & Back button) */}
                <div className="p-6 pb-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        {step > 1 ? (
                            <button onClick={handlePrev} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                이전
                            </button>
                        ) : <div className="w-12" />} {/* placeholder */}

                        <div className="text-right text-xs text-primary-olive font-bold tracking-widest uppercase">
                            STEP {step} / 4
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
                        <motion.div
                            className="h-full bg-primary-olive shadow-[0_0_10px_rgba(101,140,66,0.8)]"
                            initial={{ width: '25%' }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ ease: "easeInOut", duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 flex flex-col relative overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: 선천적 명리 */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 flex-1 flex flex-col"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">선천적 명리 데이터</h2>
                                    <p className="text-sm text-gray-400">나를 깊이 이해하기 위한 첫걸음입니다.</p>
                                </div>

                                <div className="space-y-5 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 ml-1">생년월일</label>
                                        <input
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={e => {
                                                const newDate = e.target.value;
                                                setFormData({ ...formData, birthDate: newDate });
                                                
                                                // [SYNC-REALTIME] 날짜 변경 즉시 사주 계산 및 스토어 반영
                                                if (newDate) {
                                                    try {
                                                        const timeVal = formData.isTimeUnknown ? '12:00' : formData.birthTime;
                                                        const genderVal = formData.gender === '여성' ? 'female' : 'male';
                                                        const pillars = calculateSaju(newDate, timeVal, 'solar', genderVal);
                                                        
                                                        const dayMaster = pillars.dayMaster || `${pillars.day?.gan?.char || '?'} (${pillars.day?.gan?.color || '#fff'})`;
                                                        const metrics = calculateSajuMetrics(pillars, formData.isTimeUnknown);
                                                        
                                                        // 즉시 스토어 업데이트 (미리보기 및 태그 동기화용)
                                                        updateUserData({
                                                            birthDate: newDate,
                                                            saju: {
                                                                dayMaster,
                                                                elements: metrics.elements,
                                                                ohaeng: metrics.ohaeng,
                                                                tenGods: metrics.tenGods,
                                                                fourPillars: {
                                                                    year: pillars.year,
                                                                    month: pillars.month,
                                                                    day: pillars.day,
                                                                    time: formData.isTimeUnknown ? { gan: { char: '?', label: '?', color: '#666' }, ji: { char: '?', label: '?', color: '#666' } } : pillars.time
                                                                }
                                                            } as any
                                                        });
                                                        console.log('⚡ [Realtime Sync] DayMaster updated:', dayMaster);
                                                    } catch (err) {
                                                        console.error('Failed to sync saju real-time:', err);
                                                    }
                                                }
                                            }}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-primary-olive transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end mb-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">태어난 시간</label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isTimeUnknown}
                                                    onChange={e => setFormData({ ...formData, isTimeUnknown: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-600 bg-black/30 text-primary-olive focus:ring-primary-olive/50 cursor-pointer"
                                                />
                                                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">태어난 시간을 모릅니다</span>
                                            </label>
                                        </div>
                                        <input
                                            type="time"
                                            value={formData.birthTime}
                                            onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
                                            disabled={formData.isTimeUnknown}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-primary-olive transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 ml-1">성별</label>
                                        <div className="flex bg-black/30 border border-white/5 rounded-xl p-1">
                                            {['남성', '여성', '기타'].map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => setFormData({ ...formData, gender: g })}
                                                    className={`flex-1 py-3 px-2 text-sm font-medium rounded-lg transition-all ${formData.gender === g ? 'bg-primary-olive text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleNext} className="mt-8 w-full bg-white text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors group">
                                    다음 단계로 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: 후성유전학 */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 flex-1 flex flex-col"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">후성유전학적 상태</h2>
                                    <p className="text-sm text-gray-400">최근 나의 뇌와 신체 컨디션은 어떤가요?</p>
                                </div>

                                <div className="space-y-7 flex-1">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 ml-1">주요 스트레스 요인 (다중 선택)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {STRESS_FACTORS.map(factor => {
                                                const isSelected = formData.stressFactors.includes(factor);
                                                return (
                                                    <button
                                                        key={factor}
                                                        onClick={() => toggleStressFactor(factor)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected
                                                            ? 'bg-primary-olive border-primary-olive text-white shadow-[0_0_10px_rgba(101,140,66,0.5)]'
                                                            : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                                            }`}
                                                    >
                                                        {factor}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-bold text-gray-500 ml-1">최근 수면의 질 (5점 척도)</label>
                                            <span className="text-xs text-primary-olive font-bold">{formData.sleepQuality}점</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="5"
                                            step="1"
                                            value={formData.sleepQuality}
                                            onChange={e => setFormData({ ...formData, sleepQuality: Number(e.target.value) })}
                                            className="w-full accent-primary-olive h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-500 px-1 mt-1">
                                            <span>매우 나쁨</span>
                                            <span>매우 좋음</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-bold text-gray-500 ml-1">현재 에너지 레벨 (배터리)</label>
                                            <span className="text-xs text-blue-400 font-bold">{formData.energyLevel}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            step="5"
                                            value={formData.energyLevel}
                                            onChange={e => setFormData({ ...formData, energyLevel: Number(e.target.value) })}
                                            className="w-full accent-blue-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-500 px-1 mt-1">
                                            <span>방전됨 (0%)</span>
                                            <span>충만함 (100%)</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleNext} className="mt-8 w-full bg-white text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors group">
                                    다음 단계로 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 3: 심리 지표 */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1 flex flex-col"
                            >
                                <div className="space-y-2 mb-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">심리 지표 입력</h2>
                                    <p className="text-sm text-gray-400">알고 있는 나의 심리 유형이 있다면 알려주세요.</p>
                                </div>

                                <div className="space-y-4 flex-1">
                                    {[
                                        { id: 'mbti', label: '16가지 성격 유형', placeholder: '예: INFJ' },
                                        { id: 'enneagram', label: '애니어그램 (핵심 동기)', placeholder: '예: 4번 유형' },
                                        { id: 'bigFive', label: 'Big 5 특성', placeholder: '주요 5대 특성 입력' },
                                        { id: 'disc', label: 'DISC 행동 유형', placeholder: '예: D형' },
                                    ].map(field => (
                                        <div key={field.id} className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 ml-1">{field.label}</label>
                                            <input
                                                type="text"
                                                value={(formData as any)[field.id]}
                                                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                                placeholder={field.placeholder}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-olive transition-all placeholder:text-gray-700 text-sm"
                                            />
                                        </div>
                                    ))}

                                    <div className="pt-2 text-center">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-xs text-primary-olive hover:text-[#88b560] font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
                                        >
                                            <Info className="w-3.5 h-3.5" />
                                            내 심리 유형을 모른다면? 💡
                                        </button>
                                    </div>
                                </div>

                                <button onClick={handleNext} className="mt-4 w-full bg-white text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors group">
                                    마지막 단계로 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 4: 완료 및 면책 조항 */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1 flex flex-col justify-between"
                            >
                                <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8">
                                    <div className="w-16 h-16 bg-primary-olive/20 rounded-full flex items-center justify-center mb-2">
                                        <ShieldCheck className="w-8 h-8 text-primary-olive" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">모든 준비가 끝났습니다.</h2>
                                    <p className="text-sm text-gray-400 max-w-[260px] leading-relaxed">
                                        입력해주신 소중한 데이터를 바탕으로<br />
                                        가장 개인화된 명심코칭이 시작됩니다.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* Legal & Compliance Agreement */}
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
                                        <p className="text-[11px] text-gray-500 leading-relaxed text-left">
                                            명심코칭의 분석 결과는 개인의 성장과 자아 탐색을 위한 코칭 목적이며, 의학적 분석이나 전문적인 심리 코칭를 대체하지 않습니다. 수집된 데이터는 맞춤형 코칭 제공을 위한 AI 분석 문맥(Context)으로만 안전하게 사용됩니다.
                                        </p>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.agreedToTerms}
                                                    onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-600 bg-black/30 text-primary-olive focus:ring-primary-olive/50 cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                                                위 면책 조항 및 개인정보 제공·활용에 동의합니다.
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleComplete}
                                        disabled={!formData.agreedToTerms}
                                        className="w-full bg-primary-olive hover:bg-[#6e944b] text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(101,140,66,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-olive disabled:shadow-none"
                                    >
                                        동의하고 명심코칭 시작하기
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Tooltip / Link Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-[#1a222c] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6 mt-2">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary-olive" />
                                    심리 유형 검사 안내
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    지금 당장 몰라도 괜찮아요! 명심코칭 AI와 대화하며 천천히 찾아가도 좋습니다. 미리 확인해보고 싶다면 아래 무료 검사를 활용해 보세요.
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {[
                                    { name: '16가지 성격 유형 검사', link: 'https://www.16personalities.com/ko', time: '약 10분' },
                                    { name: '애니어그램 가검사', link: '#', time: '약 15분' },
                                    { name: '카카오같이가치 빅파이브 검사', link: 'https://together.kakao.com/big-five', time: '약 5분' },
                                    { name: 'DISC 무료 검사', link: 'https://www.123test.com/ko/disc-%EC%84%B1%EA%B2%A9-%EA%B2%80%EC%82%AC/', time: '약 10분' },
                                ].map((test, idx) => (
                                    <a
                                        key={idx}
                                        href={test.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary-olive/50 transition-all group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white group-hover:text-primary-olive transition-colors">{test.name}</span>
                                            <span className="text-xs text-gray-500">{test.time}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm"
                            >
                                닫기
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}
