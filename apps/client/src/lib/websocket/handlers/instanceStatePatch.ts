import { useGameStore } from "@/lib/game";
import {
    InstanceStatePatchResponse,
    InstanceStateSchema,
} from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    console.log(response.data);

    const { gameState, setGameState } = useGameStore.getState();
    const currentState = gameState || {};

    const newState = applyPatch(
        currentState,
        response.data as Operation[],
        true,
        false
    ).newDocument;

    console.log(`[InstanceStatePatch] newState:`);
    console.log(newState);

    console.log(
        `[InstanceStatePatch] gameState:`,
        gameState !== null ? "exists" : "null"
    );

    console.log(`[InstanceStatePatch] gameState?.streamedMessageWordTimings:`);
    console.log(gameState?.streamedMessageWordTimings);

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    console.log(`[InstanceStatePatch] validatedInstanceState:`);
    console.log(validatedInstanceState);

    if (validatedInstanceState.success) {
        setGameState(validatedInstanceState.data);
    } else {
        console.error(validatedInstanceState.error);
    }
}
