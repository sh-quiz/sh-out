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

    const shouldListenRef = useRef(false);

    const stopListening = useCallback(() => {
        console.log("[STT] Stopping listening...");
        shouldListenRef.current = false;
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

        shouldListenRef.current = true;


        if (isListening) return;

        const startRecognition = () => {
            try {

                if (!shouldListenRef.current) return;

                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognitionRef.current = recognition;

                recognition.continuous = true;
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

                    if (!cleanResult) return;

                    console.log("[STT] Result received:", cleanResult, "(raw:", transcript, ")");
                    setResult(cleanResult);
                    if (onResultRef.current) {
                        onResultRef.current(cleanResult);
                    }
                };

                recognition.onerror = (event: SpeechRecognitionError) => {
                    console.error("[STT] Error:", event.error);
                    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                        shouldListenRef.current = false;
                        setIsListening(false);
                        setError(event.error);
                    } else {

                        setError(event.error);
                    }
                };

                recognition.onend = () => {
                    console.log("[STT] Recognition ended");
                    setIsListening(false);

                    if (shouldListenRef.current) {
                        console.log("[STT] Auto-restarting recognition...");

                        setTimeout(() => {
                            if (shouldListenRef.current) {
                                startRecognition();
                            }
                        }, 100);
                    }
                };

                console.log("[STT] Calling recognition.start()");
                recognition.start();
            } catch (err) {
                console.error("[STT] Exception starting recognition:", err);
                setError("Failed to start speech recognition.");
                shouldListenRef.current = false;
                setIsListening(false);
            }
        };

        startRecognition();
    }, [isSupported, isListening]);


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