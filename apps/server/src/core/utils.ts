import {
    getReadableInstanceState,
    getWritableInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import { db } from "@/lib/db";
import { streamAudio } from "@/lib/elevenlabs";
import type { CharacterInstance, Message } from "database";
import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";

export function getFormattedMessages(
    messages: (Message & { characterInstance: CharacterInstance | null })[]
) {
    let formattedMessages = messages
        .map((message) => {
            const characterInstance = message.characterInstance;
            if (characterInstance) {
                return {
                    role: "user",
                    content:
                        characterInstance.name +
                        " " +
                        message.verb +
                        ": " +
                        message.content,
                };
            } else {
                const parsedMessage = JSON.parse(message.content);
                if (
                    parsedMessage.role === "assistant" &&
                    parsedMessage.content
                ) {
                    return {
                        role: "assistant",
                        content:
                            "Dungeon Master " +
                            message.verb +
                            ":" +
                            parsedMessage.content,
                    };
                } else if (
                    parsedMessage.role === "assistant" &&
                    parsedMessage.tool_calls &&
                    parsedMessage.tool_calls.length > 0
                ) {
                    return {
                        role: "assistant",
                        content:
                            "Dungeon Master called " +
                            parsedMessage.tool_calls[0].function.name +
                            " with args " +
                            parsedMessage.tool_calls[0].function.arguments,
                    };
                } else if (parsedMessage.role === "tool") {
                    return {
                        tool_call_id: parsedMessage.tool_call_id,
                        role: "tool",
                        name: parsedMessage.name,
                        content: parsedMessage.content,
                    };
                } else {
                    return undefined;
                }
            }
        })
        .filter((message) => message !== undefined);

    return formattedMessages as CompletionCreateParams.Message[];
}

export async function getLatestStoryBeatInstance(instanceId: string) {
    const instanceState = await getReadableInstanceState(instanceId);
    const storyBeatInstances =
        instanceState?.selectedCampaignInstance?.storyBeatInstances;
    if (!storyBeatInstances) {
        throw new Error("Story Beat Instances not found");
    }

    return storyBeatInstances[storyBeatInstances.length - 1];
}

export async function speak(instanceId: string, message: Message) {
    const { instanceState, release } =
        await getWritableInstanceState(instanceId);
    if (!instanceState) {
        throw new Error("Instance State not found");
    }

    instanceState.streamedMessageId = message.id;
    await streamAudio(instanceId, "1Tbay5PQasIwgSzUscmj", message);

    updateInstanceState(instanceId, instanceState, release);
}

export type Options = {
    save?: boolean;
    speak?: boolean;
    instanceId: string;
} & (
    | { save: true; speak?: false; instanceId: string }
    | { save: true; speak: true; instanceId: string }
    | { save?: false; speak?: false; instanceId?: string }
);

export async function handleOptions(
    options: Options,
    message: ChatCompletion.Choice.Message,
    verb: string,
    visible: boolean
) {
    if (options?.save) {
        // Create message in database
        const storyBeatInstance = await getLatestStoryBeatInstance(
            options.instanceId
        );

        const dbMessage = await db.message.create({
            data: {
                storyBeatInstance: {
                    connect: {
                        id: storyBeatInstance.id,
                    },
                },
                visible,
                verb,
                content: JSON.stringify(message),
            },
            include: {
                characterInstance: true,
            },
        });

        // Update instance state
        const { instanceState, release } = await getWritableInstanceState(
            options.instanceId
        );
        if (!instanceState) {
            return null;
        }

        const targetStoryBeatInstance =
            instanceState.selectedCampaignInstance.storyBeatInstances.find(
                (instance) => instance.id === storyBeatInstance.id
            );

        if (targetStoryBeatInstance) {
            targetStoryBeatInstance.messages.push(dbMessage);
        }

        updateInstanceState(options.instanceId, instanceState, release);

        // Speak message
        if (options?.speak) {
            await speak(options.instanceId, dbMessage);
        }
    }
}
