import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { Item } from "starlight-game-data/items";
import { AbilityScores } from "starlight-game-data/abilities";
import { CharacterLore } from "starlight-game-data/characterLore";
import { useDiscordStore } from "@/lib/discord";

interface CharacterContextType {
    originId: string;
    setOriginId: React.Dispatch<React.SetStateAction<string>>;

    raceId: string;
    setRaceId: React.Dispatch<React.SetStateAction<string>>;

    subraceId: string;
    setSubraceId: React.Dispatch<React.SetStateAction<string>>;

    archetypeId: string;
    setArchetypeId: React.Dispatch<React.SetStateAction<string>>;

    characterAbilityPoints: number;
    setCharacterAbilityPoints: React.Dispatch<React.SetStateAction<number>>;
    characterAbilities: AbilityScores;
    setCharacterAbilities: React.Dispatch<React.SetStateAction<AbilityScores>>;

    inventory: Item[];
    setInventory: React.Dispatch<React.SetStateAction<Item[]>>;

    lore: CharacterLore;
    setLore: React.Dispatch<React.SetStateAction<CharacterLore>>;

    generateCharacter: () => Promise<void>;
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
    const [archetypeId, setArchetypeId] = useState<string>("rogue");

    const [characterAbilityPoints, setCharacterAbilityPoints] =
        useState<number>(27);
    const [characterAbilities, setCharacterAbilities] = useState<AbilityScores>(
        {
            strength: 8,
            dexterity: 8,
            constitution: 8,
            intelligence: 8,
            wisdom: 8,
            charisma: 8,
        }
    );

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

    const access_token = useDiscordStore.getState().auth?.access_token;
    const generateCharacter = useCallback(async () => {
        const response = await fetch("/api/character/generate", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                raceId,
                archetypeId,
                characterAbilities,
                lore,
            }),
        });

        const data = await response.json();

        console.log(data);
    }, [access_token, lore]);

    const value = {
        originId,
        setOriginId,

        raceId,
        setRaceId,

        subraceId,
        setSubraceId,

        archetypeId,
        setArchetypeId,

        characterAbilityPoints,
        setCharacterAbilityPoints,
        characterAbilities,
        setCharacterAbilities,

        inventory,
        setInventory,

        lore,
        setLore,

        generateCharacter,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};
