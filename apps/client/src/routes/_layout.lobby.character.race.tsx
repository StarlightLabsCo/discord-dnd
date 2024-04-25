import { createFileRoute } from "@tanstack/react-router";

import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";

export const Route = createFileRoute("/_layout/lobby/character/race")({
    component: Race,
});

function Race() {
    const { world, draftCharacter, setDraftCharacter } =
        useCharacterEditorStore();

    if (!world || !draftCharacter) {
        return <div>Races data is undefined.</div>;
    }

    const items = Object.values(world.races).map((race) => ({
        id: race.id,
        src: race.imageUrl,
        title: race.name,
    }));

    return (
        <SelectableGrid
            items={items as SelectableGridItem[]}
            selected={draftCharacter.raceId}
            setSelected={(id) => {
                setDraftCharacter({
                    ...draftCharacter,
                    raceId: id,
                    race: world.races.find((race) => race.id == id)!,
                });
            }}
            columns={3}
        />
    );
}
