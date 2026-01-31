/**
 * /api/health-qa/daily/route.ts
 * 오늘의 건강상식 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRandomHealthQA } from '@/data/HealthKnowledgeDB';

export const runtime = 'edge';

/**
 * GET /api/health-qa/daily
 * 오늘의 Q&A 가져오기
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Supabase에서 오늘 날짜의 Q&A 가져오기
        // const { data, error } = await supabase
        //     .from('health_qa')
        //     .select('*')
        //     .eq('published_date', new Date().toISOString().split('T')[0])
        //     .single();

        // 임시: 랜덤 Q&A 반환
        const qaData = getRandomHealthQA();

        return NextResponse.json({
            success: true,
            data: qaData
        });
    } catch (error) {
        console.error('Daily Q&A fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch daily Q&A' },
            { status: 500 }
        );
    }
}
