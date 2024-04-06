import React, { createContext, useContext, useState, ReactNode } from "react";

interface CharacterContextType {
    origin: string;
    setOrigin: React.Dispatch<React.SetStateAction<string>>;
    race: string;
    setRace: React.Dispatch<React.SetStateAction<string>>;
    subrace: string;
    setSubrace: React.Dispatch<React.SetStateAction<string>>;
    archetype: string;
    setArchetype: React.Dispatch<React.SetStateAction<string>>;
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
    const [origin, setOrigin] = useState<string>("Custom");
    const [race, setRace] = useState<string>("Dwarf");
    const [subrace, setSubrace] = useState<string>("Hill Dwarf");
    const [archetype, setArchetype] = useState<string>("Rogue");
    const [background, setBackground] = useState<string>("");

    const value = {
        origin,
        setOrigin,
        race,
        setRace,
        subrace,
        setSubrace,
        archetype,
        setArchetype,
        background,
        setBackground,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};
