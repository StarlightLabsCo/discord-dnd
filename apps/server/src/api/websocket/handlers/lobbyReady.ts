import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import { type LobbyReadyRequest } from "starlight-api-types/websocket";
import { instanceIdToState } from "../instanceState";
import { server } from "index";
import { sendWsError } from "../utils";
import { db } from "@/lib/db";

export async function handleLobbyReadyRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: LobbyReadyRequest
) {
    const instanceState = instanceIdToState.get(ws.data.instanceId);
    if (!instanceState) {
        sendWsError(
            ws,
            `Instance state not found for ID: ${ws.data.instanceId}`
        );
        return;
    }

    const player = instanceState.connectedPlayers.find(
        (p) => p.user.id === ws.data.user.id
    );
    if (player) {
        player.status = request.data.ready ? "READY" : "NOT_READY";
    } else {
        sendWsError(
            ws,
            `Player not found in instance state for user ID: ${ws.data.user.id}`
        );

        return;
    }

    instanceIdToState.set(ws.data.instanceId, instanceState);

    server.publish(
        ws.data.instanceId,
        JSON.stringify({
            type: "InstanceStateResponse",
            data: instanceState,
        })
    );

    if (
        instanceState.connectedPlayers.every((p) => p.status === "READY") &&
        instanceState.connectedPlayers.every((p) => p.character !== null)
    ) {
        instanceState.state = "IN_GAME";
        instanceIdToState.set(ws.data.instanceId, instanceState);
        server.publish(
            ws.data.instanceId,
            JSON.stringify({ type: "GameStartResponse", data: {} })
        );

        const campaignInstance = await db.campaignInstance.findUnique({
            where: { id: instanceState.selectedCampaign.id },
            include: { characterInstances: true },
        });

        // If we're starting the campaign for the first time add all connected players to the campaign
        if (campaignInstance?.characterInstances.length === 0) {
            await db.campaignInstance.update({
                where: { id: instanceState.selectedCampaign.id },
                data: {
                    characterInstances: {
                        connect: instanceState.connectedPlayers.map((p) => ({
                            id: p.character!.id,
                        })),
                    },
                },
            });
        }
    } else {
        sendWsError(
            ws,
            "Not all players are ready or have selected a character"
        );
    }
}
