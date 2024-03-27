import type { ServerWebSocket, WebSocketHandler } from "bun";
import type { APIUser } from "discord-api-types/v10";
import { validateWebSocketRequest } from "starlight-api-types/websocket";
import { handlePlayerConnect, handlePlayerDisconnect } from "./connection";

export type WebSocketData = {
    user: APIUser;
    instanceId: string;
};

export const WebSocketHandlers: WebSocketHandler<WebSocketData> = {
    async open(ws) {
        console.log("[WS] Connected");
        await handlePlayerConnect(ws);
    },
    async message(ws, message) {
        await handleWebSocketMessage(ws, message);
    },
    async close(ws) {
        console.log("[WS] Disconnected");
        await handlePlayerDisconnect(ws);
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
