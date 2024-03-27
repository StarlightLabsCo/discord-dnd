import type { ServerWebSocket } from "bun";
import type { ConnectedPlayersInfoResponse } from "starlight-api-types/websocket";
import type { User } from "database";
import { server } from "index";
import type { WebSocketData } from ".";

const instanceIdToPlayers = new Map<string, User[]>();

export async function handlePlayerConnect(ws: ServerWebSocket<WebSocketData>) {
    const { instanceId, user } = ws.data;
    ws.subscribe(instanceId);

    const players = instanceIdToPlayers.get(instanceId) ?? [];
    instanceIdToPlayers.set(instanceId, [...players, user]);

    const response: ConnectedPlayersInfoResponse = {
        type: "ConnectedPlayersInfoResponse",
        data: { players: instanceIdToPlayers.get(instanceId) ?? [] },
    };
    server.publish(instanceId, JSON.stringify(response));
}

export async function handlePlayerDisconnect(
    ws: ServerWebSocket<WebSocketData>
) {
    const { instanceId, user } = ws.data;
    ws.unsubscribe(instanceId);

    const players = instanceIdToPlayers.get(instanceId) ?? [];
    const updatedPlayers = players.filter((player) => player.id !== user.id);

    instanceIdToPlayers.set(instanceId, updatedPlayers);

    if (updatedPlayers.length === 0) {
        instanceIdToPlayers.delete(instanceId);
    }

    server.publish(
        instanceId,
        JSON.stringify({
            type: "ConnectedPlayersInfoResponse",
            data: { players: updatedPlayers },
        } as ConnectedPlayersInfoResponse)
    );
}
