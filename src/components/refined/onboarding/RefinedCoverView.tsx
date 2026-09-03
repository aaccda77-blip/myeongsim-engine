'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju } from '@/utils/SajuCalculator';
import { ZODIAC_TIME_OPTIONS } from '@/constants/saju';
import { RefinedSurface } from '../design-system/RefinedSurface';
import { RefinedButton } from '../design-system/RefinedButton';
import { RefinedFormField } from '../design-system/RefinedFormField';
import { ViewModeSwitcher } from '@/components/simple/ViewModeSwitcher';
import { Check, Loader2, ArrowRight, Sparkles, User, Calendar, Clock } from 'lucide-react';

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

export function RefinedCoverView() {
    const router = useRouter();
    const { nextStep, updateUserData, reportData } = useReportStore();

    // Form State (기존과 100% 동일)
    const [name, setName] = useState(reportData?.userName || '');
    const [birthDate, setBirthDate] = useState(reportData?.birthDate || '');
    const [birthTime, setBirthTime] = useState(reportData?.birthTime || 'unknown');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (reportData) {
            if (reportData.userName) setName(reportData.userName);
            if (reportData.birthDate) setBirthDate(reportData.birthDate);
            if (reportData.birthTime) setBirthTime(reportData.birthTime);
            if (reportData.gender) setGender(reportData.gender);
            if (reportData.meta?.calendarType) setCalendarType(reportData.meta.calendarType);
        }
    }, [reportData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const timeVal = birthTime === 'unknown' ? '12:00' : birthTime;
            const pillars = calculateSaju(birthDate, timeVal, calendarType, gender);
            const metrics = calculateSajuMetrics(pillars, birthTime === 'unknown');

            const fullUserData: any = {
                userName: name,
                birthDate,
                birthTime,
                gender: gender,
                meta: {
                    ...reportData?.meta,
                    calendarType,
                    gender,
                    isTimeUnknown: birthTime === 'unknown',
                    isLeapMonth: reportData?.meta?.isLeapMonth || false
                },
                saju: {
                    ...reportData?.saju,
                    dayMaster: pillars.dayMaster || `${pillars.day?.gan?.char || pillars.day?.gan?.label} (${pillars.day?.gan?.color || ''})`,
                    elements: metrics.elements,
                    ohaeng: metrics.ohaeng,
                    tenGods: metrics.tenGods,
                    fourPillars: {
                        year: pillars.year,
                        month: pillars.month,
                        day: pillars.day,
                        time: birthTime === 'unknown' ? { gan: { char: '?' }, ji: { char: '?' } } : pillars.time,
                    }
                }
            };

            updateUserData(fullUserData);
            useReportStore.getState().setDeepScanResult(null);

            if (typeof window !== 'undefined') {
                localStorage.setItem('user_name', name);
                localStorage.setItem('user_profile', JSON.stringify(fullUserData));
            }

            // 기질 분석 뷰로 이동
            setTimeout(() => {
                setIsLoading(false);
                nextStep();
            }, 500);
        } catch (error) {
            console.error('[RefinedCoverView] Error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-2 px-1 space-y-4 text-left select-none animate-fade-in">
            
            {/* 단일화된 App Header (헤더 중복 제거) */}
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#F4F6F8] tracking-tight">
                        명심 기질 분석
                    </h2>
                    <p className="text-xs text-[#9AA7B7]">
                        선천 기질과 의식 알고리즘을 도출합니다.
                    </p>
                </div>
                <ViewModeSwitcher />
            </div>

            {/* 입력 카드 서피스 */}
            <RefinedSurface className="p-5 sm:p-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* 1. 이름 필드 */}
                    <RefinedFormField label="성함 / 닉네임">
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름을 입력하세요"
                                className="w-full h-13 px-4 rounded-xl bg-[#0d1624] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/30 text-sm font-medium transition-all"
                                required
                            />
                        </div>
                    </RefinedFormField>

                    {/* 2. 생년월일 & 양/음력 토글 */}
                    <RefinedFormField
                        label="생년월일"
                        rightElement={
                            <div className="flex bg-[#0d1624] rounded-lg p-0.5 border border-white/10">
                                {['solar', 'lunar'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setCalendarType(t as any)}
                                        className={`px-2.5 py-0.5 text-[11px] rounded-md font-bold transition-all cursor-pointer ${
                                            calendarType === t
                                                ? 'bg-[#FFAA00] text-slate-950 shadow-sm'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {t === 'solar' ? '양력' : '음력'}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full h-13 px-4 rounded-xl bg-[#0d1624] border border-white/10 text-white focus:outline-none focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/30 text-sm font-medium transition-all"
                            required
                        />
                    </RefinedFormField>

                    {/* 3. 태어난 시간 */}
                    <RefinedFormField
                        label="태어난 시간"
                        helper={birthTime !== 'unknown' ? `* ${ZODIAC_TIME_OPTIONS.find(o => o.value === birthTime)?.hint}` : undefined}
                    >
                        <select
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="w-full h-13 px-4 rounded-xl bg-[#0d1624] border border-white/10 text-white focus:outline-none focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/30 text-sm font-medium transition-all appearance-none cursor-pointer"
                        >
                            {ZODIAC_TIME_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-[#101B2E] text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </RefinedFormField>

                    {/* 4. 성별 선택 (무지개 그라데이션 제거, 남/여 동일 인터랙션 룰) */}
                    <RefinedFormField label="성별">
                        <div className="grid grid-cols-2 gap-2.5">
                            {['male', 'female'].map((g) => {
                                const isSelected = gender === g;
                                return (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g as any)}
                                        className={`h-13 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#FFAA00]/15 border-2 border-[#FFAA00] text-amber-300 shadow-sm'
                                                : 'bg-[#0d1624] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        {isSelected && <Check size={14} className="text-[#FFAA00]" />}
                                        <span>{g === 'male' ? '남성 ♂' : '여성 ♀'}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </RefinedFormField>

                    {/* 5. Clean Solid Button (56px 높이, 솔리드 앰버, 과도한 글로우 배제) */}
                    <div className="pt-2">
                        <RefinedButton
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            icon={isLoading ? <Loader2 className="animate-spin size-4" /> : <ArrowRight size={16} />}
                        >
                            {isLoading ? '기질 데이터 분석 중...' : '기질 데이터 추출하기'}
                        </RefinedButton>
                    </div>
                </form>
            </RefinedSurface>
        </div>
    );
}
