import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";

import { reflect } from "@/core/functions/reflect";
import { decision } from "@/core/functions/decision";
import { narrate } from "@/core/functions/narrate";

import { getFormattedMessages, getLatestStoryBeatInstance, saveMessage, speak } from "@/core/utils";
import { handleToolCalls } from "@/core/tools";
import { getSystemPrompt } from "@/core/prompts";

export async function continueBeat(instanceId: string) {
    const storyBeatInstance = await getLatestStoryBeatInstance(instanceId);
    
    // Build Prompt
    const systemPrompt = await getSystemPrompt(storyBeatInstance, {
        tools: true,
    });
    const existingMessages = getFormattedMessages(storyBeatInstance.messages);

    // Reflect
    const [withReflection, message, _] = await reflect([systemPrompt, ...existingMessages]);
    await saveMessage(instanceId, message)

    // Narrate
    let isFinished = false;
    let updatingMessages: CompletionCreateParams.Message[] = withReflection;
    while (!isFinished) {
        const [withNarration, message, content] = await narrate(updatingMessages);
        const dbMessage = await saveMessage(instanceId, message);

        if (content) {
            speak(instanceId, dbMessage); // TODO: I don't like this
        }

        if (message.tool_calls) {
            await handleToolCalls(message.tool_calls);
        }

        updatingMessages = withNarration;

        isFinished = await decision(
            updatingMessages,
            "I am finished narrating the story beat for now."
        );
    }
}
