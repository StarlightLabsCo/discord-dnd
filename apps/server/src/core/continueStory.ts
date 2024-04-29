import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import { getOpenAIMessages, getSystemPrompt } from "./utils";
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import { streamAudio } from "@/lib/elevenlabs";

export async function continueStory(instanceId: string) {
    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        return null;
    }

    const campaignInstance = instanceState.selectedCampaignInstance;
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

    instanceState.selectedCampaignInstance.messages.push(newMessage);
    updateInstanceState(instanceId, instanceState, release);

    await streamAudio(instanceId, "1Tbay5PQasIwgSzUscmj", newMessage);
}
