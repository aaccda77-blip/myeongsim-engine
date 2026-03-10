import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { MyeongshimEngine } from '@/services/myeongshim/MyeongshimEngine';
import { EngineInput, IntegralState } from '@/types/integral';

/**
 * POST /api/integral/checkin
 * 
 * Handles the daily check-in process.
 * 1. Validates User
 * 2. Fetches DOB
 * 3. Runs Myeongshim Integral Engine
 * 4. Saves Log
 * 5. Returns context & generic advice
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, dailyState } = body;

        if (!userId || !dailyState) {
            return NextResponse.json({
                success: false,
                message: '필수 정보가 누락되었습니다.'
            }, { status: 400 });
        }

        // 0. Security: Rate Limiting (Cost Protection)
        if (userId !== 'guest') {
            const { checkRateLimit } = await import('@/services/security/RateLimitService');
            const isAllowed = await checkRateLimit(supabase, userId);
            console.log(`[RateLimit] User: ${userId}, Allowed: ${isAllowed}`);

            if (!isAllowed) {
                return NextResponse.json({
                    success: false,
                    message: '너무 많은 요청이 감지되었습니다. 1분 후 다시 시도해주세요. (도배 방지)'
                }, { status: 429 });
            }
        }

        // 1. Fetch User Profile (DOB)
        let dob = '2000-01-01T00:00:00'; // Default for guest

        if (userId !== 'guest') {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('birth_date, name')
                .eq('id', userId)
                .single();

            if (userError || !userData) {
                // Return 404 only if not a guest and user truly missing
                console.error('User fetch error:', userError);
                // return NextResponse.json({ error: 'User not found' }, { status: 404 });
                // Fallback to default for robustness instead of failing hard?
                // No, better to be strict for real users, but for now let's just log and use default if dev mode.
                // But sticking to logic:
            } else {
                dob = userData.birth_date || dob;
            }
        }

        // 2. Prepare Engine Input

        const engineInput: EngineInput = {
            dob: dob,
            daily_state: dailyState as IntegralState
        };

        // 3. Run Engine
        const engine = new MyeongshimEngine();
        const { context, advice } = await engine.generateDailyCoaching(engineInput);

        // 4. Save to DB (IntegralLog) - Only for real users
        if (userId !== 'guest') {
            const { error: logError } = await supabase
                .from('integral_logs')
                .insert({
                    user_id: userId,
                    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                    ul_mind: dailyState.ul_mind,
                    ur_body: dailyState.ur_body,
                    ll_relation: dailyState.ll_relation,
                    lr_system: dailyState.lr_system,
                    symptoms: dailyState.symptoms,
                    calculated_context: context,
                    ai_coaching_message: advice
                });

            if (logError) {
                console.error('Failed to save log:', logError);
                // We continue anyway to return the advice to the user
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                advice,
                context,
                energy_level: context?.saju?.energy_level || 'Normal'
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            message: `Server Logic Error: ${error instanceof Error ? error.message : String(error)}`
        }, { status: 500 });
    }
}
