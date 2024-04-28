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

    const newState = applyPatch(
        gameState,
        response.data as Operation[]
    ).newDocument;

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    if (validatedInstanceState.success) {
        setGameState(validatedInstanceState.data);
    } else {
        console.error(validatedInstanceState.error);
    }
}
