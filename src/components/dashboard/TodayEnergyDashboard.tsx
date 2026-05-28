'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { getTodayDailyPillar } from '@/utils/SajuCalculator';
import DailyMindRoutine from './DailyMindRoutine';
import MindGrowthStages from './MindGrowthStages';

/**
 * TodayEnergyDashboard - 오늘의 에너지 대시보드
 * 
 * 특징:
 * - 배터리 스타일 에너지 게이지
 * - 오늘의 일진/운세 (lunar-javascript 연동)
 * - 골든 타임 표시
 * - 럭키 아이템
 * - 프리미엄 미스틱 디자인
 */

// 골든 타임 매핑 (오행 기반)
const GOLDEN_TIME_MAP: Record<string, { time: string; activity: string }> = {
    '목': { time: '04:00 - 06:00', activity: '창작 활동' },
    '화': { time: '10:00 - 12:00', activity: '프레젠테이션' },
    '토': { time: '14:00 - 16:00', activity: '핵심 업무' },
    '금': { time: '16:00 - 18:00', activity: '협상/계약' },
    '수': { time: '22:00 - 24:00', activity: '깊은 사고' },
};

// 럭키 아이템 매핑 (오행 기반)
const LUCKY_ITEMS: Record<string, { icon: string; name: string; desc: string }> = {
    '목': { icon: '🌿', name: '녹색 식물', desc: '성장의 에너지' },
    '화': { icon: '🕯️', name: '캔들', desc: '열정의 빛' },
    '토': { icon: '🪨', name: '크리스탈', desc: '안정의 기운' },
    '금': { icon: '✒️', name: '골든 펜', desc: '결단의 도구' },
    '수': { icon: '💎', name: '블루 보석', desc: '지혜의 상징' },
};

// 오늘의 메시지 (일진 지지 기반)
const DAILY_MESSAGES: Record<string, { highlight: string; sub: string }> = {
    '자': { highlight: '새로운 시작의 기운이 감돕니다.', sub: '중요한 결정을 내리기 좋은 날입니다.' },
    '축': { highlight: '꾸준함이 빛을 발하는 날입니다.', sub: '작은 일도 정성껏 마무리하세요.' },
    '인': { highlight: '도전할 용기가 솟아오릅니다.', sub: '새로운 프로젝트를 시작해보세요.' },
    '묘': { highlight: '창의력이 폭발하는 날입니다.', sub: '예술적 영감을 따라가세요.' },
    '진': { highlight: '변화의 바람이 불어옵니다.', sub: '두려움 없이 변화를 받아들이세요.' },
    '사': { highlight: '열정이 불타오르는 날입니다.', sub: '적극적으로 어필하세요.' },
    '오': { highlight: '정점에 도달하는 에너지입니다.', sub: '중요한 미팅을 잡아보세요.' },
    '미': { highlight: '포용의 힘이 커지는 날입니다.', sub: '팀워크에 집중하세요.' },
    '신': { highlight: '장벽이 무너지는 날입니다.', sub: '미뤄왔던 어려운 연락을 시도해보세요.' },
    '유': { highlight: '결실을 거두는 기운입니다.', sub: '성과를 정리하고 축하하세요.' },
    '술': { highlight: '신뢰가 쌓이는 날입니다.', sub: '약속을 철저히 지키세요.' },
    '해': { highlight: '지혜가 빛나는 날입니다.', sub: '조용히 사색하며 통찰을 얻으세요.' },
};

interface TodayEnergyDashboardProps {
    onBack?: () => void;
    onSettings?: () => void;
    onAttack?: () => void;
    onDailyMessageClick?: (dailyGanji: string, message: string) => void; // [NEW] 오늘의 메시지 클릭 시 챗봇 상담
}

// 바이오리듬 데이터 타입
interface BiorhythmData {
    energyScore: number;
    mode: 'Attack' | 'Defense' | 'Recovery';
    advice: string;
    goldenTime: string;
    ganji: string;
}

export default function TodayEnergyDashboard({
    onBack,
    onSettings,
    onAttack,
    onDailyMessageClick
}: TodayEnergyDashboardProps) {
    const { reportData } = useReportStore();

    // [FIX] 오늘의 일진 계산 (SajuCalculator 연동) - 정확한 己卯 계산
    const [dailyPillar, setDailyPillar] = useState({ gan: '기', zhi: '묘', ganElement: '토', zhiElement: '목', ganColor: '#F59E0B', zhiColor: '#10B981' });

    // [NEW] 바이오리듬 데이터 (API 연동)
    const [biorhythmData, setBiorhythmData] = useState<BiorhythmData | null>(null);
    const [biorhythmLoading, setBiorhythmLoading] = useState(true);

    useEffect(() => {
        const pillar = getTodayDailyPillar();
        setDailyPillar(pillar);
    }, []);

    // Day Master 추출
    const dayMasterChar = useMemo(() => {
        const dayMaster = reportData?.saju?.dayMaster || '';
        // "갑 (목)" 형태에서 첫 글자 추출
        if (dayMaster) return dayMaster.charAt(0);
        return '갑'; // 기본값
    }, [reportData]);

    // [NEW] 바이오리듬 API 호출
    useEffect(() => {
        const fetchBiorhythm = async () => {
            try {
                const res = await fetch('/api/secure/daily-biorhythm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dayMaster: dayMasterChar })
                });
                if (res.ok) {
                    const json = await res.json();
                    setBiorhythmData(json.data);
                }
            } catch (e) {
                console.error('Biorhythm fetch error:', e);
            } finally {
                setBiorhythmLoading(false);
            }
        };

        if (dayMasterChar) {
            fetchBiorhythm();
        }
    }, [dayMasterChar]);

    const todayGan = dailyPillar.gan;
    const todayZhi = dailyPillar.zhi;
    const todayElement = dailyPillar.ganElement; // 일진 천간의 오행

    // 사주 기반 데이터 추출
    const dayMasterElement = useMemo(() => {
        const dayMaster = reportData?.saju?.dayMaster || '';
        if (dayMaster.includes('갑') || dayMaster.includes('을')) return '목';
        if (dayMaster.includes('병') || dayMaster.includes('정')) return '화';
        if (dayMaster.includes('무') || dayMaster.includes('기')) return '토';
        if (dayMaster.includes('경') || dayMaster.includes('신')) return '금';
        if (dayMaster.includes('임') || dayMaster.includes('계')) return '수';
        return todayElement; // 사용자 데이터 없으면 오늘 일진 오행 사용
    }, [reportData, todayElement]);

    // [FUSION] 에너지 점수 계산 (사주 50% + 바이오리듬 50%)
    const energyScore = useMemo(() => {
        const elements = reportData?.saju?.elements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
        const total = elements.wood + elements.fire + elements.earth + elements.metal + elements.water;

        // 사주 기반 점수 계산
        let sajuScore = Math.round((total / 5) + 60);

        // 일진과 일주 오행 간의 상생/상극 반영
        const interactions: Record<string, Record<string, number>> = {
            '목': { '화': 5, '수': 5, '금': -5, '토': 0, '목': 3 },
            '화': { '토': 5, '목': 5, '수': -5, '금': 0, '화': 3 },
            '토': { '금': 5, '화': 5, '목': -5, '수': 0, '토': 3 },
            '금': { '수': 5, '토': 5, '화': -5, '목': 0, '금': 3 },
            '수': { '목': 5, '금': 5, '토': -5, '화': 0, '수': 3 },
        };

        const bonus = interactions[dayMasterElement]?.[todayElement] || 0;
        sajuScore = Math.min(100, Math.max(50, sajuScore + bonus));

        // 바이오리듬 점수와 융합 (50:50)
        const bioScore = biorhythmData?.energyScore || sajuScore;
        const fusedScore = Math.round((sajuScore * 0.5) + (bioScore * 0.5));

        return Math.min(100, Math.max(40, fusedScore));
    }, [reportData, dayMasterElement, todayElement, biorhythmData]);

    // [FUSION] 모드 결정 (바이오리듬 우선)
    const energyMode = biorhythmData?.mode || 'Recovery';

    // [FUSION] 골든 타임 (바이오리듬 우선, 없으면 오행 기반)
    const goldenTime = biorhythmData?.goldenTime || GOLDEN_TIME_MAP[todayElement]?.time || '14:00 - 16:00';
    const goldenActivity = GOLDEN_TIME_MAP[todayElement]?.activity || '핵심 업무';

    // 럭키 아이템 (일주 오행 + 일진 오행 조합)
    const luckyItem = LUCKY_ITEMS[dayMasterElement] || LUCKY_ITEMS['금'];

    // [FUSION] 오늘의 메시지 (바이오리듬 advice 우선)
    const dailyMessage = biorhythmData
        ? { highlight: biorhythmData.advice.split('.')[0] + '.', sub: biorhythmData.advice.split('.').slice(1).join('.').trim() || '오늘 하루도 힘내세요!' }
        : (DAILY_MESSAGES[todayZhi] || DAILY_MESSAGES['묘']);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full min-h-screen bg-[#0B0915] text-gray-100 flex flex-col overflow-hidden"
        >
            {/* 배경 글로우 효과 */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] bg-[#2E1065] opacity-30 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-20%] w-[80%] h-[40%] bg-[#4C1D95] opacity-20 blur-[100px]" />
                <div className="absolute top-[20%] left-[-20%] w-[60%] h-[30%] bg-[#FCD34D] opacity-5 blur-[90px]" />
            </div>

            {/* 헤더 */}
            <header className="relative z-20 px-6 pt-12 pb-2 flex justify-between items-center w-full">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="text-gray-400 hover:text-white">←</span>
                </button>
                <h1 className="font-serif text-base font-bold tracking-[0.2em] text-amber-300/90" style={{ textShadow: '0 0 10px rgba(252, 211, 77, 0.3)' }}>
                    MYSTIC COACHING
                </h1>
                <button
                    onClick={onSettings}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="text-gray-400 hover:text-white">⚙️</span>
                </button>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="relative z-10 flex-1 px-5 pb-24 flex flex-col gap-5 overflow-y-auto">

                {/* 에너지 카드 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative w-full p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 mt-2 shadow-2xl"
                >
                    <div className="flex justify-between items-start mb-8">
                        {/* 배터리 + 점수 */}
                        <div className="flex items-center gap-5">
                            {/* 배터리 게이지 */}
                            <div className="relative w-[4.5rem] h-24 rounded-2xl border border-white/10 bg-black/40 p-1.5 shadow-inner">
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white/10 rounded-t-sm" />
                                <div className="w-full h-full rounded-xl bg-gray-900/50 relative overflow-hidden flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${energyScore}%` }}
                                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                        className="w-full rounded-lg relative"
                                        style={{
                                            background: 'linear-gradient(to top, #4C1D95 0%, #8B5CF6 50%, #FCD34D 100%)',
                                            animation: 'charge-pulse 3s infinite ease-in-out'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-50" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* 점수 */}
                            <div className="flex flex-col">
                                <span className="text-[0.65rem] font-serif font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">
                                    Today's Energy
                                </span>
                                <div className="flex items-baseline -ml-1">
                                    <span
                                        className="text-6xl font-serif font-bold tracking-tight"
                                        style={{
                                            background: 'linear-gradient(to bottom, #FCD34D, #D97706)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        {energyScore}
                                    </span>
                                    <span className="text-xl text-amber-400/60 font-light ml-1">%</span>
                                </div>
                            </div>
                        </div>

                        {/* 모드 버튼 + 일진 */}
                        <div className="flex flex-col items-end gap-3 pt-1">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onAttack}
                                className={`relative px-5 py-2 rounded-full overflow-hidden shadow-lg ${energyMode === 'Attack' ? 'shadow-red-900/40'
                                    : energyMode === 'Defense' ? 'shadow-blue-900/40'
                                        : 'shadow-green-900/40'
                                    }`}
                            >
                                <div className={`absolute inset-0 ${energyMode === 'Attack' ? 'bg-gradient-to-r from-red-600 to-red-800'
                                    : energyMode === 'Defense' ? 'bg-gradient-to-r from-blue-600 to-blue-800'
                                        : 'bg-gradient-to-r from-green-600 to-green-800'
                                    }`} />
                                <div className="relative flex items-center gap-2 z-10">
                                    <span className="text-white">
                                        {energyMode === 'Attack' ? '⚔️' : energyMode === 'Defense' ? '🛡️' : '🌿'}
                                    </span>
                                    <span className="text-[0.7rem] font-bold tracking-widest text-white">
                                        {energyMode === 'Attack' ? 'ATTACK' : energyMode === 'Defense' ? 'DEFENSE' : 'RECHARGE'}
                                    </span>
                                </div>
                            </motion.button>
                            <div className="text-right mt-1">
                                <p className="text-sm font-bold text-gray-200">{todayGan}{todayZhi}일</p>
                                <p className="text-[0.65rem] text-gray-500 font-medium tracking-wide mt-0.5">(오늘의 컨디션)</p>
                            </div>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    {/* 오늘의 메시지 - 클릭 시 챗봇 상담 */}
                    <div
                        className="relative px-2 cursor-pointer hover:bg-white/5 rounded-xl py-3 transition-colors group"
                        onClick={() => {
                            if (onDailyMessageClick) {
                                const ganji = `${todayGan}${todayZhi}`;
                                const message = `${dailyMessage.highlight} ${dailyMessage.sub}`;
                                onDailyMessageClick(ganji, message);
                            }
                        }}
                    >
                        <span className="absolute -top-3 -left-1 text-4xl text-amber-400/20 font-serif leading-none">"</span>
                        <p className="text-base font-serif text-gray-300 leading-relaxed text-center italic tracking-wide">
                            <span className="text-white drop-shadow-md">{dailyMessage.highlight}</span><br />
                            <span className="text-gray-400">{dailyMessage.sub}</span>
                        </p>
                        <span className="absolute -bottom-5 -right-1 text-4xl text-amber-400/20 font-serif leading-none">"</span>
                        {/* 클릭 유도 텍스트 */}
                        <div className="absolute bottom-0 right-2 text-[10px] text-amber-400/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            👆 터치하여 상세 상담
                        </div>
                    </div>
                </motion.div>

                {/* 골든 타임 + 보스 레이더 그리드 */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 골든 타임 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative overflow-hidden rounded-3xl p-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(252,211,77,0.2)] hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-all" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-5">
                            <div className="flex items-center justify-between">
                                <span className="text-[0.65rem] font-bold text-gray-500 tracking-[0.15em] uppercase">Golden Time</span>
                                <span className="text-sm animate-pulse" style={{ filter: 'drop-shadow(0 0 5px rgba(252,211,77,0.5))' }}>⏰</span>
                            </div>
                            <div>
                                <div className="text-xl font-serif font-bold text-white mb-1.5 tracking-wide">{goldenTime}</div>
                                <div className="text-xs text-amber-400 font-medium tracking-wide px-2 py-1 rounded bg-amber-400/10 inline-block border border-amber-400/20">
                                    {goldenActivity}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 보스 레이더 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group relative overflow-hidden rounded-3xl p-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:-translate-y-1"
                    >
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-5">
                            <div className="flex items-center justify-between">
                                <span className="text-[0.65rem] font-bold text-gray-500 tracking-[0.15em] uppercase">Boss Radar</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-xs text-gray-400 leading-tight">Current<br />Level</span>
                                <div className="relative">
                                    <span className="text-3xl text-violet-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.6))' }}>
                                        📡
                                    </span>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-violet-500/30 rounded-full animate-ping opacity-20" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 럭키 아이템 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-1 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 shadow-lg group-hover:border-amber-400/30 transition-colors">
                            <span className="text-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(252,211,77,0.4))' }}>
                                {luckyItem.icon}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-200">Lucky Item</span>
                            <span className="text-xs text-gray-500">{luckyItem.name} · {luckyItem.desc}</span>
                        </div>
                    </div>
                    <span className="text-gray-600 group-hover:text-amber-400 transition-colors">→</span>
                </motion.div>

                {/* --- [NEW] 데일리 마음 정렬 루틴 & 마음 성장 단계 --- */}
                <DailyMindRoutine />
                <MindGrowthStages />
            </main>

            {/* 하단 네비게이션 */}
            <nav className="absolute bottom-0 w-full z-20 px-6 pt-2 pb-6 bg-[#0B0915]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center text-[0.65rem] font-medium text-gray-500">
                <button className="flex flex-col items-center gap-1.5 text-amber-400" onClick={() => window.location.href = '/'}>
                    <span className="text-2xl">🏠</span>
                    <span>Home</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 hover:text-gray-300 transition-colors">
                    <span className="text-2xl">📅</span>
                    <span>Calendar</span>
                </button>
                <div className="w-14" /> {/* 중앙 버튼 공간 */}
                <button className="flex flex-col items-center gap-1.5 hover:text-gray-300 transition-colors">
                    <span className="text-2xl">🧠</span>
                    <span>Insight</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 hover:text-gray-300 transition-colors">
                    <span className="text-2xl">👤</span>
                    <span>Profile</span>
                </button>

                {/* 중앙 플로팅 버튼 */}
                <div className="absolute left-1/2 -top-8 -translate-x-1/2">
                    <motion.button
                        whileHover={{ y: -4 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_20px_rgba(252,211,77,0.3)] flex items-center justify-center border-[6px] border-[#0B0915]"
                    >
                        <span className="text-3xl">⚡</span>
                    </motion.button>
                </div>
            </nav>

            {/* 애니메이션 스타일 */}
            <style jsx>{`
                @keyframes charge-pulse {
                    0% { opacity: 0.8; filter: brightness(1); }
                    50% { opacity: 1; filter: brightness(1.2); box-shadow: 0 0 20px rgba(252, 211, 77, 0.4); }
                    100% { opacity: 0.8; filter: brightness(1); }
                }
            `}</style>
        </motion.div>
    );
}
