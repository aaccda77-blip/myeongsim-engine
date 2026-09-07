'use client';

import { useEffect } from 'react';

/**
 * 실서버 신규 배포 시 구버전 번들과 신버전 청크 간의 해시 불일치(ChunkLoadError)를
 * 전역에서 감지하여 에러 화면 없이 조용히 최신 버전으로 자동 새로고침해주는 가드 컴포넌트
 */
export default function ChunkLoadErrorHandler() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isChunkError = (err: any): boolean => {
            const message = err?.message || err?.reason?.message || String(err || '');
            return (
                message.includes('Failed to load chunk') ||
                message.includes('ChunkLoadError') ||
                message.includes('Loading chunk') ||
                message.includes('Loading CSS chunk')
            );
        };

        const triggerAutoReload = () => {
            const reloadKey = 'myeongsim_chunk_auto_reload';
            const lastReload = Number(sessionStorage.getItem(reloadKey) || '0');
            const now = Date.now();

            // 15초 이내에 이미 새로고침한 적이 없다면 즉시 최신 번들로 새로고침
            if (now - lastReload > 15000) {
                sessionStorage.setItem(reloadKey, String(now));
                console.warn('🔄 [ChunkLoadErrorHandler] New deployment detected. Reloading for latest version...');
                window.location.reload();
            }
        };

        const handleError = (event: ErrorEvent) => {
            if (isChunkError(event.error || event.message)) {
                event.preventDefault();
                triggerAutoReload();
            }
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            if (isChunkError(event.reason)) {
                event.preventDefault();
                triggerAutoReload();
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null;
}
