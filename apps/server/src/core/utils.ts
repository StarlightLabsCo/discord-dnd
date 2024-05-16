import { getReadableInstanceState, getWritableInstanceState, updateInstanceState } from "@/api/websocket/instanceState";
import { streamAudio } from "@/lib/elevenlabs";
import type { CharacterInstance, Message } from "database";
import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";

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

export async function saveMessage(
    instanceId: string,
    message: CompletionCreateParams.Message
) {
    // const newMessage = await db.message.create({
    //     data: {
    //         storyBeatInstance: {
    //             connect: {
    //                 id: storyBeatInstanceId,
    //             },
    //         },
    //         content: JSON.stringify(message),
    //     },
    // });
    // TODO implement
}

export async function speak(instanceId: string, message: Message) {
    const { instanceState, release } = await getWritableInstanceState(instanceId);
    if (!instanceState) {
        throw new Error("Instance State not found");
    }

    instanceState.streamedMessageId = message.id;
    await streamAudio(instanceId, "1Tbay5PQasIwgSzUscmj", message);
    
    updateInstanceState(instanceId, instanceState, release);
}
