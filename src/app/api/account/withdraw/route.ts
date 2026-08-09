/**
 * [회원탈퇴 서버 API] - /api/account/withdraw
 * 
 * [삭제 동작 순서 및 이유]
 * 1. 유저 데이터 파기: DB 내 유저의 사주 분석 리포트, 코칭 대화 이력, 결제 내역, 동의 이력 파기
 * 2. 유저 프로필 파기: users / user_profiles 내 정보 삭제
 * 3. Auth 계정 삭제: supabaseAdmin.auth.admin.deleteUser(uid)로 소셜/이메일 계정 최종 파기
 * 
 * ※ 데이터 파기 순서가 중요한 이유:
 * Auth 계정을 먼저 삭제해버리면 DB에 남아있는 개별 유저 데이터(uid 기준)를 참조하거나
 * 안전하게 트랜잭션/반복문으로 찾아 지울 수 없기 때문입니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // 1. 로그인 유저 검증 (Require User)
        const supabase = await createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session || !session.user) {
            return NextResponse.json(
                { success: false, error: '인증되지 않은 사용자입니다. 로그인 후 다시 시도해주세요.' },
                { status: 401 }
            );
        }

        const uid = session.user.id;

        // 2. 유저가 작성/생성한 연관 DB 데이터 파기
        const userTables = [
            'coaching_logs',
            'daily_matrices',
            'user_reports',
            'user_consents',
            'consent_history',
            'user_profiles',
            'users'
        ];

        for (const table of userTables) {
            try {
                await supabaseAdmin
                    .from(table)
                    .delete()
                    .eq('user_id', uid);

                await supabaseAdmin
                    .from(table)
                    .delete()
                    .eq('id', uid);
            } catch (tableErr) {
                console.warn(`[Withdraw] Table ${table} cleanup warning:`, tableErr);
            }
        }

        // 3. Supabase Auth 관리자 API를 통한 계정 삭제 (Auth User Deletion)
        const { error: deleteAuthErr } = await supabaseAdmin.auth.admin.deleteUser(uid);

        if (deleteAuthErr) {
            console.error('[Withdraw] Auth delete error:', deleteAuthErr);
            return NextResponse.json(
                { success: false, error: '계정 삭제 중 오류가 발생했습니다: ' + deleteAuthErr.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '회원탈퇴 및 데이터 파기가 성공적으로 완료되었습니다.'
        });

    } catch (error: any) {
        console.error('[Withdraw API Critical Error]:', error);
        return NextResponse.json(
            { success: false, error: error?.message || '회원탈퇴 처리 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
