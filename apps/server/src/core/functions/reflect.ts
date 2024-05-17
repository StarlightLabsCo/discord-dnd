import { groq } from "@/lib/groq";
import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";
import { type Options, handleOptions } from "../utils";

const name = "Dungeon Master";
const verb = "reflects";

export async function reflect(
    messages: CompletionCreateParams.Message[],
    options?: Options
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

    console.log(`Reflection: ${completion.choices[0].message.content}`);

    // Update messages array
    const completionMessage = {
        role: "assistant",
        content: completion.choices[0].message.content,
    };

    const newMessages = [...messages, completionMessage];

    // Strip content from message
    completion.choices[0].message.content =
        completion.choices[0].message.content
            .replace(`${name} ${verb}: `, "")
            .trim();

    const message = completion.choices[0].message;
    const strippedContent = message.content;

    // Handle options async
    if (options?.save) {
        handleOptions(options, message, verb, false);
    }

    return [newMessages, message, strippedContent];
}
