import { groq } from "@/lib/groq";
import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";

const name = "Dungeon Master";
const verb = "reflects";

export async function reflect(
    messages: CompletionCreateParams.Message[],
    options?: {
        save?: boolean;
        speak?: boolean;
    }
): Promise<
    [CompletionCreateParams.Message[], ChatCompletion.Choice.Message, string]
> {
    const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
            ...messages,
            {
                role: "user",
                content: `React to and reflect on the current situation of the story beat. Think about where you'd like to take the story next. Use the format: "${name} ${verb}: <reflection>". Remember none of your thoughts will be shared with the players. They are just for you.`,
            },
        ],
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
