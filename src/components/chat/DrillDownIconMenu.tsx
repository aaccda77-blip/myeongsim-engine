/**
 * DrillDownIconMenu.tsx - 3D 아이콘 메뉴 컴포넌트
 * 
 * 특징:
 * - 6개 메인 아이콘 (3D Icons + CSS 3D 효과)
 * - 터치 시 서브메뉴 Bottom Sheet 펼침
 * - 사용자 맞춤 추천 배지
 * - 고급스러운 UI/UX
 * - 성격분석 메뉴에 레이더 차트 통합
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TalentAnalysisModule } from '@/modules/TalentAnalysisModule';
import TalentReportCard from '@/components/chat/TalentReportCard';
import HealingMusicPlayerModal from '@/components/chat/HealingMusicPlayerModal'; // [NEW] Refactored Component
import { assembleFullReport } from '@/services/ReportAssembler';
import { useReportStore } from '@/store/useReportStore'; // [New] Import for navigation
import { useSubscription } from '@/hooks/useSubscription'; // [NEW] 이용권 상태 확인
import {
    ICON_DRILL_DOWN_MAP,
    getMainIconsWithRecommendations,
    generateChatPromptFromIntent,
    MainIcon,
    SubMenuItem
} from '@/modules/DrillDownProtocol';
import TherapyCard from '@/components/therapy/TherapyCard'; // [NEW] 심리 치유 아키타입 카드
import { findTherapyArchetype, TherapyArchetype } from '@/data/TherapyDB'; // [NEW] 아키타입 매칭 엔진
import { DailyBiorhythmWidget } from '@/components/features/DailyBiorhythmWidget';
// [NEW] Mental Prescription Modal (Clean Install)
const MentalPrescriptionModal = dynamic(() => import('@/components/bio/MentalPrescriptionV2'), { ssr: false });
// [NEW] SOS Breathing Guide Modal
const BreathingGuideModal = dynamic(() => import('@/components/bio/BreathingGuideModal'), { ssr: false });
// [Security] ScoreCalculator와 StaticTextDB는 더 이상 클라이언트에서 import하지 않음
// 대신 /api/secure/* API를 통해 서버에서 데이터를 가져옴

// 차트 컴포넌트 동적 임포트 (SSR 방지)
const StrengthRadarChart = dynamic(() => import('@/components/charts/StrengthRadarChart'), { ssr: false });
const VisualSajuDashboard = dynamic(() => import('@/components/visual/VisualSajuDashboard'), { ssr: false });
// [NEW] 108 자각 Content Modals
const SajuSummaryModal = dynamic(() => import('@/components/coaching/SajuSummaryModal'), { ssr: false });
const AwakeningChat = dynamic(() => import('@/components/coaching/AwakeningChat'), { ssr: false });
const SajuAnalysisReportModal = dynamic(() => import('@/components/report/SajuAnalysisReportModal'), { ssr: false });



// ============== 스타일 ==============
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '12px 4px',
        background: 'linear-gradient(180deg, rgba(15,15,30,0.95) 0%, rgba(25,25,50,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.3)',
        marginBottom: '12px',
        gap: '2px',
        flexWrap: 'nowrap' as const,
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto', // [Fix] 가로 스크롤 허용
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
    } as React.CSSProperties,

    iconButton: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '4px',
        padding: '6px 4px',
        borderRadius: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative' as const,
        flex: '0 0 auto', // [Fix] 찌그러짐 방지
        minWidth: '76px', // [Fix] 겹침 방지: 최소 너비 증가
        maxWidth: 'none', // [Fix] 텍스트 길이에 따라 늘어남
    } as React.CSSProperties,

    // 3D 아이콘 컨테이너 (CSS 3D 효과)
    iconWrapper: {
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
        boxShadow: `
            0 4px 15px rgba(0,0,0,0.3),
            0 1px 3px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        transform: 'perspective(500px) rotateX(5deg)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    } as React.CSSProperties,

    iconWrapperHover: {
        transform: 'perspective(500px) rotateX(0deg) translateY(-4px) scale(1.05)',
        boxShadow: `
            0 12px 30px rgba(102, 126, 234, 0.4),
            0 4px 10px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.2)
        `,
    } as React.CSSProperties,

    // 3D 아이콘 이미지 (실제 3D 아이콘 또는 이모지)
    icon3D: {
        fontSize: '22px',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    } as React.CSSProperties,

    iconLabel: {
        fontSize: '10px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center' as const,
        letterSpacing: '-0.3px',
        whiteSpace: 'normal' as const, // [Fix] 텍스트 줄바꿈 허용
        lineHeight: 1.2, // [Fix] 줄간격 조정
        marginTop: '4px',
        width: '100%',
        wordBreak: 'keep-all' as const, // [Fix] 단어 단위 줄바꿈
    } as React.CSSProperties,

    // 추천 배지
    badge: {
        position: 'absolute' as const,
        top: '4px',
        right: '4px',
        fontSize: '12px',
        animation: 'pulse 2s infinite',
    } as React.CSSProperties,

    // 뇌과학 트리거 텍스트
    neuroTrigger: {
        fontSize: '9px',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: '60px',
        textAlign: 'center' as const,
        lineHeight: 1.2,
        marginTop: '2px',
    } as React.CSSProperties,

    // Bottom Sheet 오버레이
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 999,
        opacity: 0,
        visibility: 'hidden' as const,
        transition: 'all 0.3s ease',
    } as React.CSSProperties,

    overlayVisible: {
        opacity: 1,
        visibility: 'visible' as const,
    } as React.CSSProperties,

    // Bottom Sheet
    bottomSheet: {
        position: 'fixed' as const,
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(180deg, rgba(30,30,60,0.98) 0%, rgba(20,20,40,0.99) 100%)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px 24px 0 0',
        zIndex: 1000,
        transform: 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        maxHeight: '85vh', // [Fix] 높이 확장 (41개 항목 대응)
        overflowY: 'auto' as const,
        overscrollBehavior: 'contain' as any, // [Fix] 배경 스크롤 방지
        paddingBottom: '60px', // [Fix] 최하단 아이템 잘림 방지
    } as React.CSSProperties,

    bottomSheetOpen: {
        transform: 'translateY(0)',
    } as React.CSSProperties,

    sheetHandle: {
        width: '40px',
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '2px',
        margin: '0 auto 16px',
    } as React.CSSProperties,

    sheetHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
    } as React.CSSProperties,

    sheetIcon: {
        fontSize: '36px',
    } as React.CSSProperties,

    sheetTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#fff',
    } as React.CSSProperties,

    sheetSubtitle: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.6)',
        marginTop: '2px',
    } as React.CSSProperties,

    // 서브메뉴 아이템
    subMenuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px', // [Fix] 간격 축소
        padding: '12px 16px', // [Fix] 패딩 축소
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    } as React.CSSProperties,

    subMenuItemHover: {
        background: 'rgba(102, 126, 234, 0.15)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        transform: 'translateX(4px)',
    } as React.CSSProperties,

    subMenuIcon: {
        fontSize: '24px',
    } as React.CSSProperties,

    subMenuLabel: {
        fontSize: '15px',
        fontWeight: 600,
        color: '#fff',
    } as React.CSSProperties,

    subMenuDesc: {
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
        marginTop: '2px',
    } as React.CSSProperties,

    premiumBadge: {
        marginLeft: 'auto',
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        color: '#000',
        fontSize: '10px',
        fontWeight: 700,
        padding: '4px 8px',
        borderRadius: '12px',
    },
};




// ============== CSS 애니메이션 ==============
const injectStyles = () => {
    if (typeof document !== 'undefined' && !document.getElementById('drilldown-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'drilldown-styles';
        styleSheet.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .icon-3d-gold {
                background: linear-gradient(145deg, rgba(255,215,0,0.2) 0%, rgba(255,165,0,0.1) 100%) !important;
                border: 1px solid rgba(255,215,0,0.3);
            }
            
            .icon-3d-purple {
                background: linear-gradient(145deg, rgba(138,43,226,0.2) 0%, rgba(75,0,130,0.1) 100%) !important;
                border: 1px solid rgba(138,43,226,0.3);
            }
            
            .icon-3d-green {
                background: linear-gradient(145deg, rgba(46,204,113,0.2) 0%, rgba(39,174,96,0.1) 100%) !important;
                border: 1px solid rgba(46,204,113,0.3);
            }
        `;
        document.head.appendChild(styleSheet);
    }
};

// ============== 아이콘 스타일 클래스 ==============
const getIconStyleClass = (style?: MainIcon['style']): string => {
    switch (style) {
        case 'premium_gold': return 'icon-3d-gold';
        case 'premium_purple': return 'icon-3d-purple';
        case 'healing_green': return 'icon-3d-green';
        default: return '';
    }
};

// ============== 친숙한 라벨 매핑 ==============
const FRIENDLY_LABELS: Record<string, { main: string; sub: string }> = {
    WEALTH: { main: '재물운', sub: '왜 벌어도 안 모일까?' },
    RELATIONSHIP: { main: '연애운', sub: '반복되는 상처 끊기' },
    CAREER: { main: '직업운', sub: '나는 이 일 하러 태어났다' },
    PERSONALITY_ANALYSIS: { main: '성격분석', sub: '강점/재능(인적자원)리포트' },
    DAILY_MISSION: { main: '오늘운세', sub: '지금 뭘 해야 운이 트일까?' },
    SAJU_ANALYSIS: { main: '사주분석', sub: '운명의 설계도 확인' },
    BIO_SYNC: { main: '생체연동', sub: '실시간 운명 동기화' },
    STRESS_RELIEF: { main: '명심힐링', sub: '지친 마음 쉬어가기' },
    PATH_108: { main: '108자각', sub: '내면의 빛을 찾는 여정' }, // [New] Added label
};

// ============== Helper: Dynamic Text Resolution ==============
const resolveDynamicText = (text: string | undefined, userProfile: any): string => {
    if (!text) return '';
    if (!userProfile?.saju) return text.replace(/\{\{.*?\}\}/g, '...'); // Fallback if no data

    let resolved = text;
    const saju = userProfile.saju;

    // [Fix] Robust Pillar Extraction (Handle Flat vs Nested)
    const getPillar = (type: 'year' | 'month' | 'day' | 'time') => {
        // 1. Try Legacy Flat (e.g. saju.yearPillar)
        const flatKey = `${type}Pillar` as keyof typeof saju;
        if (saju[flatKey]) return saju[flatKey];

        // 2. Try Nested (e.g. saju.fourPillars.year)
        if (saju.fourPillars && saju.fourPillars[type]) return saju.fourPillars[type];

        // 3. Try Direct (e.g. saju.year) - unlikely but possible in some legacy states
        if (saju[type]) return saju[type];

        return null;
    };

    const p = {
        year: getPillar('year'),
        month: getPillar('month'),
        day: getPillar('day'),
        time: getPillar('time')
    };

    // Helper to get stem/branch char
    const getChar = (obj: any, part: 'stem' | 'branch') => {
        if (!obj) return '';
        // If obj has stem/branch props (legacy)
        if (part === 'stem' && obj.stem) return obj.stem;
        if (part === 'branch' && obj.branch) return obj.branch;

        // If obj is SajuPillar { gan: { char... }, ji: { char... } } (new)
        if (part === 'stem') return obj.gan?.char || obj.gan || '?';
        if (part === 'branch') return obj.ji?.char || obj.ji || '?';

        return '';
    };

    const Ganji = {
        year: `${getChar(p.year, 'stem')}${getChar(p.year, 'branch')}`,
        month: `${getChar(p.month, 'stem')}${getChar(p.month, 'branch')}`,
        day: `${getChar(p.day, 'stem')}${getChar(p.day, 'branch')}`,
        hour: `${getChar(p.time, 'stem')}${getChar(p.time, 'branch')}`,
    };

    // 1. Ganji Placeholders
    resolved = resolved.replace('{{SAJU_GANJI}}', `${Ganji.year} ${Ganji.month} ${Ganji.day} ${Ganji.hour}`);
    resolved = resolved.replace('{{DAY_MASTER}}', getChar(p.day, 'stem') || '일간'); // [Fix] Robust DayMaster
    resolved = resolved.replace('{{YEAR_PILLAR}}', Ganji.year || '년주');
    resolved = resolved.replace('{{MONTH_PILLAR}}', Ganji.month || '월주');
    resolved = resolved.replace('{{HOUR_PILLAR}}', Ganji.hour || '시주');

    // 2. Logic Placeholders (Simplified for now)
    resolved = resolved.replace('{{WEAK_ELEMENT}}', '부족한 기운'); // TODO: Implement logic
    resolved = resolved.replace('{{GONGMANG}}', '공망');             // TODO: Implement logic
    resolved = resolved.replace('{{CURRENT_DAEWOON}}', '현재 대운'); // TODO: Implement logic
    resolved = resolved.replace('{{CURRENT_YEAR_GANJI}}', '을사(乙巳)'); // 2025 Fixed

    return resolved;
};

// ============== Props ==============
interface DrillDownIconMenuProps {
    userProfile?: any;
    onSelectIntent: (intent: string, prompt: string) => void;
    hideTodayEnergy?: boolean; // [NEW] 챗봇 상담 중 Today Energy 숨기기
}

// ============== 메인 컴포넌트 ==============
export default function DrillDownIconMenu({
    userProfile,
    onSelectIntent,
    hideTodayEnergy = false
}: DrillDownIconMenuProps) {
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<MainIcon | null>(null);
    const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // [New] Nested Navigation State
    const [currentMenuDepth, setCurrentMenuDepth] = useState<SubMenuItem[] | null>(null); // 현재 보여줄 하위 메뉴 리스트
    const [menuBreadcrumb, setMenuBreadcrumb] = useState<{ id: string, label: string }[]>([]); // 네비게이션 경로


    // [Pulse 5] Visual Dashboard State
    const [showVisualDashboard, setShowVisualDashboard] = useState(false);



    // [Pulse 6] Collapsible Teaser State
    const [isTeaserCollapsed, setIsTeaserCollapsed] = useState(false);

    // [New] Therapy Archetype Modal State
    const [selectedTherapyArchetype, setSelectedTherapyArchetype] = useState<TherapyArchetype | null>(null);
    const [showTherapyModal, setShowTherapyModal] = useState(false);

    // [New] Integral Check-in Modal State
    const [showIntegralCheckin, setShowIntegralCheckin] = useState(false);

    // [NEW] SOS Breathing Guide Modal State
    const [showBreathingGuide, setShowBreathingGuide] = useState(false);
    // [NEW] Stress Relief Music Player State
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    // [NEW] Talent Report Modal State
    const [showTalentReportModal, setShowTalentReportModal] = useState(false);

    const [talentReportData, setTalentReportData] = useState<any>(null);

    // [NEW] 108 자각 Modals State
    const [showSajuSummary, setShowSajuSummary] = useState(false);
    const [showDiscoveryChat, setShowDiscoveryChat] = useState(false);
    const [discoveryChatIntent, setDiscoveryChatIntent] = useState<string>('');

    const [showReportModal, setShowReportModal] = useState(false); // [New] Report Modal State
    const { reportData } = useReportStore();


    // [NEW] 이용권 상태 확인
    const { isExpired } = useSubscription();

    // 스타일 주입
    React.useEffect(() => {
        injectStyles();
    }, []);


    // [New] 차트 인터랙션 상태
    const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
    const [traitDescription, setTraitDescription] = useState<{
        title: string;
        subTitle?: string;
        desc: string;
        advice: string;
        mission?: string;
        superpower_badge?: string;
    } | null>(null);
    const [chartScores, setChartScores] = useState<any>(null);
    const [isLoadingTrait, setIsLoadingTrait] = useState(false);

    // [Security] 서버에서 점수 계산 (컴포넌트 마운트 시 또는 성격분석 선택 시)
    useEffect(() => {
        const fetchScores = async () => {
            try {
                // [Saju 연동] 사용자 사주 매트릭스 사용 (or fallback)
                const sajuMatrix = userProfile?.saju || {
                    ohaeng: { wood: 45, fire: 15, earth: 10, metal: 5, water: 25 },
                    tenGods: { resource: 3, output: 2, self: 2, power: 1, wealth: 2 },
                    sinsal: { yeokma: true }
                };

                const res = await fetch('/api/secure/calculate-scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sajuMatrix })
                });

                if (res.ok) {
                    const data = await res.json();
                    setChartScores(data.scores);
                }
            } catch (e) {
                console.error('Failed to fetch scores:', e);
            }
        };

        fetchScores();
    }, [userProfile]);

    // [Saju 연동] 사용자 일주 천간 추출 (Day Master)
    const dayMaster = userProfile?.saju?.dayPillar?.stem || userProfile?.dayMaster || '갑';
    const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : new Date('1990-01-01');

    // 추천 아이콘 계산
    const icons = getMainIconsWithRecommendations(userProfile);

    // [Cleaned] 하드코딩 제거됨 - DrillDownProtocol.ts에서 관리
    // BIO_SYNC는 이제 기본 메뉴 맵에 포함되어 있습니다.

    // [Security] 서버에서 특성 설명 가져오기
    const handleTraitClick = async (trait: string, score: number) => {
        // [Neuroscientist] Physical Reward (Haptic)
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);

        setSelectedTrait(trait);
        setIsLoadingTrait(true);
        setTraitDescription(null);

        try {
            // [REINFORCED] Use POST to send Saju Context for Hyper-Personalization
            const res = await fetch('/api/secure/trait-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trait,
                    userId: userProfile?.id,
                    saju: userProfile?.saju
                })
            });

            if (res.ok) {
                const data = await res.json();
                setTraitDescription(data.data);
            }
        } catch (e) {
            console.error('Failed to fetch trait description:', e);
        } finally {
            setIsLoadingTrait(false);
        }
    };

    // 아이콘 클릭 핸들러
    const handleIconClick = (icon: MainIcon) => {
        // [NEW] 이용권 만료 시 클릭 차단
        if (isExpired) {
            alert('이용권이 만료되었습니다. 이용권을 갱신해주세요.');
            return;
        }

        // [NEW] STARTUP 아이콘 클릭 시 독립 페이지로 이동
        if (icon.id === 'STARTUP') {
            window.location.href = '/startup';
            return;
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        setSelectedIcon(icon);

        // [Reset] Navigation State Reset on Main Icon Click
        setCurrentMenuDepth(icon.sub_menus);
        setMenuBreadcrumb([]);
    };

    // 서브메뉴 선택 핸들러
    // 서브메뉴 선택 핸들러
    const handleSubMenuSelect = (subItem: SubMenuItem) => {

        // [Navigation] 하위 메뉴가 있는 경우 (Depth 진입)
        if (subItem.children && subItem.children.length > 0) {
            setMenuBreadcrumb(prev => [...prev, { id: subItem.id, label: subItem.label }]);
            setCurrentMenuDepth(subItem.children);
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(5);
            return;
        }


        // [FIX] 사주 원국 분석 시 비주얼 대시보드 열기
        if (subItem.intent === 'saju_basic_analysis') {
            setSelectedIcon(null);
            setShowVisualDashboard(true);
            return;
        }

        // [V3 REBUILD] 강점 리포트 모달 (User Request: 기존 삭제 후 재설치)
        if (subItem.intent === 'strength_talent_report' || subItem.intent === 'strength_report_view') {
            // 1. 하위 메뉴 닫기
            setSelectedIcon(null);

            // 2. 사용자 사주 데이터 추출 (안전한 폴백 포함)
            const userSaju = userProfile?.saju || {};

            // 3. 분석 엔진 실행
            const analysisResult = TalentAnalysisModule.analyze(userSaju);

            // 4. 모달에 데이터 전달 및 열기
            setTalentReportData(analysisResult);
            setShowTalentReportModal(true);

            // 5. 여기서 무조건 리턴 (챗봇으로 절대 안감)
            return;
        }

        // [NEW] 스타트업 창업 전략 페이지로 이동
        if (subItem.intent === 'startup_strategy_view') {
            setSelectedIcon(null);
            window.location.href = '/report/startup';
            return;
        }

        // [NEW] 에너지 대시보드 페이지로 이동
        if (subItem.intent === 'energy_dashboard_view') {
            setSelectedIcon(null);
            window.location.href = '/today';
            return;
        }

        // [NEW] 통합 체크인 (Integral Check-in)
        if (subItem.intent === 'integral_checkin_view') {
            setSelectedIcon(null);
            setShowIntegralCheckin(true);
            return;
        }

        // [NEW] SOS 호흡 가이드
        if (subItem.intent === 'sos_breathing_guide') {
            setSelectedIcon(null);
            setShowBreathingGuide(true);
            return;
        }

        // [NEW] 힐링 음악 플레이어
        if (subItem.intent === 'play_healing_music') {
            setSelectedIcon(null);
            setShowMusicPlayer(true);
            return;
        }

        // [NEW] 건강상식 Q&A 메뉴
        if (subItem.intent === 'daily_health_qa') {
            setSelectedIcon(null);
            window.location.href = '/health-qa';
            return;
        }

        if (subItem.intent === 'health_qa_archive') {
            setSelectedIcon(null);
            window.location.href = '/health-qa/archive';
            return;
        }

        if (subItem.intent === 'health_qa_custom') {
            setSelectedIcon(null);
            // [UPDATE] 맞춤 질문 페이지로 이동
            window.location.href = '/health-qa/custom';
            return;
        }

        // [NEW] 바이오 밸런서 - 4개 서브 메뉴
        if (subItem.intent === 'bio_care_med_literacy') {
            setSelectedIcon(null);
            window.location.href = '/bio-care/med-literacy';
            return;
        }

        if (subItem.intent === 'bio_care_nutri_synergy') {
            setSelectedIcon(null);
            window.location.href = '/bio-care/nutri-synergy';
            return;
        }

        if (subItem.intent === 'bio_care_body_log') {
            setSelectedIcon(null);
            window.location.href = '/bio-care/body-log';
            return;
        }

        if (subItem.intent === 'bio_care_educator_note') {
            setSelectedIcon(null);
            window.location.href = '/bio-care/educator-note';
            return;
        }

        // [NEW] 64코드 사색 페이지로 이동
        if (subItem.intent === 'iching_code_search') {
            setSelectedIcon(null);
            window.location.href = '/iching/codes';
            return;
        }


        // [NEW] 108 자각 - 모든 서브 아이템 처리 (p_1 ~ p_18)
        // [NEW] 108 자각 - 모든 서브 아이템 처리 (p_1 ~ p_18)
        // [UPDATE] User requested to run this in Main Chatbot instead of Modal
        // We allow this to fall through to default 'onSelectIntent'
        /*
        if (subItem.id.startsWith('p_')) {
            setSelectedIcon(null);

            // p_1 (사주 핵심 요약)은 전용 시각화 모달 사용
            if (subItem.intent === 'saju_core_summary') {
                setShowSajuSummary(true);
                return;
            }

            // 나머지는 모두 Discovery Chat 실행
            console.log('Starting Discovery Chat for:', subItem.intent);
            setDiscoveryChatIntent(subItem.intent);
            setShowDiscoveryChat(true);
            return;
        }
        */


        // [NEW] 80페이지 분량의 소울 아카이브 페이지로 이동
        if (subItem.id === 'FULL_REPORT' || subItem.label.includes('종합 리포트')) {
            setSelectedIcon(null);
            window.location.href = '/report/soul-archive';
            return;
        }

        // [NEW] 심리 치유 아키타입 보기 (Therapy Card)
        if (subItem.intent === 'therapy_archetype_view') {
            setSelectedIcon(null);

            // 1. 사용자 프로필 매핑
            const sajuMatrix = userProfile?.saju?.ohaeng || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
            const scores = [
                { el: '목', score: sajuMatrix.wood || 0 },
                { el: '화', score: sajuMatrix.fire || 0 },
                { el: '토', score: sajuMatrix.earth || 0 },
                { el: '금', score: sajuMatrix.metal || 0 },
                { el: '수', score: sajuMatrix.water || 0 }
            ];
            const dominantOhaeng = scores.sort((a, b) => b.score - a.score).slice(0, 2).map(s => s.el as any);

            // 2. 추천 아키타입 찾기
            const recommendations = findTherapyArchetype({
                dominantOhaeng,
                userType: 'emotional' // 기본값 (추후 정교화)
            });

            if (recommendations.length > 0) {
                setSelectedTherapyArchetype(recommendations[0]);
                setShowTherapyModal(true);
            } else {
                // Fallback (데이터가 없을 경우) - '통제자' 유형
                const { THERAPY_ARCHETYPES } = require('@/data/TherapyDB');
                setSelectedTherapyArchetype(THERAPY_ARCHETYPES["ARCH_ACT_CONTROLLER"]);
                setShowTherapyModal(true);
            }
            return;
        }

        const prompt = generateChatPromptFromIntent(subItem.intent, userProfile);
        onSelectIntent(subItem.intent, prompt);
        setSelectedIcon(null);
    };

    // Bottom Sheet 닫기
    // Bottom Sheet 닫기
    const handleClose = () => {
        setSelectedIcon(null);
        setCurrentMenuDepth(null);
        setMenuBreadcrumb([]);
    };

    // [Navigation] 뒤로가기 핸들러
    const handleBack = () => {
        if (menuBreadcrumb.length === 0) return; // 최상위면 동작 X

        const newBreadcrumb = [...menuBreadcrumb];
        newBreadcrumb.pop(); // 현재 위치 제거
        setMenuBreadcrumb(newBreadcrumb);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(5);

        // 이전 뎁스의 메뉴 리스트 찾기 (Recalculate path)
        // 1. 최상위(selectedIcon.sub_menus)부터 시작
        let targetList = selectedIcon?.sub_menus || [];

        // 2. 남은 breadcrumb를 따라 내려감
        for (const crumb of newBreadcrumb) {
            const found = targetList.find(item => item.id === crumb.id);
            if (found && found.children) {
                targetList = found.children;
            }
        }
        setCurrentMenuDepth(targetList);
    };

    // [Pulse 5] Dashboard Chat Intent Handler
    const handleDashboardChatIntent = (intent: string, prompt: string) => {
        setShowVisualDashboard(false);
        onSelectIntent(intent, prompt);
    };

    return (
        <>
            {/* [Pulse 5] Visual Saju Dashboard Overlay */}
            {
                showVisualDashboard && (
                    <VisualSajuDashboard
                        onClose={() => setShowVisualDashboard(false)}
                        onChatIntent={handleDashboardChatIntent}
                        birthDate={birthDate}
                        userProfile={userProfile}
                        onEditBirthdate={() => {
                            // [Fix] Navigate to CoverView (Saju input form) instead of non-existent settings page
                            setShowVisualDashboard(false); // Close dashboard first
                            useReportStore.getState().setStep(1); // Return to CoverView form
                        }}
                    />
                )
            }

            {/* [NEW] Saju Summary Modal */}
            <SajuSummaryModal
                isOpen={showSajuSummary}
                onClose={() => setShowSajuSummary(false)}
                userProfile={userProfile}
                onStartChat={(intent) => {
                    setShowSajuSummary(false);
                    setDiscoveryChatIntent(intent);
                    setTimeout(() => setShowDiscoveryChat(true), 300); // 딜레이 후 대화창 오픈
                }}
            />

            {/* [NEW] Therapy Archetype Modal */}
            {
                showTherapyModal && selectedTherapyArchetype && (
                    <TherapyCard
                        archetype={selectedTherapyArchetype}
                        isOpen={showTherapyModal}
                        onClose={() => setShowTherapyModal(false)}
                        onChatIntent={(intent, prompt) => {
                            setShowTherapyModal(false);
                            onSelectIntent(intent, prompt);
                        }}
                    />
                )
            }

            {/* [NEW] Awakening Chat Modal (Step 1 -> Handoff) */}
            <AnimatePresence>
                {showDiscoveryChat && (
                    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg h-[600px] shadow-2xl"
                        >
                            <AwakeningChat
                                onClose={() => setShowDiscoveryChat(false)}
                                onComplete={(prompt) => {
                                    setShowDiscoveryChat(false);
                                    // 메인 채팅으로 컨텍스트 전달 (Handoff)
                                    onSelectIntent('chat_handoff', prompt);
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* [NEW] Integral Check-in Modal */}
            <AnimatePresence>
                {showIntegralCheckin && (
                    <MentalPrescriptionModal
                        isOpen={showIntegralCheckin}
                        onClose={() => setShowIntegralCheckin(false)}
                        userId={userProfile?.id || 'guest'} // Security: Pass explicit user ID
                        onComplete={(advice, context) => {
                            setShowIntegralCheckin(false);
                            // Trigger Chat with the result
                            // Reinforced Connection: Use rich prompt from Modal if available
                            const prompt = context.initialPrompt || `오늘의 통합 체크인 결과입니다:\n\n"${advice}"\n\n이 분석 내용을 바탕으로 오늘 하루를 어떻게 보내면 좋을지, 12운성 에너지와 연관지어 구체적인 가이드를 주세요.`;
                            onSelectIntent('integral_result', prompt);
                        }}
                    />
                )}

            </AnimatePresence>

            {/* [NEW] Healing Music Player Modal - Clean Component */}
            <HealingMusicPlayerModal
                isOpen={showMusicPlayer}
                onClose={() => setShowMusicPlayer(false)}
            />

            {/* [NEW] Talent Report Card Modal */}
            <AnimatePresence>
                {showTalentReportModal && talentReportData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowTalentReportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-purple-500/30 rounded-2xl p-4 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <button onClick={() => setShowTalentReportModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-3 text-center">🧬 나의 강점/재능 리포트</h3>

                            <TalentReportCard data={talentReportData} />

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                사주 OS 기반 핵심 재능 분석
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* [REMOVED] TODAY'S ENERGY 섹션 - 챗봇 대화 시 완전히 숨김 */}
            {
                !hideTodayEnergy && (
                    <div className="mb-4 relative">
                        <div className="flex justify-between items-center mb-2 pr-8">
                            <span className="text-gray-400 text-xs font-bold px-1">TODAY'S ENERGY</span>
                            <button
                                onClick={() => setShowVisualDashboard(true)}
                                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-1 rounded border border-purple-500/50 flex items-center gap-1"
                            >
                                🔮 내 운명 지도 보기
                            </button>
                        </div>
                        <DailyBiorhythmWidget dayMaster={dayMaster} />
                    </div>
                )
            }

            {/* 메인 아이콘 바 */}
            <div style={styles.container}>
                {/* [NEW] My Report Icon (Fixed First Position) */}
                <button
                    style={styles.iconButton}
                    onClick={() => setShowReportModal(true)}
                >
                    <div style={{
                        ...styles.iconWrapper,
                        // Special Gold Styling for Report
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(180, 83, 9, 0.2))',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {/* Clipboard Icon */}
                        <span style={{ fontSize: '20px' }}>📋</span>
                    </div>
                    <div>
                        <div style={{ ...styles.iconLabel, color: '#FCD34D' }}>내 리포트</div>
                        <div style={styles.neuroTrigger}>진단요약</div>
                    </div>
                </button>



                {icons.map((icon) => {
                    const isHovered = hoveredIcon === icon.id;
                    const friendlyLabel = FRIENDLY_LABELS[icon.id] || {
                        main: icon.label,
                        sub: icon.neuro_trigger
                    };

                    return (
                        <button
                            key={icon.id}
                            style={styles.iconButton}
                            onMouseEnter={() => setHoveredIcon(icon.id)}
                            onMouseLeave={() => setHoveredIcon(null)}
                            onClick={() => handleIconClick(icon)}
                        >
                            {/* 추천 배지 */}
                            {(icon as any).badge && (
                                <span style={styles.badge}>{(icon as any).badge}</span>
                            )}

                            {/* 3D 아이콘 컨테이너 */}
                            <div
                                style={{
                                    ...styles.iconWrapper,
                                    ...(isHovered ? styles.iconWrapperHover : {}),
                                }}
                                className={getIconStyleClass(icon.style)}
                            >
                                <span style={styles.icon3D}>{icon.icon}</span>
                            </div>

                            {/* 라벨 */}
                            <span style={styles.iconLabel}>
                                {friendlyLabel?.main || icon.label}
                            </span>

                            {/* 뇌과학 트리거 (옵션) */}
                            {isHovered && (
                                <span style={styles.neuroTrigger}>
                                    {friendlyLabel?.sub || icon.neuro_trigger}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 오버레이 */}
            <div
                style={{
                    ...styles.overlay,
                    ...(selectedIcon ? styles.overlayVisible : {}),
                }}
                onClick={handleClose}
            />

            {/* Bottom Sheet */}
            <div
                style={{
                    ...styles.bottomSheet,
                    ...(selectedIcon ? styles.bottomSheetOpen : {}),
                }}
            >
                {selectedIcon && (
                    <>
                        {/* 핸들 */}
                        <div style={styles.sheetHandle} />

                        {/* 헤더 */}
                        <div style={styles.sheetHeader}>
                            {/* [Navigation] Back Button (Breadcrumb 있을 때만 표시) */}
                            {menuBreadcrumb.length > 0 ? (
                                <button
                                    onClick={handleBack}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        marginRight: '8px'
                                    }}
                                >
                                    ←
                                </button>
                            ) : (
                                <span style={styles.sheetIcon}>{selectedIcon.icon}</span>
                            )}

                            <div>
                                <div style={styles.sheetTitle}>
                                    {/* Breadcrumb가 있으면 마지막 항목 이름을 타이틀로, 아니면 메인 타이틀 */}
                                    {menuBreadcrumb.length > 0
                                        ? menuBreadcrumb[menuBreadcrumb.length - 1].label
                                        : (FRIENDLY_LABELS[selectedIcon.id]?.main || selectedIcon.label)}
                                </div>
                                <div style={styles.sheetSubtitle}>
                                    {menuBreadcrumb.length > 0
                                        ? '상세 항목을 선택해주세요'
                                        : selectedIcon.neuro_trigger}
                                </div>
                            </div>
                        </div>

                        {/* 🎯 성격분석 메뉴: 레이더 차트 (Golden Zone) - 최상위 레벨에서만 표시 */}
                        {selectedIcon.id === 'PERSONALITY_ANALYSIS' && menuBreadcrumb.length === 0 && (
                            <div style={{
                                marginBottom: '20px',
                                padding: '16px',
                                background: 'rgba(16, 185, 129, 0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(16, 185, 129, 0.1)'
                            }}>
                                <StrengthRadarChart
                                    compact={true}
                                    scores={chartScores} // [Security] 서버에서 받은 점수 사용
                                    onTraitClick={handleTraitClick}
                                />
                                <p style={{
                                    textAlign: 'center',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '11px',
                                    marginTop: '8px'
                                }}>
                                    ✨ 당신만의 본질 에너지 지도
                                </p>
                            </div>
                        )}

                        {/* 서브메뉴 리스트 (Dynamic Rendering) */}
                        <div style={{ paddingBottom: '20px' }}>
                            {/* currentMenuDepth를 우선 사용, 없으면(초기) selectedIcon.sub_menus 사용 */}
                            {(currentMenuDepth || selectedIcon.sub_menus).map((subItem) => {
                                const isHovered = hoveredSubItem === subItem.id;

                                // [Dynamic] 텍스트 치환 (사용자 사주 정보 반영)
                                const resolvedLabel = resolveDynamicText(subItem.label, userProfile);
                                const resolvedDesc = resolveDynamicText(subItem.desc, userProfile);

                                return (
                                    <div
                                        key={subItem.id}
                                        style={{
                                            ...styles.subMenuItem,
                                            ...(isHovered ? styles.subMenuItemHover : {}),
                                        }}
                                        onMouseEnter={() => setHoveredSubItem(subItem.id)}
                                        onMouseLeave={() => setHoveredSubItem(null)}
                                        onClick={() => handleSubMenuSelect(subItem)}
                                    >
                                        <span style={styles.subMenuIcon}>
                                            {/* 하위 메뉴가 있으면 폴더 아이콘, 아니면 메인 아이콘/기본값 */}
                                            {subItem.children ? '📂' : (subItem.icon || selectedIcon.icon)}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <div style={styles.subMenuLabel}>{resolvedLabel}</div>
                                            {resolvedDesc && (
                                                <div style={styles.subMenuDesc}>{resolvedDesc}</div>
                                            )}
                                        </div>

                                        {/* 네비게이션 화살표 or 프리미엄 배지 */}
                                        {subItem.children ? (
                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>ᐳ</span>
                                        ) : subItem.isPremium && (
                                            <span style={styles.premiumBadge}>PRO</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* [New] Trait Description Modal (Overlay) */}
                        {/* [New] Trait Bottom Sheet (Premium UX) */}
                        {selectedTrait && (
                            <>
                                {/* Backdrop */}
                                <div style={{
                                    position: 'fixed',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(3px)',
                                    zIndex: 999,
                                    animation: 'fadeIn 0.3s ease-out'
                                }} onClick={() => setSelectedTrait(null)} />

                                {/* Bottom Sheet */}
                                <div style={{
                                    position: 'fixed',
                                    bottom: 0, left: 0, right: 0,
                                    backgroundColor: '#11131a', // 더 깊은 색상
                                    borderTopLeftRadius: '24px',
                                    borderTopRightRadius: '24px',
                                    padding: '28px 24px 40px 24px',
                                    zIndex: 1000,
                                    borderTop: '1px solid rgba(16, 185, 129, 0.4)',
                                    boxShadow: '0 -4px 30px rgba(0,0,0,0.6)',
                                    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    maxHeight: '85vh',
                                    overflowY: 'auto'
                                }}>
                                    {/* Handle Bar */}
                                    <div style={{
                                        width: '40px', height: '4px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '2px',
                                        margin: '-10px auto 20px auto'
                                    }} />

                                    {/* Header: Title & Badge & Close Button */}
                                    <div className="flex justify-between items-start mb-4 relative">
                                        {/* Close Button (X) - 우측 상단 */}
                                        <button
                                            onClick={() => setSelectedTrait(null)}
                                            className="absolute top-0 right-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
                                        >
                                            ✕
                                        </button>

                                        <h3 style={{
                                            color: '#10B981',
                                            fontSize: '20px',
                                            fontWeight: '800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            ✨ {isLoadingTrait ? '로딩 중...' : traitDescription?.title || selectedTrait}
                                        </h3>
                                        {traitDescription?.superpower_badge && (
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: 'bold',
                                                color: '#FCD34D',
                                                backgroundColor: 'rgba(252, 211, 77, 0.1)',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(252, 211, 77, 0.3)'
                                            }}>
                                                {traitDescription.superpower_badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* SubTitle (Emotive) */}
                                    {traitDescription?.subTitle && (
                                        <div style={{
                                            fontSize: '15px',
                                            color: '#fff',
                                            fontWeight: '600',
                                            marginBottom: '12px'
                                        }}>
                                            "{traitDescription.subTitle}"
                                        </div>
                                    )}

                                    {/* Description (Identity) */}
                                    <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                        {isLoadingTrait ? '분석 데이터를 해독하고 있습니다...' : traitDescription?.desc || ''}
                                    </p>

                                    {/* Advice (Psychology) */}
                                    <div style={{
                                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '16px',
                                        borderLeft: '3px solid #10B981'
                                    }}>
                                        <p style={{ fontSize: '13px', color: '#D1FAE5', fontStyle: 'italic' }}>
                                            💡 {isLoadingTrait ? '...' : traitDescription?.advice}
                                        </p>
                                    </div>

                                    {/* Mission Card (Coaching) */}
                                    {traitDescription?.mission && (
                                        <div style={{
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            marginBottom: '24px',
                                            border: '1px dashed rgba(59, 130, 246, 0.3)'
                                        }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Today's Mission</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>
                                                ✅ {traitDescription.mission}
                                            </p>
                                        </div>
                                    )}

                                    {/* Share Button (Marketing) */}
                                    <button
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: '나의 본질 에너지 지도',
                                                    text: `[명심코칭] 나의 슈퍼파워는 ${traitDescription?.superpower_badge}입니다!`,
                                                    url: window.location.href
                                                });
                                            } else {
                                                alert('링크가 복사되었습니다!');
                                            }
                                        }}
                                    >
                                        <span>🚀 나의 슈퍼파워 공유하기</span>
                                    </button>

                                    {/* Chat Button (상담하기) */}
                                    <button
                                        className="w-full py-3 mt-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                                        onClick={() => {
                                            onSelectIntent(
                                                'TRAIT_DEEP_DIVE',
                                                `제 '${selectedTrait}' 특성에 대해 더 자세히 상담하고 싶어요. 어떻게 활용하고 발전시킬 수 있을까요?`
                                            );
                                            setSelectedTrait(null);
                                        }}
                                    >
                                        💬 이 특성으로 상담하기
                                    </button>

                                    {/* Back to Chart Button (다른 특성 보기) */}
                                    <button
                                        className="w-full py-3 mt-2 rounded-xl bg-transparent border border-white/20 hover:bg-white/5 text-gray-400 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                        onClick={() => setSelectedTrait(null)}
                                    >
                                        ← 다른 특성 보기
                                    </button>
                                </div>
                            </>
                        )}


                    </>
                )}
            </div >

            {/* Integral Check-in Modal */}
            {showIntegralCheckin && (
                <MentalPrescriptionModal
                    isOpen={showIntegralCheckin}
                    onClose={() => setShowIntegralCheckin(false)}
                    userId={userProfile?.id || 'guest'}
                    onComplete={(advice, context) => {
                        // Reinforced Connection: Use rich prompt from Modal if available
                        const prompt = context.initialPrompt || `오늘의 통합 체크인 결과입니다:\n\n"${advice}"\n\n이 분석 내용을 바탕으로 오늘 하루를 어떻게 보내면 좋을지, 12운성 에너지와 연관지어 구체적인 가이드를 주세요.`;
                        onSelectIntent('integral_result', prompt);
                    }}
                />
            )}

            {/* [NEW] Saju Analysis Report Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <SajuAnalysisReportModal
                        isOpen={showReportModal}
                        onClose={() => setShowReportModal(false)}
                        userProfile={userProfile}
                    />
                )}
            </AnimatePresence>

            {/* SOS Breathing Guide Modal */}
            {showBreathingGuide && (
                <BreathingGuideModal
                    isOpen={showBreathingGuide}
                    onClose={() => setShowBreathingGuide(false)}
                />
            )}
        </>
    );
}
