import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client for server-side auth verification
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthenticatedRequest extends NextRequest {
    userId?: string;
    userEmail?: string;
}

/**
 * Verify JWT token from Authorization header
 */
export async function verifyAuth(request: NextRequest): Promise<{
    authenticated: boolean;
    userId?: string;
    userEmail?: string;
    error?: string;
}> {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { authenticated: false, error: 'Missing or invalid authorization header' };
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token with Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return { authenticated: false, error: error?.message || 'Invalid token' };
        }

        return {
            authenticated: true,
            userId: data.user.id,
            userEmail: data.user.email,
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
    handler: (request: NextRequest, auth: { userId: string; userEmail?: string }) => Promise<NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse> => {
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
