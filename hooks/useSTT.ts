"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseSTTReturn {
    startListening: () => void;
    stopListening: () => void;
    isListening: boolean;
    isSupported: boolean;
    result: string | null;
    error: string | null;
}

// Add strict typing for the SpeechRecognition API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionError) => void;
    onstart: () => void;
    onend: () => void;
}

interface SpeechRecognitionEvent {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
        length: number;
    };
}

interface SpeechRecognitionError {
    error: string;
}

// Window interface extension
declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

export const useSTT = (
    onResult?: (text: string) => void
): UseSTTReturn => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
            setIsSupported(true);
        }
    }, []);

    const stopListening = useCallback(() => {
        console.log("[STT] Stopping listening...");
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const onResultRef = useRef(onResult);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    const startListening = useCallback(() => {
        console.log("[STT] Start listening requested. Supported:", isSupported);
        if (!isSupported) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = true; // Keep listening until stopped
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                console.log("[STT] Recognition started");
                setIsListening(true);
                setError(null);
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                const cleanResult = transcript.trim().toLowerCase();

                if (!cleanResult) return; // Ignore empty results

                console.log("[STT] Result received:", cleanResult, "(raw:", transcript, ")");
                setResult(cleanResult);
                if (onResultRef.current) {
                    onResultRef.current(cleanResult);
                }
            };

            recognition.onerror = (event: SpeechRecognitionError) => {
                console.error("[STT] Error:", event.error);
                setError(event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                console.log("[STT] Recognition ended");
                // If we didn't manually stop, and it's supposed to be listening, restart it (for continuous effect)
                // But generally, let's just mark it as stopped to avoid infinite loops if permission denied
                setIsListening(false);
            };

            console.log("[STT] Calling recognition.start()");
            recognition.start();
        } catch (err) {
            console.error("[STT] Exception starting recognition:", err);
            setError("Failed to start speech recognition.");
        }
    }, [isSupported]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return {
        startListening,
        stopListening,
        isListening,
        isSupported,
        result,
        error
    };
};