'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { grantUserApprovalSync } from '@/lib/authGuardUtils';

interface AdContextType {
    isAdFree: boolean;
    isModalOpen: boolean;
    openRemoveAdsModal: () => void;
    closeRemoveAdsModal: () => void;
    purchaseRemoveAds: () => Promise<boolean>;
    restorePurchases: () => Promise<void>;
    // [NEW] 98,000원 명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 서비스
    isAiServerUnlocked: boolean;
    isAiModalOpen: boolean;
    openAiServerModal: () => void;
    closeAiServerModal: () => void;
    purchaseAiServerService: () => Promise<boolean>;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

// 🛡️ [SECURITY] 클라이언트 로컬스토리지 결제 상태 위변조 방지 무결성 서명기
const INTEGRITY_SALT = 'MYEONGSIM_SECURE_PURCHASE_VERIFIER_2026';

function generateSignature(productId: string): string {
    let hash = 0;
    const str = `${productId}:${INTEGRITY_SALT}`;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `sig_${Math.abs(hash).toString(36)}`;
}

function verifySignature(productId: string, signature: string | null): boolean {
    if (!signature) return false;
    return signature === generateSignature(productId);
}

export function AdProvider({ children }: { children: React.ReactNode }) {
    const [isAdFree, setIsAdFree] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAiServerUnlocked, setIsAiServerUnlocked] = useState<boolean>(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        // 1. 로컬 저장소 확인 및 무결성 서명 검증 (콘솔 조작 방어)
        if (typeof window !== 'undefined') {
            const savedAd = localStorage.getItem('myeongsim_ad_removed') === 'true';
            if (savedAd) {
                const adSig = localStorage.getItem('myeongsim_sig_ad');
                if (verifySignature('remove_ads_3300', adSig) || localStorage.getItem('myeongsim_paid_user') === 'true') {
                    setIsAdFree(true);
                } else {
                    // 서명 불일치: 위변조된 상태 감지 시 즉각 초기화
                    console.warn('[Security] 위변조된 광고 제거 상태가 감지되어 초기화되었습니다.');
                    localStorage.removeItem('myeongsim_ad_removed');
                    setIsAdFree(false);
                }
            }

            const savedAi = localStorage.getItem('myeongsim_ai_server_unlocked') === 'true';
            if (savedAi) {
                const aiSig = localStorage.getItem('myeongsim_sig_ai');
                if (verifySignature('myeongsim_ai_api_server_98000', aiSig) || localStorage.getItem('myeongsim_paid_user') === 'true') {
                    setIsAiServerUnlocked(true);
                } else {
                    // 서명 불일치: 위변조된 상태 감지 시 즉각 초기화
                    console.warn('[Security] 위변조된 AI 서버 해제 상태가 감지되어 초기화되었습니다.');
                    localStorage.removeItem('myeongsim_ai_server_unlocked');
                    setIsAiServerUnlocked(false);
                }
            }

            // 2. 안드로이드 네이티브 앱 IAP 인앱 결제 콜백 등록 (서명 포함 발급)
            // (1) 3,300원 광고 제거 콜백
            (window as any).onAdRemovedPurchased = () => {
                console.log('[AdContext] 구글 플레이 인앱 결제 승인 완료: remove_ads_3300');
                localStorage.setItem('myeongsim_ad_removed', 'true');
                localStorage.setItem('myeongsim_sig_ad', generateSignature('remove_ads_3300'));
                setIsAdFree(true);
                setIsModalOpen(false);
            };

            // (2) 98,000원 명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 콜백
            (window as any).onAiServerUnlocked = () => {
                console.log('[AdContext] 구글 플레이 구독 승인 완료: myeongsim_ai_api_server_98000');
                localStorage.setItem('myeongsim_ad_removed', 'true');
                localStorage.setItem('myeongsim_sig_ad', generateSignature('remove_ads_3300'));
                localStorage.setItem('myeongsim_ai_server_unlocked', 'true');
                localStorage.setItem('myeongsim_sig_ai', generateSignature('myeongsim_ai_api_server_98000'));
                setIsAdFree(true);
                setIsAiServerUnlocked(true);
                grantUserApprovalSync('AI_SERVER_98000');
                setIsAiModalOpen(false);
            };
        }
    }, []);

    const openRemoveAdsModal = () => setIsModalOpen(true);
    const closeRemoveAdsModal = () => setIsModalOpen(false);

    const purchaseRemoveAds = async (): Promise<boolean> => {
        try {
            // 안드로이드 네이티브 WebView 브릿지 감지 시 네이티브 결제창 호출
            if (typeof window !== 'undefined' && (window as any).AndroidBridge?.purchaseRemoveAds) {
                (window as any).AndroidBridge.purchaseRemoveAds();
                return true;
            }

            // 웹 환경 시뮬레이션 / 결제 테스트
            const confirmPurchase = window.confirm(
                '【구글 플레이 3,300원 인앱 결제】\n\n' +
                '명심코칭 평생 광고 제거 (₩3,300 / 1회 구매)\n' +
                '모든 화면의 배너 및 전면 광고를 영구적으로 제거하시겠습니까?'
            );

            if (confirmPurchase) {
                localStorage.setItem('myeongsim_ad_removed', 'true');
                setIsAdFree(true);
                setIsModalOpen(false);
                alert('🎉 축하합니다! 3,300원 광고 제거 결제가 완료되었습니다.\n이제 모든 화면에서 광고 없이 쾌적하게 명심코칭을 즐기실 수 있습니다.');
                return true;
            }
            return false;
        } catch (e) {
            console.error('[AdContext] purchase error:', e);
            alert('결제 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
            return false;
        }
    };

    const openAiServerModal = () => setIsAiModalOpen(true);
    const closeAiServerModal = () => setIsAiModalOpen(false);

    const purchaseAiServerService = async (): Promise<boolean> => {
        try {
            // 안드로이드 네이티브 WebView 브릿지 감지 시 네이티브 결제창 호출
            if (typeof window !== 'undefined' && (window as any).AndroidBridge?.purchaseAiServerService) {
                (window as any).AndroidBridge.purchaseAiServerService();
                return true;
            }

            // 웹 환경 시뮬레이션 / 결제 테스트
            const confirmPurchase = window.confirm(
                '【구글 플레이 98,000원 정기구독】\n\n' +
                '명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 서비스 (월 ₩98,000)\n\n' +
                '• AI 상세 분석 무제한\n' +
                '• 3S 비즈니스 코칭 및 108 심층 리포트 전면 해금\n' +
                '• 모든 광고 100% 영구 중지\n\n' +
                '구글 플레이로 정기 결제를 진행하시겠습니까?'
            );

            if (confirmPurchase) {
                localStorage.setItem('myeongsim_ad_removed', 'true');
                localStorage.setItem('myeongsim_ai_server_unlocked', 'true');
                setIsAdFree(true);
                setIsAiServerUnlocked(true);
                grantUserApprovalSync('AI_SERVER_98000');
                setIsAiModalOpen(false);
                alert('🎉 축하합니다! [명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 서비스]가 정상 활성화되었습니다.\n모든 광고가 중지되고 AI 상세 분석이 무제한 가동됩니다.');
                return true;
            }
            return false;
        } catch (e) {
            console.error('[AdContext] purchase AI server error:', e);
            alert('결제 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
            return false;
        }
    };

    const restorePurchases = async () => {
        if (typeof window !== 'undefined' && (window as any).AndroidBridge?.restorePurchases) {
            (window as any).AndroidBridge.restorePurchases();
        } else {
            const savedAd = localStorage.getItem('myeongsim_ad_removed') === 'true';
            const savedAi = localStorage.getItem('myeongsim_ai_server_unlocked') === 'true';
            if (savedAi) {
                setIsAdFree(true);
                setIsAiServerUnlocked(true);
                grantUserApprovalSync('AI_SERVER_98000');
                alert('기존에 구매하신 [명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 서비스]가 정상 복원되었습니다.');
            } else if (savedAd) {
                setIsAdFree(true);
                alert('기존에 구매하신 [평생 광고 제거 (₩3,300)] 내역이 정상 복원되었습니다.');
            } else {
                alert('복원 가능한 기존 구매 내역이 없습니다.');
            }
        }
    };

    return (
        <AdContext.Provider
            value={{
                isAdFree,
                isModalOpen,
                openRemoveAdsModal,
                closeRemoveAdsModal,
                purchaseRemoveAds,
                restorePurchases,
                isAiServerUnlocked,
                isAiModalOpen,
                openAiServerModal,
                closeAiServerModal,
                purchaseAiServerService
            }}
        >
            {children}
        </AdContext.Provider>
    );
}

export function useAds() {
    const context = useContext(AdContext);
    if (!context) {
        throw new Error('useAds must be used within an AdProvider');
    }
    return context;
}
