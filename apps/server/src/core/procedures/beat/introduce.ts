import { narrate } from "@/core/functions/narrate";
import { getSystemPrompt } from "@/core/prompts";
import { getLatestStoryBeatInstance } from "@/core/utils";
import { planBeat } from "./plan";

export async function introduceBeat(instanceId: string) {
    const storyBeatInstance = await getLatestStoryBeatInstance(instanceId);
    if (!storyBeatInstance) {
        throw new Error("Story Beat Instance not found");
    }

    let plan = storyBeatInstance.plan;
    if (!plan) {
        plan = await planBeat(storyBeatInstance.id);
    }

    const systemPrompt = await getSystemPrompt(storyBeatInstance);

    await narrate(
        [systemPrompt],
        `Introduce the story beat of ${storyBeatInstance.name} with the following plan: ${plan}`,
        {
            save: storyBeatInstance.id,
            speak: instanceId,
        }
    );
}
