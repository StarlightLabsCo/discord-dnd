import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { GenerateCharacterResponseZodSchema } from "starlight-api-types/rest";
import { classes } from "starlight-game-data/classes";
import { Item } from "starlight-game-data/items";
import { AbilityScores } from "starlight-game-data/abilities";
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
    characterAbilities: AbilityScores;
    setCharacterAbilities: React.Dispatch<React.SetStateAction<AbilityScores>>;

    inventory: Item[];
    setInventory: React.Dispatch<React.SetStateAction<Item[]>>;

    lore: CharacterLore;
    setLore: React.Dispatch<React.SetStateAction<CharacterLore>>;

    characterImageUrl: string;
    setCharacterImageUrl: React.Dispatch<React.SetStateAction<string>>;

    generateCharacter: () => Promise<void>;
    generatingCharacter: boolean;
    setGeneratingCharacter: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [abilityScores, setAbilityScores] = useState<AbilityScores>({
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
    });

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

    const [characterImageUrl, setCharacterImageUrl] =
        useState<string>(character1);

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
                abilityScores,
                lore,
            }),
        });

        setGeneratingCharacter(false);

        if (!response.ok) {
            console.error("Failed to generate character");
            return;
        }

        const data = await response.json();
        const parsedData = GenerateCharacterResponseZodSchema.safeParse(data);
        if (!parsedData.success) {
            console.error(parsedData.error);
            return;
        }

        setCharacterImageUrl(parsedData.data.imageUrl);
    }, [access_token, lore]);

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
        characterAbilities: abilityScores,
        setCharacterAbilities: setAbilityScores,

        inventory,
        setInventory,

        lore,
        setLore,

        characterImageUrl,
        setCharacterImageUrl,

        generateCharacter,
        generatingCharacter,
        setGeneratingCharacter,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};
