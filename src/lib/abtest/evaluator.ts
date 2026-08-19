export interface VariantStats {
    id: string;
    name: string;
    sent: number;
    opened: number;
    unsubscribed: number;
}

export interface EvaluationConfig {
    minSampleSizePerArm: number; // 기본 2,000건 (시뮬레이션 조절 가능)
    minRunDays: number;          // 요일 편향 제거를 위한 최소 7일
    currentRunDays: number;
    alpha: number;               // 0.05
    guardrailUnsubThreshold: number; // 수신거부율 허용 배수 (예: 1.3배)
}

export interface EvaluationResult {
    status: 'WINNER_PROMOTED' | 'LOSER_ROLLED_BACK' | 'RUNNING' | 'INCONCLUSIVE' | 'SRM_ERROR';
    winnerId: string | null;
    pValue: number;
    zScore: number;
    upliftPercent: number;
    reason: string;
}

// 1. 고정밀 표준정규분포 누적분포함수 (CDF)
export function normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const p =
        d *
        t *
        (0.3193815 +
            t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
}

// 2. 표본 분할 불일치(SRM) 카이제곱 검정
export function checkSRM(sentA: number, sentB: number): boolean {
    const total = sentA + sentB;
    if (total < 100) return true; // 표본이 너무 적을 때는 스킵
    const expected = total / 2;
    const chiSquare = Math.pow(sentA - expected, 2) / expected + Math.pow(sentB - expected, 2) / expected;
    // 자유도 1에서 p = 0.001에 해당하는 임계값 10.828
    return chiSquare < 10.828;
}

export function evaluatePushABTest(
    control: VariantStats,
    variant: VariantStats,
    config: EvaluationConfig
): EvaluationResult {
    // [가드레일 1] SRM (Sample Ratio Mismatch) 감지
    if (!checkSRM(control.sent, variant.sent)) {
        return {
            status: 'SRM_ERROR',
            winnerId: null,
            pValue: 1.0,
            zScore: 0,
            upliftPercent: 0,
            reason: '트래픽 분할 비율(50:50) 왜곡 발생 (SRM 오류로 실험 신뢰도 상실)',
        };
    }

    // [가드레일 2] 최소 기간 및 최소 표본 수 미달 확인
    if (config.currentRunDays < config.minRunDays) {
        return {
            status: 'RUNNING',
            winnerId: null,
            pValue: 1.0,
            zScore: 0,
            upliftPercent: 0,
            reason: `최소 실험 기간 미달 (${config.currentRunDays}/${config.minRunDays}일 가동 중 - 요일 편향 방지)`,
        };
    }

    if (control.sent < config.minSampleSizePerArm || variant.sent < config.minSampleSizePerArm) {
        return {
            status: 'RUNNING',
            winnerId: null,
            pValue: 1.0,
            zScore: 0,
            upliftPercent: 0,
            reason: `표본 수 부족 (대조군: ${control.sent}, 실험군: ${variant.sent} / 목표: 각 ${config.minSampleSizePerArm}건)`,
        };
    }

    const pA = control.opened / control.sent;
    const pB = variant.opened / variant.sent;
    const uplift = pA > 0 ? ((pB - pA) / pA) * 100 : 0;

    // [가드레일 3] 음수 가드레일 지표 (수신거부율/이탈률 급증 검사)
    const unsubRateA = control.unsubscribed / control.sent;
    const unsubRateB = variant.unsubscribed / variant.sent;
    if (unsubRateB > unsubRateA * config.guardrailUnsubThreshold && unsubRateB > 0.005) {
        return {
            status: 'LOSER_ROLLED_BACK',
            winnerId: control.id,
            pValue: 0,
            zScore: 0,
            upliftPercent: uplift,
            reason: `실험군의 푸시 수신거부율이 대조군 대비 ${config.guardrailUnsubThreshold}배 이상 높아 안전 롤백`,
        };
    }

    // 통계량 산출
    const pPool = (control.opened + variant.opened) / (control.sent + variant.sent);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / control.sent + 1 / variant.sent));
    if (se === 0) {
        return { status: 'RUNNING', winnerId: null, pValue: 1.0, zScore: 0, upliftPercent: 0, reason: '오픈 데이터 없음' };
    }

    const zScore = (pB - pA) / se;
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

    // 통계적 유의성 판정 (p < 0.05)
    if (pValue < config.alpha) {
        if (zScore > 0) {
            return {
                status: 'WINNER_PROMOTED',
                winnerId: variant.id,
                pValue: Number(pValue.toFixed(4)),
                zScore: Number(zScore.toFixed(3)),
                upliftPercent: Number(uplift.toFixed(2)),
                reason: `신뢰수준 95% 이상에서 실험군 유의성 입증 (p = ${pValue.toFixed(4)}, 오픈율 개선: +${uplift.toFixed(1)}%)`,
            };
        } else {
            return {
                status: 'WINNER_PROMOTED',
                winnerId: control.id,
                pValue: Number(pValue.toFixed(4)),
                zScore: Number(zScore.toFixed(3)),
                upliftPercent: Number(uplift.toFixed(2)),
                reason: `대조군이 유의미하게 우세함 (실험군 오픈율 저하로 기존 문구 채택)`,
            };
        }
    }

    // 14일 이상 경과했으나 유의미한 차이가 없는 경우
    if (config.currentRunDays >= 14) {
        return {
            status: 'INCONCLUSIVE',
            winnerId: control.id, // 차이가 없으면 보수적으로 기존 제어군 유지
            pValue: Number(pValue.toFixed(4)),
            zScore: Number(zScore.toFixed(3)),
            upliftPercent: Number(uplift.toFixed(2)),
            reason: '14일간 실험 결과 통계적 유의차 없음 (무승부 종료, 기본 템플릿 유지)',
        };
    }

    return {
        status: 'RUNNING',
        winnerId: null,
        pValue: Number(pValue.toFixed(4)),
        zScore: Number(zScore.toFixed(3)),
        upliftPercent: Number(uplift.toFixed(2)),
        reason: `실험 진행 중 (현재 p = ${pValue.toFixed(4)} >= 0.05)`,
    };
}
