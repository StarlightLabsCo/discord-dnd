import type {
    ChatCompletion,
    CompletionCreateParams,
} from "groq-sdk/resources/chat/index.mjs";
import { groq } from "@/lib/groq";
import { functions } from "@/core/tools";
import { db } from "@/lib/db";
import { speak } from "../utils";

const name = "Dungeon Master";
const verb = "says";

export async function narrate(
    messages: CompletionCreateParams.Message[],
    instruction: string,
    options?: {
        save?: string; // storyBeatInstanceId
        speak?: string; // instanceId
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
                content: `${instruction}\n\nWhen speaking use the format: '${name} ${verb}: ...' If desired, you can also call a tool to make things happen in the game systems.`,
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

    // Handle options after returning the new messages
    if (options?.save) {
        setTimeout(async () => {
            const dbMessage = await db.message.create({
                data: {
                    storyBeatInstance: {
                        connect: {
                            id: options.save,
                        },
                    },
                    verb,
                    content: JSON.stringify(message),
                },
            });

            if (options?.speak) {
                await speak(options.speak, dbMessage);
            }
        }, 0);
    }

    return [newMessages, message, strippedContent];
}
