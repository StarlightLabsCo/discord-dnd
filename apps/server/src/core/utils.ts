import type { CharacterInstance, Message } from "database";

export function getSystemPrompt() {
    const message = {
        role: "system",
        content:
            "You are a Dungeon Master narrating a campaign for a group of players. You have the ability to initiate skill and ability checks by calling a function.",
    };

    return message;
}

export function getOpenAIMessages(
    messages: (Message & { characterInstance: CharacterInstance | null })[]
) {
    const openAIMessages = messages.map((message) => {
        const characterInstance = message.characterInstance;
        if (characterInstance) {
            return {
                role: "user",
                content: characterInstance.name + ": " + message.content,
            };
        } else {
            const parsedMessage = JSON.parse(message.content);
            if (parsedMessage.role === "assistant" && parsedMessage.content) {
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
            }
        }
    });

    return openAIMessages;
}
