import { Solar } from 'lunar-javascript';

export class SajuSyncModule {
    /**
     * Get the Day Pillar (일진) for today.
     * @returns e.g., "갑자(甲子)"
     */
    static getTodayPillar(): string {
        const today = new Date();
        const solar = Solar.fromYmdHms(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate(),
            today.getHours(),
            today.getMinutes(),
            today.getSeconds()
        );
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();
        const dayGan = bazi.getDayGan();
        const dayZhi = bazi.getDayZhi();

        // simple mapping for Korean pronunciation
        const ganKor: Record<string, string> = { '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계' };
        const zhiKor: Record<string, string> = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };

        const korStr = (ganKor[dayGan] || dayGan) + (zhiKor[dayZhi] || dayZhi);
        return `${korStr}(${dayGan}${dayZhi})`;
    }

    /**
     * Get primary element of today
     */
    static getTodayElement(): string {
        const today = new Date();
        const solar = Solar.fromYmdHms(today.getFullYear(), today.getMonth() + 1, today.getDate(), 12, 0, 0);
        const dayGan = solar.getLunar().getEightChar().getDayGan();
        const elementMap: Record<string, string> = {
            '甲': '목(Wood)', '乙': '목(Wood)',
            '丙': '화(Fire)', '丁': '화(Fire)',
            '戊': '토(Earth)', '己': '토(Earth)',
            '庚': '금(Metal)', '辛': '금(Metal)',
            '壬': '수(Water)', '癸': '수(Water)'
        };
        return elementMap[dayGan] || 'Unknown';
    }

    /**
     * Formats memory metadata to include today's Saju info.
     * @param existingMetadata any existing metadata object
     * @returns merged metadata object
     */
    static injectSajuSync(existingMetadata: any = {}): any {
        return {
            ...existingMetadata,
            saju_sync: {
                day_pillar: this.getTodayPillar(),
                dominant_element: this.getTodayElement(),
                synced_at: new Date().toISOString()
            }
        };
    }
}
