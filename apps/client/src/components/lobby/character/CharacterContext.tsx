import { createContext, useContext, useState, ReactNode } from "react";
import { AbilityScores } from "@/game/abilities";

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
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
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

    const [background, setBackground] = useState<string>("");

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
        background,
        setBackground,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};
