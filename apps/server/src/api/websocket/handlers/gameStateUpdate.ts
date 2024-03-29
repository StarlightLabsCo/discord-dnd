import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import {
    type GameStateUpdateRequest,
    type GameStateUpdateResponse,
} from "starlight-api-types/websocket";

export async function handleGameStateUpdateRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: GameStateUpdateRequest
) {
    ws.publish(
        ws.data.instanceId,
        JSON.stringify({
            type: "GameStateUpdateResponse",
            data: request.data,
        } as GameStateUpdateResponse)
    );
}
