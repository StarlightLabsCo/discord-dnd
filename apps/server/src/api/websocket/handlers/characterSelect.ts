import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type { CharacterSelectRequest } from "starlight-api-types/websocket";
import {
    getWritableInstanceState,
    updateInstanceState,
} from "../instanceState";
import { db } from "@/lib/db";
import { sendWsError } from "../utils";

export async function handleCharacterSelectRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: CharacterSelectRequest
) {
    const { characterInstanceId } = request.data;
    const { user, instanceId } = ws.data;

    const { instanceState, release } =
        await getWritableInstanceState(instanceId);
    if (!instanceState) {
        release();
        sendWsError(ws, `Instance state not found for ID: ${instanceId}`);
        return;
    }

    let playerIndex = instanceState.connectedPlayers.findIndex(
        (p) => p.user.id === user.id
    );
    if (playerIndex === -1) {
        release();
        sendWsError(ws, `User not found for ID: ${user.id}`);
        return;
    }

    const characterInstance = await db.characterInstance.findUnique({
        where: { id: characterInstanceId, userId: user.id },
    });

    if (!characterInstance || characterInstance.userId !== user.id) {
        release();
        sendWsError(ws, `Character not found for ID: ${characterInstanceId}`);
        return;
    }

    ws.data.characterInstanceId = characterInstanceId;

    instanceState.connectedPlayers[playerIndex].character = characterInstance;
    updateInstanceState(instanceId, instanceState, release);
}
