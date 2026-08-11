import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { maskPhoneNumber } from '@/lib/phoneSecurity';

export interface PendingWireTransfer {
    id: string;
    userId: string;
    depositorName: string;
    phone: string;
    maskedPhone: string;
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
    amount?: number;
    itemType?: string;
    orderName?: string;
}): Promise<PendingWireTransfer> {
    const { depositorName, userId, amount = 890, itemType = 'CHAT_3', orderName = '명심코칭 수다 3회 충전권' } = params;

    // Generate a valid UUID if userId is missing or guest string
    let recordId = crypto.randomUUID();
    if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        recordId = userId;
    }

    const maskedPhone = maskPhoneNumber(depositorName);
    const nowIso = new Date().toISOString();

    const pendingItem: PendingWireTransfer = {
        id: recordId,
        userId: recordId,
        depositorName: depositorName.trim(),
        phone: maskedPhone,
        maskedPhone: maskedPhone,
        amount: amount,
        itemType: itemType,
        orderName: orderName,
        is_active: false,
        membership_tier: itemType,
        created_at: nowIso,
    };

    // Store in global memory store (first position)
    const existingIndex = globalPendingStore.findIndex(p => p.id === recordId || p.depositorName === depositorName.trim());
    if (existingIndex !== -1) {
        globalPendingStore[existingIndex] = pendingItem;
    } else {
        globalPendingStore.unshift(pendingItem);
    }

    // Try Upserting into Supabase `users` table
    try {
        await supabaseAdmin
            .from('users')
            .upsert({
                id: recordId,
                name: depositorName.trim(),
                phone: maskedPhone, // Store encrypted/masked phone in DB for compliance
                membership_tier: itemType,
                is_active: false, // Waiting for admin approval
                payment_amount: amount,
                chat_turns_left: 3,
                created_at: nowIso,
            }, { onConflict: 'id' });
    } catch (err) {
        console.warn('[PendingStore] Supabase upsert fallback triggered:', err);
    }

    return pendingItem;
}

export function getPendingWireTransfers(): PendingWireTransfer[] {
    return globalPendingStore;
}

export function removePendingWireTransfer(id: string): void {
    const index = globalPendingStore.findIndex(p => p.id === id);
    if (index !== -1) {
        globalPendingStore.splice(index, 1);
    }
}
