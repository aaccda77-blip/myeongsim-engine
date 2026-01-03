import { NextRequest, NextResponse } from 'next/server';
import { ScoreCalculator, SajuMatrix } from '@/utils/ScoreCalculator';

/**
 * POST /api/secure/calculate-scores
 * 
 * 보안 API: 사주 매트릭스를 받아 에너지 시그니처 점수를 계산
 * 핵심 알고리즘이 서버에서만 실행되므로 클라이언트에 노출되지 않음
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sajuMatrix, myCodes = [] } = body as { sajuMatrix: SajuMatrix; myCodes?: number[] };

        if (!sajuMatrix || !sajuMatrix.ohaeng || !sajuMatrix.tenGods) {
            return NextResponse.json(
                { error: 'Invalid saju matrix provided' },
                { status: 400 }
            );
        }

        // 핵심 계산 로직 (서버에서만 실행)
        const calculator = new ScoreCalculator(sajuMatrix, myCodes);
        const scores = calculator.toChartFormat();

        return NextResponse.json({
            success: true,
            scores,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[Secure API] Score calculation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
