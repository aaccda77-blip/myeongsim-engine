'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    Compass,
    Clock,
    Zap,
    Shield,
    Crosshair,
    Sparkles,
    TrendingUp,
    BarChart3,
    Flame,
    Droplets,
    Activity,
    ArrowRight,
    ChevronRight,
    Calendar,
    Award,
    X,
    Maximize2,
    Minimize2,
    CheckCircle2,
    RotateCw,
    Layers,
    Sliders,
    Brain,
    HelpCircle,
    FileText,
    Send
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { generateChatPromptFromIntent } from '@/modules/DrillDownProtocol';

export type TargetTab = 'all' | 'timing' | 'solution' | 'tactics';

interface TargetCoachingDashboardProps {
    isOpen?: boolean;
    onClose?: () => void;
    initialTab?: TargetTab;
    onChatIntent?: (intent: string, prompt: string) => void;
    userProfile?: any;
    isFullScreen?: boolean;
}

export default function TargetCoachingDashboard({
    isOpen = true,
    onClose,
    initialTab = 'all',
    onChatIntent,
    userProfile,
    isFullScreen = false
}: TargetCoachingDashboardProps) {
    const { reportData } = useReportStore();
    const effectiveProfile = userProfile || reportData || {};

    const [activeTab, setActiveTab] = useState<TargetTab>(initialTab);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [radarAngle, setRadarAngle] = useState(0);

    // 🎯 레이더 회전 애니메이션
    useEffect(() => {
        const interval = setInterval(() => {
            setRadarAngle((prev) => (prev + 3) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // 👤 사주 및 프로필 기반 실시간 전술 메트릭 계산
    const sajuMetrics = useMemo(() => {
        const saju = effectiveProfile?.saju || (effectiveProfile?.meta as any)?.saju || {};
        const userName = effectiveProfile?.userName || effectiveProfile?.name || '명심가';
        const dayMaster = saju?.dayMaster || effectiveProfile?.dayMaster || '甲';

        // 일간에 따른 전략적 강점
        const STRATEGY_BY_STEM: Record<string, { type: string; focus: string; goldenTime: string; direction: string; ohaengNeed: string }> = {
            '甲': { type: '전진 돌파형 (Pioneer)', focus: '신사업 추진 / 리더십 발휘', goldenTime: '오전 07:00 ~ 09:00 (진시)', direction: '동남방(SE) / 생문(生門)', ohaengNeed: '수(水) 쿨링 20% 보강' },
            '乙': { type: '유연 네트워크형 (Adapter)', focus: '협상·파트너십 / 소프트파워', goldenTime: '오전 09:00 ~ 11:00 (사시)', direction: '동방(E) / 개문(開門)', ohaengNeed: '화(火) 열정 15% 보강' },
            '丙': { type: '스케일업 확장형 (Visionary)', focus: '브랜딩 / 대중 마케팅 극대화', goldenTime: '오후 11:00 ~ 13:00 (오시)', direction: '남방(S) / 경문(景門)', ohaengNeed: '금(金) 결실 25% 보강' },
            '丁': { type: '정밀 타겟형 (Strategist)', focus: '고부가가치 설계 / 집중 솔루션', goldenTime: '오후 13:00 ~ 15:00 (미시)', direction: '서남방(SW) / 휴문(休門)', ohaengNeed: '목(木) 연료 20% 보강' },
            '戊': { type: '플랫폼 구축형 (Anchor)', focus: '자산 안정화 / 시스템 체계화', goldenTime: '오후 15:00 ~ 17:00 (신시)', direction: '중앙·동북방(NE) / 생문(生門)', ohaengNeed: '수(水) 유동성 30% 보강' },
            '己': { type: '내실 결실형 (Cultivator)', focus: '실속 수익화 / 팀워크 조율', goldenTime: '오전 05:00 ~ 07:00 (묘시)', direction: '서남방(SW) / 개문(開門)', ohaengNeed: '금(金) 실행력 15% 보강' },
            '庚': { type: '결단 혁신형 (Executioner)', focus: '구조 개혁 / 대담한 승부수', goldenTime: '오후 15:00 ~ 17:00 (신시)', direction: '서방(W) / 상문(傷門)', ohaengNeed: '화(火) 제련 20% 보강' },
            '辛': { type: '초정밀 완결형 (Craftsman)', focus: '고급화 전략 / 디테일 완성', goldenTime: '오후 17:00 ~ 19:00 (유시)', direction: '서북방(NW) / 개문(開門)', ohaengNeed: '임수(壬) 세척 25% 보강' },
            '壬': { type: '글로벌 유통형 (Deep Ocean)', focus: '시장 확장 / 장기 안목 투자', goldenTime: '오후 21:00 ~ 23:00 (해시)', direction: '북방(N) / 생문(生門)', ohaengNeed: '무토(戊) 방파제 20% 보강' },
            '癸': { type: '영감 통찰형 (Wise Mind)', focus: '콘텐츠 창작 / 전략 기획 수립', goldenTime: '오후 23:00 ~ 01:00 (자시)', direction: '동북방(NE) / 휴문(休門)', ohaengNeed: '병화(丙) 온기 30% 보강' },
        };

        const currentStrategy = STRATEGY_BY_STEM[dayMaster] || STRATEGY_BY_STEM['甲'];

        return {
            userName,
            dayMaster,
            ...currentStrategy,
            attackRatio: 72,
            defenseRatio: 28,
            confidenceRate: 98.4,
            currentSeason: '2026 병오년(丙午年) 상승 파동',
        };
    }, [effectiveProfile]);

    // 📋 타겟 코칭 3대 메뉴 & 10대 전술 데이터 (기존 메뉴 구조 100% 동일 유지)
    const TACTICAL_SECTIONS = [
        {
            sectionId: 'timing',
            code: '2-1',
            title: '타이밍 전략 (Timing)',
            subtitle: '승부수와 골든타임',
            icon: '🎯',
            themeColor: 'amber',
            badge: '승부수 조준',
            gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
            border: 'border-amber-400/40',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
            cards: [
                {
                    id: 'sl_15',
                    number: '15',
                    title: '올해의 주요 바이오 리듬 (Rhythm)',
                    desc: '1년 및 10년 단위 인생 판세 분석',
                    intent: 'saju_daewoon_flow',
                    tag: '대운·세운 파동',
                    accent: '#F59E0B',
                    metric: '상승기 진입 84%',
                    visualType: 'wave',
                    status: '판세 리듬'
                },
                {
                    id: 'sl_20',
                    number: '20',
                    title: '오늘의 데일리 프로토콜 (Mission)',
                    desc: '매일 아침 받는 구체적 행동 지침',
                    intent: 'daily_fortune',
                    tag: '데일리 행동 수칙',
                    accent: '#10B981',
                    metric: '오늘 달성률 92%',
                    visualType: 'mission',
                    status: '실시간 미션'
                },
                {
                    id: 'sl_26',
                    number: '26',
                    title: '골든 타임 (Bio-Clock)',
                    desc: '하루 중 가장 운이 좋은 시간대',
                    intent: 'golden_time_analysis',
                    tag: '최고 집중 시간',
                    accent: '#38BDF8',
                    metric: sajuMetrics.goldenTime,
                    visualType: 'clock',
                    status: '승부 시간대'
                },
                {
                    id: 'sl_17',
                    number: '17',
                    title: '전략 포지션 (Action Code)',
                    desc: '올해 내가 취해야 할 태도 (공격/수비)',
                    intent: 'ms_12sinsal_strategy',
                    tag: '12신살 작전 코드',
                    accent: '#A855F7',
                    metric: '공격 72% / 수비 28%',
                    visualType: 'gauge',
                    status: '작전 모드'
                }
            ]
        },
        {
            sectionId: 'solution',
            code: '2-2',
            title: '개운 솔루션 (Solution)',
            subtitle: '부족한 운을 채우는 비법',
            icon: '🧪',
            themeColor: 'emerald',
            badge: '결핍 보완',
            gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
            border: 'border-emerald-400/40',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
            cards: [
                {
                    id: 'sl_16',
                    number: '16',
                    title: '오행 에너지 점수',
                    desc: '실시간 내 운의 수치화 그래프',
                    intent: 'ohaeng_balance_report',
                    tag: '5대 에너지 균형',
                    accent: '#10B981',
                    metric: '목30 화25 토15 금10 수20',
                    visualType: 'equalizer',
                    status: '에너지 점수'
                },
                {
                    id: 'sl_18',
                    number: '18',
                    title: '비밀 병기 (허자/입묘)',
                    desc: '위기 탈출을 위한 히든카드',
                    intent: 'ms_hidden_weapon',
                    tag: '숨은 에너지 추출',
                    accent: '#EC4899',
                    metric: '특수 허자(虛字) 활성',
                    visualType: 'secret',
                    status: '히든 해법'
                },
                {
                    id: 'sl_39',
                    number: '39',
                    title: 'AI 작명소 (성명학)',
                    desc: '부족한 운을 채우는 이름/닉네임',
                    intent: 'ms_naming_ai',
                    tag: '81수리 에너지',
                    accent: '#EAB308',
                    metric: '오행 보완 네이밍',
                    visualType: 'name',
                    status: 'AI 파동 튜닝'
                },
                {
                    id: 'sl_21',
                    number: '21',
                    title: '하늘의 조언 (주역)',
                    desc: '답답할 때 던지는 동양 철학의 신탁',
                    intent: 'ms_iching_oracle',
                    tag: '64괘 신탁 해법',
                    accent: '#6366F1',
                    metric: '실시간 점괘 도출',
                    visualType: 'oracle',
                    status: '즉시 신탁'
                }
            ]
        },
        {
            sectionId: 'tactics',
            code: '2-3',
            title: '현실 조작 (Tactics)',
            subtitle: '환경과 방향을 활용한 개운',
            icon: '⚡',
            themeColor: 'cyan',
            badge: '환경 최적화',
            gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
            border: 'border-cyan-400/40',
            glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            cards: [
                {
                    id: 'sl_29',
                    number: '29',
                    title: '방위 나침반 (기문둔갑)',
                    desc: '지금 행운을 잡으러 가는 방향',
                    intent: 'ms_lucky_direction',
                    tag: '길방(吉方) 네비게이션',
                    accent: '#06B6D4',
                    metric: sajuMetrics.direction,
                    visualType: 'compass',
                    status: '생문(生門) 활성'
                },
                {
                    id: 'sl_32',
                    number: '32',
                    title: '리얼타임 싱크',
                    desc: '날씨, 뉴스 등 외부 환경 연동 조언',
                    intent: 'smart_context_card',
                    tag: '외부 데이터 융합',
                    accent: '#8B5CF6',
                    metric: '환경 펄스 100% 동기화',
                    visualType: 'sync',
                    status: '실시간 감응'
                }
            ]
        }
    ];

    // 실행 핸들러
    const handleTriggerIntent = (intent: string, title: string) => {
        const prompt = generateChatPromptFromIntent(intent, effectiveProfile);
        if (onChatIntent) {
            onChatIntent(intent, prompt);
        }
        if (onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={`relative w-full text-white overflow-hidden ${isFullScreen ? 'h-screen' : 'max-h-[90vh]'} flex flex-col bg-[#050814]`}>
                {/* 🌌 사이버네틱 딥 백그라운드 & 오로라 글로우 */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px]" />
                    <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-[140px]" />
                    {/* 그리드 라인 */}
                    <div 
                        className="absolute inset-0 opacity-[0.04]" 
                        style={{ 
                            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }} 
                    />
                </div>

                {/* ── 1. 탑 헤더 HUD (전술 본부 타이틀 & 클로즈 버튼) ── */}
                <div className="relative z-10 p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {/* 🎯 3D 타겟 조준 아이콘 엠블럼 */}
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300">
                            <Target className="w-7 h-7 text-slate-950 stroke-[2.5]" />
                            {/* 조준 펄스 링 */}
                            <div className="absolute -inset-1 rounded-2xl border border-amber-400/60 animate-ping opacity-30" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                                    <span>타겟 코칭 전술 지휘 본부</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black tracking-wider uppercase">
                                        TARGET HUD
                                    </span>
                                </h2>
                            </div>
                            <p className="text-xs text-amber-200/80 font-medium">
                                이기는 타이밍과 전략의 모든 것 · <span className="text-white font-bold">{sajuMetrics.userName}</span> 님 맞춤 승부수
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                            title="닫기"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* ── 2. 스크롤 가능한 메인 대시보드 영역 ── */}
                <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
                    {/* 🚀 [HUD 섹션 1] 실시간 타겟 레이더 & 전술 지표 브리핑 카드 */}
                    <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-purple-500/10 border border-amber-400/30 p-4 sm:p-5 relative overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                            {/* 좌측: 3D 인터랙티브 타겟 레이더 조준기 */}
                            <div className="lg:col-span-4 flex items-center justify-center">
                                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                                    {/* 외부 회전 링 */}
                                    <div 
                                        className="absolute inset-0 rounded-full border border-amber-400/30 border-dashed transition-transform"
                                        style={{ transform: `rotate(${radarAngle}deg)` }}
                                    />
                                    {/* 내부 역회전 링 */}
                                    <div 
                                        className="absolute inset-3 rounded-full border-2 border-amber-400/20 transition-transform"
                                        style={{ transform: `rotate(-${radarAngle * 1.5}deg)` }}
                                    />
                                    {/* 십자선 (Crosshair) */}
                                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-400/40" />
                                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-400/40" />
                                    
                                    {/* 레이더 스위프 빔 */}
                                    <div 
                                        className="absolute inset-0 rounded-full origin-center pointer-events-none"
                                        style={{
                                            transform: `rotate(${radarAngle * 2}deg)`,
                                            background: 'conic-gradient(from 0deg, rgba(245,158,11,0.3) 0deg, transparent 60deg)'
                                        }}
                                    />

                                    {/* 중앙 타겟 엠블럼 */}
                                    <div className="relative z-10 w-24 h-24 rounded-full bg-slate-950/90 border-2 border-amber-400 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                                        <Crosshair className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                                        <span className="text-[10px] font-black text-amber-300 font-mono mt-1 tracking-wider">
                                            LOCKED
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-mono">
                                            {sajuMetrics.confidenceRate}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 우측: 4대 실시간 전술 브리핑 매트릭스 */}
                            <div className="lg:col-span-8 space-y-3.5">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                                            실시간 전술 포지셔닝:
                                        </span>
                                        <span className="text-xs font-black text-white px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/30">
                                            {sajuMetrics.type}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-mono">
                                        {sajuMetrics.currentSeason}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                    {/* 1. 골든 타임 */}
                                    <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/20 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10.5px] text-gray-400">승부수 골든타임</div>
                                            <div className="font-bold text-white text-xs">{sajuMetrics.goldenTime}</div>
                                        </div>
                                    </div>

                                    {/* 2. 대길 방위 */}
                                    <div className="p-3 rounded-2xl bg-black/40 border border-cyan-400/20 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                                            <Compass className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10.5px] text-gray-400">행운의 방위 (기문둔갑)</div>
                                            <div className="font-bold text-cyan-200 text-xs">{sajuMetrics.direction}</div>
                                        </div>
                                    </div>

                                    {/* 3. 행동 집중 */}
                                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-400/20 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10.5px] text-gray-400">최우선 전략 집중 분야</div>
                                            <div className="font-bold text-emerald-200 text-xs truncate">{sajuMetrics.focus}</div>
                                        </div>
                                    </div>

                                    {/* 4. 오행 밸런스 */}
                                    <div className="p-3 rounded-2xl bg-black/40 border border-purple-400/20 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
                                            <Droplets className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10.5px] text-gray-400">즉각 개운 에너지 처방</div>
                                            <div className="font-bold text-purple-200 text-xs">{sajuMetrics.ohaengNeed}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 3. 3대 전술 탭 스위처 (Tabs) ── */}
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 overflow-x-auto no-scrollbar shrink-0">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                                activeTab === 'all'
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span>전체 전략 조망 (ALL 10)</span>
                        </button>

                        {TACTICAL_SECTIONS.map((sec) => {
                            const isCurrent = activeTab === sec.sectionId;
                            return (
                                <button
                                    key={sec.sectionId}
                                    onClick={() => setActiveTab(sec.sectionId as TargetTab)}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                                        isCurrent
                                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span>{sec.icon}</span>
                                    <span>{sec.code}. {sec.title.split(' ')[0]}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isCurrent ? 'bg-black/30 text-slate-900' : 'bg-white/10 text-gray-400'}`}>
                                        {sec.cards.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── 4. 전술 섹션 및 카드 렌더링 ── */}
                    <div className="space-y-8">
                        {TACTICAL_SECTIONS.filter(sec => activeTab === 'all' || activeTab === sec.sectionId).map((section) => (
                            <div key={section.sectionId} className="space-y-4">
                                {/* 섹션 헤더 */}
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-lg">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                <span>{section.code}. {section.title}</span>
                                                <span className="text-[10px] font-normal text-amber-300/80 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                                    {section.subtitle}
                                                </span>
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="text-[10.5px] font-bold text-gray-400 font-mono">
                                        {section.badge}
                                    </span>
                                </div>

                                {/* 카드 그리드 (2열 반응형) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.cards.map((card) => {
                                        return (
                                            <motion.div
                                                key={card.id}
                                                whileHover={{ scale: 1.015, y: -2 }}
                                                whileTap={{ scale: 0.99 }}
                                                className={`relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border ${section.border} p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ${section.glow} group hover:border-amber-400`}
                                            >
                                                {/* 상단: 넘버링, 태그, 상태 뱃지 */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-mono font-black text-xs flex items-center justify-center border border-amber-400/30">
                                                                {card.number}
                                                            </span>
                                                            <span className="text-[11px] font-bold text-gray-400">
                                                                {card.tag}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-amber-400/20 font-mono">
                                                            {card.status}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors">
                                                        {card.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-300/80 mt-1 leading-relaxed">
                                                        {card.desc}
                                                    </p>
                                                </div>

                                                {/* 비주얼 마이크로 그래픽 위젯 */}
                                                <div className="my-4 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                                                    {card.visualType === 'wave' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />
                                                                <span className="text-xs font-mono font-bold text-amber-200">{card.metric}</span>
                                                            </div>
                                                            {/* 미니 파동선 SVG */}
                                                            <svg className="w-24 h-6 text-amber-400" viewBox="0 0 100 25" fill="none">
                                                                <path d="M0 12 C 20 0, 30 24, 50 12 C 70 0, 80 24, 100 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'mission' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                                <span className="text-xs font-bold text-emerald-200">오늘의 3S 미션 수신 완료</span>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-gray-400 bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-bold">READY</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'clock' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '12s' }} />
                                                                <span className="text-xs font-bold text-sky-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-sky-300 font-bold bg-sky-500/20 px-2 py-0.5 rounded">PEAK</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'gauge' && (
                                                        <div className="w-full space-y-1.5">
                                                            <div className="flex justify-between text-[10px] font-mono">
                                                                <span className="text-amber-300 font-bold">공격 작전 72%</span>
                                                                <span className="text-gray-400">수비 내실 28%</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
                                                                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: '72%' }} />
                                                                <div className="h-full bg-indigo-500" style={{ width: '28%' }} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'equalizer' && (
                                                        <div className="w-full flex items-center justify-between gap-1">
                                                            {['목(木) 30', '화(火) 25', '토(土) 15', '금(金) 10', '수(水) 20'].map((oh, idx) => (
                                                                <div key={idx} className="flex-1 text-center">
                                                                    <div className="h-5 bg-emerald-950/60 rounded flex items-end justify-center p-0.5">
                                                                        <div 
                                                                            className="w-full rounded-sm bg-gradient-to-t from-emerald-500 to-teal-300"
                                                                            style={{ height: `${[80, 70, 45, 30, 60][idx]}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-[9px] text-gray-400 block mt-0.5">{oh.slice(0, 1)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {card.visualType === 'secret' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">🗝️</span>
                                                                <span className="text-xs font-bold text-pink-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded">HIDDEN</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'name' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">✍️</span>
                                                                <span className="text-xs font-bold text-yellow-200">성명학 에너지 튜너</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-yellow-300 bg-yellow-500/20 px-2 py-0.5 rounded">NAMING</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'oracle' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">🔮</span>
                                                                <span className="text-xs font-bold text-indigo-200">주역 64괘 신탁 해법</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">ORACLE</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'compass' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
                                                                <span className="text-xs font-bold text-cyan-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">LUCKY</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'sync' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                                                                <span className="text-xs font-bold text-purple-200">기상·환경·사주 1:1 싱크</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">LIVE</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 원터치 AI 코칭 브리핑 실행 버튼 */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleTriggerIntent(card.intent, card.title)}
                                                    className="w-full py-2.5 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-500 text-gray-300 group-hover:text-slate-950 font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/10 group-hover:border-amber-400 shadow-sm"
                                                >
                                                    <Send className="w-3.5 h-3.5 group-hover:fill-slate-950" />
                                                    <span>전술 코칭 즉시 시작 ➔</span>
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 5. 하단 액션 풋바 ── */}
                <div className="relative z-10 p-3 sm:p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>사주 원국 8자 및 오늘 일진 기반 1:1 실시간 전술 코칭 엔진</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            type="button"
                            onClick={() => handleTriggerIntent('golden_time_analysis', '골든타임 전술 브리핑')}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                            <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                            <span>⚡ 오늘의 승부수 3S 브리핑 받기</span>
                        </button>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
