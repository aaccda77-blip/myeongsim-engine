'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { useMyeongsimProfile } from '@/hooks/useMyeongsimProfile';
import { generateFullReport, findIljuKey, reportToMarkdown } from '@/services/ReportContentGenerator';
import { SAJU_ILJU, TEN_GODS, TWELVE_STARS, ENERGY_CYCLE, MYUNGSIM_CODES, VOID_THEORY, MYEONGSIM_TRAIT_DESCRIPTIONS } from '@/data/StaticTextDB';
import { THERAPY_ARCHETYPES } from '@/data/TherapyDB';
import { THINKING_FORMULAS, FAILPROOF_STRATEGIES } from '@/data/StartupContentDB';
// [FIX] GeneKeyCalculator 직접 임포트
import { calculateMyeongsimProfile, parseBirthDate, MyeongsimProfile } from '@/utils/GeneKeyCalculator';

/**
 * SoulArchiveReport - 80페이지 소울 아카이브 종합 리포트
 * 
 * GeneKeyCalculator + Saju 듀얼 엔진 데이터 통합 표시
 * Part 1: The Core (본질)
 * Part 2: Neural Keys (유전자 키)
 * Part 3: Chronos (시간 흐름)
 * Part 4: Life Strategy (인생 전략)
 */

const SECTION_COLORS = {
    core: 'from-purple-600 to-violet-800',
    neural: 'from-emerald-500 to-teal-700',
    chronos: 'from-amber-500 to-orange-700',
    strategy: 'from-rose-500 to-pink-700',
    tengods: 'from-blue-500 to-indigo-700',
    stars: 'from-cyan-500 to-blue-700',
    energy: 'from-yellow-500 to-amber-600',
    codes: 'from-fuchsia-500 to-purple-700',
    void: 'from-gray-600 to-slate-800',
    traits: 'from-lime-500 to-green-700',
    therapy: 'from-pink-500 to-rose-600',
    startup: 'from-orange-500 to-red-600',
};

const PARTS = [
    { id: 'core', title: 'PART 1', subtitle: '당신의 본질', icon: '🧬', color: SECTION_COLORS.core },
    { id: 'goldenpath', title: 'PART 2', subtitle: '황금 경로', icon: '🌟', color: SECTION_COLORS.neural },
    { id: 'neural', title: 'PART 3', subtitle: '라이프 코드', icon: '✨', color: SECTION_COLORS.neural },
    { id: 'codes', title: 'PART 4', subtitle: '라이프 코드', icon: '🔢', color: SECTION_COLORS.codes },
    { id: 'tengods', title: 'PART 5', subtitle: '십성 분석', icon: '⚡', color: SECTION_COLORS.tengods },
    { id: 'stars', title: 'PART 6', subtitle: '12운성', icon: '⭐', color: SECTION_COLORS.stars },
    { id: 'void', title: 'PART 7', subtitle: '공망 이론', icon: '🕳️', color: SECTION_COLORS.void },
    { id: 'chronos', title: 'PART 8', subtitle: '운의 흐름', icon: '⏳', color: SECTION_COLORS.chronos },
    { id: 'energy', title: 'PART 9', subtitle: '에너지 사이클', icon: '🔄', color: SECTION_COLORS.energy },
    { id: 'therapy', title: 'PART 10', subtitle: '심리 치유', icon: '🧠', color: SECTION_COLORS.therapy },
    { id: 'startup', title: 'PART 11', subtitle: '성장 전략', icon: '🚀', color: SECTION_COLORS.startup },
    { id: 'traits', title: 'PART 12', subtitle: '특성 프로필', icon: '🏆', color: SECTION_COLORS.traits },
    { id: 'strategy', title: 'PART 13', subtitle: '인생 전략', icon: '🎯', color: SECTION_COLORS.strategy },
];

export default function SoulArchiveReport() {
    const { reportData } = useReportStore();
    const [activePart, setActivePart] = useState('core');

    // Gene Keys / 명심코칭 프로필 훅 (생년월일 기반 Gate.Line 계산)
    const myeongsimProfile = useMyeongsimProfile();

    // [FIX] 생년월일 데이터 가져오기 (reportData 또는 sessionStorage에서)
    const effectiveBirthDate = useMemo(() => {
        // 1순위: reportData에서 가져오기
        if (reportData?.birthDate) {
            console.log('[SoulArchiveReport] Using birthDate from reportData:', reportData.birthDate);
            return reportData.birthDate;
        }

        // 2순위: sessionStorage에서 가져오기
        if (typeof window !== 'undefined') {
            try {
                const storedData = sessionStorage.getItem('myeongsim-report-storage');
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    const bd = parsed?.state?.reportData?.birthDate;
                    if (bd) {
                        console.log('[SoulArchiveReport] Using birthDate from sessionStorage:', bd);
                        return bd;
                    }
                }
            } catch (e) {
                console.error('[SoulArchiveReport] Error reading sessionStorage:', e);
            }
        }

        console.warn('[SoulArchiveReport] No birthDate found in reportData or sessionStorage');
        return null;
    }, [reportData?.birthDate]);

    // [FIX] 생년월일 데이터가 있을 때 자동으로 Gene Keys 계산 수행
    useEffect(() => {
        if (effectiveBirthDate && !myeongsimProfile.profile?.isCalculated && !myeongsimProfile.isLoading) {
            console.log('[SoulArchiveReport] Triggering Gene Keys calculation for:', effectiveBirthDate);
            myeongsimProfile.calculate(
                effectiveBirthDate,
                reportData?.birthTime || '12:00',
                reportData?.meta?.calendarType || 'solar',
                reportData?.meta?.gender || 'male'
            );
        }
    }, [effectiveBirthDate, myeongsimProfile.profile?.isCalculated, myeongsimProfile.isLoading]);

    // [NEW] 동기적 Gate.Line 계산 (컴포넌트 렌더링 시 바로 계산)
    const directGateProfile = useMemo<MyeongsimProfile | null>(() => {
        if (!effectiveBirthDate) {
            console.log('[SoulArchiveReport] No birthDate for directGateProfile');
            return null;
        }
        try {
            const birthDateObj = parseBirthDate(effectiveBirthDate, reportData?.birthTime || '12:00', 9);
            const profile = calculateMyeongsimProfile(birthDateObj);
            console.log('[SoulArchiveReport] DirectGateProfile calculated:', {
                lifeOS: `${profile.activation.lifeOS.gate}.${profile.activation.lifeOS.line}`,
                growthTrigger: `${profile.activation.growthTrigger.gate}.${profile.activation.growthTrigger.line}`,
                bioEngine: `${profile.activation.bioEngine.gate}.${profile.activation.bioEngine.line}`,
                rootPurpose: `${profile.activation.rootPurpose.gate}.${profile.activation.rootPurpose.line}`,
            });
            return profile;
        } catch (e) {
            console.error('[SoulArchiveReport] Error calculating directGateProfile:', e);
            return null;
        }
    }, [effectiveBirthDate, reportData?.birthTime]);

    // 오행 매핑
    const ELEMENT_MAP: Record<string, string> = {
        '갑': '목', '을': '목', '병': '화', '정': '화',
        '무': '토', '기': '토', '경': '금', '신': '금',
        '임': '수', '계': '수'
    };

    // reportData.saju가 있으면 실제 데이터 사용
    const hasSajuData = reportData?.saju?.dayMaster;

    // 실제 사용자 프로필 생성 (reportData.saju + GeneKeyCalculator 기반)
    const userProfile = hasSajuData ? {
        fusion: {
            dayMaster: reportData.saju.dayMaster,
            dayMasterElement: ELEMENT_MAP[reportData.saju.dayMaster] || '?',
            // Gene Keys 계산기에서 가져온 실제 Gate.Line 값 사용
            lifeOSGate: myeongsimProfile.profile?.fusion?.lifeOSGate || '라이프코드 1.1',
            growthTriggerGate: myeongsimProfile.profile?.fusion?.growthTriggerGate || '라이프코드 2.1',
            bioEngineGate: myeongsimProfile.profile?.fusion?.bioEngineGate || '라이프코드 3.1',
            rootPurposeGate: myeongsimProfile.profile?.fusion?.rootPurposeGate || '라이프코드 4.1',
            summary: `${ELEMENT_MAP[reportData.saju.dayMaster] || ''} 에너지를 가진 ${reportData.saju.dayMaster} 코어 타입으로, ${reportData.saju.dayMasterTrait || '특별한 재능'}을 가진 프로필입니다.`
        },
        saju: reportData.saju,
        astro: myeongsimProfile.profile?.astro, // Gene Keys 전체 데이터
        error: null
    } : null;

    // 데모 프로필 (생년월일 없을 때 사용)
    const demoProfile = {
        fusion: {
            dayMaster: '갑',
            dayMasterElement: '목',
            lifeOSGate: myeongsimProfile.profile?.fusion?.lifeOSGate || '라이프코드 1.3',
            growthTriggerGate: myeongsimProfile.profile?.fusion?.growthTriggerGate || '라이프코드 2.5',
            bioEngineGate: myeongsimProfile.profile?.fusion?.bioEngineGate || '라이프코드 43.2',
            rootPurposeGate: myeongsimProfile.profile?.fusion?.rootPurposeGate || '라이프코드 41.1',
            summary: '성장과 확장의 에너지를 가진 코어 타입으로, 라이프코드 1번을 탑재한 프로필입니다.'
        },
        astro: myeongsimProfile.profile?.astro,
        error: null
    };

    const userName = reportData?.userName || '탐험가';
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    // 사용할 프로필 (실제 사주 데이터 우선)
    const activeProfile = userProfile || demoProfile;
    const showDemoNotice = !hasSajuData;
    const isLoading = false;
    const error = null;

    // 일주 키 찾기 및 상세 콘텐츠 생성
    const iljuKey = useMemo(() => {
        console.log('[SoulArchiveReport] reportData.saju:', reportData?.saju);

        if (hasSajuData && reportData.saju.dayMaster) {
            // dayMaster는 "신 (금)" 형태일 수 있으므로 첫 글자만 추출
            const dayMasterRaw = reportData.saju.dayMaster;
            const dayMasterChar = typeof dayMasterRaw === 'string' ? dayMasterRaw.charAt(0) : '';

            // fourPillars.day.ji 객체 구조 확인
            const dayPillar = reportData.saju.fourPillars?.day as any;
            const jiData = dayPillar?.ji;

            console.log('[SoulArchiveReport] jiData structure:', JSON.stringify(jiData));

            // 여러 가지 가능한 속성명 시도
            let branch = '';
            if (typeof jiData === 'string') {
                branch = jiData;
            } else if (jiData) {
                branch = jiData.char || jiData.character || jiData.value || jiData.kor || Object.values(jiData)[0] || '';
            }

            console.log('[SoulArchiveReport] dayMasterChar:', dayMasterChar, 'branch:', branch);

            const calculatedKey = findIljuKey(dayMasterChar, branch) || 'GAP_JA';
            console.log('[SoulArchiveReport] calculatedKey:', calculatedKey);
            return calculatedKey;
        }
        console.log('[SoulArchiveReport] No saju data, using GAP_JA');
        return 'GAP_JA';
    }, [hasSajuData, reportData]);

    // StaticTextDB에서 실제 일주 데이터 가져오기
    const iljuData = useMemo(() => {
        console.log('[SoulArchiveReport] Using iljuKey:', iljuKey);
        return SAJU_ILJU[iljuKey] || SAJU_ILJU['GAP_JA'];
    }, [iljuKey]);

    const fullReport = useMemo(() => {
        return generateFullReport(userName, iljuKey);
    }, [userName, iljuKey]);

    // PDF 다운로드 함수
    const handlePdfDownload = () => {
        const markdown = reportToMarkdown(fullReport);
        console.log('PDF Content:', markdown);
        alert('PDF로 저장하려면 인쇄 대화상자에서 "PDF로 저장"을 선택하세요.');
        window.print();
    };

    // Gate 포맷팅
    const formatGate = (gate: string | undefined) => gate || 'Gate --';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0B0915] text-gray-100"
        >
            {/* 배경 효과 */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[40%] bg-violet-800/10 blur-[100px]" />
            </div>

            {/* 헤더 */}
            <header className="relative z-10 px-6 pt-8 pb-6 border-b border-white/5">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <p className="text-purple-400 text-sm font-medium tracking-widest mb-2">MIND TOTEM</p>
                        <h1 className="text-3xl font-serif font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
                            소울 아카이브
                        </h1>
                        <p className="text-gray-500 text-sm">80페이지 프리미엄 종합 리포트</p>
                    </motion.div>

                    {/* 발행 정보 */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <span className="text-gray-500">수신인:</span>
                                <span className="text-white font-medium ml-2">{userName} 님</span>
                            </div>
                            <div>
                                <span className="text-gray-500">발행일:</span>
                                <span className="text-white font-medium ml-2">{today}</span>
                            </div>
                        </div>
                        {activeProfile?.fusion?.dayMaster && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <span className="text-gray-500">일주:</span>
                                <span className="text-purple-400 font-bold ml-2">{activeProfile.fusion.dayMaster}</span>
                                <span className="text-gray-600 mx-2">|</span>
                                <span className="text-gray-500">라이프 OS:</span>
                                <span className="text-emerald-400 font-bold ml-2">{activeProfile.fusion.lifeOSGate}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </header>

            {/* 파트 네비게이션 */}
            <nav className="relative z-10 px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0B0915]/90 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto pb-2">
                    {PARTS.map((part) => (
                        <button
                            key={part.id}
                            onClick={() => setActivePart(part.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activePart === part.id
                                ? `bg-gradient-to-r ${part.color} text-white shadow-lg`
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <span className="mr-2">{part.icon}</span>
                            {part.subtitle}
                        </button>
                    ))}
                </div>
            </nav>

            {/* 메인 콘텐츠 */}
            <main className="relative z-10 px-6 py-8 pb-24">
                <div className="max-w-4xl mx-auto">
                    {/* 데모 모드 알림 */}
                    {showDemoNotice && (
                        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                            <p className="text-amber-400 text-sm font-medium">⚠️ 데모 모드로 표시 중입니다</p>
                            <p className="text-gray-400 text-xs mt-1">개인 맞춤 분석을 위해 생년월일을 입력해주세요.</p>
                        </div>
                    )}

                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState error={error} />
                    ) : (
                        <AnimatePresence mode="wait">
                            {activePart === 'core' && <CoreSection profile={activeProfile} fullReport={fullReport} iljuData={iljuData} key="core" />}
                            {activePart === 'goldenpath' && <GoldenPathSection profile={activeProfile} astroProfile={myeongsimProfile.profile?.astro} isLoading={myeongsimProfile.isLoading} key="goldenpath" />}
                            {activePart === 'neural' && <NeuralSection profile={activeProfile} iljuData={iljuData} key="neural" />}
                            {activePart === 'codes' && <CodesSection iljuKey={iljuKey} key="codes" />}
                            {activePart === 'tengods' && <TenGodsSection iljuKey={iljuKey} key="tengods" />}
                            {activePart === 'stars' && <TwelveStarsSection iljuKey={iljuKey} key="stars" />}
                            {activePart === 'void' && <VoidSection iljuKey={iljuKey} key="void" />}
                            {activePart === 'chronos' && <ChronosSection iljuKey={iljuKey} key="chronos" />}
                            {activePart === 'energy' && <EnergyCycleSection iljuKey={iljuKey} key="energy" />}
                            {activePart === 'therapy' && <TherapySection iljuKey={iljuKey} key="therapy" />}
                            {activePart === 'startup' && <StartupSection iljuKey={iljuKey} key="startup" />}
                            {activePart === 'traits' && <TraitsSection iljuKey={iljuKey} key="traits" />}
                            {activePart === 'strategy' && <StrategySection profile={activeProfile} iljuData={iljuData} key="strategy" />}
                        </AnimatePresence>
                    )}
                </div>
            </main>

            {/* 하단 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0B0915] via-[#0B0915]/95 to-transparent z-50">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <button
                        type="button"
                        onClick={() => { window.location.href = '/'; }}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-all cursor-pointer"
                    >
                        ← 돌아가기
                    </button>
                    <button
                        type="button"
                        onClick={() => { window.print(); }}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 text-white font-bold shadow-lg shadow-purple-900/30 hover:shadow-purple-800/50 transition-all cursor-pointer"
                    >
                        📄 PDF 다운로드
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ============== 로딩 상태 ==============
function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-purple-400 animate-pulse">영혼의 설계도를 해독하고 있습니다...</p>
        </div>
    );
}

// ============== 에러 상태 ==============
function ErrorState({ error }: { error: string }) {
    return (
        <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
            <p className="text-red-400">⚠️ {error}</p>
            <p className="text-gray-500 text-sm mt-2">생년월일이 입력되지 않았거나 계산 중 오류가 발생했습니다.</p>
        </div>
    );
}

// ============== Part 1: The Core ==============
function CoreSection({ profile, fullReport, iljuData }: { profile: any; fullReport?: any; iljuData?: any }) {
    const fusion = profile?.fusion;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="당신의 본질 (The Core)"
                subtitle="타고난 기질과 라이프 코드"
                gradient={SECTION_COLORS.core}
            />

            {/* 일주 제목 및 키워드 */}
            {iljuData?.title && (
                <div className="p-6 bg-gradient-to-r from-purple-900/50 to-violet-900/50 rounded-3xl border border-purple-500/20">
                    <h3 className="text-xl font-bold text-white mb-2">{iljuData.title}</h3>
                    {iljuData.keywords && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {iljuData.keywords.map((kw: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">{kw}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 일주 분석 */}
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-purple-500/20">🧬</span>
                    일주론 심층 분석
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-black/30 rounded-xl">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">코어 타입 (Core Type)</p>
                        <p className="text-2xl font-bold text-purple-400">{fusion?.dayMaster || '분석 중...'}</p>
                    </div>
                    <div className="p-4 bg-black/30 rounded-xl">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">에너지 타입 (Energy Type)</p>
                        <p className="text-2xl font-bold text-purple-400">{fusion?.dayMasterElement || '분석 중...'}</p>
                    </div>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {iljuData?.main_text || fusion?.summary || '당신의 영혼은 고유한 에너지 패턴을 가지고 있습니다.'}
                </p>
            </div>

            {/* 강점 & 약점 */}
            {(iljuData?.strengths || iljuData?.weaknesses) && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-900/20 rounded-2xl border border-emerald-500/20">
                        <h4 className="text-emerald-400 font-bold mb-3">💪 강점</h4>
                        <ul className="space-y-1">
                            {(iljuData.strengths || []).slice(0, 5).map((s: string, i: number) => (
                                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 bg-rose-900/20 rounded-2xl border border-rose-500/20">
                        <h4 className="text-rose-400 font-bold mb-3">⚠️ 주의점</h4>
                        <ul className="space-y-1">
                            {(iljuData.weaknesses || []).slice(0, 5).map((w: string, i: number) => (
                                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* 라이프 코드 정보 */}
            <div className="grid grid-cols-2 gap-4">
                <GateCard title="라이프 OS" gate={fusion?.lifeOSGate} desc="의식의 태양" color="purple" />
                <GateCard title="성장 트리거" gate={fusion?.growthTriggerGate} desc="성장의 계기" color="violet" />
                <GateCard title="바이오 엔진" gate={fusion?.bioEngineGate} desc="생체 엔진" color="fuchsia" />
                <GateCard title="근본 목적" gate={fusion?.rootPurposeGate} desc="뿌리 목적" color="pink" />
            </div>
        </motion.div>
    );
}

// ============== Part 2: 라이프 코드 ==============
function NeuralSection({ profile, iljuData }: { profile: any; iljuData?: any }) {
    // StaticTextDB에서 일주 데이터의 다크/뉴럴/메타 코드 가져오기
    const darkCode = iljuData?.dark_code || {
        name: '다크 코드',
        desc: '당신의 성장을 막는 무의식 패턴을 인식하세요.',
        body_symptom: '스트레스가 신체적 증상으로 나타날 수 있습니다.'
    };
    const neuralCode = iljuData?.neural_code || {
        name: '뉴럴 코드',
        desc: '다크코드를 넘어설 때 드러나는 타고난 재능입니다.',
        action: '일상에서 작은 변화를 시작하세요.'
    };
    const metaCode = iljuData?.meta_code || {
        name: '메타 코드',
        desc: '당신이 도달할 수 있는 최고의 의식 수준입니다.'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="라이프 코드 (Life Code)"
                subtitle="의식의 3단계 스펙트럼"
                gradient={SECTION_COLORS.neural}
            />

            {/* 다크코드 → 뉴럴코드 → 메타코드 */}
            <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-700 to-gray-900 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">🌑</span>
                        <div>
                            <h4 className="text-lg font-bold text-white">다크 코드 (Dark Code)</h4>
                            <p className="text-white/60 text-sm">{darkCode.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-300 mb-3">{darkCode.desc}</p>
                    <p className="text-gray-500 text-sm">💊 신체 증상: {darkCode.body_symptom}</p>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-800 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">🧬</span>
                        <div>
                            <h4 className="text-lg font-bold text-white">뉴럴 코드 (Neural Code)</h4>
                            <p className="text-white/60 text-sm">{neuralCode.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-100 mb-3">{neuralCode.desc}</p>
                    <p className="text-emerald-200 text-sm">⚡ 액션: {neuralCode.action}</p>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-600 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">✨</span>
                        <div>
                            <h4 className="text-lg font-bold text-white">메타 코드 (Meta Code)</h4>
                            <p className="text-white/60 text-sm">{metaCode.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-900">{metaCode.desc}</p>
                </div>
            </div>
        </motion.div>
    );
}

// ============== Part 3: Chronos ==============
function ChronosSection({ iljuKey }: { iljuKey: string }) {
    const currentYear = new Date().getFullYear();

    // 결정적 에너지 값 계산 (사용자별로 다르지만 일관됨)
    const getYearlyEnergy = (year: number) => {
        return 50 + getHashIndex(iljuKey + year.toString(), 50, 100 + year);
    };

    const getMonthlyEnergy = (month: number) => {
        return 50 + getHashIndex(iljuKey + month.toString(), 50, 200 + month);
    };

    // 10-year wave type (성장/수양/변화/안정)
    const decadePatterns = ['성장', '수양', '변화', '안정'];
    const getDecadeType = (yearOffset: number) => {
        const idx = getHashIndex(iljuKey + yearOffset.toString(), decadePatterns.length, 300 + yearOffset);
        return decadePatterns[idx];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="운의 흐름 (Chronos)"
                subtitle="10년 라이프 웨이브와 월별 리듬"
                gradient={SECTION_COLORS.chronos}
            />

            {/* 10년 라이프 웨이브 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm print:break-inside-avoid print:bg-white print:border-gray-200">
                <h3 className="text-lg font-bold text-white mb-4">📅 10년 라이프 웨이브 (Decade Flow)</h3>
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }, (_, i) => {
                        const energy = getYearlyEnergy(currentYear + i);
                        const isCurrentYear = i === 0;
                        const decadeType = getDecadeType(i);
                        return (
                            <div
                                key={i}
                                className={`p-3 rounded-xl text-center ${isCurrentYear ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-black/30'}`}
                            >
                                <p className="text-xs text-gray-500">{currentYear + i}</p>
                                <p className={`text-sm font-bold ${isCurrentYear ? 'text-amber-400' : 'text-gray-400'}`}>
                                    {decadeType}
                                </p>
                                <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                        style={{ width: `${energy}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 12개월 월운 */}
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">🗓️ 12개월 월운 (Monthly Rhythm)</h3>
                <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 12 }, (_, i) => {
                        const energy = getMonthlyEnergy(i + 1);
                        return (
                            <div key={i} className="p-3 bg-black/30 rounded-xl">
                                <p className="text-xs text-gray-500">{i + 1}월</p>
                                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                        style={{ width: `${energy}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{energy}%</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

// ============== Part 4: Life Strategy ==============
function StrategySection({ profile, iljuData }: { profile: any; iljuData?: any }) {
    const careerFit = iljuData?.career_fit || ['적성 직무 분석', '성공 전략 설계', '부의 그릇 확장'];
    const relationshipStyle = iljuData?.relationship_style || '연애 스타일 분석 결과가 여기에 표시됩니다.';
    const healthWarning = iljuData?.health_warning || '건강 관련 주의사항이 여기에 표시됩니다.';
    const luckyElements = iljuData?.lucky_elements || { color: '미정', number: '미정', direction: '미정' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="인생 전략 (Life Strategy)"
                subtitle="영역별 맞춤 전략"
                gradient={SECTION_COLORS.strategy}
            />

            <div className="space-y-4">
                {/* 커리어 & 재물 */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-2xl">💼</span>
                        커리어 & 재물
                    </h3>
                    <div className="mb-4">
                        <h4 className="text-rose-400 font-medium mb-2">추천 직업군</h4>
                        <div className="flex flex-wrap gap-2">
                            {careerFit.map((job: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-rose-500/20 rounded-full text-rose-300 text-sm">{job}</span>
                            ))}
                        </div>
                    </div>
                    {luckyElements && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="p-3 bg-black/30 rounded-xl text-center">
                                <p className="text-gray-500 text-xs">행운의 색상</p>
                                <p className="text-white font-bold">{luckyElements.color}</p>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl text-center">
                                <p className="text-gray-500 text-xs">행운의 숫자</p>
                                <p className="text-white font-bold">{luckyElements.number}</p>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl text-center">
                                <p className="text-gray-500 text-xs">행운의 방향</p>
                                <p className="text-white font-bold">{luckyElements.direction}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 관계 & 사랑 */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-2xl">❤️</span>
                        관계 & 사랑
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{relationshipStyle}</p>
                </div>

                {/* 건강 & 웰니스 */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-2xl">🏥</span>
                        건강 & 웰니스
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{healthWarning}</p>
                </div>
            </div>
        </motion.div>
    );
}

// ============== Helper Components ==============
function SectionHeader({ title, subtitle, gradient }: { title: string; subtitle: string; gradient: string }) {
    return (
        <div className={`p-6 rounded-3xl bg-gradient-to-r ${gradient}`}>
            <p className="text-white/60 text-sm font-medium mb-1">{subtitle}</p>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
    );
}

function GateCard({ title, gate, desc, color }: { title: string; gate?: string; desc: string; color: string }) {
    // Gate X.Y → 라이프코드 X.Y 형식으로 변환
    const formatCode = (g: string | undefined) => {
        if (!g) return '라이프코드 --';
        if (g.startsWith('라이프코드')) return g;
        return g.replace('Gate ', '라이프코드 ');
    };
    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{title}</p>
            <p className={`text-xl font-bold text-${color}-400`}>{formatCode(gate)}</p>
            <p className="text-gray-600 text-xs mt-1">{desc}</p>
        </div>
    );
}

function NeuralKeyCard({ stage, title, description, icon, color }: { stage: string; title: string; description: string; icon: string; color: string }) {
    return (
        <div className={`p-6 rounded-3xl bg-gradient-to-r ${color} border border-white/10`}>
            <div className="flex items-center gap-4">
                <span className="text-3xl">{icon}</span>
                <div>
                    <h4 className="text-lg font-bold text-white">{title}</h4>
                    <p className="text-white/60 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}

function StrategyCard({ icon, title, items }: { icon: string; title: string; items: string[] }) {
    return (
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                {title}
            </h3>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ============== Part 4: 십성 분석 ==============
function TenGodsSection({ iljuKey }: { iljuKey: string }) {
    // 십성은 일주에 따라 주도적인 성향 2개 선택
    const myGods = useMemo(() =>
        getDeterministicSubset(TEN_GODS, iljuKey, 2, 200),
        [iljuKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="십성 분석 (Ten Gods)"
                subtitle="사회적 관계와 역할"
                gradient={SECTION_COLORS.tengods}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myGods.map((god: any, i: number) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-amber-400 font-bold text-lg">{god.title}</h4>
                            <span className="text-xs px-2 py-1 bg-amber-900/30 rounded text-amber-200">{god.career_tendency}</span>
                        </div>
                        <ul className="space-y-2 mb-4">
                            {(god.keywords || []).map((k: string, j: number) => (
                                <li key={j} className="text-gray-300 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    {k}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ============== Part 5: 12운성 ==============
function TwelveStarsSection({ iljuKey }: { iljuKey: string }) {
    // 12운성은 일생의 주기 중 가장 강한 1개 선택
    const myStar = useMemo(() =>
        getDeterministicSubset(TWELVE_STARS, iljuKey, 1, 300)[0],
        [iljuKey]);

    if (!myStar) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="12운성 (The 12 Stars)"
                subtitle="생명 에너지의 순환 단계"
                gradient={SECTION_COLORS.stars}
            />

            <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-3xl border border-orange-500/20">
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">🌟</span>
                    <div>
                        <h3 className="text-2xl font-bold text-orange-400">{myStar.title}</h3>
                        <p className="text-gray-400">{myStar.main_text}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-black/20 rounded-xl">
                        <h5 className="text-xs text-orange-500 mb-1 font-bold">다크 코드</h5>
                        <p className="text-sm text-gray-300">{myStar.dark_code?.desc}</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <h5 className="text-xs text-orange-500 mb-1 font-bold">뉴럴 코드</h5>
                        <p className="text-sm text-gray-300">{myStar.neural_code?.action}</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <h5 className="text-xs text-orange-500 mb-1 font-bold">메타 코드</h5>
                        <p className="text-sm text-gray-300">{myStar.meta_code?.desc}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ============== Part 6: 에너지 사이클 ==============
function EnergyCycleSection({ iljuKey }: { iljuKey: string }) {
    const cycleList = Object.values(ENERGY_CYCLE).slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="에너지 사이클 (Energy Cycle)"
                subtitle="에너지 순환 패턴"
                gradient={SECTION_COLORS.energy}
            />

            <div className="space-y-4">
                {cycleList.map((cycle: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{cycle.icon || '🔄'}</span>
                            <h4 className="text-white font-bold">{cycle.name || cycle.element || '에너지'}</h4>
                        </div>
                        <p className="text-gray-400 text-sm">{cycle.desc || cycle.description || '에너지 흐름 분석'}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ============== 해시 유틸리티 (결정적 랜덤 선택용) ==============
function getHashIndex(key: string, max: number, seed: number = 0): number {
    let hash = 0;
    const str = key + seed.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % max;
}

function getDeterministicSubset<T>(data: Record<string, T>, key: string, count: number, seedOffset: number = 0): T[] {
    const values = Object.values(data);
    if (values.length === 0) return [];

    // 단순 슬라이싱 대신 해시 기반 선택
    const result: T[] = [];
    const usedIndices = new Set<number>();

    // 첫 번째 아이템은 항상 일주별 고유 시작점
    let currentIndex = getHashIndex(key, values.length, seedOffset);

    while (result.length < count && result.length < values.length) {
        if (!usedIndices.has(currentIndex)) {
            result.push(values[currentIndex]);
            usedIndices.add(currentIndex);
        }
        // 다음 인덱스는 해시로 점프 (골고루 분포)
        currentIndex = (currentIndex + 7) % values.length;
    }

    return result;
}

// ============== Part 3: 운명 코드 (64 Codes) ==============
function CodesSection({ iljuKey }: { iljuKey: string }) {
    // 일주별로 결정적인 3개의 운명 코드 선택
    const myCodes = useMemo(() =>
        getDeterministicSubset(MYUNGSIM_CODES, iljuKey, 3, 100),
        [iljuKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="운명 코드 (Destiny Codes)"
                subtitle="당신의 64개 인생 시나리오 중 핵심"
                gradient={SECTION_COLORS.codes}
            />

            <div className="space-y-4">
                {myCodes.map((code: any, i: number) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="text-fuchsia-400 font-bold mb-2">{code.title || `코드 ${code.number}`}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {(code.keywords || []).slice(0, 3).map((kw: string, j: number) => (
                                <span key={j} className="px-2 py-0.5 bg-fuchsia-500/20 rounded-full text-fuchsia-300 text-xs">{kw}</span>
                            ))}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{code.main_insight || ''}</p>
                        <p className="text-gray-500 text-xs italic">{code.life_lesson || ''}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-4 bg-fuchsia-900/20 rounded-xl text-center">
                <p className="text-sm text-fuchsia-300">
                    * 위 코드는 당신의 영혼 설계도에 각인된 핵심 테마입니다.
                </p>
            </div>
        </motion.div>
    );
}

// ============== Part 6: 공망 이론 ==============
function VoidSection({ iljuKey }: { iljuKey: string }) {
    // 공망은 1개의 핵심 공망 선택
    const myVoid = useMemo(() =>
        getDeterministicSubset(VOID_THEORY, iljuKey, 1, 400)[0],
        [iljuKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="공망 이론 (Void Theory)"
                subtitle="빈 곳에서 피어나는 가능성"
                gradient={SECTION_COLORS.void}
            />

            {myVoid && (
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{myVoid.visual_token || '🕳️'}</span>
                        <h4 className="text-white font-bold">{myVoid.title || '공망'}</h4>
                    </div>
                    {myVoid.dark_code && (
                        <div className="mb-3 p-3 bg-gray-800/50 rounded-xl">
                            <p className="text-gray-400 text-xs uppercase mb-1">다크 코드: {myVoid.dark_code.name}</p>
                            <p className="text-gray-300 text-sm">{myVoid.dark_code.desc}</p>
                        </div>
                    )}
                    {myVoid.neural_code && (
                        <div className="p-3 bg-emerald-900/30 rounded-xl">
                            <p className="text-emerald-400 text-xs uppercase mb-1">뉴럴 코드: {myVoid.neural_code.name}</p>
                            <p className="text-gray-300 text-sm">{myVoid.neural_code.action || myVoid.neural_code.desc}</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

// ============== Part 9: 특성 프로필 ==============
function TraitsSection({ iljuKey }: { iljuKey: string }) {
    // 특성은 3개 선택
    const myTraits = useMemo(() =>
        getDeterministicSubset(MYEONGSIM_TRAIT_DESCRIPTIONS, iljuKey, 3, 500),
        [iljuKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="특성 프로필 (Traits)"
                subtitle="당신의 고유한 성향과 잠재력"
                gradient={SECTION_COLORS.traits}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTraits.map((trait: any, i: number) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <h4 className="text-cyan-400 font-bold mb-2 text-lg">{trait.trait || '특성'}</h4>
                        <p className="text-gray-300 text-sm mb-3">"{trait.description}"</p>

                        <div className="p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/10">
                            <p className="text-xs text-cyan-200 font-medium mb-1">💡 코칭 조언</p>
                            <p className="text-xs text-gray-400">{trait.advice}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ============== Part 9: 심리 치유 (Therapy) ==============
function TherapySection({ iljuKey }: { iljuKey: string }) {
    // 2개의 치유 아키타입 선택
    const myTherapy = useMemo(() =>
        getDeterministicSubset(THERAPY_ARCHETYPES, iljuKey, 2, 600),
        [iljuKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="심리 치유 (Therapy)"
                subtitle="내면의 상처를 치유하는 아키타입"
                gradient={SECTION_COLORS.therapy}
            />

            <div className="grid grid-cols-1 gap-6">
                {myTherapy.map((arch: any, i: number) => (
                    <div key={i} className="p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-3xl border border-indigo-500/20">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl">{arch.visual_token || '🧘'}</span>
                            <div>
                                <h3 className="text-xl font-bold text-indigo-300">{arch.name_ko} ({arch.name})</h3>
                                <p className="text-xs text-indigo-400/60 uppercase">치유 아키타입</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-black/20 rounded-xl">
                                <p className="text-xs text-rose-400 font-bold mb-1">🌑 트리거 (Wound)</p>
                                <p className="text-sm text-gray-300">{arch.dark_code?.trigger || '스트레스 상황'}</p>
                            </div>
                            <div className="p-3 bg-black/20 rounded-xl">
                                <p className="text-xs text-emerald-400 font-bold mb-1">✨ 치유법 (Healing)</p>
                                <p className="text-sm text-gray-300">{arch.neural_code?.method || '휴식과 안정'}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-xs text-indigo-200 font-bold mb-2">✨ 치유 확언 (Affirmation)</p>
                            <p className="text-lg text-white font-serif italic text-center">"{arch.affirmation}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ============== Part 10: 성장 전략 ==============
function StartupSection({ iljuKey }: { iljuKey: string }) {
    // 배열에서 결정적 선택
    const myFormula = useMemo(() => {
        const startIndex = getHashIndex(iljuKey, THINKING_FORMULAS.length, 700);
        const result = [];
        for (let i = 0; i < 2 && i < THINKING_FORMULAS.length; i++) {
            result.push(THINKING_FORMULAS[(startIndex + i) % THINKING_FORMULAS.length]);
        }
        return result;
    }, [iljuKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <SectionHeader
                title="성장 전략 (Growth Strategy)"
                subtitle="한계를 돌파하는 사고 공식"
                gradient={SECTION_COLORS.startup}
            />

            <div className="space-y-4">
                {myFormula.map((f: any, i: number) => (
                    <div key={i} className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
                        <h4 className="text-xl font-bold text-white mb-2">{f.name}</h4>
                        <p className="text-gray-400 text-sm mb-4">{f.description}</p>

                        <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs mt-0.5">X</div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold">기존 사고 (Old Way)</p>
                                    <p className="text-sm text-gray-400">{f.old_way}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs mt-0.5">O</div>
                                <div>
                                    <p className="text-xs text-green-500 font-bold">새로운 사고 (New Way)</p>
                                    <p className="text-sm text-white">{f.new_way}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">🚀 적용 액션</p>
                            <p className="text-sm text-gray-300">{f.action_step}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ============== Part 2: 황금 경로 (Golden Path) ==============
function GoldenPathSection({ profile, astroProfile, isLoading }: { profile: any; astroProfile?: any; isLoading?: boolean }) {
    // 펼침 상태 관리
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // astroProfile에서 Gate.Line 값 추출
    const activation = astroProfile?.activation;
    const venus = astroProfile?.venus;
    const pearl = astroProfile?.pearl;

    // Gate.Line 포맷 함수
    const formatGate = (gatePos: any) => {
        if (!gatePos) return '--';
        return `${gatePos.gate}.${gatePos.line}`;
    };

    // 챗봇으로 상담 요청
    const handleConsult = (gateName: string, gateValue: string) => {
        const message = `${gateName} ${gateValue}번 코드에 대해 자세히 알려주세요.`;
        window.location.href = `/?q=${encodeURIComponent(message)}`;
    };

    // 활성화 시퀀스 데이터
    const activationSequence = [
        { id: 'lifeOS', label: '라이프 OS', gate: activation?.lifeOS, icon: '☀️', desc: '의식의 태양 - 삶의 방향', detail: '당신의 삶을 이끄는 핵심 프로그램입니다. 이 코드는 당신이 세상에 어떻게 기여하고, 어떤 역할을 수행해야 하는지를 나타냅니다.' },
        { id: 'growthTrigger', label: '성장 트리거', gate: activation?.growthTrigger, icon: '🌍', desc: '의식의 지구 - 성장 계기', detail: '균형과 안정을 찾기 위해 발달시켜야 할 영역입니다. 이 코드를 통해 성장의 촉매를 발견할 수 있습니다.' },
        { id: 'bioEngine', label: '바이오 엔진', gate: activation?.bioEngine, icon: '🔥', desc: '무의식의 태양 - 내면 동력', detail: '타인에게 자연스럽게 발산하는 에너지입니다. 의식하지 않아도 주변에 영향을 미치는 당신의 본능적 힘입니다.' },
        { id: 'rootPurpose', label: '루트 퍼포즈', gate: activation?.rootPurpose, icon: '🌱', desc: '무의식의 지구 - 뿌리 목적', detail: '삶의 깊은 목적과 연결된 코드입니다. 이것이 당신 존재의 가장 근본적인 이유를 나타냅니다.' },
    ];

    // 비너스 시퀀스 데이터
    const venusSequence = venus ? [
        { id: 'attraction', label: '어트랙션', gate: venus.attraction, icon: '💫', desc: '끌림의 패턴', detail: '당신이 다른 사람에게 끌리거나 끌리게 만드는 방식입니다. 관계의 시작점이 됩니다.' },
        { id: 'iq', label: 'IQ 포인트', gate: venus.iq, icon: '🧠', desc: '지적 감수성', detail: '관계 속에서 지적 교류가 이루어지는 방식입니다. 대화와 아이디어 공유의 패턴입니다.' },
        { id: 'eq', label: 'EQ 포인트', gate: venus.eq, icon: '❤️', desc: '감정적 친밀감', detail: '감정적 연결과 친밀감이 형성되는 방식입니다. 깊은 유대감의 열쇠입니다.' },
        { id: 'sq', label: 'SQ 포인트', gate: venus.sq, icon: '✨', desc: '영적 연결', detail: '영혼 수준의 연결이 이루어지는 방식입니다. 관계의 가장 깊은 차원입니다.' },
    ] : null;

    // 펄 시퀀스 데이터
    const pearlSequence = pearl ? [
        { id: 'coreMission', label: '코어 미션', gate: pearl.coreMission, icon: '🎯', desc: '핵심 사명', detail: '당신의 직업적 핵심 사명입니다. 세상에 가치를 전달하는 당신만의 방식입니다.' },
        { id: 'ecoSystem', label: '에코시스템', gate: pearl.ecoSystem, icon: '🌐', desc: '협력 네트워크', detail: '함께 일할 때 최고의 결과를 만드는 협력 방식입니다. 시너지의 열쇠입니다.' },
        { id: 'signature', label: '시그니처', gate: pearl.signatureSignal, icon: '📡', desc: '고유한 신호', detail: '세상에 전달하는 당신만의 독특한 브랜드입니다. 차별화의 원천입니다.' },
        { id: 'reward', label: '퀀텀 리워드', gate: pearl.quantumReward, icon: '💎', desc: '최종 보상', detail: '궁극적으로 받게 될 보상의 형태입니다. 번영의 최종 목적지입니다.' },
    ] : null;

    // 카드 렌더링 함수
    const renderCard = (item: any, colorClass: string) => {
        const isExpanded = expandedCard === item.id;
        const gateValue = formatGate(item.gate);

        return (
            <motion.div
                key={item.id}
                layout
                className={`p-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 cursor-pointer transition-all hover:border-white/30 ${isExpanded ? 'col-span-2 md:col-span-4' : ''}`}
                onClick={() => setExpandedCard(isExpanded ? null : item.id)}
            >
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                        <p className={`text-xs ${colorClass} uppercase font-bold`}>{item.label}</p>
                        <p className="text-2xl font-bold text-white">{gateValue}</p>
                    </div>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-gray-400"
                    >
                        ▼
                    </motion.span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                        >
                            <p className="text-sm text-gray-300 mb-4">{item.detail}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleConsult(item.label, gateValue);
                                }}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
                            >
                                💬 자세히 상담하기
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <SectionHeader
                title="황금 경로 (Golden Path)"
                subtitle="당신만의 3단계 생명 설계도"
                gradient={SECTION_COLORS.neural}
            />

            {(isLoading || !astroProfile) && (
                <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
                    <p className="text-amber-400">⏳ Gate.Line 계산 중...</p>
                </div>
            )}

            {/* 활성화 시퀀스 (Activation Sequence) */}
            <div className="p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-3xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    ⚡ 활성화 시퀀스 (Life Architecture)
                </h3>
                <p className="text-purple-200/60 text-sm mb-6">카드를 터치하면 상세 설명과 상담 연결이 가능합니다</p>

                <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activationSequence.map((item) => renderCard(item, 'text-purple-300'))}
                </motion.div>
            </div>

            {/* 비너스 시퀀스 (Venus Sequence) */}
            {venusSequence && (
                <div className="p-6 bg-gradient-to-br from-pink-900/50 to-rose-900/50 rounded-3xl border border-pink-500/20">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        💕 비너스 시퀀스 (Love Protocol)
                    </h3>
                    <p className="text-pink-200/60 text-sm mb-6">관계와 사랑의 패턴을 결정하는 4개의 코드</p>

                    <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {venusSequence.map((item) => renderCard(item, 'text-pink-300'))}
                    </motion.div>
                </div>
            )}

            {/* 펄 시퀀스 (Pearl Sequence) */}
            {pearlSequence && (
                <div className="p-6 bg-gradient-to-br from-amber-900/50 to-yellow-900/50 rounded-3xl border border-amber-500/20">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        💰 펄 시퀀스 (Prosperity Protocol)
                    </h3>
                    <p className="text-amber-200/60 text-sm mb-6">번영과 풍요의 흐름을 결정하는 4개의 코드</p>

                    <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pearlSequence.map((item) => renderCard(item, 'text-amber-300'))}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
