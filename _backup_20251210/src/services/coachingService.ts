import { supabase } from '@/lib/supabaseClient';

export const coachingService = {
    /**
     * Log a chat message to history
     */
    async logChatMessage(userId: string, role: 'user' | 'assistant', content: string, stage: number) {
        const { error } = await supabase
            .from('chat_logs')
            .insert({
                user_id: userId,
                role,
                content,
                stage_context: stage
            });

        if (error) console.error('Failed to log chat:', error);
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
            }, { onConflict: 'user_id, stage_level' });  // Note: Requires unique constraint on DB

        if (error) throw error;
    },

    /**
     * Fetch accumulated summaries for Context Injection
     * Returns a formatted string for the System Prompt.
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
    }
};
