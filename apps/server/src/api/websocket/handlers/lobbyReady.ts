import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import { type LobbyReadyRequest } from "starlight-api-types/websocket";
import { instanceIdToState } from "../instanceState";
import { sendWsError, updateAndBroadcastInstanceState } from "../utils";
import { db } from "@/lib/db";

export async function handleLobbyReadyRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: LobbyReadyRequest
) {
    // Get the instance state
    const instanceState = instanceIdToState.get(ws.data.instanceId);
    if (!instanceState) {
        sendWsError(
            ws,
            `Instance state not found for ID: ${ws.data.instanceId}`
        );
        return;
    }

    // Update the player's ready status
    instanceState.connectedPlayers = instanceState.connectedPlayers.map((p) => {
        if (p.user.id === ws.data.user.id) {
            p.status = request.data.ready ? "READY" : "NOT_READY";
        }
        return p;
    });

    // If all players are ready and have selected a character, start the game
    if (
        instanceState.connectedPlayers.every(
            (p) => p.status === "READY" && p.character !== null
        )
    ) {
        instanceState.state = "IN_GAME";

        // If we're starting the campaign for the first time add all connected players to the party
        if (instanceState.selectedCampaign?.characterInstances.length === 0) {
            const updatedCampaignInstance = await db.campaignInstance.update({
                where: { id: instanceState.selectedCampaign.id },
                data: {
                    characterInstances: {
                        connect: instanceState.connectedPlayers.map((p) => ({
                            id: p.character!.id,
                        })),
                    },
                },
                include: {
                    messages: true,
                    characterInstances: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            instanceState.selectedCampaign = updatedCampaignInstance;
        }
    }

    updateAndBroadcastInstanceState(ws.data.instanceId, instanceState);
}
