import { db } from "@/lib/db";
import type { User } from "database";
import type {
    InstanceState,
    InstanceStateResponse,
} from "starlight-api-types/websocket";
import { server } from "index";
import type { ServerWebSocket } from "bun";
import type { WebSocketData } from ".";

export const instanceIdToState = new Map<string, InstanceState>();

export async function addUserToInstanceState(
    ws: ServerWebSocket<WebSocketData>,
    instanceId: string,
    user: User
) {
    // State
    let instanceState = instanceIdToState.get(instanceId);
    if (!instanceState) {
        const selectedCampaign = await findOrCreateCampaignForUser(user);

        instanceState = {
            state: "LOBBY",
            connectedPlayers: [],
            selectedCampaign: selectedCampaign,
        };
    }

    // Character
    const existingCharacterInstance =
        instanceState.selectedCampaign.characterInstances.find(
            (ci) => ci.userId === user.id
        );

    ws.data.characterInstanceId = existingCharacterInstance?.id || null;
    instanceState.connectedPlayers.push({
        user,
        character: existingCharacterInstance || null,
        status: "NOT_READY",
    });

    // Update the map just before broadcasting the state
    instanceIdToState.set(instanceId, instanceState);

    const instanceStateResponse: InstanceStateResponse = {
        type: "InstanceStateResponse",
        data: instanceState,
    };
    server.publish(instanceId, JSON.stringify(instanceStateResponse));
}

async function findOrCreateCampaignForUser(user: User) {
    let campaignInstance = await db.campaignInstance.findFirst({
        where: {
            user: {
                id: user.id,
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            characterInstances: {
                include: {
                    user: true,
                },
            },
            messages: {
                include: {
                    characterInstance: true,
                },
            },
        },
    });

    if (!campaignInstance) {
        const campaign = await db.campaign.findFirst({
            orderBy: {
                updatedAt: "desc",
            },
        });
        if (!campaign) {
            throw new Error("No campaigns found");
        }

        campaignInstance = await db.campaignInstance.create({
            data: {
                campaign: {
                    connect: {
                        id: campaign.id,
                    },
                },
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                name: campaign.name,
                description: campaign.description,
                imageUrl: campaign.imageUrl,
            },
            include: {
                characterInstances: {
                    include: {
                        user: true,
                    },
                },
                messages: {
                    include: {
                        characterInstance: true,
                    },
                },
            },
        });
    }

    return campaignInstance;
}

export async function removeUserFromInstanceState(
    instanceId: string,
    user: User
) {
    const instanceState = instanceIdToState.get(instanceId);
    if (!instanceState) return;

    instanceState.connectedPlayers = instanceState.connectedPlayers.filter(
        (player) => player.user.id !== user.id
    );

    if (instanceState.connectedPlayers.length === 0) {
        instanceIdToState.delete(instanceId);
    } else {
        instanceIdToState.set(instanceId, instanceState);
        const instanceStateResponse: InstanceStateResponse = {
            type: "InstanceStateResponse",
            data: instanceState,
        };
        server.publish(instanceId, JSON.stringify(instanceStateResponse));
    }
}
