import { NextRequest, NextResponse } from 'next/server';
import { DailyLuckEngine } from '@/lib/saju/DailyLuckEngine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { dayMaster } = body; // Expecting '갑', '을', etc.

        if (!dayMaster) {
            // If no dayMaster provided (e.g. first load), default to '갑' for demo
            // or return error. For MVP, let's default to a neutral one or error.
            return NextResponse.json(
                { error: 'Day Master is required' },
                { status: 400 }
            );
        }

        // Clean user input just in case (e.g. "갑 (Mok)")
        const cleanDayMaster = dayMaster.charAt(0);

        const biorhythm = DailyLuckEngine.calculate(cleanDayMaster);

        return NextResponse.json({
            success: true,
            data: biorhythm
        });

    } catch (error) {
        console.error('[API] Daily Biorhythm Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
