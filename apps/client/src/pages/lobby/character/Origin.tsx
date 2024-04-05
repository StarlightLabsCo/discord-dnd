import { characters } from "@/assets/images/portraits";
import { SelectableGrid } from "./SelectableGrid";
import { useGameStore } from "@/game";

// TODO: fetch these characters from the server
const originCharacters = [
    {
        src: characters[0],
        title: "George",
        subtitle: "Half-Elf / Half-Human",
    },
    {
        src: characters[1],
        title: "Luna",
        subtitle: "Human Sorcerer",
    },
    {
        src: characters[2],
        title: "Thorn",
        subtitle: "Wood Elf Ranger",
    },
    {
        src: characters[3],
        title: "Mira",
        subtitle: "Tiefling Rogue",
    },
    {
        src: characters[4],
        title: "Darius",
        subtitle: "Dragonborn Paladin",
    },
    {
        src: characters[5],
        title: "Custom",
        subtitle: "",
    },
];

export function Origin() {
    const selected = useGameStore((state) => state.character.origin);
    const setSelected = (index: number) => {
        useGameStore.setState({
            character: { ...useGameStore.getState().character, origin: index },
        });
    };

    return (
        <SelectableGrid
            items={originCharacters}
            selected={selected}
            setSelected={setSelected}
            columns={3}
        />
    );
}
