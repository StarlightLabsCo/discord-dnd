import { create } from "zustand";
import {
    PostCharacterRequest,
    PostImageResponseZodSchema,
    PostImageRequest,
} from "starlight-api-types/rest";
import { useDiscordStore } from "@/lib/discord";
import character1 from "@/assets/images/fullbody/character1.webp";

interface CharacterStoreState {
    originId: string;
    setOriginId: (id: string) => void;

    raceId: string;
    setRaceId: (id: string) => void;

    subraceId: string;
    setSubraceId: (id: string) => void;

    classId: keyof typeof classes;
    setClassId: (id: keyof typeof classes) => void;

    characterAbilityPoints: number;
    setCharacterAbilityPoints: (points: number) => void;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    setStrength: (value: number) => void;
    setDexterity: (value: number) => void;
    setConstitution: (value: number) => void;
    setIntelligence: (value: number) => void;
    setWisdom: (value: number) => void;
    setCharisma: (value: number) => void;

    name: string;
    setName: (name: string) => void;
    pronouns: string;
    setPronouns: (pronouns: string) => void;
    age: number;
    setAge: (age: number) => void;
    voice: string;
    setVoice: (voice: string) => void;
    alignment: string;
    setAlignment: (alignment: string) => void;
    appearance: string;
    setAppearance: (appearance: string) => void;
    backstory: string;
    setBackstory: (backstory: string) => void;
    personality: string;
    setPersonality: (personality: string) => void;
    ideals: string;
    setIdeals: (ideals: string) => void;
    bonds: string;
    setBonds: (bonds: string) => void;
    flaws: string;
    setFlaws: (flaws: string) => void;

    imageUrl: string;
    setImageUrl: (url: string) => void;

    generateCharacter: () => Promise<void>;
    generatingCharacter: boolean;
    setGeneratingCharacter: (generating: boolean) => void;

    createCharacter: () => Promise<void>;
}

export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
    originId: "custom",
    setOriginId: (id) => set({ originId: id }),

    raceId: "dwarf",
    setRaceId: (id) => set({ raceId: id }),

    subraceId: "Hill Dwarf",
    setSubraceId: (id) => set({ subraceId: id }),

    classId: "rogue",
    setClassId: (id) => set({ classId: id }),

    characterAbilityPoints: 27,
    setCharacterAbilityPoints: (points) =>
        set({ characterAbilityPoints: points }),

    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,

    setStrength: (value) => set({ strength: value }),
    setDexterity: (value) => set({ dexterity: value }),
    setConstitution: (value) => set({ constitution: value }),
    setIntelligence: (value) => set({ intelligence: value }),
    setWisdom: (value) => set({ wisdom: value }),
    setCharisma: (value) => set({ charisma: value }),

    name: "",
    pronouns: "",
    age: 0,
    voice: "",
    alignment: "",
    appearance: "",
    backstory: "",
    personality: "",
    ideals: "",
    bonds: "",
    flaws: "",

    setName: (name) => set({ name }),
    setPronouns: (pronouns) => set({ pronouns }),
    setAge: (age) => set({ age }),
    setVoice: (voice) => set({ voice }),
    setAlignment: (alignment) => set({ alignment }),
    setAppearance: (appearance) => set({ appearance }),
    setBackstory: (backstory) => set({ backstory }),
    setPersonality: (personality) => set({ personality }),
    setIdeals: (ideals) => set({ ideals }),
    setBonds: (bonds) => set({ bonds }),
    setFlaws: (flaws) => set({ flaws }),

    imageUrl: character1,
    setImageUrl: (url) => set({ imageUrl: url }),

    generatingCharacter: false,
    setGeneratingCharacter: (generating) =>
        set({ generatingCharacter: generating }),

    generateCharacter: async () => {
        const { auth } = useDiscordStore.getState();
        if (!auth?.access_token) {
            console.error("No access token available");
            return;
        }

        get().setGeneratingCharacter(true);
        const response = await fetch("/api/image", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                raceId: get().raceId,
                classId: get().classId,

                name: get().name,
                pronouns: get().pronouns,
                age: get().age,
                voice: get().voice,
                alignment: get().alignment,
                appearance: get().appearance,
                backstory: get().backstory,
                personality: get().personality,
                ideals: get().ideals,
                bonds: get().bonds,
                flaws: get().flaws,

                strength: get().strength,
                dexterity: get().dexterity,
                constitution: get().constitution,
                intelligence: get().intelligence,
                wisdom: get().wisdom,
                charisma: get().charisma,
            } as PostImageRequest),
        });

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

        get().setImageUrl(parsedData.data.imageUrl);
    },

    createCharacter: async () => {
        const { auth } = useDiscordStore.getState();
        if (!auth?.access_token) {
            console.error("No access token available");
            return;
        }

        const response = await fetch("/api/character/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                originId: get().originId,
                raceId: get().raceId,
                subraceId: get().subraceId,
                classId: get().classId,

                name: get().name,
                pronouns: get().pronouns,
                age: get().age,
                voice: get().voice,
                alignment: get().alignment,
                appearance: get().appearance,
                backstory: get().backstory,
                personality: get().personality,
                ideals: get().ideals,
                bonds: get().bonds,
                flaws: get().flaws,

                strength: get().strength,
                dexterity: get().dexterity,
                constitution: get().constitution,
                intelligence: get().intelligence,
                wisdom: get().wisdom,
                charisma: get().charisma,

                imageUrl: get().imageUrl,
            } as PostCharacterRequest),
        });

        if (!response.ok) {
            console.error("Failed to create character");
            return;
        }

        const data = await response.json();
        console.log(data);
    },
}));
