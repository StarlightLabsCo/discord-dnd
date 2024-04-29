import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import { getOpenAIMessages, getSystemPrompt } from "./utils";
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import { streamAudio } from "@/lib/elevenlabs";
import type { BufferAudioResponse } from "starlight-api-types/websocket";
import { server } from "index";

export async function continueStory(instanceId: string) {
    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        return null;
    }

    const campaignInstance = instanceState.selectedCampaign;
    if (!campaignInstance) {
        return null;
    }

    const systemPrompt = getSystemPrompt();

    const messages = campaignInstance.messages;
    const formattedMessages = getOpenAIMessages(messages);

    const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [systemPrompt, ...formattedMessages],
    });

    const newMessage = await db.message.create({
        data: {
            content: completion.choices[0].message.content,
            instance: {
                connect: {
                    id: campaignInstance.id,
                },
            },
        },
        include: {
            characterInstance: true,
        },
    });

    instanceState.selectedCampaign.messages.push(newMessage);
    updateInstanceState(instanceId, instanceState, release);

    // Stream audio to the client
    const audioStream = await streamAudio(
        completion.choices[0].message.content,
        "1Tbay5PQasIwgSzUscmj"
    );
    if (!audioStream) {
        return;
    }

    for await (const chunk of audioStream) {
        const bufferAudioResponse = {
            type: "BufferAudioResponse",
            data: {
                buffer: chunk,
            },
        } as BufferAudioResponse;

        server.publish(instanceId, JSON.stringify(bufferAudioResponse));
    }
}
