// src/app/api/user/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ isValid: false }, { status: 401 });
        }

        // Token is actually the user ID in our system
        const userId = token;

        // Fetch user data from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('id, phone_hash, membership_tier, expires_at, created_at')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return NextResponse.json({ isValid: false }, { status: 401 });
        }

        // Check if pass is active
        const now = new Date();
        const expiryDate = user.expires_at ? new Date(user.expires_at) : null;
        const hasActivePass = expiryDate ? expiryDate > now : false;

        // Calculate remaining credits (for future use)
        const remainingCredits = hasActivePass ? 999 : 0; // Placeholder

        return NextResponse.json({
            isValid: true,
            hasActivePass,
            remainingCredits,
            userName: user.phone_hash.substring(0, 8) + '***', // Masked phone
            membershipTier: user.membership_tier,
            expiresAt: user.expires_at
        }, {
            headers: {
                'Set-Cookie': `myeongsim_expiry_date=${user.expires_at}; Path=/; HttpOnly; SameSite=Strict`
            }
        });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ isValid: false }, { status: 500 });
    }
}
