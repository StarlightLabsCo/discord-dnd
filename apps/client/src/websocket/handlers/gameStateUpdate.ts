import { useGameStore } from "@/game";
import { GameStateUpdateResponse } from "starlight-api-types/websocket";

export async function handleGameStateUpdateResponse(
    response: GameStateUpdateResponse
) {
    useGameStore.getState().setGameState(response.data);
}
