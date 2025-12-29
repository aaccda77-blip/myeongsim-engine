require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for admin access
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("❌ Missing .env.local variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY)");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function getEmbedding(text) {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}

async function migrate() {
    console.log("🚀 Starting Memory Migration (Last 90 Days)...");

    // 1. Fetch Chat History (Try New Schema first, then Legacy)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    let messages = [];
    let isLegacy = false;

    // Try 'chat_messages' (New)
    const { data: newMsgs, error: newError } = await supabase
        .from('chat_messages')
        .select('session_id, role, content, created_at')
        .gt('created_at', ninetyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

    if (!newError && newMsgs && newMsgs.length > 0) {
        messages = newMsgs;
        console.log(`✅ Found ${messages.length} messages in 'chat_messages' (New Schema)`);
    } else {
        // Fallback to 'chat_logs' (Legacy)
        console.log("⚠️ 'chat_messages' empty or missing. Trying 'chat_logs'...");
        const { data: oldMsgs, error: oldError } = await supabase
            .from('chat_logs')
            .select('user_id, role, content, created_at')
            .gt('created_at', ninetyDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        if (oldError) {
            console.error("❌ Error fetching both tables:", oldError);
            return;
        }
        messages = oldMsgs || [];
        isLegacy = true;
        console.log(`✅ Found ${messages.length} messages in 'chat_logs' (Legacy Schema)`);
    }

    // Group by Session (Infer if Legacy)
    const sessions = {};

    if (isLegacy) {
        // Auto-group by Time Gap (30 mins)
        messages.forEach(msg => {
            const uid = msg.user_id || 'anonymous';
            const time = new Date(msg.created_at).getTime();

            // Find existing session or create new
            // Key: user_id + timestamp_bucket
            // Simplified: Iterate and check last msg time
            let assigned = false;
            // Scan recent sessions for this user? Optimization needed for large data.
            // For script simplicity: Just sort by User then Time before processing.
        });

        // Re-sort for grouping logic
        messages.sort((a, b) => {
            if (a.user_id !== b.user_id) return (a.user_id || '').localeCompare(b.user_id || '');
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

        let currentSessionId = null;
        let lastTime = 0;
        let lastUser = null;

        messages.forEach((msg, index) => {
            const time = new Date(msg.created_at).getTime();
            const user = msg.user_id || 'anon';

            // New Session Condition: User changed OR Time gap > 30 mins (1800000 ms)
            if (user !== lastUser || (time - lastTime > 1800000)) {
                currentSessionId = `migrated_${user}_${index}`;
            }

            if (!sessions[currentSessionId]) sessions[currentSessionId] = [];
            sessions[currentSessionId].push(msg);

            lastTime = time;
            lastUser = user;
        });

    } else {
        // Standard Grouping
        messages.forEach(msg => {
            if (!sessions[msg.session_id]) sessions[msg.session_id] = [];
            sessions[msg.session_id].push(msg);
        });
    }

    // 2. Process Sessions
    const sessionIds = Object.keys(sessions);
    console.log(`🔍 Identified ${sessionIds.length} unique sessions.`);

    for (const sessionId of sessionIds) {
        const sessionMsgs = sessions[sessionId];
        if (sessionMsgs.length < 4) continue; // Skip short chats

        // Infer User ID
        let userId = sessionMsgs[0].user_id;

        // If New Schema, fetch user_id from chat_sessions
        if (!isLegacy && !userId) {
            const { data: sessionData } = await supabase.from('chat_sessions').select('user_id').eq('id', sessionId).single();
            if (sessionData) userId = sessionData.user_id;
        }

        if (!userId) {
            // Try to find a user_id inside logs if mixed?
            // Use anonymous if null
            userId = 'anonymous_legacy';
        }

        // Construct Transcript
        const transcript = sessionMsgs.map(m => `${m.role}: ${m.content}`).join('\n').substring(0, 5000); // Limit context

        console.log(`🧠 Processing Session ${sessionId} (${sessionMsgs.length} msgs)...`);

        try {
            // Summarize
            const prompt = `
            Summarize the key personal information, core problem, and advice given in this conversation.
            Language: Korean.
            Format: One concise paragraph (max 3 sentences).
            Input:
            ${transcript}
            `;

            const result = await model.generateContent(prompt);
            const summary = result.response.text();

            // Embed
            const embedding = await getEmbedding(summary);

            // Insert into Memories
            const { error: insertError } = await supabase
                .from('user_memories')
                .insert({
                    user_id: userId === 'anonymous_legacy' ? null : userId, // Use NULL if really unknown, or handle error
                    content: summary,
                    embedding: embedding,
                    metadata: { type: 'migration_90days', session_id: sessionId, date: new Date().toISOString() }
                });

            if (insertError) {
                // If FK fails (user not found), skip
                if (insertError.code === '23503') console.warn(`Skipping (User not found): ${sessionId}`);
                else console.error(`Failed to insert memory for ${sessionId}:`, insertError);
            }
            else console.log(`✅ Saved Memory: "${summary.substring(0, 30)}..."`);

        } catch (e) {
            console.error(`Failed processing session ${sessionId}:`, e);
        }

        // Rate limit nap
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("🎉 Migration Complete!");
}

migrate();
