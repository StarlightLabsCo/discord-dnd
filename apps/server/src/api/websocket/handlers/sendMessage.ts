import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type {
    MessageAddedResponse,
    SendMessageRequest,
} from "starlight-api-types/websocket";
import { db } from "@/lib/db";

export async function handleSendMessageRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: SendMessageRequest
) {
    const { message } = request.data;
    const { instanceId, characterInstanceId } = ws.data;

    if (!instanceId || !characterInstanceId) {
        ws.send(JSON.stringify({ error: "Invalid user or instance" }));
        return;
    }

    const dbMessage = await db.message.create({
        data: {
            content: message,
            instance: {
                connect: {
                    id: instanceId,
                },
            },
            characterInstance: {
                connect: {
                    id: characterInstanceId,
                },
            },
        },
        include: {
            characterInstance: true,
        },
    });

    const messageResponse = {
        type: "MessageAddedResponse",
        data: dbMessage,
    } as MessageAddedResponse;

    ws.publish(instanceId, JSON.stringify(messageResponse));
}
