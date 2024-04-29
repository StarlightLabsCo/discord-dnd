import { server } from "index";
import type { BufferAudioResponse } from "starlight-api-types/websocket";

if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
}

export async function streamAudio(
    instanceId: string,
    voiceId: string,
    text: string
) {
    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=pcm_44100`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": process.env.ELEVENLABS_API_KEY!,
            },
            body: JSON.stringify({
                model: "eleven_multilingual_v2",
                text,
                voice_settings: {
                    stability: 1,
                    similarity_boost: 1,
                },
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to stream audio: ${response.statusText}`);
    }

    if (!response.body) {
        throw new Error("Response body is null");
    }

    for await (const chunk of response.body) {
        const base64Data = Buffer.from(chunk).toString("base64");
        const bufferAudioResponse = {
            type: "BufferAudioResponse",
            data: {
                buffer: base64Data,
            },
        } as BufferAudioResponse;

        server.publish(instanceId, JSON.stringify(bufferAudioResponse));
    }
}
