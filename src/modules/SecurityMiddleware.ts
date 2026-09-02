import { createClient } from '@supabase/supabase-js';
import { PromptFirewall } from '@/modules/Security/PromptFirewall';
import { FairUsagePolicy } from '@/lib/fairUsagePolicy';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'; // Use Service Role Key if strict backend needed, but Anon is okay for reading public history if policies valid
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * SecurityMiddleware.ts (Security Layer)
 * Validates inputs to prevent Prompt Injection, Abuse, and Rate Limiting.
 */
export class SecurityMiddleware {
    /**
     * Validates the user input for malicious content.
     * @param userInput The message string from the user.
     * @throws Error if malicious keywords are detected.
     */
    static validateInput(userInput: string): void {
        // [UPDATE] Increased limit to 100k to allow for long System Prompts & History
        // Old limit (2000) was too strict for RAG/Context injections
        if (!userInput || userInput.length > 100000) {
            throw new Error("Input payload too large");
        }

        // 1. [Security Upgrade] Advanced Prompt Firewall Check
        // Replaces simple Regex with dedicated module logic


        const firewallResult = PromptFirewall.inspect(userInput);
        if (!firewallResult.isSafe) {
            console.warn(`🚨 [Security] Firewall Blocked: ${firewallResult.reason} (Risk: ${firewallResult.riskLevel})`);
            throw new Error(`Security Alert: ${firewallResult.reason}`);
        }

        // 2. Legacy Fallback (SQLi, XSS, Cmd Injection - Redundant but Safe)
        const MALICIOUS_PATTERNS = [
            // SQL Injection
            /(\b(select|insert|update|delete|drop|union|exec)\b.*\b(from|into|table|database)\b)/i,
            /'\s*OR\s*'\d+'='\d+/i,
            // XSS / Scripting
            /<script\b[^>]*>([\s\S]*?)<\/script>/i,
            /javascript:/i,
            // System Cmd
            /rm\s+-rf/i,
            /\/etc\/passwd/i
        ];

        MALICIOUS_PATTERNS.forEach(pattern => {
            if (pattern.test(userInput)) {
                console.warn(`🚨 [Security] Malicious Pattern Detected: ${pattern}`);
                throw new Error("Security Alert: Malicious Request Blocked.");
            }
        });
    }

    /**
     * Honeypot Check: Detects bot activity accessing fake admin routes
     */
    static checkHoneypot(path: string): void {
        const HONEYPOT_ROUTES = ['/api/admin/super-secret', '/admin/config', '/api/debug/env'];
        if (HONEYPOT_ROUTES.some(r => path.includes(r))) {
            console.error(`🚨 [HONEYPOT TRIGGERED] IP BAN REQUESTED for access to ${path}`);
            // In a real scenario, we would insert this IP into a Supabase 'blacklist' table
            throw new Error("ACCESS_DENIED_PERMANENT");
        }
    }

    /**
     * Checks if the user has exceeded the message rate limit & Fair Usage Policy.
     * @param userId The User ID or Access Key.
     * @param isVip VIP or Free user.
     * @param sessionId Optional client session ID.
     * @returns Promise<void> Throws error if limit exceeded.
     */
    static async checkRateLimit(userId: string, isVip: boolean = true, sessionId?: string): Promise<void> {
        // 1. Fast in-memory Fair Usage Policy Check (Daily Cap 100 & Burst Defense)
        const fupResult = FairUsagePolicy.verifyAndIncrement(userId, isVip, sessionId);
        if (!fupResult.allowed) {
            console.warn(`🚨 [FUP Blocked] User ${userId}: ${fupResult.reason}`);
            throw new Error(fupResult.userMessage || "일일 대화 한도를 초과했습니다.");
        }

        // 2. DB-level fallback check (if Supabase configured)
        try {
            const LIMIT_PER_MINUTE = 15;
            const now = new Date();
            const oneMinuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();

            const { count: minuteCount, error: minuteError } = await supabase
                .from('chat_history')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .gte('created_at', oneMinuteAgo);

            if (!minuteError && (minuteCount || 0) >= LIMIT_PER_MINUTE) {
                console.warn(`🚨 [Rate Limit] User ${userId} exceeded minute DB limit.`);
                throw new Error("너무 빠른 연속 요청입니다. 잠시 후 다시 입력해 주세요.");
            }
        } catch (dbErr: any) {
            if (dbErr.message?.includes("너무 빠른")) throw dbErr;
            // Silent fallback to FUP memory check on DB error
        }
    }
}
