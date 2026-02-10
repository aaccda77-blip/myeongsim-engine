import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Verify Session from Cookies (SSR Compatible)
 */
export async function verifyAuth(request: NextRequest): Promise<{
    authenticated: boolean;
    userId?: string;
    userEmail?: string;
    error?: string;
}> {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                            });
                        } catch {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            console.error('Auth verification failed:', error);
            return { authenticated: false, error: 'Session expired or invalid' };
        }

        return {
            authenticated: true,
            userId: user.id,
            userEmail: user.email,
        };
    } catch (error: any) {
        console.error('Auth verification error:', error);
        return { authenticated: false, error: 'Authentication failed' };
    }
}

/**
 * Middleware wrapper to require authentication
 * Usage: export const POST = requireAuth(async (req, auth) => { ... });
 */
export function requireAuth(
    handler: (request: NextRequest, auth: { userId: string; userEmail?: string }) => Promise<NextResponse | Response>
) {
    return async (request: NextRequest): Promise<NextResponse | Response> => {
        const authResult = await verifyAuth(request);

        if (!authResult.authenticated) {
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    message: '인증이 필요합니다. 로그인 후 다시 시도해주세요.',
                },
                { status: 401 }
            );
        }

        // Pass authenticated user info to handler
        return handler(request, {
            userId: authResult.userId!,
            userEmail: authResult.userEmail,
        });
    };
}

/**
 * Optional auth - allows both authenticated and unauthenticated requests
 * but provides user info if authenticated
 */
export async function optionalAuth(request: NextRequest): Promise<{
    userId?: string;
    userEmail?: string;
}> {
    const authResult = await verifyAuth(request);
    if (authResult.authenticated) {
        return {
            userId: authResult.userId,
            userEmail: authResult.userEmail,
        };
    }
    return {};
}

/**
 * Check if user has premium access
 */
export async function checkPremiumAccess(userId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('premium_until')
            .eq('id', userId)
            .single();

        if (error || !data) {
            return false;
        }

        // Check if premium is still valid
        const premiumUntil = new Date(data.premium_until);
        return premiumUntil > new Date();
    } catch (error) {
        console.error('Premium check error:', error);
        return false;
    }
}

/**
 * Require premium access
 */
export function requirePremium(
    handler: (request: NextRequest, auth: { userId: string; userEmail?: string }) => Promise<NextResponse>
) {
    return requireAuth(async (request, auth) => {
        const hasPremium = await checkPremiumAccess(auth.userId);

        if (!hasPremium) {
            return NextResponse.json(
                {
                    error: 'Premium Required',
                    message: '프리미엄 구독이 필요한 기능입니다.',
                },
                { status: 403 }
            );
        }

        return handler(request, auth);
    });
}
