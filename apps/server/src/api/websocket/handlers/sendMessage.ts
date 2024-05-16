import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type { SendMessageRequest } from "starlight-api-types/websocket";
import { db } from "@/lib/db";
import { sendWsError } from "../utils";
import { continueBeat } from "@/core/procedures/beat/continue";
import {
    getWritableInstanceState,
    updateInstanceState,
} from "../instanceState";

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
        include: {
            storyBeatInstances: true,
        },
    });

    if (!campaignInstance) {
        sendWsError(ws, `Character not in campaign`);
        return;
    }

    const storyBeat =
        campaignInstance.storyBeatInstances[
            campaignInstance.storyBeatInstances.length - 1
        ];

    const dbMessage = await db.message.create({
        data: {
            content: message,
            storyBeatInstance: {
                connect: {
                    id: storyBeat.id,
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

    const { instanceState, release } = await getWritableInstanceState(
        ws.data.instanceId
    );
    if (!instanceState) {
        release();
        sendWsError(
            ws,
            `Instance state not found for ID: ${ws.data.instanceId}`
        );
        return;
    }

    instanceState.selectedCampaignInstance.storyBeatInstances[
        instanceState.selectedCampaignInstance.storyBeatInstances.length - 1
    ].messages.push(dbMessage);
    updateInstanceState(ws.data.instanceId, instanceState, release);

    continueBeat(ws.data.instanceId);
}
