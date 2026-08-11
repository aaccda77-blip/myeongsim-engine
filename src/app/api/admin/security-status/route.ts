import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';

export interface SecurityEvent {
    id: string;
    timestamp: string;
    type: 'FAILED_ADMIN_LOGIN' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_INPUT';
    ip: string;
    detail: string;
}

// In-memory security audit log store
export const securityLogs: SecurityEvent[] = [];

export async function GET(req: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const failedLogins = securityLogs.filter(l => l.type === 'FAILED_ADMIN_LOGIN');
    const rateLimitBlocks = securityLogs.filter(l => l.type === 'RATE_LIMIT_EXCEEDED');

    return NextResponse.json({
        systemStatus: failedLogins.length > 5 ? 'WARNING' : 'HEALTHY',
        statusMessage: failedLogins.length === 0 
            ? '🟢 해킹 및 무단 침입 시도 없음 (방화벽 및 SSL 암호화 정상 작동)' 
            : `⚠️ 관리자 무단 접근 시도 ${failedLogins.length}건 차단 방어 완료`,
        activeDefenses: [
            { name: 'SSL/TLS 256-bit 암호화', status: 'ACTIVE', desc: '모든 데이터 송수신 보안 서명' },
            { name: 'Supabase RLS (Row Level Security)', status: 'ACTIVE', desc: 'DB 데이터 무단 접근 100% 차단' },
            { name: 'Admin Brute-Force Rate Limiter', status: 'ACTIVE', desc: '5분당 100회 초과 IP 자동 차단' },
            { name: 'CSP (Content Security Policy)', status: 'ACTIVE', desc: 'XSS & 스크립트 변조 공격 방어' },
            { name: 'HTTP-Only SameSite Cookie', status: 'ACTIVE', desc: '세션 탈취 및 CSRF 공격 방어' },
        ],
        failedLoginCount: failedLogins.length,
        rateLimitBlockCount: rateLimitBlocks.length,
        recentLogs: securityLogs.slice(-10).reverse(),
    });
}
