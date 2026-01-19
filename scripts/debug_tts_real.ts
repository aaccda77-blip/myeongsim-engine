const DEBUG_TTS_API_KEY = 'd57803311c9bb41c345af6d7aed8ad55';
const DEBUG_VOICE_ID = 'ac449f240c2732b7f0b8bb'; // Aiko

async function debugTTS() {
    console.log("1. Checking Voice List...");
    try {
        const listResp = await fetch("https://supertoneapi.com/v1/voices", {
            method: "GET",
            headers: {
                "x-sup-api-key": DEBUG_TTS_API_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!listResp.ok) {
            console.error(`[List Error] ${listResp.status} ${listResp.statusText}`);
            console.error(await listResp.text());
        } else {
            console.log("[List Success] Voices found.");
            // const voices = await listResp.json();
            // console.log("Voice Count:", voices.length);
        }

        console.log("\n2. Testing Generation...");
        const genResp = await fetch(`https://supertoneapi.com/v1/text-to-speech/${DEBUG_VOICE_ID}/stream`, {
            method: "POST",
            headers: {
                "x-sup-api-key": DEBUG_TTS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: "테스트",
                language: "ko",
                model: "sona_speech_1",
                output_format: "mp3"
            })
        });

        if (!genResp.ok) {
            console.error(`[Gen Error] ${genResp.status} ${genResp.statusText}`);
            const errText = await genResp.text();
            console.error("Error Body:", errText);
        } else {
            console.log("[Gen Success] Audio stream received.");
            console.log("Bytes:", (await genResp.arrayBuffer()).byteLength);
        }

    } catch (e) {
        console.error("Critical Network Error:", e);
    }
}

debugTTS();
