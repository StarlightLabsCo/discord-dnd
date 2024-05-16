import { db } from "@/lib/db";
import cuid from "cuid";
import type { CharacterInstance, Message } from "database";
import type { CompletionCreateParams } from "groq-sdk/resources/chat/index.mjs";
import type { SelectedCampaignInstance } from "starlight-api-types/websocket";

export async function getSystemPrompt(
    selectedCampaignInstance: SelectedCampaignInstance
) {
    const storyBeatInstances = selectedCampaignInstance.storyBeatInstances;
    const latestStoryBeatInstance =
        storyBeatInstances[storyBeatInstances.length - 1];
    const latestStoryBeat = latestStoryBeatInstance.beat;

    const latestAdventureId = latestStoryBeat.adventureId;
    const adventure = await db.adventure.findUnique({
        where: { id: latestAdventureId },
    });
    if (!adventure) {
        throw new Error("Adventure not found");
    }

    const act = await db.act.findUnique({
        where: { id: adventure.actId },
    });
    if (!act) {
        throw new Error("Act not found");
    }

    const characterPrompts = await Promise.all(
        selectedCampaignInstance.characterInstances.map((characterInstance) =>
            getCharacterPrompt(characterInstance)
        )
    );

    const message = {
        role: "system",
        content: `You are a Silas, a Dungeon Master narrating a campaign for a group of players in a Dungeons & Dragons campaign.  
            
            Campaigns are structured like so:
            - Campaigns are composed of Acts. Usually there are 3 Acts in a campaign. For example, "The party uncovers the plot of an evil organization planning to take over the kingdom" would be an Act.
            - Acts are composed of Adventures. Adventures are self-contained stories that are part of the larger Act. For example, "The party solves the mystery of the missing children" would be an Adventure.
            - Adventures are composed of Story Beats. Each scene in a film or book is a Story Beat. Story Beats have goals. For example "The party enters the tavern and meets the barkeep who is having a bad day." is a Story Beat.
            - Story Beats are composed of Messages. Messages are the actual back and forth between the Dungeon Master and the players. For example, "The barkeep looks up at you and says 'What can I get you?'" would be a Message. Messages can also include Dungeon Master tool calls such as initiating skill checks. Once you decide a Story Beat is complete, you can transition to the next Story Beat by calling the transition_to_new_story_beat function. It should be noted that function details should not be shared with players.

            Function Info:
            - initiate_skill_check: calling this will pull up a skill check dialogue for all players to view. The selected player will then roll a d20 dice, which will be compared to the skill check DC. If the roll + the player's additional modifiers is greater than or equal to the DC, the skill check is successful. If the roll is less than the DC, the skill check is unsuccessful. 
            - transition_to_new_story_beat: calling this will transition the story to the next story beat. This should be called after the current story beat is complete.

            ** Context **

            Current Campaign:
            - Campaign: ${selectedCampaignInstance.campaign.name}
            -- Description: ${selectedCampaignInstance.campaign.description}

            - Act: ${act.name}
            -- Description: ${act.description}

            - Adventure: ${adventure.name}
            -- Description: ${adventure.description}

            ${
                storyBeatInstances.length > 1
                    ? `Past Story Beats (Completed):` +
                      storyBeatInstances
                          .slice(0, -1)
                          .map((storyBeatInstance) => {
                              return `- ${storyBeatInstance.beat.name}
                -- Description: ${storyBeatInstance.beat.description}
                -- Location:
                --- Name: ${storyBeatInstance.beat.location.name}
                --- Description: ${storyBeatInstance.beat.location.description}`;
                          })
                          .join("\n") +
                      `\n`
                    : ""
            }
     
            - Current Story Beat (In Progress): ${latestStoryBeatInstance.name}
            -- Description: ${latestStoryBeatInstance.description}
            -- Location: 
            --- Name: ${latestStoryBeatInstance.beat.location.name}
            --- Description: ${latestStoryBeatInstance.beat.location.description}

            Player Characters:
            ${characterPrompts.join("\n\n")}
            
            
            ** End of Context **

            Focus on creating a compelling story with good tempo. Don't compact the story. Imagine each message to be a single small action. e.g. "I approach the barkeep.", "I look over the ridge", etc and match the narration accordingly. Avoid any text that the narrator wouldn't speak, e.g. no asterisks, titles, function calls, etc. Do not ask the player what their actions are, just end the message with your narration, as is. Keep responses on the shorter side. Have fun! `,
    };

    return message;
}

export async function getCharacterPrompt(characterInstance: CharacterInstance) {
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

export function getFormattedMessages(
    messages: (Message & { characterInstance: CharacterInstance | null })[]
) {
    let formattedMessages = messages
        .map((message) => {
            const characterInstance = message.characterInstance;
            if (characterInstance) {
                return {
                    role: "user",
                    content:
                        characterInstance.name +
                        " " +
                        message.verb +
                        ": " +
                        message.content,
                };
            } else {
                const parsedMessage = JSON.parse(message.content);
                if (
                    parsedMessage.role === "assistant" &&
                    parsedMessage.content
                ) {
                    return {
                        role: "assistant",
                        content:
                            "Dungeon Master " +
                            message.verb +
                            ":" +
                            parsedMessage.content,
                    };
                } else if (
                    parsedMessage.role === "assistant" &&
                    parsedMessage.tool_calls &&
                    parsedMessage.tool_calls.length > 0
                ) {
                    return {
                        role: "assistant",
                        content:
                            "Dungeon Master called " +
                            parsedMessage.tool_calls[0].function.name +
                            " with args " +
                            parsedMessage.tool_calls[0].function.arguments,
                    };
                } else if (parsedMessage.role === "tool") {
                    return {
                        tool_call_id: parsedMessage.tool_call_id,
                        role: "tool",
                        name: parsedMessage.name,
                        content: parsedMessage.content,
                    };
                } else {
                    return undefined;
                }
            }
        })
        .filter((message) => message !== undefined);

    return formattedMessages as CompletionCreateParams.Message[];
}

export function createFakeAssistantMessage(
    visible: boolean,
    action: string | null,
    content: string
): Message & { characterInstance: null } {
    return {
        id: cuid(),
        storyBeatInstanceId: "",
        characterInstanceId: null,
        characterInstance: null,
        visible,
        verb: action,
        content,
        audioUrl: null,
        audioWordTimings: null,
        tag: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
