
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { audioContent, config } = await req.json();

        console.log(`[API/STT] Received request. Audio length: ${audioContent?.length}, Config:`, config);

        if (!audioContent) {
            console.error("[API/STT] No audio content provided");
            return NextResponse.json({ error: "No audio content provided" }, { status: 400 });
        }

        const API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

        if (!API_KEY) {
            console.error("[API/STT] Google Cloud API key not configured");
            return NextResponse.json({ error: "STT service not configured" }, { status: 500 });
        }

        const sttConfig = config || {
            encoding: "WEBM_OPUS",
            sampleRateHertz: 48000,
            languageCode: "en-US",
        };

        const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                config: sttConfig,
                audio: {
                    content: audioContent,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[API/STT] Google API Error:", errorData);
            return NextResponse.json({ error: errorData.error?.message || "Google STT API failed" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("[API/STT] Internal Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
