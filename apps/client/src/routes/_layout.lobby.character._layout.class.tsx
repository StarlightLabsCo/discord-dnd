import { createFileRoute } from "@tanstack/react-router";

import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { races } from "@/assets/images/portraits/races";
import { useCharacterContext } from "@/contexts/CharacterContext";

export const Route = createFileRoute("/_layout/lobby/character/_layout/class")({
    component: Class,
});

function Class() {
    const { race, archetype, setArchetype } = useCharacterContext();
    const selectedRaceImages = races[race as keyof typeof races].classes;

    const classes = [
        {
            title: "Barbarian",
            subtitle: "",
            src: selectedRaceImages.barbarian,
            value: "barbarian",
        },
        {
            title: "Bard",
            subtitle: "",
            src: selectedRaceImages.bard,
            value: "bard",
        },
        {
            title: "Cleric",
            subtitle: "",
            src: selectedRaceImages.cleric,
            value: "cleric",
        },
        {
            title: "Druid",
            subtitle: "",
            src: selectedRaceImages.druid,
            value: "druid",
        },
        {
            title: "Fighter",
            subtitle: "",
            src: selectedRaceImages.fighter,
            value: "fighter",
        },
        {
            title: "Monk",
            subtitle: "",
            src: selectedRaceImages.monk,
            value: "monk",
        },
        {
            title: "Paladin",
            subtitle: "",
            src: selectedRaceImages.paladin,
            value: "paladin",
        },
        {
            title: "Ranger",
            subtitle: "",
            src: selectedRaceImages.ranger,
            value: "ranger",
        },
        {
            title: "Rogue",
            subtitle: "",
            src: selectedRaceImages.rogue,
            value: "rogue",
        },
        {
            title: "Sorcerer",
            subtitle: "",
            src: selectedRaceImages.sorcerer,
            value: "sorcerer",
        },
        {
            title: "Warlock",
            subtitle: "",
            src: selectedRaceImages.warlock,
            value: "warlock",
        },
        {
            title: "Wizard",
            subtitle: "",
            src: selectedRaceImages.wizard,
            value: "wizard",
        },
    ];

    return (
        <SelectableGrid
            items={classes}
            selected={archetype}
            setSelected={setArchetype}
            columns={4}
        />
    );
}
