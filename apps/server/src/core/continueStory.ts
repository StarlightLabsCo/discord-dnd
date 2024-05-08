import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import { getOpenAIMessages, getSystemPrompt } from "./utils";
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import { streamAudio } from "@/lib/elevenlabs";
import { functions } from "@/core/functions";

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
        tools: Object.values(functions).map((f) => f.definition),
    });

    if (!completion.choices || completion.choices.length === 0) {
        return null;
    }

    // Go through any tool calls and handle them
    const toolCalls = completion.choices[0].message.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
            const name = toolCall.function?.name;
            if (!name || !functions[name as keyof typeof functions]) {
                continue;
            }

            console.log("Running function:", name);
            console.log("Arguments:", toolCall.function?.arguments);

            const func = functions[name as keyof typeof functions];
            if (toolCall.function?.arguments) {
                const parsedArgs = JSON.parse(toolCall.function.arguments);
                const argsValid = func.argsSchema.safeParse(parsedArgs);
                if (argsValid.success) {
                    func.implementation(instanceState, argsValid.data);
                } else {
                    console.error(
                        "Invalid arguments for function:",
                        name,
                        argsValid.error
                    );
                }
            } else {
                func.implementation(instanceState);
            }
        }
    }

    // If the completion has a message, add it to the campaign instance
    if (completion.choices[0].message.content) {
        const formattedCompletion = completion.choices[0].message.content
            .replace(/Dungeon Master:\s?/, "")
            .trim();

        const newMessage = await db.message.create({
            data: {
                content: formattedCompletion,
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
        instanceState.streamedMessageId = newMessage.id;

        await streamAudio(instanceId, "1Tbay5PQasIwgSzUscmj", newMessage);
    }

    updateInstanceState(instanceId, instanceState, release);
}
