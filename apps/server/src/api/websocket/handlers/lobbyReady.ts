import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import { type LobbyReadyRequest } from "starlight-api-types/websocket";

export async function handleLobbyReadyRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: LobbyReadyRequest
) {
    // ws.publish(
    //     ws.data.instanceId,
    //     JSON.stringify({
    //         type: "GameStateUpdateResponse",
    //         data: request.data,
    //     } as GameStateUpdateResponse)
    // );
}
