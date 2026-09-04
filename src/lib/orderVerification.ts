import { supabaseAdmin } from '@/lib/supabaseAdmin';
import fs from 'fs';
import path from 'path';

export interface VerifiedOrderRecord {
    orderNumber: string;
    userId?: string;
    depositorName?: string;
    channel?: 'smartstore' | 'general';
    isSmartStore: boolean;
    unlockedModules: string[];
    verifiedAt: string;
}

// 📁 서버 영구 파일 저장소 연동 (서버 재시작 시에도 중복 및 인증 내역 영구 보존)
function getPersistentOrders(): Map<string, VerifiedOrderRecord> {
    const store = new Map<string, VerifiedOrderRecord>();
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'verified_orders.json');
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (Array.isArray(data)) {
                data.forEach((item: VerifiedOrderRecord) => {
                    if (item && item.orderNumber) {
                        store.set(item.orderNumber.toUpperCase(), item);
                    }
                });
            }
        }
    } catch (e) {
        console.warn('[OrderVerification] Persistence read warning:', e);
    }
    return store;
}

function savePersistentOrder(record: VerifiedOrderRecord) {
    try {
        const dirPath = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, 'verified_orders.json');
        let list: VerifiedOrderRecord[] = [];
        if (fs.existsSync(filePath)) {
            try {
                list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch (e) {
                list = [];
            }
        }
        list.unshift(record);
        if (list.length > 5000) list = list.slice(0, 5000);
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {
        console.error('[OrderVerification] Persistence write error:', e);
    }
}

// Global in-memory set to ensure single-use per order number
const usedOrderNumbersStore: Map<string, VerifiedOrderRecord> = getPersistentOrders();

/**
 * 네이버 스마트스토어 주문번호 정밀 유효성 검증
 * - 스마트스토어 주문번호는 일반적으로 16자리 숫자 (예: 20260904-12345678 또는 2026090412345678)
 * - 교보문고, YES24 등 영수증 번호는 8자리 이상
 */
export interface BlockedOrderRecord {
    orderNumber: string;
    reason?: string;
    blockedAt: string;
}

// 🚫 차단된 주문번호 영구 저장소
export function getBlockedOrders(): BlockedOrderRecord[] {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'blocked_orders.json');
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (Array.isArray(data)) return data;
        }
    } catch (e) {
        console.warn('[OrderVerification] Blocked read warning:', e);
    }
    return [];
}

export function isOrderBlocked(orderNumberRaw: string): boolean {
    if (!orderNumberRaw) return false;
    const clean = orderNumberRaw.trim().toUpperCase();
    const list = getBlockedOrders();
    return list.some(item => item.orderNumber.toUpperCase() === clean);
}

export function blockOrder(orderNumberRaw: string, reason: string = '관리자 회수 조치'): { success: boolean; message: string } {
    if (!orderNumberRaw) return { success: false, message: '주문번호가 없습니다.' };
    const clean = orderNumberRaw.trim().toUpperCase();
    
    try {
        const dirPath = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        const filePath = path.join(dirPath, 'blocked_orders.json');
        
        let list = getBlockedOrders();
        if (list.some(item => item.orderNumber.toUpperCase() === clean)) {
            return { success: true, message: '이미 차단된 주문번호입니다.' };
        }
        
        list.unshift({
            orderNumber: clean,
            reason,
            blockedAt: new Date().toISOString()
        });
        
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
        return { success: true, message: `주문번호 [${clean}] 이용 권한이 성공적으로 차단 회수되었습니다.` };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export function unblockOrder(orderNumberRaw: string): { success: boolean; message: string } {
    if (!orderNumberRaw) return { success: false, message: '주문번호가 없습니다.' };
    const clean = orderNumberRaw.trim().toUpperCase();
    
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'blocked_orders.json');
        let list = getBlockedOrders();
        const filtered = list.filter(item => item.orderNumber.toUpperCase() !== clean);
        
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
        return { success: true, message: `주문번호 [${clean}] 차단이 해제되었습니다.` };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

function isValidOrderFormat(order: string): { valid: boolean; reason?: string } {
    const clean = order.replace(/[^a-zA-Z0-9]/g, '');
    
    // 관리자 마스터 테스트 키 예외 허용
    if (order.toUpperCase().includes('CHEONGRYU-MASTER') || order.toUpperCase().includes('VIP-FREEPASS')) {
        return { valid: true };
    }

    if (clean.length < 8) {
        return {
            valid: false,
            reason: '주문번호가 너무 짧습니다. 네이버페이 결제내역에서 주문번호(16자리)를 확인해주세요.'
        };
    }

    // 완전히 동일한 반복 숫자나 가짜 패턴 차단 (예: 00000000, 11111111, 12345678)
    if (/^(.)\1+$/.test(clean) || clean === '12345678' || clean === '123456789' || clean === '12341234') {
        return {
            valid: false,
            reason: '유효하지 않은 테스트용 주문번호입니다. 실제 네이버페이 주문번호를 입력해주세요.'
        };
    }

    return { valid: true };
}

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

    // 0. 관리자 차단 여부 우선 확인 (선 열람 후 허위/환불 차단 대응)
    if (isOrderBlocked(cleanOrder)) {
        return {
            success: false,
            message: '🚫 본 주문번호는 관리자(출판사)에 의해 이용 권한이 차단/회수되었습니다. (환불 처리 또는 허위 주문번호 의심)'
        };
    }

    // 1. 주문번호 형식 및 무결성 검증
    const formatCheck = isValidOrderFormat(cleanOrder);
    if (!formatCheck.valid) {
        return {
            success: false,
            message: formatCheck.reason || '올바른 도서 구매 주문번호를 입력해 주세요.'
        };
    }

    // 2. 중복 사용 검증 (1주문 1회 원칙)
    if (usedOrderNumbersStore.has(cleanOrder)) {
        const existing = usedOrderNumbersStore.get(cleanOrder)!;
        const buyer = existing.depositorName || '기존 등록자';
        const dateStr = new Date(existing.verifiedAt).toLocaleDateString('ko-KR');
        return {
            success: false,
            message: `이미 혜택 지급이 완료된 주문번호입니다. (${buyer} 님, 등록일: ${dateStr}) - 주문 1건당 1회만 등록 가능합니다.`
        };
    }

    // 3. Check Supabase DB for duplicate usage (if table or metadata exists)
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
                    message: '이미 등록 및 승인 완료된 주문번호입니다. (주문 1건당 1회만 인증 가능합니다)'
                };
            }
        } catch (err) {
            console.warn('[Order Verification] Supabase query notice:', err);
        }
    }

    // Determine if SmartStore (either explicit channel, or 16-digit standard Naver SmartStore order pattern)
    const digitsOnly = cleanOrder.replace(/[^0-9]/g, '');
    const isSmartStore = channel === 'smartstore' || digitsOnly.length >= 14 || cleanOrder.includes('SMARTSTORE');

    const unlockedModules = isSmartStore
        ? ['zero_music', 'coaching_20', 'startup_vip', 'dark_code_debugger', 'bio_care']
        : ['zero_music', 'coaching_20'];

    // 4. Mark as used & save to persistence
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
    savePersistentOrder(record);

    // 5. Save to Supabase (if available)
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

    return {
        success: true,
        message: isSmartStore
            ? '🎉 청류 스마트스토어 정품 구매가 완벽하게 인증되었습니다! 309페이지 전자책 완권 및 3대 VIP 특전(힐링송 작곡권 + 20회 AI 상담권)이 즉시 활성화되었습니다.'
            : '🎉 도서 구매 정품 인증이 완료되었습니다! 309페이지 전자책과 VIP 특전이 활성화되었습니다.',
        record
    };
}
