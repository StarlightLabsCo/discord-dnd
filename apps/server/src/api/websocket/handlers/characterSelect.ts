import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type { CharacterSelectRequest } from "starlight-api-types/websocket";
import { instanceIdToState } from "../instanceState";
import { db } from "@/lib/db";
import { server } from "index";
import { sendWsError } from "../utils";

export async function handleCharacterSelectRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: CharacterSelectRequest
) {
    const { characterInstanceId } = request.data;
    const { user, instanceId } = ws.data;

    const instanceState = instanceIdToState.get(instanceId);
    if (!instanceState) {
        sendWsError(ws, `Instance state not found for ID: ${instanceId}`);
        return;
    }

    let playerIndex = instanceState.connectedPlayers.findIndex(
        (p) => p.user.id === user.id
    );
    if (playerIndex === -1) {
        sendWsError(ws, `User not found for ID: ${user.id}`);
        return;
    }

    const characterInstance = await db.characterInstance.findUnique({
        where: { id: characterInstanceId },
    });

    if (!characterInstance || characterInstance.userId !== user.id) {
        sendWsError(ws, `Character not found for ID: ${characterInstanceId}`);
        return;
    }

    ws.data.characterInstanceId = characterInstanceId;

    instanceState.connectedPlayers[playerIndex].character = characterInstance;
    instanceIdToState.set(instanceId, instanceState);

    const instanceStateResponse = {
        type: "InstanceStateResponse",
        data: instanceState,
    };
    server.publish(instanceId, JSON.stringify(instanceStateResponse));
}
