export interface VariantData {
    id: string;
    name: string;
    sent: number;
    opened: number;
}

export interface TestResult {
    isSignificant: boolean;
    pValue: number;
    zScore: number;
    upliftPct: number;
    winnerId: string | null;
    status: 'WINNER_FOUND' | 'INSUFFICIENT_SAMPLE' | 'NO_DIFFERENCE' | 'RUNNING';
    reason: string;
}

// 표준정규분포 누적분포함수 (CDF) 근사 함수
export function standardNormalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const prob =
        d *
        t *
        (0.3193815 +
            t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
}

export function evaluateABTest(
    control: VariantData,
    variant: VariantData,
    options = { minSampleSize: 500, minDays: 3, currentDays: 3, alpha: 0.05 }
): TestResult {
    // 1. 최소 표본 수 및 최소 기간 가드레일
    if (control.sent < options.minSampleSize || variant.sent < options.minSampleSize) {
        return {
            isSignificant: false,
            pValue: 1.0,
            zScore: 0,
            upliftPct: 0,
            winnerId: null,
            status: 'INSUFFICIENT_SAMPLE',
            reason: `표본 수 부족 (각 군 최소 ${options.minSampleSize}건 필요)`
        };
    }

    if (options.currentDays < options.minDays) {
        return {
            isSignificant: false,
            pValue: 1.0,
            zScore: 0,
            upliftPct: 0,
            winnerId: null,
            status: 'RUNNING',
            reason: `최소 실험 기간 미달 (최소 ${options.minDays}일 가동 필요)`
        };
    }

    const pA = control.opened / control.sent;
    const pB = variant.opened / variant.sent;

    // 2. 통합 비율(Pooled Proportion) 계산
    const pPool = (control.opened + variant.opened) / (control.sent + variant.sent);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / control.sent + 1 / variant.sent));

    if (se === 0) {
        return {
            isSignificant: false,
            pValue: 1.0,
            zScore: 0,
            upliftPct: 0,
            winnerId: null,
            status: 'NO_DIFFERENCE',
            reason: '전환 데이터가 없어 검정 불가'
        };
    }

    // 3. Z-Score 및 양측 검정 p-value 산출
    const zScore = (pB - pA) / se;
    const pValue = 2 * (1 - standardNormalCDF(Math.abs(zScore)));
    const upliftPct = pA > 0 ? ((pB - pA) / pA) * 100 : 0;

    // 4. 유의성 판별 (p < 0.05)
    const isSignificant = pValue < options.alpha;

    if (isSignificant) {
        const winnerId = zScore > 0 ? variant.id : control.id;
        return {
            isSignificant: true,
            pValue: Number(pValue.toFixed(4)),
            zScore: Number(zScore.toFixed(3)),
            upliftPct: Number(upliftPct.toFixed(2)),
            winnerId,
            status: 'WINNER_FOUND',
            reason: `신뢰수준 95% 이상에서 통계적 유의성 입증 (p = ${pValue.toFixed(4)}, 개선율 = ${upliftPct > 0 ? '+' : ''}${upliftPct.toFixed(1)}%)`
        };
    }

    return {
        isSignificant: false,
        pValue: Number(pValue.toFixed(4)),
        zScore: Number(zScore.toFixed(3)),
        upliftPct: Number(upliftPct.toFixed(2)),
        winnerId: null,
        status: 'RUNNING',
        reason: `유의미한 차이 없음 (p = ${pValue.toFixed(4)} >= ${options.alpha})`
    };
}
