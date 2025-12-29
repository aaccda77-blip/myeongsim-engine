
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const dotenv = require('dotenv');

// Load envs
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("❌ Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Files to Process
const FILES = [
    { name: 'code_term_definition.txt', type: 'txt' },
    { name: '64keys_Blue-I-Ching.pdf', type: 'pdf' },
    { name: '64책뇌과학.docx', type: 'docx' }
];

async function parseFile(fileInfo) {
    if (!fs.existsSync(fileInfo.name)) {
        console.warn(`⚠️ File not found: ${fileInfo.name}`);
        return null;
    }

    console.log(`📂 Parsing ${fileInfo.name}...`);
    const buffer = fs.readFileSync(fileInfo.name);

    if (fileInfo.type === 'txt') {
        return buffer.toString('utf-8');
    } else if (fileInfo.type === 'pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (fileInfo.type === 'docx') {
        const result = await mammoth.extractRawText({ buffer: buffer });
        return result.value;
    }
    return null;
}

// Simple Chunking (500 chars overlap)
function chunkText(text, size = 1500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += (size - 200)) {
        chunks.push(text.substring(i, i + size));
    }
    return chunks;
}

async function main() {
    console.log("🚀 Starting RAG Expansion...");

    // Clear old expansion data
    console.log("🧹 Clearing old 'rag_expansion' data...");
    await supabase.from('knowledge_store').delete().contains('metadata', { source: 'rag_expansion' });

    for (const file of FILES) {
        try {
            const content = await parseFile(file);
            if (!content) continue;

            console.log(`   Length: ${content.length} chars. Chunking...`);
            const chunks = chunkText(content);

            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                if (chunk.length < 50) continue;

                // Embed
                const result = await model.embedContent(chunk);
                const embedding = result.embedding.values;

                // Save
                const { error } = await supabase.from('knowledge_store').insert({
                    content: chunk,
                    embedding: embedding,
                    metadata: {
                        source: 'rag_expansion',
                        filename: file.name,
                        chunk_index: i
                    }
                });

                if (error) console.error(`❌ Insert Error (${file.name} #${i}):`, error.message);
                else {
                    process.stdout.write('.'); // Progress dot
                }

                // Rate limit guard
                await new Promise(r => setTimeout(r, 200));
            }
            console.log(`\n✅ Indexed ${file.name} (${chunks.length} chunks)`);

        } catch (e) {
            console.error(`❌ Error processing ${file.name}:`, e);
        }
    }

    console.log("\n🎉 Expansion Complete!");
}

main();
