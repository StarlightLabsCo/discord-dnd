import { useGameStore } from "@/lib/game";
import {
    InstanceStatePatchResponse,
    InstanceStateSchema,
} from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";
import { logObject } from "@/lib/utils";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    const { gameState, setGameState } = useGameStore.getState();
    const currentState = gameState || {};

    const newState = applyPatch(
        currentState,
        response.data as Operation[]
    ).newDocument;

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    if (validatedInstanceState.success) {
        const wordTimings =
            validatedInstanceState.data.streamedMessageWordTimings;
        if (wordTimings) {
            const parsedWordTimings = JSON.parse(wordTimings);
            console.log(
                `[InstanceStatePatch] wordStartTimesMs: ${parsedWordTimings.wordStartTimesMs}`
            );
        }

        setGameState(validatedInstanceState.data);
    } else {
        logObject("[InstanceStatePatch] Error:", validatedInstanceState.error);
    }
}
