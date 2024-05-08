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
                user_id: {
                    type: "string",
                    description:
                        "The ID of the user who you'd like to initiate the skill check for.",
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
    user_id: z.string(),
    skill_name: z.string(),
    difficulty: z.number(),
});

type InitiateSkillCheckFunctionArgs = z.infer<
    typeof InitiateSkillCheckArgsSchema
>;

// --------- Implementation ---------
const implementation = (
    instanceState: InstanceState,
    args: InitiateSkillCheckFunctionArgs
) => {
    instanceState.rollDiceInfo = {
        userId: args.user_id,
        check: args.skill_name,
        subCheck: "", // TODO: This is just a placeholder for now - replace with a lookup (e.g. "Charisma" for Persuasion)
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
