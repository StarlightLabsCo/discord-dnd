import {
    getInstanceState,
    updateInstanceState,
} from "@/api/websocket/instanceState";
import {
    createFakeAssistantMessage,
    getFormattedMessages,
    getSystemPrompt,
} from "../utils";
import { groq } from "@/lib/groq";
import { streamAudio } from "@/lib/elevenlabs";
import { functions } from "@/core/functions";
import type { Message } from "database";
import { db } from "@/lib/db";

export async function continueStoryBeat(instanceId: string) {
    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        return null;
    }
    release(); // i fucking hate this, i shouldn't need a mutex just to read the values

    const campaignInstance = instanceState.selectedCampaignInstance;
    if (!campaignInstance) {
        return null;
    }

    const systemPrompt = await getSystemPrompt(campaignInstance);

    const storyBeatInstances = campaignInstance.storyBeatInstances;
    const currentStoryBeatInstance =
        storyBeatInstances[storyBeatInstances.length - 1];
    const messages = currentStoryBeatInstance.messages;

    const formattedMessages = getFormattedMessages(messages);

    // TODO: Retrieve relevant information

    // Internal reflection
    let reflection = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
            systemPrompt,
            ...formattedMessages,
            {
                role: "user",
                content:
                    "Reflect on the current situation of the story beat, and think about where you'd like to take the story next. Use the format: 'Dungeon Master reflects: ...'. Remember none of your thoughts will be shared with the players. They are just for you.",
            },
        ],
    });

    if (!reflection.choices || reflection.choices.length === 0) {
        console.error("No reflection choices");
        console.error(reflection);
        return null;
    }

    if (reflection.choices[0].message.content) {
        reflection.choices[0].message.content =
            reflection.choices[0].message.content
                .replace(/Dungeon Master reflects:\s?/, "")
                .trim();
    }

    const reflectionMessage = createFakeAssistantMessage(
        false,
        "thinks",
        reflection.choices[0].message.content
    );

    // Narration
    let isFinishedSpeaking = false;
    let newMessages: (Message & { characterInstance: null })[] = [
        reflectionMessage,
    ];
    while (!isFinishedSpeaking) {
        let completion = await groq.chat.completions.create({
            model: "llama3-70b-8192",
            messages: [
                systemPrompt,
                ...formattedMessages,
                {
                    role: "assistant",
                    content: reflection.choices[0].message.content,
                },
                {
                    role: "user",
                    content:
                        "Continue narrating the story beat based on your reflection and the current situation. When speaking use the format: 'Dungeon Master says: ...' Otherwise call a tool function.",
                },
            ],
            tools: Object.values(functions).map((f) => f.definition),
        });

        if (!completion.choices || completion.choices.length === 0) {
            console.error("No completion choices");
            console.error(completion);
            return null;
        }

        const content = completion.choices[0].message.content;
        const toolCalls = completion.choices[0].message.tool_calls;

        // If the completion has message content
        if (content && content.trim().length > 0) {
            completion.choices[0].message.content = content
                .replace(/Dungeon Master says:\s?/, "")
                .trim();

            const newMessage = createFakeAssistantMessage(
                true,
                "says",
                JSON.stringify(completion.choices[0].message)
            );
            newMessages.push(newMessage);

            await streamAudio(instanceId, "1Tbay5PQasIwgSzUscmj", newMessage);

            // Update the instance state
            const { instanceState, release } =
                await getInstanceState(instanceId);
            if (!instanceState) {
                return null;
            }

            const storyBeatInstances =
                instanceState.selectedCampaignInstance.storyBeatInstances;
            const currentStoryBeatInstance =
                storyBeatInstances[storyBeatInstances.length - 1];

            currentStoryBeatInstance.messages.push(
                newMessage as Message & {
                    characterInstance: null;
                }
            );

            instanceState.streamedMessageId = newMessage.id;

            updateInstanceState(instanceId, instanceState, release);
        } else if (toolCalls && toolCalls.length > 0) {
            for (const toolCall of toolCalls) {
                if (!toolCall.id) {
                    continue;
                }

                const name = toolCall.function?.name;
                if (!name || !functions[name as keyof typeof functions]) {
                    continue;
                }

                console.log("Running function:", name);
                console.log("Arguments:", toolCall.function?.arguments);

                const newMessage = createFakeAssistantMessage(
                    true,
                    null,
                    JSON.stringify(completion.choices[0].message)
                );
                newMessages.push(newMessage);

                // Update the instance state
                const { instanceState, release } =
                    await getInstanceState(instanceId);
                if (!instanceState) {
                    return null;
                }

                currentStoryBeatInstance.messages.push(
                    newMessage as Message & {
                        characterInstance: null;
                    }
                );

                const func = functions[name as keyof typeof functions];
                if (toolCall.function?.arguments) {
                    const parsedArgs = JSON.parse(toolCall.function.arguments);
                    const argsValid = func.argsSchema.safeParse(parsedArgs);
                    if (argsValid.success) {
                        func.implementation(
                            instanceState,
                            toolCall.id,
                            argsValid.data
                        );
                    } else {
                        console.error(
                            "Invalid arguments for function:",
                            name,
                            argsValid.error
                        );
                    }
                } else {
                    func.implementation(instanceState, toolCall.id);
                }

                updateInstanceState(instanceId, instanceState, release);
            }
        } else {
            console.error("No content or tool calls");
            console.error(completion);
            return null;
        }

        let isFinished = await groq.chat.completions.create({
            model: "llama3-70b-8192",
            messages: [
                systemPrompt,
                ...getFormattedMessages([...messages, ...newMessages]),
                {
                    role: "user",
                    content:
                        "Based on the above messages, are you finished narrating for now? If you are, reply with only 'yes'. If you would like to continue, reply with 'no'.",
                },
            ],
        });

        if (!isFinished.choices || isFinished.choices.length === 0) {
            console.error("No isFinished choices");
            console.error(isFinished);
            return null;
        }

        isFinishedSpeaking = isFinished.choices[0].message.content === "yes";
        console.log("Is finished speaking:", isFinishedSpeaking);
    }

    await db.storyBeatInstance.update({
        where: { id: currentStoryBeatInstance.id },
        data: {
            messages: {
                create: newMessages.map((m) => ({
                    id: m.id,
                    content: m.content,
                    verb: m.verb,
                    visible: m.visible,
                })),
            },
        },
    });
}
