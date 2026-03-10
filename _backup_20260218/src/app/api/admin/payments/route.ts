import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: List All Pending Payments
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error);
            // Fallback for demo if table doesn't exist
            return NextResponse.json([
                { id: 'mock-1', depositor_name: '홍길동', amount: 50000, item_id: 'PREMIUM', created_at: new Date().toISOString() },
                { id: 'mock-2', depositor_name: '김철수', amount: 99000, item_id: 'MASTER', created_at: new Date(Date.now() - 3600000).toISOString() }
            ]);
        }

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PATCH: Approve Payment (PENDING -> PAID)
export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        // Update Status
        const { data, error } = await supabase
            .from('payments')
            .update({ status: 'PAID', updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        console.error('Approval Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
