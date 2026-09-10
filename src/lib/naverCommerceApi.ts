import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import fs from 'fs';
import path from 'path';

export interface SmartStoreOrderData {
    orderId: string;
    productOrderId: string;
    ordererName: string;
    ordererId?: string;
    productId?: string;
    productName: string;
    quantity: number;
    totalPaymentAmount: number;
    orderStatus: string;
    paymentDate: string;
    isClaimed?: boolean;
    claimedAt?: string;
    claimedBy?: string;
    drmSerialKey?: string;
    rawData?: any;
}

// 메모리 토큰 캐시
let cachedToken: {
    accessToken: string;
    expiresAt: number;
} | null = null;

/**
 * 🔐 네이버 커머스 API OAuth 2.0 Access Token 발급 (전자서명 포함)
 */
export async function getNaverCommerceToken(): Promise<string> {
    const clientId = process.env.NAVER_COMMERCE_CLIENT_ID || '40gBV2fYdPUFuOXKR6iwEM';
    const clientSecret = process.env.NAVER_COMMERCE_CLIENT_SECRET || '$2a$04$GuRC2CKqk1YA2s22vM0pb.';

    // 캐시된 유효 토큰이 있는 경우 (만료 60초 전까지 재사용)
    if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
        return cachedToken.accessToken;
    }

    const timestamp = Date.now().toString();
    const password = `${clientId}_${timestamp}`;

    // 네이버 표준 bcrypt 서명 생성 후 Base64 인코딩
    const hashed = bcrypt.hashSync(password, clientSecret);
    const signature = Buffer.from(hashed, 'utf-8').toString('base64');

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('timestamp', timestamp);
    params.append('client_secret_sign', signature);
    params.append('grant_type', 'client_credentials');
    params.append('type', 'SELF');

    const response = await fetch('https://api.commerce.naver.com/external/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
        console.error('[NaverCommerceAPI] Token issuance failed:', data);
        throw new Error(data.message || `네이버 커머스 API 토큰 발급 실패 (${response.status})`);
    }

    const expiresIn = (data.expires_in || 10800) * 1000;
    cachedToken = {
        accessToken: data.access_token,
        expiresAt: Date.now() + expiresIn
    };

    return data.access_token;
}

/**
 * 📁 로컬 영구 백업 저장소 (Supabase 미연결/오류 시에도 무중단 동작 보장)
 */
function getLocalOrders(): Map<string, SmartStoreOrderData> {
    const map = new Map<string, SmartStoreOrderData>();
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'smartstore_orders.json');
        if (fs.existsSync(filePath)) {
            const list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (Array.isArray(list)) {
                list.forEach((item: SmartStoreOrderData) => {
                    if (item && item.orderId) map.set(item.orderId.toUpperCase(), item);
                });
            }
        }
    } catch (e) {
        console.warn('[NaverCommerce] Local store read notice:', e);
    }
    return map;
}

function saveLocalOrders(orders: SmartStoreOrderData[]) {
    try {
        const dirPath = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        const filePath = path.join(dirPath, 'smartstore_orders.json');

        const map = getLocalOrders();
        orders.forEach(o => map.set(o.orderId.toUpperCase(), o));

        const list = Array.from(map.values());
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {
        console.error('[NaverCommerce] Local store write error:', e);
    }
}

/**
 * 🛒 네이버 스마트스토어 최근 주문 조회 및 Supabase / 로컬 DB 동기화
 * @param daysAgo 조회할 최근 일수 (기본 7일, 최대 30일)
 */
export async function syncSmartStoreOrders(daysAgo: number = 7): Promise<{
    success: boolean;
    syncedCount: number;
    orders: SmartStoreOrderData[];
    message?: string;
}> {
    try {
        const token = await getNaverCommerceToken();
        const fromDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

        // 1. 최근 주문 상태 변경 내역 조회
        const statusUrl = `https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/last-changed-statuses?lastChangedFrom=${encodeURIComponent(fromDate)}&lastChangedType=PAYED`;
        const statusRes = await fetch(statusUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!statusRes.ok) {
            const errData = await statusRes.json().catch(() => ({}));
            console.warn('[NaverCommerce] Last-changed status query notice:', errData);
            return {
                success: false,
                syncedCount: 0,
                orders: [],
                message: errData.message || `네이버 주문 내역 조회 실패 (${statusRes.status})`
            };
        }

        const statusData = await statusRes.json();
        const rawStatuses = statusData.data?.lastChangeStatuses || [];

        if (rawStatuses.length === 0) {
            return {
                success: true,
                syncedCount: 0,
                orders: [],
                message: '최근 변경된 신규 주문이 없습니다.'
            };
        }

        // 중복 제거된 productOrderId 목록 추출
        const productOrderIds: string[] = Array.from(
            new Set(rawStatuses.map((s: any) => s.productOrderId).filter(Boolean))
        );

        // 2. 상품 주문 상세 조회 (최대 300건 배치)
        const batchIds = productOrderIds.slice(0, 100);
        const detailRes = await fetch('https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productOrderIds: batchIds })
        });

        if (!detailRes.ok) {
            const errData = await detailRes.json().catch(() => ({}));
            return {
                success: false,
                syncedCount: 0,
                orders: [],
                message: errData.message || `상품 주문 상세 조회 실패 (${detailRes.status})`
            };
        }

        const detailData = await detailRes.json();
        const productOrders = detailData.data || [];

        const syncedOrders: SmartStoreOrderData[] = productOrders.map((item: any) => {
            const po = item.productOrder || {};
            const ord = item.order || {};
            return {
                orderId: ord.orderId || po.orderId || '',
                productOrderId: po.productOrderId || '',
                ordererName: ord.ordererName || '스마트스토어 구매자',
                ordererId: ord.ordererId || '',
                productId: po.productId || '',
                productName: po.productName || 'ZERO POINT 제로 포인트',
                quantity: po.quantity || 1,
                totalPaymentAmount: po.totalPaymentAmount || ord.generalPaymentAmount || 0,
                orderStatus: po.productOrderStatus || 'PAYED',
                paymentDate: ord.paymentDate || po.paymentDate || new Date().toISOString(),
                rawData: item
            };
        });

        // 3. Supabase DB에 저장 (Upsert)
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && syncedOrders.length > 0) {
            try {
                const upsertPayload = syncedOrders.map(o => ({
                    order_id: o.orderId,
                    product_order_id: o.productOrderId,
                    orderer_name: o.ordererName,
                    orderer_id: o.ordererId,
                    product_id: o.productId,
                    product_name: o.productName,
                    quantity: o.quantity,
                    total_payment_amount: o.totalPaymentAmount,
                    order_status: o.orderStatus,
                    payment_date: o.paymentDate,
                    raw_data: o.rawData,
                    updated_at: new Date().toISOString()
                }));

                const { error } = await supabaseAdmin
                    .from('smartstore_orders')
                    .upsert(upsertPayload, { onConflict: 'order_id', ignoreDuplicates: false });

                if (error) {
                    console.warn('[NaverCommerce] Supabase upsert notice:', error.message);
                }
            } catch (dbErr) {
                console.warn('[NaverCommerce] Supabase db notice:', dbErr);
            }
        }

        // 4. 로컬 JSON에도 영구 동기화 백업
        saveLocalOrders(syncedOrders);

        return {
            success: true,
            syncedCount: syncedOrders.length,
            orders: syncedOrders,
            message: `🎉 네이버 스마트스토어 주문 ${syncedOrders.length}건이 성공적으로 동기화되었습니다!`
        };
    } catch (error: any) {
        console.error('[NaverCommerce] Sync error:', error);
        return {
            success: false,
            syncedCount: 0,
            orders: [],
            message: error.message || '네이버 주문 동기화 중 오류가 발생했습니다.'
        };
    }
}

/**
 * 🔍 특정 주문번호가 네이버 스마트스토어 결제 완료 정품인지 확인
 */
export async function findSmartStoreOrder(orderNumberRaw: string): Promise<{
    found: boolean;
    order?: SmartStoreOrderData;
    isClaimed?: boolean;
}> {
    const cleanOrder = orderNumberRaw.trim().replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

    // 1. Supabase DB에서 조회
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const { data, error } = await supabaseAdmin
                .from('smartstore_orders')
                .select('*')
                .eq('order_id', cleanOrder)
                .maybeSingle();

            if (!error && data) {
                return {
                    found: true,
                    isClaimed: Boolean(data.is_claimed),
                    order: {
                        orderId: data.order_id,
                        productOrderId: data.product_order_id,
                        ordererName: data.orderer_name,
                        productName: data.product_name,
                        quantity: data.quantity,
                        totalPaymentAmount: data.total_payment_amount,
                        orderStatus: data.order_status,
                        paymentDate: data.payment_date,
                        isClaimed: data.is_claimed,
                        claimedAt: data.claimed_at,
                        claimedBy: data.claimed_by,
                        drmSerialKey: data.drm_serial_key
                    }
                };
            }
        } catch (e) {
            console.warn('[NaverCommerce] Supabase order find notice:', e);
        }
    }

    // 2. 로컬 백업 JSON 저장소에서 조회
    const localMap = getLocalOrders();
    if (localMap.has(cleanOrder)) {
        const o = localMap.get(cleanOrder)!;
        return {
            found: true,
            isClaimed: Boolean(o.isClaimed),
            order: o
        };
    }

    return { found: false };
}

/**
 * 🏷️ 주문번호를 도서관 인증 완료(Claimed) 상태로 업데이트
 */
export async function markOrderAsClaimed(
    orderNumber: string,
    claimedBy: string,
    drmSerialKey: string
): Promise<boolean> {
    const cleanOrder = orderNumber.trim().replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
    const nowIso = new Date().toISOString();

    // 1. Supabase 업데이트
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            await supabaseAdmin
                .from('smartstore_orders')
                .update({
                    is_claimed: true,
                    claimed_at: nowIso,
                    claimed_by: claimedBy,
                    drm_serial_key: drmSerialKey
                })
                .eq('order_id', cleanOrder);
        } catch (e) {
            console.warn('[NaverCommerce] Supabase mark claimed notice:', e);
        }
    }

    // 2. 로컬 저장소 업데이트
    const localMap = getLocalOrders();
    const existing = localMap.get(cleanOrder);
    if (existing) {
        existing.isClaimed = true;
        existing.claimedAt = nowIso;
        existing.claimedBy = claimedBy;
        existing.drmSerialKey = drmSerialKey;
        saveLocalOrders([existing]);
    }

    return true;
}
