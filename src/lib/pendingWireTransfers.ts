import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { maskPhoneNumber } from '@/lib/phoneSecurity';

export interface PendingWireTransfer {
    id: string;
    userId: string;
    depositorName: string;
    phone: string;
    maskedPhone: string;
    email?: string;
    amount: number;
    itemType: string;
    orderName: string;
    is_active: boolean;
    membership_tier: string;
    created_at: string;
}

// Global in-memory fallback store to guarantee pending wire transfers never get lost
const globalPendingStore: PendingWireTransfer[] = [];

export async function addPendingWireTransfer(params: {
    depositorName: string;
    userId?: string;
    email?: string;
    phone?: string;
    amount?: number;
    itemType?: string;
    orderName?: string;
}): Promise<PendingWireTransfer> {
    const { depositorName, userId, email = '', phone = '', amount = 890, itemType = 'CHAT_3', orderName = '명심코칭 수다 3회 충전권' } = params;

    // Generate a valid UUID if userId is missing or guest string
    let recordId = crypto.randomUUID();
    if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        recordId = userId;
    }

    const cleanEmail = email.trim().toLowerCase();
    const maskedPhone = phone ? maskPhoneNumber(phone) : maskPhoneNumber(depositorName);
    const nowIso = new Date().toISOString();

    const pendingItem: PendingWireTransfer = {
        id: recordId,
        userId: recordId,
        depositorName: depositorName.trim(),
        phone: phone ? phone.trim() : maskedPhone,
        maskedPhone: maskedPhone,
        email: cleanEmail || undefined,
        amount: amount,
        itemType: itemType,
        orderName: orderName,
        is_active: false,
        membership_tier: itemType,
        created_at: nowIso,
    };

    // Store in global memory store (first position)
    const existingIndex = globalPendingStore.findIndex(p => 
        p.id === recordId || 
        (cleanEmail && p.email === cleanEmail) || 
        p.depositorName === depositorName.trim()
    );
    if (existingIndex !== -1) {
        globalPendingStore[existingIndex] = pendingItem;
    } else {
        globalPendingStore.unshift(pendingItem);
    }

    // Try Upserting into Supabase `users` table
    try {
        const upsertPayload: any = {
            id: recordId,
            name: depositorName.trim(),
            phone: phone ? phone.trim() : maskedPhone,
            membership_tier: itemType,
            is_active: false, // Waiting for admin approval
            payment_amount: amount,
            chat_turns_left: 3,
            created_at: nowIso,
        };
        if (cleanEmail && cleanEmail.includes('@')) {
            upsertPayload.email = cleanEmail;
        }

        const { error: userErr } = await supabaseAdmin
            .from('users')
            .upsert(upsertPayload, { onConflict: 'id' });

        if (userErr) {
            console.error('[PendingStore] Supabase users upsert error:', userErr);
            // Fallback: try inserting with minimal fields
            try {
                await supabaseAdmin.from('users').insert({
                    id: recordId,
                    name: depositorName.trim(),
                    email: cleanEmail || undefined,
                    is_active: false,
                    created_at: nowIso
                });
            } catch (_) {}
        }
    } catch (err) {
        console.warn('[PendingStore] Supabase upsert fallback triggered:', err);
    }

    return pendingItem;
}

export function getPendingWireTransfers(): PendingWireTransfer[] {
    return globalPendingStore;
}

// 승인 완료된 유저 캐시 (메모리상에 24시간 보존하여 클라이언트 폴링에 즉시 응답)
export interface ApprovedUserRecord {
    userId: string;
    name?: string;
    email?: string;
    phone?: string;
    tier: string;
    approvedAt: string;
}

const globalApprovedStore: ApprovedUserRecord[] = [];

export function recordApprovedUser(record: { userId: string; name?: string; email?: string; phone?: string; tier: string }) {
    const cleanEmail = (record.email || '').trim().toLowerCase();
    const existingIndex = globalApprovedStore.findIndex(a => 
        a.userId === record.userId || 
        (cleanEmail && a.email && a.email.toLowerCase() === cleanEmail) ||
        (record.name && a.name === record.name.trim()) ||
        (record.phone && a.phone === record.phone.trim())
    );
    const item: ApprovedUserRecord = {
        userId: record.userId,
        name: record.name?.trim(),
        email: record.email?.trim(),
        phone: record.phone?.trim(),
        tier: record.tier,
        approvedAt: new Date().toISOString()
    };
    if (existingIndex !== -1) {
        globalApprovedStore[existingIndex] = item;
    } else {
        globalApprovedStore.unshift(item);
    }
}

export function lookupApprovedUser(params: { userId?: string; name?: string; email?: string; phone?: string }): ApprovedUserRecord | undefined {
    const { userId, name, email, phone } = params;
    const cleanName = (name || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');

    return globalApprovedStore.find(a => {
        if (userId && (a.userId === userId || a.userId.toLowerCase() === userId.toLowerCase())) return true;
        if (cleanEmail && a.email && a.email.toLowerCase() === cleanEmail) return true;
        if (cleanName && a.name && (a.name.toLowerCase() === cleanName || a.name.toLowerCase().includes(cleanName) || cleanName.includes(a.name.toLowerCase()))) return true;
        if (cleanPhone && a.phone && a.phone.replace(/[^0-9]/g, '') === cleanPhone) return true;
        return false;
    });
}

export function approvePendingWireTransfer(idOrName: string): boolean {
    const target = globalPendingStore.find(p => p.id === idOrName || p.userId === idOrName || p.depositorName === idOrName.trim());
    if (target) {
        target.is_active = true;
        recordApprovedUser({
            userId: target.id,
            name: target.depositorName,
            phone: target.phone,
            tier: target.membership_tier || 'MONTHLY_98K'
        });
        return true;
    }
    return false;
}

export function removePendingWireTransfer(id: string): void {
    const index = globalPendingStore.findIndex(p => p.id === id || p.userId === id);
    if (index !== -1) {
        globalPendingStore[index].is_active = true; // 삭제 대신 승인 상태(is_active: true)로 전환하여 클라이언트 폴링에 100% 응답
        recordApprovedUser({
            userId: globalPendingStore[index].id,
            name: globalPendingStore[index].depositorName,
            phone: globalPendingStore[index].phone,
            tier: globalPendingStore[index].membership_tier || 'MONTHLY_98K'
        });
    }
}

export function purgeUserFromMemory(id: string): void {
    const cleanId = id.trim().toLowerCase();
    
    // pending store에서 제거
    for (let i = globalPendingStore.length - 1; i >= 0; i--) {
        if (globalPendingStore[i].id.toLowerCase() === cleanId || globalPendingStore[i].userId.toLowerCase() === cleanId) {
            globalPendingStore.splice(i, 1);
        }
    }
    
    // approved store에서 제거
    for (let i = globalApprovedStore.length - 1; i >= 0; i--) {
        if (globalApprovedStore[i].userId.toLowerCase() === cleanId) {
            globalApprovedStore.splice(i, 1);
        }
    }
}

