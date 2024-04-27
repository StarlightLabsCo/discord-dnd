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
    console.log(
        `DEBUG: handleCharacterSelectRequest: ${JSON.stringify(request)}`
    );

    const { characterInstanceId } = request.data;
    const { user, instanceId } = ws.data;

    console.log(`DEBUG: characterInstanceId: ${characterInstanceId}`);
    console.log(`DEBUG: user: ${JSON.stringify(user)}`);
    console.log(`DEBUG: instanceId: ${instanceId}`);

    const instanceState = instanceIdToState.get(instanceId);
    if (!instanceState) {
        sendWsError(ws, `Instance state not found for ID: ${instanceId}`);
        return;
    }

    console.log(`DEBUG: instanceState: ${JSON.stringify(instanceState)}`);

    let playerIndex = instanceState.connectedPlayers.findIndex(
        (p) => p.user.id === user.id
    );
    if (playerIndex === -1) {
        sendWsError(ws, `User not found for ID: ${user.id}`);
        return;
    }

    const characterInstance = await db.characterInstance.findUnique({
        where: { id: characterInstanceId, userId: user.id },
    });

    console.log(
        `DEBUG: characterInstance: ${JSON.stringify(characterInstance)}`
    );

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
