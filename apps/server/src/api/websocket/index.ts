import type { ServerWebSocket, WebSocketHandler } from "bun";
import type { APIUser } from "discord-api-types/v10";
import { validateWebSocketRequest } from "starlight-api-types/websocket";

type WebSocketData = {
    user: APIUser;
    instanceId: string;
};

export const WebSocketHandlers: WebSocketHandler<WebSocketData> = {
    async open(ws) {
        console.log("[WS] Connected");
        ws.subscribe(ws.data.instanceId);
    },
    async message(ws, message) {
        await handleWebSocketMessage(ws, message);
    },
    async close(ws) {
        console.log("[WS] Disconnected");
    },
};

async function handleWebSocketMessage(
    ws: ServerWebSocket<WebSocketData>,
    message: any
) {
    const request = validateWebSocketRequest(message);
    if (!request) return;

    // TODO: do stuff with the request
}
