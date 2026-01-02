import { Solar } from 'lunar-javascript';
import 'server-only';

export interface SajuResult {
    year: string;
    month: string;
    day: string;
    hour: string;
}

// Map Chinese characters to Korean
const GAN_KR: Record<string, string> = {
    '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
    '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

const ZHI_KR: Record<string, string> = {
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
    '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

/**
 * Calculate Four Pillars (사주팔자) using lunar-javascript library
 * This is the accurate server-side calculation
 */
export function getSajuCharacters(
    dateStr: string,
    timeStr: string,
    isLunar: boolean = false,
    gender: 'male' | 'female' = 'male'
): SajuResult {
    try {
        // 1. Parse date and time
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hour, minute] = timeStr ? timeStr.split(':').map(Number) : [12, 0];

        // 2. Create Solar object (lunar-javascript handles lunar conversion internally)
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();

        // 3. Get pillars in Chinese characters
        const yearGan = bazi.getYearGan();
        const yearZhi = bazi.getYearZhi();
        const monthGan = bazi.getMonthGan();
        const monthZhi = bazi.getMonthZhi();
        const dayGan = bazi.getDayGan();
        const dayZhi = bazi.getDayZhi();
        const timeGan = bazi.getTimeGan();
        const timeZhi = bazi.getTimeZhi();

        // 4. Convert to Korean
        const toKorean = (gan: string, zhi: string) => {
            return `${GAN_KR[gan] || gan}${ZHI_KR[zhi] || zhi}`;
        };

        return {
            year: toKorean(yearGan, yearZhi),   // 년주
            month: toKorean(monthGan, monthZhi), // 월주
            day: toKorean(dayGan, dayZhi),       // 일주
            hour: toKorean(timeGan, timeZhi),    // 시주
        };
    } catch (e) {
        console.error("Saju calculation failed:", e);
        return { year: 'Error', month: 'Error', day: 'Error', hour: 'Error' };
    }
}
