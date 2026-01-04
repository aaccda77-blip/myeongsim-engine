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
import dynamic from 'next/dynamic';
import { assembleFullReport } from '@/services/ReportAssembler';
import {
    ICON_DRILL_DOWN_MAP,
    getMainIconsWithRecommendations,
    generateChatPromptFromIntent,
    MainIcon,
    SubMenuItem
} from '@/modules/DrillDownProtocol';
import { DailyBiorhythmWidget } from '@/components/features/DailyBiorhythmWidget';
// [Security] ScoreCalculator와 StaticTextDB는 더 이상 클라이언트에서 import하지 않음
// 대신 /api/secure/* API를 통해 서버에서 데이터를 가져옴

// 차트 컴포넌트 동적 임포트 (SSR 방지)
const GeniusRadarChart = dynamic(() => import('@/components/charts/GeniusRadarChart'), { ssr: false });
const VisualSajuDashboard = dynamic(() => import('@/components/visual/VisualSajuDashboard'), { ssr: false });
const StartupDesignScreen = dynamic(() => import('@/components/startup/StartupDesignScreen'), { ssr: false });

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
        overflow: 'hidden',
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
        flex: '1 1 0',
        minWidth: '0',
        maxWidth: 'calc(100% / 6)',
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
        whiteSpace: 'nowrap' as const,
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
        padding: '20px',
        zIndex: 1000,
        transform: 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        maxHeight: '70vh',
        overflowY: 'auto' as const,
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
        gap: '14px',
        padding: '16px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '10px',
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
    } as React.CSSProperties,
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
    PERSONALITY_ANALYSIS: { main: '성격분석', sub: '숨겨진 천재성 발견' },
    DAILY_MISSION: { main: '오늘운세', sub: '지금 뭘 해야 운이 트일까?' },
    SAJU_ANALYSIS: { main: '사주분석', sub: '운명의 설계도 확인' },
};

// ============== Props ==============
interface DrillDownIconMenuProps {
    userProfile?: any;
    onSelectIntent: (intent: string, prompt: string) => void;
}

// ============== 메인 컴포넌트 ==============
export default function DrillDownIconMenu({
    userProfile,
    onSelectIntent
}: DrillDownIconMenuProps) {
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<MainIcon | null>(null);
    const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // [Pulse 5] Visual Dashboard State
    const [showVisualDashboard, setShowVisualDashboard] = useState(false);

    // [NEW] Startup Design Screen State
    const [showStartupDesign, setShowStartupDesign] = useState(false);

    // [Pulse 6] Collapsible Teaser State
    const [isTeaserCollapsed, setIsTeaserCollapsed] = useState(false);

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

    // [Security] 서버에서 특성 설명 가져오기
    const handleTraitClick = async (trait: string, score: number) => {
        // [Neuroscientist] Physical Reward (Haptic)
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);

        setSelectedTrait(trait);
        setIsLoadingTrait(true);
        setTraitDescription(null);

        try {
            const res = await fetch(`/api/secure/trait-description?trait=${trait}`);
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
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        setSelectedIcon(icon);
    };

    // 서브메뉴 선택 핸들러
    const handleSubMenuSelect = (subItem: SubMenuItem) => {
        // [NEW] Startup Design Screen 열기
        if (subItem.intent === 'startup_design_view') {
            setSelectedIcon(null);
            setShowStartupDesign(true);
            return;
        }

        // [FIX] 사주 원국 분석 시 비주얼 대시보드 열기
        if (subItem.intent === 'saju_basic_analysis') {
            setSelectedIcon(null);
            setShowVisualDashboard(true);
            return;
        }

        // [NEW] Genius Report 페이지로 이동
        if (subItem.intent === 'genius_report_view') {
            setSelectedIcon(null);
            window.location.href = '/report/genius';
            return;
        }

        // [New] 80페이지 분량의 인터랙티브 웹 리포트로 이동
        if (subItem.id === 'FULL_REPORT' || subItem.label.includes('종합 리포트')) {
            alert("✨ [MIND TOTEM] 80페이지 분량의 소울 아카이브를 엽니다.\n(잠시만 기다려주세요...)");

            // 챗봇에게 트리거 전달
            onSelectIntent(subItem.intent, "나의 종합 분석 리포트(80p)를 웹으로 보여줘.");

            // 1초 후 인터랙티브 페이지로 이동
            setTimeout(() => {
                try {
                    // 1. 리포트 데이터 생성
                    const reportData = assembleFullReport(userProfile?.name || '방문자', 'GAP_JA');

                    // 2. 로컬 스토리지에 저장 (페이지 이동 후 사용)
                    // ID는 날짜 기반으로 생성하여 유니크하게 관리
                    const reportId = `rep_${Date.now()}`;
                    localStorage.setItem(`mind_totem_report_${reportId}`, JSON.stringify(reportData));

                    // 3. 페이지 이동
                    window.location.href = `/report/view/${reportId}`;
                } catch (e) {
                    console.error("Report generation failed:", e);
                    alert("리포트 생성 중 오류가 발생했습니다.");
                }
            }, 1000);

            setSelectedIcon(null);
            return;
        }

        const prompt = generateChatPromptFromIntent(subItem.intent, userProfile);
        onSelectIntent(subItem.intent, prompt);
        setSelectedIcon(null);
    };

    // Bottom Sheet 닫기
    const handleClose = () => {
        setSelectedIcon(null);
    };

    // [Pulse 5] Dashboard Chat Intent Handler
    const handleDashboardChatIntent = (intent: string, prompt: string) => {
        setShowVisualDashboard(false);
        onSelectIntent(intent, prompt);
    };

    return (
        <>
            {/* [Pulse 5] Visual Saju Dashboard Overlay */}
            {showVisualDashboard && (
                <VisualSajuDashboard
                    onClose={() => setShowVisualDashboard(false)}
                    onChatIntent={handleDashboardChatIntent}
                    birthDate={birthDate}
                    userProfile={userProfile}
                    onEditBirthdate={() => {
                        // TODO: 생년월일 수정 페이지로 이동
                        window.location.href = '/settings/profile';
                    }}
                />
            )}

            {/* [NEW] 무실패 스타트업 설계 스크린 */}
            {showStartupDesign && (
                <StartupDesignScreen
                    onClose={() => setShowStartupDesign(false)}
                    onChatIntent={onSelectIntent}
                    userProfile={userProfile}
                />
            )}

            {/* [Pulse 6] Collapsible Daily Energy Teaser */}
            {isTeaserCollapsed ? (
                /* Collapsed: Icon only */
                <button
                    onClick={() => setIsTeaserCollapsed(false)}
                    className="fixed bottom-24 right-4 z-50 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-xl animate-pulse border-2 border-white/20"
                    title="오늘의 에너지 보기"
                >
                    🔋
                </button>
            ) : (
                /* Expanded: Full teaser */
                <div className="mb-4 relative">
                    {/* Close (Collapse) Button */}
                    <button
                        onClick={() => setIsTeaserCollapsed(true)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        title="최소화"
                    >
                        ✕
                    </button>

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
            )}

            {/* 메인 아이콘 바 */}
            <div style={styles.container}>
                {icons.map((icon) => {
                    const isHovered = hoveredIcon === icon.id;
                    const friendlyLabel = FRIENDLY_LABELS[icon.id];

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
                            <span style={styles.sheetIcon}>{selectedIcon.icon}</span>
                            <div>
                                <div style={styles.sheetTitle}>
                                    {FRIENDLY_LABELS[selectedIcon.id]?.main || selectedIcon.label}
                                </div>
                                <div style={styles.sheetSubtitle}>
                                    {selectedIcon.neuro_trigger}
                                </div>
                            </div>
                        </div>

                        {/* 🎯 성격분석 메뉴: 레이더 차트 (Golden Zone) */}
                        {selectedIcon.id === 'PERSONALITY_ANALYSIS' && (
                            <div style={{
                                marginBottom: '20px',
                                padding: '16px',
                                background: 'rgba(16, 185, 129, 0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(16, 185, 129, 0.1)'
                            }}>
                                <GeniusRadarChart
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

                                {/* 심사위원 어필용 기술 연동 상태 표시 */}
                                <div style={{
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: '1px dashed rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}>
                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                                        📡 웨어러블 심박 연동:
                                    </span>
                                    <span style={{
                                        fontSize: '10px',
                                        color: '#10B981',
                                        fontWeight: 600,
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        animation: 'pulse 2s infinite'
                                    }}>
                                        연결 대기 중 (v2.0)
                                    </span>
                                </div>
                            </div>
                        )}

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


                        {/* 서브메뉴 목록 */}
                        {
                            selectedIcon.sub_menus.map((subItem) => {
                                const isSubHovered = hoveredSubItem === subItem.id;

                                return (
                                    <div
                                        key={subItem.id}
                                        style={{
                                            ...styles.subMenuItem,
                                            ...(isSubHovered ? styles.subMenuItemHover : {}),
                                        }}
                                        onMouseEnter={() => setHoveredSubItem(subItem.id)}
                                        onMouseLeave={() => setHoveredSubItem(null)}
                                        onClick={() => handleSubMenuSelect(subItem)}
                                    >
                                        <span style={styles.subMenuIcon}>
                                            {subItem.icon || '▸'}
                                        </span>
                                        <div>
                                            <div style={styles.subMenuLabel}>{subItem.label}</div>
                                            {subItem.desc && (
                                                <div style={styles.subMenuDesc}>{subItem.desc}</div>
                                            )}
                                        </div>
                                        {subItem.isPremium && (
                                            <span style={styles.premiumBadge}>PREMIUM</span>
                                        )}
                                    </div>
                                );
                            })
                        }
                    </>
                )}
            </div >
        </>
    );
}
