import { useState, useEffect, useRef, useCallback } from 'react';

// Type definition for Web Speech API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: any) => void;
    onend: () => void;
    onerror: (event: any) => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Browser compatibility check
        const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) {
            setError('Browser not supported');
            return;
        }

        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = false; // Stop after one sentence for turn-taking
        recognition.interimResults = true;
        recognition.lang = 'ko-KR'; // Korean

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript(finalTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                setError('⚠️ 마이크 권한이 차단되었습니다.\n브라우저 주소창 옆 [자물쇠] 버튼을 눌러 마이크를 허용해주세요.');
            } else if (event.error === 'no-speech') {
                // Ignore no-speech, just stop listening silently or retry
                setError(null);
            } else {
                setError(`오류 발생: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                // [Fix] Android requires user interaction trigger strictly
                setTranscript('');
                setError(null);
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e: any) {
                console.error("Start Error:", e);
                // [Fix] Handle "already started" error gracefully
                if (e.message && e.message.includes('already started')) {
                    // Ignore, already listening
                } else {
                    setError('마이크 시작 실패: 새로고침 후 다시 시도해주세요.');
                }
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false); // UI update immediate
        }
    }, []);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        error
    };
}
