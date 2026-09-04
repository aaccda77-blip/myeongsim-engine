import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 주요 한국 성씨 로마자 매핑 테이블
const SURNAMES: Record<string, string> = {
    '김': 'KIM', '이': 'LEE', '박': 'PARK', '최': 'CHOI', '정': 'JUNG',
    '강': 'KANG', '조': 'CHO', '윤': 'YOON', '장': 'JANG', '임': 'LIM',
    '한': 'HAN', '오': 'OH', '서': 'SEO', '신': 'SHIN', '권': 'KWON',
    '황': 'HWANG', '안': 'AHN', '송': 'SONG', '전': 'JEON', '홍': 'HONG',
    '유': 'YOO', '고': 'KO', '문': 'MOON', '양': 'YANG', '손': 'SON',
    '배': 'BAE', '백': 'BAEK', '허': 'HEO', '남': 'NAM', '심': 'SHIM',
    '노': 'NOH', '하': 'HA', '곽': 'KWAK', '성': 'SEONG', '차': 'CHA',
    '주': 'JOO', '우': 'WOO', '구': 'KOO', '민': 'MIN', '진': 'JIN',
    '지': 'JI', '엄': 'EOM', '채': 'CHAE', '원': 'WON', '천': 'CHEON',
    '방': 'BANG', '공': 'KONG', '현': 'HYUN', '함': 'HAM', '변': 'BYUN',
    '염': 'YEOM', '여': 'YEO', '추': 'CHOO', '도': 'DO', '소': 'SO',
    '석': 'SEOK', '선': 'SEON', '설': 'SEOL', '마': 'MA', '길': 'GIL',
    '위': 'WI', '표': 'PYO', '명': 'MYEONG', '기': 'KI', '반': 'BAN',
    '왕': 'WANG', '금': 'KEUM', '옥': 'OK', '육': 'YOOK', '인': 'IN',
    '맹': 'MAENG', '제': 'JE', '모': 'MO', '탁': 'TAK', '국': 'KOOK',
};

// 인메모리 캐시
interface CachedPdf {
    bytes: Uint8Array;
    cachedAt: number;
}
const pdfCache = new Map<string, CachedPdf>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30분

// WinAnsi 인코딩 호환 세련된 안심 로마자 마스킹
function toSafeMaskedAscii(rawName: string): string {
    if (!rawName || rawName.trim() === '' || rawName.includes('VIP')) {
        return 'VIP CERTIFIED READER';
    }
    const clean = rawName.trim();
    const firstChar = clean[0];
    if (SURNAMES[firstChar]) {
        const sur = SURNAMES[firstChar];
        if (clean.length === 2) {
            return `${sur} * (AUTHENTICATED)`;
        } else if (clean.length >= 3) {
            return `${sur} * * (AUTHENTICATED)`;
        }
        return `${sur} (AUTHENTICATED)`;
    }
    // 영문인 경우
    const asciiOnly = clean.replace(/[^a-zA-Z0-9 ]/g, '');
    if (asciiOnly.length <= 3) return 'VIP READER';
    return `${asciiOnly.slice(0, 2)}***${asciiOnly.slice(-1).toUpperCase()} (AUTHENTICATED)`;
}

// 주문번호 안심 마스킹
function maskOrderNumber(order: string): string {
    if (!order || order.trim() === '') return 'ORD-2026-******';
    const clean = order.trim().replace(/[^a-zA-Z0-9-]/g, '');
    if (clean.length <= 6) return clean;
    const prefix = clean.slice(0, 4);
    const suffix = clean.slice(-3);
    return `${prefix}-****-${suffix}`;
}

// 시리얼키 안심 마스킹
function maskSerialKey(serial: string): string {
    if (!serial || serial.trim() === '') return 'MC-VIP-2026-CHEONGRYU';
    const clean = serial.trim().replace(/[^a-zA-Z0-9-]/g, '');
    if (clean.length <= 8) return clean;
    return `${clean.slice(0, 7)}****${clean.slice(-4)}`;
}

// 고유 포렌식 추적 해시코드 생성 (유출 시 관리자 센터에서 1초 만에 구매자 역추적)
function generateTrackingHash(buyer: string, order: string, serial: string): string {
    const raw = `${buyer}|${order}|${serial}|CHEONGRYU-SECRET-SALT-2026`;
    const hash = crypto.createHash('sha256').update(raw).digest('hex').toUpperCase();
    return `CR-${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}`;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const rawBuyer = searchParams.get('buyer') || '청류 VIP 독자';
        const rawOrder = searchParams.get('order') || '20260904-998877';
        const rawSerial = searchParams.get('serial') || 'MC-VIP-2026-CHEONGRYU';

        const safeBuyer = toSafeMaskedAscii(rawBuyer);
        const maskedOrder = maskOrderNumber(rawOrder);
        const maskedSerial = maskSerialKey(rawSerial);
        const trackingCode = generateTrackingHash(rawBuyer, rawOrder, rawSerial);

        // 캐시 키
        const cacheKey = `${safeBuyer}::${maskedOrder}::${trackingCode}`;
        const now = Date.now();
        const cached = pdfCache.get(cacheKey);

        if (cached && (now - cached.cachedAt < CACHE_TTL_MS)) {
            return new NextResponse(Buffer.from(cached.bytes), {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="ZERO-POINT-CHEONGRYU-PROTECTED.pdf"',
                    'Cache-Control': 'private, no-transform, max-age=3600',
                    'X-DRM-Tracking-Code': trackingCode,
                    'X-Content-Type-Options': 'nosniff',
                },
            });
        }

        // 원본 PDF 파일 로드 (src/data 비공개 서버 저장소 우선)
        let pdfPath = path.join(process.cwd(), 'src', 'data', 'books', 'zero-point.pdf');
        if (!fs.existsSync(pdfPath)) {
            pdfPath = path.join(process.cwd(), 'private', 'books', 'zero-point.pdf');
        }
        if (!fs.existsSync(pdfPath)) {
            pdfPath = path.join(process.cwd(), 'public', 'books', 'zero-point.pdf');
        }

        if (!fs.existsSync(pdfPath)) {
            return NextResponse.json(
                { error: 'NotFound', message: '도서 원본 파일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const originalBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(originalBytes);

        // WinAnsi 표준 영문/숫자 서체 임베딩 (0% 깨짐 방지)
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pages = pdfDoc.getPages();
        const totalPages = pages.length;

        const watermarkMain = `[CHEONGRYU OFFICIAL DRM] ${safeBuyer} | ${maskedOrder}`;
        const watermarkSub = `TRACKING HASH: ${trackingCode} | ARTICLE 136 CRIMINAL LIABILITY`;

        for (let i = 0; i < totalPages; i++) {
            const page = pages[i];
            const { width, height } = page.getSize();

            // 1. 대각선 중앙 메인 포렌식 워터마크 (독서 방해 없는 12% 투명도)
            page.drawText(watermarkMain, {
                x: width * 0.06,
                y: height * 0.46,
                size: 11,
                font: helveticaBold,
                color: rgb(0.75, 0.2, 0.2), // 세련된 버건디 레드 보안톤
                opacity: 0.12,
                rotate: degrees(33),
            });

            page.drawText(watermarkSub, {
                x: width * 0.06,
                y: height * 0.42,
                size: 8.5,
                font: helvetica,
                color: rgb(0.2, 0.2, 0.7), // 딥 네이비 보안톤
                opacity: 0.12,
                rotate: degrees(33),
            });

            // 2. 상단 헤더 포렌식 식별자 (모든 페이지 상단 각인)
            page.drawText(`[CHEONGRYU e-LIBRARY] ${trackingCode} | ${maskedSerial} | P.${i + 1}/${totalPages}`, {
                x: 24,
                y: height - 16,
                size: 7,
                font: helvetica,
                color: rgb(0.35, 0.35, 0.35),
                opacity: 0.45,
            });

            // 3. 하단 푸터 무단배포 처벌 경고 (저작권법 제136조 명시)
            page.drawText(`ALL RIGHTS RESERVED (C) CHEONGRYU BOOKS. FOR LICENSED INDIVIDUAL USE ONLY. UNAUTHORIZED DISTRIBUTION IS STRICTLY PROHIBITED.`, {
                x: 24,
                y: 11,
                size: 6.2,
                font: helveticaBold,
                color: rgb(0.55, 0.15, 0.15),
                opacity: 0.45,
            });
        }

        const watermarkedBytes = await pdfDoc.save();

        // 캐시 저장 (메모리 관리: 캐시 크기 20개 초과 시 가장 오래된 항목 제거)
        if (pdfCache.size > 20) {
            const firstKey = pdfCache.keys().next().value;
            if (firstKey) pdfCache.delete(firstKey);
        }
        pdfCache.set(cacheKey, { bytes: watermarkedBytes, cachedAt: now });

        return new NextResponse(Buffer.from(watermarkedBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="ZERO-POINT-CHEONGRYU-PROTECTED.pdf"',
                'Cache-Control': 'private, no-transform, max-age=3600',
                'X-DRM-Tracking-Code': trackingCode,
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error: any) {
        console.error('[SECURE_PDF_ERROR]', error);
        return NextResponse.json(
            { error: 'InternalServerError', message: '보안 PDF 스트림 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
