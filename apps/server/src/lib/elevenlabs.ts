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

        ws.send(JSON.stringify({ text: message.content + " ", flush: true }));
        console.log(`[11 Labs] Sent initial messages`);
    };

    let audioBuffer: Buffer[] = [];
    let characterTimings: AudioCharacterTimings = {
        chars: [],
        charStartTimesMs: [],
        charDurationsMs: [],
    };
    let wordTimings: AudioWordTimings = {
        words: [],
        wordStartTimesMs: [],
        wordDurationsMs: [],
    };
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
            characterTimings = applyOffsetToCharTimings(
                characterTimings,
                data.normalizedAlignment
            );

            wordTimings = charToWordTimings(characterTimings);

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
    console.log(JSON.stringify(wordTimings.words));

    updateInstanceState(instanceId, instanceState, release);
}

/* -------- Processing -------- */
function charToWordTimings(
    charTimings: AudioCharacterTimings
): AudioWordTimings {
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
                // Add the word before the delimiter
                let word = charTimings.chars.slice(wordIndex, i).join("");
                words.push(word);
                wordStartTimesMs.push(wordStartTime);
                wordDurationsMs.push(wordDuration);
            }
            // Add the delimiter as a separate word
            words.push(char);
            wordStartTimesMs.push(charTimings.charStartTimesMs[i]);
            wordDurationsMs.push(charTimings.charDurationsMs[i]);

            // Reset for the next word
            wordIndex = i + 1;
            wordStartTime = charTimings.charStartTimesMs[i + 1] || 0;
            wordDuration = 0;
        } else {
            if (i === wordIndex) {
                // Start of a new word
                wordStartTime = charTimings.charStartTimesMs[i];
            }
            wordDuration += charTimings.charDurationsMs[i];
        }
    });

    // Add the last word if it ends at the last character
    if (wordIndex < charTimings.chars.length) {
        let word = charTimings.chars.slice(wordIndex).join("");
        words.push(word);
        wordStartTimesMs.push(wordStartTime);
        wordDurationsMs.push(wordDuration);
    }

    const audioWordTimings: AudioWordTimings = {
        words,
        wordStartTimesMs,
        wordDurationsMs,
    };

    return audioWordTimings;
}

function applyOffsetToCharTimings(
    priorAudioCharTimings: AudioCharacterTimings,
    newAudioCharTimings: AudioCharacterTimings
) {
    const lastCharStartTimeMs =
        priorAudioCharTimings.charStartTimesMs[
            priorAudioCharTimings.charStartTimesMs.length - 1
        ] || 0;

    const lastCharDurationMs =
        priorAudioCharTimings.charDurationsMs[
            priorAudioCharTimings.charDurationsMs.length - 1
        ] || 0;

    const offset = lastCharStartTimeMs + lastCharDurationMs;

    const adjustedCharStartTimesMs = newAudioCharTimings.charStartTimesMs.map(
        (time) => time + offset
    );

    const combinedCharTimings: AudioCharacterTimings = {
        chars: [...priorAudioCharTimings.chars, ...newAudioCharTimings.chars],
        charStartTimesMs: [
            ...priorAudioCharTimings.charStartTimesMs,
            ...adjustedCharStartTimesMs,
        ],
        charDurationsMs: [
            ...priorAudioCharTimings.charDurationsMs,
            ...newAudioCharTimings.charDurationsMs,
        ],
    };

    return combinedCharTimings;
}
