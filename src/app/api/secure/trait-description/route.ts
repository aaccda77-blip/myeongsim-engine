import { NextRequest, NextResponse } from 'next/server';
import { MYEONGSIM_TRAIT_DESCRIPTIONS } from '@/data/StaticTextDB';

/**
 * GET /api/secure/trait-description?trait=creativity
 * 
 * 보안 API: 특정 에너지 특성에 대한 상세 설명 반환
 * 핵심 데이터가 서버에서만 제공되므로 클라이언트에서 전체 DB를 볼 수 없음
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const trait = searchParams.get('trait');

        if (!trait) {
            return NextResponse.json(
                { error: 'Trait parameter is required' },
                { status: 400 }
            );
        }

        const description = MYEONGSIM_TRAIT_DESCRIPTIONS[trait];

        if (!description) {
            return NextResponse.json(
                { error: 'Trait not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            trait,
            data: description
        });

    } catch (error) {
        console.error('[Secure API] Trait description error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
