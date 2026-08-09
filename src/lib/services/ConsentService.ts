/**
 * [약관 동의 및 감사 이력 서비스 모듈] - ConsentService.ts
 * 
 * 기능:
 * 1. 유저의 현재 약관 동의 상태 및 버전 검증 (isConsentValid)
 * 2. 약관 동의 상태 갱신 (user_consents 테이블)
 * 3. 약관 동의 감사 히스토리 기록 (consent_history 테이블 - Append Only)
 */

import { supabase } from '@/lib/supabaseClient';
import { CURRENT_TERMS_VERSION, CURRENT_PRIVACY_VERSION } from '@/config/legalVersions';

export interface UserConsentsState {
    termsOfService: { agreed: boolean; version: string; agreedAt: string };
    privacyPolicy: { agreed: boolean; version: string; agreedAt: string };
    marketing?: { agreed: boolean; version: string; agreedAt: string };
}

export class ConsentService {
    /**
     * 유저의 약관 동의 상태가 최신 버전과 일치하는지 검증
     */
    static isConsentValid(consents?: UserConsentsState | null): boolean {
        if (!consents) return false;

        const hasTermsAgreed = consents.termsOfService?.agreed === true && consents.termsOfService?.version === CURRENT_TERMS_VERSION;
        const hasPrivacyAgreed = consents.privacyPolicy?.agreed === true && consents.privacyPolicy?.version === CURRENT_PRIVACY_VERSION;

        return hasTermsAgreed && hasPrivacyAgreed;
    }

    /**
     * 동의 상태 DB 및 감사 이력(consent_history)에 기록
     */
    static async saveConsents(userId: string, isTermsAgreed: boolean, isPrivacyAgreed: boolean, isMarketingAgreed: boolean = false): Promise<boolean> {
        try {
            const now = new Date().toISOString();

            const consentsPayload: UserConsentsState = {
                termsOfService: {
                    agreed: isTermsAgreed,
                    version: CURRENT_TERMS_VERSION,
                    agreedAt: now,
                },
                privacyPolicy: {
                    agreed: isPrivacyAgreed,
                    version: CURRENT_PRIVACY_VERSION,
                    agreedAt: now,
                },
                marketing: {
                    agreed: isMarketingAgreed,
                    version: CURRENT_PRIVACY_VERSION,
                    agreedAt: now,
                }
            };

            // 1. user_consents 상태 갱신 (또는 users 문서에 저장)
            const { error: consentErr } = await supabase
                .from('user_consents')
                .upsert({
                    user_id: userId,
                    terms_agreed: isTermsAgreed,
                    terms_version: CURRENT_TERMS_VERSION,
                    privacy_agreed: isPrivacyAgreed,
                    privacy_version: CURRENT_PRIVACY_VERSION,
                    marketing_agreed: isMarketingAgreed,
                    updated_at: now
                }, { onConflict: 'user_id' });

            if (consentErr) {
                console.warn('[ConsentService] user_consents table error (falling back to local cache):', consentErr);
            }

            // 2. consent_history 감사용 기록 (Append Only)
            const auditEntries = [];
            if (isTermsAgreed) {
                auditEntries.push({ user_id: userId, type: 'termsOfService', version: CURRENT_TERMS_VERSION, agreed: true, agreed_at: now });
            }
            if (isPrivacyAgreed) {
                auditEntries.push({ user_id: userId, type: 'privacyPolicy', version: CURRENT_PRIVACY_VERSION, agreed: true, agreed_at: now });
            }
            if (isMarketingAgreed) {
                auditEntries.push({ user_id: userId, type: 'marketing', version: CURRENT_PRIVACY_VERSION, agreed: true, agreed_at: now });
            }

            if (auditEntries.length > 0) {
                await supabase.from('consent_history').insert(auditEntries).then(({ error }) => {
                    if (error) console.warn('[ConsentService] consent_history insert warning:', error);
                });
            }

            // 3. 로컬 캐시 갱신 (즉시 렌더링용)
            try {
                localStorage.setItem(`myeongsim_consent_${userId}`, JSON.stringify(consentsPayload));
            } catch (e) {
                console.warn('LocalStorage save warning:', e);
            }

            return true;

        } catch (error) {
            console.error('[ConsentService Critical Error]:', error);
            return false;
        }
    }

    /**
     * 로컬/DB 동의 상태 가져오기
     */
    static async getConsents(userId: string): Promise<UserConsentsState | null> {
        try {
            // 1. 로컬 캐시 우선 체크
            const local = localStorage.getItem(`myeongsim_consent_${userId}`);
            if (local) {
                const parsed = JSON.parse(local);
                if (ConsentService.isConsentValid(parsed)) {
                    return parsed;
                }
            }

            // 2. DB 조회
            const { data, error } = await supabase
                .from('user_consents')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error || !data) return null;

            const result: UserConsentsState = {
                termsOfService: { agreed: data.terms_agreed, version: data.terms_version, agreedAt: data.updated_at },
                privacyPolicy: { agreed: data.privacy_agreed, version: data.privacy_version, agreedAt: data.updated_at },
                marketing: { agreed: data.marketing_agreed, version: data.privacy_version, agreedAt: data.updated_at }
            };

            return result;

        } catch (e) {
            console.error('getConsents error:', e);
            return null;
        }
    }
}
