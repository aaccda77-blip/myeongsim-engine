import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPendingWireTransfers, lookupApprovedUser } from '@/lib/pendingWireTransfers';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const name = (searchParams.get('name') || '').trim();
        const userId = (searchParams.get('userId') || '').trim();
        const phone = (searchParams.get('phone') || '').trim();
        const orderNumber = (searchParams.get('orderNumber') || '').trim();

        const cleanName = name.replace('[입금신청]', '').trim();
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const cleanOrder = orderNumber.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

        if (!cleanName && !userId && !cleanPhone && !cleanOrder) {
            return NextResponse.json({ 
                approved: false, 
                needInput: true,
                message: '승인 확인을 위해 성함, 전화번호 또는 주문번호를 입력해 주세요.' 
            });
        }

        // 1. Check in-memory approved store FIRST (Ultra Fast direct hit)
        const approvedCache = lookupApprovedUser({ userId, name: cleanName, phone: cleanPhone });
        if (approvedCache) {
            const isMonthly = approvedCache.tier === 'MONTHLY_98K' || approvedCache.tier?.includes('98000') || approvedCache.tier?.includes('MONTHLY');
            const isBook = approvedCache.tier === 'BOOK_ZERO_POINT' || approvedCache.tier?.includes('BOOK');
            return NextResponse.json({
                approved: true,
                chatTurnsLeft: isMonthly ? 50 : 20,
                tier: approvedCache.tier,
                unlockedModules: isMonthly
                    ? ['all_pass', 'monthly_vip', 'watch_9_dials', 'bio_care', 'zero_music', 'coaching_50', 'report_108']
                    : isBook
                    ? ['book_zero_point', 'today_fortune', 'basic_report', 'zero_music']
                    : ['startup_vip', 'dark_code_debugger', 'bio_care', 'zero_music', 'coaching_20'],
                message: isMonthly
                    ? '🎉 [특허출원 월정액 98,000원 ALL-PASS] 승인 완료! 모든 124개 콘텐츠가 정상 해금되었습니다.'
                    : '📖 [도서 구매자 제로포인트] 승인 완료! 제로포인트 기본 콘텐츠가 정상 해금되었습니다.'
            });
        }

        // 2. Check in-memory pending store
        const pendingItems = getPendingWireTransfers();
        const pending = pendingItems.find(p => {
            if (userId && (p.id === userId || p.userId === userId)) return true;
            if (cleanName && (p.depositorName === cleanName || p.depositorName.includes(cleanName) || cleanName.includes(p.depositorName))) return true;
            if (cleanPhone && p.phone && p.phone.replace(/[^0-9]/g, '') === cleanPhone) return true;
            return false;
        });

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

        // 3. Check persistent verified orders (도서 구매 정품 인증 기록)
        if (cleanOrder) {
            try {
                const orderFilePath = path.join(process.cwd(), 'src', 'data', 'verified_orders.json');
                if (fs.existsSync(orderFilePath)) {
                    const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf-8'));
                    if (Array.isArray(orderData)) {
                        const matchedOrder = orderData.find(o => o.orderNumber?.toUpperCase() === cleanOrder);
                        if (matchedOrder) {
                            return NextResponse.json({
                                approved: true,
                                chatTurnsLeft: 20,
                                tier: 'BOOK_ZERO_POINT',
                                unlockedModules: ['book_zero_point', 'today_fortune', 'basic_report', 'zero_music'],
                                message: '📖 [도서 구매자 제로포인트] 승인 완료! 정품 인증이 확인되어 정상 해금되었습니다.'
                            });
                        }
                    }
                }
            } catch (err) {
                console.warn('[CheckApproval] File check error:', err);
            }
        }

        // 4. Check in Supabase `users` table
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const orConditions: string[] = [];

            if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
                orConditions.push(`id.eq.${userId}`);
            }
            if (cleanName) {
                orConditions.push(`name.ilike.%${cleanName}%`);
            }
            if (cleanPhone && cleanPhone.length >= 7) {
                orConditions.push(`phone.ilike.%${cleanPhone.slice(-7)}%`);
            }
            if (cleanOrder) {
                orConditions.push(`access_key.ilike.%${cleanOrder}%`);
            }

            if (orConditions.length > 0) {
                const { data, error } = await supabaseAdmin
                    .from('users')
                    .select('*')
                    .or(orConditions.join(','));

                if (!error && data && data.length > 0) {
                    const approvedUser = data.find(u => u.is_active === true || (u.chat_turns_left && u.chat_turns_left > 0));
                    if (approvedUser) {
                        const uTier = (approvedUser.membership_tier || '').toUpperCase();
                        const isMonthly = uTier === 'MONTHLY_98K' || uTier.includes('98000') || uTier.includes('MONTHLY') || (approvedUser.payment_amount && approvedUser.payment_amount >= 98000);
                        const isBook = uTier === 'BOOK_ZERO_POINT' || uTier.includes('BOOK') || uTier.includes('ZERO_POINT');
                        const isStartup = !isMonthly && !isBook && (uTier.includes('STARTUP') || (approvedUser.payment_amount && approvedUser.payment_amount >= 19800));

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
        }

        if (pending && !pending.is_active) {
            return NextResponse.json({
                approved: false,
                isPending: true,
                message: '현재 관리자 승인 대기 중입니다. 관리자가 확인하는 즉시 자동으로 열립니다.'
            });
        }

        return NextResponse.json({
            approved: false,
            isPending: false,
            message: '승인 대기 또는 신청 내역을 조회 중입니다. 관리자 확인 후 잠시 후 다시 새로고침을 눌러주세요.'
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
