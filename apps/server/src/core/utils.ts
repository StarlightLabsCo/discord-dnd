import type { CharacterInstance, Message } from "database";

export function getSystemPrompt() {
    const message = {
        role: "system",
        content:
            "You are a Dungeon Master narrating a campaign for a group of players.",
    };

    return message;
}

export function getOpenAIMessages(
    messages: (Message & { characterInstance: CharacterInstance | null })[]
) {
    const openAIMessages = messages.map((message) => {
        return {
            role: message.characterInstance ? "user" : "assistant",
            content: message.characterInstance
                ? message.characterInstance.name + ": " + message.content
                : "Dungeon Master" + ":" + message.content,
        };
    });

    return openAIMessages;
}
