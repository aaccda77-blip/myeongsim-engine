'use client';

export interface UserActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    category: 'WATCH' | 'COACHING' | 'BREATH' | 'BIO_CARE' | 'SOUND' | 'REPORT' | 'NAVIGATION';
    details?: string;
    timestamp: string;
}

const STORAGE_KEY = 'myeongsim_user_activities';

export class ActivityTracker {
    private static getIdentity(): { userId: string; userName: string } {
        if (typeof window === 'undefined') {
            return { userId: 'guest', userName: '방문자' };
        }

        try {
            // 1. 저장된 회원 정보 확인
            const phone = localStorage.getItem('myeongsim_phone') || '';
            const name = localStorage.getItem('myeongsim_user_name') || '';
            const userId = localStorage.getItem('myeongsim_user_id') || phone || 'guest_' + Math.random().toString(36).substring(2, 8);

            // 로컬스토리지에 저장하여 일관성 유지
            if (!localStorage.getItem('myeongsim_user_id')) {
                localStorage.setItem('myeongsim_user_id', userId);
            }

            return {
                userId,
                userName: name || (phone ? `회원(${phone.slice(-4)})` : '익명 고객')
            };
        } catch {
            return { userId: 'guest', userName: '방문자' };
        }
    }

    public static track(
        action: string,
        category: UserActivityLog['category'] = 'WATCH',
        details?: string
    ) {
        if (typeof window === 'undefined') return;

        try {
            const { userId, userName } = this.getIdentity();
            const logEntry: UserActivityLog = {
                id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                userId,
                userName,
                action,
                category,
                details,
                timestamp: new Date().toISOString()
            };

            // 1. 로컬 버퍼에 최근 50개 유지
            const existingRaw = localStorage.getItem(STORAGE_KEY);
            const list: UserActivityLog[] = existingRaw ? JSON.parse(existingRaw) : [];
            list.unshift(logEntry);
            if (list.length > 50) list.pop();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

            // 2. 서버 백엔드로 비동기 전송 (관리자 모드 실시간 확인용)
            fetch('/api/admin/user-activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logEntry)
            }).catch(() => {
                // 네트워크 오류 무시 (백그라운드 로깅)
            });
        } catch (e) {
            console.error('[ActivityTracker] Error logging activity:', e);
        }
    }

    public static getLocalActivities(): UserActivityLog[] {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }
}
