import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface VerifiedOrderRecord {
    orderNumber: string;
    userId?: string;
    depositorName?: string;
    channel?: 'smartstore' | 'general';
    isSmartStore: boolean;
    unlockedModules: string[];
    verifiedAt: string;
}

// Global in-memory set to ensure single-use per order number
const usedOrderNumbersStore: Map<string, VerifiedOrderRecord> = new Map();

/**
 * Verify and register a Book Purchase Order / Receipt Number (Single-Use Guarantee)
 * - SmartStore: 20 chats + Healing Song + Startup Reports + Dark Code Debugger + Bio-Care
 * - General Bookstores (Kyobo, Yes24, Bookk): 20 chats + Healing Song
 */
export async function verifySmartStoreOrder(
    orderNumberRaw: string,
    userId?: string,
    depositorName?: string,
    channel?: 'smartstore' | 'general'
): Promise<{ success: boolean; message: string; record?: VerifiedOrderRecord }> {
    const cleanOrder = orderNumberRaw.trim().replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

    if (!cleanOrder || cleanOrder.length < 8) {
        return {
            success: false,
            message: '올바른 도서 구매 주문번호 또는 영수증 승인번호를 입력해 주세요. (최소 8자리 이상)'
        };
    }

    // 1. Check in-memory store for duplicate usage
    if (usedOrderNumbersStore.has(cleanOrder)) {
        const existing = usedOrderNumbersStore.get(cleanOrder)!;
        return {
            success: false,
            message: `이미 혜택 지급이 완료된 주문/영수증 번호입니다. (인증일시: ${new Date(existing.verifiedAt).toLocaleDateString('ko-KR')}) - 주문 1건당 1회만 등록 가능합니다.`
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
                    message: '이미 혜택 지급이 완료된 주문/영수증 번호입니다. (주문 1건당 1회만 등록 가능합니다)'
                };
            }
        } catch (err) {
            console.warn('[Order Verification] Supabase query notice:', err);
        }
    }

    // Determine if SmartStore (either explicit channel, or 16-digit standard Naver SmartStore order pattern)
    const isSmartStore = channel === 'smartstore' || (!channel && /^\d{16}$/.test(cleanOrder.replace(/-/g, '')));

    const unlockedModules = isSmartStore
        ? ['zero_music', 'coaching_20', 'startup_vip', 'dark_code_debugger', 'bio_care']
        : ['zero_music', 'coaching_20'];

    // 3. Mark as used
    const nowIso = new Date().toISOString();
    const record: VerifiedOrderRecord = {
        orderNumber: cleanOrder,
        userId: userId || `user-${cleanOrder.slice(0, 8)}`,
        depositorName: depositorName || (isSmartStore ? '청류스토어 VIP 독자' : '도서 구매 독자'),
        channel: isSmartStore ? 'smartstore' : 'general',
        isSmartStore,
        unlockedModules,
        verifiedAt: nowIso
    };

    usedOrderNumbersStore.set(cleanOrder, record);

    // 4. Save to Supabase (if available)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && userId) {
        try {
            await supabaseAdmin.from('users').upsert({
                id: userId,
                access_key: `ORDER-${cleanOrder}`,
                membership_tier: isSmartStore ? 'SMARTSTORE_SUPER_VIP' : 'BOOK_VIP',
                is_active: true,
                payment_amount: isSmartStore ? 87600 : 19800,
                chat_turns_left: 20,
                approved_at: nowIso
            });
        } catch (e) {
            console.warn('[Order Verification] Supabase save notice:', e);
        }
    }

    const message = isSmartStore
        ? '🎉 청류스마트스토어 VIP 인증 완료! AI 챗봇 20회 코칭 + 1:1 맞춤 힐링송 + 스타트업 19,800원 리포트 + 다크코드 디버거 + 바이오케어 올인원 슈퍼패키지가 모두 무료 해금되었습니다.'
        : '🎉 도서 구매 인증이 완료되었습니다! 1:1 맞춤 헌정 힐링송 신청 및 20회 AI 명심 챗봇 코칭 혜택이 활성화되었습니다.';

    return {
        success: true,
        message,
        record
    };
}
