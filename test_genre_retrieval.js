
/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

// Load envs (Local first)
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("❌ Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function testRetrieval(query) {
    console.log(`🔎 Searching for: "${query}"`);

    // 1. Embed
    const result = await model.embedContent(query);
    const queryEmbedding = result.embedding.values;

    // 2. Search
    const { data, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.4,
        match_count: 2,
        filter: { source: 'error_is_genre' }
    });

    if (error) {
        console.error("❌ RPC Error:", error);
    } else {
        if (data.length === 0) console.log("⚠️ No matches found.");
        data.forEach(d => {
            console.log(`✅ MATCH: [${d.metadata.code_id}] ${d.metadata.title} (Sim: ${(d.similarity).toFixed(2)})`);
        });
    }
}

async function main() {
    await testRetrieval("너무 우울하고 아무것도 하기 싫어"); // Should match Code 01
    await testRetrieval("결정을 못하겠어 불안해");        // Should match Code 02
}

main();
