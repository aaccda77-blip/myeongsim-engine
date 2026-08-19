import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// supabaseAdmin 안전 임포트 (빌드 실패 방지)
let supabaseAdmin: Awaited<typeof import('@/lib/supabaseAdmin')>['supabaseAdmin'] | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('@/lib/supabaseAdmin');
  supabaseAdmin = mod.supabaseAdmin;
} catch {
  console.warn('[nightly-dispatch] supabaseAdmin를 불러올 수 없습니다. 목업 모드로 동작합니다.');
}

// ─── 푸시 메시지 정의 ───────────────────────────
const PUSH_GROUP_A = {
  title: '🌿 오늘 당신이 회수한 10분의 온기',
  body: '오늘 하루, 자신에게 주권을 돌려준 시간이 있었습니다. 그 고요한 용기가 내일의 나를 지킵니다.',
};

const PUSH_GROUP_B = {
  title: '🌙 세상을 구하지 않아도 괜찮았던 하루',
  body: '아무것도 하지 않은 하루도 당신의 하루입니다. 쉬는 것도 회복이고, 멈추는 것도 전진입니다. 내일은 내일의 내가 해줄 거예요.',
};

// ─── 헬퍼: 오늘 날짜 (KST) ──────────────────────
function getTodayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

// ─── POST 핸들러 ─────────────────────────────────
export async function POST() {
  // supabaseAdmin 사용 불가 → 목업 응답
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: true,
      message: '목업 모드: supabaseAdmin이 설정되지 않았습니다.',
      groupA: { count: 0, push: PUSH_GROUP_A },
      groupB: { count: 0, push: PUSH_GROUP_B },
    });
  }

  try {
    const today = getTodayKST();

    // 1) 푸시 알림 활성화된 사용자 조회
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('push_enabled', true);

    if (usersError) {
      throw new Error(`사용자 조회 실패: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: '푸시 대상 사용자가 없습니다.',
        groupA: { count: 0, push: PUSH_GROUP_A },
        groupB: { count: 0, push: PUSH_GROUP_B },
      });
    }

    const userIds = users.map((u) => u.id);

    // 2) 오늘 완료된 집중 세션 조회
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('focus_sessions')
      .select('user_id')
      .in('user_id', userIds)
      .eq('status', 'completed')
      .gte('created_at', `${today}T00:00:00+09:00`)
      .lt('created_at', `${today}T23:59:59+09:00`);

    if (sessionsError) {
      throw new Error(`세션 조회 실패: ${sessionsError.message}`);
    }

    // 오늘 세션을 완료한 유저 집합
    const completedUserIds = new Set(
      (sessions ?? []).map((s) => s.user_id as string)
    );

    // 3) 그룹 분류
    const groupA: string[] = []; // 1회 이상 완료
    const groupB: string[] = []; // 0회 (미완료)

    for (const userId of userIds) {
      if (completedUserIds.has(userId)) {
        groupA.push(userId);
      } else {
        groupB.push(userId);
      }
    }

    // TODO: 실제 FCM / APNs 푸시 전송 로직
    // groupA 사용자에게 PUSH_GROUP_A 전송
    // groupB 사용자에게 PUSH_GROUP_B 전송

    return NextResponse.json({
      success: true,
      groupA: { count: groupA.length, push: PUSH_GROUP_A },
      groupB: { count: groupB.length, push: PUSH_GROUP_B },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
