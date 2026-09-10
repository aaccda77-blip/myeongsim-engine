import dotenv from 'dotenv';
import path from 'path';

// .env.local 환경 변수 로드
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import { syncSmartStoreOrders } from '../src/lib/naverCommerceApi';

async function main() {
    console.log('=====================================================');
    console.log('🛒 [네이버 스마트스토어 - 명심코칭 도서관 주문 동기화]');
    console.log('=====================================================');
    console.log(`⏱️ 동기화 시작 시각: ${new Date().toLocaleString('ko-KR')}`);

    try {
        // 최근 30일간의 주문 내역 동기화
        const result = await syncSmartStoreOrders(30);

        if (result.success) {
            console.log(`\n✅ 동기화 완료!`);
            console.log(`📊 수집/동기화된 주문 건수: ${result.syncedCount} 건`);
            if (result.orders.length > 0) {
                console.log('\n[최신 동기화 주문 목록]');
                result.orders.forEach((ord, idx) => {
                    console.log(`  ${idx + 1}. [${ord.orderId}] ${ord.ordererName} 님 - ${ord.productName} (${ord.orderStatus})`);
                });
            } else {
                console.log('ℹ️ 최근 신규 주문이 없습니다.');
            }
        } else {
            console.error(`\n❌ 동기화 실패: ${result.message}`);
        }
    } catch (err: any) {
        console.error('\n🚨 치명적 오류 발생:', err.message);
    }
    console.log('=====================================================\n');
}

main();
