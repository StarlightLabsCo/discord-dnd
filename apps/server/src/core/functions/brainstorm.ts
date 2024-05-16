import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";
import { groq } from "@/lib/groq";

const name = "Dungeon Master";

export async function brainstorm(
    messages: CompletionCreateParams.Message[],
    description: string,
    options?: {
        save?: boolean;
        speak?: boolean;
    }
): Promise<
    [CompletionCreateParams.Message[], ChatCompletion.Choice.Message, string]
> {
    let completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
            ...messages,
            {
                role: "user",
                name: name,
                content: `${name} is brainstorming new ideas.

                ## Idea Description
                ${description}

                Reply with the new ideas that ${name} brainstormed.`,
            },
        ],
    });

    const message = completion.choices[0].message;

    const completionMessage = {
        role: "assistant",
        content: message.content,
    };

    const newMessages = [...messages, completionMessage];

    const strippedContent = message.content.trim();

    return [newMessages, message, strippedContent];
}
