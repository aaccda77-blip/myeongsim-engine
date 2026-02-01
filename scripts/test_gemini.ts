
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

    console.log('--- Gemini API Test ---');
    console.log(`API Key Exists: ${!!apiKey}`);
    console.log(`Model: ${modelName}`);

    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY is missing.');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = 'Explain how GLUT4 works in one sentence.';
        console.log(`Sending prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Success!');
        console.log('Response:', text);
    } catch (error: any) {
        console.error('❌ API Call Failed:');
        console.error(error.message);

        // 모델 문제일 경우 대체 모델 제안
        if (error.message.includes('404') || error.message.includes('not found')) {
            console.log('💡 Tip: Try using "gemini-1.5-flash" or "gemini-pro" instead.');
        }
    }
}

testGemini();
