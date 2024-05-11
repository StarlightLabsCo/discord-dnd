import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import { type LobbyReadyRequest } from "starlight-api-types/websocket";
import { getInstanceState, updateInstanceState } from "../instanceState";
import { sendWsError } from "../utils";
import { db } from "@/lib/db";

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

        const beat = await db.beat.findUnique({
            where: {
                id: "clv8ohv9m0009i5bqwioopfmv",
            },
        });
        if (!beat) {
            throw new Error("No beat found");
        }

        // If we're starting the campaign for the first time add all connected players to the party
        if (
            instanceState.selectedCampaignInstance?.characterInstances
                .length === 0
        ) {
            const updatedCampaignInstance = await db.campaignInstance.update({
                where: { id: instanceState.selectedCampaignInstance.id },
                data: {
                    characterInstances: {
                        connect: instanceState.connectedPlayers.map((p) => ({
                            id: p.character!.id,
                        })),
                    },
                    storyBeatInstances: {
                        create: [
                            {
                                beat: {
                                    connect: {
                                        id: beat.id,
                                    },
                                },
                                name: beat.name,
                                description: beat.description,
                                imageUrl: beat.imageUrl,
                                characterInstances: {
                                    connect: instanceState.connectedPlayers.map(
                                        (p) => ({
                                            id: p.character!.id,
                                        })
                                    ),
                                },
                            },
                        ],
                    },
                },
                include: {
                    campaign: {
                        include: {
                            world: {
                                include: {
                                    races: {
                                        include: {
                                            racialTraits: true,
                                        },
                                    },
                                    classes: {
                                        include: {
                                            proficiencies: true,
                                            classFeatures: true,
                                            startingEquipment: true,
                                        },
                                    },
                                    backgrounds: {
                                        include: {
                                            proficiencies: true,
                                            startingEquipment: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    characterInstances: {
                        include: {
                            user: true,
                            race: {
                                include: {
                                    racialTraits: true,
                                },
                            },
                            class: {
                                include: {
                                    proficiencies: true,
                                    classFeatures: true,
                                },
                            },
                            proficiencies: true,
                            feats: true,
                            inventory: true,
                        },
                    },
                    storyBeatInstances: {
                        include: {
                            messages: {
                                include: {
                                    characterInstance: true,
                                },
                            },
                        },
                    },
                },
            });

            instanceState.selectedCampaignInstance = updatedCampaignInstance;
        }
    }

    updateInstanceState(ws.data.instanceId, instanceState, release);
}
