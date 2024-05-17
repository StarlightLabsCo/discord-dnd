import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";
import { groq } from "@/lib/groq";
import { functions } from "@/core/tools";
import { handleOptions, type Options } from "../utils";

const name = "Dungeon Master";
const verb = "says";

export async function narrate(
    messages: CompletionCreateParams.Message[],
    instruction: string,
    options?: Options
): Promise<
    [CompletionCreateParams.Message[], ChatCompletion.Choice.Message, string]
> {
    let completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
            ...messages,
            {
                role: "user",
                content: `${instruction}\n\nWhen speaking use the format: '${name} ${verb}: ...' If desired, you can also call a tool to make things happen in the game systems.`,
            },
        ],
        tools: Object.values(functions).map((f) => f.definition),
    });

    console.log(
        `Narration (pre-strip): ${completion.choices[0].message.content}`
    );

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

    console.log(
        `Narration (after-strip): ${completion.choices[0].message.content}`
    );

    const message = completion.choices[0].message;
    const strippedContent = message.content;

    // Handle options async
    if (options?.save) {
        handleOptions(options, message, verb, true);
    }

    return [newMessages, message, strippedContent];
}
