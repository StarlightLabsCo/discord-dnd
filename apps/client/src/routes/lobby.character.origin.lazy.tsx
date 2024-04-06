import { useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { characters } from "@/assets/images/portraits";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";

export const Route = createLazyFileRoute("/lobby/character/origin")({
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
    const [selected, setSelected] = useState<number>(0); // TODO: change to lobby store

    return (
        <SelectableGrid
            items={originCharacters}
            selected={selected}
            setSelected={setSelected}
            columns={3}
        />
    );
}
