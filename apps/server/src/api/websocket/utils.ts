import type { ServerWebSocket } from "bun";
import type { WebSocketData } from ".";

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
