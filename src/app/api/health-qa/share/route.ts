/**
 * /api/health-qa/share/route.ts
 * 건강상식 공유 기록 API
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * POST /api/health-qa/share
 * 공유 기록 저장
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qaId, platform } = body;

        if (!qaId || !platform) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // TODO: Supabase에 공유 기록 저장
        // const { data, error } = await supabase
        //     .from('health_qa_shares')
        //     .insert({
        //         qa_id: qaId,
        //         platform,
        //         user_id: userId // from auth
        //     });

        // TODO: health_qa 테이블의 share_count 증가
        // await supabase.rpc('increment_share_count', { qa_id: qaId });

        return NextResponse.json({
            success: true,
            message: 'Share recorded successfully'
        });
    } catch (error) {
        console.error('Share record error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to record share' },
            { status: 500 }
        );
    }
}
