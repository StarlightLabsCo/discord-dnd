import { useGameStore } from "@/lib/game";
import {
    InstanceStatePatchResponse,
    InstanceStateSchema,
} from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    const { gameState, setGameState } = useGameStore.getState();

    const currentState = gameState || {};

    console.log(`[InstanceStatePatch]`, response.data);

    const newState = applyPatch(
        currentState,
        response.data as Operation[]
    ).newDocument;

    console.log(
        `[InstanceStatePatch] gameState?.streamedMessageWordTimings: ${gameState?.streamedMessageWordTimings}`
    );

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    if (validatedInstanceState.success) {
        setGameState(validatedInstanceState.data);
    } else {
        console.error(validatedInstanceState.error);
    }
}
