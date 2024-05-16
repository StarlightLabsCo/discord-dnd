import { db } from "@/lib/db";
import { narrate } from "@/core/functions/narrate";
import { getSystemPrompt } from "@/core/prompts";
import { getLatestStoryBeatInstance } from "@/core/utils";

export async function introduceBeat(instanceId: string) {
   const storyBeatInstance = await getLatestStoryBeatInstance(instanceId);
    if (!storyBeatInstance) {
        throw new Error("Story Beat Instance not found");
    }

    const plan = storyBeatInstance.plan;
    if (!plan) {
        throw new Error("Plan not found for the story beat");
    }

    const systemPrompt = await getSystemPrompt(storyBeatInstance);

    const messages = [
        systemPrompt,
        {
            role: "user",
            content: `Introduce the story beat of ${storyBeatInstance.name} with the following plan: ${plan}`,
        },
    ];

    const [newMessages, message, strippedContent] = await narrate(messages);


}
