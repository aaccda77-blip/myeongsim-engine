import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic'; // [Fix] Prevent caching of user list

export async function GET(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({
            error: 'Configuration Error',
            details: 'SUPABASE_SERVICE_ROLE_KEY is missing. Add it to Vercel Env Vars.'
        }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Admin] Fetch Users Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[Admin] Fetched ${data?.length} users. Sample ExpiresAt:`, data?.[0]?.expires_at);

    return NextResponse.json(data);
}
