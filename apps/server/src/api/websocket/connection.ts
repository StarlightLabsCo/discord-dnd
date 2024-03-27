import type { ServerWebSocket } from "bun";
import type { ConnectedPlayersInfoResponse } from "starlight-api-types/websocket";
import type { User } from "database";
import type { WebSocketData } from ".";
import { apiUserToUser } from "@/lib/discord";

const instanceIdToPlayers = new Map<string, User[]>();

export async function handlePlayerConnect(ws: ServerWebSocket<WebSocketData>) {
    ws.subscribe(ws.data.instanceId);

    const players = instanceIdToPlayers.get(ws.data.instanceId) ?? [];

    instanceIdToPlayers.set(ws.data.instanceId, [
        ...players,
        apiUserToUser(ws.data.user),
    ]);

    ws.publish(
        ws.data.instanceId,
        JSON.stringify({
            type: "ConnectedPlayersInfoResponse",
            data: {
                players: instanceIdToPlayers.get(ws.data.instanceId) ?? [],
            },
        } as ConnectedPlayersInfoResponse)
    );
}

export async function handlePlayerDisconnect(
    ws: ServerWebSocket<WebSocketData>
) {
    ws.unsubscribe(ws.data.instanceId);

    const players = instanceIdToPlayers.get(ws.data.instanceId) ?? [];
    const updatedPlayers = players.filter(
        (player) => player.id !== ws.data.user.id
    );

    if (updatedPlayers.length > 0) {
        instanceIdToPlayers.set(ws.data.instanceId, updatedPlayers);

        ws.publish(
            ws.data.instanceId,
            JSON.stringify({
                type: "ConnectedPlayersInfoResponse",
                data: {
                    players: updatedPlayers,
                },
            } as ConnectedPlayersInfoResponse)
        );
    } else {
        instanceIdToPlayers.delete(ws.data.instanceId);
    }
}
