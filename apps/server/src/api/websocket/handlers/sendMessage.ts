import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type {
    MessageAddedResponse,
    SendMessageRequest,
} from "starlight-api-types/websocket";
import { db } from "@/lib/db";
import { sendWsError } from "../utils";

export async function handleSendMessageRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: SendMessageRequest
) {
    const { message } = request.data;
    const { instanceId, characterInstanceId } = ws.data;

    if (!instanceId || !characterInstanceId) {
        sendWsError(ws, `Instance or character not found`);
        return;
    }

    const campaignInstance = await db.campaignInstance.findFirst({
        where: {
            characterInstances: {
                some: {
                    id: characterInstanceId,
                },
            },
        },
    });

    if (!campaignInstance) {
        sendWsError(ws, `Character not in campaign`);
        return;
    }

    const dbMessage = await db.message.create({
        data: {
            content: message,
            instance: {
                connect: {
                    id: campaignInstance.id,
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
