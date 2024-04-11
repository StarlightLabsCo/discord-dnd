import { createFileRoute } from "@tanstack/react-router";

import { races } from "starlight-game-data/races";
import { classes } from "starlight-game-data/classes";
import { useCharacterStore } from "@/lib/game/character";
import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/_layout/lobby/character/_layout/class")({
    component: Class,
});

function Class() {
    const { raceId, classId, setClassId } = useCharacterStore();
    const selectedRaceImages =
        races[raceId as keyof typeof races].classPortraitImages;

    const items = Object.values(classes).map((characterClass) => ({
        id: characterClass.id,
        src: selectedRaceImages[characterClass.id!],
        title: characterClass.title,
    }));

    return (
        <SelectableGrid
            items={items as SelectableGridItem[]}
            selected={classId}
            setSelected={setClassId}
            columns={4}
        />
    );
}
