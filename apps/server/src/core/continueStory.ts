import { instanceIdToState } from "@/api/websocket/instanceState";
import { getOpenAIMessages, getSystemPrompt } from "./utils";
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import { server } from "index";
import type { MessageAddedResponse } from "starlight-api-types/websocket";

export async function continueStory(instanceId: string) {
    const instanceState = instanceIdToState.get(instanceId);
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

    console.log("Completion:", completion);

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
    instanceIdToState.set(instanceId, instanceState);

    const messageResponse = {
        type: "MessageAddedResponse",
        data: newMessage,
    } as MessageAddedResponse;

    server.publish(instanceId, JSON.stringify(messageResponse));
}
