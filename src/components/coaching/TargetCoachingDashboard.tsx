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
    Send,
    Play,
    Info,
    Check,
    ChevronDown
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { generateChatPromptFromIntent } from '@/modules/DrillDownProtocol';

export type TargetTab = 'all' | 'timing' | 'solution' | 'tactics';

interface TargetCoachingDashboardProps {
    isOpen?: boolean;
    onClose?: () => void;
    initialTab?: TargetTab;
    initialCardId?: string | null;
    onChatIntent?: (intent: string, prompt: string) => void;
    userProfile?: any;
    isFullScreen?: boolean;
}

export default function TargetCoachingDashboard({
    isOpen = true,
    onClose,
    initialTab = 'all',
    initialCardId = null,
    onChatIntent,
    userProfile,
    isFullScreen = false
}: TargetCoachingDashboardProps) {
    const { reportData } = useReportStore();
    const effectiveProfile = userProfile || reportData || {};

    const [activeTab, setActiveTab] = useState<TargetTab>(initialTab);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(initialCardId || null);
    const [radarAngle, setRadarAngle] = useState(0);

    // initialCardId 변경 시 자동 반영 및 탭 동기화
    useEffect(() => {
        if (initialCardId) {
            setSelectedCardId(initialCardId);
            if (['sl_15', 'sl_20', 'sl_26', 'sl_17'].includes(initialCardId)) setActiveTab('timing');
            else if (['sl_16', 'sl_18', 'sl_39', 'sl_21'].includes(initialCardId)) setActiveTab('solution');
            else if (['sl_29', 'sl_32'].includes(initialCardId)) setActiveTab('tactics');
        }
    }, [initialCardId]);

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
    const TACTICAL_SECTIONS = useMemo(() => [
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
                    status: '판세 리듬',
                    deepData: {
                        summary: '10년 대운 주기 중 가장 추진력이 강한 제4성장 국면에 진입했습니다. 상반기 준비된 시스템이 하반기 폭발적인 결실로 전환됩니다.',
                        points: ['2026 상반기: 인프라 및 핵심 파트너십 구축 (에너지 지수 78점)', '2026 하반기: 가시적 매출 및 브랜드 영향력 폭발 (에너지 지수 94점)', '주의 사항: 섣부른 분산 투자보다는 핵심 1개 영역에 올인할 것'],
                        actionLabel: '10년 대운 판세 1:1 심층 분석 받기'
                    }
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
                    status: '실시간 미션',
                    deepData: {
                        summary: '오늘 일진의 기운과 사주 원국이 강한 추진력으로 공명하고 있습니다. 아침에 세운 3대 목표를 지체 없이 돌파하세요.',
                        points: ['07:00 기상 미션: 동쪽 창문을 열고 3분간 깊은 복식호흡으로 목(木) 기운 흡수', '13:30 승부 미션: 미뤄두었던 가장 어렵고 중요한 미팅 또는 계약 체결 진행', '21:00 회고 미션: 오늘 진행한 3대 행동의 결과를 기록하고 내일 작전 수립'],
                        actionLabel: '오늘 맞춤형 데일리 프로토콜 시작하기'
                    }
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
                    status: '승부 시간대',
                    deepData: {
                        summary: `대표님의 일간(${sajuMetrics.dayMaster}) 기준 가장 맑은 판단력과 우호적인 기운이 작용하는 골든타임은 [${sajuMetrics.goldenTime}]입니다.`,
                        points: ['최적 활동: 주요 계약서 날인, 투자 결단, 핵심 인재 영입 면접, 신제품 런칭', '기피 활동: 단순 반복 업무, 잡담, 감정 소모가 큰 불필요한 말다툼', '공략 팁: 골든타임 시작 10분 전 휴대폰 알림을 끄고 몰입 상태를 준비하세요.'],
                        actionLabel: '골든타임 활용 1:1 전술 코칭 받기'
                    }
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
                    status: '작전 모드',
                    deepData: {
                        summary: '현재 운세는 수비보다는 과감한 공격과 영토 확장이 압도적으로 유리한 [장성살(將星殺) 공세 국면]입니다.',
                        points: ['공격 태세(72%): 주도권을 절대 상대에게 넘기지 말고 선제 제안서를 먼저 던질 것', '수비 태세(28%): 현금 흐름의 3개월치 유동성은 반드시 안전 자산으로 락업', '행동 요강: 완벽을 기다리지 말고 80% 상태에서 시장에 먼저 출시 후 개선'],
                        actionLabel: '공격/수비 전술 포지션 심층 설계하기'
                    }
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
                    status: '에너지 점수',
                    deepData: {
                        summary: `대표님의 원국 에너지 밸런스는 목(木)과 화(火)의 추진력이 강하지만, 결실을 거두는 금(金)과 유연성인 ${sajuMetrics.ohaengNeed}이 필요합니다.`,
                        points: ['목(30%) / 화(25%): 뜨거운 추진력과 창의성은 충분히 확보됨', '금(10%): 일의 마무리를 짓는 정밀한 시스템과 결단력을 15% 보강할 것', '수(20%): 감정적 과열을 식혀줄 쿨링 타임 및 수분 섭취 루틴 권장'],
                        actionLabel: '오행 결핍 보강 1:1 맞춤 솔루션 받기'
                    }
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
                    status: '히든 해법',
                    deepData: {
                        summary: '사주 글자 사이에 보이지 않는 글자가 끌려오는 허자(虛字)와 천을귀인의 에너지가 잠재의식 속에 비축되어 있습니다.',
                        points: ['잠재 무기: 막다른 위기 상황에서 예상치 못한 귀인의 원조 또는 반전 솔루션 출현', '발동 조건: 타인의 비판에 흔들리지 않고 본인의 핵심 신념을 끝까지 밀어붙일 때', '위기 탈출 키: 기존 공식의 타파, 제3의 관점에서 사안을 뒤집어보기'],
                        actionLabel: '잠재의식 비밀병기 발동 코칭 받기'
                    }
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
                    status: 'AI 파동 튜닝',
                    deepData: {
                        summary: '이름과 브랜드명은 하루에도 수백 번 소리와 문자로 불리며 뇌파와 양자장을 튜닝하는 가장 강력한 현실 조작 도구입니다.',
                        points: ['81수리 진단: 부족한 결실의 에너지를 채우는 길수(21, 23, 24, 31, 33수) 매칭', '발음오행 튜닝: 금(金)과 수(水)의 서늘하고 정확한 파동을 지닌 음소 조합 권장', '적용처: 사업자 등록 상호명, 유튜브/SNS 채널명, 필명, 신제품 브랜드'],
                        actionLabel: '개운 네이밍 & 수리 튜닝 1:1 분석 받기'
                    }
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
                    status: '즉시 신탁',
                    deepData: {
                        summary: '64괘 시공간 렌더링 결과, [화천대유(火天大有) ➔ 지화명이(地火明夷)]의 신탁이 도출되었습니다.',
                        points: ['대유괘의 메시지: 태양이 하늘 높이 떠 모든 것을 비추니 큰 성취와 풍요의 기운', '명이괘의 경고: 밝음을 겉으로 너무 드러내면 시기를 사므로 내실을 단단히 다질 것', '행동 강령: 성공할수록 겸손하게 시스템 뒤에 숨어 실속을 챙겨라'],
                        actionLabel: '주역 64괘 심층 신탁 해석 받기'
                    }
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
                    status: '기문 방위',
                    deepData: {
                        summary: `기문둔갑 8문(八門) 배치도상 오늘의 최고 길방은 생문(生門)과 개문(開門)이 위치한 [${sajuMetrics.direction}]입니다.`,
                        points: ['공략 방위: 협상, 투자 미팅, 부동산 계약 시 ${sajuMetrics.direction} 방향의 장소를 선택할 것', '좌향(座向) 팁: 회의실이나 카페에서 해당 방위를 등지고 앉으면 심리적 우위 점유', '주의 방위: 사문(死門)과 경문(驚門)이 낀 흉방은 장기 체류 지양'],
                        actionLabel: '기문둔갑 대길 방위 1:1 코칭 받기'
                    }
                },
                {
                    id: 'sl_32',
                    number: '32',
                    title: '리얼타임 싱크',
                    desc: '날씨, 뉴스 등 외부 환경 연동 조언',
                    intent: 'smart_context_card',
                    tag: '환경·시공간 동기화',
                    accent: '#8B5CF6',
                    metric: '환경 융합도 88%',
                    visualType: 'sync',
                    status: '환경 싱크',
                    deepData: {
                        summary: '오늘의 기압, 기온, 요일 및 우주 일진 사이클이 사용자의 바이오리듬과 88% 높은 싱크로율을 나타내고 있습니다.',
                        points: ['기상 연동: 맑은 날씨에는 대외 확장 활동을, 흐리거나 비 오는 날에는 전략 기획에 집중', '동기화 지표: 오늘 하루 뇌파 최적 집중 시간대 4.5시간 확보 가능', '추천 루틴: 오후 시간대 가벼운 스트레칭과 산책으로 신선한 산소 공급'],
                        actionLabel: '실시간 환경 싱크 1:1 조언 받기'
                    }
                }
            ]
        }
    ], [sajuMetrics]);

    // 전체 카드 평탄화 리스트
    const allCards = useMemo(() => {
        return TACTICAL_SECTIONS.flatMap(s => s.cards);
    }, [TACTICAL_SECTIONS]);

    // 현재 선택된 상세 카드 정보
    const selectedCard = useMemo(() => {
        if (!selectedCardId) return null;
        return allCards.find(c => c.id === selectedCardId) || null;
    }, [selectedCardId, allCards]);

    // 필터링된 섹션 목록
    const filteredSections = useMemo(() => {
        if (activeTab === 'all') return TACTICAL_SECTIONS;
        return TACTICAL_SECTIONS.filter((s) => s.sectionId === activeTab);
    }, [activeTab, TACTICAL_SECTIONS]);

    // 🚀 원터치 AI 인텐트 실행 핸들러
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
            <div className="relative w-full h-full max-h-[92vh] flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 font-sans">
                {/* ── 배경 HUD 레이더 & 네온 그리드 ── */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    {/* 방사형 그리드 */}
                    <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
                    {/* 레이더 스위프 빔 */}
                    <div
                        className="absolute w-[600px] h-[600px] -top-32 -right-32 rounded-full border border-amber-400/20 transition-transform duration-75"
                        style={{
                            background: 'conic-gradient(from 0deg, rgba(245,158,11,0.15) 0deg, transparent 60deg, transparent 360deg)',
                            transform: `rotate(${radarAngle}deg)`
                        }}
                    />
                </div>

                {/* ── 1. 상단 HUD 타이틀 바 ── */}
                <div className="relative z-10 px-4 py-3.5 sm:px-6 sm:py-4 border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-xl flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/40">
                            <Crosshair className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '30s' }} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 tracking-wider">
                                    TACTICAL COMMAND HUD
                                </span>
                                <span className="text-[11px] text-gray-400 hidden sm:inline-block">
                                    사주·기문둔갑 실시간 전술 지휘 본부
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                                <span>타겟 코칭 (Strategy Lab)</span>
                                <span className="text-xs font-normal text-amber-400/80">
                                    {sajuMetrics.userName}님 맞춤형 승부수
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="닫기"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── 2. 사용자 사주 기반 실시간 전술 브리핑 헤더 ── */}
                <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-950/80 border-b border-amber-500/15 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col items-center justify-center text-amber-400 shrink-0 shadow-inner">
                                <span className="text-xs font-black">{sajuMetrics.dayMaster}</span>
                                <span className="text-[9px] text-gray-400">일간</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-amber-300">{sajuMetrics.type}</span>
                                    <span className="text-[11px] text-gray-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                        {sajuMetrics.currentSeason}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 mt-1">
                                    핵심 미션: <strong className="text-white font-bold">{sajuMetrics.focus}</strong>
                                </p>
                            </div>
                        </div>

                        {/* 3대 실시간 퀵 지표 */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                            <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-2 sm:p-2.5 text-center">
                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>승부 골든타임</span>
                                </div>
                                <div className="text-xs sm:text-xs font-black text-amber-300 mt-0.5 truncate">
                                    {sajuMetrics.goldenTime.split(' ')[1] || '13:00~15:00'}
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-cyan-500/20 rounded-xl p-2 sm:p-2.5 text-center">
                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Compass className="w-3 h-3 text-cyan-400" />
                                    <span>기문 대길 방위</span>
                                </div>
                                <div className="text-xs sm:text-xs font-black text-cyan-300 mt-0.5 truncate">
                                    {sajuMetrics.direction.split('/')[0] || '동남방'}
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-2 sm:p-2.5 text-center">
                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Shield className="w-3 h-3 text-emerald-400" />
                                    <span>공격/수비 비율</span>
                                </div>
                                <div className="text-xs sm:text-xs font-black text-emerald-300 mt-0.5 truncate">
                                    공격 {sajuMetrics.attackRatio}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 3. 3대 전략 카테고리 탭 스위처 ── */}
                <div className="relative z-10 px-4 pt-3 pb-2 bg-slate-950 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('all'); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'all'
                                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>전체 전술 조망 (10대 작전)</span>
                    </button>

                    {TACTICAL_SECTIONS.map((section) => {
                        const isActive = activeTab === section.sectionId;
                        return (
                            <button
                                key={section.sectionId}
                                type="button"
                                onClick={() => { setActiveTab(section.sectionId as TargetTab); }}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                                    isActive
                                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>{section.icon}</span>
                                <span>{section.code}. {section.title.split(' ')[0]}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-gray-300'}`}>
                                    {section.cards.length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── 4. 메인 전술 카드 그리드 영역 (스크롤) ── */}
                <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {filteredSections.map((section) => (
                            <div key={section.sectionId} className="space-y-3">
                                {/* 섹션 헤더 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{section.icon}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-black text-white tracking-wide">
                                                    {section.code}. {section.title}
                                                </h3>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                    {section.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">{section.subtitle}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        전술 모듈 4종 탑재
                                    </span>
                                </div>

                                {/* 카드 그리드 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                    {section.cards.map((card) => {
                                        const isCardSelected = selectedCardId === card.id;

                                        return (
                                            <motion.div
                                                key={card.id}
                                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                                onClick={() => setSelectedCardId(card.id)}
                                                className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                                                    isCardSelected
                                                        ? 'bg-gradient-to-b from-amber-500/25 to-slate-900/90 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                                                        : 'bg-slate-900/70 hover:bg-slate-900 border border-white/10 hover:border-amber-400/40 shadow-lg'
                                                }`}
                                            >
                                                {/* 상단 뱃지 & 넘버링 */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/10 text-gray-300 group-hover:bg-amber-400/20 group-hover:text-amber-300 transition-colors">
                                                            NO.{card.number}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            {card.status}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                                        {card.title}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                                        {card.desc}
                                                    </p>
                                                </div>

                                                {/* 마이크로 비주얼 위젯 */}
                                                <div className="my-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 group-hover:border-amber-400/20 transition-all flex items-center justify-between">
                                                    {card.visualType === 'wave' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Activity className="w-3.5 h-3.5 text-amber-400" />
                                                                <span className="text-xs font-bold text-amber-200">{card.metric}</span>
                                                            </div>
                                                            <div className="flex items-end gap-0.5 h-4">
                                                                <span className="w-1 h-2 bg-amber-500/40 rounded-full" />
                                                                <span className="w-1 h-3 bg-amber-500/70 rounded-full" />
                                                                <span className="w-1 h-4 bg-amber-400 rounded-full animate-pulse" />
                                                                <span className="w-1 h-3.5 bg-amber-500/80 rounded-full" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'mission' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                                <span className="text-xs font-bold text-emerald-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">ACTIVE</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'clock' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5 text-sky-400" />
                                                                <span className="text-xs font-bold text-sky-200">{card.metric.split(' ')[0]}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-1.5 py-0.5 rounded">BEST</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'gauge' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Shield className="w-3.5 h-3.5 text-purple-400" />
                                                                <span className="text-xs font-bold text-purple-200">{card.metric}</span>
                                                            </div>
                                                            <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                                                <div className="w-[72%] bg-purple-400 h-full" />
                                                                <div className="w-[28%] bg-slate-600 h-full" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'equalizer' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <span className="text-xs font-bold text-emerald-300">5대 오행 밸런스</span>
                                                            <div className="flex gap-1">
                                                                {['목', '화', '토', '금', '수'].map((el, idx) => (
                                                                    <span key={el} className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-gray-300">
                                                                        {el}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'secret' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-sm">🗝️</span>
                                                                <span className="text-xs font-bold text-pink-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-1.5 py-0.5 rounded">HIDDEN</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'name' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-sm">✍️</span>
                                                                <span className="text-xs font-bold text-yellow-200">성명학 튜너</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded">NAMING</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'oracle' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-sm">🔮</span>
                                                                <span className="text-xs font-bold text-indigo-200">64괘 신탁</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded">ORACLE</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'compass' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
                                                                <span className="text-xs font-bold text-cyan-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">LUCKY</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'sync' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                                                                <span className="text-xs font-bold text-purple-200">기상·사주 싱크</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">LIVE</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 버튼: 클릭 시 상세 인스펙터 열기 or 바로 코칭 */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedCardId(card.id);
                                                        }}
                                                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-[11px] transition-all flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
                                                    >
                                                        <Info className="w-3 h-3 text-amber-400" />
                                                        <span>전술 분석 보기</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTriggerIntent(card.intent, card.title);
                                                        }}
                                                        className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                                                        title="AI 코칭 즉시 시작"
                                                    >
                                                        <Send className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 5. [NEW] 초정밀 전술 상세 인스펙터 모달 (Tactical Deep Inspector) ── */}
                <AnimatePresence>
                    {selectedCard && (
                        <div className="fixed inset-0 z-[2200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                className="w-full max-w-2xl bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
                            >
                                {/* 배경 HUD 효과 */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                                {/* 닫기 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedCardId(null)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* 인스펙터 헤더 */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-400 text-slate-950">
                                        NO.{selectedCard.number} {selectedCard.status}
                                    </span>
                                    <span className="text-xs text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                        {selectedCard.tag}
                                    </span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                                    {selectedCard.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    {selectedCard.desc}
                                </p>

                                {/* 인스펙터 본문 스크롤 */}
                                <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4 text-xs">
                                    {/* 핵심 진단 박스 */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-800 to-slate-800/80 border border-amber-500/30">
                                        <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1.5">
                                            <Zap className="w-3.5 h-3.5 fill-amber-400" />
                                            <span>실시간 전술 진단 요약</span>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed font-medium">
                                            {selectedCard.deepData?.summary}
                                        </p>
                                    </div>

                                    {/* 3대 전술 행동 지침 */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                                            <span>작전 실행 요강 (Action Protocols)</span>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedCard.deepData?.points.map((pt: string, idx: number) => (
                                                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-start gap-2.5">
                                                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30">
                                                        0{idx + 1}
                                                    </span>
                                                    <span className="text-gray-300 leading-relaxed">{pt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 하단 액션 버튼: 챗봇으로 1:1 연결 */}
                                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5 self-start sm:self-center">
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>사주 원국 및 현재 시공간 데이터 결합 완료</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleTriggerIntent(selectedCard.intent, selectedCard.title)}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                    >
                                        <Send className="w-3.5 h-3.5 fill-slate-950" />
                                        <span>{selectedCard.deepData?.actionLabel || '이 전술로 AI 코치와 심층 대화하기 ➔'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ── 6. 하단 액션 풋바 ── */}
                <div className="relative z-10 p-3 sm:p-4 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
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
