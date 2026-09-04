import { NextRequest, NextResponse } from 'next/server';

export interface ServerActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    category: string;
    details?: string;
    timestamp: string;
}

// 글로벌 인메모리 액티비티 저장소 (서버 수명주기 동안 보존)
interface ActivityStore {
    logs: ServerActivityLog[];
}

const globalForActivity = globalThis as unknown as { activityStore: ActivityStore };

if (!globalForActivity.activityStore) {
    globalForActivity.activityStore = {
        logs: [
            // 샘플 초기 데이터
            {
                id: 'init_1',
                userId: '010-3849-5982',
                userName: '이경윤 대표님',
                action: '⭐ 오늘의 1:1 일진 선언문 가슴 각인',
                category: 'WATCH',
                details: '신금(辛金) · 갑진(甲辰)일 보석 선언문',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
            },
            {
                id: 'init_2',
                userId: '010-3849-5982',
                userName: '이경윤 대표님',
                action: '🎧 손목 사운드 랩 엠씨스퀘어 청취',
                category: 'SOUND',
                details: '528Hz 기적 3D 바이노럴 서라운드 (L/R 분리)',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
            },
            {
                id: 'init_3',
                userId: '010-3849-5982',
                userName: '이경윤 대표님',
                action: '🫁 4-4-4-4 네이비씰 박스 호흡 완주',
                category: 'BREATH',
                details: '4사이클 완주 (자율신경계 부교감 85% 활성화)',
                timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString()
            }
        ]
    };
}

const activityStore = globalForActivity.activityStore;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, userId, userName, action, category, details, timestamp } = body;

        if (!userId || !action) {
            return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
        }

        const logEntry: ServerActivityLog = {
            id: id || 'act_' + Date.now(),
            userId: String(userId),
            userName: userName || '익명 고객',
            action: String(action),
            category: category || 'WATCH',
            details: details || '',
            timestamp: timestamp || new Date().toISOString()
        };

        // 최신순으로 맨 앞에 삽입, 최대 1000개 보존
        activityStore.logs.unshift(logEntry);
        if (activityStore.logs.length > 1000) {
            activityStore.logs.pop();
        }

        return NextResponse.json({ success: true, loggedId: logEntry.id });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const targetUserId = searchParams.get('userId');

        let logs = activityStore.logs;

        if (targetUserId) {
            const query = targetUserId.toLowerCase();
            logs = logs.filter(
                (l) =>
                    l.userId.toLowerCase().includes(query) ||
                    (l.userName && l.userName.toLowerCase().includes(query))
            );
        }

        // 통계 계산
        const totalCount = logs.length;
        const categoryCounts: Record<string, number> = {};
        const actionCounts: Record<string, number> = {};

        logs.forEach((l) => {
            categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
            actionCounts[l.action] = (actionCounts[l.action] || 0) + 1;
        });

        // 가장 많이 사용한 기능 Top 3
        const topActions = Object.entries(actionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([action, count]) => ({ action, count }));

        return NextResponse.json({
            success: true,
            totalCount,
            topActions,
            categoryCounts,
            logs: logs.slice(0, 100) // 최근 100개 반환
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
    }
}
