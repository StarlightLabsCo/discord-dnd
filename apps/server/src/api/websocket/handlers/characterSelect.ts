import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type { CharacterSelectRequest } from "starlight-api-types/websocket";
import { instanceIdToState } from "../instanceState";
import { db } from "@/lib/db";
import { server } from "index";

export async function handleCharacterSelectRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: CharacterSelectRequest
) {
    const { characterInstanceId } = request.data;
    const { user, instanceId } = ws.data;

    const instanceState = instanceIdToState.get(instanceId);
    if (!instanceState) {
        ws.send(JSON.stringify({ error: "Instance not found" }));
        return;
    }

    let playerIndex = instanceState.connectedPlayers.findIndex(
        (p) => p.user.id === user.id
    );
    if (playerIndex === -1) {
        ws.send(JSON.stringify({ error: "User not found in instance" }));
        return;
    }

    const characterInstance = await db.characterInstance.findUnique({
        where: { id: characterInstanceId },
    });

    if (!characterInstance || characterInstance.userId !== user.id) {
        ws.send(JSON.stringify({ error: "Character not found" }));
        return;
    }

    instanceState.connectedPlayers[playerIndex].character = characterInstance;
    instanceIdToState.set(instanceId, instanceState);

    const instanceStateResponse = {
        type: "InstanceStateResponse",
        data: instanceState,
    };
    server.publish(instanceId, JSON.stringify(instanceStateResponse));
}
