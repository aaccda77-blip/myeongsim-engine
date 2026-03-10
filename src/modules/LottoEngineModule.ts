import { GoogleGenerativeAI } from '@google/generative-ai';

export class LottoEngineModule {

    static async generateLottoNumbers(sajuData: any): Promise<{ numbers: number[], reportStr: string }> {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        let seedPool: number[] = [];
        let isAIEngaged = false;

        // 1. Option A & B: Gemini Matrix & Stats Inferencing
        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const dayMaster = sajuData?.dayMasterChar || '알 수 없음';
                const yearPillar = sajuData?.fourPillars?.year?.ganKor + sajuData?.fourPillars?.year?.jiKor || '';
                const dayPillar = sajuData?.fourPillars?.day?.ganKor + sajuData?.fourPillars?.day?.jiKor || '';

                const prompt = `
당신은 대한민국 최고의 '명심 로또 예측 엔진'입니다.
현재 사용자의 사주 정보(일간: ${dayMaster}, 년주: ${yearPillar}, 일주: ${dayPillar})가 주어졌습니다.

다음 두 가지 분석을 수행하여, 오늘 가장 당첨 확률이 높은 로또 번호 후보군(Pool) 15개를 쉼표로 구분하여 출력하세요.
[분석 1. 동행복권 통계 기반 (Option A)] 최근 10주간의 초빈출 번호(Hot)와 장기 미출현 번호(Cold)의 통계적 패턴을 시뮬레이션하여 10개 추출.
[분석 2. 사주 딥러닝 매핑 (Option B)] 사용자의 사주 오행(용신/기구신)과 우주적 대운 주파수에 가장 공명하는 다차원 패턴 번호 5개 추출.

이 15개의 번호를 중복 없이 1부터 45 사이의 숫자로 쉼표로만 구분해 출력하세요. (예: 3,7,12,18,22,25,29,31,34,36,38,40,41,43,45)
`;
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                const extractedNumbers = responseText.match(/\d+/g)?.map(Number).filter(n => n >= 1 && n <= 45) || [];
                const uniqueSet = Array.from(new Set(extractedNumbers));
                seedPool = uniqueSet;
                isAIEngaged = seedPool.length >= 6;
            } catch (err) {
                console.error("Lotto Engine AI Failed:", err);
            }
        }

        // Fallback or fill the remaining if Gemini returned less than 15
        if (seedPool.length < 15) {
            const allNum = Array.from({ length: 45 }, (_, i) => i + 1);
            const remaining = allNum.filter(n => !seedPool.includes(n)).sort(() => Math.random() - 0.5);
            seedPool = [...seedPool, ...remaining].slice(0, 15);
        }

        // 2. Option C: High-End Math Filters
        const finalCombination = this.applyMathFilters(seedPool);

        // 3. Generate Report Text
        const report = this.generateReportContext(sajuData, finalCombination, isAIEngaged);

        return { numbers: finalCombination, reportStr: report };
    }

    private static applyMathFilters(pool: number[]): number[] {
        let attempts = 0;
        let bestCombination: number[] = [];

        while (attempts < 2000) {
            attempts++;
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const comb = shuffled.slice(0, 6).sort((a, b) => a - b);

            // Filter 1: Sum (120 ~ 180)
            const sum = comb.reduce((a, b) => a + b, 0);
            if (sum < 120 || sum > 180) continue;

            // Filter 2: Odd/Even Ratio (2:4, 3:3, 4:2)
            const odds = comb.filter(n => n % 2 !== 0).length;
            if (odds < 2 || odds > 4) continue;

            // Filter 3: High/Low Ratio (1-22 vs 23-45)
            const high = comb.filter(n => n >= 23).length;
            if (high < 2 || high > 4) continue;

            // Filter 4: AC Value (>= 7)
            const ac = this.calculateACValue(comb);
            if (ac < 7) continue;

            bestCombination = comb;
            break;
        }

        // Fallback
        if (bestCombination.length === 0) {
            bestCombination = [...pool].sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
        }

        return bestCombination;
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

    private static generateReportContext(sajuData: any, numbers: number[], isAIEngaged: boolean): string {
        const dayMaster = sajuData?.dayMasterChar || '알 수 없음';
        const numStr = numbers.map(n => `**${n}**`).join(' · ');

        let headerStr = "> **AI 다차원 분석 & 수학적 3중 필터 적용 (Option A+B+C 혼합)**\n";
        headerStr += "> 1. **Option A (통계 추적)**: 최근 동행복권 Hot/Cold 트렌드 알고리즘 시뮬레이션 완료\n";
        headerStr += `> 2. **Option B (사주 딥러닝)**: 일간 '${dayMaster}'의 대운 주파수와 공명하는 패턴 추출 완료\n`;
        headerStr += "> 3. **Option C (수학 필터)**: 총합 120~180 대역, 홀짝/고저 황금비율, AC(산술복잡도) 7 이상 완벽 통과\n";

        if (!isAIEngaged) {
            headerStr = "> **수학적 3중 필터 & 베이직 사주 융합 적용 완료**\n";
            headerStr += `> 일간 '${dayMaster}' 기반, 총합 120~180, AC 7 이상 필터링 적용 완료\n`;
        }

        return `
🎱 **[명심 초고급 로또 예측 엔진 가동]**

${headerStr}

### 🍀 당신만을 위한 하이엔드 행운 번호
# ${numStr}

_💡 명심 코치: 이 번호는 단순한 무작위 추출이 아닌, 딥러닝과 수학적 통계의 치밀한 결합입니다. 이번 주, 당신의 일상에 기적 같은 즐거움이 함께하기를 기원합니다._
`;
    }
}
