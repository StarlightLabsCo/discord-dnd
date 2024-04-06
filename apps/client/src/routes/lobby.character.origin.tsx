import { createFileRoute } from "@tanstack/react-router";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { characters } from "@/assets/images/portraits";

export const Route = createFileRoute("/lobby/character/origin")({
    component: Origin,
});

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

function Origin() {
    const { origin, setOrigin } = useCharacterContext();

    return (
        <SelectableGrid
            items={originCharacters}
            selected={origin}
            setSelected={setOrigin}
            columns={3}
        />
    );
}
