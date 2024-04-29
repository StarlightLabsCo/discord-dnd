import { server } from "index";
import type { Message } from "database";
import type {
    AudioCharacterTimings,
    AudioWordTimings,
    BufferAudioResponse,
    WordTimingsResponse,
} from "starlight-api-types/websocket";
import { uploadPcmToR2 } from "./cloudflare";
import { db } from "./db";

if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
}

export async function streamAudio(
    instanceId: string,
    voiceId: string,
    message: Message
) {
    let ws = new WebSocket(
        `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_multilingual_v2&output_format=pcm_44100`
    );

    ws.onopen = async () => {
        ws.send(
            JSON.stringify({
                text: " ",
                voice_settings: {
                    stability: 1,
                    similarity_boost: true,
                },
                xi_api_key: process.env.ELEVEN_LABS_API_KEY,
            })
        );

        ws.send(JSON.stringify({ text: message.content, flush: true }));
    };

    let audioBuffer: Buffer[] = [];
    let wordTimings: AudioWordTimings | null = null;
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data.toString());

        if (data.audio) {
            const audio = Buffer.from(data.audio, "base64");
            audioBuffer.push(audio);

            publishAudio(
                instanceId,
                message.id,
                audio,
                audioBuffer.length === 1
            );
        }

        if (data.normalizedAlignment) {
            wordTimings = processNormalizedAlignment(
                wordTimings,
                data.normalizedAlignment
            );

            publishWordTimings(instanceId, message.id, wordTimings);
        }
    };

    ws.onerror = (error) => {
        console.error(error);
    };

    ws.onclose = async (event) => {
        // Normal close
        if (event.code === 1000) {
            const finalAudioBuffer = Buffer.concat(audioBuffer);
            const audioUrl = await uploadPcmToR2(finalAudioBuffer);

            await db.message.update({
                where: { id: message.id },
                data: {
                    audioUrl,
                    audioWordTimings: JSON.stringify(wordTimings),
                },
            });
        } else {
            console.error(`WebSocket closed with code ${event.code}`);
        }
    };
}

/* -------- Publishing -------- */
function publishAudio(
    instanceId: string,
    messageId: string,
    audio: Buffer,
    start: boolean = false
) {
    const response = {
        type: "BufferAudioResponse",
        data: {
            messageId,
            buffer: audio.toString("base64"),
            start,
        },
    } as BufferAudioResponse;

    server.publish(instanceId, JSON.stringify(response));
}

function publishWordTimings(
    instanceId: string,
    messageId: string,
    wordTimings: AudioWordTimings
) {
    const response = {
        type: "WordTimingsResponse",
        data: {
            messageId,
            wordTimings,
        },
    } as WordTimingsResponse;

    server.publish(instanceId, JSON.stringify(response));
}

/* -------- Processing -------- */
function processNormalizedAlignment(
    wordTimings: AudioWordTimings | null,
    charTimings: AudioCharacterTimings
) {
    const newWordTimings = charToWordTimings(charTimings);
    if (!wordTimings) {
        return newWordTimings;
    }

    const offsetWordTimings = applyOffsetToTimings(wordTimings, newWordTimings);
    return offsetWordTimings;
}

function charToWordTimings(charTimings: AudioCharacterTimings) {
    let words: string[] = [];
    let wordStartTimesMs: number[] = [];
    let wordDurationsMs: number[] = [];

    let wordIndex = 0;
    let wordStartTime = charTimings.charStartTimesMs[0];
    let wordDuration = 0;

    const isDelimiter = (char: string) => [" ", ",", "."].includes(char);

    charTimings.chars.forEach((char: string, i: number) => {
        wordDuration += charTimings.charDurationsMs[i];

        if (isDelimiter(char) || i === charTimings.chars.length - 1) {
            let word = charTimings.chars.slice(wordIndex, i).join("");
            if (word !== "") {
                words.push(word);
                wordStartTimesMs.push(wordStartTime);
                wordDurationsMs.push(
                    wordDuration -
                        (isDelimiter(char) ? charTimings.charDurationsMs[i] : 0)
                );
            }

            wordIndex = i + 1;
            if (i + 1 < charTimings.charStartTimesMs.length) {
                wordStartTime = charTimings.charStartTimesMs[i + 1];
            }

            wordDuration = 0;
        }
    });

    const audioWordTimings: AudioWordTimings = {
        words,
        wordStartTimesMs,
        wordDurationsMs,
    };

    return audioWordTimings;
}

function applyOffsetToTimings(
    priorAudioWordTimings: AudioWordTimings,
    newAudioWordTimings: AudioWordTimings
): AudioWordTimings {
    const lastWordStartTimeMs =
        priorAudioWordTimings.wordStartTimesMs[
            priorAudioWordTimings.wordStartTimesMs.length - 1
        ];

    const lastWordDurationMs =
        priorAudioWordTimings.wordDurationsMs[
            priorAudioWordTimings.wordDurationsMs.length - 1
        ];

    const offset = lastWordStartTimeMs + lastWordDurationMs;

    const adjustedWordStartTimesMs = newAudioWordTimings.wordStartTimesMs.map(
        (time) => time + offset
    );

    const combinedWordTimings: AudioWordTimings = {
        words: [...priorAudioWordTimings.words, ...newAudioWordTimings.words],
        wordStartTimesMs: [
            ...priorAudioWordTimings.wordStartTimesMs,
            ...adjustedWordStartTimesMs,
        ],
        wordDurationsMs: [
            ...priorAudioWordTimings.wordDurationsMs,
            ...newAudioWordTimings.wordDurationsMs,
        ],
    };

    return combinedWordTimings;
}