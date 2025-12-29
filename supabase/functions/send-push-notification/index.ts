import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts"

// CORS Headers
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 1. Service Account Loader
const getServiceAccount = () => {
    const sa = Deno.env.get('FCM_SERVICE_ACCOUNT')
    if (!sa) throw new Error('Missing FCM_SERVICE_ACCOUNT env var')
    return JSON.parse(sa)
}

// 2. Google OAuth2 Token Generator (Manual JWT Signing)
async function getAccessToken(serviceAccount: any) {
    const iat = getNumericDate(new Date())
    const exp = iat + 3600 // 1 hour

    const jwt = await create(
        { alg: "RS256", typ: "JWT" },
        {
            iss: serviceAccount.client_email,
            sub: serviceAccount.client_email,
            aud: "https://oauth2.googleapis.com/token",
            iat,
            exp,
            scope: "https://www.googleapis.com/auth/firebase.messaging",
        },
        serviceAccount.private_key
    )

    const params = new URLSearchParams()
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
    params.append("assertion", jwt)

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: params,
    })

    const data = await res.json()
    return data.access_token
}

serve(async (req) => {
    // [CORS] Handle Preflight Request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { user_id, title, body } = await req.json()

        // Init Supabase
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get Tokens from DB
        const { data: tokens, error } = await supabaseClient
            .from('user_push_tokens')
            .select('token')
            .eq('user_id', user_id)

        if (error) throw error

        // [Logic Update] Support Direct Token for Testing (If DB lookup fails or is bypassed)
        let targetTokens: string[] = []

        // 1. Add DB Tokens
        if (tokens && tokens.length > 0) {
            targetTokens = tokens.map((t: any) => t.token)
        }

        // 2. Add Direct Token (from Test Button)
        // @ts-ignore
        if (reqBody.direct_token) {
            // @ts-ignore
            targetTokens.push(reqBody.direct_token)
        }

        // Remove duplicates
        targetTokens = [...new Set(targetTokens)]

        if (targetTokens.length === 0) {
            return new Response(JSON.stringify({ message: 'No tokens found for user (and no direct_token provided)' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // Get Access Token
        const serviceAccount = getServiceAccount()
        const accessToken = await getAccessToken(serviceAccount)
        const projectId = serviceAccount.project_id

        // Send Notifications via FCM v1 API
        const results = []
        for (const token of targetTokens) {
            const response = await fetch(
                `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: {
                            token: token,
                            notification: {
                                title: title || "알림",
                                body: body || "새로운 메시지가 도착했습니다.",
                            },
                        },
                    }),
                }
            )
            results.push(await response.json())
        }

        return new Response(
            JSON.stringify({ success: true, results }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        })
    }
})
