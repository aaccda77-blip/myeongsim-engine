'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdContextType {
    isAdFree: boolean;
    isModalOpen: boolean;
    openRemoveAdsModal: () => void;
    closeRemoveAdsModal: () => void;
    purchaseRemoveAds: () => Promise<boolean>;
    restorePurchases: () => Promise<void>;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: React.ReactNode }) {
    const [isAdFree, setIsAdFree] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        // 1. 로컬 저장소 확인 (3,300원 광고 제거 구매 여부)
        const saved = typeof window !== 'undefined' && localStorage.getItem('myeongsim_ad_removed') === 'true';
        if (saved) {
            setIsAdFree(true);
        }

        // 2. 안드로이드 네이티브 앱 IAP 인앱 결제 콜백 등록
        if (typeof window !== 'undefined') {
            (window as any).onAdRemovedPurchased = () => {
                console.log('[AdContext] 구글 플레이 인앱 결제 승인 완료: remove_ads_3300');
                localStorage.setItem('myeongsim_ad_removed', 'true');
                setIsAdFree(true);
                setIsModalOpen(false);
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

    const restorePurchases = async () => {
        if (typeof window !== 'undefined' && (window as any).AndroidBridge?.restorePurchases) {
            (window as any).AndroidBridge.restorePurchases();
        } else {
            const saved = localStorage.getItem('myeongsim_ad_removed') === 'true';
            if (saved) {
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
                restorePurchases
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
