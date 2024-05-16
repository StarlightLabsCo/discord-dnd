import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";
import { groq } from "@/lib/groq";
import { functions } from "@/core/tools";

const name = "Dungeon Master";
const verb = "says";

export async function narrate(
    messages: CompletionCreateParams.Message[],
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
                content: `Continue narrating the story beat based on your prior thoughts for this current story beat step. When speaking use the format: '${name} ${verb}: ...' If desired, you can also call a tool to make things happen in the game systems.`,
            },
        ],
        tools: Object.values(functions).map((f) => f.definition),
    });

    const message = completion.choices[0].message;

    const completionMessage = {
        role: "assistant",
        content: message.content,
    };

    const newMessages = [...messages, completionMessage];

    const strippedContent = message.content
        .replace(`${name} ${verb}:\s?`, "")
        .trim();

    return [newMessages, message, strippedContent];
}


