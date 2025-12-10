"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTTSReturn {
    speak: (text: string) => void;
    cancel: () => void;
    pause: () => void;
    resume: () => void;
    isSpeaking: boolean;
    isPaused: boolean;
    isSupported: boolean;
}

export const useTTS = (): UseTTSReturn => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setIsSupported(true);
        }
    }, []);

    const cancel = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, [isSupported]);

    const speak = useCallback((text: string) => {
        if (!isSupported) return;

        // Cancel any ongoing speech
        cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error("Speech synthesis error", event);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        // Optional: Select a specific voice if needed
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices.find(v => v.lang === 'en-US') || null;

        window.speechSynthesis.speak(utterance);
    }, [isSupported, cancel]);

    const pause = useCallback(() => {
        if (!isSupported) return;
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsSpeaking(false); // Visually paused
        }
    }, [isSupported]);

    const resume = useCallback(() => {
        if (!isSupported) return;
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        }
    }, [isSupported]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported]);

    return {
        speak,
        cancel,
        pause,
        resume,
        isSpeaking,
        isPaused,
        isSupported,
    };
};
