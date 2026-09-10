import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import { verifySmartStoreOrder } from '../src/lib/orderVerification';

async function runSecurityTest() {
    console.log('🛡️ [스마트스토어 가짜 주문번호 차단 보안 검증 테스트]');
    console.log('----------------------------------------------------');

    // 테스트 1: 가짜 16자리 주문번호 입력 시
    console.log('1. 임의로 만든 가짜 16자리 번호 입력 테스트:');
    const fakeOrder = '2026091098765432';
    const fakeResult = await verifySmartStoreOrder(fakeOrder, 'fake-user', '홍길동', 'smartstore');
    console.log(`   결과: ${fakeResult.success ? '🚨 승인됨 (실패)' : '✅ 차단됨 (성공)'}`);
    console.log(`   메시지: ${fakeResult.message}\n`);

    // 테스트 2: 관리자 테스트 마스터키 입력 시
    console.log('2. 관리자 마스터키 입력 테스트:');
    const masterOrder = 'VIP-FREEPASS';
    const masterResult = await verifySmartStoreOrder(masterOrder, 'admin-user', '관리자', 'smartstore');
    console.log(`   결과: ${masterResult.success ? '✅ 정상 승인 (성공)' : '❌ 차단됨 (실패)'}`);
    console.log(`   메시지: ${masterResult.message}\n`);

    console.log('----------------------------------------------------');
}

runSecurityTest();
