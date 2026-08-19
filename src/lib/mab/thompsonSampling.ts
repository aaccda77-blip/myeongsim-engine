export interface BanditArm {
    id: string;
    title: string;
    body: string;
    alpha: number; // 성공(오픈) + prior
    beta: number; // 실패(미오픈) + prior
}

export interface AllocatedArm extends BanditArm {
    trafficWeight: number; // 0.0 ~ 1.0 (합계 = 1.0)
    expectedValue: number; // alpha / (alpha + beta)
}

// 1. Marsaglia and Tsang 방식의 Gamma 난수 생성기
function sampleGamma(shape: number, scale = 1): number {
    if (shape < 1) {
        return sampleGamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
        let z = 0;
        let v = 0;
        do {
            z = (Math.random() - 0.5) * 6; // Standard normal approx
            v = 1 + c * z;
        } while (v <= 0);

        v = v * v * v;
        const u = Math.random();
        if (u < 1 - 0.0331 * z * z * z * z) return d * v * scale;
        if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v * scale;
    }
}

// 2. Beta(alpha, beta) 샘플링
export function sampleBeta(alpha: number, beta: number): number {
    const gA = sampleGamma(alpha, 1);
    const gB = sampleGamma(sampleGamma(beta, 1) === 0 ? 1e-6 : beta, 1);
    return gA / (gA + gB);
}

// 3. 몬테카를로 시뮬레이션을 통한 트래픽 가중치 산출
export function calculateThompsonWeights(
    arms: BanditArm[],
    options = { simulations: 10000, explorationFloor: 0.05 } // 최소 5% 탐색 보장
): AllocatedArm[] {
    const numArms = arms.length;
    if (numArms === 0) return [];
    if (numArms === 1) {
        return [
            {
                ...arms[0],
                trafficWeight: 1.0,
                expectedValue: arms[0].alpha / (arms[0].alpha + arms[0].beta)
            }
        ];
    }

    const winCounts = new Array(numArms).fill(0);

    // 10,000회 사후분포 샘플링 대결
    for (let s = 0; s < options.simulations; s++) {
        let maxSample = -1;
        let bestArmIdx = 0;

        for (let i = 0; i < numArms; i++) {
            const sample = sampleBeta(arms[i].alpha, arms[i].beta);
            if (sample > maxSample) {
                maxSample = sample;
                bestArmIdx = i;
            }
        }
        winCounts[bestArmIdx]++;
    }

    // 기본 확률 계산 (승리 횟수 / 전체 시뮬레이션)
    const rawProbabilities = winCounts.map((count) => count / options.simulations);

    // 최소 탐색 하한선(Exploration Floor) 적용 및 정규화
    const floor = options.explorationFloor;
    const availableWeight = 1.0 - floor * numArms;

    return arms.map((arm, idx) => {
        const adjustedWeight = floor + rawProbabilities[idx] * availableWeight;
        return {
            ...arm,
            trafficWeight: Number(adjustedWeight.toFixed(4)),
            expectedValue: Number((arm.alpha / (arm.alpha + arm.beta)).toFixed(4))
        };
    });
}
