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
        response.data as Operation[],
        true,
        false
    ).newDocument;

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    if (validatedInstanceState.success) {
        setGameState(validatedInstanceState.data);
    } else {
        logObject("[InstanceStatePatch] Error:", validatedInstanceState.error);
    }
}
