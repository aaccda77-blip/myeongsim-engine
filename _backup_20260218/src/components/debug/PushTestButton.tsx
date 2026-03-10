'use client';

import { useFcmToken } from "@/hooks/useFcmToken";
import { supabase } from "@/lib/supabaseClient";
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

export default function PushTestButton() {
    // Demo User ID (Using the same one as ChatInterface)
    const demoUserId = '00000000-0000-0000-0000-000000000000';

    // Hook handles token sync automatically (KEEP for status display)
    const { token: hookToken, permission: hookPermission } = useFcmToken(demoUserId);

    const handlePush = async () => {
        try {
            console.log("🔔 [Push Test] Starting sequence...");

            // 1. Get Firebase Messaging Instance
            const msg = await messaging();
            if (!msg) {
                alert("❌ Firebase Messaging Not Supported in this browser.");
                return;
            }

            // 2. Request Permission Explicitly
            console.log("🔔 [Push Test] Requesting Permission...");
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') {
                alert(`❌ 권한 거부됨: ${perm}\n브라우저 설정에서 알림을 허용해주세요.`);
                return;
            }

            // 3. Get Token (Force)
            console.log("🔔 [Push Test] Fetching Token...");
            const currentToken = await getToken(msg, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (!currentToken) {
                alert("❌ 토큰 발급 실패 (Empty Token)");
                return;
            }
            console.log("✅ [Push Test] Token:", currentToken);

            // 4. Save to DB (Upsert) - Vital Step
            console.log("🔔 [Push Test] Upserting to DB...");
            const { error: dbError } = await supabase.from('user_push_tokens').upsert({
                user_id: demoUserId,
                token: currentToken
            }, { onConflict: 'user_id,token' });

            if (dbError) {
                console.error("⚠️ DB Save Error (Ignorable if using fallback logic):", dbError);
                // We proceed because we will send the token directly in the body as a fallback
            } else {
                console.log("✅ [Push Test] Token saved to DB.");
            }

            // 5. Invoke Edge Function
            console.log("🔔 [Push Test] Invoking Edge Function...");
            const { data, error } = await supabase.functions.invoke('send-push-notification', {
                body: {
                    user_id: demoUserId,
                    title: '🚨 긴급 테스트 (Logic Updated)',
                    body: `토큰 저장 후 발송 성공!\nToken: ${currentToken.substring(0, 8)}...`,
                    // [Direct Token Fallback] In case DB lookup fails (e.g. invalid user_id constraint)
                    direct_token: currentToken
                }
            });

            if (error) {
                console.error("Edge Function Error:", error);
                throw error;
            }

            console.log("✅ [Push Test] Success:", data);
            alert(`🚀 전송 성공!\n결과: ${JSON.stringify(data)}`);

        } catch (e: any) {
            console.error("🚨 [Push Test] Exception:", e);
            alert(`💥 전송 중 오류 발생:\n${e.message}`);
        }
    };

    // [UI Update] User requested to hide this debug button as it blocks the chat.
    // The functionality is now integrated into ChatInterface.tsx
    return null;
}
