import { groq } from "@/lib/groq";
import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";

const name = "Dungeon Master";

export async function decision(
    messages: CompletionCreateParams.Message[],
    statement: string,
): Promise<boolean> {
    const isFinished = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
            ...messages,
            {
                role: "user",
                content: `Model the mind of ${name} and decide if ${name} would believe the following statement to be true or false: "${statement}". Please choose true if ${name} believes the statement is true, or false if ${name} believes the statement is false.`,
            },
        ],
    });

    return isFinished.choices[0].message.content === "true";
}
