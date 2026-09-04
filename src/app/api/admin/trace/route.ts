import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const searchCode = searchParams.get('code')?.trim().toUpperCase();

        const registryPath = path.join(process.cwd(), 'src', 'data', 'forensic_registry.json');
        let records: any[] = [];
        if (fs.existsSync(registryPath)) {
            try {
                records = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
            } catch (e) {
                records = [];
            }
        }

        if (searchCode) {
            // 특정 포렌식 코드 검색
            const matched = records.filter(r => 
                (r.trackingCode && r.trackingCode.toUpperCase().includes(searchCode)) ||
                (r.order && r.order.includes(searchCode)) ||
                (r.buyer && r.buyer.includes(searchCode))
            );

            if (matched.length > 0) {
                return NextResponse.json({
                    success: true,
                    query: searchCode,
                    totalMatches: matched.length,
                    result: matched[0],
                    history: matched,
                    legalEvidenceNotice: '본 기록은 저작권법 제136조 위반 형사고발을 위한 공식 디지털 포렌식 감사 로그입니다.',
                });
            } else {
                return NextResponse.json({
                    success: false,
                    query: searchCode,
                    message: '해당 포렌식 코드와 일치하는 다운로드/열람 기록을 찾을 수 없습니다.',
                }, { status: 404 });
            }
        }

        // 쿼리가 없으면 최근 50건의 포렌식 발급 기록 반환
        return NextResponse.json({
            success: true,
            totalRecords: records.length,
            recentLogs: records.slice(0, 50),
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
