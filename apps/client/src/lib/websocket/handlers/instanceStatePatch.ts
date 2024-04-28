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

    // Apply patch fails:
    // TypeError: Cannot read properties of undefined (reading 'updatedAt')
    const newState = applyPatch(
        gameState,
        response.data as Operation[]
    ).newDocument;

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    if (validatedInstanceState.success) {
        console.log("Validated instance state after patch");
        setGameState(validatedInstanceState.data);
    } else {
        console.log("Failed to validate instance state after patch");
        console.error(validatedInstanceState.error);
    }
}
