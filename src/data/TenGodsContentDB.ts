/**
 * TenGodsContentDB.ts
 * 
 * 10성(십성, Ten Gods) 기반 심리 분석 및 행동 코칭 데이터
 * 
 * 구조:
 * - code: 영문 코드 (friend, rob_wealth 등)
 * - name: 한자 명칭 (비견, 겁재 등)
 * - alias: 심리 별명 (자아존중, 승부사 등)
 * - shadowTrigger: 그림자 질문 (부정적 패턴 자각)
 * - neuralMission: 뉴럴 코드 미션 (긍정적 행동 처방)
 */

export interface TenGodContent {
    code: string;
    name: string;
    alias: string;
    shadowTrigger: string;
    neuralMission: string;
}

export const TEN_GODS_CONTENT: Record<string, TenGodContent> = {
    // 1. 비견 (Friend) - 자아존중
    friend: {
        code: 'friend',
        name: '비견 (比肩)',
        alias: '자아존중',
        shadowTrigger: '내 고집만 피우다가 주변 사람들과 벽이 생겼나요?',
        neuralMission: "오늘만큼은 친구/동료의 의견에 '네 말이 맞아'라고 해주기"
    },
    // 2. 겁재 (Rob Wealth) - 승부사
    rob_wealth: {
        code: 'rob_wealth',
        name: '겁재 (劫財)',
        alias: '승부사',
        shadowTrigger: '남을 이기려는 질투심 때문에 밤잠을 설치나요?',
        neuralMission: '나의 라이벌이나 싫어하는 사람의 장점 딱 1가지만 칭찬하기'
    },
    // 3. 식신 (Eating God) - 연구가
    eating_god: {
        code: 'eating_god',
        name: '식신 (食神)',
        alias: '연구가',
        shadowTrigger: '좋아하는 일에만 빠져서 정작 해야 할 일을 미뤘나요?',
        neuralMission: '하기 싫은 의무(청소, 설거지, 서류작업)를 딱 10분만 먼저 하기'
    },
    // 4. 상관 (Hurting Officer) - 혁명가
    hurting_officer: {
        code: 'hurting_officer',
        name: '상관 (傷官)',
        alias: '혁명가',
        shadowTrigger: '욱하는 마음에 상사나 배우자에게 독설을 날렸나요?',
        neuralMission: '화가 날 때 입을 닫고, 스마트폰 메모장에 감정을 글로 적기'
    },
    // 5. 편재 (Indirect Wealth) - 전략가
    indirect_wealth: {
        code: 'indirect_wealth',
        name: '편재 (偏財)',
        alias: '전략가',
        shadowTrigger: '결과와 이익만 쫓다가 과정의 즐거움을 짓밟았나요?',
        neuralMission: '계산기 두드리지 말고, 오늘 만나는 사람에게 조건 없이 커피 쏘기'
    },
    // 6. 정재 (Direct Wealth) - 관리자
    direct_wealth: {
        code: 'direct_wealth',
        name: '정재 (正財)',
        alias: '관리자',
        shadowTrigger: '100원짜리 하나까지 따지다가 소중한 사람을 질리게 했나요?',
        neuralMission: "가계부 덮고 나 자신을 위해 '쓸모없는 예쁜 것' 하나 사주기"
    },
    // 7. 편관 (Seven Killings / Indirect Power) - 해결사
    seven_killings: {
        code: 'seven_killings',
        name: '편관 (偏官)',
        alias: '해결사',
        shadowTrigger: '남의 시선과 체면 때문에 싫은 부탁을 억지로 떠맡았나요?',
        neuralMission: "미안한 표정 짓지 말고 정중하고 단호하게 'No'라고 거절하기"
    },
    // 8. 정관 (Direct Officer) - 판사
    direct_officer: {
        code: 'direct_officer',
        name: '정관 (正官)',
        alias: '판사',
        shadowTrigger: '정해진 규칙대로 안 되면 견딜 수 없이 불안한가요?',
        neuralMission: '넥타이 풀고(편한 옷 입고), 계획 없이 1시간 동안 멍 때리기'
    },
    // 9. 편인 (Indirect Resource) - 철학자
    indirect_resource: {
        code: 'indirect_resource',
        name: '편인 (偏印)',
        alias: '철학자',
        shadowTrigger: '의심과 꼬리에 꼬리를 무는 생각으로 나만의 감옥에 갇혔나요?',
        neuralMission: '생각을 멈추고 밖으로 나가 햇볕을 쬐며 30분간 빠르게 걷기'
    },
    // 10. 정인 (Direct Resource) - 어린아이
    direct_resource: {
        code: 'direct_resource',
        name: '정인 (正印)',
        alias: '어린아이',
        shadowTrigger: '남이 알아서 챙겨주길 바라며 서운해하고 있나요?',
        neuralMission: '기다리지 말고 내가 먼저 부모님(또는 멘토)께 안부 전화하기'
    }
};

/**
 * [Helper] 일간(DayMaster)과 오늘의 일진(TodayStem)으로 십성관계 계산 (간단 예시)
 * 실제로는 saju-engine 라이브러리를 사용해야 하지만, 여기서는 개념 구현용으로 남겨둠.
 */
export const getTenGodCode = (dayMaster: string, otherStem: string): string => {
    // TODO: Implement actual lookup logic (10x10 Matrix)
    // This is placeholder for developer integration
    return 'friend';
};
