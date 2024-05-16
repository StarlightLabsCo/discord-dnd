import { ZodSchema } from "zod";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions.mjs";
import type { InstanceState } from "starlight-api-types/websocket";
import { initiate_skill_check } from "./tools/initiate_skill_check";
import { transition_to_new_story_beat } from "./tools/transition_to_new_story_beat";

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

export async function handleToolCalls(
    toolCalls: ChatCompletion.Choice.Message.ToolCall[]
) {
    for (const toolCall of toolCalls) {
        await handleToolCall(toolCall);
    }
}

export async function handleToolCall(
    toolCall: ChatCompletion.Choice.Message.ToolCall
) {}
