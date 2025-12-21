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
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const requestRef = useRef<string | null>(null);

    // API Key from environment variables
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.Audio !== "undefined") {
            setIsSupported(true);
        }
    }, []);

    const cancel = useCallback(() => {
        // Invalidate any pending requests
        requestRef.current = null;
        
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, []);

    const speak = useCallback(async (text: string) => {
        if (!isSupported) return;

        // Cancel any ongoing speech and invalidate previous requests
        cancel();

        // Generate a unique ID for this request
        const requestId = Date.now().toString();
        // Store it in a ref to track the latest request (we'll need to add this ref)
        if (requestRef.current) {
            // Invalidate previous request logic if we were using an AbortController
        }
        requestRef.current = requestId;

        try {
            setIsSpeaking(true);
            const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: { text },
                    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
                    audioConfig: { audioEncoding: "MP3" },
                }),
            });

            // Check if this request is still the latest one
            if (requestRef.current !== requestId) {
                return; // Ignore this response as a new request has started
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Google TTS API error:", JSON.stringify(errorData, null, 2));
                throw new Error(errorData.error?.message || "Failed to synthesize text");
            }

            const data = await response.json();
            const audioContent = data.audioContent;

            // Check again before playing
            if (requestRef.current !== requestId) {
                return;
            }

            if (audioContent) {
                const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
                audioRef.current = audio;

                audio.onended = () => {
                    setIsSpeaking(false);
                    setIsPaused(false);
                };

                try {
                    await audio.play();
                } catch (playError: any) {
                    // Check if we were cancelled while trying to play
                    if (requestRef.current !== requestId) {
                        audio.pause();
                        return;
                    }

                    if (playError.name === 'NotAllowedError') {
                        console.warn("[TTS] Autoplay blocked. Waiting for user interaction.");
                        setIsSpeaking(false);
                    } else {
                        console.error("Audio playback error:", playError);
                        setIsSpeaking(false);
                    }
                }
            } else {
                console.error("No audio content received from Google TTS");
                setIsSpeaking(false);
            }
        } catch (error) {
            // If it's a stale request, we don't care about errors usually, but logging is fine
            if (requestRef.current === requestId) {
                console.error("Error calling Google TTS:", error);
                setIsSpeaking(false);
            }
        }
    }, [isSupported, cancel, API_KEY]);

    const pause = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setIsPaused(true);
            setIsSpeaking(false); // Visually paused
        }
    }, []);

    const resume = useCallback(() => {
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play();
            setIsPaused(false);
            setIsSpeaking(true);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

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
