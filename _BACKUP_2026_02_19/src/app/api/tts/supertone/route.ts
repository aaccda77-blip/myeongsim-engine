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
            // Manual Overrides
            pitch = voice_settings.pitch || 0;
            speakingRate = voice_settings.rate || 1.0;
        }

        // [Mastermind Personas Mapping]
        // Explicit ID mapping overrides defaults
        switch (voiceId) {
            case 'coach': // [Facilitation Mode] Coach (Deep, Authoritative)
                voiceName = 'ko-KR-Neural2-C'; // Male
                pitch = -1.5; // Deep
                speakingRate = 0.92; // Deliberate
                ssmlGender = 'MALE';
                break;
            case 'facilitator': // Mirror (Calm, Neutral)
                voiceName = 'ko-KR-Neural2-B'; // Female (Host) - Changed from Male for contrast
                pitch = 0.0;
                speakingRate = 1.0;
                ssmlGender = 'FEMALE';
                break;
            case 'neuro': // Brain (Sharp, Fast)
                voiceName = 'ko-KR-Neural2-A'; // Female
                pitch = 0.0;
                speakingRate = 1.15; // Fast
                ssmlGender = 'FEMALE';
                break;
            case 'psycho': // Mind (Deep, Soft)
                voiceName = 'ko-KR-Neural2-B'; // Female
                pitch = -1.5; // Deep
                speakingRate = 0.9; // Slow
                ssmlGender = 'FEMALE';
                break;
            case 'ux': // Creative (Energetic)
                voiceName = 'ko-KR-Neural2-B'; // Female
                pitch = 3.0; // High
                speakingRate = 1.1;
                ssmlGender = 'FEMALE';
                break;
            case 'tech': // Logic (Flat, Low)
                voiceName = 'ko-KR-Neural2-C'; // Male
                pitch = -2.0; // Low
                speakingRate = 0.95;
                ssmlGender = 'MALE';
                break;
            case 'marketer': // Expansion (Punchy)
                voiceName = 'ko-KR-Neural2-C'; // Male
                pitch = 1.5; // High
                speakingRate = 1.2; // Very Fast
                ssmlGender = 'MALE';
                break;

            // [Legacy Mappings]
            case 'shimmer':
            case 'nova':
                voiceName = 'ko-KR-Neural2-B';
                ssmlGender = 'FEMALE';
                break;
            case 'alloy':
            case 'echo':
                voiceName = 'ko-KR-Neural2-B'; // Remapped per previous logic
                ssmlGender = 'FEMALE';
                break;
            case 'onyx':
            case 'expert':
                speakingRate = 0.92;
                pitch = -1.5;
                break;
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
