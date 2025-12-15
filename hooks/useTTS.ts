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

    // API Key from environment variables
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.Audio !== "undefined") {
            setIsSupported(true);
        }
    }, []);

    const cancel = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, []);

    const speak = useCallback(async (text: string) => {
        if (!isSupported) return;

        // Cancel any ongoing speech
        cancel();

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

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Google TTS API error:", JSON.stringify(errorData, null, 2));
                throw new Error(errorData.error?.message || "Failed to synthesize text");
            }

            const data = await response.json();
            const audioContent = data.audioContent;

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
            console.error("Error calling Google TTS:", error);
            setIsSpeaking(false);
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
