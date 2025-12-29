const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🔍 Gemini Model Checker Initialized...\n");

    try {
        // 1. [Fix Path] __dirname 대신 process.cwd() 사용하여 루트 경로 탐색
        const envPath = path.join(process.cwd(), '.env.local');

        if (!fs.existsSync(envPath)) {
            console.error(`❌ Error: Cannot find '.env.local' at ${envPath}`);
            console.log("   -> Please make sure you are running this script from the project root.");
            return;
        }

        // 2. [Fix Parsing] 따옴표(" or ') 제거 및 주석 처리 로직 강화
        const envContent = fs.readFileSync(envPath, 'utf8');
        // 정규식: GEMINI_API_KEY= 뒤의 값을 잡되, 따옴표가 있든 없든 처리
        const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\s]+)["']?/);

        if (!match) {
            console.error("❌ Error: GEMINI_API_KEY not found in .env.local");
            return;
        }

        const apiKey = match[1].trim(); // 따옴표가 제거된 순수 키값
        console.log(`✅ API Key Detected: ${apiKey.substring(0, 8)}********`);

        // 3. [Fix Fetch] Node.js 18+ Native Fetch 사용 권장
        const nodeVersion = process.versions.node.split('.')[0];
        if (Number(nodeVersion) < 18) {
            console.warn("⚠️ Warning: You are using Node.js < 18. Native fetch might be missing.");
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        console.log("📡 Connecting to Google AI Endpoint...");

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error("\n❌ API Error Response:", JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log("\n✨ Available Gemini Models:");
            console.log("========================================");

            // 보기 좋게 정렬 및 필터링
            const contentModels = data.models
                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .sort((a, b) => b.name.localeCompare(a.name)); // 최신 버전이 위로 오게

            contentModels.forEach(m => {
                // 모델 코드명에서 'models/' 제거하고 깔끔하게 출력
                const modelId = m.name.replace('models/', '');
                console.log(`🔹 \x1b[36m${modelId.padEnd(20)}\x1b[0m : ${m.displayName}`);
                // console.log(`   Input Limit: ${m.inputTokenLimit}, Output: ${m.outputTokenLimit}`); // 필요시 주석 해제
            });
            console.log("========================================");
        } else {
            console.log("⚠️ Unexpected response format:", data);
        }

    } catch (error) {
        console.error("\n❌ System Error:", error.message);
        if (error.cause) console.error("   Cause:", error.cause);
    }
}

main();
