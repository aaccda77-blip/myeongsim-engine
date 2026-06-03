import { Solar, Lunar } from 'lunar-javascript';

// Types for our Saju data structure
export interface SajuPillar {
    gan: { char: string; hanja: string; color: string; label: string };
    ji: { char: string; hanja: string; color: string; label: string; animal?: string };
}

export interface FourPillarsData {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    time: SajuPillar;
    dayMaster: string; // The Heavenly Stem of the Day
    gongmang: string[]; // 공망 한자 지지 목록 예: ['申', '酉']
    isYearGongmang: boolean;
    isMonthGongmang: boolean;
    isTimeGongmang: boolean;
}

const HEAVENLY_STEMS = [
    { char: '갑', hanja: '甲', color: '#10B981', label: '목' }, // 0: Jia (Wood+)
    { char: '을', hanja: '乙', color: '#10B981', label: '목' }, // 1: Yi (Wood-)
    { char: '병', hanja: '丙', color: '#EF4444', label: '화' }, // 2: Bing (Fire+)
    { char: '정', hanja: '丁', color: '#EF4444', label: '화' }, // 3: Ding (Fire-)
    { char: '무', hanja: '戊', color: '#F59E0B', label: '토' }, // 4: Wu (Earth+)
    { char: '기', hanja: '己', color: '#F59E0B', label: '토' }, // 5: Ji (Earth-)
    { char: '경', hanja: '庚', color: '#9CA3AF', label: '금' }, // 6: Geng (Metal+)
    { char: '신', hanja: '辛', color: '#9CA3AF', label: '금' }, // 7: Xin (Metal-)
    { char: '임', hanja: '壬', color: '#3B82F6', label: '수' }, // 8: Ren (Water+)
    { char: '계', hanja: '癸', color: '#3B82F6', label: '수' }  // 9: Gui (Water-)
];

const EARTHLY_BRANCHES = [
    { char: '자', hanja: '子', color: '#3B82F6', label: '수', animal: '쥐' },    // 0: Zi
    { char: '축', hanja: '丑', color: '#F59E0B', label: '토', animal: '소' },     // 1: Chou
    { char: '인', hanja: '寅', color: '#10B981', label: '목', animal: '호랑이' },   // 2: Yin
    { char: '묘', hanja: '卯', color: '#10B981', label: '목', animal: '토끼' },  // 3: Mao
    { char: '진', hanja: '辰', color: '#F59E0B', label: '토', animal: '용' }, // 4: Chen
    { char: '사', hanja: '巳', color: '#EF4444', label: '화', animal: '뱀' },   // 5: Si
    { char: '오', hanja: '午', color: '#EF4444', label: '화', animal: '말' },   // 6: Wu
    { char: '미', hanja: '未', color: '#F59E0B', label: '토', animal: '양' },   // 7: Wei
    { char: '신', hanja: '申', color: '#9CA3AF', label: '금', animal: '원숭이' }, // 8: Shen
    { char: '유', hanja: '酉', color: '#9CA3AF', label: '금', animal: '닭' },// 9: You
    { char: '술', hanja: '戌', color: '#F59E0B', label: '토', animal: '개' },    // 10: Xu
    { char: '해', hanja: '亥', color: '#3B82F6', label: '수', animal: '돼지' }     // 11: Hai
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

export const calculateGongmang = (dayGanHanja: string, dayZhiHanja: string): string[] => {
    const ganIdx = GAN_MAP[dayGanHanja];
    const zhiIdx = ZHI_MAP[dayZhiHanja];
    if (ganIdx === undefined || zhiIdx === undefined) return [];

    // 순(旬)의 시작 지지 인덱스 구하기
    const startZhiIdx = (zhiIdx - ganIdx + 12) % 12;

    // 공망 지지 인덱스 (순의 시작 지지에서 10, 11번째 지지)
    const gongmangZhi1Idx = (startZhiIdx + 10) % 12;
    const gongmangZhi2Idx = (startZhiIdx + 11) % 12;

    const zhi1 = EARTHLY_BRANCHES[gongmangZhi1Idx].hanja;
    const zhi2 = EARTHLY_BRANCHES[gongmangZhi2Idx].hanja;

    return [zhi1, zhi2];
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

    const gongmang = calculateGongmang(dayGan, dayZhi);
    const isYearGongmang = gongmang.includes(yearZhi);
    const isMonthGongmang = gongmang.includes(monthZhi);
    const isTimeGongmang = gongmang.includes(timeZhi);

    const result = {
        year: mapPillar(yearGan, yearZhi),
        month: mapPillar(monthGan, monthZhi),
        day: mapPillar(dayGan, dayZhi),
        time: mapPillar(timeGan, timeZhi),
        dayMaster: `${HEAVENLY_STEMS[GAN_MAP[dayGan]].char} (${HEAVENLY_STEMS[GAN_MAP[dayGan]].label})`,
        gongmang,
        isYearGongmang,
        isMonthGongmang,
        isTimeGongmang
    };

    return result;
};

/**
 * 오늘의 일진 계산 함수 (Today's Daily Pillar)
 * lunar-javascript를 사용하여 정확한 일진 계산
 */
export const getTodayDailyPillar = (): {
    gan: string;
    zhi: string;
    ganElement: string;
    zhiElement: string;
    ganColor: string;
    zhiColor: string;
} => {
    try {
        const now = new Date();
        const solar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0, 0);
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();

        const dayGanHanja = bazi.getDayGan();
        const dayZhiHanja = bazi.getDayZhi();

        const ganIdx = GAN_MAP[dayGanHanja];
        const zhiIdx = ZHI_MAP[dayZhiHanja];

        const gan = HEAVENLY_STEMS[ganIdx] || HEAVENLY_STEMS[5]; // 기 기본값
        const zhi = EARTHLY_BRANCHES[zhiIdx] || EARTHLY_BRANCHES[3]; // 묘 기본값

        return {
            gan: gan.char,
            zhi: zhi.char,
            ganElement: gan.label,
            zhiElement: zhi.label,
            ganColor: gan.color,
            zhiColor: zhi.color
        };
    } catch (e) {
        console.error('Daily pillar calculation error:', e);
        return {
            gan: '기',
            zhi: '묘',
            ganElement: '토',
            zhiElement: '목',
            ganColor: '#F59E0B',
            zhiColor: '#10B981'
        };
    }
};
