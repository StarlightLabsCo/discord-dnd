import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import { type LobbyReadyRequest } from "starlight-api-types/websocket";
import { getInstanceState, updateInstanceState } from "../instanceState";
import { sendWsError } from "../utils";
import { db } from "@/lib/db";
import { introduceStoryBeat } from "@/core/story/introduceStoryBeat";

export async function handleLobbyReadyRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: LobbyReadyRequest
) {
    // Get the instance state
    const { instanceState, release } = await getInstanceState(
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
    }

    updateInstanceState(ws.data.instanceId, instanceState, release);

    // If the game is now in progress, and the last story beat has no messages, introduce the story beat (acts as the beginning of the game too)
    if (instanceState.state === "IN_GAME") {
        const storyBeatInstances =
            instanceState.selectedCampaignInstance.storyBeatInstances;
        if (
            storyBeatInstances[storyBeatInstances.length - 1].messages
                .length === 0
        ) {
            introduceStoryBeat(ws.data.instanceId);
        }
    }
}
