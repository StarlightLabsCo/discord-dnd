import { narrate } from "@/core/functions/narrate";
import { getSystemPrompt } from "@/core/prompts";
import { getLatestStoryBeatInstance } from "@/core/utils";
import { planBeat } from "./plan";

export async function introduceBeat(instanceId: string) {
    console.log(`[DEBUG] introduceBeat: ${instanceId}`);
    const storyBeatInstance = await getLatestStoryBeatInstance(instanceId);
    if (!storyBeatInstance) {
        throw new Error("Story Beat Instance not found");
    }

    let plan = storyBeatInstance.plan;
    if (!plan) {
        plan = await planBeat(storyBeatInstance.id);
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
    console.log(`[DEBUG] introduceBeat: ${strippedContent}`);
}
