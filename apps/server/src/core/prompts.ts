import { db } from "@/lib/db";
import type { CompletionCreateParams } from "groq-sdk/resources/chat/completions.mjs";
import type { CharacterInstance, StoryBeatInstance } from "database";
import { functions } from "@/core/tools";

export async function getStoryContextPrompt(
    storyBeatInstance: StoryBeatInstance
) {
    const storyBeatWithDetails = await db.storyBeatInstance.findUnique({
        where: { id: storyBeatInstance.id },
        include: {
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
                    location: true,
                },
            },
        },
    });

    if (!storyBeatWithDetails) {
        throw new Error("Story Beat Instance not found");
    }

    const { beat } = storyBeatWithDetails;
    const { adventure } = beat;
    const { act } = adventure;
    const { campaign } = act;

    const pastStoryBeats = await db.storyBeatInstance.findMany({
        where: {
            campaignInstanceId: storyBeatInstance.campaignInstanceId,
            createdAt: { lt: storyBeatInstance.createdAt },
        },
        include: {
            beat: { include: { location: true } },
        },
    });

    const pastStoryBeatsInfo = pastStoryBeats
        .map((beat) => {
            return `- ${beat.beat.name}
        -- Description: ${beat.beat.description}
        -- Summary of Events: ${beat.summary}
        -- Location:
        --- Name: ${beat.beat.location.name}
        --- Description: ${beat.beat.location.description}`;
        })
        .join("\n");

    const prompt = `** Context **

        Current Campaign:
        - Campaign: ${campaign.name}
        -- Description: ${campaign.description}

        - Act: ${act.name}
        -- Description: ${act.description}

        - Adventure: ${adventure.name}
        -- Description: ${adventure.description}

        ${pastStoryBeats.length > 0 ? `Past Story Beats (Completed):\n${pastStoryBeatsInfo}\n` : ""}

        - Current Story Beat (In Progress): ${storyBeatWithDetails.name}
        -- Description: ${storyBeatWithDetails.description}
        -- Plan: ${storyBeatWithDetails.plan}
        -- Location: 
        --- Name: ${beat.location.name}
        --- Description: ${beat.location.description}

        ** End of Context **
    `;

    return prompt;
}

export async function getCharacterInfoPrompt(
    characterInstance: CharacterInstance
) {
    const expandedCharacterInstance = await db.characterInstance.findUnique({
        where: { id: characterInstance.id },
        include: {
            race: true,
            subrace: true,
            class: true,
            background: true,
            proficiencies: true,
            feats: true,
            inventory: true,
            spells: true,
        },
    });

    if (!expandedCharacterInstance) {
        throw new Error("Character Instance not found");
    }

    const message = `---- ${expandedCharacterInstance.name}, Level ${expandedCharacterInstance.level} ${expandedCharacterInstance.race.name} ${expandedCharacterInstance.class.name} ----
    Pronouns: ${expandedCharacterInstance.pronouns} | Alignment: ${expandedCharacterInstance.alignment} | Age: ${expandedCharacterInstance.age} 
    Personality Traits: ${expandedCharacterInstance.background.personalityTraits.join(", ")} 
    Ideals: ${expandedCharacterInstance.background.ideals.join(", ")} | Bonds: ${expandedCharacterInstance.background.bonds.join(", ")} | Flaws: ${expandedCharacterInstance.background.flaws.join(", ")}
    Backstory: ${expandedCharacterInstance.background.name}: ${expandedCharacterInstance.background.description}

    Stats:
    - Health: ${expandedCharacterInstance.healthPoints} 
    - Ability Scores: STR ${expandedCharacterInstance.strength}, DEX ${expandedCharacterInstance.dexterity}, CON ${expandedCharacterInstance.constitution}, INT ${expandedCharacterInstance.intelligence}, WIS ${expandedCharacterInstance.wisdom}, CHA ${expandedCharacterInstance.charisma}
    - Feats:
    ${expandedCharacterInstance.feats.map((feat) => `-- ${feat.name}: ${feat.description}`).join("\n")}
    - Proficiencies (Proficiency Bonus: +${expandedCharacterInstance.proficiencyBonus}):
    ${expandedCharacterInstance.proficiencies.map((proficiency) => `-- ${proficiency.name} (${proficiency.type}): ${proficiency.description}`).join("\n")}
    - Inventory (Carrying Capacity: ${expandedCharacterInstance.inventory.reduce((acc, item) => acc + item.weight, 0)} / ${expandedCharacterInstance.strength * 15} lbs):
    ${expandedCharacterInstance.inventory.map((item) => `-- ${item.name}: ${item.description}`).join("\n")}
    - Spells:
    ${expandedCharacterInstance.spells.map((spell) => `-- ${spell.name}: ${spell.description}`).join("\n")}`;

    return message;
}

export async function getCharacterPrompts(campaignInstanceId: string) {
    const characterInstances = await db.characterInstance.findMany({
        where: { campaignInstanceId },
    });

    const characterPrompts = await Promise.all(
        characterInstances.map((characterInstance) =>
            getCharacterInfoPrompt(characterInstance)
        )
    );

    const prompt = `** Characters **\n\n${characterPrompts.join("\n\n")}\n\n** End of Characters **`;

    return prompt;
}

export function getToolsPrompt() {
    const toolsInfo = Object.values(functions)
        .map((func) => {
            return `- ${func.definition.function.name}: ${func.definition.function.description}`;
        })
        .join("\n");

    const prompt = `** Available Tools **\n\n${toolsInfo}\n\n** End of Tools **`;

    return prompt;
}

export function getPersonalityPrompt() {
    return `You are Silas, a Dungeon Master narrating a campaign for a group of players in a Dungeons & Dragons campaign.`;
}

export async function getSystemPrompt(storyBeatInstance: StoryBeatInstance, options?: { tools?: boolean }) {
    const context = await getStoryContextPrompt(storyBeatInstance);

    const personalityPrompt = getPersonalityPrompt();
    const toolsPrompt = getToolsPrompt();
    const charactersPrompt = await getCharacterPrompts(storyBeatInstance.campaignInstanceId);

    const message: CompletionCreateParams.Message = {
        role: "system",
        content: `${personalityPrompt}. 
        
            Welcome to the campaign! Here's a quick refresher on the campaign structure and your role as Dungeon Master:  
            
            Campaigns are structured like so:
            - Campaigns are composed of Acts. Usually there are 3 Acts in a campaign. For example, "The party uncovers the plot of an evil organization planning to take over the kingdom" would be an Act.
            - Acts are composed of Adventures. Adventures are self-contained stories that are part of the larger Act. For example, "The party solves the mystery of the missing children" would be an Adventure.
            - Adventures are composed of Story Beats. Each scene in a film or book is a Story Beat. Story Beats have goals. For example "The party enters the tavern and meets the barkeep who is having a bad day." is a Story Beat.
            - Story Beats are composed of Messages. Messages are the actual back and forth between the Dungeon Master and the players. For example, "The barkeep looks up at you and says 'What can I get you?'" would be a Message. Messages can also include Dungeon Master tool calls such as initiating skill checks. Once you decide a Story Beat is complete, you can transition to the next Story Beat by calling the transition_to_new_story_beat function. It should be noted that function details should not be shared with players.

            ${context}

            ${charactersPrompt}

            ${options?.tools ? toolsPrompt : ""}

            Focus on creating a compelling story with good tempo. Don't compact the story. Imagine each message to be a single small action. e.g. "I approach the barkeep.", "I look over the ridge", etc and match the narration accordingly. Avoid any text that the narrator wouldn't speak, e.g. no asterisks, titles, function calls, etc. Do not ask the player what their actions are, just end the message with your narration, as is. Do not assume actions for the player, it's not very fun when the DM says, "You did this thing", when the players didn't want it. Keep responses on the shorter side. Have fun! `,
    };

    return message;
}
