export class LottoChaosModule {
    /**
     * 분석: 사용자의 오행 편중(Skew) 상태를 기반으로 번호 생성 가중치 결정
     */
    static analyzeSajuChaos(sajuData: any): { strategy: 'ODD_HEAVY' | 'EVEN_HEAVY' | 'HIGH_HEAVY' | 'LOW_HEAVY' | 'RANDOM_CHAOS', reason: string } {
        // 실제로는 사주 오행 점수(목화토금수)를 계산하여 가장 강한 기운을 찾음
        // 여기서는 시뮬레이션 로직으로 구현
        const p = sajuData?.fourPillars;
        if (!p) return { strategy: 'RANDOM_CHAOS', reason: '데이터 부족으로 인한 무작위 카오스' };

        // 일간(Day Master) 기준 간이 분석
        const dm = sajuData.dayMaster || '';
        const fireDays = ['병', '정']; // 양/음 화(火)
        const waterDays = ['임', '계']; // 양/음 수(水)

        if (fireDays.includes(dm)) {
            return { strategy: 'ODD_HEAVY', reason: '화(火)의 팽창 에너지가 홀수 주파수와 공명' };
        } else if (waterDays.includes(dm)) {
            return { strategy: 'LOW_HEAVY', reason: '수(水)의 응축 에너지가 낮은 번호대에 집중' };
        }

        return { strategy: 'HIGH_HEAVY', reason: '상승하는 양기가 높은 번호대(23-45) 유도' };
    }

    /**
     * 필터링 우회: 홀짝 5:1 또는 1:5 같은 극단적 조합 생성
     */
    static generateSkewedPool(pool: number[], strategy: string): number[] {
        let attempts = 0;
        while (attempts < 500) {
            attempts++;
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const comb = shuffled.slice(0, 6).sort((a, b) => a - b);

            const odds = comb.filter(n => n % 2 !== 0).length;
            const high = comb.filter(n => n >= 23).length;

            if (strategy === 'ODD_HEAVY' && odds >= 5) return comb;
            if (strategy === 'EVEN_HEAVY' && odds <= 1) return comb;
            if (strategy === 'HIGH_HEAVY' && high >= 5) return comb;
            if (strategy === 'LOW_HEAVY' && high <= 1) return comb;

            // RANDOM_CHAOS는 그냥 아무거나 하나 (단, 일반 3:3은 피함)
            if (strategy === 'RANDOM_CHAOS' && (odds >= 5 || high >= 5)) return comb;
        }

        // 실패 시 그냥 셔플해서 반환 (최소한의 랜덤성)
        return [...pool].sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
    }
}
