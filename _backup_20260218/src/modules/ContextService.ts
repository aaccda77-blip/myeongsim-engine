
/**
 * ContextService.ts (Layer 2)
 * Provides environmental context (Time, Season, Weather) to the AI.
 */
export class ContextService {
    /**
     * Retrieves the current spatio-temporal context.
     * @param location User's location (optional)
     * @returns A string describing the current context (e.g., "Night/Winter").
     */
    static async getCurrentContext(location?: string, clientDate?: Date): Promise<string> {
        const now = clientDate || new Date();

        // [Fix] Server is UTC, User is KST. Force conversion to Asia/Seoul.
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: 'Asia/Seoul'
        }).format(now));

        const month = parseInt(new Intl.DateTimeFormat('en-US', {
            month: 'numeric',
            timeZone: 'Asia/Seoul'
        }).format(now));

        // 1. Time Context
        let timeDesc = "Day";
        if (hour >= 5 && hour < 12) timeDesc = "Morning (활기찬 아침)";
        else if (hour >= 12 && hour < 17) timeDesc = "Afternoon (나른한 오후)";
        else if (hour >= 17 && hour < 21) timeDesc = "Evening (차분한 저녁)";
        else if (hour >= 21 || hour < 5) timeDesc = "Night (고요한 밤)";

        // 2. Season Context (Northern Hemisphere)
        let season = "Spring";
        if (month >= 3 && month <= 5) season = "Spring (따스한 봄)";
        else if (month >= 6 && month <= 8) season = "Summer (무더운 여름)";
        else if (month >= 9 && month <= 11) season = "Autumn (쓸쓸한 가을)";
        else season = "Winter (추운 겨울)";

        // 3. Weather Context (Mock: In real app, call OpenWeatherMap here)
        const weathers = ['Clear', 'Cloudy', 'Rainy', 'Windy', 'Snowy'];
        const weather = weathers[Math.floor(Math.random() * weathers.length)];

        // Debug Log
        console.log(`🕒 [Context] KST Time: ${hour}시, Season: ${season}, Weather: ${weather}`);

        return `[현재 환경: ${timeDesc}, ${season}, 날씨 ${weather}]`;
    }
}
