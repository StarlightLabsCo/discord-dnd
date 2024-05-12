import { ZodSchema } from "zod";
import { initiate_skill_check } from "./initiateSkillCheck";
import type { InstanceState } from "starlight-api-types/websocket";

export type LlmFunction = {
    definition: {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                properties: Record<string, any>;
                required: string[];
            };
        };
    };
    argsSchema: ZodSchema<any>;
    implementation: (
        instanceState: InstanceState,
        toolCallId: string,
        args?: any
    ) => void;
};
export const functions: Record<string, LlmFunction> = {
    initiate_skill_check,
};
