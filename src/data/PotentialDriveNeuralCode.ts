/**
 * PotentialDriveNeuralCode.ts
 * 시주(Hour Pillar) 전용 다크 코드(Future Errors) 및 뉴럴 코드(Future Vision) 데이터베이스
 */

export interface PotentialDriveCode {
    id: string;
    dark_code: {
        name: string;
        variable: string;
        desc: string;
    };
    neural_code: {
        name: string;
        variable: string;
        desc: string;
    };
}

export const POTENTIAL_DRIVE_CODES: Record<string, PotentialDriveCode> = {
    "갑자": {
        id: "갑자",
        dark_code: { name: "미성숙 오류", variable: "IMMATURE_FUTURE", desc: "철없는 노년, 새로운 시작 강박, 자녀와의 갈등" },
        neural_code: { name: "영원한 현역 모델", variable: "ACTIVE_LEGACY", desc: "나이가 들어도 멈추지 않는 성장과 새로운 시작" }
    },
    "갑술": {
        id: "갑술",
        dark_code: { name: "창조적 고립", variable: "CREATIVE_ISOLATION", desc: "혼자만의 세계에 갇혀 소통 단절" },
        neural_code: { name: "완성된 지혜", variable: "MATURE_WISDOM", desc: "풍부한 경험을 사회적 가치로 환원" }
    },
    // ... 나머지 58개 코드는 생략하지 말고 구현해야 함 (사용자가 제공한 데이터 기반으로 확장 필요)
    // 현재는 예시로 몇 개만 넣고, 필요시 전체 데이터를 채워넣는 방향으로 진행
};

// 실제로는 60갑자 전체 데이터가 들어가야 함.
// 사용자가 제공한 텍스트 샘플을 기반으로 확장 구조만 먼저 잡습니다.
