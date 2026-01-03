import { Solar, Lunar } from 'lunar-javascript';

// Types
export interface DailyBiorhythm {
    date: string;
    ganji: string; // e.g. "갑자"
    energyScore: number; // 0-100
    energyLevel: 'High' | 'Medium' | 'Low';
    mode: 'Attack' | 'Defense' | 'Recovery'; // 코칭 모드
    advice: string; // 심리학적 조언
    goldenTime: string; // 뇌과학적 골든타임
    luckyColor: string;
}

// 10 Gods (Ten Dieties) Relationship Helper
// Simple mapping for MVP:
// Day Master (Self) vs Today's Stem
const RELATIONSHIPS: Record<string, Record<string, 'Resource' | 'Output' | 'Wealth' | 'Power' | 'Self'>> = {
    // 갑 (Wood+)
    '갑': { '갑': 'Self', '을': 'Self', '병': 'Output', '정': 'Output', '무': 'Wealth', '기': 'Wealth', '경': 'Power', '신': 'Power', '임': 'Resource', '계': 'Resource' },
    // 을 (Wood-)
    '을': { '갑': 'Self', '을': 'Self', '병': 'Output', '정': 'Output', '무': 'Wealth', '기': 'Wealth', '경': 'Power', '신': 'Power', '임': 'Resource', '계': 'Resource' },
    // ... Simplified for all 10 stems (Pattern is cyclical)
    // For MVP, we'll use a simpler element checker function
};

// Element Mapping
const ELEMENTS = {
    '갑': 'wood', '을': 'wood',
    '병': 'fire', '정': 'fire',
    '무': 'earth', '기': 'earth',
    '경': 'metal', '신': 'metal',
    '임': 'water', '계': 'water'
};

const ELEMENT_RELATIONS = {
    'wood': { 'wood': 'Self', 'fire': 'Output', 'earth': 'Wealth', 'metal': 'Power', 'water': 'Resource' },
    'fire': { 'wood': 'Resource', 'fire': 'Self', 'earth': 'Output', 'metal': 'Wealth', 'water': 'Power' },
    'earth': { 'wood': 'Power', 'fire': 'Resource', 'earth': 'Self', 'metal': 'Output', 'water': 'Wealth' },
    'metal': { 'wood': 'Wealth', 'fire': 'Power', 'earth': 'Resource', 'metal': 'Self', 'water': 'Output' },
    'water': { 'wood': 'Output', 'fire': 'Wealth', 'earth': 'Power', 'metal': 'Resource', 'water': 'Self' }
};

export class DailyLuckEngine {

    static calculate(dayMasterChar: string): DailyBiorhythm {
        const today = new Date();
        const solar = Solar.fromYmdHms(today.getFullYear(), today.getMonth() + 1, today.getDate(), 12, 0, 0);
        const lunar = solar.getLunar();

        // Today's Ganji
        const dayGan = lunar.getDayGan();
        const dayZhi = lunar.getDayZhi();
        const dayGanji = `${dayGan}${dayZhi}`;

        // Get Element of Day Master and Today
        const myElement = ELEMENTS[dayMasterChar as keyof typeof ELEMENTS] || 'wood'; // Default
        const todayElement = ELEMENTS[dayGan as keyof typeof ELEMENTS] || 'wood';

        // Determine Relationship (Ten Gods)
        // @ts-ignore
        const relation = ELEMENT_RELATIONS[myElement][todayElement];

        // Logic: Calculate Score & Mode
        let score = 50;
        let mode: 'Attack' | 'Defense' | 'Recovery' = 'Recovery';
        let advice = "평온한 하루입니다.";
        let goldenTime = "14:00 - 16:00";

        if (relation === 'Resource') { // 인성 (Support)
            score = 90;
            mode = 'Recovery';
            advice = "우주가 당신을 돕는 날입니다. 마음껏 에너지를 충전하세요. (Resource Day)";
            goldenTime = "06:00 - 09:00 (아침 명상)";
        } else if (relation === 'Self') { // 비겁 (Strength)
            score = 85;
            mode = 'Attack';
            advice = "자신감이 넘치는 날입니다. 주도적으로 일을 추진하세요. (Self Day)";
            goldenTime = "13:00 - 15:00 (핵심 업무)";
        } else if (relation === 'Output') { // 식상 (Creativity)
            score = 70;
            mode = 'Attack';
            advice = "표현력이 폭발하는 날입니다. 아이디어를 세상에 내놓으세요. (Output Day)";
            goldenTime = "19:00 - 21:00 (창작 활동)";
        } else if (relation === 'Wealth') { // 재성 (Result/Control)
            score = 60;
            mode = 'Attack';
            advice = "결과를 만들어내는 날입니다. 현실적인 목표에 집중하세요. (Wealth Day)";
            goldenTime = "10:00 - 12:00 (비즈니스 미팅)";
        } else if (relation === 'Power') { // 관성 (Pressure/Responsibility)
            score = 40;
            mode = 'Defense';
            advice = "책임감이 무겁게 느껴질 수 있습니다. 무리하지 말고 원칙을 지키세요. (Power Day)";
            goldenTime = "20:00 - 22:00 (조용한 휴식)";
        }

        // Randomize slightly to make it feel organic (optional)
        // score += Math.floor(Math.random() * 10) - 5; 

        return {
            date: `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`,
            ganji: dayGanji,
            energyScore: score,
            energyLevel: score >= 80 ? 'High' : score >= 50 ? 'Medium' : 'Low',
            mode,
            advice,
            goldenTime,
            luckyColor: '#10B981' // Dynamic color logic can be added later
        };
    }
}
