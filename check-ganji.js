const { Solar } = require('lunar-javascript');

function checkDate(year, month, day) {
    const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar();

    const dayGan = bazi.getDayGan();
    const dayZhi = bazi.getDayZhi();

    console.log(`${year}-${month}-${day}: ${dayGan}${dayZhi}`);
}

console.log("Checking Jan 2026 Ganji...");
checkDate(2026, 1, 1);
checkDate(2026, 1, 2);
checkDate(2026, 1, 3);
