/**
 * /api/gene-keys - Myeongsim Neural Codes Activation Sequence 서버 계산 API
 * 
 * 생년월일시를 받아 GeneKeyCalculator를 실행하고 결과 반환
 * astronomy-engine은 클라이언트에서 실행 불가하므로 서버에서 처리
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateMyeongsimProfile, parseBirthDate, MyeongsimProfile } from '@/utils/GeneKeyCalculator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { birthDate, birthTime = '12:00', timezone = 9 } = body;

        if (!birthDate) {
            return NextResponse.json(
                { error: 'birthDate is required (YYYY-MM-DD format)' },
                { status: 400 }
            );
        }

        console.log('[API /gene-keys] Calculating for:', { birthDate, birthTime, timezone });

        // 생년월일시 파싱
        const birthDateObj = parseBirthDate(birthDate, birthTime, timezone);

        // Myeongsim Neural Codes 프로필 계산
        const profile: MyeongsimProfile = calculateMyeongsimProfile(birthDateObj);

        // Activation Sequence (4개 핵심 코드)
        const activationSequence = {
            lifeWork: {
                gate: profile.activation.lifeOS.gate,
                line: profile.activation.lifeOS.line,
                formatted: `${profile.activation.lifeOS.gate}.${profile.activation.lifeOS.line}`,
            },
            evolution: {
                gate: profile.activation.growthTrigger.gate,
                line: profile.activation.growthTrigger.line,
                formatted: `${profile.activation.growthTrigger.gate}.${profile.activation.growthTrigger.line}`,
            },
            radiance: {
                gate: profile.activation.bioEngine.gate,
                line: profile.activation.bioEngine.line,
                formatted: `${profile.activation.bioEngine.gate}.${profile.activation.bioEngine.line}`,
            },
            purpose: {
                gate: profile.activation.rootPurpose.gate,
                line: profile.activation.rootPurpose.line,
                formatted: `${profile.activation.rootPurpose.gate}.${profile.activation.rootPurpose.line}`,
            },
        };

        // Venus Sequence (관계 영역)
        const venusSequence = profile.venus ? {
            attraction: `${profile.venus.attraction.gate}.${profile.venus.attraction.line}`,
            iq: `${profile.venus.iq.gate}.${profile.venus.iq.line}`,
            eq: `${profile.venus.eq.gate}.${profile.venus.eq.line}`,
            sq: `${profile.venus.sq.gate}.${profile.venus.sq.line}`,
        } : null;

        // Pearl Sequence (번영 영역)
        const pearlSequence = profile.pearl ? {
            coreMission: `${profile.pearl.coreMission.gate}.${profile.pearl.coreMission.line}`,
            ecoSystem: `${profile.pearl.ecoSystem.gate}.${profile.pearl.ecoSystem.line}`,
            signatureSignal: `${profile.pearl.signatureSignal.gate}.${profile.pearl.signatureSignal.line}`,
            quantumReward: `${profile.pearl.quantumReward.gate}.${profile.pearl.quantumReward.line}`,
        } : null;

        console.log('[API /gene-keys] Calculated:', activationSequence);

        return NextResponse.json({
            success: true,
            data: {
                activation: activationSequence,
                venus: venusSequence,
                pearl: pearlSequence,
                rawProfile: profile, // 필요시 전체 프로필
            },
        });

    } catch (error) {
        console.error('[API /gene-keys] Error:', error);
        return NextResponse.json(
            { error: 'Failed to calculate Myeongsim Neural Codes profile', details: String(error) },
            { status: 500 }
        );
    }
}

// GET 요청도 지원 (쿼리 파라미터 사용)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const birthDate = searchParams.get('birthDate');
    const birthTime = searchParams.get('birthTime') || '12:00';
    const timezone = parseInt(searchParams.get('timezone') || '9');

    if (!birthDate) {
        return NextResponse.json(
            { error: 'birthDate query param required (YYYY-MM-DD format)' },
            { status: 400 }
        );
    }

    // POST 로직 재사용
    try {
        const birthDateObj = parseBirthDate(birthDate, birthTime, timezone);
        const profile = calculateMyeongsimProfile(birthDateObj);

        return NextResponse.json({
            success: true,
            activation: {
                lifeWork: `${profile.activation.lifeOS.gate}.${profile.activation.lifeOS.line}`,
                evolution: `${profile.activation.growthTrigger.gate}.${profile.activation.growthTrigger.line}`,
                radiance: `${profile.activation.bioEngine.gate}.${profile.activation.bioEngine.line}`,
                purpose: `${profile.activation.rootPurpose.gate}.${profile.activation.rootPurpose.line}`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to calculate', details: String(error) },
            { status: 500 }
        );
    }
}
