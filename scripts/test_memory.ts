
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testMemorySystem() {
    console.log("🔍 [Memory System Diagnostic]");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log(`1. Checking Environment Variables:`);
    console.log(`   - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`);
    console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? '✅ Found' : '❌ Missing (Critical for Memory)'}`);

    if (!supabaseUrl || !serviceKey) {
        console.error("   ⚠️ Stopping test: Missing required credentials.");
        return;
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    console.log("\n2. Testing Database Connection (write access)...");
    const testPersonaId = "test_user_" + Date.now();
    const testContent = "Test memory content";
    const testEmbedding = new Array(768).fill(0.1); // Dummy vector

    const { data: insertData, error: insertError } = await supabase
        .from('long_term_memory')
        .insert({
            // Assuming you have a valid user ID or we can insert with a dummy one if FK allows nullable
            // If FK is strict, we need a real user ID. 
            // Let's try to fetch a user first or use a known one.
            // For testing, we might fail on FK if we don't provide valid user_id.
            // Let's skip user_id if table allows nullable, or fetch one.
            persona_id: testPersonaId,
            content: testContent,
            embedding: testEmbedding,
            metadata: { source: 'test_script' }
        })
        .select();

    if (insertError) {
        console.error("   ❌ Insert Failed:", insertError.message);
        console.error("      Hint: Check RLS policies or Foreign Key constraints (user_id).");
        if (insertError.code === '42P01') console.error("      Hint: Table 'long_term_memory' does not exist.");
    } else {
        console.log("   ✅ Insert Success!", insertData);
    }

    console.log("\n3. Testing Retrieval (match_memories function)...");
    const { data: searchData, error: searchError } = await supabase.rpc('match_memories', {
        query_embedding: testEmbedding,
        match_threshold: 0.5,
        match_count: 1,
        p_persona_id: testPersonaId,
        p_user_id: null // Assuming nullable for test, or strict check?
    });

    if (searchError) {
        console.error("   ❌ Search Failed:", searchError.message);
        console.error("      Hint: Check if 'match_memories' function exists.");
    } else {
        console.log("   ✅ Search Success!", searchData);
    }
}

testMemorySystem();
