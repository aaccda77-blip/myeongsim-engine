import { useState, useRef, useCallback } from 'react';

interface VoiceState {
    isPlaying: boolean;
    isLoading: boolean;
    error: string | null;
}

export function useVoice() {
    const [state, setState] = useState<VoiceState>({
        isPlaying: false,
        isLoading: false,
        error: null
    });

    // Use Web Audio API for robust playback
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioQueueRef = useRef<AudioBuffer[]>([]);
    const isPlayingRef = useRef(false);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // [Feature] Text Splitter with Advanced Cleaner
    const splitTextIntoChunks = (text: string, maxLength: number = 200): string[] => {
        let cleanText = text;

        // 1. Remove Markdown (**bold**, ## header, [link])
        cleanText = cleanText.replace(/[*#\[\]_`~]/g, '');

        // 2. Remove Emojis (Range for most emojis)
        // This simple range covers widely used emoji blocks
        cleanText = cleanText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

        // 3. Remove content in parentheses e.g. "신금(신금)" -> "신금" (Existing Logic)
        cleanText = cleanText.replace(/\([^)]*\)/g, '');

        // 4. Normalize Whitespace (remove multi-spaces/newlines usually left after removals)
        cleanText = cleanText.replace(/\s+/g, ' ').trim();

        const sentences = cleanText.match(/[^.!?\n]+[.!?\n]*/g) || [cleanText];
        const chunks: string[] = [];
        let currentChunk = '';

        sentences.forEach(sentence => {
            if ((currentChunk + sentence).length <= maxLength) {
                currentChunk += sentence;
            } else {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = sentence;
            }
        });
        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks.filter(c => c.length > 0);
    };

    const processQueue = useCallback(async (ctx: AudioContext) => {
        if (audioQueueRef.current.length === 0) {
            isPlayingRef.current = false;
            setState(prev => ({ ...prev, isPlaying: false }));
            return;
        }

        isPlayingRef.current = true;
        const buffer = audioQueueRef.current.shift()!;

        // Create source
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        currentSourceRef.current = source;

        source.onended = () => {
            processQueue(ctx);
        };

        source.start(0);
    }, []);

    const stop = useCallback(() => {
        if (currentSourceRef.current) {
            try { currentSourceRef.current.stop(); } catch (e) { }
            currentSourceRef.current = null;
        }
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
    }, []);

    // [Feature] Web Speech API Fallback (Free & Immediate)
    const speakNative = useCallback((text: string, settings?: { pitch?: number, rate?: number }) => {
        return new Promise<void>((resolve) => {
            if (!window.speechSynthesis) {
                console.warn("Web Speech API not supported");
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR'; // Korean
            utterance.pitch = settings?.pitch || 1.0;
            utterance.rate = settings?.rate || 1.0;

            // Voice selection logic (Try to find a Korean voice)
            const voices = window.speechSynthesis.getVoices();
            const korVoice = voices.find(v => v.lang.includes('ko'));
            if (korVoice) utterance.voice = korVoice;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => {
                console.error("Native Speech Error:", e);
                resolve(); // Resolve anyway to continue flow
            };

            window.speechSynthesis.speak(utterance);
        });
    }, []);

    const speak = useCallback(async (text: string, voiceId?: string) => {
        if (!text) return;

        // [Chunking] split long text
        if (text.length > 200) {
            const chunks = splitTextIntoChunks(text);
            // Clear existing queue logic for simplicity here, or handle properly
            // For now, let's just create a new queue if we want.
            // But existing logic is: split -> push to queue -> processQueue.
            audioQueueRef.current = []; // Clear
            for (const c of chunks) {
                // Manually add decoded buffer? No, existing logic fetch & decode.
                // We need to re-implement the queue feeder or just use existing logic.
                // Let's stick to the existing "Fetch First Chunk & Play" logic below but updated.
            }
        }

        try {
            // 1. Init Audio Context
            if (!audioContextRef.current) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContextClass();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') await ctx.resume();

            // 2. Clear previous
            stop();
            window.speechSynthesis.cancel();
            audioQueueRef.current = [];
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // 3. Chunking
            const chunks = splitTextIntoChunks(text);
            console.log(`[TTS] Split into ${chunks.length} chunks`);

            // 4. Processing
            let isFirst = true;

            for (const chunk of chunks) {
                if (!isPlayingRef.current && !isFirst && state.isPlaying) break; // Check state: if user stopped.

                try {
                    // Call Updated Route (Google TTS)
                    const response = await fetch('/api/tts/supertone', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: chunk, voiceId })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || errData.details || 'Google TTS API Error');
                    }

                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

                    audioQueueRef.current.push(audioBuffer);

                    if (isFirst) {
                        setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
                        processQueue(ctx);
                        isFirst = false;
                    } else if (!isPlayingRef.current && audioQueueRef.current.length === 1) {
                        // If playback accidentally stopped or buffer drained, restart
                        processQueue(ctx);
                    }

                } catch (apiError: any) {
                    console.warn(`[TTS] Google Cloud Failed (${apiError.message}). Fallback to Native.`);
                    // Fallback to Web Speech APi for this chunk
                    await speakNative(chunk, { pitch: 1.0, rate: 1.0 });
                }
            }

        } catch (error: any) {
            console.error("TTS Critical Error:", error);
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
            // Final safety net fallback
            speakNative(text, { pitch: 1.0, rate: 1.0 });
        }
    }, [processQueue, stop, speakNative, state.isPlaying]);

    // [New] Dialogue Script Player
    const speakScript = useCallback(async (script: { speaker: 'host' | 'expert', text: string }[]) => {
        if (!script || script.length === 0) return;

        try {
            if (!audioContextRef.current) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContextClass();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') await ctx.resume();

            stop();
            window.speechSynthesis.cancel();
            audioQueueRef.current = [];
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Voice Configs
            // Voice Configs for OpenAI TTS
            // Host: Echo (Male, Friendly)
            // Expert: Shimmer (Female, Calm)
            const EXPERT_SETTINGS = { pitch: 1 }; // Dummy setting to trigger 'shimmer' logic in backend
            const HOST_SETTINGS = { pitch: 5 };   // Dummy setting to trigger 'echo' logic in backend

            // Native Fallback Settings
            const NATIVE_EXPERT = { rate: 0.9, pitch: 0.8 }; // Deeper, slower
            const NATIVE_HOST = { rate: 1.1, pitch: 1.2 };   // Higher, faster

            let isFirst = true;

            for (const line of script) {
                if (!isPlayingRef.current && !isFirst && state.isPlaying) break; // Check state too

                const text = line.text;
                const settings = line.speaker === 'host' ? HOST_SETTINGS : EXPERT_SETTINGS;
                const nativeSettings = line.speaker === 'host' ? NATIVE_HOST : NATIVE_EXPERT;

                console.log(`[TTS-Radio] ${line.speaker}: "${text.slice(0, 10)}..."`);

                // Reuse split logic to be safe
                const chunks = splitTextIntoChunks(text, 200);

                for (const chunk of chunks) {
                    if (!isPlayingRef.current && !isFirst && state.isPlaying) break;

                    try {
                        const response = await fetch('/api/tts/supertone', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: chunk, voiceId: VOICE_ID, voice_settings: settings })
                        });

                        if (!response.ok) {
                            const errData = await response.json();
                            throw new Error(errData.error || errData.details || `TTS Script Fetch Failed: ${response.status}`);
                        }
                        const buf = await response.arrayBuffer();
                        const audioBuf = await ctx.decodeAudioData(buf);
                        audioQueueRef.current.push(audioBuf);

                        if (isFirst) {
                            setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
                            processQueue(ctx);
                            isFirst = false;
                        } else if (!isPlayingRef.current && audioQueueRef.current.length === 1) {
                            processQueue(ctx);
                        }
                    } catch (apiError: any) {
                        // [Fallback] Switch to Native TTS
                        console.warn(`[TTS-Radio] Supertone Failed. Switching to Native Fallback.`);
                        setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
                        await speakNative(chunk, nativeSettings);
                    }
                }
            }

        } catch (error: any) {
            console.error("TTS Script Error:", error);
            // alert(`Radio Mode Error: ${error.message}`); // [Debug Removed for Fallback]
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        }
    }, [processQueue, stop, speakNative]);

    return { ...state, speak, speakScript, stop };
}
