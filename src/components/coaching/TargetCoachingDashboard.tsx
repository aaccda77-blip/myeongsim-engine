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
    Pause,
    Info,
    Check,
    ChevronDown,
    Heart,
    Leaf,
    Sun,
    Moon,
    Wind,
    Eye,
    Coffee,
    Smile,
    ShieldCheck,
    Volume2
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

    // 🌿 1분 박스 브리딩(Box Breathing) 트레이너 상태
    const [isBreathingTrainerOpen, setIsBreathingTrainerOpen] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [breathSeconds, setBreathSeconds] = useState(4);
    const [selectedOrganKey, setSelectedOrganKey] = useState<'wood' | 'fire' | 'earth' | 'metal' | 'water'>('wood');

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

    // 🌿 박스 브리딩 실시간 타이머 (4초 들이마시기 -> 4초 멈추기 -> 4초 내쉬기 -> 4초 비우기)
    useEffect(() => {
        const timer = setInterval(() => {
            setBreathSeconds((prevSec) => {
                if (prevSec <= 1) {
                    setBreathPhase((prevPhase) => {
                        if (prevPhase === 'inhale') return 'hold';
                        if (prevPhase === 'hold') return 'exhale';
                        if (prevPhase === 'exhale') return 'rest';
                        return 'inhale';
                    });
                    return 4;
                }
                return prevSec - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 👤 사주 및 프로필 기반 실시간 전술 & 웰니스 메트릭 계산
    const sajuMetrics = useMemo(() => {
        const saju = effectiveProfile?.saju || (effectiveProfile?.meta as any)?.saju || {};
        const userName = effectiveProfile?.userName || effectiveProfile?.name || '명심가';
        const dayMaster = saju?.dayMaster || effectiveProfile?.dayMaster || '甲';

        // 일간에 따른 전략적 강점 & 생체 장부 웰니스 프로필
        const WELLNESS_PROFILE_BY_STEM: Record<string, {
            type: string;
            focus: string;
            goldenTime: string;
            direction: string;
            ohaengNeed: string;
            organFocus: string;
            wellnessFood: string;
            vagusNerveTip: string;
            acupressurePoint: string;
            dominantOrgan: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
        }> = {
            '甲': {
                type: '전진 돌파형 (Pioneer)',
                focus: '신사업 추진 / 리더십 발휘',
                goldenTime: '오전 07:00 ~ 09:00 (진시)',
                direction: '동남방(SE) / 생문(生門)',
                ohaengNeed: '수(水) 쿨링 20% 보강',
                organFocus: '간(肝)·담(膽) 에너지 과열 완화',
                wellnessFood: '구기자차, 녹색 잎채소, 레몬수',
                vagusNerveTip: '아침 4-7-8 호흡으로 교감신경 진정',
                acupressurePoint: '태충혈(太衝穴) 지압으로 간화(肝火) 완화',
                dominantOrgan: 'wood'
            },
            '乙': {
                type: '유연 네트워크형 (Adapter)',
                focus: '협상·파트너십 / 소프트파워',
                goldenTime: '오전 09:00 ~ 11:00 (사시)',
                direction: '동방(E) / 개문(開門)',
                ohaengNeed: '화(火) 열정 15% 보강',
                organFocus: '근육 긴장 완화 & 림프 순환',
                wellnessFood: '생강차, 블루베리, 따뜻한 온수',
                vagusNerveTip: '가벼운 스트레칭과 견갑골 롤링',
                acupressurePoint: '양릉천(陽陵泉) 마사지로 근막 이완',
                dominantOrgan: 'wood'
            },
            '丙': {
                type: '스케일업 확장형 (Visionary)',
                focus: '브랜딩 / 대중 마케팅 극대화',
                goldenTime: '오후 11:00 ~ 13:00 (오시)',
                direction: '남방(S) / 경문(景門)',
                ohaengNeed: '금(金) 결실 25% 보강',
                organFocus: '심장(心) 화기 쿨다운 & 안구 피로',
                wellnessFood: '국화차, 토마토, 맥문동',
                vagusNerveTip: '눈가 냉찜질 및 5분간 암실 휴식',
                acupressurePoint: '노궁혈(勞宮穴) 지압으로 심장 열 진정',
                dominantOrgan: 'fire'
            },
            '丁': {
                type: '정밀 타겟형 (Strategist)',
                focus: '고부가가치 설계 / 집중 솔루션',
                goldenTime: '오후 13:00 ~ 15:00 (미시)',
                direction: '서남방(SW) / 휴문(休門)',
                ohaengNeed: '목(木) 연료 20% 보강',
                organFocus: '뇌 신경 피로 회복 & 수면 딥슬립',
                wellnessFood: '대추차, 호두, 카모마일',
                vagusNerveTip: '잠들기 1시간 전 스마트폰 블루라이트 차단',
                acupressurePoint: '신문혈(神門穴) 마사지로 수면 유도',
                dominantOrgan: 'fire'
            },
            '戊': {
                type: '플랫폼 구축형 (Anchor)',
                focus: '자산 안정화 / 시스템 체계화',
                goldenTime: '오후 15:00 ~ 17:00 (신시)',
                direction: '중앙·동북방(NE) / 생문(生門)',
                ohaengNeed: '수(水) 유동성 30% 보강',
                organFocus: '비장(脾)·위장 소화 흡수 밸런스',
                wellnessFood: '단호박, 양배추, 발효 효소',
                vagusNerveTip: '식후 15분 느린 걷기와 복부 온찜질',
                acupressurePoint: '족삼리(足三里) 지압으로 소화력 증진',
                dominantOrgan: 'earth'
            },
            '己': {
                type: '내실 결실형 (Cultivator)',
                focus: '실속 수익화 / 팀워크 조율',
                goldenTime: '오전 05:00 ~ 07:00 (묘시)',
                direction: '서남방(SW) / 개문(開門)',
                ohaengNeed: '금(金) 실행력 15% 보강',
                organFocus: '소화기계 점막 보호 & 만성 피로',
                wellnessFood: '마(산약)즙, 연근, 보리차',
                vagusNerveTip: '미주신경 자극을 위한 콧노래(Humming) 루틴',
                acupressurePoint: '중완혈(中脘穴) 온열 테라피',
                dominantOrgan: 'earth'
            },
            '庚': {
                type: '결단 혁신형 (Executioner)',
                focus: '구조 개혁 / 대담한 승부수',
                goldenTime: '오후 15:00 ~ 17:00 (신시)',
                direction: '서방(W) / 상문(傷門)',
                ohaengNeed: '화(火) 제련 20% 보강',
                organFocus: '폐(肺)·호흡기 산소포화도 & 대장 건강',
                wellnessFood: '도라지 배즙, 은행, 백년초',
                vagusNerveTip: '박스 브리딩(Box Breathing) 5세트',
                acupressurePoint: '척택혈(尺澤穴) 지압으로 폐 기능 강화',
                dominantOrgan: 'metal'
            },
            '辛': {
                type: '초정밀 완결형 (Craftsman)',
                focus: '고급화 전략 / 디테일 완성',
                goldenTime: '오후 17:00 ~ 19:00 (유시)',
                direction: '서북방(NW) / 개문(開門)',
                ohaengNeed: '임수(壬) 세척 25% 보강',
                organFocus: '피부 점막 보습 & 감각 과민 완화',
                wellnessFood: '백목이버섯, 배, 알로에',
                vagusNerveTip: '아로마 테라피(라벤더/유칼립투스) 심호흡',
                acupressurePoint: '합곡혈(合谷穴) 지압으로 전신 순환',
                dominantOrgan: 'metal'
            },
            '壬': {
                type: '글로벌 유통형 (Deep Ocean)',
                focus: '시장 확장 / 장기 안목 투자',
                goldenTime: '오후 21:00 ~ 23:00 (해시)',
                direction: '북방(N) / 생문(生門)',
                ohaengNeed: '무토(戊) 방파제 20% 보강',
                organFocus: '신장(腎)·비뇨기 에너지 & 부신 피로',
                wellnessFood: '검은콩, 흑임자, 산수유',
                vagusNerveTip: '족욕(40도 온수 15분)으로 하체 혈류 순환',
                acupressurePoint: '용천혈(湧泉穴) 지압으로 원기 충전',
                dominantOrgan: 'water'
            },
            '癸': {
                type: '영감 통찰형 (Wise Mind)',
                focus: '콘텐츠 창작 / 전략 기획 수립',
                goldenTime: '오후 23:00 ~ 01:00 (자시)',
                direction: '동북방(NE) / 휴문(休門)',
                ohaengNeed: '병화(丙) 온기 30% 보강',
                organFocus: '수족 냉증 완화 & 뇌척수액 순환',
                wellnessFood: '계피차, 생강대추차, 꿀',
                vagusNerveTip: '명치 마사지와 척추 정렬 요가 스트레칭',
                acupressurePoint: '태계혈(太谿穴) 마사지로 신수(腎水) 보양',
                dominantOrgan: 'water'
            },
        };

        const currentProfile = WELLNESS_PROFILE_BY_STEM[dayMaster] || WELLNESS_PROFILE_BY_STEM['甲'];

        return {
            userName,
            dayMaster,
            ...currentProfile,
            attackRatio: 68,
            recoveryRatio: 32,
            stressIndex: 26,
            wellnessScore: 96.2,
            currentSeason: '2026 병오년(丙午年) 화기(火氣) 조율 생체 주기',
        };
    }, [effectiveProfile]);

    // 5대 장부(五臟六腑) 인터랙티브 데이터 매핑
    const ORGAN_DATA = useMemo(() => ({
        wood: {
            name: '목(木) - 간·담 (肝/膽)',
            sub: '해독 · 근육 피로 · 시력',
            score: 82,
            color: '#10B981',
            status: '활동성 최적',
            food: '구기자, 미나리, 레몬수',
            tip: '눈의 피로를 풀어주고 근육의 젖산을 배출하는 림프 스트레칭이 효과적입니다.',
            point: sajuMetrics.acupressurePoint
        },
        fire: {
            name: '화(火) - 심·소장 (心/小腸)',
            sub: '혈류 · 심박수 · 수면 질',
            score: 90,
            color: '#EF4444',
            status: '과열 주의 (쿨링 필요)',
            food: '국화차, 토마토, 맥문동',
            tip: '심장의 화기(火氣)를 식히기 위해 오후 2시 이후 카페인을 중단하세요.',
            point: '노궁혈(손바닥 중앙)을 지그시 눌러 심장 박동 안정'
        },
        earth: {
            name: '토(土) - 비·위장 (脾/胃)',
            sub: '소화 흡수 · 에너지 전환 · 면역',
            score: 68,
            color: '#F59E0B',
            status: '보양 권장',
            food: '단호박, 양배추, 마즙',
            tip: '찬 음식을 피하고 식사 후 15분간 가볍게 산책하면 기혈 순환이 촉진됩니다.',
            point: '족삼리(무릎 아래 3마디) 지압으로 소화력 증강'
        },
        metal: {
            name: '금(金) - 폐·대장 (肺/大腸)',
            sub: '호흡기 · 산소포화도 · 피부',
            score: 72,
            color: '#E2E8F0',
            status: '보습 & 심호흡 필요',
            food: '도라지 배즙, 은행, 백목이버섯',
            tip: '깊은 복식호흡으로 폐활량을 늘리고 실내 습도를 50%로 유지하세요.',
            point: '합곡혈(엄지와 검지 사이) 지압으로 대장 독소 배출'
        },
        water: {
            name: '수(水) - 신·방광 (腎/膀胱)',
            sub: '부신 호르몬 · 수분 대사 · 원기',
            score: 79,
            color: '#06B6D4',
            status: '온열 유지',
            food: '검은콩, 흑임자, 산수유',
            tip: '하체를 따뜻하게 유지하고 자기 전 따뜻한 물로 족욕을 권장합니다.',
            point: '용천혈(발바닥 중앙 오목한 곳) 마사지로 원기 회복'
        }
    }), [sajuMetrics]);

    // 📋 타겟 코칭 3대 메뉴 & 10대 전술 데이터
    const TACTICAL_SECTIONS = useMemo(() => [
        {
            sectionId: 'timing',
            code: '2-1',
            title: '타이밍 전략 (Timing & Circadian)',
            subtitle: '승부수와 생체 리듬(호르몬/골든타임)',
            icon: '🎯',
            themeColor: 'amber',
            badge: '생체 시계 동기화',
            gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
            border: 'border-amber-400/40',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
            cards: [
                {
                    id: 'sl_15',
                    number: '15',
                    title: '올해의 주요 바이오 리듬 (Rhythm)',
                    desc: '1년 및 10년 단위 인생 판세 & 신경계 번아웃 방어',
                    intent: 'saju_daewoon_flow',
                    tag: '장기 생체 활력 주기',
                    accent: '#F59E0B',
                    metric: '생체 활력 지수 88점',
                    visualType: 'wave',
                    status: '바이오 파동',
                    deepData: {
                        summary: '10년 대운과 생체 호르몬 분비 주기가 최상의 시너지를 내는 상승 국면입니다. 신체 에너지를 고갈시키지 않으면서 성과를 극대화하는 번아웃 방어 프로토콜이 가동됩니다.',
                        points: [
                            '장기 판세: 2026 상반기 세포 충전기 ➔ 하반기 지적·체력적 폭발기',
                            '바이오해킹 조언: 3주간의 전력 질주 후 1주일간의 의도적 감속(Deload Week) 배치',
                            '신경계 관리: 만성 스트레스 호르몬 코르티솔 분비를 낮추는 마그네슘 섭취 권장'
                        ],
                        actionLabel: '10년 바이오리듬 & 웰니스 장기 플랜 상담받기'
                    }
                },
                {
                    id: 'sl_20',
                    number: '20',
                    title: '오늘의 데일리 프로토콜 (Mission)',
                    desc: '매일 아침 받는 도파민 리셋 & 행동 지침',
                    intent: 'daily_fortune',
                    tag: '신경계 모닝 루틴',
                    accent: '#10B981',
                    metric: '오늘 루틴 달성 95%',
                    visualType: 'mission',
                    status: '모닝 바이오해킹',
                    deepData: {
                        summary: `대표님의 일간(${sajuMetrics.dayMaster}) 맞춤 아침 자율신경계 세팅 루틴입니다. 첫 1시간의 신경계 조율이 하루 전체의 업무 성과와 수면 질을 결정합니다.`,
                        points: [
                            '07:00 서카디안 햇빛 샤워: 기상 직후 10분간 야외 자연광을 눈에 쬐어 멜라토닌 리셋',
                            '12:30 도파민 쿨다운: 카페인 섭취는 오후 2시 이전에 마감하고 미온수로 혈류 순환',
                            '21:00 미주신경 이완: ${sajuMetrics.vagusNerveTip}'
                        ],
                        actionLabel: '오늘 맞춤형 신경계 웰니스 루틴 코칭받기'
                    }
                },
                {
                    id: 'sl_26',
                    number: '26',
                    title: '골든 타임 (Bio-Clock)',
                    desc: '하루 중 뇌파가 가장 맑은 시간대 & 세포 재생 타임',
                    intent: 'golden_time_analysis',
                    tag: '서카디안 피크 타임',
                    accent: '#38BDF8',
                    metric: sajuMetrics.goldenTime,
                    visualType: 'clock',
                    status: '뇌파 골든타임',
                    deepData: {
                        summary: `울트라디안(Ultradian 90분) 집중 주기와 사주 시주(時柱)가 만나는 최고 몰입 윈도우는 [${sajuMetrics.goldenTime}]입니다.`,
                        points: [
                            '최고 집중 활동: 중대한 계약 체결, 전략 로드맵 수립, 창의적 고난도 집필',
                            '신체 보호 가이드: 골든타임 이후 15분간 눈을 감고 알파파 뇌파 유도 명상',
                            '수면 골든타임: 밤 23:00~02:00 사이 성장호르몬 및 뇌척수액(Glymphatic) 청소 활성화'
                        ],
                        actionLabel: '골든타임 뇌파 최적화 1:1 코칭받기'
                    }
                },
                {
                    id: 'sl_17',
                    number: '17',
                    title: '전략 포지션 (Action Code)',
                    desc: '교감신경(공격적 몰입) vs 부교감신경(치유와 회복)',
                    intent: 'ms_12sinsal_strategy',
                    tag: '자율신경계 밸런스',
                    accent: '#A855F7',
                    metric: `활동 ${sajuMetrics.attackRatio}% / 회복 ${sajuMetrics.recoveryRatio}%`,
                    visualType: 'gauge',
                    status: 'HRV 조율 태세',
                    deepData: {
                        summary: '현재 운세는 수비보다는 적극적 공세가 유리하지만, 신체적으로는 교감신경 과부하를 막기 위해 [32%의 의도적 회복(Recovery)]이 반드시 병행되어야 합니다.',
                        points: [
                            `활동 태세(${sajuMetrics.attackRatio}%): 목표를 향한 과감한 실행과 선제적 주도권 확보`,
                            `회복 태세(${sajuMetrics.recoveryRatio}%): 지압 포인트 [${sajuMetrics.acupressurePoint}]`,
                            '주의: 승부욕에 치우쳐 수면과 식사를 거르면 2주 뒤 급격한 에너지 다운 발생'
                        ],
                        actionLabel: '자율신경계 & 전략 포지션 조율받기'
                    }
                }
            ]
        },
        {
            sectionId: 'solution',
            code: '2-2',
            title: '개운 솔루션 (Solution & Bio-Energetics)',
            subtitle: '부족한 운과 5대 생체 장부(五臟六腑) 치유 비법',
            icon: '🧪',
            themeColor: 'emerald',
            badge: '오장육부 결핍 치유',
            gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
            border: 'border-emerald-400/40',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
            cards: [
                {
                    id: 'sl_16',
                    number: '16',
                    title: '오행 에너지 점수',
                    desc: '오장육부(간·심·비·폐·신) 생체 장부 활력도 그래프',
                    intent: 'ohaeng_balance_report',
                    tag: '5대 장부 활력 진단',
                    accent: '#10B981',
                    metric: sajuMetrics.organFocus,
                    visualType: 'equalizer',
                    status: '장부 에너지',
                    deepData: {
                        summary: `대표님의 사주 원국 오행 분석 결과, 현재 가장 집중 케어가 필요한 신체 부위는 [${sajuMetrics.organFocus}]입니다. ${sajuMetrics.ohaengNeed}의 영양 처방이 필요합니다.`,
                        points: [
                            `추천 바이오푸드: ${sajuMetrics.wellnessFood}`,
                            `추천 지압 혈자리: ${sajuMetrics.acupressurePoint}`,
                            '개운 티 테라피: 따뜻한 찻물로 체내 미세 염증을 완화하고 장 점막 회복'
                        ],
                        actionLabel: '오행 맞춤 영양 & 장부 밸런스 처방받기'
                    }
                },
                {
                    id: 'sl_18',
                    number: '18',
                    title: '비밀 병기 (허자/입묘)',
                    desc: '무의식 스트레스 해소 & 잠재의식 신경가소성 부스팅',
                    intent: 'ms_hidden_weapon',
                    tag: '무의식 코어 릴리즈',
                    accent: '#EC4899',
                    metric: '잠재 회복 탄력성 MAX',
                    visualType: 'secret',
                    status: '잠재의식 치유',
                    deepData: {
                        summary: '사주 글자 사이에 보이지 않게 작용하는 허자(虛字) 에너지는 위기 상황에서 뇌의 편도체(불안 센터)를 진정시키고 전두엽의 직관을 깨우는 슈퍼 파워입니다.',
                        points: [
                            '잠재 무기: 극도의 스트레스 국면에서도 한순간에 멘탈을 리셋하는 회복 탄력성(Resilience)',
                            '트리거 발동: "지금 이 긴장은 내가 성장하는 신호다"라는 인지 재구성(Reframing)',
                            '신체 반응: 가슴 중앙(전중혈) 온열 마사지로 깊은 안정감 도출'
                        ],
                        actionLabel: '무의식 멘탈 리셋 & 비밀병기 활성화하기'
                    }
                },
                {
                    id: 'sl_39',
                    number: '39',
                    title: 'AI 작명소 (성명학)',
                    desc: '소리 진동(음성 주파수 528Hz)과 성대 미주신경 튜닝',
                    intent: 'ms_naming_ai',
                    tag: '음성 파동 웰니스',
                    accent: '#EAB308',
                    metric: '528Hz 공명 튜닝',
                    visualType: 'name',
                    status: '사운드 테라피',
                    deepData: {
                        summary: '이름과 브랜드의 음성 파동은 호흡기, 성대, 미주신경을 진동시켜 전신의 생체 전자기장을 변화시키는 고대 사운드 힐링의 정수입니다.',
                        points: [
                            '81수리 진단: 면역계와 자율신경을 안정시키는 조화로운 수리 주파수 매칭',
                            '발음오행 힐링: 성대를 울리는 특정 모음/자음 발성이 뇌간을 자극해 옥시토신 분비 촉진',
                            '적용 가이드: 긍정 확언(Affirmation) 낭독 시 나지막한 중저음 톤 유지'
                        ],
                        actionLabel: '음성 주파수 & 개운 네이밍 분석받기'
                    }
                },
                {
                    id: 'sl_21',
                    number: '21',
                    title: '하늘의 조언 (주역)',
                    desc: '마음챙김 명상(Mindfulness)과 동양 양자 뇌파 신탁',
                    intent: 'ms_iching_oracle',
                    tag: '양자장 뇌파 안정',
                    accent: '#6366F1',
                    metric: '알파파·세타파 유도',
                    visualType: 'oracle',
                    status: '마인드풀니스',
                    deepData: {
                        summary: '주역 64괘의 시공간 렌더링을 통해 산만해진 뇌파를 8~12Hz의 고요한 알파파(Alpha Wave)로 가라앉히는 직관 명상 솔루션입니다.',
                        points: [
                            '괘상 풀이: 화천대유(태양) ➔ 지화명이(내면의 빛). 밝은 에너지를 외부에 과시하지 말고 내장 기관과 마음에 축적할 것',
                            '명상 프로토콜: 3분간 들숨과 날숨 사이의 미세한 고요(Zero-Point)에 머물기',
                            '치유 확언: "내 몸과 마음은 지금 이 순간 완전하게 조화를 이루고 있다."'
                        ],
                        actionLabel: '주역 마음챙김 명상 & 신탁 해설받기'
                    }
                }
            ]
        },
        {
            sectionId: 'tactics',
            code: '2-3',
            title: '현실 조작 (Tactics & Environment)',
            subtitle: '풍수(Geomancy)와 환경 어싱(Earthing)을 활용한 개운',
            icon: '⚡',
            themeColor: 'cyan',
            badge: '생체 환경 최적화',
            gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
            border: 'border-cyan-400/40',
            glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            cards: [
                {
                    id: 'sl_29',
                    number: '29',
                    title: '방위 나침반 (기문둔갑)',
                    desc: '지금 행운과 생체 힐링 에너지를 받는 방향',
                    intent: 'ms_lucky_direction',
                    tag: '생체 에너지 풍수',
                    accent: '#06B6D4',
                    metric: sajuMetrics.direction,
                    visualType: 'compass',
                    status: '기문 힐링 방위',
                    deepData: {
                        summary: `기문둔갑 8문 중 생명력과 치유의 기운이 솟아나는 생문(生門)의 좌표는 [${sajuMetrics.direction}]입니다. 공간 에너지를 전환하는 웰니스 환경 구축이 가능합니다.`,
                        points: [
                            `공간 배치: 침대 머리 방향이나 서재 책상을 ${sajuMetrics.direction} 쪽으로 조정하여 전자파 차단`,
                            '어싱(Earthing) 산책: 해당 방향의 공원이나 흙길을 맨발 또는 가벼운 워킹화로 20분 걷기',
                            '수맥 및 전자기 쉴딩: 침실 내 와이파이 공유기 및 전자기기를 2m 이상 이격'
                        ],
                        actionLabel: '기문둔갑 생체 공간 풍수 코칭받기'
                    }
                },
                {
                    id: 'sl_32',
                    number: '32',
                    title: '리얼타임 싱크',
                    desc: '날씨, 기압, 시공간 일진과 생체 면역 반응 동기화',
                    intent: 'smart_context_card',
                    tag: '환경 바이오싱크',
                    accent: '#8B5CF6',
                    metric: '환경 융합도 92%',
                    visualType: 'sync',
                    status: '면역 바이오싱크',
                    deepData: {
                        summary: '외부 기압, 습도, 기온 변화에 맞춰 자율신경계가 이상적으로 반응할 수 있도록 실시간 환경 맞춤 면역 가이드를 제공합니다.',
                        points: [
                            '기압 연동 케어: 저기압 날씨에는 림프 순환을 돕는 가벼운 스트레칭과 전신 온열 유지',
                            '생체 수분 밸런스: 체중 1kg당 30ml의 미온수 섭취로 체내 독소 배출',
                            '시공간 리셋: 오후 3시~4시 사이 창문을 열어 실내 이산화탄소 농도를 600ppm 이하로 환기'
                        ],
                        actionLabel: '실시간 환경 바이오싱크 코칭받기'
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

    // 🚀 원터치 AI 인텐트 실행 핸들러 (웰니스 닥터 & 사주 바이오해킹 페르소나 강화)
    const handleTriggerIntent = (intent: string, title: string) => {
        const basePrompt = generateChatPromptFromIntent(intent, effectiveProfile);
        const wellnessEnhancedPrompt = `[세계 최고 수준 웰니스 코칭 요청]\n대표님 사주 일간: ${sajuMetrics.dayMaster} (${sajuMetrics.type})\n오행 장부 집중 케어: ${sajuMetrics.organFocus}\n지압 포인트: ${sajuMetrics.acupressurePoint}\n선택 주제: ${title}\n\n기본 질문: ${basePrompt}\n\n[코칭 가이드라인]\n1. 단순한 운세 풀이나 일반적인 위로를 완전히 배제하고, 실리콘밸리 바이오해킹(자율신경계 HRV, 서카디안 호르몬)과 동양 5,000년 오행 생체 의학을 결합한 하이엔드 웰니스 닥터 관점으로 답변해 주세요.\n2. 오늘 당장 실천할 수 있는 [3단계 바이오해킹 처방(호흡/식단/행동 시간대)]을 명쾌하게 제시해 주세요.`;

        if (onChatIntent) {
            onChatIntent(intent, wellnessEnhancedPrompt);
        }
        if (onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="relative w-full h-full max-h-[92vh] flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 font-sans">
                {/* ── 배경 웰니스 바이오피드백 & HUD 그리드 ── */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
                    {/* 호흡 리듬 바이오 펄스 링 */}
                    <div
                        className="absolute w-[500px] h-[500px] -top-20 -right-20 rounded-full border border-emerald-400/25 transition-all duration-1000"
                        style={{
                            transform: breathPhase === 'inhale' ? 'scale(1.18)' : breathPhase === 'hold' ? 'scale(1.18)' : breathPhase === 'exhale' ? 'scale(0.92)' : 'scale(0.92)',
                            opacity: breathPhase === 'hold' ? 0.7 : 0.35,
                            boxShadow: '0 0 60px rgba(16,185,129,0.25)'
                        }}
                    />
                </div>

                {/* ── 1. 상단 HUD & 웰니스 모드 바 ── */}
                <div className="relative z-10 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-emerald-500/20 bg-slate-950/90 backdrop-blur-xl flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-300/40">
                            <Heart className="w-5 h-5 text-slate-950 animate-pulse" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10.5px] font-black px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 tracking-wider">
                                    HOLISTIC WELLNESS & BIO-HACKING
                                </span>
                                <span className="text-[11px] text-gray-400 hidden sm:inline-block">
                                    사주 생체 리듬 & 5대 장부 조율 지휘 본부
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                                <span>타겟 웰니스 코칭</span>
                                <span className="text-xs font-normal text-emerald-400/90">
                                    {sajuMetrics.userName}님 맞춤형 심신 최적화
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* 실시간 박스 브리딩 토글 & 닫기 */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsBreathingTrainerOpen(!isBreathingTrainerOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[11px] text-emerald-200 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="4초 박스 브리딩 트레이너 열기/닫기"
                        >
                            <Wind className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <span className="hidden sm:inline font-bold">1분 호흡 리셋:</span>
                            <span className="font-mono font-black text-emerald-300 uppercase">
                                {breathPhase === 'inhale' ? '들숨' : breathPhase === 'hold' ? '멈춤' : breathPhase === 'exhale' ? '날숨' : '비움'} {breathSeconds}s
                            </span>
                        </button>

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

                {/* ── [NEW] 인터랙티브 4초 박스 브리딩(Box Breathing) 트레이너 오버레이 ── */}
                <AnimatePresence>
                    {isBreathingTrainerOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative z-20 bg-gradient-to-r from-emerald-950/90 via-slate-950 to-teal-950/90 border-b border-emerald-500/30 p-4 sm:p-5 overflow-hidden"
                        >
                            <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {/* 숨 쉬는 원형 그래픽 */}
                                    <div className="relative w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                        <motion.div
                                            animate={{
                                                scale: breathPhase === 'inhale' ? [1, 1.3] : breathPhase === 'hold' ? 1.3 : breathPhase === 'exhale' ? [1.3, 0.9] : 0.9
                                            }}
                                            transition={{ duration: 4, ease: 'easeInOut' }}
                                            className="absolute inset-1 rounded-full bg-emerald-400/30"
                                        />
                                        <span className="text-sm font-black text-white z-10 font-mono">{breathSeconds}</span>
                                        <span className="text-[9px] font-bold text-emerald-200 z-10">SEC</span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                                                네이비씰(Navy SEAL) 박스 브리딩
                                            </span>
                                            <span className="text-[11px] text-gray-300 font-bold">
                                                {breathPhase === 'inhale' && '폐 가득 깊게 들이마시기'}
                                                {breathPhase === 'hold' && '숨을 멈추고 심박수 안정화'}
                                                {breathPhase === 'exhale' && '입으로 천천히 끝까지 내쉬기'}
                                                {breathPhase === 'rest' && '비운 상태에서 온몸 이완하기'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-300 mt-1">
                                            미주신경(Vagus Nerve)을 즉각 활성화하여 교감신경 긴장을 풀고 뇌파를 안정시킵니다.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsBreathingTrainerOpen(false)}
                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
                                >
                                    트레이너 접기 ✕
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── 2. 사용자 사주 기반 실시간 웰니스 브리핑 헤더 ── */}
                <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-r from-emerald-950/40 via-slate-900/70 to-slate-950/90 border-b border-emerald-500/20 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex flex-col items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                                <span className="text-xs font-black">{sajuMetrics.dayMaster}</span>
                                <span className="text-[9px] text-gray-400">일간</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-emerald-300">{sajuMetrics.type}</span>
                                    <span className="text-[11px] text-emerald-200/90 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                                        {sajuMetrics.currentSeason}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5 flex-wrap">
                                    <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>장부 케어: <strong className="text-white font-bold">{sajuMetrics.organFocus}</strong></span>
                                    <span className="text-gray-500 hidden sm:inline">|</span>
                                    <span className="text-emerald-300 text-[11px]">지압: {sajuMetrics.acupressurePoint}</span>
                                </p>
                            </div>
                        </div>

                        {/* 3대 실시간 웰니스 퀵 지표 */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                            <div className="bg-slate-900/80 border border-emerald-500/25 rounded-xl p-2 sm:p-2.5 text-center">
                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3 text-emerald-400" />
                                    <span>뇌파 골든타임</span>
                                </div>
                                <div className="text-xs font-black text-emerald-300 mt-0.5 truncate">
                                    {sajuMetrics.goldenTime.split(' ')[1] || '13:00~15:00'}
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-2 sm:p-2.5 text-center">
                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Heart className="w-3 h-3 text-cyan-400" />
                                    <span>자율신경 밸런스</span>
                                </div>
                                <div className="text-xs font-black text-cyan-300 mt-0.5 truncate">
                                    활동 {sajuMetrics.attackRatio}% / 회복 {sajuMetrics.recoveryRatio}%
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-amber-500/25 rounded-xl p-2 sm:p-2.5 text-center">
                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    <span>웰니스 스코어</span>
                                </div>
                                <div className="text-xs font-black text-amber-300 mt-0.5 truncate">
                                    {sajuMetrics.wellnessScore}점
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── [NEW] 5대 장부(五臟六腑) 인터랙티브 바이오 밸런서 바 ── */}
                <div className="relative z-10 px-4 py-2.5 bg-slate-950/80 border-b border-white/5 shrink-0 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 min-w-max">
                        <span className="text-[10.5px] font-black text-gray-400 flex items-center gap-1 shrink-0 mr-1">
                            <Activity className="w-3 h-3 text-emerald-400" />
                            5대 장부 진단:
                        </span>
                        {Object.entries(ORGAN_DATA).map(([key, data]) => {
                            const isSelected = selectedOrganKey === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedOrganKey(key as any)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                        isSelected
                                            ? 'bg-white/15 border-emerald-400 text-white shadow-sm'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                                    <span>{data.name.split(' ')[0]}</span>
                                    <span className="text-[10px] opacity-80">{data.score}점</span>
                                </button>
                            );
                        })}
                    </div>
                    {/* 선택된 장부 실시간 미니 처방 배너 */}
                    <div className="mt-2 p-2 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-white">{ORGAN_DATA[selectedOrganKey].name}</span>
                            <span className="text-gray-400">({ORGAN_DATA[selectedOrganKey].sub})</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                {ORGAN_DATA[selectedOrganKey].status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-emerald-300 font-bold">추천:</span>
                            <span>{ORGAN_DATA[selectedOrganKey].food}</span>
                            <span className="text-gray-500 hidden sm:inline">|</span>
                            <span className="text-gray-400 hidden sm:inline">{ORGAN_DATA[selectedOrganKey].tip}</span>
                        </div>
                    </div>
                </div>

                {/* ── 3. 웰니스 & 전술 카테고리 탭 스위처 ── */}
                <div className="relative z-10 px-4 pt-3 pb-2 bg-slate-950 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('all'); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'all'
                                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>전체 웰니스 조망 (10대 모듈)</span>
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
                                        ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
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

                {/* ── 4. 메인 웰니스 카드 그리드 영역 (스크롤) ── */}
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
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                                                    {section.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">{section.subtitle}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        웰니스 모듈 4종 가동
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
                                                        ? 'bg-gradient-to-b from-emerald-500/25 to-slate-900/90 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                                                        : 'bg-slate-900/70 hover:bg-slate-900 border border-white/10 hover:border-emerald-400/40 shadow-lg'
                                                }`}
                                            >
                                                {/* 상단 뱃지 & 넘버링 */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/10 text-gray-300 group-hover:bg-emerald-400/20 group-hover:text-emerald-300 transition-colors">
                                                            NO.{card.number}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                                            {card.status}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                                                        {card.title}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                                        {card.desc}
                                                    </p>
                                                </div>

                                                {/* 마이크로 웰니스 위젯 */}
                                                <div className="my-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 group-hover:border-emerald-400/20 transition-all flex items-center justify-between">
                                                    {card.visualType === 'wave' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                                                <span className="text-xs font-bold text-emerald-200">{card.metric}</span>
                                                            </div>
                                                            <div className="flex items-end gap-0.5 h-4">
                                                                <span className="w-1 h-2 bg-emerald-500/40 rounded-full" />
                                                                <span className="w-1 h-3.5 bg-emerald-500/70 rounded-full" />
                                                                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" />
                                                                <span className="w-1 h-3 bg-emerald-500/80 rounded-full" />
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
                                                            <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-1.5 py-0.5 rounded">PEAK</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'gauge' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Heart className="w-3.5 h-3.5 text-pink-400" />
                                                                <span className="text-xs font-bold text-pink-200">{card.metric}</span>
                                                            </div>
                                                            <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                                                <div className="w-[68%] bg-pink-400 h-full" />
                                                                <div className="w-[32%] bg-emerald-400 h-full" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'equalizer' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <span className="text-xs font-bold text-emerald-300 truncate max-w-[130px]">{card.metric}</span>
                                                            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                                                        </div>
                                                    )}

                                                    {card.visualType === 'secret' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                                                <span className="text-xs font-bold text-purple-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">RECOVERY</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'name' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
                                                                <span className="text-xs font-bold text-yellow-200">528Hz 음성 테라피</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded">SOUND</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'oracle' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                                                                <span className="text-xs font-bold text-indigo-200">마인드풀니스 64괘</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded">ALPHA</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'compass' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
                                                                <span className="text-xs font-bold text-cyan-200">{card.metric}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">EARTHING</span>
                                                        </div>
                                                    )}

                                                    {card.visualType === 'sync' && (
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                                                                <span className="text-xs font-bold text-purple-200">면역 바이오싱크</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">IMMUNE</span>
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
                                                        <Info className="w-3 h-3 text-emerald-400" />
                                                        <span>웰니스 분석 보기</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTriggerIntent(card.intent, card.title);
                                                        }}
                                                        className="py-2 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                                                        title="1:1 웰니스 코칭 즉시 시작"
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

                {/* ── 5. [NEW] 세계 최고 수준 웰니스 상세 인스펙터 모달 (Wellness Deep Inspector) ── */}
                <AnimatePresence>
                    {selectedCard && (
                        <div
                            onClick={() => setSelectedCardId(null)}
                            className="fixed inset-0 z-[2200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
                        >
                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                className="w-full max-w-2xl bg-slate-900 border-2 border-emerald-400/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
                            >
                                {/* 배경 웰니스 글로우 효과 */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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
                                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-400 text-slate-950">
                                        NO.{selectedCard.number} {selectedCard.status}
                                    </span>
                                    <span className="text-xs text-emerald-300 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
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
                                    {/* 핵심 웰니스 진단 박스 */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-800 to-slate-800/80 border border-emerald-500/30">
                                        <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1.5">
                                            <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                                            <span>실시간 생체 & 전술 웰니스 진단 요약</span>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed font-medium">
                                            {selectedCard.deepData?.summary}
                                        </p>
                                    </div>

                                    {/* 3대 전술 & 바이오해킹 행동 지침 */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>바이오해킹 & 작전 요강 (Bio-Hacking Protocols)</span>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedCard.deepData?.points.map((pt: string, idx: number) => (
                                                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-start gap-2.5">
                                                    <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                                                        0{idx + 1}
                                                    </span>
                                                    <span className="text-gray-300 leading-relaxed">{pt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 하단 액션 버튼: AI 웰니스 전담 코치와 1:1 연결 */}
                                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5 self-start sm:self-center">
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>사주 원국 & 서카디안 생체 데이터 결합 완료</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleTriggerIntent(selectedCard.intent, selectedCard.title)}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                    >
                                        <Send className="w-3.5 h-3.5 fill-slate-950" />
                                        <span>{selectedCard.deepData?.actionLabel || '1:1 웰니스 AI 코칭 시작하기 ➔'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ── 6. 하단 웰니스 액션 풋바 ── */}
                <div className="relative z-10 p-3 sm:p-4 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        <span>사주 원국 8자 및 서카디안 호르몬 기반 1:1 전인적 웰니스 코칭 엔진</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            type="button"
                            onClick={() => handleTriggerIntent('golden_time_analysis', '골든타임 전인적 웰니스 브리핑')}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                            <Heart className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                            <span>🌿 오늘의 심신 웰니스 & 승부수 브리핑 받기</span>
                        </button>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
