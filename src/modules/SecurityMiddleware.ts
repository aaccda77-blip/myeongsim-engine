
/**
 * SecurityMiddleware.ts (Security Layer)
 * Validates inputs to prevent Prompt Injection and Abuse.
 */
export class SecurityMiddleware {
    /**
     * Validates the user input for malicious content.
     * @param userInput The message string from the user.
     * @throws Error if malicious keywords are detected.
     */
    static validateInput(userInput: string): void {
        const FORBIDDEN_KEYWORDS = [
            'System Override',
            'Ignore previous instructions',
            'Jailbreak',
            'Developer Mode',
            'Simulate'
        ];

        const lowerMsg = userInput.toLowerCase();

        if (FORBIDDEN_KEYWORDS.some(k => lowerMsg.includes(k.toLowerCase()))) {
            console.warn(`🚨 [Security Block] Restricted Keyword Detected.`);
            throw new Error("Malicious Input Detected");
        }
    }
}
