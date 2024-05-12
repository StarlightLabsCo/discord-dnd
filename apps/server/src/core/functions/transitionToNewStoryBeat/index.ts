import { z } from "zod";
import type { LlmFunction } from "..";
import type { InstanceState } from "starlight-api-types/websocket";

// --------- Definition ---------
const definition = {
    type: "function",
    function: {
        name: "transition_to_new_story_beat",
        description: "Transition to a new story beat",
        parameters: {
            type: "object",
            properties: {
                story_id: {
                    type: "string",
                    description: "The ID of the story to transition to.",
                },
                beat_id: {
                    type: "string",
                    description: "The ID of the new story beat.",
                },
            },
            required: ["story_id", "beat_id"],
        },
    },
};

// --------- Args ---------
const TransitionToNewStoryBeatArgsSchema = z.object({
    story_id: z.string(),
    beat_id: z.string(),
});

type TransitionToNewStoryBeatFunctionArgs = z.infer<
    typeof TransitionToNewStoryBeatArgsSchema
>;

// --------- Implementation ---------
const implementation = (
    instanceState: InstanceState,
    toolCallId: string,
    args: TransitionToNewStoryBeatFunctionArgs
) => {
    console.log(
        `Transitioning to story ${args.story_id}, beat ${args.beat_id}`
    );
};

export const transition_to_new_story_beat = {
    definition,
    argsSchema: TransitionToNewStoryBeatArgsSchema,
    implementation,
} as LlmFunction;
