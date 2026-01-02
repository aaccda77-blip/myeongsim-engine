import { supabase } from '@/lib/supabaseClient';
import { SessionManager, generateDeviceFingerprint } from './SessionManager'; // [NEW] Session Management

/**
 * AuthService.ts
 * Manages user identification via Phone Number (Hashed).
 * 
 * [Privacy Architecture]
 * - Raw phone numbers are NEVER stored in the database.
 * - Input: "010-1234-5678" -> SHA-256 Hash -> DB Query
 * - This ensures even if DB is leaked, original numbers are safe.
 */

export interface AuthUser {
    id: string; // UUID from Supabase
    hashed_phone: string;
    is_new_user: boolean;
    deep_scan_completed: boolean;
    membership_tier?: 'FREE' | 'TRIAL' | 'PASS' | 'VIP'; // [Ticket]
    expires_at?: string; // [Ticket] Expiration
    sessionToken?: string; // [NEW] Session Token
    kickedSessions?: number; // [NEW] Number of kicked sessions
}

export class AuthService {

    /**
     * Hashes the phone number securely using Web Crypto API (client-side compatible)
     */
    private static async hashPhoneNumber(phone: string): Promise<string> {
        // Normalize: remove dashes, spaces
        const cleanPhone = phone.replace(/[^0-9]/g, '');

        // Convert to ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(cleanPhone);

        // Hash using Web Crypto API
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Convert to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }

    /**
     * Login or Register user by Phone Number.
     * @param phone - Raw phone number input from UI
     * @returns AuthUser object including UUID
     */
    static async loginWithPhone(phone: string, deviceFingerprint: string, tier: 'TRIAL' | 'PASS' | 'VIP' = 'TRIAL'): Promise<AuthUser | null> {
        try {
            // [Security] Input validation
            const cleanPhone = phone.replace(/[^0-9]/g, '');

            // [Security] Phone number format validation
            if (!/^[0-9]{10,11}$/.test(cleanPhone)) {
                console.error('Invalid phone number format');
                return null;
            }

            // [Security] Hash the phone number
            const phoneHash = await this.hashPhoneNumber(cleanPhone);

            // 1. Check if user exists
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('phone_hash', phoneHash)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Supabase fetch error:', fetchError);
                return null;
            }

            // 2. If user exists, create session and return
            if (existingUser) {
                // [NEW] Create session and kickout old ones
                const maxSessions = existingUser.membership_tier === 'VIP' ? 2 : 1;
                const sessionResult = await SessionManager.createSession(
                    existingUser.id,
                    deviceFingerprint,
                    maxSessions
                );

                return {
                    id: existingUser.id,
                    hashed_phone: existingUser.phone_hash,
                    is_new_user: false,
                    deep_scan_completed: existingUser.deep_scan_completed || false,
                    membership_tier: existingUser.membership_tier,
                    expires_at: existingUser.expires_at,
                    sessionToken: sessionResult.sessionToken,
                    kickedSessions: sessionResult.kickedSessions
                };
            }

            // 3. If new user, create account
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({
                    phone_hash: phoneHash,
                    deep_scan_completed: false,
                    membership_tier: tier,
                    expires_at: tier === 'PASS'
                        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24시간
                        : null
                })
                .select()
                .single();

            if (insertError || !newUser) {
                console.error('Supabase insert error:', insertError);
                return null;
            }

            // [NEW] Create session for new user
            const sessionResult = await SessionManager.createSession(
                newUser.id,
                deviceFingerprint,
                1 // New users get 1 session
            );

            return {
                id: newUser.id,
                hashed_phone: newUser.phone_hash,
                is_new_user: true,
                deep_scan_completed: false,
                membership_tier: newUser.membership_tier,
                expires_at: newUser.expires_at,
                sessionToken: sessionResult.sessionToken,
                kickedSessions: 0
            };

        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    }

    /**
     * Marks the deep scan as completed for a user.
     */
    static async completeDeepScan(userId: string) {
        const { error } = await supabase
            .from('users')
            .update({ deep_scan_completed: true })
            .eq('id', userId);

        if (error) console.error("Update DeepScan Status Error:", error);
    }
}
