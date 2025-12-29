
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * MemoryService.ts (Layer 3)
 * Manages Long-Term Memory (LTM) using Vector Database.
 */
export class MemoryServiceModule {

    private static apiKey = process.env.GEMINI_API_KEY!;
    private static genAI = new GoogleGenerativeAI(this.apiKey);

    /**
     * Retrieves relevant past interactions from Vector DB.
     */
    static async fetchUserHistory(userId: string, query: string): Promise<string> {
        if (!query) return "";

        try {
            // 1. Generate Embedding for Query
            const model = this.genAI.getGenerativeModel({ model: "embedding-001" });
            const result = await model.embedContent(query);
            const embedding = result.embedding.values;

            // 2. Search Vector DB (Supabase pgvector)
            const { data: matchedDocs, error } = await supabase.rpc('match_memories', {
                query_embedding: embedding,
                match_threshold: 0.5, // Similarity threshold
                match_count: 3        // Top-3
            });

            if (error) {
                console.error("Vector Search Error:", error);
                return "";
            }

            // 3. Format Context
            if (!matchedDocs || matchedDocs.length === 0) return "";

            return matchedDocs.map((doc: any) =>
                `[Past Memory (${new Date(doc.created_at).toLocaleDateString()})]: ${doc.content}`
            ).join('\n');

        } catch (e) {
            console.error("Memory Fetch Error:", e);
            return "";
        }
    }

    /**
     * Saves the current interaction to Vector DB.
     */
    static async saveInteraction(userId: string, userQuery: string, aiResponse: string) {
        try {
            const content = `User: ${userQuery}\nAI: ${aiResponse}`;

            // 1. Generate Embedding
            const model = this.genAI.getGenerativeModel({ model: "embedding-001" });
            const result = await model.embedContent(content);
            const embedding = result.embedding.values;

            // 2. Save to Supabase
            const { error } = await supabase.from('user_memories').insert({
                user_id: userId,
                content: content,
                embedding: embedding,
                type: 'conversation'
            });

            if (error) console.error("Memory Save Error:", error);

        } catch (e) {
            console.error("Memory Save Error:", e);
        }
    }
}
