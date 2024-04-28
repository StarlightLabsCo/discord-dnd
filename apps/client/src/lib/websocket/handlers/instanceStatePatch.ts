import { useGameStore } from "@/lib/game";
import { InstanceStatePatchResponse } from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    const { gameState: state, setGameState: setState } =
        useGameStore.getState();
    if (!state) {
        console.error("No current instance game state to patch.");
        return;
    }

    const newState = applyPatch(
        state,
        response.data as Operation[]
    ).newDocument;

    setState(newState);
}
