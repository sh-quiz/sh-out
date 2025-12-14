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
    const isListeningRef = useRef(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    // Audio Context & Analysis for Silence Detection
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const silenceStartRef = useRef<number | null>(null);
    const requestRef = useRef<number>();


    // Configuration
    const SILENCE_THRESHOLD = 0.02; // Volume threshold (0-1)
    const SILENCE_DURATION = 2500; // Time in ms to wait before stop (increased for better speech capture)

    // API Key moved to server-side route /api/stt for security and CORS fix


    useEffect(() => {
        console.log("[STT] Hook mounted");
        if (typeof window !== "undefined" && navigator.mediaDevices) {
            console.log("[STT] MediaDevices API is supported");
            setIsSupported(true);
        } else {
            console.error("[STT] MediaDevices API is NOT supported");
        }
    }, []);

    const onResultRef = useRef(onResult);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    const stopListening = useCallback(() => {
        console.log("[STT] Stopping listening...");

        // Stop silence detection loop
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = undefined;
        }

        // Stop recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsListening(false);
            isListeningRef.current = false;
        }

        // Cleanup Audio Context
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (audioContextRef.current) {
            // Suspense or close? Close is cleaner for one-off sessions.
            audioContextRef.current.close().catch(console.error);
            audioContextRef.current = null;
        }
    }, []);

    // Stable ref for stopListening to use inside loop
    const stopListeningRef = useRef(stopListening);
    useEffect(() => {
        stopListeningRef.current = stopListening;
    }, [stopListening]);


    const processAudio = async (blob: Blob, mimeType: string) => {
        try {
            console.log(`[STT] Processing audio blob. Size: ${blob.size}, Type: ${mimeType}`);

            if (blob.size < 1000) {
                console.warn("[STT] Audio too short, skipping.");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(",")[1];

                try {
                    console.log("[STT] Sending audio to /api/stt...");

                    // Simple heuristic to match Google's encoding
                    let encoding = "WEBM_OPUS";
                    if (mimeType.includes("wav")) encoding = "LINEAR16";
                    // Google STT is picky. If it's webm, usually WEBM_OPUS is the safe bet if Opus is used.
                    // If the browser doesn't support Opus in WebM, this might fail, but let's log what we have.
                    console.log(`[STT] Using encoding config: ${encoding} for mimeType: ${mimeType}`);

                    const response = await fetch("/api/stt", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            config: {
                                encoding: encoding,
                                sampleRateHertz: 48000,
                                languageCode: "en-US",
                            },
                            audioContent: base64Audio,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("[STT] API Error:", JSON.stringify(errorData, null, 2));
                        // If it's a specific encoding error, we might fallback, but for now just error.
                        throw new Error(errorData.error?.message || "STT API failed");
                    }

                    const data = await response.json();
                    console.log("[STT] API Response:", data);

                    if (data.results && data.results.length > 0) {
                        const transcript = data.results
                            .map((r: any) => r.alternatives[0].transcript)
                            .join(" ");
                        const cleanResult = transcript.trim().toLowerCase();
                        console.log("[STT] Final Transcript:", cleanResult);
                        setResult(cleanResult);
                        if (onResultRef.current) {
                            onResultRef.current(cleanResult);
                        }
                    } else {
                        console.log("[STT] No results found in audio");
                        // Optional: Notify user "Didn't catch that"
                    }
                } catch (apiErr: any) {
                    console.error("[STT] Call failed:", apiErr);
                    setError(apiErr.message);
                }
            };
        } catch (err: any) {
            console.error("[STT] Error processing audio:", err);
            setError(err.message);
        }
    };

    const detectSilence = () => {
        // Use ref for current value in loop
        if (!analyserRef.current || !isListeningRef.current) {
            console.log("[STT] detectSilence stopping. Analyser:", !!analyserRef.current, "Listening:", isListeningRef.current);
            return;
        }

        const bufferLength = analyserRef.current.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            // data is 128-centered. |x - 128| / 128 = normalized amplitude
            const amplitude = (dataArray[i] - 128) / 128;
            sum += amplitude * amplitude;
        }
        const rms = Math.sqrt(sum / bufferLength); // Root Mean Square (volume)

        // Real-time volume monitoring (enabled for debugging)
        // console.log("[STT] Volume:", rms.toFixed(4)); // Commented out to reduce noise, enable if needed

        if (rms < SILENCE_THRESHOLD) {
            if (!silenceStartRef.current) {
                silenceStartRef.current = Date.now();
            } else if (Date.now() - silenceStartRef.current > SILENCE_DURATION) {
                console.log("[STT] Silence detected, stopping...");
                stopListeningRef.current(); // Stop!
                silenceStartRef.current = null; // Reset
                return; // Stop loop
            }
        } else {
            // Noise detected, reset silence timer
            silenceStartRef.current = null;
        }

        requestRef.current = requestAnimationFrame(detectSilence);
    };


    const startListening = useCallback(async () => {
        console.log("[STT] Start listening requested. Supported:", isSupported);
        if (!isSupported) {
            setError("Audio recording is not supported in this browser.");
            return;
        }

        try {
            console.log("[STT] Requesting microphone permission...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("[STT] Microphone permission granted, stream acquired");

            // 1. Setup Recorder
            let options = { mimeType: "audio/webm;codecs=opus" };
            if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                console.warn("webm/opus not supported, trying default webm");
                if (MediaRecorder.isTypeSupported("audio/webm")) {
                    options = { mimeType: "audio/webm" };
                } else {
                    console.warn("audio/webm not supported, letting browser choose default");
                    options = undefined as any;
                }
            }

            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                console.log("[STT] Recorder stopped, processing chunks...");

                // Determine blob type from recorder if possible
                const blobType = mediaRecorder.mimeType || "audio/webm";
                console.log(`[STT] Finalizing blob with type: ${blobType}, chunks: ${chunksRef.current.length}`);
                const blob = new Blob(chunksRef.current, { type: blobType });

                processAudio(blob, blobType);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsListening(true);
            isListeningRef.current = true;
            setError(null);
            console.log(`[STT] Recorder started. Selected mimeType: ${mediaRecorder.mimeType}`);


            // 2. Setup Audio Analysis (Silence Detection)
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                console.log("[STT] Setting up AudioContext for silence detection...");
                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;
                console.log("[STT] AudioContext created:", audioContext.state);

                const source = audioContext.createMediaStreamSource(stream);
                sourceRef.current = source;
                console.log("[STT] MediaStreamSource created");

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256; // Small enough for realtime
                analyserRef.current = analyser;
                source.connect(analyser);
                console.log("[STT] Analyser connected, fftSize:", analyser.fftSize);

                silenceStartRef.current = null; // Reset silence timer
                requestRef.current = requestAnimationFrame(detectSilence);
                console.log("[STT] Animation frame scheduled for silence detection");
            } else {
                console.warn("[STT] AudioContext not supported. Silence detection disabled.");
            }

        } catch (err: any) {
            console.error("[STT] Exception starting recorder:", err);
            console.error("[STT] Error name:", err.name);
            console.error("[STT] Error message:", err.message);
            if (err.name === "NotAllowedError") {
                setError("Microphone permission denied. Please allow microphone access.");
            } else if (err.name === "NotFoundError") {
                setError("No microphone found. Please connect a microphone.");
            } else {
                setError(`Failed to start audio recording: ${err.message}`);
            }
        }
    }, [isSupported]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
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
