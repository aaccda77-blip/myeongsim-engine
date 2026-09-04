'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Zap, Sparkles, Compass, Clock, Flame, Shield, Heart, 
    ChevronRight, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2,
    Calendar, Moon, Sun, Star
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { getTodayDailyPillar } from '@/utils/SajuCalculator';
import { useWearableContext } from './WearableAppShell';
import { ActivityTracker } from '@/services/activityTracker';

interface WearableIljinEnergyProps {
    onGoToAffirmation?: () => void;
    onGoToSoundLab?: () => void;
}

// 10천간 오행 및 음양 정의
const STEM_DATA: Record<string, { element: string; yinyang: '+' | '-'; name: string; color: string; bgGlow: string }> = {
    '갑': { element: '목', yinyang: '+', name: '갑목(甲木)', color: '#10B981', bgGlow: 'rgba(16, 185, 129, 0.25)' },
    '을': { element: '목', yinyang: '-', name: '을목(乙木)', color: '#34D399', bgGlow: 'rgba(52, 211, 153, 0.25)' },
    '병': { element: '화', yinyang: '+', name: '병화(丙火)', color: '#EF4444', bgGlow: 'rgba(239, 68, 68, 0.25)' },
    '정': { element: '화', yinyang: '-', name: '정화(丁火)', color: '#F87171', bgGlow: 'rgba(248, 113, 113, 0.25)' },
    '무': { element: '토', yinyang: '+', name: '무토(戊土)', color: '#F59E0B', bgGlow: 'rgba(245, 158, 11, 0.25)' },
    '기': { element: '토', yinyang: '-', name: '기토(己土)', color: '#FBBF24', bgGlow: 'rgba(251, 191, 36, 0.25)' },
    '경': { element: '금', yinyang: '+', name: '경금(庚金)', color: '#E2E8F0', bgGlow: 'rgba(226, 232, 240, 0.25)' },
    '신': { element: '금', yinyang: '-', name: '신금(辛金)', color: '#CBD5E1', bgGlow: 'rgba(203, 213, 225, 0.25)' },
    '임': { element: '수', yinyang: '+', name: '임수(壬水)', color: '#3B82F6', bgGlow: 'rgba(59, 130, 246, 0.25)' },
    '계': { element: '수', yinyang: '-', name: '계수(癸水)', color: '#60A5FA', bgGlow: 'rgba(96, 165, 250, 0.25)' },
};

// 십성 관계 분석 데이터
const TEN_GODS_INFO: Record<string, {
    title: string;
    keyword: string;
    mode: 'ATTACK' | 'CREATION' | 'HARVEST' | 'BREAKTHROUGH' | 'RECOVERY';
    modeLabel: string;
    modeIcon: string;
    score: number;
    advice: string;
    goldenTime: string;
    luckyColor: string;
    luckyElement: string;
}> = {
    '비견': {
        title: '비견(比肩) · 주체성 확립',
        keyword: '자신감과 독자적 추진력',
        mode: 'ATTACK',
        modeLabel: '주도적 추진 모드',
        modeIcon: '🔥',
        score: 88,
        advice: '주변의 눈치를 보지 말고, 내가 주도권을 쥐고 명확한 방향을 선포하세요.',
        goldenTime: '13:00 - 15:00',
        luckyColor: '코발트 블루',
        luckyElement: '수(水)'
    },
    '겁재': {
        title: '겁재(劫財) · 경쟁 돌파',
        keyword: '강력한 승부욕과 돌파력',
        mode: 'ATTACK',
        modeLabel: '한계 돌파 모드',
        modeIcon: '⚡',
        score: 84,
        advice: '마찰을 두려워하지 말고, 나의 잠재된 야망을 건전한 승부로 치환하세요.',
        goldenTime: '10:00 - 12:00',
        luckyColor: '화이트 실버',
        luckyElement: '금(金)'
    },
    '식신': {
        title: '식신(食神) · 창의적 몰입',
        keyword: '풍요로운 아이디어와 편안함',
        mode: 'CREATION',
        modeLabel: '창조 몰입 모드',
        modeIcon: '✨',
        score: 94,
        advice: '자연스러운 직관에 몸을 맡기세요. 머릿속 아이디어가 현실로 구현됩니다.',
        goldenTime: '14:00 - 17:00',
        luckyColor: '에메랄드 그린',
        luckyElement: '목(木)'
    },
    '상관': {
        title: '상관(傷官) · 혁신과 표현',
        keyword: '기존 틀을 깨는 천재적 발상',
        mode: 'CREATION',
        modeLabel: '혁신 발산 모드',
        modeIcon: '💡',
        score: 90,
        advice: '틀에 박힌 규칙을 과감히 깨뜨려 보세요. 독창적인 표현이 빛을 발합니다.',
        goldenTime: '15:00 - 18:00',
        luckyColor: '앰버 골드',
        luckyElement: '토(土)'
    },
    '편재': {
        title: '편재(偏財) · 공간 장악과 결실',
        keyword: '신속한 기회 포착과 실질 성과',
        mode: 'HARVEST',
        modeLabel: '기회 포착 모드',
        modeIcon: '🎯',
        score: 89,
        advice: '시야를 넓게 열고 큰 그림을 보세요. 예상치 못한 귀한 기회가 눈에 띕니다.',
        goldenTime: '11:00 - 13:00',
        luckyColor: '선셋 레드',
        luckyElement: '화(火)'
    },
    '정재': {
        title: '정재(正財) · 정밀한 성취',
        keyword: '안정적인 결실과 꼼꼼한 마감',
        mode: 'HARVEST',
        modeLabel: '안정 결실 모드',
        modeIcon: '💎',
        score: 91,
        advice: '작은 디테일을 빈틈없이 마무리하세요. 축적된 노력이 보상으로 돌아옵니다.',
        goldenTime: '09:00 - 11:00',
        luckyColor: '어스 브라운',
        luckyElement: '토(土)'
    },
    '편관': {
        title: '편관(偏官) · 카리스마 집중',
        keyword: '강인한 절제와 결단력',
        mode: 'BREAKTHROUGH',
        modeLabel: '카리스마 집중 모드',
        modeIcon: '🛡️',
        score: 82,
        advice: '외부의 압박에 흔들리지 마세요. 고도의 집중력으로 핵심 난제를 정면 돌파하세요.',
        goldenTime: '08:00 - 10:00',
        luckyColor: '딥 블랙',
        luckyElement: '수(水)'
    },
    '정관': {
        title: '정관(正官) · 신뢰와 명예',
        keyword: '단정한 품격과 원칙 준수',
        mode: 'BREAKTHROUGH',
        modeLabel: '품격 신뢰 모드',
        modeIcon: '👑',
        score: 87,
        advice: '약속과 신뢰를 가장 우선순위에 두세요. 당신의 품격이 모두를 설득합니다.',
        goldenTime: '13:00 - 15:00',
        luckyColor: '포레스트 그린',
        luckyElement: '목(木)'
    },
    '편인': {
        title: '편인(偏印) · 심오한 통찰',
        keyword: '비범한 영감과 학문적 사색',
        mode: 'RECOVERY',
        modeLabel: '영적 사색 모드',
        modeIcon: '🔮',
        score: 86,
        advice: '눈앞의 잡음을 끄고 본질을 사색하세요. 세상의 이면을 꿰뚫는 통찰이 떠오릅니다.',
        goldenTime: '20:00 - 22:00',
        luckyColor: '바이올렛 퍼플',
        luckyElement: '화(火)'
    },
    '정인': {
        title: '정인(正印) · 우주의 자비와 수용',
        keyword: '깊은 내면 치유와 배움의 은혜',
        mode: 'RECOVERY',
        modeLabel: '치유 충전 모드',
        modeIcon: '🌿',
        score: 95,
        advice: '조급함을 내려놓고 나 자신을 따스하게 안아주세요. 우주의 지지가 가득합니다.',
        goldenTime: '06:00 - 08:30',
        luckyColor: '스카이 블루',
        luckyElement: '수(水)'
    }
};

export function WearableIljinEnergy({
    onGoToAffirmation,
    onGoToSoundLab
}: WearableIljinEnergyProps) {
    const { reportData } = useReportStore();
    const { isLargeText } = useWearableContext();
    
    // 워치 전용 3대 탭 (0: 요약 다이얼, 1: 24시간 바이오리듬 곡선, 2: 1:1 맞춤 처방)
    const [subTab, setSubTab] = useState<0 | 1 | 2>(0);

    // 1. 사용자 사주 일간(DayMaster) 추출
    const dayMasterChar = useMemo(() => {
        const raw = reportData?.saju?.dayMaster || '';
        if (raw) return raw.charAt(0);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('user_saju_daymaster');
            if (saved) return saved.charAt(0);
        }
        return '경'; // 기본값 (경금)
    }, [reportData]);

    // 2. 오늘의 일진 천간 및 지지 계산
    const dailyPillar = useMemo(() => {
        try {
            return getTodayDailyPillar();
        } catch (e) {
            return { gan: '병', zhi: '오', ganElement: '화', zhiElement: '화', ganColor: '#EF4444', zhiColor: '#F87171' };
        }
    }, []);

    // 3. 내 일간 x 오늘 일진의 십성(TenGod) 케미 계산
    const chemistry = useMemo(() => {
        const myData = STEM_DATA[dayMasterChar] || STEM_DATA['경'];
        const todayData = STEM_DATA[dailyPillar.gan] || STEM_DATA['병'];

        const myElem = myData.element;
        const todayElem = todayData.element;
        const sameYinYang = myData.yinyang === todayData.yinyang;

        let tenGodKey = '정인';

        if (myElem === todayElem) {
            tenGodKey = sameYinYang ? '비견' : '겁재';
        } else if (
            (myElem === '목' && todayElem === '화') ||
            (myElem === '화' && todayElem === '토') ||
            (myElem === '토' && todayElem === '금') ||
            (myElem === '금' && todayElem === '수') ||
            (myElem === '수' && todayElem === '목')
        ) {
            tenGodKey = sameYinYang ? '식신' : '상관';
        } else if (
            (myElem === '목' && todayElem === '토') ||
            (myElem === '화' && todayElem === '금') ||
            (myElem === '토' && todayElem === '수') ||
            (myElem === '금' && todayElem === '목') ||
            (myElem === '수' && todayElem === '화')
        ) {
            tenGodKey = sameYinYang ? '편재' : '정재';
        } else if (
            (myElem === '목' && todayElem === '금') ||
            (myElem === '화' && todayElem === '수') ||
            (myElem === '토' && todayElem === '목') ||
            (myElem === '금' && todayElem === '화') ||
            (myElem === '수' && todayElem === '토')
        ) {
            tenGodKey = sameYinYang ? '편관' : '정관';
        } else {
            // 인성
            tenGodKey = sameYinYang ? '편인' : '정인';
        }

        const info = TEN_GODS_INFO[tenGodKey] || TEN_GODS_INFO['식신'];

        return {
            myStem: myData,
            todayStem: todayData,
            tenGodKey,
            ...info
        };
    }, [dayMasterChar, dailyPillar]);

    // 첫 진입 시 인터랙션 트래킹
    useEffect(() => {
        ActivityTracker.track(
            `🔮 [사주 일진] ${chemistry.title} 다이얼 확인`,
            'WATCH',
            `에너지 스코어: ${chemistry.score}점, ${chemistry.modeLabel}`
        );
    }, [chemistry.title, chemistry.score, chemistry.modeLabel]);

    // 햅틱 진동 피드백
    const triggerHaptic = () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try { navigator.vibrate(30); } catch (e) {}
        }
    };

    const handleTabChange = (nextTab: 0 | 1 | 2) => {
        triggerHaptic();
        setSubTab(nextTab);
    };

    // 에너지 게이지 둘레 계산 (반지름 42)
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (chemistry.score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-between h-full w-full px-2 py-1 select-none font-sans text-white">
            
            {/* 상단 3개 탭 전환 버튼 */}
            <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-full border border-white/10 mb-1">
                <button
                    onClick={() => handleTabChange(0)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                        subTab === 0 ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    에너지 링
                </button>
                <button
                    onClick={() => handleTabChange(1)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                        subTab === 1 ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    시간대 파동
                </button>
                <button
                    onClick={() => handleTabChange(2)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                        subTab === 2 ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    맞춤 처방
                </button>
            </div>

            {/* 메인 탭 0: 원형 에너지 링 & 케미스트리 다이얼 */}
            {subTab === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in space-y-1.5">
                    
                    {/* 상단 사주 x 일진 케미 배지 */}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-[9px] font-mono">
                        <span style={{ color: chemistry.myStem.color }} className="font-black">
                            내 사주 {chemistry.myStem.name.slice(0, 2)}
                        </span>
                        <span className="text-gray-400">✕</span>
                        <span style={{ color: chemistry.todayStem.color }} className="font-black">
                            오늘 {dailyPillar.gan}{dailyPillar.zhi}일
                        </span>
                    </div>

                    {/* 중앙 원형 에너지 아크 게이지 (Apple Watch / Galaxy 스타일) */}
                    <div className="relative size-28 flex items-center justify-center">
                        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                            {/* 배경 링 */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="8"
                            />
                            {/* 동적 에너지 링 */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="url(#energyGradient)"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="50%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* 링 내부 스코어 & 십성 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] text-amber-300 font-black tracking-tight leading-none mb-0.5">
                                {chemistry.modeIcon} {chemistry.tenGodKey}
                            </span>
                            <span className={`${isLargeText ? 'text-2xl' : 'text-xl'} font-black text-white font-mono leading-none tracking-tight`}>
                                {chemistry.score}
                                <span className="text-[10px] text-cyan-300 font-normal ml-0.5">%</span>
                            </span>
                            <span className="text-[8px] text-cyan-400 font-mono mt-0.5">
                                FLOW ENERGY
                            </span>
                        </div>
                    </div>

                    {/* 하단 모드 요약 칩 */}
                    <div className="text-center px-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 border border-white/15">
                            <span className="text-[10px] font-black text-amber-300">
                                {chemistry.modeLabel}
                            </span>
                        </div>
                        <p className={`${isLargeText ? 'text-xs' : 'text-[10px]'} text-gray-300 mt-1 line-clamp-1 font-medium`}>
                            {chemistry.keyword}
                        </p>
                    </div>
                </div>
            )}

            {/* 메인 탭 1: 24시간 시간대별 바이오리듬 파동 */}
            {subTab === 1 && (
                <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in space-y-2 px-1">
                    <div className="w-full bg-black/60 border border-amber-400/30 rounded-xl p-2 text-center">
                        <span className="text-[9px] text-amber-300 font-mono font-bold flex items-center justify-center gap-1">
                            <Clock size={11} className="text-amber-400" />
                            <span>오늘의 뇌과학 골든타임</span>
                        </span>
                        <p className={`${isLargeText ? 'text-sm' : 'text-xs'} font-black text-white mt-0.5`}>
                            ⚡ {chemistry.goldenTime}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5">
                            사주 일간 에너지가 우주 파동과 최고 공명하는 시각
                        </p>
                    </div>

                    {/* 24시간 에너지 미니 바 차트 */}
                    <div className="w-full bg-white/5 rounded-xl p-2 border border-white/10">
                        <span className="text-[8px] text-gray-400 font-mono block mb-1.5 text-center">
                            시간대별 몰입 파동 지수 (자 ➔ 묘 ➔ 오 ➔ 유)
                        </span>
                        <div className="flex items-end justify-between h-10 px-1 gap-1">
                            {[
                                { time: '새벽', h: 35, high: false },
                                { time: '오전', h: 70, high: false },
                                { time: '골든', h: 95, high: true },
                                { time: '오후', h: 65, high: false },
                                { time: '저녁', h: 50, high: false },
                                { time: '심야', h: 40, high: false }
                            ].map((bar, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                                    <div
                                        className={`w-full rounded-t-sm transition-all ${
                                            bar.high 
                                                ? 'bg-gradient-to-t from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                                                : 'bg-cyan-500/40'
                                        }`}
                                        style={{ height: `${bar.h}%` }}
                                    />
                                    <span className={`text-[7px] font-mono ${bar.high ? 'text-amber-300 font-black' : 'text-gray-400'}`}>
                                        {bar.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full px-2 text-[9px] font-mono">
                        <span className="text-gray-400">행운의 오행:</span>
                        <span className="text-emerald-300 font-bold">{chemistry.luckyElement} ({chemistry.luckyColor})</span>
                    </div>
                </div>
            )}

            {/* 메인 탭 2: 1:1 사주 맞춤 행동 처방전 */}
            {subTab === 2 && (
                <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in space-y-1.5 px-1 text-center">
                    <div className="w-full bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-400/40 rounded-xl p-2.5 shadow-md">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-300 font-black mb-1">
                            <Sparkles size={12} className="text-amber-400" />
                            <span>사주 x 일진 원포인트 처방</span>
                        </div>
                        <p className={`${isLargeText ? 'text-xs' : 'text-[10px]'} text-gray-200 leading-snug font-medium`}>
                            {chemistry.advice}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[200px] pt-1">
                        {onGoToAffirmation && (
                            <button
                                onClick={onGoToAffirmation}
                                className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 shadow hover:scale-[1.02] transition-transform cursor-pointer"
                            >
                                <span>⭐ 오늘의 1:1 일진 선언문 각인</span>
                                <ChevronRight size={12} />
                            </button>
                        )}
                        {onGoToSoundLab && (
                            <button
                                onClick={onGoToSoundLab}
                                className="w-full py-1 rounded-lg bg-white/10 hover:bg-white/15 text-cyan-300 font-bold text-[9px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-cyan-400/20"
                            >
                                <span>🎧 528Hz 주파수로 에너지 조율</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 하단 점(Pagination Indicator) */}
            <div className="flex items-center gap-1 pt-0.5">
                {[0, 1, 2].map((idx) => (
                    <div
                        key={idx}
                        onClick={() => handleTabChange(idx as 0 | 1 | 2)}
                        className={`size-1 rounded-full transition-all cursor-pointer ${
                            subTab === idx ? 'w-3 bg-amber-400' : 'bg-white/20'
                        }`}
                    />
                ))}
            </div>

        </div>
    );
}
