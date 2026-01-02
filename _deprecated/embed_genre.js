const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

// Load envs (Local first to take precedence)
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// 1. Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!SUPABASE_URL) console.error("❌ Missing SUPABASE_URL");
if (!SUPABASE_KEY) console.error("❌ Missing SUPABASE_KEY (Service Role or Anon)");
if (!GEMINI_API_KEY) console.error("❌ Missing GEMINI_API_KEY");

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("Please check .env or .env.local");
    process.exit(1);
}

console.log("DEBUG: SUPABASE_URL =", SUPABASE_URL ? SUPABASE_URL.substring(0, 15) + "..." : "undefined");
console.log("DEBUG: SUPABASE_KEY =", SUPABASE_KEY ? "Loaded" : "Missing");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function getEmbedding(text) {
    const result = await model.embedContent(text);
    return result.embedding.values;
}

async function main() {
    console.log("🧹 Clearing old 'error_is_genre' data...");
    /* 
       Note: 'metadata->>source' syntax works in PostgREST but Supabase JS Client 
       filter syntax is .eq('metadata->>source', 'error_is_genre') IF allowed.
       Safest is usually .contains('metadata', { source: 'error_is_genre' }) 
    */
    const { error: delError } = await supabase
        .from('knowledge_store')
        .delete()
        .contains('metadata', { source: 'error_is_genre' });

    if (delError) console.warn("⚠️ Delete warning:", delError.message);

    // 2. Read File
    const rawData = fs.readFileSync('training_data.md', 'utf-8');

    // 3. Chunking (Split by "## CODE")
    const chunks = rawData.split('## CODE ').slice(1); // Skip preamble
    console.log(`📚 Found ${chunks.length} Codes to index.`);

    for (const chunk of chunks) {
        const lines = chunk.split('\n');
        const titleLine = lines[0].trim(); // e.g., "01: 창조적 우울의 빅뱅"
        const codeId = `CODE ${titleLine.split(':')[0]}`;
        const content = `CODE ${chunk.trim()}`; // Re-attach "CODE " prefix for context

        // Extract Keywords for Metadata
        const keywordLine = lines.find(l => l.includes('- **키워드**:')) || "";
        const keywords = keywordLine.replace('- **키워드**:', '').trim();

        console.log(`Processing ${codeId}...`);

        try {
            // 4. Generate Embedding
            const embedding = await getEmbedding(content);

            // 5. Insert into Supabase
            const { error } = await supabase
                .from('knowledge_store')
                .insert({
                    content: content,
                    embedding: embedding,
                    metadata: {
                        source: 'error_is_genre',
                        code_id: codeId,
                        title: titleLine,
                        keywords: keywords
                    }
                });

            if (error) throw error;
            console.log(`✅ Indexed ${codeId}`);

        } catch (e) {
            console.error(`❌ Failed ${codeId}:`, e.message);
        }

        // Rate Limit Guard (Gemini Free Tier)
        await new Promise(r => setTimeout(r, 1000));
    }
}

main();
