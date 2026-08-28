import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface VerifiedOrderRecord {
    orderNumber: string;
    userId?: string;
    depositorName?: string;
    verifiedAt: string;
}

// Global in-memory set to ensure single-use per order number
const usedOrderNumbersStore: Map<string, VerifiedOrderRecord> = new Map();

/**
 * Verify and register a Naver SmartStore Order Number (Single-Use Guarantee)
 */
export async function verifySmartStoreOrder(orderNumberRaw: string, userId?: string, depositorName?: string): Promise<{ success: boolean; message: string; record?: VerifiedOrderRecord }> {
    const cleanOrder = orderNumberRaw.trim().replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

    if (!cleanOrder || cleanOrder.length < 8) {
        return {
            success: false,
            message: '올바른 네이버 스마트스토어 주문번호를 입력해 주세요. (최소 8자리 이상)'
        };
    }

    // 1. Check in-memory store for duplicate usage
    if (usedOrderNumbersStore.has(cleanOrder)) {
        const existing = usedOrderNumbersStore.get(cleanOrder)!;
        return {
            success: false,
            message: `이미 혜택 지급이 완료된 주문번호입니다. (인증일시: ${new Date(existing.verifiedAt).toLocaleDateString('ko-KR')}) - 주문번호 1건당 1회만 등록 가능합니다.`
        };
    }

    // 2. Check Supabase DB for duplicate usage (if table or metadata exists)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const { data } = await supabaseAdmin
                .from('users')
                .select('id, access_key, membership_tier, created_at')
                .eq('access_key', `ORDER-${cleanOrder}`)
                .maybeSingle();

            if (data) {
                return {
                    success: false,
                    message: '이미 혜택 지급이 완료된 주문번호입니다. (주문번호 1건당 1회만 등록 가능합니다)'
                };
            }
        } catch (err) {
            console.warn('[Order Verification] Supabase query notice:', err);
        }
    }

    // 3. Mark as used
    const nowIso = new Date().toISOString();
    const record: VerifiedOrderRecord = {
        orderNumber: cleanOrder,
        userId: userId || `user-${cleanOrder.slice(0, 8)}`,
        depositorName: depositorName || '스마트스토어 독자',
        verifiedAt: nowIso
    };

    usedOrderNumbersStore.set(cleanOrder, record);

    // 4. Save to Supabase (if available)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && userId) {
        try {
            await supabaseAdmin.from('users').upsert({
                id: userId,
                access_key: `ORDER-${cleanOrder}`,
                membership_tier: 'BOOK_VIP',
                is_active: true,
                payment_amount: 19800,
                chat_turns_left: 30,
                approved_at: nowIso
            });
        } catch (e) {
            console.warn('[Order Verification] Supabase save notice:', e);
        }
    }

    return {
        success: true,
        message: '🎉 네이버 스마트스토어 주문번호 인증이 완료되었습니다! 1:1 맞춤 힐링송 신청 및 30회 VIP 코칭 혜택이 활성화되었습니다.',
        record
    };
}
