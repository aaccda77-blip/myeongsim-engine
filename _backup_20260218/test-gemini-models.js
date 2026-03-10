const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // 1. Read .env.local manually
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);

        if (!match) {
            console.error("❌ Could not find GEMINI_API_KEY in .env.local");
            return;
        }

        const apiKey = match[1].trim();
        console.log("✅ Found API Key:", apiKey.substring(0, 10) + "...");

        // 2. List Models via REST API (Most reliable)
        // Using v1beta as per the error message hint
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log("Fetching model list from:", url.replace(apiKey, 'HIDDEN_KEY'));

        // Polyfill verify - simplified
        const fetch = await import('node-fetch').then(m => m.default).catch(() => global.fetch);

        if (!fetch) {
            console.error("❌ No fetch available. Please run with node 18+");
            return;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(` - ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("⚠️ No models found or unexpected response:", data);
        }

    } catch (error) {
        console.error("❌ System Error:", error.message);
    }
}

main();
