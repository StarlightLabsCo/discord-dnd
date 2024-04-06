import { createFileRoute } from "@tanstack/react-router";

import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { races } from "@/assets/images/portraits/races";
import { useCharacterContext } from "@/contexts/CharacterContext";

export const Route = createFileRoute("/lobby/character/class")({
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
        },
        {
            title: "Bard",
            subtitle: "",
            src: selectedRaceImages.bard,
        },
        {
            title: "Cleric",
            subtitle: "",
            src: selectedRaceImages.cleric,
        },
        {
            title: "Druid",
            subtitle: "",
            src: selectedRaceImages.druid,
        },
        {
            title: "Fighter",
            subtitle: "",
            src: selectedRaceImages.fighter,
        },
        {
            title: "Monk",
            subtitle: "",
            src: selectedRaceImages.monk,
        },
        {
            title: "Paladin",
            subtitle: "",
            src: selectedRaceImages.paladin,
        },
        {
            title: "Ranger",
            subtitle: "",
            src: selectedRaceImages.ranger,
        },
        {
            title: "Rogue",
            subtitle: "",
            src: selectedRaceImages.rogue,
        },
        {
            title: "Sorcerer",
            subtitle: "",
            src: selectedRaceImages.sorcerer,
        },
        {
            title: "Warlock",
            subtitle: "",
            src: selectedRaceImages.warlock,
        },
        {
            title: "Wizard",
            subtitle: "",
            src: selectedRaceImages.wizard,
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
