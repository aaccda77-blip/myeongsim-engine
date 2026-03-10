'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SessionManager, generateDeviceFingerprint } from '@/modules/SessionManager';
import { useRouter } from 'next/navigation';

export default function GoogleAuthSync() {
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                // [Memory] Save User ID for Chat History Persistence
                localStorage.setItem('myeongsim_user_id', session.user.id);

                // Check if we already have a Myeongsim session token
                const localToken = SessionManager.getLocalSessionToken();

                if (!localToken) {
                    console.log('🔄 Syncing Google Login with Myeongsim Session...');
                    try {
                        // Create App Session
                        const fingerprint = generateDeviceFingerprint();
                        const result = await SessionManager.createSession(
                            session.user.id,
                            fingerprint,
                            1 // Default for Google users
                        );

                        if (result.success) {
                            console.log('✅ Session Synced! Reloading...');
                            // Refresh to update UI state
                            router.refresh();
                            // Optional: If on /auth/callback or specific page, redirect
                        } else {
                            console.error('❌ Session Sync Failed:', result.error);
                        }
                    } catch (err) {
                        console.error('❌ Session Sync Error:', err);
                    }
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return null; // Invisible component
}
