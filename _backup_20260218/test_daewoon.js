/**
 * 대운 검증 테스트 스크립트 v2
 * 경신년(庚申年) 계미월(癸未月) 신사일(辛巳日) 을미시(乙未時) 남자
 * 
 * 이미지에서 보이는 사주:
 * - 년주: 庚申 (경신)
 * - 월주: 癸未 (계미)
 * - 일주: 辛巳 (신사)
 * - 시주: 乙未 (을미)
 */

const { Solar, Lunar } = require('lunar-javascript');

// 경신년 = 1980년, 2040년 등
// 계미월 = 음력 6월 (양력 7월~8월)
// 신사일 = 찾아야 함

// 1980년 양력으로 여러 날짜 테스트해서 신사일 찾기
console.log('=== 신사일 찾기 (1980년 7~8월) ===');
for (let month = 7; month <= 8; month++) {
    for (let day = 1; day <= 31; day++) {
        try {
            const solar = Solar.fromYmdHms(1980, month, day, 13, 0, 0);
            const lunar = solar.getLunar();
            const bazi = lunar.getEightChar();

            const dayGanZhi = bazi.getDayGan() + bazi.getDayZhi();
            const monthGanZhi = bazi.getMonthGan() + bazi.getMonthZhi();

            // 신사일(辛巳) + 계미월(癸未) 찾기
            if (dayGanZhi === '辛巳' && monthGanZhi === '癸未') {
                console.log(`✅ 발견! 양력 1980-${month}-${day}`);
                console.log('년주:', bazi.getYearGan() + bazi.getYearZhi());
                console.log('월주:', bazi.getMonthGan() + bazi.getMonthZhi());
                console.log('일주:', bazi.getDayGan() + bazi.getDayZhi());
                console.log('시주:', bazi.getTimeGan() + bazi.getTimeZhi());

                // 대운 계산
                console.log('\n=== 10년 대운 ===');
                const yun = bazi.getYun(1); // 1 = 남자
                console.log('대운 시작 나이:', yun.getStartYear() - 1980);

                const daewoons = yun.getDaYun();
                for (let i = 0; i < Math.min(12, daewoons.length); i++) {
                    const d = daewoons[i];
                    console.log(`대운${i}: ${d.getGanZhi()} (시작년:${d.getStartYear()}, 만${d.getStartYear() - 1980}세)`);
                }
                return;
            }
        } catch (e) {
            // 날짜 오류 무시
        }
    }
}
console.log('신사일을 찾지 못했습니다.');
