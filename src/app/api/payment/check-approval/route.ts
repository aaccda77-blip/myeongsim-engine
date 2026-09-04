import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPendingWireTransfers } from '@/lib/pendingWireTransfers';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const name = (searchParams.get('name') || '').trim();
        const userId = (searchParams.get('userId') || '').trim();

        if (!name && !userId) {
            return NextResponse.json({ approved: false, message: '이름 또는 사용자 ID가 필요합니다.' });
        }

        // 1. Check in-memory pending store FIRST (Ultra Fast)
        const pendingItems = getPendingWireTransfers();
        const pending = pendingItems.find(p => 
            (userId && p.id === userId) || 
            (userId && p.userId === userId) ||
            (name && p.depositorName === name) ||
            (name && p.depositorName.includes(name))
        );

        if (pending && pending.is_active) {
            const isMonthly = pending.itemType === 'MONTHLY_98K' || pending.itemType?.includes('98000') || pending.itemType?.includes('MONTHLY') || pending.amount >= 98000;
            const isBook = pending.itemType === 'BOOK_ZERO_POINT' || pending.itemType?.includes('BOOK') || pending.itemType?.includes('ZERO_POINT');
            const isStartup = !isMonthly && !isBook && (pending.itemType?.includes('STARTUP') || pending.amount >= 19800);

            const tier = isMonthly ? 'MONTHLY_98K' : isBook ? 'BOOK_ZERO_POINT' : isStartup ? 'STARTUP_VIP' : (pending.membership_tier || 'CHAT_3');
            const chatTurns = isMonthly ? 50 : isBook ? 20 : isStartup ? 20 : 3;

            return NextResponse.json({
                approved: true,
                chatTurnsLeft: chatTurns,
                tier: tier,
                unlockedModules: isMonthly
                    ? ['all_pass', 'monthly_vip', 'watch_9_dials', 'bio_care', 'zero_music', 'coaching_50', 'report_108']
                    : isBook
                    ? ['book_zero_point', 'today_fortune', 'basic_report', 'zero_music']
                    : isStartup
                    ? ['startup_vip', 'dark_code_debugger', 'bio_care', 'zero_music', 'coaching_20']
                    : ['coaching_3'],
                message: isMonthly
                    ? '🎉 [특허출원 월정액 98,000원 ALL-PASS] 승인 완료! 모든 124개 콘텐츠가 정상 해금되었습니다.'
                    : isBook
                    ? '📖 [도서 구매자 제로포인트] 승인 완료! 제로포인트 기본 콘텐츠가 정상 해금되었습니다.'
                    : isStartup
                    ? '✨ 스타트업 VIP 승인 완료! 스타트업 리포트 + 다크코드 + 바이오케어 + 20회 코칭이 활성화되었습니다.'
                    : '승인이 완료되었습니다! 코칭이 즉시 활성화되었습니다.'
            });
        }

        // 2. Check in Supabase `users` table
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            let query = supabaseAdmin.from('users').select('*');
            if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
                query = query.or(`id.eq.${userId},name.ilike.%${name}%`);
            } else if (name) {
                query = query.ilike('name', `%${name}%`);
            }

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
                const approvedUser = data.find(u => u.is_active === true || u.chat_turns_left > 0);
                if (approvedUser) {
                    const uTier = (approvedUser.membership_tier || '').toUpperCase();
                    const isMonthly = uTier === 'MONTHLY_98K' || uTier.includes('98000') || uTier.includes('MONTHLY') || approvedUser.payment_amount >= 98000;
                    const isBook = uTier === 'BOOK_ZERO_POINT' || uTier.includes('BOOK') || uTier.includes('ZERO_POINT');
                    const isStartup = !isMonthly && !isBook && (uTier.includes('STARTUP') || approvedUser.payment_amount >= 19800);

                    const finalTier = isMonthly ? 'MONTHLY_98K' : isBook ? 'BOOK_ZERO_POINT' : isStartup ? 'STARTUP_VIP' : (approvedUser.membership_tier || 'CHAT_3');
                    const chatTurns = approvedUser.chat_turns_left || (isMonthly ? 50 : isBook ? 20 : isStartup ? 20 : 3);

                    return NextResponse.json({
                        approved: true,
                        chatTurnsLeft: chatTurns,
                        tier: finalTier,
                        unlockedModules: isMonthly
                            ? ['all_pass', 'monthly_vip', 'watch_9_dials', 'bio_care', 'zero_music', 'coaching_50', 'report_108']
                            : isBook
                            ? ['book_zero_point', 'today_fortune', 'basic_report', 'zero_music']
                            : isStartup
                            ? ['startup_vip', 'dark_code_debugger', 'bio_care', 'zero_music', 'coaching_20']
                            : ['coaching_3'],
                        message: isMonthly
                            ? '🎉 [특허출원 월정액 98,000원 ALL-PASS] 승인 완료! 모든 124개 콘텐츠가 정상 해금되었습니다.'
                            : isBook
                            ? '📖 [도서 구매자 제로포인트] 승인 완료! 제로포인트 기본 콘텐츠가 정상 해금되었습니다.'
                            : isStartup
                            ? '✨ 스타트업 VIP 승인 완료! 스타트업 리포트 + 다크코드 + 바이오케어 + 20회 코칭이 활성화되었습니다.'
                            : '승인이 완료되었습니다! 코칭이 즉시 활성화되었습니다.'
                    });
                }
            }
        }

        if (pending && !pending.is_active) {
            return NextResponse.json({
                approved: false,
                isPending: true,
                message: '현재 무통장 입금 확인 중입니다. 1~5분 이내 승인됩니다.'
            });
        }

        return NextResponse.json({
            approved: false,
            isPending: false,
            message: '입금 신청 기록을 찾을 수 없습니다.'
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
