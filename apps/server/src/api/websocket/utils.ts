import type { ServerWebSocket } from "bun";
import type { WebSocketData } from ".";
import { instanceIdToState } from "./instanceState";
import { server } from "index";
import type {
    InstanceState,
    InstanceStateResponse,
} from "starlight-api-types/websocket";

export function updateAndBroadcastInstanceState(
    instanceId: string,
    instanceState: InstanceState
) {
    instanceIdToState.set(instanceId, instanceState);

    const instanceStateResponse = {
        type: "InstanceStateResponse",
        data: instanceState,
    } as InstanceStateResponse;
    server.publish(instanceId, JSON.stringify(instanceStateResponse));
}

export function sendWsError(
    ws: ServerWebSocket<WebSocketData>,
    message: string
) {
    console.error(message);

    const errorResponse = {
        type: "ErrorResponse",
        data: {
            error: message,
        },
    };
    ws.send(JSON.stringify(errorResponse));
}
