import { useState } from "react";
import { SelectableGrid } from "./SelectableGrid";

const classes = [
    {
        title: "Barbarian",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Bard",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Cleric",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Druid",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Fighter",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Monk",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Paladin",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Ranger",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Rogue",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Sorcerer",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Warlock",
        subtitle: "",
        src: "", // Image source placeholder
    },
    {
        title: "Wizard",
        subtitle: "",
        src: "", // Image source placeholder
    },
];

export function Class() {
    const [selected, setSelected] = useState(0);

    return (
        <SelectableGrid
            items={classes}
            selected={selected}
            setSelected={setSelected}
            columns={4}
        />
    );
}
