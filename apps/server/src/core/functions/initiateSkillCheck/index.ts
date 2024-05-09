import { z } from "zod";
import type { LlmFunction } from "..";
import type { InstanceState } from "starlight-api-types/websocket";

// --------- Definition ---------
const definition = {
    type: "function",
    function: {
        name: "initiateSkillCheck",
        description: "Initiate a skill check",
        parameters: {
            type: "object",
            properties: {
                character_instance_id: {
                    type: "string",
                    description:
                        "The ID of the character instance who you'd like to initiate the skill check for.",
                },
                skill_name: {
                    type: "string",
                    description:
                        "The name of the skill to have the player roll for.",
                },
                difficulty: {
                    type: "number",
                    description:
                        "The difficulty of the skill check. This is the DC the player must meet or exceed to succeed.",
                },
            },
            required: ["skill_name", "difficulty"],
        },
    },
};

// --------- Args ---------
const InitiateSkillCheckArgsSchema = z.object({
    character_instance_id: z.string(),
    skill_name: z.string(),
    difficulty: z.number(),
});

type InitiateSkillCheckFunctionArgs = z.infer<
    typeof InitiateSkillCheckArgsSchema
>;

// --------- Implementation ---------
const implementation = (
    instanceState: InstanceState,
    toolCallId: string,
    args: InitiateSkillCheckFunctionArgs
) => {
    instanceState.rollDiceInfo = {
        toolCallId: toolCallId,
        characterInstanceId: args.character_instance_id,
        check: args.skill_name,
        subCheck: "",
        difficulty: args.difficulty,
        state: "ready",
        result: null,
    };
};

export const initiateSkillCheck = {
    definition,
    argsSchema: InitiateSkillCheckArgsSchema,
    implementation,
} as LlmFunction;
