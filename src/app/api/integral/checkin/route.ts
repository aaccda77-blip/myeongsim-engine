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
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch User Profile (DOB)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('birth_date, name')
            .eq('id', userId)
            .single();

        if (userError || !userData) {
            console.error('User fetch error:', userError);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Prepare Engine Input
        // If birth_date is missing, use default (1980-07-07) for safety/demo
        const dob = userData.birth_date || '1980-07-07T13:40:00';

        const engineInput: EngineInput = {
            dob: dob,
            daily_state: dailyState as IntegralState
        };

        // 3. Run Engine
        const engine = new MyeongshimEngine();
        const { context, advice } = await engine.generateDailyCoaching(engineInput);

        // 4. Save to DB (IntegralLog)
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

        return NextResponse.json({
            success: true,
            data: {
                advice,
                context,
                energy_level: context.saju.energy_level
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            message: "잠시 쉬어가세요. (서버 오류)"
        }, { status: 500 });
    }
}
