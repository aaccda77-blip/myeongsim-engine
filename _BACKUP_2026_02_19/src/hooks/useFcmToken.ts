import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { messaging } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';

export function useFcmToken(userId: string | null) {
    const [token, setToken] = useState<string | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (!userId || typeof window === 'undefined') return;

        const retrieveToken = async () => {
            try {
                const msg = await messaging();
                if (!msg) return;

                const perm = await Notification.requestPermission();
                setPermission(perm);

                if (perm === 'granted') {
                    const currentToken = await getToken(msg, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                    });

                    if (currentToken) {
                        setToken(currentToken);
                        // Save to Supabase
                        await supabase.from('user_push_tokens').upsert({
                            user_id: userId,
                            token: currentToken
                        }, { onConflict: 'user_id,token' });

                        console.log("FCM Token Saved:", currentToken);
                    }
                }
            } catch (error) {
                console.error("FCM Token Error:", error);
            }
        };

        retrieveToken();
    }, [userId]);

    return { token, permission };
}
