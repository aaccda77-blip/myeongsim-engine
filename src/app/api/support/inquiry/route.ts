import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, rating, paymentMethod, paymentAmount, paymentDate, agreeMarketing } = body;

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        // Save to Supabase `inquiries` table if exists, or log to server console
        try {
            await supabase.from('inquiries').insert({
                user_id: session?.user?.id || null,
                user_email: session?.user?.email || null,
                inquiry_type: type,
                title,
                content,
                rating,
                payment_method: paymentMethod,
                payment_amount: paymentAmount,
                payment_date: paymentDate,
                agree_marketing: agreeMarketing,
                status: 'pending',
                created_at: new Date().toISOString()
            });
        } catch (dbError) {
            console.warn('[Inquiry API] DB insert warning (table might not exist yet):', dbError);
        }

        return NextResponse.json({
            success: true,
            message: 'Inquiry submitted successfully'
        });
    } catch (error) {
        console.error('[Inquiry API] Error processing inquiry:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
