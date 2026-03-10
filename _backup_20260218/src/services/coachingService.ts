import { supabase } from '@/lib/supabaseClient';

export const coachingService = {
    /**
     * Log a chat message to history
     */
    /**
     * Log a chat message to history
     */
    /**
     * Log a chat message to history (Schema 2.0)
     */
    async logChatMessage(userId: string, role: 'user' | 'assistant', content: string, stage: number, metadata: any = {}, sessionId?: string) {
        if (!sessionId) return;

        // 1. Ensure Session Exists (Idempotent)
        const { error: sessionError } = await supabase
            .from('chat_sessions')
            .upsert({
                id: sessionId,
                user_id: userId,
                topic: `Stage ${stage} Counseling`
            }, { onConflict: 'id' });

        if (sessionError) console.warn('Session Sync Warning:', sessionError);

        // 2. Log Message
        const { error } = await supabase
            .from('chat_messages')
            .insert({
                session_id: sessionId,
                role,
                content,
                // metadata column not in user schema, ignoring or assuming JSONB if extensions allowed.
                // User schema 3: id, session_id, role, content, created_at.
                // We will drop metadata for strict schema compliance, or rely on extensions if user adds jsonb.
                // Let's stick to core fields for safety.
            });

        if (error) console.error('Failed to log chat:', error);
    },

    /**
     * Fetch chat history for a user
     */
    async getChatHistory(userId: string, limit: number = 50, sessionId?: string) {
        let query = supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true }) // Load oldest to newest
            .limit(limit);

        // [New] Session Filter
        if (sessionId) {
            query = query.eq('session_id', sessionId);
        } else {
            // If no session provided, maybe filter by user via join? 
            // Logic is tricky without session_id since chat_messages doesn't have user_id in user schema.
            // We will assume sessionId is always provided or we need a join.
            // For MVP, relying on sessionId.
            return [];
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to fetch history:', error);
            return [];
        }
        return data || [];
    },

    /**
     * Save the AI summary of a completed stage (Context Memory)
     */
    async saveStageSummary(userId: string, stage: number, summary: string) {
        const { error } = await supabase
            .from('coaching_sessions')
            .upsert({
                user_id: userId,
                stage_level: stage,
                summary: summary
            }, { onConflict: 'user_id, stage_level' });

        if (error) throw error;
    },

    /**
     * Fetch accumulated summaries for Context Injection
     */
    async getAccumulatedContext(userId: string, currentStage: number): Promise<string> {
        const { data, error } = await supabase
            .from('coaching_sessions')
            .select('stage_level, summary')
            .eq('user_id', userId)
            .lt('stage_level', currentStage)
            .order('stage_level', { ascending: true });

        if (error || !data) return "이전 상담 기록 없음 (신규 내담자)";

        let contextText = "";
        data.forEach(item => {
            contextText += `[${item.stage_level}단계 요약]: ${item.summary}\n`;
        });

        return contextText || "이전 상담 기록 없음 (신규 내담자)";
    },
    /**
     * Clear all chat history (Clean Session)
     */
    async clearChatHistory(userId: string) {
        // Deleting session cascades to messages
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Failed to clear sessions:', error);
            throw error;
        }
    }
};
