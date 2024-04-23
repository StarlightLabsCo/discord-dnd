import type { ServerWebSocket } from "bun";
import type { WebSocketData } from ".";

import type { UserInfoResponse } from "starlight-api-types/websocket";
import {
    removeUserFromInstanceState,
    addUserToInstanceState,
} from "./instanceState";

export async function handlePlayerConnect(ws: ServerWebSocket<WebSocketData>) {
    const { instanceId, user } = ws.data;
    ws.subscribe(instanceId);

    // Provide user to client (for userid)
    const userInfoResponse: UserInfoResponse = {
        type: "UserInfoResponse",
        data: user,
    };
    ws.send(JSON.stringify(userInfoResponse));

    // Create or update the instance state
    await addUserToInstanceState(instanceId, user);
}

export async function handlePlayerDisconnect(
    ws: ServerWebSocket<WebSocketData>
) {
    const { instanceId, user } = ws.data;
    ws.unsubscribe(instanceId);

    await removeUserFromInstanceState(instanceId, user);
}
