import {
    World,
    Race,
    Class,
    Background,
    CharacterInstance,
    Proficiency,
    Item,
} from "database";
import { create } from "zustand";
import { useDiscordStore } from "../discord";
import cuid from "cuid";
import {
    PostImageRequest,
    PostImageResponseZodSchema,
} from "starlight-api-types/rest";
import { useWebsocketStore } from "../websocket";
import { useGameStore } from ".";
import { CharacterSelectRequest } from "starlight-api-types/websocket";

type WorldInfo = World & {
    races: Race[];
    classes: Class[];
    backgrounds: (Background & {
        proficiencies: Proficiency[];
        startingEquipment: Item[];
    })[];
};

type CharacterInstanceInfo = CharacterInstance & {
    race: Race;
    class: Class;
    background: Background & {
        proficiencies: Proficiency[];
        startingEquipment: Item[];
    };
};

interface CharacterEditorStoreState {
    world: WorldInfo | null;
    setWorld: (world: WorldInfo) => void;
    setWorldByCampaignId: (campaignId: string) => void;

    draftCharacter: CharacterInstanceInfo | null;
    setDraftCharacter: (character: CharacterInstanceInfo) => void;

    availableCharacterAbilityPoints: number;
    setAvailableCharacterAbilityPoints: (points: number) => void;

    generateCharacter: () => void;
    generatingCharacter: boolean;
    setGeneratingCharacter: (generating: boolean) => void;

    saveCharacter: () => void;
    savingCharacter: boolean;
    setSavingCharacter: (saving: boolean) => void;
}

export const useCharacterEditorStore = create<CharacterEditorStoreState>(
    (set, get) => ({
        world: null,
        setWorld: (world) => {
            set({ world });
            if (world && get().draftCharacter === null) {
                set({ draftCharacter: getRandomCharacter(world) });
            }
        },
        setWorldByCampaignId: async (campaignId) => {
            console.log("Fetching world...");
            console.log(
                `${import.meta.env.VITE_HOST ? import.meta.env.VITE_HOST : ""}/api/data/world?campaignId=` +
                    campaignId
            );
            const response = await fetch(
                `${import.meta.env.VITE_HOST ? import.meta.env.VITE_HOST : ""}/api/data/world?campaignId=` +
                    campaignId
            );
            if (!response.ok) {
                console.error("Failed to fetch world");
                return;
            }

            const data = await response.json();

            set({ world: data[0] });
            console.log("World set");

            if (data[0] && get().draftCharacter === null) {
                console.log("Generating random character...");
                set({ draftCharacter: getRandomCharacter(data[0]) });
            }
        },

        draftCharacter: null,
        setDraftCharacter: (draftCharacter) => set({ draftCharacter }),

        availableCharacterAbilityPoints: 27,
        setAvailableCharacterAbilityPoints: (points) =>
            set({ availableCharacterAbilityPoints: points }),

        generateCharacter: async () => {
            const { auth } = useDiscordStore.getState();
            if (!auth?.access_token) {
                console.error("No access token available");
                return;
            }

            get().setGeneratingCharacter(true);
            const response = await fetch(
                `${import.meta.env.VITE_HOST ? import.meta.env.VITE_HOST : ""}/api/image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        get().draftCharacter as PostImageRequest
                    ),
                }
            );

            get().setGeneratingCharacter(false);

            if (!response.ok) {
                console.error("Failed to generate character");
                return;
            }

            const data = await response.json();
            const parsedData = PostImageResponseZodSchema.safeParse(data);
            if (!parsedData.success) {
                console.error(parsedData.error);
                return;
            }

            const draftCharacter = get().draftCharacter;
            if (draftCharacter) {
                get().setDraftCharacter({
                    ...draftCharacter,
                    imageUrl: parsedData.data.imageUrl,
                });
            }
        },
        generatingCharacter: false,
        setGeneratingCharacter: (generating) =>
            set({ generatingCharacter: generating }),

        saveCharacter: async () => {
            const { draftCharacter } = get();
            if (!draftCharacter) {
                console.error("No character to save");
                return;
            }

            set({ savingCharacter: true });

            const { auth } = useDiscordStore.getState();

            const response = await fetch(
                `${import.meta.env.VITE_HOST ? import.meta.env.VITE_HOST : ""}/api/data/character`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${auth?.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(draftCharacter),
                }
            );

            set({ savingCharacter: false });

            if (!response.ok) {
                console.error("Failed to save character");
                return;
            }

            const data = await response.json();
            if (data) {
                console.log("Character saved successfully");
                set({ draftCharacter: data });

                const ws = useWebsocketStore.getState().ws;
                if (ws) {
                    console.log("Sending character select request");
                    ws.send(
                        JSON.stringify({
                            type: "CharacterSelectRequest",
                            data: {
                                characterInstanceId: data.id,
                            },
                        } as CharacterSelectRequest)
                    );
                } else {
                    console.error("No websocket connection available");
                }
            }
        },
        savingCharacter: false,
        setSavingCharacter: (saving) => set({ savingCharacter: saving }),
    })
);

export const getRandomCharacter = (world: WorldInfo): CharacterInstanceInfo => {
    const selectedCampaign = useGameStore.getState().state?.selectedCampaign;
    const user = useGameStore.getState().user;

    const randomRace =
        world.races[Math.floor(Math.random() * world.races.length)];
    const randomClass =
        world.classes[Math.floor(Math.random() * world.classes.length)];
    const randomBackground =
        world.backgrounds[Math.floor(Math.random() * world.backgrounds.length)];

    return {
        id: cuid(),
        userId: user?.id,
        characterId: null,
        campaignInstanceId: selectedCampaign?.id,

        raceId: randomRace.id,
        race: randomRace,

        subraceId: null,

        classId: randomClass.id,
        class: randomClass,

        backgroundId: randomBackground.id,
        background: randomBackground,

        name: "Random Character",
        description: "A randomly generated character",
        imageUrl: "",
        pronouns: "They/Them",
        age: Math.floor(Math.random() * 100) + 1,
        voice: "Undefined",
        alignment: "NEUTRAL_GOOD",
        appearance: "Randomly generated",
        backstory: "Mysterious origins",
        personalityTraits: [],
        ideals: [],
        bonds: [],
        flaws: [],
        currentLocationId: null,
        level: 1,
        experience: 0,
        proficiencyBonus: 2,
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
        hitDieCount: 1,
        hitDieType: randomClass.hitDice,
        size: randomRace.size,
        speed: randomRace.speed,
        maxLevel1SpellSlots: 0,
        maxLevel2SpellSlots: 0,
        maxLevel3SpellSlots: 0,
        maxLevel4SpellSlots: 0,
        maxLevel5SpellSlots: 0,
        maxLevel6SpellSlots: 0,
        maxLevel7SpellSlots: 0,
        maxLevel8SpellSlots: 0,
        maxLevel9SpellSlots: 0,
        healthPoints: 10,
        availableLevel1SpellSlots: 0,
        availableLevel2SpellSlots: 0,
        availableLevel3SpellSlots: 0,
        availableLevel4SpellSlots: 0,
        availableLevel5SpellSlots: 0,
        availableLevel6SpellSlots: 0,
        availableLevel7SpellSlots: 0,
        availableLevel8SpellSlots: 0,
        availableLevel9SpellSlots: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as CharacterInstanceInfo;
};
