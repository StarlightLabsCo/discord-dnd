import { ZodSchema } from "zod";
import type { InstanceState } from "starlight-api-types/websocket";
import { initiate_skill_check } from "./initiate_skill_check";
import { transition_to_new_story_beat } from "./transition_to_new_story_beat";

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
    transition_to_new_story_beat,
};
