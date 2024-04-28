import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type {
    MessageAddedResponse,
    SendMessageRequest,
} from "starlight-api-types/websocket";
import { db } from "@/lib/db";
import { sendWsError } from "../utils";
import { server } from "index";
import { continueStory } from "@/core/continueStory";
import { instanceIdToState } from "../instanceState";

export async function handleSendMessageRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: SendMessageRequest
) {
    const { message } = request.data;
    const { characterInstanceId } = ws.data;

    if (!characterInstanceId) {
        sendWsError(ws, `Character not found`);
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

    const instanceState = instanceIdToState.get(ws.data.instanceId);
    if (!instanceState) {
        sendWsError(
            ws,
            `Instance state not found for ID: ${ws.data.instanceId}`
        );
        return;
    }

    instanceState.selectedCampaign.messages.push(dbMessage);
    instanceIdToState.set(ws.data.instanceId, instanceState);

    const messageResponse = {
        type: "MessageAddedResponse",
        data: dbMessage,
    } as MessageAddedResponse;

    server.publish(ws.data.instanceId, JSON.stringify(messageResponse));

    continueStory(ws.data.instanceId);
}
