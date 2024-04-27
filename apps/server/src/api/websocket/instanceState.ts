import { db } from "@/lib/db";
import type { User } from "database";
import type {
    InstanceState,
    InstanceStateResponse,
} from "starlight-api-types/websocket";
import { server } from "index";

export const instanceIdToState = new Map<string, InstanceState>();

export async function addUserToInstanceState(instanceId: string, user: User) {
    let instanceState = instanceIdToState.get(instanceId);
    let selectedCampaign = await findOrCreateCampaignForUser(user);

    const existingCharacterInstance = selectedCampaign.characterInstances.find(
        (ci) => ci.userId === user.id
    );

    if (!instanceState) {
        instanceState = {
            state: "LOBBY",
            connectedPlayers: [
                {
                    user,
                    character: existingCharacterInstance || null,
                    status: "NOT_READY",
                },
            ],
            selectedCampaign,
        };
        instanceIdToState.set(instanceId, instanceState);
    } else {
        instanceState.connectedPlayers.push({
            user,
            character: existingCharacterInstance || null,
            status: "NOT_READY",
        });
    }

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
            users: {
                some: {
                    id: user.id,
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            characterInstances: true,
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
                users: {
                    connect: {
                        id: user.id,
                    },
                },
                name: campaign.name,
                description: campaign.description,
                imageUrl: campaign.imageUrl,
            },
            include: {
                characterInstances: true,
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
