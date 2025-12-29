import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase Client (Service Role for secure writes, or Anon if RLS allows)
// Note: In API routes, use Service Role to bypass RLS if strictly needed, but better to stick to RLS context.
// Here we assume this is called from API Routes where we can pass the user context or use Service Role.

export class MemoryService {

    private static supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    private static supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    private static supabase = createClient(this.supabaseUrl, this.supabaseKey);

    private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    private static embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });

    /**
     * Embeds text using Gemini
     */
    private static async getEmbedding(text: string): Promise<number[]> {
        const result = await this.embeddingModel.embedContent(text);
        return result.embedding.values;
    }

    /**
     * Stores a new memory (Conversation Summary or Insight)
     */
    static async storeMemory(userId: string, content: string, metadata: any = {}) {
        try {
            if (!content || content.length < 5) return;

            const embedding = await this.getEmbedding(content);

            const { error } = await this.supabase
                .from('user_memories')
                .insert({
                    user_id: userId,
                    content: content,
                    embedding: embedding,
                    metadata: metadata
                });

            if (error) throw error;
            console.log(`🧠 [Memory] Stored for User ${userId}: "${content.substring(0, 30)}..."`);
        } catch (e) {
            console.error("Memory Store Error:", e);
        }
    }

    /**
     * Recalls relevant memories based on the current context (User Message)
     */
    static async recallMemories(userId: string, query: string, limit: number = 3): Promise<string> {
        try {
            const embedding = await this.getEmbedding(query);

            const { data, error } = await this.supabase.rpc('match_memories', {
                query_embedding: embedding,
                match_threshold: 0.5, // Relevance threshold
                match_count: limit,
                filter_user_id: userId
            });

            if (error) {
                console.error("Memory Search Error:", error);
                return "";
            }

            if (!data || data.length === 0) return "";

            // Format memories for Prompt Injection
            let memoryContext = "## [Episodic Memory (Past Conversations)]\n";
            data.forEach((mem: any, index: number) => {
                const date = new Date(mem.created_at).toLocaleDateString();
                memoryContext += `- (${date}) ${mem.content}\n`;
            });

            console.log(`🧠 [Memory] Recalled ${data.length} items for User ${userId}`);
            return memoryContext;

        } catch (e) {
            console.error("Memory Recall Failed:", e);
            return "";
        }
    }

    /**
     * Summarizes a conversation session to a concise memory (using Gemini)
     * This should be called at the end of a session or periodically.
     */
    static async summarizeAndStore(userId: string, messages: any[]) {
        if (messages.length < 4) return; // Too short to remember

        try {
            // Create a summary prompt
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

            await this.storeMemory(userId, summary, { type: 'auto-summary' });

        } catch (e) {
            console.error("Auto-Summary Failed:", e);
        }
    }

    /**
     * Extracts specific entities (Diet, Mood, Worry) for "Soul Partner" memory.
     * Stores them as structured entity memories.
     */
    static async extractAndStoreEntities(userId: string, messages: any[]) {
        if (messages.length < 4) return;

        try {
            const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            Analyze the following conversation and extract specific user preferences or patterns.
            Output ONLY a JSON object with these keys (if found):
            {
                "diet_preferences": ["spicy food", "coffee addict", ...],
                "mood_patterns": ["anxious at night", "energetic morning", ...],
                "core_worries": ["money", "health", ...]
            }
            If nothing relevant is found, return empty arrays.
            Language: Korean.

            Conversation:
            ${conversationText}
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            // Clean markdown json blocks if any
            const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const entities = JSON.parse(jsonText);

            // Store each non-empty category
            const categories = ['diet_preferences', 'mood_patterns', 'core_worries'];

            for (const category of categories) {
                const items = entities[category];
                if (items && Array.isArray(items) && items.length > 0) {
                    const content = `[Entity: ${category}] ${items.join(', ')}`;

                    // Check duplication (lightweight) - optional, skipping for now to ensure capture
                    await this.storeMemory(userId, content, { type: 'entity', category });
                }
            }

        } catch (e) {
            console.error("Entity Extraction Failed:", e);
        }
    }
}
