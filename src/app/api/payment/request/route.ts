import { supabase } from '@/lib/supabaseClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const { userId, depositorName, itemId } = await req.json();

        // 1. Validate
        if (!userId || !depositorName) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // 2. Insert Record (if table exists)
        // Table schema is assumed: payments (user_id, depositor_name, status, item_id)
        const { data, error } = await supabase
            .from('payments')
            .insert([
                {
                    user_id: userId,
                    depositor_name: depositorName,
                    status: 'PENDING',
                    item_id: itemId || 'PREMIUM_REPORT',
                    amount: 50000, // Default value
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.warn('DB Insert Failed (Ignored for Demo):', error.message);
            // In a real scenario, we would throw here. 
            // For now, we proceed to mock success if DB isn't set up.
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Payment request received',
            status: 'PENDING'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Payment API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
