import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";

export async function retrieve(
    messages: CompletionCreateParams.Message[],
    desiredInformation: string[],
    options?: {
        save?: boolean;
        speak?: boolean;
    }
): Promise<[CompletionCreateParams.Message[], string]> {
    // TODO: use some kind of DB connection and agent to navigate the database and retrieve the desired information
    return [messages, "desired information"];
}
