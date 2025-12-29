import { Solar, Lunar } from 'lunar-javascript';

// Types for our Saju data structure
export interface SajuPillar {
    gan: { char: string; color: string; label: string };
    ji: { char: string; color: string; label: string; animal?: string };
}

export interface FourPillarsData {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    time: SajuPillar;
    dayMaster: string; // The Heavenly Stem of the Day
}

const HEAVENLY_STEMS = [
    { char: '갑', color: '#10B981', label: '목' }, // 0: Jia (Wood+)
    { char: '을', color: '#10B981', label: '목' }, // 1: Yi (Wood-)
    { char: '병', color: '#EF4444', label: '화' }, // 2: Bing (Fire+)
    { char: '정', color: '#EF4444', label: '화' }, // 3: Ding (Fire-)
    { char: '무', color: '#F59E0B', label: '토' }, // 4: Wu (Earth+)
    { char: '기', color: '#F59E0B', label: '토' }, // 5: Ji (Earth-)
    { char: '경', color: '#9CA3AF', label: '금' }, // 6: Geng (Metal+)
    { char: '신', color: '#9CA3AF', label: '금' }, // 7: Xin (Metal-)
    { char: '임', color: '#3B82F6', label: '수' }, // 8: Ren (Water+)
    { char: '계', color: '#3B82F6', label: '수' }  // 9: Gui (Water-)
];

const EARTHLY_BRANCHES = [
    { char: '자', color: '#3B82F6', label: '수', animal: '쥐' },    // 0: Zi
    { char: '축', color: '#F59E0B', label: '토', animal: '소' },     // 1: Chou
    { char: '인', color: '#10B981', label: '목', animal: '호랑이' },   // 2: Yin
    { char: '묘', color: '#10B981', label: '목', animal: '토끼' },  // 3: Mao
    { char: '진', color: '#F59E0B', label: '토', animal: '용' }, // 4: Chen
    { char: '사', color: '#EF4444', label: '화', animal: '뱀' },   // 5: Si
    { char: '오', color: '#EF4444', label: '화', animal: '말' },   // 6: Wu
    { char: '미', color: '#F59E0B', label: '토', animal: '양' },   // 7: Wei
    { char: '신', color: '#9CA3AF', label: '금', animal: '원숭이' }, // 8: Shen
    { char: '유', color: '#9CA3AF', label: '금', animal: '닭' },// 9: You
    { char: '술', color: '#F59E0B', label: '토', animal: '개' },    // 10: Xu
    { char: '해', color: '#3B82F6', label: '수', animal: '돼지' }     // 11: Hai
];

// Mapping from Chinese Characters (Library Output) to our Array Indices
// The library returns Chinese characters for Gans and Zhis.
const GAN_MAP: Record<string, number> = {
    '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
    '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9
};

const ZHI_MAP: Record<string, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11
};

export const calculateSaju = (
    dateStr: string,
    timeStr: string,
    type: 'solar' | 'lunar' = 'solar',
    gender: 'male' | 'female' = 'male'
): FourPillarsData => {
    // 1. Parse Input
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr ? timeStr.split(':').map(Number) : [12, 0]; // Default to noon if no time

    let lunarDate: Lunar;

    // 2. Create Lunar Object (The library calculates pillars based on Lunar calendar mainly,
    //    but can convert Solar to Lunar first)
    if (type === 'solar') {
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        lunarDate = solar.getLunar();
    } else {
        // Assume non-leap month for simplicity in basic input, or handled elsewhere
        lunarDate = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
    }

    // 3. Get Eight Characters (BaZi)
    const bazi = lunarDate.getEightChar();

    // The library handles the complex logic of:
    // - Local Mean Time adjustments (if configured, strict usage usually requires longitude)
    // - Midnight boundaries (Zi hour split)
    // - Solar terms (JieQi) for accurate Month Pillar (critical for Saju)

    // 4. Map to Our Structure
    const mapPillar = (ganChar: string, zhiChar: string): SajuPillar => {
        const ganIdx = GAN_MAP[ganChar];
        const zhiIdx = ZHI_MAP[zhiChar];

        // Fallback for safety
        const safeGan = HEAVENLY_STEMS[ganIdx] || HEAVENLY_STEMS[0];
        const safeZhi = EARTHLY_BRANCHES[zhiIdx] || EARTHLY_BRANCHES[0];

        return {
            gan: safeGan,
            ji: safeZhi
        };
    };

    const yearGan = bazi.getYearGan();
    const yearZhi = bazi.getYearZhi();
    const monthGan = bazi.getMonthGan();
    const monthZhi = bazi.getMonthZhi();
    const dayGan = bazi.getDayGan();
    const dayZhi = bazi.getDayZhi();
    const timeGan = bazi.getTimeGan();
    const timeZhi = bazi.getTimeZhi();

    const result = {
        year: mapPillar(yearGan, yearZhi),
        month: mapPillar(monthGan, monthZhi),
        day: mapPillar(dayGan, dayZhi),
        time: mapPillar(timeGan, timeZhi),
        dayMaster: `${HEAVENLY_STEMS[GAN_MAP[dayGan]].char} (${HEAVENLY_STEMS[GAN_MAP[dayGan]].label})`
    };

    return result;
};
