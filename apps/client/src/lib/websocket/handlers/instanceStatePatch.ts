import { useGameStore } from "@/lib/game";
import {
    InstanceStatePatchResponse,
    InstanceStateSchema,
} from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    console.log("Received instance state patch response");
    const { gameState, setGameState } = useGameStore.getState();

    console.log("Applying patch to game state:");
    const newState = applyPatch(
        gameState,
        response.data as Operation[]
    ).newDocument;

    console.log("New state after patch:");
    console.log(newState);

    const validatedInstanceState = InstanceStateSchema.safeParse(newState); // why does this throw

    if (validatedInstanceState.success) {
        console.log("Validated instance state after patch");
        setGameState(validatedInstanceState.data);
    } else {
        console.log("Failed to validate instance state after patch");
        console.error(validatedInstanceState.error);
    }
}
