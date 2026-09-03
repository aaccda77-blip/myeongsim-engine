'use client';

import { useState, useEffect, useCallback } from 'react';

export type ViewMode = 'classic' | 'simple';

const STORAGE_KEY = 'im-report:view-mode';

export function useViewMode() {
    // 기본값은 항상 'classic'으로 안전하게 유지 (기존 사용자 경험 100% 보존)
    const [viewMode, setViewModeState] = useState<ViewMode>('classic');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved === 'simple' || saved === 'classic') {
                    setViewModeState(saved);
                }
            }
        } catch (e) {
            console.warn('[useViewMode] localStorage read warning:', e);
        }
    }, []);

    const setViewMode = useCallback((mode: ViewMode) => {
        setViewModeState(mode);
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, mode);
                window.dispatchEvent(new Event('im-report:view-mode-change'));
            }
        } catch (e) {
            console.warn('[useViewMode] localStorage write warning:', e);
        }
    }, []);

    const toggleViewMode = useCallback(() => {
        setViewMode(viewMode === 'classic' ? 'simple' : 'classic');
    }, [viewMode, setViewMode]);

    useEffect(() => {
        const handleSync = () => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved === 'simple' || saved === 'classic') {
                    setViewModeState(saved);
                }
            } catch (e) {}
        };
        window.addEventListener('im-report:view-mode-change', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('im-report:view-mode-change', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    return {
        viewMode,
        isSimple: viewMode === 'simple',
        isClassic: viewMode === 'classic',
        setViewMode,
        toggleViewMode,
        isMounted
    };
}
