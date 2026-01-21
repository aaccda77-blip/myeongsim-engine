// [Migration] Google Cloud TTS Integration
import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// [Config] Initialize Client with Credentials logic
const getClient = () => {
    // 1. Try environment variable for JSON content (Vercel best practice)
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credentialsJson) {
        try {
            const credentials = JSON.parse(credentialsJson);
            return new TextToSpeechClient({ credentials });
        } catch (e) {
            console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON", e);
        }
    }

    // 2. Fallback: Default Auth (works if running locally with gcloud auth application-default login)
    // or if GOOGLE_APPLICATION_CREDENTIALS path is set in env
    return new TextToSpeechClient();
};

export async function POST(req: NextRequest) {
    try {
        const { text, voiceId, voice_settings } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const client = getClient();

        // 1. Voice Selection (Neural2 - Premium Quality)
        // Ref: https://cloud.google.com/text-to-speech/docs/voices
        // ko-KR-Neural2-C: Male (Bold, Deep) -> Coach (Expert)
        // ko-KR-Neural2-B: Female (Soft, Soothing) -> Host (Calm/Healing)

        let voiceName = 'ko-KR-Neural2-C'; // Default: Male (Coach)
        let ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL' = 'MALE';

        // Map Legacy/OpenAI IDs -> Google Voices
        if (voiceId === 'shimmer' || voiceId === 'nova') {
            // Host / Assistant (Female)
            voiceName = 'ko-KR-Neural2-B';
            ssmlGender = 'FEMALE';
        } else if (voiceId === 'alloy' || voiceId === 'echo') {
            // Host (Female, Calm) - Remapping former Male Host to Female
            voiceName = 'ko-KR-Neural2-B';
            ssmlGender = 'FEMALE';
        }

        // 2. Pitch & Speed Tuning
        let pitch = 0;
        let speakingRate = 1.0;

        if (voice_settings) {
            if (voice_settings.pitch > 1) {
                // [Host Mode] Narrator (Natural Reading) - "진행자 낭독 톤"
                voiceName = 'ko-KR-Neural2-C'; // Male
                ssmlGender = 'MALE';
                speakingRate = 0.92; // Natural reading speed (neither too fast nor slow)
                pitch = -0.0; // Minimal shift for maximum naturalness
            } else {
                // [Coach Mode] Myeongsim (Deep Resonance) - "명심 코치"
                voiceName = 'ko-KR-Neural2-C'; // Male
                ssmlGender = 'MALE';
                speakingRate = 0.85; // Deliberate, thoughtful pace
                pitch = -1.5; // Deep but within natural range to avoid robotic artifacts
            }
        } else if (voiceId === 'onyx' || voiceId === 'expert') {
            // Explicit Expert
            speakingRate = 0.92;
            pitch = -1.5;
        }

        // 3. Construct Request
        const [response] = await client.synthesizeSpeech({
            input: { text: text },
            voice: { languageCode: 'ko-KR', name: voiceName, ssmlGender: ssmlGender },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: speakingRate,
                pitch: pitch,
                effectsProfileId: ['headphone-class-device'], // Audio optimization
            },
        });

        const audioContent = response.audioContent;

        if (!audioContent) {
            throw new Error("No audio content received from Google TTS");
        }

        // 4. Return Audio
        // Google TextToSpeechClient returns audioContent as string | Uint8Array.
        // If string (base64) -> Buffer.from(string, 'base64')
        // If Uint8Array -> Buffer.from(Uint8Array)
        let finalBuffer: Buffer;

        if (typeof audioContent === 'string') {
            finalBuffer = Buffer.from(audioContent, 'base64');
        } else {
            finalBuffer = Buffer.from(audioContent);
        }

        // Fix: Cast Buffer to Uint8Array explicitly for NextResponse (BodyInit) compatibility
        // NextResponse accepts Uint8Array which Buffer extends, but Typescript needs help.
        return new NextResponse(new Uint8Array(finalBuffer), {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': finalBuffer.length.toString(),
            },
        });

    } catch (error: any) {
        console.error('[API/TTS] Google Error:', error);

        const msg = error.message || 'Internal Server Error';

        // Critical: Help user debug missing credentials
        if (msg.includes('Could not load the default credentials')) {
            return NextResponse.json({
                error: 'Configuration Required',
                details: 'Google Cloud Credentials missing. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON env var.'
            }, { status: 500 });
        }

        return NextResponse.json({
            error: msg,
            details: error.toString()
        }, { status: 500 });
    }
}
