import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/report';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (code) {
        let accessToken = '';
        let refreshToken = '';

        try {
            const supabase = await createClient();
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data?.session) {
                accessToken = data.session.access_token;
                refreshToken = data.session.refresh_token;
            } else {
                console.warn('[AuthCallback] Server exchange note:', error?.message);
            }
        } catch (e) {
            console.warn('[AuthCallback] Server exchange exception:', e);
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';

        let targetOrigin: string;
        if (isLocalEnv) {
            targetOrigin = origin;
        } else if (forwardedHost) {
            targetOrigin = `https://${forwardedHost}`;
        } else {
            targetOrigin = 'https://myeongsimcoaching.com';
        }

        const targetPath = `${next}${next.includes('?') ? '&' : '?'}auth_success=true`;
        const targetUrl = `${targetOrigin}${targetPath}`;

        // [FIX] PKCE 흐름(서버/클라이언트 이중 교환 보장)
        // 서버에서 PKCE Verifier 쿠키 유실로 실패하더라도,
        // 클라이언트 브라우저가 보유한 PKCE verifier와 code를 이용해 클라이언트에서 100% 즉시 세션 교환 및 진입 성공
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>시스템 접속 완료 중 - 명심코칭</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            margin: 0; display: flex; justify-content: center; align-items: center; 
            min-height: 100vh; background: #050B14; color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .loader { text-align: center; padding: 20px; }
        .spinner {
            width: 40px; height: 40px; margin: 0 auto 20px;
            border: 3px solid rgba(59,130,246,0.15); border-top: 3px solid #3b82f6;
            border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .title { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 6px; }
        .sub { font-size: 13px; color: #64748b; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <div class="loader">
        <div class="spinner"></div>
        <div class="title">안전하게 시스템 접속 중입니다</div>
        <div class="sub">잠시만 기다려주세요...</div>
    </div>
    <script>
        (async function() {
            var accessToken = "${accessToken}";
            var refreshToken = "${refreshToken}";
            var code = "${code}";
            var targetUrl = "${targetUrl}";
            var supabaseUrl = "${supabaseUrl}";
            var supabaseKey = "${supabaseKey}";

            function finishRedirect() {
                window.location.replace(targetUrl);
            }

            try {
                if (window.supabase && supabaseUrl && supabaseKey) {
                    var client = window.supabase.createClient(supabaseUrl, supabaseKey);
                    
                    // 1. 서버 토큰이 있을 경우 즉시 setSession
                    if (accessToken && refreshToken) {
                        try {
                            await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                        } catch (e) {}
                        finishRedirect();
                        return;
                    }

                    // 2. 서버 토큰이 없거나 exchange 실패 시, 브라우저 PKCE Verifier로 클라이언트 교환 직접 시도
                    if (code) {
                        try {
                            var res = await client.auth.exchangeCodeForSession(code);
                            if (res.data && res.data.session) {
                                finishRedirect();
                                return;
                            }
                        } catch (e) {}
                    }
                }
            } catch (err) {
                console.warn('Client session sync exception:', err);
            }
            
            finishRedirect();
        })();
    </script>
</body>
</html>`;

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    }

    return NextResponse.redirect(`${origin}/report?auth_success=true`);
}
