
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('API Key missing');
        return;
    }

    // API Key 맨 앞과 뒤 일부만 출력하여 확인
    console.log(`Checking models with API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);

    try {
        // REST API 직접 호출 (라이브러리 버전에 따라 listModels가 다를 수 있음)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const models = data.models || [];

        console.log('\n=== Available Models ===');
        models.forEach((model: any) => {
            if (model.name.includes('gemini') && model.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${model.name.replace('models/', '')}`);
                console.log(`  Description: ${model.description}`);
                console.log('---');
            }
        });

    } catch (error: any) {
        console.error('Failed to list models:', error.message);
    }
}

listModels();
