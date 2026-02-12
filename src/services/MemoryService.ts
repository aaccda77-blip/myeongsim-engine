import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createHash } from 'crypto';

// Initialize Supabase Client
export class MemoryService {

    private static supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    private static supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    private static supabase = createClient(this.supabaseUrl, this.supabaseKey);

    private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder-key');
    private static embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });

    /**
     * Generates a unique Persona ID
     */
    public static generatePersonaId(userId: string, targetName: string, birthDate: string): string {
        const rawString = `${userId}:${targetName}:${birthDate}`;
        return createHash('sha256').update(rawString).digest('hex');
    }

    /**
     * Embeds text using Gemini
     */
    private static async getEmbedding(text: string): Promise<number[]> {
        const result = await this.embeddingModel.embedContent(text);
        return result.embedding.values;
    }

    /**
     * Stores a new memory to long_term_memory
     */
    static async storeMemory(userId: string, personaId: string, content: string, metadata: any = {}) {
        try {
            if (!content || content.length < 5) return;

            const embedding = await this.getEmbedding(content);

            const { error } = await this.supabase
                .from('long_term_memory')
                .insert({
                    user_id: userId,
                    persona_id: personaId,
                    content: content,
                    embedding: embedding,
                    metadata: metadata
                });

            if (error) throw error;
            console.log(`🧠 [Memory] Stored for Persona ${personaId.substring(0, 8)}: "${content.substring(0, 30)}..."`);
        } catch (e) {
            console.error("Memory Store Error:", e);
        }
    }

    /**
     * Recalls relevant memories based on Persona Context
     */
    static async recallMemories(userId: string, personaId: string, query: string, limit: number = 3): Promise<string> {
        try {
            const embedding = await this.getEmbedding(query);

            const { data, error } = await this.supabase.rpc('match_memories', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: limit,
                p_user_id: userId,
                p_persona_id: personaId
            });

            if (error) {
                console.error("Memory Search Error:", error);
                // Return empty string on error to prevent crash
                return "";
            }

            if (!data || data.length === 0) return "";

            let memoryContext = "## [Episodic Memory (Past Conversations)]\n";
            data.forEach((mem: any) => {
                // If created_at is available in view
                // const date = mem.created_at ? new Date(mem.created_at).toLocaleDateString() : 'Past';
                memoryContext += `- ${mem.content}\n`;
            });

            console.log(`🧠 [Memory] Recalled ${data.length} items for Persona ${personaId.substring(0, 8)}`);
            return memoryContext;

        } catch (e) {
            console.error("Memory Recall Failed:", e);
            return "";
        }
    }

    /**
     * Auto-summarize and store
     */
    static async summarizeAndStore(userId: string, personaId: string, messages: any[]) {
        if (messages.length < 4) return;

        try {
            const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
            const summaryModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            Summarize the following consultation conversation into one key insight or user fact for long-term memory.
            Focus on: User's core problem, specific advice given, or personal details revealed.
            Language: Korean.
            Max Length: 2 sentences.
            
            Conversation:
            ${conversationText}
            `;

            const result = await summaryModel.generateContent(prompt);
            const summary = result.response.text();

            await this.storeMemory(userId, personaId, summary, { type: 'auto-summary' });

        } catch (e) {
            console.error("Auto-Summary Failed:", e);
        }
    }

    /**
     * Fetches recent chat history for a user (Standard DB)
     */
    static async fetchRecentChatLogs(userId: string, limit: number = 50) {
        const { data, error } = await this.supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) {
            console.error("Fetch History Error:", error);
            return [];
        }
        return data || [];
    }

    /**
     * Saves a chat message (Standard DB)
     */
    static async saveChatLog(userId: string, role: string, message: string, stage: number = 1) {
        const { error } = await this.supabase
            .from('chat_history')
            .insert({
                user_id: userId,
                role: role,
                message: message,
                metadata: { stage }
            });

        if (error) console.error("Save Chat Log Error:", error);
    }
}
