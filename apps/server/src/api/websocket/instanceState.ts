import { db } from "@/lib/db";
import type { User } from "database";
import type {
    InstanceState,
    InstanceStateResponse,
} from "starlight-api-types/websocket";
import { server } from "index";

const idToState = new Map<string, InstanceState>();

export async function addUserToInstanceState(instanceId: string, user: User) {
    let instanceState = idToState.get(instanceId);
    if (!instanceState) {
        let selectedCampaign = await findOrCreateCampaignForUser(user);

        instanceState = {
            state: "LOBBY",
            connectedPlayers: [
                {
                    user,
                    character: null,
                    status: "NOT_READY",
                },
            ],
            selectedCampaign,
        };
        idToState.set(instanceId, instanceState);
    } else {
        instanceState.connectedPlayers.push({
            user,
            character: null,
            status: "NOT_READY",
        });
    }

    idToState.set(instanceId, instanceState);

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
        });
    }

    return campaignInstance;
}

export async function removeUserFromInstanceState(
    instanceId: string,
    user: User
) {
    const instanceState = idToState.get(instanceId);
    if (!instanceState) return;

    instanceState.connectedPlayers = instanceState.connectedPlayers.filter(
        (player) => player.user.id !== user.id
    );

    if (instanceState.connectedPlayers.length === 0) {
        idToState.delete(instanceId);
    } else {
        idToState.set(instanceId, instanceState);
        const instanceStateResponse: InstanceStateResponse = {
            type: "InstanceStateResponse",
            data: instanceState,
        };
        server.publish(instanceId, JSON.stringify(instanceStateResponse));
    }
}