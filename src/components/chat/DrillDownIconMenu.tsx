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
import { Music, X, Globe, Cpu } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { TalentAnalysisModule } from '@/modules/TalentAnalysisModule';
import TalentReportCard from '@/components/chat/TalentReportCard';
import HealingMusicPlayerModal from '@/components/chat/HealingMusicPlayerModal'; // [NEW] Refactored Component
import { assembleFullReport } from '@/services/ReportAssembler';
import { useReportStore } from '@/store/useReportStore'; // [New] Import for navigation
import { useSubscription } from '@/hooks/useSubscription'; // [NEW] 이용권 상태 확인
import { useLanguage } from '@/contexts/LanguageContext'; // [Multi-Language]
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
// [NEW] 사회적기여 — 명심 프리미엄 통합 코칭 리포트
const SovereignCoachingReport = dynamic(() => import('@/components/coaching/SovereignCoachingReport'), { ssr: false });
const MirrorRoomModal = dynamic(() => import('@/components/coaching/MirrorRoomModal'), { ssr: false });
const OhaengContributionModal = dynamic(() => import('@/components/coaching/OhaengContributionModal'), { ssr: false }); // [NEW] 오행 상생공헌 모달 임포트
const MptiTestModal = dynamic(() => import('@/components/coaching/MptiTestModal'), { ssr: false }); // [NEW] MPTI 성향 검사 모달
const MptiPlannerModal = dynamic(() => import('@/components/coaching/MptiPlannerModal'), { ssr: false }); // [NEW] MPTI 성향 플래너 모달
// [NEW] 108 자각 백서 프리미엄 독립 모달 임포트
const Healing108CoachingReport = dynamic(() => import('@/components/coaching/Healing108CoachingReport'), { ssr: false });
const Sovereign3SProtocolModal = dynamic(() => import('@/components/coaching/Sovereign3SProtocolModal'), { ssr: false });
const ZeroPoint3SMatrixModal = dynamic(() => import('@/components/coaching/ZeroPoint3SMatrixModal'), { ssr: false });
const MindResetModal = dynamic(() => import('@/components/coaching/MindResetModal'), { ssr: false });
const MyeongsimOSDashboard = dynamic(() => import('@/components/os/MyeongsimOSDashboard'), { ssr: false });
const DecodeReportModal = dynamic(() => import('@/components/coaching/DecodeReportModal'), { ssr: false });
const PremiumReportModal = dynamic(() => import('@/components/coaching/PremiumReportModal'), { ssr: false });
const MindSpaceTrainingModal = dynamic(() => import('@/components/coaching/MindSpaceTrainingModal'), { ssr: false });
const MyeongsimCoachingDashboard = dynamic(() => import('@/components/coaching/MyeongsimCoachingDashboard'), { ssr: false });
const GeniusFullReportModal = dynamic(() => import('@/components/coaching/GeniusFullReportModal'), { ssr: false });
const Myeongsim64KeysModal = dynamic(() => import('@/components/coaching/Myeongsim64KeysModal'), { ssr: false });
const MyeongsimGeniusReportModal = dynamic(() => import('@/components/coaching/MyeongsimGeniusReportModal'), { ssr: false });
const MyeongsimOracleCardModal = dynamic(() => import('@/components/coaching/MyeongsimOracleCardModal'), { ssr: false });
const DarkCodeCompassionTransformerModal = dynamic(() => import('@/components/coaching/DarkCodeCompassionTransformerModal'), { ssr: false });




// ============== 스타일 ==============
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '12px 8px',
        background: 'linear-gradient(180deg, rgba(15,15,30,0.95) 0%, rgba(25,25,50,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.3)',
        marginBottom: '12px',
        gap: '6px',
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
        padding: '6px 6px',
        borderRadius: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative' as const,
        flex: '0 0 auto', // [Fix] 찌그러짐 방지
        minWidth: '82px', // [Fix] 겹침 방지: 최소 너비 최적화
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
    WEALTH: { main: '번영코드', sub: '부의 에너지 흐름 분석' },
    RELATIONSHIP: { main: '관계에너지', sub: '관계 패턴 분석 및 코칭' },
    CAREER: { main: '커리어코드', sub: '나의 적성과 재능 리포트' },
    PERSONALITY_ANALYSIS: { main: '성격분석', sub: '강점/재능(인적자원)리포트' },
    DAILY_MISSION: { main: '오늘컨디션', sub: '오늘의 마인드 에너지 체크' },
    SAJU_ANALYSIS: { main: '기질분석', sub: '기질 설계도 확인' },
    BIO_SYNC: { main: '생체연동', sub: '실시간 기질 동기화' },
    STRESS_RELIEF: { main: '명심힐링', sub: '지친 마음 쉬어가기' },
    PATH_108: { main: '108자각', sub: '내면의 빛을 찾는 여정' }, // [New] Added label
};

// ============== Helper: Dynamic Text Resolution ==============
const resolveDynamicText = (text: string | undefined, userProfile: any, t: any): string => {
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

        // 0. Try direct string (e.g. '甲子')
        if (typeof obj === 'string') {
            if (part === 'stem') return obj.charAt(0);
            if (part === 'branch' && obj.length > 1) return obj.charAt(1);
            return obj.charAt(0);
        }

        // [Safety Fix] Ensure we extract a string, never return an object
        // 1. Try Legacy format (obj.stem / obj.branch might be strings)
        if (part === 'stem' && typeof obj.stem === 'string') return obj.stem;
        if (part === 'branch' && typeof obj.branch === 'string') return obj.branch;

        // 2. Try Object format (SajuPillar)
        // If obj.gan is an object { char, color, label }, take .char
        if (part === 'stem') {
            if (typeof obj.gan === 'string') return obj.gan;
            if (typeof obj.ganKor === 'string') return obj.ganKor;
            if (obj.gan && typeof obj.gan === 'object' && obj.gan.char) return obj.gan.char;
        }
        if (part === 'branch') {
            if (typeof obj.ji === 'string') return obj.ji;
            if (typeof obj.jiKor === 'string') return obj.jiKor;
            if (obj.ji && typeof obj.ji === 'object' && obj.ji.char) return obj.ji.char;
        }

        return '?';
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
    resolved = resolved.replace('{{WEAK_ELEMENT}}', t('common.weak_element') || '부족한 기운');
    resolved = resolved.replace('{{GONGMANG}}', t('common.gongmang') || '공망');
    resolved = resolved.replace('{{CURRENT_DAEWOON}}', t('common.current_daewoon') || '현재 라이프 웨이브');
    resolved = resolved.replace('{{CURRENT_YEAR_GANJI}}', t('common.current_year_ganji') || '을사(乙巳)'); // 2025 Fixed

    return resolved;
};

// ============== Props ==============
interface DrillDownIconMenuProps {
    userProfile?: any;
    onSelectIntent: (intent: string, prompt: string) => void;
    hideTodayEnergy?: boolean; // [NEW] 챗봇 상담 중 Today Energy 숨기기
    initialSectionId?: string; // [New] 딥 링크용 초기 섹션 ID
    onCloseChat?: () => void; // [NEW] 챗 창 닫기 콜백
}

// ============== 메인 컴포넌트 ==============
export default function DrillDownIconMenu({
    userProfile,
    onSelectIntent,
    hideTodayEnergy = false,
    initialSectionId,
    onCloseChat
}: DrillDownIconMenuProps) {
    const { language, setLanguage, t } = useLanguage();
    const router = useRouter();
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
    const [showAwakeningChat, setShowAwakeningChat] = useState(false); // [Fix] Missing State

    const [showReportModal, setShowReportModal] = useState(false); // [New] Report Modal State
    const [showSovereignReport, setShowSovereignReport] = useState(false); // [NEW] 사회적기여 리포트
    const [showOhaengContribution, setShowOhaengContribution] = useState(false); // [NEW] 오행 상생공헌 모달 상태
    const [showMptiTest, setShowMptiTest] = useState(false); // [NEW] MPTI 성향 검사 모달
    const [showMptiPlanner, setShowMptiPlanner] = useState(false); // [NEW] MPTI 플래너 모달
    const [mptiResultType, setMptiResultType] = useState<'wood' | 'fire' | 'earth' | 'metal' | 'water'>('wood');
    const [mptiAnswers, setMptiAnswers] = useState<Record<string, number>>({});
    const [mptiBirthOhaeng, setMptiBirthOhaeng] = useState<Record<string, number>>({});
    const [showHealing108Report, setShowHealing108Report] = useState(false); // [NEW] 108 자각 증명서
    const [showHealing108NewReport, setShowHealing108NewReport] = useState(false); // [NEW] 108 자각 new 대시보드
    const [showMyeongsimOS, setShowMyeongsimOS] = useState(false); // [NEW] 명심 OS 대시보드
    const [showMirrorRoom, setShowMirrorRoom] = useState(false); // [NEW] 거울의방 모달 상태
    const [showSovereign3S, setShowSovereign3S] = useState(false);
    const [showZeroPointMatrix, setShowZeroPointMatrix] = useState(false); // [NEW] 소버린 3S 셋업프로토콜
    const [showMindReset, setShowMindReset] = useState(false); // [NEW] 5D 마음 리셋 디버깅
    const [showDecodeReport, setShowDecodeReport] = useState(false);
    const [showPremiumReport, setShowPremiumReport] = useState(false);
    const [showMindSpaceTraining, setShowMindSpaceTraining] = useState(false); // [NEW] 마음 공간 넓히기 훈련 모달
    const [showGeniusReport, setShowGeniusReport] = useState(false);
    const [show64KeysModal, setShow64KeysModal] = useState(false);
    const [showMyeongsimGenius, setShowMyeongsimGenius] = useState(false);
    const [showMyeongsimOracle, setShowMyeongsimOracle] = useState(false);
    const [showDarkCodeTransformer, setShowDarkCodeTransformer] = useState(false);
    const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'psych' | 'business' | 'bio' | 'ai'>('all');

    const { reportData } = useReportStore();

    // [New] 딥 링크 연동을 위해 initialSectionId가 존재하면 108 자각 new 대시보드를 바로 활성화합니다.
    // useEffect(() => {
    //     if (initialSectionId) {
    //         setShowHealing108NewReport(true);
    //     }
    // }, [initialSectionId]);

    const handleDecodeClick = () => {
        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
        if (!hasBirthDate) {
            alert('기질 분석을 위해 생년월일을 먼저 입력해주세요.');
            useReportStore.getState().setStep(1); // 메인 기질데이터 입력 페이지(Step 1)로 이동
            return;
        }
        setShowDecodeReport(true);
    };

    const handlePremiumReportClick = () => {
        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
        if (!hasBirthDate) {
            alert('심층 리포트를 생성하기 위해 생년월일을 먼저 입력해주세요.');
            useReportStore.getState().setStep(1); // 온보딩 Step 1 이동
            return;
        }
        setShowPremiumReport(true);
    };

    const handleMindSpaceTrainingClick = () => {
        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
        if (!hasBirthDate) {
            alert('마음 공간 넓히기 훈련을 시작하기 위해 생년월일을 먼저 입력해주세요.');
            useReportStore.getState().setStep(1); // 온보딩 Step 1 이동
            return;
        }
        setShowMindSpaceTraining(true);
    };





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
            const expiredMsg = t('chat.trial_ended') || '무료 체험이 종료되었습니다.';
            alert(expiredMsg.replace('🎁 ', ''));
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
            // [Fix] Store translated label in breadcrumb to prevent "weird" UI
            const translatedLabel = t(`menu.${subItem.intent}`) || t(`menu.${subItem.id}`) || subItem.label;
            const resolvedLabel = resolveDynamicText(translatedLabel, userProfile, t);

            setMenuBreadcrumb(prev => [...prev, { id: subItem.id, label: resolvedLabel }]);
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


        // [NEW] 108 자각 프로토콜 (Awakening Chat)
        if (subItem.intent === 'ms_quantum_108' || subItem.intent === 'saju_108_awakening') {
            setSelectedIcon(null);
            setShowAwakeningChat(true);
            return;
        }




        // [NEW] 80페이지 분량의 소울 아카이브 페이지로 이동
        if (subItem.id === 'FULL_REPORT' || subItem.intent === 'FULL_REPORT_ARCHIVE') {
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

            {/* [NEW] Genius Full Report Modal (8 Pages Replication) */}
            <GeniusFullReportModal
                isOpen={showGeniusReport}
                onClose={() => setShowGeniusReport(false)}
                userProfile={userProfile || reportData}
            />

            {/* [NEW] Myeongsim 64Keys Report Modal (34 Pages Replication) */}
            <DarkCodeCompassionTransformerModal
                isOpen={showDarkCodeTransformer}
                onClose={() => setShowDarkCodeTransformer(false)}
                userName={userProfile?.userName || reportData?.userName}
            />

            <Myeongsim64KeysModal
                isOpen={show64KeysModal}
                onClose={() => setShow64KeysModal(false)}
                userProfile={userProfile || reportData}
            />

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

                            <TalentReportCard data={talentReportData} saju={reportData?.saju || userProfile?.saju || {}} />

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                메타코드 기반 핵심 재능 분석
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

            {/* [NEW] 4대 전문 카테고리 (IA) 탭 바 */}
            <div className="flex items-center gap-1.5 mb-2 px-3 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
                {[
                    { id: 'all', label: '전체', icon: '✨' },
                    { id: 'psych', label: '명심 자각 & 심리', icon: '🧠' },
                    { id: 'business', label: '비즈니스 & 자본', icon: '💼' },
                    { id: 'bio', label: '바이오 & 바이오하킹', icon: '🩺' },
                    { id: 'ai', label: 'AI & 의식 연구', icon: '🔬' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveCategoryTab(tab.id as any)}
                        className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 border cursor-pointer ${
                            activeCategoryTab === tab.id
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)] scale-105 font-extrabold'
                                : 'bg-slate-900/60 text-gray-400 border-white/10 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 메인 아이콘 바 */}
            <div style={styles.container}>
                {/* [Language] Toggle Button */}
                <button
                    style={styles.iconButton}
                    onClick={() => {
                        const langs = ['kr', 'en', 'jp', 'cn'] as const;
                        const idx = langs.indexOf(language as any);
                        const next = langs[(idx + 1) % langs.length];
                        setLanguage(next);
                    }}
                >
                    <div style={{
                        ...styles.iconWrapper,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <Globe size={20} color="#fff" />
                    </div>
                    <span style={styles.iconLabel}>{language.toUpperCase()}</span>
                </button>

                {/* [NEW] My Report Icon (Fixed First Position) */}
                <button
                    style={styles.iconButton}
                    onClick={() => setShowReportModal(true)}
                >
                    <div style={{
                        ...styles.iconWrapper,
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(180, 83, 9, 0.2))',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <span style={{ fontSize: '20px' }}>📋</span>
                    </div>
                    <div>
                        <div style={{ ...styles.iconLabel, color: '#FCD34D' }}>{t('menu.my_report')}</div>
                        <div style={styles.neuroTrigger}>{t('menu.diagnosis_summary')}</div>
                    </div>
                </button>

                {/* [NEW] 제로포인트 3S 융합 진단 메뉴 (나의 리포트 바로 옆) */}
                <button
                    style={styles.iconButton}
                    onClick={() => setShowZeroPointMatrix(true)}
                >
                    <div style={{
                        ...styles.iconWrapper,
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.2))',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <span style={{ fontSize: '20px' }}>🌌</span>
                    </div>
                    <div>
                        <div style={{ ...styles.iconLabel, color: '#34d399', fontWeight: 'bold' }}>제로포인트 3S</div>
                        <div style={styles.neuroTrigger}>3대 코드 융합 진단</div>
                    </div>
                </button>

                {/* [NEW] 명심 마스터 코어 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => { window.location.href = '/master-core'; }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.25)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>💎</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#c084fc', fontWeight: 'bold' }}>내면치유 코어</div>
                            <div style={styles.neuroTrigger}>5대 내면치유 솔루션</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 오늘의 명심 카드 (Myeongsim Oracle) 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('오늘의 명심 카드를 뽑기 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        setShowMyeongsimOracle(true);
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(244, 114, 182, 0.2))', border: '1px solid rgba(167, 139, 250, 0.4)', boxShadow: '0 4px 15px rgba(167, 139, 250, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🃏</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#a78bfa', fontWeight: 'bold' }}>오늘의 카드</div>
                            <div style={styles.neuroTrigger}>3D 데일리 드로우</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 나의 본재 자각 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('본재 기질 분석을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        setShowMyeongsimGenius(true);
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(139, 92, 246, 0.2))', border: '1px solid rgba(236, 72, 153, 0.4)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>💡</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#f472b6', fontWeight: 'bold' }}>본재(本財) 해독</div>
                            <div style={styles.neuroTrigger}>나의 본빛 기질 자각</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 천명 지도 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('천명 지도 분석을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        setShow64KeysModal(true);
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(147, 51, 234, 0.2))', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🗺️</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#fbbf24', fontWeight: 'bold' }}>천명 지도</div>
                            <div style={styles.neuroTrigger}>삶의 궤적과 운명 분석</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 천부 성정 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('천부 성정 분석을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        setShowGeniusReport(true);
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(236, 72, 153, 0.2))', border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🧬</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#818cf8', fontWeight: 'bold' }}>천부 성정</div>
                            <div style={styles.neuroTrigger}>8페이지 전면 해독</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 격국 연금술 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'business') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('격국 분석 및 균형 분석을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        router.push('/master-core/alignment');
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(59, 130, 246, 0.2))', border: '1px solid rgba(167, 139, 250, 0.4)', boxShadow: '0 4px 15px rgba(167, 139, 250, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>☯️</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#a78bfa' }}>격국 연금술</div>
                            <div style={styles.neuroTrigger}>삶의 격(格)과 에너지 균형</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 다크디코딩 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'ai') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('다크 감정 분석 및 디코딩을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        router.push('/master-core/dark-decoding');
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(99, 102, 241, 0.2))', border: '1px solid rgba(239, 68, 68, 0.4)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>⚡</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#ef4444' }}>다크 디코딩</div>
                            <div style={styles.neuroTrigger}>부정 감정의 에너지 전환</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 마인드 디버거 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'ai') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('의식 오류 분석 및 디버깅을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        router.push('/master-core/dark-code-debugger');
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(99, 102, 241, 0.2))', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>💻</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#34d399' }}>마인드 디버거</div>
                            <div style={styles.neuroTrigger}>의식 오류 및 시간 재배선</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 마스터 리포트 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => setShowSovereignReport(true)}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 4px 15px rgba(139,92,246,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🔬</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#a78bfa' }}>마스터 리포트</div>
                            <div style={styles.neuroTrigger}>통합 심층 코칭 리포트</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 거울의방 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('자각 코칭을 시작하기 위해 생년월일을 먼저 입력해주세요.'); useReportStore.getState().setStep(1); return; }
                        setShowMirrorRoom(true);
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(124, 58, 237, 0.2))', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🪞</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#c084fc' }}>거울의 방</div>
                            <div style={styles.neuroTrigger}>참나 자각과 의식 탐구</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 경계 너머 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasBirthDate = userProfile?.birthDate || reportData?.birthDate || (reportData as any)?.birthDateString;
                        if (!hasBirthDate) { alert('의식 자각 코칭을 위해 생년월일을 먼저 등록해주세요.'); useReportStore.getState().setStep(1); return; }
                        router.push('/master-core/step-back');
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(236, 72, 153, 0.4)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>👁️</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#f472b6' }}>경계 너머</div>
                            <div style={styles.neuroTrigger}>안팎 조망과 주객 해체</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 4대 기질 코어 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => router.push('/master-core')}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 4px 15px rgba(6,182,212,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🔮</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#22d3ee' }}>4대 기질 코어</div>
                            <div style={styles.neuroTrigger}>명심 4대 핵심 기질</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 오행 상생공헌 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'business') && (
                    <button style={styles.iconButton} onClick={() => {
                        const hasSaju = !!(reportData && reportData.saju);
                        if (!hasSaju) { alert("먼저 상단의 '만세력(My Report)' 또는 사주 정보를 입력해 주시면, 당신의 고유한 오행 에너지를 바탕으로 한 맞춤형 상생 공헌 리포트가 활성화됩니다! ✨"); return; }
                        setShowOhaengContribution(true);
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(13,148,136,0.2))', border: '1px solid rgba(20,184,166,0.4)', boxShadow: '0 4px 15px rgba(20,184,166,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🌌</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#2dd4bf' }}>오행 상생공헌</div>
                            <div style={styles.neuroTrigger}>상생 공헌 주파수</div>
                        </div>
                    </button>
                )}

                {/* [NEW] FPTI 성향해독 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => setShowMptiTest(true)}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.2))', border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 4px 15px rgba(16,185,129,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🧭</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#34d399' }}>FPTI 성향해독</div>
                            <div style={styles.neuroTrigger}>운명 성향 코드 해독</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 에고싱크 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'bio') && (
                    <button style={styles.iconButton} onClick={() => {
                        const isApplied = useReportStore.getState().isPlannerApplied;
                        if (!isApplied) { alert("먼저 'FPTI 성향해독🧭'을 진행하여 타고난 성향 코드를 해독하십시오. 검사가 완료되면 에고싱크 플래너가 활성화됩니다!"); setShowMptiTest(true); } else { useReportStore.getState().setPlannerOpen(true); }
                    }}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.2))', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 4px 15px rgba(139,92,246,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🌀</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#a78bfa' }}>에고싱크</div>
                            <div style={styles.neuroTrigger}>맞춤 코칭 플래너</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 소버린 3S 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'bio') && (
                    <button style={styles.iconButton} onClick={() => setShowSovereign3S(true)}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 4px 15px rgba(6,182,212,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🧬</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#22d3ee' }}>소버린 3S</div>
                            <div style={styles.neuroTrigger}>마인드 웰니스 복원 스캔</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 마음 리셋 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => setShowMindReset(true)}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.2))', border: '1px solid rgba(251,191,36,0.4)', boxShadow: '0 4px 15px rgba(251,191,36,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>✨</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#fbbf24' }}>마음 리셋</div>
                            <div style={styles.neuroTrigger}>5D 매트릭스 디버깅</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 프리미엄 심층 리포트 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'business') && (
                    <button style={styles.iconButton} onClick={handlePremiumReportClick}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.2))', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>💎</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#fbbf24' }}>심층 리포트</div>
                            <div style={styles.neuroTrigger}>5파트 통합 가이드</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 마음 공간 넓히기 훈련 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={handleMindSpaceTrainingClick}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(124, 58, 237, 0.2))', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🌌</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#c084fc' }}>마음 공간 넓히기</div>
                            <div style={styles.neuroTrigger}>3단계 메타코드 융합</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 핵심 자각 퀘스트 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => setShowHealing108Report(true)}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(219,39,119,0.2))', border: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 4px 15px rgba(236,72,153,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🧠</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#f472b6' }}>핵심 자각 퀘스트</div>
                            <div style={styles.neuroTrigger}>힐링 자각 백서</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 핵심 자각 대시보드 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'psych') && (
                    <button style={styles.iconButton} onClick={() => setShowHealing108NewReport(true)}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))', border: '1px solid rgba(245,158,11,0.4)', boxShadow: '0 4px 15px rgba(245,158,11,0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>📊</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#fbbf24' }}>핵심 자각 대시보드</div>
                            <div style={styles.neuroTrigger}>실시간 대시보드</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 디코드 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'ai') && (
                    <button style={styles.iconButton} onClick={handleDecodeClick}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(79, 70, 229, 0.2))', border: '1px solid rgba(147, 51, 234, 0.4)', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>🌌</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#c084fc' }}>디코드</div>
                            <div style={styles.neuroTrigger}>심층 무의식 보고서</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 제로 캡슐 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'bio') && (
                    <button style={styles.iconButton} onClick={() => router.push('/zero-capsule')}>
                        <div style={{ ...styles.iconWrapper, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(79, 70, 229, 0.2))', border: '1px solid rgba(59, 130, 246, 0.4)', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)', position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '20px' }}>💊</span>
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#60a5fa' }}>제로 캡슐</div>
                            <div style={styles.neuroTrigger}>오늘의 디지털 알약</div>
                        </div>
                    </button>
                )}

                {/* [NEW] 명심 OS 코칭 메뉴 */}
                {(activeCategoryTab === 'all' || activeCategoryTab === 'ai') && (
                    <button style={styles.iconButton} onClick={() => setShowMyeongsimOS(true)}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)', boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)', marginBottom: '8px', position: 'relative', zIndex: 10 }}>
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div style={{ ...styles.iconLabel, color: '#4ade80' }}>명심 OS</div>
                            <div style={styles.neuroTrigger}>시스템 디버깅</div>
                        </div>
                    </button>
                )}

                {icons.filter(icon => {
                    if (activeCategoryTab === 'all') return true;
                    switch (icon.id) {
                        case 'WORLD_WEALTH': case 'WEALTH': case 'STARTUP': case 'CAREER':
                            return activeCategoryTab === 'business';
                        case 'BIO_SYNC': case 'BIO_CARE': case 'STRESS_RELIEF': case 'HEALTH_QA': case 'DAILY_MISSION':
                            return activeCategoryTab === 'bio';
                        case 'X_LAB': case 'NEURAL_ENGINEERING': case 'QUANTUM_AWAKENING': case 'STRATEGY_LAB':
                            return activeCategoryTab === 'ai';
                        default:
                            return activeCategoryTab === 'psych';
                    }
                }).map((icon) => {
                    const isHovered = hoveredIcon === icon.id;
                    const translatedLabel = t(`menu.${icon.id.toLowerCase()}`) || icon.label;
                    const friendlyLabel = {
                        main: translatedLabel,
                        sub: icon.neuro_trigger // Or translate trigger if needed
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
                                        : (t(`menu.${selectedIcon.id.toLowerCase()}`) || FRIENDLY_LABELS[selectedIcon.id]?.main || selectedIcon.label)}
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

                                // [Dynamic] 텍스트 치환 (사용자 사주 정보 반영) -> [Multi-Language] First translate, then resolve
                                // [Robust Fix] Try Intent first, then ID, then Hardcoded Label
                                const baseLabel = t(`menu.${subItem.intent}`) || t(`menu.${subItem.id}`) || subItem.label;
                                const baseDesc = subItem.desc
                                    ? (t(`menu.${subItem.intent}_desc`) || t(`menu.${subItem.id}_desc`) || subItem.desc)
                                    : '';

                                const resolvedLabel = resolveDynamicText(baseLabel, userProfile, t);
                                const resolvedDesc = resolveDynamicText(baseDesc, userProfile, t);

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
                                            <div style={styles.subMenuDesc}>{resolvedDesc}</div>
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

            {/* [NEW] 사회적기여 — 명심 프리미엄 통합 코칭 리포트 모달 */}
            <SovereignCoachingReport
                isOpen={showSovereignReport}
                onClose={() => setShowSovereignReport(false)}
                userProfile={userProfile}
            />

            {/* [NEW] 거울의방 iframe 모달 */}
            <MirrorRoomModal
                isOpen={showMirrorRoom}
                onClose={() => setShowMirrorRoom(false)}
            />

            {/* [NEW] 오행 상생공헌 모달 */}
            <OhaengContributionModal
                isOpen={showOhaengContribution}
                onClose={() => setShowOhaengContribution(false)}
            />

            {/* [NEW] MPTI 성향 검사 모달 -> FPTI 성향해독 모달 */}
            <MptiTestModal
                isOpen={showMptiTest}
                onClose={() => setShowMptiTest(false)}
                onApplyPlanner={(resType, ans, birth, avatarCode) => {
                    useReportStore.getState().setFptiData(resType, ans, birth, avatarCode);
                    useReportStore.getState().setPlannerOpen(true);
                    setShowMptiTest(false);
                }}
                userProfile={userProfile}
            />

            {/* [NEW] 108 자각 백서 모달 */}
            <Healing108CoachingReport
                isOpen={showHealing108Report}
                onClose={() => setShowHealing108Report(false)}
                userProfile={userProfile}
            />

            {/* [NEW] 108 자각 new 프리미엄 대시보드 모달 */}
            <MyeongsimCoachingDashboard
                isOpen={showHealing108NewReport}
                onClose={() => setShowHealing108NewReport(false)}
                userProfile={userProfile}
                initialSectionId={initialSectionId}
            />

            {/* [NEW] 명심 OS 대시보드 */}
            {showMyeongsimOS && (
                <MyeongsimOSDashboard 
                    isModal={true}
                    onClose={() => setShowMyeongsimOS(false)}
                    onChatIntent={(intent, prompt) => {
                        setShowMyeongsimOS(false);
                        onSelectIntent(intent, prompt);
                    }}
                />
            )}

            {/* SOS Breathing Guide Modal */}
            {showBreathingGuide && (
                <BreathingGuideModal
                    isOpen={showBreathingGuide}
                    onClose={() => setShowBreathingGuide(false)}
                />
            )}

            {/* [NEW] 108 Awakening Chat Modal */}
            <AnimatePresence>
                {showAwakeningChat && (
                    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg h-[80vh] min-h-[500px] max-h-[800px] shadow-2xl relative"
                        >
                            <AwakeningChat
                                mode="108" // [NEW] 108 Protocol Mode
                                onClose={() => setShowAwakeningChat(false)}
                                onComplete={(prompt) => {
                                    setShowAwakeningChat(false);
                                    onSelectIntent('saju_108_awakening_complete', prompt);
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>



            {/* [NEW] 제로포인트 3S 융합 진단 모달 */}
            <ZeroPoint3SMatrixModal isOpen={showZeroPointMatrix} onClose={() => setShowZeroPointMatrix(false)} />

            {/* [NEW] 소버린 3S 프로토콜 모달 */}
            <Sovereign3SProtocolModal
                isOpen={showSovereign3S}
                onClose={() => setShowSovereign3S(false)}
                userProfile={userProfile}
            />

            {/* [NEW] 마음 리셋 모달 */}
            <MindResetModal
                isOpen={showMindReset}
                onClose={() => setShowMindReset(false)}
            />

            {/* [NEW] 디코드 심층 무의식 보고서 모달 */}
            <DecodeReportModal
                isOpen={showDecodeReport}
                onClose={() => setShowDecodeReport(false)}
                userProfile={userProfile}
            />

            {/* [NEW] 프리미엄 5파트 통합 심층 리포트 모달 */}
            <PremiumReportModal
                isOpen={showPremiumReport}
                onClose={() => setShowPremiumReport(false)}
                userProfile={userProfile}
            />

            {/* [NEW] 마음 공간 넓히기 훈련 모달 */}
            <MindSpaceTrainingModal
                isOpen={showMindSpaceTraining}
                onClose={() => setShowMindSpaceTraining(false)}
                userProfile={userProfile}
            />

            {/* [NEW] Myeongsim Genius Report Modal (Compact Replication) */}
            <MyeongsimGeniusReportModal
                isOpen={showMyeongsimGenius}
                onClose={() => setShowMyeongsimGenius(false)}
                userProfile={userProfile || reportData}
            />

            {/* [NEW] 오늘의 명심 오라클 카드 모달 */}
            <MyeongsimOracleCardModal
                isOpen={showMyeongsimOracle}
                onClose={() => setShowMyeongsimOracle(false)}
                userName={userProfile?.name || reportData?.userName || '명심가'}
                sajuText={
                    userProfile?.saju
                    ? `${userProfile.saju.dayPillar?.stem || ''}${userProfile.saju.dayPillar?.branch || ''} 일주 중심`
                    : (reportData as any)?.saju?.dayMaster
                    ? `${(reportData as any).saju.dayMaster} 일주 중심`
                    : '사주 주파수 로딩 완료'
                }
                gongWang={userProfile?.saju?.gongWang || (reportData as any)?.saju?.gongWang || []}
            />
        </>
    );
}
