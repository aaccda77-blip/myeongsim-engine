import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const { name, email, phone, element, frequency, theme, message, orderNumber } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: '성함과 음원을 수신하실 이메일 주소를 입력해주세요.' },
                { status: 400 }
            );
        }

        const receiptCode = `CR-SONG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const application = {
            receiptCode,
            name,
            email,
            phone: phone || '',
            element: element || '금(金)',
            frequency: frequency || '432Hz',
            theme: theme || '수면/휴식',
            message: message || '',
            orderNumber: orderNumber || '',
            appliedAt: new Date().toISOString(),
            status: 'RECEIVED', // RECEIVED, IN_PROGRESS, COMPLETED
        };

        const dirPath = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, 'healing_song_applications.json');
        let list: any[] = [];
        if (fs.existsSync(filePath)) {
            try {
                list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch (e) {
                list = [];
            }
        }
        list.unshift(application);
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            message: '1:1 맞춤 헌정 힐링송 작곡 신청이 성공적으로 접수되었습니다. 이경윤 대표 및 사운드 엔지니어링 팀이 정성껏 작곡하여 등록하신 이메일로 발송해 드립니다.',
            receiptCode,
            application,
        });
    } catch (error: any) {
        console.error('[APPLY_HEALING_SONG_ERROR]', error);
        return NextResponse.json(
            { success: false, message: '신청서 접수 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'healing_song_applications.json');
        let list: any[] = [];
        if (fs.existsSync(filePath)) {
            try {
                list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch (e) {
                list = [];
            }
        }
        return NextResponse.json({
            success: true,
            total: list.length,
            applications: list,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
