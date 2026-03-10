export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface GyeokgukRule {
    id: string;
    name: string;
    job_recommendation: string;
    strategy: string;
}

export const GYEOKGUK_DATA: GyeokgukRule[] = [
    { id: 'sikshin', name: '식신격 (전문가)', job_recommendation: "연구원, 개발자, 요리사, 예술가", strategy: "한 우물만 파는 장인이 되세요. 당신의 '기술'이 곧 돈입니다." },
    { id: 'sangwan', name: '상관격 (혁명가)', job_recommendation: "유튜버, 강사, 기획자, 언론인", strategy: "말로 먹고사는 일이 천직입니다. 튀는 아이디어와 언변으로 승부하세요." },
    { id: 'pyunjae', name: '편재격 (사업가)', job_recommendation: "무역, 사업가, 투자가, 유통", strategy: "월급쟁이는 안 맞습니다. 시스템을 만들어 큰돈을 굴리세요." },
    { id: 'jeongjae', name: '정재격 (관리자)', job_recommendation: "은행원, 회계사, 공무원", strategy: "안정적인 현금 흐름이 최고입니다. 꼼꼼한 재테크에 집중하세요." },
    { id: 'pyungwan', name: '편관격 (해결사)', job_recommendation: "경찰, 군인, 의사, 검찰", strategy: "남들이 못하는 힘든 일을 해결하는 '특수 권력'을 가지세요." },
    { id: 'jeonggwan', name: '정관격 (행정가)', job_recommendation: "행정가, 경영진, 공무원", strategy: "명예와 감투를 쓰세요. 조직의 리더가 되어야 합니다." },
    { id: 'pyunin', name: '편인격 (기획자)', job_recommendation: "기획자, 작가, 마케터, 철학가", strategy: "남들과 다른 독특한 시각이 무기입니다. 대중성보다는 매니아층을 만드세요." },
    { id: 'jeongin', name: '정인격 (교육자)', job_recommendation: "교수, 멘토, 작가, 선생님", strategy: "배우고 가르치는 일이 천직입니다. 지식으로 사람을 이끄세요." },
    // Fallback or additional roles can be added
];

export interface YongsinRule {
    element: ElementType;
    direction: string;
    number: string;
    item: string;
    action: string;
}

export const YONGSIN_DATA: Record<ElementType, YongsinRule> = {
    'wood': { element: 'wood', direction: "동쪽", number: "3, 8", item: "나무 책상, 식물, 책", action: "아침 일찍 일어나기, 독서하기, 등산하기, 녹색 식물 키우기" },
    'fire': { element: 'fire', direction: "남쪽", number: "2, 7", item: "조명, 촛불, 화려한 옷", action: "햇볕 쬐기, 소리 내어 웃기, 노래방 가기, 명함 돌리기" },
    'earth': { element: 'earth', direction: "중앙/거주지", number: "5, 10", item: "도자기, 흙, 노란색 소품", action: "맨발 걷기, 약속 잘 지키기, 거실에 노란 그림 걸기, 찜질방" },
    'metal': { element: 'metal', direction: "서쪽", number: "4, 9", item: "금속 액세서리, 흰 차", action: "거절 잘하기, 헬스(근력운동), 불필요한 물건 버리기, 명상" },
    'water': { element: 'water', direction: "북쪽", number: "1, 6", item: "어항, 검은색 옷, 바다", action: "반신욕 하기, 밤에 일찍 자기, 물 많이 마시기, 생각 정리하기" }
};
