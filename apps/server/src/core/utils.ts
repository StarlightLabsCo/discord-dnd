import type { CharacterInstance, Message } from "database";
import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";

export function getSystemPrompt() {
    const message = {
        role: "system",
        content:
            "You are a Dungeon Master narrating a campaign for a group of players. Focus on creating a compelling story with good tempo. Keep responses on the shorter side. When applicable, you have the ability to initiate skill and ability checks by calling the initiateSkillCheck function. There are no other functions, so anything else will be in normal message content. Narrate the story and have fun! ",
    };

    return message;
}

export function getFormattedMessages(
    messages: (Message & { characterInstance: CharacterInstance | null })[]
) {
    let formattedMessages = messages
        .map((message) => {
            const characterInstance = message.characterInstance;
            if (characterInstance) {
                return {
                    role: "user",
                    content: characterInstance.name + ": " + message.content,
                };
            } else {
                const parsedMessage = JSON.parse(message.content);
                if (
                    parsedMessage.role === "assistant" &&
                    parsedMessage.content
                ) {
                    return {
                        role: "assistant",
                        content: "Dungeon Master" + ":" + parsedMessage.content,
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
