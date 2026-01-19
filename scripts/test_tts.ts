// scripts/test_tts.ts
const fs = require('fs');

const API_KEY = '8e654a2e874d6327ce7c345c5c5bc567';
const VOICE_ID = 'ac449f240c2732b7f0b8bb'; // Aiko
const BASE_URL = 'https://supertoneapi.com/v1/text-to-speech';

async function testTTS() {
    console.log('Testing Supertone TTS...');
    try {
        const endpoint = `${BASE_URL}/${VOICE_ID}/stream`;
        console.log(`Endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-sup-api-key': API_KEY
            },
            body: JSON.stringify({
                text: "안녕하세요. 이것은 테스트 음성입니다.",
                language: 'ko',
                model: 'sona_speech_1',
                output_format: 'mp3'
            })
        });

        if (!response.ok) {
            console.error('Error Status:', response.status);
            console.error('Error Body:', await response.text());
            return;
        }

        const buffer = await response.arrayBuffer();
        console.log(`Success! Received ${buffer.byteLength} bytes.`);

        // Optionally save to check file
        // fs.writeFileSync('test_output.mp3', Buffer.from(buffer));
        // console.log('Saved to test_output.mp3');

    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

testTTS();
