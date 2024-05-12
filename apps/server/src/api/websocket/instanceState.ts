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
import { Mutex } from "async-mutex";

const instanceIdToState = new Map<string, InstanceState>();
const stateMutex = new Map<string, Mutex>();

// Eventually could be kinda cool to get only get a Mutex for a specific field and it's children rather than the whole state.
function getMutexForInstance(instanceId: string): Mutex {
    let mutex = stateMutex.get(instanceId);
    if (!mutex) {
        mutex = new Mutex();
        stateMutex.set(instanceId, mutex);
    }
    return mutex;
}

export async function getInstanceState(instanceId: string) {
    const mutex = getMutexForInstance(instanceId);
    const release = await mutex.acquire(); // Lock

    const state = instanceIdToState.get(instanceId);

    return {
        instanceState: state ? structuredClone(state) : undefined,
        release,
    };
}

export async function addUserToInstanceState(
    ws: ServerWebSocket<WebSocketData>,
    instanceId: string,
    user: User
) {
    // State
    let { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        const selectedCampaign = await findOrCreateCampaignForUser(user);
        if (!selectedCampaign) {
            throw new Error("No campaign and wasn't able to create one");
        }

        instanceState = {
            state: "LOBBY",
            connectedPlayers: [],
            selectedCampaignInstance: selectedCampaign,
            streamedMessageId: null,
            streamedMessageWordTimings: null,
            rollDiceInfo: null,
        };
    }

    // Character
    const existingCharacterInstance =
        instanceState.selectedCampaignInstance.characterInstances.find(
            (ci) => ci.userId === user.id
        );

    ws.data.characterInstanceId = existingCharacterInstance?.id || null;
    instanceState.connectedPlayers.push({
        user,
        character: existingCharacterInstance || null,
        status: "NOT_READY",
    });

    updateInstanceState(instanceId, instanceState, release);
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
                    beat: {
                        include: {
                            location: true,
                        },
                    },
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

        const beat = await db.beat.findUnique({
            where: {
                id: "clv8ohv9m0009i5bqwioopfmv",
            },
        });
        if (!beat) {
            throw new Error("No beat found");
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
                storyBeatInstances: {
                    // TODO: need to figure out how/when to add the characterInstances to the first story beat instance, maybe on character create?
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
                        beat: {
                            include: {
                                location: true,
                            },
                        },
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
    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        release();
        return;
    }

    instanceState.connectedPlayers = instanceState.connectedPlayers.filter(
        (player) => player.user.id !== user.id
    );

    if (instanceState.connectedPlayers.length === 0) {
        instanceIdToState.delete(instanceId);
        stateMutex.delete(instanceId);
    } else {
        updateInstanceState(instanceId, instanceState, release);
    }
}

export function updateInstanceState(
    instanceId: string,
    newInstanceState: InstanceState,
    release: () => void
) {
    try {
        let existingInstanceState = instanceIdToState.get(instanceId) || {};
        instanceIdToState.set(instanceId, newInstanceState);

        // JSON Patch doesn't convert dates correctly, so we need to normalize the state to strings
        const stringifiedExistingState = JSON.stringify(existingInstanceState);
        const stringifiedNewInstanceState = JSON.stringify(newInstanceState);

        const normalizedExistingState = JSON.parse(stringifiedExistingState);
        const normalizedNewInstanceState = JSON.parse(
            stringifiedNewInstanceState
        );

        const patch = compare(
            normalizedExistingState,
            normalizedNewInstanceState
        );

        const patchResponse: InstanceStatePatchResponse = {
            type: "InstanceStatePatchResponse",
            data: patch as JsonPatchOperation[],
        };

        server.publish(instanceId, JSON.stringify(patchResponse));
    } finally {
        release();
    }
}
