import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";

import { reflect } from "@/core/functions/reflect";
import { decision } from "@/core/functions/decision";
import { narrate } from "@/core/functions/narrate";

import { getFormattedMessages, getLatestStoryBeatInstance } from "@/core/utils";
import { handleToolCalls } from "@/core/tools";
import { getSystemPrompt } from "@/core/prompts";

export async function continueBeat(instanceId: string) {
    const storyBeatInstance = await getLatestStoryBeatInstance(instanceId);

    // Build Prompt
    const systemPrompt = await getSystemPrompt(storyBeatInstance, {
        tools: true,
    });
    const existingMessages = getFormattedMessages(storyBeatInstance.messages);
    const reflectMessages = [systemPrompt, ...existingMessages];

    // Reflect
    const [withReflection] = await reflect(reflectMessages, {
        save: storyBeatInstance.id,
    });

    // Narrate
    let isFinished = false;
    let updatingMessages = withReflection;
    while (!isFinished) {
        const [withNarration, message] = await narrate(
            updatingMessages,
            "Continue narrating the story beat based on your prior thoughts for this current story beat step.",
            {
                save: storyBeatInstance.id,
                speak: instanceId,
            }
        );

        if (message.tool_calls) {
            await handleToolCalls(message.tool_calls);
        }

        updatingMessages = withNarration;

        isFinished = await decision(
            updatingMessages,
            "I am finished narrating the story beat for now."
        );
        console.log(`[DEBUG] continueBeat (decision): ${isFinished}`);
    }
}
