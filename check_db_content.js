const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("🔍 Checking Code 01...");
    const { data, error } = await supabase
        .from('knowledge_store')
        .select('*')
        .contains('metadata', { code_id: 'CODE 01' });

    if (error) console.error(error);
    else if (data.length === 0) console.log("❌ CODE 01 NOT FOUND");
    else {
        const row = data[0];
        console.log("✅ Found:", row.metadata.title);
        console.log("Content Snippet:", row.content.substring(0, 100));
        console.log("Embedding Length:", row.embedding.length); // Should be 768
        console.log("Embedding Sample:", row.embedding.slice(0, 5));
    }
}

main();
