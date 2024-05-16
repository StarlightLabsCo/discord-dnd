import { db } from "@/lib/db";
import { brainstorm } from "@/core/functions/brainstorm";
import { getCharacterPrompts, getPersonalityPrompt, getStoryContextPrompt } from "@/core/prompts";

export async function planBeat(storyBeatInstanceId: string) {
    const storyBeatInstance = await db.storyBeatInstance.findUnique({
        where: {
            id: storyBeatInstanceId,
        },
        include: {
            campaignInstance: true,
            beat: {
                include: {
                    adventure: {
                        include: {
                            act: {
                                include: {
                                    campaign: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!storyBeatInstance) {
        throw new Error("Story Beat Instance not found");
    }

    const beat = storyBeatInstance.beat;
    const personalityPrompt = getPersonalityPrompt();
    const contextPrompt = await getStoryContextPrompt(storyBeatInstance);
    const characterPrompt = await getCharacterPrompts(storyBeatInstance.campaignInstance.id);

    const [newMessages, message, strippedContent] = await brainstorm(
        [],
        `${personalityPrompt}\n\n${contextPrompt}\n\n${characterPrompt}\n\nGiven this context, plan the very short-term environment, events, people, and what will happen for the story beat: ${beat.name}. This plan will be edited by you later when you're narrating it so be sure to include any details or thoughts that went into it.`,
    );

    console.log(`[DEBUG] planBeat: ${strippedContent}`);

    await db.storyBeatInstance.update({
        where: { id: storyBeatInstanceId },
        data: { plan: strippedContent },
    });

    return strippedContent;
}
