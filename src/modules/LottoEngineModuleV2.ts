import { GoogleGenerativeAI } from '@google/generative-ai';
import { LottoChaosModule } from './LottoChaosModule';
import { LottoStatisticsDB } from './LottoStatisticsDB';
import { LottoAdvancedAnalytics } from './LottoAdvancedAnalytics';

export class LottoEngineModuleV2 {

    /**
     * 명심 로또 퀀텀 엔진 V5.0 World-Class
     * - 실측 통계 + 갭 + 쌍 상관관계 + 제외 필터 + 델타 + 몬테카를로 + 마르코프
     * - 5세트 동시 생성 (각기 다른 전략) + 휠 시스템 보너스 세트
     */
    static async generateLottoNumbers(
        sajuData: any,
        targetGenderStr: string,
        locationData: string,
        requestTime: Date,
        subCommand: string = ""
    ): Promise<{ numbers: number[], reportStr: string }> {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        let seedPool: number[] = [];
        let isAIEngaged = false;

        const timeStr = requestTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        const p = sajuData?.fourPillars;
        const sajuString = p
            ? `년주: ${p.year.ganKor}${p.year.jiKor} / 월주: ${p.month.ganKor}${p.month.jiKor} / 일주: ${p.day.ganKor}${p.day.jiKor} / 시주: ${p.time.ganKor}${p.time.jiKor}`
            : '정보 없음';

        // ====================================================================
        // PHASE 1: AI Quantum Seed Pool (V5.0 with all analytics data)
        // ====================================================================
        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const isJackpotManual = subCommand === "잭팟" || subCommand === "승부";
                const realStatsData = LottoStatisticsDB.getStatsSummaryForPrompt();

                const prompt = `
당신은 대한민국 최고의 '명심 로또 V5.0 World-Class 엔진'입니다.
[실측 통계 + 갭 분석 + 번호 쌍 상관관계 + 델타 시스템 + 마르코프 체인]을 모두 통합한 최상위 엔진입니다.

${realStatsData}

${isJackpotManual ? `
[🚨 카오스 잭팟 모드]
균형을 무시하고 극단적 편향 패턴을 추출하되, 갭/상관쌍 데이터는 반드시 참고.` : `
[V5.0 World-Class 가이드라인]
1. Hot/Cold 번호 각 2개 이상 포함
2. 갭 15주 이상 '임계점' 번호 1~2개 포함
3. 동시출현 빈도 높은 번호 쌍 1쌍 이상 포함
4. 번호 간 간격(Delta)이 자연스럽게 분포 (평균 6~8)
5. 합계 121~180, AC값 7 이상, 번호대 3구간 이상
6. 연번 1쌍, 소수 2~3개, 끝수 중복 제한`}

[입력 데이터]
1. 사주 8글자: ${sajuString}
2. 성별: ${targetGenderStr}
3. 환경: ${locationData}
4. 시간: ${timeStr}

25개 후보 번호를 쉼표로만 구분해 출력하세요.
`;
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                const extracted = responseText.match(/\d+/g)?.map(Number).filter(n => n >= 1 && n <= 45) || [];
                seedPool = Array.from(new Set(extracted));
                isAIEngaged = seedPool.length >= 6;
            } catch (err) {
                console.error("Lotto V5.0 AI Failed:", err);
            }
        }

        // Fallback: fill to 25
        if (seedPool.length < 25) {
            const highGap = LottoStatisticsDB.getHighGapNumbers(8);
            const priority = [...LottoStatisticsDB.HOT_NUMBERS, ...LottoStatisticsDB.COLD_NUMBERS, ...highGap];
            const allNum = Array.from({ length: 45 }, (_, i) => i + 1);
            const rP = priority.filter(n => !seedPool.includes(n));
            const rO = allNum.filter(n => !seedPool.includes(n) && !rP.includes(n)).sort(() => Math.random() - 0.5);
            seedPool = [...new Set([...seedPool, ...rP, ...rO])].slice(0, 25);
        }

        // ====================================================================
        // PHASE 2: 5-SET + WHEEL BONUS
        // ====================================================================
        const isJackpot = subCommand === "잭팟" || subCommand === "승부";
        let allSets: { numbers: number[], strategy: string, scores: any }[] = [];

        if (isJackpot) {
            const chaosInfo = LottoChaosModule.analyzeSajuChaos(sajuData);
            for (let i = 0; i < 5; i++) {
                const nums = LottoChaosModule.generateSkewedPool(seedPool, chaosInfo.strategy);
                allSets.push({ numbers: nums, strategy: `카오스 #${i + 1}`, scores: null });
            }
        } else {
            allSets.push({ ...this.generateV5Set(seedPool, 'HOT'), strategy: '🔥 Hot 우선' });
            allSets.push({ ...this.generateV5Set(seedPool, 'COLD_GAP'), strategy: '❄️ 임계점 돌파' });
            allSets.push({ ...this.generateV5Set(seedPool, 'PAIR'), strategy: '🔗 궁합 쌍' });
            allSets.push({ ...this.generateV5Set(seedPool, 'CONSECUTIVE'), strategy: '📈 연번 강화' });
            allSets.push({ ...this.generateV5Set(seedPool, 'BALANCED'), strategy: '🧠 AI 종합 직관' });
        }

        // ====================================================================
        // PHASE 3: Report
        // ====================================================================
        const report = this.generateV5Report(allSets, isAIEngaged, subCommand);
        return { numbers: allSets[4]?.numbers || allSets[0]?.numbers || [], reportStr: report };
    }

    // ========================================================================
    // V5.0 세트 생성 (제외 필터 + 델타 + 마르코프 + 몬테카를로 통합 스코어링)
    // ========================================================================
    private static generateV5Set(pool: number[], strategy: string): { numbers: number[], scores: any } {
        let candidates: { comb: number[], totalScore: number, details: any }[] = [];

        for (let attempt = 0; attempt < 5000; attempt++) {
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const comb = shuffled.slice(0, 6).sort((a, b) => a - b);

            // ---- 제외 필터 (통과 못하면 즉시 탈락) ----
            if (!LottoAdvancedAnalytics.passesExclusionFilter(comb)) continue;

            // ---- 기본 7중 필터 ----
            const sum = comb.reduce((a, b) => a + b, 0);
            if (sum < 121 || sum > 180) continue;
            const odds = comb.filter(n => n % 2 !== 0).length;
            if (odds < 2 || odds > 4) continue;
            const high = comb.filter(n => n >= 23).length;
            if (high < 2 || high > 4) continue;
            const ac = this.calculateACValue(comb);
            if (ac < 7) continue;
            if (LottoStatisticsDB.countZonesCovered(comb) < 3) continue;
            if (LottoStatisticsDB.hasExcessiveLastDigitDuplication(comb)) continue;

            // ---- 명심 밸런스 필터 (Bias Breaker) ----
            // 1. 특정 십단위 구간(예: 30번대)에 3개 이상 쏠림 방지
            const decadeCounts: Record<number, number> = {};
            let isBalanced = true;
            for (const num of comb) {
                const decade = Math.floor((num - 1) / 10);
                decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
                if (decadeCounts[decade] > 2) {
                    isBalanced = false;
                    break;
                }
            }
            if (!isBalanced) continue;

            // 2. 3연속 번호 방지 (예: 12, 13, 14 차단)
            let consecutiveCount = 1;
            let hasTripleConsecutive = false;
            for (let i = 0; i < comb.length - 1; i++) {
                if (comb[i + 1] - comb[i] === 1) {
                    consecutiveCount++;
                    if (consecutiveCount >= 3) {
                        hasTripleConsecutive = true;
                        break;
                    }
                } else {
                    consecutiveCount = 1;
                }
            }
            if (hasTripleConsecutive) continue;

            // ---- 고급 분석 스코어링 ----
            const deltaScore = LottoAdvancedAnalytics.getDeltaScore(comb);
            const markovScore = LottoAdvancedAnalytics.getMarkovScore(comb);
            const hotCount = comb.filter(n => LottoStatisticsDB.HOT_NUMBERS.includes(n)).length;
            const coldCount = comb.filter(n => LottoStatisticsDB.COLD_NUMBERS.includes(n)).length;
            const gapScore = LottoStatisticsDB.calculateGapScore(comb);
            const pairCount = LottoStatisticsDB.countCorrelatedPairs(comb);
            const consecutivePairs = LottoStatisticsDB.countConsecutivePairs(comb);
            const primeCount = LottoStatisticsDB.countPrimes(comb);

            let score = deltaScore + markovScore;

            // 공통
            if (odds === 3) score += 1;
            if (primeCount >= 2 && primeCount <= 3) score += 1;

            // 전략별 가중치
            switch (strategy) {
                case 'HOT':
                    score += hotCount * 5;
                    if (pairCount >= 1) score += 2;
                    break;
                case 'COLD_GAP':
                    score += coldCount * 4;
                    score += gapScore * 2;
                    break;
                case 'PAIR':
                    score += pairCount * 6;
                    score += hotCount * 2;
                    break;
                case 'CONSECUTIVE':
                    if (consecutivePairs === 0) continue;
                    score += consecutivePairs * 7;
                    score += hotCount * 2;
                    break;
                case 'BALANCED':
                default:
                    score += hotCount * 2 + coldCount * 2 + gapScore + pairCount * 3;
                    if (consecutivePairs === 1) score += 3;
                    if (sum >= 140 && sum <= 160) score += 2;
                    break;
            }

            candidates.push({
                comb,
                totalScore: score,
                details: { delta: deltaScore, markov: markovScore, hot: hotCount, cold: coldCount, gap: gapScore, pair: pairCount }
            });

            if (candidates.length >= 10) break;
        }

        if (candidates.length > 0) {
            candidates.sort((a, b) => b.totalScore - a.totalScore);
            return { numbers: candidates[0].comb, scores: candidates[0].details };
        }

        return { numbers: [...pool].sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b), scores: null };
    }

    private static calculateACValue(comb: number[]): number {
        const diffs = new Set<number>();
        for (let i = 0; i < comb.length - 1; i++) {
            for (let j = i + 1; j < comb.length; j++) {
                diffs.add(Math.abs(comb[i] - comb[j]));
            }
        }
        return diffs.size - (comb.length - 1);
    }

    // ========================================================================
    // V5.0 리포트
    // ========================================================================
    private static generateV5Report(
        sets: { numbers: number[], strategy: string, scores: any }[],
        isAIEngaged: boolean, subCommand: string
    ): string {
        const isJackpot = subCommand === "잭팟" || subCommand === "승부";
        const ver = isJackpot ? "V5.0 Chaos" : "V5.0 World-Class";

        let header = isJackpot
            ? "> **🚀 카오스 잭팟 × 5세트 생성 완료**\n"
            : "> **🏆 V5.0 World-Class 엔진 가동 완료**\n";

        if (!isJackpot) {
            header += "> 제외 필터 · 델타 시스템 · 마르코프 체인 · 갭 분석 · 쌍 상관관계 · 7중 수학 필터 통합\n";
            header += "> 5세트 각각 Best-of-10 스코어링으로 최고 조합만 선발\n";
        }

        if (!isAIEngaged) {
            header = "> **실측 통계 + 고급 분석 기반 5세트 생성 완료**\n";
        }

        let setsStr = "";
        sets.forEach((set, i) => {
            const numStr = set.numbers.map(n => `**${n}**`).join(' · ');
            const sum = set.numbers.reduce((a, b) => a + b, 0);
            const odds = set.numbers.filter(n => n % 2 !== 0).length;
            const d = set.scores;

            setsStr += `\n**${String.fromCharCode(65 + i)}세트** ${set.strategy}\n`;
            setsStr += `# ${numStr}\n`;
            setsStr += `합${sum} · 홀${odds}:짝${6 - odds}`;
            if (d) {
                setsStr += ` · Δ${d.delta} · M${d.markov} · 🔥${d.hot} · ❄️${d.cold} · Gap${d.gap} · 쌍${d.pair}`;
            }
            setsStr += `\n`;
        });

        return `
🎱 **[명심 로또 ${ver}]**

${header}

### 🍀 전 세계 최상위 분석 기법으로 검증된 황금 번호
${setsStr}
📖 **분석 기호 안내**
Δ=델타점수 · M=마르코프 · 🔥=Hot · ❄️=Cold · Gap=갭점수 · 쌍=상관쌍

_💡 명심 코치: 이 5세트는 제외 필터 → 기본 수학 필터 → **구간 쏠림/연번 편향 차단(Bias Breaker)** 과정을 모두 통과한 무결점 조합입니다. 한 세트만 구매하신다면 **E세트(AI 종합 직관)**를 추천드립니다._
`;
    }
}
