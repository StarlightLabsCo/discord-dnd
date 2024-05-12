import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import { getFormattedMessages, getSystemPrompt } from "../utils";
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import { streamAudio } from "@/lib/elevenlabs";
import { functions } from "@/core/functions";

export async function continueStoryBeat(instanceId: string) {
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
    const messages = currentStoryBeatInstance.messages;

    const formattedMessages = getFormattedMessages(messages);

    let completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [systemPrompt, ...formattedMessages],
        tools: Object.values(functions).map((f) => f.definition),
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

    // Go through any tool calls and handle them
    const toolCalls = completion.choices[0].message.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
            if (!toolCall.id) {
                continue;
            }

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
                    func.implementation(
                        instanceState,
                        toolCall.id,
                        argsValid.data
                    );
                } else {
                    console.error(
                        "Invalid arguments for function:",
                        name,
                        argsValid.error
                    );
                }
            } else {
                func.implementation(instanceState, toolCall.id);
            }
        }
    }

    updateInstanceState(instanceId, instanceState, release);
}
