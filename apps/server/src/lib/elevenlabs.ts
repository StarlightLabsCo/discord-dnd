if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
}

export async function streamAudio(text: string, voiceId: string) {
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

    return response.body;
}
