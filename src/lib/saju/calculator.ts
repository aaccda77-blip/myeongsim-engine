// @ts-ignore
import Iztro from 'iztro';
// @ts-ignore
import Calendar from 'korean-lunar-calendar';

export interface SajuResult {
    year: string;
    month: string;
    day: string;
    hour: string;
}

export function getSajuCharacters(
    dateStr: string,
    timeStr: string,
    isLunar: boolean = false,
    gender: 'male' | 'female' = 'male'
): SajuResult {
    // Default to solar Date
    let targetDate = new Date(`${dateStr}T${timeStr}:00`);

    // 1. Lunar -> Solar Conversion
    if (isLunar) {
        try {
            const cal: any = new Calendar(); // Forced any cast
            const [year, month, day] = dateStr.split('-').map(Number);

            // setLunarDate(year, month, day, isLeapMonth)
            cal.setLunarDate(year, month, day, false);

            const solar = cal.getSolarDate(); // { year, month, day }
            targetDate = new Date(`${solar.year}-${solar.month}-${solar.day}T${timeStr}:00`);
        } catch (e) {
            console.error("Lunar conversion failed, using solar date", e);
        }
    }

    // 2. Calculate Saju using Iztro (High Precision)
    let saju: any;
    try {
        // Try constructor with any cast to avoid namespace issues
        const IztroClass: any = Iztro;
        saju = new IztroClass({
            birthDate: targetDate,
            gender: gender === 'male' ? '男' : '女',
        });
    } catch (e) {
        console.error("Iztro init failed", e);
        return { year: 'Error', month: 'Error', day: 'Error', hour: 'Error' };
    }

    return {
        year: saju?.yearPillar?.ganji || '?',  // 년주
        month: saju?.monthPillar?.ganji || '?', // 월주
        day: saju?.dayPillar?.ganji || '?',    // 일주
        hour: saju?.hourPillar?.ganji || '?',   // 시주
    };
}
