import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import {
    PostCharacterRequest,
    PostImageResponseZodSchema,
} from "starlight-api-types/rest";
import { classes } from "starlight-game-data/classes";
import { Item } from "starlight-game-data/items";
import { CharacterLore } from "starlight-game-data/characterLore";
import { useDiscordStore } from "@/lib/discord";
import character1 from "@/assets/images/fullbody/character1.webp";
interface CharacterContextType {
    originId: string;
    setOriginId: React.Dispatch<React.SetStateAction<string>>;

    raceId: string;
    setRaceId: React.Dispatch<React.SetStateAction<string>>;

    subraceId: string;
    setSubraceId: React.Dispatch<React.SetStateAction<string>>;

    classId: keyof typeof classes;
    setClassId: React.Dispatch<React.SetStateAction<keyof typeof classes>>;

    characterAbilityPoints: number;
    setCharacterAbilityPoints: React.Dispatch<React.SetStateAction<number>>;

    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    setStrength: React.Dispatch<React.SetStateAction<number>>;
    setDexterity: React.Dispatch<React.SetStateAction<number>>;
    setConstitution: React.Dispatch<React.SetStateAction<number>>;
    setIntelligence: React.Dispatch<React.SetStateAction<number>>;
    setWisdom: React.Dispatch<React.SetStateAction<number>>;

    inventory: Item[];
    setInventory: React.Dispatch<React.SetStateAction<Item[]>>;

    lore: CharacterLore;
    setLore: React.Dispatch<React.SetStateAction<CharacterLore>>;

    imageUrl: string;
    setImageUrl: React.Dispatch<React.SetStateAction<string>>;

    generateCharacter: () => Promise<void>;
    generatingCharacter: boolean;
    setGeneratingCharacter: React.Dispatch<React.SetStateAction<boolean>>;

    createCharacter: () => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
    undefined
);

export const useCharacterContext = () => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error(
            "useCharacterContext must be used within a CharacterProvider"
        );
    }
    return context;
};

interface CharacterProviderProps {
    children: ReactNode;
}

export const CharacterProvider: React.FC<CharacterProviderProps> = ({
    children,
}) => {
    const [originId, setOriginId] = useState<string>("custom");
    const [raceId, setRaceId] = useState<string>("dwarf");
    const [subraceId, setSubraceId] = useState<string>("Hill Dwarf");
    const [classId, setClassId] = useState<keyof typeof classes>("rogue");

    const [abilityPoints, setCharacterAbilityPoints] = useState<number>(27);
    const [strength, setStrength] = useState<number>(8);
    const [dexterity, setDexterity] = useState<number>(8);
    const [constitution, setConstitution] = useState<number>(8);
    const [intelligence, setIntelligence] = useState<number>(8);
    const [wisdom, setWisdom] = useState<number>(8);
    const [charisma, setCharisma] = useState<number>(8);

    const [inventory, setInventory] = useState<Item[]>([]);

    const [lore, setLore] = useState<CharacterLore>({
        name: "",
        pronouns: "",
        age: "",
        voice: "",
        alignment: "",
        appearance: "",
        backstory: "",
        personality: "",
        ideals: "",
        bonds: "",
        flaws: "",
    });

    const [imageUrl, setImageUrl] = useState<string>(character1);

    const [generatingCharacter, setGeneratingCharacter] =
        useState<boolean>(false);
    const access_token = useDiscordStore.getState().auth?.access_token;
    const generateCharacter = useCallback(async () => {
        setGeneratingCharacter(true);
        const response = await fetch("/api/character/generate", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                raceId,
                classId,
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                lore,
            }),
        });

        setGeneratingCharacter(false);

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

        setImageUrl(parsedData.data.imageUrl);
    }, [access_token, lore]);

    const createCharacter = useCallback(async () => {
        const response = await fetch("/api/character/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                originId,
                raceId,
                subraceId: "",
                classId,
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                charisma,
                lore,
                inventory,
                imageUrl,
            } as PostCharacterRequest),
        });

        if (!response.ok) {
            console.error("Failed to create character");
            return;
        }

        const data = await response.json();
    }, [access_token]);

    const value = {
        originId,
        setOriginId,

        raceId,
        setRaceId,

        subraceId,
        setSubraceId,

        classId,
        setClassId,

        characterAbilityPoints: abilityPoints,
        setCharacterAbilityPoints,

        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,

        setStrength,
        setDexterity,
        setConstitution,
        setIntelligence,
        setWisdom,

        inventory,
        setInventory,

        lore,
        setLore,

        imageUrl,
        setImageUrl,

        generateCharacter,
        generatingCharacter,
        setGeneratingCharacter,

        createCharacter,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};
