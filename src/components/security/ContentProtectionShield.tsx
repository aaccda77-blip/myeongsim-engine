'use client';

import { useEffect } from 'react';

/**
 * 🛡️ [ContentProtectionShield: 지적재산권(IP) & 리포트 불펌 방지 실드]
 * 명심 코칭의 108 심층 리포트, 사주 분석, 마인드 아키텍처 등 고유 지적재산권을
 * 무단 우클릭 복사, 텍스트 드래그 불펌, F12 개발자도구 소스코드 훔쳐보기로부터 100% 보호합니다.
 * (단, 사용자의 정상적인 텍스트 입력 input/textarea 영역은 정상 동작 보장)
 */
export function ContentProtectionShield() {
    useEffect(() => {
        // 1. 마우스 우클릭 방지 (단, 텍스트 입력창은 제외)
        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            e.preventDefault();
        };

        // 2. 개발자 도구 및 소스보기 단축키 차단
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12 차단
            if (e.key === 'F12') {
                e.preventDefault();
                return;
            }

            // Ctrl+Shift+I (개발자도구) or Ctrl+Shift+J (콘솔) or Ctrl+Shift+C (요소검사)
            if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
                e.preventDefault();
                return;
            }

            // Ctrl+U (페이지 소스 보기) or Ctrl+S (페이지 저장)
            if (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key)) {
                e.preventDefault();
                return;
            }
        };

        // 3. 텍스트 무단 드래그 불펌 방지 (입력창 제외)
        const handleSelectStart = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            // 특정 data-allow-select 속성이 있는 영역은 허용 (필요시 사용)
            if (target && target.closest('[data-allow-select="true"]')) {
                return;
            }
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelectStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelectStart);
        };
    }, []);

    return null;
}
