import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import { type LobbyReadyRequest } from "starlight-api-types/websocket";
import { instanceIdToState } from "../instanceState";
import { server } from "index";

export async function handleLobbyReadyRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: LobbyReadyRequest
) {
    const instanceState = instanceIdToState.get(ws.data.instanceId);
    if (!instanceState) {
        console.error("Instance state not found for ID:", ws.data.instanceId);
        return;
    }

    const player = instanceState.connectedPlayers.find(
        (p) => p.user.id === ws.data.user.id
    );
    if (player) {
        player.status = request.data.ready ? "READY" : "NOT_READY";
    } else {
        console.error(
            "Player not found in instance state for user ID:",
            ws.data.user.id
        );
        return;
    }

    instanceIdToState.set(ws.data.instanceId, instanceState);

    const instanceStateResponse = {
        type: "InstanceStateResponse",
        data: instanceState,
    };
    server.publish(ws.data.instanceId, JSON.stringify(instanceStateResponse));

    // Start the game if all players are ready
    const allReady = instanceState.connectedPlayers.every(
        (p) => p.status === "READY"
    );
    if (allReady) {
        const gameStartResponse = {
            type: "GameStartResponse",
            data: {},
        };
        server.publish(ws.data.instanceId, JSON.stringify(gameStartResponse));
    }
}
