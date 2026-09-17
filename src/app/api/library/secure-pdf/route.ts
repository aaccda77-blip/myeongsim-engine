import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    // 앱 내 PDF 직접 열람/다운로드를 전면 중단하고 YES24 공식 도서 구매 페이지로 안전하게 리다이렉트합니다.
    return NextResponse.redirect('https://www.yes24.com/Product/Goods/195946431', 302);
}
