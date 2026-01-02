/**
 * ScoreCalculator.ts - 운명 데이터 정량화 알고리즘
 * 
 * 목적: 사주/진키 텍스트 데이터를 레이더 차트용 점수(0-100)로 변환
 * 
 * 8축 매핑:
 * 1. 직관 (Intuition) - 인성 + 57번 코드
 * 2. 표현 (Expression) - 식상 + 12/22번 코드
 * 3. 의지 (Willpower) - 비겁 + 21번 코드
 * 4. 추진력 (Drive) - 관성 + 51번 코드
 * 5. 관계 (Feeling) - 재성 + Venus Sequence
 * 6. 사고 (Mental) - 금(Metal) + 61/63/64번 코드
 * 7. 활동 (Activity) - 목(Wood) + 역마살
 * 8. 안정 (Stability) - 토(Earth) + 화개살
 */

// ============== 타입 정의 ==============

/** 오행 (Five Elements) */
export interface OhaengScores {
    wood: number;   // 목
    fire: number;   // 화
    earth: number;  // 토
    metal: number;  // 금
    water: number;  // 수
}

/** 십성 (Ten Gods) 개수 */
export interface TenGodsCount {
    resource: number;   // 인성 (정인/편인)
    output: number;     // 식상 (식신/상관)
    self: number;       // 비겁 (비견/겁재)
    power: number;      // 관성 (정관/편관)
    wealth: number;     // 재성 (정재/편재)
}

/** 신살 (Special Stars) */
export interface Sinsal {
    yeokma?: boolean;   // 역마살 (이동/활동)
    hwagae?: boolean;   // 화개살 (영적/예술)
    dohwa?: boolean;    // 도화살 (매력/관계)
    gwonsal?: boolean;  // 권살 (권력/리더십)
}

/** Venus Sequence 라인 (1-6) */
export type VenusLine = 1 | 2 | 3 | 4 | 5 | 6;

/** 입력 데이터 */
export interface SajuMatrix {
    ohaeng: OhaengScores;
    tenGods: TenGodsCount;
    sinsal?: Sinsal;
    venusLine?: VenusLine;
}

/** 레이더 차트 점수 출력 */
export interface RadarScores {
    intuition: number;    // 직관력
    expression: number;   // 표현력
    willpower: number;    // 의지력
    drive: number;        // 추진력
    feeling: number;      // 관계력
    mental: number;       // 사고력
    activity: number;     // 활동력
    stability: number;    // 안정감
}

// ============== 상수 ==============

/** 점수 계산 가중치 */
const WEIGHTS = {
    TEN_GODS_MULTIPLIER: 20,        // 십성 1개당 20점
    CODE_BONUS: 30,                 // 관련 코드 보유시 +30점
    SINSAL_BONUS: 30,               // 신살 보유시 +30점
    VENUS_LINE_2_BONUS: 20,         // Venus 2라인(관계) +20점
    OHAENG_MULTIPLIER: 15,          // 오행 기운 * 15점
    MAX_SCORE: 100,                 // 최대 점수
    MIN_SCORE: 10,                  // 최소 점수 (완전 0 방지)
};

/** 코드 그룹핑 */
const CODE_GROUPS = {
    INTUITION: [57],                // 직관력 관련 코드
    EXPRESSION: [12, 22],           // 표현력 관련 코드
    WILLPOWER: [21],                // 의지력 관련 코드
    DRIVE: [51],                    // 추진력 관련 코드
    MENTAL: [61, 63, 64],           // 사고력 관련 코드 (진리 탐구)
    HEALING: [25, 46],              // 치유력 관련 코드
    CREATIVITY: [1, 14],            // 창의력 관련 코드
};

// ============== 유틸리티 함수 ==============

/** 점수 범위 조정 (0-100) */
const clampScore = (score: number): number => {
    return Math.min(WEIGHTS.MAX_SCORE, Math.max(WEIGHTS.MIN_SCORE, Math.round(score)));
};

/** 코드 보유 확인 */
const hasCode = (myCodes: number[], targetCodes: number[]): boolean => {
    return targetCodes.some(code => myCodes.includes(code));
};

/** 코드 보유 개수 */
const countCodes = (myCodes: number[], targetCodes: number[]): number => {
    return targetCodes.filter(code => myCodes.includes(code)).length;
};

// ============== 메인 계산 클래스 ==============

export class ScoreCalculator {
    private sajuMatrix: SajuMatrix;
    private myCodes: number[];

    constructor(sajuMatrix: SajuMatrix, myCodes: number[] = []) {
        this.sajuMatrix = sajuMatrix;
        this.myCodes = myCodes;
    }

    /**
     * 8축 레이더 점수 계산
     */
    calculateRadarScores(): RadarScores {
        return {
            intuition: this.calcIntuition(),
            expression: this.calcExpression(),
            willpower: this.calcWillpower(),
            drive: this.calcDrive(),
            feeling: this.calcFeeling(),
            mental: this.calcMental(),
            activity: this.calcActivity(),
            stability: this.calcStability(),
        };
    }

    /**
     * GeniusRadarChart 형식으로 변환
     */
    toChartFormat(): {
        creativity: number;
        logic: number;
        empathy: number;
        leadership: number;
        resilience: number;
        intuition: number;
        communication: number;
        execution: number;
    } {
        const scores = this.calculateRadarScores();
        return {
            creativity: scores.expression,      // 표현력 → 창의성
            logic: scores.mental,               // 사고력 → 논리력
            empathy: scores.feeling,            // 관계력 → 공감력
            leadership: scores.drive,           // 추진력 → 리더십
            resilience: scores.stability,       // 안정감 → 회복력
            intuition: scores.intuition,        // 직관력 → 직관력
            communication: scores.expression,   // 표현력 → 소통력
            execution: scores.activity,         // 활동력 → 실행력
        };
    }

    // ============== 개별 축 계산 ==============

    /** 1. 직관력 (Intuition): 인성 + 57번 코드 */
    private calcIntuition(): number {
        const { tenGods } = this.sajuMatrix;
        let score = tenGods.resource * WEIGHTS.TEN_GODS_MULTIPLIER;

        if (hasCode(this.myCodes, CODE_GROUPS.INTUITION)) {
            score += WEIGHTS.CODE_BONUS;
        }

        // 수(Water) 오행 보너스 (직관과 관련)
        score += this.sajuMatrix.ohaeng.water * 5;

        return clampScore(score);
    }

    /** 2. 표현력 (Expression): 식상 + 12/22번 코드 */
    private calcExpression(): number {
        const { tenGods } = this.sajuMatrix;
        let score = tenGods.output * WEIGHTS.TEN_GODS_MULTIPLIER;

        if (hasCode(this.myCodes, CODE_GROUPS.EXPRESSION)) {
            score += WEIGHTS.CODE_BONUS;
        }

        // 화(Fire) 오행 보너스 (표현과 관련)
        score += this.sajuMatrix.ohaeng.fire * 5;

        return clampScore(score);
    }

    /** 3. 의지력 (Willpower): 비겁 + 21번 코드 */
    private calcWillpower(): number {
        const { tenGods } = this.sajuMatrix;
        let score = tenGods.self * WEIGHTS.TEN_GODS_MULTIPLIER;

        if (hasCode(this.myCodes, CODE_GROUPS.WILLPOWER)) {
            score += WEIGHTS.CODE_BONUS;
        }

        return clampScore(score);
    }

    /** 4. 추진력 (Drive): 관성 + 51번 코드 */
    private calcDrive(): number {
        const { tenGods, sinsal } = this.sajuMatrix;
        let score = tenGods.power * WEIGHTS.TEN_GODS_MULTIPLIER;

        if (hasCode(this.myCodes, CODE_GROUPS.DRIVE)) {
            score += WEIGHTS.CODE_BONUS;
        }

        // 권살 보너스
        if (sinsal?.gwonsal) {
            score += WEIGHTS.SINSAL_BONUS;
        }

        return clampScore(score);
    }

    /** 5. 관계력 (Feeling): 재성 + Venus Sequence */
    private calcFeeling(): number {
        const { tenGods, venusLine, sinsal } = this.sajuMatrix;
        let score = tenGods.wealth * WEIGHTS.TEN_GODS_MULTIPLIER;

        // Venus 2라인 (관계 특화) 보너스
        if (venusLine === 2) {
            score += WEIGHTS.VENUS_LINE_2_BONUS;
        }

        // 도화살 보너스 (매력/관계)
        if (sinsal?.dohwa) {
            score += WEIGHTS.SINSAL_BONUS;
        }

        return clampScore(score);
    }

    /** 6. 사고력 (Mental): 금(Metal) + 61/63/64번 코드 */
    private calcMental(): number {
        const { ohaeng } = this.sajuMatrix;
        let score = ohaeng.metal * WEIGHTS.OHAENG_MULTIPLIER;

        if (hasCode(this.myCodes, CODE_GROUPS.MENTAL)) {
            score += WEIGHTS.CODE_BONUS;
        }

        // 인성 보너스 (학습/사고)
        score += this.sajuMatrix.tenGods.resource * 10;

        return clampScore(score);
    }

    /** 7. 활동력 (Activity): 목(Wood) + 역마살 */
    private calcActivity(): number {
        const { ohaeng, sinsal } = this.sajuMatrix;
        let score = ohaeng.wood * WEIGHTS.OHAENG_MULTIPLIER;

        // 역마살 보너스
        if (sinsal?.yeokma) {
            score += WEIGHTS.SINSAL_BONUS;
        }

        // 관성 보너스 (추진력)
        score += this.sajuMatrix.tenGods.power * 10;

        return clampScore(score);
    }

    /** 8. 안정감 (Stability): 토(Earth) + 화개살 */
    private calcStability(): number {
        const { ohaeng, sinsal } = this.sajuMatrix;
        let score = ohaeng.earth * WEIGHTS.OHAENG_MULTIPLIER;

        // 화개살 보너스 (영적 안정)
        if (sinsal?.hwagae) {
            score += WEIGHTS.SINSAL_BONUS;
        }

        // 인성 보너스 (내면 안정)
        score += this.sajuMatrix.tenGods.resource * 10;

        return clampScore(score);
    }
}

// ============== 편의 함수 ==============

/**
 * 사주 데이터에서 레이더 점수 계산 (간편 호출)
 */
export function calculateGeniusScores(
    sajuMatrix: SajuMatrix,
    myCodes: number[] = []
): RadarScores {
    const calculator = new ScoreCalculator(sajuMatrix, myCodes);
    return calculator.calculateRadarScores();
}

/**
 * 기본 점수 생성 (데이터 없을 때 랜덤)
 */
export function generateDefaultScores(): RadarScores {
    const randomScore = () => Math.floor(Math.random() * 40) + 50; // 50-90
    return {
        intuition: randomScore(),
        expression: randomScore(),
        willpower: randomScore(),
        drive: randomScore(),
        feeling: randomScore(),
        mental: randomScore(),
        activity: randomScore(),
        stability: randomScore(),
    };
}

/**
 * 오행(5행) 점수에서 간단히 8축 변환
 */
export function convertOhaengToRadar(ohaeng: OhaengScores): RadarScores {
    const sajuMatrix: SajuMatrix = {
        ohaeng,
        tenGods: {
            resource: Math.round(ohaeng.water / 20),
            output: Math.round(ohaeng.fire / 20),
            self: Math.round((ohaeng.wood + ohaeng.earth) / 40),
            power: Math.round(ohaeng.metal / 20),
            wealth: Math.round((ohaeng.earth + ohaeng.metal) / 40),
        }
    };
    return calculateGeniusScores(sajuMatrix, []);
}
