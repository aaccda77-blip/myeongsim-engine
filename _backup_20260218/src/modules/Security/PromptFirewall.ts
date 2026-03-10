/**
 * Prompt Firewall (Layer 6 Defense)
 * Detects and blocks LLM Jailbreak attempts ("DAN", "Ignore Instructions", etc.)
 * Ensures the AI remains within its ethical and operational boundaries.
 */

export interface FirewallResult {
    isSafe: boolean;
    reason?: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class PromptFirewall {
    // Known Jailbreak Signatures (Regex)
    private static readonly JAILBREAK_PATTERNS = [
        /ignore (all )?previous instructions/i,
        /do anything now/i,
        /dan mode/i,
        /roleplay as (an )?evil/i,
        /system override/i,
        /developer mode/i,
        /you are not a language model/i,
        /forget your rules/i,
        /unrestricted/i,
        /jailbroken/i,
        /act as a hacker/i,
        /execute SQL/i,
        /drop table/i
    ];

    // Suspicious Keywords (Lower Risk)
    private static readonly SUSPICIOUS_KEYWORDS = [
        "sql injection", "xss", "alert(", "<script>", "hack", "bypass"
    ];

    /**
     * Inspects a user message for potential prompt injection attacks.
     */
    static inspect(message: string): FirewallResult {
        if (!message || typeof message !== 'string') {
            return { isSafe: true, riskLevel: 'LOW' };
        }

        const lowerMsg = message.toLowerCase();

        // 1. Critical Pattern Check (Regex)
        for (const pattern of this.JAILBREAK_PATTERNS) {
            if (pattern.test(lowerMsg)) {
                return {
                    isSafe: false,
                    reason: "Jailbreak attempt detected (Pattern Match)",
                    riskLevel: 'CRITICAL'
                };
            }
        }

        // 2. Keyword Density Check
        let suspiciousCount = 0;
        for (const keyword of this.SUSPICIOUS_KEYWORDS) {
            if (lowerMsg.includes(keyword)) {
                suspiciousCount++;
            }
        }

        if (suspiciousCount >= 2) {
            return {
                isSafe: false,
                reason: "Suspicious content detected (Keyword Density)",
                riskLevel: 'HIGH'
            };
        }

        // 3. Length Heuristic (Too long messages are often prompt injections)
        if (message.length > 5000) {
            return {
                isSafe: false,
                reason: "Message too long (Potential Buffer Overflow/DoS)",
                riskLevel: 'MEDIUM'
            };
        }

        return { isSafe: true, riskLevel: 'LOW' };
    }
}
