
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testVercelAI() {
    console.log('--- Vercel AI SDK Test ---');
    console.log('GOOGLE_GENERATIVE_AI_API_KEY exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

    // Vercel AI SDK는 GOOGLE_GENERATIVE_AI_API_KEY를 사용함
    // 로컬 테스트를 위해 GEMINI_API_KEY를 복사
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
        console.log('Copied GEMINI_API_KEY to GOOGLE_GENERATIVE_AI_API_KEY');
    }

    try {
        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: 'GLUT4와 SGLT2의 차이점을 한 문장으로 설명해줘.',
        });

        console.log('✅ Success!');
        console.log('Response:', text);
    } catch (error: any) {
        console.error('❌ Error:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
    }
}

testVercelAI();
