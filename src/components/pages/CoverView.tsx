import { useReportStore } from '@/store/useReportStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ChevronRight, Loader2, Sparkles, Map, Info } from 'lucide-react';
import { NeuralBlueprintMapper } from '@/modules/NeuralBlueprintMapper';
import { useEffect, useState } from 'react';
import { calculateSaju } from '@/utils/SajuCalculator';
import { AuthService } from '@/modules/AuthService';
import MultiDimensionalBlueprint, { type CodeData } from '@/components/chat/MultiDimensionalBlueprint';
import { PillarMetaCodeMap } from '@/modules/PillarMetaCodeMap';
import { supabase } from '@/lib/supabaseClient';

import { ZODIAC_TIME_OPTIONS } from '@/constants/saju';

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

export default function CoverView() {
    const router = useRouter();
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

    // [SYNC-HYDRATION] 로컬 스토리지 복원 시 상태 동기화
    useEffect(() => {
        if (reportData) {
            if (reportData.userName) setName(reportData.userName);
            if (reportData.birthDate) setBirthDate(reportData.birthDate);
            if (reportData.birthTime) setBirthTime(reportData.birthTime);
            if (reportData.gender) setGender(reportData.gender);
            if (reportData.meta?.calendarType) setCalendarType(reportData.meta.calendarType);

            // [NEW] previewPillars 상태를 복구하여 handleConfirm 내의 가드(!previewPillars)를 무사히 통과하도록 보장합니다.
            if (reportData.saju?.fourPillars) {
                setPreviewPillars({
                    year: reportData.saju.fourPillars.year,
                    month: reportData.saju.fourPillars.month,
                    day: reportData.saju.fourPillars.day,
                    time: reportData.saju.fourPillars.time,
                    dayMaster: reportData.saju.dayMaster
                });
            }
        }
    }, [reportData]);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Calculation
        setTimeout(() => {
            const timeVal = birthTime === 'unknown' ? '12:00' : birthTime; // Default to noon for unknown
            const pillars = calculateSaju(birthDate, timeVal, calendarType, gender);
            setPreviewPillars(pillars);
            const metrics = calculateSajuMetrics(pillars, birthTime === 'unknown');
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
                },
                saju: {
                    ...reportData?.saju,
                    dayMaster: pillars.dayMaster || `${pillars.day.gan.char} (${pillars.day.gan.color})`,
                    elements: metrics.elements,
                    ohaeng: metrics.ohaeng,
                    tenGods: metrics.tenGods,
                    fourPillars: {
                        year: pillars.year,
                        month: pillars.month,
                        day: pillars.day,
                        time: birthTime === 'unknown' ? { gan: { char: '?' }, ji: { char: '?' } } : pillars.time,
                    }
                } as any
            });

            setViewMode('result');
            setIsLoading(false);
        }, 800);
    };

    const handleConfirm = (targetRoute: 'intro' | 'onboarding' = 'intro') => {
        if (!previewPillars) return;

        const metrics = calculateSajuMetrics(previewPillars, birthTime === 'unknown');
        const dayMaster = previewPillars.dayMaster || `${previewPillars.day.gan.char} (${previewPillars.day.gan.color})`;

        // [SYNC-DB] 입력된 명리 생년월일 정보를 Supabase users 테이블에 영구 저장/동기화
        const saveProfileToDb = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const { error } = await supabase
                        .from('users')
                        .update({
                            name: name,
                            birth_date: birthDate,
                            birth_time: birthTime,
                            calendar_type: calendarType,
                            gender: gender
                        })
                        .eq('id', session.user.id);
                    
                    if (error) {
                        console.error('Failed to sync profile to users DB table:', error.message);
                    } else {
                        console.log('✅ [CoverView] Profile synced to users DB table successfully.');
                    }
                }
            } catch (dbErr) {
                console.error('Error syncing profile to DB:', dbErr);
            }
        };
        saveProfileToDb();

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
                elements: metrics.elements,
                ohaeng: metrics.ohaeng,
                tenGods: metrics.tenGods,
                dayMaster,
                fourPillars: {
                    year: previewPillars.year,
                    month: previewPillars.month,
                    day: previewPillars.day,
                    time: birthTime === 'unknown' ? { gan: { char: '?' }, ji: { char: '?' } } : previewPillars.time,
                }
            } as any
        });

        // URL 쿼리 파라미터 세척 (자동 챗 오픈 및 모달 팝업 방지)
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('intent');
            url.searchParams.delete('section');
            window.history.replaceState({}, '', url.pathname);
        }

        if (targetRoute === 'onboarding') {
            router.push('/onboarding');
        } else {
            nextStep(); // Move to Intro
        }
    };

    const ResultPillar = ({ label, gan, ji }: { label: string, gan: any, ji: any }) => (
        <div className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
            <div className="flex flex-col items-center gap-1 font-black text-2xl">
                <span style={{ color: gan.color, textShadow: `0 0 10px ${gan.color} 40` }}>{gan.char}</span>
                <span style={{ color: ji.color, textShadow: `0 0 10px ${ji.color} 40` }}>{ji.char}</span>
            </div>
        </div>
    );

    return (
        <main className="w-full max-w-md h-full flex flex-col p-0 overflow-hidden relative mx-auto bg-deep-slate">
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
                            <Camera className="w-4 h-4 rotate-180" />
                            <span>로그아웃</span>
                        </button>
                        <button aria-label="Notifications" className="text-gray-400 hover:text-white">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-olive ring-2 ring-deep-slate"></span>
                        </button>
                    </div>
                </nav>
                {/* END: TopNavigation */}

                {/* BEGIN: HeaderSection */}
                <section className="text-center mb-12" data-purpose="header-text">
                    <h1 className="text-3xl font-bold mb-3 tracking-tight text-[#e2e8f0]">
                        {viewMode === 'form' ? '명심코칭 시작하기' : '나의 기질 설계도'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {viewMode === 'form'
                            ? '정확한 분석을 위해 태어난 정보를 입력해주세요.'
                            : '이 분석 대상이 본인이 맞으신가요?'}
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
                                        className="w-full bg-secondary-slate/50 border border-white/10 text-white rounded-lg pl-11 py-4 focus:ring-1 focus:ring-primary-olive focus:border-primary-olive transition-all outline-none backdrop-blur-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Birth Date with Toggle */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-medium text-gray-500 ml-1">생년월일</label>
                                    <div className="flex bg-[#161d24] rounded-md p-0.5 border border-[#2c3641]">
                                        {['solar', 'lunar'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setCalendarType(type as any)}
                                                className={`px-3 py-1 text-[10px] rounded-md font-medium transition-colors ${calendarType === type
                                                    ? 'bg-primary-olive text-white'
                                                    : 'text-gray-500 hover:text-gray-300'
                                                    } `}
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
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-secondary-slate/50 border border-white/10 text-white rounded-lg pl-11 pr-4 py-4 focus:ring-1 focus:ring-primary-olive focus:border-primary-olive transition-all outline-none backdrop-blur-sm"
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
                                        className="w-full bg-secondary-slate/50 border border-white/10 text-white rounded-lg pl-11 py-4 appearance-none focus:ring-1 focus:ring-primary-olive focus:border-primary-olive transition-all outline-none backdrop-blur-sm"
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
                                            ? 'bg-white text-deep-slate shadow-sm'
                                            : 'bg-secondary-slate/50 border border-white/10 text-gray-400'
                                            } `}
                                    >
                                        {g === 'male' ? '남성' : '여성'}
                                    </button>
                                ))}
                            </div>

                            {/* Main Action Button */}
                            <div className="pt-4">
                                <button
                                    className="w-full bg-primary-olive hover:bg-[#557a35] text-white font-bold py-5 rounded-lg text-lg transition-colors shadow-lg shadow-primary-olive/20 flex justify-center items-center gap-2"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : '기질 데이터 추출하기'}
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* 사용자 확인 헤더 (hidden per user request) */}
                            <div className="hidden items-center justify-center gap-2 text-primary-olive">
                                <Check className="w-5 h-5 shadow-glow" />
                                <span className="text-sm font-bold uppercase tracking-wider">기질 데이터 추출 완료</span>
                            </div>
                            <div className="hidden text-center text-xs text-gray-400 leading-relaxed">
                                <p className="text-white font-medium text-sm">
                                    {name}님 ({calendarType === 'solar' ? '양력' : '음력'} {birthDate} {birthTime === 'unknown' ? '시간모름' : ZODIAC_TIME_OPTIONS.find(o => o.value === birthTime)?.label.split(' ')[0]})
                                </p>
                            </div>

                            {/* ✨ 새로운 다차원 기질 설계도 (Multi-Dimensional Blueprint) */}
                            <MultiDimensionalBlueprint
                                showActionButton={false}
                                data={(() => {
                                    // previewPillars에서 간지(干支) 추출하여 NeuralBlueprintMapper + PillarMetaCodeMap으로 변환
                                    const getPillarCode = (pillar: any, pillarType: 'year' | 'month' | 'day' | 'time', isUnknown: boolean = false): CodeData => {
                                        if (isUnknown) {
                                            return {
                                                id: 'unknown',
                                                title: '🚀 지향점 (Future Vision)',
                                                subtitle: '데이터 부족 (시간 정보 필요)',
                                                darkCode: { name: '[미확인]', desc: '태어난 시간을 입력하시면 분석이 가능합니다.' },
                                                neuralCode: { name: '[미확인]', desc: '태어난 시간을 입력하시면 분석이 가능합니다.' },
                                                metaCode: { name: '[미확인]', desc: '태어난 시간을 입력하시면 분석이 가능합니다.' },
                                            };
                                        }
                                        const ganji = pillar.gan.char + pillar.ji.char;
                                        const info = NeuralBlueprintMapper.getBlueprint(ganji);
                                        // 기둥별 전용 메타/뉴럴 코드 조회 (없으면 범용 폴백)
                                        const pillarMeta = PillarMetaCodeMap.getMetaCode(ganji, pillarType);
                                        const pillarNeural = PillarMetaCodeMap.getNeuralCode(ganji, pillarType);
                                        return {
                                            id: ganji,
                                            title: '',
                                            subtitle: pillarNeural ? pillarNeural.desc : (info.description || '기질 분석 중...'),
                                            darkCode: { name: info.darkCode || '[Shadow]', desc: info.darkDesc || '이 기질의 그림자 상태입니다.' },
                                            neuralCode: pillarNeural
                                                ? { name: pillarNeural.name, desc: pillarNeural.desc }
                                                : { name: info.summary || '[Neural]', desc: info.description || '이 기질의 활성화 상태입니다.' },
                                            metaCode: pillarMeta
                                                ? { name: pillarMeta.name, desc: pillarMeta.desc }
                                                : { name: info.metaCode || '[Meta]', desc: info.metaDesc || '이 기질의 최종 진화 상태입니다.' },
                                        };
                                    };

                                    const timePillar = getPillarCode(
                                        birthTime === 'unknown' ? null : previewPillars.time,
                                        'time',
                                        birthTime === 'unknown'
                                    );
                                    timePillar.title = `🚀 지향점 (Future Vision)`;

                                    const dayPillar = getPillarCode(previewPillars.day, 'day');
                                    dayPillar.title = `👤 핵심 자아 (Core Identity)`;

                                    const monthPillar = getPillarCode(previewPillars.month, 'month');
                                    monthPillar.title = `💼 사회적 환경 (Social Interface)`;

                                    const yearPillar = getPillarCode(previewPillars.year, 'year');
                                    yearPillar.title = `🌳 배경 에너지 (Base Energy)`;

                                    return [timePillar, dayPillar, monthPillar, yearPillar];
                                })()}
                            />

                            {/* 확인 & 코칭 시작 버튼 */}
                            <button
                                onClick={() => handleConfirm('intro')}
                                className="w-full bg-white hover:bg-gray-100 text-deep-slate font-bold py-5 rounded-xl text-lg transition-all shadow-xl flex justify-center items-center gap-2 group ring-4 ring-white/5 active:scale-95 mb-3"
                            >
                                🚀 나의 강점 활용법 코칭받기
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* 새로운 맞춤형 명심코칭 시작 버튼 (독립 모듈 연결) */}
                            <button
                                onClick={() => handleConfirm('onboarding')}
                                className="w-full bg-primary-olive hover:bg-[#6e944b] text-white font-bold py-5 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(101,140,66,0.2)] hover:shadow-[0_0_30px_rgba(101,140,66,0.4)] flex justify-center items-center gap-2 group active:scale-95"
                            >
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                나만의 맞춤형 명심코칭 시작하기
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setViewMode('form')}
                                    className="text-xs text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-gray-500 pb-0.5"
                                >
                                    정보 수정이 필요하신가요?
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* END: FormSection */}


            </div>

            {/* Bottom Navigation Bar */}
            <nav className="absolute bottom-0 left-0 right-0 bg-deep-slate/90 backdrop-blur-md border-t border-white/5 py-3 px-8 flex justify-between items-center z-20">
                <button
                    onClick={() => {
                        if (viewMode === 'result') {
                            setViewMode('form');
                        } else {
                            if (window.history.length > 2) {
                                router.back();
                            } else {
                                router.push('/login');
                            }
                        }
                    }}
                    className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="text-[10px] font-medium">Back</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 text-primary-olive hover:text-[#88b560] transition-colors"
                    onClick={() => window.location.reload()}
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="text-[10px] font-medium">Home</span>
                </button>
            </nav>
        </main>
    );
}

// === Helper Components for Profile Style ===

function PillarSummaryRow({ icon, label, ganji, isUnknown }: { icon: string, label: string, ganji: string, isUnknown?: boolean }) {
    if (isUnknown) {
        return (
            <div className="flex items-start gap-3 opacity-40">
                <span className="text-base mt-0.5">{icon}</span>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold text-gray-500">{label}:</span>
                        <span className="text-[11px] text-gray-600 italic">데이터 부족 (시간 정보 필요)</span>
                    </div>
                </div>
            </div>
        );
    }

    const info = NeuralBlueprintMapper.getBlueprint(ganji);

    return (
        <div className="flex items-start gap-4 group">
            <span className="text-lg mt-0.5 group-hover:scale-125 transition-transform duration-300">{icon}</span>
            <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-gray-400">{label}:</span>
                    <span className="text-sm font-bold text-white group-hover:text-primary-olive transition-colors">{info.summary}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                    (설명: {info.description})
                </p>
            </div>
        </div>
    );
}

