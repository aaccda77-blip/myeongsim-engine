import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Use Service Role Key if strict backend needed, but Anon is okay for reading public history if policies valid
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
        if (!userInput || userInput.length > 2000) {
            throw new Error("Input payload too large");
        }

        // 1. Advanced Pattern Blocking (SQLi, XSS, Cmd Injection)
        const MALICIOUS_PATTERNS = [
            // SQL Injection
            /(\b(select|insert|update|delete|drop|union|exec)\b.*\b(from|into|table|database)\b)/i,
            /'\s*OR\s*'\d+'='\d+/i,
            // XSS / Scripting
            /<script\b[^>]*>([\s\S]*?)<\/script>/i,
            /javascript:/i,
            /onload\s*=/i,
            /eval\s*\(/i,
            // System Cmd
            /rm\s+-rf/i,
            /\/etc\/passwd/i,
            // Prompt Injection
            /Ignore previous instructions/i,
            /System Override/i
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
     * Checks if the user has exceeded the message rate limit.
     * @param userId The User ID or Access Key.
     * @returns Promise<void> Throws error if limit exceeded.
     */
    static async checkRateLimit(userId: string): Promise<void> {
        // 1. Define Limit Rules
        const LIMIT_PER_MINUTE = 10;
        const LIMIT_PER_DAY = 100;

        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

        // 2. Check Minute Limit
        const { count: minuteCount, error: minuteError } = await supabase
            .from('chat_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', oneMinuteAgo);

        if (minuteError) {
            console.error("Rate Limit Check Error (Minute):", minuteError);
            // Fail open or closed? Fail open to avoid blocking users on DB error, but log it.
            return;
        }

        if ((minuteCount || 0) >= LIMIT_PER_MINUTE) {
            console.warn(`🚨 [Rate Limit] User ${userId} exceeded minute limit.`);
            throw new Error("Rate limit exceeded (Max 10 messages/min). Please wait.");
        }

        // 3. Check Daily Limit (Optional - preventing token drain)
        // Only verify if minute check passed to save DB reads? No, need to check total volume.
        /* 
        const { count: dayCount, error: dayError } = await supabase
             .from('chat_history')
             .select('*', { count: 'exact', head: true })
             .eq('user_id', userId)
             .gte('created_at', oneDayAgo);

        if ((dayCount || 0) >= LIMIT_PER_DAY) {
             throw new Error("Daily limit exceeded.");
        }
        */
    }
}
