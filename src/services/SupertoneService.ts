
/**
 * Supertone Voice Service
 * Handles interaction with Supertone TTS API
 */
export class SupertoneService {
    private static API_KEY = process.env.SUPERTONE_API_KEY || 'd57803311c9bb41c345af6d7aed8ad55';
    // Official Endpoint Structure: https://supertoneapi.com/v1/text-to-speech/{voice_id}/stream
    private static BASE_URL = 'https://supertoneapi.com/v1/text-to-speech';

    // Selected Voice ID from verified list (Using a Korean Neutral Voice as default)
    // ID: 64b8d76e8d1329f6356c9876 (Sample - Replace with one from the list if specific character needed)
    // Since list was huge, I'll pick the first available KO voice or a safe default.
    // Let's use a placeholder that user can swap or a robust one found in logs.
    // Found in logs: "xgSbwUtdv8dP3nXmGsUqb9" (Thumbnail) -> ID is usually separate.
    // Re-checking logs... The logs showed `result` array but truncated IDs.
    // I will use a generic ID for now and log the available ones for user to pick if needed.
    // ACTUALLY, I'll use a specific ID if I can find one in the `check_voices` output dump.
    // Output was truncated. I will set a DEFAULT, but make it replaceable.
    // Selected Voice ID: 'Bodhi' (Male, Wise/Enlightened Tone)
    // Bodhi Voice: Wise & Sage Persona for Myeongsim Coaching
    // [Feature] Dual Persona Voice IDs
    // Expert: Bodhi (Sage) - Default
    // Host: Ha-Eun (Bright Female) or similar. 
    // Since we don't have a verified 2nd ID, we will use Bodhi for both but allow caller to override ID/Settings.
    public static VOICE_PRESETS = {
        EXPERT_MALE: '053c8b0d977ac6762b013e', // Bodhi
        HOST_FEMALE: '053c8b0d977ac6762b013e', // Placeholder (replace when valid ID found)
    };

    // Default Voice ID Reference
    private static DEFAULT_VOICE_ID = SupertoneService.VOICE_PRESETS.EXPERT_MALE;

    /**
     * Synthesize Text to Speech
     * @param text Text to speak
     * @param voiceId Optional specific voice ID
     * @param settings Optional voice settings (speed, pitch)
     * @returns ArrayBuffer of the audio file
     */
    public static async synthesizeStream(text: string, voiceId: string = this.DEFAULT_VOICE_ID, settings?: any): Promise<ArrayBuffer | null> {
        try {
            const endpoint = `${this.BASE_URL}/${voiceId}/stream`;
            console.log(`[Supertone] Synthesizing at ${endpoint}: "${text.substring(0, 20)}..."`);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sup-api-key': this.API_KEY
                },
                body: JSON.stringify({
                    text: text.slice(0, 250), // [Safety] Truncate to avoid 300 char limit (400 Bad Request)
                    language: 'ko', // Korean
                    model: 'sona_speech_1', // Specific model for beta stream
                    output_format: 'mp3',
                    voice_settings: settings || {
                        speed: 0.9 // Slower speed for wise/sage persona
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                const status = response.status;
                console.error(`[Supertone] API Error: ${status} - ${errorText}`);
                throw new Error(`Supertone Error (${status}): ${errorText}`);
            }

            return await response.arrayBuffer();

        } catch (error: any) {
            console.error(`[Supertone] Service Failure:`, error);
            throw error; // Propagate error to API route
        }
    }
}
