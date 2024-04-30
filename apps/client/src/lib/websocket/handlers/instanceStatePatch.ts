import { useGameStore } from "@/lib/game";
import {
    InstanceStatePatchResponse,
    InstanceStateSchema,
} from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    console.log(JSON.stringify(response.data, null, 2));

    const { gameState, setGameState } = useGameStore.getState();
    const currentState = gameState || {};

    const newState = applyPatch(
        currentState,
        response.data as Operation[],
        true,
        false
    ).newDocument;

    console.log(`[InstanceStatePatch] newState:`);
    console.log(JSON.stringify(newState, null, 2));

    console.log(
        `[InstanceStatePatch] gameState:`,
        gameState !== null ? "exists" : "null"
    );

    console.log(`[InstanceStatePatch] gameState?.streamedMessageWordTimings:`);
    console.log(JSON.stringify(gameState?.streamedMessageWordTimings, null, 2));

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    console.log(`[InstanceStatePatch] validatedInstanceState:`);
    console.log(JSON.stringify(validatedInstanceState, null, 2));

    if (validatedInstanceState.success) {
        setGameState(validatedInstanceState.data);
    } else {
        console.error(JSON.stringify(validatedInstanceState.error, null, 2));
    }
}
