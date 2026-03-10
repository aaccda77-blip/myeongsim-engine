import { supabase } from './supabaseClient';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

export async function initializePushNotifications(userId: string) {
    try {
        const msg = await messaging();
        if (!msg) {
            console.warn('FCM not supported');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return;
        }

        // Get VAPID Key from env or use a placeholder if testing without distinct key
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        const currentToken = await getToken(msg, { vapidKey });

        if (currentToken) {
            console.log('FCM Token:', currentToken);
            await saveTokenToSupabase(userId, currentToken);
        } else {
            console.log('No registration token available.');
        }

    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
    }
}

async function saveTokenToSupabase(userId: string, token: string) {
    const { error } = await supabase
        .from('user_push_tokens')
        .upsert({
            user_id: userId,
            fcm_token: token
        }, {
            onConflict: 'user_id,fcm_token'
        });

    if (error) console.error('Error saving FCM token:', error);
    else console.log('FCM token saved to Supabase');
}
