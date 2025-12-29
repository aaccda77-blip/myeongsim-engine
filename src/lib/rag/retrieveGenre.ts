import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize clients (Server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export interface GenreCode {
    id: number;
    content: string;
    metadata: {
        code_id: string;
        keywords: string;
        title: string;
        source: string;
    };
    similarity: number;
}

export async function retrieveGenreCodes(query: string, limit = 1): Promise<GenreCode[]> {
    try {
        // 1. Embed the query
        const result = await model.embedContent(query);
        const queryEmbedding = result.embedding.values;

        // 2. RPC Call to Supabase
        const { data: documents, error } = await supabase.rpc('match_knowledge', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: limit,
            filter: { source: 'error_is_genre' }
        });

        if (error) {
            console.error("❌ RAG Vector Search Error:", error);
            return [];
        }

        return documents as GenreCode[];
    } catch (e) {
        console.error("❌ RAG Retrieval Failed:", e);
        return [];
    }
}
