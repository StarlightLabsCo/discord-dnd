import { useGameStore } from "@/game";
import { ConnectedPlayersInfoResponse } from "starlight-api-types/websocket";

export async function handleConnectedPlayersInfoResponse(
    response: ConnectedPlayersInfoResponse
) {
    useGameStore.getState().setConnectedPlayers(response.data.players);
}
