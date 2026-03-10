/**
 * SessionManager.ts - 세션 관리 및 돌려쓰기 방지 모듈
 * 
 * 목적: 1계정 = 1세션 정책으로 계정 공유 방지
 * 특징:
 *  - 동시 접속 제한
 *  - 새 로그인 시 기존 세션 킥아웃
 *  - 세션 토큰 관리
 *  - 디바이스 핑거프린트 추적
 */

import { supabase } from '@/lib/supabaseClient';

// ============== 타입 정의 ==============

export interface SessionInfo {
    id: string;
    userId: string;
    sessionToken: string;
    deviceFingerprint: string;
    deviceInfo: {
        userAgent?: string;
        platform?: string;
        language?: string;
        screenSize?: string;
    };
    ipAddress?: string;
    createdAt: Date;
    lastActiveAt: Date;
    expiresAt: Date;
    isActive: boolean;
}

export interface SessionValidationResult {
    isValid: boolean;
    userId?: string;
    reason?: 'expired' | 'kicked' | 'not_found' | 'valid';
    expiresAt?: Date;
}

export interface LoginSessionResult {
    success: boolean;
    sessionToken?: string;
    kickedSessions?: number;
    error?: string;
}

// ============== 유틸리티 함수 ==============

/**
 * 랜덤 세션 토큰 생성
 */
function generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 디바이스 핑거프린트 생성 (브라우저 정보 기반)
 */
export function generateDeviceFingerprint(): string {
    if (typeof window === 'undefined') {
        return 'server-' + Date.now().toString(36);
    }

    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown'
    ];

    // 간단한 해시 생성
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return 'fp-' + Math.abs(hash).toString(36);
}

/**
 * 디바이스 정보 수집
 */
export function getDeviceInfo(): SessionInfo['deviceInfo'] {
    if (typeof window === 'undefined') {
        return { platform: 'server' };
    }

    return {
        userAgent: navigator.userAgent.substring(0, 200),
        platform: navigator.platform,
        language: navigator.language,
        screenSize: `${screen.width}x${screen.height}`
    };
}

// ============== 메인 SessionManager 클래스 ==============

export class SessionManager {

    private static SESSION_KEY = 'myeongsim_session_token';
    private static SESSION_DURATION_HOURS = 24;

    /**
     * 새 세션 생성 (로그인 시 호출)
     * 기존 세션이 있으면 킥아웃
     */
    static async createSession(
        userId: string,
        deviceFingerprint?: string,
        maxSessions: number = 1
    ): Promise<LoginSessionResult> {
        try {
            const sessionToken = generateSessionToken();
            const fingerprint = deviceFingerprint || generateDeviceFingerprint();
            const deviceInfo = getDeviceInfo();
            const expiresAt = new Date(Date.now() + this.SESSION_DURATION_HOURS * 60 * 60 * 1000);

            // 1. 기존 활성 세션 수 확인
            const { data: countData } = await supabase
                .rpc('get_active_session_count', { p_user_id: userId });

            const currentCount = countData || 0;
            let kickedSessions = 0;

            // 2. 최대 세션 수 초과 시 기존 세션 킥아웃
            if (currentCount >= maxSessions) {
                // 가장 오래된 세션부터 킥아웃
                const { data: oldSessions } = await supabase
                    .from('active_sessions')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('is_active', true)
                    .order('created_at', { ascending: true })
                    .limit(currentCount - maxSessions + 1);

                if (oldSessions && oldSessions.length > 0) {
                    const idsToKick = oldSessions.map(s => s.id);
                    await supabase
                        .from('active_sessions')
                        .update({ is_active: false })
                        .in('id', idsToKick);

                    kickedSessions = idsToKick.length;
                    console.log(`🔐 [Session] Kicked ${kickedSessions} old sessions for user ${userId}`);
                }
            }

            // 3. 새 세션 생성
            const { error: insertError } = await supabase
                .from('active_sessions')
                .insert({
                    user_id: userId,
                    session_token: sessionToken,
                    device_fingerprint: fingerprint,
                    device_info: deviceInfo,
                    expires_at: expiresAt.toISOString(),
                    is_active: true
                });

            if (insertError) {
                console.error('Session creation error:', insertError);
                return { success: false, error: insertError.message };
            }

            // 4. 로컬 스토리지에 토큰 저장
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.SESSION_KEY, sessionToken);
            }

            console.log(`🔐 [Session] Created new session for user ${userId}`);

            return {
                success: true,
                sessionToken,
                kickedSessions
            };

        } catch (error) {
            console.error('Session creation failed:', error);
            return { success: false, error: String(error) };
        }
    }

    /**
     * 세션 유효성 검증
     */
    static async validateSession(sessionToken?: string): Promise<SessionValidationResult> {
        try {
            const token = sessionToken || (typeof window !== 'undefined'
                ? localStorage.getItem(this.SESSION_KEY)
                : null);

            if (!token) {
                return { isValid: false, reason: 'not_found' };
            }

            const { data, error } = await supabase
                .from('active_sessions')
                .select('user_id, is_active, expires_at')
                .eq('session_token', token)
                .single();

            if (error || !data) {
                return { isValid: false, reason: 'not_found' };
            }

            if (!data.is_active) {
                return { isValid: false, reason: 'kicked', userId: data.user_id };
            }

            if (new Date(data.expires_at) < new Date()) {
                return { isValid: false, reason: 'expired', userId: data.user_id };
            }

            // 세션 활성 시간 업데이트
            await this.touchSession(token);

            return {
                isValid: true,
                reason: 'valid',
                userId: data.user_id,
                expiresAt: new Date(data.expires_at)
            };

        } catch (error) {
            console.error('Session validation error:', error);
            return { isValid: false, reason: 'not_found' };
        }
    }

    /**
     * 세션 활성 시간 갱신 (하트비트)
     */
    static async touchSession(sessionToken?: string): Promise<boolean> {
        try {
            const token = sessionToken || (typeof window !== 'undefined'
                ? localStorage.getItem(this.SESSION_KEY)
                : null);

            if (!token) return false;

            const { error } = await supabase
                .from('active_sessions')
                .update({ last_active_at: new Date().toISOString() })
                .eq('session_token', token)
                .eq('is_active', true);

            return !error;
        } catch {
            return false;
        }
    }

    /**
     * 로그아웃 (세션 종료)
     */
    static async logout(sessionToken?: string): Promise<boolean> {
        try {
            const token = sessionToken || (typeof window !== 'undefined'
                ? localStorage.getItem(this.SESSION_KEY)
                : null);

            if (!token) return false;

            const { error } = await supabase
                .from('active_sessions')
                .update({ is_active: false })
                .eq('session_token', token);

            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.SESSION_KEY);
            }

            console.log(`🔐 [Session] Logged out`);
            return !error;

        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    }

    /**
     * 특정 사용자의 모든 세션 킥아웃 (비밀번호 변경 등)
     */
    static async kickAllSessions(userId: string): Promise<number> {
        try {
            const { data } = await supabase
                .from('active_sessions')
                .update({ is_active: false })
                .eq('user_id', userId)
                .eq('is_active', true)
                .select('id');

            const count = data?.length || 0;
            console.log(`🔐 [Session] Kicked all ${count} sessions for user ${userId}`);
            return count;

        } catch (error) {
            console.error('Kick all sessions error:', error);
            return 0;
        }
    }

    /**
     * 로컬 세션 토큰 가져오기
     */
    static getLocalSessionToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.SESSION_KEY);
    }

    /**
     * 만료된 세션 정리 (관리자/cron용)
     */
    static async cleanupExpiredSessions(): Promise<number> {
        try {
            const { data } = await supabase
                .from('active_sessions')
                .delete()
                .or('expires_at.lt.now(),is_active.eq.false')
                .select('id');

            const count = data?.length || 0;
            console.log(`🧹 [Session] Cleaned up ${count} expired sessions`);
            return count;

        } catch (error) {
            console.error('Cleanup error:', error);
            return 0;
        }
    }
}
