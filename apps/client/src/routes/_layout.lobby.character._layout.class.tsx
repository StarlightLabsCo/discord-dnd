import { createFileRoute } from "@tanstack/react-router";

import { races } from "@/game/races";
import { classes } from "@/game/classes";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { useCharacterContext } from "@/components/lobby/character/CharacterContext";

export const Route = createFileRoute("/_layout/lobby/character/_layout/class")({
    component: Class,
});

function Class() {
    const { raceId, archetypeId, setArchetypeId } = useCharacterContext();
    const selectedRaceImages =
        races[raceId as keyof typeof races].classPortraitImages;

    const items = Object.values(classes).map((characterClass) => ({
        id: characterClass.id,
        src: selectedRaceImages[characterClass.id],
        title: characterClass.title,
        subtitle: "",
    }));

    return (
        <SelectableGrid
            items={items}
            selected={archetypeId}
            setSelected={setArchetypeId}
            columns={4}
        />
    );
}