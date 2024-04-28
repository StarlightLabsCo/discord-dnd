import { compare } from "fast-json-patch";
import { db } from "@/lib/db";
import { server } from "index";
import type { ServerWebSocket } from "bun";
import type { WebSocketData } from ".";
import type { User } from "database";
import {
    type InstanceState,
    type InstanceStatePatchResponse,
} from "starlight-api-types/websocket";
import type { JsonPatchOperation } from "starlight-api-types/websocket/patch";

const instanceIdToState = new Map<string, InstanceState>();

export function getInstanceState(instanceId: string) {
    const state = instanceIdToState.get(instanceId);
    if (!state) return undefined;

    return structuredClone(state);
}

export async function addUserToInstanceState(
    ws: ServerWebSocket<WebSocketData>,
    instanceId: string,
    user: User
) {
    // State
    let instanceState = getInstanceState(instanceId);
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
    updateInstanceState(instanceId, instanceState);
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
    const instanceState = getInstanceState(instanceId);
    if (!instanceState) return;

    instanceState.connectedPlayers = instanceState.connectedPlayers.filter(
        (player) => player.user.id !== user.id
    );

    if (instanceState.connectedPlayers.length === 0) {
        instanceIdToState.delete(instanceId);
    } else {
        updateInstanceState(instanceId, instanceState);
    }
}

export function updateInstanceState(
    instanceId: string,
    newInstanceState: InstanceState
) {
    const existingInstanceState = instanceIdToState.get(instanceId);
    instanceIdToState.set(instanceId, newInstanceState); // TODO: Bad!! Race condition, switch to using fast-json-patch's observer on the getInstanceState function

    console.log(`Updating instance state for ID: ${instanceId}`);
    console.log(
        `Existing instance state: ${JSON.stringify(existingInstanceState)}`
    );
    console.log(`New instance state: ${JSON.stringify(newInstanceState)}`);

    const patch = compare(existingInstanceState || {}, newInstanceState);

    console.log(`Patch Length: ${patch.length}`);
    for (let i = 0; i < Math.min(5, patch.length); i++) {
        console.log(`Patch ${i}: ${JSON.stringify(patch[i])}`);
    }

    const patchResponse: InstanceStatePatchResponse = {
        type: "InstanceStatePatchResponse",
        data: patch as JsonPatchOperation[],
    };

    server.publish(instanceId, JSON.stringify(patchResponse));
}
