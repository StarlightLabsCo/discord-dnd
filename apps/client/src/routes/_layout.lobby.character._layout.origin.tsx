import { createFileRoute } from "@tanstack/react-router";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { characters } from "@/assets/images/portraits";

export const Route = createFileRoute("/_layout/lobby/character/_layout/origin")(
    {
        component: Origin,
    }
);

// TODO: fetch these characters from the server
const originCharacters = [
    {
        src: characters[0],
        title: "George",
        subtitle: "Half-Elf / Half-Human",
        value: "george",
    },
    {
        src: characters[1],
        title: "Luna",
        subtitle: "Human Sorcerer",
        value: "luna",
    },
    {
        src: characters[2],
        title: "Thorn",
        subtitle: "Wood Elf Ranger",
        value: "thorn",
    },
    {
        src: characters[3],
        title: "Mira",
        subtitle: "Tiefling Rogue",
        value: "mira",
    },
    {
        src: characters[4],
        title: "Darius",
        subtitle: "Dragonborn Paladin",
        value: "darius",
    },
    {
        src: characters[5],
        title: "Custom",
        subtitle: "",
        value: "custom",
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
