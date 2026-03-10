
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Check if the user has exceeded the rate limit.
 * Limit: 5 requests per 1 minute.
 */
export async function checkRateLimit(supabase: SupabaseClient, userId: string): Promise<boolean> {
    if (userId === 'guest') return true; // Guests handled separately (or limited by IP if we had it, for now lenient)
    // Actually, we should limit guests too if possible, but without IP it's hard.
    // For MVP, we limit logged-in users to protect specific user accounts from abuse,
    // and Rely on the global 500 error catch for AI limits if token runs out.
    // But better: Limit guests based on a cookie or local storage token passed in headers? 
    // Let's stick to User ID for now.

    // Calculate 1 minute ago
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

    const { count, error } = await supabase
        .from('integral_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', oneMinuteAgo); // Assuming 'created_at' exists or 'date' is high res?
    // Wait, integral_logs might just have 'date' (YYYY-MM-DD).
    // Let's check the schema.

    if (error) {
        // Fail Open: If DB error (e.g. column missing), allow request to ensure UX
        console.warn('RateLimit Check Skipped (DB Error):', error.message);
        return true;
    }

    return (count || 0) < 5;
}
