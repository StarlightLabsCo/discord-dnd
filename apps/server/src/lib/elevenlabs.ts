import { server } from "index";
import type { Message } from "database";
import type {
    AudioCharacterTimings,
    AudioWordTimings,
    BufferAudioResponse,
} from "starlight-api-types/websocket";
import { uploadPcmToR2 } from "./cloudflare";
import { db } from "./db";
import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";

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
        console.log(`[11 Labs] Connected to WebSocket`);
        ws.send(
            JSON.stringify({
                xi_api_key: process.env.ELEVENLABS_API_KEY,
                text: " ",
                voice_settings: {
                    stability: 1,
                    similarity_boost: true,
                },
            })
        );

        const parts = message.content.split("\n").filter((part) => part !== "");
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                ws.send(JSON.stringify({ text: part, flush: true }));
            } else {
                ws.send(JSON.stringify({ text: part }));
            }
        });
        console.log(`[11 Labs] Sent initial messages`);
    };

    let audioBuffer: Buffer[] = [];
    let wordTimings: AudioWordTimings | null = null;
    ws.onmessage = (event) => {
        console.log(`[11 Labs] Received message`);
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
            console.log(data.normalizedAlignment);
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
        console.log(`[11 Labs] WebSocket closed with code ${event.code}`);
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
    console.log(`[11 Labs] Publishing audio message ${messageId}`);

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

async function publishWordTimings(
    instanceId: string,
    messageId: string,
    wordTimings: AudioWordTimings
) {
    console.log(`[11 Labs] Publishing word timings for message ${messageId}`);

    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        release();
        return;
    }

    instanceState.streamedMessageId = messageId;
    instanceState.streamedMessageWordTimings = JSON.stringify(wordTimings);

    updateInstanceState(instanceId, instanceState, release);
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

    const isDelimiter = (char: string) =>
        [" ", ",", ".", "!", "?", ";", ":"].includes(char);

    charTimings.chars.forEach((char: string, i: number) => {
        if (isDelimiter(char)) {
            if (wordIndex < i) {
                let word = charTimings.chars.slice(wordIndex, i).join("");
                words.push(word);
                wordStartTimesMs.push(wordStartTime);
                wordDurationsMs.push(wordDuration);
            }

            wordIndex = i + 1;
            if (i + 1 < charTimings.charStartTimesMs.length) {
                wordStartTime = charTimings.charStartTimesMs[i + 1];
            }
            wordDuration = 0;
        } else {
            wordDuration += charTimings.charDurationsMs[i];
        }
    });

    if (wordIndex < charTimings.chars.length) {
        let word = charTimings.chars.slice(wordIndex).join("");
        if (word !== "") {
            words.push(word);
            wordStartTimesMs.push(wordStartTime!);
            wordDurationsMs.push(wordDuration);
        }
    }

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
