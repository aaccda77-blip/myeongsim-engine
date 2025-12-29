
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
    static async getCurrentContext(location?: string): Promise<string> {
        const now = new Date();
        const hour = now.getHours();
        const month = now.getMonth() + 1;

        // 1. Time Context
        let timeDesc = "Day";
        if (hour < 6) timeDesc = "Dawn (Early Morning)";
        else if (hour < 12) timeDesc = "Morning";
        else if (hour < 18) timeDesc = "Afternoon";
        else if (hour < 22) timeDesc = "Evening";
        else timeDesc = "Night (Late)";

        // 2. Season Context (Northern Hemisphere)
        let season = "Spring";
        if (month >= 3 && month <= 5) season = "Spring";
        else if (month >= 6 && month <= 8) season = "Summer";
        else if (month >= 9 && month <= 11) season = "Autumn";
        else season = "Winter";

        // 3. Weather Context (Mock: In real app, call OpenWeatherMap here)
        // For MVP, randomly assign or default to 'Clear'
        const weathers = ['Clear', 'Cloudy', 'Rainy', 'Windy'];
        const weather = weathers[Math.floor(Math.random() * weathers.length)];

        return `[Time: ${timeDesc}] [Season: ${season}] [Weather: ${weather}]`;
    }
}
