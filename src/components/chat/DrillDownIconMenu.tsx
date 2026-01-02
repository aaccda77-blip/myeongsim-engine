/**
 * DrillDownIconMenu.tsx - 3D 아이콘 메뉴 컴포넌트
 * 
 * 특징:
 * - 6개 메인 아이콘 (3D Icons + CSS 3D 효과)
 * - 터치 시 서브메뉴 Bottom Sheet 펼침
 * - 사용자 맞춤 추천 배지
 * - 고급스러운 UI/UX
 */

'use client';

import React, { useState } from 'react';
import {
    ICON_DRILL_DOWN_MAP,
    getMainIconsWithRecommendations,
    generateChatPromptFromIntent,
    MainIcon,
    SubMenuItem
} from '@/modules/DrillDownProtocol';

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
    GENE_KEYS: { main: '성격분석', sub: '숨겨진 천재성 발견' },
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

    // 스타일 주입
    React.useEffect(() => {
        injectStyles();
    }, []);

    // 아이콘 목록 (추천 배지 포함)
    const icons = getMainIconsWithRecommendations(userProfile);

    // 아이콘 클릭 핸들러
    const handleIconClick = (icon: MainIcon) => {
        setSelectedIcon(icon);
    };

    // 서브메뉴 선택 핸들러
    const handleSubMenuSelect = (subItem: SubMenuItem) => {
        const prompt = generateChatPromptFromIntent(subItem.intent, userProfile);
        onSelectIntent(subItem.intent, prompt);
        setSelectedIcon(null);
    };

    // Bottom Sheet 닫기
    const handleClose = () => {
        setSelectedIcon(null);
    };

    return (
        <>
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

                        {/* 서브메뉴 목록 */}
                        {selectedIcon.sub_menus.map((subItem) => {
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
                        })}
                    </>
                )}
            </div>
        </>
    );
}
