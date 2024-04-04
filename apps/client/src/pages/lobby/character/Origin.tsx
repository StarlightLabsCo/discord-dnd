import { characters } from "@/assets/images/portraits";
import { useState } from "react";
import { SelectableGrid } from "./SelectableGrid";

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
    const [selected, setSelected] = useState(0);

    return (
        <SelectableGrid
            items={originCharacters}
            selected={selected}
            setSelected={setSelected}
            columns={3}
        />
    );
}
