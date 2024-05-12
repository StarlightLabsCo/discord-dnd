import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import { getSystemPrompt } from "../utils";
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import { streamAudio } from "@/lib/elevenlabs";

export async function introduceStoryBeat(instanceId: string) {
    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        return null;
    }

    const campaignInstance = instanceState.selectedCampaignInstance;
    if (!campaignInstance) {
        return null;
    }

    const systemPrompt = await getSystemPrompt(campaignInstance);

    const storyBeatInstances = campaignInstance.storyBeatInstances;
    const currentStoryBeatInstance =
        storyBeatInstances[storyBeatInstances.length - 1];

    let completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [systemPrompt],
    });

    if (!completion.choices || completion.choices.length === 0) {
        console.error("No completion choices");
        console.error(completion);
        return null;
    }

    // Process content before we save it
    if (completion.choices[0].message.content) {
        completion.choices[0].message.content =
            completion.choices[0].message.content
                .replace(/Dungeon Master:\s?/, "")
                .trim();
    }

    // Save the completion as a message
    const newMessage = await db.message.create({
        data: {
            content: JSON.stringify(completion.choices[0].message),
            storyBeatInstance: {
                connect: {
                    id: currentStoryBeatInstance.id,
                },
            },
        },
        include: {
            characterInstance: true, // this will be null for DM messages
        },
    });

    currentStoryBeatInstance.messages.push(newMessage);

    // If the completion has a message, stream audio for it
    if (completion.choices[0].message.content) {
        instanceState.streamedMessageId = newMessage.id;
        await streamAudio(instanceId, "1Tbay5PQasIwgSzUscmj", newMessage);
    }

    updateInstanceState(instanceId, instanceState, release);
}
