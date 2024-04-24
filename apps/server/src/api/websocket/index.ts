import type { ServerWebSocket, WebSocketHandler } from "bun";
import { validateWebSocketRequest } from "starlight-api-types/websocket";
import type { User } from "database";

import { handlePlayerConnect, handlePlayerDisconnect } from "./connection";
import { handleLobbyReadyRequest } from "./handlers/lobbyReady";
import { handleCharacterSelectRequest } from "./handlers/characterSelect";

export type WebSocketData = {
    user: User;
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
    console.log("[WS] Message:", message);

    const request = validateWebSocketRequest(message);
    if (!request) return;

    const handler = handlers[request.type];
    if (!handler) {
        console.error(`[WS] No handler found for ${request.type}`);
        return;
    }

    await handler(ws, request as any);
}

const handlers = {
    LobbyReadyRequest: handleLobbyReadyRequest,
    CharacterSelectRequest: handleCharacterSelectRequest,
};
