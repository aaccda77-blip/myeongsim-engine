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

        const downloadCount = records.filter(r => r.action === 'download').length;
        const streamCount = records.filter(r => r.action === 'stream').length;

        if (searchCode) {
            // 특정 포렌식 코드 / 주문번호 / 구매자명 검색
            const matched = records.filter(r => 
                (r.trackingCode && r.trackingCode.toUpperCase().includes(searchCode)) ||
                (r.order && r.order.toUpperCase().includes(searchCode)) ||
                (r.buyer && r.buyer.includes(searchCode))
            );

            if (matched.length > 0) {
                const target = matched[0];
                const hasDownloaded = matched.some(r => r.action === 'download');
                const downloadRecords = matched.filter(r => r.action === 'download');

                return NextResponse.json({
                    success: true,
                    query: searchCode,
                    totalMatches: matched.length,
                    result: target,
                    hasDownloaded,
                    downloadRecords,
                    history: matched,
                    legalEvidenceNotice: '「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라 파일 다운로드 및 디지털 콘텐츠 열람이 개시된 이후에는 청약철회(환불)가 불가능함을 증명하는 공식 포렌식 감사 기록입니다.',
                });
            } else {
                return NextResponse.json({
                    success: false,
                    query: searchCode,
                    message: '해당 검색어(주문번호/성함/포렌식코드)와 일치하는 열람/다운로드 감사 기록을 찾을 수 없습니다.',
                }, { status: 404 });
            }
        }

        // 전체 통계 및 최근 기록
        return NextResponse.json({
            success: true,
            totalRecords: records.length,
            downloadCount,
            streamCount,
            recentLogs: records.slice(0, 100),
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
