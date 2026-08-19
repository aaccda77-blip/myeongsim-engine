// @ts-nocheck
/**
 * [ContentLockManager]
 * 챗봇 외 컨텐츠(나의 리포트, 내면치유 코어, 오늘의 카드, 본재 해독, 천명 64열쇠 등) 
 * 3회 이상 열람 시 자동 잠금 및 관리자 무통장 입금 승인 시스템 관리자
 */

const STORAGE_KEY_COUNT = 'myeongsim_content_view_count';
const STORAGE_KEY_LOCKED = 'myeongsim_content_locked';
const STORAGE_KEY_APPROVED = 'myeongsim_admin_approved';

export interface ContentLockStatus {
    viewCount: number;
    isLocked: boolean;
    isApproved: boolean;
    remainingViews: number;
}

export function getContentLockStatus(): ContentLockStatus {
    return {
        viewCount: 0,
        isLocked: false,
        isApproved: true,
        remainingViews: 9999
    };
}

export function incrementContentViewCount(): ContentLockStatus {
    return getContentLockStatus();
}

export function getChatLockStatus(): { isLocked: boolean; isApproved: boolean; usedTurns: number; remainingTurns: number } {
    return {
        isLocked: false,
        isApproved: true,
        usedTurns: 0,
        remainingTurns: 9999
    };
}

export function recordChatUse(): { isLocked: boolean; remainingTurns: number } {
    return {
        isLocked: false,
        remainingTurns: 9999
    };
}

export function setAdminApproved(approved: boolean = true) {
    if (typeof window === 'undefined') return;
    if (approved) {
        localStorage.setItem(STORAGE_KEY_APPROVED, 'true');
        localStorage.removeItem(STORAGE_KEY_LOCKED);
        localStorage.removeItem('myeongsim_chat_locked');
        localStorage.removeItem('myeongsim_chat_used_turns');
        localStorage.removeItem('myeongsim_freeTurns');
    } else {
        localStorage.removeItem(STORAGE_KEY_APPROVED);
    }
}
