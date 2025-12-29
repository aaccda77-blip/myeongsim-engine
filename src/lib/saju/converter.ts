import { Solar, Lunar, EightChar } from 'lunar-javascript';
import 'server-only';

export class SajuConverter {
    /**
     * calculate: 생년월일시를 입력받아 정확한 대운과 세운을 계산함.
     * @param birthDate 'YYYY-MM-DD'
     * @param birthTime 'HH:mm'
     * @param gender 'male' | 'female'
     */
    static calculate(birthDate: string, birthTime: string, gender: string) {
        // 1. Parse Input
        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime ? birthTime.split(':').map(Number) : [12, 0];

        // 2. Create Solar & Lunar
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();

        // 3. 일간 (Day Master) 추출
        const dayGan = bazi.getDayGan(); // 예: '甲'
        const dayMaster = this.mapDayMaster(dayGan); // 예: '갑목(Gap-Wood)'

        // 4. 대운 (Daewoon) 계산
        // [Fix] Use provided gender (1 for male, 0 for female)
        const genderNum = gender === 'male' ? 1 : 0;
        const yun = (bazi as any).getYun(genderNum);

        // 현재 나이 기준 대운 찾기
        const currentYear = new Date().getFullYear();
        const age = currentYear - year + 1; // 한국 나이 대략 계산

        // 대운 목록에서 현재 나이에 해당하는 대운 찾기
        const daewoonList = yun.getDaYun();
        let currentDaYun = daewoonList[0];

        for (const dy of daewoonList) {
            // lunar-javascript DaYun.getStartYear() returns the calendar year the cycle starts
            if (dy.getStartYear() <= currentYear) {
                currentDaYun = dy;
            } else {
                break;
            }
        }

        const daewoonGanZhi = currentDaYun.getGanZhi(); // 예: '甲子'
        const daewoonName = `${daewoonGanZhi} 대운`;
        const daewoonSeason = this.getSeason(currentDaYun.getZhi()); // 지지(Zhi)로 계절 판단

        // 5. 세운 (Seun) 계산
        // 2025년 기준
        const targetYear = new Date().getFullYear();
        const now = new Date();
        const currentSolar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        const currentLunar = currentSolar.getLunar();
        const currentBazi = currentLunar.getEightChar();
        const seunGanZhi = currentBazi.getYearGan() + currentBazi.getYearZhi(); // [Fix] Use EightChar
        const seunElement = this.getElement(seunGanZhi); // '푸른 뱀'

        return {
            dayMaster,
            currentDaewoon: daewoonName,
            daewoonSeason,
            seun: {
                year: targetYear.toString(),
                element: seunElement,
                ganZhi: seunGanZhi
            }
        };
    }

    private static mapDayMaster(char: string): string {
        const map: Record<string, string> = {
            '甲': '갑목(Gap-Wood)', '乙': '을목(Yi-Wood)',
            '丙': '병화(Bing-Fire)', '丁': '정화(Ding-Fire)',
            '戊': '무토(Wu-Earth)', '己': '기토(Ji-Earth)',
            '庚': '경금(Geng-Metal)', '辛': '신금(Xin-Metal)',
            '壬': '임수(Ren-Water)', '癸': '계수(Gui-Water)'
        };
        return map[char] || char;
    }

    private static getSeason(zhi: string): string {
        // 인묘진(봄), 사오미(여름), 신유술(가을), 해자축(겨울)
        if (['寅', '卯', '辰'].includes(zhi)) return 'Spring (봄 - 목왕절)';
        if (['巳', '午', '未'].includes(zhi)) return 'Summer (여름 - 화왕절)';
        if (['申', '酉', '戌'].includes(zhi)) return 'Autumn (가을 - 금왕절)';
        if (['亥', '子', '丑'].includes(zhi)) return 'Winter (겨울 - 수왕절)';
        return 'Transition (환절기)';
    }

    private static getElement(ganZhi: string): string {
        const gan = ganZhi[0];
        const zhi = ganZhi[1];

        const colorMap: Record<string, string> = {
            '甲': '푸른', '乙': '푸른',
            '丙': '붉은', '丁': '붉은',
            '戊': '황금', '己': '황금',
            '庚': '하얀', '辛': '하얀',
            '壬': '검은', '癸': '검은'
        };

        const animalMap: Record<string, string> = {
            '子': '쥐', '丑': '소', '寅': '호랑이', '卯': '토끼',
            '辰': '용', '巳': '뱀', '午': '말', '未': '양',
            '申': '원숭이', '酉': '닭', '戌': '개', '亥': '돼지'
        };

        return `${colorMap[gan] || ''} ${animalMap[zhi] || ''} (${ganZhi})`;
    }
}
