const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("🔍 Checking healing_posts in Supabase...");
    const { data, error } = await supabase
        .from('healing_posts')
        .select('date_string, theme')
        .order('date_string', { ascending: false })
        .limit(15);

    if (error) {
        console.error("❌ Error fetching healing_posts:", error);
    } else {
        console.log(`✅ Found ${data.length} posts:`);
        data.forEach(post => {
            console.log(`- [${post.date_string}] ${post.theme}`);
        });
    }
}

main();
