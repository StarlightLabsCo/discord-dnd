import { useState } from "react";
import { SelectableGrid } from "./SelectableGrid";

import { raceImages } from "@/assets/images/portraits/races";

const races = [
    {
        src: raceImages.human,
        title: "Human",
        subtitle: "",
    },
    {
        src: raceImages.elf,
        title: "Elf",
        subtitle: "",
    },
    {
        src: raceImages.halfElf,
        title: "Half-Elf",
        subtitle: "",
    },
    {
        src: raceImages.dragonborn,
        title: "Dragonborn",
        subtitle: "",
    },
    {
        src: raceImages.dwarf,
        title: "Dwarf",
        subtitle: "",
    },
    {
        src: raceImages.gnome,
        title: "Gnome",
        subtitle: "",
    },
    {
        src: raceImages.halfling,
        title: "Halfling",
        subtitle: "",
    },
    {
        src: raceImages.halfOrc,
        title: "Half-Orc",
        subtitle: "",
    },
    {
        src: raceImages.tiefling,
        title: "Tiefling",
        subtitle: "",
    },
];

export function Race() {
    const [selected, setSelected] = useState(0);

    return (
        <SelectableGrid
            items={races}
            selected={selected}
            setSelected={setSelected}
            columns={3}
        />
    );
}
