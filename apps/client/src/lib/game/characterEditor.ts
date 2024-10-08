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

type CharacterInstanceInfo = CharacterInstance & {
    race: Race;
    class: Class;
    background: Background & {
        proficiencies: Proficiency[];
        startingEquipment: Item[];
    };
};

interface CharacterEditorStoreState {
    draftCharacter: CharacterInstanceInfo | null;
    setDraftCharacter: (character: CharacterInstanceInfo) => void;
    generateRandomDraftCharacter: () => void;

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
        draftCharacter: null,
        setDraftCharacter: (draftCharacter) => set({ draftCharacter }),
        generateRandomDraftCharacter: () => {
            set({ draftCharacter: getRandomCharacter() });
        },

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
                set({ draftCharacter: data });

                const ws = useWebsocketStore.getState().ws;
                if (ws) {
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

export const getRandomCharacter = (): CharacterInstanceInfo => {
    const { user, gameState } = useGameStore.getState();
    if (!gameState) {
        throw new Error("Game state is undefined");
    }

    const { selectedCampaignInstance } = gameState;
    const { campaign } = selectedCampaignInstance;
    const { world } = campaign || { races: [], classes: [], backgrounds: [] };

    const getRandomElement = (array: any[]) =>
        array[Math.floor(Math.random() * array.length)];

    const randomRace = getRandomElement(world.races);
    const randomClass = getRandomElement(world.classes);
    const randomBackground = getRandomElement(world.backgrounds);

    return {
        id: cuid(),
        userId: user?.id,
        characterId: null,
        campaignInstanceId: selectedCampaignInstance?.id,
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
